"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, AlertTriangle } from "lucide-react"
import Link from "next/link"

export default function MarketDisruption() {
  const disruptionFactors = [
    {
      factor: "Sales Decline",
      severity: 85,
      description: "American whiskey sales declined for the first time in over 20 years",
      impact: "1.3% decline in 2024, signaling structural market shift beyond temporary correction",
      opportunity: "Market share available for premium alternatives with consistent quality and supply",
    },
    {
      factor: "Trade War Implications",
      severity: 90,
      description: "EU's pending 50% tariffs on American spirits exports in March 2025",
      impact: "Previous trade conflicts caused 20% export decline to EU markets",
      opportunity: "Canadian whisky avoids tariffs, providing cost advantage and supply reliability",
    },
    {
      factor: "Supply Paradox",
      severity: 75,
      description: "Record 14.3 million barrels aging in Kentucky create overproduction concerns",
      impact: "Simultaneous scarcity and surplus creates market inefficiencies",
      opportunity: "Crown Royal can exploit through consistent premium quality and availability",
    },
    {
      factor: "Generational Shift",
      severity: 70,
      description: "Younger demographics favor 'California sober' lifestyles and alternatives",
      impact: "Traditional spirits consumption patterns disrupted by wellness trends",
      opportunity: "Space for brands connecting with changing values around authenticity and responsibility",
    },
    {
      factor: "Economic Pressure",
      severity: 80,
      description: "Inflation constraining budgets, fine whisky auction values down 50%",
      impact: "Democratization of premium whisky consumption, price sensitivity increases",
      opportunity: "Premium quality at accessible price points becomes competitive advantage",
    },
  ]

  const crownRoyalAdvantages = [
    {
      advantage: "Brand Strength",
      metric: "90.7/100",
      description: "Brand Strength Index - highest among all Canadian brands",
      details:
        "Perfect scores for price acceptance, preference, and reputation provide credibility for premium positioning",
    },
    {
      advantage: "Market Recognition",
      metric: "86%",
      description: "Brand awareness among U.S. spirits drinkers",
      details: "79% brand loyalty scores, second only to Jack Daniel's among all whiskey brands",
    },
    {
      advantage: "Financial Performance",
      metric: "78%",
      description: "Brand value growth to CAD 3.2 billion in 2025",
      details: "Canada's fastest-growing brand across all categories demonstrates successful premium transition",
    },
    {
      advantage: "Market Share",
      metric: "42%",
      description: "Share of Canadian whisky market",
      details: "Virtually synonymous with Canadian whisky, providing foundation for category elevation",
    },
    {
      advantage: "Consumer Appeal",
      metric: "38%",
      description: "Appeal to U.S. spirits drinkers",
      details: "31% actively use the brand, 25% express likelihood of repeat consumption",
    },
    {
      advantage: "Premium Pricing",
      metric: "10%",
      description: "Higher dollar sales vs. volume share when competing with American whiskey",
      details: "Demonstrates consumers already perceive superior value in Canadian whisky",
    },
  ]

  const strategicImplications = [
    {
      title: "Immediate Market Entry",
      description: "Bourbon supply constraints create immediate opportunities for premium alternatives",
      actions: [
        "Target bourbon enthusiasts experiencing allocation frustration",
        "Position as reliable premium choice during supply volatility",
        "Leverage existing brand recognition for rapid market penetration",
      ],
    },
    {
      title: "International Expansion",
      description: "Trade barriers affecting American whiskey create competitive advantages globally",
      actions: [
        "Capitalize on tariff-free access to EU and other international markets",
        "Partner with distributors seeking reliable premium whisky supply",
        "Develop export-focused marketing emphasizing Canadian heritage",
      ],
    },
    {
      title: "Premium Positioning",
      description: "Market disruption allows for strategic repositioning without direct confrontation",
      actions: [
        "Emphasize blending mastery as technical superiority",
        "Highlight environmental advantages in Canadian maturation",
        "Position as 'The Sophisticated Alternative' to bourbon",
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-900 via-red-800 to-red-900 text-white py-12">
        <div className="container mx-auto px-6">
          <Link href="/">
            <Button variant="ghost" className="mb-6 text-white hover:bg-red-800">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Overview
            </Button>
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Market Disruption Analysis</h1>
          <p className="text-xl text-red-100 max-w-3xl">
            How bourbon industry challenges create unprecedented strategic opportunities for Crown Royal's premium
            positioning
          </p>
        </div>
      </div>

      {/* Executive Summary */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <Card className="p-8 border-2 border-red-400 bg-gradient-to-br from-red-50 to-orange-50 mb-12">
              <div className="flex items-center gap-3 mb-6">
                <AlertTriangle className="h-8 w-8 text-red-600" />
                <h2 className="text-3xl font-bold text-slate-900">Perfect Storm of Opportunity</h2>
              </div>
              <p className="text-lg text-slate-700 mb-6">
                The North American whisky market stands at a critical inflection point, with the bourbon industry facing
                its most significant challenges in decades. This convergence of supply constraints, trade disruptions,
                and evolving consumer preferences creates an unprecedented opportunity for Crown Royal to capture market
                share through strategic positioning as the premium Canadian alternative.
              </p>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-600 mb-2">First Time</div>
                  <div className="text-sm text-slate-600">American whiskey sales decline in 20+ years</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-amber-600 mb-2">50%</div>
                  <div className="text-sm text-slate-600">Pending EU tariffs on American spirits</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">CAD 3.2B</div>
                  <div className="text-sm text-slate-600">Crown Royal brand value (+78% growth)</div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Disruption Factors Analysis */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center text-slate-900">Bourbon Industry Disruption Factors</h2>

            <div className="space-y-8">
              {disruptionFactors.map((item, index) => (
                <Card key={index} className="p-6">
                  <div className="grid lg:grid-cols-4 gap-6 items-center">
                    <div>
                      <h3 className="text-xl font-semibold mb-2 text-slate-900">{item.factor}</h3>
                      <div className="flex items-center gap-3 mb-3">
                        <Progress value={item.severity} className="flex-1" />
                        <Badge
                          variant={item.severity >= 85 ? "destructive" : item.severity >= 75 ? "default" : "secondary"}
                        >
                          {item.severity >= 85 ? "Critical" : item.severity >= 75 ? "High" : "Moderate"}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-900 mb-2">Description</h4>
                      <p className="text-sm text-slate-700">{item.description}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-900 mb-2">Market Impact</h4>
                      <p className="text-sm text-slate-700">
                        {item.impact}{" "}
                        {item.factor === "Sales Decline" && (
                          <a
                            href="https://www.weku.org/the-commonwealth/2025-02-11/us-sales-fall-for-american-whiskey-as-trade-war-threats-continue"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:underline"
                          >
                            [19]
                          </a>
                        )}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-900 mb-2">Crown Royal Opportunity</h4>
                      <p className="text-sm text-slate-700">{item.opportunity}</p>
                      {item.factor === "Trade War Implications" && (
                        <div className="text-xs text-slate-600 mt-2">
                          <a
                            href="https://www.thedrinksbusiness.com/2025/03/us-whiskey-rushes-to-eu-before-50-tariffs-hit-but-will-it-be-enough/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            [18] The Drinks Business
                          </a>
                        </div>
                      )}
                      {item.factor === "Supply Paradox" && (
                        <div className="text-xs text-slate-600 mt-2">
                          <a
                            href="https://bourbonsbistro.com/press/2022/1/17/wheres-the-bourbon-shortage-shows-no-signs-of-slowing-down"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            [16] Bourbons Bistro
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Crown Royal Competitive Advantages */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center text-slate-900">Crown Royal's Strategic Advantages</h2>
            <p className="text-center text-slate-600 mb-12 max-w-3xl mx-auto">
              Crown Royal's exceptional brand strength and market position provide the foundation for capitalizing on
              bourbon industry disruption.
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {crownRoyalAdvantages.map((item, index) => (
                <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="text-center mb-4">
                    <div className="text-3xl font-bold text-purple-600 mb-2">{item.metric}</div>
                    <h3 className="text-lg font-semibold text-slate-900">{item.advantage}</h3>
                  </div>
                  <p className="text-slate-700 mb-3 text-center">{item.description}</p>
                  <div className="bg-slate-50 p-3 rounded-lg">
                    <p className="text-xs text-slate-600">{item.details}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Strategic Implications */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center text-slate-900">Strategic Implementation Framework</h2>

            <div className="grid lg:grid-cols-3 gap-8">
              {strategicImplications.map((item, index) => (
                <Card key={index} className="p-6">
                  <h3 className="text-xl font-semibold mb-4 text-slate-900">{item.title}</h3>
                  <p className="text-slate-700 mb-4">{item.description}</p>
                  <div className="space-y-2">
                    {item.actions.map((action, actionIndex) => (
                      <div key={actionIndex} className="flex items-start gap-2 text-sm">
                        <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-slate-700">{action}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Market Opportunity Quantification */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center text-slate-900">Market Opportunity Quantification</h2>

            <div className="grid lg:grid-cols-2 gap-8">
              <Card className="p-8 border-l-4 border-l-green-600">
                <h3 className="text-2xl font-semibold mb-4 text-green-700">Immediate Opportunities</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-700">Bourbon enthusiasts seeking alternatives</span>
                    <Badge className="bg-green-600">High Priority</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-700">International markets avoiding tariffs</span>
                    <Badge className="bg-green-600">High Priority</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-700">Premium segment price-conscious consumers</span>
                    <Badge variant="secondary">Medium Priority</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-700">Younger demographics seeking authenticity</span>
                    <Badge variant="secondary">Medium Priority</Badge>
                  </div>
                </div>
              </Card>

              <Card className="p-8 border-l-4 border-l-blue-600">
                <h3 className="text-2xl font-semibold mb-4 text-blue-700">Success Metrics</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-slate-700">Market Share Growth Target</span>
                      <span className="text-sm font-medium">+15%</span>
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-slate-700">Brand Perception Improvement</span>
                      <span className="text-sm font-medium">+20%</span>
                    </div>
                    <Progress value={60} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-slate-700">Premium Pricing Power</span>
                      <span className="text-sm font-medium">+25%</span>
                    </div>
                    <Progress value={80} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-slate-700">International Expansion</span>
                      <span className="text-sm font-medium">+30%</span>
                    </div>
                    <Progress value={45} className="h-2" />
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Seize the Strategic Moment</h2>
            <p className="text-xl text-slate-300 mb-8 leading-relaxed">
              The convergence of bourbon industry challenges and Crown Royal's exceptional brand strength creates a
              once-in-a-generation opportunity to establish Canadian whisky as the premium alternative of choice for
              discerning consumers worldwide.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="bg-amber-600 hover:bg-amber-700 text-white" asChild>
                <Link href="/recommendations">View Implementation Strategy</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-black hover:bg-white hover:text-slate-900"
                asChild
              >
                <Link href="/competitive-analysis">Competitive Analysis</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
