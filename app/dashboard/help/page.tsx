"use client"

import {
  HelpCircle,
  BookOpen,
  MessageCircle,
  Mail,
  ExternalLink,
  ChevronRight,
} from "lucide-react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const resources = [
  {
    title: "Getting Started Guide",
    description: "Learn how to set up EcoTrack for your business",
    icon: BookOpen,
    action: "Read guide",
  },
  {
    title: "Live Chat Support",
    description: "Talk to our team in real-time during business hours",
    icon: MessageCircle,
    action: "Start chat",
  },
  {
    title: "Email Support",
    description: "Send us a detailed message and we will respond within 24 hours",
    icon: Mail,
    action: "Send email",
  },
]

const faqs = [
  {
    question: "How does the AI forecasting work?",
    answer: "EcoTrack uses machine learning models trained on your sales history, seasonal patterns, and industry benchmarks to predict demand for each product category.",
  },
  {
    question: "Can I connect my POS system?",
    answer: "Yes, EcoTrack integrates with Square, Paystack, and other popular POS systems. Go to Settings to connect your POS.",
  },
  {
    question: "How are surplus alerts calculated?",
    answer: "Surplus alerts are triggered when projected stock exceeds predicted demand by a configurable threshold, considering shelf life and historical patterns.",
  },
  {
    question: "Is my data secure?",
    answer: "All data is encrypted in transit and at rest. We comply with NDPR and international data protection standards.",
  },
]

export default function HelpPage() {
  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Help & Support</h1>
        <p className="text-sm text-muted-foreground">
          Find answers and get assistance with EcoTrack
        </p>
      </div>

      {/* Support channels */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {resources.map((res) => {
          const Icon = res.icon
          return (
            <Card key={res.title} className="hover:border-primary/30 transition-colors cursor-pointer">
              <CardContent className="flex flex-col items-center gap-3 p-5 text-center">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{res.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                    {res.description}
                  </p>
                </div>
                <Button variant="outline" size="sm" className="text-xs mt-1">
                  {res.action}
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* FAQs */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary">
              <HelpCircle className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold">
                Frequently Asked Questions
              </CardTitle>
              <CardDescription>
                Quick answers to common questions
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {faqs.map((faq) => (
            <details
              key={faq.question}
              className="group rounded-lg border border-border overflow-hidden"
            >
              <summary className="flex cursor-pointer items-center justify-between p-4 text-sm font-medium text-foreground hover:bg-secondary/50 transition-colors list-none">
                {faq.question}
                <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-open:rotate-90" />
              </summary>
              <div className="border-t border-border px-4 py-3">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </details>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
