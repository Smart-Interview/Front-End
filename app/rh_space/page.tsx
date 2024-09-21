"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PlusCircle, Pencil, Trash2, FileText } from "lucide-react";
import {updateOffer, deleteOffer } from "@/app/api/rh_space/route";
import { fetchOffers } from '@/app/api/rh_space/route';


interface Offer {
  id: number
  title: string;
  pdfFile: File;
  deadline: Date;
  company: number
  
}

export default function RecruitmentOffers() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentOffer, setCurrentOffer] = useState<Offer | null>(null);
  //chat
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadOffers = async () => {
      try {

        const response = await fetch('/api/rh_space?companyId=1'); // Include companyId in the request
        const data = await response.json(); // Parse the response as JSON

        if (response.ok) {
          setOffers(data.content); // Now you can safely access data.content
          console.log(data.content);
        } else {
          console.error('Error fetching offers:', data.error);
        }

      } catch (error) {
        console.error('Error fetching offers:', error);
      }
    };

    loadOffers();
  }, []);
  

  const handleAddOffer = async (newOfferFormData: FormData) => {
  try {
    // Log formData contents before sending to API
    for (const [key, value] of newOfferFormData.entries()) {
      console.log(`${key}:`, value); // Log key and value of each FormData entry
    }

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
    const updatedOffersData = await fetchOffers();
    setOffers(updatedOffersData.content);

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
    const response = await fetch(`/api/rh_space/update_offer/${updatedOfferFormData.get('id')}`, {  // Make sure the correct endpoint is used
      method: 'PUT',
      body: updatedOfferFormData,
    });

    if (!response.ok) {
      throw new Error('Failed to update offer');
    }

    const updatedOffer = await response.json();
    const updatedOffersData = await fetchOffers();
    setOffers(updatedOffersData.content);

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

  return (
    <div className="container mx-auto py-10">
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
              <DialogTitle>{currentOffer ? "Edit Offer" : "Add New Offer"}</DialogTitle>
            </DialogHeader>
            <OfferForm
              offer={currentOffer}
              onSubmit={currentOffer ? handleEditOffer : handleAddOffer}
              onCancel={() => setIsDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            {/* <TableHead>Description path</TableHead> */}
            <TableHead>Deadline</TableHead>
            {/* <TableHead>Requirements</TableHead> */}
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {offers.map((offer) => (
            <TableRow key={offer.id}>
              <TableCell>{offer.title}</TableCell>
              {/* <TableCell>{offer.pdfFile?.name || "No file"}</TableCell> */}
              <TableCell>{new Date(offer.deadline).toLocaleDateString()}</TableCell>
              {/* <TableCell>{offer.requirements}</TableCell> */}
              <TableCell>
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
                  <Button variant="destructive" size="sm" onClick={() => handleDeleteOffer(offer.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}



interface OfferFormProps {
  offer: Offer | null;
  onSubmit: (offerFormData: FormData) => void; // Always expect FormData
  onCancel: () => void;
}


function OfferForm({ offer, onSubmit, onCancel }: OfferFormProps) {
  const [title, setTitle] = useState(offer?.title || "");
  const [company, setCompany] = useState<number | null>(offer?.company || null);
  const [pdfFile, setPdfFile] = useState<File | null>(offer?.pdfFile || null);
  const [deadline, setDeadline] = useState<Date | null>(offer?.deadline || null);
  // const [requirements, setRequirements] = useState(offer?.requirements || "");
  const [error, setError] = useState<string | null>(null);



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
      setError("PDF file is required.");
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
    formData.append("title", title);

    if (deadline) {
      formData.append("deadline", formatDate(deadline));
    } else {
      setError("Deadline is required.");
      return;
    }

    if (offer?.id) {
      formData.append("id", offer.id.toString()); // Add offer ID for updates
    }

    // formData.append("requirements", requirements);
    formData.append("pdfFile", pdfFile);
    formData.append("company", company !== null ? company.toString() : ''); // Convert number to string
    
   

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
        <Input id="title" min={5} value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>

      {/* Requirements input field */}
      <div>
        <Label htmlFor="deadline">Deadline:</Label>
        <Input id="deadline" type="date" value={deadline ? formatDate(deadline) : ''} onChange={handleDateChange} required/>      
      </div>

      {/* Recruiter input field */}
      <div>
        <Label htmlFor="company">Company</Label>
        <Input id="company" type="number" value={company !== null ? company.toString() : ''}  onChange={handleCompanyChange} required />
      </div>

      {/* PDF File input field */}
      <div>
        <Label htmlFor="pdfFile">PDF File (Required)</Label>
        <Input id="pdfFile" type="file" accept=".pdf" onChange={handleFileChange} required />
      </div>

      {error && <p className="text-red-500">{error}</p>}

      {/* Buttons */}
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{offer ? "Update" : "Add"} Offer</Button>
      </div>
    </form>
  );
}


