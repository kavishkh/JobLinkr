import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Briefcase, MapPin, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import type { Job } from "@/lib/mockData";
import { toast } from "sonner";

const jobSchema = z.object({
  title: z.string().min(3, "Title is required"),
  location: z.string().min(2, "Location is required"),
  type: z.string().min(1),
  salary: z.string().min(1, "Salary range is required"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  skills: z.string(),
});

type JobFormData = z.infer<typeof jobSchema>;

export default function EmployerDashboard() {
  const [postedJobs, setPostedJobs] = useLocalStorage<Job[]>("joblinkr_employer_jobs", []);
  const [showForm, setShowForm] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<JobFormData>({
    resolver: zodResolver(jobSchema),
    defaultValues: { type: "Full-time" },
  });

  const onSubmit = (data: JobFormData) => {
    const newJob: Job = {
      id: `ej_${Date.now()}`,
      title: data.title,
      company: "Your Company",
      companyAvatar: "https://i.pravatar.cc/150?img=12",
      location: data.location,
      type: data.type as Job["type"],
      salary: data.salary,
      description: data.description,
      skills: data.skills.split(",").map((s) => s.trim()).filter(Boolean),
      postedAt: new Date(),
      applicants: 0,
    };
    setPostedJobs((prev) => [newJob, ...prev]);
    reset();
    setShowForm(false);
    toast.success("Job posted successfully! (mock)");
    // TODO: send to backend
  };

  return (
    <div className="container max-w-3xl py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold md:text-3xl">Employer Dashboard</h1>
        <Button onClick={() => setShowForm(!showForm)} className="gap-1.5 transition-transform hover:scale-105">
          <Plus className="h-4 w-4" /> Post Job
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit(onSubmit)} className="mb-8 space-y-4 rounded-xl border bg-card p-6 shadow-sm animate-fade-in">
          <h2 className="font-display text-lg font-semibold">New Job Listing</h2>

          <div className="space-y-1.5">
            <Label>Job Title</Label>
            <Input {...register("title")} placeholder="e.g. Senior React Developer" />
            {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Location</Label>
              <Input {...register("location")} placeholder="e.g. Remote" />
              {errors.location && <p className="text-xs text-destructive">{errors.location.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Salary Range</Label>
              <Input {...register("salary")} placeholder="e.g. $120k – $160k" />
              {errors.salary && <p className="text-xs text-destructive">{errors.salary.message}</p>}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Type</Label>
            <Select defaultValue="Full-time" onValueChange={(v) => setValue("type", v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Full-time">Full-time</SelectItem>
                <SelectItem value="Part-time">Part-time</SelectItem>
                <SelectItem value="Contract">Contract</SelectItem>
                <SelectItem value="Freelance">Freelance</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label>Description</Label>
            <Textarea {...register("description")} placeholder="Job description…" rows={5} />
            {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label>Skills (comma-separated)</Label>
            <Input {...register("skills")} placeholder="React, TypeScript, Node.js" />
          </div>

          <div className="flex gap-2">
            <Button type="submit">Publish Job</Button>
            <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
          </div>
        </form>
      )}

      {/* Posted jobs */}
      <div>
        <h2 className="mb-4 font-display text-lg font-semibold">Your Posted Jobs</h2>
        {postedJobs.length === 0 ? (
          <div className="rounded-xl border bg-card py-12 text-center text-muted-foreground">
            <Briefcase className="mx-auto mb-3 h-8 w-8" />
            <p>No jobs posted yet. Click "Post Job" to get started.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {postedJobs.map((job) => (
              <div key={job.id} className="rounded-xl border bg-card p-5 shadow-sm">
                <h3 className="font-semibold">{job.title}</h3>
                <div className="mt-1 flex flex-wrap gap-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {job.location}</span>
                  <span className="flex items-center gap-1"><DollarSign className="h-3 w-3" /> {job.salary}</span>
                  <Badge variant="secondary" className="text-[11px]">{job.type}</Badge>
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {job.skills.map((s) => (
                    <Badge key={s} variant="outline" className="text-[11px] font-normal">{s}</Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
