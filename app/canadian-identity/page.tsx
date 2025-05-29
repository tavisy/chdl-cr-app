"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Globe, Mountain, Droplet, Lightbulb, Leaf, Users } from "lucide-react"
import Link from "next/link"

export default function CanadianIdentity() {
  const identityThemes = [
    {
      title: "Rugged Natural Beauty",
      icon: Mountain,
      description:
        "Canada is defined by its vast wilderness, majestic Rocky Mountains, and the ancient Canadian Shield.",
      relevance:
        "The Gimli distillery in Manitoba, nestled on the shores of Lake Winnipeg, benefits from harsh Canadian winters and warm summers that create ideal aging conditions, forcing the spirit to expand and contract in oak barrels and enhancing flavor extraction.",
      color: "amber",
    },
    {
      title: "Pristine Water Sources",
      icon: Droplet,
      description: "Canada boasts some of the world's cleanest and most pristine water sources.",
      relevance:
        "The distinctively smooth water used in Crown Royal is naturally filtered through the limestone beneath Lake Winnipeg, contributing to its unique character and quality.",
      color: "blue",
    },
    {
      title: "Innovation & Pioneering Spirit",
      icon: Lightbulb,
      description: "Canada has a long history of ingenuity and resourcefulness.",
      relevance:
        "Canadian rye whisky has been produced before the country became a country, with distillers transforming Canadian-grown grain for over two centuries. Crown Royal's continued use of the rare Coffey Still for its Hand Selected Barrel exemplifies this blend of tradition and innovation.",
      color: "green",
    },
    {
      title: "Craftsmanship & Attention to Detail",
      icon: Leaf,
      description:
        "The legacy of Canadian distillers transforming raw materials into high-value products for over two centuries.",
      relevance:
        "Crown Royal's meticulous blending of 50 distinct whiskies is a testament to this attention to detail, overseen by a dedicated group of workers in Gimli who embody a lifetime of experience.",
      color: "purple",
    },
    {
      title: "Inclusivity & Diversity",
      icon: Users,
      description:
        "Canadian identity is often associated with inclusive social policy, tolerance for multiculturalism, and diversity.",
      relevance:
        "While less directly tied to the product itself, this theme can inform brand values and partnerships, projecting a modern, welcoming image that appeals to a broad consumer base.",
      color: "red",
    },
  ]

  const successfulBrands = [
    {
      name: "Lululemon Athletica",
      themes: "Understated sophistication, quality, community, wellness (Vancouver origin)",
      strategies:
        "Emphasis on experiences (free yoga classes, workshops); community-centered approach; ambassador program (local fitness instructors); high product quality; unique fabrics",
      impact:
        "Global athletic giant, 406 stores worldwide; strong brand loyalty; recognized for quality and lifestyle integration",
    },
    {
      name: "Cirque du Soleil",
      themes: "Creativity, innovation, artistic excellence, ingenuity (Quebec origin, 'Canadian icon')",
      strategies:
        "High-end market disruption (reinvented circus); immersive, other-worldly performances; focus on creativity & innovation; strong IP protection; strategic partnerships",
      impact:
        "Largest theatrical producer in the world; performances seen by >150M spectators in >300 cities; achieved revenues faster than traditional circuses",
    },
    {
      name: "Organigram Global (Cannabis)",
      themes: "'Canadian-grown, high-quality cannabis'; 'Canadian success story'",
      strategies:
        "Bold new logo/visual identity reflecting Canadian leadership & international presence; strategic international investments; expanding export partnerships; focus on high-quality product",
      impact:
        "Number one market share in Canada; growing international footprint (Australia, Germany, UK); aims to expand into US market",
    },
  ]

  const narrativePlatforms = [
    {
      title: "The Uncharted Refinement",
      subtitle: "Where Wilderness Meets Craft",
      description:
        "Crown Royal is the embodiment of Canadian ingenuity and meticulous craftsmanship, born from the raw beauty and extreme conditions of the Canadian wilderness. It's a whisky of unexpected depth and refined character, shaped by a land that demands resilience and rewards precision.",
      visualCues:
        "Striking cinematic visuals of vast, pristine Canadian landscapes juxtaposed with intimate shots of meticulous blending, the unique Coffey Still, and the hands of master blenders.",
      appeal:
        "Appeals to bourbon enthusiasts who value authenticity, craftsmanship, and a compelling brand story rooted in a unique place. It offers a sense of discovery and a 'rugged yet refined' identity.",
    },
    {
      title: "The Master's Blend",
      subtitle: "A Legacy of Canadian Artistry",
      description:
        "Crown Royal is a testament to generations of Canadian blending mastery, an intricate art form passed down through time, resulting in a whisky of unparalleled balance and sophisticated smoothness. It's the ultimate expression of Canadian ingenuity in harmonization.",
      visualCues:
        "Focus on the human element: close-ups of blenders at work, archival photos of the Gimli distillery and its early workers, subtle nods to the Coffey Still's unique history. Visualizations of the blending process as a complex symphony of flavors.",
      appeal:
        "Resonates with bourbon enthusiasts who appreciate the complexity of distillation, the artistry of blending, and the legacy of human expertise. It positions Crown Royal as a 'blended masterpiece' rather than a simple blend.",
    },
    {
      title: "The Northern Harvest",
      subtitle: "Cultivating Character from the Land",
      description:
        "Crown Royal is a whisky deeply connected to the Canadian land, drawing its distinctive character from resilient Canadian grains and the pristine, limestone-filtered waters of Lake Winnipeg. It's a taste of Canada's authentic terroir, bottled with integrity.",
      visualCues:
        "Imagery of Canadian rye fields, clear flowing water, and the vastness of Lake Winnipeg. Focus on the raw ingredients and their journey from farm to bottle. Use of natural, earthy color palettes.",
      appeal:
        "Appeals to consumers who value provenance, natural ingredients, and a 'farm-to-bottle' ethos. It directly addresses the 'additives' misconception by emphasizing natural sourcing and transparent production.",
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
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Leveraging Canadian Identity</h1>
          <p className="text-xl text-slate-300 max-w-3xl">
            How Crown Royal can authentically leverage its Canadian heritage as a competitive advantage in the premium
            whiskey market
          </p>
        </div>
      </div>

      {/* Canadian Identity Themes */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <Globe className="h-8 w-8 text-blue-600" />
              <h2 className="text-3xl font-bold text-slate-900">Nuanced Canadian Identity Themes</h2>
            </div>
            <p className="text-lg text-slate-600 mb-12 max-w-4xl">
              Beyond the well-worn clichés of maple syrup and Mounties, Canadian identity offers a rich tapestry of
              nuanced, authentic, and aspirational aspects that can be powerfully leveraged in the premium spirits
              context.
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {identityThemes.map((theme, index) => (
                <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                  <div className={`w-12 h-12 bg-${theme.color}-100 rounded-lg flex items-center justify-center mb-4`}>
                    <theme.icon className={`h-6 w-6 text-${theme.color}-600`} />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-slate-900">{theme.title}</h3>
                  <p className="text-slate-700 mb-4">{theme.description}</p>
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <Badge variant="outline" className="mb-2">
                      Crown Royal Relevance
                    </Badge>
                    <p className="text-sm text-slate-600">{theme.relevance}</p>
                  </div>
                  {theme.title === "Rugged Natural Beauty" && (
                    <div className="text-xs text-slate-600 mt-2">
                      <a
                        href="https://domesticfits.com/crown-royal-flavors/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        [7] Crown Royal Analysis
                      </a>
                    </div>
                  )}
                </Card>
              ))}
            </div>

            {/* Recommended Image: Canadian landscape photography highlighting natural elements */}
          </div>
        </div>
      </section>

      <Separator />

      {/* Successful Canadian Brands */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center text-slate-900">Successful Canadian Premium Brands</h2>
            <p className="text-lg text-slate-600 mb-12 text-center max-w-4xl mx-auto">
              Examining successful Canadian brands in other sectors provides valuable lessons on how to leverage
              national identity without resorting to clichés.
            </p>

            <div className="space-y-8">
              {successfulBrands.map((brand, index) => (
                <Card key={index} className="p-8">
                  <h3 className="text-2xl font-bold mb-6 text-slate-900">{brand.name}</h3>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <h4 className="font-semibold text-blue-700 mb-3">Canadian Identity Themes</h4>
                      <p className="text-sm text-slate-700">{brand.themes}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-green-700 mb-3">Key Marketing Strategies</h4>
                      <p className="text-sm text-slate-700">{brand.strategies}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-amber-700 mb-3">Global Impact & Recognition</h4>
                      <p className="text-sm text-slate-700">{brand.impact}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            <div className="text-xs text-slate-600 mt-4 text-center">
              <a
                href="https://www.castanet.net/news/Vernon/536980/Vernon-based-craft-distillery-makes-purely-Canadian-spirits"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                [12] Castanet - Canadian Brand Success
              </a>
              {" | "}
              <a
                href="https://montecristomagazine.com/food-and-drink/new-generation-crossbreed-whiskies-challenging-tradition"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                [13] Monte Cristo - Innovation Strategies
              </a>
            </div>

            {/* Recommended Image: Brand logos and marketing examples */}
          </div>
        </div>
      </section>

      <Separator />

      {/* Authentic Storytelling */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center text-slate-900">
              Authentic Storytelling for Crown Royal
            </h2>
            <p className="text-lg text-slate-600 mb-12 text-center max-w-4xl mx-auto">
              Three distinct creative territories that can authentically leverage Canadian identity while appealing to
              bourbon enthusiasts.
            </p>

            <div className="space-y-8">
              {narrativePlatforms.map((platform, index) => (
                <Card key={index} className="p-8">
                  <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
                    <h3 className="text-2xl font-bold text-slate-900">{platform.title}</h3>
                    <Badge variant="secondary">{platform.subtitle}</Badge>
                  </div>
                  <div className="grid lg:grid-cols-3 gap-6">
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-3">Core Message</h4>
                      <p className="text-slate-700">{platform.description}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-3">Potential Visual Cues</h4>
                      <p className="text-slate-700">{platform.visualCues}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-3">Target Consumer Appeal</h4>
                      <p className="text-slate-700">{platform.appeal}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Recommended Image: Mood boards or visual concept examples for each narrative platform */}
          </div>
        </div>
      </section>

      {/* Historical Narrative Section */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center text-slate-900">
              Reframing Crown Royal's Historical Narrative
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              <Card className="p-8">
                <h3 className="text-xl font-semibold mb-4 text-slate-900">The Royal Origin Re-contextualized</h3>
                <p className="text-slate-700 mb-4">
                  Crown Royal's inception in 1939, meticulously crafted from 50 select whiskies to commemorate the first
                  grand tour of Canada by King George VI and Queen Elizabeth, is a powerful historical anchor.
                </p>
                <p className="text-slate-700">
                  This narrative positions the brand as a "premium product from day one," originally intended as a
                  symbol of the "hardworking and genuine nature of the Canadian people".
                </p>
              </Card>

              <Card className="p-8">
                <h3 className="text-xl font-semibold mb-4 text-slate-900">From Outdated Pomp to Canadian Excellence</h3>
                <p className="text-slate-700 mb-4">
                  The opportunity lies in re-contextualizing this "royal" narrative not as outdated pomp, but as a
                  legacy of Canadian excellence, attention to detail, and a commitment to quality fit for the most
                  discerning palates.
                </p>
                <p className="text-slate-700">
                  It signifies a "crown jewel" of Canadian craftsmanship, where the "royal" aspect represents a
                  benchmark of quality and a pioneering spirit in Canadian whisky.
                </p>
              </Card>
            </div>

            {/* Recommended Image: Historical photos and modern interpretations side by side */}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Explore Strategic Recommendations</h2>
            <p className="text-xl text-slate-300 mb-8 leading-relaxed">
              Discover how Crown Royal can transform these Canadian identity insights into actionable brand strategies,
              visual identity updates, and product innovations.
            </p>
            <Button size="lg" className="bg-amber-600 hover:bg-amber-700 text-white" asChild>
              <Link href="/recommendations">View Strategic Recommendations</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
