import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { UserIcon, BriefcaseIcon } from "lucide-react"

export default function RoleSelection() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <h1 className="text-3xl font-bold text-center mb-8">Choose Your Role</h1>
        <div className="flex flex-col sm:flex-row gap-8">
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="flex items-center justify-center">
                <BriefcaseIcon className="mr-2 h-6 w-6" />
                CEO
              </CardTitle>
              <CardDescription className="text-center">Register as a Company Executive</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <ul className="space-y-2">
                <li>Post job openings</li>
                <li>Review candidate profiles</li>
                <li>Manage your company's presence</li>
              </ul>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button className="w-full">Register as CEO</Button>
            </CardFooter>
          </Card>

          <Card className="w-full">
            <CardHeader>
              <CardTitle className="flex items-center justify-center">
                <UserIcon className="mr-2 h-6 w-6" />
                Candidate
              </CardTitle>
              <CardDescription className="text-center">Register as a Job Seeker</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <ul className="space-y-2">
                <li>Create your professional profile</li>
                <li>Apply to job openings</li>
                <li>Showcase your skills and experience</li>
              </ul>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button className="w-full">Register as Candidate</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}