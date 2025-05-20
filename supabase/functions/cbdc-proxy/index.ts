
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Rate limiting
const rateLimiter = {
  requests: new Map(),
  limit: 60,
  interval: 60000,
  check: function(ip: string): boolean {
    const now = Date.now()
    const userRequests = this.requests.get(ip) || { count: 0, resetTime: now + this.interval }
    if (now > userRequests.resetTime) {
      userRequests.count = 1
      userRequests.resetTime = now + this.interval
      this.requests.set(ip, userRequests)
      return true
    }
    if (userRequests.count < this.limit) {
      userRequests.count++
      this.requests.set(ip, userRequests)
      return true
    }
    return false
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  let payload;
  const clientIP = req.headers.get("x-forwarded-for") || "unknown"

  try {
    if (!rateLimiter.check(clientIP)) {
      return new Response(
        JSON.stringify({ error: 'Too many requests', code: 'rate_limit_exceeded' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    try {
      payload = await req.json()
    } catch (e) {
      return new Response(
        JSON.stringify({ error: 'Invalid request body' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!payload.merchantId) {
      return new Response(
        JSON.stringify({ error: 'Merchant ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Fetch credentials and wallet support
    const { data: credentials, error: credentialsError } = await supabase
      .from('merchant_api_credentials')
      .select(`
        cbdc_username, cbdc_password, cbdc_api_url,
        apple_pay_enabled, google_pay_enabled
      `)
      .eq('merchant_id', payload.merchantId)
      .single()

    if (credentialsError || !credentials) {
      console.error('Error fetching merchant credentials:', credentialsError)
      return new Response(
        JSON.stringify({ error: 'Merchant credentials not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Endpoint routing, with possible Apple/Google Pay
    let endpoint: string;
    if (payload.endpoint) {
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
    const apiUrl = credentials.cbdc_api_url || 'https://api.emtech-cbdc.com/v1'
    const remoteEndpoint = `${apiUrl}/${endpoint}`

    const authHeaders = {
      'Authorization': `Basic ${btoa(`${credentials.cbdc_username}:${credentials.cbdc_password}`)}`,
      'Content-Type': 'application/json'
    }

    // Forward the request to the CBDC API
    const response = await fetch(remoteEndpoint, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify(payload.data || {})
    })

    const responseData = await response.json()

    await supabase
      .from('integration_logs')
      .insert({
        merchant_id: payload.merchantId,
        service: 'cbdc',
        endpoint,
        status_code: response.status,
        success: response.ok,
        request_id: crypto.randomUUID(),
        response_data: responseData
      })

    return new Response(
      JSON.stringify(responseData),
      { 
        status: response.status, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  } catch (error) {
    console.error('Error processing cbdc-proxy:', error)
    await supabase
      .from('integration_logs')
      .insert({
        merchant_id: payload?.merchantId,
        service: 'cbdc',
        endpoint: payload?.endpoint || 'unknown',
        status_code: 500,
        success: false,
        request_id: crypto.randomUUID(),
        error_message: error.message || String(error)
      })

    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
