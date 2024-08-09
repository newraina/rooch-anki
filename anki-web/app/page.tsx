import { redirect } from 'next/navigation'

export default function Page() {
  redirect('/decks')

  return null
}
