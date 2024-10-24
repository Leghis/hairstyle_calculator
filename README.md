# Calculateur de Prix de Coiffure 💇‍♀️

Une application React moderne et interactive pour calculer les prix des services de coiffure, spécialement conçue pour le marché d'Ottawa.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Licence](https://img.shields.io/badge/license-MIT-green.svg)

## 📋 Description

Cette application web permet aux coiffeurs et aux clients de calculer rapidement et précisément le coût total des services de coiffure, en prenant en compte différents facteurs tels que le type de coiffure, la durée, les déplacements et les services additionnels.

## ✨ Fonctionnalités

- 🎯 Calcul précis des prix basé sur le temps et le type de service
- 💰 Tarification dynamique avec fourchettes de prix min/max
- 🚗 Calcul automatique des frais de déplacement
- ➕ Services additionnels optionnels
- 💵 Calcul automatique des taxes (TVH Ontario)
- 🎨 Interface utilisateur moderne et responsive
- ✨ Animations fluides et retours visuels

## 🛠️ Technologies Utilisées

- React.js
- Tailwind CSS
- Framer Motion (pour les animations)
- Lucide React (pour les icônes)
- Intl.NumberFormat (pour le formatage des devises)

## 📥 Installation

1. Clonez le dépôt :
```bash
git clone https://github.com/votre-username/calculateur-prix-coiffure.git
```

2. Installez les dépendances :
```bash
cd calculateur-prix-coiffure
npm install
```

3. Installez les dépendances spécifiques :
```bash
npm install framer-motion lucide-react
```

## 🚀 Démarrage

Pour lancer l'application en mode développement :

```bash
npm start
```

L'application sera accessible à l'adresse [http://localhost:3000](http://localhost:3000)

## 📊 Structure des Données

### Services de Coiffure
L'application utilise un objet `servicesData` qui contient :
- Liste des types de coiffures avec fourchettes de prix
- Services additionnels
- Frais de déplacement
- Taux de TVH

### Exemple de Configuration
```javascript
const servicesData = {
  hairstyles: [
    {
      type: "boxBraids",
      name: "Tresses (Box braids)",
      priceRange: [80, 120],
      timeRange: [5, 7],
      hourlyRate: 17.14
    },
    // ... autres styles
  ],
  additionalServices: [
    { type: "deepConditioning", name: "Soin profond", price: 20 },
    // ... autres services
  ]
};
```

## 🔧 Personnalisation

### Modifier les Services
Pour ajouter ou modifier des services, éditez le fichier contenant `servicesData` :

1. Pour ajouter un nouveau type de coiffure :
```javascript
{
  type: "newStyle",
  name: "Nouveau Style",
  priceRange: [min, max],
  timeRange: [minHours, maxHours],
  hourlyRate: rate
}
```

2. Pour ajouter un service additionnel :
```javascript
{
  type: "newService",
  name: "Nouveau Service",
  price: amount
}
```

### Modification des Tarifs
- `travelFeeBase` : Frais de déplacement de base
- `travelFeePerKm` : Frais par kilomètre supplémentaire
- `taxRate` : Taux de TVH

## 📱 Compatibilité

- ✅ Desktop (Chrome, Firefox, Safari, Edge)
- ✅ Tablettes
- ✅ Mobile
- ✅ PWA ready

## 🤝 Contribution

Les contributions sont les bienvenues ! Pour contribuer :

1. Forkez le projet
2. Créez votre branche (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add AmazingFeature'`)
4. Pushez vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 👥 Contact

Pour toute question ou suggestion, n'hésitez pas à ouvrir une issue ou à nous contacter directement.

---

Développé avec ❤️ pour la communauté des coiffeurs d'Ottawa