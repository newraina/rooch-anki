'use client'

import { useAppSession, useDecks } from '@/hooks'
import { useConnectWallet, useCurrentWallet, useWallets } from '@roochnetwork/rooch-sdk-kit'
import { AddDeckDialog } from './add-deck-dialog'
import { Button } from './ui/button'

export function TopRightActions() {
  const { sessionKey, handlerCreateSessionKey, sessionLoading } = useAppSession()
  const decksResp = useDecks()

  const wallets = useWallets()
  const currentWallet = useCurrentWallet()
  const { isConnected } = currentWallet
  const { mutateAsync: connectWallet } = useConnectWallet()

  return (
    <div className="flex items-center gap-4">
      <AddDeckDialog onCreated={decksResp.refetch}>
        <Button variant="secondary">New Deck</Button>
      </AddDeckDialog>
      <div>
        {wallets.length === 0 ? (
          <div>
            <Button
              variant="secondary"
              onClick={async () => {
                await connectWallet({
                  wallet: wallets[0],
                })
              }}
            >
              Connect Wallet
            </Button>
          </div>
        ) : isConnected ? (
          <div>
            {sessionKey ? (
              <span>{currentWallet.wallet!.getRoochAddress().toHexAddress().slice(0, 8)}</span>
            ) : (
              <Button
                variant="secondary"
                disabled={sessionLoading}
                onClick={handlerCreateSessionKey}
              >
                Create Session
              </Button>
            )}
          </div>
        ) : (
          <div>
            <Button
              variant="secondary"
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
    </div>
  )
}
