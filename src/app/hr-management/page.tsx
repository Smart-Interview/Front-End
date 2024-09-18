// src/app/hr-management/page.tsx
"use client";

import { useRouter } from "next/navigation";

export default function HRManagement() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-6">HR Management</h1>
      
      <div className="space-y-4">
        {/* Add HR button */}
        <button
          onClick={() => router.push("/add-employee")}
          className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Add HR
        </button>

        {/* All HRs button */}
        <button
          onClick={() => router.push("/all-hr")}
          className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
        >
          All HRs
        </button>

        {/* Back to CEO Page button */}
        <button
          onClick={() => router.push("/ceo")}
          className="w-full px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
        >
          Back
        </button>
      </div>
    </div>
  );
}
