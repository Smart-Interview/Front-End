import { log } from "console";

// lib/api.ts
interface Offer {
  id: number
  title: string;
  pdfFile: File;
  deadline: Date;
  company: number
}







const API_URL = 'http://localhost:8040/api/v1';

export const fetchOffers = async () => {
  const response = await fetch(`${API_URL}/offers?companyId=1`);
  if (!response.ok) {
    throw new Error('Failed to fetch offers');
  }
  //console.log("sssssss");
  return response.json();
};

export const addOffer = async (formData : FormData) => {
    
    
    const response = await fetch(`${API_URL}/offers`, {
      method: 'POST',
      body: formData,  // No need for 'Content-Type', it will be automatically set
    });
  
    if (!response.ok) 
    {
        
            // Log formData contents before sending to API
      for (const [key, value] of formData.entries()) {
       console.log(`${key}:`, value);  // Log key and value of each formData entry
      }
      throw new Error('Failed to add offer');
    }
  
    return response.json();
  };

  export const updateOffer = async (formData: FormData) => {
    const offerId = formData.get('id'); // Extract the offer id from FormData
    const response = await fetch(`${API_URL}/offers/${offerId}`, {
      method: 'PUT',
      body: formData,  // Send the FormData directly
    });
  
    if (!response.ok) {
      throw new Error('Failed to update offer');
    }
    
    return response.json();  // Return the updated offer data
  };

export const deleteOffer = async (id: number) => {
  const response = await fetch(`${API_URL}/offers/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete offer');
  }
};
