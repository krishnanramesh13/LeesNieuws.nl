export default {
  name: 'artikel',
  title: 'Artikel',
  type: 'document',
  fields: [
    { name: 'kop', title: 'Kop (Headline)', type: 'string', validation: (Rule: any) => Rule.required() },
    {
      name: 'niveau', title: 'Niveau', type: 'string',
      options: { list: [{ title: 'A2 — Basis', value: 'a2' }, { title: 'B1 — Gevorderd', value: 'b1' }] },
      initialValue: 'a2'
    },
    {
      name: 'categorie', title: 'Categorie', type: 'string',
      options: { list: ['nederland','wereld','natuur','cultuur','sport','klimaat','economie','gezondheid'] },
      validation: (Rule: any) => Rule.required()
    },
    { name: 'leestijd', title: 'Leestijd (minuten)', type: 'number', initialValue: 2 },
    { name: 'ondertitel', title: 'Ondertitel', type: 'string' },
    {
      name: 'afbeelding', title: 'Afbeelding (optioneel)', type: 'image',
      options: { hotspot: true },
      fields: [{ name: 'alt', title: 'Alt tekst', type: 'string' }]
    },
    { name: 'tekst', title: 'Tekst (A2/B1 niveau)', type: 'array', of: [{ type: 'block' }] },
    {
      name: 'woordenlijst', title: 'Woordenlijst', type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'woord', title: 'Woord (NL)', type: 'string' },
          { name: 'betekenis', title: 'Meaning (EN)', type: 'string' }
        ]
      }]
    },
    { name: 'datum', title: 'Datum', type: 'datetime' }
  ]
}