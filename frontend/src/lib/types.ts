// API types matching Django backend models

export interface User {
  id: string;
  email: string;
  role: 'expert' | 'business' | 'organization' | 'admin';
  phone: string;
  is_verified: boolean;
  did_uri: string;
}

export interface ExpertProfile {
  id: string;
  user: string;
  full_name: string;
  orcid: string;
  organization: string;
  title: string;
  degree: string;
  fields: string[];
  nationality: string;
  bio: string;
  avatar: string | null;
  did_uri: string;
  profile_completeness: number;
  is_public: boolean;
  privacy_settings: Record<string, boolean>;
  created_at: string;
  updated_at: string;
}

export interface Publication {
  id: string;
  expert: string;
  title: string;
  abstract: string;
  keywords: string[];
  journal: string;
  year: number | null;
  doi: string;
  co_authors: { name: string; orcid?: string }[];
  source: string;
  verified: boolean;
}

export interface Credential {
  id: string;
  expert: string;
  credential_type: string;
  subject_field: string;
  status: 'pending' | 'active' | 'issued' | 'revoked' | 'expired';
  issued_at: string | null;
  expires_at: string | null;
  issuer_did: string;
}

export interface ExpertiseRequest {
  id: string;
  requester: string;
  requester_email: string;
  title: string;
  description: string;
  fields: string[];
  urgency: 'low' | 'normal' | 'high' | 'urgent';
  collaboration_type: string;
  region_preference: string;
  status: 'open' | 'matching' | 'fulfilled' | 'closed';
  match_count: number;
  created_at: string;
}

export interface Connection {
  id: string;
  request: string;
  expert: string;
  expert_name: string;
  request_title: string;
  match_score: number | null;
  status: 'proposed' | 'accepted' | 'in_discussion' | 'completed' | 'cancelled';
  initial_message: string;
  created_at: string;
}

export interface MatchResult {
  id: string;
  expert_id: string;
  expert_name: string;
  expert_organization: string;
  total_score: number;
  semantic_score: number;
  field_overlap_score: number;
  verified_bonus: number;
  explanation: string;
}

export interface Message {
  id: string;
  connection: string;
  sender: string;
  sender_email: string;
  content: string;
  message_type: string;
  is_read: boolean;
  created_at: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}
