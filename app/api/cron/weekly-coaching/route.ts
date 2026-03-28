// Weekly AI Coaching Email — Vercel Cron Job
// Runs every Monday at 8:00 AM UTC
// Sends personalized content tips based on user's brand profile and usage
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import nodemailer from 'nodemailer'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const GROQ_API_KEY = process.env.GROQ_API_KEY

const transporter = nodemailer.createTransport({
  host: 'smtppro.zoho.eu',
  port: 465,
  secure: true,
  auth: {
    user: process.env.ZOHO_MAIL_USER,
    pass: process.env.ZOHO_MAIL_PASS
  }
})

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get all active users with their brand profiles and usage stats
    const { data: users, error } = await supabaseAdmin
      .from('credits')
      .select('user_id, balance, plan')
    
    if (error || !users) {
      return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
    }

    let sent = 0
    let skipped = 0

    for (const user of users) {
      try {
        // Get user email
        const { data: authUser } = await supabaseAdmin.auth.admin.getUserById(user.user_id)
        if (!authUser?.user?.email) { skipped++; continue }

        // Get brand profile
        const { data: brand } = await supabaseAdmin
          .from('brand_profiles')
          .select('niche, target_audience, tone, platforms')
          .eq('user_id', user.user_id)
          .single()

        // Get last week's usage
        const weekAgo = new Date()
        weekAgo.setDate(weekAgo.getDate() - 7)

        const { data: usage } = await supabaseAdmin
          .from('tool_usage')
          .select('tool_name, credits_used')
          .eq('user_id', user.user_id)
          .gte('created_at', weekAgo.toISOString())

        const totalUses = usage?.length || 0
        const creditsSpent = usage?.reduce((sum: number, u: any) => sum + (u.credits_used || 0), 0) || 0
        const topTools = getTopTools(usage || [])

        // Generate AI coaching tips if user has brand profile
        let aiTips = ''
        if (brand?.niche && GROQ_API_KEY) {
          aiTips = await generateCoachingTips(brand, totalUses, topTools)
        }

        // Build email
        const email = authUser.user.email
        const name = authUser.user.user_metadata?.full_name || email.split('@')[0]
        const html = buildEmailHtml(name, user.plan, user.balance, totalUses, creditsSpent, topTools, brand, aiTips)

        // Send email
        await transporter.sendMail({
          from: `"MediaToolkit AI Coach" <${process.env.ZOHO_MAIL_USER}>`,
          to: email,
          subject: `📊 Your Weekly Content Report — MediaToolkit`,
          html
        })

        sent++

        // Small delay to avoid rate limits
        await new Promise(r => setTimeout(r, 500))
      } catch (err) {
        console.error(`Error sending to ${user.user_id}:`, err)
        skipped++
      }
    }

    return NextResponse.json({ success: true, sent, skipped, total: users.length })
  } catch (error: any) {
    console.error('Weekly coaching error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

function getTopTools(usage: any[]): { name: string; count: number }[] {
  const counts: Record<string, number> = {}
  usage.forEach(u => { counts[u.tool_name] = (counts[u.tool_name] || 0) + 1 })
  return Object.entries(counts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 3)
}

async function generateCoachingTips(brand: any, totalUses: number, topTools: any[]): Promise<string> {
  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${GROQ_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{
          role: 'user',
          content: `You are a social media coach. Give 3 short, actionable tips for this creator:
Niche: ${brand.niche}
Target audience: ${brand.target_audience || 'general'}
Platforms: ${brand.platforms?.join(', ') || 'tiktok, instagram'}
They used ${totalUses} tools this week. Top tools: ${topTools.map(t => t.name).join(', ') || 'none'}.

Give exactly 3 tips, each 1-2 sentences. Focus on what they should create THIS week. Be specific to their niche. Return ONLY a JSON array: ["tip1", "tip2", "tip3"]`
        }],
        temperature: 0.8,
        max_tokens: 500
      })
    })

    if (!response.ok) return ''
    const data = await response.json()
    const content = data.choices?.[0]?.message?.content || ''
    
    try {
      let clean = content.trim()
      if (clean.startsWith('```json')) clean = clean.slice(7)
      if (clean.startsWith('```')) clean = clean.slice(3)
      if (clean.endsWith('```')) clean = clean.slice(0, -3)
      const tips = JSON.parse(clean.trim())
      if (Array.isArray(tips)) {
        return tips.map((tip: string, i: number) => `<li style="margin-bottom:8px;color:#d1d5db;">${tip}</li>`).join('')
      }
    } catch {}
    return ''
  } catch {
    return ''
  }
}

function buildEmailHtml(
  name: string, plan: string, balance: number, totalUses: number,
  creditsSpent: number, topTools: any[], brand: any, aiTips: string
): string {
  const toolEmojis: Record<string, string> = {
    'hook-generator': '🎣', 'caption-generator': '✍️', 'script-studio': '🎬',
    'video-finder': '🔍', 'trend-radar': '📡', 'steal-video': '🎯',
    'content-planner': '📅', 'viral-analyzer': '📊', 'hashtag-research': '#️⃣',
    'competitor-spy': '🕵️', 'ab-tester': '⚔️', 'carousel-planner': '🎠',
    'thread-composer': '🧵', 'engagement-booster': '🚀', 'posting-optimizer': '⏰',
    'content-repurposer': '♻️'
  }

  const topToolsHtml = topTools.length > 0
    ? topTools.map(t => `<span style="display:inline-block;background:#7c3aed20;color:#a78bfa;padding:4px 12px;border-radius:8px;margin:4px;font-size:13px;">${toolEmojis[t.name] || '🔧'} ${t.name.replace(/-/g, ' ')} (${t.count}x)</span>`).join('')
    : '<span style="color:#6b7280;">No tools used this week — time to create!</span>'

  const nicheSection = brand?.niche
    ? `<div style="background:#1e1b4b;border:1px solid #4c1d9530;border-radius:12px;padding:16px;margin:16px 0;">
        <p style="color:#a78bfa;font-weight:600;margin:0 0 8px;">🎨 Your Brand: ${brand.niche}</p>
        <p style="color:#9ca3af;font-size:13px;margin:0;">Tone: ${brand.tone || 'professional'} • Audience: ${brand.target_audience || 'general'}</p>
       </div>`
    : `<div style="background:#1e1b4b;border:1px solid #4c1d9530;border-radius:12px;padding:16px;margin:16px 0;">
        <p style="color:#a78bfa;font-weight:600;margin:0;">🎨 Set up your Brand Kit!</p>
        <p style="color:#9ca3af;font-size:13px;margin:4px 0 0;">Go to Dashboard → Brand Kit to get personalized AI content.</p>
       </div>`

  const tipsSection = aiTips
    ? `<div style="background:#0f291e;border:1px solid #16a34a30;border-radius:12px;padding:16px;margin:16px 0;">
        <p style="color:#4ade80;font-weight:600;margin:0 0 12px;">🧠 Your AI Coach Says:</p>
        <ol style="padding-left:20px;margin:0;">${aiTips}</ol>
       </div>`
    : ''

  return `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#0a0a0f;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:32px 20px;">
    
    <!-- Header -->
    <div style="text-align:center;margin-bottom:32px;">
      <div style="display:inline-block;width:40px;height:40px;background:linear-gradient(135deg,#a855f7,#ec4899);border-radius:10px;line-height:40px;color:white;font-weight:bold;font-size:18px;">M</div>
      <h1 style="color:white;font-size:22px;margin:12px 0 4px;">Weekly Content Report</h1>
      <p style="color:#6b7280;font-size:14px;margin:0;">Your week at a glance, ${name}</p>
    </div>

    <!-- Stats -->
    <div style="display:flex;gap:12px;margin-bottom:16px;">
      <div style="flex:1;background:#1a1a2e;border:1px solid #ffffff10;border-radius:12px;padding:16px;text-align:center;">
        <div style="color:#a78bfa;font-size:28px;font-weight:bold;">${totalUses}</div>
        <div style="color:#6b7280;font-size:12px;">Tools Used</div>
      </div>
      <div style="flex:1;background:#1a1a2e;border:1px solid #ffffff10;border-radius:12px;padding:16px;text-align:center;">
        <div style="color:#f472b6;font-size:28px;font-weight:bold;">${creditsSpent}</div>
        <div style="color:#6b7280;font-size:12px;">Credits Spent</div>
      </div>
      <div style="flex:1;background:#1a1a2e;border:1px solid #ffffff10;border-radius:12px;padding:16px;text-align:center;">
        <div style="color:#4ade80;font-size:28px;font-weight:bold;">${balance}</div>
        <div style="color:#6b7280;font-size:12px;">Credits Left</div>
      </div>
    </div>

    <!-- Top Tools -->
    <div style="background:#1a1a2e;border:1px solid #ffffff10;border-radius:12px;padding:16px;margin:16px 0;">
      <p style="color:white;font-weight:600;margin:0 0 8px;">🏆 Your Top Tools</p>
      <div>${topToolsHtml}</div>
    </div>

    <!-- Brand Section -->
    ${nicheSection}

    <!-- AI Tips -->
    ${tipsSection}

    <!-- CTA -->
    <div style="text-align:center;margin:32px 0;">
      <a href="https://mediatoolkit.site/dashboard" style="display:inline-block;background:linear-gradient(135deg,#a855f7,#ec4899);color:white;padding:14px 32px;border-radius:12px;text-decoration:none;font-weight:600;font-size:15px;">
        🚀 Start Creating
      </a>
    </div>

    <!-- Plan Badge -->
    <div style="text-align:center;margin:16px 0;">
      <span style="background:${plan === 'pro' ? '#7c3aed20' : '#ffffff08'};color:${plan === 'pro' ? '#a78bfa' : '#6b7280'};padding:6px 16px;border-radius:20px;font-size:12px;border:1px solid ${plan === 'pro' ? '#7c3aed30' : '#ffffff10'};">
        ${plan === 'pro' ? '⭐ Pro Plan' : plan === 'agency' ? '🏢 Agency' : '🆓 Free Plan'}
      </span>
      ${plan === 'free' ? '<p style="color:#6b7280;font-size:12px;margin:8px 0 0;"><a href="https://mediatoolkit.site/pricing" style="color:#a78bfa;text-decoration:none;">Upgrade to Pro →</a></p>' : ''}
    </div>

    <!-- Footer -->
    <div style="text-align:center;padding-top:24px;border-top:1px solid #ffffff08;margin-top:24px;">
      <p style="color:#4b5563;font-size:11px;margin:0;">
        MediaToolkit • <a href="https://mediatoolkit.site" style="color:#6b7280;text-decoration:none;">mediatoolkit.site</a>
      </p>
    </div>
  </div>
</body>
</html>`
}
