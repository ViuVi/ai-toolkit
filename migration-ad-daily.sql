-- Add ad watch tracking columns to credits table
ALTER TABLE credits ADD COLUMN IF NOT EXISTS ad_watches_today INTEGER DEFAULT 0;
ALTER TABLE credits ADD COLUMN IF NOT EXISTS ad_watches_date TEXT DEFAULT '';

-- Add daily bonus tracking columns to credits table
ALTER TABLE credits ADD COLUMN IF NOT EXISTS daily_bonus_date TEXT DEFAULT '';
ALTER TABLE credits ADD COLUMN IF NOT EXISTS daily_streak INTEGER DEFAULT 0;
