
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Company {
  id: number;
  name: string;
  industry: string;
  location: string;
}

export default function CompanyPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const router = useRouter();

  const ceoId = 1;

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await fetch(`/api/company_space/get_company/${ceoId}`);
        const data = await response.json(); // Parse the response as JSON
  
        if (response.ok) {
          const companiesArray = Array.isArray(data) ? data : [data];
          setCompanies(companiesArray); // Set the companies state
         
        } else {
          console.error('Error fetching companies:', data.error);
        }
      } catch (error) {
        console.error('Error fetching companies:', error);
      }
    };
  
    fetchCompanies();
  }, []);
  

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-2xl font-bold mb-6">Company List</h1>

      {/* Create Company Button */}
      <button
        onClick={() => router.push("/create-company")}
        className="mb-6 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        Create Company
      </button>

      {/* Companies Table */}
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Industry</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {companies.map((company) => (
            <tr key={company.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{company.id}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{company.name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{company.industry}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{company.location}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
