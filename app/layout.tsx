import "@rainbow-me/rainbowkit/styles.css"
import "../styles/global.css";

import { Providers } from "./providers";
import { UserProvider } from "@/lib/UserContext";
import { ThemeProvider } from './components/ThemeProvider';
import { ThemeToggle } from './components/ThemeToggle';
import TokenVerifier from './components/TokenVerifier';
import { AuthProvider } from '@/lib/AuthContext';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-light-bg dark:bg-gray-900 text-black dark:text-white">
        <ThemeProvider>
          <AuthProvider>
            <Providers>
              <UserProvider>
                <ThemeToggle />
                <TokenVerifier />
                {children}
              </UserProvider>
            </Providers>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
