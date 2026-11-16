import React, { useState } from 'react';
import { useReveal } from '../hooks/useReveal';
import { BRAND, GLYPH, brandColor } from '../lib/brandIcons';
import { STACK } from '../data/stack';


const PREVIEW_COUNT = 2;

// Every tag with a brand logo, split into two rows for the sliding strip.
const LOGOS = [...new Set(STACK.flatMap(g => g.tags))].filter(t => BRAND[t]);
const ROWS = [LOGOS.filter((_, i) => i % 2 === 0), LOGOS.filter((_, i) => i % 2 === 1)];

function Marquee() {
    return (
        <div className="marquee" aria-hidden="true">
            {ROWS.map((row, r) => (
                <div className={`mq-row${r ? ' mq-rev' : ''}`} key={r}>
                    <div className="mq-track">
                        {[...row, ...row].map((t, i) => {
                            const icon = BRAND[t];
                            const color = brandColor(icon);
                            return (
                                <span className="mq-item" key={i} style={color ? { '--brand': color } : null}>
                                    <svg className="tag-mark" viewBox="0 0 24 24" fill="currentColor"><path d={icon.path} /></svg>
                                    {t}
                                </span>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
}

function AnimatedTag({ children, delay }) {
    const icon = BRAND[children];
    const glyph = icon ? null : GLYPH[children];
    const color = brandColor(icon);

    return (
        <span
            className={`tag${icon || glyph ? ' tag-branded' : ''}`}
            style={{
                animationDelay: `${delay}ms`,
                animationFillMode: 'both',
                ...(color ? { '--brand': color } : null),
            }}
        >
            {icon ? (
                <svg className="tag-mark" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d={icon.path} />
                </svg>
            ) : glyph ? (
                <svg
                    className="tag-mark tag-glyph"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                >
                    <path d={glyph} />
                </svg>
            ) : null}
            {children}
        </span>
    );
}

export function TechStack() {
    const ref = useReveal();
    const [expanded, setExpanded] = useState(false);

    const visible = expanded ? STACK : STACK.slice(0, PREVIEW_COUNT);

    return (
        <section id="stack" className="block reveal" ref={ref} aria-labelledby="stack-title">
            <div className="block-head">
                <div>
                    <h2 id="stack-title" className="block-title">Skills &amp; stack</h2>
                </div>
            </div>

            <Marquee />

            <div className="stack-grid">
            {visible.map((group, gi) => {
                const baseDelay = gi * 60;
                return (
                    <div className="stack-group" key={group.cat}>
                        <div className="stack-cat">{group.cat}</div>
                        <div className="tags">
                            {group.tags.map((tag, ti) => (
                                <AnimatedTag key={tag} delay={baseDelay + ti * 35}>
                                    {tag}
                                </AnimatedTag>
                            ))}
                        </div>
                    </div>
                );
            })}
            </div>

            <button
                className="btn view-all-btn"
                onClick={() => setExpanded(v => !v)}
                style={{ marginTop: '14px' }}
            >
                {expanded ? (
                    <>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="18 15 12 9 6 15" />
                        </svg>
                        Show Less
                    </>
                ) : (
                    <>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="6 9 12 15 18 9" />
                        </svg>
                        View All Skills
                        <span className="view-all-count">+{STACK.slice(PREVIEW_COUNT).reduce((a, g) => a + g.tags.length, 0)}</span>
                    </>
                )}
            </button>
        </section>
    );
}
