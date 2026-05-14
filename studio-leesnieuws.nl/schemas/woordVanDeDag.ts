export default {
  name: 'woordVanDeDag',
  title: 'Woord van de dag',
  type: 'document',
  fields: [
    {
      name: 'woord',
      title: 'Woord',
      type: 'string',
      validation: (Rule: any) => Rule.required()
    },
    {
      name: 'definitie',
      title: 'Definitie (EN)',
      type: 'string',
      validation: (Rule: any) => Rule.required()
    },
    {
      name: 'voorbeeldzin',
      title: 'Voorbeeldzin (NL)',
      type: 'string',
      validation: (Rule: any) => Rule.required()
    },
    {
      name: 'datum',
      title: 'Datum',
      type: 'date',
      validation: (Rule: any) => Rule.required()
    }
  ],
  preview: {
    select: {
      title: 'woord',
      subtitle: 'datum'
    }
  }
}