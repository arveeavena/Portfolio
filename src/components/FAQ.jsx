import { useReveal } from '../hooks/useReveal';
import { FAQ as ITEMS } from '../data/faq';

/* Answer-first FAQ. Uses <details> so every answer is in the prerendered HTML
   (crawlers and AI engines read it) while the page stays compact. The same
   data is emitted as FAQPage JSON-LD by scripts/prerender.mjs. */
export function FAQ() {
    const ref = useReveal();

    return (
        <section id="faq" className="block reveal" ref={ref} aria-labelledby="faq-title">
            <div className="block-head">
                <h2 id="faq-title" className="block-title">Questions people ask</h2>
            </div>

            <div className="faq-list">
                {ITEMS.map(({ q, a }, i) => (
                    <details className="faq-item" key={q} open={i === 0}>
                        <summary>
                            <h3 className="faq-q">{q}</h3>
                            <svg className="faq-chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                                <polyline points="6 9 12 15 18 9" />
                            </svg>
                        </summary>
                        <p className="faq-a">{a}</p>
                    </details>
                ))}
            </div>
        </section>
    );
}
