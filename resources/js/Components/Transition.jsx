import React from 'react';
import { useState, useEffect, useRef } from 'react';

const Transition = ({
                        show,
                        appear = false,
                        unmount = true,
                        children,
                        enter = '',
                        enterFrom = '',
                        enterTo = '',
                        leave = '',
                        leaveFrom = '',
                        leaveTo = '',
                    }) => {
    const [isVisible, setIsVisible] = useState(show);
    const [classes, setClasses] = useState('');
    const isInitialMount = useRef(true);
    const timeoutRef = useRef(null);

    useEffect(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        const elementAppeared = !isInitialMount.current || appear;

        if (show && !isVisible) {
            setIsVisible(true);
            requestAnimationFrame(() => {
                setClasses(`${enter} ${enterFrom}`);
                requestAnimationFrame(() => {
                    setClasses(`${enter} ${enterTo}`);
                });
            });
        } else if (!show && isVisible && elementAppeared) {
            setClasses(`${leave} ${leaveFrom}`);
            requestAnimationFrame(() => {
                setClasses(`${leave} ${leaveTo}`);
                const durationClasses = `${leave} ${leaveTo}`.split(' ');
                let duration = 300;
                const durationPattern = /duration-(\d+)/;
                durationClasses.forEach(cls => {
                    const match = cls.match(durationPattern);
                    if (match && parseInt(match[1]) > duration) {
                        duration = parseInt(match[1]);
                    }
                });
                timeoutRef.current = setTimeout(() => {
                    setClasses('');
                    if (unmount) {
                        setIsVisible(false);
                    }
                }, duration);
            });
        }

        if (isInitialMount.current) {
            isInitialMount.current = false;
        }

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [show, appear, enter, enterFrom, enterTo, leave, leaveFrom, leaveTo, isVisible, unmount]);

    if (unmount && !isVisible && !show) {
        return null;
    }

    if (typeof children === 'function') {
        return children(classes);
    }

    if (React.isValidElement(children)) {
        return React.cloneElement(children, {
            className: `${children.props.className || ''} ${classes}`.trim()
        });
    }

    return <div className={classes}>{children}</div>;
};

export default Transition;
