import { useState } from "react";
import { Upload, Sparkles, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { JobCard } from "@/components/JobCard";
import { mockJobs, type Job } from "@/lib/mockData";

export default function AiMatcher() {
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState<Job[] | null>(null);

  const handleUpload = () => {
    setAnalyzing(true);
    setResults(null);
    // Fake analysis
    setTimeout(() => {
      const matched = mockJobs
        .map((job) => ({
          ...job,
          matchPercent: Math.floor(Math.random() * 30 + 70),
        }))
        .sort((a, b) => (b.matchPercent ?? 0) - (a.matchPercent ?? 0));
      setResults(matched);
      setAnalyzing(false);
    }, 2500);
  };

  return (
    <div className="container max-w-3xl py-8">
      <div className="mb-6 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
          <Sparkles className="h-7 w-7 text-primary" />
        </div>
        <h1 className="text-2xl font-bold md:text-3xl">AI Job Matcher</h1>
        <p className="mt-2 text-muted-foreground">
          Upload your resume and let AI find the best job matches for you.
        </p>
      </div>

      {/* Upload area */}
      <div className="rounded-xl border bg-card p-8 text-center shadow-sm">
        <div className="mx-auto flex h-32 max-w-md items-center justify-center rounded-xl border-2 border-dashed transition-colors hover:border-primary/40">
          <div className="space-y-2">
            <FileText className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Drop resume here or click to browse</p>
            <p className="text-xs text-muted-foreground">PDF, DOCX · Max 5MB (mock)</p>
          </div>
        </div>
        <Button className="mt-6 gap-2 transition-transform hover:scale-105" onClick={handleUpload} disabled={analyzing}>
          <Upload className="h-4 w-4" />
          {analyzing ? "Analyzing…" : "Analyze Resume"}
        </Button>
      </div>

      {/* Analyzing skeleton */}
      {analyzing && (
        <div className="mt-8 space-y-4">
          <div className="text-center text-sm text-muted-foreground">Analyzing your resume against available positions…</div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-xl border bg-card p-5">
              <div className="flex gap-3">
                <Skeleton className="h-11 w-11 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-28" />
                  <Skeleton className="mt-2 h-3 w-full" />
                </div>
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Results */}
      {results && (
        <div className="mt-8">
          <h2 className="mb-4 font-display text-xl font-semibold">
            Top Matches
          </h2>
          <div className="space-y-4">
            {results.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
