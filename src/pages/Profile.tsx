import { useState } from "react";
import { MapPin, Mail, ExternalLink } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { mockUsers } from "@/lib/mockData";
import { toast } from "sonner";

const defaultUser = mockUsers[0];

export default function Profile() {
  const [profile, setProfile] = useLocalStorage("joblinkr_profile", defaultUser);
  const [editBio, setEditBio] = useState(profile.bio);
  const [newSkill, setNewSkill] = useState("");

  const handleSaveBio = () => {
    setProfile({ ...profile, bio: editBio });
    toast.success("Bio updated!");
    // TODO: send to backend
  };

  const addSkill = () => {
    if (!newSkill.trim() || profile.skills.includes(newSkill.trim())) return;
    setProfile({ ...profile, skills: [...profile.skills, newSkill.trim()] });
    setNewSkill("");
  };

  const removeSkill = (skill: string) => {
    setProfile({ ...profile, skills: profile.skills.filter((s) => s !== skill) });
  };

  return (
    <div className="container max-w-3xl py-8">
      {/* Profile header */}
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
          <Avatar className="h-20 w-20 ring-2 ring-primary/20">
            <AvatarImage src={profile.avatar} />
            <AvatarFallback className="text-lg">{profile.name.slice(0, 2)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-xl font-bold md:text-2xl">{profile.name}</h1>
            <p className="text-muted-foreground">{profile.title}</p>
            <div className="mt-1 flex items-center justify-center gap-3 text-sm text-muted-foreground sm:justify-start">
              <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {profile.location}</span>
            </div>
          </div>
          <Button variant="outline" size="sm">
            <ExternalLink className="mr-1 h-3.5 w-3.5" /> Share
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="about" className="mt-6">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="experience">Experience</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="education">Education</TabsTrigger>
          <TabsTrigger value="resume">Resume</TabsTrigger>
        </TabsList>

        <TabsContent value="about" className="mt-4 rounded-xl border bg-card p-5">
          <h2 className="mb-3 font-display text-lg font-semibold">About</h2>
          <Textarea
            value={editBio}
            onChange={(e) => setEditBio(e.target.value)}
            rows={4}
            className="mb-3"
          />
          <Button size="sm" onClick={handleSaveBio}>Save</Button>
        </TabsContent>

        <TabsContent value="experience" className="mt-4 space-y-4">
          {profile.experience.map((exp, i) => (
            <div key={i} className="rounded-xl border bg-card p-5">
              <h3 className="font-semibold">{exp.title}</h3>
              <p className="text-sm text-muted-foreground">{exp.company} · {exp.period}</p>
              <p className="mt-2 text-sm">{exp.description}</p>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="skills" className="mt-4 rounded-xl border bg-card p-5">
          <h2 className="mb-3 font-display text-lg font-semibold">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {profile.skills.map((skill) => (
              <Badge
                key={skill}
                variant="secondary"
                className="cursor-pointer hover:bg-destructive/10 hover:text-destructive transition-colors"
                onClick={() => removeSkill(skill)}
              >
                {skill} ×
              </Badge>
            ))}
          </div>
          <div className="mt-3 flex gap-2">
            <Input
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="Add a skill…"
              className="max-w-xs"
              onKeyDown={(e) => e.key === "Enter" && addSkill()}
            />
            <Button size="sm" variant="outline" onClick={addSkill}>Add</Button>
          </div>
        </TabsContent>

        <TabsContent value="education" className="mt-4 space-y-4">
          {profile.education.map((edu, i) => (
            <div key={i} className="rounded-xl border bg-card p-5">
              <h3 className="font-semibold">{edu.degree}</h3>
              <p className="text-sm text-muted-foreground">{edu.school} · {edu.year}</p>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="resume" className="mt-4 rounded-xl border bg-card p-5">
          <h2 className="mb-3 font-display text-lg font-semibold">Resume</h2>
          <div className="flex h-40 items-center justify-center rounded-lg border-2 border-dashed text-muted-foreground">
            <p className="text-sm">Drag & drop your resume or click to upload (mock)</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
