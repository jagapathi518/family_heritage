-- ============================================================================
-- DIGITAL FAMILY HERITAGE PLATFORM
-- Migration 002: Row Level Security (RLS), Cycle Detection, and Trigger Functions
-- ============================================================================

-- 1. Helper function: Check if current authenticated user belongs to family
CREATE OR REPLACE FUNCTION public.is_family_member(f_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.family_memberships
    WHERE family_id = f_id AND user_id = auth.uid()
  );
$$;

-- 2. Helper function: Check if user is editor or owner
CREATE OR REPLACE FUNCTION public.is_family_editor(f_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.family_memberships
    WHERE family_id = f_id
      AND user_id = auth.uid()
      AND role IN ('owner', 'editor')
  );
$$;

-- 3. Helper function: Check if user is owner
CREATE OR REPLACE FUNCTION public.is_family_owner(f_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.family_memberships
    WHERE family_id = f_id
      AND user_id = auth.uid()
      AND role = 'owner'
  );
$$;

-- 4. Cycle prevention trigger function for genealogy
-- Prevents introducing invalid cycles where child is already an ancestor of parent
CREATE OR REPLACE FUNCTION public.prevent_relationship_cycles()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  cycle_exists BOOLEAN;
BEGIN
  IF NEW.relationship_type = 'parent_child' THEN
    -- Check if child (person2_id) is already an ancestor of parent (person1_id)
    WITH RECURSIVE ancestor_tree AS (
      -- Base: Parents of the new parent (person1_id)
      SELECT person1_id AS ancestor_id
      FROM public.relationships
      WHERE person2_id = NEW.person1_id
        AND relationship_type = 'parent_child'
      UNION
      -- Recursive: Parents of ancestors
      SELECT r.person1_id AS ancestor_id
      FROM public.relationships r
      INNER JOIN ancestor_tree at ON r.person2_id = at.ancestor_id
      WHERE r.relationship_type = 'parent_child'
    )
    SELECT EXISTS (
      SELECT 1 FROM ancestor_tree WHERE ancestor_id = NEW.person2_id
    ) INTO cycle_exists;

    IF cycle_exists THEN
      RAISE EXCEPTION 'Invalid relationship: Cannot add a descendant as an ancestor (ancestry cycle detected).';
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_prevent_relationship_cycles ON public.relationships;
CREATE TRIGGER trg_prevent_relationship_cycles
BEFORE INSERT OR UPDATE ON public.relationships
FOR EACH ROW
EXECUTE FUNCTION public.prevent_relationship_cycles();

-- 5. Trigger for new user profile creation on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, preferred_language)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url',
    COALESCE(NEW.raw_user_meta_data->>'preferred_language', 'en')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.families ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.family_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.people ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_people ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- PROFILES
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- FAMILIES
CREATE POLICY "Family members or public preview can view family"
  ON public.families FOR SELECT
  USING (
    is_public_preview = TRUE OR
    public.is_family_member(id)
  );

CREATE POLICY "Authenticated users can create family"
  ON public.families FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Only owners can update family"
  ON public.families FOR UPDATE
  USING (public.is_family_owner(id));

CREATE POLICY "Only owners can delete family"
  ON public.families FOR DELETE
  USING (public.is_family_owner(id));

-- FAMILY MEMBERSHIPS
CREATE POLICY "Members can view membership roster"
  ON public.family_memberships FOR SELECT
  USING (public.is_family_member(family_id));

CREATE POLICY "Owners can manage memberships"
  ON public.family_memberships FOR ALL
  USING (public.is_family_owner(family_id));

CREATE POLICY "Allow creator to insert first membership as owner"
  ON public.family_memberships FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- INVITATIONS
CREATE POLICY "Members can view invitations"
  ON public.invitations FOR SELECT
  USING (public.is_family_member(family_id) OR email = auth.jwt()->>'email');

CREATE POLICY "Owners can create and manage invitations"
  ON public.invitations FOR ALL
  USING (public.is_family_owner(family_id));

-- PEOPLE
CREATE POLICY "Family members can view people"
  ON public.people FOR SELECT
  USING (public.is_family_member(family_id));

CREATE POLICY "Editors and owners can insert people"
  ON public.people FOR INSERT
  WITH CHECK (public.is_family_editor(family_id));

CREATE POLICY "Editors and owners can update people"
  ON public.people FOR UPDATE
  USING (public.is_family_editor(family_id));

CREATE POLICY "Editors and owners can delete people"
  ON public.people FOR DELETE
  USING (public.is_family_editor(family_id));

-- RELATIONSHIPS
CREATE POLICY "Family members can view relationships"
  ON public.relationships FOR SELECT
  USING (public.is_family_member(family_id));

CREATE POLICY "Editors and owners can manage relationships"
  ON public.relationships FOR ALL
  USING (public.is_family_editor(family_id));

-- EVENTS & EVENT_PEOPLE
CREATE POLICY "Family members can view events"
  ON public.events FOR SELECT
  USING (public.is_family_member(family_id));

CREATE POLICY "Editors and owners can manage events"
  ON public.events FOR ALL
  USING (public.is_family_editor(family_id));

CREATE POLICY "Family members can view event_people"
  ON public.event_people FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.events e
      WHERE e.id = event_id AND public.is_family_member(e.family_id)
    )
  );

CREATE POLICY "Editors and owners can manage event_people"
  ON public.event_people FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.events e
      WHERE e.id = event_id AND public.is_family_editor(e.family_id)
    )
  );

-- MEMORIES
CREATE POLICY "Family members can view memories"
  ON public.memories FOR SELECT
  USING (public.is_family_member(family_id));

CREATE POLICY "Editors and owners can insert memories"
  ON public.memories FOR INSERT
  WITH CHECK (public.is_family_editor(family_id));

CREATE POLICY "Editors and owners can update/delete memories"
  ON public.memories FOR UPDATE
  USING (public.is_family_editor(family_id));

CREATE POLICY "Editors and owners can delete memories"
  ON public.memories FOR DELETE
  USING (public.is_family_editor(family_id));

-- MEDIA
CREATE POLICY "Family members can view media records"
  ON public.media FOR SELECT
  USING (public.is_family_member(family_id));

CREATE POLICY "Editors and owners can upload media records"
  ON public.media FOR INSERT
  WITH CHECK (public.is_family_editor(family_id));

CREATE POLICY "Editors and owners can delete media records"
  ON public.media FOR DELETE
  USING (public.is_family_editor(family_id));

-- ACTIVITY LOGS
CREATE POLICY "Family members can view activity logs"
  ON public.activity_logs FOR SELECT
  USING (public.is_family_member(family_id));

CREATE POLICY "System and members can insert activity logs"
  ON public.activity_logs FOR INSERT
  WITH CHECK (public.is_family_member(family_id));
