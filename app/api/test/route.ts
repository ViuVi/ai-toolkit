import { NextRequest, NextResponse } from 'next/server'

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'
const GROQ_MODEL = 'llama-3.3-70b-versatile'

export async function POST(request: NextRequest) {
  console.log('=== TEST API CALLED ===')
  
  try {
    const body = await request.json()
    console.log('Request body:', body)
    
    const apiKey = process.env.GROQ_API_KEY
    console.log('API Key exists:', !!apiKey)
    console.log('API Key prefix:', apiKey?.substring(0, 10))
    
    if (!apiKey) {
      return NextResponse.json({ 
        error: 'GROQ_API_KEY not configured',
        step: 'api_key_check'
      }, { status: 500 })
    }

    const groqResponse = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [
          { role: 'system', content: 'Sen yardımcı bir asistansın. Kısa ve öz cevap ver. JSON formatında yanıt ver: {"message": "yanıtın"}' },
          { role: 'user', content: body.test || 'Merhaba, test mesajı' }
        ],
        temperature: 0.7,
        max_tokens: 500,
        response_format: { type: 'json_object' }
      })
    })

    console.log('Groq response status:', groqResponse.status)

    if (!groqResponse.ok) {
      const errorText = await groqResponse.text()
      console.error('Groq error:', errorText)
      return NextResponse.json({ 
        error: 'Groq API error',
        status: groqResponse.status,
        details: errorText,
        step: 'groq_call'
      }, { status: 500 })
    }

    const groqData = await groqResponse.json()
    console.log('Groq data:', JSON.stringify(groqData, null, 2))
    
    const content = groqData.choices?.[0]?.message?.content
    console.log('Content:', content)

    if (!content) {
      return NextResponse.json({ 
        error: 'Empty response from Groq',
        groqData,
        step: 'parse_response'
      }, { status: 500 })
    }

    let parsed
    try {
      parsed = JSON.parse(content)
    } catch (e) {
      parsed = { text: content }
    }

    return NextResponse.json({ 
      success: true,
      result: parsed,
      debug: {
        model: GROQ_MODEL,
        contentLength: content.length
      }
    })

  } catch (error: any) {
    console.error('Test API Error:', error)
    return NextResponse.json({ 
      error: error.message,
      stack: error.stack,
      step: 'catch_block'
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ 
    status: 'Test API is working',
    timestamp: new Date().toISOString()
  })
}
