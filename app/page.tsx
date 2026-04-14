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

  // 1. Fetch Employees from Supabase
  async function fetchEmployees() {
    const { data } = await supabase.from('employees').select('*');
    if (data) setEmployees(data);
  }

  useEffect(() => { fetchEmployees() }, []);

  // 2. Handle Saving to Database
  async function handleSave() {
    setLoading(true);
    const { error } = await supabase.from('employees').insert([
      { first_name: firstName, last_name: lastName, nrc_number: Math.random().toString(), basic_salary: salary }
    ]);

    if (error) {
      alert("Error: " + error.message);
    } else {
      alert("Employee Saved Successfully!");
      setFirstName(''); setLastName(''); setSalary(0);
      fetchEmployees(); // Refresh the list
    }
    setLoading(false);
  }

  return (
    <main className="min-h-screen p-4 md:p-8 bg-slate-50">
      <div className="max-w-4xl mx-auto">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-green-800">Veridian Payroll</h1>
          <p className="text-slate-600">Zambian Employee Management</p>
        </header>

        <div className="grid md:grid-cols-2 gap-8">
          {/* LEFT: Add Employee Form */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold mb-4">Add New Employee</h2>
            <div className="space-y-4">
              <input type="text" placeholder="First Name" className="w-full p-3 border rounded" 
                value={firstName} onChange={(e)=>setFirstName(e.target.value)} />
              
              <input type="text" placeholder="Last Name" className="w-full p-3 border rounded" 
                value={lastName} onChange={(e)=>setLastName(e.target.value)} />
              
              <input type="number" placeholder="Monthly Basic Salary" className="w-full p-3 border rounded" 
                value={salary} onChange={(e)=>setSalary(Number(e.target.value))} />
              
              <button 
                onClick={handleSave}
                disabled={loading}
                className="w-full bg-green-700 text-white p-3 rounded font-bold hover:bg-green-800 transition">
                {loading ? 'Saving...' : 'Save Employee'}
              </button>
            </div>
          </div>

          {/* RIGHT: Live List */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold mb-4">Current Employees</h2>
            <div className="space-y-3">
              {employees.length === 0 && <p className="text-slate-400">No employees found yet.</p>}
              {employees.map((emp) => {
                const results = calculateZambianPayroll(emp.basic_salary);
                return (
                  <div key={emp.id} className="p-4 border rounded-lg hover:bg-slate-50 transition">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold">{emp.first_name} {emp.last_name}</p>
                        <p className="text-xs text-slate-500 font-mono">SALARY: K{emp.basic_salary}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-green-700">NET: K{results.netPay.toFixed(2)}</p>
                        <p className="text-[10px] text-red-500">TAX: K{results.paye.toFixed(2)}</p>
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
