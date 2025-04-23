import React, {
    createContext,
    useContext,
    useEffect,
    useRef,
    useState,
    useId,
} from 'react';
import { createPortal } from 'react-dom';
import Transition from './Transition';
import { useFocusTrap } from "@/useFocusTrap.jsx";

const DialogContext = createContext(null);

const Dialog = ({
                    isOpen,
                    onClose,
                    initialFocusRef,
                    children,
                    className = '',
                    enter = "ease-out duration-300",
                    enterFrom = "opacity-0",
                    enterTo = "opacity-100",
                    leave = "ease-in duration-200",
                    leaveFrom = "opacity-100",
                    leaveTo = "opacity-0",
                }) => {
    const [portalContainer, setPortalContainer] = useState(null);
    const panelRef = useRef(null);
    const dialogId = useId();
    const titleId = `dialog-title-${dialogId}`;
    const descriptionId = `dialog-description-${dialogId}`;
    const [hasTitle, setHasTitle] = useState(false);
    const [hasDescription, setHasDescription] = useState(false);

    useEffect(() => {
        const div = document.createElement('div');
        div.className = `dialog-portal-container ${className}`;
        document.body.appendChild(div);
        setPortalContainer(div);
        return () => {
            if (div.parentNode === document.body) {
                document.body.removeChild(div);
            }
            setPortalContainer(null);
        };
    }, [className]);

    useFocusTrap(panelRef, isOpen);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Escape' && isOpen) {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    useEffect(() => {
        if (isOpen && initialFocusRef?.current) {
            const timer = setTimeout(() => {
                initialFocusRef.current?.focus();
            }, 0);
            return () => clearTimeout(timer);
        }
    }, [isOpen, initialFocusRef]);

    const contextValue = {
        isOpen,
        onClose,
        panelRef,
        titleId,
        descriptionId,
        registerTitle: () => setHasTitle(true),
        registerDescription: () => setHasDescription(true),
    };

    if (!portalContainer) {
        return null;
    }

    return createPortal(
        <DialogContext.Provider value={contextValue}>
            <Transition show={isOpen} appear unmount={true}>
                {(transitionClasses) => (
                    <div className={`fixed inset-0 z-50 overflow-y-auto ${transitionClasses}`}>
                        {children}
                    </div>
                )}
            </Transition>
        </DialogContext.Provider>,
        portalContainer
    );
};

const DialogOverlay = ({
                           className = 'fixed inset-0 bg-black/30',
                           enter = "ease-out duration-300",
                           enterFrom = "opacity-0",
                           enterTo = "opacity-100",
                           leave = "ease-in duration-200",
                           leaveFrom = "opacity-100",
                           leaveTo = "opacity-0",
                           ...props
                       }) => {
    const { onClose, isOpen } = useContext(DialogContext);

    const handleClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <Transition
            show={isOpen}
            appear={true}
            unmount={false}
            enter={enter}
            enterFrom={enterFrom}
            enterTo={enterTo}
            leave={leave}
            leaveFrom={leaveFrom}
            leaveTo={leaveTo}
        >
            {(transitionClasses) => (
                <div
                    className={`${className} ${transitionClasses}`}
                    onClick={handleClick}
                    aria-hidden="true"
                    {...props}
                />
            )}
        </Transition>
    );
};

const DialogPanel = ({
                         as: Component = 'div',
                         children,
                         className = 'relative mx-auto my-8 max-w-md transform rounded-xl bg-white p-6 shadow-xl',
                         enter = "ease-out duration-300",
                         enterFrom = "opacity-0 scale-95",
                         enterTo = "opacity-100 scale-100",
                         leave = "ease-in duration-200",
                         leaveFrom = "opacity-100 scale-100",
                         leaveTo = "opacity-0 scale-95",
                         ...props
                     }) => {
    const { panelRef, isOpen, titleId, descriptionId, hasTitle, hasDescription } = useContext(DialogContext);

    const handleClick = (e) => {
        e.stopPropagation();
    };

    const ariaAttributes = {
        role: "dialog",
        'aria-modal': "true",
        ...(hasTitle && { 'aria-labelledby': titleId }),
        ...(hasDescription && { 'aria-describedby': descriptionId }),
    };

    return (
        <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition
                show={isOpen}
                appear={true}
                unmount={false}
                enter={enter}
                enterFrom={enterFrom}
                enterTo={enterTo}
                leave={leave}
                leaveFrom={leaveFrom}
                leaveTo={leaveTo}
            >
                {(transitionClasses) => (
                    <Component
                        ref={panelRef}
                        className={`${className} ${transitionClasses}`}
                        onClick={handleClick}
                        {...ariaAttributes}
                        {...props}
                    >
                        {children}
                    </Component>
                )}
            </Transition>
        </div>
    );
};

const DialogTitle = ({ as: Component = 'h3', className = 'text-lg font-medium leading-6 text-gray-900', children, ...props }) => {
    const { titleId, registerTitle } = useContext(DialogContext);

    useEffect(() => {
        registerTitle();
    }, [registerTitle]);

    return (
        <Component id={titleId} className={className} {...props}>
            {children}
        </Component>
    );
};

const DialogDescription = ({ as: Component = 'p', className = 'text-sm text-gray-500 mt-2', children, ...props }) => {
    const { descriptionId, registerDescription } = useContext(DialogContext);

    useEffect(() => {
        registerDescription();
    }, [registerDescription]);

    return (
        <Component id={descriptionId} className={className} {...props}>
            {children}
        </Component>
    );
};

Dialog.Overlay = DialogOverlay;
Dialog.Panel = DialogPanel;
Dialog.Title = DialogTitle;
Dialog.Description = DialogDescription;

export default Dialog;
