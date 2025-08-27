# ===== Étape 1 =====
# On part d'une image Node pour avoir les outils npm/node
FROM node:22-alpine AS builder

# On se place dans le dossier de travail
WORKDIR /app

# On copie les fichiers de dépendances...
COPY package*.json ./
# ... et on installe TOUTES les dépendances
RUN npm install

# On copie le reste du code source
COPY . .

# On lance le script de build pour générer les fichiers statiques
RUN npm run build


# ===== Étape 2 =====
# On part d'une image Nginx ultra-légère
FROM nginx:stable-alpine

# On copie UNIQUEMENT le résultat du build (le dossier /app/dist) depuis l'étape "builder"
# vers le dossier où Nginx sert les fichiers HTML
COPY --from=builder /app/dist /usr/share/nginx/html

# --- La configuration pour React Router ---
# On remplace la configuration par défaut de Nginx par la nôtre
COPY nginx.conf /etc/nginx/conf.d/default.conf

# On expose le port 80, le port standard du web
EXPOSE 80

# La commande de démarrage est gérée par l'image Nginx, on n'ajoute pas de CMD