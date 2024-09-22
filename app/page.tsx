'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from "next-auth/react";

const Home = () => {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "loading") return; // Wait for session to load

        const userId = localStorage.getItem('user_id');

        if (!session) {
            // Redirect to /candidate if no session
            router.push('/candidate');
        } else if (!userId) {
            // Redirect to /role if no user_id in localStorage
            router.push('/role');
        }
    }, [router, session, status]);

    if (status === "loading") {
        return <div className="my-3">Loading...</div>;
    }

    return (
        <></>
    );
};

export default Home;
