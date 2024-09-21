import { NextResponse } from "next/server";
import { getAccessToken } from "@/utils/sessionTokenAccessor";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(req) {
    // Get user session
    const session = await getServerSession(authOptions);

    if (session) {
        try {
            // Parse the incoming report data from the request
            const reportRequest = await req.json();
            console.log('Report Request:', reportRequest);

            // Get access token for authentication
            const accessToken = await getAccessToken();

            // Make a POST request to your back-end API to create the report
            const response = await fetch(`${process.env.DEMO_BACKEND_URL}/api/v1/reports`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`, // Include access token for authentication
                },
                body: JSON.stringify(reportRequest), // Send the report data as the body
            });

            // If the back-end API responds with an error, handle it
            if (!response.ok) {
                return NextResponse.json({ error: 'Failed to create report' }, { status: response.status });
            }

            // Extract the result from the back-end response
            const reportResponse = await response.json();

            // Return the back-end report response to the client
            return NextResponse.json(reportResponse, { status: 200 });

        } catch (error) {
            console.error('Error creating report:', error);
            return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
        }
    }

    // If no session is found, return an unauthorized error
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
