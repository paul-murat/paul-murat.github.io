// ===================================
// SÉLECTION DES ÉLÉMENTS DOM
// ===================================

const section = document.getElementById("section");
const t1 = document.getElementById("t1");
const sub = document.getElementById("sub");
const b1 = document.getElementById("b1");
const b2 = document.getElementById("b2");
const b3 = document.getElementById("b3");
const b4 = document.getElementById("b4");
const gradient = document.getElementById("gradient");

// Vérifier si les images existent avant de les sélectionner
const img1 = document.getElementById("img1");
const img2 = document.getElementById("img2");
const img3 = document.getElementById("img3");

// ===================================
// VARIABLES D'ANIMATION SCROLL
// ===================================

let target = 0; // Position cible du scroll (0 à 1)
let current = 0; // Position actuelle interpolée
let confettiShown = false; // Flag pour déclencher les confettis une seule fois

// ===================================
// SETUP CANVAS POUR LES CONFETTIS
// ===================================

const canvas = document.getElementById("confetti-canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Redimensionner le canvas au changement de fenêtre
window.addEventListener("resize", () => {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
});

// ===================================
// EFFET CONFETTIS RÉALISTE AVEC CANVAS-CONFETTI
// ===================================

function launchRealisticConfetti() {
	// Configuration pour un effet confetti plus doux et naturel
	const duration = 2000; // Durée totale de l'animation
	const animationEnd = Date.now() + duration;

	function randomInRange(min, max) {
		return Math.random() * (max - min) + min;
	}

	(function frame() {
		const timeLeft = animationEnd - Date.now();
		if (timeLeft <= 0) {
			return; // Animation terminée
		}

		const particleCount = Math.round(30 * (timeLeft / duration)); // Moins de particules

		confetti({
			particleCount: particleCount,
			startVelocity: randomInRange(25, 55), // plus doux
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

// ===================================
// FONCTION DE TEST
// ===================================

window.testConfetti = function() {
	console.log("Test des confettis réalistes");
	launchRealisticConfetti();
};


// ===================================
// GESTION DU SCROLL
// ===================================

window.addEventListener("scroll", () => {
	const rect = section.getBoundingClientRect();
	const vh = window.innerHeight;

	// Calcule le progrès du scroll dans la section sticky (0 à 1)
	if (rect.top <= 0 && rect.bottom >= vh) {
		const progress = Math.abs(rect.top) / (rect.height - vh);
		target = Math.min(Math.max(progress, 0), 1);
	}
});

// ===================================
// FONCTION D'ANIMATION PRINCIPALE
// ===================================

function animate() {
	// Interpolation lisse du scroll (easing)
	current += (target - current) * 0.06;
	const p = current;

	// Calcul des progressions pour chaque élément
	// titleProgress : 0 à 1 pour le titre (0% à 50% du scroll)
	// subProgress : 0 à 1 pour le sous-titre (50% à 100% du scroll)
	// imgProgress : 0 à 1 pour les images (75% à 100% du scroll)
	const titleProgress = Math.min(p * 2, 1);
	const subProgress = Math.min(Math.max((p - 0.5) * 2, 0), 1);
	const imgProgress = Math.min(Math.max((p - 0.75) * 4, 0), 1);

	// ===== ANIMATION DU TITRE =====
	t1.style.opacity = titleProgress;
	t1.style.transform = `translate3d(0,${120 - titleProgress * 120}px,0) scale(${0.9 + titleProgress * 0.1})`;

	// ===== ANIMATION DU SOUS-TITRE =====
	sub.style.opacity = subProgress;
	sub.style.transform = `translate3d(0,${60 - subProgress * 60}px,0)`;

	// ===== ANIMATION DU GRADIENT =====
	gradient.style.opacity = p;
	gradient.style.transform = `scale(${0.8 + p * 0.6})`;

	// ===== ANIMATION DES BLOBS (ARRIÈRE-PLAN) =====
	b1.style.opacity = p;
	b1.style.transform = `translate3d(${-500 + p * 900}px,${200 - p * 400}px,0)`;

	b2.style.opacity = p;
	b2.style.transform = `translate3d(${400 - p * 800}px,${-300 + p * 600}px,0)`;

	b3.style.opacity = p;
	b3.style.transform = `translate3d(${-300 + p * 500}px,${400 - p * 800}px,0)`;

	b4.style.opacity = p;
	b4.style.transform = `translate3d(${300 - p * 600}px,${300 - p * 500}px,0)`;

	// ===== ANIMATION DES IMAGES =====
	// Les images apparaissent avec un décalage de rotation progressif
	if (img1) {
		img1.style.opacity = imgProgress;
		img1.style.transform = `translate3d(-300px,${-300 + imgProgress * 300}px,0) rotate(${imgProgress * -15}deg)`;
	}
	
	if (img2) {
		img2.style.opacity = imgProgress;
		img2.style.transform = `translate3d(0,${100 - imgProgress * 100}px,0) scale(${0.8 + imgProgress * 0.2})`;
	}
	
	if (img3) {
		img3.style.opacity = imgProgress;
		img3.style.transform = `translate3d(300px,${-300 + imgProgress * 300}px,0) rotate(${imgProgress * 15}deg)`;
	}

	// ===== DÉCLENCHEMENT DES CONFETTIS =====
	// Les confettis explosent une seule fois quand le titre commence à apparaître (p >= 0.1)
	if (p >= 0.1 && !confettiShown) {
		console.log("Déclenchement des confettis réalistes !");
		try {
			launchRealisticConfetti();
			confettiShown = true;
		} catch (error) {
			console.error("Erreur lors du déclenchement des confettis:", error);
		}
	}

	// Boucle d'animation continue
	requestAnimationFrame(animate);
}

// Démarre l'animation
animate();

// ===================================
// FONCTION DE TEST
// ===================================

window.testConfetti = function() {
	confettiShown = false; // Permet de retester le déclenchement
	launchRealisticConfetti();
};
