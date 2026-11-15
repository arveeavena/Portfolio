import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useReveal } from '../hooks/useReveal';
import { PROJECTS, CATEGORIES, shotSrc } from '../data/projects';

const host = url => (url ? url.replace(/^https?:\/\//, '').replace(/\/$/, '') : null);

const GitHubIcon = () => (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true">
        <path d="M12 .5C5.7.5.5 5.7.5 12c0 5.1 3.3 9.4 7.8 10.9.6.1.8-.2.8-.6v-2c-3.2.7-3.9-1.5-3.9-1.5-.5-1.3-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.1.1 1.7 1.1 1.7 1.1 1 1.8 2.7 1.3 3.4 1 .1-.7.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.8 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.2 1.2a11 11 0 0 1 5.8 0c2.2-1.5 3.2-1.2 3.2-1.2.6 1.6.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.5-2.7 5.5-5.3 5.8.4.4.8 1.1.8 2.2v3.3c0 .4.2.7.8.6 4.5-1.5 7.8-5.8 7.8-10.9C23.5 5.7 18.3.5 12 .5z" />
    </svg>
);
const ExternalIcon = () => (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M7 17 17 7M8 7h9v9" />
    </svg>
);
const LockIcon = () => (
    <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
);

/* A screenshot inside a minimal browser window. Falls back to a monogram
   tile when a project has no screenshot yet, so the grid never has holes. */
function BrowserFrame({ project, n = 1, eager = false, sizes }) {
    const url = host(project.live) || `${project.slug}.local`;
    return (
        <div className="frame">
            <div className="frame-bar" aria-hidden="true">
                <span className="frame-dots"><i /><i /><i /></span>
                <span className="frame-url">{url}</span>
            </div>
            <div className="frame-view">
                {project.shots > 0 ? (
                    <img
                        src={shotSrc(project.slug, n)}
                        srcSet={`${shotSrc(project.slug, n, 720)} 720w, ${shotSrc(project.slug, n)} 1440w`}
                        sizes={sizes}
                        width="1440"
                        height="900"
                        loading={eager ? 'eager' : 'lazy'}
                        decoding="async"
                        alt={`${project.name} ${project.label.toLowerCase()} screenshot, built by Prince Arvee Avena`}
                    />
                ) : (
                    <div className="frame-empty">
                        <span>{project.name.split(' ').map(w => w[0]).join('').slice(0, 2)}</span>
                    </div>
                )}
            </div>
        </div>
    );
}

function Links({ project, big = false }) {
    return (
        <div className={`work-links${big ? ' work-links-big' : ''}`}>
            {project.live && (
                <a className="wl wl-primary" href={project.live} target="_blank" rel="noopener noreferrer"
                    onClick={e => e.stopPropagation()}>
                    Visit site <ExternalIcon />
                </a>
            )}
            {project.repo ? (
                <a className="wl" href={project.repo} target="_blank" rel="noopener noreferrer"
                    onClick={e => e.stopPropagation()}>
                    <GitHubIcon /> Code
                </a>
            ) : (
                <span className="wl wl-muted" title="Client project: source code is private"><LockIcon /> Private repo</span>
            )}
            <a className="wl" href={`/work/${project.slug}`} onClick={e => e.stopPropagation()}
                aria-label={`${project.name} project details`}>
                Details
            </a>
        </div>
    );
}

function Status({ project }) {
    return project.live
        ? <span className="status status-live">Live</span>
        : <span className="status">{project.category}</span>;
}

function Featured({ project, onOpen }) {
    return (
        <article className="featured" onClick={() => onOpen(project)}>
            <div className="featured-copy">
                <div className="featured-kicker">
                    <span className="kicker">Featured</span>
                    <Status project={project} />
                </div>
                <h3 className="featured-name">{project.name}</h3>
                <p className="featured-label">{project.label}</p>
                <p className="featured-desc">{project.desc}</p>
                <div className="proj-tags">
                    {project.tags.map(t => <span className="proj-tag" key={t}>{t}</span>)}
                </div>
                <Links project={project} big />
            </div>
            <button className="featured-shot" aria-label={`Open ${project.name} screenshots`}>
                <BrowserFrame project={project} eager sizes="(max-width: 860px) 100vw, 620px" />
            </button>
        </article>
    );
}

function Card({ project, onOpen, index }) {
    return (
        <article className="work-card" style={{ '--i': index }} onClick={() => onOpen(project)}>
            <button className="work-shot" aria-label={`Open ${project.name} screenshots`}>
                <BrowserFrame project={project} sizes="(max-width: 680px) 100vw, (max-width: 1080px) 50vw, 360px" />
            </button>
            <div className="work-body">
                <div className="work-head">
                    <h3 className="work-name">{project.name}</h3>
                    <Status project={project} />
                </div>
                <p className="work-label">{project.label}</p>
                <p className="work-desc">{project.desc}</p>
                <div className="proj-tags">
                    {project.tags.slice(0, 4).map(t => <span className="proj-tag" key={t}>{t}</span>)}
                    {project.tags.length > 4 && <span className="proj-tag">+{project.tags.length - 4}</span>}
                </div>
                <Links project={project} />
            </div>
        </article>
    );
}

function ProjectModal({ project, onClose }) {
    const [n, setN] = useState(1);
    const total = Math.max(project.shots, 1);

    useEffect(() => {
        const onKey = e => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowRight') setN(v => (v % total) + 1);
            if (e.key === 'ArrowLeft') setN(v => ((v - 2 + total) % total) + 1);
        };
        document.addEventListener('keydown', onKey);
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = prev; };
    }, [onClose, total]);

    return createPortal(
        <div className="pm-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label={`${project.name} details`}>
            <div className="pm-box" onClick={e => e.stopPropagation()}>
                <button className="pm-close" onClick={onClose} aria-label="Close">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12" /></svg>
                </button>
                <div className="pm-media">
                    <BrowserFrame project={project} n={n} eager sizes="(max-width: 900px) 100vw, 900px" />
                    {total > 1 && (
                        <div className="pm-thumbs">
                            {Array.from({ length: total }, (_, i) => i + 1).map(i => (
                                <button key={i} className={`pm-thumb${i === n ? ' on' : ''}`} onClick={() => setN(i)}
                                    aria-label={`Screenshot ${i}`}>
                                    <img src={shotSrc(project.slug, i, 720)} alt="" loading="lazy" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>
                <div className="pm-info">
                    <div className="work-head">
                        <h3 className="featured-name">{project.name}</h3>
                        <Status project={project} />
                    </div>
                    <p className="featured-label">{project.label}</p>
                    <p className="featured-desc">{project.desc}</p>
                    <div className="proj-tags">
                        {project.tags.map(t => <span className="proj-tag" key={t}>{t}</span>)}
                    </div>
                    <Links project={project} big />
                </div>
            </div>
        </div>,
        document.body
    );
}

export function Work() {
    const ref = useReveal();
    const [filter, setFilter] = useState('All');
    const [open, setOpen] = useState(null);

    const featured = PROJECTS.filter(p => p.featured);
    const rest = PROJECTS.filter(p => !p.featured && (filter === 'All' || p.category === filter));

    return (
        <section id="work" className="block reveal" ref={ref} aria-labelledby="work-title">
            <div className="block-head">
                <div>
                    <h2 id="work-title" className="block-title">Projects</h2>
                </div>
                <p className="block-sub">
                    Real screenshots of each app running with demo data.
                </p>
            </div>

            <div className="featured-list">
                {featured.map(p => <Featured key={p.slug} project={p} onOpen={setOpen} />)}
            </div>

            <div className="filters" role="tablist" aria-label="Filter projects">
                {CATEGORIES.map(c => (
                    <button key={c} role="tab" aria-selected={filter === c}
                        className={`filter${filter === c ? ' on' : ''}`} onClick={() => setFilter(c)}>
                        {c}
                    </button>
                ))}
            </div>

            <div className="work-grid">
                {rest.map((p, i) => <Card key={p.slug} project={p} onOpen={setOpen} index={i} />)}
            </div>

            {open && <ProjectModal project={open} onClose={() => setOpen(null)} />}
        </section>
    );
}
