import Link from "next/link";

export default function HRPage() {
  return (
    <div className="p-6">
      <h1>HR Management</h1>
      <div className="space-y-4">
        <Link href="/add-employee">
          <button className="bg-blue-500 text-white p-2 rounded">Add HR</button>
        </Link>

        <Link href="/all-hr">
          <button className="bg-blue-500 text-white p-2 rounded">Show All HR</button>
        </Link>
      </div>
    </div>
  );
}
