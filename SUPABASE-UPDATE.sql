-- =============================================
-- MEDIATOOLKIT KREDİ SİSTEMİ GÜNCELLEMESİ
-- Mevcut tablolara ekleme yapar, silmez
-- =============================================

-- 1. Credits tablosuna yeni kolonlar ekle (yoksa)
ALTER TABLE credits ADD COLUMN IF NOT EXISTS plan VARCHAR(20) DEFAULT 'free';
ALTER TABLE credits ADD COLUMN IF NOT EXISTS referral_code VARCHAR(20) UNIQUE;
ALTER TABLE credits ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- 2. Trigger fonksiyonunu güncelle - 100 kredi ile başlat
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  new_referral_code VARCHAR(20);
BEGIN
  -- Benzersiz referral kodu oluştur
  new_referral_code := UPPER(SUBSTRING(md5(random()::text) FROM 1 FOR 8));
  
  INSERT INTO public.credits (user_id, balance, total_used, plan, referral_code)
  VALUES (NEW.id, 100, 0, 'free', new_referral_code);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. tool_usage tablosu (API'lerin kullandığı)
CREATE TABLE IF NOT EXISTS tool_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  tool_name VARCHAR(50) NOT NULL,
  credits_used INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS for tool_usage
ALTER TABLE tool_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own tool_usage" ON tool_usage
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role full access tool_usage" ON tool_usage
  FOR ALL USING (true);

-- Index
CREATE INDEX IF NOT EXISTS idx_tool_usage_user_id ON tool_usage(user_id);

-- 4. Referrals tablosu
CREATE TABLE IF NOT EXISTS referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  referred_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  referral_code VARCHAR(20) NOT NULL,
  bonus_given BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own referrals" ON referrals
  FOR SELECT USING (auth.uid() = referrer_id);

CREATE POLICY "Service role full access referrals" ON referrals
  FOR ALL USING (true);

CREATE INDEX IF NOT EXISTS idx_referrals_referrer ON referrals(referrer_id);

-- 5. Mevcut kullanıcılara referral kodu ver (yoksa)
UPDATE credits 
SET referral_code = UPPER(SUBSTRING(md5(random()::text || user_id::text) FROM 1 FOR 8))
WHERE referral_code IS NULL;

-- 6. Mevcut kullanıcıların kredisini 100'e çıkar (isteğe bağlı)
-- UPDATE credits SET balance = 100 WHERE balance < 100;

-- =============================================
-- NOTLAR:
-- - Mevcut credits ve usage_history tablolarına dokunmaz
-- - Sadece yeni kolonlar ve tablolar ekler
-- - Trigger'ı günceller (100 kredi + referral kodu)
-- =============================================
