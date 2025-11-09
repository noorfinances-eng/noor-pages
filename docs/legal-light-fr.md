# NOOR (NUR) — Fiche “FINMA Light” (Suisse) — Version interne

**Date** : 09.11.2025  
**Contact officiel** : noorfinances@gmail.com  
**Réseau** : BNB Smart Chain (BSC, Chain ID 56)

## 1) Résumé exécutif
NOOR (NUR) est un **jeton utilitaire et de paiement interne** déployé sur BSC. Le projet ne propose **aucun rendement**, **aucune conversion fiat directe**, et **aucun service de garde** de fonds pour autrui. Le token est destiné à l’usage interne (paiements entre utilisateurs, staking symbolique, “Proof of Light” = missions/actions positives).

## 2) Classification du token
- **Type** : Utility + Payment token interne
- **Fonctions principales** :
  - Paiement P2P de petite valeur entre utilisateurs/partenaires (sans fiat).
  - Accès/avantages symboliques (ex. missions “Proof of Light”).
  - Staking **non financier** (symbolique/utilitaire : engagement + distribution interne).
- **Ce que NOOR n’est pas** :
  - Pas un **titre financier** (pas de droits économiques, pas d’equity, pas de créance).
  - Pas un **instrument de placement collectif** (aucune gestion pour compte de tiers).
  - Pas une **offre au public de produits d’investissement** (pas d’ICO/IDO).

## 3) Modèle d’utilisation (usage interne)
- **Paiements** : échanges NUR ↔ NUR pour services/biens **dans un cadre interne** (communauté/marchands affiliés).
- **Staking** : mécanisme **symbolique** (engagement + distribution interne). Aucune promesse de rendement financier; les paramètres peuvent évoluer pour stabilité du système.
- **Proof of Light** : allocation de NUR à des actions **transparentes et positives** (éducation, entraide, gouvernance, contributions).
- **Aucune vente publique contre CHF/EUR/USD**. Les conversions éventuelles se font plus tard via **PSP partenaires** (ex. Mt Pelerin/NOWPayments), hors du périmètre de NOOR.

## 4) Absence de promesse et de garde (non-custody)
- **Aucun rendement garanti** (ni intérêt, ni dividende).
- **Zéro custody** : les utilisateurs gardent leurs clés et fonds. Le projet n’opère pas de compte client, pas de conservation pour autrui.
- **Non-intermédiation** : le site/app ne prend pas possession des fonds; les transactions sont EVM standard (wallet ↔ smart contract/wallet).

## 5) Cadre “Legal Light” (périmètre)
- **Sans inscription FINMA/OAR** tant qu’il n’y a :
  - ni **conversion fiat directe** opérée par NOOR,
  - ni **garde de fonds** pour autrui,
  - ni **offre de placements** ou promesse de rendement.
- **Conversions fiat** : uniquement via **prestataires partenaires** régulés (PSP), sous leurs propres obligations LBA/KYC.
- **Communication** : centrée sur l’utilité et la transparence; **pas de sollicitation d’investissement**.

## 6) Gouvernance et responsabilités
- **Fondateur/owner** : 0x2538398B396bd16370aFBDaF42D09e637a86C3AC (déploiements, upgrades où applicables, paramètres de sécurité si prévus).
- **Contrats** :
  - Token (NOORTokenV2) : `0xA20212290866C8A804a89218c8572F28C507b401`
  - Staking V3 : `0x4eBAbfb635A865EEA2a5304E1444B125aE223f70`
  - Ancien Staking V2 (legacy) : `0x6CB5CBEc7F0c5870781eA467244Ed31e2Ea3c702`
- **Vesting fondateur** : ~25 % sur **24 mois linéaire**, pour alignement long terme (aucune obligation d’achat de la part du public).
- **Transparence** : code public, adresses publiées, mises à jour GitHub, mentions légales sur le site.

## 7) Risques et limites (disclosure)
- **Volatilité** : le prix du token peut varier fortement (liquidité limitée au départ).
- **Risque technique** : bugs, indisponibilités réseau, changements d’API wallet/bridge.
- **Risque utilisateur** : perte de clé privée, erreurs d’adresse, transactions irréversibles.
- **Risque marché** : faible profondeur d’ordre, glissement (slippage) lors d’échanges sur DEX.
- **Risque réglementaire** : évolution du cadre légal; NOOR s’engage à ajuster ses mentions/processus si nécessaire.

## 8) Conformité opérationnelle
- **KYC/LBA** : non applicable au niveau du projet tant qu’il n’y a pas de conversion fiat opérée par NOOR ni de custody. Les PSP partenaires appliquent leurs propres KYC/LBA.
- **Données personnelles** : minimisation (aucune collecte sensible côté on-chain). Le site conserve uniquement ce qui est nécessaire (voir politique dédiée si ajoutée).
- **Journalisation** : transparence publique via BscScan + documentation GitHub (releases, adresses, paramètres).

## 9) Communication publique (principes)
- Ne pas utiliser de langage de **promesse de gain**.
- Mettre en avant l’**utilité** (paiements internes, missions Proof of Light) et la **transparence** (adresses, docs).
- Clarifier la **responsabilité utilisateur** (auto-garde, transactions à ses risques).
- Rediriger toute conversion fiat vers **PSP partenaires**.

## 10) Annexes (références projet)
- **Site** : Next.js + Tailwind (Vercel), langues : FR/EN/DE.
- **Pages clés** : /pay (QR & EIP-681), /merchant (kit marchand), mentions légales (footer), docs (GitHub).
- **Budget** : développement 0 CHF; **LP initiale** envisagée : **1500 CHF** (NUR/BNB) après validations techniques; lock LP envisagé.

---

### Déclaration
Ce document résume la position du projet NOOR (NUR) au **09.11.2025** et sera mis à jour si le périmètre évolue (ex. intégration PSP, nouvelles fonctionnalités). NOOR reste un projet **utilitaire** orienté **paiement interne** et **transparence**, sans garde de fonds, sans promesse de rendement et sans conversion fiat directe opérée par le projet.

