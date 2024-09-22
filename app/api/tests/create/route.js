import { NextResponse } from "next/server";
import { getAccessToken } from "@/utils/sessionTokenAccessor";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function POST(req) {
    const session = await getServerSession(authOptions);

    if (session) {
        const url = `${process.env.DEMO_BACKEND_URL}/api/v1/tests`; // Adjust the endpoint if needed
        const postBody = await req.json(); // Expecting the request body to have the correct structure

        const accessToken = await getAccessToken();

        const resp = await fetch(url, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            method: "POST",
            body: JSON.stringify(postBody), // This will be your request body
        });

        if (resp.ok) {
            const data = await resp.json();
            console.log(data.id); // Log the ID returned by the backend

            return NextResponse.json({ data }, { status: 200 });
        } else {
            return NextResponse.json(
                { error: await resp.text() },
                { status: resp.status }
            );
        }
    }

    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
