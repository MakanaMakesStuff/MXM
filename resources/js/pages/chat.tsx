import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Bell, CircleOff } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { logout } from '@/routes';

// Define the shape of our data
interface Message {
    id: number;
    user_id: number;
    body: string;
    created_at: string;
    user?: {
        id: number;
        name: string;
    };
}

export default function App({
    messages: initialMessages,
}: {
    messages: Message[];
}) {
    const subscribeUserToPush = async () => {
        try {
            const registration =
                await navigator.serviceWorker.register('/sw.js');
            const permission = await Notification.requestPermission();

            if (permission !== 'granted') {
                return;
            }

            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(
                    import.meta.env.VITE_VAPID_PUBLIC_KEY,
                ),
            });

            // Convert the complex subscription object into a plain JSON object
            const sb = subscription.toJSON();

            // Send the fields exactly how your web.php route expects them
            await window.axios.post('/notifications/subscribe', {
                endpoint: sb.endpoint,
                publicKey: sb.keys?.p256dh, // Extract from the 'keys' object
                authToken: sb.keys?.auth, // Extract from the 'keys' object
                contentEncoding: 'aes128gcm', // This is the missing piece!
            });

            console.log('Successfully subscribed!');
        } catch (error) {
            console.error('Push error:', error);
        }
    };

    // Helper function needed to format the VAPID key
    function urlBase64ToUint8Array(base64String: string) {
        const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
        const base64 = (base64String + padding)
            .replace(/-/g, '+')
            .replace(/_/g, '/');
        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);

        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }

        return outputArray;
    }

    const { auth } = usePage().props as any; // The currently logged-in user
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const scrollBottomRef = useRef<HTMLDivElement>(null);

    // We put the Inertia props into local state so we can append real-time messages
    const [messages, setMessages] = useState<Message[]>(initialMessages);

    const { data, setData, post, processing, reset } = useForm({
        body: '',
    });

    const [personIsOnline, setPersonIsOnline] = useState(false);
    const [personIsTyping, setPersonIsTyping] = useState(false);

    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
        setData('body', e.target.value);

        if (window.Echo) {
            window.Echo.join('our-space').whisper('typing', {
                userID: auth.user.id,
            });
        }
    };

    // 1. Listen for new messages on the private channel
    useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }

        if (window.Echo) {
            window.Echo.join('our-space')
                .here((users: any) => {
                    console.log('Users connected:', users?.length);
                })
                .joining((user: any) => {
                    if (user.id !== auth.user.id) {
                        setPersonIsOnline(true);
                    }
                })
                .leaving((user: any) => {
                    if (user.id !== auth.user.id) {
                        setPersonIsOnline(false);
                    }
                })
                .listenForWhisper('typing', (e: any) => {
                    const isPartnerTyping = e.userID !== auth.user.id;

                    if (!isPartnerTyping) {
                        return;
                    }

                    setPersonIsTyping(true);

                    if (typingTimeoutRef.current) {
                        clearTimeout(typingTimeoutRef.current);
                    }

                    typingTimeoutRef.current = setTimeout(
                        () => setPersonIsTyping(false),
                        3000,
                    );
                })
                .listen('.MessageSent', (e: any) => {
                    if (e.message.user_id === auth.user.id) {
                        console.log(
                            'Received our own message back from the server, ignoring...',
                        );

                        return;
                    }

                    console.log('MESSAGE RECEIVED!', e);
                    setMessages((prev) => [...prev, e.message]);
                })
                .error((error: any) => console.error('Socket error:', error));
        }

        return () => {
            if (window.Echo) {
                window.Echo.leave('our-space');
            }
        };
    }, [auth.user.id]);

    // 2. Auto-scroll to bottom whenever messages change
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop =
                chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    const submitMessage = (e: React.FormEvent) => {
        e.preventDefault();

        if (!data.body.trim()) {
            return;
        }

        // Optimistically add our own message to the UI instantly so it feels blazing fast
        const tempMessage: Message = {
            id: Date.now(), // Temporary ID
            user_id: auth.user.id,
            body: data.body,
            created_at: new Date().toISOString(),
            user: auth.user,
        };

        setMessages((prev) => [...prev, tempMessage]);

        setTimeout(() => {
            scrollBottomRef.current?.scrollIntoView({ behavior: 'auto' });
        }, 0);

        // Send to the server in the background
        post('/chat/messages', {
            preserveScroll: true,
            onSuccess: () => reset('body'),
        });
    };

    // Determine the partner's name for the UI
    const partnerName = auth.user.name?.includes('Makana') ? 'Miyah' : 'Makana';

    return (
        <div className="flex h-auto w-full flex-col bg-gray-50">
            <Head title="Our Space | M&M" />

            <div className="mx-auto flex h-full w-full flex-col border-x border-gray-100 bg-white shadow-sm">
                {/* --- HEADER --- */}
                <div className="sticky top-0 z-10 flex items-center gap-3 border-b border-gray-100 bg-white p-4">
                    <img
                        src={`https://api.dicebear.com/8.x/notionists/svg?seed=${partnerName}&backgroundColor=ffdfbf`}
                        alt={`${partnerName}'s Avatar`}
                        className="h-10 w-10 rounded-full border border-rose-100 bg-rose-50"
                    />
                    <div className="flex flex-col">
                        <h1 className="mb-1 text-sm leading-none font-bold text-gray-950">
                            {partnerName}
                        </h1>
                        <div className="flex items-center gap-1.5">
                            {personIsOnline ? (
                                <span className="relative flex h-2 w-2">
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
                                </span>
                            ) : (
                                <CircleOff className="relative flex h-2 w-2 text-gray-400" />
                            )}
                            <span
                                className={`text-[10px] font-semibold tracking-wider uppercase ${personIsOnline ? 'text-green-600' : 'text-gray-400'}`}
                            >
                                {personIsOnline ? 'Online' : 'Offline'}
                            </span>
                        </div>
                    </div>

                    <div className="ml-auto flex flex-row items-center gap-4">
                        <span className="hidden text-sm text-gray-500 md:inline">
                            Welcome, {auth.user.name}
                        </span>

                        <Link
                            href={logout()}
                            className="cursor-pointer rounded-lg bg-gray-950 px-4 py-2 text-sm font-medium text-white shadow-sm transition duration-150 hover:bg-gray-800"
                        >
                            Logout
                        </Link>

                        <button
                            onClick={subscribeUserToPush}
                            title="Enable Notifications"
                            className="cursor-pointer rounded-lg p-2 text-sm text-black transition duration-150 hover:bg-gray-100"
                        >
                            <Bell className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                <div
                    ref={chatContainerRef}
                    className="flex flex-1 flex-col gap-3 overflow-y-auto p-4"
                >
                    {messages.length === 0 ? (
                        <div className="flex h-full items-center justify-center text-sm text-gray-400">
                            No messages yet. Say hello! 👋
                        </div>
                    ) : (
                        messages.map((message) => {
                            const isMine = message.user_id === auth.user.id;

                            return (
                                <div
                                    key={message.id}
                                    className={`max-w-[80%] p-3 text-sm leading-relaxed md:max-w-[70%] ${
                                        isMine
                                            ? 'self-end rounded-2xl rounded-br-none bg-gray-950 text-white shadow-sm'
                                            : 'self-start rounded-2xl rounded-bl-none bg-gray-100 text-gray-800 shadow-sm'
                                    }`}
                                >
                                    {message.body}
                                </div>
                            );
                        })
                    )}

                    {personIsTyping && (
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                            ...typing
                        </div>
                    )}

                    <div ref={scrollBottomRef} className="h-0" />
                </div>

                {/* --- INPUT AREA --- */}
                <form
                    onSubmit={submitMessage}
                    className="sticky bottom-0 flex items-center gap-2 border-t border-gray-100 bg-white p-3"
                >
                    <input
                        type="text"
                        value={data.body}
                        onChange={handleTyping}
                        placeholder="Type a message..."
                        className="flex-1 rounded-xl bg-gray-50 p-3 text-sm text-gray-900 transition outline-none focus:border-rose-300 focus:ring-1 focus:ring-rose-300"
                        autoComplete="off"
                        autoFocus
                    />
                    <button
                        type="submit"
                        disabled={processing || !data.body.trim()}
                        className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-950 text-white transition hover:bg-gray-800 active:scale-95 disabled:opacity-50"
                    >
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
                </form>
            </div>
        </div>
    );
}
