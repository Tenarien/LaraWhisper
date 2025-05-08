import React, { useState, useRef, useEffect } from 'react';
import {XMarkIcon} from "@heroicons/react/24/solid";

export default function UserPicker({options = [], selected = [], onChange, placeholder = 'Select users...'}) {
    const [inputValue, setInputValue] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(0);
    const containerRef = useRef(null);

    // Filter out already‐selected options and by current input
    const filtered = options.filter(
        opt =>
            !selected.some(sel => sel.id === opt.id) &&
            opt.name.toLowerCase().includes(inputValue.toLowerCase())
    );

    useEffect(() => {
        function onClick(e) {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', onClick);
        return () => document.removeEventListener('mousedown', onClick);
    }, []);

    const addOption = opt => {
        onChange([...selected, opt]);
        setInputValue('');
    };

    const removeOption = id => {
        onChange(selected.filter(sel => sel.id !== id));
    };

    const onInputKeyDown = e => {
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setIsOpen(true);
                setHighlightedIndex(i => (i + 1) % filtered.length);
                break;
            case 'ArrowUp':
                e.preventDefault();
                setIsOpen(true);
                setHighlightedIndex(i =>
                    i === 0 ? filtered.length - 1 : i - 1
                );
                break;
            case 'Enter':
                e.preventDefault();
                if (isOpen && filtered[highlightedIndex]) {
                    addOption(filtered[highlightedIndex]);
                }
                break;
            case 'Backspace':
                if (inputValue === '' && selected.length > 0) {
                    e.preventDefault();
                    removeOption(selected[selected.length - 1].id);
                }
                break;
            default:
                break;
        }
    };

    return (
        <div ref={containerRef} className="relative">
            {/* Selected tags */}
            <div className="flex flex-wrap gap-1 mb-1">
                {selected.map(user => (
                    <div
                        key={user.id}
                        className="flex items-center gap-1 px-2 py-0.5 bg-neutral-600 rounded text-sm"
                    >
                        <span>{user.name}</span>
                        <button
                            type="button"
                            onClick={() => removeOption(user.id)}
                            aria-label={`Remove ${user.name}`}
                            className="text-neutral-200 hover:text-neutral-400"
                        >
                            <XMarkIcon className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>

            {/* Text input */}
            <input
                type="text"
                value={inputValue}
                placeholder={placeholder}
                onChange={e => {
                    setInputValue(e.target.value);
                    setIsOpen(true);
                    setHighlightedIndex(0);
                }}
                onFocus={() => setIsOpen(true)}
                onKeyDown={onInputKeyDown}
                aria-expanded={isOpen}
                aria-haspopup="listbox"
                aria-autocomplete="list"
                className="w-full px-3 py-2 border border-white/25 rounded focus:outline-none focus:ring focus:border-neutral-300"
            />

            {/* Dropdown */}
            {isOpen && filtered.length > 0 && (
                <ul
                    role="listbox"
                    className="absolute w-full mt-1 max-h-48 overflow-auto border border-white/25 bg-neutral-600 rounded shadow-lg z-10"
                >
                    {filtered.map((opt, idx) => (
                        <li
                            key={opt.id}
                            role="option"
                            aria-selected={highlightedIndex === idx}
                            onMouseDown={e => {
                                e.stopPropagation();
                                addOption(opt);
                            }}
                            onMouseEnter={() => setHighlightedIndex(idx)}
                            className={`px-3 py-2 cursor-pointer${highlightedIndex === idx ? 'bg-neutral-700' : 'hover:bg-neutral-700'}`}
                        >
                            {opt.name}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
