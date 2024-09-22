import { NextResponse } from "next/server";
import { getAccessToken } from "@/utils/sessionTokenAccessor"; // Adjust the import if needed
import { getServerSession } from "next-auth"; 
import { authOptions } from "@/app/api/auth/[...nextauth]/route";


export async function GET(request, { params }) {

  console.log("API route called with params:", params);    
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = params;
  console.log("iddd", id);
  const url = `${process.env.DEMO_BACKEND_URL}/api/v1/offers/file/${id}`;
  const accessToken = await getAccessToken();

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/pdf',
        'Accept': '*/*',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: await response.text() },
        { status: response.status }
      );
    }

    const blob = await response.blob();
    const pdfUrl = URL.createObjectURL(blob);
    
    return NextResponse.json({ url: pdfUrl });
  } catch (error) {
    console.error('Error fetching the PDF:', error);
    return NextResponse.error();
  }
}
