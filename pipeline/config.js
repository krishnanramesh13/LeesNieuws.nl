module.exports = {

  // ── NEWS SOURCES (Netherlands focused) ──
  sources: [
    // ── NETHERLANDS FOCUSED ──
    {
      name: 'NOS Binnenland',
      url: 'https://feeds.nos.nl/nosnieuwsbinnenland',
      enabled: true,
      articlesPerFeed: 3,
      defaultCategory: 'nederland',
    },
    {
      name: 'NOS Algemeen',
      url: 'https://feeds.nos.nl/nosnieuwsalgemeen',
      enabled: true,
      articlesPerFeed: 2,
      defaultCategory: 'nederland',
    },
    {
      name: 'NOS Politiek',
      url: 'https://feeds.nos.nl/nosnieuwspolitiek',
      enabled: true,
      articlesPerFeed: 1,
      defaultCategory: 'nederland',
    },
    {
      name: 'NOS Economie',
      url: 'https://feeds.nos.nl/nosnieuwseconomie',
      enabled: true,
      articlesPerFeed: 1,
      defaultCategory: 'economie',
    },
    {
      name: 'NOS Sport',
      url: 'https://feeds.nos.nl/nosnieuwssport',
      enabled: true,
      articlesPerFeed: 1,
      defaultCategory: 'sport',
    },
    {
      name: 'NOS Klimaat',
      url: 'https://feeds.nos.nl/nosnieuwsklimaat',
      enabled: true,
      articlesPerFeed: 1,
      defaultCategory: 'klimaat',
    },
    {
      name: 'NOS Cultuur',
      url: 'https://feeds.nos.nl/nosnieuwscultuurenmedia',
      enabled: true,
      articlesPerFeed: 1,
      defaultCategory: 'cultuur',
    },
    {
      name: 'NU.nl Algemeen',
      url: 'https://www.nu.nl/rss/Algemeen',
      enabled: true,
      articlesPerFeed: 2,
      defaultCategory: 'nederland',
    },
    {
      name: 'NU.nl Economie',
      url: 'https://www.nu.nl/rss/Economie',
      enabled: true,
      articlesPerFeed: 1,
      defaultCategory: 'economie',
    },
    {
      name: 'Telegraaf Nieuws',
      url: 'https://www.telegraaf.nl/nieuws/rss',
      enabled: true,
      articlesPerFeed: 1,
      defaultCategory: 'nederland',
    },

    // ── WORLD NEWS (disabled by default) ──
    {
      name: 'NOS Buitenland',
      url: 'https://feeds.nos.nl/nosnieuwsbuitenland',
      enabled: false,
      articlesPerFeed: 1,
      defaultCategory: 'wereld',
    },
    {
      name: 'NU.nl Buitenland',
      url: 'https://www.nu.nl/rss/Buitenland',
      enabled: false,
      articlesPerFeed: 1,
      defaultCategory: 'wereld',
    },
  ],

  // ── PIPELINE SETTINGS ──
  pipeline: {
    totalA2Articles: 2,
    totalA2PlusArticles: 2,
    totalB1Articles: 2,
    delayBetweenArticles: 1500,

    // Filter: only use articles that mention Netherlands
    // This prevents world news sneaking in
    preferNetherlandsNews: true,
  },

  // ── NOTIFICATION ──
  notification: {
    sendEmail: true,
  },

  // ── GROQ ──
  groq: {
    model: 'llama-3.3-70b-versatile',
    temperature: 0.75,
    maxTokens: 2000,
  },
}