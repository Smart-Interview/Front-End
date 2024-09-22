"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

export default function ReportPage({ params }: { params: { offerId: string } }) {
    const [isLoading, setIsLoading] = useState(false);
    const [reportData, setReportData] = useState(null);
    const router = useRouter();

    const offerId = params.offerId; // Fetch the offerId from the route params

    // Function to submit the report request
    const submitReport = async () => {
        setIsLoading(true);
        try {
            // Prepare the request body
            const requestBody = {
                offerId: offerId, // Include the offerId in the request body
            };

            // Make the API request to submit the report
            const response = await fetch("/api/report", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestBody),
            });

            if (!response.ok) {
                throw new Error("Failed to generate report");
            }

            // Extract and set the report data from the response
            const data = await response.json();
            setReportData(data);
        } catch (error) {
            console.error("Error submitting report:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        // Call submitReport on component mount to fetch report data
        submitReport();
    }, [offerId]);

    // Function to get badge color based on application status
    const getStatusColor = (status) => {
        switch (status) {
            case "Accepted":
                return "bg-green-500";
            case "Rejected":
                return "bg-red-500";
            default:
                return "bg-gray-500";
        }
    };

    return (
        <div className="container mx-auto p-4 space-y-6">
            {isLoading ? (
                <div className="flex justify-center items-start h-32">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : (
                <>
                    <Card>
                        <CardHeader>
                            <CardTitle>Application Summary</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {reportData?.applications.map((app, index) => (
                                    <Card key={index}>
                                        <CardHeader>
                                            <CardTitle className="text-lg">
                                                <Badge className={getStatusColor(app.status)}>{app.status}</Badge>
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-2xl font-bold">{app.count}</p>
                                            <p className="text-sm text-muted-foreground">Candidates</p>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Candidates by Status</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Email</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {reportData?.applications.flatMap(app =>
                                        app.candidates.map(candidate => (
                                            <TableRow key={candidate.id}>
                                                <TableCell>
                                                    <Badge className={getStatusColor(app.status)}>{app.status}</Badge>
                                                </TableCell>
                                                <TableCell>{candidate.userName}</TableCell>
                                                <TableCell>{candidate.email}</TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Candidate Test Rankings</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Rank</TableHead>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Score</TableHead>
                                        <TableHead>Test Date</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {reportData?.tests
                                        .sort((a, b) => b.score - a.score)
                                        .map((test, index) => (
                                            <TableRow key={test.id}>
                                                <TableCell>{index + 1}</TableCell>
                                                <TableCell>{test.candidate.userName}</TableCell>
                                                <TableCell>{test.candidate.email}</TableCell>
                                                <TableCell>{test.score.toFixed(2)}</TableCell>
                                                <TableCell>{new Date(test.createdAt).toLocaleDateString()}</TableCell>
                                            </TableRow>
                                        ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </>
            )}
        </div>
    );
}
