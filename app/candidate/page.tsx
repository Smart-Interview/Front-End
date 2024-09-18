'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, FileUp, Search } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function CandidatePage() {
  const [activeTab, setActiveTab] = useState('search-offer')
  const [jobOffers, setJobOffers] = useState<string[]>([])
  const [selectedOffer, setSelectedOffer] = useState('')
  const [cvUploaded, setCvUploaded] = useState(false)
  const [applicationStatus, setApplicationStatus] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [isSearching, setIsSearching] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSearching(true)
    // Simulating an API call to search for job offers
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate network delay
      const mockResults = [
        `${searchTerm} Engineer`,
        `Senior ${searchTerm} Developer`,
        `${searchTerm} Analyst`,
        `${searchTerm} Manager`
      ];
      setJobOffers(mockResults)
    } catch (error) {
      console.error('Error searching for job offers:', error)
      setJobOffers([])
    } finally {
      setIsSearching(false)
    }
  }

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCvUploaded(true)
    }
  }

  const handleSubmit = async () => {
    // Simulating application submission and processing
    try {
      await new Promise(resolve => setTimeout(resolve, 1500)) // Simulate processing time
      setApplicationStatus(Math.random() > 0.5 ? 'Accepted' : 'Rejected')
    } catch (error) {
      console.error('Error submitting application:', error)
      setApplicationStatus('Error')
    }
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <h1 className="text-3xl font-bold mb-8">Candidate Dashboard</h1>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
        <TabsList className="grid w-full grid-cols-3 bg-muted/50 p-1 rounded-lg">
          <TabsTrigger value="search-offer">Search Offer</TabsTrigger>
          <TabsTrigger value="upload-cv">Upload CV</TabsTrigger>
          <TabsTrigger value="application-status">Application Status</TabsTrigger>
        </TabsList>

        <TabsContent value="search-offer">
          <Card>
            <CardHeader>
              <CardTitle>Search Job Offers</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSearch} className="space-y-4">
                <div className="flex space-x-2">
                  <Input 
                    placeholder="Enter job title or keywords" 
                    className="flex-grow" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Button type="submit" disabled={isSearching}>
                    {isSearching ? 'Searching...' : <><Search className="mr-2 h-4 w-4" /> Search</>}
                  </Button>
                </div>
              </form>
              {jobOffers.length > 0 && (
                <div className="mt-4">
                  <Label htmlFor="job-offer">Select a job offer:</Label>
                  <Select onValueChange={setSelectedOffer}>
                    <SelectTrigger id="job-offer">
                      <SelectValue placeholder="Select a job offer" />
                    </SelectTrigger>
                    <SelectContent>
                      {jobOffers.map((offer, index) => (
                        <SelectItem key={index} value={offer}>{offer}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              {jobOffers.length === 0 && searchTerm && !isSearching && (
                <Alert className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>No Results</AlertTitle>
                  <AlertDescription>
                    No job offers found for "{searchTerm}". Please try a different search term.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="upload-cv">
          <Card>
            <CardHeader>
              <CardTitle>Upload Your CV</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="cv">Upload CV</Label>
                <Input id="cv" type="file" onChange={handleUpload} />
              </div>
              {cvUploaded && (
                <Alert>
                  <FileUp className="h-4 w-4" />
                  <AlertTitle>Success</AlertTitle>
                  <AlertDescription>Your CV has been uploaded successfully.</AlertDescription>
                </Alert>
              )}
              <Button onClick={handleSubmit} disabled={!selectedOffer || !cvUploaded}>
                Submit Application
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="application-status">
          <Card>
            <CardHeader>
              <CardTitle>Application Status</CardTitle>
            </CardHeader>
            <CardContent>
              {applicationStatus ? (
                <Alert variant={applicationStatus === 'Accepted' ? 'default' : 'destructive'}>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Application {applicationStatus}</AlertTitle>
                  <AlertDescription>
                    Your application for the position of {selectedOffer} has been {applicationStatus.toLowerCase()}.
                  </AlertDescription>
                </Alert>
              ) : (
                <p>No application submitted yet.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
