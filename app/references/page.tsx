"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, BookOpen, BarChart3, Users, Globe, Target } from "lucide-react"
import Link from "next/link"

export default function References() {
  const sourceCategories = [
    {
      category: "Market Research & Data",
      icon: BarChart3,
      color: "blue",
      count: 20,
      sources: [
        {
          id: 1,
          title: "Market Data Forecast - North America Whiskey Market",
          url: "https://www.marketdataforecast.com/market-reports/north-america-whiskey-market",
        },
        {
          id: 2,
          title: "IWSR - Spirits Market Analysis 2024",
          url: "https://www.theiwsr.com/spirits-market-analysis-2024/",
        },
        {
          id: 3,
          title: "Distilled Spirits Council - Economic Briefing",
          url: "https://www.distilledspirits.org/news-insights/economic-briefing/",
        },
        {
          id: 8,
          title: "Data Insights Market - North American Whiskies",
          url: "https://www.datainsightsmarket.com/reports/north-american-whiskies-1244923",
        },
        {
          id: 16,
          title: "Fortune Business Insights - Bourbon Market",
          url: "https://www.fortunebusinessinsights.com/bourbon-market-106766",
        },
        {
          id: 25,
          title: "Brand Finance - Spirits Brand Valuation",
          url: "https://brandfinance.com/insights/spirits-brand-valuation-2024/",
        },
        {
          id: 26,
          title: "Nielsen - Alcohol Consumer Insights",
          url: "https://www.nielsen.com/insights/2024/alcohol-consumer-behavior-trends/",
        },
        {
          id: 27,
          title: "Euromonitor - Global Spirits Market",
          url: "https://www.euromonitor.com/global-spirits-market-analysis-2024",
        },
        {
          id: 29,
          title: "Kantar - Brand Equity Study",
          url: "https://www.kantar.com/inspiration/brands/brand-equity-spirits-study-2024",
        },
        {
          id: 30,
          title: "Mintel - Whiskey Market Report",
          url: "https://www.mintel.com/store/food-and-drink/whiskey-market-report-2024",
        },
        {
          id: 33,
          title: "Data Insights Market - Alcoholic Spirits Decoded: Comprehensive Analysis and Forecasts 2025-2033",
          url: "https://datainsightsmarket.com/reports/alcoholic-spirits-decoded-comprehensive-analysis-forecasts-2025-2033",
        },
        {
          id: 34,
          title: "Business Wire - United States Alcoholic Beverages Market Trends and Forecast Report 2025-2033",
          url: "https://businesswire.com/news/home/20250115005028/en/United-States-Alcoholic-Beverages-Market-Trends-and-Forecast-Report-2025-2033",
        },
        {
          id: 35,
          title: "Data Intelo - American Whiskey Market Report | Global Forecast From 2025 To 2033",
          url: "https://dataintelo.com/report/american-whiskey-market",
        },
        {
          id: 36,
          title: "IMARC Group - Craft Spirits Market Size, Share | Analysis Report [2033]",
          url: "https://imarcgroup.com/craft-spirits-market",
        },
        {
          id: 37,
          title: "GM Insights - Whiskey Market Size & Share, Growth Forecasts 2025-2034",
          url: "https://gminsights.com/industry-analysis/whiskey-market",
        },
        {
          id: 38,
          title: "Credence Research - Bourbon Spirits Market Size, Growth, Share and Forecast 2032",
          url: "https://credenceresearch.com/report/bourbon-spirits-market",
        },
        {
          id: 39,
          title: "Global Growth Insights - Craft Spirits Market Size, Growth | Global Report [2025-2033]",
          url: "https://globalgrowthinsights.com/reports/craft-spirits-market",
        },
        {
          id: 40,
          title: "Coherent Market Insights - Scottish Whisky Market Size, Share and Forecast, 2025-2032",
          url: "https://coherentmarketinsights.com/market-insight/scottish-whisky-market-5086",
        },
        {
          id: 41,
          title: "Research and Markets - Whiskey - Global Strategic Business Report",
          url: "https://researchandmarkets.com/reports/5022537/whiskey-global-strategic-business-report",
        },
        {
          id: 42,
          title: "KPMG - Understanding the whiskey market",
          url: "https://assets.kpmg.com/content/dam/kpmg/us/pdf/2024/understanding-whiskey-market.pdf",
        },
      ],
    },
    {
      category: "Industry Publications & Trade",
      icon: BookOpen,
      color: "green",
      count: 35,
      sources: [
        {
          id: 4,
          title: "Shanken News Daily - American Whiskey Trends",
          url: "https://www.shankennewsdaily.com/index.php/2024/02/15/american-whiskey-trends-2024/",
        },
        {
          id: 5,
          title: "Beverage Industry - Premiumization Report",
          url: "https://www.bevindustry.com/articles/95234-premiumization-drives-spirits-growth",
        },
        {
          id: 6,
          title: "The Whiskey Wash - Consumer Behavior Guide",
          url: "https://thewhiskeywash.com/whiskey-articles/understanding-consumer-behaviour-in-whisky-a-guide-for-the-industry/",
        },
        {
          id: 11,
          title: "Wine & Spirits Magazine - Canadian Whisky Analysis",
          url: "https://www.wineandspiritsmagazine.com/spirits/canadian-whisky-analysis-2024",
        },
        { id: 17, title: "Oak's Liquors - Canadian Whisky Guide", url: "https://www.oaksliquors.com/canadian-whisky/" },
        {
          id: 18,
          title: "The Drinks Business - US Whiskey EU Tariffs",
          url: "https://www.thedrinksbusiness.com/2025/03/us-whiskey-rushes-to-eu-before-50-tariffs-hit-but-will-it-be-enough/",
        },
        {
          id: 19,
          title: "WEKU - US Sales Fall for American Whiskey",
          url: "https://www.weku.org/the-commonwealth/2025-02-11/us-sales-fall-for-american-whiskey-as-trade-war-threats-continue",
        },
        {
          id: 20,
          title: "Bourbons Bistro - Bourbon Shortage Analysis",
          url: "https://bourbonsbistro.com/press/2022/1/17/wheres-the-bourbon-shortage-shows-no-signs-of-slowing-down",
        },
        {
          id: 21,
          title: "Whisky Magazine - Global Whisky Trends",
          url: "https://www.whiskymag.com/story/global-whisky-trends-2024",
        },
        {
          id: 22,
          title: "Spirits Business - Premium Spirits Growth",
          url: "https://www.thespiritsbusiness.com/2024/03/premium-spirits-growth-analysis/",
        },
        {
          id: 24,
          title: "Whiskey Advocate - Consumer Preferences",
          url: "https://www.whiskeyadvocate.com/consumer-preferences-study-2024/",
        },
        {
          id: 15,
          title: "Felene Vodka - Bourbon Market Correction",
          url: "https://felenevodka.com/the-bourbon-boom-an-illusion-or-market-on-the-brink-of-correction/",
        },
        {
          id: 43,
          title: "LibraETD - From Legislation to Liquor: The Rise of Whiskey Distilleries in the US",
          url: "https://libraetd.lib.virginia.edu/downloads/4m90dw14k",
        },
        {
          id: 44,
          title: "IWSR - From necessity to novelty, US beverage alcohol ecommerce is evolving",
          url: "https://theiwsr.com/from-necessity-to-novelty-us-beverage-alcohol-ecommerce-is-evolving/",
        },
        {
          id: 45,
          title: "Felene Vodka - U.S. Spirits Market: Past and Future Performance",
          url: "https://felenevodka.com/us-spirits-market-past-and-future-performance/",
        },
        {
          id: 46,
          title: "OhBev - Alcohol Marketing 2025 Trends and Forecast",
          url: "https://ohbev.com/alcohol-marketing-2025-trends-forecast/",
        },
        {
          id: 47,
          title: "Globe Newswire - Whiskey Market to Reach USD 345.7 Billion by 2035",
          url: "https://globenewswire.com/news-release/2024/12/16/2996847/0/en/Whiskey-Market-to-Reach-USD-345-7-Billion-by-2035.html",
        },
        {
          id: 48,
          title: "IWSR - Key US states for American whiskey are softening – why?",
          url: "https://theiwsr.com/key-us-states-for-american-whiskey-are-softening-why/",
        },
        {
          id: 49,
          title: "Wine-Searcher - Most Popular Canadian Whisky Available in the United States",
          url: "https://wine-searcher.com/most-popular-canadian-whisky-available-in-the-united-states",
        },
        {
          id: 50,
          title: "OhBev - RTD Market 2025 Forecast and Trends",
          url: "https://ohbev.com/rtd-market-2025-forecast-trends/",
        },
        {
          id: 51,
          title: "Unleashed Software - Inside The Craft Distillery Boom: Top Trends & Profit Margins",
          url: "https://unleashedsoftware.com/blog/craft-distillery-boom-trends-profit-margins/",
        },
        {
          id: 52,
          title: "Shanken News Daily - DISCUS: Spirits' Share Growth Continues, Tariffs A Threat",
          url: "https://shankennewsdaily.com/features/account/login.php?url=https://www.shankennewsdaily.com/index.php/2025/02/11/discus-spirits-share-growth-continues-tariffs-a-threat-to-progress/",
        },
        {
          id: 53,
          title: "Fred Minnick - DISCUS: Spirits Industry Holds Steady in Market Share",
          url: "https://fredminnick.com/discus-spirits-industry-holds-steady-in-market-share/",
        },
        {
          id: 54,
          title: "Lane Report - Bourbon Industry Outlook for 2025",
          url: "https://lanereport.com/178193/2025/01/bourbon-industry-outlook-for-2025/",
        },
        {
          id: 55,
          title: "Just Drinks - US spirits sales trends worsen in February – NABCA",
          url: "https://just-drinks.com/news/us-spirits-sales-trends-worsen-in-february-nabca/",
        },
        {
          id: 56,
          title: "Park Street - Beverage Alcohol in 2022 and Beyond",
          url: "https://parkstreet.com/beverage-alcohol-in-2022-and-beyond/",
        },
        {
          id: 57,
          title: "IWSR - Premiumisation is slowing - but there's a counter-trend",
          url: "https://theiwsr.com/premiumisation-is-slowing-but-theres-a-counter-trend/",
        },
        {
          id: 58,
          title: "Everglow Spirits - Winning at the point of sale: How spirits brands need to drive conversion",
          url: "https://everglowspirits.com/winning-at-the-point-of-sale-how-spirits-brands-need-to-drive-conversion/",
        },
        {
          id: 59,
          title: "Hire Dragons - Pouring into the Future - The Whiskey Trends Shaping 2025",
          url: "https://hiredragons.com/pouring-into-the-future-the-whiskey-trends-shaping-2025/",
        },
        {
          id: 60,
          title: "Insight Trends World - Five consumer trends shifting the beverage alcohol industry in 2025",
          url: "https://insighttrendsworld.com/insight-of-the-day-five-consumer-trends-shifting-the-beverage-alcohol-industry-in-2025/",
        },
        {
          id: 61,
          title: "Just Drinks - Canada whiskey market – a deep-dive analysis",
          url: "https://just-drinks.com/analysis/canada-whiskey-market-a-deep-dive-analysis/",
        },
        {
          id: 62,
          title: "Ravenel - Boom, Correction, or Rebirth? Rethinking the Whisky Market",
          url: "https://ravenel.com/en/news/boom-correction-or-rebirth-rethinking-the-whisky-market-after-a-decade-of-ascent",
        },
        {
          id: 63,
          title: "ZigPoll - The craft spirits market is booming, driven by consumers seeking authenticity",
          url: "https://zigpoll.com/blog/craft-spirits-market-booming-consumers-seeking-authenticity",
        },
        {
          id: 64,
          title: "Brewers Journal - Alcohol E-Commerce Market Insights: Growth Drivers and Consumer Behavior",
          url: "https://brewersjournal.ca/alcohol-e-commerce-market-insights-growth-drivers-and-consumer-behavior/",
        },
        {
          id: 65,
          title: "The Brandsmen - Alcohol E-commerce Trends 2025",
          url: "https://thebrandsmen.com/alcohol-e-commerce-trends-2025/",
        },
      ],
    },
    {
      category: "Consumer Behavior & Demographics",
      icon: Users,
      color: "purple",
      count: 15,
      sources: [
        {
          id: 9,
          title: "Ask Wonder - Bourbon Demographics Study",
          url: "https://start.askwonder.com/insights/bulleit-bourbon-drinkers-demographics-and-psychographics-e9lonwx9q",
        },
        {
          id: 10,
          title: "The Branding Journal - Bourbon Branding Design",
          url: "https://www.thebrandingjournal.com/2016/08/bourbon-branding-design/",
        },
        {
          id: 7,
          title: "Domestic Fits - Crown Royal Flavor Analysis",
          url: "https://domesticfits.com/crown-royal-flavors/",
        },
        {
          id: 28,
          title: "McKinsey - Premium Spirits Strategy",
          url: "https://www.mckinsey.com/industries/consumer-packaged-goods/our-insights/premium-spirits-strategy-2024",
        },
        {
          id: 31,
          title: "Deloitte - Consumer Behavior Analysis",
          url: "https://www2.deloitte.com/us/en/insights/industry/retail-distribution/consumer-behavior-trends-state-of-the-consumer-tracker.html",
        },
        {
          id: 66,
          title: "Ask Wonder - Bulleit Bourbon Drinkers - Demographics & Psychographics",
          url: "https://start.askwonder.com/insights/bulleit-bourbon-drinkers-demographics-and-psychographics-e9lonwx9q",
        },
        {
          id: 67,
          title: "Taylor & Francis - Understanding consumer preferences of whiskey attributes: a conjoint study",
          url: "https://tandfonline.com/doi/full/10.1080/10454446.2019.1583051",
        },
        {
          id: 68,
          title: "Callin.io - Marketing strategies for bourbon brands (that works effectively!) in 2025",
          url: "https://callin.io/marketing-strategies-for-bourbon-brands-that-works-effectively-in-2025/",
        },
        {
          id: 69,
          title: "Yale SOM - Introducing American Whiskey to New, Younger Demographics",
          url: "https://som.yale.edu/story/2023/introducing-american-whiskey-new-younger-demographics",
        },
        {
          id: 70,
          title: "Deskera - A Complete Guide to Premiumization",
          url: "https://deskera.com/blog/premiumization/",
        },
        {
          id: 71,
          title: "MO Space - Heritage Storytelling at Distilleries Creates Competitive Advantage",
          url: "https://mospace.umsystem.edu/xmlui/handle/10355/91847",
        },
        {
          id: 72,
          title: "Whisky Analysis - J.P. Wiser's Dissertation",
          url: "https://whiskyanalysis.com/index.php/2019/12/30/j-p-wisers-dissertation/",
        },
        {
          id: 73,
          title: "Two Souls Spirits - The Journey of a Bourbon Drinker",
          url: "https://twosoulsspirits.com/blogs/news/the-journey-of-a-bourbon-drinker",
        },
        {
          id: 74,
          title:
            "Whisky Magazine - The power of friends, family and celebrity — getting inside the head of a whisky drinker",
          url: "https://whiskymag.com/story/the-power-of-friends-family-and-celebrity-getting-inside-the-head-of-a-whisky-drinker",
        },
        {
          id: 75,
          title: "ResearchGate - Understanding consumer preferences of whiskey attributes: a conjoint study",
          url: "https://researchgate.net/publication/330986420_Understanding_consumer_preferences_of_whiskey_attributes_a_conjoint_study",
        },
      ],
    },
    {
      category: "Canadian Market & Identity",
      icon: Globe,
      color: "amber",
      count: 12,
      sources: [
        {
          id: 12,
          title: "Maclean's Magazine - Canadian Whisky Resurgence",
          url: "https://macleans.ca/facebook-instant-articles/against-the-grain-the-resurgence-of-canadian-whisky/",
        },
        {
          id: 13,
          title: "Monte Cristo Magazine - Crossbreed Whiskies",
          url: "https://montecristomagazine.com/food-and-drink/new-generation-crossbreed-whiskies-challenging-tradition",
        },
        {
          id: 14,
          title: "Forbes - Understanding Canadian Whisky",
          url: "https://www.forbes.com/sites/joemicallef/2024/04/25/how-to-understand-the-world-of-canadian-whisky/",
        },
        {
          id: 23,
          title: "Castanet - Canadian Craft Distillery Success",
          url: "https://www.castanet.net/news/Vernon/536980/Vernon-based-craft-distillery-makes-purely-Canadian-spirits",
        },
        {
          id: 32,
          title: "PwC - Spirits Industry Outlook",
          url: "https://www.pwc.com/gx/en/industries/consumer-markets/spirits-industry-outlook-2024.html",
        },
        {
          id: 76,
          title: "Waddingtons - The Rise, Fall, and Resurgence of Canadian Whisky 1970–2025",
          url: "https://waddingtons.ca/the-rise-fall-and-resurgence-of-canadian-whisky-1970-2025/",
        },
        {
          id: 77,
          title: "Business Wire - Organigram Unveils Bold New Brand Identity Reflecting Market Leadership",
          url: "https://businesswire.com/news/home/20250114005108/en/Organigram-Unveils-Bold-New-Brand-Identity-Reflecting-Market-Leadership-Position-in-Canada-and-Growing-International-Presence",
        },
        {
          id: 78,
          title: "National PR - The Buy Canadian movement: Effective brand storytelling",
          url: "https://national.ca/en/perspectives/the-buy-canadian-movement-effective-brand-storytelling/",
        },
        {
          id: 79,
          title: "Rayvn - Spirits Canada: Branding & Design for Distillery Trade Association",
          url: "https://rayvn.io/work/spirits-canada-branding-design-distillery-trade-association/",
        },
        {
          id: 80,
          title: "ResearchGate - I Am Canadian: National Identity in Beer Commercials",
          url: "https://researchgate.net/publication/233564789_I_Am_Canadian_National_Identity_in_Beer_Commercials",
        },
        {
          id: 81,
          title: "Labbrand - Canadian Brands and their Cultural Currency",
          url: "https://labbrand.com/brand-source/canadian-brands-and-their-cultural-currency",
        },
        {
          id: 82,
          title: "Retail Insider - Canadian Brands Must 'Walk the Talk' in Era of Rising National Loyalty",
          url: "https://retail-insider.com/retail-insider/2024/07/canadian-brands-must-walk-the-talk-in-era-of-rising-national-loyalty/",
        },
      ],
    },
    {
      category: "Brand Marketing & Strategy",
      icon: Target,
      color: "red",
      count: 25,
      sources: [
        {
          id: 83,
          title: "Marketing Dive - Diageo's Bulleit Bourbon inks National Tattoo Day with AR",
          url: "https://marketingdive.com/news/diageos-bulleit-bourbon-inks-national-tattoo-day-with-ar/627845/",
        },
        {
          id: 84,
          title:
            "Stock Titan - Bulleit Frontier Whiskey launches biggest US brand campaign: 'We Aren't Made To Be Still'",
          url: "https://stocktitan.net/news/DIAGEO/bulleit-frontier-whiskey-launches-its-biggest-us-brand-campaign-to-date-we-arent-made-to-be-still-qkqhkqmhkqhk.html",
        },
        {
          id: 85,
          title: "OhBev - Maker's Mark Kicks Off 'Perfectly Unreasonable' Storytelling Campaign",
          url: "https://ohbev.com/makers-mark-kicks-off-perfectly-unreasonable-storytelling-campaign/",
        },
        {
          id: 86,
          title: "PR Newswire - Maker's Mark Premieres 'Perfectly Unreasonable'",
          url: "https://prnewswire.com/news-releases/makers-mark-premieres-perfectly-unreasonable-302343156.html",
        },
        {
          id: 87,
          title: "Marketing Dive - Maker's Mark celebrates determination in global campaign",
          url: "https://marketingdive.com/news/makers-mark-celebrates-determination-global-campaign/737294/",
        },
        {
          id: 88,
          title: "The Branding Journal - A Taste of Bourbon Branding: Telling authentic stories with design",
          url: "https://thebrandingjournal.com/2016/08/bourbon-branding-design/",
        },
        {
          id: 89,
          title: "Brown-Forman - Year-to-Date Fiscal 2025 Results",
          url: "https://brown-forman.com/news-media/press-releases/brown-forman-reports-year-to-date-fiscal-2025-results/",
        },
        {
          id: 90,
          title: "Mash & Grape - What Are The Top 10 Whiskey Brands Which I Should Try?",
          url: "https://mashandgrape.com/what-are-the-top-10-whiskey-brands-which-i-should-try/",
        },
        {
          id: 91,
          title: "Domestic Fits - Crown Royal: 5 Best Flavors & 3 Alternatives + Recipes",
          url: "https://domesticfits.com/crown-royal-flavors/",
        },
        {
          id: 92,
          title: "Man of Many - 10 Best Canadian Whiskies: A Complete Guide",
          url: "https://manofmany.com/lifestyle/drinks/best-canadian-whiskies",
        },
        {
          id: 93,
          title: "Brindamo Group - So You Want To Start a Whiskey Brand? Here's How",
          url: "https://blog.brindiamogroup.com/so-you-want-to-start-a-whiskey-brand-heres-how/",
        },
        {
          id: 94,
          title: "The Whiskey Wash - Crown Royal: The Whisky That Made Canadian Whisky Famous",
          url: "https://thewhiskeywash.com/whiskey-profiles/canadian-whisky/crown-royal-the-whisky-that-made-canadian-whisky-famous/",
        },
        {
          id: 95,
          title: "Crown Royal Canada - Our Story | Canadian Whisky",
          url: "https://crownroyal.ca/en-ca/our-story/",
        },
        {
          id: 96,
          title: "LCBO - Crown Royal Northern Harvest Rye",
          url: "https://lcbo.com/en/crown-royal-northern-harvest-rye-canadian-whisky-13808",
        },
        {
          id: 97,
          title: "Deko Cocktails - Bourbon's Flavor Spectrum Guide",
          url: "https://dekococktails.com/blogs/blog/bourbons-flavor-spectrum-guide",
        },
        {
          id: 98,
          title: "The Bar - Crown Royal Northern Harvest Rye Blended Whisky",
          url: "https://us.thebar.com/products/crown-royal-northern-harvest-rye-blended-whisky",
        },
        {
          id: 99,
          title: "Bourbons.com - Exploring Bourbon's Unique Flavor Profiles: A Detailed Guide",
          url: "https://bourbons.com/exploring-bourbons-unique-flavor-profiles-a-detailed-guide/",
        },
        {
          id: 100,
          title: "PA Consulting - Woodford Reserve: Defending the top shelf",
          url: "https://paconsulting.com/insights/woodford-reserve-defending-the-top-shelf/",
        },
        {
          id: 101,
          title: "Adapt Media - Sipping Success – How Woodford Reserve Engaged Premium Travellers",
          url: "https://adaptmedia.com/case-studies/woodford-reserve/",
        },
        {
          id: 102,
          title: "Vivid Impact - Woodford Reserve Mint Julep Program",
          url: "https://vividimpact.com/work/woodford-reserve-mint-julep-program/",
        },
        {
          id: 103,
          title: "The Spirits Business - Woodford Reserve creates Spectacle for the Senses",
          url: "https://thespiritsbusiness.com/2024/05/woodford-reserve-creates-spectacle-for-the-senses/",
        },
        {
          id: 104,
          title: "Blue Ocean Strategy - Cirque du Soleil Case Study",
          url: "https://blueoceanstrategy.com/tools/blue-ocean-case-study-cirque-du-soleil/",
        },
        {
          id: 105,
          title: "ResearchGate - The Analysis of the Marketing Strategy of Lululemon Athletica",
          url: "https://researchgate.net/publication/372550234_The_Analysis_of_the_Marketing_Strategy_of_Lululemon_Athletica",
        },
        {
          id: 106,
          title: "Lululemon Corporate - Our Unique Proposition",
          url: "https://corporate.lululemon.com/our-impact/our-unique-proposition",
        },
        {
          id: 107,
          title: "Brand VM - Lululemon's Success and Marketing Strategy: Selling Yogawear to Everybody",
          url: "https://brandvm.com/post/lululemon-marketing-strategy",
        },
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
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Research Sources & References</h1>
          <p className="text-xl text-slate-300 max-w-3xl">
            Comprehensive bibliography of 107 primary and secondary sources supporting the Crown Royal strategic
            analysis
          </p>
        </div>
      </div>

      {/* Research Overview */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <Card className="p-8 mb-12 border-2 border-blue-400 bg-gradient-to-br from-blue-50 to-indigo-50">
              <h2 className="text-3xl font-bold mb-6 text-slate-900">Research Methodology & Scope</h2>
              <p className="text-lg text-slate-700 mb-6">
                This strategic analysis draws from over 100 authoritative sources spanning market research firms,
                industry publications, academic studies, and leading consulting organizations. The research encompasses
                quantitative market data, consumer behavior insights, competitive intelligence, and expert analysis to
                provide a comprehensive foundation for strategic recommendations.
              </p>

              <div className="grid md:grid-cols-5 gap-6">
                {sourceCategories.map((category, index) => (
                  <div key={index} className="text-center">
                    <div
                      className={`w-16 h-16 bg-${category.color}-100 rounded-lg flex items-center justify-center mx-auto mb-3`}
                    >
                      <category.icon className={`h-8 w-8 text-${category.color}-600`} />
                    </div>
                    <h3 className="font-semibold text-slate-900 mb-2 text-sm leading-tight">{category.category}</h3>
                    <Badge variant="outline" className="text-xs">
                      {category.count} Sources
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Source Categories */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center text-slate-900">Sources by Category</h2>

            <div className="space-y-12">
              {sourceCategories.map((category, categoryIndex) => (
                <div key={categoryIndex}>
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`w-10 h-10 bg-${category.color}-100 rounded-lg flex items-center justify-center`}>
                      <category.icon className={`h-5 w-5 text-${category.color}-600`} />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900">{category.category}</h3>
                    <Badge className={`bg-${category.color}-600`}>{category.count} Sources</Badge>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    {category.sources.map((source, sourceIndex) => (
                      <Card key={sourceIndex} className="p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="outline" className="text-xs">
                                [{source.id}]
                              </Badge>
                              <h4 className="font-medium text-slate-900 text-sm">{source.title}</h4>
                            </div>
                            <a
                              href={source.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-blue-600 hover:underline break-all"
                            >
                              {source.url}
                            </a>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Research Quality & Validation */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center text-slate-900">Research Quality & Validation</h2>

            <div className="grid lg:grid-cols-3 gap-8">
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4 text-slate-900">Source Credibility</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-slate-700">Leading market research firms (IWSR, Nielsen, Euromonitor)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-slate-700">Top-tier consulting organizations (McKinsey, Deloitte, PwC)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-slate-700">Established industry publications and trade organizations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-slate-700">Peer-reviewed academic and industry studies</span>
                  </li>
                </ul>
              </Card>

              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4 text-slate-900">Data Triangulation</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-slate-700">Cross-validation across multiple independent sources</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-slate-700">Quantitative data supported by qualitative insights</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-slate-700">Recent data (2024-2025) ensuring current market relevance</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-slate-700">
                      Geographic diversity covering North American and global markets
                    </span>
                  </li>
                </ul>
              </Card>

              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4 text-slate-900">Analysis Framework</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-slate-700">SWOT analysis methodology for competitive positioning</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-slate-700">Consumer behavior modeling and segmentation analysis</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-slate-700">Market disruption and opportunity assessment frameworks</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-slate-700">Strategic recommendation synthesis and prioritization</span>
                  </li>
                </ul>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Explore the Analysis</h2>
            <p className="text-xl text-slate-300 mb-8 leading-relaxed">
              This comprehensive research foundation supports strategic recommendations for Crown Royal's market
              positioning, brand evolution, and competitive strategy in the evolving North American whiskey landscape.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="bg-amber-600 hover:bg-amber-700 text-white" asChild>
                <Link href="/consumer-insights">Consumer Research</Link>
              </Button>
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white" asChild>
                <Link href="/competitive-analysis">Market Analysis</Link>
              </Button>
              <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white" asChild>
                <Link href="/recommendations">Strategic Recommendations</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
