"use client";

import { useEffect, useState } from "react";

// Define the Employee interface
interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  mail: string;
  code: string;
}

export default function AllHR() {
  // Type the state with Employee[]
  const [hrList, setHrList] = useState<Employee[]>([]);

  // Fetch the HR list from the API
  useEffect(() => {
    const fetchHRList = async () => {
      try {
        const response = await fetch("http://localhost:8080/employee/employees");
        if (response.ok) {
          const data: Employee[] = await response.json(); // Explicitly type the response data
          setHrList(data);
        } else {
          console.error("Failed to fetch HR employees.");
        }
      } catch (error) {
        console.error("Error fetching HR employees:", error);
      }
    };

    fetchHRList();
  }, []);

  return (
    <div className="black-white-theme p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">All HR Employees</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left border border-gray-700">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="px-4 py-2">First Name</th>
              <th className="px-4 py-2">Last Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Code</th>
            </tr>
          </thead>
          <tbody>
            {hrList.length > 0 ? (
              hrList.map((hr) => (
                <tr key={hr.id} className="border-t border-gray-700">
                  <td className="px-4 py-2">{hr.firstName}</td>
                  <td className="px-4 py-2">{hr.lastName}</td>
                  <td className="px-4 py-2">{hr.mail}</td>
                  <td className="px-4 py-2">{hr.code}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-4 py-2 text-center">
                  No HR employees found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
