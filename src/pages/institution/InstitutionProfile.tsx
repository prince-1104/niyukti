import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { api } from '../../lib/api';
import { Save } from 'lucide-react';
import type { InstitutionProfile, InstitutionProfileCreate } from '../../types';

export default function InstitutionProfile() {
  const [profile, setProfile] = useState<InstitutionProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const { register, handleSubmit, setValue } = useForm<InstitutionProfileCreate>();

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await api.getInstitutionProfile();
      setProfile(data);
      setValue('name', data.name);
      setValue('type', data.type || '');
      setValue('board_affiliation', data.board_affiliation || '');
      setValue('city', data.city);
      setValue('state', data.state);
      setValue('pincode', data.pincode || '');
      setValue('contact_email', data.contact_email || '');
      setValue('contact_phone', data.contact_phone || '');
      setValue('website', data.website || '');
    } catch (error: any) {
      if (error.response?.status === 404) {
        // Profile doesn't exist yet
      } else {
        console.error('Failed to load profile:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: InstitutionProfileCreate) => {
    setSaving(true);
    setMessage(null);
    try {
      // Validate required fields
      if (!data.name?.trim()) {
        setMessage('Institution name is required');
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
      
      // Clean up empty strings and convert to null/undefined for optional fields
      const cleanedData: any = {
        name: data.name.trim(),
        city: data.city.trim(),
        state: data.state.trim(),
      };
      
      // Add optional fields only if they have values
      if (data.type?.trim()) cleanedData.type = data.type.trim();
      if (data.board_affiliation?.trim()) cleanedData.board_affiliation = data.board_affiliation.trim();
      if (data.pincode?.trim()) cleanedData.pincode = data.pincode.trim();
      if (data.contact_email?.trim()) cleanedData.contact_email = data.contact_email.trim();
      if (data.contact_phone?.trim()) cleanedData.contact_phone = data.contact_phone.trim();
      if (data.website?.trim()) cleanedData.website = data.website.trim();
      
      const updated = profile
        ? await api.updateInstitutionProfile(cleanedData)
        : await api.createInstitutionProfile(cleanedData);
      setProfile(updated);
      setMessage('Profile saved successfully!');
    } catch (error: any) {
      console.error('Profile save error:', error);
      let errorMessage = 'Failed to save profile';
      if (error.response?.data) {
        if (error.response.data.detail) {
          errorMessage = error.response.data.detail;
        } else if (error.response.data.errors) {
          // Format validation errors
          const errors = error.response.data.errors;
          if (Array.isArray(errors)) {
            errorMessage = errors.map((e: any) => `${e.loc?.join('.')}: ${e.msg}`).join(', ');
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

  if (loading) {
    return <div className="text-center py-12 text-gray-300">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">Institution Profile</h1>
        <p className="text-gray-300 mt-2">Manage your institution information</p>
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
        <h2 className="text-xl font-semibold">Basic Information</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Institution Name *
            </label>
            <input
              type="text"
              {...register('name', { required: true })}
              className="input-field"
              placeholder="ABC School"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Type
            </label>
            <select {...register('type')} className="input-field">
              <option value="">Select type</option>
              <option value="school">School</option>
              <option value="college">College</option>
              <option value="university">University</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Board Affiliation
            </label>
            <input
              type="text"
              {...register('board_affiliation')}
              className="input-field"
              placeholder="CBSE, ICSE, etc."
            />
          </div>
        </div>

        <h2 className="text-xl font-semibold pt-4 border-t">Location</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              Pincode
            </label>
            <input
              type="text"
              {...register('pincode')}
              className="input-field"
              placeholder="560001"
            />
          </div>
        </div>

        <h2 className="text-xl font-semibold pt-4 border-t">Contact Information</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Contact Email
            </label>
            <input
              type="email"
              {...register('contact_email')}
              className="input-field"
              placeholder="contact@school.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Contact Phone
            </label>
            <input
              type="tel"
              {...register('contact_phone')}
              className="input-field"
              placeholder="+91 9876543210"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Website
            </label>
            <input
              type="url"
              {...register('website')}
              className="input-field"
              placeholder="https://www.school.com"
            />
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

