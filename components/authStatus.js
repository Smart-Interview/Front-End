"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useEffect, useState } from "react";

// Log out from Keycloak and clear the session
 async function keycloakSessionLogOut() {            //mkntch export
    try {
        await fetch(`/api/auth/logout`, { method: "GET" });
    } catch (err) {
        console.error(err);
    }
}

export default function AuthStatus() {
    const { data: session, status } = useSession();
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        // Access localStorage in useEffect to avoid SSR issues
        const storedUserId = localStorage.getItem('user_id');
        setUserId(storedUserId);

        // Handle session error (for example, if the access token has expired)
        if (status !== "loading" && session && session.error === "RefreshAccessTokenError") {
            signOut({ callbackUrl: "/" });
        }
    }, [session, status]);

    const handleLogout = () => {
        // Clear local storage
        localStorage.clear();

        // Log out from Keycloak and then sign out
        keycloakSessionLogOut().then(() => signOut({ callbackUrl: "/" }));
    };

    if (status === "loading") {

        <div className="my-3">
        

                <button
                    className="bg-blue-900 font-bold text-white py-1 px-2 rounded border border-gray-50"
                >
                    Logging in...
                </button>
       </div>


        //return <div className="my-3">Loading...</div>;
    } else if (session) {
        return (
            <div className="my-3">
                {/* Logged in as {session.user.name}{" "} */}

                <button
                    className="bg-blue-900 font-bold text-white py-1 px-2 rounded border border-gray-50"
                    onClick={handleLogout}>
                    Log out
                </button>
            </div>
        );
    }

    return (
        <div className="my-3">
            {/* Not logged in.{" "} */}
            <button
                className="bg-blue-900 font-bold text-white py-1 px-2 rounded border border-gray-50"
                onClick={() => signIn("keycloak")}>
                Log in
            </button>
        </div>
    );
}
