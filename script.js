const section = document.getElementById("section");

const t1 = document.getElementById("t1");
const t2 = document.getElementById("t2");
const t3 = document.getElementById("t3");
const t4 = document.getElementById("t4");

const sub = document.getElementById("sub");

const b1 = document.getElementById("b1");
const b2 = document.getElementById("b2");
const b3 = document.getElementById("b3");
const b4 = document.getElementById("b4");

const gradient = document.getElementById("gradient");

let target = 0;
let current = 0;

window.addEventListener("scroll", () => {
	const rect = section.getBoundingClientRect();
	const vh = window.innerHeight;

	if (rect.top <= 0 && rect.bottom >= vh) {
		const progress = Math.abs(rect.top) / (rect.height - vh);
		target = Math.min(Math.max(progress, 0), 1);
	}
});

function animate() {
	current += (target - current) * 0.06;
	const p = current;

	const p1 = Math.min(p * 4, 1);
	const p2 = Math.min(Math.max((p - 0.25) * 4, 0), 1);
	const p3 = Math.min(Math.max((p - 0.5) * 4, 0), 1);
	const p4 = Math.min(Math.max((p - 0.75) * 4, 0), 1);

	/* TEXT */

	t1.style.opacity = 1 - p2;
	t1.style.transform = `translate3d(0,${120 - p1 * 120}px,0) scale(${0.9 + p1 * 0.1})`;

	t2.style.opacity = p2 - p3;
	t2.style.transform = `translate3d(0,${120 - p2 * 120}px,0) scale(${0.9 + p2 * 0.1})`;

	t3.style.opacity = p3 - p4;
	t3.style.transform = `translate3d(0,${120 - p3 * 120}px,0) scale(${0.9 + p3 * 0.1})`;

	t4.style.opacity = p4;
	t4.style.transform = `translate3d(0,${120 - p4 * 120}px,0) scale(${0.9 + p4 * 0.1})`;

	sub.style.opacity = p4;
	sub.style.transform = `translate3d(0,${60 - p4 * 60}px,0)`;

	/* GRADIENT */

	gradient.style.opacity = p;
	gradient.style.transform = `scale(${0.8 + p * 0.6})`;

	/* BLOBS PARALLAX */

	b1.style.opacity = p;
	b1.style.transform = `translate3d(${-500 + p * 900}px,${200 - p * 400}px,0)`;

	b2.style.opacity = p;
	b2.style.transform = `translate3d(${400 - p * 800}px,${-300 + p * 600}px,0)`;

	b3.style.opacity = p;
	b3.style.transform = `translate3d(${-300 + p * 500}px,${400 - p * 800}px,0)`;

	b4.style.opacity = p;
	b4.style.transform = `translate3d(${300 - p * 600}px,${300 - p * 500}px,0)`;

	requestAnimationFrame(animate);
}

animate();
