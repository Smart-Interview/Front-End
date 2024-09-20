"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";

export default function CreateProduct() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (
      status == "unauthenticated") {
      router.push("/unauthorized");
      router.refresh();
    }
  }, [session, status, router]);

  const [errorMsg, setErrorMsg] = useState("");

  if (status == "loading") {
    return (
      <main>
        <h1 className="text-4xl text-center">Create product</h1>
        <div className="text-center text-2xl">Loading...</div>
      </main>
    );
  }

  if (session) {
    const handleSubmit = async (event) => {
      event.preventDefault();

      const postBody = {
        userName: session.user.name,
        email: session.user.email
      };

      try {
        const resp = await fetch("/api/products", {
          method: "POST",
          headers: {
            headers: {
              "Content-Type": "application/json",
            },
          },
          body: JSON.stringify(postBody),
        });

        if (resp.ok) {
          router.push("/products");
          router.refresh();
        } else {
          var json = await resp.json();
          setErrorMsg("Unable to call the API: " + json.error);
        }
      } catch (err) {
        setErrorMsg("Unable to call the API: " + err);
      }
    };

    return (
      <main>
        <h1 className="text-4xl text-center">Create candidate</h1>

        <form onSubmit={handleSubmit} className="mt-6">
          <button type="submit" className="mt-3 bg-blue-900 font-bold text-white py-1 px-2 rounded border border-gray-50">
            Create
          </button>
        </form>
      </main>
    );
  }
}