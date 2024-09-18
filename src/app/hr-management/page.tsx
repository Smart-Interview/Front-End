// src/app/hr-management/page.tsx
"use client";

import { useRouter } from "next/navigation";

export default function HRManagement() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <h1 className="text-2xl font-bold mb-6 text-black">HR Management</h1>
      
      <div className="space-y-4">
        {/* Add HR button */}
        <button
          onClick={() => router.push("/add-employee")}
          className="w-full px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
        >
          Add HR
        </button>

        {/* All HRs button */}
        <button
          onClick={() => router.push("/all-hr")}
          className="w-full px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
        >
          All HRs
        </button>

        {/* Back to Company Page button */}
        <button
          onClick={() => router.push("/company")}
          className="w-full px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
        >
          Back
        </button>
      </div>
    </div>
  );
}
