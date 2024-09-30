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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2, XCircle } from "lucide-react";

import Router from 'next/router'


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
  const [isSubmitting, setIsSubmitting] = useState(false) // Add submission state
  const [isLoading, setIsLoading] = useState(true)
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const router2 = useRouter()



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
        const response = await fetch('/api/offers' , {cache: 'reload'});
        const data = await response.json();
        setOffers(data.content || []);

       
        
        
        
      } catch (error) {
        console.error('Error fetching job offers:', error);
      }
      finally
      {
        setIsLoading(false);
      }
    };

    fetchOffers();
    //router2.refresh();
  }, []);

  const downloadJobDescription = async (offerId: number, offerTitle: string) => {
    // console.log("Downloading offer with ID:", offerId)
    // console.log("dddd", selectedOffer);
    try {
      const response = await fetch(`/api/file/${offerId}`)

      if (!response.ok) {
        throw new Error("Failed to fetch file")
      }

      const blob = await response.blob()
      const pdfUrl = URL.createObjectURL(blob)

      const link = document.createElement('a')
      link.href = pdfUrl
      link.download = `${offerTitle}_offer.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      URL.revokeObjectURL(pdfUrl)
    } catch (error) {
      console.error('Error downloading file:', error)
    }
  }

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

    // console.log("id", selectedOffer.id);
    // console.log("title", selectedOffer.title);
    // console.log("company", selectedOffer.company);
    // console.log("deadline",selectedOffer.deadline);



    const userId = localStorage.getItem('user_id');
    const formData = new FormData();
    formData.append('candidateId', userId || '');
    formData.append('offerId', selectedOffer.id.toString());
    formData.append('cv', cvFile);

    try {

      setIsSubmitting(true)
      const response = await fetch('/api/apply', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        console.log('Application submitted successfully');
        setSubmitStatus('success');
        // setTimeout(() => {
        //   setDialogOpen(false);
        //   setSubmitStatus(null);
        // }, 2000);
      } else {
        setSubmitStatus('error');
        // setTimeout(() => {
        //   setDialogOpen(false);
        //   setSubmitStatus(null);
        // }, 2000);
        console.error('Failed to submit application');
      }
    } catch (error) {
      setTimeout(() => {
        setDialogOpen(false);
        setSubmitStatus('error');
      }, 2000);
      console.error('Error:', error);
    }
    finally
    {
      setIsSubmitting(false);

    }
  };

  const handleCloseDialog = () => {
    
    setSubmitStatus(null);
  };


  if (isLoading) {
    return (
      <div className="min-h-screen bg-white text-black flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-xl font-semibold">Loading offers...</p>
      </div>
    )
  }

  if (status === "loading") {
    return <div className="my-3">Loading...</div>;
  }

  return (
      <div className="min-h-screen bg-white text-black p-8">
        <h1 className="text-3xl font-bold mb-8">Job Offers</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {offers.length > 0 ? ( 
         <>
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
                    
                      <Dialog open={dialogOpen} onOpenChange={(isOpen) => {
                          setDialogOpen(isOpen);
                          if (!isOpen) {
                            handleCloseDialog();
                          }
                        }} aria-labelledby="dialog-title" aria-describedby="dialog-description"
                      >
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
                          <Label htmlFor="cv" className="text-sm font-medium text-black aria-hidden" >Upload CV</Label>
                          <Input id="cv" type="file" onChange={handleCvChange} className="bg-white border-black text-black" required />
                        </div>
                        <Button
                              type="submit"
                              className="w-full bg-black text-white hover:bg-gray-800"
                              disabled={isSubmitting} // Disable button when submitting
                        >
                        {isSubmitting ? 'Submitting...' : 'Submit Application'} {/* Change text */}
                      </Button>                      
                    </form>
                    
                    {submitStatus === 'success' && (
                    <Alert className="mt-4 bg-green-100 border-green-400 text-green-800">
                      <CheckCircle2 className="h-4 w-4" />
                      <AlertTitle>Success</AlertTitle>
                      <AlertDescription>Your application has been submitted successfully.</AlertDescription>
                    </Alert>
                    )}
                    {submitStatus === 'error' && (
                    <Alert className="mt-4 bg-red-100 border-red-400 text-red-800">
                      <XCircle className="h-4 w-4" />
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>There was an error submitting your application. Please try again.</AlertDescription>
                    </Alert>
                    )}




                    </DialogContent>
                  </Dialog>
                </CardFooter>
              </Card>
              ))}
          </>     
              ) 
              
              
              : (
                <div className="col-span-full text-center text-gray-500">
                  No offers for the moment. Please come back later.
                </div>
          )} 
        
        </div>
      </div>
  );
}