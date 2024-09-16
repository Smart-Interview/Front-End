'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Briefcase, MapPin, DollarSign } from 'lucide-react'

interface JobOffer {
  id: number
  title: string
  company: string
  location: string
  salary: string
  description: string
}

const mockOffers: JobOffer[] = [
  {
    id: 1,
    title: "Software Engineer",
    company: "Tech Innovators Inc.",
    location: "San Francisco, CA",
    salary: "$120,000 - $160,000",
    description: "Join our team to build cutting-edge web applications using the latest technologies."
  },
  {
    id: 2,
    title: "Data Scientist",
    company: "Data Insights Co.",
    location: "New York, NY",
    salary: "$130,000 - $180,000",
    description: "Apply machine learning and statistical models to solve complex business problems."
  },
  {
    id: 3,
    title: "UX Designer",
    company: "Creative Solutions Ltd.",
    location: "London, UK",
    salary: "£60,000 - £80,000",
    description: "Create intuitive and engaging user experiences for our digital products."
  },
]

export function Page() {
  const [selectedOffer, setSelectedOffer] = useState<JobOffer | null>(null)

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Job Offers</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockOffers.map((offer) => (
          <Card key={offer.id} className="flex flex-col">
            <CardHeader>
              <CardTitle>{offer.title}</CardTitle>
              <CardDescription>{offer.company}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="flex items-center mb-2">
                <MapPin className="mr-2 h-4 w-4" />
                <span>{offer.location}</span>
              </div>
              <div className="flex items-center mb-4">
                <DollarSign className="mr-2 h-4 w-4" />
                <span>{offer.salary}</span>
              </div>
              <p className="text-sm text-muted-foreground">{offer.description}</p>
            </CardContent>
            <CardFooter>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-full" onClick={() => setSelectedOffer(offer)}>
                    Apply with CV
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Apply for {selectedOffer?.title}</DialogTitle>
                    <DialogDescription>
                      Upload your CV and submit your application for {selectedOffer?.company}.
                    </DialogDescription>
                  </DialogHeader>
                  <form className="space-y-4">
                    <div>
                      <Label htmlFor="cv">Upload CV</Label>
                      <Input id="cv" type="file" />
                    </div>
                    <div>
                      <Label htmlFor="coverLetter">Cover Letter (Optional)</Label>
                      <textarea
                        id="coverLetter"
                        className="w-full h-32 p-2 border rounded"
                        placeholder="Write a brief cover letter..."
                      ></textarea>
                    </div>
                    <Button type="submit" className="w-full">Submit Application</Button>
                  </form>
                </DialogContent>
              </Dialog>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}