// User and Auth Types
export type UserRole = 'candidate' | 'institution';

export interface User {
  id: number;
  email: string;
  full_name: string | null;
  role: UserRole;
  is_active: boolean;
  is_verified: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  email: string;
  password: string;
  full_name: string;
  role: UserRole;
  phone?: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

// Candidate Types
export type Subject = 'science' | 'maths' | 'social_science' | 'ict' | 'english' | 'hindi' | 'kannada' | 'marathi';
export type ExperienceLevel = 'fresh' | 'junior' | 'mid' | 'senior';

export interface CandidateProfile {
  id: number;
  user_id: number;
  preferred_city: string | null;
  preferred_state: string | null;
  preferred_pincode: string | null;
  max_distance_km: number;
  preferred_role: string | null;
  preferred_subjects: Subject[] | null;
  experience_years: number;
  experience_level: ExperienceLevel | null;
  is_profile_complete: boolean;
}

export interface CandidateProfileCreate {
  preferred_city?: string;
  preferred_state?: string;
  preferred_pincode?: string;
  max_distance_km?: number;
  preferred_role?: string;
  preferred_subjects?: Subject[];
  experience_years?: number;
  experience_level?: ExperienceLevel;
}

export interface JobMatch {
  job_id: number;
  match_score: number;
  already_applied: boolean;
}

export interface JobMatchCount {
  count: number;
  distance_km: number;
  message: string;
}

export interface ResumeUploadResponse {
  message: string;
  resume_file_path: string;
  parsed_data: {
    subjects: string[];
    experience_years: number;
    experience_level: string;
    skills: string[];
    qualifications: string[];
  };
  profile_updated: boolean;
}

// Institution Types
export interface InstitutionProfile {
  id: number;
  user_id: number;
  name: string;
  type: string | null;
  board_affiliation: string | null;
  city: string;
  state: string;
  pincode: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  website: string | null;
  is_profile_complete: boolean;
}

export interface InstitutionProfileCreate {
  name: string;
  type?: string;
  board_affiliation?: string;
  city: string;
  state: string;
  pincode?: string;
  address_line1?: string;
  address_line2?: string;
  contact_email?: string;
  contact_phone?: string;
  website?: string;
}

// Job Types
export type JobStatus = 'draft' | 'active' | 'closed';
export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export interface Job {
  id: number;
  institution_id: number;
  title: string;
  role: string;
  subject: Subject;
  city: string;
  state: string;
  pincode: string | null;
  max_distance_km: number;
  required_experience_years: number;
  required_experience_level: ExperienceLevel | null;
  required_qualifications: string[] | null;
  required_skills: string[] | null;
  status: JobStatus;
  screening_question_count: number;
  passing_score_threshold: number;
  created_at: string;
  updated_at: string;
}

export interface JobCreate {
  title: string;
  role: string;
  subject: Subject;
  city: string;
  state: string;
  pincode?: string;
  max_distance_km?: number;
  required_experience_years?: number;
  required_experience_level?: ExperienceLevel;
  required_qualifications?: string[];
  required_skills?: string[];
  screening_question_count?: number;
  passing_score_threshold?: number;
}

export interface JobUpdate extends Partial<JobCreate> {
  status?: JobStatus;
}

export interface GenerateQuestionsRequest {
  class_level?: number; // 1-10
  subject?: Subject; // Override job's subject
  easy_count?: number; // Number of easy difficulty questions
  medium_count?: number; // Number of medium difficulty questions
  hard_count?: number; // Number of hard difficulty questions
  question_count?: number; // Total question count (used if difficulty counts not specified)
  mcq_count?: number; // Specific MCQ count
  descriptive_count?: number; // Specific descriptive count
  mcq_ratio?: number; // Ratio of MCQ questions (0.0-1.0), default: 0.7
}

export interface GenerateQuestionsResponse {
  message: string;
  question_ids: number[];
  job_id: number;
  total_questions: number;
}

// Screening Types
export type QuestionType = 'mcq' | 'descriptive';
export type ScreeningStatus = 'pending' | 'in_progress' | 'completed' | 'passed' | 'failed';

export interface Question {
  id: number;
  class_level: number;
  subject: Subject;
  question_type: QuestionType;
  question_text: string;
  options: string[] | null;
  correct_answer: string;
  expected_keywords: string[] | null;
  expected_answer_text: string | null;
  points: number;
  created_at: string;
}

export interface ScreeningAttempt {
  id: number;
  candidate_id: number;
  screening_round_id: number;
  status: ScreeningStatus;
  total_questions: number;
  questions_answered: number;
  correct_answers: number;
  total_score: number;
  percentage_score: number;
  passing_threshold: number;
  is_passed: boolean;
  started_at: string | null;
  completed_at: string | null;
  questions?: Question[];
}

export interface ScreeningStartRequest {
  job_id: number;
}

export interface AnswerSubmit {
  question_id: number;
  answer_text: string;
}

export interface ScreeningResult {
  attempt_id: number;
  status: ScreeningStatus;
  total_questions: number;
  questions_answered: number;
  correct_answers: number;
  percentage_score: number;
  passing_threshold: number;
  is_passed: boolean;
  next_step: string;
  lms_url: string | null;
  completed_at: string;
}

// Subscription Types
export type SubscriptionTier = 'free' | 'paid';

export interface Subscription {
  id: number;
  institution_id: number;
  tier: SubscriptionTier;
  is_active: boolean;
  starts_at: string;
  ends_at: string | null;
}

