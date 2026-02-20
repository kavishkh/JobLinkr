import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { MapPin, Clock, Users, DollarSign } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Job } from "@/lib/mockData";

const typeColors: Record<string, string> = {
  "Full-time": "bg-primary/10 text-primary",
  "Part-time": "bg-accent text-accent-foreground",
  Contract: "bg-success/10 text-success",
  Freelance: "bg-success/10 text-success",
};

export function JobCard({ job }: { job: Job }) {
  const timeAgo = formatDistanceToNow(new Date(job.postedAt), { addSuffix: true });

  return (
    <Link to={`/jobs/${job.id}`} className="block">
      <div className="group rounded-xl border bg-card p-5 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
        <div className="flex items-start gap-3">
          <Avatar className="h-11 w-11 rounded-lg ring-1 ring-border">
            <AvatarImage src={job.companyAvatar} />
            <AvatarFallback className="rounded-lg">{job.company.slice(0, 2)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-card-foreground group-hover:text-primary transition-colors truncate">
              {job.title}
            </h3>
            <p className="text-sm text-muted-foreground">{job.company}</p>
          </div>
          {job.matchPercent && (
            <Badge className="bg-success/10 text-success border-0 shrink-0">
              {job.matchPercent}% match
            </Badge>
          )}
        </div>

        <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3" /> {job.location}
          </span>
          <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${typeColors[job.type] || ""}`}>
            {job.type}
          </span>
          <span className="flex items-center gap-1">
            <DollarSign className="h-3 w-3" /> {job.salary}
          </span>
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {job.skills.slice(0, 4).map((skill) => (
            <Badge key={skill} variant="secondary" className="text-[11px] font-normal">
              {skill}
            </Badge>
          ))}
        </div>

        <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" /> {timeAgo}
          </span>
          <span className="flex items-center gap-1">
            <Users className="h-3 w-3" /> {job.applicants} applicants
          </span>
        </div>
      </div>
    </Link>
  );
}
