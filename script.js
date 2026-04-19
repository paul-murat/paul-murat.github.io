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
	'img/IMG_2330.jpeg',
	'img/IMG_2334.jpeg',
	'img/IMG_6567.jpeg',
	'img/IMG_6968.jpeg'
];

// Générer les images HTML dans la grille
function initializeImageGrid() {
	imagesGrid.innerHTML = ''; // Vider la grille
	imageFiles.forEach(imagePath => {
		const img = document.createElement('img');
		img.src = imagePath;
		img.alt = 'Photo';
		img.className = 'slideshow-image';
		img.loading = 'lazy';
		imagesGrid.appendChild(img);
	});
}

// ===================================
// VARIABLES D'ANIMATION SCROLL
// ===================================

let target = 0; // Position cible du scroll (0 à 1)
let current = 0; // Position actuelle interpolée
let confettiShown = false; // Flag pour déclencher les confettis une seule fois

// ===================================
// SETUP CANVAS POUR LES CONFETTIS
// ===================================

// ===================================
// SETUP CANVAS POUR LES CONFETTIS
// ===================================

const canvas = document.getElementById("confetti-canvas");
const ctx = canvas ? canvas.getContext("2d") : null;
if (canvas) {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
}

// Redimensionner le canvas au changement de fenêtre
window.addEventListener("resize", () => {
	if (canvas) {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
	}
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

// Fonction temporaire pour déboguer l'affichage
window.showElements = function() {
	console.log("Forçage de l'affichage des éléments");
	if (t1) t1.style.opacity = "1";
	if (sub) sub.style.opacity = "1";
	if (slideshowImage) slideshowImage.style.opacity = "1";
	if (helpText) helpText.style.opacity = "1";
	if (finalText) finalText.style.opacity = "1";
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

	// Calcul des progressions pour chaque phase
	// titleProgress : 0 à 1 pour le titre (0% à 20% du scroll)
	// subProgress : 0 à 1 pour le sous-titre (20% à 40% du scroll)
	// titlesFadeProgress : 0 à 1 pour la disparition des titres (40% à 50% du scroll)
	// slideshowProgress : 0 à 1 pour le slideshow (50% à 95% du scroll) - ENCORE PLUS LENT
	// finalProgress : 0 à 1 pour "j'ai un cadeau pour toi" (95% à 97% du scroll)
	// helpProgress : 0 à 1 pour "mais je vais avoir besoin de ton aide" (97% à 100% du scroll)
	const titleProgress = Math.min(p * 5, 1);
	const subProgress = Math.min(Math.max((p - 0.2) * 5, 0), 1);
	const titlesFadeProgress = Math.min(Math.max((p - 0.4) * 10, 0), 1); // 40% à 50%
	const slideshowProgress = Math.min(Math.max((p - 0.5) * 2.5, 0), 1); // 50% à 90% - AJUSTÉ
	const finalProgress = Math.min(Math.max((p - 0.9) * 50, 0), 1); // 90% à 92%
	const helpProgress = Math.min(Math.max((p - 0.92) * 50, 0), 1); // 92% à 94%
	const bagProgress = Math.min(Math.max((p - 0.94) * 50, 0), 1); // 94% à 96%
	const subtitleProgress = Math.min(Math.max((p - 0.96) * 50, 0), 1); // 96% à 100%

	// ===== ANIMATION DU TITRE =====
	t1.style.opacity = titleProgress * (1 - titlesFadeProgress);
	t1.style.transform = `translate3d(0,${120 - titleProgress * 120}px,0) scale(${0.9 + titleProgress * 0.1})`;

	// ===== ANIMATION DU SOUS-TITRE =====
	sub.style.opacity = subProgress * (1 - titlesFadeProgress);
	sub.style.transform = `translate3d(0,${60 - subProgress * 60}px,0)`;

	// ===== ANIMATION DU SLIDESHOW =====
	if (slideshowProgress > 0) {
		// Afficher 2 images par étape au lieu d'une seule
		const imagesPerStep = 2;
		const totalSteps = Math.ceil(imageFiles.length / imagesPerStep);
		
		// Chaque étape prend 1/totalSteps de la progression du slideshow
		const stepProgress = slideshowProgress * totalSteps;
		const currentStep = Math.min(Math.floor(stepProgress), totalSteps - 1);
		
		// Pour chaque image, déterminer si elle doit être affichée
		for (let i = 0; i < imageFiles.length; i++) {
			const img = imagesGrid.children[i];
			if (!img) continue;
			
			// Calculer l'étape de cette image
			const imageStep = Math.floor(i / imagesPerStep);
			
			if (imageStep === currentStep) {
				// Cette image fait partie de l'étape actuelle
				const positionInStep = i % imagesPerStep;
				const stepEase = stepProgress - currentStep;
				const imgEase = Math.max(0, Math.min(1, stepEase));
				
				// Opacity : apparaît graduellement, reste visible plus longtemps, disparaît lentement
				const opacity = imgEase < 0.1 
					? imgEase * 10 
					: imgEase > 0.95 
					? (1 - imgEase) * 20  // Plus lent pour disparaître
					: 1;
				
				img.style.opacity = opacity;
				
				// Animer avec différents patterns selon la position dans l'étape
				if (positionInStep === 0) {
					// Première image de l'étape : vient de la gauche avec rotation
					img.style.transform = `translate3d(${-400 + imgEase * 400}px,${-200 + imgEase * 200}px,0) rotate(${imgEase * -20}deg) scale(${0.8 + imgEase * 0.2})`;
				} else {
					// Deuxième image de l'étape : vient de la droite avec rotation opposée
					img.style.transform = `translate3d(${400 - imgEase * 400}px,${-200 + imgEase * 200}px,0) rotate(${imgEase * 20}deg) scale(${0.8 + imgEase * 0.2})`;
				}
			} else {
				// Cette image n'est pas dans l'étape actuelle, la cacher
				img.style.opacity = 0;
				img.style.transform = 'translate3d(0,0,0) rotate(0deg) scale(1)';
			}
		}
	}

	// ===== ANIMATION DU TEXTE FINAL ("j'ai un cadeau pour toi") =====
	finalText.style.opacity = finalProgress;
	finalText.style.transform = `translate3d(0,${80 - finalProgress * 80}px,0) scale(${0.95 + finalProgress * 0.05})`;

	// ===== ANIMATION DU TEXTE D'AIDE ("mais je vais avoir besoin de ton aide") =====
	helpText.style.opacity = helpProgress;
	helpText.style.transform = `translate3d(0,${40 - helpProgress * 40}px,0)`;

	// ===== ANIMATION DE L'ÉMOJI SAC =====
	bagEmoji.style.opacity = bagProgress;
	bagEmoji.style.transform = `translate3d(0,${100 - bagProgress * 100}px,0) scale(${0.8 + bagProgress * 0.2})`;

	// ===== ANIMATION DU SOUS-TITRE DU SAC =====
	bagSubtitle.style.opacity = subtitleProgress;
	bagSubtitle.style.transform = `translate3d(0,${60 - subtitleProgress * 60}px,0)`;

	// Faire disparaître les éléments précédents quand les textes finaux apparaissent
	const fadeOutProgress = Math.min(Math.max((p - 0.85) * 12.5, 0), 1); // Commence à 85% - AJUSTÉ
	if (fadeOutProgress > 0) {
		t1.style.opacity *= (1 - fadeOutProgress);
		sub.style.opacity *= (1 - fadeOutProgress);
		finalText.style.opacity *= (1 - fadeOutProgress); // Faire disparaître le final-text aussi
		// Les images disparaissent aussi progressivement
		for (let i = 0; i < imageFiles.length; i++) {
			const img = imagesGrid.children[i];
			if (img) {
				img.style.opacity *= (1 - fadeOutProgress);
			}
		}
	}

	// ===== ANIMATION DU GRADIENT =====
	gradient.style.opacity = p;
	gradient.style.transform = `scale(${0.8 + p * 0.6})`;

	// ===== ANIMATION DES BLOBS (ARRIÈRE-PLAN) - MOUVEMENTS EN BOUCLE =====
	// Utiliser le temps pour des animations continues et indépendantes
	const time = Date.now() * 0.001; // Temps en secondes
	
	// Blob 1 : Mouvement circulaire lent
	const b1Angle = time * 0.3; // Vitesse plus rapide
	const b1Radius = 300;
	const b1X = Math.cos(b1Angle) * b1Radius;
	const b1Y = Math.sin(b1Angle) * b1Radius * 0.5;
	b1.style.opacity = p * 0.7; // Légèrement transparent
	b1.style.transform = `translate3d(${b1X}px,${b1Y}px,0) scale(${1 + Math.sin(time * 0.5) * 0.1})`;
	
	// Blob 2 : Mouvement en 8 (figure de Lissajous)
	const b2Angle = time * 0.4; // Vitesse différente
	const b2X = Math.sin(b2Angle) * 400;
	const b2Y = Math.sin(b2Angle * 2) * 200;
	b2.style.opacity = p * 0.6;
	b2.style.transform = `translate3d(${b2X}px,${b2Y}px,0) scale(${1 + Math.cos(time * 0.7) * 0.15})`;
	
	// Blob 3 : Mouvement elliptique rapide
	const b3Angle = time * 0.6; // Plus rapide
	const b3X = Math.cos(b3Angle) * 250;
	const b3Y = Math.sin(b3Angle) * 350;
	b3.style.opacity = p * 0.8;
	b3.style.transform = `translate3d(${b3X}px,${b3Y}px,0) rotate(${b3Angle * 50}deg) scale(${1 + Math.sin(time * 0.8) * 0.2})`;
	
	// Blob 4 : Mouvement en spirale
	const b4Angle = time * 0.2; // Plus lent
	const b4Radius = 200 + Math.sin(time * 0.3) * 100;
	const b4X = Math.cos(b4Angle) * b4Radius;
	const b4Y = Math.sin(b4Angle) * b4Radius;
	b4.style.opacity = p * 0.5;
	b4.style.transform = `translate3d(${b4X}px,${b4Y}px,0) scale(${1 + Math.cos(time * 0.4) * 0.25})`;

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

// Initialiser la grille d'images
initializeImageGrid();

// Démarre l'animation
animate();

// ===================================
// FONCTION DE TEST
// ===================================

window.testConfetti = function() {
	confettiShown = false; // Permet de retester le déclenchement
	launchRealisticConfetti();
};
