import { NextResponse } from "next/server";
import { getAccessToken } from "@/utils/sessionTokenAccessor"; // Adjust the import if needed
import { getServerSession } from "next-auth"; 
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const apiUrl = `${process.env.DEMO_BACKEND_URL}/api/v1`;

export async function DELETE(req) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Extract the offer ID from the request URL
  const { pathname } = new URL(req.url);
  const offerId = pathname.split("/").pop(); // Get the ID from the URL

  if (!offerId) {
    return NextResponse.json({ error: 'Offer ID is required' }, { status: 400 });
  }

  try {
    const accessToken = await getAccessToken();
    const response = await fetch(`${apiUrl}/offers/${offerId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      return new Response(JSON.stringify({ error: 'Failed to delete offer' }), { status: response.status });
    }

    return NextResponse.json({ message: 'Offer deleted successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Error deleting offer' }, { status: 500 });
  }
}
