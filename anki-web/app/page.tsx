'use client'

import Home from '@/components/home'
import { networkConfig } from '@/utils'
import { RoochProvider, WalletProvider } from '@roochnetwork/rooch-sdk-kit'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { DeckListPage } from '@/components/DeckListPage'

const queryClient = new QueryClient()

export default function HomePage() {
  return (
    <QueryClientProvider client={queryClient}>
      <RoochProvider networks={networkConfig} defaultNetwork="localnet">
        <WalletProvider preferredWallets={['unisat']} chain="bitcoin" autoConnect>
          {/*<Home />*/}
          <DeckListPage />
        </WalletProvider>
      </RoochProvider>
    </QueryClientProvider>
  )
}
