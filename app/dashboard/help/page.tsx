// "use client"

// import {
//   HelpCircle,
//   BookOpen,
//   MessageCircle,
//   Mail,
//   ExternalLink,
//   ChevronRight,
// } from "lucide-react"
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
//   CardDescription,
// } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"

// const resources = [
//   {
//     title: "Getting Started Guide",
//     description: "Learn how to set up EcoTrack for your business",
//     icon: BookOpen,
//     action: "Read guide",
//   },
//   {
//     title: "Live Chat Support",
//     description: "Talk to our team in real-time during business hours",
//     icon: MessageCircle,
//     action: "Start chat",
//   },
//   {
//     title: "Email Support",
//     description: "Send us a detailed message and we will respond within 24 hours",
//     icon: Mail,
//     action: "Send email",
//   },
// ]

// const faqs = [
//   {
//     question: "How does the AI forecasting work?",
//     answer: "EcoTrack uses machine learning models trained on your sales history, seasonal patterns, and industry benchmarks to predict demand for each product category.",
//   },
//   {
//     question: "Can I connect my POS system?",
//     answer: "Yes, EcoTrack integrates with Square, Paystack, and other popular POS systems. Go to Settings to connect your POS.",
//   },
//   {
//     question: "How are surplus alerts calculated?",
//     answer: "Surplus alerts are triggered when projected stock exceeds predicted demand by a configurable threshold, considering shelf life and historical patterns.",
//   },
//   {
//     question: "Is my data secure?",
//     answer: "All data is encrypted in transit and at rest. We comply with NDPR and international data protection standards.",
//   },
// ]

// export default function HelpPage() {
//   return (
//     <div className="flex flex-col gap-6 max-w-3xl">
//       <div>
//         <h1 className="text-2xl font-bold tracking-tight text-foreground">Help & Support</h1>
//         <p className="text-sm text-muted-foreground">
//           Find answers and get assistance with EcoTrack
//         </p>
//       </div>

//       {/* Support channels */}
//       <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
//         {resources.map((res) => {
//           const Icon = res.icon
//           return (
//             <Card key={res.title} className="hover:border-primary/30 transition-colors cursor-pointer">
//               <CardContent className="flex flex-col items-center gap-3 p-5 text-center">
//                 <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10">
//                   <Icon className="h-5 w-5 text-primary" />
//                 </div>
//                 <div>
//                   <p className="text-sm font-semibold text-foreground">{res.title}</p>
//                   <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
//                     {res.description}
//                   </p>
//                 </div>
//                 <Button variant="outline" size="sm" className="text-xs mt-1">
//                   {res.action}
//                   <ExternalLink className="h-3 w-3" />
//                 </Button>
//               </CardContent>
//             </Card>
//           )
//         })}
//       </div>

//       {/* FAQs */}
//       <Card>
//         <CardHeader>
//           <div className="flex items-center gap-3">
//             <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary">
//               <HelpCircle className="h-4 w-4 text-muted-foreground" />
//             </div>
//             <div>
//               <CardTitle className="text-base font-semibold">
//                 Frequently Asked Questions
//               </CardTitle>
//               <CardDescription>
//                 Quick answers to common questions
//               </CardDescription>
//             </div>
//           </div>
//         </CardHeader>
//         <CardContent className="flex flex-col gap-3">
//           {faqs.map((faq) => (
//             <details
//               key={faq.question}
//               className="group rounded-lg border border-border overflow-hidden"
//             >
//               <summary className="flex cursor-pointer items-center justify-between p-4 text-sm font-medium text-foreground hover:bg-secondary/50 transition-colors list-none">
//                 {faq.question}
//                 <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-open:rotate-90" />
//               </summary>
//               <div className="border-t border-border px-4 py-3">
//                 <p className="text-sm text-muted-foreground leading-relaxed">
//                   {faq.answer}
//                 </p>
//               </div>
//             </details>
//           ))}
//         </CardContent>
//       </Card>
//     </div>
//   )
// }



"use client"

import { useState } from "react"
import {
  HelpCircle,
  BookOpen,
  Mail,
  ChevronRight,
  Send,
  CheckCircle2,
  ExternalLink,
  Search,
} from "lucide-react"
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
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"

const faqs = [
  {
    question: "How does the AI forecasting work?",
    answer:
      "EcoTrack uses machine learning models trained on your sales history, seasonal patterns, and industry benchmarks to predict demand for each product category.",
    tag: "AI",
  },
  {
    question: "Can I connect my POS system?",
    answer:
      "Yes, EcoTrack integrates with Square, Paystack, and other popular POS systems. Go to Settings to connect your POS.",
    tag: "Integrations",
  },
  {
    question: "How are surplus alerts calculated?",
    answer:
      "Surplus alerts are triggered when projected stock exceeds predicted demand by a configurable threshold, considering shelf life and historical patterns.",
    tag: "Alerts",
  },
  {
    question: "Is my data secure?",
    answer:
      "All data is encrypted in transit and at rest. We comply with NDPR and international data protection standards.",
    tag: "Security",
  },
  {
    question: "How do I add new products to inventory?",
    answer:
      "Go to the Inventory page and click 'Add Product'. Fill in the product name, category, stock quantity, and expiry date. EcoTrack will start tracking it immediately.",
    tag: "Inventory",
  },
  {
    question: "Can I export my data?",
    answer:
      "Yes. From any table view, click the export icon to download your data as a CSV. Full report exports are available on the Pro plan.",
    tag: "Data",
  },
]

const guides = [
  { title: "Getting Started with EcoTrack", time: "5 min read" },
  { title: "Setting Up Inventory Tracking", time: "8 min read" },
  { title: "Understanding AI Forecasts", time: "6 min read" },
  { title: "Configuring Alert Thresholds", time: "4 min read" },
]

export default function HelpPage() {
  const [search, setSearch] = useState("")
  const [name, setName] = useState("")
  const [emailVal, setEmailVal] = useState("")
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  const filteredFaqs = faqs.filter(
    (f) =>
      f.question.toLowerCase().includes(search.toLowerCase()) ||
      f.answer.toLowerCase().includes(search.toLowerCase())
  )

  const handleSendEmail = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (!name || !emailVal || !message) return
    setSending(true)
    await new Promise((r) => setTimeout(r, 1200))
    setSending(false)
    setSent(true)
    setName("")
    setEmailVal("")
    setSubject("")
    setMessage("")
    setTimeout(() => setSent(false), 5000)
  }

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Help & Support</h1>
        <p className="text-sm text-muted-foreground">
          Find answers and get assistance with EcoTrack
        </p>
      </div>

      {/* Guides */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
              <BookOpen className="h-4 w-4 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold">Documentation & Guides</CardTitle>
              <CardDescription>Step-by-step guides to get the most out of EcoTrack</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          {guides.map((guide) => (
            <button
              key={guide.title}
              onClick={() => window.open("https://docs.ecotrack.app", "_blank")}
              className="flex items-center justify-between rounded-lg border border-border px-4 py-3 hover:bg-secondary/60 transition-colors text-left group"
            >
              <div>
                <p className="text-sm font-medium text-foreground">{guide.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{guide.time}</p>
              </div>
              <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
            </button>
          ))}
        </CardContent>
      </Card>

      {/* FAQs */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary">
              <HelpCircle className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold">Frequently Asked Questions</CardTitle>
              <CardDescription>Quick answers to common questions</CardDescription>
            </div>
          </div>
          <div className="relative mt-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search FAQs..."
              className="pl-9 h-9 bg-secondary border-transparent"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          {filteredFaqs.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">No results found for &quot;{search}&quot;</p>
          )}
          {filteredFaqs.map((faq) => (
            <details
              key={faq.question}
              className="group rounded-lg border border-border overflow-hidden"
            >
              <summary className="flex cursor-pointer items-center justify-between p-4 text-sm font-medium text-foreground hover:bg-secondary/50 transition-colors list-none gap-3">
                <span className="flex-1">{faq.question}</span>
                <Badge variant="secondary" className="text-[10px] shrink-0 hidden sm:inline-flex">
                  {faq.tag}
                </Badge>
                <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-open:rotate-90 shrink-0" />
              </summary>
              <div className="border-t border-border px-4 py-3">
                <p className="text-sm text-muted-foreground leading-relaxed">{faq.answer}</p>
              </div>
            </details>
          ))}
        </CardContent>
      </Card>

      {/* Email Support */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
              <Mail className="h-4 w-4 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold">Email Support</CardTitle>
              <CardDescription>Send us a message — we respond within 24 hours</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {sent && (
            <div className="flex items-center gap-2 rounded-lg bg-primary/10 border border-primary/20 px-4 py-3">
              <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
              <p className="text-sm text-primary font-medium">Message sent! We will get back to you within 24 hours.</p>
            </div>
          )}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="support-name">Your name</Label>
              <Input
                id="support-name"
                placeholder="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="support-email">Email address</Label>
              <Input
                id="support-email"
                type="email"
                placeholder="you@example.com"
                value={emailVal}
                onChange={(e) => setEmailVal(e.target.value)}
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="support-subject">Subject</Label>
            <Input
              id="support-subject"
              placeholder="What is your issue about?"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="support-message">Message</Label>
            <Textarea
              id="support-message"
              placeholder="Describe your issue in detail..."
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
          <div className="flex justify-end">
            <Button
              onClick={handleSendEmail}
              disabled={sending || !name || !emailVal || !message}
              size="sm"
              className="gap-2"
            >
              {sending ? (
                "Sending..."
              ) : (
                <>
                  <Send className="h-3.5 w-3.5" />
                  Send message
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}