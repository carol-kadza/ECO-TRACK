"use client"

import { Settings, User, Bell, Shield, CreditCard, Store } from "lucide-react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

const settingSections = [
  {
    title: "Business Profile",
    description: "Manage your business information",
    icon: Store,
    fields: [
      { label: "Business name", value: "Fresh Bakes", id: "biz-name" },
      { label: "Location", value: "Blantyre, Malawi", id: "location" },
      { label: "Business type", value: "Bakery", id: "biz-type" },
    ],
  },
  {
    title: "Account",
    description: "Your personal account details",
    icon: User,
    fields: [
      { label: "Full name", value: "Carol Kadza", id: "name" },
      { label: "Email", value: "carol@gmail.com", id: "email" },
    ],
  },
]

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your account and business preferences</p>
      </div>

      {settingSections.map((section) => {
        const Icon = section.icon
        return (
          <Card key={section.title}>
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-base font-semibold">{section.title}</CardTitle>
                  <CardDescription>{section.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {section.fields.map((field) => (
                <div key={field.id} className="flex flex-col gap-2">
                  <Label htmlFor={field.id}>{field.label}</Label>
                  <Input id={field.id} defaultValue={field.value} />
                </div>
              ))}
              <div className="flex justify-end pt-2">
                <Button size="sm">Save changes</Button>
              </div>
            </CardContent>
          </Card>
        )
      })}

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
            { label: "Expiry alerts", desc: "Get notified before products expire", enabled: true },
            { label: "Surplus predictions", desc: "AI-powered surplus warnings", enabled: true },
            { label: "Low stock alerts", desc: "When inventory falls below threshold", enabled: true },
            { label: "Weekly reports", desc: "Summary email every Monday", enabled: false },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between rounded-lg border border-border p-3.5">
              <div>
                <p className="text-sm font-medium text-foreground">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
              <Badge variant={item.enabled ? "default" : "secondary"} className="text-[10px]">
                {item.enabled ? "Active" : "Off"}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Plan */}
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
