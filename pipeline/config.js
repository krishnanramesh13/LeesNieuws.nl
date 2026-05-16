module.exports = {

  // ── NEWS SOURCES (Netherlands focused) ──
  sources: [
    {
      name: 'NOS Algemeen',
      url: 'https://feeds.nos.nl/nosnieuwsalgemeen',
      enabled: true,
      articlesPerFeed: 3,
      defaultCategory: 'nederland',
    },
    {
      name: 'NOS Binnenland',
      url: 'https://feeds.nos.nl/nosnieuwsbinnenland',
      enabled: true,
      articlesPerFeed: 2,
      defaultCategory: 'nederland',
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
      enabled: false,
      articlesPerFeed: 1,
      defaultCategory: 'economie',
    },
  ],

  // ── PIPELINE SETTINGS ──
  pipeline: {
    totalA2Articles: 3,          // number of A2 articles per day
    totalB1Articles: 3,          // number of B1 articles per day
    delayBetweenArticles: 1500,  // ms delay between Groq API calls
  },

  // ── PREFERRED TOPICS (Netherlands focused) ──
  // Pipeline will try to find articles matching these topics
  preferredTopics: [
    'openbaar vervoer',
    'gezondheid',
    'misdaad',
    'belasting',
    'woningmarkt',
    'huurmarkt',
    'festivals',
    'concerten',
    'overheid',
    'koning',
    'klimaat',
    'sport',
    'zorg',
  ],

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