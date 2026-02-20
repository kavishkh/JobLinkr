import { useParams, Link } from "react-router-dom";
import { ArrowLeft, MapPin, Clock, Users, DollarSign, Building2, ExternalLink } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { mockJobs } from "@/lib/mockData";
import { toast } from "sonner";

export default function JobDetail() {
  const { id } = useParams();
  const job = mockJobs.find((j) => j.id === id);

  if (!job) {
    return (
      <div className="container py-16 text-center">
        <p className="text-muted-foreground">Job not found.</p>
        <Link to="/jobs" className="mt-4 inline-block text-primary hover:underline">
          ← Back to jobs
        </Link>
      </div>
    );
  }

  const timeAgo = formatDistanceToNow(new Date(job.postedAt), { addSuffix: true });

  return (
    <div className="container max-w-3xl py-8">
      <Link to="/jobs" className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to jobs
      </Link>

      <div className="rounded-xl border bg-card p-6 shadow-sm md:p-8">
        <div className="flex items-start gap-4">
          <Avatar className="h-14 w-14 rounded-xl ring-1 ring-border">
            <AvatarImage src={job.companyAvatar} />
            <AvatarFallback className="rounded-xl">{job.company.slice(0, 2)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h1 className="text-xl font-bold md:text-2xl">{job.title}</h1>
            <p className="mt-1 text-muted-foreground">{job.company}</p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-3 text-sm text-muted-foreground">
          <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {job.location}</span>
          <span className="flex items-center gap-1"><DollarSign className="h-4 w-4" /> {job.salary}</span>
          <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {timeAgo}</span>
          <span className="flex items-center gap-1"><Users className="h-4 w-4" /> {job.applicants} applicants</span>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Badge variant="secondary">{job.type}</Badge>
          {job.skills.map((skill) => (
            <Badge key={skill} variant="outline" className="font-normal">{skill}</Badge>
          ))}
        </div>

        <Separator className="my-6" />

        <div className="whitespace-pre-line text-sm leading-relaxed text-card-foreground">
          {job.description}
        </div>

        <Separator className="my-6" />

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            className="flex-1 transition-transform hover:scale-105"
            onClick={() => {
              toast.success("Application submitted! (mock)");
              // TODO: send to backend
            }}
          >
            Apply Now
          </Button>
          <Button variant="outline" className="flex-1">
            <ExternalLink className="mr-2 h-4 w-4" /> Save Job
          </Button>
        </div>
      </div>
    </div>
  );
}
