import { mockJobs } from '@/lib/mockData'
import JobDetailClient from './JobDetailClient'

export default function JobDetail({ params }: { params: { id: string } }) {
  const job = mockJobs.find((j) => j.id === params.id)

  if (!job) {
    return (
      <main className="min-h-screen bg-background">
        <div className="flex items-center justify-center h-screen">
          <p className="text-lg text-muted-foreground">Job not found</p>
        </div>
      </main>
    )
  }

  return <JobDetailClient job={job} jobId={params.id} />
}
