'use client';

import { ProgressProvider as NextProgressProvider } from '@bprogress/next/app';

const ProgressProvider = ({ children }: { children: React.ReactNode }) => {
    return (
        <NextProgressProvider
            height="4px"
            color="#4172C4"
            options={{ showSpinner: false }}
            shallowRouting
        >
            {children}
        </NextProgressProvider>
    );
};

export default ProgressProvider;