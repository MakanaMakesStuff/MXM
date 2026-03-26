import { Link, usePage } from '@inertiajs/react';
import { login, logout, register } from '@/routes';
import type { AppLayoutProps } from '@/types';

export default function AppFrontendLayout({ children }: AppLayoutProps) {
    const { auth } = usePage().props;

    return (
        <div className="flex min-h-screen w-full flex-col bg-white text-gray-950 antialiased">
            {/* Header section merged with your auth logic */}
            <header className="sticky top-0 z-50 flex w-full items-center justify-between border-b border-gray-100 bg-white/90 px-4 py-4 backdrop-blur-sm sm:px-8">
                {/* Brand / Logo Area */}
                <Link
                    href="/"
                    className="flex items-center gap-4 transition-opacity hover:opacity-80"
                >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-rose-100 bg-rose-50 shadow-sm">
                        <span className="serif text-xl font-bold tracking-tight text-rose-600">
                            M&M
                        </span>
                    </div>
                    <h1 className="hidden text-xl font-semibold tracking-tight text-gray-950 sm:block">
                        Miyah <span className="mx-1 text-gray-400">×</span>{' '}
                        Makana
                    </h1>
                </Link>

                {/* Navigation / Auth Area */}
                <nav className="flex items-center gap-4">
                    {auth.user ? (
                        <>
                            <span className="hidden text-sm text-gray-500 md:inline">
                                Welcome, {auth.user.name}
                            </span>
                            {/* Assuming you want an "Enter App" button when logged in */}
                            <Link
                                href="/app"
                                className="rounded-lg bg-gray-950 px-4 py-2 text-sm font-medium text-white shadow-sm transition duration-150 hover:bg-gray-800"
                            >
                                Open App
                            </Link>

                            <Link
                                href={logout()}
                                className="cursor-pointer rounded-lg bg-gray-950 px-4 py-2 text-sm font-medium text-white shadow-sm transition duration-150 hover:bg-gray-800"
                            >
                                Logout
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link
                                href={login()}
                                className="text-sm font-medium text-gray-600 transition duration-150 hover:text-gray-950"
                            >
                                Login
                            </Link>
                            <Link
                                href={register()}
                                className="rounded-lg bg-gray-950 px-4 py-2 text-sm font-medium text-white shadow-sm transition duration-150 hover:bg-gray-800"
                            >
                                Register
                            </Link>
                        </>
                    )}
                </nav>
            </header>

            {/* Main content area where your page components inject their UI */}
            <main className="flex w-full flex-1 flex-col">{children}</main>

            {/* Footer styled to match the M&M theme */}
            <footer className="mt-12 mt-auto w-full border-t border-gray-100 px-4 py-8 text-center">
                <p className="text-sm text-gray-500">
                    Built exclusively for{' '}
                    <span className="font-medium text-gray-700">Miyah</span> and{' '}
                    <span className="font-medium text-gray-700">Makana</span>.
                </p>
                <p className="mt-2 text-xs text-gray-400">
                    &copy; {new Date().getFullYear()}. Your Private Space. All
                    rights reserved.
                </p>
            </footer>
        </div>
    );
}
