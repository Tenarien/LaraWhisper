import React, { useState, useEffect, useRef } from "react";
import {
    EllipsisVerticalIcon,
    LockClosedIcon,
    LockOpenIcon,
    ShieldCheckIcon,
    UserIcon,
} from "@heroicons/react/24/solid";

export default function UserOptionsDropdown({ conversation }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownNode = useRef();

    const changeUserRole = () => {
        // TODO
    };

    const onBlockUser = () => {
        // TODO
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownNode.current && !dropdownNode.current.contains(e.target)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    const transitionClasses = "transition ease-out duration-100 transform";
    const openClasses = "opacity-100 scale-100";
    const closedClasses = "opacity-0 scale-95 pointer-events-none";

    return (
        <div ref={dropdownNode} className="relative inline-block text-left text-neutral-200">
            <div>
                <button
                    type="button"
                    onClick={(e) => {
                        e.preventDefault();
                        setIsOpen(!isOpen);
                    }}
                    className="flex justify-center items-center w-8 h-8 rounded-full hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-neutral-800 focus:ring-white"
                    aria-haspopup="true"
                    aria-expanded={isOpen}
                >
                    <EllipsisVerticalIcon className="h-6 w-6" />
                </button>
            </div>

            <div
                className={`absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-neutral-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50 ${transitionClasses} ${
                    isOpen ? openClasses : closedClasses
                }`}
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="menu-button"
                tabIndex="-1"
            >
                {isOpen && (
                    <>
                        {conversation.is_user && (
                            <div className="px-1 py-1" role="none">
                                <button
                                    onClick={onBlockUser}
                                    className="group flex w-full items-center rounded-md px-2 py-2 text-sm text-neutral-200 hover:bg-neutral-700 disabled:opacity-50 text-left"
                                    role="menuitem"
                                    tabIndex="-1"
                                >
                                    {conversation.blocked_at ? (
                                        <>
                                            <LockOpenIcon className="w-6 h-6 mr-2" aria-hidden="true" />
                                            Unblock User
                                        </>
                                    ) : (
                                        <>
                                            <LockClosedIcon className="w-6 h-6 mr-2" aria-hidden="true" />
                                            Block User
                                        </>
                                    )}
                                </button>
                            </div>
                        )}

                        {conversation.is_user && (
                            <div className="px-1 py-1" role="none">
                                <button
                                    onClick={changeUserRole}
                                    className="group flex w-full items-center rounded-md px-2 py-2 text-sm text-neutral-200 hover:bg-neutral-700 disabled:opacity-50 text-left"
                                    role="menuitem"
                                    tabIndex="-1"
                                >
                                    {conversation.is_admin ? (
                                        <>
                                            <UserIcon className="w-6 h-6 mr-2" aria-hidden="true" />
                                            Make Regular User
                                        </>
                                    ) : (
                                        <>
                                            <ShieldCheckIcon className="w-6 h-6 mr-2" aria-hidden="true" />
                                            Make Admin
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
