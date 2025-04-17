import { UserGroupIcon } from "@heroicons/react/24/solid";

const GroupAvatar = () => {
    return (
        <>
            <div className={`avatar placeholder`}>
                <div className={`bg-neutral-400 text-neutral-800 rounded-full w-8 grid place-items-center place-content-center`}>
                    <UserGroupIcon className="w-5 h-5"/>
                </div>
            </div>
        </>
    );
};

export default GroupAvatar;
