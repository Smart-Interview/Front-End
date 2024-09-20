import { Loader2 } from "lucide-react"

export default function QuestionLoader() {
  return (
    <div className="flex flex-col items-center justify-center h-24 space-y-2">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-sm text-muted-foreground">Generating questions...</p>
      <span className="sr-only">Loading questions...</span>
    </div>
  )
}