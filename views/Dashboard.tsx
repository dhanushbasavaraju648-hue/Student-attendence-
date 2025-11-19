import React from 'react';
import { Student } from '../types';
import { Users, ShieldAlert, Activity, Database } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DashboardProps {
  students: Student[];
}

export const Dashboard: React.FC<DashboardProps> = ({ students }) => {
  const stats = [
    { 
      label: 'Registered Students', 
      value: students.length, 
      icon: Users, 
      color: 'text-blue-600', 
      bg: 'bg-blue-50' 
    },
    { 
      label: 'Total Face Samples', 
      value: students.reduce((acc, s) => acc + s.sampleCount, 0), 
      icon: Database, 
      color: 'text-indigo-600', 
      bg: 'bg-indigo-50' 
    },
    { 
      label: 'Security Level', 
      value: 'High', 
      icon: ShieldAlert, 
      color: 'text-emerald-600', 
      bg: 'bg-emerald-50' 
    },
    { 
      label: 'Model Status', 
      value: students.length > 0 ? 'Ready' : 'Waiting', 
      icon: Activity, 
      color: 'text-amber-600', 
      bg: 'bg-amber-50' 
    },
  ];

  const chartData = students.map((s, idx) => ({
    name: `S-${s.studentId}`,
    samples: s.sampleCount,
  }));

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 transition-all hover:shadow-md">
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.bg} p-3 rounded-xl`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <span className={`text-2xl font-bold text-slate-900`}>{stat.value}</span>
              </div>
              <p className="text-sm font-medium text-slate-500">{stat.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Registrations List */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-800">Recent Registrations</h3>
            <button className="text-sm text-indigo-600 font-medium hover:text-indigo-700">View All</button>
          </div>
          
          {students.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400 border-2 border-dashed border-slate-100 rounded-xl">
              <Users className="w-12 h-12 mb-3 opacity-20" />
              <p>No students registered yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-xs text-slate-500 uppercase tracking-wider border-b border-slate-100">
                    <th className="pb-3 font-semibold pl-2">Student</th>
                    <th className="pb-3 font-semibold">ID</th>
                    <th className="pb-3 font-semibold">Date</th>
                    <th className="pb-3 font-semibold text-right">Samples</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {students.slice(-5).reverse().map((student) => (
                    <tr key={student.id} className="group border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 pl-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-indigo-100 border-2 border-white shadow-sm overflow-hidden flex-shrink-0">
                             {student.avatarUrl ? (
                               <img src={student.avatarUrl} alt={student.name} className="w-full h-full object-cover" />
                             ) : (
                               <div className="w-full h-full flex items-center justify-center text-indigo-500 font-bold">
                                 {student.name.charAt(0)}
                               </div>
                             )}
                          </div>
                          <span className="font-medium text-slate-700">{student.name}</span>
                        </div>
                      </td>
                      <td className="py-3 text-slate-500 font-mono">{student.studentId}</td>
                      <td className="py-3 text-slate-500">{new Date(student.registrationDate).toLocaleDateString()}</td>
                      <td className="py-3 text-right font-semibold text-emerald-600">{student.sampleCount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Simple Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">Dataset Distribution</h3>
          <div className="flex-1 min-h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" hide />
                <YAxis hide />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                />
                <Bar dataKey="samples" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-center text-slate-400 mt-4">Sample distribution per student ID</p>
        </div>
      </div>
    </div>
  );
};
