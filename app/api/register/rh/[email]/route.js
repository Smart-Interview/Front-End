import { NextResponse } from "next/server";
import { getAccessToken } from "@/utils/sessionTokenAccessor";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";

export async function GET(req, { params }) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { email } = params; // Extract email from params
    const url = `${process.env.DEMO_BACKEND_URL}/api/v1/rhs?email=${email}`;
    const accessToken = await getAccessToken();

    const response = await fetch(url, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
        method: "GET",
    });

    if (response.ok) {
        const data = await response.json();
        return NextResponse.json({ data }, { status: response.status });
    }

    return NextResponse.json(
        { error: await response.text() },
        { status: response.status }
    );
}
