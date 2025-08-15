'use client';
import type { ReactNode } from 'react';

import { AuthProvider } from '@/lib/context/authContext';

interface Props {
  children: ReactNode;
}

const AuthWrapper = ({ children }: Props) => <AuthProvider>{children}</AuthProvider>;

export default AuthWrapper;
