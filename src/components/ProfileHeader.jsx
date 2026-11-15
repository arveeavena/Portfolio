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
                        <p className="hero-role">Full-Stack Developer · Balayan, Batangas, PH</p>
                    </div>
                </div>

                <div className="about-body">
                    <p>
                        I&rsquo;m <strong>Prince Arvee Avena</strong>, a Full-Stack Developer at ServiceCo
                        specializing in web and mobile platforms built on one shared codebase. My work spans the
                        whole stack: PostgreSQL schemas and APIs, React and React Native interfaces, AI features
                        that answer from a company&rsquo;s own data, and automated deployments on AWS. With a
                        strong background in TypeScript, Laravel and cloud infrastructure, I take products from
                        the first database sketch all the way to production.
                    </p>
                    <p>
                        Since 2024 I have designed and delivered systems for businesses, schools and local
                        government offices across Batangas and Cavite, many of them running in production
                        today. They cover point of sale, Philippine-compliant payroll, clinic management and public records, each
                        built hand in hand with the people who run them every day. I graduated Magna Cum Laude
                        in Computer Science.
                    </p>
                    <p>
                        I build software that is reliable, secure and simple to use. Role-based access, audit
                        trails, backups and CI pipelines are part of every system I ship, not an afterthought.
                        Every site is also built to be found: prerendered pages, structured data and fast
                        load times, so it ranks on Google and shows up in AI answers from ChatGPT and
                        Google&rsquo;s AI Overviews.
                        I&rsquo;m committed to growing as an engineer and building technology that makes real
                        work faster for the people who depend on it.
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
