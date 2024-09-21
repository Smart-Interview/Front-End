import { NextResponse } from "next/server";
import { getAccessToken } from "@/utils/sessionTokenAccessor"; // Adjust the import if needed
import { getServerSession } from "next-auth"; 
import { authOptions } from "@/app/api/auth/[...nextauth]/route";



const apiUrl = `${process.env.DEMO_BACKEND_URL}/api/v1`;


export async function PUT(req) {
    const session = await getServerSession(authOptions);
  
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  
    try {
      const formData = await req.formData(); // Get the FormData from the request
      const offerId = formData.get('id'); // Extract the offer id from FormData
  
      if (!offerId) {
        return NextResponse.json({ error: 'Offer ID is required' }, { status: 400 });
      }
  
      const accessToken = await getAccessToken();
      
      const response = await fetch(`${apiUrl}/offers/${offerId}`, {
        method: 'PUT',
        body: formData, // Send the FormData directly
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
  
      if (!response.ok) {
        return new Response(JSON.stringify({ error: 'Failed to update offer' }), { status: response.status });
      }
  
      const data = await response.json(); // Return the updated offer data
      return new Response(JSON.stringify(data), { status: 200 });
    } catch (error) {
      return new Response(JSON.stringify({ error: 'Error updating offer' }), { status: 500 });
    }
  }