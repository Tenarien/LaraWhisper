import {useEffect, useRef} from "react";

const NewMessageInput = ({ value, onChange, onSend, placeholder, hasError }) => {
    const input = useRef();

    const baseClasses = `
    input w-full h-full
    inline-block align-middle
    rounded-r-none resize-none
    overflow-y-auto max-h-40
    focus:outline-none
  `;

    const errorClasses = hasError
        ? 'border-red-500 text-red-500 placeholder-red-400 focus:ring-red-500 focus:border-red-500'
        : 'border-neutral-600 placeholder-neutral-500 focus:ring-blue-500 focus:border-blue-500';


    const onKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            onSend();
        }
    }

    const onChangeEvent = (e) => {
        setTimeout(() => {
            adjustHeight();
        }, 10)
        onChange(e);
    }

    const adjustHeight = () => {
        setTimeout(() => {
            input.current.style.height = "auto";
            input.current.style.height = input.current.scrollHeight + 1 + "px";
        }, 100)
    }

    useEffect(() => {
        adjustHeight();
    }, [value]);

    return (
        <textarea
            ref={input}
            value={value}
            rows="1"
            placeholder={placeholder}
            onKeyDown={onKeyDown}
            onChange={(e) => onChangeEvent(e)}
            className={`${baseClasses} ${errorClasses}`}
        ></textarea>
    );
};

export default NewMessageInput;
