import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, TrendingUp, Users, Target, Lightbulb, BookOpen } from "lucide-react"

export default function HomePage() {
  const sections = [
    {
      title: "Canadian Identity",
      description: "Understanding the Canadian market and cultural landscape",
      href: "/canadian-identity",
      icon: <Users className="h-6 w-6" />,
    },
    {
      title: "Consumer Insights",
      description: "Deep dive into consumer behavior and preferences",
      href: "/consumer-insights",
      icon: <TrendingUp className="h-6 w-6" />,
    },
    {
      title: "Competitive Analysis",
      description: "Market positioning and competitive landscape",
      href: "/competitive-analysis",
      icon: <Target className="h-6 w-6" />,
    },
    {
      title: "Market Disruption",
      description: "Emerging trends and disruptive forces",
      href: "/market-disruption",
      icon: <Lightbulb className="h-6 w-6" />,
    },
    {
      title: "Recommendations",
      description: "Strategic recommendations and action items",
      href: "/recommendations",
      icon: <FileText className="h-6 w-6" />,
    },
    {
      title: "References",
      description: "Sources and additional reading",
      href: "/references",
      icon: <BookOpen className="h-6 w-6" />,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <img
            src="/chdlscriptlogoxBigNERD-horizontal-blacktext.png"
            alt="Carter Hales x BIGNERD"
            className="h-16 w-auto mx-auto mb-6"
          />
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Crown Royal Strategic Report</h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            A comprehensive strategic analysis exploring market opportunities, consumer insights, and competitive
            positioning for Crown Royal in the Canadian market.
          </p>
        </div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {sections.map((section) => (
            <Card key={section.href} className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg text-purple-600">{section.icon}</div>
                  <CardTitle className="text-lg">{section.title}</CardTitle>
                </div>
                <CardDescription>{section.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link href={section.href}>View Section</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center mt-16 pt-8 border-t border-slate-200">
          <p className="text-slate-500">Strategic analysis prepared by Carter Hales in collaboration with BIGNERD</p>
        </div>
      </div>
    </div>
  )
}
