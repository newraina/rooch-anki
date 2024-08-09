'use client'

import { MODULE_ADDRESS } from '@/utils/constants'
import { Args, Transaction } from '@roochnetwork/rooch-sdk'
import {
  useConnectWallet,
  useCurrentWallet,
  useRoochClient,
  useWallets,
} from '@roochnetwork/rooch-sdk-kit'
import { Button } from '@/components/ui/button'
import { useDeckCards, useDecks } from '@/hooks'

export default function Home() {
  const wallets = useWallets()
  const currentWallet = useCurrentWallet()
  const { isConnected, status, wallet } = currentWallet
  const { mutateAsync: connectWallet } = useConnectWallet()
  const client = useRoochClient()

  const { data: decks, refetch: refetchDecks } = useDecks()
  const { data: cards, refetch: refetchDeckCards } = useDeckCards(decks?.[0]?.id || '')

  return (
    <div>
      <div>
        {wallets.length === 0 ? (
          'Please install the wallet and try again'
        ) : isConnected ? (
          status
        ) : (
          <div>
            <Button
              onClick={async () => {
                await connectWallet({
                  wallet: wallets[0],
                })
              }}
            >
              Connect Wallet
            </Button>
          </div>
        )}
      </div>

      <div>
        <Button
          onClick={async () => {
            const tx = new Transaction()
            tx.callFunction({
              target: `${MODULE_ADDRESS}::deck::create_deck_entry`,
              args: [Args.string('test-001')],
            })
            const result = await client.signAndExecuteTransaction({
              transaction: tx,
              signer: currentWallet.wallet!,
            })

            console.log(result)

            if (result.execution_info.status.type !== 'executed') {
              alert('Transaction failed')
              return
            }

            await refetchDecks()
          }}
        >
          create deck
        </Button>

        <h2>deck list</h2>
        <ul>
          {decks?.map((deck) => (
            <li key={deck.id}>
              {deck.name} <span>{deck.createdAtString}</span>
              <Button
                onClick={async () => {
                  const tx = new Transaction()
                  tx.callFunction({
                    target: `${MODULE_ADDRESS}::deck::delete_deck_entry`,
                    args: [Args.objectId(deck.id)],
                  })
                  const result = await client.signAndExecuteTransaction({
                    transaction: tx,
                    signer: currentWallet.wallet!,
                  })

                  console.log(result)

                  if (result.execution_info.status.type !== 'executed') {
                    alert('Transaction failed')
                    return
                  }

                  await refetchDecks()
                }}
              >
                delete
              </Button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2>Card List</h2>
        <div>
          <Button
            onClick={async () => {
              const tx = new Transaction()
              tx.callFunction({
                target: `${MODULE_ADDRESS}::deck::add_card_entry`,
                args: [
                  Args.objectId(decks![0].id),
                  Args.string('test-001'),
                  Args.string('test-001'),
                ],
              })
              const result = await client.signAndExecuteTransaction({
                transaction: tx,
                signer: currentWallet.wallet!,
              })

              console.log(result)

              if (result.execution_info.status.type !== 'executed') {
                alert('Transaction failed')
                return
              }

              refetchDecks()
              refetchDeckCards()
            }}
          >
            添加卡片
          </Button>

          <div>
            {cards.map((c) => (
              <div key={c.id}>
                {c.id}
                <Button
                  onClick={async () => {
                    const tx = new Transaction()
                    tx.callFunction({
                      target: `${MODULE_ADDRESS}::deck::remove_card_from_deck_entry`,
                      args: [Args.objectId(c.deckId), Args.objectId(c.id)],
                    })
                    const result = await client.signAndExecuteTransaction({
                      transaction: tx,
                      signer: currentWallet.wallet!,
                    })

                    console.log(result)

                    if (result.execution_info.status.type !== 'executed') {
                      alert('Transaction failed')
                      return
                    }

                    await refetchDeckCards()
                  }}
                >
                  删除
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
