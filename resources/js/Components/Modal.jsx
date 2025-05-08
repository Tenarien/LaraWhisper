import React, { useEffect } from 'react';
import {XMarkIcon} from "@heroicons/react/24/solid";

const MAX_WIDTH_CLASSES = {
    sm: 'sm:max-w-sm',
    md: 'sm:max-w-md',
    lg: 'sm:max-w-lg',
    xl: 'sm:max-w-xl',
    '2xl': 'sm:max-w-2xl',
};

export default function Modal({children, show = false, maxWidth = '2xl', closeable = true, onClose = () => {}}) {
    const maxWidthClass = MAX_WIDTH_CLASSES[maxWidth] || MAX_WIDTH_CLASSES['2xl'];

    useEffect(() => {
        if (show) {
            document.body.classList.add('overflow-hidden');
        } else {
            document.body.classList.remove('overflow-hidden');
        }
        return () => {
            document.body.classList.remove('overflow-hidden');
        };
    }, [show]);

    useEffect(() => {
        const handleKey = (e) => {
            if (e.key === 'Escape' && closeable) {
                onClose();
            }
        };
        if (show) {
            document.addEventListener('keydown', handleKey);
            return () => document.removeEventListener('keydown', handleKey);
        }
    }, [show, closeable, onClose]);

    if (!show) return null;

    return (
        <div className="fixed inset-0 overflow-y-auto px-4 py-6 sm:px-0 z-50">
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-xs"
                onClick={() => { closeable && onClose(); }}
            />

            <div className="flex items-center justify-center min-h-screen text-center sm:p-0">
                <div
                    role="dialog"
                    aria-modal="true"
                    className={`
            inline-block align-bottom bg-neutral-700 rounded-lg text-left overflow-hidden
            shadow-lg transform transition-all
            sm:my-8 sm:align-middle w-full ${maxWidthClass}
          `}
                >
                    {closeable && (
                        <div className="px-3 pt-2 pb-1 bg-neutral-800 text-right">
                            <button
                                type="button"
                                className="bg-black/50 rounded-md text-neutral-600 hover:text-neutral-300 focus:outline-none"
                                onClick={onClose}
                            >
                                <span className="sr-only">Close</span>
                                <XMarkIcon className="w-7 h-7"/>
                            </button>
                        </div>
                    )}

                    {children}
                </div>
            </div>
        </div>
    );
}
