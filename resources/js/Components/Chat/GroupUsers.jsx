import { UsersIcon } from "@heroicons/react/24/solid";
import Dropdown from "@/Components/Dropdown.jsx";
import UserAvatar from "@/Components/Chat/UserAvatar.jsx";

export default function GroupUsers({ users = [] }) {
    return (
        <div>
            <div className="relative">
                <Dropdown>
                    <Dropdown.Trigger>
                        <div className="tooltip tooltip-left" data-tip="Users">
              <span className="inline-flex rounded-md">
                <button
                    type="button"
                    className="inline-flex items-center rounded-md border border-transparent text-sm font-medium leading-4 text-neutral-600 transition duration-150 ease-in-out hover:text-neutral-800 focus:outline-none dark:text-neutral-400 dark:hover:text-neutral-200"
                >
                  <UsersIcon className="w-5 h-5" />
                </button>
              </span>
                        </div>
                    </Dropdown.Trigger>

                    <Dropdown.Content>
                        <div className="flex flex-col text-neutral-100 p-2 bg-black/25 backdrop-blur-lg rounded-md border border-white/25 shadow-lg">
                            <h3 className="text-lg font-bold underline underline-offset-6 w-full text-center">
                                Users
                            </h3>

                            {/* Scrollable container */}
                            <div className="flex flex-col gap-2 mt-2 max-h-[50vh] overflow-y-auto">
                                {users.length > 0 ? (
                                    users.map((user) => (
                                        <Dropdown.Link
                                            key={user.id}
                                            href={`/user/${user.id}`}
                                            className="rounded-md"
                                        >
                                            <div className="flex gap-2 items-center">
                                                <UserAvatar user={user} />
                                                {user.name}
                                            </div>
                                        </Dropdown.Link>
                                    ))
                                ) : (
                                    <p className="text-sm italic text-neutral-400">No users.</p>
                                )}
                            </div>
                        </div>
                    </Dropdown.Content>
                </Dropdown>
            </div>
        </div>
    );
}
