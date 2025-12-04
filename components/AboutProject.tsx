
import React from 'react';
import { Users, MapPin, Award, GraduationCap } from 'lucide-react';

const AboutProject: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      {/* Header Section */}
      <div className="text-center mb-10">
        <div className="inline-block p-4 bg-rad-50 rounded-full mb-4">
          <Award size={48} className="text-rad-600" />
        </div>
        <h4 className="text-3xl font-extrabold text-slate-800 mb-2">Hackathon Project 2025-26</h4>
        <p className="text-rad-600 font-medium">Department of Allied Health Science & Engineering Technology</p>
      </div>

      {/* University Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-8">
        <div className="bg-slate-800 p-6 text-white text-center">
          <GraduationCap size={32} className="mx-auto mb-3 text-rad-300" />
          <h3 className="text-xl font-bold uppercase tracking-wider">Dhanalakshmi Srinivasan University</h3>
          <p className="text-slate-300 text-sm mt-1">Samayapuram, Trichy - 621 112</p>
        </div>
        <div className="p-6 text-center border-b border-gray-100">
          <p className="font-semibold text-slate-700">School of Allied Health Science</p>
          <span className="text-slate-400 text-xs">&</span>
          <p className="font-semibold text-slate-700">School of Engineering and Technology</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Guide Section */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 border-l-4 border-l-purple-500">
          <h4 className="flex items-center gap-2 font-bold text-slate-800 mb-4">
            <Users className="text-purple-500" size={20} /> Project Guide
          </h4>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-lg">
              N
            </div>
            <div>
              <p className="font-bold text-slate-700">Prof. Nivethitha</p>
              <p className="text-xs text-slate-500">Assistant Professor</p>
              <p className="text-xs text-purple-600 font-medium mt-1">School Of Allied Health Science</p>
            </div>
          </div>
        </div>

      {/* Team Members List */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-green-200 border-l-4 border-l-green-500">
        <h4 className="font-bold text-slate-800 mb-6 flex items-center gap-2 pb-4 border-b border-gray-100">
          <Users className="text-rad-600" size={20} />
          <div>
          <p className="font-bold text-slate-600" >Core Team Members </p>
          <p className="text-xs text-green-600 font-medium mt-1">Idea & Medical Team</p>
          </div>
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { name: "Keerthivasan J", dept: "Dept of RIT / AHS / DSU" },
            { name: "Madhavan RD", dept: "Dept of RIT / AHS / DSU" },
            { name: "Shalini M", dept: "Dept of RIT / AHS / DSU" },
            { name: "Navya K", dept: "Dept of RIT / AHS / DSU" },
            { name: "Thilakesh TM", dept: "Dept of BME / SET / DSU" }
          ].map((member, idx) => (
            <div key={idx} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="w-2 h-2 rounded-full bg-green-400"></div>
              <div>
                <p className="font-semibold text-slate-700 text-sm">{member.name}</p>
                <p className="text-[10px] text-slate-400 uppercase tracking-wide">{member.dept}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

        {/* Developer Section */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 border-l-4 border-l-blue-500">
            <h4 className="flex items-center gap-2 font-bold text-slate-800 mb-4">
                <Users className="text-blue-500" size={20} /> Member & Developer
            </h4>
            <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">
                S
                </div>
                <div>
                <p className="font-bold text-slate-700">Sarvepalli Audi Siva Bhanuvardhan</p>
                <p className="text-xs text-slate-500">Dept of CYS / SET / DSU</p>
                <p className="text-xs text-blue-600 font-medium mt-1">Full Stack & AI Integration</p>
                </div>
            </div>
        </div>
      </div>

      <div className="mt-8 text-center text-slate-400 text-xs">
        <p className="flex items-center justify-center gap-1">
          <MapPin size={20} /> Designed & Developed at Dhanalakshmi Srinivasan University Campus, Trichy , 621 112
        </p>
      </div>
    </div>
  );
};

export default AboutProject;
