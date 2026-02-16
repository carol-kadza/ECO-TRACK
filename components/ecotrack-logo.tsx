import { cn } from "@/lib/utils"

export function EcoTrackLogo({ className, size = "default" }: { className?: string; size?: "sm" | "default" | "lg" }) {
  const sizes = {
    sm: "h-7 w-7",
    default: "h-9 w-9",
    lg: "h-12 w-12",
  }
  const textSizes = {
    sm: "text-base",
    default: "text-xl",
    lg: "text-2xl",
  }
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div className={cn("relative flex items-center justify-center rounded-lg bg-primary", sizes[size])}>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="h-5 w-5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 2a10 10 0 1 0 10 10" className="text-primary-foreground" />
          <path d="M12 2a7 7 0 0 1 7 7" className="text-primary-foreground" />
          <path d="M12 12V2" className="text-primary-foreground" />
          <path d="M12 12l6.5-6.5" className="text-primary-foreground" />
        </svg>
      </div>
      <span className={cn("font-sans font-bold tracking-tight text-foreground", textSizes[size])}>
        EcoTrack
      </span>
    </div>
  )
}
