'use client';

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {Loader2} from "lucide-react";

type Test = {
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
  candidate: null; // Assuming this can be null
  score: number;
  createdAt: string;
};

export default function TestsPage() {
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedCandidateId = localStorage.getItem('user_id');

    const fetchTests = async () => {
      if (!storedCandidateId) return;

      try {
        const response = await fetch(`/api/tests?candidateId=${storedCandidateId}`);

        if (!response.ok) {
          throw new Error('Failed to fetch test data');
        }

        const data = await response.json();
        setTests(data.content); // Adjust based on your API response structure
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false); // Set loading to false after fetch
      }
    };

    fetchTests();
  }, []);

  if (loading) {
    return (
        <div className="flex justify-center items-start h-32">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    );
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
      <div className="min-h-screen bg-background p-8">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>My Tests</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Job Title</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tests.map((test) => (
                    <TableRow key={test.id}>
                      <TableCell className="font-medium">{test.offer.title}</TableCell>
                      <TableCell>{test.offer.company.name}</TableCell>
                      <TableCell>{test.score}</TableCell>
                      <TableCell>
                        {new Date(test.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </TableCell>
                    </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
  );
}
