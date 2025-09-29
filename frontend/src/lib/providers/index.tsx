"use client";

import { AuthProvider } from "../contexts/auth-context";
import { I18nProvider } from "./i18n-provider";
import { ReactQueryProvider } from "./react-query-provider";

interface ProvidersProps {
	children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
	return (
		<I18nProvider>
			<ReactQueryProvider>
				<AuthProvider>{children}</AuthProvider>
			</ReactQueryProvider>
		</I18nProvider>
	);
}
