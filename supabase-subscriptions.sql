-- Subscriptions tablosu oluştur
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  lemonsqueezy_subscription_id TEXT UNIQUE,
  lemonsqueezy_customer_id TEXT,
  lemonsqueezy_variant_id TEXT,
  plan_id TEXT NOT NULL DEFAULT 'free',
  status TEXT NOT NULL DEFAULT 'active',
  current_period_end TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index'ler
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_lemonsqueezy_id ON subscriptions(lemonsqueezy_subscription_id);

-- Credits tablosuna plan kolonu ekle (eğer yoksa)
ALTER TABLE credits ADD COLUMN IF NOT EXISTS plan TEXT DEFAULT 'free';

-- RLS (Row Level Security) aktif et
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Mevcut policy'leri sil (hata önleme)
DROP POLICY IF EXISTS "Users can view own subscriptions" ON subscriptions;
DROP POLICY IF EXISTS "Service role can do all" ON subscriptions;

-- Policy'leri oluştur
CREATE POLICY "Users can view own subscriptions" ON subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role can do all" ON subscriptions
  FOR ALL USING (true);