import { RoochClient, Args } from '@roochnetwork/rooch-sdk'
import { MODULE_ADDRESS } from './constants'

export async function getDueCardIds(client: RoochClient, deckId: string) {
  const resp = await client.executeViewFunction({
    target: `${MODULE_ADDRESS}::deck::get_due_cards`,
    args: [Args.objectId(deckId)],
  })

  const ids = resp.return_values![0].decoded_value as string[]
  return ids
}
