const UserAvatar = ({ user, online = null, profile = false}) => {
    let onlineClass = online === true ? "avatar-online" : online === false ? "avatar-offline offline" : "";

    const sizeClass = profile ? "w-40" : "w-8";

    return (
        <>
            {user.avatar && (
                <div className={`chat-image avatar ${onlineClass}`}>
                    <div className={`rounded-full ${sizeClass}`}>
                        <img src={user.avatar} alt={user.name} />
                    </div>
                </div>
            )}
            {!user.avatar && (
                <div className={`chat-image avatar placeholder ${onlineClass}`}>
                    <div className={`bg-neutral-400 text-neutral-800 rounded-full ${sizeClass}`}>
                        <p className="text-xl text-center">{user.name.substring(0, 1)}</p>
                    </div>
                </div>
            )}
        </>
    );
}

export default UserAvatar;
