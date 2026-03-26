import { Head, Link } from '@inertiajs/react';

export default function Welcome() {
    return (
        <>
            <Head title="Welcome | M&M" />

            {/* HERO SECTION */}
            <section className="flex w-full flex-col items-center justify-center px-4 py-16 text-center md:py-24">
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-rose-100 bg-rose-50 px-3 py-1 text-xs font-medium text-rose-700">
                    <svg
                        className="h-3.5 w-3.5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                    >
                        <path d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3Z" />
                    </svg>
                    Exclusively for Us
                </div>

                <h2 className="mb-6 max-w-3xl text-4xl leading-[1.1] font-extrabold tracking-tighter text-gray-950 md:text-5xl lg:text-6xl">
                    Connecting our worlds,{' '}
                    <span className="text-rose-600">one message</span> at a
                    time.
                </h2>

                <p className="mb-10 max-w-xl text-base leading-relaxed text-gray-600 md:text-lg">
                    A secure, intimate, and elegant messaging experience
                    designed specifically for Miyah and Makana. Your private
                    conversations, always close at hand.
                </p>

                <div className="flex flex-col items-center gap-4 sm:flex-row">
                    <Link
                        href="/app"
                        className="w-full rounded-xl bg-gray-950 px-8 py-3.5 text-base font-semibold text-white shadow-md transition duration-150 hover:bg-gray-800 sm:w-auto"
                    >
                        Launch Web App
                    </Link>
                    <a
                        href="#features"
                        className="w-full rounded-xl px-8 py-3.5 font-medium text-gray-700 transition duration-150 hover:bg-gray-50 sm:w-auto"
                    >
                        Learn More →
                    </a>
                </div>
            </section>

            {/* FEATURES SECTION */}
            <section id="features" className="w-full px-4 py-4">
                <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 md:grid-cols-3">
                    {/* Feature 1 */}
                    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:border-gray-200 hover:shadow-md">
                        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-blue-100 bg-blue-50">
                            <svg
                                className="h-6 w-6 text-blue-600"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
                                />
                            </svg>
                        </div>
                        <h3 className="mb-2 text-lg font-semibold text-gray-950">
                            Total Privacy
                        </h3>
                        <p className="text-sm leading-relaxed text-gray-600">
                            Built from the ground up to ensure only Miyah and
                            Makana can access this space. Your privacy is
                            paramount.
                        </p>
                    </div>

                    {/* Feature 2 */}
                    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:border-gray-200 hover:shadow-md">
                        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-rose-100 bg-rose-50">
                            <svg
                                className="h-6 w-6 text-rose-600"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                                />
                            </svg>
                        </div>
                        <h3 className="mb-2 text-lg font-semibold text-gray-950">
                            Focused Experience
                        </h3>
                        <p className="text-sm leading-relaxed text-gray-600">
                            No distractions, no ads, no complexity. Just you,
                            your wife, and the messages that matter most.
                        </p>
                    </div>

                    {/* Feature 3 */}
                    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:border-gray-200 hover:shadow-md">
                        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-amber-100 bg-amber-50">
                            <svg
                                className="h-6 w-6 text-amber-600"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                />
                            </svg>
                        </div>
                        <h3 className="mb-2 text-lg font-semibold text-gray-950">
                            Instant Sync
                        </h3>
                        <p className="text-sm leading-relaxed text-gray-600">
                            Optimized for real-time delivery across web and
                            mobile. Never miss a moment with your partner.
                        </p>
                    </div>
                </div>
            </section>

            {/* CHAT PREVIEW SECTION */}
            <section className="flex w-full flex-col items-center px-4 py-16">
                <h3 className="mb-4 text-3xl font-bold tracking-tight text-gray-950">
                    A Space Just for Us
                </h3>
                <p className="mb-12 max-w-lg text-center text-gray-600">
                    A sneak peek at the interface—simple, fast, and full of
                    character.
                </p>

                <div className="flex h-[400px] w-full max-w-2xl flex-col rounded-3xl border border-gray-100 bg-white p-3 shadow-xl">
                    {/* Chat Header */}
                    <div className="flex items-center gap-3 border-b border-gray-100 p-4">
                        <img
                            src="https://api.dicebear.com/8.x/notionists/svg?seed=Miyah&backgroundColor=ffdfbf"
                            alt="Miyah Avatar"
                            className="h-10 w-10 rounded-full border border-rose-100 bg-rose-50"
                        />
                        <div>
                            <div className="font-semibold text-gray-950">
                                Miyah
                            </div>
                            <div className="text-xs font-medium text-green-600">
                                Online
                            </div>
                        </div>
                    </div>

                    {/* Chat Bubbles */}
                    <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-4">
                        <div className="max-w-xs self-start rounded-2xl rounded-bl-none bg-gray-100 p-3 text-sm text-gray-800">
                            Hi Makana! How is your day going? ❤️
                        </div>
                        <div className="max-w-xs self-end rounded-2xl rounded-br-none bg-gray-950 p-3 text-sm text-white">
                            Hey beautiful! It's going great. Busy, but thinking
                            of you! How about you? 😊
                        </div>
                        <div className="max-w-xs self-start rounded-2xl rounded-bl-none bg-gray-100 p-3 text-sm text-gray-800">
                            Everything is good! Can't wait for dinner tonight!
                        </div>
                        <div className="max-w-xs self-end rounded-2xl rounded-br-none bg-gray-950 p-3 text-sm text-white">
                            Same here! I'll be home soon. I love you!
                        </div>
                    </div>

                    {/* Chat Input */}
                    <div className="flex items-center gap-2 border-t border-gray-100 p-3">
                        <div className="flex-1 rounded-xl bg-gray-50 p-3 text-sm text-gray-500">
                            Type a message...
                        </div>
                        <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-950 text-white">
                            <svg
                                className="h-5 w-5"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="2"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            </section>
        </>
    );
}
