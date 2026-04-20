// ===================================
// SÉLECTION DES ÉLÉMENTS DOM
// ===================================

const section = document.getElementById("section");
const t1 = document.getElementById("t1");
const sub = document.getElementById("sub");
const imagesGrid = document.getElementById("imagesGrid");
const helpText = document.getElementById("help");
const finalText = document.getElementById("final");
const b1 = document.getElementById("b1");
const b2 = document.getElementById("b2");
const b3 = document.getElementById("b3");
const b4 = document.getElementById("b4");
const gradient = document.getElementById("gradient");
const bagEmoji = document.getElementById("bag");
const bagSubtitle = document.getElementById("bagSubtitle");

// Liste des images pour le slideshow
const imageFiles = [
	'img/photo1.jpg',
	'img/photo2.jpg',
	'img/photo3.jpg',
	'img/img0004.jpg',
	'img/img0017.jpg',
	'img/img0035.jpg',
	'img/img0036.jpg',
	'img/IMG_1073.JPG',
	'img/IMG_1534.jpeg',
	'img/IMG_1681.jpeg',
	'img/IMG_1711.jpeg',
	'img/IMG_1730.jpeg',
	'img/IMG_1742.jpeg',
	'img/IMG_2022.jpeg',
	'img/IMG_2058.jpeg',
	'img/IMG_2218.jpeg',
	'img/IMG_2288.jpeg',
	'img/IMG_2325.jpeg',
	'img/IMG_2334.jpeg',
	'img/IMG_6567.jpeg',
	'img/IMG_6968.jpeg'
];

// Générer les images HTML dans la grille
function initializeImageGrid() {
	imagesGrid.innerHTML = '';
	imageFiles.forEach((imagePath, index) => {
		const wrapper = document.createElement('div');
		wrapper.className = 'slideshow-item';
		wrapper.dataset.index = index;

		const img = document.createElement('img');
		img.src = imagePath;
		img.alt = 'Photo';
		img.className = 'slideshow-image';
		img.loading = 'lazy';

		// Numéro de photo (optionnel, donne un effet "story")
		const counter = document.createElement('div');
		counter.className = 'photo-counter';
		counter.textContent = `${index + 1} / ${imageFiles.length}`;

		wrapper.appendChild(img);
		// wrapper.appendChild(counter);
		imagesGrid.appendChild(wrapper);
	});
}

// ===================================
// VARIABLES D'ANIMATION SCROLL
// ===================================

let target = 0;
let current = 0;
let confettiShown = false;
let lastVisibleIndex = -1; // Pour savoir quelle image était visible

// ===================================
// SETUP CANVAS POUR LES CONFETTIS
// ===================================

const canvas = document.getElementById("confetti-canvas");
if (canvas) {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
}

window.addEventListener("resize", () => {
	if (canvas) {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
	}
});

// ===================================
// EFFET CONFETTIS
// ===================================

function launchRealisticConfetti() {
	const duration = 2000;
	const animationEnd = Date.now() + duration;

	function randomInRange(min, max) {
		return Math.random() * (max - min) + min;
	}

	(function frame() {
		const timeLeft = animationEnd - Date.now();
		if (timeLeft <= 0) return;

		const particleCount = Math.round(30 * (timeLeft / duration));

		confetti({
			particleCount: particleCount,
			startVelocity: randomInRange(25, 55),
			spread: randomInRange(40, 60),
			origin: {
				x: randomInRange(0.2, 0.8),
				y: Math.random() - 0.35
			},
			colors: ['#ff2d55', '#34c759', '#0071e3', '#af52de', '#ffd60a', '#ff006e', '#ff9500', '#5856d6'],
			shapes: ['square', 'circle'],
			scalar: randomInRange(0.85, 1.1),
			drift: randomInRange(-0.35, 0.35),
			gravity: randomInRange(0.75, 1.0),
			ticks: randomInRange(180, 260)
		});

		requestAnimationFrame(frame);
	}());
}

window.testConfetti = function() {
	confettiShown = false;
	launchRealisticConfetti();
};

// ===================================
// GESTION DU SCROLL
// ===================================

window.addEventListener("scroll", () => {
	const rect = section.getBoundingClientRect();
	const vh = window.innerHeight;

	if (rect.top <= 0 && rect.bottom >= vh) {
		const progress = Math.abs(rect.top) / (rect.height - vh);
		target = Math.min(Math.max(progress, 0), 1);
	}
});

// ===================================
// FONCTION D'ANIMATION PRINCIPALE
// ===================================

function animate() {
	current += (target - current) * 0.06;
	const p = current;

	// Phases de scroll
	const titleProgress       = Math.min(p * 5, 1);                              // 0%  → 20%
	const subProgress         = Math.min(Math.max((p - 0.2) * 5, 0), 1);         // 20% → 40%
	const titlesFadeProgress  = Math.min(Math.max((p - 0.4) * 10, 0), 1);        // 40% → 50%
	const slideshowProgress   = Math.min(Math.max((p - 0.5) * 2.9, 0), 1);       // 50% → 85% (affiche toutes les images)
	const finalProgress       = Math.min(Math.max((p - 0.88) * 50, 0), 1);       // 88% → 90%
	const helpProgress        = Math.min(Math.max((p - 0.91) * 50, 0), 1);       // 91% → 93%
	const bagProgress         = Math.min(Math.max((p - 0.94) * 50, 0), 1);       // 94% → 96%
	const subtitleProgress    = Math.min(Math.max((p - 0.96) * 50, 0), 1);       // 96% → 100%

	// ===== TITRE =====
	t1.style.opacity = titleProgress * (1 - titlesFadeProgress);
	t1.style.transform = `translate3d(0,${120 - titleProgress * 120}px,0) scale(${0.9 + titleProgress * 0.1})`;

	// ===== SOUS-TITRE =====
	sub.style.opacity = subProgress * (1 - titlesFadeProgress);
	sub.style.transform = `translate3d(0,${60 - subProgress * 60}px,0)`;

	// ===== SLIDESHOW IMAGE PAR IMAGE =====
	if (slideshowProgress > 0) {
		const totalImages = imageFiles.length;

		// Chaque image occupe une tranche égale de la progression slideshow
		// Avec un léger overlap pour le fondu enchaîné
		const rawIndex = slideshowProgress * totalImages;
		const currentIndex = Math.min(Math.floor(rawIndex), totalImages - 1);
		const localProgress = rawIndex - Math.floor(rawIndex); // 0 → 1 dans l'image courante

		for (let i = 0; i < totalImages; i++) {
			const item = imagesGrid.children[i];
			if (!item) continue;

			if (i === currentIndex) {
				const enterEase = easeOutCubic(Math.min(localProgress * 3, 1));

				// Disparition vers le haut à la fin de la tranche
				const exitStart = 0.65;
				const exitProgress = Math.max(0, (localProgress - exitStart) / (1 - exitStart));
				const exitEase = easeInCubic(exitProgress);

				const opacity = enterEase * (1 - exitEase * 0.95);
				const yEnter = (1 - enterEase) * 60;
				const yExit  = exitEase * -50;
				const scale  = 0.88 + enterEase * 0.12 - exitEase * 0.05;
				const rotate = (1 - enterEase) * 4 - exitEase * 2;

				item.style.opacity = opacity;
				item.style.transform = `translate3d(0, ${yEnter + yExit}px, 0) scale(${scale}) rotate(${rotate}deg)`;
				item.style.zIndex = 10;

			} else if (i < currentIndex) {
				// Image passée : cachée en haut
				item.style.opacity = 0;
				item.style.transform = `translate3d(0, -80px, 0) scale(0.9)`;
				item.style.zIndex = 5;
			} else {
				// Image future : cachée en bas
				item.style.opacity = 0;
				item.style.transform = `translate3d(0, 80px, 0) scale(0.88)`;
				item.style.zIndex = 5;
			}
		}

		lastVisibleIndex = currentIndex;
	} else {
		// Cacher toutes les images avant le slideshow
		for (let i = 0; i < imageFiles.length; i++) {
			const item = imagesGrid.children[i];
			if (item) {
				item.style.opacity = 0;
				item.style.transform = 'translate3d(0, 80px, 0) scale(0.88)';
			}
		}
	}

	// ===== TEXTES FINAUX =====
	// Faire disparaître les images quand on arrive à la fin (seuil repoussé à 0.85)
	const fadeOutImages = Math.min(Math.max((p - 0.85) * 10, 0), 1);
	if (fadeOutImages > 0) {
		for (let i = 0; i < imageFiles.length; i++) {
			const item = imagesGrid.children[i];
			if (item) item.style.opacity *= (1 - fadeOutImages);
		}
	}

	finalText.style.opacity = finalProgress;
	finalText.style.transform = `translate3d(0,${80 - finalProgress * 80}px,0) scale(${0.95 + finalProgress * 0.05})`;

	helpText.style.opacity = helpProgress;
	helpText.style.transform = `translate3d(0,${40 - helpProgress * 40}px,0)`;

	bagEmoji.style.opacity = bagProgress;
	bagEmoji.style.transform = `translate3d(0,${100 - bagProgress * 100}px,0) scale(${0.8 + bagProgress * 0.2})`;

	bagSubtitle.style.opacity = subtitleProgress;
	bagSubtitle.style.transform = `translate3d(0,${60 - subtitleProgress * 60}px,0)`;

	// ===== GRADIENT =====
	gradient.style.opacity = p;
	gradient.style.transform = `scale(${0.8 + p * 0.6})`;

	// ===== BLOBS =====
	const time = Date.now() * 0.001;

	const b1Angle = time * 0.3;
	b1.style.opacity = p * 0.7;
	b1.style.transform = `translate3d(${Math.cos(b1Angle) * 300}px,${Math.sin(b1Angle) * 150}px,0) scale(${1 + Math.sin(time * 0.5) * 0.1})`;

	const b2Angle = time * 0.4;
	b2.style.opacity = p * 0.6;
	b2.style.transform = `translate3d(${Math.sin(b2Angle) * 400}px,${Math.sin(b2Angle * 2) * 200}px,0) scale(${1 + Math.cos(time * 0.7) * 0.15})`;

	const b3Angle = time * 0.6;
	b3.style.opacity = p * 0.8;
	b3.style.transform = `translate3d(${Math.cos(b3Angle) * 250}px,${Math.sin(b3Angle) * 350}px,0) rotate(${b3Angle * 50}deg) scale(${1 + Math.sin(time * 0.8) * 0.2})`;

	const b4Angle = time * 0.2;
	const b4R = 200 + Math.sin(time * 0.3) * 100;
	b4.style.opacity = p * 0.5;
	b4.style.transform = `translate3d(${Math.cos(b4Angle) * b4R}px,${Math.sin(b4Angle) * b4R}px,0) scale(${1 + Math.cos(time * 0.4) * 0.25})`;

	// ===== CONFETTIS =====
	if (p >= 0.1 && !confettiShown) {
		launchRealisticConfetti();
		confettiShown = true;
	}

	requestAnimationFrame(animate);
}

// ===================================
// FONCTIONS D'EASING
// ===================================

function easeOutCubic(t) {
	return 1 - Math.pow(1 - t, 3);
}

function easeInCubic(t) {
	return t * t * t;
}

// Init
initializeImageGrid();
animate();