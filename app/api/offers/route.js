import { NextResponse } from "next/server";

const apiUrl = `${process.env.DEMO_BACKEND_URL}/api/v1`;

export async function GET(request) {
    const backendUrl = `${apiUrl}/offers/all`;

    try {
        // Fetch data from the backend API
        const response = await fetch(backendUrl, { cache: 'no-store' });

        if (!response.ok) {
            return new Response(JSON.stringify({ error: 'Failed to fetch job offers from backend' }), { status: 500 });
        }

        const jobOffers = await response.json();
        console.log(jobOffers.content);

        return new Response(JSON.stringify(jobOffers), { status: 200 });

    } catch (error) {
        return new Response(JSON.stringify({ error: 'Error fetching job offers from backend' }), { status: 500 });
    }
}
