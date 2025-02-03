# Entraînement à l'Identité Remarquable 4

Une application web interactive pour aider les élèves à maîtriser l'identité remarquable : 
```
(x + a)(x + b) = x² + (a + b)x + ab
```

## Description

Cette application permet aux élèves de s'entraîner à factoriser des expressions du second degré en utilisant l'identité remarquable 4. Les élèves doivent retrouver les valeurs de `a` et `b` à partir de la forme développée.

## Fonctionnalités

### Mode Entraînement
- Trois niveaux de difficulté :
  - **Niveau 1** (1 point) : `a` et `b` sont des entiers positifs entre 1 et 10
  - **Niveau 2** (2 points) : `a` et `b` sont des entiers relatifs entre -10 et 10
  - **Niveau 3** (3 points) : `a` et `b` sont des entiers relatifs entre -20 et 20

- Système de points :
  - Chaque niveau rapporte un nombre de points correspondant à sa difficulté
  - Objectif : atteindre 10 points
  - Historique des questions résolues affiché à la victoire

### Caractéristiques techniques
- Interface responsive et moderne
- Rendu mathématique en LaTeX avec MathJax
- Animations pour les réponses correctes et incorrectes
- Pas de répétition des questions durant une même session

## Technologies utilisées
- HTML5
- CSS3
- JavaScript (Vanilla)
- MathJax pour le rendu des expressions mathématiques


## Utilisation

1. Accédez à la page d'accueil
2. Cliquez sur "S'entraîner"
3. Choisissez un niveau de difficulté
4. Pour chaque expression proposée :
   - Identifiez les valeurs de `a` et `b`
   - Entrez ces valeurs dans les champs correspondants
   - Cliquez sur "Vérifier"
5. Continuez jusqu'à atteindre 10 points

## Développement futur
- Implémentation du mode "Apprendre"

## Auteur
Fanny Boitard  
Collège Voltaire

## Licence
Ce projet open source, destiné à un usage éducatif.
