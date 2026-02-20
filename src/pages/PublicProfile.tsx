import { useParams, Link } from "react-router-dom";
import { MapPin, ArrowLeft } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { mockUsers } from "@/lib/mockData";

export default function PublicProfile() {
  const { username } = useParams();
  const user = mockUsers.find((u) => u.username === username);

  if (!user) {
    return (
      <div className="container py-16 text-center">
        <p className="text-muted-foreground">User not found.</p>
        <Link to="/" className="mt-4 inline-block text-primary hover:underline">← Back to feed</Link>
      </div>
    );
  }

  return (
    <div className="container max-w-3xl py-8">
      <Link to="/" className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back
      </Link>

      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
          <Avatar className="h-20 w-20 ring-2 ring-primary/20">
            <AvatarImage src={user.avatar} />
            <AvatarFallback className="text-lg">{user.name.slice(0, 2)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-xl font-bold md:text-2xl">{user.name}</h1>
            <p className="text-muted-foreground">{user.title}</p>
            <div className="mt-1 flex items-center justify-center gap-1 text-sm text-muted-foreground sm:justify-start">
              <MapPin className="h-3.5 w-3.5" /> {user.location}
            </div>
            <Badge variant={user.role === "employer" ? "default" : "secondary"} className="mt-2">
              {user.role === "employer" ? "Employer" : "Job Seeker"}
            </Badge>
          </div>
          <Button className="transition-transform hover:scale-105">Connect</Button>
        </div>

        <Separator className="my-5" />

        <div>
          <h2 className="mb-2 font-display text-lg font-semibold">About</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">{user.bio}</p>
        </div>

        {user.skills.length > 0 && (
          <>
            <Separator className="my-5" />
            <h2 className="mb-2 font-display text-lg font-semibold">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {user.skills.map((skill) => (
                <Badge key={skill} variant="secondary">{skill}</Badge>
              ))}
            </div>
          </>
        )}

        {user.experience.length > 0 && (
          <>
            <Separator className="my-5" />
            <h2 className="mb-3 font-display text-lg font-semibold">Experience</h2>
            <div className="space-y-3">
              {user.experience.map((exp, i) => (
                <div key={i}>
                  <h3 className="text-sm font-semibold">{exp.title}</h3>
                  <p className="text-xs text-muted-foreground">{exp.company} · {exp.period}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{exp.description}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
