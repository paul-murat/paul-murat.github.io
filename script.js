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

let confettiParticles = [];

// Redimensionner le canvas au changement de fenêtre
window.addEventListener("resize", () => {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
});

// ===================================
// CLASSE CONFETTI AVEC PHYSIQUE
// ===================================

class Confetti {
	constructor(x, y, color, shape) {
		this.x = x;
		this.y = y;
		this.color = color;
		this.shape = shape; // 'rect' ou 'heart'
		this.size = Math.random() * 10 + 5;
		this.speedX = (Math.random() - 0.5) * 15; // Vitesse horizontale aléatoire
		this.speedY = Math.random() * 5 + 5; // Vitesse verticale
		this.rotation = Math.random() * 360;
		this.rotationSpeed = (Math.random() - 0.5) * 15;
		this.opacity = 1;
	}

	update() {
		this.x += this.speedX;
		this.y += this.speedY;
		this.rotation += this.rotationSpeed;
		this.speedY += 0.15; // Gravité
		this.opacity -= 0.01; // Fade out progressif
	}

	draw() {
		ctx.save();
		ctx.globalAlpha = this.opacity;
		ctx.translate(this.x, this.y);
		ctx.rotate((this.rotation * Math.PI) / 180);
		ctx.fillStyle = this.color;

		if (this.shape === 'rect') {
			// Carré
			ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
		} else if (this.shape === 'heart') {
			// Cœur stylisé
			ctx.beginPath();
			const s = this.size;
			ctx.moveTo(0, s * 0.35);
			ctx.bezierCurveTo(-s * 0.5, -s * 0.1, -s * 0.5, -s * 0.5, 0, -s * 0.2);
			ctx.bezierCurveTo(s * 0.5, -s * 0.5, s * 0.5, -s * 0.1, 0, s * 0.35);
			ctx.fill();
		}

		ctx.restore();
	}
}

// ===================================
// CRÉATION DE L'EXPLOSION DE CONFETTIS
// ===================================

function createConfetti() {
	const colors = ['#ff2d55', '#34c759', '#0071e3', '#af52de', '#ffd60a'];
	const centerX = canvas.width / 2;
	const centerY = canvas.height / 2;

	// Crée 150 confettis en explosion radiale
	for (let i = 0; i < 150; i++) {
		const color = colors[Math.floor(Math.random() * colors.length)];
		const shape = Math.random() > 0.4 ? 'rect' : 'heart'; // 60% carrés, 40% cœurs
		confettiParticles.push(new Confetti(centerX, centerY, color, shape));
	}
}

// ===================================
// ANIMATION DES CONFETTIS
// ===================================

function animateConfetti() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	confettiParticles.forEach((c, i) => {
		c.update();
		c.draw();

		// Supprime les confettis hors écran ou transparents
		if (c.y > canvas.height || c.opacity <= 0) {
			confettiParticles.splice(i, 1);
		}
	});

	// Continue tant qu'il y a des confettis
	if (confettiParticles.length > 0) {
		requestAnimationFrame(animateConfetti);
	}
}

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
	img1.style.opacity = imgProgress;
	img1.style.transform = `translate3d(-300px,${-300 + imgProgress * 300}px,0) rotate(${imgProgress * -15}deg)`;

	img2.style.opacity = imgProgress;
	img2.style.transform = `translate3d(0,${100 - imgProgress * 100}px,0) scale(${0.8 + imgProgress * 0.2})`;

	img3.style.opacity = imgProgress;
	img3.style.transform = `translate3d(300px,${-300 + imgProgress * 300}px,0) rotate(${imgProgress * 15}deg)`;

	// ===== DÉCLENCHEMENT DES CONFETTIS =====
	// Les confettis explosent une seule fois quand le titre est centré (p >= 0.5)
	if (p >= 0.5 && !confettiShown) {
		createConfetti();
		animateConfetti();
		confettiShown = true;
	}

	// Boucle d'animation continue
	requestAnimationFrame(animate);
}

// Démarre l'animation
animate();
