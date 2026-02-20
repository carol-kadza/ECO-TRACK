// "use client"

// import { useState } from "react"
// import { useRouter } from "next/navigation"
// import { EcoTrackLogo } from "@/components/ecotrack-logo"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Progress } from "@/components/ui/progress"
// import {
//   ArrowRight,
//   ArrowLeft,
//   Store,
//   Utensils,
//   Cake,
//   Coffee,
//   ShoppingBag,
//   Truck,
//   Loader2,
//   Leaf,
//   BarChart3,
//   Bell,
//   Check,
// } from "lucide-react"
// import { cn } from "@/lib/utils"

// const STEPS = [
//   { title: "Business Type", description: "Tell us about your business" },
//   { title: "Business Details", description: "Help us customize your experience" },
//   { title: "Categories", description: "Select your primary product categories" },
//   { title: "Ready to Go", description: "Your EcoTrack setup is complete" },
// ]

// const businessTypes = [
//   { id: "restaurant", label: "Restaurant", icon: Utensils, desc: "Full service or fast casual dining" },
//   { id: "bakery", label: "Bakery", icon: Cake, desc: "Bread, pastries, and baked goods" },
//   { id: "cafe", label: "Cafe / Coffee Shop", icon: Coffee, desc: "Beverages and light meals" },
//   { id: "grocery", label: "Grocery Store", icon: ShoppingBag, desc: "Fresh produce and packaged goods" },
//   { id: "catering", label: "Catering Service", icon: Truck, desc: "Event and corporate catering" },
//   { id: "other", label: "Other Food Business", icon: Store, desc: "Food truck, market stall, etc." },
// ]

// const categories = [
//   "Bread & Pastries",
//   "Fresh Produce",
//   "Dairy & Eggs",
//   "Meat & Poultry",
//   "Seafood",
//   "Prepared Meals",
//   "Beverages",
//   "Grains & Cereals",
//   "Sauces & Condiments",
//   "Frozen Foods",
//   "Snacks",
//   "Desserts",
// ]

// export default function OnboardingPage() {
//   const router = useRouter()
//   const [step, setStep] = useState(0)
//   const [isLoading, setIsLoading] = useState(false)
//   const [selectedType, setSelectedType] = useState("")
//   const [selectedCategories, setSelectedCategories] = useState<string[]>([])
//   const [businessName, setBusinessName] = useState("")
//   const [location, setLocation] = useState("")

//   const progress = ((step + 1) / STEPS.length) * 100

//   const toggleCategory = (cat: string) => {
//     setSelectedCategories((prev) =>
//       prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
//     )
//   }

//   const handleFinish = async () => {
//     setIsLoading(true)
//     await new Promise((r) => setTimeout(r, 1500))
//     router.push("/dashboard")
//   }

//   const canProceed = () => {
//     if (step === 0) return selectedType !== ""
//     if (step === 1) return businessName.trim() !== ""
//     if (step === 2) return selectedCategories.length > 0
//     return true
//   }

//   return (
//     <div className="flex min-h-screen flex-col bg-background">
//       {/* Header */}
//       <header className="flex items-center justify-between border-b border-border px-6 py-4 lg:px-12">
//         <EcoTrackLogo size="sm" />
//         <div className="flex items-center gap-4">
//           <span className="text-xs text-muted-foreground font-medium">
//             Step {step + 1} of {STEPS.length}
//           </span>
//           {step < STEPS.length - 1 && (
//             <button
//               onClick={() => router.push("/dashboard")}
//               className="text-xs text-muted-foreground hover:text-foreground transition-colors"
//             >
//               Skip setup
//             </button>
//           )}
//         </div>
//       </header>

//       {/* Progress */}
//       <div className="px-6 lg:px-12 pt-1">
//         <Progress value={progress} className="h-1" />
//       </div>

//       {/* Content */}
//       <main className="flex flex-1 flex-col items-center justify-center px-6 py-12">
//         <div className="w-full max-w-2xl">
//           {/* Step header */}
//           <div className="flex flex-col gap-1.5 mb-8 text-center">
//             <h1 className="text-2xl font-bold tracking-tight text-foreground lg:text-3xl text-balance">
//               {STEPS[step].title}
//             </h1>
//             <p className="text-muted-foreground">
//               {STEPS[step].description}
//             </p>
//           </div>

//           {/* Step 1: Business Type */}
//           {step === 0 && (
//             <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
//               {businessTypes.map((type) => {
//                 const Icon = type.icon
//                 const selected = selectedType === type.id
//                 return (
//                   <button
//                     key={type.id}
//                     onClick={() => setSelectedType(type.id)}
//                     className={cn(
//                       "flex items-start gap-4 rounded-xl border-2 p-4 text-left transition-all hover:border-primary/50",
//                       selected
//                         ? "border-primary bg-primary/5"
//                         : "border-border bg-card"
//                     )}
//                   >
//                     <div
//                       className={cn(
//                         "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors",
//                         selected
//                           ? "bg-primary text-primary-foreground"
//                           : "bg-secondary text-muted-foreground"
//                       )}
//                     >
//                       <Icon className="h-5 w-5" />
//                     </div>
//                     <div className="flex flex-col gap-0.5">
//                       <span className="text-sm font-semibold text-foreground">
//                         {type.label}
//                       </span>
//                       <span className="text-xs text-muted-foreground leading-relaxed">
//                         {type.desc}
//                       </span>
//                     </div>
//                   </button>
//                 )
//               })}
//             </div>
//           )}

//           {/* Step 2: Business Details */}
//           {step === 1 && (
//             <div className="mx-auto max-w-md flex flex-col gap-5">
//               <div className="flex flex-col gap-2">
//                 <Label htmlFor="biz-name">Business name</Label>
//                 <Input
//                   id="biz-name"
//                   placeholder="Fresh Bakes"
//                   value={businessName}
//                   onChange={(e) => setBusinessName(e.target.value)}
//                 />
//               </div>
//               <div className="flex flex-col gap-2">
//                 <Label htmlFor="location">Location</Label>
//                 <Input
//                   id="location"
//                   placeholder="Blantyre, Malawi"
//                   value={location}
//                   onChange={(e) => setLocation(e.target.value)}
//                 />
//               </div>
//               <div className="flex flex-col gap-2">
//                 <Label htmlFor="employees">Team size (optional)</Label>
//                 <Input id="employees" placeholder="e.g. 5-10" />
//               </div>
//             </div>
//           )}

//           {/* Step 3: Categories */}
//           {step === 2 && (
//             <div className="flex flex-wrap justify-center gap-2.5">
//               {categories.map((cat) => {
//                 const selected = selectedCategories.includes(cat)
//                 return (
//                   <button
//                     key={cat}
//                     onClick={() => toggleCategory(cat)}
//                     className={cn(
//                       "rounded-full border-2 px-4 py-2 text-sm font-medium transition-all",
//                       selected
//                         ? "border-primary bg-primary text-primary-foreground"
//                         : "border-border bg-card text-foreground hover:border-primary/40"
//                     )}
//                   >
//                     {selected && <Check className="mr-1.5 -ml-0.5 inline h-3.5 w-3.5" />}
//                     {cat}
//                   </button>
//                 )
//               })}
//             </div>
//           )}

//           {/* Step 4: Summary */}
//           {step === 3 && (
//             <div className="mx-auto max-w-md flex flex-col items-center gap-8">
//               <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10">
//                 <Leaf className="h-10 w-10 text-primary" />
//               </div>
//               <div className="flex flex-col gap-6 w-full">
//                 {[
//                   {
//                     icon: BarChart3,
//                     title: "Smart Dashboard",
//                     desc: "AI-powered insights and demand forecasting ready for your business.",
//                   },
//                   {
//                     icon: Bell,
//                     title: "Surplus Alerts",
//                     desc: "Get notified before products expire or go to waste.",
//                   },
//                   {
//                     icon: Leaf,
//                     title: "Waste Reduction",
//                     desc: "Track your environmental impact and cost savings in real time.",
//                   },
//                 ].map((feature) => {
//                   const Icon = feature.icon
//                   return (
//                     <div
//                       key={feature.title}
//                       className="flex items-start gap-4 rounded-xl border border-border bg-card p-4"
//                     >
//                       <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
//                         <Icon className="h-5 w-5 text-primary" />
//                       </div>
//                       <div className="flex flex-col gap-0.5">
//                         <span className="text-sm font-semibold text-foreground">
//                           {feature.title}
//                         </span>
//                         <span className="text-xs text-muted-foreground leading-relaxed">
//                           {feature.desc}
//                         </span>
//                       </div>
//                     </div>
//                   )
//                 })}
//               </div>
//             </div>
//           )}

//           {/* Navigation */}
//           <div className="mt-10 flex items-center justify-between">
//             <Button
//               variant="ghost"
//               onClick={() => setStep((s) => s - 1)}
//               disabled={step === 0}
//               className={step === 0 ? "invisible" : ""}
//             >
//               <ArrowLeft className="h-4 w-4" />
//               Back
//             </Button>
//             {step < STEPS.length - 1 ? (
//               <Button
//                 onClick={() => setStep((s) => s + 1)}
//                 disabled={!canProceed()}
//               >
//                 Continue
//                 <ArrowRight className="h-4 w-4" />
//               </Button>
//             ) : (
//               <Button onClick={handleFinish} disabled={isLoading} size="lg">
//                 {isLoading ? (
//                   <Loader2 className="h-4 w-4 animate-spin" />
//                 ) : (
//                   <>
//                     Launch Dashboard
//                     <ArrowRight className="h-4 w-4" />
//                   </>
//                 )}
//               </Button>
//             )}
//           </div>
//         </div>
//       </main>
//     </div>
//   )
// }



"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { EcoTrackLogo } from "@/components/ecotrack-logo"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import {
  ArrowRight, ArrowLeft, Store, Utensils, Cake,
  Coffee, ShoppingBag, Truck, Loader2, Leaf,
  BarChart3, Bell, Check,
} from "lucide-react"
import { cn } from "@/lib/utils"

const STEPS = [
  { title: "Business Type",    description: "Tell us about your business"          },
  { title: "Business Details", description: "Help us customise your experience"    },
  { title: "Categories",       description: "Select your primary product categories"},
  { title: "Ready to Go",      description: "Your EcoTrack setup is complete"      },
]

const businessTypes = [
  { id: "restaurant", label: "Restaurant",        icon: Utensils,    desc: "Full service or fast casual dining"   },
  { id: "bakery",     label: "Bakery",            icon: Cake,        desc: "Bread, pastries, and baked goods"     },
  { id: "cafe",       label: "Cafe / Coffee Shop",icon: Coffee,      desc: "Beverages and light meals"            },
  { id: "grocery",    label: "Grocery Store",     icon: ShoppingBag, desc: "Fresh produce and packaged goods"     },
  { id: "catering",   label: "Catering Service",  icon: Truck,       desc: "Event and corporate catering"         },
  { id: "other",      label: "Other Food Business",icon: Store,      desc: "Food truck, market stall, etc."       },
]

const categories = [
  "Bread & Pastries", "Fresh Produce", "Dairy & Eggs", "Meat & Poultry",
  "Seafood", "Prepared Meals", "Beverages", "Grains & Cereals",
  "Sauces & Condiments", "Frozen Foods", "Snacks", "Desserts",
]

export default function OnboardingPage() {
  const router = useRouter()
  const { user } = useAuth()

  const [step, setStep]                           = useState(0)
  const [isLoading, setIsLoading]                 = useState(false)
  const [saveError, setSaveError]                 = useState("")
  const [selectedType, setSelectedType]           = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [businessName, setBusinessName]           = useState("")
  const [location, setLocation]                   = useState("")

  const progress = ((step + 1) / STEPS.length) * 100

  const toggleCategory = (cat: string) =>
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    )

  const canProceed = () => {
    if (step === 0) return selectedType !== ""
    if (step === 1) return businessName.trim() !== ""
    if (step === 2) return selectedCategories.length > 0
    return true
  }

  // Save business to Supabase then go to dashboard
  const saveBusiness = async () => {
    if (!user) {
      setSaveError("Not logged in. Please sign in again.")
      return false
    }
    // Check if already saved (e.g. user clicked back and finished again)
    const { data: existing } = await supabase
      .from("businesses")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle()

    if (existing) return true // already exists, just proceed

    const { error } = await supabase
      .from("businesses")
      .insert({
        user_id:       user.id,
        name:          businessName.trim() || user.email?.split("@")[0] || "My Business",
        business_type: selectedType || "other",
        location:      location.trim() || null,
      })

    if (error) {
      setSaveError(error.message)
      return false
    }
    return true
  }

  const handleFinish = async () => {
    setIsLoading(true)
    setSaveError("")
    const ok = await saveBusiness()
    if (ok) router.push("/dashboard")
    else setIsLoading(false)
  }

  // Skip — still saves whatever we have so dashboard works
  const handleSkip = async () => {
    await saveBusiness()
    router.push("/dashboard")
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-border px-6 py-4 lg:px-12">
        <EcoTrackLogo size="sm" />
        <div className="flex items-center gap-4">
          <span className="text-xs text-muted-foreground font-medium">
            Step {step + 1} of {STEPS.length}
          </span>
          {step < STEPS.length - 1 && (
            <button
              onClick={handleSkip}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Skip setup
            </button>
          )}
        </div>
      </header>

      {/* Progress bar */}
      <div className="px-6 lg:px-12 pt-1">
        <Progress value={progress} className="h-1" />
      </div>

      {/* Content */}
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-2xl">
          {/* Step header */}
          <div className="flex flex-col gap-1.5 mb-8 text-center">
            <h1 className="text-2xl font-bold tracking-tight text-foreground lg:text-3xl text-balance">
              {STEPS[step].title}
            </h1>
            <p className="text-muted-foreground">{STEPS[step].description}</p>
          </div>

          {/* ── Step 1: Business Type ── */}
          {step === 0 && (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {businessTypes.map((type) => {
                const Icon = type.icon
                const selected = selectedType === type.id
                return (
                  <button key={type.id} onClick={() => setSelectedType(type.id)}
                    className={cn(
                      "flex items-start gap-4 rounded-xl border-2 p-4 text-left transition-all hover:border-primary/50",
                      selected ? "border-primary bg-primary/5" : "border-border bg-card"
                    )}>
                    <div className={cn(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors",
                      selected ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
                    )}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-sm font-semibold text-foreground">{type.label}</span>
                      <span className="text-xs text-muted-foreground leading-relaxed">{type.desc}</span>
                    </div>
                  </button>
                )
              })}
            </div>
          )}

          {/* ── Step 2: Business Details ── */}
          {step === 1 && (
            <div className="mx-auto max-w-md flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <Label htmlFor="biz-name">Business name <span className="text-destructive">*</span></Label>
                <Input id="biz-name" placeholder="e.g. Fresh Bakes Lagos"
                  value={businessName} onChange={(e) => setBusinessName(e.target.value)} />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" placeholder="e.g. Lagos, Nigeria"
                  value={location} onChange={(e) => setLocation(e.target.value)} />
              </div>
            </div>
          )}

          {/* ── Step 3: Categories ── */}
          {step === 2 && (
            <div className="flex flex-wrap justify-center gap-2.5">
              {categories.map((cat) => {
                const selected = selectedCategories.includes(cat)
                return (
                  <button key={cat} onClick={() => toggleCategory(cat)}
                    className={cn(
                      "rounded-full border-2 px-4 py-2 text-sm font-medium transition-all",
                      selected
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-card text-foreground hover:border-primary/40"
                    )}>
                    {selected && <Check className="mr-1.5 -ml-0.5 inline h-3.5 w-3.5" />}
                    {cat}
                  </button>
                )
              })}
            </div>
          )}

          {/* ── Step 4: Summary ── */}
          {step === 3 && (
            <div className="mx-auto max-w-md flex flex-col items-center gap-8">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10">
                <Leaf className="h-10 w-10 text-primary" />
              </div>
              <div className="flex flex-col gap-4 w-full">
                {/* Business summary */}
                <div className="rounded-xl border border-border bg-card p-4 flex flex-col gap-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Your business</p>
                  <p className="text-sm font-semibold text-foreground">{businessName || "—"}</p>
                  {location && <p className="text-xs text-muted-foreground">{location}</p>}
                  <p className="text-xs text-muted-foreground capitalize">{selectedType || "—"}</p>
                </div>
                {[
                  { icon: BarChart3, title: "Smart Dashboard",  desc: "AI-powered insights and demand forecasting ready for your business." },
                  { icon: Bell,      title: "Surplus Alerts",   desc: "Get notified before products expire or go to waste."               },
                  { icon: Leaf,      title: "Waste Reduction",  desc: "Track your environmental impact and cost savings in real time."     },
                ].map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="flex items-start gap-4 rounded-xl border border-border bg-card p-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-sm font-semibold text-foreground">{title}</span>
                      <span className="text-xs text-muted-foreground leading-relaxed">{desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Error message */}
          {saveError && (
            <p className="mt-6 text-sm text-destructive bg-destructive/10 rounded-lg px-4 py-2.5 text-center">
              {saveError}
            </p>
          )}

          {/* Navigation */}
          <div className="mt-10 flex items-center justify-between">
            <Button variant="ghost" onClick={() => setStep((s) => s - 1)}
              disabled={step === 0} className={step === 0 ? "invisible" : ""}>
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>

            {step < STEPS.length - 1 ? (
              <Button onClick={() => setStep((s) => s + 1)} disabled={!canProceed()}>
                Continue <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleFinish} disabled={isLoading} size="lg">
                {isLoading
                  ? <Loader2 className="h-4 w-4 animate-spin" />
                  : <> Launch Dashboard <ArrowRight className="h-4 w-4" /> </>}
              </Button>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}