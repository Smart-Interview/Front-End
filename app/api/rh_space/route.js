import { NextResponse } from "next/server";
import { getAccessToken } from "@/utils/sessionTokenAccessor"; // Adjust the import if needed
import { getServerSession } from "next-auth"; 
import { authOptions } from "../auth/[...nextauth]/route"; 



const apiUrl = `${process.env.DEMO_BACKEND_URL}/api/v1`;


export async function GET(request) {
    const session = await getServerSession(authOptions);

    if (session) {
        const { searchParams } = new URL(request.url);
        const companyId = searchParams.get('companyId'); // Get companyId from query parameters

        if (!companyId) {
            return new Response(JSON.stringify({ error: 'companyId is required' }), { status: 400 });
        }

        const backendUrl = `${apiUrl}/offers?companyId=${companyId}`;

        try {
            const accessToken = await getAccessToken();

            const response = await fetch(backendUrl, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            if (!response.ok) {
                return new Response(JSON.stringify({ error: 'Failed to fetch offers from backend' }), { status: 500 });
            }

            const data = await response.json();
            return new Response(JSON.stringify(data), { status: 200 });
        } catch (error) {
            return new Response(JSON.stringify({ error: 'Error fetching offers from backend' }), { status: 500 });
        }
    }

    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}



export const fetchOffers = async () => {
    const response = await fetch('/api/rh_space?companyId=1'); // Adjust companyId as needed
    if (!response.ok) {
      throw new Error('Failed to fetch offers');
    }
    return response.json();
  };







  

// export async function POST(req) {
//     const session = await getServerSession(authOptions);
  
//     if (!session) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }


//     const backendUrl = `${apiUrl}/offers`;
  
//     try {
//       const formData = await req.formData(); // Get the FormData from the request

//       // console.log('FormData entries:', [...formData.entries()]); // Log the entries for debugging
//       // console.log('requesr made from ', backendUrl);
//       const accessToken = await getAccessToken();
  
//       const response = await fetch(backendUrl, {
//         method: 'POST',
//         body: formData,
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//         },
//          // Send the FormData directly
//       });
  
//       if (!response.ok) {
//         return new Response(JSON.stringify({ error: 'Failed to add offer' }), { status: response.status });
//       }
  
//       const data = await response.json();
//       return new Response(JSON.stringify(data), { status: 201 });
//     } catch (error) {
//       return new Response(JSON.stringify({ error: 'Error adding offer' }), { status: 500 });
//     }
//   }
  


  
  





export async function deleteOffer(id) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const accessToken = await getAccessToken();
    const response = await fetch(`${API_URL}/offers/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete offer');
    }

    return NextResponse.json({ message: 'Offer deleted successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Error deleting offer' }, { status: 500 });
  }
}
