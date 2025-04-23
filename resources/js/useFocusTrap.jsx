import { useEffect, useRef } from 'react';

const FOCUSABLE_SELECTORS = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
    'details summary:not([disabled])',
    'audio[controls]',
    'video[controls]',
    '[contenteditable]:not([contenteditable="false"])'
].join(',');

export function useFocusTrap(containerRef, active) {
    const previouslyFocusedElement = useRef(null);

    useEffect(() => {
        if (!active || !containerRef.current) {
            return;
        }

        const container = containerRef.current;
        previouslyFocusedElement.current = document.activeElement;

        const focusableElements = Array.from(
            container.querySelectorAll(FOCUSABLE_SELECTORS)
        ).filter(el => el.offsetParent !== null);

        if (focusableElements.length === 0) {
            if (container.tabIndex === -1) {
                container.setAttribute('tabindex', '-1');
            }
            container.focus();
        } else {
            focusableElements[0].focus();
        }

        const handleKeyDown = (event) => {
            if (event.key !== 'Tab' || !containerRef.current) {
                return;
            }

            const currentFocusableElements = Array.from(
                containerRef.current.querySelectorAll(FOCUSABLE_SELECTORS)
            ).filter(el => el.offsetParent !== null);

            if (currentFocusableElements.length === 0) {
                event.preventDefault();
                return;
            }

            const firstElement = currentFocusableElements[0];
            const lastElement = currentFocusableElements[currentFocusableElements.length - 1];
            const currentFocusedIndex = currentFocusableElements.indexOf(document.activeElement);

            if (event.shiftKey) {
                if (document.activeElement === firstElement || currentFocusedIndex === -1) {
                    event.preventDefault();
                    lastElement.focus();
                }
            } else {
                if (document.activeElement === lastElement || currentFocusedIndex === -1) {
                    event.preventDefault();
                    firstElement.focus();
                }
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            if (previouslyFocusedElement.current && typeof previouslyFocusedElement.current.focus === 'function') {
                previouslyFocusedElement.current.focus();
            }
        };
    }, [active, containerRef]);
}
