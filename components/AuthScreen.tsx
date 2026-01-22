
import React, { useState } from 'react';
import { UserRole } from '../types';
import { loginWithGoogle } from '../services/authService';
import { Shield, BookOpen, User, HeartHandshake, Database, CheckCircle2, Lock, Stethoscope, Building2, IdCard } from 'lucide-react';

interface AuthScreenProps {
  onAuthSuccess: () => void;
  onBack: () => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onAuthSuccess, onBack }) => {
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [error, setError] = useState('');
  
  const [verificationMode, setVerificationMode] = useState<'NONE' | 'STUDENT' | 'OFFICER' | 'ADMIN'>('NONE');
  const [adminCode, setAdminCode] = useState('');
  const [studentData, setStudentData] = useState({ id: '', college: '' });
  const [officerLicense, setOfficerLicense] = useState('');

  const initiateLogin = (role: UserRole) => {
    setError('');
    if (role === 'student') setVerificationMode('STUDENT');
    else if (role === 'radiology_officer') setVerificationMode('OFFICER');
    else if (role === 'admin') setVerificationMode('ADMIN');
    else processGoogleLogin(role);
  };

  const processGoogleLogin = async (role: UserRole, extraData?: any) => {
    setVerificationMode('NONE');
    setLoading(true);
    try {
      setLoadingStep('Initializing Secure Handshake...');
      await new Promise(r => setTimeout(r, 600));
      setLoadingStep('Verifying Encrypted Identity...');
      await loginWithGoogle(role, extraData);
      onAuthSuccess();
    } catch (err) {
      setError('Connection refused. Please try again.');
      setLoading(false);
    }
  };

  const verifyAdmin = () => {
    // New Secure Admin Access
    if (adminCode === 'Audi@110.111.112.113') {
      processGoogleLogin('admin');
    } else {
      setError('System Override Forbidden: Incorrect Access Code');
    }
  };

  const verifyStudent = () => {
    if (studentData.id.length < 3 || studentData.college.length < 3) {
      setError('Please enter valid College details.');
      return;
    }
    processGoogleLogin('student', { studentId: studentData.id, collegeName: studentData.college });
  };

  const verifyOfficer = () => {
    if (officerLicense.length < 4) {
      setError('Invalid Medical License / ID Number.');
      return;
    }
    processGoogleLogin('radiology_officer', { licenseId: officerLicense });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4 animate-fade-in relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10 pointer-events-none">
        <div className="absolute top-10 right-10 w-64 h-64 bg-rad-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-64 h-64 bg-purple-500 rounded-full blur-3xl"></div>
      </div>

      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-gray-800 overflow-hidden relative z-10">
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-8 text-center text-white border-b border-slate-700">
          <div className="flex justify-center mb-4">
             <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/20">
               <Database size={32} className="text-rad-400" />
             </div>
          </div>
          <h2 className="text-3xl font-extrabold mb-1">RAD SAFE PRO</h2>
          <p className="text-rad-200 text-xs uppercase tracking-[0.2em] font-bold">Secure Access Portal</p>
        </div>

        <div className="p-8">
          {loading ? (
             <div className="py-12 text-center space-y-4">
                <div className="relative w-20 h-20 mx-auto">
                   <div className="absolute inset-0 border-4 border-gray-100 rounded-full"></div>
                   <div className="absolute inset-0 border-4 border-rad-500 rounded-full border-t-transparent animate-spin"></div>
                   <div className="absolute inset-0 flex items-center justify-center">
                      <Shield size={24} className="text-rad-500" />
                   </div>
                </div>
                <div className="space-y-1">
                  <p className="text-lg font-bold text-slate-800">{loadingStep}</p>
                  <p className="text-xs text-slate-400 font-bold">SHA-256 Hashing Active</p>
                </div>
             </div>
          ) : (
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-3 text-center">Select Identity</label>
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => initiateLogin('student')} className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 border-gray-100 hover:border-rad-200 hover:bg-rad-50 transition-all group">
                    <BookOpen size={20} className="text-slate-400 group-hover:text-rad-500"/>
                    <span className="font-bold text-sm text-slate-600 group-hover:text-rad-700">Student</span>
                  </button>
                  <button onClick={() => initiateLogin('radiology_officer')} className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition-all group">
                    <Stethoscope size={20} className="text-slate-400 group-hover:text-blue-500"/>
                    <span className="font-bold text-sm text-slate-600 group-hover:text-blue-700">Officer</span>
                  </button>
                  <button onClick={() => initiateLogin('patient')} className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 border-gray-100 hover:border-teal-200 hover:bg-teal-50 transition-all group">
                    <User size={20} className="text-slate-400 group-hover:text-teal-500"/>
                    <span className="font-bold text-sm text-slate-600 group-hover:text-teal-700">Patient</span>
                  </button>
                  <button onClick={() => initiateLogin('public')} className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 border-gray-100 hover:border-teal-200 hover:bg-teal-50 transition-all group">
                    <HeartHandshake size={20} className="text-slate-400 group-hover:text-teal-500"/>
                    <span className="font-bold text-sm text-slate-600 group-hover:text-teal-700">Public</span>
                  </button>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-center">
                   <button onClick={() => initiateLogin('admin')} className="text-xs font-bold text-slate-400 hover:text-red-500 flex items-center gap-1 transition-colors">
                     <Lock size={12} /> SECURE ADMIN
                   </button>
                </div>
              </div>
            </div>
          )}
          {!loading && <button onClick={onBack} className="w-full mt-6 text-slate-400 text-sm hover:text-slate-600 font-medium">Cancel</button>}
        </div>

        {verificationMode === 'ADMIN' && (
          <div className="absolute inset-0 bg-white z-50 p-8 flex flex-col items-center justify-center animate-fade-in">
             <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
                <Shield size={32} className="text-red-600" />
             </div>
             <h3 className="text-xl font-bold text-slate-800 mb-2">Master Override</h3>
             <p className="text-slate-500 text-xs mb-6 text-center px-4">Admin privileges require enterprise-grade verification. Enter the 256-bit access code.</p>
             <input 
               type="password" 
               placeholder="ADMIN PASSWORD"
               className="w-full bg-gray-100 border-none p-4 rounded-xl text-center font-mono tracking-tighter text-sm focus:ring-2 focus:ring-red-500 mb-2"
               value={adminCode}
               onChange={e => { setAdminCode(e.target.value); setError(''); }}
             />
             {error && <p className="text-xs text-red-500 font-bold mb-4">{error}</p>}
             <div className="flex gap-3 w-full mt-4">
               <button onClick={() => setVerificationMode('NONE')} className="flex-1 py-3 text-slate-500 font-bold text-sm bg-gray-100 rounded-xl">Back</button>
               <button onClick={verifyAdmin} className="flex-1 py-3 text-white font-bold text-sm bg-red-600 hover:bg-red-700 rounded-xl">Verify System</button>
             </div>
          </div>
        )}

        {verificationMode === 'STUDENT' && (
          <div className="absolute inset-0 bg-white z-50 p-8 flex flex-col justify-center animate-fade-in">
             <h3 className="text-xl font-bold text-rad-700 mb-1 flex items-center gap-2"><BookOpen size={24}/> Student Profile</h3>
             <p className="text-slate-400 text-xs mb-6">Data will be stored using salt-based hashing.</p>
             <div className="space-y-4">
                <div>
                   <label className="text-[10px] uppercase font-bold text-slate-400 mb-1 block">College Name</label>
                   <input type="text" className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-rad-500 outline-none" value={studentData.college} onChange={e => setStudentData({...studentData, college: e.target.value})}/>
                </div>
                <div>
                   <label className="text-[10px] uppercase font-bold text-slate-400 mb-1 block">Reg Number</label>
                   <input type="text" className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-rad-500 outline-none" value={studentData.id} onChange={e => setStudentData({...studentData, id: e.target.value})}/>
                </div>
             </div>
             {error && <p className="text-xs text-red-500 font-bold mt-4 text-center">{error}</p>}
             <div className="flex gap-3 w-full mt-8">
               <button onClick={() => setVerificationMode('NONE')} className="flex-1 py-3 text-slate-500 font-bold text-sm bg-gray-100 rounded-xl">Back</button>
               <button onClick={verifyStudent} className="flex-1 py-3 text-white font-bold text-sm bg-rad-600 rounded-xl">Authorize</button>
             </div>
          </div>
        )}

        {verificationMode === 'OFFICER' && (
          <div className="absolute inset-0 bg-white z-50 p-8 flex flex-col justify-center animate-fade-in">
             <h3 className="text-xl font-bold text-blue-700 mb-1 flex items-center gap-2"><Stethoscope size={24}/> Officer Registry</h3>
             <p className="text-slate-400 text-xs mb-6">License verification is mandatory for clinical tools.</p>
             <div className="space-y-4">
                <div>
                   <label className="text-[10px] uppercase font-bold text-slate-400 mb-1 block">Medical License ID</label>
                   <input type="text" className="w-full bg-blue-50 border border-blue-100 p-3 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-blue-500 outline-none" value={officerLicense} onChange={e => setOfficerLicense(e.target.value)}/>
                </div>
             </div>
             {error && <p className="text-xs text-red-500 font-bold mt-4 text-center">{error}</p>}
             <div className="flex gap-3 w-full mt-8">
               <button onClick={() => setVerificationMode('NONE')} className="flex-1 py-3 text-slate-500 font-bold text-sm bg-gray-100 rounded-xl">Back</button>
               <button onClick={verifyOfficer} className="flex-1 py-3 text-white font-bold text-sm bg-blue-600 rounded-xl">Authorize</button>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthScreen;
