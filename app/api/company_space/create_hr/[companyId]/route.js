import { NextResponse } from "next/server";
import { getAccessToken } from "@/utils/sessionTokenAccessor"; // Adjust the import path if needed
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const apiUrl = `${process.env.DEMO_BACKEND_URL}/api/v1`;

export async function POST(request, { params }) {

  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Parse the incoming request body
    const { userName, email, code, company } = await request.json();

    // Ensure all required fields are present
    if (!userName || !email || !code || !company) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400 }
      );
    }

    // Construct the backend API URL for adding HR
    const backendUrl = `${apiUrl}/rhs`;

    // Fetch the access token if needed
    const accessToken = await getAccessToken();

    // Make the POST request to the backend
    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userName,
        email,
        code,
        company,
      }),
    });

    // Handle the backend response
    if (!response.ok) {
      const errorData = await response.json();
      return new NextResponse(JSON.stringify({ error: errorData.message || 'Failed to add HR employee' }), { status: 500 });
    }

    // If the request is successful, return the new HR data
    const newHR = await response.json();
    return new NextResponse(JSON.stringify(newHR), { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/company_space/add_hr:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500 }
    );
  }
}




