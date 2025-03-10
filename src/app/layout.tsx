import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import AccountContextProvider from '@/components/AccountContextProvider';
import SocketHandler from '@/components/SocketHandler';
import EventStatusContextProvider from '@/components/EventStatusContextProvider';

export const metadata: Metadata = {
    title: 'Cosine不建人解謎活動',
    description: 'Cosine不建人解謎活動',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang='zh-TW'>
            <body className='bg-sky-100 h-screen'>
                <AccountContextProvider>
                    <EventStatusContextProvider>
                        <SocketHandler />
                        <Navbar />
                        <div className='content-center flex flex-col flex-wrap p-8'>
                            {children}
                        </div>
                    </EventStatusContextProvider>
                </AccountContextProvider>
            </body>
        </html>
    );
}


