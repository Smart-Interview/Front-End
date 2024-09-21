import { NextResponse } from "next/server";
import { getAccessToken } from "@/utils/sessionTokenAccessor"; // Adjust the import if needed
import { getServerSession } from "next-auth"; 
import { authOptions } from "@/app/api/auth/[...nextauth]/route";


const apiUrl = `${process.env.DEMO_BACKEND_URL}/api/v1`;


export async function GET(request) {
    const session = await getServerSession(authOptions);

    if (session) {
        const { searchParams } = new URL(request.url);
        const ceoId = request.url.split('/').pop();

        console.log("ceoId", ceoId);

        if (!ceoId) {
            return new Response(JSON.stringify({ error: 'ceoId is required' }), { status: 400 });
        }

        const backendUrl = `${apiUrl}/companies/ceo/${ceoId}`;

        try {
            const accessToken = await getAccessToken();

            const response = await fetch(backendUrl, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            if (!response.ok) {
                return new Response(JSON.stringify({ error: 'Failed to fetch offers from backend' }), { status: 500 });
            }

            const data = await response.json();
            return new Response(JSON.stringify(data), { status: 200 });
        } catch (error) {
            return new Response(JSON.stringify({ error: 'Error fetching offers from backend' }), { status: 500 });
        }
    }

    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}