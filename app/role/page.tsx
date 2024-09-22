'use client';

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation'; // Import useRouter
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserIcon, BriefcaseIcon } from "lucide-react";

export default function RoleSelection() {
    const { data: session, status } = useSession();
    const router = useRouter(); // Initialize useRouter
    const [loading, setLoading] = useState(false);
    const [userId, setUserId] = useState(null);
    const [companyId, setCompanyId] = useState(null);
    const [role, setRole] = useState(null);

    const handleRegister = async (selectedRole) => {
        setLoading(true);
        setRole(selectedRole);

        const postBody = {
            userName: session?.user?.name,
            email: session?.user?.email,
        };

        try {
            let response;

            if (selectedRole === "rh") {
                const email = session?.user?.email;
                response = await fetch(`/api/register/rh/${email}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
            } else {
                response = await fetch(`/api/register/${selectedRole}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(postBody),
                });
            }

            if (!response.ok) {
                throw new Error("Failed to register or fetch data");
            }

            const data = await response.json();

            if (data?.data) {
                setUserId(data.data.id);
                if (selectedRole === "rh") {
                    setCompanyId(data.data.company);
                }

                // Redirect based on selected role
                if (selectedRole === "ceo") {
                    router.push("/ceo/companies");
                } else if (selectedRole === "candidate") {
                    router.push("/candidate");
                } else if (selectedRole === "rh") {
                    router.push("/hr/offers");
                }
            }

        } catch (error) {
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (userId) {
            localStorage.setItem('user_id', userId);
        }
        if (companyId) {
            localStorage.setItem('company_id', String(companyId));
        }
        if (role) {
            localStorage.setItem('role', role);
        }
    }, [userId, companyId, role]);

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="w-full max-w-4xl">
                <h1 className="text-3xl font-bold text-center mb-8">Choose Your Role</h1>
                <div className="flex flex-col sm:flex-row gap-8">
                    <Card className="w-full">
                        <CardHeader>
                            <CardTitle className="flex items-center justify-center">
                                <BriefcaseIcon className="mr-2 h-6 w-6" />
                                CEO
                            </CardTitle>
                            <CardDescription className="text-center">Register as a Company Executive</CardDescription>
                        </CardHeader>
                        <CardContent className="text-center">
                            <ul className="space-y-2">
                                <li>Post job openings</li>
                                <li>Review candidate profiles</li>
                                <li>Manage your company presence</li>
                            </ul>
                        </CardContent>
                        <CardFooter className="flex justify-center">
                            <Button className="w-full" onClick={() => handleRegister("ceo")} disabled={loading}>
                                {loading ? "Registering..." : "Register as CEO"}
                            </Button>
                        </CardFooter>
                    </Card>

                    <Card className="w-full">
                        <CardHeader>
                            <CardTitle className="flex items-center justify-center">
                                <UserIcon className="mr-2 h-6 w-6" />
                                Candidate
                            </CardTitle>
                            <CardDescription className="text-center">Register as a Job Seeker</CardDescription>
                        </CardHeader>
                        <CardContent className="text-center">
                            <ul className="space-y-2">
                                <li>Create your professional profile</li>
                                <li>Apply to job openings</li>
                                <li>Showcase your skills and experience</li>
                            </ul>
                        </CardContent>
                        <CardFooter className="flex justify-center">
                            <Button className="w-full" onClick={() => handleRegister("candidate")} disabled={loading}>
                                {loading ? "Registering..." : "Register as Candidate"}
                            </Button>
                        </CardFooter>
                    </Card>

                    <Card className="w-full">
                        <CardHeader>
                            <CardTitle className="flex items-center justify-center">
                                <BriefcaseIcon className="mr-2 h-6 w-6" />
                                RH
                            </CardTitle>
                            <CardDescription className="text-center">Register as Human Resources</CardDescription>
                        </CardHeader>
                        <CardContent className="text-center">
                            <ul className="space-y-2">
                                <li>Manage job openings</li>
                                <li>Review candidates</li>
                                <li>Organize hiring processes</li>
                            </ul>
                        </CardContent>
                        <CardFooter className="flex justify-center">
                            <Button className="w-full" onClick={() => handleRegister("rh")} disabled={loading}>
                                {loading ? "Registering..." : "Register as RH"}
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    );
}
