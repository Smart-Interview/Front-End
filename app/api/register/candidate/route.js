import { NextResponse } from "next/server";
import { getAccessToken } from "@/utils/sessionTokenAccessor";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { signIn } from "next-auth/react";

export async function POST(req) {
    const session = await getServerSession(authOptions);

    if (session) {
        const url = `${process.env.DEMO_BACKEND_URL}/api/v1/candidates`;
        const postBody = await req.json();
        const accessToken = await getAccessToken();

        const resp = await fetch(url, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            method: "POST",
            body: JSON.stringify(postBody),
        });

        if (resp.ok) {
            const data = await resp.json();

            // Check if the backend sends `id`
            console.log(data.id);

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
