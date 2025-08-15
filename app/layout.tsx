import type { Metadata } from 'next';

import React from 'react';
import 'react-toastify/dist/ReactToastify.css';
import '@/styles/globals/globals.css';
import { ToastContainer } from 'react-toastify';

import { Header, Footer, AuthWrapper, ThemeProvider } from '@/components';

export const metadata: Metadata = {
  title: 'GoBookIt',
  description: 'Seamless meeting room booking for teams and professionals',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthWrapper>
      <html lang="en" className="h-full light">
        <body className="font-sans min-h-screen flex flex-col h-full">
          <ThemeProvider>
            <Header />
            <main id="main" role="main" tabIndex={-1} className="flex-1 mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 focus:outline-none">
              {children}
            </main>
            <Footer />
            <ToastContainer />
          </ThemeProvider>
        </body>
      </html>
    </AuthWrapper>
  );
}
