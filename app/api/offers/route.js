import { NextResponse } from "next/server";

const apiUrl = `${process.env.DEMO_BACKEND_URL}/api/v1`;

export async function GET(request) {
    const backendUrl = `${apiUrl}/offers/all`;

    try {
        // Directly fetch the backend URL without adding an Authorization header
        const response = await fetch(backendUrl, {
            method: 'GET',
            headers: {
                'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
                        'Pragma': 'no-cache',
                        'Expires': '0',
                        'Content-Type': 'application/json',
                         // Automatically use the current origin
                        'Access-Control-Request-Method': 'GET', // Adjust as needed
                        
        }
        }
        );

        if (!response.ok) {
            return new Response(JSON.stringify({ error: 'Failed to fetch job offers from backend' }), { status: 500 });
        }

        const jobOffers = await response.json();
        return new Response(JSON.stringify(jobOffers), { status: 200 });

    } catch (error) {
        return new Response(JSON.stringify({ error: 'Error fetching job offers from backend' }), { status: 500 });
    }
}
