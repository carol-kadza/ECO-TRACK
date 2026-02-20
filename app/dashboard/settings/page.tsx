
// // "use client"

// // import { useEffect, useState } from "react"
// // import { User, Bell, Store } from "lucide-react"
// // import {
// //   Card,
// //   CardContent,
// //   CardHeader,
// //   CardTitle,
// //   CardDescription,
// // } from "@/components/ui/card"
// // import { Button } from "@/components/ui/button"
// // import { Input } from "@/components/ui/input"
// // import { Label } from "@/components/ui/label"
// // import { Badge } from "@/components/ui/badge"
// // import { supabase } from "@/lib/supabase/client"
// // import { toast } from "sonner"
// // import { Loader2 } from "lucide-react"

// // interface UserProfile {
// //   id: string
// //   full_name: string
// //   business_name: string
// //   business_type: string
// //   email: string
// // }

// // interface NotificationSettings {
// //   expiry_alerts: boolean
// //   surplus_predictions: boolean
// //   low_stock_alerts: boolean
// //   weekly_reports: boolean
// // }

// // export default function SettingsPage() {
// //   // const supabase = createClient()
// //   const [loading, setLoading] = useState(true)
// //   const [saving, setSaving] = useState(false)
// //   const [profile, setProfile] = useState<UserProfile>({
// //     id: "",
// //     full_name: "",
// //     business_name: "",
// //     business_type: "",
// //     email: "",
// //   })
// //   const [notifications, setNotifications] = useState<NotificationSettings>({
// //     expiry_alerts: true,
// //     surplus_predictions: true,
// //     low_stock_alerts: true,
// //     weekly_reports: false,
// //   })

// //   useEffect(() => {
// //     loadUserData()
// //   }, [])

// //   const loadUserData = async () => {
// //     try {
// //       // Get current user
// //       const { data: { user }, error: userError } = await supabase.auth.getUser()
      
// //       if (userError) throw userError
// //       if (!user) {
// //         toast.error("No user found")
// //         return
// //       }

// //       // Get profile data
// //       const { data: profileData, error: profileError } = await supabase
// //         .from('profiles')
// //         .select('*')
// //         .eq('id', user.id)
// //         .single()

// //       if (profileError && profileError.code !== 'PGRST116') {
// //         throw profileError
// //       }

// //       // Set profile data
// //       setProfile({
// //         id: user.id,
// //         full_name: profileData?.full_name || user.user_metadata?.full_name || "",
// //         business_name: profileData?.business_name || "",
// //         business_type: profileData?.business_type || "",
// //         email: user.email || "",
// //       })

// //       // Load notification settings if they exist
// //       const savedNotifications = localStorage.getItem('notification_settings')
// //       if (savedNotifications) {
// //         setNotifications(JSON.parse(savedNotifications))
// //       }

// //     } catch (error: any) {
// //       console.error('Error loading user data:', error)
// //       toast.error("Failed to load user data")
// //     } finally {
// //       setLoading(false)
// //     }
// //   }

// //   const handleProfileUpdate = async () => {
// //     setSaving(true)
// //     try {
// //       // Update profile in Supabase
// //       const { error } = await supabase
// //         .from('profiles')
// //         .upsert({
// //           id: profile.id,
// //           full_name: profile.full_name,
// //           business_name: profile.business_name,
// //           business_type: profile.business_type,
// //           updated_at: new Date().toISOString(),
// //         })

// //       if (error) throw error

// //       toast.success("Profile updated successfully!")
// //     } catch (error: any) {
// //       console.error('Error updating profile:', error)
// //       toast.error("Failed to update profile")
// //     } finally {
// //       setSaving(false)
// //     }
// //   }

// //   const toggleNotification = (key: keyof NotificationSettings) => {
// //     const newSettings = {
// //       ...notifications,
// //       [key]: !notifications[key],
// //     }
// //     setNotifications(newSettings)
    
// //     // Save to localStorage
// //     localStorage.setItem('notification_settings', JSON.stringify(newSettings))
// //     toast.success("Notification settings updated")
// //   }

// //   if (loading) {
// //     return (
// //       <div className="flex items-center justify-center min-h-[400px]">
// //         <Loader2 className="h-8 w-8 animate-spin text-primary" />
// //       </div>
// //     )
// //   }

// //   const notificationItems = [
// //     { 
// //       key: 'expiry_alerts' as keyof NotificationSettings,
// //       label: "Expiry alerts", 
// //       desc: "Get notified before products expire"
// //     },
// //     { 
// //       key: 'surplus_predictions' as keyof NotificationSettings,
// //       label: "Surplus predictions", 
// //       desc: "AI-powered surplus warnings"
// //     },
// //     { 
// //       key: 'low_stock_alerts' as keyof NotificationSettings,
// //       label: "Low stock alerts", 
// //       desc: "When inventory falls below threshold"
// //     },
// //     { 
// //       key: 'weekly_reports' as keyof NotificationSettings,
// //       label: "Weekly reports", 
// //       desc: "Summary email every Monday"
// //     },
// //   ]

// //   return (
// //     <div className="flex flex-col gap-6 max-w-3xl">
// //       <div>
// //         <h1 className="text-2xl font-bold tracking-tight text-foreground">Settings</h1>
// //         <p className="text-sm text-muted-foreground">Manage your account and business preferences</p>
// //       </div>

// //       {/* Business Profile */}
// //       <Card>
// //         <CardHeader className="pb-4">
// //           <div className="flex items-center gap-3">
// //             <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
// //               <Store className="h-4 w-4 text-primary" />
// //             </div>
// //             <div>
// //               <CardTitle className="text-base font-semibold">Business Profile</CardTitle>
// //               <CardDescription>Manage your business information</CardDescription>
// //             </div>
// //           </div>
// //         </CardHeader>
// //         <CardContent className="flex flex-col gap-4">
// //           <div className="flex flex-col gap-2">
// //             <Label htmlFor="business-name">Business name</Label>
// //             <Input 
// //               id="business-name" 
// //               value={profile.business_name}
// //               onChange={(e) => setProfile({ ...profile, business_name: e.target.value })}
// //               placeholder="Enter your business name"
// //             />
// //           </div>
// //           <div className="flex flex-col gap-2">
// //             <Label htmlFor="business-type">Business type</Label>
// //             <Input 
// //               id="business-type" 
// //               value={profile.business_type}
// //               onChange={(e) => setProfile({ ...profile, business_type: e.target.value })}
// //               placeholder="e.g., Bakery, Restaurant, Grocery Store"
// //             />
// //           </div>
// //           <div className="flex justify-end pt-2">
// //             <Button 
// //               size="sm" 
// //               onClick={handleProfileUpdate}
// //               disabled={saving}
// //             >
// //               {saving ? (
// //                 <>
// //                   <Loader2 className="h-4 w-4 animate-spin mr-2" />
// //                   Saving...
// //                 </>
// //               ) : (
// //                 "Save changes"
// //               )}
// //             </Button>
// //           </div>
// //         </CardContent>
// //       </Card>

// //       {/* Account */}
// //       <Card>
// //         <CardHeader className="pb-4">
// //           <div className="flex items-center gap-3">
// //             <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
// //               <User className="h-4 w-4 text-primary" />
// //             </div>
// //             <div>
// //               <CardTitle className="text-base font-semibold">Account</CardTitle>
// //               <CardDescription>Your personal account details</CardDescription>
// //             </div>
// //           </div>
// //         </CardHeader>
// //         <CardContent className="flex flex-col gap-4">
// //           <div className="flex flex-col gap-2">
// //             <Label htmlFor="full-name">Full name</Label>
// //             <Input 
// //               id="full-name" 
// //               value={profile.full_name}
// //               onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
// //               placeholder="Enter your full name"
// //             />
// //           </div>
// //           <div className="flex flex-col gap-2">
// //             <Label htmlFor="email">Email</Label>
// //             <Input 
// //               id="email" 
// //               value={profile.email}
// //               disabled
// //               className="bg-muted cursor-not-allowed"
// //             />
// //             <p className="text-xs text-muted-foreground">
// //               Email cannot be changed. Contact support if you need to update it.
// //             </p>
// //           </div>
// //           <div className="flex justify-end pt-2">
// //             <Button 
// //               size="sm" 
// //               onClick={handleProfileUpdate}
// //               disabled={saving}
// //             >
// //               {saving ? (
// //                 <>
// //                   <Loader2 className="h-4 w-4 animate-spin mr-2" />
// //                   Saving...
// //                 </>
// //               ) : (
// //                 "Save changes"
// //               )}
// //             </Button>
// //           </div>
// //         </CardContent>
// //       </Card>

// //       {/* Notifications */}
// //       <Card>
// //         <CardHeader className="pb-4">
// //           <div className="flex items-center gap-3">
// //             <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10">
// //               <Bell className="h-4 w-4 text-accent" />
// //             </div>
// //             <div>
// //               <CardTitle className="text-base font-semibold">Notifications</CardTitle>
// //               <CardDescription>Configure how you receive alerts</CardDescription>
// //             </div>
// //           </div>
// //         </CardHeader>
// //         <CardContent className="flex flex-col gap-3">
// //           {notificationItems.map((item) => (
// //             <button
// //               key={item.key}
// //               onClick={() => toggleNotification(item.key)}
// //               className="flex items-center justify-between rounded-lg border border-border p-3.5 hover:bg-accent/5 transition-colors cursor-pointer"
// //             >
// //               <div className="text-left">
// //                 <p className="text-sm font-medium text-foreground">{item.label}</p>
// //                 <p className="text-xs text-muted-foreground">{item.desc}</p>
// //               </div>
// //               <Badge 
// //                 variant={notifications[item.key] ? "default" : "secondary"} 
// //                 className="text-[10px]"
// //               >
// //                 {notifications[item.key] ? "Active" : "Off"}
// //               </Badge>
// //             </button>
// //           ))}
// //         </CardContent>
// //       </Card>
// //     </div>
// //   )
// // }



// "use client"

// import { useState } from "react"
// import { Settings, User, Bell, Shield, CreditCard, Store, CheckCircle2 } from "lucide-react"
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
//   CardDescription,
// } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Badge } from "@/components/ui/badge"
// import { Switch } from "@/components/ui/switch"
// import { useAuth } from "@/lib/auth-context"
// import { supabase } from "@/lib/supabase"

// function getDisplayName(user: any): string {
//   if (user?.user_metadata?.full_name) return user.user_metadata.full_name
//   if (user?.user_metadata?.name) return user.user_metadata.name
//   if (user?.email) {
//     const name = user.email.split("@")[0]
//     return name
//       .split(/[._-]/)
//       .map((p: string) => p.charAt(0).toUpperCase() + p.slice(1))
//       .join(" ")
//   }
//   return ""
// }

// function getBusinessName(user: any): string {
//   if (user?.user_metadata?.business_name) return user.user_metadata.business_name
//   if (user?.user_metadata?.company) return user.user_metadata.company
//   return ""
// }

// export default function SettingsPage() {
//   const { user } = useAuth()

//   const [fullName, setFullName] = useState(getDisplayName(user))
//   const [email] = useState(user?.email || "")
//   const [businessName, setBusinessName] = useState(getBusinessName(user))
//   const [location, setLocation] = useState(user?.user_metadata?.location || "")
//   const [businessType, setBusinessType] = useState(user?.user_metadata?.business_type || "")

//   const [profileSaving, setProfileSaving] = useState(false)
//   const [profileSaved, setProfileSaved] = useState(false)
//   const [bizSaving, setBizSaving] = useState(false)
//   const [bizSaved, setBizSaved] = useState(false)

//   const [notifications, setNotifications] = useState({
//     expiry: true,
//     surplus: true,
//     lowStock: true,
//     weeklyReports: false,
//   })

//   const handleSaveAccount = async () => {
//     setProfileSaving(true)
//     setProfileSaved(false)
//     try {
//       await supabase.auth.updateUser({
//         data: {
//           full_name: fullName,
//           name: fullName,
//         },
//       })
//       setProfileSaved(true)
//       setTimeout(() => setProfileSaved(false), 3000)
//     } catch (err) {
//       console.error("Failed to save account:", err)
//     } finally {
//       setProfileSaving(false)
//     }
//   }

//   const handleSaveBusiness = async () => {
//     setBizSaving(true)
//     setBizSaved(false)
//     try {
//       await supabase.auth.updateUser({
//         data: {
//           business_name: businessName,
//           location,
//           business_type: businessType,
//         },
//       })
//       setBizSaved(true)
//       setTimeout(() => setBizSaved(false), 3000)
//     } catch (err) {
//       console.error("Failed to save business:", err)
//     } finally {
//       setBizSaving(false)
//     }
//   }

//   return (
//     <div className="flex flex-col gap-6 max-w-3xl">
//       <div>
//         <h1 className="text-2xl font-bold tracking-tight text-foreground">Settings</h1>
//         <p className="text-sm text-muted-foreground">Manage your account and business preferences</p>
//       </div>

//       {/* Account */}
//       <Card>
//         <CardHeader className="pb-4">
//           <div className="flex items-center gap-3">
//             <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
//               <User className="h-4 w-4 text-primary" />
//             </div>
//             <div>
//               <CardTitle className="text-base font-semibold">Account</CardTitle>
//               <CardDescription>Your personal account details</CardDescription>
//             </div>
//           </div>
//         </CardHeader>
//         <CardContent className="flex flex-col gap-4">
//           <div className="flex flex-col gap-2">
//             <Label htmlFor="full-name">Full name</Label>
//             <Input
//               id="full-name"
//               value={fullName}
//               onChange={(e) => setFullName(e.target.value)}
//               placeholder="Enter your full name"
//             />
//           </div>
//           <div className="flex flex-col gap-2">
//             <Label htmlFor="email">Email</Label>
//             <Input
//               id="email"
//               value={email}
//               disabled
//               className="opacity-60 cursor-not-allowed"
//             />
//             <p className="text-xs text-muted-foreground">Email cannot be changed here.</p>
//           </div>
//           <div className="flex items-center justify-end gap-3 pt-2">
//             {profileSaved && (
//               <span className="flex items-center gap-1.5 text-xs text-primary font-medium">
//                 <CheckCircle2 className="h-3.5 w-3.5" /> Saved
//               </span>
//             )}
//             <Button size="sm" onClick={handleSaveAccount} disabled={profileSaving}>
//               {profileSaving ? "Saving..." : "Save changes"}
//             </Button>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Business Profile */}
//       <Card>
//         <CardHeader className="pb-4">
//           <div className="flex items-center gap-3">
//             <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
//               <Store className="h-4 w-4 text-primary" />
//             </div>
//             <div>
//               <CardTitle className="text-base font-semibold">Business Profile</CardTitle>
//               <CardDescription>Manage your business information</CardDescription>
//             </div>
//           </div>
//         </CardHeader>
//         <CardContent className="flex flex-col gap-4">
//           <div className="flex flex-col gap-2">
//             <Label htmlFor="biz-name">Business name</Label>
//             <Input
//               id="biz-name"
//               value={businessName}
//               onChange={(e) => setBusinessName(e.target.value)}
//               placeholder="Enter your business name"
//             />
//           </div>
//           <div className="flex flex-col gap-2">
//             <Label htmlFor="location">Location</Label>
//             <Input
//               id="location"
//               value={location}
//               onChange={(e) => setLocation(e.target.value)}
//               placeholder="City, Country"
//             />
//           </div>
//           <div className="flex flex-col gap-2">
//             <Label htmlFor="biz-type">Business type</Label>
//             <Input
//               id="biz-type"
//               value={businessType}
//               onChange={(e) => setBusinessType(e.target.value)}
//               placeholder="e.g. Bakery, Restaurant, Grocery"
//             />
//           </div>
//           <div className="flex items-center justify-end gap-3 pt-2">
//             {bizSaved && (
//               <span className="flex items-center gap-1.5 text-xs text-primary font-medium">
//                 <CheckCircle2 className="h-3.5 w-3.5" /> Saved
//               </span>
//             )}
//             <Button size="sm" onClick={handleSaveBusiness} disabled={bizSaving}>
//               {bizSaving ? "Saving..." : "Save changes"}
//             </Button>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Notifications */}
//       <Card>
//         <CardHeader className="pb-4">
//           <div className="flex items-center gap-3">
//             <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10">
//               <Bell className="h-4 w-4 text-accent" />
//             </div>
//             <div>
//               <CardTitle className="text-base font-semibold">Notifications</CardTitle>
//               <CardDescription>Configure how you receive alerts</CardDescription>
//             </div>
//           </div>
//         </CardHeader>
//         <CardContent className="flex flex-col gap-3">
//           {[
//             {
//               key: "expiry" as const,
//               label: "Expiry alerts",
//               desc: "Get notified before products expire",
//             },
//             {
//               key: "surplus" as const,
//               label: "Surplus predictions",
//               desc: "AI-powered surplus warnings",
//             },
//             {
//               key: "lowStock" as const,
//               label: "Low stock alerts",
//               desc: "When inventory falls below threshold",
//             },
//             {
//               key: "weeklyReports" as const,
//               label: "Weekly reports",
//               desc: "Summary email every Monday",
//             },
//           ].map((item) => (
//             <div key={item.key} className="flex items-center justify-between rounded-lg border border-border p-3.5">
//               <div>
//                 <p className="text-sm font-medium text-foreground">{item.label}</p>
//                 <p className="text-xs text-muted-foreground">{item.desc}</p>
//               </div>
//               <Switch
//                 checked={notifications[item.key]}
//                 onCheckedChange={(val) =>
//                   setNotifications((prev) => ({ ...prev, [item.key]: val }))
//                 }
//               />
//             </div>
//           ))}
//         </CardContent>
//       </Card>

      
//       {/* <Card>
//         <CardHeader className="pb-4">
//           <div className="flex items-center gap-3">
//             <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
//               <CreditCard className="h-4 w-4 text-primary" />
//             </div>
//             <div>
//               <CardTitle className="text-base font-semibold">Subscription</CardTitle>
//               <CardDescription>Your current plan and billing</CardDescription>
//             </div>
//           </div>
//         </CardHeader>
//         <CardContent>
//           <div className="flex items-center justify-between rounded-lg border border-primary/20 bg-primary/5 p-4">
//             <div>
//               <div className="flex items-center gap-2">
//                 <p className="text-sm font-bold text-foreground">Free Trial</p>
//                 <Badge className="text-[10px]">Active</Badge>
//               </div>
//               <p className="text-xs text-muted-foreground mt-0.5">12 days remaining</p>
//             </div>
//             <Button size="sm">Upgrade</Button>
//           </div>
//         </CardContent>
//       </Card> */}
//     </div>
//   )
// }




"use client"

import { useState, useEffect } from "react"
import { Settings, User, Bell, Shield, CreditCard, Store, CheckCircle2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { useAuth } from "@/lib/auth-context"
import { supabase } from "@/lib/supabase"

const BUSINESS_TYPES = [
  { id: "restaurant", label: "Restaurant"         },
  { id: "bakery",     label: "Bakery"             },
  { id: "cafe",       label: "Cafe / Coffee Shop" },
  { id: "grocery",    label: "Grocery Store"      },
  { id: "catering",   label: "Catering Service"   },
  { id: "other",      label: "Other Food Business"},
]

function getDisplayName(user: any): string {
  if (user?.user_metadata?.full_name) return user.user_metadata.full_name
  if (user?.user_metadata?.name)      return user.user_metadata.name
  if (user?.email) {
    return user.email.split('@')[0]
      .split(/[._-]/)
      .map((p: string) => p.charAt(0).toUpperCase() + p.slice(1))
      .join(' ')
  }
  return ''
}

export default function SettingsPage() {
  const { user } = useAuth()

  // Account
  const [fullName, setFullName]     = useState(getDisplayName(user))
  const email = user?.email || ''

  // Business — loaded from businesses table
  const [businessId, setBusinessId]     = useState<number | null>(null)
  const [businessName, setBusinessName] = useState('')
  const [location, setLocation]         = useState('')
  const [businessType, setBusinessType] = useState('')
  const [bizLoaded, setBizLoaded]       = useState(false)

  const [profileSaving, setProfileSaving] = useState(false)
  const [profileSaved, setProfileSaved]   = useState(false)
  const [profileError, setProfileError]   = useState('')

  const [bizSaving, setBizSaving] = useState(false)
  const [bizSaved, setBizSaved]   = useState(false)
  const [bizError, setBizError]   = useState('')

  const [notifications, setNotifications] = useState({
    expiry: true, surplus: true, lowStock: true, weeklyReports: false,
  })

  // Load business data from Supabase on mount
  useEffect(() => {
    if (!user) return
    const load = async () => {
      const { data } = await supabase
        .from('businesses')
        .select('id, name, location, business_type')
        .eq('user_id', user.id)
        .maybeSingle()
      if (data) {
        setBusinessId(data.id)
        setBusinessName(data.name || '')
        setLocation(data.location || '')
        setBusinessType(data.business_type || '')
      }
      setBizLoaded(true)
    }
    load()
  }, [user])

  const handleSaveAccount = async () => {
    setProfileSaving(true)
    setProfileSaved(false)
    setProfileError('')
    try {
      const { error } = await supabase.auth.updateUser({
        data: { full_name: fullName, name: fullName },
      })
      if (error) throw error
      setProfileSaved(true)
      setTimeout(() => setProfileSaved(false), 3000)
    } catch (err: any) {
      setProfileError(err.message || 'Failed to save')
    } finally {
      setProfileSaving(false)
    }
  }

  const handleSaveBusiness = async () => {
    if (!user) return
    setBizSaving(true)
    setBizSaved(false)
    setBizError('')
    try {
      if (businessId) {
        // Update existing business
        const { error } = await supabase
          .from('businesses')
          .update({
            name:          businessName.trim(),
            location:      location.trim() || null,
            business_type: businessType,
          })
          .eq('id', businessId)
        if (error) throw error
      } else {
        // Create business if somehow missing
        const { data, error } = await supabase
          .from('businesses')
          .insert({
            user_id:       user.id,
            name:          businessName.trim() || 'My Business',
            location:      location.trim() || null,
            business_type: businessType || 'other',
          })
          .select('id')
          .single()
        if (error) throw error
        setBusinessId(data.id)
      }
      setBizSaved(true)
      setTimeout(() => setBizSaved(false), 3000)
    } catch (err: any) {
      setBizError(err.message || 'Failed to save')
    } finally {
      setBizSaving(false)
    }
  }

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your account and business preferences</p>
      </div>

      {/* Account */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
              <User className="h-4 w-4 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold">Account</CardTitle>
              <CardDescription>Your personal account details</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="full-name">Full name</Label>
            <Input id="full-name" value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your full name" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={email} disabled className="opacity-60 cursor-not-allowed" />
            <p className="text-xs text-muted-foreground">Email cannot be changed here.</p>
          </div>
          {profileError && <p className="text-xs text-destructive bg-destructive/10 rounded-md px-3 py-2">{profileError}</p>}
          <div className="flex items-center justify-end gap-3 pt-1">
            {profileSaved && (
              <span className="flex items-center gap-1.5 text-xs text-primary font-medium">
                <CheckCircle2 className="h-3.5 w-3.5" /> Saved
              </span>
            )}
            <Button size="sm" onClick={handleSaveAccount} disabled={profileSaving}>
              {profileSaving ? 'Saving...' : 'Save changes'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Business Profile */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
              <Store className="h-4 w-4 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold">Business Profile</CardTitle>
              <CardDescription>
                {bizLoaded && !businessId
                  ? 'No business profile found — fill in your details below.'
                  : 'The details you entered during onboarding'}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="biz-name">Business name</Label>
            <Input id="biz-name" value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="e.g. Fresh Bakes Lagos" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="location">Location</Label>
            <Input id="location" value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Lagos, Nigeria" />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Business type</Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {BUSINESS_TYPES.map((bt) => (
                <button key={bt.id} onClick={() => setBusinessType(bt.id)}
                  className={`rounded-lg border px-3 py-2 text-xs font-medium text-left transition-colors ${
                    businessType === bt.id
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border text-muted-foreground hover:border-primary/40'
                  }`}>
                  {bt.label}
                </button>
              ))}
            </div>
          </div>
          {bizError && <p className="text-xs text-destructive bg-destructive/10 rounded-md px-3 py-2">{bizError}</p>}
          <div className="flex items-center justify-end gap-3 pt-1">
            {bizSaved && (
              <span className="flex items-center gap-1.5 text-xs text-primary font-medium">
                <CheckCircle2 className="h-3.5 w-3.5" /> Saved
              </span>
            )}
            <Button size="sm" onClick={handleSaveBusiness} disabled={bizSaving || !businessName.trim()}>
              {bizSaving ? 'Saving...' : 'Save changes'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10">
              <Bell className="h-4 w-4 text-accent" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold">Notifications</CardTitle>
              <CardDescription>Configure how you receive alerts</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {[
            { key: 'expiry'        as const, label: 'Expiry alerts',         desc: 'Get notified before products expire'        },
            { key: 'surplus'       as const, label: 'Surplus predictions',   desc: 'AI-powered surplus warnings'                },
            { key: 'lowStock'      as const, label: 'Low stock alerts',      desc: 'When inventory falls below threshold'       },
            { key: 'weeklyReports' as const, label: 'Weekly reports',        desc: 'Summary email every Monday'                 },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between rounded-lg border border-border p-3.5">
              <div>
                <p className="text-sm font-medium text-foreground">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
              <Switch checked={notifications[item.key]}
                onCheckedChange={(v) => setNotifications((p) => ({ ...p, [item.key]: v }))} />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Subscription */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
              <CreditCard className="h-4 w-4 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold">Subscription</CardTitle>
              <CardDescription>Your current plan and billing</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between rounded-lg border border-primary/20 bg-primary/5 p-4">
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-bold text-foreground">Free Trial</p>
                <Badge className="text-[10px]">Active</Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">12 days remaining</p>
            </div>
            <Button size="sm">Upgrade</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}