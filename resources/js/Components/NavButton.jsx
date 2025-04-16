import { Link } from '@inertiajs/react';

export default function NavButton({ active = false, className = '', children, ...props }) {
    return (
        <Link
            {...props}
            className={`flex w-full items-start border-l-4 py-2 pe-4 ps-3 ${
                active
                    ? 'border-neutral-500 bg-neutral-100 text-neutral-800 focus:border-neutral-700 focus:bg-neutral-200 focus:text-neutral-900 dark:border-neutral-400 dark:bg-neutral-900/50 dark:text-neutral-200 dark:focus:border-neutral-300 dark:focus:bg-neutral-800 dark:focus:text-neutral-100'
                    : 'border-transparent text-neutral-600 hover:border-neutral-300 hover:bg-neutral-50 hover:text-neutral-800 focus:border-neutral-400 focus:bg-neutral-50 focus:text-neutral-800 dark:text-neutral-400 dark:hover:border-neutral-600 dark:hover:bg-neutral-700 dark:hover:text-neutral-200 dark:focus:border-neutral-600 dark:focus:bg-neutral-700 dark:focus:text-neutral-200'
            } text-base font-medium transition duration-150 ease-in-out focus:outline-none ${className}`}
        >
            {children}
        </Link>
    );
}
