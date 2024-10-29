'use client';

import Link from 'next/link';
import {
  PlusCircle,
  Pencil,
  Trash2,
  FileText,
  Link as LinkIcon,
} from 'lucide-react'; // Include LinkIcon in your imports
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface Offer {
  id: number;
  title: string;
  pdfFile: File;
  deadline: Date;
  company: number;
}

export default function RecruitmentOffers() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentOffer, setCurrentOffer] = useState<Offer | null>(null);

  const [isMounted, setIsMounted] = useState(false); // Ensure client-side only code
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  // Define the fetchOffers function
  const fetchOffers = async (companyId: string) => {
    if (!companyId) {
      throw new Error('companyId is required');
    }

    const response = await fetch(`/api/rh_space?companyId=${companyId}`);

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Failed to fetch offers');
    }

    return response.json();
  };

  useEffect(() => {
    setIsMounted(true);

    const loadOffers = async () => {
      try {
        const companyId = localStorage.getItem('company_id'); // Retrieve company_id from localStorage

        if (companyId) {
          const response = await fetch(`/api/rh_space?companyId=${companyId}`); // Use companyId from localStorage
          const data = await response.json(); // Parse the response as JSON

          if (response.ok) {
            setOffers(data.content); // Now you can safely access data.content
            //console.log(data.content);
          } else {
            console.error('Error fetching offers:', data.error);
          }
        } else {
          console.error('Company ID not found in localStorage');
        }
      } catch (error) {
        console.error('Error fetching offers:', error);
      } finally {
        setLoading(false);
      }
    };

    loadOffers();
  }, []);

  const handleAddOffer = async (newOfferFormData: FormData) => {
    try {
      const companyId = localStorage.getItem('company_id');
      // Log formData contents before sending to API
      // for (const [key, value] of newOfferFormData.entries()) {
      //   console.log(`${key}:`, value); // Log key and value of each FormData entry
      //  }

      // Call API to add offer
      const response = await fetch('/api/rh_space/create_offer', {
        method: 'POST', // Specify the POST method
        body: newOfferFormData, // Send the FormData directly
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error: ${errorData.error}`);
      }

      const offer = await response.json(); // Get the response data

      // Optionally update offers state here if necessary
      if (companyId) {
        const updatedOffersData = await fetchOffers(companyId);
        setOffers(updatedOffersData.content);
      } else {
        console.log('Company Id is mandatory');
      }

      // Close dialog or perform any other UI updates
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error adding offer:', error);
    }
  };

  const handleEditOffer = async (updatedOfferFormData: FormData) => {
    try {
      // Log formData contents for debugging
      for (const [key, value] of updatedOfferFormData.entries()) {
        console.log(`${key}:`, value);
      }

      // Call the API to update the offer
      const response = await fetch(
        `/api/rh_space/update_offer/${updatedOfferFormData.get('id')}`,
        {
          // Make sure the correct endpoint is used
          method: 'PUT',
          body: updatedOfferFormData,
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update offer');
      }

      const updatedOffer = await response.json();
      const companyId = localStorage.getItem('company_id');
      if (companyId) {
        const updatedOffersData = await fetchOffers(companyId);
        setOffers(updatedOffersData.content);
      }
      
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error updating offer:', error);
    }
  };

  const handleDeleteOffer = async (id: number) => {
    try {
      const response = await fetch(`/api/rh_space/delete_offer/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete offer');
      }

      setOffers(offers.filter((offer) => offer.id !== id));
    } catch (error) {
      console.error('Error deleting offer:', error);
      // Optionally, you can set an error state here for UI feedback
    }
  };

  const handleDownload = async (offerId: number, offerTitle: string) => {
    console.log('Downloading offer with ID:', offerId);
    try {
      const response = await fetch(`/api/file/${offerId}`);

      if (!response.ok) {
        throw new Error('Failed to fetch file');
      }

      const blob = await response.blob(); // Get the blob from the response
      const pdfUrl = URL.createObjectURL(blob); // Create a URL for the blob

      const link = document.createElement('a');
      link.href = pdfUrl; // Use the blob URL here
      link.download = `${offerTitle}_offer.pdf`; // Customize the filename
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Revoke the Blob URL to free up memory
      URL.revokeObjectURL(pdfUrl);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  const handleReportClick = (offerId: number) => {
    if (isMounted) {
      // Ensure this is only executed on the client
      router.push(`/hr/report/${offerId}`);
    }
  };

  if (!isMounted) {
    return null; // Prevent server-side rendering of client-side only hooks
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white text-black flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-xl font-semibold">Loading offers...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Recruitment Offers</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setCurrentOffer(null)}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add New Offer
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {currentOffer ? 'Edit Offer' : 'Add New Offer'}
              </DialogTitle>
            </DialogHeader>
            <OfferForm
              offer={currentOffer}
              onSubmit={currentOffer ? handleEditOffer : handleAddOffer}
              onCancel={() => setIsDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Render offers as cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {offers.map((offer) => (
          <Card key={offer.id} className="shadow-lg">
            <CardHeader>
              <CardTitle>{offer.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Deadline: {new Date(offer.deadline).toLocaleDateString()}</p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setCurrentOffer(offer);
                    setIsDialogOpen(true);
                  }}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteOffer(offer.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleReportClick(offer.id)}
                >
                  <FileText className="h-4 w-4" /> Report
                </Button>
                {/* Link to download/view the job description using Next.js Link */}
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleDownload(offer.id, offer.title)}
                >
                  <LinkIcon className="h-4 w-4" /> Job Description
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

interface OfferFormProps {
  offer: Offer | null;
  onSubmit: (offerFormData: FormData) => void; // Always expect FormData
  onCancel: () => void;
}

function OfferForm({ offer, onSubmit, onCancel }: OfferFormProps) {
  const [title, setTitle] = useState(offer?.title || '');
  const [company, setCompany] = useState<number | null>(offer?.company || null);
  const [pdfFile, setPdfFile] = useState<File | null>(offer?.pdfFile || null);
  const [deadline, setDeadline] = useState<Date | null>(
    offer?.deadline || null
  );
  // const [requirements, setRequirements] = useState(offer?.requirements || "");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedCompanyId = localStorage.getItem('company_id');
    if (storedCompanyId) {
      setCompany(parseInt(storedCompanyId, 10));
    } else {
      setError('Company ID not found in localStorage.');
    }
  }, []);

  const formatDate = (date: Date): string => {
    return new Date(date).toISOString().slice(0, 10);
  };

  // const formatDate = (date: Date | null): string => {
  //   if (date && !isNaN(new Date(date).getTime())) {
  //     return new Date(date).toISOString().slice(0, 10);
  //   }
  //   return ''; // Return empty string for invalid date
  // };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!pdfFile) {
      setError('PDF file is required.');
      return;
    }
    setError(null);

    // Validate the length of title and requirements
    // if (title.length < 5) {
    //   setError("Title must be at least 5 characters long.");
    //   return;
    // }

    // if (requirements.length < 10) {
    //   setError("Requirements must be at least 10 characters long.");
    //   return;
    // }

    const formData = new FormData();
    formData.append('title', title);

    if (deadline) {
      formData.append('deadline', formatDate(deadline));
    } else {
      setError('Deadline is required.');
      return;
    }

    if (offer?.id) {
      formData.append('id', offer.id.toString()); // Add offer ID for updates
    }

    // formData.append("requirements", requirements);
    formData.append('pdfFile', pdfFile);
    formData.append('company', company !== null ? company.toString() : ''); // Convert number to string

    setError(null);
    onSubmit(formData);
  };

  const handleCompanyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const companyValue = e.target.value;
    setCompany(companyValue ? parseInt(companyValue, 10) : null);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateStr = e.target.value;
    setDeadline(dateStr ? new Date(dateStr) : null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPdfFile(e.target.files[0]);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Title input field */}
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          min={5}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      {/* Requirements input field */}
      <div>
        <Label htmlFor="deadline">Deadline:</Label>
        <Input
          id="deadline"
          type="date"
          value={deadline ? formatDate(deadline) : ''}
          onChange={handleDateChange}
          required
        />
      </div>

      {/* PDF File input field */}
      <div>
        <Label htmlFor="pdfFile">PDF File (Required)</Label>
        <Input
          id="pdfFile"
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          required
        />
      </div>

      {error && <p className="text-red-500">{error}</p>}

      {/* Buttons */}
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{offer ? 'Update' : 'Add'} Offer</Button>
      </div>
    </form>
  );
}
