# Kaizen Votes

Plateforme de vote pour serveurs Minecraft avec tableau de bord, récompenses et notifications en temps réel.

## Structure du projet

```
Kaizen-votes/
├── frontend/              # Application web Laravel + React
└── kaizen-votes-plugin/   # Plugin Minecraft (Spigot/Paper)
```

## Frontend

Application web construite avec :
- **Laravel 12** - Framework PHP
- **Inertia.js v2** - SPA sans API
- **React 19** - Interface utilisateur
- **Tailwind CSS v4** - Styles
- **Laravel Reverb** - WebSockets temps réel

### Fonctionnalités
- Liste et recherche de serveurs Minecraft
- Système de vote avec cooldown
- Récompenses configurables (items, commandes, argent)
- Tableau de bord propriétaire de serveur
- Leaderboards et statistiques
- Authentification avec 2FA
- Support multilingue (FR/EN)

### Installation

```bash
cd frontend
composer install
npm install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
npm run build
```

### Lancement en développement

```bash
cd frontend
composer run dev
```

## Plugin Minecraft

Plugin pour Spigot/Paper 1.20+ qui connecte votre serveur à la plateforme.

### Fonctionnalités
- Réception des votes en temps réel via WebSocket
- Distribution automatique des récompenses
- Commandes `/vote`, `/votetop`, `/rewards`
- Notification aux joueurs de leurs récompenses en attente
- Support multilingue (FR/EN)

### Installation

1. Compiler le plugin :
```bash
cd kaizen-votes-plugin
./gradlew build
```

2. Copier `build/libs/kaizen-votes-plugin-1.0.0.jar` dans le dossier `plugins/` de votre serveur

3. Redémarrer le serveur et configurer `plugins/KaizenVotes/config.yml`

### Configuration

```yaml
api:
  base-url: "https://votre-instance.com"
  server-token: "votre-token"
```

## Licence

MIT
