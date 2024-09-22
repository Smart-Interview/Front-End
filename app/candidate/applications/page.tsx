'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {Loader2} from "lucide-react";

type Application = {
  id: number;
  offer: {
    id: number;
    title: string;
    company: {
      id: number;
      name: string;
      industry: string;
      location: string;
    };
    deadline: string;
  };
  cvId: number;
  status: 'PENDING' | 'ACCEPTED' | 'REFUSED';
  createdAt: string;
};

export default function ApplicationPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedCandidateId = localStorage.getItem('user_id');

    if (storedCandidateId) {
      const fetchApplications = async () => {
        try {
          const response = await fetch(`/api/applications?candidateId=${storedCandidateId}`);
          const data = await response.json();
          setApplications(data.content);
        } catch (error) {
          console.error('Error fetching applications:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchApplications();
    }
  }, []);

  const handleStartTest = async (applicationId: number, offerId: number) => {
    const postBody = {
      candidateId: Number(localStorage.getItem('user_id')),
      offerId: offerId,
      applicationId: applicationId,
    };

    try {
      const response = await fetch('/api/tests/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postBody),
      });

      if (response.ok) {
        const data = await response.json();
        const testId = data.data;
        router.push(`/candidate/test/${testId}`);
      } else {
        console.error('Error creating test:', await response.text());
      }
    } catch (error) {
      console.error('Error during test creation:', error);
    }
  };

  return (
      <div className="min-h-screen bg-background p-8">
        {loading ? ( // Show spinner independently
            <div className="flex justify-center items-start h-32">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        ) : (
            <Card className="max-w-4xl mx-auto">
              <CardHeader>
                <CardTitle>My Applications</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Job Title</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {applications.map((application) => (
                        <TableRow key={application.id}>
                          <TableCell>{application.offer.title}</TableCell>
                          <TableCell>{application.offer.company.name}</TableCell>
                          <TableCell>{new Date(application.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}</TableCell>
                          <TableCell>
                            <Badge variant={
                              application.status === 'ACCEPTED' ? 'default' :
                                  application.status === 'REFUSED' ? 'destructive' : 'secondary'
                            }>
                              {application.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {application.status === 'ACCEPTED' && (
                                <Button className="h-6 px-4" onClick={() => handleStartTest(application.id, application.offer.id)}>
                                  Start Test
                                </Button>
                            )}
                          </TableCell>
                        </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
        )}
      </div>
  );
}
