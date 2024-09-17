'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Briefcase } from 'lucide-react'

interface JobOffer {
  id: number
  title: string
  company: string
  description: string
  fullDescription: string
}

const mockOffers: JobOffer[] = [
  {
    id: 1,
    title: "Software Engineer",
    company: "Tech Innovators Inc.",
    description: "Join our team to build cutting-edge web applications using the latest technologies.",
    fullDescription: "We are seeking a talented Software Engineer to join our innovative team. In this role, you will be responsible for developing and maintaining high-quality web applications using cutting-edge technologies. You will work closely with our product and design teams to bring new features to life and ensure the best possible user experience. The ideal candidate has a strong background in full-stack development, is passionate about clean code, and stays up-to-date with the latest industry trends. Requirements include proficiency in JavaScript, React, Node.js, and experience with cloud platforms like AWS or Azure."
  },
  {
    id: 2,
    title: "Data Scientist",
    company: "Data Insights Co.",
    description: "Apply machine learning and statistical models to solve complex business problems.",
    fullDescription: "Data Insights Co. is looking for a skilled Data Scientist to join our analytics team. In this role, you will apply advanced machine learning and statistical techniques to extract valuable insights from large datasets. You will work on a variety of projects, from predictive modeling to natural language processing, helping our clients make data-driven decisions. The ideal candidate has a strong background in statistics, machine learning, and programming. Proficiency in Python, R, and SQL is required, along with experience in big data technologies like Hadoop or Spark. A PhD or Master's degree in a quantitative field is preferred."
  },
  {
    id: 3,
    title: "UX Designer",
    company: "Creative Solutions Ltd.",
    description: "Create intuitive and engaging user experiences for our digital products.",
    fullDescription: "Creative Solutions Ltd. is seeking a talented UX Designer to help shape the future of our digital products. In this role, you will be responsible for creating intuitive and engaging user experiences across web and mobile platforms. You will conduct user research, create wireframes and prototypes, and work closely with our development team to bring your designs to life. The ideal candidate has a strong portfolio demonstrating their ability to solve complex design challenges, proficiency in design tools like Figma or Sketch, and excellent communication skills. Experience with user testing and a basic understanding of front-end development are a plus."
  },
]

export default function CandidateOffersPage() {
  const [selectedOffer, setSelectedOffer] = useState<JobOffer | null>(null)

  return (
    <div className="min-h-screen bg-white text-black p-8">
      <h1 className="text-3xl font-bold mb-8">Job Offers</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockOffers.map((offer) => (
          <Card key={offer.id} className="bg-white border-black">
            <CardHeader>
              <CardTitle className="text-black">{offer.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">{offer.company}</p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="border-black text-black hover:bg-gray-100" onClick={() => setSelectedOffer(offer)}>
                    View Details
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] bg-white text-black">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-semibold mb-2">{selectedOffer?.title}</DialogTitle>
                    <DialogDescription className="text-gray-600 mb-4">
                      {selectedOffer?.company}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="mt-4">
                    <p className="text-sm text-black">{selectedOffer?.fullDescription}</p>
                  </div>
                </DialogContent>
              </Dialog>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-black text-white hover:bg-gray-800" onClick={() => setSelectedOffer(offer)}>
                    Apply
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] bg-white text-black">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-semibold mb-2">Apply for {selectedOffer?.title}</DialogTitle>
                    <DialogDescription className="text-gray-600 mb-4">
                      Upload your CV and submit your application for {selectedOffer?.company}.
                    </DialogDescription>
                  </DialogHeader>
                  <form className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="cv" className="text-sm font-medium text-black">Upload CV</Label>
                      <Input id="cv" type="file" className="bg-white border-black text-black" />
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
  )
}