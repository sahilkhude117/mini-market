import { useMemo } from 'react';
import { useSolana } from '@/components/solana/use-solana';
import { useWalletUi } from '@wallet-ui/react';
import { MINIMARKET_PROGRAM_ID } from '@project/anchor';
import { Program, AnchorProvider } from '@coral-xyz/anchor';
import { type Minimarket } from '../../../anchor/target/types/minimarket';
import { PublicKey } from '@solana/web3.js';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import IDL from '../../../anchor/target/idl/minimarket.json';

/**
 * Hook to get the Minimarket program instance
 */
export function usePredictionMarketProgram() {
  const { client, cluster } = useSolana();
  const { account } = useWalletUi();

  const getProgram = () => {
    if (!account?.address) return null;

    try {
      // Create provider with gill client
      const provider = new AnchorProvider(
        client as any,
        {
          publicKey: new PublicKey(account.address),
          signTransaction: async (tx: any) => tx,
          signAllTransactions: async (txs: any[]) => txs,
        } as any,
        { commitment: 'confirmed' }
      );

      // Initialize program
      const program = new Program(
        IDL as any,
        provider
      ) as unknown as Program<Minimarket>;

      return program;
    } catch (error) {
      console.error('Error initializing program:', error);
      return null;
    }
  };

  return { program: getProgram(), cluster };
}

/**
 * Hook to get the global state PDA
 */
function useGlobalPDA() {
  return useMemo(() => {
    const [globalPDA] = PublicKey.findProgramAddressSync(
      [Buffer.from('global_seed')],
      MINIMARKET_PROGRAM_ID
    );
    return globalPDA;
  }, []);
}

/**
 * Query a market account from the blockchain
 */
export function usePredictionMarketAccount(marketAddress: string | null) {
  const { program } = usePredictionMarketProgram();

  return useQuery({
    queryKey: ['prediction-market', marketAddress],
    queryFn: async () => {
      if (!program || !marketAddress) return null;

      const market = await program.account.market.fetch(
        new PublicKey(marketAddress)
      );

      return {
        ...market,
        address: marketAddress,
        creator: market.creator.toString(),
        tokenA: market.tokenA.toString(),
        tokenB: market.tokenB.toString(),
        feed: market.feed.toString(),
        date: market.date.toString(),
        totalReserve: market.totalReserve.toString(),
        marketStatus: market.marketStatus,
        result: market.result,
        value: market.value,
        range: market.range,
        tokenAAmount: market.tokenAAmount.toString(),
        tokenBAmount: market.tokenBAmount.toString(),
        yesAmount: market.yesAmount.toString(),
        noAmount: market.noAmount.toString(),
      };
    },
    enabled: !!program && !!marketAddress,
  });
}

/**
 * Query all markets (expensive - use backend API instead for production)
 */
export function usePredictionMarkets() {
  const { program } = usePredictionMarketProgram();

  return useQuery({
    queryKey: ['prediction-markets'],
    queryFn: async () => {
      if (!program) return [];

      // This fetches ALL market accounts from the blockchain
      // In production, use your backend API instead for better performance
      const markets = await program.account.market.all();

      return markets.map((m) => ({
        address: m.publicKey.toString(),
        creator: m.account.creator.toString(),
        tokenA: m.account.tokenA.toString(),
        tokenB: m.account.tokenB.toString(),
        feed: m.account.feed.toString(),
        date: m.account.date.toString(),
        totalReserve: m.account.totalReserve.toString(),
        marketStatus: m.account.marketStatus,
        result: m.account.result,
      }));
    },
    enabled: !!program,
    staleTime: 60000, // Cache for 1 minute
  });
}

/**
 * Initialize the prediction market program (one-time setup by admin)
 * 
 * ⚠️ This needs proper implementation with all required accounts
 */
export function usePredictionMarketInitialize() {
  const { program } = usePredictionMarketProgram();
  const { account } = useWalletUi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['prediction-market-initialize'],
    mutationFn: async ({ feePercentage }: { feePercentage: number }) => {
      if (!program || !account?.address) {
        throw new Error('Wallet not connected or program not initialized');
      }

      // TODO: Implement with proper accounts
      throw new Error('Initialize instruction needs full account setup. Check Anchor program requirements.');
    },
    onSuccess: () => {
      toast.success('Program initialized successfully');
      queryClient.invalidateQueries({ queryKey: ['prediction-markets'] });
    },
    onError: (error: Error) => {
      toast.error('Failed to initialize program', {
        description: error.message,
      });
    },
  });
}

/**
 * Create a new prediction market
 * 
 * ⚠️ Complex account setup required. For now, use backend API to create markets.
 * Full implementation needs:
 * - Market PDA derivation
 * - Token mint PDAs (YES/NO tokens)
 * - Metadata accounts
 * - Token program accounts
 */
export function usePredictionMarketCreate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['prediction-market-create'],
    mutationFn: async (params: {
      question: string;
      description: string;
      category: string;
      endDate: Date;
      imageUrl: string;
      options: string[];
      initialLiquidity: number;
      feedAddress: string;
    }) => {
      // For now, use the backend API instead
      // TODO: Implement full on-chain market creation with proper account setup
      
      toast.info('Using backend API for market creation', {
        description: 'Full on-chain integration coming soon',
      });
      
      throw new Error('Use backend API for market creation. On-chain creation requires complex account setup.');
    },
    onError: (error: Error) => {
      toast.error('Failed to create market', {
        description: error.message,
      });
    },
  });
}

/**
 * Add liquidity to a prediction market
 * 
 * ⚠️ Needs proper account setup
 */
export function usePredictionMarketAddLiquidity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['prediction-market-add-liquidity'],
    mutationFn: async (params: {
      marketAddress: string;
      amount: number;
      feeAuthority: string;
    }) => {
      // TODO: Implement with proper accounts
      toast.info('Use backend API for now');
      throw new Error('Liquidity addition requires proper account setup');
    },
    onError: (error: Error) => {
      toast.error('Failed to add liquidity', {
        description: error.message,
      });
    },
  });
}

/**
 * Place a bet on a prediction market
 * 
 * ⚠️ Needs proper account setup including token accounts
 */
export function usePredictionMarketPlaceBet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['prediction-market-place-bet'],
    mutationFn: async (params: {
      marketAddress: string;
      tokenMint: string;
      amount: number;
      isYes: boolean;
    }) => {
      // TODO: Implement with all required token program accounts
      toast.info('Use backend API for now');
      throw new Error('Betting requires proper token account setup');
    },
    onError: (error: Error) => {
      toast.error('Failed to place bet', {
        description: error.message,
      });
    },
  });
}

/**
 * Get oracle result for a market
 * 
 * ⚠️ Needs proper account setup
 */
export function usePredictionMarketGetResult() {
  return useMutation({
    mutationKey: ['prediction-market-get-result'],
    mutationFn: async (params: {
      marketAddress: string;
      feedAddress: string;
    }) => {
      // TODO: Implement with proper accounts
      toast.info('Use backend API for now');
      throw new Error('Oracle result fetching requires proper setup');
    },
    onError: (error: Error) => {
      toast.error('Failed to get oracle result', {
        description: error.message,
      });
    },
  });
}

/**
 * Export helper functions for PDA derivation
 * These match the functions in anchor/src/minimarket-exports.ts
 */
export function getGlobalPDA(): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('global_seed')],
    MINIMARKET_PROGRAM_ID
  );
}

export function getMarketPDA(marketId: string): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('market_seed'), Buffer.from(marketId)],
    MINIMARKET_PROGRAM_ID
  );
}


