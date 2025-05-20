import React, { useState, useRef, useEffect } from "react";
import { EllipsisVerticalIcon, TrashIcon } from "@heroicons/react/24/solid";
import { useEventBus } from "@/EventBus.jsx";
import {
    useFloating,
    offset,
    flip,
    shift,
    autoUpdate,
    useClick,
    useDismiss,
    useInteractions,
} from "@floating-ui/react";
import axios from "axios";

export default function MessageDropdown({ message, hide }) {
    const [isOpen, setIsOpen] = useState(false);
    const { emit } = useEventBus();

    const referenceRef = useRef(null);
    const floatingRef  = useRef(null);

    const { x, y, strategy, context, update } = useFloating({
        placement: "bottom-end",
        open: isOpen,
        onOpenChange: setIsOpen,
        middleware: [offset(8), flip(), shift()],
        whileElementsMounted: autoUpdate,
        elements: {
            reference: referenceRef.current,
            floating:  floatingRef.current,
        },
    });

    const click   = useClick(context);
    const dismiss = useDismiss(context, { outsidePressEvent: "mousedown" });
    const { getReferenceProps, getFloatingProps } =
        useInteractions([click, dismiss]);

    useEffect(() => {
        if (isOpen && update) update();
    }, [isOpen, update, referenceRef.current, floatingRef.current]);

    const onDelete = () => {
        axios
            .delete(window.route("message.destroy", message.id))
            .then((res) => {
                emit("message.destroy", {message, prevMessage: res.data})
            })
            .finally(() => setTimeout(() => setIsOpen(false), 0))
            .catch(console.error);
    };

    const transitionClasses = "transition ease-out duration-100 transform";
    const openClasses       = "opacity-100 scale-100";
    const closedClasses     = "opacity-0 scale-95 pointer-events-none";

    return (
        <div className="absolute right-full top-1/2 z-50 -translate-y-1/2 text-neutral-200">
            <div className="relative inline-block text-neutral-200">
                {/* trigger button */}
                <div className={hide && !isOpen ? "hidden" : "block"}>
                    <button
                        ref={referenceRef}
                        {...getReferenceProps({
                            className:
                                "flex justify-center items-center w-6 h-6 rounded-full hover:bg-white/10 focus:outline-none",
                            "aria-haspopup": true,
                            "aria-expanded": isOpen,
                        })}
                    >
                        <EllipsisVerticalIcon className="h-6 w-6" />
                    </button>
                </div>

                {/* dropdown menu */}
                <div
                    ref={floatingRef}
                    {...getFloatingProps({
                        style: {
                            position: strategy,
                            top: y ?? 0,
                            left: x ?? 0,
                            width: 192,
                        },
                        className: `${transitionClasses} ${
                            isOpen ? openClasses : closedClasses
                        } rounded-md bg-black/25 backdrop-blur-lg shadow-lg z-50`,
                        role: "menu",
                    })}
                >
                    {isOpen && (
                        <button
                            onMouseDown={(e) => e.stopPropagation()}
                            onClick={onDelete}
                            className="group flex w-full items-center px-2 py-2 text-sm text-neutral-200 hover:bg-white/5 rounded-md"
                            role="menuitem"
                        >
                            <TrashIcon className="w-6 h-6 mr-2" aria-hidden="true" />
                            Delete
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
