
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Rate limiting setup
const rateLimiter = {
  requests: new Map(),
  limit: 60,
  interval: 60000,
  check: function(ip: string): boolean {
    const now = Date.now();
    const userRequests = this.requests.get(ip) || { count: 0, resetTime: now + this.interval };
    if (now > userRequests.resetTime) {
      userRequests.count = 1;
      userRequests.resetTime = now + this.interval;
      this.requests.set(ip, userRequests);
      return true;
    }
    if (userRequests.count < this.limit) {
      userRequests.count++;
      this.requests.set(ip, userRequests);
      return true;
    }
    return false;
  }
};

Deno.serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  let payload;
  const clientIP = req.headers.get("x-forwarded-for") || "unknown";

  try {
    // Rate limit check
    if (!rateLimiter.check(clientIP)) {
      return new Response(
        JSON.stringify({ error: "Too many requests", code: "rate_limit_exceeded" }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    try {
      payload = await req.json();
    } catch (err) {
      return new Response(
        JSON.stringify({ error: "Invalid request body" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!payload.merchantId) {
      return new Response(
        JSON.stringify({ error: "Merchant ID is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fetch credentials including Apple/Google pay support if any
    const { data: credentials, error: credentialsError } = await supabase
      .from("merchant_api_credentials")
      .select(`
        fasstap_username, fasstap_password, fasstap_api_url,
        apple_pay_enabled, google_pay_enabled
      `)
      .eq("merchant_id", payload.merchantId)
      .single();

    if (credentialsError || !credentials) {
      console.error("Error fetching merchant credentials:", credentialsError);
      return new Response(
        JSON.stringify({ error: "Merchant credentials not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Determine endpoint for Apple Pay and Google Pay support
    let endpoint: string;
    if (payload.endpoint) {
      // Handle Apple/Google Pay endpoints as needed
      if (payload.endpoint === "apple-pay" && !credentials.apple_pay_enabled) {
        return new Response(
          JSON.stringify({ error: "Apple Pay not enabled" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (payload.endpoint === "google-pay" && !credentials.google_pay_enabled) {
        return new Response(
          JSON.stringify({ error: "Google Pay not enabled" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      endpoint = payload.endpoint;
    } else {
      endpoint = "payments";
    }

    // Build remote URL
    const apiUrl = credentials.fasstap_api_url || 'https://api.fasstap.com/v1';
    const remoteEndpoint = `${apiUrl}/${endpoint}`;

    // Prepare authentication
    const authHeaders = {
      "Authorization": `Basic ${btoa(`${credentials.fasstap_username}:${credentials.fasstap_password}`)}`,
      "Content-Type": "application/json"
    };

    // Proxy the request to the Fasstap API
    const extRes = await fetch(remoteEndpoint, {
      method: "POST",
      headers: authHeaders,
      body: JSON.stringify(payload.data || {})
    });

    const responseData = await extRes.json();

    // Audit log for integration
    await supabase.from("integration_logs").insert({
      merchant_id: payload.merchantId,
      service: "fasstap",
      endpoint,
      status_code: extRes.status,
      success: extRes.ok,
      request_id: crypto.randomUUID(),
      response_data: responseData
    });

    return new Response(JSON.stringify(responseData), {
      status: extRes.status,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error processing Fasstap proxy:", error);
    // Error log
    await supabase.from("integration_logs").insert({
      merchant_id: payload?.merchantId,
      service: "fasstap",
      endpoint: payload?.endpoint || "unknown",
      status_code: 500,
      success: false,
      request_id: crypto.randomUUID(),
      error_message: error.message || String(error)
    });
    return new Response(
      JSON.stringify({ error: "Internal server error", details: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
