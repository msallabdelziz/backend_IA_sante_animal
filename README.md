# Backend IA Santé Animale 🐾

Ce projet constitue le backend d'un **système de surveillance et de santé animale** basé sur l'Intelligence Artificielle.
Il permet de gérer les utilisateurs (administrateurs et éleveurs), les fermes, les catégories d'élevage 
et facilite la collecte et le traitement des données issues des capteurs IoT.

---

## 🚀 Fonctionnalités
### ✅ Gestion des Utilisateurs
- **Administrateurs** : Gestion complète des utilisateurs, fermes et données globales.
- **Éleveurs** : Gestion des fermes, visualisation des anomalies, et suivi des animaux.

### ✅ Gestion des Fermes
- Création, modification, et suppression des fermes.
- Chaque ferme appartient à un éleveur et contient plusieurs catégories d'élevage (espèces animales).

### ✅ Intégration IoT
- Collecte des données via des capteurs connectés (température, activité, etc.).
- Analyse en temps réel pour détecter des anomalies (température critique, mouvements anormaux).

### ✅ Notifications
- Envoi de notifications aux éleveurs via :
  - 📧 Email
  - 📱 SMS

### ✅ Sécurité
- Authentification sécurisée avec **JWT**.
- Rôles et permissions pour limiter les accès.

---

## 🛠️ Technologies Utilisées
- **Node.js** : Framework JavaScript pour le backend.
- **Express.js** : Pour la gestion des API RESTful.
- **MongoDB** : Base de données NoSQL.
- **Mongoose** : ODM pour MongoDB.
- **JWT** : Pour l'authentification.
- **dotenv** : Pour gérer les variables d'environnement.

---

## 📦 Installation

### 1. Clonez le dépôt
```bash
git clone https://github.com/msallabdelaziz/backend_IA_sante_animal.git


2. Accédez au répertoire
bash
Copier
Modifier
cd backend_IA_sante_animal

3. Installez les dépendances
bash
Copier
Modifier
npm install

4. Configurez les variables d'environnement
Créez un fichier .env à la racine du projet et ajoutez :

env
Copier
Modifier
MONGO_URI=mongodb://127.0.0.1:27017/db_app_ia
JWT_SECRET=votre_cle_secrete
PORT=3000

5. Lancez le serveur
En mode développement :

bash
Copier
Modifier
npm run dev

🔗 Principales Routes API
Utilisateurs
POST /api/users/register : Inscription d'un utilisateur.
POST /api/users/login : Connexion.

Fermes
POST /api/farms : Création d'une ferme.
GET /api/farms : Liste des fermes d'un propriétaire connecté.
PUT /api/farms/:id : Mise à jour d'une ferme.
DELETE /api/farms/:id : Suppression d'une ferme.

🌟 Contribution
Les contributions sont les bienvenues ! Si vous souhaitez contribuer :

Forkez le projet.
Créez une branche : git checkout -b feature/nom-de-la-fonctionnalite.
Faites un commit : git commit -m "Ajout de la fonctionnalité X".
Poussez vos modifications : git push origin feature/nom-de-la-fonctionnalite.
Ouvrez une pull request.