import NetInfo, { type NetInfoState } from '@react-native-community/netinfo';
import { useEffect, useState } from 'react';

export interface NetworkStatus {
  isConnected: boolean;
  isInternetReachable: boolean;
}

function toStatus(state: NetInfoState): NetworkStatus {
  return {
    isConnected: state.isConnected ?? false,
    isInternetReachable: state.isInternetReachable ?? false,
  };
}

export function useNetworkStatus(): NetworkStatus {
  const [status, setStatus] = useState<NetworkStatus>({
    isConnected: true,
    isInternetReachable: true,
  });

  useEffect(() => {
    let mounted = true;

    NetInfo.fetch()
      .then((state) => {
        if (mounted) setStatus(toStatus(state));
      })
      .catch(() => {
        // świadomie ignorujemy — subscription poniżej i tak zaktualizuje stan
      });

    const unsubscribe = NetInfo.addEventListener((state) => {
      if (mounted) setStatus(toStatus(state));
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  return status;
}
