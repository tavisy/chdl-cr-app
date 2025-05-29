"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Palette, MessageSquare, Package, Lightbulb, Globe } from "lucide-react"
import Link from "next/link"

export default function Recommendations() {
  const visualIdentityRecs = [
    {
      category: "Bottle Shape",
      recommendation:
        "Evolve to more substantial and commanding design, akin to premium bourbon bottles, but with distinctly Canadian elegance",
      details:
        "Consider heavier glass, pronounced shoulder or thicker base, wider base for stability and taller, elegant neck",
    },
    {
      category: "Label Design",
      recommendation: "Move away from busy, gold-heavy design towards refined, minimalist aesthetic",
      details:
        "Modern serif font for brand name, clean sans-serif for secondary info. Deep forest greens, charcoal grays, icy blues, warm copper accents",
    },
    {
      category: "Logo Redesign",
      recommendation: "Reinterpret crown element to be more modern and sophisticated",
      details:
        "Simplified, stylized crown with cleaner lines, more abstract geometric form, integrated into shield or minimalist emblem",
    },
    {
      category: "Closure",
      recommendation: "Upgrade from screw cap to premium, weighty cork or high-quality synthetic stopper",
      details:
        "Substantial feel, possibly topped with metal or wood cap integrating new logo for enhanced unboxing experience",
    },
  ]

  const messagingRecs = [
    {
      tagline: "Crown Royal: The Canadian Art of Whiskey",
      focus: "Elevates Canadian whisky as an art form, emphasizing craftsmanship",
    },
    {
      tagline: "Crown Royal: Forged in the North. Refined by Hand",
      focus: "Highlights unique climate influence and human craftsmanship, appealing to rugged authenticity",
    },
    {
      tagline: "Crown Royal: Discover the Depths of Canadian Character",
      focus: "Invites exploration, promises complexity, and links to nuanced Canadian identity",
    },
    {
      tagline: "Crown Royal: A Legacy of Smooth. A Future of Flavor",
      focus: "Acknowledges current positive perception while promising evolving complexity",
    },
  ]

  const productInnovations = [
    {
      innovation: "Higher Proof Expressions",
      description:
        "Introduce more readily available cask-strength or higher-proof (90-100 proof) versions beyond Hand Selected Barrel",
      impact: "Directly addresses key preference of bourbon enthusiasts and signals commitment to robust flavor",
    },
    {
      innovation: "New Age Statements",
      description:
        "Launch limited editions with longer age statements (15-year, 20-year) to showcase depth and complexity",
      impact: "Appeals to collectors and premiumization seekers, demonstrates Canadian aging capabilities",
    },
    {
      innovation: "Unique Mash Bills/Grain Focus",
      description:
        "Experiment with small-batch releases highlighting specific Canadian grain profiles (100% Canadian rye, unique wheat whisky)",
      impact: "Offers distinct flavor profiles that differentiate from traditional bourbons",
    },
    {
      innovation: "Innovative Cask Finishes",
      description:
        "Explore limited editions finished in different barrel types (Canadian ice wine casks, maple syrup barrels, unique Canadian wood)",
      impact: "Adds complexity and novelty following bourbon trends while emphasizing Canadian terroir",
    },
  ]

  const implementationPhases = [
    {
      phase: "Phase 1: Strategic Alignment & Creative Development",
      timeline: "0-6 months",
      tasks: [
        "Finalize new brand positioning and messaging based on recommended creative territories",
        "Initiate comprehensive packaging redesign and logo evolution",
        "Develop detailed product innovation roadmap",
        "Craft transparent communication strategy to address 'additives' misconception",
        "Begin content creation for digital platforms",
      ],
    },
    {
      phase: "Phase 2: Product & Market Preparation",
      timeline: "6-12 months",
      tasks: [
        "Launch initial product innovations under refreshed visual identity",
        "Roll out new packaging across key SKUs",
        "Develop comprehensive digital marketing campaigns",
        "Plan and pilot experiential marketing events",
        "Educate trade partners on new brand narrative",
      ],
    },
    {
      phase: "Phase 3: Full Market Launch & Sustained Engagement",
      timeline: "12+ months",
      tasks: [
        "Execute full-scale brand refresh launch across all channels",
        "Monitor market reception and consumer sentiment",
        "Iterate on marketing campaigns based on data-driven feedback",
        "Expand distillery tourism initiatives",
        "Sustain efforts to elevate Canadian whisky category perception",
      ],
    },
  ]

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
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Strategic Recommendations</h1>
          <p className="text-xl text-slate-300 max-w-3xl">
            Comprehensive recommendations for Crown Royal's visual identity refresh, branding strategy, and market
            positioning
          </p>
        </div>
      </div>

      {/* Key Strategic Takeaways */}
      <section className="py-20 bg-gradient-to-br from-purple-900 via-slate-900 to-indigo-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=800&width=1200&query=abstract+geometric+pattern')] opacity-10"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-amber-400 to-purple-400 bg-clip-text text-transparent">
                Strategic Imperatives for Market Leadership
              </h2>
              <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                Three transformative strategies to authentically leverage Canadian identity during spirits market
                disruption
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Slide 1: Authenticity from the North */}
              <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-amber-500/20 p-8 relative overflow-hidden group hover:scale-105 transition-transform duration-300">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-400/20 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg flex items-center justify-center">
                      <span className="text-2xl font-bold text-slate-900">1</span>
                    </div>
                    <h3 className="text-2xl font-bold text-amber-400">AUTHENTICITY FROM THE NORTH</h3>
                  </div>

                  <div className="space-y-6">
                    <div className="border-l-4 border-amber-400 pl-4">
                      <h4 className="font-semibold text-white mb-2">
                        Reclaim "Royal": Emphasize Excellence, Not Just History
                      </h4>
                      <p className="text-sm text-slate-300">
                        Position the "royal" narrative as a legacy of Canadian excellence, attention to detail, and
                        craftsmanship, fit for discerning palates, rather than outdated pomp.
                      </p>
                    </div>

                    <div className="border-l-4 border-purple-400 pl-4">
                      <h4 className="font-semibold text-white mb-2">
                        Blending is Mastery: Showcase the Art, Not the Compromise
                      </h4>
                      <p className="text-sm text-slate-300">
                        Elevate the meticulous blending of 50 distinct whiskies as a sophisticated Canadian art form,
                        highlighting master blenders' expertise and intricate craftsmanship.
                      </p>
                    </div>

                    <div className="border-l-4 border-blue-400 pl-4">
                      <h4 className="font-semibold text-white mb-2">Be Transparent: Debunk Myths, Build Trust</h4>
                      <p className="text-sm text-slate-300">
                        Directly address misconceptions about Canadian whisky by transparently communicating natural
                        ingredients and the authentic blending process.
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Slide 2: Canadian Terroir & Craftsmanship */}
              <Card className="bg-gradient-to-br from-emerald-800 to-slate-900 border-emerald-500/20 p-8 relative overflow-hidden group hover:scale-105 transition-transform duration-300">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-400/20 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg flex items-center justify-center">
                      <span className="text-2xl font-bold text-slate-900">2</span>
                    </div>
                    <h3 className="text-2xl font-bold text-emerald-400">CANADIAN TERROIR & CRAFTSMANSHIP</h3>
                  </div>

                  <div className="space-y-6">
                    <div className="border-l-4 border-emerald-400 pl-4">
                      <h4 className="font-semibold text-white mb-2">
                        Let the Climate Shape the Spirit: Highlight Unique Aging
                      </h4>
                      <p className="text-sm text-slate-300">
                        Emphasize dynamic aging in Gimli, Manitoba, where extreme seasonal temperature swings accelerate
                        flavor development with characteristics that cannot be replicated elsewhere.
                      </p>
                    </div>

                    <div className="border-l-4 border-cyan-400 pl-4">
                      <h4 className="font-semibold text-white mb-2">
                        Water Matters: Connect to Pristine Canadian Sources
                      </h4>
                      <p className="text-sm text-slate-300">
                        Promote the purity and unique mineral profile of water from Lake Winnipeg, naturally filtered
                        through limestone as foundational to Crown Royal's signature smoothness.
                      </p>
                    </div>

                    <div className="border-l-4 border-teal-400 pl-4">
                      <h4 className="font-semibold text-white mb-2">
                        Innovate with Purpose: Canadian Grains, Unique Finishes
                      </h4>
                      <p className="text-sm text-slate-300">
                        Highlight resilient Canadian grains and experiment with small-batch releases featuring unique
                        grain profiles or innovative cask finishes like Canadian ice wine barrels.
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Slide 3: The Sophisticated Alternative */}
              <Card className="bg-gradient-to-br from-indigo-800 to-slate-900 border-indigo-500/20 p-8 relative overflow-hidden group hover:scale-105 transition-transform duration-300">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-400/20 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-lg flex items-center justify-center">
                      <span className="text-2xl font-bold text-slate-900">3</span>
                    </div>
                    <h3 className="text-2xl font-bold text-indigo-400">THE SOPHISTICATED ALTERNATIVE</h3>
                  </div>

                  <div className="space-y-6">
                    <div className="border-l-4 border-indigo-400 pl-4">
                      <h4 className="font-semibold text-white mb-2">Engage Bourbon Drinkers: Educate and Convert</h4>
                      <p className="text-sm text-slate-300">
                        Target bourbon enthusiasts through strategic positioning, sampling programs emphasizing aligned
                        flavor characteristics, and digital campaigns highlighting familiar taste profiles.
                      </p>
                    </div>

                    <div className="border-l-4 border-violet-400 pl-4">
                      <h4 className="font-semibold text-white mb-2">
                        Capitalize on Disruption: Be the Reliable, Premium Choice
                      </h4>
                      <p className="text-sm text-slate-300">
                        Position Crown Royal as the stable, tariff-proof choice, contrasting bourbon's supply volatility
                        and price inflation with consistent access and superior value.
                      </p>
                    </div>

                    <div className="border-l-4 border-purple-400 pl-4">
                      <h4 className="font-semibold text-white mb-2">
                        Elevate the Look: Packaging that Reflects Premium Quality
                      </h4>
                      <p className="text-sm text-slate-300">
                        Implement visual identity refresh with substantial bottles, refined labels, sophisticated
                        typography, and premium closures to signal quality without Canadian clichés.
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Strategic Impact Metrics */}
            <div className="mt-16 grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl font-bold text-slate-900">85%</span>
                </div>
                <p className="text-sm text-slate-300">Bourbon drinkers open to alternatives during shortages</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl font-bold text-slate-900">40%</span>
                </div>
                <p className="text-sm text-slate-300">
                  Premium spirits growth driven by authenticity and craftsmanship
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl font-bold text-slate-900">65%</span>
                </div>
                <p className="text-sm text-slate-300">Consumers willing to pay premium for transparent production</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl font-bold text-slate-900">3x</span>
                </div>
                <p className="text-sm text-slate-300">Market share growth potential through strategic positioning</p>
              </div>
            </div>

            {/* Call to Action */}
            <div className="mt-16 text-center">
              <div className="bg-gradient-to-r from-amber-500/20 to-purple-500/20 rounded-2xl p-8 border border-amber-500/30">
                <h3 className="text-2xl font-bold mb-4 text-white">The Strategic Imperative</h3>
                <p className="text-lg text-slate-300 max-w-4xl mx-auto leading-relaxed">
                  Crown Royal must pivot from outdated perceptions to become a compelling, premium Canadian whisky that
                  resonates with evolving bourbon enthusiasts through{" "}
                  <span className="text-amber-400 font-semibold">authentic heritage</span>,
                  <span className="text-emerald-400 font-semibold"> unique production advantages</span>, and
                  <span className="text-indigo-400 font-semibold"> sophisticated craftsmanship</span>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Separator />

      {/* Visual Identity Recommendations */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <Palette className="h-8 w-8 text-purple-600" />
              <h2 className="text-3xl font-bold text-slate-900">Visual Identity & Packaging Refresh</h2>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {visualIdentityRecs.map((item, index) => (
                <Card key={index} className="p-6">
                  <h3 className="text-xl font-semibold mb-3 text-slate-900">{item.category}</h3>
                  <p className="text-slate-700 mb-4">{item.recommendation}</p>
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <p className="text-sm text-slate-600">{item.details}</p>
                  </div>
                </Card>
              ))}
            </div>

            {/* Recommended Image: Visual mockups of new packaging designs and logo concepts */}
          </div>
        </div>
      </section>

      <Separator />

      {/* Brand Messaging */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <MessageSquare className="h-8 w-8 text-blue-600" />
              <h2 className="text-3xl font-bold text-slate-900">Brand Messaging & Taglines</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {messagingRecs.map((item, index) => (
                <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                  <h3 className="text-lg font-semibold mb-3 text-slate-900">"{item.tagline}"</h3>
                  <p className="text-slate-700">{item.focus}</p>
                  <Badge variant="outline" className="mt-3">
                    Strategic Focus
                  </Badge>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Separator />

      {/* Product Innovation */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <Package className="h-8 w-8 text-amber-600" />
              <h2 className="text-3xl font-bold text-slate-900">Product Innovation Recommendations</h2>
            </div>

            <div className="space-y-6">
              {productInnovations.map((item, index) => (
                <Card key={index} className="p-6">
                  <div className="grid lg:grid-cols-3 gap-6">
                    <div>
                      <h3 className="text-xl font-semibold mb-2 text-slate-900">{item.innovation}</h3>
                      <Badge variant="secondary">Innovation Priority</Badge>
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-700 mb-2">Description</h4>
                      <p className="text-sm text-slate-600">{item.description}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-700 mb-2">Expected Impact</h4>
                      <p className="text-sm text-slate-600">{item.impact}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Recommended Image: Product line visualization and innovation concepts */}
          </div>
        </div>
      </section>

      <Separator />

      {/* Marketing Channels */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <Lightbulb className="h-8 w-8 text-purple-600" />
              <h2 className="text-3xl font-bold text-slate-900">Marketing & Communication Channels</h2>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4 text-slate-900">Digital Marketing</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2 text-sm">
                    <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-slate-700">
                      Rich video content: "Meet the Master Blender" series, "Journey of the Grain" documentaries{" "}
                      <a
                        href="https://thewhiskeywash.com/whiskey-articles/understanding-consumer-behaviour-in-whisky-a-guide-for-the-industry/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:underline"
                      >
                        [6]
                      </a>
                    </span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-slate-700">
                      Influencer partnerships with whiskey critics and bourbon enthusiasts
                    </span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-slate-700">Enhanced e-commerce platform with exclusive online releases</span>
                  </li>
                </ul>
              </Card>

              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4 text-slate-900">Experiential Events</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2 text-sm">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-slate-700">"Taste of the North" pop-ups in key urban centers</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-slate-700">Gimli distillery experiences and whiskey tourism</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-slate-700">High-end bar partnerships for featured cocktail programs</span>
                  </li>
                </ul>
              </Card>

              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4 text-slate-900">Traditional Advertising</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2 text-sm">
                    <div className="w-2 h-2 bg-amber-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-slate-700">
                      Premium lifestyle magazines and whiskey-specific publications
                    </span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <div className="w-2 h-2 bg-amber-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-slate-700">Strategic billboards in urban areas with target consumers</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <div className="w-2 h-2 bg-amber-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-slate-700">
                      Out-of-home featuring new visual identity and compelling taglines
                    </span>
                  </li>
                </ul>
              </Card>
            </div>

            {/* Recommended Image: Marketing channel strategy diagram and campaign examples */}
          </div>
        </div>
      </section>

      {/* Canadian Identity & Brand Values */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <Globe className="h-8 w-8 text-green-600" />
              <h2 className="text-3xl font-bold text-slate-900">Leveraging Aspirational Canadian Identity</h2>
            </div>
            <p className="text-lg text-slate-600 mb-12 max-w-4xl">
              Beyond traditional Canadian clichés lies a rich tapestry of authentic, aspirational themes that can
              powerfully position Crown Royal as a modern, premium brand that resonates with evolving consumer values.
            </p>

            <div className="grid lg:grid-cols-2 gap-8 mb-12">
              <Card className="p-8 border-l-4 border-l-green-600">
                <h3 className="text-2xl font-semibold mb-4 text-slate-900">Authentic Canadian Themes</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-3 h-3 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-semibold text-slate-900">Rugged Natural Beauty</h4>
                      <p className="text-sm text-slate-700">
                        Vast wilderness and extreme climate conditions that enhance whisky aging
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-3 h-3 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-semibold text-slate-900">Innovation & Pioneering Spirit</h4>
                      <p className="text-sm text-slate-700">
                        Two centuries of Canadian whisky innovation and resourcefulness
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-3 h-3 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-semibold text-slate-900">Understated Sophistication</h4>
                      <p className="text-sm text-slate-700">
                        Quality without pretension, excellence through quiet confidence
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-3 h-3 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-semibold text-slate-900">Meticulous Craftsmanship</h4>
                      <p className="text-sm text-slate-700">Lifetime of experience in blending 50 distinct whiskies</p>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-8 border-l-4 border-l-blue-600 bg-gradient-to-br from-blue-50 to-indigo-50">
                <h3 className="text-2xl font-semibold mb-4 text-slate-900">Modern Canadian Values</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-3 h-3 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-semibold text-slate-900">Inclusivity & Diversity</h4>
                      <p className="text-sm text-slate-700">
                        Tolerance for multiculturalism and progressive social values
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-3 h-3 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-semibold text-slate-900">Welcoming Community</h4>
                      <p className="text-sm text-slate-700">Creating spaces where everyone belongs and is valued</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-3 h-3 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-semibold text-slate-900">Authentic Representation</h4>
                      <p className="text-sm text-slate-700">Genuine commitment to diverse voices and perspectives</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-3 h-3 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-semibold text-slate-900">Progressive Leadership</h4>
                      <p className="text-sm text-slate-700">Forward-thinking approach to social responsibility</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            <div className="grid lg:grid-cols-3 gap-8 mb-12">
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4 text-slate-900">Brand Values Integration</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2 text-sm">
                    <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-slate-700">Inclusive marketing campaigns featuring diverse consumers</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-slate-700">
                      Partnerships with organizations promoting diversity and inclusion
                    </span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-slate-700">Support for LGBTQ+ events and multicultural celebrations</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-slate-700">Authentic storytelling that reflects modern Canadian values</span>
                  </li>
                </ul>
              </Card>

              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4 text-slate-900">Target Consumer Appeal</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2 text-sm">
                    <div className="w-2 h-2 bg-amber-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-slate-700">Millennials and Gen Z who prioritize brand values alignment</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <div className="w-2 h-2 bg-amber-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-slate-700">Urban professionals seeking authentic, progressive brands</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <div className="w-2 h-2 bg-amber-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-slate-700">Diverse consumer base looking for inclusive representation</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <div className="w-2 h-2 bg-amber-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-slate-700">
                      Bourbon enthusiasts who value craftsmanship and social responsibility
                    </span>
                  </li>
                </ul>
              </Card>

              <Card className="p-6 border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
                <h3 className="text-xl font-semibold mb-4 text-slate-900">Strategic Impact</h3>
                <div className="space-y-3">
                  <Badge className="bg-green-600 mb-3">Modern Positioning</Badge>
                  <p className="text-sm text-slate-700 mb-4">
                    Projects a modern, welcoming image that appeals to a broad consumer base while maintaining authentic
                    Canadian heritage.
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-slate-700">Differentiates from traditional whiskey brands</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-slate-700">Builds emotional connection beyond product attributes</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-slate-700">Attracts socially conscious consumers</span>
                    </li>
                  </ul>
                </div>
              </Card>
            </div>

            <Card className="p-8 bg-gradient-to-r from-slate-900 to-slate-800 text-white">
              <h3 className="text-2xl font-semibold mb-4">Implementation Framework</h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold mb-3 text-amber-400">Value-Based Messaging</h4>
                  <p className="text-slate-300 mb-4">
                    Integrate inclusivity and diversity themes into brand communications while maintaining focus on
                    craftsmanship and quality.
                  </p>
                  <ul className="space-y-1 text-sm text-slate-300">
                    <li>• Authentic storytelling that reflects diverse experiences</li>
                    <li>• Inclusive visual representation in marketing materials</li>
                    <li>• Community-focused event programming</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3 text-amber-400">Strategic Partnerships</h4>
                  <p className="text-slate-300 mb-4">
                    Collaborate with organizations and influencers who embody modern Canadian values and reach target
                    demographics.
                  </p>
                  <ul className="space-y-1 text-sm text-slate-300">
                    <li>• Cultural festivals and community celebrations</li>
                    <li>• Diversity-focused hospitality and culinary partnerships</li>
                    <li>• Social impact initiatives and charitable collaborations</li>
                  </ul>
                </div>
              </div>
            </Card>
            <div className="text-xs text-slate-600 mt-4">
              <a
                href="https://montecristomagazine.com/food-and-drink/new-generation-crossbreed-whiskies-challenging-tradition"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                [13] Monte Cristo Magazine
              </a>
              {" | "}
              <a
                href="https://www.castanet.net/news/Vernon/536980/Vernon-based-craft-distillery-makes-purely-Canadian-spirits"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                [12] Castanet
              </a>
            </div>

            {/* Recommended Image: Modern Canadian identity visualization and diverse community imagery */}
          </div>
        </div>
      </section>

      <Separator />

      {/* Call to Action */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-xl text-slate-300 mb-8 leading-relaxed">
              The strategic imperative is clear: Crown Royal must pivot from outdated perceptions to become a
              compelling, premium Canadian whisky that resonates with evolving bourbon enthusiasts through authentic
              heritage, unique production advantages, and sophisticated craftsmanship.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
