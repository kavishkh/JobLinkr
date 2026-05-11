import { useState, useEffect } from 'react'
import { toast } from 'sonner'
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

  const catalogJobIds = new Set(mockJobs.map((job) => job.id))

  useEffect(() => {
    const rawV2 = localStorage.getItem(STORAGE_KEY)
    if (rawV2) {
      try {
        const parsed = JSON.parse(rawV2)
        if (Array.isArray(parsed)) {
          const validated = parsed.filter(isSavedJobEntry)
          const normalized = validated.map((entry) => {
            const isCatalog = catalogJobIds.has(entry.id)
            return {
              ...entry,
              source: isCatalog ? ('catalog' as const) : ('market' as const),
            }
          })

          setSavedJobs(normalized)
          safeWriteSavedJobs(normalized)
          return
        }
      } catch (e) {
        // Fall through to legacy migration.
      }
    }

    // Migrate legacy array of job IDs into v2 format.
    const rawLegacy = localStorage.getItem(LEGACY_STORAGE_KEY)
    if (!rawLegacy) return

    try {
      const parsed = JSON.parse(rawLegacy)
      if (!Array.isArray(parsed)) return

      const migrated = parsed
        .filter((id): id is string => typeof id === 'string')
        .map((id) => ({
          id,
          source: catalogJobIds.has(id) ? ('catalog' as const) : ('market' as const),
          savedAt: new Date().toISOString(),
        }))

      setSavedJobs(migrated)
      safeWriteSavedJobs(migrated)
    } catch (e) {
      // Ignore malformed legacy payloads.
    }
  }, [])

  const persistSavedJobs = (next: SavedJobEntry[]) => {
    setSavedJobs(next)
    const saved = safeWriteSavedJobs(next)
    if (!saved) {
      toast.error('Could not persist saved jobs in this browser session.')
    }
  }

  const upsertSavedJob = (jobId: string, jobData?: Partial<SavedJobEntry>) => {
    if (!jobId) return
    if (savedJobs.some((entry) => entry.id === jobId)) return

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

  const removeSavedJob = (jobId: string) => {
    const next = savedJobs.filter((entry) => entry.id !== jobId)
    persistSavedJobs(next)
  }

  const toggleSaveJob = (jobId: string, jobData?: Partial<SavedJobEntry>) => {
    if (savedJobs.some((entry) => entry.id === jobId)) {
      removeSavedJob(jobId)
      toast.success('Job removed from saved list')
      return
    }

    upsertSavedJob(jobId, jobData)
    toast.success('Job saved successfully')
  }

  const saveJob = (jobId: string, jobData?: Partial<SavedJobEntry>) => {
    if (savedJobs.some((entry) => entry.id === jobId)) return
    upsertSavedJob(jobId, jobData)
    toast.success('Job saved to your matches!')
  }

  const savedJobIds = savedJobs.map((entry) => entry.id)
  const isSaved = (jobId: string) => savedJobIds.includes(jobId)

  return { savedJobs, savedJobIds, toggleSaveJob, saveJob, removeSavedJob, isSaved }
}
