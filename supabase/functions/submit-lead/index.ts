import { corsHeaders } from '@supabase/supabase-js/cors'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const GOOGLE_SHEETS_WEBHOOK_URL = Deno.env.get('GOOGLE_SHEETS_WEBHOOK_URL')
    if (!GOOGLE_SHEETS_WEBHOOK_URL) {
      throw new Error('GOOGLE_SHEETS_WEBHOOK_URL is not configured')
    }

    const body = await req.json()

    // Validate required fields
    const { name, mobile, email, city, isMetro, bua, bedrooms, bathrooms, selectedPackage, totalCost, otherRequirements } = body
    if (!name || !mobile || !city) {
      return new Response(JSON.stringify({ error: 'Missing required fields: name, mobile, city' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Forward to Google Apps Script
    const response = await fetch(GOOGLE_SHEETS_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        timestamp: new Date().toISOString(),
        name,
        mobile,
        email: email || '',
        city,
        locationType: isMetro ? 'Metro' : 'Non-Metro',
        bua: bua || 0,
        bedrooms: bedrooms || 0,
        bathrooms: bathrooms || 0,
        selectedPackage: selectedPackage || '',
        totalCost: totalCost || 0,
        otherRequirements: otherRequirements || '',
        source: 'HomesutraPro Construction Wallet',
      }),
    })

    if (!response.ok) {
      const errText = await response.text()
      throw new Error(`Google Sheets API failed [${response.status}]: ${errText}`)
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error: unknown) {
    console.error('Error submitting lead:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return new Response(JSON.stringify({ success: false, error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
