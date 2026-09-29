// Background flock: small birds drifting like a murmuration, after the
// Graciela Iturbide photograph used in .background-birds.
(function () {
    const canvas = document.querySelector('.flock');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let width, height, dpr, birds = [];

    function resize() {
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        const count = Math.round(Math.min(300, Math.max(100, (width * height) / 5500)));
        while (birds.length < count) birds.push(makeBird());
        birds.length = count;
    }

    function makeBird() {
        const depth = Math.random(); // 0 = far, 1 = near
        return {
            x: Math.random() * width,
            y: Math.random() * height * 0.7,
            vx: (Math.random() - 0.5) * 0.6,
            vy: (Math.random() - 0.5) * 0.3,
            depth,
            size: 1.5 + depth * 3.5,
            alpha: 0.25 + depth * 0.55,
            phase: Math.random() * Math.PI * 2,
            flapSpeed: 0.12 + Math.random() * 0.1,
            offsetX: (Math.random() - 0.5) * width * 0.5,
            offsetY: (Math.random() - 0.5) * height * 0.35,
        };
    }

    function drawBird(b) {
        const flap = Math.sin(b.phase);
        const s = b.size;
        const wingY = flap * s * 0.8;
        ctx.globalAlpha = b.alpha;
        ctx.lineWidth = Math.max(0.8, s * 0.35);
        ctx.beginPath();
        ctx.moveTo(b.x - s, b.y + wingY);
        ctx.quadraticCurveTo(b.x - s * 0.4, b.y - s * 0.2, b.x, b.y);
        ctx.quadraticCurveTo(b.x + s * 0.4, b.y - s * 0.2, b.x + s, b.y + wingY);
        ctx.stroke();
    }

    function step(t) {
        // The flock's centre wanders slowly across the upper half of the screen.
        const cx = width * (0.5 + 0.35 * Math.sin(t * 0.00011) + 0.1 * Math.sin(t * 0.00037));
        const cy = height * (0.28 + 0.12 * Math.sin(t * 0.00017 + 1.3));

        for (const b of birds) {
            const tx = cx + b.offsetX * (0.8 + 0.2 * Math.sin(t * 0.0005 + b.phase));
            const ty = cy + b.offsetY;
            const pull = 0.00006 + b.depth * 0.00004;
            b.vx += (tx - b.x) * pull + (Math.random() - 0.5) * 0.04;
            b.vy += (ty - b.y) * pull + (Math.random() - 0.5) * 0.04;

            const maxSpeed = 0.5 + b.depth * 0.9;
            const speed = Math.hypot(b.vx, b.vy);
            if (speed > maxSpeed) {
                b.vx *= maxSpeed / speed;
                b.vy *= maxSpeed / speed;
            }

            b.x += b.vx;
            b.y += b.vy;
            b.phase += b.flapSpeed * (0.6 + speed);
        }
    }

    function render() {
        ctx.clearRect(0, 0, width, height);
        ctx.strokeStyle = '#d8d8d8';
        ctx.lineCap = 'round';
        for (const b of birds) drawBird(b);
        ctx.globalAlpha = 1;
    }

    function loop(t) {
        step(t);
        render();
        requestAnimationFrame(loop);
    }

    window.addEventListener('resize', resize);
    resize();
    if (reduceMotion) {
        render();
    } else {
        requestAnimationFrame(loop);
    }
})();
