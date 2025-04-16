import { useEffect } from 'react';

interface NotificationProps {
    message: string;
    type: 'success' | 'error';
    onClose: () => void;
    autoHideDuration?: number;
}

export default function Notification({ message, type, onClose, autoHideDuration = 5000 }: NotificationProps) {
    useEffect(() => {
        if (autoHideDuration > 0) {
            const timer = setTimeout(() => {
                onClose();
            }, autoHideDuration);

            return () => clearTimeout(timer);
        }
    }, [onClose, autoHideDuration]);

    return (
        <div
            className={`animate-fade-in fixed top-4 right-4 z-50 flex items-center space-x-3 rounded-md p-4 shadow-lg ${
                type === 'success' ? 'bg-green-500' : 'bg-red-500'
            }`}
        >
            {/* Icon */}
            <div className="flex-shrink-0">
                {type === 'success' ? (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="h-6 w-6 text-white"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                ) : (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="h-6 w-6 text-white"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                        />
                    </svg>
                )}
            </div>

            {/* Message */}
            <div className="font-medium text-white">{message}</div>

            {/* Close button */}
            <button onClick={onClose} className="ml-auto text-white hover:text-gray-200">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-5 w-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    );
}
