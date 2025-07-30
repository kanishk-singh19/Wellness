-- Location: supabase/migrations/20250130205034_wellness_app_schema.sql
-- WellnessHub Full-Stack Application Schema
-- Authentication + Session Management System

-- 1. Custom Types
CREATE TYPE public.user_role AS ENUM ('admin', 'practitioner', 'member');
CREATE TYPE public.session_status AS ENUM ('draft', 'published');

-- 2. User Profiles Table (Critical intermediary for PostgREST compatibility)
CREATE TABLE public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    role public.user_role DEFAULT 'member'::public.user_role,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. Sessions Table
CREATE TABLE public.sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    tags TEXT[] DEFAULT '{}',
    json_file_url TEXT,
    status public.session_status DEFAULT 'draft'::public.session_status,
    views INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 4. Essential Indexes
CREATE INDEX idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX idx_sessions_user_id ON public.sessions(user_id);
CREATE INDEX idx_sessions_status ON public.sessions(status);
CREATE INDEX idx_sessions_created_at ON public.sessions(created_at DESC);
CREATE INDEX idx_sessions_updated_at ON public.sessions(updated_at DESC);

-- 5. Enable Row Level Security
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;

-- 6. RLS Helper Functions
CREATE OR REPLACE FUNCTION public.is_session_owner(session_uuid UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.sessions s
    WHERE s.id = session_uuid AND s.user_id = auth.uid()
)
$$;

CREATE OR REPLACE FUNCTION public.can_view_session(session_uuid UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.sessions s
    WHERE s.id = session_uuid AND (
        s.status = 'published'::public.session_status OR
        s.user_id = auth.uid()
    )
)
$$;

-- 7. RLS Policies
CREATE POLICY "users_own_profile"
ON public.user_profiles
FOR ALL
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

CREATE POLICY "users_manage_own_sessions"
ON public.sessions
FOR ALL
TO authenticated
USING (public.is_session_owner(id))
WITH CHECK (public.is_session_owner(id));

CREATE POLICY "public_can_view_published_sessions"
ON public.sessions
FOR SELECT
TO public
USING (status = 'published'::public.session_status);

CREATE POLICY "authenticated_can_view_sessions"
ON public.sessions
FOR SELECT
TO authenticated
USING (public.can_view_session(id));

-- 8. Automatic User Profile Creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO public.user_profiles (id, email, full_name, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        COALESCE((NEW.raw_user_meta_data->>'role')::public.user_role, 'member'::public.user_role)
    );
    RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 9. Updated At Trigger Function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;

CREATE TRIGGER sessions_updated_at
    BEFORE UPDATE ON public.sessions
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER user_profiles_updated_at
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 10. Mock Data for Development
DO $$
DECLARE
    practitioner_uuid UUID := gen_random_uuid();
    member_uuid UUID := gen_random_uuid();
    session1_uuid UUID := gen_random_uuid();
    session2_uuid UUID := gen_random_uuid();
    session3_uuid UUID := gen_random_uuid();
    session4_uuid UUID := gen_random_uuid();
    session5_uuid UUID := gen_random_uuid();
BEGIN
    -- Create complete auth.users records with required fields
    INSERT INTO auth.users (
        id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
        created_at, updated_at, raw_user_meta_data, raw_app_meta_data,
        is_sso_user, is_anonymous, confirmation_token, confirmation_sent_at,
        recovery_token, recovery_sent_at, email_change_token_new, email_change,
        email_change_sent_at, email_change_token_current, email_change_confirm_status,
        reauthentication_token, reauthentication_sent_at, phone, phone_change,
        phone_change_token, phone_change_sent_at
    ) VALUES
        (practitioner_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'user@wellnesshub.com', crypt('wellness123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Wellness Practitioner", "role": "practitioner"}'::jsonb, 
         '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (member_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'member@wellnesshub.com', crypt('member123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Wellness Member", "role": "member"}'::jsonb,
         '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null);

    -- Create wellness sessions with realistic data
    INSERT INTO public.sessions (id, user_id, title, tags, json_file_url, status, views, created_at, updated_at)
    VALUES
        (session1_uuid, practitioner_uuid, 'Morning Mindfulness Meditation', 
         ARRAY['meditation', 'mindfulness', 'morning'], 
         'https://example.com/session1.json', 'published'::public.session_status, 245,
         '2025-01-25T08:00:00Z', '2025-01-28T10:30:00Z'),
        (session2_uuid, practitioner_uuid, 'Evening Yoga Flow for Relaxation',
         ARRAY['yoga', 'relaxation', 'evening'],
         'https://example.com/session2.json', 'draft'::public.session_status, 0,
         '2025-01-26T19:00:00Z', '2025-01-29T16:45:00Z'),
        (session3_uuid, practitioner_uuid, 'Breathwork for Stress Relief',
         ARRAY['breathwork', 'stress-relief', 'wellness'],
         'https://example.com/session3.json', 'published'::public.session_status, 189,
         '2025-01-20T14:00:00Z', '2025-01-27T11:20:00Z'),
        (session4_uuid, practitioner_uuid, 'Gentle Stretching Routine',
         ARRAY['stretching', 'flexibility', 'gentle'],
         'https://example.com/session4.json', 'draft'::public.session_status, 0,
         '2025-01-29T09:15:00Z', '2025-01-30T14:22:00Z'),
        (session5_uuid, practitioner_uuid, 'Power Meditation for Focus',
         ARRAY['meditation', 'focus', 'productivity'],
         'https://example.com/session5.json', 'published'::public.session_status, 312,
         '2025-01-22T11:30:00Z', '2025-01-26T09:10:00Z');

EXCEPTION
    WHEN foreign_key_violation THEN
        RAISE NOTICE 'Foreign key constraint error: %', SQLERRM;
    WHEN unique_violation THEN
        RAISE NOTICE 'Unique constraint error: %', SQLERRM;
    WHEN OTHERS THEN
        RAISE NOTICE 'Unexpected error during mock data creation: %', SQLERRM;
END $$;

-- 11. Cleanup Function for Development
CREATE OR REPLACE FUNCTION public.cleanup_mock_data()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    mock_user_ids UUID[];
BEGIN
    -- Get mock user IDs
    SELECT ARRAY_AGG(id) INTO mock_user_ids
    FROM auth.users
    WHERE email IN ('user@wellnesshub.com', 'member@wellnesshub.com');

    -- Delete in dependency order
    DELETE FROM public.sessions WHERE user_id = ANY(mock_user_ids);
    DELETE FROM public.user_profiles WHERE id = ANY(mock_user_ids);
    DELETE FROM auth.users WHERE id = ANY(mock_user_ids);

    RAISE NOTICE 'Mock data cleanup completed';
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Cleanup failed: %', SQLERRM;
END;
$$;