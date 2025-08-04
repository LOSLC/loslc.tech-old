'use client';

import { ReactQueryProvider } from './react-query-provider';
import { I18nProvider } from './i18n-provider';
import { AuthProvider } from '../contexts/auth-context';

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <I18nProvider>
      <ReactQueryProvider>
        <AuthProvider>
          {children}
        </AuthProvider>
      </ReactQueryProvider>
    </I18nProvider>
  );
}
