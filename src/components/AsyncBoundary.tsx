import type { ReactNode } from 'react';

import { ErrorView } from './ErrorView';
import { LoadingView } from './LoadingView';

export type AsyncStatus = 'idle' | 'loading' | 'success' | 'error';

interface Props {
  status: AsyncStatus;
  /** Jeśli `true`, AsyncBoundary defer-uje do children mimo statusu loading/error
   *  (np. lista ma już dane z poprzedniego fetch — refresh w tle, brak full-screen spinnera). */
  hasData?: boolean;
  loadingMessage?: string;
  errorMessage?: string | null;
  retryLabel?: string;
  onRetry?: () => void;
  children: ReactNode;
}

export function AsyncBoundary({
  status,
  hasData = false,
  loadingMessage,
  errorMessage,
  retryLabel,
  onRetry,
  children,
}: Props) {
  if (status === 'loading' && !hasData) {
    return <LoadingView message={loadingMessage} />;
  }

  if (status === 'error' && !hasData) {
    return (
      <ErrorView message={errorMessage ?? undefined} onRetry={onRetry} retryLabel={retryLabel} />
    );
  }

  return <>{children}</>;
}
