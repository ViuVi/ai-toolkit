-- =============================================
-- MEDIATOOLKIT KREDİ SİSTEMİ - SUPABASE TABLOLARI
-- =============================================

-- 1. CREDITS TABLOSU (ana kredi tablosu)
-- Eğer zaten varsa önce sil
DROP TABLE IF EXISTS credits CASCADE;

CREATE TABLE credits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  balance INTEGER DEFAULT 100 NOT NULL,
  total_used INTEGER DEFAULT 0 NOT NULL,
  plan VARCHAR(20) DEFAULT 'free' NOT NULL, -- free, pro, agency
  referral_code VARCHAR(20) UNIQUE,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index
CREATE INDEX idx_credits_user_id ON credits(user_id);
CREATE INDEX idx_credits_referral_code ON credits(referral_code);

-- RLS (Row Level Security)
ALTER TABLE credits ENABLE ROW LEVEL SECURITY;

-- Kullanıcılar sadece kendi kredilerini görebilir
CREATE POLICY "Users can view own credits" ON credits
  FOR SELECT USING (auth.uid() = user_id);

-- Kullanıcılar kendi kredilerini güncelleyebilir (balance hariç - API ile)
CREATE POLICY "Users can update own credits" ON credits
  FOR UPDATE USING (auth.uid() = user_id);

-- Service role her şeyi yapabilir
CREATE POLICY "Service role full access" ON credits
  FOR ALL USING (auth.role() = 'service_role');


-- 2. TOOL_USAGE TABLOSU (kullanım geçmişi)
DROP TABLE IF EXISTS tool_usage CASCADE;

CREATE TABLE tool_usage (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  tool_name VARCHAR(50) NOT NULL,
  credits_used INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index
CREATE INDEX idx_tool_usage_user_id ON tool_usage(user_id);
CREATE INDEX idx_tool_usage_created_at ON tool_usage(created_at DESC);

-- RLS
ALTER TABLE tool_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own usage" ON tool_usage
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role full access" ON tool_usage
  FOR ALL USING (auth.role() = 'service_role');


-- 3. REFERRALS TABLOSU (referans kayıtları)
DROP TABLE IF EXISTS referrals CASCADE;

CREATE TABLE referrals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  referrer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  referred_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  referral_code VARCHAR(20) NOT NULL,
  bonus_given BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index
CREATE INDEX idx_referrals_referrer_id ON referrals(referrer_id);

-- RLS
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own referrals" ON referrals
  FOR SELECT USING (auth.uid() = referrer_id);

CREATE POLICY "Service role full access" ON referrals
  FOR ALL USING (auth.role() = 'service_role');


-- 4. CREDIT_LOGS TABLOSU (kredi hareketleri log)
DROP TABLE IF EXISTS credit_logs CASCADE;

CREATE TABLE credit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  amount INTEGER NOT NULL, -- pozitif: eklenen, negatif: harcanan
  reason VARCHAR(100) NOT NULL, -- 'tool_usage', 'ad_reward', 'referral_bonus', 'monthly_reset', 'purchase'
  tool_name VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index
CREATE INDEX idx_credit_logs_user_id ON credit_logs(user_id);
CREATE INDEX idx_credit_logs_created_at ON credit_logs(created_at DESC);

-- RLS
ALTER TABLE credit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own logs" ON credit_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role full access" ON credit_logs
  FOR ALL USING (auth.role() = 'service_role');


-- =============================================
-- VAROLAN KULLANICILARA 100 KREDİ VER
-- (Eğer credits tablosu boşsa veya yeni oluşturulduysa)
-- =============================================

-- Auth users tablosundaki tüm kullanıcılar için credits kaydı oluştur
INSERT INTO credits (user_id, balance, total_used, plan, referral_code)
SELECT 
  id as user_id,
  100 as balance,
  0 as total_used,
  'free' as plan,
  UPPER(SUBSTRING(md5(random()::text) FROM 1 FOR 8)) as referral_code
FROM auth.users
WHERE id NOT IN (SELECT user_id FROM credits)
ON CONFLICT (user_id) DO NOTHING;


-- =============================================
-- NOTLAR:
-- =============================================
-- 
-- Plan türleri:
--   'free'   - Aylık 100 kredi
--   'pro'    - Aylık 1000 kredi  
--   'agency' - Sınırsız kredi
--
-- Kredi maliyetleri (TOOL_CREDITS):
--   hook-generator: 3
--   caption-generator: 3
--   script-studio: 6
--   video-finder: 5
--   trend-radar: 4
--   steal-video: 8
--   content-planner: 10
--   viral-analyzer: 5
--   hashtag-research: 3
--   competitor-spy: 8
--   ab-tester: 5
--   carousel-planner: 5
--   thread-composer: 4
--   engagement-booster: 4
--   posting-optimizer: 3
--   content-repurposer: 8
