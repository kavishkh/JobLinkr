import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export function useSavedJobs() {
  const [savedJobIds, setSavedJobIds] = useState<string[]>([]);

  useEffect(() => {
    // Load from local storage on mount
    const saved = localStorage.getItem('saved_jobs');
    if (saved) {
      try {
        setSavedJobIds(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  const toggleSaveJob = (jobId: string) => {
    let newSaved: string[];
    if (savedJobIds.includes(jobId)) {
      newSaved = savedJobIds.filter(id => id !== jobId);
      toast.success('Job removed from saved list');
    } else {
      newSaved = [...savedJobIds, jobId];
      toast.success('Job saved successfully');
    }
    
    setSavedJobIds(newSaved);
    localStorage.setItem('saved_jobs', JSON.stringify(newSaved));
  };

  const saveJob = (jobId: string) => {
    if (!savedJobIds.includes(jobId)) {
      const newSaved = [...savedJobIds, jobId];
      setSavedJobIds(newSaved);
      localStorage.setItem('saved_jobs', JSON.stringify(newSaved));
      toast.success('Job saved to your matches!');
    }
  };

  const isSaved = (jobId: string) => savedJobIds.includes(jobId);

  return { savedJobIds, toggleSaveJob, saveJob, isSaved };
}
