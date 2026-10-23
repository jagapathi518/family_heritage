-- ============================================================================
-- DIGITAL FAMILY HERITAGE PLATFORM
-- Migration 001: Initial Normalized Relational Database Schema
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES (Extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  preferred_language VARCHAR(5) DEFAULT 'en' CHECK (preferred_language IN ('en', 'te')),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 2. FAMILIES (Workspaces for family heritage archives)
CREATE TABLE IF NOT EXISTS public.families (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  cover_photo_url TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  is_public_preview BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 3. FAMILY MEMBERSHIPS (Multi-tenant authorization)
CREATE TYPE public.family_role AS ENUM ('owner', 'editor', 'viewer');

CREATE TABLE IF NOT EXISTS public.family_memberships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  family_id UUID NOT NULL REFERENCES public.families(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.family_role NOT NULL DEFAULT 'viewer',
  joined_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  CONSTRAINT unique_family_user UNIQUE(family_id, user_id)
);

-- 4. INVITATIONS (Secure, expiring relative invites)
CREATE TYPE public.invitation_status AS ENUM ('pending', 'accepted', 'rejected', 'revoked');

CREATE TABLE IF NOT EXISTS public.invitations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  family_id UUID NOT NULL REFERENCES public.families(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role public.family_role NOT NULL DEFAULT 'viewer',
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  status public.invitation_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 5. PEOPLE (Ancestors, living relatives, and family records)
CREATE TYPE public.gender_type AS ENUM ('male', 'female', 'other', 'unknown');
CREATE TYPE public.confidence_type AS ENUM ('verified', 'probable', 'oral_history', 'unverified');

CREATE TABLE IF NOT EXISTS public.people (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  family_id UUID NOT NULL REFERENCES public.families(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT,
  nickname TEXT,
  telugu_name TEXT, -- Full name in Telugu Unicode (e.g. రావు సత్యనారాయణ)
  gender public.gender_type NOT NULL DEFAULT 'unknown',
  date_of_birth DATE,
  is_birth_date_approximate BOOLEAN DEFAULT FALSE,
  birth_year_approximate INT,
  is_deceased BOOLEAN DEFAULT FALSE,
  date_of_death DATE,
  is_death_date_approximate BOOLEAN DEFAULT FALSE,
  death_year_approximate INT,
  birthplace TEXT,
  native_village TEXT,
  occupation TEXT,
  biography TEXT,
  biography_telugu TEXT,
  education TEXT,
  ancestral_home TEXT,
  favorite_memories TEXT,
  avatar_url TEXT,
  confidence_status public.confidence_type NOT NULL DEFAULT 'oral_history',
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 6. RELATIONSHIPS (Relational genealogy graph)
CREATE TYPE public.relationship_type AS ENUM ('parent_child', 'spouse');

CREATE TABLE IF NOT EXISTS public.relationships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  family_id UUID NOT NULL REFERENCES public.families(id) ON DELETE CASCADE,
  person1_id UUID NOT NULL REFERENCES public.people(id) ON DELETE CASCADE,
  person2_id UUID NOT NULL REFERENCES public.people(id) ON DELETE CASCADE,
  relationship_type public.relationship_type NOT NULL,
  marriage_date DATE,
  divorce_date DATE,
  is_active BOOLEAN DEFAULT TRUE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  CONSTRAINT no_self_relationship CHECK (person1_id <> person2_id),
  CONSTRAINT unique_directed_relationship UNIQUE(family_id, person1_id, person2_id, relationship_type)
);

-- 7. EVENTS (Family timeline milestones)
CREATE TYPE public.event_type AS ENUM (
  'birth',
  'death',
  'marriage',
  'relocation',
  'home_built',
  'career',
  'festival',
  'reunion',
  'milestone',
  'other'
);

CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  family_id UUID NOT NULL REFERENCES public.families(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  title_telugu TEXT,
  event_type public.event_type NOT NULL DEFAULT 'milestone',
  event_date DATE,
  event_year INT,
  is_approximate BOOLEAN DEFAULT FALSE,
  description TEXT,
  description_telugu TEXT,
  location TEXT,
  media_url TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Junction table for multiple people associated with an event
CREATE TABLE IF NOT EXISTS public.event_people (
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  person_id UUID NOT NULL REFERENCES public.people(id) ON DELETE CASCADE,
  PRIMARY KEY (event_id, person_id)
);

-- 8. MEMORIES (Stories, oral history, family anecdotes)
CREATE TABLE IF NOT EXISTS public.memories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  family_id UUID NOT NULL REFERENCES public.families(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  content_telugu TEXT,
  memory_date DATE,
  person_id UUID REFERENCES public.people(id) ON DELETE SET NULL,
  contributor_name TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 9. MEDIA (Metadata for uploaded private images/documents)
CREATE TABLE IF NOT EXISTS public.media (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  family_id UUID NOT NULL REFERENCES public.families(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  title TEXT,
  description TEXT,
  mime_type TEXT NOT NULL,
  size_bytes BIGINT NOT NULL,
  person_id UUID REFERENCES public.people(id) ON DELETE SET NULL,
  event_id UUID REFERENCES public.events(id) ON DELETE SET NULL,
  memory_id UUID REFERENCES public.memories(id) ON DELETE SET NULL,
  uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 10. ACTIVITY LOGS (Family audit trail)
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  family_id UUID NOT NULL REFERENCES public.families(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  details JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- INDEXES for fast relational lookups
CREATE INDEX IF NOT EXISTS idx_people_family ON public.people(family_id);
CREATE INDEX IF NOT EXISTS idx_people_name ON public.people(first_name, last_name);
CREATE INDEX IF NOT EXISTS idx_relationships_family ON public.relationships(family_id);
CREATE INDEX IF NOT EXISTS idx_relationships_p1 ON public.relationships(person1_id);
CREATE INDEX IF NOT EXISTS idx_relationships_p2 ON public.relationships(person2_id);
CREATE INDEX IF NOT EXISTS idx_events_family_date ON public.events(family_id, event_date);
CREATE INDEX IF NOT EXISTS idx_memories_family ON public.memories(family_id);
CREATE INDEX IF NOT EXISTS idx_media_family ON public.media(family_id);
CREATE INDEX IF NOT EXISTS idx_memberships_user ON public.family_memberships(user_id);
CREATE INDEX IF NOT EXISTS idx_invitations_token ON public.invitations(token);
