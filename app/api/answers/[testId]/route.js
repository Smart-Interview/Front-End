import { NextResponse } from "next/server";
import { getAccessToken } from "@/utils/sessionTokenAccessor";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function POST(req, { params }) {
    const session = await getServerSession(authOptions);

    if (session) {
        const { testId } = params;

        try {
            // Parse the JSON body from the request
            const answers = await req.json();
            console.log('Answers:', answers);

            // Get access token
            const accessToken = await getAccessToken();

            // Call the back-end API to submit the answers
            const response = await fetch(`${process.env.DEMO_BACKEND_URL}/api/v1/tests/${testId}/result`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: "Bearer " + accessToken,
                },
                body: JSON.stringify(answers),
            });

            if (!response.ok) {
                return NextResponse.json({ error: 'Failed to submit answers' }, { status: response.status });
            }

            // Extract the result from the back-end response
            const result = await response.json();

            return NextResponse.json(result); // Return the result back to the front-end

        } catch (error) {
            console.error('Error submitting answers:', error);
            return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
        }
    }

    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
