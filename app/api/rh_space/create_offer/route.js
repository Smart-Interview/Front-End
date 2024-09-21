
import { NextResponse } from "next/server";
import { getAccessToken } from "@/utils/sessionTokenAccessor"; // Adjust the import if needed
import { getServerSession } from "next-auth"; 
import { authOptions } from "@/app/api/auth/[...nextauth]/route";


const apiUrl = `${process.env.DEMO_BACKEND_URL}/api/v1`;




export async function POST(req) {
    const session = await getServerSession(authOptions);
  
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }


    const backendUrl = `${apiUrl}/offers`;
  
    try {
      const formData = await req.formData(); // Get the FormData from the request

     
      const accessToken = await getAccessToken();
  
      const response = await fetch(backendUrl, {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
         // Send the FormData directly
      });
  
      if (!response.ok) {
        return new Response(JSON.stringify({ error: 'Failed to add offer' }), { status: response.status });
      }
  
      const data = await response.json();
      return new Response(JSON.stringify(data), { status: 201 });
    } catch (error) {
      return new Response(JSON.stringify({ error: 'Error adding offer' }), { status: 500 });
    }
  }