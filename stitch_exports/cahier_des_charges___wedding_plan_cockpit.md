# 🚀 Spécifications Détaillées : Wedding plan
**Sous-titre de l'application :** Cockpit - Prestige Edition

## I. Architecture Technique & Fondations
* Mode Offline-First
* Persistance Absolue & Temps Réel (Firebase/Supabase + WebSockets)
* Architecture Multi-Projets
* Système de QR Codes uniques (UUID)

## II. Design System & Thématiques
* **Thème : Editorialist (Haute Couture / Luxe)**
  * UI : Fond blanc cassé texture papier, typographie Serif élégante, bordures minimalistes, accents dorés.
  * UX : Espaces blancs importants, navigation textuelle.
* **Navigation :** Dock Flottant en bas (style iOS).

## III. Modules de Préparation
* Design Hub (Canva API)
* CRM Invités & "Cercles" (Visibilité conditionnelle)
* Écosystème Prestataires (RBAC)

## IV. Modules Opérationnels (Le Cockpit)
1. **Mapping Spatial & Logistique :** Floor plan Drag-and-Drop, Heatmap temps réel (Scan & Flow), Jauges de remplissage.
2. **Module DJ "Live Deck" :** Tracklist partagée, Drag-and-Drop live, Notes contextuelles.
3. **Mode Cortège GPS :** Balise Live.
4. **Messagerie "Backstage" :** Canaux tripartites.
5. **Hub Invité (PWA) :** Timeline perso, Menu digital, Upload photo.

## Écrans à réaliser
1. **Dashboard Central (Cockpit) :** Agenda de la mariée, Flux Backstage, Dock flottant.
2. **Gestion des Tables :** Plan de salle interactif, Monitoring Scan & Flow, Liste des manquants, Widget DJ.