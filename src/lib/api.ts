/// <reference types="vite/client" />
import axios, { AxiosInstance, AxiosError } from 'axios';
import type {
  User,
  LoginCredentials,
  SignupData,
  AuthResponse,
  CandidateProfile,
  CandidateProfileCreate,
  JobMatch,
  JobMatchCount,
  ResumeUploadResponse,
  InstitutionProfile,
  InstitutionProfileCreate,
  Job,
  JobCreate,
  JobUpdate,
  ScreeningAttempt,
  ScreeningStartRequest,
  AnswerSubmit,
  ScreeningResult,
  Subscription,
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add auth token to requests
    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem('access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Handle token expiration
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('access_token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async signup(data: SignupData): Promise<User> {
    const response = await this.client.post<User>('/auth/signup', data);
    return response.data;
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await this.client.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  }

  async getCurrentUser(): Promise<User> {
    const response = await this.client.get<User>('/auth/me');
    return response.data;
  }

  async refreshToken(): Promise<AuthResponse> {
    const response = await this.client.post<AuthResponse>('/auth/refresh');
    return response.data;
  }

  // Candidate endpoints
  async getCandidateProfile(): Promise<CandidateProfile> {
    const response = await this.client.get<CandidateProfile>('/candidate/profile');
    return response.data;
  }

  async createCandidateProfile(data: CandidateProfileCreate): Promise<CandidateProfile> {
    const response = await this.client.post<CandidateProfile>('/candidate/profile', data);
    return response.data;
  }

  async updateCandidateProfile(data: Partial<CandidateProfileCreate>): Promise<CandidateProfile> {
    const response = await this.client.patch<CandidateProfile>('/candidate/profile', data);
    return response.data;
  }

  async getResume(): Promise<ResumeUploadResponse> {
    const response = await this.client.get<ResumeUploadResponse>('/candidate/resume');
    return response.data;
  }

  async uploadResume(file: File): Promise<ResumeUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    const response = await this.client.post<ResumeUploadResponse>('/candidate/resume', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async getJobMatchCount(maxDistanceKm?: number): Promise<JobMatchCount> {
    const params = maxDistanceKm ? { max_distance_km: maxDistanceKm } : {};
    const response = await this.client.get<JobMatchCount>('/candidate/jobs/match-count', { params });
    return response.data;
  }

  async findMatchingJobs(limit = 50): Promise<JobMatch[]> {
    const response = await this.client.get<JobMatch[]>('/candidate/jobs', {
      params: { limit },
    });
    return response.data;
  }

  // Institution endpoints
  async getInstitutionProfile(): Promise<InstitutionProfile> {
    const response = await this.client.get<InstitutionProfile>('/institution/profile');
    return response.data;
  }

  async createInstitutionProfile(data: InstitutionProfileCreate): Promise<InstitutionProfile> {
    const response = await this.client.post<InstitutionProfile>('/institution/profile', data);
    return response.data;
  }

  async updateInstitutionProfile(data: Partial<InstitutionProfileCreate>): Promise<InstitutionProfile> {
    const response = await this.client.patch<InstitutionProfile>('/institution/profile', data);
    return response.data;
  }

  async getSubscription(): Promise<Subscription> {
    const response = await this.client.get<Subscription>('/institution/subscription');
    return response.data;
  }

  async listJobs(status?: Job['status']): Promise<Job[]> {
    const params = status ? { status_filter: status } : {};
    const response = await this.client.get<Job[]>('/institution/jobs', { params });
    return response.data;
  }

  async createJob(data: JobCreate): Promise<Job> {
    const response = await this.client.post<Job>('/institution/jobs', data);
    return response.data;
  }

  async getJob(jobId: number): Promise<Job> {
    const response = await this.client.get<Job>(`/institution/jobs/${jobId}`);
    return response.data;
  }

  async updateJob(jobId: number, data: JobUpdate): Promise<Job> {
    const response = await this.client.patch<Job>(`/institution/jobs/${jobId}`, data);
    return response.data;
  }

  async activateJob(jobId: number): Promise<Job> {
    return this.updateJob(jobId, { status: 'active' } as JobUpdate);
  }

  async bulkActivateJobs(jobIds: number[]): Promise<{ message: string; activated_count: number; total_requested: number }> {
    const response = await this.client.post<{ message: string; activated_count: number; total_requested: number }>('/institution/jobs/bulk-activate', jobIds);
    return response.data;
  }

  async getJobMatchingDiagnostics(jobId: number): Promise<{
    job_id: number;
    job_title: string;
    status: string;
    total_candidates: number;
    matching_candidates_count: number;
    matching_candidates: Array<{ candidate_id: number; distance_km: number | null; match_score: number }>;
    non_matching_reasons_summary: { location: number; subject: number; experience: number };
    is_active: boolean;
    message: string;
  }> {
    const response = await this.client.get(`/institution/jobs/${jobId}/matching-diagnostics`);
    return response.data;
  }

  async generateQuestions(jobId: number): Promise<{ message: string; question_ids: number[]; job_id: number }> {
    const response = await this.client.post(`/institution/jobs/${jobId}/generate-questions`);
    return response.data;
  }

  // Screening endpoints
  async startScreening(data: ScreeningStartRequest): Promise<ScreeningAttempt> {
    const response = await this.client.post<ScreeningAttempt>('/screening/start', data);
    return response.data;
  }

  async getScreeningAttempt(attemptId: number): Promise<ScreeningAttempt> {
    const response = await this.client.get<ScreeningAttempt>(`/screening/${attemptId}`);
    return response.data;
  }

  async submitAnswer(attemptId: number, answer: AnswerSubmit): Promise<{
    message: string;
    answer_id: number;
    is_correct: boolean;
    points_awarded: number;
    explanation: string;
  }> {
    const response = await this.client.post(`/screening/${attemptId}/answer`, answer);
    return response.data;
  }

  async submitScreening(attemptId: number): Promise<ScreeningResult> {
    const response = await this.client.post<ScreeningResult>(`/screening/${attemptId}/submit`);
    return response.data;
  }
}

export const api = new ApiClient();

