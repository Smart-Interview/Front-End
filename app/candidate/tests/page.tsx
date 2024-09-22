'use client';

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
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

// Type for the paginated API response
type PaginatedData = {
  content: Test[];
  pageable: {
    pageNumber: number;
    pageSize: number;
  };
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
  numberOfElements: number;
  last: boolean;
  first: boolean;
  empty: boolean;
};

export default function TestsPage() {
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0); // Current page state
  const [totalPages, setTotalPages] = useState(1);   // Total number of pages
  const [pageSize, setPageSize] = useState(2);      // Page size, can be adjusted

  useEffect(() => {
    const storedCandidateId = localStorage.getItem('user_id');

    const fetchTests = async () => {
      if (!storedCandidateId) return;

      try {
        setLoading(true); // Show loading state while fetching data
        const response = await fetch(`/api/tests?candidateId=${storedCandidateId}&pageNumber=${currentPage}&pageSize=${pageSize}`);

        if (!response.ok) {
          throw new Error('Failed to fetch test data');
        }

        const data: PaginatedData = await response.json();

        setTests(data.content); // Adjust based on your API response structure
        setTotalPages(data.totalPages); // Update total pages from the response
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false); // Set loading to false after fetch
      }
    };

    fetchTests();
  }, [currentPage, pageSize]); // Re-fetch data when page or page size changes

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

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
            {/* Check if tests array is empty */}
            {tests.length === 0 ? (
                <div className="text-center p-4">
                  <p>No tests found.</p>
                </div>
            ) : (
                <>
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

                  {/* Pagination Controls */}
                  <div className="flex justify-between mt-4">
                    <Button
                        onClick={handlePreviousPage}
                        disabled={currentPage === 0} // Disable if on first page
                    >
                      Previous
                    </Button>
                    <span>Page {currentPage + 1} of {totalPages}</span>
                    <Button
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages - 1} // Disable if on last page
                    >
                      Next
                    </Button>
                  </div>
                </>
            )}
          </CardContent>
        </Card>
      </div>
  );
}
