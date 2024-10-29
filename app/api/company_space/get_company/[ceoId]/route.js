import { NextResponse } from "next/server";
import { getAccessToken } from "@/utils/sessionTokenAccessor";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const apiUrl = `${process.env.DEMO_BACKEND_URL}/api/v1`;

export async function GET(request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ceoId = request.url.split('/').pop();
  if (!ceoId) {
    return new Response(JSON.stringify({ error: "ceoId is required" }), { status: 400 });
  }

  const backendUrl = `${apiUrl}/companies/ceo/${ceoId}`;
  try {
    const accessToken = await getAccessToken();
    const response = await fetch(backendUrl, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!response.ok) {
      return new Response(JSON.stringify({ error: "Failed to fetch companies" }), { status: 500 });
    }

    const data = await response.json();
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Error fetching companies" }), { status: 500 });
  }
}
