'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

type Application = {
  id: string;
  jobTitle: string;
  company: string;
  appliedDate: string;
  status: 'Pending' | 'Accepted' | 'Rejected';
}

const mockApplications: Application[] = [
  { id: '1', jobTitle: 'Frontend Developer', company: 'TechCorp', appliedDate: '2023-05-15', status: 'Accepted' },
  { id: '2', jobTitle: 'UX Designer', company: 'DesignHub', appliedDate: '2023-05-20', status: 'Pending' },
  { id: '3', jobTitle: 'Data Analyst', company: 'DataWiz', appliedDate: '2023-05-25', status: 'Rejected' },
  { id: '4', jobTitle: 'Backend Engineer', company: 'ServerPro', appliedDate: '2023-06-01', status: 'Accepted' },
]

export default function ApplicationPage() {
  const [applications] = useState<Application[]>(mockApplications)
  const router = useRouter()

  const handleStartTest = (applicationId: string) => {
    router.push(`/candidate/test?applicationId=${applicationId}`)
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>My Applications</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Job Title</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Applied Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applications.map((application) => (
                <TableRow key={application.id}>
                  <TableCell>{application.jobTitle}</TableCell>
                  <TableCell>{application.company}</TableCell>
                  <TableCell>{application.appliedDate}</TableCell>
                  <TableCell>
                    <Badge variant={
                      application.status === 'Accepted' ? 'default' :
                      application.status === 'Rejected' ? 'destructive' : 'secondary'
                    }>
                      {application.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {application.status === 'Accepted' && (
                      <Button onClick={() => handleStartTest(application.id)}>
                        Start Test
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}