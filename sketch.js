let gameState = 'selection'; // 'selection', 'playing', 'victory'
let currentScore = 0;
let currentProblem = null;
let particles = [];
let inputA, inputB, submitButton;
let levelButtons = [];
let restartButton;

class Problem {
    constructor(level) {
        this.level = level;
        this.generateNumbers();
    }

    generateNumbers() {
        switch(this.level) {
            case 1:
                // a et b positifs entre 1 et 10
                this.a = floor(random(1, 11));
                this.b = floor(random(1, 11));
                break;
            case 2:
                // a et b relatifs entre -10 et 10, pas tous les deux entre 1 et 10
                do {
                    this.a = floor(random(-10, 11));
                    this.b = floor(random(-10, 11));
                } while (this.a >= 1 && this.a <= 10 && this.b >= 1 && this.b <= 10);
                break;
            case 3:
                // a et b relatifs entre -20 et 20, pas tous les deux entre -10 et 10
                do {
                    this.a = floor(random(-20, 21));
                    this.b = floor(random(-20, 21));
                } while (this.a >= -10 && this.a <= 10 && this.b >= -10 && this.b <= 10);
                break;
        }
        this.sum = this.a + this.b;
        this.product = this.a * this.b;
    }

    check(userA, userB) {
        // Vérifie si les nombres donnés sont corrects (dans n'importe quel ordre)
        return (userA == this.a && userB == this.b) || (userA == this.b && userB == this.a);
    }
}

class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = random(-3, 3);
        this.vy = random(-8, -5);
        this.alpha = 255;
        this.color = color(random(255), random(255), random(255));
    }

    update() {
        this.x += this.vx;
        this.vy += 0.2;
        this.y += this.vy;
        this.alpha -= 2;
        return this.alpha > 0;
    }

    draw() {
        this.color.setAlpha(this.alpha);
        fill(this.color);
        noStroke();
        circle(this.x, this.y, 8);
    }
}

function setup() {
    createCanvas(800, 600);
    textAlign(CENTER, CENTER);
    setupUI();
}

function setupUI() {
    // Création des boutons de niveau
    for(let i = 1; i <= 3; i++) {
        let btn = createButton(`Niveau ${i} (${i} points)`);
        btn.position(width/2 - 70, 200 + i * 60);
        btn.mousePressed(() => startLevel(i));
        btn.class('button');
        btn.addClass(i === 1 ? 'learn' : i === 2 ? 'practice' : 'advanced');
        levelButtons.push(btn);
    }

    // Création des champs de saisie
    inputA = createInput('');
    inputA.position(width/2 - 120, height/2);
    inputA.size(50);
    inputA.hide();

    inputB = createInput('');
    inputB.position(width/2 + 70, height/2);
    inputB.size(50);
    inputB.hide();

    // Création du bouton de soumission
    submitButton = createButton('Vérifier');
    submitButton.position(width/2 - 30, height/2 + 50);
    submitButton.mousePressed(checkAnswer);
    submitButton.class('button');
    submitButton.addClass('practice');
    submitButton.hide();

    // Création du bouton de redémarrage
    restartButton = createButton('Recommencer ?');
    restartButton.position(width/2 - 50, height/2 + 100);
    restartButton.mousePressed(restart);
    restartButton.class('button');
    restartButton.addClass('learn');
    restartButton.hide();
}

function draw() {
    background(245, 247, 250);
    
    switch(gameState) {
        case 'selection':
            drawSelectionScreen();
            break;
        case 'playing':
            drawPlayingScreen();
            break;
        case 'victory':
            drawVictoryScreen();
            break;
    }

    // Mise à jour et dessin des particules
    for(let i = particles.length - 1; i >= 0; i--) {
        if(!particles[i].update()) {
            particles.splice(i, 1);
        } else {
            particles[i].draw();
        }
    }
}

function drawSelectionScreen() {
    textSize(32);
    fill(44, 62, 80);
    text("Choisis ton niveau de difficulté", width/2, 150);
    
    textSize(16);
    text(`Score actuel: ${currentScore}`, width/2, 100);
}

function drawPlayingScreen() {
    if(!currentProblem) return;
    
    textSize(32);
    fill(44, 62, 80);
    text(`x² + ${currentProblem.sum}x + ${currentProblem.product}`, width/2, 150);
    
    textSize(24);
    text("Trouve les valeurs de a et b :", width/2, height/2 - 50);
    
    text("(x +", width/2 - 150, height/2 + 5);
    text(")(x +", width/2 + 40, height/2 + 5);
    text(")", width/2 + 150, height/2 + 5);
    
    textSize(16);
    text(`Score actuel: ${currentScore}`, width/2, 100);
}

function drawVictoryScreen() {
    textSize(48);
    fill(44, 62, 80);
    text("Victoire !", width/2, height/2 - 100);
    textSize(24);
    text(`Score final: ${currentScore}`, width/2, height/2);
    
    // Ajouter des particules pour le feu d'artifice
    if(frameCount % 10 === 0) {
        for(let i = 0; i < 20; i++) {
            particles.push(new Particle(random(width), random(height)));
        }
    }
}

function startLevel(level) {
    gameState = 'playing';
    currentProblem = new Problem(level);
    
    // Cacher les boutons de niveau
    levelButtons.forEach(btn => btn.hide());
    
    // Montrer les champs de saisie et le bouton de soumission
    inputA.show();
    inputB.show();
    submitButton.show();
    
    // Vider les champs
    inputA.value('');
    inputB.value('');
}

function checkAnswer() {
    let a = parseInt(inputA.value());
    let b = parseInt(inputB.value());
    
    if(isNaN(a) || isNaN(b)) {
        return; // Valeurs invalides
    }
    
    if(currentProblem.check(a, b)) {
        // Bonne réponse
        currentScore += currentProblem.level;
        
        // Ajouter des particules pour célébrer
        for(let i = 0; i < 20; i++) {
            particles.push(new Particle(width/2, height/2));
        }
        
        if(currentScore >= 10) {
            gameState = 'victory';
            inputA.hide();
            inputB.hide();
            submitButton.hide();
            restartButton.show();
        } else {
            // Retour à la sélection du niveau
            gameState = 'selection';
            inputA.hide();
            inputB.hide();
            submitButton.hide();
            levelButtons.forEach(btn => btn.show());
        }
    } else {
        // Mauvaise réponse - secouer les inputs
        inputA.class('shake');
        inputB.class('shake');
        setTimeout(() => {
            inputA.removeClass('shake');
            inputB.removeClass('shake');
        }, 500);
    }
}

function restart() {
    currentScore = 0;
    gameState = 'selection';
    restartButton.hide();
    levelButtons.forEach(btn => btn.show());
}
