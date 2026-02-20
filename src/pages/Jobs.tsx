import { useState, useMemo } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { JobCard } from "@/components/JobCard";
import { mockJobs } from "@/lib/mockData";

const jobTypes = ["All", "Full-time", "Part-time", "Contract", "Freelance"];

export default function Jobs() {
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    return mockJobs.filter((job) => {
      const matchesSearch =
        !search ||
        job.title.toLowerCase().includes(search.toLowerCase()) ||
        job.company.toLowerCase().includes(search.toLowerCase()) ||
        job.skills.some((s) => s.toLowerCase().includes(search.toLowerCase()));
      const matchesType = selectedType === "All" || job.type === selectedType;
      return matchesSearch && matchesType;
    });
  }, [search, selectedType]);

  return (
    <div className="container py-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold md:text-3xl">Browse Jobs</h1>
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search jobs, skills…"
              className="pl-9"
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowFilters(!showFilters)}
            className="shrink-0 md:hidden"
          >
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Filters sidebar */}
        <aside className={`shrink-0 space-y-4 ${showFilters ? "block" : "hidden"} md:block md:w-48`}>
          <div>
            <h3 className="mb-2 text-sm font-semibold text-foreground">Job Type</h3>
            <div className="flex flex-col gap-1">
              {jobTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`rounded-lg px-3 py-1.5 text-left text-sm transition-colors ${
                    selectedType === type
                      ? "bg-primary/10 font-medium text-primary"
                      : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Job grid */}
        <div className="flex-1">
          <p className="mb-4 text-sm text-muted-foreground">
            {filtered.length} job{filtered.length !== 1 ? "s" : ""} found
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {filtered.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
          {filtered.length === 0 && (
            <div className="py-16 text-center text-muted-foreground">
              No jobs match your search. Try different keywords.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
