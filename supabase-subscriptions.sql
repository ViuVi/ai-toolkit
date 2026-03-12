-- user_credits tablosu - TAM YAPI
CREATE TABLE IF NOT EXISTS user_credits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  credits INTEGER DEFAULT 50 NOT NULL,
  plan TEXT DEFAULT 'free' NOT NULL,
  subscription_id TEXT,
  customer_id TEXT,
  variant_id TEXT,
  renews_at TIMESTAMP WITH TIME ZONE,
  ends_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Eksik kolonları ekle (tablo zaten varsa)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_credits' AND column_name = 'subscription_id') THEN
    ALTER TABLE user_credits ADD COLUMN subscription_id TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_credits' AND column_name = 'customer_id') THEN
    ALTER TABLE user_credits ADD COLUMN customer_id TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_credits' AND column_name = 'variant_id') THEN
    ALTER TABLE user_credits ADD COLUMN variant_id TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_credits' AND column_name = 'renews_at') THEN
    ALTER TABLE user_credits ADD COLUMN renews_at TIMESTAMP WITH TIME ZONE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_credits' AND column_name = 'ends_at') THEN
    ALTER TABLE user_credits ADD COLUMN ends_at TIMESTAMP WITH TIME ZONE;
  END IF;
END $$;

-- RLS Politikaları
ALTER TABLE user_credits ENABLE ROW LEVEL SECURITY;

-- Mevcut politikaları temizle
DROP POLICY IF EXISTS "Users can view own credits" ON user_credits;
DROP POLICY IF EXISTS "Users can update own credits" ON user_credits;
DROP POLICY IF EXISTS "Service role full access" ON user_credits;
DROP POLICY IF EXISTS "Allow insert for authenticated users" ON user_credits;

-- Yeni politikalar
CREATE POLICY "Users can view own credits" ON user_credits
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own credits" ON user_credits
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Allow insert for authenticated users" ON user_credits
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Yeni kullanıcı kayıt olduğunda otomatik kredi oluştur
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_credits (user_id, credits, plan)
  VALUES (NEW.id, 50, 'free')
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger'ı oluştur
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- İndeksler
CREATE INDEX IF NOT EXISTS idx_user_credits_user_id ON user_credits(user_id);
CREATE INDEX IF NOT EXISTS idx_user_credits_subscription_id ON user_credits(subscription_id);