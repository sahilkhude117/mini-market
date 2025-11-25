import { useMemo } from "react";
import { useWalletUi } from "@wallet-ui/react";

function shorten(addr?: string): string {
  if (!addr) return "—";
  if (addr.length <= 10) return addr;
  return `${addr.slice(0, 4)}…${addr.slice(-4)}`;
}

export function useUserAddress(): {
  address?: string;
  short: string;
  ready: boolean;
} {
  const { account, connected } = useWalletUi();

  const address = useMemo(() => {
    if (!connected || !account) return undefined;
    return account.address;
  }, [connected, account]);

  const short = useMemo(() => shorten(address), [address]);
  return { address, short, ready: true };
}
