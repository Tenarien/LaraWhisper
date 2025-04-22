import React, {useEffect, useRef, useState} from 'react';
import NewMessageInput from './NewMessageInput';
import axios from 'axios';
import {
    PaperClipIcon,
    PhotoIcon,
    FaceSmileIcon,
    HandThumbUpIcon,
    PaperAirplaneIcon, XCircleIcon,
} from "@heroicons/react/24/solid";
import EmojiPicker from "emoji-picker-react";

const MessageInput = ({ conversation = null }) => {
    const [newMessage, setNewMessage] = useState('');
    const [inputErrorMessage, setInputErrorMessage] = useState('');
    const [messageSending, setMessageSending] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    const [emojiOpen, setEmojiOpen] = useState(false);
    const emojiBtnRef = useRef(null);
    const emojiPanelRef = useRef(null);

    useEffect(() => {
        const onClickOutside = e => {
            if (
                emojiOpen &&
                emojiPanelRef.current &&
                !emojiPanelRef.current.contains(e.target) &&
                emojiBtnRef.current &&
                !emojiBtnRef.current.contains(e.target)
            ) {
                setEmojiOpen(false);
            }
        };
        const onKey = e => e.key === 'Escape' && setEmojiOpen(false);

        document.addEventListener('mousedown', onClickOutside);
        document.addEventListener('keydown', onKey);
        return () => {
            document.removeEventListener('mousedown', onClickOutside);
            document.removeEventListener('keydown', onKey);
        };
    }, [emojiOpen]);


    const onLike = () => {
        if (messageSending) return;

        const formData = new FormData();
        formData.append('message', "👍");

        if (conversation.is_user) {
            formData.append('receiver_id', conversation.id);
        } else if (conversation.is_group) {
            formData.append('group_id', conversation.id);
        }

        setMessageSending(true);

        axios.post(
            window.route('message.store'),
            formData,
        )
            .catch(err => {
                console.error(err);
            })
            .finally(() => {
                setMessageSending(false);
            });
    }

    const onSend = () => {
        if (messageSending) return;

        if (!newMessage.trim()) {
            setInputErrorMessage("Message is required or upload attachment.");
            return setTimeout(() => setInputErrorMessage(''), 3000);
        }

        const formData = new FormData();
        formData.append('message', newMessage);


        if (conversation.is_user) {
            formData.append('receiver_id', conversation.id);
        } else if (conversation.is_group) {
            formData.append('group_id', conversation.id);
        }

        setMessageSending(true);

        axios.post(
            window.route('message.store'),
            formData,
            {
                headers: { 'Content-Type': 'multipart/form-data' },
                onUploadProgress: e => {
                    const progress = Math.round((e.loaded / e.total) * 100);
                    setUploadProgress(progress)
                },
            }
        )
            .then((response) => {
                // console.log('Response data:', response.data);
                setNewMessage('');
            })
            .catch(err => {
                const message = err?.response?.data?.message;
                setInputErrorMessage(message || "An error occurred while sending message")
            })
            .finally(() => {
                setMessageSending(false);
                setUploadProgress(0);
            });
    };

    return (
        <div className="flex flex-wrap items-start border-t border-neutral-700 py-2">
            <div className="order-2 flex-1 xs:flex-none mt-auto xs:order-2 p-2">
                <button className="p-1 text-neutral-400 hover:text-neutral-300 relative" title="Upload a file">
                    <PaperClipIcon className="w-5"/>
                    <input type="file" multiple onChange={onFile} className="absolute inset-0 z-20 opacity-0 cursor-pointer"/>
                </button>
                <button className="p-1 text-neutral-400 hover:text-neutral-300 relative ml-2" title="Upload a picture">
                    <PhotoIcon className="w-5"/>
                    <input type="file" multiple accept="image/*" className="absolute inset-0 z-20 opacity-0 cursor-pointer"/>
                </button>
            </div>

            <div className="order-1 px-3 xs:p-0 min-w-[220px] basis-full xs:basis-0 xs:order-2 flex-1 relative">
                <div className="flex">
                    <NewMessageInput
                        value={newMessage}
                        onSend={onSend}
                        onChange={e => {setNewMessage(e.target.value)
                            if (inputErrorMessage) {
                            setInputErrorMessage('');
                            }
                        }}
                        placeholder={
                            inputErrorMessage
                                ? inputErrorMessage
                                : "Type a message…"
                        }
                        // hasError={!!inputErrorMessage}
                    />
                    <button
                        type="button"
                        onClick={onSend}
                        disabled={messageSending}
                        className="btn bg-neutral-700 rounded-l-none flex items-center px-4"
                    >
                        {messageSending
                            ? <span className="loading loading-spinner loading-xs mr-2" />
                            : <PaperAirplaneIcon className="w-5 transform" />
                        }
                        <span className="hidden sm:block">Send</span>
                    </button>
                </div>

                {!!uploadProgress && (
                    <progress
                        className="progress progress-info w-full"
                        value={uploadProgress}
                        max="100"
                    ></progress>
                )}
                {(inputErrorMessage || false) && (
                    <p className="text-xs text-red-400 mt-1">
                        {inputErrorMessage}
                    </p>
                )}
            </div>

            <div className="order-3 xs:order-3 mt-auto p-2 flex items-center">
                <div className="relative">
                    <button
                        ref={emojiBtnRef}
                        type="button"
                        onClick={() => setEmojiOpen(o => !o)}
                        className="p-1 text-neutral-400 hover:text-neutral-300"
                    >
                        <FaceSmileIcon className="w-5 h-5"/>
                    </button>

                    <div
                        ref={emojiPanelRef}
                        role="menu"
                        className={`
                          absolute right-0 bottom-full mb-2
                          w-64 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5
                          transition ease-out duration-150 transform
                          ${emojiOpen
                            ? 'opacity-100 translate-y-0'
                            : 'opacity-0 translate-y-1 pointer-events-none'}
                        `}
                    >
                        <EmojiPicker
                            theme="dark"
                            width={290}
                            height={400}
                            onEmojiClick={(e) => setNewMessage(newMessage + e.emoji)}
                        />
                    </div>
                </div>
                <button onClick={onLike} className="p-1 text-neutral-400 hover:text-neutral-300 ml-2">
                    <HandThumbUpIcon className="w-5"/>
                </button>
            </div>
        </div>
    );
}

export default MessageInput;
