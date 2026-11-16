import { Experience } from './Experience';

const MailIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <rect x="3" y="5" width="18" height="14" rx="2" /><polyline points="3,5 12,13 21,5" />
    </svg>
);

/* First section: who I am (left) and where I've worked (right). */
export function ProfileHeader() {
    return (
        <section className="hero" id="top" aria-label="About Prince Arvee Avena">
            <div className="hero-copy" id="about">
                <div className="hero-id">
                    <div className="profile-photo">
                        <img
                            src="/picture-256.webp"
                            srcSet="/picture-256.webp 256w, /picture-384.webp 384w, /prince-arvee-avena.jpg 1200w"
                            sizes="72px"
                            width="72"
                            height="72"
                            fetchPriority="high"
                            alt="Prince Arvee Avena, full-stack developer from Balayan, Batangas, Philippines"
                        />
                    </div>
                    <div>
                        <h1 className="profile-name">Prince Arvee Avena</h1>
                        <p className="hero-role">Full-Stack Developer | Software Engineer</p>
                    </div>
                </div>

                <div className="about-body">
                    <p>
                        I am a Full-Stack Developer at ServiceCo, specializing in engineering scalable software
                        solutions across web, mobile, and cloud platforms. My work encompasses the complete software
                        development lifecycle, from system architecture and backend engineering to frontend
                        development, AI integration, and production deployment.
                    </p>
                    <p>
                        Since 2024, I have designed, developed, and delivered software solutions for businesses,
                        educational institutions, and government organizations. I bring ideas from concept to
                        production, translating complex requirements into reliable, maintainable, and practical
                        technology.
                    </p>
                    <p>
                        My technical expertise includes TypeScript, React, React Native, Laravel, PostgreSQL, AWS,
                        and AI-driven application development. I place strong emphasis on software architecture,
                        performance, security, and building systems designed to scale and evolve.
                    </p>
                    <p>
                        A Magna Cum Laude Computer Science graduate, I combine strong academic foundations with
                        hands-on engineering experience and a commitment to continuous technical growth.
                    </p>
                </div>

                <div className="action-row">
                    <a href="mailto:princearveeavena@gmail.com?subject=Hello%20Prince%20Arvee!" className="btn btn-primary">
                        <MailIcon /> Email me
                    </a>
                    <a href="/RESUME.pdf" download="PrinceArveeAvena_Resume.pdf" className="btn">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                        Download CV
                    </a>
                    <a href="#work" className="btn">See projects</a>
                </div>
            </div>

            <Experience />
        </section>
    );
}
