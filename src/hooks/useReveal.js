import { useEffect, useRef } from 'react';

// Fades a section in when it scrolls into view.
// threshold must stay 0: a ratio like 0.12 is unreachable for sections taller
// than ~8 screens (the stacked project grid on phones), which left them invisible.
export function useReveal() {
    const ref = useRef(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        if (typeof IntersectionObserver === 'undefined') {
            el.classList.add('visible');
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    el.classList.add('visible');
                    observer.disconnect();
                }
            },
            { threshold: 0, rootMargin: '0px 0px -8% 0px' }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return ref;
}
