let currentScore = 0;
let currentProblem = null;
let usedPairs = new Set(); // Pour stocker les paires déjà utilisées
let questionHistory = []; // Pour stocker l'historique des questions

function pairToString(a, b) {
    // Convertit une paire de nombres en chaîne unique, indépendamment de l'ordre
    return a <= b ? `${a},${b}` : `${b},${a}`;
}

function isPairUsed(a, b) {
    return usedPairs.has(pairToString(a, b));
}

function addUsedPair(a, b) {
    usedPairs.add(pairToString(a, b));
}

function testnombresgeneres() {
    for(let level = 1; level <= 3; level++) {
        console.log(`Niveau ${level}:`);
        for(let i = 0; i < 10; i++) {
            let prob = new Problem(level);
            console.log(prob.a, prob.b);
        }
    }
    
}

class Problem {
    constructor(level) {
        this.level = level;
        this.generateNumbers();
    }

    generateNumbers() {
        let signeA = 1;
        let signeB = 1;
        let maxAttempts = 50; // Pour éviter une boucle infinie
        let attempts = 0;

        do {
            switch(this.level) {
                case 1:
                    // a et b positifs entre 1 et 10, pas zéro
                    this.a = Math.floor(Math.random() * 10) + 1;
                    this.b = Math.floor(Math.random() * 10) + 1;
                    break;
                case 2:
                    // a et b relatifs entre -10 et 10, pas tous les deux entre 1 et 10, pas zéro
                    signeA = Math.random() < 0.5 ? -1 : 1;
                    if(signeA == 1) {
                        signeB = -1;
                    } else { 
                        signeB = Math.random() < 0.5 ? -1 : 1;
                    }
                    this.a = signeA * (Math.floor(Math.random() * 10) + 1);
                    this.b = signeB * (Math.floor(Math.random() * 10) + 1);
                    break;
                case 3:
                    // a et b relatifs entre -20 et 20, pas tous les deux entre -10 et 10
                    signeA = Math.random() < 0.5 ? -1 : 1;
                    if(signeA == 1) {
                        signeB = -1;
                    } else { 
                        signeB = Math.random() < 0.5 ? -1 : 1;             
                    }
                    this.a = signeA * (Math.floor(Math.random() * 20) + 1);
                    if(this.a > 10) {
                        this.b = signeB * (Math.floor(Math.random() * 20) + 1);
                    } else {
                        this.b = signeB * (Math.floor(Math.random() * 10) + 11);
                    }
                    break;
            }
            attempts++;
        } while (isPairUsed(this.a, this.b) && attempts < maxAttempts);

        if (attempts < maxAttempts) {
            addUsedPair(this.a, this.b);
        } else {
            console.log("Warning: Toutes les combinaisons possibles ont été utilisées pour ce niveau");
            // On utilise quand même la dernière paire générée
        }

        this.sum = this.a + this.b;
        this.product = this.a * this.b;
    }

    check(userA, userB) {
        // Vérifie si les nombres donnés sont corrects (dans n'importe quel ordre)
        return (userA == this.a && userB == this.b) || (userA == this.b && userB == this.a);
    }
}

function createParticle() {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Position aléatoire
    const x = Math.random() * window.innerWidth;
    const y = Math.random() * window.innerHeight;
    
    // Vitesse et direction aléatoires
    const vx = (Math.random() - 0.5) * 10;
    const vy = -Math.random() * 15 - 5;
    
    // Couleur aléatoire
    const hue = Math.random() * 360;
    particle.style.backgroundColor = `hsl(${hue}, 80%, 60%)`;
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    
    document.body.appendChild(particle);
    
    let posX = x;
    let posY = y;
    let opacity = 1;
    
    function animate() {
        posX += vx;
        posY += vy;
        opacity -= 0.02;
        
        particle.style.left = `${posX}px`;
        particle.style.top = `${posY}px`;
        particle.style.opacity = opacity;
        
        if (opacity > 0) {
            requestAnimationFrame(animate);
        } else {
            particle.remove();
        }
    }
    
    requestAnimationFrame(animate);
}

function celebrate() {
    for (let i = 0; i < 30; i++) {
        setTimeout(() => createParticle(), i * 50);
    }
}

function formatTerm(coefficient, variable = '') {
    if (coefficient === 0) return '';
    if (coefficient === 1 && variable) return `+${variable}`;
    if (coefficient === -1 && variable) return `-${variable}`;
    return `${coefficient > 0 ? '+' : ''}${coefficient}${variable}`;
}

function getLatexExpression(a, b) {
    const sum = a + b;
    const product = a * b;
    
    let expression = 'x^2';  // Le terme en x² est toujours présent
    
    // Terme en x (somme)
    if (sum !== 0) {
        expression += formatTerm(sum, 'x');
    }
    
    // Terme constant (produit)
    if (product !== 0) {
        expression += formatTerm(product);
    }
    
    // Si l'expression commence par un +, on l'enlève
    if (expression.startsWith('+')) {
        expression = expression.substring(1);
    }
    
    return `\\[${expression}\\]`;
}

function getFullLatexExpression(a, b) {
    const sum = a + b;
    const product = a * b;
    
    // Partie gauche (développée)
    let leftPart = 'x^2';
    if (sum !== 0) {
        leftPart += formatTerm(sum, 'x');
    }
    if (product !== 0) {
        leftPart += formatTerm(product);
    }
    
    // Partie droite (factorisée)
    const rightPart = `(x${formatTerm(a)})(x${formatTerm(b)})`;
    
    return `\\[${leftPart}=${rightPart}\\]`;
}

function addToHistory(problem) {
    questionHistory.push({
        a: problem.a,
        b: problem.b,
        level: problem.level
    });
}

function displayHistory() {
    const historyContainer = document.getElementById('questions-history');
    historyContainer.innerHTML = ''; // Vider le conteneur

    questionHistory.forEach(question => {
        const questionDiv = document.createElement('div');
        questionDiv.className = 'question-item';
        
        const equationSpan = document.createElement('div');
        equationSpan.innerHTML = getFullLatexExpression(question.a, question.b);
        
        const pointsSpan = document.createElement('div');
        pointsSpan.className = 'question-points';
        pointsSpan.textContent = `→ ${question.level} point${question.level > 1 ? 's' : ''}`;
        
        questionDiv.appendChild(equationSpan);
        questionDiv.appendChild(pointsSpan);
        historyContainer.appendChild(questionDiv);
    });

    // Déclencher le rendu LaTeX
    if (window.MathJax) {
        MathJax.typesetPromise([historyContainer]).catch((err) => console.log('MathJax error:', err));
    }
}

function startLevel(level) {
    currentProblem = new Problem(level);
    document.getElementById('level-selection').classList.add('hidden');
    document.getElementById('game-screen').classList.remove('hidden');
    
    // Afficher l'expression en LaTeX
    const equationElement = document.getElementById('equation');
    equationElement.textContent = getLatexExpression(currentProblem.a, currentProblem.b);
    
    // Déclencher le rendu LaTeX
    if (window.MathJax) {
        MathJax.typesetPromise([equationElement]).catch((err) => console.log('MathJax error:', err));
    }
    
    // Réinitialiser les inputs
    document.getElementById('input-a').value = '';
    document.getElementById('input-b').value = '';
}

function checkAnswer() {
    const inputA = parseInt(document.getElementById('input-a').value);
    const inputB = parseInt(document.getElementById('input-b').value);
    
    if (isNaN(inputA) || isNaN(inputB)) {
        shakeInputs();
        return;
    }
    
    if (currentProblem.check(inputA, inputB)) {
        // Bonne réponse
        currentScore += currentProblem.level;
        addToHistory(currentProblem); // Ajouter la question à l'historique
        
        // Créer quelques particules pour célébrer
        celebrate();
        
        if (currentScore >= 10) {
            showVictoryScreen();
        } else {
            // Retour à la sélection du niveau
            document.getElementById('game-screen').classList.add('hidden');
            document.getElementById('level-selection').classList.remove('hidden');
        }
        
        document.getElementById('score').textContent = currentScore;
    } else {
        shakeInputs();
    }
}

function shakeInputs() {
    const inputs = [document.getElementById('input-a'), document.getElementById('input-b')];
    inputs.forEach(input => {
        input.classList.add('shake');
        setTimeout(() => input.classList.remove('shake'), 500);
    });
}

function showVictoryScreen() {
    document.getElementById('game-screen').classList.add('hidden');
    document.getElementById('victory-screen').classList.remove('hidden');
    document.getElementById('final-score').textContent = currentScore;
    
    // Afficher l'historique des questions
    displayHistory();
    
    // Lancer le feu d'artifice en continu
    const fireworksInterval = setInterval(celebrate, 1000);
    
    // Arrêter le feu d'artifice quand on quitte l'écran de victoire
    document.getElementById('victory-screen').addEventListener('click', () => {
        clearInterval(fireworksInterval);
    }, { once: true });
}

function restart() {
    currentScore = 0;
    usedPairs.clear();
    questionHistory = []; // Réinitialiser l'historique
    document.getElementById('score').textContent = '0';
    document.getElementById('victory-screen').classList.add('hidden');
    document.getElementById('level-selection').classList.remove('hidden');
    
    // Nettoyer les particules existantes
    document.querySelectorAll('.particle').forEach(p => p.remove());
}
