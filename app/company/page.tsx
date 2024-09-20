// src/app/company/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Company {
  id: number;
  name: string;
  industry: string;
  mail: string;
  address: string;
}

export default function CompanyPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const router = useRouter();

  useEffect(() => {
    async function fetchCompanies() {
      try {
        const response = await fetch("http://localhost:8020/company/companies"); // it was 8081
        if (response.ok) {
          const data: Company[] = await response.json();
          setCompanies(data);
        } else {
          console.error("Failed to fetch companies");
        }
      } catch (error) {
        console.error("Error fetching companies:", error);
      }
    }

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
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mail</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {companies.map((company) => (
            <tr key={company.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{company.id}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{company.name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{company.industry}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{company.mail}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{company.address}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
