import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const PLATFORMS: Record<string, { name: string; maxChars: number; style: string }> = {
  instagram: { name: 'Instagram', maxChars: 2200, style: 'visual, emoji-friendly, storytelling' },
  twitter: { name: 'Twitter/X', maxChars: 280, style: 'concise, punchy, witty' },
  linkedin: { name: 'LinkedIn', maxChars: 3000, style: 'professional, insightful, value-driven' },
  tiktok: { name: 'TikTok', maxChars: 2200, style: 'trendy, casual, hook-focused' },
  facebook: { name: 'Facebook', maxChars: 5000, style: 'conversational, community-focused' },
  youtube: { name: 'YouTube', maxChars: 5000, style: 'SEO-optimized, descriptive' }
}

export async function POST(request: NextRequest) {
  try {
    const { content, targetPlatforms, userId, language = 'en' } = await request.json()

    if (!content || !targetPlatforms?.length) {
      return NextResponse.json({ error: language === 'tr' ? 'İçerik ve platform gerekli' : 'Content and platforms required' }, { status: 400 })
    }

    if (userId) {
      const { data: credits } = await supabase.from('credits').select('balance').eq('user_id', userId).single()
      if (!credits || credits.balance < 3) {
        return NextResponse.json({ error: language === 'tr' ? 'Yetersiz kredi' : 'Insufficient credits' }, { status: 403 })
      }
    }

    const adaptations = await adaptContent(content, targetPlatforms, language)

    if (userId) {
      const { data: c } = await supabase.from('credits').select('balance, total_used').eq('user_id', userId).single()
      if (c) {
        await supabase.from('credits').update({ balance: c.balance - 3, total_used: c.total_used + 3, updated_at: new Date().toISOString() }).eq('user_id', userId)
      }
    }

    return NextResponse.json({ adaptations })
  } catch (error) {
    console.error('Platform Adapter Error:', error)
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 })
  }
}

async function adaptContent(content: string, targetPlatforms: string[], language: string) {
  const results = []

  for (const platform of targetPlatforms) {
    const spec = PLATFORMS[platform]
    if (!spec) continue

    const prompt = language === 'tr'
      ? `Bu içeriği ${spec.name} için uyarla. Stil: ${spec.style}. Max ${spec.maxChars} karakter. Sadece uyarlanmış metni yaz:\n\n"${content}"`
      : `Adapt this content for ${spec.name}. Style: ${spec.style}. Max ${spec.maxChars} chars. Only write the adapted text:\n\n"${content}"`

    let adaptedContent = ''

    try {
      const response = await fetch('https://api-inference.huggingface.co/models/Qwen/Qwen2.5-72B-Instruct', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: { max_new_tokens: 400, temperature: 0.7, return_full_text: false }
        }),
      })

      if (response.ok) {
        const result = await response.json()
        adaptedContent = (result[0]?.generated_text || '').replace(/```[\s\S]*?```/g, '').replace(/^["']|["']$/g, '').trim()
      }
    } catch (e) { console.error('AI Error:', e) }

    if (!adaptedContent || adaptedContent.length < 10) {
      adaptedContent = adaptFallback(content, platform, spec, language)
    }

    if (adaptedContent.length > spec.maxChars) {
      adaptedContent = adaptedContent.substring(0, spec.maxChars - 3) + '...'
    }

    results.push({
      platform,
      platformName: spec.name,
      content: adaptedContent,
      characterCount: adaptedContent.length,
      maxCharacters: spec.maxChars
    })
  }

  return results
}

function adaptFallback(content: string, platform: string, spec: any, language: string) {
  const short = content.length > 200 ? content.substring(0, 200) + '...' : content
  
  const templates: Record<string, Record<string, string>> = {
    twitter: { tr: `💡 ${short.substring(0, 250)}`, en: `💡 ${short.substring(0, 250)}` },
    instagram: { tr: `✨ ${content}\n\n💬 Yorumlarda buluşalım!\n\n#içerik #keşfet`, en: `✨ ${content}\n\n💬 Let me know in comments!\n\n#content #explore` },
    linkedin: { tr: `${content}\n\nSiz ne düşünüyorsunuz? 👇\n\n#kariyer #gelişim`, en: `${content}\n\nWhat are your thoughts? 👇\n\n#career #growth` },
    tiktok: { tr: `🔥 ${short} #fyp #viral`, en: `🔥 ${short} #fyp #viral` },
    facebook: { tr: `${content}\n\n👍 Beğen ve paylaş!`, en: `${content}\n\n👍 Like and share!` },
    youtube: { tr: `${content}\n\n🔔 Abone olmayı unutma!`, en: `${content}\n\n🔔 Don't forget to subscribe!` }
  }

  return templates[platform]?.[language] || templates[platform]?.en || content
}
