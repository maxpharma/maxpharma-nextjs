'use client'; // Mark this as a Client Component

import { store } from '@/store';
import { Provider } from 'react-redux';

export default function Providers({ children }: { children: React.ReactNode }) {
    return <Provider store={store}>{children}</Provider>;
}
