"use client"

import { useParams } from "next/navigation";
import { useEffect, useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Pencil, Trash2, PlusCircle } from "lucide-react"
import { fetchHrs } from "@/app/api/company_space/get_hr/[companyId]/route";

interface Hr {
  id: number
  firstName: string
  lastName: string
  mail: string
  code: string
}

interface HR {
  id: number
  userName: string
  email: string
  company: string
}

interface newHR {

  userName: string
  email: string
  code: string
  company: string | null
}

export default function AllHR() {


  const { companyId } = useParams();

 
  const [hrList, setHrList] = useState<HR[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [company_Id,setCompanyId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [newHR, setNewHR] = useState<newHR>({
    userName: "",
    email: "",
    code: "",
    company: companyId ? companyId as string : "",  })
  
  if (!companyId)
  {
    return;
  }

  useEffect(() => {
     
      setCompanyId(companyId as string);
    
  }, [companyId]); // Run this effect when companyId changes

  useEffect(() => {

    const fetchHRList = async () => {
      setLoading(true);
      try {
        // Fetch from the new API route
        const response = await fetch(`/api/company_space/get_hr/${companyId}`);
        
        if (response.ok) {
          const data: HR[] = await response.json();
          setHrList(data);
          console.log('dataaa', data);
          setError(null); // Clear any previous errors
        } else {
          setError("Failed to fetch HR employees.");
          console.error("Failed to fetch HR employees:", await response.text());
        }
      } catch (error) {
        setError("Error fetching HR employees.");
        console.error("Error fetching HR employees:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHRList(); // Call the function inside useEffect
  }, [companyId]);

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch('/api/', {
        method: 'DELETE',
      })
      if (response.ok) {
        setHrList(hrList.filter(hr => hr.id !== id))
      } else {
        console.error("Failed to delete HR employee.")
      }
    } catch (error) {
      console.error("Error deleting HR employee:", error)
    }
  }

  const handleModify = (id: number) => {
    // Implement modify functionality
    console.log("Modify HR with ID:", id)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewHR(prev => ({ ...prev, [name]: value }))
  }



  const handleAddHR = async (e: React.FormEvent) => {
    e.preventDefault()




    const payload = {
        newHR, // Spread the form data
        
      };
  
      // Log the payload to confirm it includes the CEO ID
      console.log("Request Payload:", payload);
      // Construct the API URL with the ceoId



    try {
      const response = await fetch(`/api/company_space/create_hr/${companyId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newHR),
      })

      if (response.ok) {
        setIsAddDialogOpen(false)
        setNewHR({ userName: "", email: "", code: "" , company: company_Id});
        const updatedHrsData = await fetchHrs(companyId);
        setHrList(updatedHrsData);
        setIsAddDialogOpen(false); // Close the dialog/modal
      } else {
        console.error("Failed to add new HR employee.")
      }
    } catch (error) {
      console.error("Error adding new HR employee:", error)
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">All HR Employees</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add HR
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New HR Employee</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddHR} className="space-y-4">
              <div>
                <Label htmlFor="userName">User Name</Label>
                <Input
                  id="userName"
                  name="userName"
                  value={newHR.userName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={newHR.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="code">Code</Label>
                <Input
                  id="code"
                  name="code"
                  value={newHR.code}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <Button type="submit">Add HR</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Id</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Company_Id</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {hrList.length > 0 ? (
              hrList.map((hr) => (
                <TableRow key={hr.id}>
                  <TableCell>{hr.id}</TableCell>
                  <TableCell>{hr.userName}</TableCell>
                  <TableCell>{hr.email}</TableCell>
                  <TableCell>{hr.company}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleModify(hr.id)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(hr.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  No HR employees found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}