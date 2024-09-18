import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

type Interview = {
  id: string
  jobTitle: string
  company: string
  date: string
  score: number
  status: 'Passed' | 'Failed' | 'Pending'
}

const interviews: Interview[] = [
  { id: '1', jobTitle: 'Frontend Developer', company: 'Tech Co', date: '2023-05-15', score: 85, status: 'Passed' },
  { id: '2', jobTitle: 'Backend Engineer', company: 'Data Systems Inc', date: '2023-05-20', score: 78, status: 'Pending' },
  { id: '3', jobTitle: 'Full Stack Developer', company: 'Web Solutions', date: '2023-05-25', score: 92, status: 'Passed' },
  { id: '4', jobTitle: 'UI/UX Designer', company: 'Creative Designs', date: '2023-05-30', score: 65, status: 'Failed' },
  { id: '5', jobTitle: 'DevOps Engineer', company: 'Cloud Systems', date: '2023-06-05', score: 88, status: 'Passed' },
]

const StatusIndicator = ({ status }: { status: Interview['status'] }) => {
  const baseClasses = "px-3 py-1 rounded-full text-xs font-semibold w-20 inline-flex items-center justify-center"
  const colorClasses = {
    Passed: "bg-green-500 text-white",
    Failed: "bg-red-500 text-white",
    Pending: "bg-yellow-500 text-white"
  }

  return (
    <span className={`${baseClasses} ${colorClasses[status]}`} aria-label={`Status: ${status}`}>
      {status}
    </span>
  )
}

export default function CandidatePerformanceTable() {
  return (
    <div className="container mx-auto py-10">
      <Table>
        <TableCaption>Candidate's Interview Performance</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead >Job Title</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Date</TableHead>
            <TableHead >Score</TableHead>
            <TableHead className="w-[100px]">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {interviews.map((interview) => (
            <TableRow key={interview.id}>
              <TableCell className="font-medium">{interview.jobTitle}</TableCell>
              <TableCell>{interview.company}</TableCell>
              <TableCell>{interview.date}</TableCell>
              <TableCell >{interview.score}</TableCell>
              <TableCell>
                <div className="flex justify-end">
                  <StatusIndicator status={interview.status} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}