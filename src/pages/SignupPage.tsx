import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { UserPlus, Mail, Lock, User, Phone } from 'lucide-react';

const signupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  role: z.enum(['candidate', 'institution']),
  phone: z.string().optional(),
});

type SignupFormData = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      role: 'candidate',
    },
  });

  const selectedRole = watch('role');

  const onSubmit = async (data: SignupFormData) => {
    setError(null);
    setLoading(true);
    try {
      await signup(data);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 px-4 py-12">
      <div className="max-w-md w-full">
        <div className="bg-gray-900/95 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-purple-500/30">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl mb-4 shadow-lg">
              <span className="text-2xl font-bold text-white">N</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
            <p className="text-gray-400">Join Niyukti to get started</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {error && (
              <div className="bg-red-900/30 border border-red-500/50 text-red-300 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                I am a
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className={`cursor-pointer p-4 border-2 rounded-xl transition-all duration-200 ${
                  selectedRole === 'candidate'
                    ? 'border-purple-500 bg-purple-500/20 shadow-lg'
                    : 'border-purple-500/30 hover:border-purple-500/50 bg-gray-800/50'
                }`}>
                  <input
                    type="radio"
                    value="candidate"
                    {...register('role')}
                    className="sr-only"
                  />
                  <div className="text-center">
                    <div className={`font-medium ${selectedRole === 'candidate' ? 'text-white' : 'text-gray-300'}`}>Candidate</div>
                    <div className={`text-xs mt-1 ${selectedRole === 'candidate' ? 'text-gray-300' : 'text-gray-500'}`}>Educator</div>
                  </div>
                </label>
                <label className={`cursor-pointer p-4 border-2 rounded-xl transition-all duration-200 ${
                  selectedRole === 'institution'
                    ? 'border-purple-500 bg-purple-500/20 shadow-lg'
                    : 'border-purple-500/30 hover:border-purple-500/50 bg-gray-800/50'
                }`}>
                  <input
                    type="radio"
                    value="institution"
                    {...register('role')}
                    className="sr-only"
                  />
                  <div className="text-center">
                    <div className={`font-medium ${selectedRole === 'institution' ? 'text-white' : 'text-gray-300'}`}>Institution</div>
                    <div className={`text-xs mt-1 ${selectedRole === 'institution' ? 'text-gray-300' : 'text-gray-500'}`}>School/College</div>
                  </div>
                </label>
              </div>
            </div>

            <div>
              <label htmlFor="full_name" className="block text-sm font-medium text-gray-300 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="full_name"
                  type="text"
                  {...register('full_name')}
                  className="w-full pl-12 pr-4 py-3 border-2 border-purple-500/30 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none bg-gray-800/50 text-gray-100 placeholder-gray-500 hover:border-purple-500/50 transition-all duration-200"
                  placeholder={selectedRole === 'candidate' ? 'John Doe' : 'ABC School'}
                />
              </div>
              {errors.full_name && (
                <p className="mt-1 text-sm text-red-400">{errors.full_name.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  {...register('email')}
                  className="w-full pl-12 pr-4 py-3 border-2 border-purple-500/30 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none bg-gray-800/50 text-gray-100 placeholder-gray-500 hover:border-purple-500/50 transition-all duration-200"
                  placeholder="you@example.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="password"
                  type="password"
                  {...register('password')}
                  className="w-full pl-12 pr-4 py-3 border-2 border-purple-500/30 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none bg-gray-800/50 text-gray-100 placeholder-gray-500 hover:border-purple-500/50 transition-all duration-200"
                  placeholder="••••••••"
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-400">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
                Phone <span className="text-gray-500">(Optional)</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="phone"
                  type="tel"
                  {...register('phone')}
                  className="w-full pl-12 pr-4 py-3 border-2 border-purple-500/30 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none bg-gray-800/50 text-gray-100 placeholder-gray-500 hover:border-purple-500/50 transition-all duration-200"
                  placeholder="+91 9876543210"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3.5 rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <UserPlus className="w-5 h-5" />
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-700">
            <p className="text-center text-sm text-gray-400">
              Already have an account?{' '}
              <Link to="/login" className="text-purple-400 hover:text-purple-300 font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
