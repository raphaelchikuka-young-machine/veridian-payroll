"use client"
import React, { useState, useEffect } from 'react';
import { calculateZambianPayroll } from '../lib/calculations';
import { supabase } from '../lib/supabase';

export default function Home() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [salary, setSalary] = useState(0);
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchEmployees() {
    try {
      const { data, error } = await supabase.from('employees').select('*');
      if (error) throw error;
      if (data) setEmployees(data);
    } catch (err: any) {
      console.error("Fetch error:", err.message);
    }
  }

  useEffect(() => {
    fetchEmployees();
  }, []);

  async function handleSave() {
    if (!firstName || !lastName || salary <= 0) {
      alert("Please enter first name, last name, and salary.");
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase.from('employees').insert([
        { 
          first_name: firstName, 
          last_name: lastName, 
          nrc_number: `ID-${Math.random().toString(36).substr(2, 5).toUpperCase()}`, 
          basic_salary: salary 
        }
      ]);

      if (error) throw error;

      setFirstName('');
      setLastName('');
      setSalary(0);
      await fetchEmployees();
      alert("Employee registered successfully!");
    } catch (err: any) {
      setError(err.message);
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen p-4 md:p-10 bg-[#f8fafc] text-slate-900">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-black text-green-700 tracking-tight">VERIDIAN</h1>
            <p className="text-slate-500 text-sm font-medium uppercase tracking-widest">Zambia Payroll v1.0</p>
          </div>
          <div className="text-right hidden md:block">
            <p className="text-xs font-bold text-slate-400">STATUS</p>
            <p className="text-xs text-green-600 font-mono">● System Online</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h2 className="text-lg font-bold mb-6 text-slate-800">Register Employee</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">First Name</label>
                  <input type="text" placeholder="e.g. Chipo" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-green-500 transition" 
                    value={firstName} onChange={(e)=>setFirstName(e.target.value)} />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Last Name</label>
                  <input type="text" placeholder="e.g. Banda" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-green-500 transition" 
                    value={lastName} onChange={(e)=>setLastName(e.target.value)} />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Monthly Basic (ZMW)</label>
                  <input type="number" placeholder="0.00" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-green-500 transition font-mono" 
                    value={salary || ''} onChange={(e)=>setSalary(Number(e.target.value))} />
                </div>
                
                <button 
                  onClick={handleSave}
                  disabled={loading}
                  className="w-full bg-green-600 text-white p-4 rounded-xl font-bold hover:bg-green-700 transition-all shadow-lg shadow-green-100 disabled:opacity-50">
                  {loading ? 'Saving to Cloud...' : 'Add to Payroll'}
                </button>
              </div>
            </div>
          </div>

          {/* List Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h2 className="text-lg font-bold text-slate-800">Payroll Records</h2>
                <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold">{employees.length} Staff</span>
              </div>
              
              <div className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto">
                {employees.length === 0 && (
                  <div className="p-20 text-center">
                    <p className="text-slate-400 italic">No staff found. Add your first employee to start.</p>
                  </div>
                )}
                {employees.map((emp) => {
                  const res = calculateZambianPayroll(emp.basic_salary);
                  return (
                    <div key={emp.id} className="p-5 hover:bg-slate-50 transition flex justify-between items-center">
                      <div>
                        <p className="font-bold text-slate-900">{emp.first_name} {emp.last_name}</p>
                        <p className="text-xs font-mono text-slate-500">Gross: K{Number(emp.basic_salary).toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-black text-green-700">NET: K{res.netPay.toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
                        <div className="flex gap-2 justify-end text-[10px] font-bold">
                          <span className="text-red-400 uppercase">Tax: K{res.paye.toFixed(2)}</span>
                          <span className="text-blue-400 uppercase">NAPSA: K{res.napsa.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
