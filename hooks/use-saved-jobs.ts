import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { useSession } from 'next-auth/react'
import { mockJobs } from '@/lib/mockData'

export interface SavedJobEntry {
  id: string
  title?: string
  company?: string
  location?: string
  description?: string
  url?: string
  skills?: string[]
  source?: 'market' | 'catalog'
  savedAt: string
}

const LEGACY_STORAGE_KEY = 'saved_jobs'
const STORAGE_KEY = 'saved_jobs_v2'

function isSavedJobEntry(value: unknown): value is SavedJobEntry {
  if (!value || typeof value !== 'object') return false
  const candidate = value as SavedJobEntry
  return typeof candidate.id === 'string'
}

function safeWriteSavedJobs(payload: SavedJobEntry[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
    return true
  } catch (e) {
    return false
  }
}

export function useSavedJobs() {
  const [savedJobs, setSavedJobs] = useState<SavedJobEntry[]>([])
  const { data: session } = useSession()

  const catalogJobIds = new Set(mockJobs.map((job) => job.id))

  // Fetch from server when user is logged in
  useEffect(() => {
    if (session?.user?.email) {
      fetchSavedJobs()
    }
  }, [session?.user?.email])

  const fetchSavedJobs = async () => {
    try {
      const res = await fetch('/api/saved-jobs')
      if (res.ok) {
        const data = await res.json()
        const jobs = data.savedJobs || []
        const normalized = jobs.map((j: any) => ({
          id: j.jobId,
          title: j.jobTitle,
          company: j.company,
          location: j.location,
          description: j.description,
          savedAt: j.createdAt,
          source: catalogJobIds.has(j.jobId) ? ('catalog' as const) : ('market' as const),
        }))
        setSavedJobs(normalized)
        safeWriteSavedJobs(normalized)
      }
    } catch (error) {
      console.error('Failed to fetch saved jobs:', error)
    }
  }

  const persistSavedJobs = (next: SavedJobEntry[]) => {
    setSavedJobs(next)
    const saved = safeWriteSavedJobs(next)
    if (!saved) {
      toast.error('Could not persist saved jobs in this browser session.')
    }
  }

  const upsertSavedJob = async (jobId: string, jobData?: Partial<SavedJobEntry>) => {
    if (!jobId) return
    if (savedJobs.some((entry) => entry.id === jobId)) return

    // If user is logged in, save to server
    if (session?.user?.email) {
      try {
        const res = await fetch('/api/saved-jobs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jobId,
            jobTitle: jobData?.title,
            company: jobData?.company,
            location: jobData?.location,
            description: jobData?.description,
          }),
        })
        if (res.ok) {
          await fetchSavedJobs()
          toast.success('Job saved!')
        } else {
          toast.error('Failed to save job')
        }
      } catch (error) {
        console.error('Failed to save job:', error)
        toast.error('Failed to save job')
      }
    } else {
      // Fallback to localStorage for unauthenticated users
      const next: SavedJobEntry[] = [
        {
          id: jobId,
          source: jobData?.source || 'catalog',
          savedAt: new Date().toISOString(),
          ...jobData,
        },
        ...savedJobs,
      ]
      persistSavedJobs(next)
    }
  }

  const removeSavedJob = async (jobId: string) => {
    // If user is logged in, delete from server
    if (session?.user?.email) {
      try {
        const res = await fetch('/api/saved-jobs', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ jobId }),
        })
        if (res.ok) {
          await fetchSavedJobs()
          toast.success('Job removed from saved')
        }
      } catch (error) {
        console.error('Failed to remove job:', error)
        toast.error('Failed to remove job')
      }
    } else {
      // Fallback to localStorage
      const next = savedJobs.filter((entry) => entry.id !== jobId)
      persistSavedJobs(next)
    }
  }

  const toggleSaveJob = (jobId: string, jobData?: Partial<SavedJobEntry>) => {
    if (savedJobs.some((entry) => entry.id === jobId)) {
      removeSavedJob(jobId)
      return
    }

    upsertSavedJob(jobId, jobData)
  }

  const saveJob = (jobId: string, jobData?: Partial<SavedJobEntry>) => {
    if (savedJobs.some((entry) => entry.id === jobId)) return
    upsertSavedJob(jobId, jobData)
  }

  const savedJobIds = savedJobs.map((entry) => entry.id)
  const isSaved = (jobId: string) => savedJobIds.includes(jobId)

  return { savedJobs, savedJobIds, toggleSaveJob, saveJob, removeSavedJob, isSaved }
}
