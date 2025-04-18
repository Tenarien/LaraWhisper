import { useState } from 'react';
import NavButton from "@/Components/NavButton.jsx";
import Dropdown from "@/Components/Dropdown.jsx";
import { Link, usePage } from "@inertiajs/react";
import {ChevronDownIcon} from "@heroicons/react/24/solid";
import {Bars4Icon} from "@heroicons/react/24/solid";

export default function AuthLayout({ children }) {
    const user = usePage().props.auth.user;

    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

    return (
        <div className="min-h-screen bg-neutral-100 dark:bg-neutral-900">
            <nav className="border-b border-neutral-200 bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800">
                <div className="mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">
                        <div className="flex">
                            <div className="flex shrink-0 items-center">
                                <Link href="/">
                                    <h1 className="text-neutral-800 dark:text-neutral-100 font-semibold">LaraWhisper</h1>
                                </Link>
                            </div>
                        </div>

                        <div className="hidden sm:ms-6 sm:flex sm:items-center">
                            <div className="relative ms-3">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <div className="tooltip tooltip-left" data-tip="Profile Options">
                                            <span className="inline-flex rounded-md">
                                                <button
                                                    type="button"
                                                    className="inline-flex items-center rounded-md border border-transparent bg-neutral-50 px-3 py-2 text-sm font-medium leading-4 text-neutral-600 transition duration-150 ease-in-out hover:text-neutral-800 focus:outline-none dark:bg-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200"
                                                >
                                                    {user.name}

                                                    <ChevronDownIcon className="w-3 h-3"/>
                                                </button>
                                            </span>
                                        </div>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <Dropdown.Link href="/profile/edit" method="get" as="button">
                                            Profile
                                        </Dropdown.Link>
                                        <Dropdown.Link href="/logout" method="post" as="button">
                                            Log Out
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        <div className="-me-2 flex items-center sm:hidden">
                            <button
                                onClick={() =>
                                    setShowingNavigationDropdown((previousState) => !previousState)
                                }
                                className="inline-flex items-center justify-center rounded-md p-2 text-neutral-500 transition duration-150 ease-in-out hover:bg-neutral-100 hover:text-neutral-700 focus:bg-neutral-100 focus:text-neutral-700 focus:outline-none dark:text-neutral-400 dark:hover:bg-neutral-900 dark:hover:text-neutral-300 dark:focus:bg-neutral-900 dark:focus:text-neutral-300"
                            >
                                <Bars4Icon className="w-5 h-5"/>
                            </button>
                        </div>
                    </div>
                </div>

                <div className={(showingNavigationDropdown ? 'block' : 'hidden') + ' sm:hidden'}>
                    <div className="mt-3 space-y-1">
                        <NavButton method="post" href={'/logout'} as="button">
                            Log Out
                        </NavButton>
                    </div>

                    <div className="border-t border-neutral-200 pb-1 pt-4 dark:border-neutral-600">
                        <div className="px-4">
                            <div className="text-base font-medium text-neutral-800 dark:text-neutral-100">
                                {user.name}
                            </div>
                            <div className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                                {user.email}
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <main>{children}</main>
        </div>
    );
}
