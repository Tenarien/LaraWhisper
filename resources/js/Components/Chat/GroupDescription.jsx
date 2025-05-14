import {ChevronDownIcon} from "@heroicons/react/24/solid/index.js";
import Dropdown from "@/Components/Dropdown.jsx";

export default function GroupDescription({description}) {

    return (
        <div>
            <div className="relative">
                <Dropdown>
                    <Dropdown.Trigger>
                        <div className="tooltip tooltip-left" data-tip="Group Description">
                        <span className="inline-flex rounded-md">
                            <button
                                type="button"
                                className="inline-flex items-center rounded-md border border-transparent text-sm font-medium leading-4 text-neutral-600 transition duration-150 ease-in-out hover:text-neutral-800 focus:outline-none dark:text-neutral-400 dark:hover:text-neutral-200"
                            >
                                <ChevronDownIcon className="w-5 h-5"/>
                            </button>
                        </span>
                        </div>
                    </Dropdown.Trigger>

                    <Dropdown.Content>
                        <div className="flex flex-col gap-2 text-neutral-100 p-4 bg-black/25 backdrop-blur-lg rounded-md border border-white/25 shadow-lg">
                            <h3 className="text-lg font-bold underline underline-offset-6 w-full text-center">Description</h3>
                            <p className="font-semibold mt-2">{description}</p>
                        </div>

                    </Dropdown.Content>
                </Dropdown>
            </div>
        </div>
    );
}
