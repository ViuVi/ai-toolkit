-- MediaToolKit İstatistik Tabloları
-- Bu SQL'i Supabase SQL Editor'da çalıştırın

-- 1. Tool kullanım istatistikleri tablosu
CREATE TABLE IF NOT EXISTS tool_usage (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  tool_name VARCHAR(50) NOT NULL,
  credits_used INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. İndeksler (hızlı sorgu için)
CREATE INDEX IF NOT EXISTS idx_tool_usage_user_id ON tool_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_tool_usage_created_at ON tool_usage(created_at);
CREATE INDEX IF NOT EXISTS idx_tool_usage_tool_name ON tool_usage(tool_name);

-- 3. RLS (Row Level Security) politikaları
ALTER TABLE tool_usage ENABLE ROW LEVEL SECURITY;

-- Kullanıcılar sadece kendi verilerini görebilir
CREATE POLICY "Users can view own tool usage" ON tool_usage
  FOR SELECT USING (auth.uid() = user_id);

-- Kullanıcılar kendi kullanımlarını ekleyebilir
CREATE POLICY "Users can insert own tool usage" ON tool_usage
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 4. Örnek veri ekleme fonksiyonu (test için)
-- Bu fonksiyonu çalıştırmak istemiyorsanız atlayın

/*
INSERT INTO tool_usage (user_id, tool_name, credits_used, created_at) VALUES
  (auth.uid(), 'hook-generator', 3, NOW() - INTERVAL '1 day'),
  (auth.uid(), 'caption-generator', 3, NOW() - INTERVAL '2 days'),
  (auth.uid(), 'viral-analyzer', 5, NOW() - INTERVAL '3 days');
*/

-- 5. Toplam kullanım istatistiği view'ı (opsiyonel)
CREATE OR REPLACE VIEW user_stats AS
SELECT 
  user_id,
  COUNT(*) as total_uses,
  SUM(credits_used) as total_credits_spent,
  COUNT(DISTINCT tool_name) as unique_tools_used,
  MAX(created_at) as last_used_at
FROM tool_usage
GROUP BY user_id;
