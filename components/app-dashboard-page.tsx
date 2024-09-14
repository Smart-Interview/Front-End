'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserCircle, Briefcase, FileText, MessageSquare } from 'lucide-react'

export function Page() {
  const [activeTab, setActiveTab] = useState('job-offer')

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Smart Interview</h1>
          <Button variant="outline">Logout</Button>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="job-offer">
              <Briefcase className="mr-2 h-4 w-4" />
              Job Offer
            </TabsTrigger>
            <TabsTrigger value="application-review">
              <FileText className="mr-2 h-4 w-4" />
              Application Review
            </TabsTrigger>
            <TabsTrigger value="text-summarization">
              <MessageSquare className="mr-2 h-4 w-4" />
              Text Summarization
            </TabsTrigger>
            <TabsTrigger value="question-generator">
              <UserCircle className="mr-2 h-4 w-4" />
              Question Generator
            </TabsTrigger>
          </TabsList>
          <TabsContent value="job-offer">
            <Card>
              <CardHeader>
                <CardTitle>Job Offer</CardTitle>
              </CardHeader>
              <CardContent>
                <Input placeholder="Enter job title" className="mb-4" />
                <Button>Generate Job Offer</Button>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="application-review">
            <Card>
              <CardHeader>
                <CardTitle>Application Review</CardTitle>
              </CardHeader>
              <CardContent>
                <Input type="file" className="mb-4" />
                <Button>Review Application</Button>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="text-summarization">
            <Card>
              <CardHeader>
                <CardTitle>Text Summarization</CardTitle>
              </CardHeader>
              <CardContent>
                <textarea className="w-full h-32 p-2 border rounded mb-4" placeholder="Enter text to summarize"></textarea>
                <Button>Summarize Text</Button>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="question-generator">
            <Card>
              <CardHeader>
                <CardTitle>Question Generator</CardTitle>
              </CardHeader>
              <CardContent>
                <Input placeholder="Enter job role" className="mb-4" />
                <Button>Generate Questions</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}