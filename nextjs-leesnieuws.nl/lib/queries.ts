import { client } from './sanity'

export async function getAllArtikels() {
  return await client.fetch(`
    *[_type == "artikel"] | order(datum desc) {
      _id,
      kop,
      ondertitel,
      categorie,
      niveau,
      leestijd,
      tekst,
      woordenlijst,
      datum,
      "afbeelding": afbeelding.asset->{ "url": url, "alt": coalesce(altText, "") }
    }
  `, {}, { cache: 'no-store' })
}

export async function getWoordVanDeDag() {
  const today = new Date().toISOString().split('T')[0]
  const results = await client.fetch(`
    *[_type == "woordVanDeDag" && datum == $today][0] {
      woord,
      definitie,
      voorbeeldzin,
      datum
    }
  `, { today }, { cache: 'no-store' })

  // fallback to most recent if no word for today
  if (!results) {
    return await client.fetch(`
      *[_type == "woordVanDeDag"] | order(datum desc)[0] {
        woord,
        definitie,
        voorbeeldzin,
        datum
      }
    `, {}, { cache: 'no-store' })
  }
  return results
}