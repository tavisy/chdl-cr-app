"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { BarChart3, Users, Target, Lightbulb, TrendingUp, Globe, TrendingDown, BookOpen } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  const [activeSection, setActiveSection] = useState("overview")

  const sections = [
    { id: "overview", title: "Executive Overview", icon: BarChart3 },
    { id: "market", title: "Market Analysis", icon: TrendingUp },
    { id: "consumer", title: "Consumer Insights", icon: Users },
    { id: "competitive", title: "Competitive Landscape", icon: Target },
    { id: "identity", title: "Canadian Identity", icon: Globe },
    { id: "recommendations", title: "Strategic Recommendations", icon: Lightbulb },
    { id: "references", title: "References", icon: BookOpen },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-6 py-24">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2">
              Strategic Business Report
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              Crown Royal
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-slate-300 leading-relaxed">
              Charting a Course for Premiumization and Bourbon Enthusiast Engagement
            </p>
          </div>
        </div>
        {/* Recommended Image: Sophisticated whiskey distillery landscape with Canadian elements */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-50 to-transparent"></div>
      </div>

      {/* Navigation Pills */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex flex-wrap gap-2 justify-center">
            {sections.map((section) => {
              const Icon = section.icon
              const isRecommendations = section.id === "recommendations"
              const isIdentity = section.id === "identity"
              const isReferences = section.id === "references"

              if (isRecommendations) {
                return (
                  <Button
                    key={section.id}
                    variant={activeSection === section.id ? "default" : "ghost"}
                    size="sm"
                    className="flex items-center gap-2"
                    asChild
                  >
                    <Link href="/recommendations">
                      <Icon className="h-4 w-4" />
                      {section.title}
                    </Link>
                  </Button>
                )
              }

              if (isIdentity) {
                return (
                  <Button
                    key={section.id}
                    variant={activeSection === section.id ? "default" : "ghost"}
                    size="sm"
                    className="flex items-center gap-2"
                    asChild
                  >
                    <Link href="/canadian-identity">
                      <Icon className="h-4 w-4" />
                      {section.title}
                    </Link>
                  </Button>
                )
              }

              if (isReferences) {
                return (
                  <Button
                    key={section.id}
                    variant={activeSection === section.id ? "default" : "ghost"}
                    size="sm"
                    className="flex items-center gap-2"
                    asChild
                  >
                    <Link href="/references">
                      <Icon className="h-4 w-4" />
                      {section.title}
                    </Link>
                  </Button>
                )
              }
            })}
          </div>
        </div>
      </div>

      {/* Executive Summary Section */}
      <section id="executive-summary" className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 text-slate-900">Executive Summary</h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Crown Royal faces a critical juncture: to evolve from a historically strong, yet potentially outdated,
                Canadian whisky brand into a compelling alternative for the discerning bourbon enthusiast.
              </p>
            </div>

            {/* Primary Problem Statement */}
            <div className="mb-12">
              <Card className="p-8 border-2 border-red-500 bg-gradient-to-br from-red-50 via-white to-red-50 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-500 via-amber-500 to-red-500"></div>
                <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-3 py-1 rounded-full font-bold animate-pulse">
                  STRATEGIC IMPERATIVE
                </div>
                <div className="text-center">
                  <div className="inline-flex items-center gap-2 bg-red-100 px-4 py-2 rounded-full mb-6">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-red-700 font-semibold text-sm uppercase tracking-wide">
                      Primary Challenge
                    </span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4 leading-tight">
                    Crown Royal must capitalize on the bourbon shortage by authentically repositioning Canadian rye
                    whisky from a secondary choice to the premium North American whisky category leader.
                  </h3>
                  <div className="grid md:grid-cols-3 gap-6 mt-8">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-xl">⚡</span>
                      </div>
                      <div className="text-sm font-semibold text-red-600 mb-1">Market Disruption</div>
                      <p className="text-xs text-slate-600">
                        Bourbon shortages create unprecedented opportunity window
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-xl">🎯</span>
                      </div>
                      <div className="text-sm font-semibold text-amber-600 mb-1">Perception Gap</div>
                      <p className="text-xs text-slate-600">
                        Canadian whisky viewed as secondary despite superior quality
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-xl">👑</span>
                      </div>
                      <div className="text-sm font-semibold text-emerald-600 mb-1">Leadership Potential</div>
                      <p className="text-xs text-slate-600">Authentic repositioning can capture premium market share</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <Card className="p-8 border-l-4 border-l-amber-600">
                <h3 className="text-2xl font-semibold mb-4 text-slate-900">Market Challenge</h3>
                <p className="text-slate-700 leading-relaxed mb-4">
                  The North American whiskey market is dynamic, characterized by a nuanced premiumization trend, the
                  disruptive rise of craft distilleries, and a significant shift towards e-commerce and experiential
                  consumption.
                </p>
                <p className="text-slate-700 leading-relaxed">
                  While bourbon continues its robust growth, Canadian whisky, despite its market leadership in its
                  category, contends with persistent stereotypes and a perception of being primarily a mixer.
                </p>
              </Card>

              <Card className="p-8 border-l-4 border-l-blue-600">
                <h3 className="text-2xl font-semibold mb-4 text-slate-900">Strategic Opportunity</h3>
                <p className="text-slate-700 leading-relaxed mb-4">
                  The core challenge lies in authentically leveraging Crown Royal's rich Canadian identity – its unique
                  production methods, pristine geographical advantages, and legacy of craftsmanship – to resonate with a
                  bourbon-centric palate.
                </p>
                <p className="text-slate-700 leading-relaxed">
                  The strategic imperative is to reframe Crown Royal's narrative, enhance its visual identity, and
                  innovate its product offerings to highlight its inherent quality and complexity.
                </p>
              </Card>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
              <Card className="p-6 text-center hover:shadow-lg transition-shadow">
                <div className="text-3xl font-bold text-amber-600 mb-2">42%</div>
                <div className="text-sm text-slate-600 mb-2">Crown Royal's share of Canadian whisky market</div>
              </Card>
              <Card className="p-6 text-center hover:shadow-lg transition-shadow">
                <div className="text-3xl font-bold text-blue-600 mb-2">79%</div>
                <div className="text-sm text-slate-600 mb-2">Brand loyalty score - highest among Canadian whiskies</div>
              </Card>
              <Card className="p-6 text-center hover:shadow-lg transition-shadow">
                <div className="text-3xl font-bold text-green-600 mb-2">78%</div>
                <div className="text-sm text-slate-600 mb-2">Brand value growth to CAD 3.2 billion in 2025</div>
              </Card>
              <Card className="p-6 text-center border-2 border-amber-400 bg-gradient-to-br from-amber-50 to-orange-50 shadow-lg hover:shadow-xl transition-all duration-300 relative">
                <div className="absolute -top-2 -right-2 bg-amber-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                  DISRUPTION
                </div>
                <div className="text-3xl font-bold text-red-600 mb-2">-1.3%</div>
                <div className="text-sm text-slate-600 mb-2 font-medium">American whiskey sales decline in 2024</div>
              </Card>
            </div>

            {/* Recommended Image: Infographic showing market statistics and trends */}
          </div>
        </div>
      </section>

      <Separator />

      {/* Market Landscape Section */}
      <section id="market" className="py-16 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-slate-900">Market Landscape Analysis</h2>
            </div>

            <div className="grid lg:grid-cols-3 gap-8 mb-12">
              <div className="lg:col-span-2">
                <Card className="p-8 h-full">
                  <h3 className="text-2xl font-semibold mb-6 text-slate-900">Current State & Trends</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="w-3 h-3 bg-amber-600 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <h4 className="font-semibold text-slate-900">Overall Growth</h4>
                        <p className="text-slate-700">
                          The global whiskey market is projected to grow at a CAGR of 6.7% from 2025 to 2034, with some
                          forecasts suggesting even more aggressive expansion to $345.7 billion by 2035{" "}
                          <a
                            href="https://www.marketdataforecast.com/market-reports/north-america-whiskey-market"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:underline"
                          >
                            [1]
                          </a>
                          .
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-3 h-3 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <h4 className="font-semibold text-slate-900">Spirits Leadership</h4>
                        <p className="text-slate-700">
                          Spirits maintained market share lead over beer and wine for the third consecutive year in
                          2024, reaching 42.2% of total beverage alcohol revenue.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-3 h-3 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <h4 className="font-semibold text-slate-900">Premiumization Trend</h4>
                        <p className="text-slate-700">
                          Super-premium-and-above American whiskey tiers continued to rise by approximately 6% in 2024,
                          while standard tiers faced declines.
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              <div className="space-y-6">
                <Card className="p-6">
                  <h4 className="font-semibold mb-4 text-slate-900">American Whiskey</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-600">2024 Revenue</span>
                      <span className="font-semibold">$11.5B</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Volume Growth</span>
                      <span className="font-semibold text-red-600">-2.7%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Super-Premium Growth</span>
                      <span className="font-semibold text-green-600">+6%</span>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <h4 className="font-semibold mb-4 text-slate-900">Canadian Whisky</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-600">US Revenue</span>
                      <span className="font-semibold">$951.9M</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Value Growth</span>
                      <span className="font-semibold text-green-600">+0.9%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Tariff Status</span>
                      <span className="font-semibold text-blue-600">Free</span>
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            {/* Market Disruption Highlight */}
            <Card className="p-8 mb-12 border-2 border-red-400 bg-gradient-to-br from-red-50 to-orange-50">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <TrendingDown className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-2xl font-semibold text-slate-900">Bourbon Industry Disruption</h3>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-semibold text-slate-900 mb-2">Sales Decline</h4>
                  <p className="text-sm text-slate-700">
                    American whiskey sales declined for the first time in over 20 years, with 2024 showing 1.3% decline{" "}
                    <a
                      href="https://www.weku.org/the-commonwealth/2025-02-11/us-sales-fall-for-american-whiskey-as-trade-war-threats-continue"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:underline"
                    >
                      [19]
                    </a>
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-2">Trade Barriers</h4>
                  <p className="text-sm text-slate-700">
                    EU's pending 50% tariffs on American spirits in March 2025 threaten international expansion{" "}
                    <a
                      href="https://www.thedrinksbusiness.com/2025/03/us-whiskey-rushes-to-eu-before-50-tariffs-hit-but-will-it-be-enough/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:underline"
                    >
                      [18]
                    </a>
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-2">Supply Paradox</h4>
                  <p className="text-sm text-slate-700">
                    Record 14.3 million barrels aging in Kentucky create overproduction concerns despite premium
                    scarcity
                  </p>
                </div>
              </div>
            </Card>

            {/* Recommended Image: Interactive chart showing whiskey category performance */}
          </div>
        </div>
      </section>

      <Separator />

      {/* Consumer Segments Section */}
      <section id="consumer" className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold mb-12 text-center text-slate-900">Key Consumer Segments</h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="p-6 hover:shadow-lg transition-shadow border-2 border-purple-400 bg-gradient-to-br from-purple-50 to-blue-50 shadow-lg hover:shadow-xl transition-all duration-300 relative">
                <div className="absolute -top-2 -right-2 bg-purple-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                  KEY INSIGHT
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-slate-900">Millennials & Gen Z</h3>
                <p className="text-slate-700 mb-4">
                  Significant drivers of demand for high-quality whiskies, showing strong preference for premium and
                  craft spirits. Account for over 45% of total Bourbon consumption.
                </p>
                <Badge variant="secondary">Growing Segment</Badge>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-amber-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-slate-900">
                  <a
                    href="https://www.google.com/search?q=premiumization&rlz=1C1MMCH_enCA1128CA1129&oq=premiumization&gs_lcrp=EgZjaHJvbWUyBggAEEUYOdIBCDMwOTRqMGo3qAIAsAIA&sourceid=chrome&ie=UTF-8"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-amber-600 transition-colors underline"
                    title="Premiumization is a real word - click to see definition"
                  >
                    Premiumization
                  </a>{" "}
                  Seekers
                </h3>
                <p className="text-slate-700 mb-4">
                  Willing to spend more on high-quality, handcrafted whiskies. Appreciate nuanced flavors and
                  craftsmanship, seeking high-end bottles with compelling stories.
                </p>
                <Badge variant="secondary">High Value</Badge>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Target className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-slate-900">Craft Enthusiasts</h3>
                <p className="text-slate-700 mb-4">
                  Driven by desire for authenticity and innovation. Seek unique small-batch expressions with emphasis on
                  local ingredients and traditional methods.
                </p>
                <Badge variant="secondary">Authentic Focus</Badge>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-slate-900">Cocktail Culture</h3>
                <p className="text-slate-700 mb-4">
                  Increasing popularity of whiskey cocktails elevates presence in bars and restaurants. Bourbon-based
                  cocktails have seen substantial growth.
                </p>
                <Badge variant="secondary">Social Drinking</Badge>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <Globe className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-slate-900">Experiential Consumers</h3>
                <p className="text-slate-700 mb-4">
                  Interested in visiting distilleries, participating in tastings, and learning about whiskey-making
                  process. View experiences as "affordable luxury."
                </p>
                <Badge variant="secondary">Experience Driven</Badge>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mb-4">
                  <Lightbulb className="h-6 w-6 text-slate-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-slate-900">Value-Conscious</h3>
                <p className="text-slate-700 mb-4">
                  Prioritize price-to-value while remaining quality-focused. Seek accessible whiskies positioned as
                  "everyday indulgences" with quality delivery.
                </p>
                <Badge variant="secondary">Price Sensitive</Badge>
              </Card>
            </div>

            {/* Recommended Image: Consumer persona illustrations or demographic infographics */}
          </div>
        </div>
      </section>

      {/* Navigation to detailed sections */}
      <section id="competitive" className="py-16 bg-slate-900 text-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8">Explore Detailed Analysis</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Link href="/competitive-analysis">
                <Card className="p-6 bg-slate-800 border-slate-700 hover:bg-slate-700 transition-colors cursor-pointer h-full">
                  <CardContent className="p-0">
                    <Target className="h-8 w-8 text-amber-400 mb-4 mx-auto" />
                    <h3 className="text-lg font-semibold mb-2 text-white">Competitive Analysis</h3>
                    <p className="text-slate-300 text-sm">Deep dive into Crown Royal's position vs. bourbon leaders</p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/consumer-insights">
                <Card className="p-6 bg-slate-800 border-slate-700 hover:bg-slate-700 transition-colors cursor-pointer h-full">
                  <CardContent className="p-0">
                    <Users className="h-8 w-8 text-blue-400 mb-4 mx-auto" />
                    <h3 className="text-lg font-semibold mb-2 text-white">Consumer Psychology</h3>
                    <p className="text-slate-300 text-sm">Understanding bourbon enthusiast preferences and barriers</p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/recommendations">
                <Card className="p-6 bg-slate-800 border-slate-700 hover:bg-slate-700 transition-colors cursor-pointer h-full">
                  <CardContent className="p-0">
                    <Lightbulb className="h-8 w-8 text-green-400 mb-4 mx-auto" />
                    <h3 className="text-lg font-semibold mb-2 text-white">Strategic Recommendations</h3>
                    <p className="text-slate-300 text-sm">Actionable insights for brand transformation</p>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
