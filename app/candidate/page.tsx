'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from "next-auth/react";

const CandidatePage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    const userId = localStorage.getItem('user_id');

    // Check session loading status
    if (status === "loading") {
      return; // Optionally handle loading state
    }

    // Redirect logic
    if (session && !userId) {
      // If there is a session but no user_id, redirect to /role
      router.push('/role');
    }
  }, [session, status, router]);

  // Optional loading state handling
  if (status === "loading") {
    return <div className="my-3">Loading...</div>;
  }

  // Render your candidate page content here
  return (
      <div>
        <h1>Welcome to the Candidate Page</h1>
        {/* Other candidate page content */}
      </div>
  );
};

export default CandidatePage;

// 'use client'
//
// import { useState } from 'react'
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Calendar } from 'lucide-react'
//
// interface JobDescription {
//   overview: string;
//   responsibilities: string[];
//   requirements: string[];
//   benefits: string[];
// }
//
// interface JobOffer {
//   id: number;
//   title: string;
//   company: string;
//   deadline: string;
//   description: JobDescription;
// }
//
// const mockOffers: JobOffer[] = [
//   {
//     id: 1,
//     title: "Software Engineer",
//     company: "Tech Innovators Inc.",
//     deadline: "2023-12-31",
//     description: {
//       overview: "Join our team to build cutting-edge web applications using the latest technologies.",
//       responsibilities: [
//         "Develop and maintain high-quality web applications",
//         "Collaborate with cross-functional teams to define and implement new features",
//         "Optimize application for maximum speed and scalability",
//         "Write clean, maintainable, and efficient code"
//       ],
//       requirements: [
//         "Bachelor's degree in Computer Science or related field",
//         "3+ years of experience in full-stack web development",
//         "Proficiency in JavaScript, React, and Node.js",
//         "Experience with cloud platforms (AWS, Azure, or GCP)"
//       ],
//       benefits: [
//         "Competitive salary and equity package",
//         "Health, dental, and vision insurance",
//         "Flexible work hours and remote work options",
//         "Professional development budget"
//       ]
//     }
//   },
//   {
//     id: 2,
//     title: "Data Scientist",
//     company: "Data Insights Co.",
//     deadline: "2024-01-15",
//     description: {
//       overview: "Apply machine learning and statistical models to solve complex business problems.",
//       responsibilities: [
//         "Develop and implement advanced machine learning models",
//         "Analyze large datasets to extract valuable insights",
//         "Create data visualizations and reports for stakeholders",
//         "Collaborate with engineering teams to deploy models to production"
//       ],
//       requirements: [
//         "Master's or PhD in Data Science, Statistics, or related field",
//         "Strong programming skills in Python and R",
//         "Experience with big data technologies (Hadoop, Spark)",
//         "Excellent communication and presentation skills"
//       ],
//       benefits: [
//         "Competitive salary based on experience",
//         "Stock options and annual bonus",
//         "Health and wellness programs",
//         "Continuous learning opportunities"
//       ]
//     }
//   },
//   {
//     id: 3,
//     title: "UX Designer",
//     company: "Creative Solutions Ltd.",
//     deadline: "2024-02-01",
//     description: {
//       overview: "Create intuitive and engaging user experiences for our digital products.",
//       responsibilities: [
//         "Conduct user research and usability testing",
//         "Create wireframes, prototypes, and high-fidelity designs",
//         "Collaborate with product managers and developers",
//         "Iterate on designs based on user feedback and data"
//       ],
//       requirements: [
//         "Bachelor's degree in Design, HCI, or related field",
//         "3+ years of experience in UX/UI design",
//         "Proficiency in design tools (Figma, Sketch, Adobe XD)",
//         "Strong portfolio demonstrating problem-solving skills"
//       ],
//       benefits: [
//         "Competitive salary and performance bonuses",
//         "Flexible work environment",
//         "Health and wellness benefits",
//         "Professional development opportunities"
//       ]
//     }
//   },
// ]
//
// export default function CandidateOffersPage() {
//   const [selectedOffer, setSelectedOffer] = useState<JobOffer | null>(null)
//
//   return (
//     <div className="min-h-screen bg-white text-black p-8">
//       <h1 className="text-3xl font-bold mb-8">Job Offers</h1>
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {mockOffers.map((offer) => (
//           <Card key={offer.id} className="bg-white border-black">
//             <CardHeader>
//               <CardTitle className="text-black">{offer.title}</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <p className="text-sm text-gray-600 mb-2">{offer.company}</p>
//               <div className="flex items-center text-sm text-gray-500">
//                 <Calendar className="w-4 h-4 mr-2" />
//                 <span>Deadline: {offer.deadline}</span>
//               </div>
//             </CardContent>
//             <CardFooter className="flex justify-between">
//               <Dialog>
//                 <DialogTrigger asChild>
//                   <Button variant="outline" className="border-black text-black hover:bg-gray-100" onClick={() => setSelectedOffer(offer)}>
//                     View Details
//                   </Button>
//                 </DialogTrigger>
//                 <DialogContent className="sm:max-w-[600px] bg-white text-black">
//                   <DialogHeader>
//                     <DialogTitle className="text-2xl font-semibold mb-2">{selectedOffer?.title}</DialogTitle>
//                     <DialogDescription className="text-gray-600 mb-4">
//                       {selectedOffer?.company} - Deadline: {selectedOffer?.deadline}
//                     </DialogDescription>
//                   </DialogHeader>
//                   <div className="mt-4 space-y-4">
//                     <div>
//                       <h3 className="text-lg font-semibold mb-2">Overview</h3>
//                       <p className="text-sm text-black">{selectedOffer?.description.overview}</p>
//                     </div>
//                     <div>
//                       <h3 className="text-lg font-semibold mb-2">Responsibilities</h3>
//                       <ul className="list-disc pl-5 text-sm">
//                         {selectedOffer?.description.responsibilities.map((resp, index) => (
//                           <li key={index}>{resp}</li>
//                         ))}
//                       </ul>
//                     </div>
//                     <div>
//                       <h3 className="text-lg font-semibold mb-2">Requirements</h3>
//                       <ul className="list-disc pl-5 text-sm">
//                         {selectedOffer?.description.requirements.map((req, index) => (
//                           <li key={index}>{req}</li>
//                         ))}
//                       </ul>
//                     </div>
//                     <div>
//                       <h3 className="text-lg font-semibold mb-2">Benefits</h3>
//                       <ul className="list-disc pl-5 text-sm">
//                         {selectedOffer?.description.benefits.map((benefit, index) => (
//                           <li key={index}>{benefit}</li>
//                         ))}
//                       </ul>
//                     </div>
//                   </div>
//                 </DialogContent>
//               </Dialog>
//               <Dialog>
//                 <DialogTrigger asChild>
//                   <Button className="bg-black text-white hover:bg-gray-800" onClick={() => setSelectedOffer(offer)}>
//                     Apply
//                   </Button>
//                 </DialogTrigger>
//                 <DialogContent className="sm:max-w-[425px] bg-white text-black">
//                   <DialogHeader>
//                     <DialogTitle className="text-2xl font-semibold mb-2">Apply for {selectedOffer?.title}</DialogTitle>
//                     <DialogDescription className="text-gray-600 mb-4">
//                       Upload your CV and submit your application for {selectedOffer?.company}.
//                     </DialogDescription>
//                   </DialogHeader>
//                   <form className="space-y-6">
//                     <div className="space-y-2">
//                       <Label htmlFor="cv" className="text-sm font-medium text-black">Upload CV</Label>
//                       <Input id="cv" type="file" className="bg-white border-black text-black" />
//                     </div>
//                     <Button type="submit" className="w-full bg-black text-white hover:bg-gray-800">Submit Application</Button>
//                   </form>
//                 </DialogContent>
//               </Dialog>
//             </CardFooter>
//           </Card>
//         ))}
//       </div>
//     </div>
//   )
// }