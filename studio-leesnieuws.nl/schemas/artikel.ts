export default {
  name: 'artikel',
  title: 'Artikel',
  type: 'document',
  fields: [
    {
      name: 'kop',
      title: 'Kop (Headline)',
      type: 'string',
      validation: (Rule: any) => Rule.required()
    },
    {
      name: 'categorie',
      title: 'Categorie',
      type: 'string',
      options: {
        list: ['nederland', 'wereld', 'natuur', 'cultuur', 'sport']
      },
      validation: (Rule: any) => Rule.required()
    },
    {
      name: 'ondertitel',
      title: 'Ondertitel',
      type: 'string',
    },
    {
      name: 'tekst',
      title: 'Tekst (A2 niveau)',
      type: 'array',
      of: [{ type: 'block' }]
    },
    {
      name: 'woordenlijst',
      title: 'Woordenlijst',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'woord', title: 'Woord (NL)', type: 'string' },
            { name: 'betekenis', title: 'Meaning (EN)', type: 'string' }
          ]
        }
      ]
    },
    {
      name: 'datum',
      title: 'Datum',
      type: 'datetime',
    }
  ]
}