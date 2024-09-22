import { NextResponse } from "next/server";
import { getAccessToken } from "@/utils/sessionTokenAccessor"; // Adjust the import if needed
import { getServerSession } from "next-auth"; 
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const apiUrl = `${process.env.DEMO_BACKEND_URL}/api/v1`;

export async function GET(request) {
    const session = await getServerSession(authOptions);

    if (session) {
        
        
        const backendUrl = `${apiUrl}/offers/all`;

        try {
            const accessToken = await getAccessToken();

            const response = await fetch(backendUrl, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            if (!response.ok) {
                return new Response(JSON.stringify({ error: 'Failed to fetch job offer from backend' }), { status: 500 });
            }

            const jobOffers = await response.json();
            return new Response(JSON.stringify(jobOffers), { status: 200 });

        } catch (error) {
            return new Response(JSON.stringify({ error: 'Error fetching job offer from backend' }), { status: 500 });
        }
    }

    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
