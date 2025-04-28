import React, { Fragment, useEffect, useMemo, useState } from "react";
import { isAudio, isImage, isPDF, isPreviewable, isVideo } from "@/helpers.jsx";
import Dialog from "@/Components/Dialog.jsx";
import { ChevronLeftIcon, ChevronRightIcon, PaperClipIcon, XMarkIcon } from "@heroicons/react/24/solid";


export default function AttachmentPreviewModal({ attachments= [], index = 0, show = false, onClose = () => {} }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const previewableAttachments = useMemo(() => {
        return attachments.filter((a) => isPreviewable(a));
    }, [attachments]);

    const attachment = useMemo(() => {
        return previewableAttachments[currentIndex];
    }, [attachments, currentIndex]);



    const close = () => {
        onClose();
    };

    const prev = () => {
        if (currentIndex === 0) return;

        setCurrentIndex(currentIndex - 1);
    };

    const next = () => {
        if (currentIndex === previewableAttachments.length - 1) return;

        setCurrentIndex(currentIndex + 1);
    };

    useEffect(() => {
        setCurrentIndex(index);
    }, [index]);

    return (
        <Dialog
            isOpen={show}
            onClose={close}
        >
            <Dialog.Overlay className="fixed inset-0 bg-black/80" />

            <Dialog.Panel
                className="fixed inset-0 flex flex-col w-full h-full transform overflow-hidden text-left align-middle shadow-xl"
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
            >
                {/* Close button */}
                <button
                    onClick={close}
                    className="absolute right-3 top-3 w-10 h-10 bg-neutral-800 rounded-full hover:bg-black/30 transition flex items-center justify-center text-neutral-100 z-40"
                >
                    <XMarkIcon className="w-6 h-6" />
                </button>

                {/* Content Area */}
                <div className="relative group h-full flex-grow flex items-center justify-center">

                    {/* Previous Button */}
                    {currentIndex > 0 && (
                        <div
                            onClick={prev}
                            className="absolute text-neutral-100 cursor-pointer opacity-100 flex items-center justify-center
                                             w-16 h-16 left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/50 z-30"
                        >
                            <ChevronLeftIcon className="w-10 h-10" />
                        </div>
                    )}

                    {/* Next Button */}
                    {currentIndex < previewableAttachments.length - 1 && (
                        <div
                            onClick={next}
                            className="absolute text-neutral-100 cursor-pointer opacity-100 flex items-center justify-center
                                             w-16 h-16 right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/50 z-30"
                        >
                            <ChevronRightIcon className="w-10 h-10" />
                        </div>
                    )}

                    {/* Attachment Display Area */}
                    {attachment && (
                        <div className="flex items-center justify-center w-full h-full p-3">
                            {isImage(attachment) && (
                                <img src={attachment.url} className="max-w-full max-h-full" alt=""/>
                            )}
                            {isVideo(attachment) && (
                                <div className="flex items-center">
                                    <video
                                        src={attachment.url}
                                        controls
                                        autoPlay
                                    ></video>
                                </div>
                            )}
                            {isAudio(attachment) && (
                                <div className="relative flex justify-center items-center">
                                    <audio
                                        src={attachment.url}
                                        controls
                                        autoPlay
                                    ></audio>
                                </div>
                            )}
                            {isPDF(attachment) && (
                                <iframe
                                    src={attachment.url}
                                    className="w-full h-full"
                                ></iframe>
                            )}
                            {!isPreviewable(attachment) && (
                                <div className="flex flex-col items-center justify-center text-neutral-100 p-32">
                                    <PaperClipIcon className="w-10 h-10 mb-3" />
                                    <small>{attachment.name}</small>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </Dialog.Panel>
        </Dialog>
    );
};
