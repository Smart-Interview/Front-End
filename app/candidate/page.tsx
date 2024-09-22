'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from 'lucide-react';

interface Company {
  id: number;
  name: string;
  industry: string;
  location: string;
}

interface JobOffer {
  id: number;
  title: string;
  company: Company;
  deadline: string;
}

export default function CandidateOffersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [offers, setOffers] = useState<JobOffer[]>([]);
  const [selectedOffer, setSelectedOffer] = useState<JobOffer | null>(null);
  const [cvFile, setCvFile] = useState<File | null>(null);

  useEffect(() => {
    const userId = localStorage.getItem('user_id');

    if (status === "loading") {
      return; // Optionally handle loading state
    }

    if (!session) {
      return; // Stay on current page if no session
    }

    if (session && !userId) {
      router.push('/role');
    }
  }, [session, status, router]);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await fetch('/api/offers');
        const data = await response.json();
        setOffers(data.content || []); // Accessing content properly
      } catch (error) {
        console.error('Error fetching job offers:', error);
      }
    };

    fetchOffers();
  }, []);

  const downloadJobDescription = async (offerId: number, title: string) => {
    const response = await fetch(`/api/offers/${offerId}/description.pdf`);
    if (!response.ok) {
      console.error('Failed to download job description');
      return;
    }
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title}-Job-Description.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const handleApply = (offer: JobOffer) => {
    if (!session) {
      // Redirect to Keycloak sign-in page
      signIn("keycloak");
    } else {
      setSelectedOffer(offer); // Set the selected offer only if logged in
    }
  };

  const handleCvChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setCvFile(event.target.files[0]);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!cvFile || !selectedOffer) {
      console.error('CV file or selected offer is missing');
      return;
    }

    const userId = localStorage.getItem('user_id');
    const formData = new FormData();
    formData.append('candidateId', userId || '');
    formData.append('offerId', selectedOffer.id.toString());
    formData.append('cv', cvFile);

    try {
      const response = await fetch('/api/apply', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        console.log('Application submitted successfully');
      } else {
        console.error('Failed to submit application');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (status === "loading") {
    return <div className="my-3">Loading...</div>;
  }

  return (
      <div className="min-h-screen bg-white text-black p-8">
        <h1 className="text-3xl font-bold mb-8">Job Offers</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {offers.map((offer) => (
              <Card key={offer.id} className="bg-white border-black">
                <CardHeader>
                  <CardTitle className="text-black">{offer.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>Deadline: {offer.deadline}</span>
                  </div>
                  <div className="text-gray-700 mt-2">
                    <span>{offer.company.name} - {offer.company.industry} ({offer.company.location})</span>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                          variant="outline"
                          className="border-black text-black hover:bg-gray-100"
                          onClick={() => {
                            setSelectedOffer(offer);
                            downloadJobDescription(offer.id, offer.title);
                          }}
                      >
                        View Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px] bg-white text-black">
                      <DialogHeader>
                        <DialogTitle className="text-2xl font-semibold mb-2">{selectedOffer?.title}</DialogTitle>
                        <DialogDescription className="text-gray-600 mb-4">
                          Deadline: {selectedOffer?.deadline}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="mt-4 space-y-4">
                        {/* Additional content for job details here */}
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Dialog open={!!selectedOffer} onOpenChange={(open) => {
                    if (!open) setSelectedOffer(null); // Clear selectedOffer when dialog is closed
                  }}>
                    <DialogTrigger asChild>
                      <Button
                          className="bg-black text-white hover:bg-gray-800"
                          onClick={() => handleApply(offer)}
                      >
                        Apply
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px] bg-white text-black">
                      <DialogHeader>
                        <DialogTitle className="text-2xl font-semibold mb-2">Apply for {selectedOffer?.title}</DialogTitle>
                        <DialogDescription className="text-gray-600 mb-4">
                          Upload your CV and submit your application.
                        </DialogDescription>
                      </DialogHeader>
                      <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-2">
                          <Label htmlFor="cv" className="text-sm font-medium text-black">Upload CV</Label>
                          <Input id="cv" type="file" onChange={handleCvChange} className="bg-white border-black text-black" required />
                        </div>
                        <Button type="submit" className="w-full bg-black text-white hover:bg-gray-800">Submit Application</Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </CardFooter>
              </Card>
          ))}
        </div>
      </div>
  );
}