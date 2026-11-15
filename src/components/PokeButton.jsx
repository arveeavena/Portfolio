import { useEffect, useRef, useState } from 'react';

const fmt = (n) => n.toLocaleString('en-US');

/* "Poke me" button with a shared, site-wide counter (api/poke.js). */
export function PokeButton() {
    const [total, setTotal] = useState(null);
    const [bursts, setBursts] = useState([]);
    const nextId = useRef(0);

    useEffect(() => {
        let alive = true;
        fetch('/api/poke')
            .then((r) => (r.ok ? r.json() : null))
            .then((d) => { if (alive && d) setTotal(d.total); })
            .catch(() => {});
        return () => { alive = false; };
    }, []);

    const poke = () => {
        // Optimistic +1, then settle on the server's number.
        setTotal((t) => (t ?? 0) + 1);
        const id = nextId.current++;
        setBursts((b) => [...b, id]);
        setTimeout(() => setBursts((b) => b.filter((x) => x !== id)), 900);

        fetch('/api/poke', { method: 'POST' })
            .then((r) => r.json())
            .then((d) => { if (typeof d.total === 'number') setTotal(d.total); })
            .catch(() => {});
    };

    return (
        <button
            type="button"
            className="btn poke-btn"
            onClick={poke}
            aria-label={total === null ? 'Poke me' : `Poke me. ${fmt(total)} pokes so far`}
        >
            <span className="poke-hand" aria-hidden="true">👉</span>
            Poke me
            <span className="poke-count" aria-live="polite">
                {total === null ? '…' : fmt(total)}
            </span>
            {bursts.map((id) => (
                <span key={id} className="poke-burst" aria-hidden="true">+1</span>
            ))}
        </button>
    );
}
