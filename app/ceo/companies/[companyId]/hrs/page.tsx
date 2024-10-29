"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil, Trash2, PlusCircle } from "lucide-react";

interface HR {
  id: number;
  userName: string;
  email: string;
  company: string;
}

interface NewHR {
  userName: string;
  email: string;
  code: string;
  company: string; // Change this to always be a string
}

export default function AllHR() {
  const { companyId } = useParams();
  const [hrList, setHrList] = useState<HR[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Ensure companyId is a string
  const companyIdString = Array.isArray(companyId) ? companyId[0] : companyId || "";

  const [newHR, setNewHR] = useState<NewHR>({
    userName: "",
    email: "",
    code: "",
    company: companyIdString, // Use the normalized companyId
  });

  const fetchHrs = async (companyId: string) => {
    if (!companyId) {
      throw new Error("companyId is required");
    }

    const response = await fetch(`/api/company_space/get_hr/${companyId}`);

    if (!response.ok) {
      throw new Error("Failed to fetch HRs");
    }

    return response.json();
  };

  useEffect(() => {
    if (!companyIdString) return;

    const fetchHRList = async () => {
      try {
        const data: HR[] = await fetchHrs(companyIdString);
        setHrList(data);
        setError(null); // Clear previous errors
      } catch (error) {
        setError("Error fetching HR employees.");
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHRList();
  }, [companyIdString]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewHR((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddHR = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/company_space/create_hr/${companyIdString}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newHR),
      });

      if (response.ok) {
        setIsAddDialogOpen(false);
        setNewHR({ userName: "", email: "", code: "", company: companyIdString || "" }); // Ensure company is always a string
        const updatedHrsData = await fetchHrs(companyIdString);
        setHrList(updatedHrsData);
      } else {
        console.error("Failed to add new HR employee.");
      }
    } catch (error) {
      console.error("Error adding new HR employee:", error);
    }
  };

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
        {loading ? (
          <div className="flex justify-center items-center h-24">
            <p>Loading...</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Id</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Company</TableHead>
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
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => console.log("Modify HR with ID:", hr.id)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-red-500 text-white"
                          onClick={() => console.log("Delete HR with ID:", hr.id)}
                        >
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
        )}
      </div>
    </div>
  );
}
