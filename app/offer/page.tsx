'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MapPin, DollarSign } from 'lucide-react'

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

export default function CandidateOffersPage() {
  const [selectedOffer, setSelectedOffer] = useState<JobOffer | null>(null)

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-8">Job Offers</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockOffers.map((offer) => (
          <Card key={offer.id} className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-100">{offer.title}</CardTitle>
              <CardDescription className="text-gray-400">{offer.company}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center mb-2 text-gray-300">
                <MapPin className="mr-2 h-4 w-4" />
                <span>{offer.location}</span>
              </div>
              <div className="flex items-center mb-4 text-gray-300">
                <DollarSign className="mr-2 h-4 w-4" />
                <span>{offer.salary}</span>
              </div>
              <p className="text-sm text-gray-400">{offer.description}</p>
            </CardContent>
            <CardFooter>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setSelectedOffer(offer)}>
                    Apply with CV
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] bg-white text-gray-900">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-semibold mb-2">Apply for {selectedOffer?.title}</DialogTitle>
                    <DialogDescription className="text-gray-600 mb-4">
                      Upload your CV and submit your application for {selectedOffer?.company}.
                    </DialogDescription>
                  </DialogHeader>
                  <form className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="cv" className="text-sm font-medium text-gray-700">Upload CV</Label>
                      <Input id="cv" type="file" className="bg-gray-100 border-gray-300 text-gray-900" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="coverLetter" className="text-sm font-medium text-gray-700">Cover Letter (Optional)</Label>
                      <textarea
                        id="coverLetter"
                        className="w-full h-32 p-2 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100 text-gray-900 border border-gray-300"
                        placeholder="Write a brief cover letter..."
                      ></textarea>
                    </div>
                    <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">Submit Application</Button>
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