import {Link, usePage} from "@inertiajs/react";
import {Bars4Icon, ChevronDownIcon} from "@heroicons/react/24/solid/index.js";
import Dropdown from "@/Components/Dropdown.jsx";
import NavButton from "@/Components/NavButton.jsx";
import {useState} from "react";

export default function HeaderLayout({user = null}) {
    const {auth} = usePage().props;
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

    return (
        <div className="bg-neutral-100 dark:bg-neutral-900">
            {user !== null && (
                <nav className="border-b border-neutral-200 bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800">
                    <div className="mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex h-14 justify-between">
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
                                            <div className="bg-black/25 rounded-md backdrop-blur-lg shadow-lg">
                                                {auth.is_organisation_owner && (
                                                    <Dropdown.Link href="/organisation" method="get" as="button"
                                                                   className="rounded-t-md bg-white/5 backdrop-blur-lg border border-b-0 border-white/25">
                                                        Organisation
                                                    </Dropdown.Link>
                                                )}
                                                <Dropdown.Link href="/profile" method="get" as="button"
                                                               className={`bg-white/5 backdrop-blur-lg border ${auth.is_organisation_owner ? "border-t-0" : "rounded-t-md"} border-b-0 border-white/25`}>
                                                    Profile
                                                </Dropdown.Link>
                                                <Dropdown.Link href="/logout" method="post" as="button"
                                                               className="rounded-b-md bg-white/5 backdrop-blur-lg border border-t-0 border-white/25">
                                                    Log Out
                                                </Dropdown.Link>
                                            </div>
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
                                <Link href="/profile">
                                    <div className="text-base font-medium text-neutral-800 dark:text-neutral-100">
                                        {user.name}
                                    </div>
                                    <div className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                                        {user.email}
                                    </div>
                                </Link>
                            </div>
                        </div>
                        {auth.is_organisation_owner && (
                            <div className="border-t border-neutral-200 pb-1 pt-4 dark:border-neutral-600">
                                <div className="px-4">
                                    <Link href="/organisation">
                                        <div className="text-base font-medium text-neutral-800 dark:text-neutral-100">
                                            {auth.organisation.name}
                                        </div>
                                        <div className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                                            Organisation
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                </nav>
            )}
            {user ? '' : (
                <div className="flex">
                    <div className="flex shrink-0 items-center">
                        <Link href="/">
                            <h1 className="text-neutral-800 dark:text-neutral-100 font-semibold">LaraWhisper</h1>
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}
