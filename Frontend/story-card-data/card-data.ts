// Define the story type for better type safety
export interface Story {
  id: string;
  title: string;
  subtitle: string;
  intro: string;
  author: string;
  readTime: string;
  publishDate: string;
  category: string;
  sections: {
    heading: string;
    content: string;
  }[];
}

// Array of all stories - easy to add more in the future
export const stories: Story[] = [
  {
    id: "labour-after-lockdowns",
    title:
      "Labour After Lockdowns: Structural Shifts in European Employment Post-COVID",
    subtitle: "How the Pandemic Redefined Europe's Labour Market Landscape",
    author: "Research Team",
    readTime: "8 min read",
    publishDate: "2024-01-15",
    category: "Research",
    intro:
      "The COVID-19 pandemic didn't just trigger a temporary employment shock — it accelerated deep, structural shifts across Europe's labor markets. As lockdowns lifted, it became clear that hybrid work, digital re-skilling, and sectoral divergence were not fleeting responses but long-term transformations. This story draws on data from EU labor statistics and recovery funds (e.g., dwr-24-08, dwr-24-43) to track what changed, where, and how governments are adapting.",
    sections: [
      {
        heading: "I. The Past: Pandemic Shock and Labour Stabilization",
        content:
          "In March 2020, as COVID-19 swept across Europe, millions of workers were furloughed. However, unlike in previous crises, mass unemployment was largely prevented thanks to Kurzarbeit-style wage subsidies, particularly in countries like Germany, Austria, and France. EU average unemployment rose from 6.6% to just 7.2%. dwr-24-08 shows public wage support exceeded 3.4% of GDP in Germany and 4% in France in 2020. Female employment fell more steeply due to service-sector shutdowns (e.g., hospitality, retail). Despite recessionary conditions, these interventions stabilized income, but revealed sectoral fragility.",
      },
      {
        heading: "II. The Present: Labour Recomposition, Not Recovery",
        content:
          "As Europe entered a post-pandemic phase by late 2022, labor markets diverged. Retail & hospitality employment remains 6–10% below pre-COVID levels (dwr-24-08). Many over-50 workers opted for early retirement. In contrast, ICT sector employment grew 11% from 2021–2023 (ind04031), and parcel/logistics jobs rose 18%. Telework stabilized at 30–35% in countries like NL, BE, DK. dwr-24-43 shows urban-to-rural migration reversed prior trends. However, reskilling programs have lagged labour force churn.",
      },
      {
        heading: "III. The Future: Polarization or Progress?",
        content:
          "Europe's labor market is splitting across skill, geography, and age. dwr-24-43 projects green/digital job postings to grow 18% by 2026. Yet, Indicator ind04017 shows vocational access remains under 40% in many EU countries. If NextGenEU funds aren't better targeted, dualities will deepen — digital elites vs. stranded service workers.",
      },
      {
        heading: "Conclusion",
        content:
          "The pandemic revealed fault lines in Europe's labor system. Policymakers must reform vocational systems, localize response strategies, and harness real-time labour data. Europe's labour policy is no longer about jobs lost — it's about pathways to where jobs are going.",
      },
    ],
  },
  // Example of how to add more stories in the future:
  {
    id: "digital-transformation-europe",
    title: "Digital Transformation in European SMEs: Beyond the Hype",
    subtitle:
      "How Small and Medium Enterprises Are Really Adapting to Digital Change",
    author: "Tech Analysis Team",
    readTime: "6 min read",
    publishDate: "2024-01-10",
    category: "Technology",
    intro:
      "While headlines focus on AI and automation in large corporations, Europe's 25 million SMEs are quietly undergoing their own digital revolution. This analysis examines real adoption patterns, challenges, and opportunities across different sectors and regions.",
    sections: [
      {
        heading: "The Reality Check: Where SMEs Actually Stand",
        content:
          "Despite policy initiatives like Digital Europe Programme, SME digitalization remains uneven. Manufacturing SMEs lead with 67% having basic digital tools, while traditional services lag at 34%. Geographic disparities are stark: Nordic countries show 80%+ adoption rates while Eastern European SMEs average 45%.",
      },
      {
        heading: "Success Stories and Scaling Challenges",
        content:
          "German Mittelstand companies demonstrate how incremental digitalization works. Rather than wholesale transformation, successful SMEs focus on specific pain points: inventory management, customer communication, or supply chain visibility. The key insight: digital tools must solve immediate business problems, not chase technological trends.",
      },
    ],
  },
  {
    id: "strategic-reserves",
    title: "Strategic Reserves — Insurance Against Energy Instability",
    subtitle:
      "How Germany's Resilience Doctrine Is Redefining Economic Stability",
    author: "Energy Policy Team",
    readTime: "8 min read",
    publishDate: "2024-02-15",
    category: "Energy",
    intro:
      "As Germany's energy system reels from the twin shocks of war and climate volatility, a quieter but profound shift has taken place: the elevation of strategic reserves — not just for oil, but across gas, chemicals, and food — to the heart of national economic planning. Once relegated to emergency stockpiles, these reserves are now becoming a key economic stabilizer in an era of global supply fragility.",
    sections: [
      {
        heading: "I. The Past: A Comfortably Connected System",
        content:
          "For much of the 2000s and 2010s, Germany relied on stable, long-term supply contracts — especially for natural gas via Nord Stream — and maintained only minimal physical reserves beyond EU mandates. According to data in dwr-24-10, Germany's gas storage capacity utilization averaged just 68% between 2015 and 2019. Strategic storage of other commodities remained decentralized. Indicator data from dwr-24-28 show that public storage-related investment stayed below 0.2% of GDP annually between 2014 and 2019.",
      },
      {
        heading: "II. The Present: From Market Reliance to Strategic Buffering",
        content:
          "Following Russia's invasion of Ukraine, the entire premise of European energy security collapsed. Germany filled existing gas facilities to 95%, constructed LNG terminals, and briefly returned to coal. According to dwr-24-49, gas reserves surged from 68% in 2021 to 98% by late 2022. dwr-24-35 shows public language shifting — reserves became 'macro-stabilizers'. The KTF fund reallocated €5 billion to warehousing. Logistics permit issuance rose 9% in 2023, according to indicator ind01040.",
      },
      {
        heading: "III. The Future: Strategic Reserves as Infrastructure",
        content:
          "Strategic reserves will likely be treated as infrastructure assets. dwr-24-28 estimates 0.8–1.1% of GDP annually needed through 2030 to expand full-spectrum reserves. Early data show results: fuel price volatility dropped 12% vs. neighbors, permit issuance for cold logistics surged. But challenges remain — should reserves be centralized or decentralized? Climate-aligned or fossil-dependent?",
      },
      {
        heading: "Conclusion",
        content:
          "Germany's new strategic reserve policy signals a deep rethinking of resilience. To succeed, the next phase must be climate-aligned, transparent, and avoid crowding out private logistics. As dwr-24-10, dwr-24-49, and dwr-24-28 show, strategic reserves are no longer optional — they are infrastructure.",
      },
    ],
  },
];
