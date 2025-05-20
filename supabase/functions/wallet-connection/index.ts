
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseServiceKey)

Deno.serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    let payload
    try {
      payload = await req.json()
    } catch (e) {
      return new Response(
        JSON.stringify({ error: 'Invalid request body' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { action, merchantId, walletType, walletId, deviceId } = payload

    if (!merchantId || !action) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    
    // Handle different wallet operations
    switch (action) {
      case 'register': {
        if (!walletType || !walletId || !deviceId) {
          return new Response(
            JSON.stringify({ error: 'Missing wallet registration parameters' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }
        
        // Register wallet with merchant
        const { data, error } = await supabase
          .from('merchant_wallets')
          .insert({
            merchant_id: merchantId,
            wallet_type: walletType, // 'apple_pay', 'google_pay', etc.
            wallet_id: walletId,
            device_id: deviceId,
            status: 'active'
          })
          .select()
          .single()
          
        if (error) {
          console.error('Error registering wallet:', error)
          return new Response(
            JSON.stringify({ error: 'Failed to register wallet' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }
        
        return new Response(
          JSON.stringify({ success: true, wallet: data }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
      
      case 'validate': {
        if (!walletId) {
          return new Response(
            JSON.stringify({ error: 'Missing wallet ID' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }
        
        // Validate if the wallet is registered and active
        const { data, error } = await supabase
          .from('merchant_wallets')
          .select('*')
          .eq('merchant_id', merchantId)
          .eq('wallet_id', walletId)
          .eq('status', 'active')
          .maybeSingle()
          
        if (error) {
          console.error('Error validating wallet:', error)
          return new Response(
            JSON.stringify({ error: 'Failed to validate wallet' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }
        
        return new Response(
          JSON.stringify({ valid: !!data, wallet: data }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
      
      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
  } catch (error) {
    console.error('Error processing request:', error)
    
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
