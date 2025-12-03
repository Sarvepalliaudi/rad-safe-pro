import React from 'react';
import { Smartphone, Monitor, Command, FileCode, ExternalLink } from 'lucide-react';
import { APP_METADATA } from '../constants';

const iconMap: Record<string, React.ReactNode> = {
  Smartphone: <Smartphone size={24} />,
  Monitor: <Monitor size={24} />,
  Command: <Command size={24} />,
  FileCode: <FileCode size={24} />,
};

const Downloads: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-800">Download RAD SAFE PRO</h2>
        <p className="text-slate-500 mt-2">Get the app for your preferred platform.</p>
      </div>

      <div className="space-y-4">
        {APP_METADATA.downloads.map((item, idx) => (
          <a 
            key={idx}
            href={item.url}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-4 p-5 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:border-rad-400 transition-all group"
          >
            <div className="p-3 bg-rad-50 text-rad-600 rounded-full group-hover:bg-rad-100 transition-colors">
              {iconMap[item.icon]}
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-slate-700 group-hover:text-rad-700 transition-colors">{item.label}</h3>
              <p className="text-xs text-slate-400">Latest Version: {APP_METADATA.version}</p>
            </div>
            <ExternalLink size={18} className="text-slate-300 group-hover:text-rad-400" />
          </a>
        ))}
      </div>

      <div className="mt-12 p-6 bg-slate-50 rounded-xl border border-dashed border-slate-300 text-center">
        <p className="text-sm text-slate-500">
          <strong>Note for Developers:</strong> This is a Progressive Web App (PWA). You can also install it directly from your browser by selecting "Add to Home Screen".
        </p>
      </div>
    </div>
  );
};

export default Downloads;