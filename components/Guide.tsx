
import React from 'react';
import { Book, Info } from 'lucide-react';
import { USER_GUIDE } from '../constants';

const Guide: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-slate-200 text-slate-700 rounded-lg">
           <Book size={28} />
        </div>
        <div>
           <h2 className="text-3xl font-bold text-slate-800">User Manual</h2>
           <p className="text-slate-500">Zero to Hero Guide for RAD SAFE PRO</p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
         {USER_GUIDE.split('\n').map((line, i) => {
           // Header 1
           if (line.startsWith('# ')) 
             return <h1 key={i} className="text-3xl font-bold mb-6 text-slate-900 border-b pb-4">{line.replace('# ', '')}</h1>;
           
           // Header 2
           if (line.startsWith('## ')) 
             return (
               <div key={i} className="flex items-center gap-2 mt-10 mb-4 text-rad-700">
                 <Info size={20} className="shrink-0" />
                 <h2 className="text-xl font-bold uppercase tracking-wide">{line.replace('## ', '')}</h2>
               </div>
             );
           
           // Header 3
           if (line.startsWith('### ')) 
             return <h3 key={i} className="text-lg font-bold mt-6 mb-2 text-slate-800">{line.replace('### ', '')}</h3>;
           
           // List items
           if (line.startsWith('* ') || line.startsWith('- ')) 
             return (
               <li key={i} className="ml-6 mb-2 list-disc text-slate-600 pl-1">
                 <span dangerouslySetInnerHTML={{ __html: line.substring(2).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
               </li>
             );
             
           // Ordered list rough approximation
           if (/^\d+\./.test(line))
              return (
                <div key={i} className="ml-6 mb-2 text-slate-600 flex gap-2">
                  <span className="font-bold text-rad-600">{line.split('.')[0]}.</span>
                  <span dangerouslySetInnerHTML={{ __html: line.substring(line.indexOf('.') + 1).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                </div>
              );

           // Horizontal Rule
           if (line.includes('---'))
             return <hr key={i} className="my-8 border-gray-100" />;

           // Paragraphs
           if (line.trim() !== '')
             return <p key={i} className="mb-3 text-slate-600 leading-relaxed" dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />;
           
           return <div key={i} className="h-2"></div>;
         })}
      </div>
    </div>
  );
};

export default Guide;
