
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

// Only use secrets—credentials never hardcoded!
const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
const supabase = createClient(supabaseUrl, supabaseServiceKey)

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

  let payload
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

    // Fetch credentials for Lynk (should be stored securely, not on frontend)
    const { data: credentials, error: credentialsError } = await supabase
      .from('merchant_api_credentials')
      .select(`
        lynk_client_id, lynk_client_secret, lynk_account_id, lynk_api_url, lynk_notification_url, lynk_enabled
      `)
      .eq('merchant_id', payload.merchantId)
      .single()

    if (credentialsError || !credentials || !credentials.lynk_enabled) {
      return new Response(
        JSON.stringify({ error: 'Lynk API is not enabled or credentials missing.' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Token management (for demo, no persistent cache)
    async function fetchAccessToken() {
      const tokenRes = await fetch('https://auth.beta.lynk.us/oauth/token', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          client_id: credentials.lynk_client_id,
          client_secret: credentials.lynk_client_secret,
          audience: 'https://api.core-nautilus.net/payment_orders',
          grant_type: 'client_credentials',
        }),
      })
      const tokenData = await tokenRes.json()
      if (!tokenData.access_token) throw new Error(tokenData.error_description || 'Lynk token error')
      return tokenData.access_token
    }

    const baseUrl = credentials.lynk_api_url || 'https://non-prod-api.lynk.us/online_payments/beta_1'

    let lynkResponse, externalOrderId
    let endpoint = payload.endpoint || 'payment-orders'
    let method = payload.apiMethod || 'POST'

    externalOrderId = payload.data?.external_order_id

    // Build the request for payment-orders or other Lynk endpoints
    let apiUrl = `${baseUrl}/v1/${endpoint}`
    if (payload.m_order_id) apiUrl += '/' + payload.m_order_id

    const accessToken = await fetchAccessToken()

    // Prepare headers and body for Lynk API request
    let lynkHeaders = {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    }

    let lynkReq: RequestInit = {
      method,
      headers: lynkHeaders,
    }

    if (method !== 'GET') {
      lynkReq.body = JSON.stringify({
        ...payload.data,
        account_id: credentials.lynk_account_id,
        notification_url:
          credentials.lynk_notification_url || 'https://example.com/api/payment-notification'
      })
    }

    LynkResponseLog:
    {
      let apiRes = await fetch(apiUrl, lynkReq)
      lynkResponse = await apiRes.json()

      // Audit logging
      await supabase
        .from('integration_logs')
        .insert({
          merchant_id: payload.merchantId,
          service: 'lynk',
          endpoint: endpoint,
          status_code: apiRes.status,
          success: apiRes.ok,
          request_id: crypto.randomUUID(),
          response_data: lynkResponse
        })
      if (!apiRes.ok) {
        return new Response(
          JSON.stringify({ error: lynkResponse.error_message || "Lynk API error", details: lynkResponse }),
          { status: apiRes.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    }

    return new Response(JSON.stringify(lynkResponse), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Error in lynk-proxy:', error)
    await supabase
      .from('integration_logs')
      .insert({
        merchant_id: payload?.merchantId,
        service: 'lynk',
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
