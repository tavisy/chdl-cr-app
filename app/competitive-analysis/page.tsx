"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, TrendingUp, TrendingDown, Minus, ExternalLink } from "lucide-react"
import Link from "next/link"

export default function CompetitiveAnalysis() {
  const competitors = [
    {
      name: "Maker's Mark",
      category: "Bourbon",
      strengths: [
        "Uncompromising commitment to excellent bourbon",
        "Strong heritage (founders' vision)",
        "Distinctive red wax seal",
        "Sustainability focus (B Corp, Regenified certifications)",
      ],
      weaknesses: ["U.S. bourbon market decline in recent years", "Potential trade war impact"],
      opportunities: ["Global expansion plans", "Continued innovation in super-premium expressions"],
      threats: ["Market saturation", "Competition from craft and other categories", "Economic headwinds"],
    },
    {
      name: "Bulleit Bourbon",
      category: "Bourbon",
      strengths: [
        "Fastest-growing whiskeys in America",
        "Frontier mindset of relentless experimentation",
        "High-rye mash bill offers bold, spicy character",
        "Strong distribution channels",
      ],
      weaknesses: ["Vintage-style packaging (can be perceived as less modern)"],
      opportunities: [
        "Expand innovation in emerging whiskey styles",
        "Experiential marketing (AR, 3D printed bar)",
        "Partnerships with cultural creators",
      ],
      threats: ["Intense competition in bourbon/rye", "Consumer scrutiny of authenticity"],
    },
    {
      name: "Woodford Reserve",
      category: "Bourbon",
      strengths: [
        "Complex flavor profile (>200 notes)",
        "Premium branding",
        "Strong distribution",
        "Iconic bottle shape",
        "Official bourbon of Kentucky Derby",
      ],
      weaknesses: ["Consumer perception challenge in international markets (seen as low-end)"],
      opportunities: [
        "Digital storytelling to elevate brand globally",
        "Experiential marketing (airport tastings, Derby events)",
        "Luxury pillar expressions",
      ],
      threats: ["Copycat visual designs", "Economic headwinds impacting premium sales"],
    },
  ]

  const crownRoyalSWOT = {
    strengths: [
      "Market leader in Canadian whisky sales in America (>40%)",
      "Royal heritage/origin story (1939 tribute)",
      "Meticulous blending of 50 distinct whiskies for signature smoothness",
      "Unique Coffey Still distillation for Hand Selected Barrel",
      "Dedicated workers in Gimli, 'lifetime of experience'",
      "Unique aging conditions in Manitoba (harsh winters, warm summers)",
      "Use of distinctively smooth water from Lake Winnipeg",
      "Strong brand recognition/iconic purple bag",
      "Wide range of flavored whiskies",
      "Tariff-free entry into US market (post-Apr 2025)",
    ],
    weaknesses: [
      "Perceived as 'outdated' or 'old Canadian brand'",
      "Perceived as 'mediocre,' 'bland,' 'not complex' by bourbon enthusiasts",
      "Often seen as a 'mixer' only",
      "'Overpriced for what it is' by some",
      "Stereotypes about Canadian whisky (e.g., 'punchline,' 'watered down,' 'additives')",
      "Lack of strict distilling practices compared to Scotch/Irish/Bourbon (perception)",
      "Most popular Canadian brands bottle at 40% ABV, a perceived negative",
      "Packaging issues (e.g., no handle on 1.75L)",
    ],
    opportunities: [
      "Leverage tariff-free status in US over Scotch/Irish",
      "Appeal to evolving bourbon enthusiasts seeking variety, craftsmanship, story",
      "Highlight unique Canadian production methods as differentiators",
      "Develop premium, higher-proof, or age-stated expressions",
      "Engage in experiential marketing (distillery tours, tastings)",
      "Stronger e-commerce/DTC presence for premium offerings",
      "Authentic storytelling around Canadian identity",
      "Reframing flavored whiskies for specific cocktail occasions",
    ],
    threats: [
      "Strong competition from established bourbon brands with strong marketing",
      "Rise of craft distilleries offering unique products",
      "Consumer 'downtrading' or value-conscious behavior",
      "Negative stereotypes about Canadian whisky",
      "Potential for new tariffs or trade policy changes",
      "Health consciousness and low-alcohol options",
      "Competition from RTDs",
    ],
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-slate-900 text-white py-12">
        <div className="container mx-auto px-6">
          <Link href="/">
            <Button variant="ghost" className="mb-6 text-white hover:bg-slate-800">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Overview
            </Button>
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Competitive Analysis</h1>
          <p className="text-xl text-slate-300 max-w-3xl">
            Crown Royal's position within the competitive landscape spanning both Canadian Whisky and the broader North
            American whiskey market
          </p>
        </div>
      </div>

      {/* Crown Royal SWOT Analysis */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center text-slate-900">Crown Royal SWOT Analysis</h2>

            <div className="grid md:grid-cols-2 gap-8">
              <Card className="border-l-4 border-l-green-600">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-700">
                    <TrendingUp className="h-5 w-5" />
                    Strengths
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {crownRoyalSWOT.strengths.map((strength, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-slate-700">{strength}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <div className="px-6 pb-4">
                  <div className="text-xs text-slate-600">
                    <a
                      href="https://www.datainsightsmarket.com/reports/north-american-whiskies-1244923"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-blue-600 hover:underline"
                    >
                      [1] Data Insights Market <ExternalLink className="h-3 w-3" />
                    </a>
                    {" | "}
                    <a
                      href="https://domesticfits.com/crown-royal-flavors/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-blue-600 hover:underline"
                    >
                      [7] Crown Royal Analysis <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              </Card>

              <Card className="border-l-4 border-l-red-600">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-700">
                    <TrendingDown className="h-5 w-5" />
                    Weaknesses
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {crownRoyalSWOT.weaknesses.map((weakness, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <div className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-slate-700">{weakness}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-blue-600">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-700">
                    <TrendingUp className="h-5 w-5" />
                    Opportunities
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {crownRoyalSWOT.opportunities.map((opportunity, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-slate-700">{opportunity}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-amber-600">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-amber-700">
                    <Minus className="h-5 w-5" />
                    Threats
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {crownRoyalSWOT.threats.map((threat, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <div className="w-2 h-2 bg-amber-600 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-slate-700">{threat}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Market Disruption Opportunities */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center text-slate-900">
              Bourbon Market Disruption Creates Strategic Opportunity
            </h2>
            <p className="text-center text-slate-600 mb-12 max-w-3xl mx-auto">
              Current bourbon industry challenges present unprecedented opportunities for Crown Royal to capture market
              share through strategic positioning as "The Sophisticated Alternative."
            </p>

            <div className="grid lg:grid-cols-2 gap-8 mb-12">
              <Card className="p-8 border-l-4 border-l-red-600">
                <h3 className="text-2xl font-semibold mb-4 text-red-700">Bourbon Industry Challenges</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2 text-sm">
                    <div className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-slate-700">First sales decline in over 20 years (-1.3% in 2024)</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <div className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-slate-700">EU tariffs of 50% pending March 2025, threatening exports</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <div className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-slate-700">Record inventory levels creating overproduction concerns</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <div className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-slate-700">Fine whisky auction values down 50% year-over-year</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <div className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-slate-700">Generational shift toward "California sober" lifestyles</span>
                  </li>
                </ul>
              </Card>

              <Card className="p-8 border-l-4 border-l-green-600">
                <h3 className="text-2xl font-semibold mb-4 text-green-700">Crown Royal Advantages</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2 text-sm">
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-slate-700">Tariff-free access to international markets</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-slate-700">Consistent supply and availability during bourbon shortages</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-slate-700">86% brand awareness among U.S. spirits drinkers</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-slate-700">
                      Brand Strength Index of 90.7/100 - highest among Canadian brands
                    </span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-slate-700">Superior blending expertise creating complex flavor profiles</span>
                  </li>
                </ul>
              </Card>
            </div>

            <Card className="p-8 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-400">
              <h3 className="text-2xl font-semibold mb-4 text-slate-900">
                Strategic Positioning: "The Sophisticated Alternative"
              </h3>
              <p className="text-slate-700 mb-4">
                Crown Royal should position itself as delivering bourbon-level complexity and craftsmanship through
                distinctively Canadian approaches to whisky making, emphasizing superior blending techniques,
                environmental advantages in maturation, and consistent quality without supply volatility.
              </p>
              <p className="text-slate-700 mb-4">
                Domestic sales of American whiskeys dropped by 1.8% in 2024, marking a significant shift from the
                previous decade's explosive growth{" "}
                <a
                  href="https://www.weku.org/the-commonwealth/2025-02-11/us-sales-fall-for-american-whiskey-as-trade-war-threats-continue"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline"
                >
                  [19] <ExternalLink className="h-3 w-3" />
                </a>
                . This decline coincides with what industry experts characterize as a market correction rather than
                temporary shortage{" "}
                <a
                  href="https://felenevodka.com/the-bourbon-boom-an-illusion-or-market-on-the-brink-of-correction/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline"
                >
                  [15] <ExternalLink className="h-3 w-3" />
                </a>
                .
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-slate-900 mb-2">Primary Target: "Bourbon Migrants"</h4>
                  <p className="text-sm text-slate-700">
                    Existing bourbon enthusiasts seeking reliable access to premium whisky experiences during supply
                    shortages and price inflation
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-2">Secondary Target: "Premium Explorers"</h4>
                  <p className="text-sm text-slate-700">
                    Affluent consumers who appreciate luxury goods and seek unique experiences with sophisticated
                    alternatives
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Competitor Analysis */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center text-slate-900">Key Bourbon Competitors</h2>

            <div className="space-y-8">
              {competitors.map((competitor, index) => (
                <Card key={index} className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-slate-900">{competitor.name}</h3>
                    <Badge variant="outline">{competitor.category}</Badge>
                  </div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div>
                      <h4 className="font-semibold text-green-700 mb-3 flex items-center gap-2">
                        <TrendingUp className="h-4 w-4" />
                        Strengths
                      </h4>
                      <ul className="space-y-1">
                        {competitor.strengths.map((strength, idx) => (
                          <li key={idx} className="text-sm text-slate-700 flex items-start gap-2">
                            <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                            {strength}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-red-700 mb-3 flex items-center gap-2">
                        <TrendingDown className="h-4 w-4" />
                        Weaknesses
                      </h4>
                      <ul className="space-y-1">
                        {competitor.weaknesses.map((weakness, idx) => (
                          <li key={idx} className="text-sm text-slate-700 flex items-start gap-2">
                            <div className="w-1.5 h-1.5 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
                            {weakness}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-blue-700 mb-3 flex items-center gap-2">
                        <TrendingUp className="h-4 w-4" />
                        Opportunities
                      </h4>
                      <ul className="space-y-1">
                        {competitor.opportunities.map((opportunity, idx) => (
                          <li key={idx} className="text-sm text-slate-700 flex items-start gap-2">
                            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                            {opportunity}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-amber-700 mb-3 flex items-center gap-2">
                        <Minus className="h-4 w-4" />
                        Threats
                      </h4>
                      <ul className="space-y-1">
                        {competitor.threats.map((threat, idx) => (
                          <li key={idx} className="text-sm text-slate-700 flex items-start gap-2">
                            <div className="w-1.5 h-1.5 bg-amber-600 rounded-full mt-2 flex-shrink-0"></div>
                            {threat}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Recommended Image: Competitive positioning matrix or brand comparison chart */}
          </div>
        </div>
      </section>

      {/* Marketing Strategies Section */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center text-slate-900">
              Successful Bourbon Marketing Strategies
            </h2>

            <div className="grid lg:grid-cols-3 gap-8">
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4 text-slate-900">Maker's Mark</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-slate-700 mb-2">Key Messaging</h4>
                    <p className="text-sm text-slate-600">
                      "Perfectly Unreasonable" – celebrates extraordinary effort, uncompromising quality, founders'
                      vision
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-700 mb-2">Visual Elements</h4>
                    <p className="text-sm text-slate-600">
                      Cinematic hero films emphasizing craft, environment, natural elements; signature red wax seal
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-700 mb-2">Impact</h4>
                    <p className="text-sm text-slate-600">
                      Parent company revenue +6.6% FY24 H1; B Corp & Regenified Certifications
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4 text-slate-900">Bulleit Bourbon</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-slate-700 mb-2">Key Messaging</h4>
                    <p className="text-sm text-slate-600">
                      "We Aren't Made To Be Still" – emphasizes relentless experimentation, "Frontier mindset"
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-700 mb-2">Visual Elements</h4>
                    <p className="text-sm text-slate-600">
                      15-second vignettes with motifs of restlessness, movement, vibration; vintage-style packaging
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-700 mb-2">Impact</h4>
                    <p className="text-sm text-slate-600">
                      One of the fastest-growing whiskeys in America; growth attributed to bartenders and cultural
                      partners
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4 text-slate-900">Woodford Reserve</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-slate-700 mb-2">Key Messaging</h4>
                    <p className="text-sm text-slate-600">
                      "Spectacle for the Senses" – showcases bourbon as multi-sensory drinking experience
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-700 mb-2">Visual Elements</h4>
                    <p className="text-sm text-slate-600">
                      "Modern classic" bottle design; continually refined iconic shape; luxury Baccarat Edition
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-700 mb-2">Impact</h4>
                    <p className="text-sm text-slate-600">
                      Net sales +10% for 9 mo. FY25; International website traffic +26%, domestic +70%
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Recommended Image: Marketing campaign examples and brand positioning visuals */}
          </div>
        </div>
      </section>
    </div>
  )
}
