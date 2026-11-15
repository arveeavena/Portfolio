import { useReveal } from '../hooks/useReveal';
import { SERVICES } from '../data/services';

/* Links to the /services/<slug> pages, so visitors (and crawlers) can reach
   the "who can build X for me?" pages from the homepage. */
export function Services() {
    const ref = useReveal();

    return (
        <section id="services" className="block reveal" ref={ref} aria-labelledby="services-title">
            <div className="block-head">
                <h2 id="services-title" className="block-title">Systems I build for businesses &amp; offices</h2>
            </div>

            <div className="svc-grid">
                {SERVICES.map(s => (
                    <a className="svc-card" href={`/services/${s.slug}`} key={s.slug}>
                        <h3 className="svc-name">{s.name}</h3>
                        <p className="svc-for">{s.audience}</p>
                        <span className="svc-more">
                            See what&rsquo;s included
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                                <polyline points="9 18 15 12 9 6" />
                            </svg>
                        </span>
                    </a>
                ))}
            </div>
        </section>
    );
}
