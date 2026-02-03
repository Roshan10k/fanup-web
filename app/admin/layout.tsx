import Header from "./_components/Header";
import Sidebar from "./_components/Sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className='flex w-full min-h-screen'>
            <div className='page-wrapper flex w-full'>
                {/* Sidebar */}
                <div className='xl:block hidden'>
                    <Sidebar />
                </div>
                <div className='w-full bg-background'>
                    {/* Header */}
                    <Header />
                    {/* Main Content */}
                    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 p-6">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
}