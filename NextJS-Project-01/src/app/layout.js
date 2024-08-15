// sr /app/layout.js
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header/Header";
import { fetchAuthUserAction } from "@/actions";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default async function RootLayout({ children }) {
  const currentUser = await fetchAuthUserAction();
  const isLoggedIn = currentUser?.success;
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header isLoggedIn={isLoggedIn} />
        {children}
      </body>
    </html>
  );
}