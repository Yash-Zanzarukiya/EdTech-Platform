import { useAuthRedirect } from '@/hooks';
import { Link } from 'react-router-dom';

function Home() {
    return (
        <div className=" grow bg-gray-50 dark:bg-gray-900">
            <main className="flex-1">
                <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
                    <div className="container px-4 md:px-6">
                        <div className="flex flex-col items-center space-y-4 text-center">
                            <div className="space-y-2">
                                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl text-gray-900 dark:text-gray-100">
                                    Build Your Dream Website
                                </h1>
                                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                                    With our intuitive website builder, you can
                                    create a stunning website in minutes. No
                                    coding required.
                                </p>
                            </div>
                            <div className="space-x-4">
                                <Link
                                    to="/sign-up"
                                    className="inline-flex h-9 items-center justify-center rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
                                >
                                    Get Started
                                </Link>
                                <Link
                                    to="/explore"
                                    className="inline-flex h-9 items-center justify-center rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-gray-300"
                                >
                                    Explore Now
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
                    <div className="container px-4 md:px-6">
                        <div className="flex flex-col items-center space-y-4 text-center">
                            <div className="space-y-2">
                                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-gray-900 dark:text-gray-100">
                                    Key Features
                                </h2>
                                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                                    Our website builder comes with a range of
                                    features designed to make your website
                                    building experience seamless.
                                </p>
                            </div>
                            <div className="grid w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"></div>
                        </div>
                    </div>
                </section>
                <section className="w-full py-12 md:py-24 lg:py-32">
                    <div className="container px-4 md:px-6">
                        <div className="flex flex-col items-center space-y-4 text-center">
                            <div className="space-y-2">
                                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-gray-900 dark:text-gray-100">
                                    Pricing Plans
                                </h2>
                                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                                    Choose a plan that suits your needs.
                                    Upgrade, downgrade, or cancel anytime.
                                </p>
                            </div>
                            <div className="grid w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"></div>
                        </div>
                    </div>
                </section>
            </main>
            <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                    &copy; 2024 WebBuilder. All rights reserved.
                </p>
                <nav className="sm:ml-auto flex gap-4 sm:gap-6">
                    <Link
                        to="/terms"
                        className="text-xs hover:underline underline-offset-4 text-gray-700 dark:text-gray-300"
                    >
                        Terms of Service
                    </Link>
                    <Link
                        to="/privacy"
                        className="text-xs hover:underline underline-offset-4 text-gray-700 dark:text-gray-300"
                    >
                        Privacy
                    </Link>
                </nav>
            </footer>
        </div>
    );
}

export default Home;
