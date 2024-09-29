import { NextResponse } from "next/server";
import { getAccessToken } from "@/utils/sessionTokenAccessor";
import { getServerSession } from "next-auth"; 
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(request, { params }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = params;
  const url = `${process.env.DEMO_BACKEND_URL}/api/v1/offers/file/${id}`;
  const accessToken = await getAccessToken();

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      return NextResponse.json({ error: await response.text() }, { status: response.status });
    }

    // Stream the PDF file
    const pdfStream = await response.body;

    // Send back the stream with appropriate headers
    return new NextResponse(pdfStream, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="offer_${id}.pdf"`,
      },
    });
  } catch (error) {
    console.error('Error fetching the PDF:', error);
    return NextResponse.error();
  }
}
