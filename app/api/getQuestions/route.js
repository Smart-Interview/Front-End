import { NextResponse } from "next/server";
import { getAccessToken } from "@/utils/sessionTokenAccessor";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(request) {
    const session = await getServerSession(authOptions);

    if (session) {
        const { searchParams } = new URL(request.url);
        const testId = searchParams.get('testId');

        if (!testId) {
            return new Response(JSON.stringify({ error: 'testId is required' }), { status: 400 });
        }

        const backendUrl = `${process.env.DEMO_BACKEND_URL}/api/v1/tests/${testId}`;

        try {
            const accessToken = await getAccessToken();

            const response = await fetch(backendUrl, {
                headers: {
                    Authorization: "Bearer " + accessToken,
                },
            });

            if (!response.ok) {
                return new Response(JSON.stringify({ error: 'Failed to fetch questions from backend' }), { status: 500 });
            }

            const data = await response.json();
            return new Response(JSON.stringify(data), { status: 200 });
        } catch (error) {
            return new Response(JSON.stringify({ error: 'Error fetching questions from backend' }), { status: 500 });
        }
    }

    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
