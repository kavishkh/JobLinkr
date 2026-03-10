import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
    return (
        <div className="flex-1 w-full px-6 py-8">
            <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="bg-card rounded-lg p-4 border border-border">
                        <div className="flex gap-3 mb-4">
                            <Skeleton className="w-12 h-12 rounded-full" />
                            <div className="flex-1">
                                <Skeleton className="h-4 w-32 mb-2" />
                                <Skeleton className="h-3 w-24" />
                            </div>
                        </div>
                        <Skeleton className="h-4 w-full mb-2" />
                        <Skeleton className="h-4 w-5/6" />
                    </div>
                ))}
            </div>
        </div>
    )
}
