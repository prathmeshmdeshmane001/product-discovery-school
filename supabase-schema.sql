-- Supabase Schema for Product Discovery School
-- Run this in your Supabase project's SQL Editor (https://supabase.com/dashboard/project/_/sql)

-- 1. Create user_progress table
CREATE TABLE IF NOT EXISTS public.user_progress (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    progress JSONB NOT NULL DEFAULT '[]'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

-- 3. Create RLS Policies
-- Allow authenticated users to view their own progress
CREATE POLICY "Users can view their own progress"
    ON public.user_progress
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

-- Allow authenticated users to insert their own progress
CREATE POLICY "Users can insert their own progress"
    ON public.user_progress
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- Allow authenticated users to update their own progress
CREATE POLICY "Users can update their own progress"
    ON public.user_progress
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Allow authenticated users to delete their own progress
CREATE POLICY "Users can delete their own progress"
    ON public.user_progress
    FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);
