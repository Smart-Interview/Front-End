"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Eye, PlusCircle } from "lucide-react"

import { fetchCompanies } from '@/app/api/company_space/get_company/[ceoId]/route';


interface Company {
  id: number
  name: string
  industry: string
  location: string
}

interface CompanyFormData {
  name: string
  industry: string
  location: string
}

export default function CompanyPage() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  
  const [formData, setFormData] = useState<CompanyFormData>({
    name: "",
    industry: "",
    location: "",
  })
  const router = useRouter()

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const ceoId = localStorage.getItem('user_id')
        
        if(ceoId) {
          const response = await fetch(`/api/company_space/get_company/${ceoId}`)
          const data = await response.json()

          if (response.ok) {
            const companiesArray = Array.isArray(data) ? data : [data]
            setCompanies(companiesArray)
          } else {
            console.error('Error fetching companies:', data.error)
          }
        } else {
          console.error('CEO ID not found in localStorage')
        }
      } catch (error) {
        console.error('Error fetching companies:', error)
      }
    }
  
    fetchCompanies()
  }, [])

  const handleViewHRs = (companyId: number) => {
    router.push(`/ceo/companies/${companyId}/hrs`)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }))
  }


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Get the ceoId from localStorage
    const ceoId = localStorage.getItem('user_id');
    
    if (!ceoId) {
      console.error('CEO ID not found in localStorage');
      return;
    }
  
    try {



      // const payload = {
      //   ...formData, // Spread the form data
      //   ceo: parseInt(ceoId), // Add the ceoId to the payload as an integer
      // };
  
      // // Log the payload to confirm it includes the CEO ID
      // console.log("Request Payload:", payload);
      // // Construct the API URL with the ceoId


      const apiUrl = `/api/company_space/create_company/${ceoId}`;
  
      // Make the POST request to the API
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData, // Spread the form data
          ceo: parseInt(ceoId), // Add the ceoId to the payload as an integer
        }),
      });

      // console.log(formData);
  
      // Handle the response from the server
      if (response.ok) {
        const newCompany = await response.json();
        const updatedCompaniesData = await fetchCompanies(ceoId);
        setCompanies(updatedCompaniesData);
        //setCompanies((prevCompanies) => [...prevCompanies, newCompany]); // Add the new company to the state
        setIsDialogOpen(false); // Close the dialog/modal
        setFormData({ name: "", industry: "", location: "" }); // Reset the form
      } else {
        console.error('Error creating company:', await response.text());
      }
    } catch (error) {
      console.error('Error creating company:', error);
    }
  };
  

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-2xl font-bold mb-6">Company List</h1>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button className="mb-6">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Company
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Company</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Company Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="industry">Industry</Label>
              <Input
                id="industry"
                name="industry"
                value={formData.industry}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                required
              />
            </div>
            <Button type="submit">Create Company</Button>
          </form>
        </DialogContent>
      </Dialog>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Industry</TableHead>
            <TableHead>Location</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {companies.map((company) => (
            <TableRow key={company.id}>
              <TableCell className="font-medium">{company.id}</TableCell>
              <TableCell>{company.name}</TableCell>
              <TableCell>{company.industry}</TableCell>
              <TableCell>{company.location}</TableCell>
              <TableCell className="text-right">
                <Button variant="secondary" size="sm" onClick={() => handleViewHRs(company.id)}>
                  <Eye className="h-4 w-4 mr-2" /> View HR
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}