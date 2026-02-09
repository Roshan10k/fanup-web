import "./globals.css";
import { Poppins } from "next/font/google";
import Navbar from "./_components/navbar";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from "@/context/AuthContext";


const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <AuthProvider>
        {children}
        </AuthProvider>
        <ToastContainer position="top-right" />
      </body>
    </html>
  );
}