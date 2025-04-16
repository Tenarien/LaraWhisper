import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Link } from '@inertiajs/react';

const DropDownContext = createContext();

const Dropdown = ({ children }) => {
    const [open, setOpen] = useState(false);
    const toggleOpen = () => setOpen(prev => !prev);
    const dropdownRef = useRef();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpen(false);
            }
        };

        if (open) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [open]);

    return (
        <DropDownContext.Provider value={{ open, setOpen, toggleOpen }}>
            <div className="relative" ref={dropdownRef}>
                {children}
            </div>
        </DropDownContext.Provider>
    );
};

const Trigger = ({ children }) => {
    const { toggleOpen } = useContext(DropDownContext);

    return (
        <div onClick={toggleOpen} className="cursor-pointer">
            {children}
        </div>
    );
};

const Content = ({
                     align = 'right',
                     width = '48',
                     contentClasses = 'py-1 bg-neutral-50 dark:bg-neutral-800',
                     children,
                 }) => {
    const { open } = useContext(DropDownContext);

    const alignmentClasses = align === 'left' ? 'start-0' : 'end-0';
    const widthClasses = width === '48' ? 'w-48' : '';

    return open ? (
        <div className={`absolute z-50 mt-2 rounded-md shadow-lg ${alignmentClasses} ${widthClasses} transition-all duration-200 ease-out`}>
            <div className={`rounded-md ring-1 ring-black ring-opacity-5 ${contentClasses}`}>
                {children}
            </div>
        </div>
    ) : null;
};

const DropdownLink = ({ className = '', children, ...props }) => {
    return (
        <Link
            {...props}
            className={`block w-full px-4 py-2 text-start text-sm leading-5 text-neutral-700 transition hover:bg-neutral-100 focus:outline-none dark:text-neutral-300 dark:hover:bg-neutral-700 ${className}`}
        >
            {children}
        </Link>
    );
};

// Attach subcomponents to main export
Dropdown.Trigger = Trigger;
Dropdown.Content = Content;
Dropdown.Link = DropdownLink;

export default Dropdown;
