-- 1. Create PROFILES table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    phone TEXT UNIQUE NOT NULL,
    nom_atelier TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can read their own profile" ON public.profiles;
CREATE POLICY "Users can read their own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- 4. Migration script for existing users
-- For existing users who don't have a profile, we generate a fake phone number
-- based on their email or user ID to respect the UNIQUE constraint.
INSERT INTO public.profiles (id, phone, nom_atelier)
SELECT 
    u.id, 
    -- We generate a fake phone number format E.164: +221770000000 + first digits of UUID
    '+22177' || LPAD(SUBSTRING(regexp_replace(u.id::text, '[^0-9]', '', 'g') FROM 1 FOR 7), 7, '0'),
    'Atelier Migré'
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE p.id IS NULL
ON CONFLICT (id) DO NOTHING;
