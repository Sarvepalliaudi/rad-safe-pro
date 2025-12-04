
import React, { useState } from 'react';
import { UserRole } from '../types';
import { loginUser, registerUser, loginWithGoogle } from '../services/authService';
import { User, Lock, Mail, ChevronRight, Shield, HeartHandshake, BookOpen, Loader2 } from 'lucide-react';

interface AuthScreenProps {
  onAuthSuccess: () => void;
  onBack: () => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onAuthSuccess, onBack }) => {
  const [mode, setMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('student');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'LOGIN') {
        await loginUser(email, password);
      } else {
        await registerUser(email, password, name, role);
      }
      onAuthSuccess();
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      await loginWithGoogle();
      onAuthSuccess();
    } catch (err) {
      setError('Google Sign-In simulation failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 animate-fade-in">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        
        {/* Header */}
        <div className="bg-rad-600 p-8 text-center text-white">
          <h2 className="text-3xl font-extrabold mb-1">RAD SAFE PRO</h2>
          <p className="text-rad-100 text-sm uppercase tracking-wide">Secure Access Portal</p>
        </div>

        <div className="p-8">
          <div className="flex justify-center gap-4 mb-6 border-b border-gray-100 pb-2">
            <button 
              onClick={() => { setMode('LOGIN'); setError(''); }} 
              className={`pb-2 text-sm font-bold transition-colors ${mode === 'LOGIN' ? 'text-rad-600 border-b-2 border-rad-600' : 'text-slate-400'}`}
            >
              SIGN IN
            </button>
            <button 
              onClick={() => { setMode('REGISTER'); setError(''); }} 
              className={`pb-2 text-sm font-bold transition-colors ${mode === 'REGISTER' ? 'text-rad-600 border-b-2 border-rad-600' : 'text-slate-400'}`}
            >
              CREATE ACCOUNT
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'REGISTER' && (
              <div className="space-y-4">
                <div className="relative">
                  <User className="absolute left-3 top-3 text-slate-400" size={18} />
                  <input 
                    type="text" 
                    required 
                    placeholder="Full Name" 
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rad-500 focus:bg-white transition-all outline-none"
                  />
                </div>

                <div>
                   <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Select Your Role</label>
                   <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: 'student', label: 'Student', icon: <BookOpen size={16}/> },
                        { id: 'officer', label: 'Officer', icon: <Shield size={16}/> },
                        { id: 'patient', label: 'Patient', icon: <User size={16}/> },
                        { id: 'public', label: 'Public', icon: <HeartHandshake size={16}/> }
                      ].map(r => (
                        <button
                          key={r.id}
                          type="button"
                          onClick={() => setRole(r.id as UserRole)}
                          className={`flex items-center gap-2 p-2 rounded-lg border text-sm transition-all ${
                            role === r.id 
                            ? 'bg-rad-50 border-rad-500 text-rad-700 font-bold' 
                            : 'bg-white border-gray-200 text-slate-500 hover:bg-gray-50'
                          }`}
                        >
                          {r.icon} {r.label}
                        </button>
                      ))}
                   </div>
                </div>
              </div>
            )}

            <div className="relative">
              <Mail className="absolute left-3 top-3 text-slate-400" size={18} />
              <input 
                type="email" 
                required 
                placeholder="Email Address" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rad-500 focus:bg-white transition-all outline-none"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-3 text-slate-400" size={18} />
              <input 
                type="password" 
                required 
                placeholder="Password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rad-500 focus:bg-white transition-all outline-none"
              />
            </div>

            {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2"><Shield size={16}/> {error}</div>}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-rad-600 hover:bg-rad-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-rad-200 transition-all flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="animate-spin" size={20} />}
              {mode === 'LOGIN' ? 'Sign In' : 'Register Now'}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-slate-400">Or continue with</span>
              </div>
            </div>

            <button 
              onClick={handleGoogleLogin}
              disabled={loading}
              className="mt-4 w-full flex items-center justify-center gap-2 bg-white border border-gray-200 text-slate-700 font-bold py-3 rounded-xl hover:bg-gray-50 transition-all"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google Account
            </button>
          </div>

          <button onClick={onBack} className="w-full mt-4 text-slate-400 text-sm hover:text-slate-600">
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;
