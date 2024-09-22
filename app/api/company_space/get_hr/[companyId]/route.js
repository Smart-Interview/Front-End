import { NextResponse } from "next/server";
import { getAccessToken } from "@/utils/sessionTokenAccessor"; // Adjust the import if needed
import { getServerSession } from "next-auth"; 
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const apiUrl = `${process.env.DEMO_BACKEND_URL}/api/v1`;

export async function GET(request) {
    const session = await getServerSession(authOptions);

    if (session) {
        const { searchParams } = new URL(request.url);
        //const companyId = searchParams.get('companyId');
         // Get companyId from query parameters

        const companyId = request.url.split('/').pop();

        if (!companyId) {
            return new Response(JSON.stringify({ error: 'companyId is required' }), { status: 400 });
        }

        const backendUrl = `${apiUrl}/rhs/company/${companyId}`;

        try {
            const accessToken = await getAccessToken();

            const response = await fetch(backendUrl, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            if (!response.ok) {
                return new Response(JSON.stringify({ error: 'Failed to fetch HR employees from backend' }), { status: 500 });
            }

            const data = await response.json();
            return new Response(JSON.stringify(data), { status: 200 });
        } catch (error) {
            return new Response(JSON.stringify({ error: 'Error fetching HR employees from backend' }), { status: 500 });
        }
    }

    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}



export const fetchHrs = async (companyId) => {
    if (!companyId) {
      throw new Error('companyId is required');
    }
  
    const response = await fetch(`/api/company_space/get_hr/${companyId}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch hrs');
    }
  
    return response.json();
  };