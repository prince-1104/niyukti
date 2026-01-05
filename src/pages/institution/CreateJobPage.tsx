import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { api } from '../../lib/api';
import { Save, Sparkles } from 'lucide-react';
import type { JobCreate, Subject, ExperienceLevel } from '../../types';

const SUBJECTS: Subject[] = ['science', 'maths', 'social_science', 'ict', 'english', 'hindi', 'kannada', 'marathi'];
const EXPERIENCE_LEVELS: ExperienceLevel[] = ['fresh', 'junior', 'mid', 'senior'];

export default function CreateJobPage() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [createdJobId, setCreatedJobId] = useState<number | null>(null);

  const { register, handleSubmit } = useForm<JobCreate>({
    defaultValues: {
      max_distance_km: 50,
      required_experience_years: 0,
      screening_question_count: 10,
      passing_score_threshold: 70,
    },
  });

  const onSubmit = async (data: JobCreate) => {
    setSaving(true);
    setMessage(null);
    try {
      // Validate required fields
      if (!data.title?.trim()) {
        setMessage('Job title is required');
        setSaving(false);
        return;
      }
      if (!data.role?.trim()) {
        setMessage('Role is required');
        setSaving(false);
        return;
      }
      if (!data.subject) {
        setMessage('Subject is required');
        setSaving(false);
        return;
      }
      if (!data.city?.trim()) {
        setMessage('City is required');
        setSaving(false);
        return;
      }
      if (!data.state?.trim()) {
        setMessage('State is required');
        setSaving(false);
        return;
      }

      // Clean up data - remove empty strings, ensure proper types
      const cleanedData: any = {
        title: data.title.trim(),
        role: data.role.trim(),
        subject: data.subject,
        city: data.city.trim(),
        state: data.state.trim(),
        max_distance_km: data.max_distance_km || 50,
        required_experience_years: data.required_experience_years ?? 0,
        screening_question_count: data.screening_question_count || 10,
        passing_score_threshold: data.passing_score_threshold || 70,
      };

      // Add optional fields only if they have values
      if (data.pincode?.trim()) cleanedData.pincode = data.pincode.trim();
      if (data.required_experience_level) cleanedData.required_experience_level = data.required_experience_level;
      if (data.required_qualifications && data.required_qualifications.length > 0) {
        cleanedData.required_qualifications = data.required_qualifications;
      }
      if (data.required_skills && data.required_skills.length > 0) {
        cleanedData.required_skills = data.required_skills;
      }

      const job = await api.createJob(cleanedData);
      setCreatedJobId(job.id);
      setMessage('Job created successfully!');
    } catch (error: any) {
      console.error('Job creation error:', error);
      let errorMessage = 'Failed to create job';
      if (error.response?.data) {
        if (error.response.data.detail) {
          errorMessage = error.response.data.detail;
        } else if (error.response.data.errors) {
          // Format validation errors
          const errors = error.response.data.errors;
          if (Array.isArray(errors)) {
            errorMessage = errors.map((e: any) => {
              const field = e.loc?.join('.') || 'unknown';
              return `${field}: ${e.msg}`;
            }).join(', ');
          } else {
            errorMessage = JSON.stringify(errors);
          }
        }
      }
      setMessage(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleGenerateQuestions = async () => {
    if (!createdJobId) {
      setMessage('Please create the job first');
      return;
    }

    setGenerating(true);
    setMessage(null);
    try {
      await api.generateQuestions(createdJobId);
      setMessage('Questions generated successfully!');
      navigate(`/institution/jobs/${createdJobId}`);
    } catch (error: any) {
      setMessage(error.response?.data?.detail || 'Failed to generate questions');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">Create Job Posting</h1>
        <p className="text-gray-300 mt-2">Post a new job opportunity</p>
      </div>

      {message && (
        <div
          className={`p-4 rounded-xl ${
            message.includes('success')
              ? 'bg-green-900/30 text-green-300 border-2 border-green-500/50'
              : 'bg-red-900/30 text-red-300 border-2 border-red-500/50'
          }`}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="card space-y-6">
        <h2 className="text-xl font-semibold">Job Details</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Job Title *
            </label>
            <input
              type="text"
              {...register('title', { required: true })}
              className="input-field"
              placeholder="e.g., Primary Math Teacher"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Role *
            </label>
            <input
              type="text"
              {...register('role', { required: true })}
              className="input-field"
              placeholder="e.g., Subject Teacher"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Subject *
            </label>
            <select {...register('subject', { required: true })} className="input-field">
              <option value="">Select subject</option>
              {SUBJECTS.map((subject) => (
                <option key={subject} value={subject}>
                  {subject.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                </option>
              ))}
            </select>
          </div>
        </div>

        <h2 className="text-xl font-semibold pt-4 border-t">Location</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              City *
            </label>
            <input
              type="text"
              {...register('city', { required: true })}
              className="input-field"
              placeholder="Bangalore"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              State *
            </label>
            <input
              type="text"
              {...register('state', { required: true })}
              className="input-field"
              placeholder="Karnataka"
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
        </div>

        <h2 className="text-xl font-semibold pt-4 border-t">Requirements</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Required Experience (years)
            </label>
            <input
              type="number"
              {...register('required_experience_years', { valueAsNumber: true })}
              className="input-field"
              min="0"
              step="0.5"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Experience Level
            </label>
            <select {...register('required_experience_level')} className="input-field">
              <option value="">Any level</option>
              {EXPERIENCE_LEVELS.map((level) => (
                <option key={level} value={level}>
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <h2 className="text-xl font-semibold pt-4 border-t">Screening Configuration</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Number of Questions
            </label>
            <input
              type="number"
              {...register('screening_question_count', { valueAsNumber: true })}
              className="input-field"
              min="5"
              max="50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Passing Score Threshold (%)
            </label>
            <input
              type="number"
              {...register('passing_score_threshold', { valueAsNumber: true })}
              className="input-field"
              min="0"
              max="100"
            />
          </div>
        </div>

        <div className="flex items-center gap-4 pt-4 border-t">
          <button
            type="submit"
            disabled={saving}
            className="btn-primary flex items-center gap-2"
          >
            <Save className="w-5 h-5" />
            {saving ? 'Creating...' : 'Create Job'}
          </button>

          {createdJobId && (
            <button
              type="button"
              onClick={handleGenerateQuestions}
              disabled={generating}
              className="btn-secondary flex items-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              {generating ? 'Generating...' : 'Generate Questions'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

