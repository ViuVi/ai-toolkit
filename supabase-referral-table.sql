-- MediaToolKit Referral Sistemi
-- Bu SQL'i Supabase SQL Editor'da çalıştırın

-- 1. Referral tablosu
CREATE TABLE IF NOT EXISTS referrals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  referrer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  referred_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  referral_code VARCHAR(20) NOT NULL,
  bonus_given BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(referred_id)
);

-- 2. Credits tablosuna referral_code kolonu ekle (eğer yoksa)
ALTER TABLE credits ADD COLUMN IF NOT EXISTS referral_code VARCHAR(20) UNIQUE;

-- 3. Her kullanıcı için unique referral code oluştur
-- Bu trigger, yeni kullanıcı kayıt olduğunda otomatik referral code oluşturur
CREATE OR REPLACE FUNCTION generate_referral_code()
RETURNS TRIGGER AS $$
BEGIN
  -- Eğer referral_code boşsa, oluştur
  IF NEW.referral_code IS NULL THEN
    NEW.referral_code := UPPER(SUBSTRING(MD5(NEW.user_id::text || NOW()::text) FROM 1 FOR 8));
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger'ı credits tablosuna bağla
DROP TRIGGER IF EXISTS set_referral_code ON credits;
CREATE TRIGGER set_referral_code
  BEFORE INSERT ON credits
  FOR EACH ROW
  EXECUTE FUNCTION generate_referral_code();

-- 4. Mevcut kullanıcılara referral code oluştur
UPDATE credits 
SET referral_code = UPPER(SUBSTRING(MD5(user_id::text || NOW()::text) FROM 1 FOR 8))
WHERE referral_code IS NULL;

-- 5. İndeksler
CREATE INDEX IF NOT EXISTS idx_referrals_referrer ON referrals(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referrals_code ON referrals(referral_code);
CREATE INDEX IF NOT EXISTS idx_credits_referral_code ON credits(referral_code);

-- 6. RLS politikaları
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own referrals" ON referrals
  FOR SELECT USING (auth.uid() = referrer_id);

CREATE POLICY "Anyone can insert referrals" ON referrals
  FOR INSERT WITH CHECK (true);

-- 7. Referral bonus verme fonksiyonu
CREATE OR REPLACE FUNCTION give_referral_bonus(
  p_referrer_id UUID,
  p_referred_id UUID,
  p_referral_code VARCHAR(20)
)
RETURNS BOOLEAN AS $$
DECLARE
  v_bonus_amount INTEGER := 50; -- Her referral için 50 kredi
BEGIN
  -- Referral kaydı oluştur
  INSERT INTO referrals (referrer_id, referred_id, referral_code, bonus_given)
  VALUES (p_referrer_id, p_referred_id, p_referral_code, TRUE)
  ON CONFLICT (referred_id) DO NOTHING;
  
  -- Referrer'a bonus ver
  UPDATE credits 
  SET balance = balance + v_bonus_amount
  WHERE user_id = p_referrer_id;
  
  -- Referred'a da bonus ver (ilk kayıt bonusu)
  UPDATE credits 
  SET balance = balance + v_bonus_amount
  WHERE user_id = p_referred_id;
  
  RETURN TRUE;
EXCEPTION
  WHEN OTHERS THEN
    RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
