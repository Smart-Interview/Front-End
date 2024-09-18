// src/app/api/employees/route.ts
import { NextResponse } from "next/server";

// This is a mock of what will happen in the real backend (Spring Boot, etc.)
// In production, you should send this data to your backend server using fetch.

export async function POST(req: Request) {
  const employee = await req.json();

  // Here, you would normally send the data to your backend or database
  console.log("Received employee data:", employee);

  // For now, we just return a success response
  return NextResponse.json({ message: "Employee added successfully" }, { status: 200 });
}
