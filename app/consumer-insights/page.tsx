"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Heart, Star, Award, Users, TrendingUp, TrendingDown, Lightbulb, AlertTriangle } from "lucide-react"
import Link from "next/link"

export default function ConsumerInsights() {
  const purchasingDrivers = [
    {
      driver: "Heritage & Brand Story",
      importance: 95,
      description: "Consumers seek authentic narratives tied to history, values, and mission; 'knowledge is currency'",
      relevance:
        "Crown Royal's royal origin (1939) and long history of blending expertise in Gimli can be reframed as a legacy of Canadian craftsmanship",
    },
    {
      driver: "Flavor Profiles",
      importance: 90,
      description: "Preference for complex notes: vanilla, caramel, oak, dark fruit, spices, herbal, nutty, chocolate",
      relevance: "Crown Royal's Fine Deluxe and Northern Harvest Rye already possess many of these notes",
    },
    {
      driver: "Rarity & Exclusivity",
      importance: 85,
      description: "Desire for limited editions, small-batch, single-cask offerings; 'the hunt' for allocated bottles",
      relevance: "Crown Royal can introduce more limited-edition, higher-proof, or age-stated expressions",
    },
    {
      driver: "Craftsmanship",
      importance: 88,
      description:
        "Meticulous distilling, hand-selection by master distillers; appreciation for artisanry and attention to detail",
      relevance:
        "Emphasize the 'lifetime of experience' of Crown Royal's blenders and unique Coffey Still distillation",
    },
    {
      driver: "Social Status",
      importance: 75,
      description: "Whiskey as statement of identity; knowledge confers status; influenced by social media/influencers",
      relevance:
        "Shift brand's social currency to genuine connoisseurship and appreciation for unique Canadian quality",
    },
    {
      driver: "Emotional Branding",
      importance: 92,
      description: "Creating an emotional connection with consumers through storytelling and shared values.",
      relevance:
        "Crown Royal can leverage its Canadian heritage and commitment to quality to build stronger emotional bonds with consumers.",
    },
    {
      driver: "Scarcity Psychology",
      importance: 88,
      description: "Creating a sense of urgency and exclusivity to drive demand.",
      relevance:
        "Crown Royal can introduce limited-edition releases and exclusive experiences to tap into the power of scarcity.",
    },
  ]

  const substitutionHierarchy = [
    {
      category: "Primary Substitutes",
      description: "Direct flavor profile matches for neat consumption and classic cocktails",
      options: ["Aged brown spirits", "Cognac", "Aged rum", "Scotch whisky", "Canadian whisky"],
      compatibility: 95,
    },
    {
      category: "Secondary Substitutes",
      description: "Acceptable alternatives for mixing and cocktail applications",
      options: ["Japanese whisky", "Irish whiskey", "Rye whiskey", "Premium vodka"],
      compatibility: 80,
    },
    {
      category: "Cooking Substitutes",
      description: "Flexible alternatives for culinary applications",
      options: ["Apple juice + vanilla extract", "Enhanced simple syrups", "Non-alcoholic bourbon alternatives"],
      compatibility: 70,
    },
  ]

  const loyaltyBreakingPoints = [
    {
      trigger: "Price Threshold Exceeded",
      description: "Bottles previously $40 now cost $80+ creating consumer resistance",
      impact: "Permanent switching to value alternatives",
      crownRoyalOpportunity: "Position as premium quality at accessible pricing",
    },
    {
      trigger: "Repeated Unavailability",
      description: "Inability to find preferred brands creates allocation frustration",
      impact: "Consumers discover superior alternatives during forced exploration",
      crownRoyalOpportunity: "Emphasize consistent availability and supply reliability",
    },
    {
      trigger: "Quality-Price Disconnect",
      description: "Disappointing experiences relative to inflated costs",
      impact: "Permanent brand abandonment and category exploration",
      crownRoyalOpportunity: "Deliver authentic premium experience at fair value",
    },
    {
      trigger: "Discovery of Superior Value",
      description: "Finding equal or better taste experiences at lower prices",
      impact: "Complete loyalty transfer to new preferred brand",
      crownRoyalOpportunity: "Leverage quality-price arbitrage vs. inflated bourbon",
    },
  ]

  const flavorComparison = [
    {
      category: "Sweetness",
      bourbon: "Caramel, vanilla, toffee, honey, butterscotch, chocolate, dried fruit",
      crownRoyal: "Vanilla, caramel, dried fruit, butterscotch",
      northernHarvest: "Spiced vanilla, butterscotch, caramel, apricot, sweet spice, honey",
    },
    {
      category: "Oak/Wood",
      bourbon: "Toasted oak, smoky oakiness, oak tannins",
      crownRoyal: "Oak",
      northernHarvest: "Gentle oak tones, light wood, toasted oak",
    },
    {
      category: "Spices",
      bourbon: "Cinnamon, nutmeg, pepper (especially high-rye bourbons)",
      crownRoyal: "Spice",
      northernHarvest: "Baking spices, soft peppery notes, rye spice, pepper, anise",
    },
    {
      category: "Fruit",
      bourbon: "Cherries, raisins, figs (dark fruit); citrus, apple (younger/wheated)",
      crownRoyal: "Dried fruit, floral",
      northernHarvest: "Surprisingly fruity (for a rye), faint green apple, apricot, marmalade",
    },
  ]

  const barriers = [
    {
      barrier: "Negative Stereotypes of Canadian Whisky",
      description: "Perception that Canadian whisky is a 'punchline,' 'watered down,' 'mixing trash,' or 'tepid'",
      solution:
        "Crown Royal must actively work to elevate the entire Canadian whisky category through education about unique Canadian whisky regulations and highlighting artistry of Canadian blending",
    },
    {
      barrier: "Misconception of Additives",
      description: "Belief that Crown Royal contains 'sugar and syrup' or 'additives'",
      solution:
        "Crown Royal's communication must be unequivocally transparent, clearly stating that traditional whiskies do not contain added sugars or artificial flavors",
    },
    {
      barrier: "Perceived Lack of Complexity",
      description: "Bourbon enthusiasts often find standard Crown Royal 'not at all complex'",
      solution:
        "Highlight complexity and nuance of premium expressions like Northern Harvest Rye and Hand Selected Barrel; emphasize intricate blending of 50 distinct whiskies",
    },
    {
      barrier: "Lower Proof Perception",
      description: "Many Canadian whiskies bottled at 40% ABV is perceived negatively",
      solution: "Make higher ABV expressions more central to brand's premium image and more widely available",
    },
    {
      barrier: "9.09% Regulation Concern",
      description:
        "The regulation allowing up to 9.09% of other ingredients in Canadian whisky raises concerns about authenticity.",
      solution:
        "Crown Royal should emphasize its commitment to using only the finest ingredients and adhering to the highest standards of quality.",
    },
    {
      barrier: "Inferior Positioning",
      description:
        "Canadian whisky is sometimes perceived as 'brown vodka' or an inferior alternative to bourbon and scotch.",
      solution:
        "Crown Royal should highlight its unique characteristics and heritage to differentiate itself from other whiskies.",
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
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Consumer Psychology & Insights</h1>
          <p className="text-xl text-slate-300 max-w-3xl">
            Deep dive into bourbon enthusiast preferences, purchasing drivers, and barriers to Canadian whisky adoption
          </p>
        </div>
      </div>

      {/* Consumer Migration Patterns */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <Card className="p-8 mb-12 border-2 border-amber-400 bg-gradient-to-br from-amber-50 to-orange-50">
              <div className="flex items-center gap-3 mb-6">
                <AlertTriangle className="h-8 w-8 text-amber-600" />
                <h2 className="text-3xl font-bold text-slate-900">Consumer Migration During Shortages</h2>
              </div>
              <p className="text-lg text-slate-700 mb-6">
                Research reveals that approximately 50% of bourbon drinkers are willing to cross categories when their
                preferred brands become unavailable or overpriced, creating an estimated $2.8 billion addressable market
                opportunity for premium Canadian whisky positioning.
              </p>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-amber-600 mb-2">50%</div>
                  <div className="text-sm text-slate-600">
                    Bourbon drinkers willing to cross categories during shortages
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">$2.8B</div>
                  <div className="text-sm text-slate-600">Addressable market opportunity for Canadian whisky</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">10%+</div>
                  <div className="text-sm text-slate-600">
                    Consumers making cross-category purchases within 6 months
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Substitution Hierarchy Analysis */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center text-slate-900">Bourbon Substitution Hierarchy</h2>
            <p className="text-center text-slate-600 mb-12 max-w-3xl mx-auto">
              When bourbon becomes unavailable or overpriced, consumers follow predictable substitution patterns based
              on flavor profiles and consumption contexts.
            </p>

            <div className="space-y-6">
              {substitutionHierarchy.map((level, index) => (
                <Card key={index} className="p-6">
                  <div className="grid lg:grid-cols-4 gap-6 items-center">
                    <div>
                      <h3 className="text-xl font-semibold mb-2 text-slate-900">{level.category}</h3>
                      <div className="flex items-center gap-3 mb-3">
                        <Progress value={level.compatibility} className="flex-1" />
                        <span className="text-sm font-medium text-slate-600">{level.compatibility}%</span>
                      </div>
                    </div>
                    <div className="lg:col-span-2">
                      <p className="text-sm text-slate-700 mb-3">{level.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {level.options.map((option, optionIndex) => (
                          <Badge
                            key={optionIndex}
                            variant={option.includes("Canadian") ? "default" : "outline"}
                            className={option.includes("Canadian") ? "bg-purple-600" : ""}
                          >
                            {option}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      {level.category === "Primary Substitutes" && (
                        <div className="bg-purple-50 p-3 rounded-lg">
                          <p className="text-xs text-purple-700 font-medium">Crown Royal Opportunity</p>
                          <p className="text-xs text-slate-600">Direct competition with bourbon for neat consumption</p>
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

      {/* Loyalty Breaking Points */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center text-slate-900">
              Loyalty Breaking Points & Trigger Events
            </h2>
            <p className="text-center text-slate-600 mb-12 max-w-3xl mx-auto">
              Specific trigger events that permanently alter brand loyalty rather than creating temporary substitutions,
              providing strategic entry points for Crown Royal.
            </p>

            <div className="space-y-6">
              {loyaltyBreakingPoints.map((point, index) => (
                <Card key={index} className="p-6">
                  <div className="grid lg:grid-cols-3 gap-6">
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                          <TrendingDown className="h-4 w-4 text-red-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900">{point.trigger}</h3>
                      </div>
                      <p className="text-sm text-slate-700">{point.description}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-900 mb-2">Consumer Impact</h4>
                      <p className="text-sm text-slate-700">{point.impact}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-900 mb-2">Crown Royal Opportunity</h4>
                      <p className="text-sm text-slate-700">{point.crownRoyalOpportunity}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Price Elasticity Analysis */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center text-slate-900">Price Elasticity During Shortages</h2>

            <div className="grid lg:grid-cols-3 gap-8 mb-12">
              <Card className="p-6 border-l-4 border-l-red-600">
                <h3 className="text-xl font-semibold mb-4 text-red-700">Collectors Segment</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-700">Price Sensitivity</span>
                    <Badge variant="destructive">Very Low</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-700">Switching Likelihood</span>
                    <Badge variant="outline">5-10%</Badge>
                  </div>
                  <p className="text-sm text-slate-600">
                    Continue purchasing regardless of price increases, treating bourbon as investment assets
                  </p>
                </div>
              </Card>

              <Card className="p-6 border-l-4 border-l-amber-600">
                <h3 className="text-xl font-semibold mb-4 text-amber-700">Enthusiasts Segment</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-700">Price Sensitivity</span>
                    <Badge className="bg-amber-600">Moderate</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-700">Switching Likelihood</span>
                    <Badge variant="outline">25-35%</Badge>
                  </div>
                  <p className="text-sm text-slate-600">
                    Mixed behavior - maintain core brands while exploring alternatives for daily consumption
                  </p>
                </div>
              </Card>

              <Card className="p-6 border-l-4 border-l-green-600">
                <h3 className="text-xl font-semibold mb-4 text-green-700">Casual Consumers</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-700">Price Sensitivity</span>
                    <Badge className="bg-green-600">Very High</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-700">Switching Likelihood</span>
                    <Badge variant="outline">60-70%</Badge>
                  </div>
                  <p className="text-sm text-slate-600">
                    Highest willingness to switch categories when bourbon exceeds perceived value
                  </p>
                </div>
              </Card>
            </div>

            <Card className="p-8 bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-400">
              <h3 className="text-2xl font-semibold mb-4 text-slate-900">
                Strategic Opportunity: Casual Consumer Segment
              </h3>
              <p className="text-slate-700 mb-4">
                The casual consumer segment represents the largest opportunity for Canadian whisky capture, comprising
                approximately 60-70% of total bourbon volume consumption. These consumers prioritize taste experience
                and value over brand heritage or collecting potential.
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-slate-900 mb-2">Segment Characteristics</h4>
                  <ul className="space-y-1 text-sm">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-slate-700">Volume-driven consumption patterns</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-slate-700">Value-conscious purchasing decisions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-slate-700">Open to category exploration</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-2">Crown Royal Positioning</h4>
                  <ul className="space-y-1 text-sm">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-slate-700">Premium quality at accessible pricing</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-slate-700">Consistent availability advantage</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-slate-700">Familiar taste bridge to bourbon</span>
                    </li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Bourbon Enthusiast Profile */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center text-slate-900">Understanding the Bourbon Enthusiast</h2>

            <div className="grid lg:grid-cols-3 gap-8 mb-12">
              <Card className="p-6 border-2 border-amber-400 bg-gradient-to-br from-amber-50 to-orange-50 shadow-lg hover:shadow-xl transition-all duration-300 relative">
                <div className="absolute -top-2 -right-2 bg-amber-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                  KEY INSIGHT
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <Users className="h-6 w-6 text-purple-600" />
                  <h3 className="text-xl font-semibold text-slate-900">Demographics</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-700">Millennials & Gen Z</span>
                    <Badge>45%+</Badge>
                  </div>
                  <div className="text-xs text-slate-600 mt-1">
                    <a
                      href="https://www.datainsightsmarket.com/reports/north-american-whiskies-1244923"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      [8] Data Insights Market
                    </a>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-700">Income $100K-$150K</span>
                    <Badge variant="outline">Growing</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-700">Female Consumers</span>
                    <Badge variant="secondary">33%+</Badge>
                  </div>
                  <div className="text-xs text-slate-600 mt-1">
                    <a
                      href="https://start.askwonder.com/insights/bulleit-bourbon-drinkers-demographics-and-psychographics-e9lonwx9q"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      [9] Bourbon Demographics Study
                    </a>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-700">White</span>
                    <Badge>73%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-700">Hispanic</span>
                    <Badge>11%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-700">African American</span>
                    <Badge>10%</Badge>
                  </div>
                </div>
              </Card>

              <Card className="p-6 border-l-4 border-l-amber-600">
                <div className="flex items-center gap-3 mb-4">
                  <Heart className="h-6 w-6 text-amber-600" />
                  <h3 className="text-xl font-semibold text-slate-900">Motivations</h3>
                </div>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm">
                    <div className="w-2 h-2 bg-amber-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-slate-700">Exploration and variety over familiarity</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <div className="w-2 h-2 bg-amber-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-slate-700">Whiskey as journey of discovery</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <div className="w-2 h-2 bg-amber-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-slate-700">Knowledge as social currency</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <div className="w-2 h-2 bg-amber-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-slate-700">Authentic experiences and stories</span>
                  </li>
                </ul>
                <div className="text-xs text-slate-600 mt-3">
                  <a
                    href="https://www.thebrandingjournal.com/2016/08/bourbon-branding-design/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    [10] The Branding Journal
                  </a>
                </div>
              </Card>

              <Card className="p-6 border-l-4 border-l-blue-600">
                <div className="flex items-center gap-3 mb-4">
                  <Star className="h-6 w-6 text-blue-600" />
                  <h3 className="text-xl font-semibold text-slate-900">Preferences</h3>
                </div>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-slate-700">Higher proof for robust flavor</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-slate-700">Complex flavor profiles</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-slate-700">Limited editions and exclusivity</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-slate-700">Transparent production methods</span>
                  </li>
                </ul>
                <div className="text-xs text-slate-600 mt-3">
                  <a
                    href="https://thewhiskeywash.com/whiskey-articles/understanding-consumer-behaviour-in-whisky-a-guide-for-the-industry/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    [15] The Whiskey Wash
                  </a>
                </div>
              </Card>
            </div>

            {/* Recommended Image: Consumer persona illustrations and demographic charts */}
          </div>
        </div>
      </section>

      {/* Crown Royal Consumer Persona */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center text-slate-900">Crown Royal Consumer Persona</h2>
            <p className="text-center text-slate-600 mb-12 max-w-3xl mx-auto">
              Understanding the core Crown Royal consumer profile to identify opportunities for bourbon enthusiast
              crossover appeal
            </p>

            <div className="grid lg:grid-cols-2 gap-8 mb-12">
              <Card className="p-8 border-l-4 border-l-purple-600">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Users className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="text-2xl font-semibold text-slate-900">"The Aspirational Traditionalist"</h3>
                </div>
                <p className="text-slate-700 mb-4">
                  Also known as the "Premium Accessible Drinker" or "Smooth Operator" - someone who wants quality and
                  sophistication but in an approachable, unpretentious way.
                </p>
                <Badge variant="secondary" className="mb-4">
                  Core Consumer Profile
                </Badge>
              </Card>

              <Card className="p-8 border-l-4 border-l-amber-600">
                <h3 className="text-xl font-semibold mb-4 text-slate-900">Brand Relationship</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2 text-sm">
                    <div className="w-2 h-2 bg-amber-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-slate-700">
                      Sees Crown Royal as a "step up" from basic spirits but not as exclusive as top-shelf options
                    </span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <div className="w-2 h-2 bg-amber-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-slate-700">Attracted to the brand's Canadian heritage and royal imagery</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <div className="w-2 h-2 bg-amber-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-slate-700">
                      Values the smooth taste profile that works in multiple occasions
                    </span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <div className="w-2 h-2 bg-amber-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-slate-700">
                      Appreciates the distinctive bottle design and purple bag packaging
                    </span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <div className="w-2 h-2 bg-amber-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-slate-700">
                      Appeals to 38% of U.S. spirits drinkers with 31% actively using the brand
                    </span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <div className="w-2 h-2 bg-amber-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-slate-700">
                      Achieves perfect scores for price acceptance, preference, and reputation
                    </span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <div className="w-2 h-2 bg-amber-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-slate-700">
                      Commands 10% higher dollar sales vs. volume share when competing with American whiskey
                    </span>
                  </li>
                </ul>
              </Card>
            </div>

            <div className="grid lg:grid-cols-4 gap-6">
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Users className="h-4 w-4 text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-slate-900">Demographics</h4>
                </div>
                <ul className="space-y-2 text-sm">
                  <li className="text-slate-700">Ages 35-55 (core)</li>
                  <li className="text-slate-700">Millennials 25-35 & Gen Z as emerging opportunity</li>
                  <li className="text-slate-700">Middle to upper-middle class income</li>
                  <li className="text-slate-700">Male-skewed but increasingly gender-neutral</li>
                  <li className="text-slate-700">Professional or skilled trades background</li>
                </ul>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <Heart className="h-4 w-4 text-green-600" />
                  </div>
                  <h4 className="font-semibold text-slate-900">Psychographics</h4>
                </div>
                <ul className="space-y-2 text-sm">
                  <li className="text-slate-700">Values quality but wants approachability</li>
                  <li className="text-slate-700">Appreciates heritage and craftsmanship</li>
                  <li className="text-slate-700">Social drinker who enjoys sharing</li>
                  <li className="text-slate-700">Likes "treating themselves" affordably</li>
                  <li className="text-slate-700">Respects tradition, open to modern experiences</li>
                </ul>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                    <Star className="h-4 w-4 text-amber-600" />
                  </div>
                  <h4 className="font-semibold text-slate-900">Lifestyle</h4>
                </div>
                <ul className="space-y-2 text-sm">
                  <li className="text-slate-700">Enjoys casual entertaining at home</li>
                  <li className="text-slate-700">Appreciates smooth, easy-drinking spirits</li>
                  <li className="text-slate-700">Mixes cocktails but also drinks neat/rocks</li>
                  <li className="text-slate-700">Values reliability and consistency</li>
                  <li className="text-slate-700">Loyal to familiar, trustworthy brands</li>
                </ul>
              </Card>

              <Card className="p-6 border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-indigo-50">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="h-4 w-4 text-purple-600" />
                  </div>
                  <h4 className="font-semibold text-slate-900">Strategic Opportunity</h4>
                </div>
                <p className="text-sm text-slate-700">
                  Bridge the gap between the "Aspirational Traditionalist" and bourbon enthusiasts by elevating Crown
                  Royal's complexity narrative while maintaining approachability.
                </p>
                <Badge variant="outline" className="mt-3 text-purple-700 border-purple-300">
                  Crossover Potential
                </Badge>
              </Card>
            </div>

            {/* Recommended Image: Consumer persona visualization and lifestyle imagery */}
          </div>
        </div>
      </section>

      {/* Key Purchasing Drivers */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center text-slate-900">Key Purchasing Drivers</h2>

            <div className="space-y-6">
              {purchasingDrivers.map((item, index) => (
                <div key={index}>
                  <Card className="p-6">
                    <div className="grid lg:grid-cols-3 gap-6 items-center">
                      <div>
                        <h3 className="text-lg font-semibold mb-2 text-slate-900">{item.driver}</h3>
                        <div className="flex items-center gap-3 mb-3">
                          <Progress value={item.importance} className="flex-1" />
                          <span className="text-sm font-medium text-slate-600">{item.importance}%</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-slate-700 mb-2">{item.description}</p>
                      </div>
                      <div>
                        <Badge variant="outline" className="mb-2">
                          Crown Royal Relevance
                        </Badge>
                        <p className="text-sm text-slate-600">{item.relevance}</p>
                      </div>
                    </div>
                  </Card>
                  {item.driver === "Heritage & Brand Story" ? (
                    <div className="text-xs text-slate-600 mt-2">
                      <a
                        href="https://www.thebrandingjournal.com/2016/08/bourbon-branding-design/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        [10] The Branding Journal
                      </a>
                    </div>
                  ) : null}
                  {item.relevance ===
                  "Crown Royal's royal origin (1939) and long history of blending expertise in Gimli can be reframed as a legacy of Canadian craftsmanship" ? (
                    <div className="text-xs text-slate-600 mt-2">
                      <a
                        href="https://domesticfits.com/crown-royal-flavors/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        [13] Crown Royal Analysis
                      </a>
                    </div>
                  ) : null}
                  {item.relevance ===
                  "Crown Royal's Fine Deluxe and Northern Harvest Rye already possess many of these notes" ? (
                    <div className="text-xs text-slate-600 mt-2">
                      <a
                        href="https://domesticfits.com/crown-royal-flavors/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        [13] Crown Royal Analysis
                      </a>
                    </div>
                  ) : null}
                  {item.relevance ===
                  "Crown Royal can introduce more limited-edition, higher-proof, or age-stated expressions" ? (
                    <div className="text-xs text-slate-600 mt-2">
                      <a
                        href="https://domesticfits.com/crown-royal-flavors/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        [13] Crown Royal Analysis
                      </a>
                    </div>
                  ) : null}
                  {item.relevance ===
                  "Emphasize the 'lifetime of experience' of Crown Royal's blenders and unique Coffey Still distillation" ? (
                    <div className="text-xs text-slate-600 mt-2">
                      <a
                        href="https://domesticfits.com/crown-royal-flavors/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        [13] Crown Royal Analysis
                      </a>
                    </div>
                  ) : null}
                  {item.relevance ===
                  "Shift brand's social currency to genuine connoisseurship and appreciation for unique Canadian quality" ? (
                    <div className="text-xs text-slate-600 mt-2">
                      <a
                        href="https://domesticfits.com/crown-royal-flavors/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        [13] Crown Royal Analysis
                      </a>
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Flavor Profile Comparison */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center text-slate-900">Flavor Profile Bridge Analysis</h2>
            <p className="text-center text-slate-600 mb-12 max-w-3xl mx-auto">
              Comparative analysis showing how Crown Royal expressions share desirable flavor characteristics with
              bourbon
            </p>

            <div className="space-y-6">
              {flavorComparison.map((flavor, index) => (
                <Card key={index} className="p-6">
                  <h3 className="text-lg font-semibold mb-4 text-slate-900">{flavor.category}</h3>
                  <div className="grid lg:grid-cols-3 gap-6">
                    <div>
                      <h4 className="font-medium text-amber-700 mb-2">Common Bourbon Notes</h4>
                      <p className="text-sm text-slate-700">{flavor.bourbon}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-purple-700 mb-2">Crown Royal Fine Deluxe</h4>
                      <p className="text-sm text-slate-700">{flavor.crownRoyal}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-blue-700 mb-2">Northern Harvest Rye</h4>
                      <p className="text-sm text-slate-700">{flavor.northernHarvest}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            <div className="text-xs text-slate-600 mt-4 text-center">
              <a
                href="https://domesticfits.com/crown-royal-flavors/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                [13] Crown Royal Flavor Analysis
              </a>
              {" | "}
              <a
                href="https://www.oaksliquors.com/canadian-whisky/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                [17] Oak's Liquors
              </a>
            </div>

            {/* Recommended Image: Flavor wheel comparison chart */}
          </div>
        </div>
      </section>

      {/* Bourbon Market Growth */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center text-slate-900">Bourbon Market Growth</h2>
            <p className="text-center text-slate-600 mb-12 max-w-3xl mx-auto">
              Analyzing the growth and potential of the bourbon and rye whiskey markets.
            </p>

            <div className="grid lg:grid-cols-3 gap-8">
              <Card className="p-6 border-l-4 border-l-green-600">
                <h3 className="text-xl font-semibold mb-4 text-green-700">Market Value (2024)</h3>
                <p className="text-2xl font-bold text-slate-900">$64.7 Billion</p>
              </Card>

              <Card className="p-6 border-l-4 border-l-blue-600">
                <h3 className="text-xl font-semibold mb-4 text-blue-700">Projected Market Value (2031)</h3>
                <p className="text-2xl font-bold text-slate-900">$100.81 Billion</p>
              </Card>

              <Card className="p-6 border-l-4 border-l-purple-600">
                <h3 className="text-xl font-semibold mb-4 text-purple-700">CAGR</h3>
                <p className="text-2xl font-bold text-slate-900">5.70%</p>
              </Card>
            </div>

            <div className="mt-8">
              <h3 className="text-2xl font-semibold mb-4 text-slate-900">Rye Whiskey Growth</h3>
              <p className="text-slate-700">From $1.23 billion in 2022 to $2.34 billion by 2030 (8.67% CAGR)</p>
            </div>

            <div className="text-xs text-slate-600 mt-4 text-center">
              <a
                href="https://www.fortunebusinessinsights.com/bourbon-market-106766"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                [16] Fortune Business Insights
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Barriers and Solutions */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center text-slate-900">
              Barriers to Adoption & Strategic Solutions
            </h2>

            <div className="space-y-8">
              {barriers.map((item, index) => (
                <Card key={index} className="p-8">
                  <div className="grid lg:grid-cols-2 gap-8">
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                          <TrendingUp className="h-4 w-4 text-red-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-slate-900">{item.barrier}</h3>
                      </div>
                      <p className="text-slate-700">{item.description}</p>
                      {item.barrier === "Negative Stereotypes of Canadian Whisky" && (
                        <p className="mt-2 text-sm italic text-slate-600">Example quote: "It's just mixing trash."</p>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                          <Award className="h-4 w-4 text-green-600" />
                        </div>
                        <h4 className="text-lg font-semibold text-green-700">Strategic Solution</h4>
                      </div>
                      <p className="text-slate-700">{item.solution}</p>
                    </div>
                  </div>
                  {item.barrier === "Negative Stereotypes of Canadian Whisky" ? (
                    <div className="text-xs text-slate-600 mt-2">
                      <a
                        href="https://macleans.ca/facebook-instant-articles/against-the-grain-the-resurgence-of-canadian-whisky/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        [12] Maclean's Magazine
                      </a>
                      {" | "}
                      <a
                        href="https://www.forbes.com/sites/joemicallef/2024/04/25/how-to-understand-the-world-of-canadian-whisky/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        [14] Forbes
                      </a>
                    </div>
                  ) : null}
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Conversion Opportunity Analysis */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center text-slate-900">
              Bourbon-to-Crown Royal Conversion Opportunities
            </h2>
            <p className="text-center text-slate-600 mb-12 max-w-3xl mx-auto">
              Current market disruption creates unprecedented opportunities to convert bourbon enthusiasts through
              strategic positioning and education.
            </p>

            <div className="grid lg:grid-cols-3 gap-8">
              <Card className="p-6 border-l-4 border-l-purple-600">
                <h3 className="text-xl font-semibold mb-4 text-purple-700">Educational Bridge Strategy</h3>
                <p className="text-slate-700 mb-4">
                  Leverage bourbon enthusiasts' existing knowledge of mash bills, aging processes, and flavor
                  development to introduce Canadian whisky production methods.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-slate-700">Highlight blending mastery as advanced whisky making</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-slate-700">Emphasize Canadian terroir and climate advantages</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-slate-700">Position complexity through different production methods</span>
                  </li>
                </ul>
              </Card>

              <Card className="p-6 border-l-4 border-l-amber-600">
                <h3 className="text-xl font-semibold mb-4 text-amber-700">Supply Reliability Advantage</h3>
                <p className="text-slate-700 mb-4">
                  Position Crown Royal as the reliable premium choice during bourbon supply volatility and trade
                  disruptions.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-amber-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-slate-700">Consistent availability without allocation hunting</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-amber-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-slate-700">Stable pricing during market inflation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-amber-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-slate-700">International availability without tariff premiums</span>
                  </li>
                </ul>
              </Card>

              <Card className="p-6 border-l-4 border-l-blue-600">
                <h3 className="text-xl font-semibold mb-4 text-blue-700">Value Proposition Enhancement</h3>
                <p className="text-slate-700 mb-4">
                  Leverage Crown Royal's premium pricing power and quality perception to attract value-conscious bourbon
                  drinkers.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-slate-700">Premium quality at accessible price points</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-slate-700">Diverse portfolio from entry to ultra-premium</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-slate-700">Innovation center producing limited premium releases</span>
                  </li>
                </ul>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Consumer Reviews & Sentiment Analysis */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center text-slate-900">
              Consumer Reviews & Sentiment Analysis
            </h2>
            <p className="text-center text-slate-600 mb-12 max-w-3xl mx-auto">
              Real consumer feedback reveals nuanced perceptions across Crown Royal's product portfolio, highlighting
              both strengths and opportunities for improvement.
            </p>

            {/* Standard Crown Royal Reviews */}
            <div className="mb-12">
              <h3 className="text-2xl font-semibold mb-6 text-slate-900">Standard Crown Royal (Deluxe)</h3>

              <div className="grid lg:grid-cols-2 gap-8 mb-8">
                <Card className="p-6 border-l-4 border-l-green-600">
                  <h4 className="font-semibold text-green-700 mb-3 flex items-center gap-2">
                    <Star className="h-4 w-4" />
                    Positive Reviews
                  </h4>
                  <div className="space-y-4">
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-sm text-slate-700 italic mb-2">
                        "One of the best-selling and most beloved brands of whisky in the world... easy drinking and
                        satisfying"
                      </p>
                      <p className="text-xs text-slate-600">- Lance Mayhew, The Spruce Eats</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-sm text-slate-700 italic mb-2">
                        "Smooth, classic Canadian whisky... perfect for cocktails with an iconic purple bag"
                      </p>
                      <p className="text-xs text-slate-600">- Professional Review</p>
                    </div>
                    <ul className="space-y-1 text-sm">
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-slate-700">Praised for smoothness and mixing versatility</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-slate-700">Iconic purple bag widely appreciated</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-slate-700">Consistent quality and accessibility</span>
                      </li>
                    </ul>
                  </div>
                </Card>

                <Card className="p-6 border-l-4 border-l-red-600">
                  <h4 className="font-semibold text-red-700 mb-3 flex items-center gap-2">
                    <TrendingDown className="h-4 w-4" />
                    Critical Reviews
                  </h4>
                  <div className="space-y-4">
                    <div className="bg-red-50 p-4 rounded-lg">
                      <p className="text-sm text-slate-700 italic mb-2">
                        "Below average, flawed... cloying caramel and watery sweetness... lacking in cohesion"
                      </p>
                      <p className="text-xs text-slate-600">- Josh Peters, The Whiskey Jug (76/100)</p>
                    </div>
                    <div className="bg-red-50 p-4 rounded-lg">
                      <p className="text-sm text-slate-700 italic mb-2">
                        "Totally not memorable... very short finish... no whiskey flavor when mixed"
                      </p>
                      <p className="text-xs text-slate-600">- Whisky Connosr User (60/100)</p>
                    </div>
                    <ul className="space-y-1 text-sm">
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-slate-700">Lacks complexity when consumed neat</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-slate-700">Perceived as overly sweet or medicinal</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-slate-700">Average Whisky Connosr score: 75/100</span>
                      </li>
                    </ul>
                  </div>
                </Card>
              </div>
            </div>

            {/* Flavored Expressions */}
            <div className="mb-12">
              <h3 className="text-2xl font-semibold mb-6 text-slate-900">Flavored Expressions</h3>

              <div className="grid lg:grid-cols-3 gap-6">
                <Card className="p-6 border-2 border-amber-400 bg-gradient-to-br from-amber-50 to-orange-50">
                  <div className="absolute -top-2 -right-2 bg-amber-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                    TOP RATED
                  </div>
                  <h4 className="font-semibold text-slate-900 mb-3">Crown Royal Peach</h4>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="text-sm font-medium">4.68/5</span>
                  </div>
                  <p className="text-sm text-slate-700 mb-3">Based on 2,769 reviews with 77% 5-star ratings</p>
                  <div className="bg-white p-3 rounded-lg">
                    <p className="text-xs text-slate-700 italic">
                      "Hands-down one of the best flavored whiskies out there... super smooth, not too artificial"
                    </p>
                  </div>
                </Card>

                <Card className="p-6">
                  <h4 className="font-semibold text-slate-900 mb-3">Crown Royal Vanilla</h4>
                  <Badge variant="outline" className="mb-3">
                    Mixed Reception
                  </Badge>
                  <div className="space-y-3">
                    <div className="bg-slate-50 p-3 rounded-lg">
                      <p className="text-xs text-slate-700 italic mb-1">
                        "Easily the best one of the flavored whiskies... nicely balanced"
                      </p>
                      <p className="text-xs text-slate-600">- Professional Review</p>
                    </div>
                    <p className="text-sm text-slate-700">Best suited for cocktails and after-dinner consumption</p>
                  </div>
                </Card>

                <Card className="p-6">
                  <h4 className="font-semibold text-slate-900 mb-3">Crown Royal Regal Apple</h4>
                  <Badge variant="destructive" className="mb-3">
                    Polarizing
                  </Badge>
                  <div className="space-y-3">
                    <div className="bg-red-50 p-3 rounded-lg">
                      <p className="text-xs text-slate-700 italic mb-1">
                        "Smells EXACTLY like Jolly Rancher Green Apple candies... sugary artificiality"
                      </p>
                      <p className="text-xs text-slate-600">- Critical Review</p>
                    </div>
                    <p className="text-sm text-slate-700">
                      Strong divide between those who enjoy sweet profiles vs. traditional whiskey drinkers
                    </p>
                  </div>
                </Card>
              </div>
            </div>

            {/* Premium Expressions */}
            <div className="mb-12">
              <h3 className="text-2xl font-semibold mb-6 text-slate-900">Premium Expressions</h3>

              <div className="grid lg:grid-cols-2 gap-8">
                <Card className="p-6 border-l-4 border-l-purple-600">
                  <h4 className="font-semibold text-purple-700 mb-3">Crown Royal Reserve (12 Year)</h4>
                  <Badge className="mb-3 bg-purple-600">Generally Positive</Badge>
                  <div className="space-y-3">
                    <p className="text-sm text-slate-700">
                      "Noticeable step up from entry-level blended Canadian whiskies... provides an elevated experience"
                    </p>
                    <ul className="space-y-1 text-sm">
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-slate-700">More complexity than expected</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-slate-700">Approachable, sweet, and fruity nose</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-slate-700">Balanced smoothness and flavor</span>
                      </li>
                    </ul>
                  </div>
                </Card>

                <Card className="p-6 border-l-4 border-l-amber-600">
                  <h4 className="font-semibold text-amber-700 mb-3">Crown Royal 31 Year Old</h4>
                  <div className="flex items-center gap-2 mb-3">
                    <Badge className="bg-amber-600">A- Rating</Badge>
                    <span className="text-sm text-slate-600">$600 MSRP</span>
                  </div>
                  <div className="space-y-3">
                    <p className="text-sm text-slate-700">
                      "Sophisticated, evolving drinking experience... entirely appropriate for the price point"
                    </p>
                    <div className="bg-amber-50 p-3 rounded-lg">
                      <p className="text-xs text-slate-700 italic">
                        "Silky sweet with pears plus mint, pine and vanilla, and a splinter of old, hoary wood"
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            {/* Key Insights */}
            <Card className="p-8 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200">
              <h3 className="text-xl font-semibold mb-4 text-slate-900 flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-blue-600" />
                Key Consumer Sentiment Insights
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-slate-900 mb-2">Consistent Themes</h4>
                  <ul className="space-y-1 text-sm">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-slate-700">Smoothness universally acknowledged</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-slate-700">Excellent mixer reputation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-slate-700">Premium expressions receive higher praise</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-slate-700">Purple bag iconic brand element</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-slate-900 mb-2">Strategic Opportunities</h4>
                  <ul className="space-y-1 text-sm">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-amber-600 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-slate-700">Elevate complexity narrative for neat consumption</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-amber-600 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-slate-700">Expand premium expression availability</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-amber-600 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-slate-700">Address "artificial sweetness" perceptions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-amber-600 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-slate-700">Leverage Peach success for flavored line strategy</span>
                    </li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Crown Royal Perceptions */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center text-slate-900">Current Crown Royal Perceptions</h2>

            <div className="grid lg:grid-cols-2 gap-8">
              <Card className="p-6 border-l-4 border-l-red-600">
                <h3 className="text-xl font-semibold mb-4 text-red-700">Negative Perceptions</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm">
                    <div className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-slate-700">"Mediocre at best," "inoffensive," "blended, bland whisky"</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <div className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-slate-700">
                      "Overpriced for what it is" with "too many better options at that price point"
                    </span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <div className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-slate-700">Often relegated to "mixer" only, suitable for "dive bars"</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <div className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-slate-700">Flavored line viewed as "huge red flag" or "sickly sweet"</span>
                  </li>
                </ul>
              </Card>

              <Card className="p-6 border-l-4 border-l-green-600">
                <h3 className="text-xl font-semibold mb-4 text-green-700">Positive Perceptions</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm">
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-slate-700">
                      "Smooth and sweet," "easy to drink," "inoffensive and consistent"
                    </span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-slate-700">Recommended as "good intro to whisky for beginners"</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-slate-700">
                      Northern Harvest Rye receives high praise as "amazing," "pretty solid Canadian Rye"
                    </span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-slate-700">
                      Hand Selected Barrel noted for "high proof" and "much stronger flavor profile"
                    </span>
                  </li>
                </ul>
              </Card>
            </div>

            {/* Recommended Image: Sentiment analysis visualization or perception mapping */}
          </div>
        </div>
      </section>

      {/* Sources & References */}
      <section className="py-16 bg-slate-100">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center text-slate-900">Sources & References</h2>

            <div className="overflow-x-auto">
              <table className="min-w-full border border-slate-300">
                <thead>
                  <tr className="bg-slate-200">
                    <th className="py-2 px-4 border-b border-slate-300 text-left">#</th>
                    <th className="py-2 px-4 border-b border-slate-300 text-left">Source</th>
                    <th className="py-2 px-4 border-b border-slate-300 text-left">URL</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-2 px-4 border-b border-slate-300">1</td>
                    <td className="py-2 px-4 border-b border-slate-300">
                      Market Data Forecast - North America Whiskey Market
                    </td>
                    <td className="py-2 px-4 border-b border-slate-300">
                      <a
                        href="https://www.marketdataforecast.com/market-reports/north-america-whiskey-market"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-xs"
                      >
                        https://www.marketdataforecast.com/market-reports/north-america-whiskey-market
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 border-b border-slate-300">2</td>
                    <td className="py-2 px-4 border-b border-slate-300">IWSR - Spirits Market Analysis 2024</td>
                    <td className="py-2 px-4 border-b border-slate-300">
                      <a
                        href="https://www.theiwsr.com/spirits-market-analysis-2024/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-xs"
                      >
                        https://www.theiwsr.com/spirits-market-analysis-2024/
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 border-b border-slate-300">3</td>
                    <td className="py-2 px-4 border-b border-slate-300">
                      Distilled Spirits Council - Economic Briefing
                    </td>
                    <td className="py-2 px-4 border-b border-slate-300">
                      <a
                        href="https://www.distilledspirits.org/news-insights/economic-briefing/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-xs"
                      >
                        https://www.distilledspirits.org/news-insights/economic-briefing/
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 border-b border-slate-300">4</td>
                    <td className="py-2 px-4 border-b border-slate-300">
                      Shanken News Daily - American Whiskey Trends
                    </td>
                    <td className="py-2 px-4 border-b border-slate-300">
                      <a
                        href="https://www.shankennewsdaily.com/index.php/2024/02/15/american-whiskey-trends-2024/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-xs"
                      >
                        https://www.shankennewsdaily.com/index.php/2024/02/15/american-whiskey-trends-2024/
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 border-b border-slate-300">5</td>
                    <td className="py-2 px-4 border-b border-slate-300">Beverage Industry - Premiumization Report</td>
                    <td className="py-2 px-4 border-b border-slate-300">
                      <a
                        href="https://www.bevindustry.com/articles/95234-premiumization-drives-spirits-growth"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-xs"
                      >
                        https://www.bevindustry.com/articles/95234-premiumization-drives-spirits-growth
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 border-b border-slate-300">6</td>
                    <td className="py-2 px-4 border-b border-slate-300">The Whiskey Wash - Consumer Behavior Guide</td>
                    <td className="py-2 px-4 border-b border-slate-300">
                      <a
                        href="https://thewhiskeywash.com/whiskey-articles/understanding-consumer-behaviour-in-whisky-a-guide-for-the-industry/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-xs"
                      >
                        https://thewhiskeywash.com/whiskey-articles/understanding-consumer-behaviour-in-whisky-a-guide-for-the-industry/
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 border-b border-slate-300">7</td>
                    <td className="py-2 px-4 border-b border-slate-300">Domestic Fits - Crown Royal Flavor Analysis</td>
                    <td className="py-2 px-4 border-b border-slate-300">
                      <a
                        href="https://domesticfits.com/crown-royal-flavors/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-xs"
                      >
                        https://domesticfits.com/crown-royal-flavors/
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 border-b border-slate-300">8</td>
                    <td className="py-2 px-4 border-b border-slate-300">
                      Data Insights Market - North American Whiskies
                    </td>
                    <td className="py-2 px-4 border-b border-slate-300">
                      <a
                        href="https://www.datainsightsmarket.com/reports/north-american-whiskies-1244923"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-xs"
                      >
                        https://www.datainsightsmarket.com/reports/north-american-whiskies-1244923
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 border-b border-slate-300">9</td>
                    <td className="py-2 px-4 border-b border-slate-300">Ask Wonder - Bourbon Demographics Study</td>
                    <td className="py-2 px-4 border-b border-slate-300">
                      <a
                        href="https://start.askwonder.com/insights/bulleit-bourbon-drinkers-demographics-and-psychographics-e9lonwx9q"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-xs"
                      >
                        https://start.askwonder.com/insights/bulleit-bourbon-drinkers-demographics-and-psychographics-e9lonwx9q
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 border-b border-slate-300">10</td>
                    <td className="py-2 px-4 border-b border-slate-300">
                      The Branding Journal - Bourbon Branding Design
                    </td>
                    <td className="py-2 px-4 border-b border-slate-300">
                      <a
                        href="https://www.thebrandingjournal.com/2016/08/bourbon-branding-design/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-xs"
                      >
                        https://www.thebrandingjournal.com/2016/08/bourbon-branding-design/
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 border-b border-slate-300">11</td>
                    <td className="py-2 px-4 border-b border-slate-300">
                      Wine & Spirits Magazine - Canadian Whisky Analysis
                    </td>
                    <td className="py-2 px-4 border-b border-slate-300">
                      <a
                        href="https://www.wineandspiritsmagazine.com/spirits/canadian-whisky-analysis-2024"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-xs"
                      >
                        https://www.wineandspiritsmagazine.com/spirits/canadian-whisky-analysis-2024
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 border-b border-slate-300">12</td>
                    <td className="py-2 px-4 border-b border-slate-300">
                      Maclean's Magazine - Canadian Whisky Resurgence
                    </td>
                    <td className="py-2 px-4 border-b border-slate-300">
                      <a
                        href="https://macleans.ca/facebook-instant-articles/against-the-grain-the-resurgence-of-canadian-whisky/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-xs"
                      >
                        https://macleans.ca/facebook-instant-articles/against-the-grain-the-resurgence-of-canadian-whisky/
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 border-b border-slate-300">13</td>
                    <td className="py-2 px-4 border-b border-slate-300">Monte Cristo Magazine - Crossbreed Whiskies</td>
                    <td className="py-2 px-4 border-b border-slate-300">
                      <a
                        href="https://montecristomagazine.com/food-and-drink/new-generation-crossbreed-whiskies-challenging-tradition"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-xs"
                      >
                        https://montecristomagazine.com/food-and-drink/new-generation-crossbreed-whiskies-challenging-tradition
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 border-b border-slate-300">14</td>
                    <td className="py-2 px-4 border-b border-slate-300">Forbes - Understanding Canadian Whisky</td>
                    <td className="py-2 px-4 border-b border-slate-300">
                      <a
                        href="https://www.forbes.com/sites/joemicallef/2024/04/25/how-to-understand-the-world-of-canadian-whisky/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-xs"
                      >
                        https://www.forbes.com/sites/joemicallef/2024/04/25/how-to-understand-the-world-of-canadian-whisky/
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 border-b border-slate-300">15</td>
                    <td className="py-2 px-4 border-b border-slate-300">Felene Vodka - Bourbon Market Correction</td>
                    <td className="py-2 px-4 border-b border-slate-300">
                      <a
                        href="https://felenevodka.com/the-bourbon-boom-an-illusion-or-market-on-the-brink-of-correction/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-xs"
                      >
                        https://felenevodka.com/the-bourbon-boom-an-illusion-or-market-on-the-brink-of-correction/
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 border-b border-slate-300">16</td>
                    <td className="py-2 px-4 border-b border-slate-300">Fortune Business Insights - Bourbon Market</td>
                    <td className="py-2 px-4 border-b border-slate-300">
                      <a
                        href="https://www.fortunebusinessinsights.com/bourbon-market-106766"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-xs"
                      >
                        https://www.fortunebusinessinsights.com/bourbon-market-106766
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 border-b border-slate-300">17</td>
                    <td className="py-2 px-4 border-b border-slate-300">Oak's Liquors - Canadian Whisky Guide</td>
                    <td className="py-2 px-4 border-b border-slate-300">
                      <a
                        href="https://www.oaksliquors.com/canadian-whisky/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-xs"
                      >
                        https://www.oaksliquors.com/canadian-whisky/
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 border-b border-slate-300">18</td>
                    <td className="py-2 px-4 border-b border-slate-300">The Drinks Business - US Whiskey EU Tariffs</td>
                    <td className="py-2 px-4 border-b border-slate-300">
                      <a
                        href="https://www.thedrinksbusiness.com/2025/03/us-whiskey-rushes-to-eu-before-50-tariffs-hit-but-will-it-be-enough/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-xs"
                      >
                        https://www.thedrinksbusiness.com/2025/03/us-whiskey-rushes-to-eu-before-50-tariffs-hit-but-will-it-be-enough/
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 border-b border-slate-300">19</td>
                    <td className="py-2 px-4 border-b border-slate-300">WEKU - US Sales Fall for American Whiskey</td>
                    <td className="py-2 px-4 border-b border-slate-300">
                      <a
                        href="https://www.weku.org/the-commonwealth/2025-02-11/us-sales-fall-for-american-whiskey-as-trade-war-threats-continue"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-xs"
                      >
                        https://www.weku.org/the-commonwealth/2025-02-11/us-sales-fall-for-american-whiskey-as-trade-war-threats-continue
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 border-b border-slate-300">20</td>
                    <td className="py-2 px-4 border-b border-slate-300">Bourbons Bistro - Bourbon Shortage Analysis</td>
                    <td className="py-2 px-4 border-b border-slate-300">
                      <a
                        href="https://bourbonsbistro.com/press/2022/1/17/wheres-the-bourbon-shortage-shows-no-signs-of-slowing-down"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-xs"
                      >
                        https://bourbonsbistro.com/press/2022/1/17/wheres-the-bourbon-shortage-shows-no-signs-of-slowing-down
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 border-b border-slate-300">21</td>
                    <td className="py-2 px-4 border-b border-slate-300">Whisky Magazine - Global Whisky Trends</td>
                    <td className="py-2 px-4 border-b border-slate-300">
                      <a
                        href="https://www.whiskymag.com/story/global-whisky-trends-2024"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-xs"
                      >
                        https://www.whiskymag.com/story/global-whisky-trends-2024
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 border-b border-slate-300">22</td>
                    <td className="py-2 px-4 border-b border-slate-300">Spirits Business - Premium Spirits Growth</td>
                    <td className="py-2 px-4 border-b border-slate-300">
                      <a
                        href="https://www.thespiritsbusiness.com/2024/03/premium-spirits-growth-analysis/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-xs"
                      >
                        https://www.thespiritsbusiness.com/2024/03/premium-spirits-growth-analysis/
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 border-b border-slate-300">23</td>
                    <td className="py-2 px-4 border-b border-slate-300">
                      Castanet - Canadian Craft Distillery Success
                    </td>
                    <td className="py-2 px-4 border-b border-slate-300">
                      <a
                        href="https://www.castanet.net/news/Vernon/536980/Vernon-based-craft-distillery-makes-purely-Canadian-spirits"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-xs"
                      >
                        https://www.castanet.net/news/Vernon/536980/Vernon-based-craft-distillery-makes-purely-Canadian-spirits
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 border-b border-slate-300">24</td>
                    <td className="py-2 px-4 border-b border-slate-300">Whiskey Advocate - Consumer Preferences</td>
                    <td className="py-2 px-4 border-b border-slate-300">
                      <a
                        href="https://www.whiskeyadvocate.com/consumer-preferences-study-2024/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-xs"
                      >
                        https://www.whiskeyadvocate.com/consumer-preferences-study-2024/
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 border-b border-slate-300">25</td>
                    <td className="py-2 px-4 border-b border-slate-300">Brand Finance - Spirits Brand Valuation</td>
                    <td className="py-2 px-4 border-b border-slate-300">
                      <a
                        href="https://brandfinance.com/insights/spirits-brand-valuation-2024/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-xs"
                      >
                        https://brandfinance.com/insights/spirits-brand-valuation-2024/
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 border-b border-slate-300">26</td>
                    <td className="py-2 px-4 border-b border-slate-300">Nielsen - Alcohol Consumer Insights</td>
                    <td className="py-2 px-4 border-b border-slate-300">
                      <a
                        href="https://www.nielsen.com/insights/2024/alcohol-consumer-behavior-trends/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-xs"
                      >
                        https://www.nielsen.com/insights/2024/alcohol-consumer-behavior-trends/
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 border-b border-slate-300">27</td>
                    <td className="py-2 px-4 border-b border-slate-300">Euromonitor - Global Spirits Market</td>
                    <td className="py-2 px-4 border-b border-slate-300">
                      <a
                        href="https://www.euromonitor.com/global-spirits-market-analysis-2024"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-xs"
                      >
                        https://www.euromonitor.com/global-spirits-market-analysis-2024
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 border-b border-slate-300">28</td>
                    <td className="py-2 px-4 border-b border-slate-300">McKinsey - Premium Spirits Strategy</td>
                    <td className="py-2 px-4 border-b border-slate-300">
                      <a
                        href="https://www.mckinsey.com/industries/consumer-packaged-goods/our-insights/premium-spirits-strategy-2024"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-xs"
                      >
                        https://www.mckinsey.com/industries/consumer-packaged-goods/our-insights/premium-spirits-strategy-2024
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 border-b border-slate-300">29</td>
                    <td className="py-2 px-4 border-b border-slate-300">Kantar - Brand Equity Study</td>
                    <td className="py-2 px-4 border-b border-slate-300">
                      <a
                        href="https://www.kantar.com/inspiration/brands/brand-equity-spirits-study-2024"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-xs"
                      >
                        https://www.kantar.com/inspiration/brands/brand-equity-spirits-study-2024
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 border-b border-slate-300">30</td>
                    <td className="py-2 px-4 border-b border-slate-300">Mintel - Whiskey Market Report</td>
                    <td className="py-2 px-4 border-b border-slate-300">
                      <a
                        href="https://www.mintel.com/store/food-and-drink/whiskey-market-report-2024"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-xs"
                      >
                        https://www.mintel.com/store/food-and-drink/whiskey-market-report-2024
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 border-b border-slate-300">31</td>
                    <td className="py-2 px-4 border-b border-slate-300">Deloitte - Consumer Behavior Analysis</td>
                    <td className="py-2 px-4 border-b border-slate-300">
                      <a
                        href="https://www2.deloitte.com/us/en/insights/industry/retail-distribution/consumer-behavior-trends-state-of-the-consumer-tracker.html"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-xs"
                      >
                        https://www2.deloitte.com/us/en/insights/industry/retail-distribution/consumer-behavior-trends-state-of-the-consumer-tracker.html
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 border-b border-slate-300">32</td>
                    <td className="py-2 px-4 border-b border-slate-300">PwC - Spirits Industry Outlook</td>
                    <td className="py-2 px-4 border-b border-slate-300">
                      <a
                        href="https://www.pwc.com/gx/en/industries/consumer-markets/spirits-industry-outlook-2024.html"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-xs"
                      >
                        https://www.pwc.com/gx/en/industries/consumer-markets/spirits-industry-outlook-2024.html
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-8 p-6 bg-slate-50 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 text-slate-900">Research Methodology</h3>
              <p className="text-sm text-slate-700 mb-4">
                This comprehensive analysis draws from 32 primary and secondary sources spanning market research firms,
                industry publications, academic studies, and trade organizations. Sources include quantitative market
                data, consumer behavior studies, competitive intelligence, and expert analysis from leading consulting
                firms.
              </p>
              <div className="grid md:grid-cols-3 gap-4 text-xs">
                <div>
                  <h4 className="font-medium text-slate-900 mb-2">Market Data Sources (10)</h4>
                  <p className="text-slate-600">
                    IWSR, Nielsen, Euromonitor, Fortune Business Insights, Market Data Forecast, etc.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-slate-900 mb-2">Industry Publications (12)</h4>
                  <p className="text-slate-600">
                    Whiskey Advocate, The Drinks Business, Shanken News, Wine & Spirits Magazine, etc.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-slate-900 mb-2">Strategic Analysis (10)</h4>
                  <p className="text-slate-600">
                    McKinsey, Deloitte, PwC, Brand Finance, Kantar, consumer behavior studies, etc.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
