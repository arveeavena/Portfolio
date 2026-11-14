import React from 'react';
import { useReveal } from '../hooks/useReveal';
import { SOCIAL } from '../lib/social';



const ChevRight = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="10" height="10">
        <polyline points="9 18 15 12 9 6" />
    </svg>
);

export function FooterGrid() {
    const ref = useReveal();

    return (
        <footer id="contact" className="footer-section reveal" ref={ref}>
            <div className="footer-cta">
                <h2 className="block-title">Let&rsquo;s work together.</h2>
                <p className="footer-cta-sub">
                    Looking for a developer for your team? I&rsquo;d be glad to talk.
                </p>
                <div className="footer-cta-actions">
                    <a href="mailto:princearveeavena@gmail.com?subject=Hello%20Prince%20Arvee!" className="btn btn-primary">
                        Email me
                    </a>
                    <a href="/RESUME.pdf" download="PrinceArveeAvena_Resume.pdf" className="btn">
                        Download CV
                    </a>
                </div>
            </div>
            <div className="footer-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>

                <div>
                    <div className="ft-title">Social Links</div>
                    {SOCIAL.map(s => (
                        <a key={s.name} href={s.href} target="_blank" rel="noopener noreferrer" className="ft-link">
                            <span className="ft-link-left">
                                {s.icon}
                                {s.name}
                            </span>
                            <ChevRight />
                        </a>
                    ))}
                </div>

                <div>
                    <div className="ft-title">Contact</div>
                    <div className="contact-entries">
                        <a href="mailto:princearveeavena@gmail.com" className="centry">
                            <div>
                                <div className="centry-label">Email</div>
                                <div className="centry-val">princearveeavena@gmail.com</div>
                            </div>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="9 18 15 12 9 6" />
                            </svg>
                        </a>
                        <a href="tel:+639168927345" className="centry">
                            <div>
                                <div className="centry-label">Phone</div>
                                <div className="centry-val">+63 916 892 7345</div>
                            </div>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="9 18 15 12 9 6" />
                            </svg>
                        </a>
                    </div>
                </div>

            </div>
            <div className="copyright">© 2026 Prince Arvee Avena (Arvee Avena) · Full-Stack Developer, Batangas, Philippines</div>
        </footer>
    );
}
