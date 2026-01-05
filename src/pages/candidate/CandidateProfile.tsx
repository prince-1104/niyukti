import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { api } from '../../lib/api';
import { Upload, Save } from 'lucide-react';
import type { CandidateProfile, CandidateProfileCreate, Subject } from '../../types';

const SUBJECTS: Subject[] = ['science', 'maths', 'social_science', 'ict', 'english', 'hindi', 'kannada', 'marathi'];

export default function CandidateProfile() {
  const [profile, setProfile] = useState<CandidateProfile | null>(null);
  const [resume, setResume] = useState<{ file_path: string; parsed_data: any } | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const { register, handleSubmit, setValue, watch } = useForm<CandidateProfileCreate>({
    defaultValues: {
      max_distance_km: 50,
      experience_years: 0,
    },
  });

  const preferredSubjects = watch('preferred_subjects') || [];

  useEffect(() => {
    loadProfile();
    loadResume();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await api.getCandidateProfile();
      setProfile(data);
      setValue('preferred_city', data.preferred_city || '');
      setValue('preferred_state', data.preferred_state || '');
      setValue('preferred_pincode', data.preferred_pincode || '');
      setValue('max_distance_km', data.max_distance_km);
      setValue('preferred_role', data.preferred_role || '');
      setValue('preferred_subjects', data.preferred_subjects || []);
      setValue('experience_years', data.experience_years || 0);
      setValue('experience_level', data.experience_level || undefined);
    } catch (error: any) {
      if (error.response?.status === 404) {
        // Profile doesn't exist yet, that's okay - user can create it
        setProfile(null);
      } else {
        console.error('Failed to load profile:', error);
        // Don't show error for 404, it's expected if profile doesn't exist
        if (error.response?.status !== 404) {
          setMessage(error.response?.data?.detail || 'Failed to load profile');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const loadResume = async () => {
    try {
      const data = await api.getResume();
      setResume({
        file_path: data.resume_file_path,
        parsed_data: data.parsed_data
      });
    } catch (error: any) {
      if (error.response?.status !== 404) {
        // 404 is expected if no resume uploaded yet
        console.error('Failed to load resume:', error);
      }
    }
  };

  const onSubmit = async (data: CandidateProfileCreate) => {
    setSaving(true);
    setMessage(null);
    try {
      // Ensure experience_years is included if provided
      const submitData: CandidateProfileCreate = {
        ...data,
        experience_years: data.experience_years !== undefined ? data.experience_years : (profile?.experience_years ?? 0),
        experience_level: data.experience_level || profile?.experience_level || undefined,
      };
      
      const updated = profile
        ? await api.updateCandidateProfile(submitData)
        : await api.createCandidateProfile(submitData);
      setProfile(updated);
      setMessage('Profile saved successfully!');
      // Reload to get updated experience values
      await loadProfile();
    } catch (error: any) {
      setMessage(error.response?.data?.detail || 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setMessage(null);
    try {
      await api.uploadResume(file);
      setMessage('Resume uploaded and parsed successfully!');
      await loadProfile(); // Reload to get updated profile
      await loadResume(); // Reload resume info
    } catch (error: any) {
      setMessage(error.response?.data?.detail || 'Failed to upload resume');
    } finally {
      setUploading(false);
    }
  };

  const toggleSubject = (subject: Subject) => {
    const current = preferredSubjects;
    const updated = current.includes(subject)
      ? current.filter((s) => s !== subject)
      : [...current, subject];
    setValue('preferred_subjects', updated);
  };

  if (loading) {
    return <div className="text-center py-12 text-gray-300">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent mb-2">
          Candidate Profile
        </h1>
        <p className="text-gray-300 font-medium">Manage your profile and preferences</p>
      </div>

      {message && (
        <div
          className={`p-4 rounded-xl shadow-md ${
            message.includes('success')
              ? 'bg-gradient-to-r from-green-900/30 to-emerald-900/30 text-green-300 border-2 border-green-500/50'
              : 'bg-gradient-to-r from-red-900/30 to-rose-900/30 text-red-300 border-2 border-red-500/50'
          }`}
        >
          {message}
        </div>
      )}

      {/* Resume Upload */}
      <div className="card">
        <h2 className="text-2xl font-bold text-gray-100 mb-4 flex items-center gap-2">
          <div className="w-1 h-6 bg-gradient-to-b from-primary-400 to-primary-600 rounded-full"></div>
          Resume
        </h2>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            {resume ? (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <p className="text-gray-200 font-semibold">
                    Resume uploaded and parsed
                  </p>
                </div>
                <div className="mt-3 text-sm text-gray-300 space-y-2">
                  <div className="bg-purple-900/30 px-3 py-2 rounded-lg border border-purple-500/30">
                    <span className="font-semibold text-primary-400">File: </span>
                    <span className="text-gray-200">{resume.file_path.split('/').pop() || resume.file_path}</span>
                  </div>
                  {resume.parsed_data && Object.keys(resume.parsed_data).length > 0 && (
                    <div className="mt-4 pt-4 border-t border-purple-500/30">
                      <p className="font-bold text-gray-100 mb-3 text-base">Extracted Information:</p>
                      <p className="text-xs text-gray-400 mb-3 italic">
                        Note: You can edit experience details in the "Experience & Qualifications" section below
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {resume.parsed_data.experience_years !== undefined && (
                          <div className="bg-gradient-to-br from-primary-900/40 to-purple-900/40 p-3 rounded-lg border border-primary-500/30">
                            <span className="font-semibold text-primary-400">Experience (from resume): </span>
                            <span className="text-gray-200">{resume.parsed_data.experience_years} years</span>
                          </div>
                        )}
                        {resume.parsed_data.experience_level && (
                          <div className="bg-gradient-to-br from-primary-900/40 to-purple-900/40 p-3 rounded-lg border border-primary-500/30">
                            <span className="font-semibold text-primary-400">Level (from resume): </span>
                            <span className="text-gray-200 capitalize">{resume.parsed_data.experience_level}</span>
                          </div>
                        )}
                        {resume.parsed_data.subjects && resume.parsed_data.subjects.length > 0 && (
                          <div className="bg-gradient-to-br from-primary-900/40 to-purple-900/40 p-3 rounded-lg border border-primary-500/30 md:col-span-2">
                            <span className="font-semibold text-primary-400">Subjects: </span>
                            <span className="text-gray-200">{resume.parsed_data.subjects.join(', ')}</span>
                          </div>
                        )}
                        {resume.parsed_data.skills && resume.parsed_data.skills.length > 0 && (
                          <div className="bg-gradient-to-br from-primary-900/40 to-purple-900/40 p-3 rounded-lg border border-primary-500/30 md:col-span-2">
                            <span className="font-semibold text-primary-400">Skills: </span>
                            <span className="text-gray-200">{resume.parsed_data.skills.join(', ')}</span>
                          </div>
                        )}
                        {resume.parsed_data.qualifications && resume.parsed_data.qualifications.length > 0 && (
                          <div className="bg-gradient-to-br from-primary-900/40 to-purple-900/40 p-3 rounded-lg border border-primary-500/30 md:col-span-2">
                            <span className="font-semibold text-primary-400">Qualifications: </span>
                            <span className="text-gray-200">{resume.parsed_data.qualifications.join(', ')}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-gray-300">
                Upload your resume (PDF) to get started
              </p>
            )}
          </div>
          <label className="btn-primary cursor-pointer flex items-center gap-2 ml-4">
            <Upload className="w-5 h-5" />
            {uploading ? 'Uploading...' : resume ? 'Replace Resume' : 'Upload Resume'}
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileUpload}
              disabled={uploading}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Experience Section */}
      <div className="card">
        <h2 className="text-2xl font-bold text-gray-100 mb-4 flex items-center gap-2">
          <div className="w-1 h-6 bg-gradient-to-b from-primary-400 to-primary-600 rounded-full"></div>
          Experience & Qualifications
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Years of Experience *
            </label>
            <input
              type="number"
              {...register('experience_years', { valueAsNumber: true, min: 0, max: 50 })}
              className="input-field"
              placeholder="0"
              step="0.5"
              min="0"
              max="50"
            />
            <p className="text-xs text-gray-400 mt-1">
              {profile?.experience_years !== undefined 
                ? `Current: ${profile.experience_years} years`
                : resume?.parsed_data?.experience_years !== undefined
                ? `From resume: ${resume.parsed_data.experience_years} years`
                : 'Enter your total years of teaching experience'}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Experience Level
            </label>
            <select
              {...register('experience_level')}
              className="input-field"
            >
              <option value="">Select level</option>
              <option value="fresh">Fresh (0-1 years)</option>
              <option value="junior">Junior (1-3 years)</option>
              <option value="mid">Mid (3-7 years)</option>
              <option value="senior">Senior (7+ years)</option>
            </select>
            <p className="text-xs text-gray-400 mt-1">
              {profile?.experience_level 
                ? `Current: ${profile.experience_level}`
                : resume?.parsed_data?.experience_level
                ? `From resume: ${resume.parsed_data.experience_level}`
                : 'Select your experience level'}
            </p>
          </div>
        </div>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="card space-y-6">
        <h2 className="text-2xl font-bold text-gray-100 flex items-center gap-2">
          <div className="w-1 h-6 bg-gradient-to-b from-primary-400 to-primary-600 rounded-full"></div>
          Profile Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Preferred City
            </label>
            <input
              type="text"
              {...register('preferred_city')}
              className="input-field"
              placeholder="Bangalore"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Preferred State
            </label>
            <input
              type="text"
              {...register('preferred_state')}
              className="input-field"
              placeholder="Karnataka"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Pincode
            </label>
            <input
              type="text"
              {...register('preferred_pincode')}
              className="input-field"
              placeholder="560001"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Max Distance (km)
            </label>
            <input
              type="number"
              {...register('max_distance_km', { valueAsNumber: true })}
              className="input-field"
              min="1"
              max="500"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Preferred Role
            </label>
            <input
              type="text"
              {...register('preferred_role')}
              className="input-field"
              placeholder="e.g., Primary Math Teacher"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Preferred Subjects
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {SUBJECTS.map((subject) => (
              <label
                key={subject}
                className={`cursor-pointer p-3 border-2 rounded-xl text-center transition-all duration-200 font-medium ${
                  preferredSubjects.includes(subject)
                    ? 'border-primary-500 bg-gradient-to-br from-primary-900/50 to-purple-900/50 text-primary-300 shadow-md'
                    : 'border-purple-500/30 hover:border-purple-500/50 bg-gray-800/50 hover:bg-gray-700/50 text-gray-300'
                }`}
              >
                <input
                  type="checkbox"
                  checked={preferredSubjects.includes(subject)}
                  onChange={() => toggleSubject(subject)}
                  className="sr-only"
                />
                {subject.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="btn-primary flex items-center gap-2"
        >
          <Save className="w-5 h-5" />
          {saving ? 'Saving...' : 'Save Profile'}
        </button>
      </form>
    </div>
  );
}

