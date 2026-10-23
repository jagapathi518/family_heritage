export type FamilyRole = 'owner' | 'editor' | 'viewer';
export type InvitationStatus = 'pending' | 'accepted' | 'rejected' | 'revoked';
export type GenderType = 'male' | 'female' | 'other' | 'unknown';
export type ConfidenceType = 'verified' | 'probable' | 'oral_history' | 'unverified';
export type RelationshipType = 'parent_child' | 'spouse';
export type EventType =
  | 'birth'
  | 'death'
  | 'marriage'
  | 'relocation'
  | 'home_built'
  | 'career'
  | 'festival'
  | 'reunion'
  | 'milestone'
  | 'other';

export interface Profile {
  id: string;
  full_name: string;
  avatar_url?: string | null;
  preferred_language: 'en' | 'te';
  created_at: string;
  updated_at: string;
}

export interface Family {
  id: string;
  name: string;
  description?: string | null;
  cover_photo_url?: string | null;
  created_by?: string | null;
  is_public_preview?: boolean;
  created_at: string;
  updated_at: string;
}

export interface FamilyMembership {
  id: string;
  family_id: string;
  user_id: string;
  role: FamilyRole;
  joined_at: string;
  user_profile?: Profile;
}

export interface Invitation {
  id: string;
  family_id: string;
  email: string;
  role: FamilyRole;
  token: string;
  expires_at: string;
  created_by?: string | null;
  status: InvitationStatus;
  created_at: string;
  updated_at: string;
}

export interface Person {
  id: string;
  family_id: string;
  first_name: string;
  last_name?: string | null;
  nickname?: string | null;
  telugu_name?: string | null;
  gender: GenderType;
  date_of_birth?: string | null;
  is_birth_date_approximate?: boolean;
  birth_year_approximate?: number | null;
  is_deceased?: boolean;
  date_of_death?: string | null;
  is_death_date_approximate?: boolean;
  death_year_approximate?: number | null;
  birthplace?: string | null;
  native_village?: string | null;
  occupation?: string | null;
  biography?: string | null;
  biography_telugu?: string | null;
  education?: string | null;
  ancestral_home?: string | null;
  favorite_memories?: string | null;
  avatar_url?: string | null;
  confidence_status: ConfidenceType;
  created_by?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Relationship {
  id: string;
  family_id: string;
  person1_id: string; // Parent if parent_child, spouse 1 if spouse
  person2_id: string; // Child if parent_child, spouse 2 if spouse
  relationship_type: RelationshipType;
  marriage_date?: string | null;
  divorce_date?: string | null;
  is_active?: boolean;
  notes?: string | null;
  created_at: string;
}

export interface FamilyEvent {
  id: string;
  family_id: string;
  title: string;
  title_telugu?: string | null;
  event_type: EventType;
  event_date?: string | null;
  event_year?: number | null;
  is_approximate?: boolean;
  description?: string | null;
  description_telugu?: string | null;
  location?: string | null;
  media_url?: string | null;
  created_by?: string | null;
  created_at: string;
  updated_at: string;
  associated_people_ids?: string[];
}

export interface Memory {
  id: string;
  family_id: string;
  title: string;
  content: string;
  content_telugu?: string | null;
  memory_date?: string | null;
  person_id?: string | null;
  contributor_name?: string | null;
  created_by?: string | null;
  created_at: string;
  updated_at: string;
}

export interface MediaRecord {
  id: string;
  family_id: string;
  storage_path: string;
  title?: string | null;
  description?: string | null;
  mime_type: string;
  size_bytes: number;
  person_id?: string | null;
  event_id?: string | null;
  memory_id?: string | null;
  uploaded_by?: string | null;
  created_at: string;
  url?: string;
}

export interface ActivityLog {
  id: string;
  family_id: string;
  user_id?: string | null;
  action: string;
  entity_type: string;
  entity_id?: string | null;
  details?: Record<string, unknown>;
  created_at: string;
}
