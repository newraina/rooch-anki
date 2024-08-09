'use client'

import { networkConfig } from '@/utils'
import { NETWORK_NAME } from '@/utils/constants'
import { RoochProvider, WalletProvider } from '@roochnetwork/rooch-sdk-kit'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

if (!NETWORK_NAME || !['localnet', 'testnet', 'mainnet'].includes(NETWORK_NAME)) {
  throw new Error('NEXT_PUBLIC_NETWORK_NAME is not set correctly')
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <RoochProvider networks={networkConfig} defaultNetwork={NETWORK_NAME}>
        <WalletProvider preferredWallets={['unisat']} chain="bitcoin" autoConnect>
          {children}
        </WalletProvider>
      </RoochProvider>
    </QueryClientProvider>
  )
}
