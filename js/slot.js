const ICONS = [
    'apple', 'apricot', 'banana', 'big_win', 'cherry',
    'grapes', 'lemon', 'lucky_seven', 'orange', 'pear',
    'strawberry', 'watermelon',
];

/**
 * Minimum spin duration (seconds) — first reel stops after this
 */
const BASE_DURATION = 2.5;

/**
 * Each subsequent reel spins this much longer (seconds)
 * Creates the classic "reel 1 stops, then 2, then 3..." effect
 */
const REEL_STEP = 0.35;

/**
 * How many icon rows each strip contains.
 * More rows = smoother, more convincing scroll.
 */
const STRIP_SIZE = 40;

let cols;

window.addEventListener('DOMContentLoaded', () => {
    cols = document.querySelectorAll('.col');
    buildStrips();
});

/* ── Build initial strips ────────────────────────────── */
function buildStrips() {
    cols.forEach((col, i) => {
        const extraRows = i * 3; // each reel is a bit longer — same as original
        const total = STRIP_SIZE + extraRows;

        let html = '';
        let firstThree = '';

        for (let x = 0; x < total; x++) {
            const icon = randomIcon();
            const item = iconHTML(icon);
            html += item;
            if (x < 3) firstThree += item; // mirror first 3 at end for seamless result reveal
        }

        col.innerHTML = html + firstThree;
    });
}

/* ── Spin ────────────────────────────────────────────── */
function spin(btn) {
    btn.setAttribute('disabled', true);

    // Pre-generate results for all reels (ready for future backend swap)
    const results = Array.from(cols, () => [
        randomIcon(),
        randomIcon(),
        randomIcon(),
    ]);

    // Set per-reel animation duration (staggered stop)
    cols.forEach((col, i) => {
        const duration = BASE_DURATION + i * REEL_STEP + jitter();
        col.style.animationDuration = duration + 's';
    });

    // Inject result icons at halfway point (so they're in place before reel stops)
    const halfwayMs = (BASE_DURATION * 1000) / 2;
    setTimeout(() => applyResults(results), halfwayMs);

    // Start CSS animation
    document.getElementById('container').classList.add('spinning');

    // Total duration = last reel's duration + small buffer
    const lastDuration = BASE_DURATION + (cols.length - 1) * REEL_STEP + 0.15;
    setTimeout(() => {
        document.getElementById('container').classList.remove('spinning');
        btn.removeAttribute('disabled');
    }, lastDuration * 1000);
}

/* ── Write result icons into first & last 3 rows of each strip ── */
function applyResults(results) {
    cols.forEach((col, i) => {
        const imgs = col.querySelectorAll('.icon img');
        const total = imgs.length;

        results[i].forEach((icon, x) => {
            // first 3 rows
            imgs[x].src = `items/${icon}.png`;
            imgs[x].alt = icon;
            // last 3 rows (mirror — these are visible when animation ends)
            imgs[(total - 3) + x].src = `items/${icon}.png`;
            imgs[(total - 3) + x].alt = icon;
        });
    });
}

/* ── Helpers ─────────────────────────────────────────── */
function randomIcon() {
    return ICONS[Math.floor(Math.random() * ICONS.length)];
}

function iconHTML(icon) {
    return `<div class="icon"><img src="items/${icon}.png" alt="${icon}"></div>`;
}

/** Small random offset so reels don't all stop at identical intervals */
function jitter() {
    return Math.floor(Math.random() * 10) / 100; // 0.00 – 0.09 s
}