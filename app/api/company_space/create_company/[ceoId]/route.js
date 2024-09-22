import { NextResponse } from "next/server";
import { getAccessToken } from "@/utils/sessionTokenAccessor"; // Adjust the import path if needed
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const apiUrl = `${process.env.DEMO_BACKEND_URL}/api/v1`;

export async function POST(req, { params }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { name, industry, location, ceo } = await req.json(); // Get the JSON body data

    console.log('all is here');
    if (!name || !industry || !location || !ceo) {
      
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Construct backend API URL
    const backendUrl = `${apiUrl}/companies`;

    // Get the access token for the backend
    const accessToken = await getAccessToken();

    // Send the data to the backend
    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        name,
        industry,
        location,
        ceo // Ensure ceoId is an integer
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      return NextResponse.json({ error: errorData }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Error creating company' }, { status: 500 });
  }
}
