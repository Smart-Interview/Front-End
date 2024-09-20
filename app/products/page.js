import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { getAccessToken } from "@/utils/sessionTokenAccessor";
import { SetDynamicRoute } from "@/utils/setDynamicRoute";

async function getAllProducts() {
  const url = `${process.env.DEMO_BACKEND_URL}/api/v1/candidates`;

  let accessToken = await getAccessToken();

  const resp = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + accessToken,
    },
  });

  if (resp.ok) {
    const data = await resp.json();
    return data;
  }

  throw new Error("Failed to fetch data. Status: " + resp.status);
}

export default async function Products() {
  const session = await getServerSession(authOptions);

  if (session) {
    try {
      const products = await getAllProducts();          

      return (        
        <main>  
            <SetDynamicRoute></SetDynamicRoute>    
          <h1 className="text-4xl text-center">Candidates</h1>
          <table className="border border-gray-500 text-lg ml-auto mr-auto mt-6">
            <thead>
              <tr>
                <th className="bg-blue-900 p-2 border border-gray-500">ID</th>
                <th className="bg-blue-900 p-2 border border-gray-500">userName</th>
                <th className="bg-blue-900 p-2 border border-gray-500">
                  Email
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.Id}>
                  <td className="p-1 border border-gray-500">{p.id}</td>
                  <td className="p-1 border border-gray-500">{p.userName}</td>
                  <td className="p-1 border border-gray-500">{p.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </main>
      );
    } catch (err) {
      console.error(err);

      return (
        <main>
          <h1 className="text-4xl text-center">Products</h1>
          <p className="text-red-600 text-center text-lg">
            Sorry, an error happened. Check the server logs.
          </p>
        </main>
      );
    }
  }

  redirect("/unauthorized");
}