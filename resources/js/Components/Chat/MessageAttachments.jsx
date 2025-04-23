import {isAudio, isImage, isPDF, isPreviewable, isVideo} from "@/helpers.jsx";
import {ArrowDownTrayIcon, PaperClipIcon, PlayCircleIcon} from "@heroicons/react/24/solid";

const MessageAttachments = ({ attachments, attachmentClick }) => {

    return (
        <>
            {attachments.length > 0 && (
                <div className="mt-2 flex flex-wrap justify-end gap-1">
                    {attachments.map((attachment, index) => (
                        <div
                            onClick={(e) => attachmentClick(attachments, index)}
                            key={attachment.id}
                            className={`group flex flex-col rounded items-center justify-center text-neutral-500 relative cursor-pointer ` +
                                (isAudio(attachment) ? "w-84" : "w-32 aspect-square bg-neutral-100")}
                        >
                            {!isAudio(attachment) && (
                                <a
                                    onClick={(e) => e.stopPropagation()}
                                    download
                                    href={attachment.url}
                                    className="z-20 opacity-100 group-hover:opacity-100 transition-all w-8 h-8 flex items-center
                                    justify-center text-neutral-100 bg-neutral-700 rounded absolute right-1 top-1 cursor-pointer hover:bg-neutral-800"
                                >
                                    <ArrowDownTrayIcon className="w-5 h-5" />
                                </a>
                            )}
                            {isImage(attachment) && (
                                <img
                                    src={attachment.url}
                                    className="object-contain aspect-square object-center"
                                />
                            )}
                            {isVideo(attachment) && (
                                <div className="relative flex justify-center items-center">
                                    <PlayCircleIcon className="z-20 absolute w-16 h-16 text-neutral-100 opacity-70" />

                                    <div className="absolute left-0 top-0 w-full h-full bg-black/50 z-10"></div>
                                    <video src={attachment.url} />
                                </div>
                            )}
                            {isAudio(attachment) && (
                                <div className="relative flex justify-center items-center w-[180px] xs:w-full">
                                    <audio src={attachment.url} controls />
                                </div>
                            )}
                            {isPDF(attachment) && (
                                <div className="relative flex justify-center items-center">
                                    <div className="absolute left-0 top-0 right-0 bottom-0"></div>
                                    <iframe
                                        src={attachment.url}
                                        className="w-full h-full"
                                    ></iframe>
                                </div>
                            )}
                            {!isPreviewable(attachment) && (
                                <a
                                    onClick={(e) => e.stopPropagation()}
                                    download
                                    href={attachment.url}
                                    className="flex flex-col justify-center items-center"
                                >
                                    <PaperClipIcon className="w-10 h-10 mb-3" />
                                    <small className="text-center">{attachment.name}</small>
                                </a>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </>
    );
}

export default MessageAttachments;
