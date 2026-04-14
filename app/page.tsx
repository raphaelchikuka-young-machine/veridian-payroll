"use client"
import React, { useState, useEffect } from 'react';
import { calculateZambianPayroll } from '@/lib/calculations';
import { supabase } from '@/lib/supabase';

export default function Home() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [salary, setSalary] = useState(0);
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  async function fetchEmployees() {
    const { data } = await supabase.from('employees').select('*');
    if (data) setEmployees(data);
  }

  useEffect(() => { fetchEmployees() }, []);

  async function handleSave() {
    if (!firstName || !lastName || salary <= 0) {
      alert("Please enter all details");
      return;
    }
    setLoading(true);
    const { error } = await supabase.from('employees').insert([
      { 
        first_name: firstName, 
        last_name: lastName, 
        nrc_number: `TEMP-${Math.random().toString(36).substr(2, 5)}`, 
        basic_salary: salary 
      }
    ]);

    if (error) {
      alert("Error: " + error.message);
    } else {
      setFirstName(''); setLastName(''); setSalary(0);
      fetchEmployees();
    }
    setLoading(false);
  }

  return (
    <main className="min-h-screen p-4 md:p-8 bg-slate-50">
      <div className="max-w-4xl mx-auto">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold text-green-700">Veridian</h1>
          <p className="text-slate-500 font-medium">Zambian Payroll & HR Console</p>
        </header>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Add Employee Form */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold mb-4 text-slate-800">New Employee</h2>
            <div className="space-y-4">
              <input type="text" placeholder="First Name" className="w-full p-3 border rounded-lg outline-green-500" 
                value={firstName} onChange={(e)=>setFirstName(e.target.value)} />
              
              <input type="text" placeholder="Last Name" className="w-full p-3 border rounded-lg outline-green-500" 
                value={lastName} onChange={(e)=>setLastName(e.target.value)} />
              
              <div className="relative">
                <span className="absolute left-3 top-3 text-slate-400">K</span>
                <input type="number" placeholder="Basic Salary" className="w-full p-3 pl-8 border rounded-lg outline-green-500" 
                  value={salary || ''} onChange={(e)=>setSalary(Number(e.target.value))} />
              </div>
              
              <button 
                onClick={handleSave}
                disabled={loading}
                className="w-full bg-green-600 text-white p-4 rounded-lg font-bold hover:bg-green-700 transition shadow-md shadow-green-200">
                {loading ? 'Processing...' : 'Register Employee'}
              </button>
            </div>
          </div>

          {/* Employee List */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold mb-4 text-slate-800">Payroll List</h2>
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
              {employees.length === 0 && <p className="text-slate-400 text-center py-10 italic">No employees registered.</p>}
              {employees.map((emp) => {
                const res = calculateZambianPayroll(emp.basic_salary);
                return (
                  <div key={emp.id} className="p-4 bg-slate-50 border border-slate-100 rounded-xl">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-bold text-slate-800">{emp.first_name} {emp.last_name}</p>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Salary: K{emp.basic_salary}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-black text-green-700">NET: K{res.netPay.toLocaleString()}</p>
                        <p className="text-[10px] text-slate-400 font-bold">PAYE: K{res.paye.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
