import React, { useEffect, useState } from 'react';

const useInView = (elementRef, options = {}) => {
    const [inView, setInView] = useState(false);

    useEffect(() => {
        if (!elementRef || !elementRef.current) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                setInView(entry.isIntersecting);
            },
            options
        );

        observer.observe(elementRef.current);

        return () => {
            if (elementRef.current) {
                observer.unobserve(elementRef.current);
            }
        };
    }, [elementRef, options]);

    return inView;
};

export default useInView;
