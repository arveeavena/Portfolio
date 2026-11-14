const TIMELINE = [
    {
        role: 'Full-Stack Developer',
        org: 'ServiceCo Pte. Ltd. · Independent Contractor',
        period: 'Jun 2026 – Present',
        desc: 'Web and React Native apps from one codebase: CRM and operations dashboards, chat, onboarding, PostgreSQL and APIs, LLM-powered search. Shipped on AWS.',
        active: true,
    },
    {
        role: 'Freelance Web Developer',
        org: 'Self-Employed',
        period: 'Feb 2025 – Jun 2026',
        desc: 'Point of sale, payroll, clinic and records systems, and marketing sites for shops, schools and LGUs, from requirements to deployment.',
    },
    {
        role: 'Administrative & IT Support (OJT)',
        org: 'ICCBI Registrar’s Office',
        period: 'Dec 2025 – Apr 2026',
        desc: 'Processed 500+ confidential student records and digitized physical files.',
    },
    {
        role: 'BS Computer Science',
        org: 'Immaculate Conception College of Balayan · Magna Cum Laude',
        period: 'Apr 2026',
    },
];

export function Experience() {
    return (
        <aside id="experience" className="hero-exp" aria-labelledby="exp-title">
            <h2 id="exp-title" className="side-title">Experience</h2>
            <ol className="timeline">
                {TIMELINE.map(e => (
                    <li className={`tl-item${e.active ? ' on' : ''}`} key={e.role}>
                        <span className="tl-dot" aria-hidden="true" />
                        <div className="tl-top">
                            <h3 className="tl-role">{e.role}</h3>
                            <span className="tl-period">{e.period}</span>
                        </div>
                        <p className="tl-org">{e.org}</p>
                        {e.desc && <p className="tl-desc">{e.desc}</p>}
                    </li>
                ))}
            </ol>
        </aside>
    );
}
