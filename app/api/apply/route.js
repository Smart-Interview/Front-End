import { NextResponse } from "next/server";
import { getAccessToken } from "@/utils/sessionTokenAccessor"; // Adjust the import path if needed
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const apiUrl = `${process.env.DEMO_BACKEND_URL}/api/v1`;

export async function POST(request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Parse the incoming form data
    const formData = await request.formData();
    const userId = formData.get('candidateId');
    const offerId = formData.get('offerId');
    const cvFile = formData.get('cv');

    // Ensure all required fields are present
    if (!userId || !offerId || !cvFile) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400 }
      );
    }

    // Construct the backend API URL for submitting the application
    const backendUrl = `${apiUrl}/applications`;

    // Fetch the access token if needed
    const accessToken = await getAccessToken();

    // Create a new FormData instance for the backend request
    const applicationData = new FormData();
    applicationData.append('candidateId', userId);
    applicationData.append('offerId', offerId);
    applicationData.append('cv', cvFile);

    // Make the POST request to the backend
    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
      body: applicationData,
    });

    // Handle the backend response
    if (!response.ok) {
      const errorData = await response.json();
      return new NextResponse(
        JSON.stringify({ error: errorData.message || 'Failed to submit application' }),
        { status: 500 }
      );
    }

    // If the request is successful, return the application data
    const applicationResponse = await response.json();
    return new NextResponse(JSON.stringify(applicationResponse), { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/apply:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500 }
    );
  }
}
