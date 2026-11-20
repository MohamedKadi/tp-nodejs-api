# Mini rapport du projet Posts Manager

## Présentation et objectif

Posts Manager est une application de gestion de publications réalisée avec Node.js et une interface web en HTML, CSS et JavaScript. Elle permet de créer, consulter, modifier et supprimer des publications, soit les quatre opérations CRUD. Ce mini projet illustre les échanges HTTP entre un navigateur et une API, ainsi que la persistance des données dans un fichier JSON.

## Technologies et organisation

Le serveur utilise uniquement les modules natifs de Node.js, sans Express ni dépendances externes. Le projet sépare le traitement des requêtes, la gestion des données et l’interface utilisateur.

| Fichier | Rôle |
| --- | --- |
| `server.js` | Serveur HTTP sur le port 3000, routage, lecture des requêtes JSON et réponses de l’API. |
| `postManager.js` | Lecture et écriture des publications avec `fs`, recherche par identifiant et opérations CRUD. |
| `posts.json` | Stockage persistant des publications. |
| `seed.js` | Import de publications depuis JSONPlaceholder pour initialiser les données. |
| `client/index.html` | Interface web et appels à l’API avec `fetch`. |
| `api-tests.http` | Exemples de requêtes pour tester manuellement les routes. |

Une publication contient les champs `id`, `userId`, `title` et `body`. Lors d’une création, le serveur attribue un identifiant égal au plus grand identifiant présent augmenté de un. Lors d’une modification, il fusionne les champs reçus avec les données existantes et conserve l’identifiant.

## Fonctionnement de l’API

L’API est accessible à l’adresse `http://localhost:3000/api/posts`.

| Méthode | Route | Fonction | Code de succès |
| --- | --- | --- | --- |
| GET | `/api/posts` | Lister les publications | 200 |
| GET | `/api/posts/:id` | Consulter une publication | 200 |
| POST | `/api/posts` | Créer une publication | 201 |
| PUT | `/api/posts/:id` | Modifier une publication | 200 |
| DELETE | `/api/posts/:id` | Supprimer une publication | 200 |

Les réponses sont au format JSON. Le serveur renvoie un code 400 lorsque le corps JSON est invalide, 404 pour une publication ou une route introuvable et 500 pour les autres erreurs traitées. Il autorise les appels entre origines via les en-têtes CORS et répond aux requêtes préalables `OPTIONS` avec le code 204.

Après une création, une modification ou une suppression, le module de gestion réécrit le fichier `posts.json`. Les changements restent ainsi disponibles après le redémarrage du serveur.

## Interface utilisateur

L’interface affiche les publications sous forme de cartes, par identifiant décroissant. Un formulaire permet de saisir l’utilisateur, le titre et le contenu, puis de créer ou modifier une publication. La suppression demande une confirmation.

Une recherche locale filtre les titres et les contenus sans distinction de casse. Un compteur indique le nombre de résultats affichés, un bouton recharge les données et des messages signalent les succès ou les erreurs. Après chaque opération de modification des données, la liste est rechargée depuis l’API.

## Exécution et vérification

Depuis la racine du projet, avec Node.js installé, lancer :

```sh
node server.js
```

Ouvrir ensuite `client/index.html` dans un navigateur. Le serveur fournit l’API uniquement : il ne sert pas la page HTML. Aucune installation de dépendances n’est nécessaire.

Le fichier `posts.json` est déjà présent. Pour réinitialiser son contenu depuis JSONPlaceholder, exécuter `node seed.js` depuis la racine du projet. Cette commande nécessite Internet et remplace les données locales.

Les requêtes de `api-tests.http` peuvent être exécutées avec un client HTTP compatible. Pour vérifier le cycle CRUD, créer une publication, relever son identifiant, la consulter, la modifier puis la supprimer. Adapter les identifiants des exemples aux données présentes. Le script `npm test` est actuellement un simple message d’erreur : aucune suite de tests automatisés n’est configurée.

## Limites et perspectives

La validation des champs repose principalement sur le formulaire ; l’API ne contrôle pas leur présence ni leur type. Le projet ne propose pas d’authentification ni de pagination. Le stockage par réécriture complète du fichier convient à un exercice, mais des écritures simultanées peuvent entraîner une perte de modifications.

Les améliorations possibles sont une validation côté serveur, des tests automatisés des routes et une base de données telle que MongoDB. Le stockage actuel est un fichier JSON, sans moteur de base de données NoSQL.

## Bilan

Ce projet met en pratique une architecture client-serveur simple, les méthodes HTTP, les échanges JSON et les entrées-sorties asynchrones avec Node.js. Il fournit une base fonctionnelle pour comprendre une API CRUD et son intégration dans une interface web.
