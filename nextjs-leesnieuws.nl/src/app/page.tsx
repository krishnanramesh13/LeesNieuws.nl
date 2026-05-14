import { getAllArtikels, getWoordVanDeDag } from '../../lib/queries'
import HomeClient from './HomeClient'

export const revalidate = 60

export default async function Home() {
  const [artikels, wotd] = await Promise.all([
    getAllArtikels(),
    getWoordVanDeDag()
  ])
  return <HomeClient artikels={artikels} wotd={wotd} />
}