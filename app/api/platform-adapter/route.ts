import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { content, userId } = await request.json()

    if (!content) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 })
    }

    // Kredi kontrolü
    if (userId) {
      const { data: credits } = await supabase
        .from('credits')
        .select('balance, total_used')
        .eq('user_id', userId)
        .single()

      if (!credits || credits.balance < 3) {
        return NextResponse.json({ error: 'Insufficient credits' }, { status: 403 })
      }
    }

    console.log('🔄 Adapting content to platforms...')

    // Önce içeriği özetle
    const summaryResponse = await fetch(
      'https://router.huggingface.co/hf-inference/models/facebook/bart-large-cnn',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: content.substring(0, 1500),
          parameters: { max_length: 100, min_length: 30 },
        }),
      }
    )

    const summaryResult = await summaryResponse.json()
    const summary = summaryResult[0]?.summary_text || content.substring(0, 200)

    // Platform versiyonları oluştur
    const platforms = {
      instagram: generateInstagram(content, summary),
      linkedin: generateLinkedIn(content, summary),
      twitter: generateTwitter(content, summary),
      tiktok: generateTikTok(content, summary),
    }

    // Kredi düşür
    if (userId) {
      const { data: currentCredits } = await supabase
        .from('credits')
        .select('balance, total_used')
        .eq('user_id', userId)
        .single()

      if (currentCredits) {
        await supabase
          .from('credits')
          .update({
            balance: currentCredits.balance - 3,
            total_used: currentCredits.total_used + 3,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId)

        await supabase
          .from('usage_history')
          .insert({
            user_id: userId,
            tool_name: 'platform-adapter',
            tool_display_name: 'Platform Adapter',
            credits_used: 3,
            input_preview: content.substring(0, 200),
            output_preview: '4 platform versions generated',
          })
      }
    }

    return NextResponse.json({ platforms, summary })

  } catch (error) {
    console.log('❌ Error:', error)
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 })
  }
}

function generateInstagram(content: string, summary: string): string {
  const hashtags = extractHashtags(content)
  const emojis = ['✨', '🔥', '💡', '🚀', '💪', '🎯', '⭐', '💯']
  const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)]
  
  return `${randomEmoji} ${summary}

${getKeyPoints(content)}

💬 What do you think? Drop a comment below!

${hashtags}

#contentcreator #socialmedia #growthmindset`
}

function generateLinkedIn(content: string, summary: string): string {
  return `${summary}

Here's what I've learned:

${getKeyPoints(content)}

The key takeaway? ${getConclusion(content)}

What's your experience with this? I'd love to hear your thoughts in the comments.

---
♻️ Repost if this resonates with you
🔔 Follow for more insights`
}

function generateTwitter(content: string, summary: string): string {
  const shortSummary = summary.length > 200 ? summary.substring(0, 197) + '...' : summary
  
  return `🧵 Thread:

${shortSummary}

1/ ${getFirstPoint(content)}

2/ ${getSecondPoint(content)}

3/ ${getThirdPoint(content)}

Like & repost if you found this useful! 🔄`
}

function generateTikTok(content: string, summary: string): string {
  return `🎬 TIKTOK SCRIPT:

[HOOK - First 3 seconds]
"Did you know that ${getHook(content)}?"

[MAIN CONTENT]
${getBulletPoints(content)}

[CALL TO ACTION]
"Follow for more tips like this! And comment below with your thoughts."

[CAPTION]
${summary.substring(0, 100)}... #fyp #viral #tips`
}

function extractHashtags(content: string): string {
  const words = content.toLowerCase().split(/\s+/)
  const commonWords = ['the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'shall', 'can', 'need', 'dare', 'ought', 'used', 'to', 'of', 'in', 'for', 'on', 'with', 'at', 'by', 'from', 'as', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'between', 'under', 'again', 'further', 'then', 'once', 'here', 'there', 'when', 'where', 'why', 'how', 'all', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 'just', 'and', 'but', 'if', 'or', 'because', 'until', 'while', 'this', 'that', 'these', 'those', 'what', 'which', 'who', 'whom', 'whose', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them', 'my', 'your', 'his', 'its', 'our', 'their']
  
  const keywords = words
    .filter(word => word.length > 4 && !commonWords.includes(word))
    .filter((word, index, self) => self.indexOf(word) === index)
    .slice(0, 5)
    .map(word => `#${word.replace(/[^a-z]/g, '')}`)
  
  return keywords.join(' ')
}

function getKeyPoints(content: string): string {
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 20).slice(0, 3)
  return sentences.map(s => `→ ${s.trim()}`).join('\n')
}

function getConclusion(content: string): string {
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 10)
  return sentences[sentences.length - 1]?.trim() || 'Action leads to results.'
}

function getFirstPoint(content: string): string {
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 20)
  return sentences[0]?.trim().substring(0, 250) || 'Key insight here'
}

function getSecondPoint(content: string): string {
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 20)
  return sentences[1]?.trim().substring(0, 250) || 'Another important point'
}

function getThirdPoint(content: string): string {
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 20)
  return sentences[2]?.trim().substring(0, 250) || 'Final thought'
}

function getHook(content: string): string {
  const firstSentence = content.split(/[.!?]+/)[0]?.trim()
  return firstSentence?.substring(0, 100) || 'this simple trick can change everything'
}

function getBulletPoints(content: string): string {
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 15).slice(0, 4)
  return sentences.map((s, i) => `${i + 1}. ${s.trim()}`).join('\n')
}