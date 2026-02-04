import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { message, userId } = await request.json()

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    // Kredi kontrolü
    if (userId) {
      const { data: credits } = await supabase
        .from('credits')
        .select('balance, total_used')
        .eq('user_id', userId)
        .single()

      if (!credits || credits.balance < 2) {
        return NextResponse.json({ error: 'Insufficient credits' }, { status: 403 })
      }
    }

    console.log('💬 Adjusting tones...')

    // Tüm tonları oluştur
    const tones = generateAllTones(message)

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
            balance: currentCredits.balance - 2,
            total_used: currentCredits.total_used + 2,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId)

        await supabase
          .from('usage_history')
          .insert({
            user_id: userId,
            tool_name: 'tone-adjuster',
            tool_display_name: 'Tone Adjuster',
            credits_used: 2,
            input_preview: message.substring(0, 200),
            output_preview: '5 tone variations generated',
          })
      }
    }

    return NextResponse.json({ tones })

  } catch (error) {
    console.log('❌ Error:', error)
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 })
  }
}

function generateAllTones(message: string): Array<{tone: string, emoji: string, text: string, bestFor: string}> {
  return [
    {
      tone: 'professional',
      emoji: '👔',
      text: transformToProfessional(message),
      bestFor: 'Business emails, formal requests, corporate communication'
    },
    {
      tone: 'friendly',
      emoji: '😊',
      text: transformToFriendly(message),
      bestFor: 'Casual conversations, social media, friendly outreach'
    },
    {
      tone: 'persuasive',
      emoji: '💪',
      text: transformToPersuasive(message),
      bestFor: 'Sales pitches, proposals, convincing someone'
    },
    {
      tone: 'empathetic',
      emoji: '💝',
      text: transformToEmpathetic(message),
      bestFor: 'Customer support, apologies, sensitive topics'
    },
    {
      tone: 'confident',
      emoji: '🎯',
      text: transformToConfident(message),
      bestFor: 'Leadership communication, announcements, assertive requests'
    },
  ]
}

function transformToProfessional(message: string): string {
  // Basit profesyonel dönüşüm
  let result = message
    .replace(/hey|hi there|yo/gi, 'Dear Sir/Madam')
    .replace(/thanks|thx/gi, 'Thank you')
    .replace(/gonna|wanna|gotta/gi, (match) => {
      if (match.toLowerCase() === 'gonna') return 'going to'
      if (match.toLowerCase() === 'wanna') return 'want to'
      if (match.toLowerCase() === 'gotta') return 'have to'
      return match
    })
    .replace(/!/g, '.')
    .replace(/\?\?+/g, '?')

  if (!result.endsWith('.') && !result.endsWith('?') && !result.endsWith('!')) {
    result += '.'
  }

  return `I hope this message finds you well.\n\n${result}\n\nPlease do not hesitate to contact me should you require any further information.\n\nBest regards`
}

function transformToFriendly(message: string): string {
  const greetings = ['Hey!', 'Hi there! 👋', 'Hello!']
  const greeting = greetings[Math.floor(Math.random() * greetings.length)]
  
  let result = message
    .replace(/Dear Sir\/Madam|To whom it may concern/gi, 'Hey there')
    .replace(/Best regards|Sincerely/gi, 'Cheers')
  
  return `${greeting}\n\n${result} 😊\n\nTalk soon!`
}

function transformToPersuasive(message: string): string {
  return `Here's the thing...\n\n${message}\n\nThink about it - this could be exactly what you need. The opportunity is here, right now. Don't let it slip away.\n\nAre you ready to take the next step?`
}

function transformToEmpathetic(message: string): string {
  return `I completely understand where you're coming from.\n\n${message}\n\nI want you to know that your feelings are valid, and I'm here to help in any way I can. Let's work through this together.\n\nPlease don't hesitate to share anything else on your mind.`
}

function transformToConfident(message: string): string {
  let result = message
    .replace(/I think|maybe|perhaps|possibly/gi, 'I am confident that')
    .replace(/could you|would you mind/gi, 'I need you to')
    .replace(/just a suggestion/gi, 'my recommendation is')

  return `Let me be direct with you.\n\n${result}\n\nThis is the path forward. Let's make it happen.`
}