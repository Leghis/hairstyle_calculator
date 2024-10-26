import React, { useState, useEffect } from 'react';
import { DollarSign, Clock, Award, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";


// Nouveaux types pour les facteurs de temps
const experienceLevels = {
    debutant: {
        label: "Débutant",
        tauxHoraireMultiplicateur: 0.7,
        tempsMultiplicateur: 1.3
    },
    intermediaire: {
        label: "Intermédiaire",
        tauxHoraireMultiplicateur: 0.85,
        tempsMultiplicateur: 1.1
    },
    experimente: {
        label: "Expérimenté",
        tauxHoraireMultiplicateur: 1,
        tempsMultiplicateur: 1
    },
    expert: {
        label: "Expert",
        tauxHoraireMultiplicateur: 1.2,
        tempsMultiplicateur: 0.65
    }
};

const hairFactors = {
    length: {
        court: {label: "Court", timeImpact: -1, description: "Au-dessus des épaules"},
        moyen: {label: "Moyen", timeImpact: 0, description: "Aux épaules"},
        long: {label: "Long", timeImpact: 1, description: "Sous les épaules"},
        tresLong: {label: "Très long", timeImpact: 2, description: "Bas du dos"}
    },
    thickness: {
        fin: {label: "Fin", timeImpact: -0.5, description: "Cheveux légers et fins"},
        moyen: {label: "Moyen", timeImpact: 0, description: "Épaisseur normale"},
        epais: {label: "Épais", timeImpact: 1, description: "Cheveux denses et épais"}
    },
    braidSize: {
        fine: {label: "Fine", timeImpact: 1, description: "Tresses très fines"},
        moyenne: {label: "Moyenne", timeImpact: 0, description: "Tresses standard"},
        large: {label: "Large", timeImpact: -0.5, description: "Grosses tresses"}
    },
    density: {
        espacee: {label: "Espacée", timeImpact: -0.5, description: "Tresses plus espacées"},
        normale: {label: "Normale", timeImpact: 0, description: "Espacement standard"},
        serree: {label: "Serrée", timeImpact: 1, description: "Tresses très rapprochées"}
    }
};

// Données des services mises à jour pour le marché d'Ottawa
const servicesData = {
    hairstyles: [
        {
            type: "boxBraids",
            name: "Tresses (Box braids)",
            priceRange: [80, 120],
            baseTime: 5,
            timeRange: [5, 7],
            baseHourlyRate: 17.14,
            complexity: 1,
            recommendedFactors: {
                length: ["moyen", "long", "tresLong"],
                thickness: ["moyen", "epais"],
                braidSize: ["fine", "moyenne"],
                density: ["normale", "serree"]
            },
            description: "Tresses classiques avec ajout de mèches synthétiques",
            tips: "Plus les tresses sont fines, plus le temps de réalisation sera long"
        },
        {
            type: "knotlessBraids",
            name: "Tresses sans nœuds (Knotless)",
            priceRange: [90, 130],
            baseTime: 5,
            timeRange: [3, 7],
            baseHourlyRate: 20.00,
            complexity: 1.2,
            recommendedFactors: {
                length: ["moyen", "long", "tresLong"],
                thickness: ["moyen", "epais"],
                braidSize: ["fine", "moyenne"],
                density: ["normale", "serree"]
            },
            description: "Tresses plus naturelles sans nœuds apparents",
            tips: "Technique plus délicate nécessitant plus de précision"
        },
        {
            type: "cornrows",
            name: "Cornrows",
            priceRange: [40, 90],
            baseTime: 3,
            timeRange: [1, 5],
            baseHourlyRate: 22.00,
            complexity: 0.8,
            recommendedFactors: {
                length: ["court", "moyen", "long"],
                thickness: ["fin", "moyen", "epais"],
                braidSize: ["moyenne", "large"],
                density: ["normale", "serree"]
            },
            description: "Tresses collées au cuir chevelu formant des motifs",
            tips: "La complexité du motif influence grandement le temps de réalisation"
        },
        {
            type: "twists",
            name: "Twists (Regular/Kinky)",
            priceRange: [60, 100],
            baseTime: 4,
            timeRange: [4, 8],
            baseHourlyRate: 15.00,
            complexity: 0.9,
            recommendedFactors: {
                length: ["moyen", "long"],
                thickness: ["moyen", "epais"],
                braidSize: ["moyenne", "large"],
                density: ["normale", "serree"]
            },
            description: "Torsades deux brins avec ou sans rajouts",
            tips: "Style versatile adapté à différentes textures de cheveux"
        },
        {
            type: "crochetBraids",
            name: "Crochet braids",
            priceRange: [70, 90],
            baseTime: 2.5,
            timeRange: [2, 3],
            baseHourlyRate: 30.00,
            complexity: 0.7,
            recommendedFactors: {
                length: ["court", "moyen"],
                thickness: ["fin", "moyen", "epais"],
                braidSize: ["moyenne", "large"],
                density: ["espacee", "normale"]
            },
            description: "Installation rapide avec crochet et mèches préfabriquées",
            tips: "Solution rapide pour un changement de look"
        },
        {
            type: "weaves",
            name: "Weave (Tissage)",
            priceRange: [80, 100],
            baseTime: 2.5,
            timeRange: [2, 3],
            baseHourlyRate: 35.00,
            complexity: 0.8,
            recommendedFactors: {
                length: ["court", "moyen"],
                thickness: ["fin", "moyen", "epais"],
                braidSize: ["fine"],
                density: ["serree"]
            },
            description: "Tissage de mèches sur tresses cornrows",
            tips: "Nécessite un entretien régulier pour une meilleure durabilité"
        },
        {
            type: "childrensBraids",
            name: "Coiffure pour enfants",
            priceRange: [40, 80],
            baseTime: 2,
            timeRange: [1, 3],
            baseHourlyRate: 30.00,
            complexity: 0.6,
            recommendedFactors: {
                length: ["court", "moyen"],
                thickness: ["fin", "moyen"],
                braidSize: ["moyenne", "large"],
                density: ["espacee", "normale"]
            },
            description: "Styles adaptés aux enfants",
            tips: "Privilégier des styles protecteurs et confortables"
        },
        {
            type: "dreadlocks",
            name: "Locks / Dreadlocks",
            priceRange: [80, 200],
            baseTime: 6,
            timeRange: [4, 8],
            baseHourlyRate: 22.00,
            complexity: 1.3,
            recommendedFactors: {
                length: ["moyen", "long", "tresLong"],
                thickness: ["moyen", "epais"],
                braidSize: ["fine", "moyenne"],
                density: ["normale", "serree"]
            },
            description: "Installation ou entretien de dreadlocks",
            tips: "Le temps varie selon qu'il s'agit d'une installation ou d'un entretien"
        }
    ],

    additionalServices: [
        {
            type: "deepConditioning",
            name: "Soin profond",
            price: 20,
            duration: 0.5,
            description: "Traitement nourrissant en profondeur"
        },
        {
            type: "coloring",
            name: "Coloration",
            price: 30,
            duration: 1,
            description: "Application de couleur sur cheveux naturels ou extensions"
        },
        {
            type: "relaxing",
            name: "Défrisage",
            price: 25,
            duration: 1,
            description: "Traitement chimique pour lisser les cheveux"
        },
        {
            type: "scalpMassage",
            name: "Massage du cuir chevelu",
            price: 15,
            duration: 0.25,
            description: "Massage relaxant stimulant la croissance"
        },
        {
            type: "hairMask",
            name: "Masque capillaire",
            price: 10,
            duration: 0.5,
            description: "Soin hydratant et réparateur"
        }
    ],

    travelFeeBase: 10, // Frais de déplacement de base
    travelFeePerKm: 1, // Frais supplémentaires par km au-delà de 15 km
    taxRate: 0.13, // 13% de TVH en Ontario

    // Nouveaux paramètres pour le calcul du temps
    timeAdjustments: {
        minTimeMultiplier: 0.8, // Réduction maximale du temps de base
        maxTimeMultiplier: 1.5, // Augmentation maximale du temps de base
        experienceImpact: 0.2  // Impact de l'expérience sur le temps
    }
};

const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-CA', {style: 'currency', currency: 'CAD'}).format(amount);
};

const fadeIn = {
    initial: {opacity: 0, y: 20},
    animate: {opacity: 1, y: 0},
    exit: {opacity: 0, y: -20}
};

const springTransition = {
    type: "spring",
    stiffness: 300,
    damping: 30
};

// Fonction utilitaire pour calculer le temps estimé
const calculateEstimatedTime = (baseTime, factors, experienceLevel) => {
    const lengthImpact = hairFactors.length[factors.length].timeImpact;
    const thicknessImpact = hairFactors.thickness[factors.thickness].timeImpact;
    const braidSizeImpact = hairFactors.braidSize[factors.braidSize].timeImpact;
    const densityImpact = hairFactors.density[factors.density].timeImpact;

    const totalImpact = 1 + (lengthImpact + thicknessImpact + braidSizeImpact + densityImpact) * 0.2;
    return baseTime * totalImpact * experienceLevels[experienceLevel].tempsMultiplicateur;
};

// Fonction utilitaire pour calculer le taux horaire ajusté
const calculateAdjustedHourlyRate = (baseRate, experienceLevel) => {
    return baseRate * experienceLevels[experienceLevel].tauxHoraireMultiplicateur;
};

export default function App() {
    const [hairstyleType, setHairstyleType] = useState('');
    const [numberOfHours, setNumberOfHours] = useState('');
    const [travelDistance, setTravelDistance] = useState('');
    const [additionalServices, setAdditionalServices] = useState([]);
    const [priceDetails, setPriceDetails] = useState(null);
    const [errors, setErrors] = useState({});
    const [hairLength, setHairLength] = useState('');
    const [hairThickness, setHairThickness] = useState('');
    const [braidSize, setBraidSize] = useState('');
    const [density, setDensity] = useState('');
    const [experienceLevel, setExperienceLevel] = useState('');
    const [showTimeEstimator, setShowTimeEstimator] = useState(false);
    const [estimatedTime, setEstimatedTime] = useState(null);
    const [adjustedHourlyRate, setAdjustedHourlyRate] = useState(null);
    const [showHelp, setShowHelp] = useState(false);

    // Effet pour réinitialiser les facteurs lors du changement de coiffure
    useEffect(() => {
        if (hairstyleType) {
            setHairLength('');
            setHairThickness('');
            setBraidSize('');
            setDensity('');
            setEstimatedTime(null);
            setNumberOfHours('');
        }
    }, [hairstyleType]);

    // Effet pour calculer le temps estimé
    useEffect(() => {
        if (hairstyleType && hairLength && hairThickness && braidSize && density && experienceLevel) {
            const selectedHairstyle = servicesData.hairstyles.find(h => h.type === hairstyleType);
            const estimatedTime = calculateEstimatedTime(
                selectedHairstyle.baseTime,
                {
                    length: hairLength,
                    thickness: hairThickness,
                    braidSize: braidSize,
                    density: density
                },
                experienceLevel
            );
            setEstimatedTime(estimatedTime);
            setNumberOfHours(estimatedTime.toString()); // Ajoutez cette ligne

            const adjustedRate = calculateAdjustedHourlyRate(
                selectedHairstyle.baseHourlyRate,
                experienceLevel
            );
            setAdjustedHourlyRate(adjustedRate);
        }
    }, [hairstyleType, hairLength, hairThickness, braidSize, density, experienceLevel]);

    // Fonction de validation mise à jour
    const validateInputs = () => {
        const newErrors = {};
        if (!hairstyleType) newErrors.hairstyleType = "Veuillez sélectionner un type de coiffure.";
        if (!experienceLevel) newErrors.experienceLevel = "Veuillez sélectionner votre niveau d'expérience.";
        if (!numberOfHours) newErrors.numberOfHours = "Veuillez entrer le nombre d'heures.";
        if (!hairLength) newErrors.hairLength = "Veuillez sélectionner la longueur des cheveux.";
        if (!hairThickness) newErrors.hairThickness = "Veuillez sélectionner l'épaisseur des cheveux.";
        if (!braidSize) newErrors.braidSize = "Veuillez sélectionner la taille des tresses.";
        if (!density) newErrors.density = "Veuillez sélectionner la densité souhaitée.";

        if (travelDistance === '') {
            newErrors.travelDistance = "Veuillez entrer la distance de déplacement.";
        } else if (Number(travelDistance) < 0) {
            newErrors.travelDistance = "La distance ne peut pas être négative.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Fonction de calcul mise à jour
    const handleCalculate = () => {
        if (!validateInputs()) return;

        const selectedHairstyle = servicesData.hairstyles.find(h => h.type === hairstyleType);
        const finalHourlyRate = adjustedHourlyRate;
        let laborCost = finalHourlyRate * Number(numberOfHours);

        // Vérifier si le coût est dans la fourchette de prix
        if (laborCost < selectedHairstyle.priceRange[0]) {
            laborCost = selectedHairstyle.priceRange[0];
        } else if (laborCost > selectedHairstyle.priceRange[1]) {
            laborCost = selectedHairstyle.priceRange[1];
        }

        const travelFee = Number(travelDistance) > 15
            ? servicesData.travelFeeBase + ((Number(travelDistance) - 15) * servicesData.travelFeePerKm)
            : servicesData.travelFeeBase;

        const additionalServicesTotal = additionalServices.reduce((total, serviceType) => {
            const service = servicesData.additionalServices.find(s => s.type === serviceType);
            return total + (service ? service.price : 0);
        }, 0);

        const subtotal = laborCost + travelFee + additionalServicesTotal;
        const taxAmount = subtotal * servicesData.taxRate;
        const totalPrice = subtotal + taxAmount;

        setPriceDetails({
            laborCost,
            hourlyRate: finalHourlyRate,
            numberOfHours: Number(numberOfHours),
            travelFee,
            additionalServicesTotal,
            taxAmount,
            totalPrice,
            estimatedTime,
            experienceLevel,
            factors: {
                hairLength,
                hairThickness,
                braidSize,
                density
            }
        });
    };

    const selectedHairstyle = servicesData.hairstyles.find(h => h.type === hairstyleType);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen bg-gradient-to-b from-indigo-50 to-white py-12 px-4 sm:px-6 lg:px-8"
        >
            <motion.div
                className="w-full max-w-2xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden"
                initial={{ y: 50 }}
                animate={{ y: 0 }}
                transition={springTransition}
            >
                <div className="p-8">
                    <motion.h1
                        className="text-3xl font-bold text-center text-indigo-800 mb-8"
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        transition={springTransition}
                    >
                        Calculateur de Prix de Coiffure
                    </motion.h1>

                    <form onSubmit={(e) => { e.preventDefault(); handleCalculate(); }} className="space-y-6">
                        {/* Sélection du type de coiffure */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key="hairstyle-select"
                                variants={fadeIn}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                className="space-y-2"
                            >
                                <label htmlFor="hairstyleType" className="block text-sm font-medium text-gray-700">
                                    Type de coiffure
                                </label>
                                <select
                                    id="hairstyleType"
                                    value={hairstyleType}
                                    onChange={(e) => {
                                        setHairstyleType(e.target.value);
                                        setShowTimeEstimator(true);
                                    }}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                                >
                                    <option value="">Sélectionnez une coiffure</option>
                                    {servicesData.hairstyles.map((service) => (
                                        <option key={service.type} value={service.type}>
                                            {service.name} ({formatCurrency(service.priceRange[0])} - {formatCurrency(service.priceRange[1])})
                                        </option>
                                    ))}
                                </select>
                                {errors.hairstyleType && (
                                    <motion.p
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="text-red-500 text-sm mt-1"
                                    >
                                        {errors.hairstyleType}
                                    </motion.p>
                                )}
                            </motion.div>
                        </AnimatePresence>

                        {/* Estimateur de temps */}
                        {selectedHairstyle && showTimeEstimator && (
                            <motion.div
                                initial={{opacity: 0, height: 0}}
                                animate={{opacity: 1, height: "auto"}}
                                exit={{opacity: 0, height: 0}}
                                className="bg-indigo-50 rounded-lg p-6 space-y-4"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-indigo-800">
                                        Estimateur de temps
                                    </h3>
                                    <div className="relative">
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setShowHelp(!showHelp);
                                            }}
                                            onBlur={() => setTimeout(() => setShowHelp(false), 200)}
                                            className="text-indigo-600 hover:text-indigo-800 focus:outline-none"
                                        >
                                            <HelpCircle className="h-5 w-5"/>
                                        </button>
                                        <AnimatePresence>
                                            <HelpTooltip isVisible={showHelp}/>
                                        </AnimatePresence>
                                    </div>
                                </div>

                                {/* Niveau d'expérience */}
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    {Object.entries(experienceLevels).map(([key, value]) => (
                                        <motion.div
                                            key={key}
                                            whileHover={{scale: 1.02}}
                                            whileTap={{scale: 0.98}}
                                        >
                                            <label
                                                className={`flex flex-col items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                                                    experienceLevel === key
                                                        ? 'border-indigo-500 bg-indigo-50'
                                                        : 'border-gray-200 hover:border-indigo-200'
                                                }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="experienceLevel"
                                                    value={key}
                                                    checked={experienceLevel === key}
                                                    onChange={(e) => setExperienceLevel(e.target.value)}
                                                    className="hidden"
                                                />
                                                <Award className={`h-6 w-6 mb-2 ${
                                                    experienceLevel === key ? 'text-indigo-600' : 'text-gray-400'
                                                }`}/>
                                                <span className="text-sm font-medium">{value.label}</span>
                                            </label>
                                        </motion.div>
                                    ))}
                                </div>

                                {/* Facteurs de temps */}
                                <div className="grid grid-cols-2 gap-4">
                                    {/* Longueur des cheveux */}
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Longueur des cheveux
                                        </label>
                                        <select
                                            value={hairLength}
                                            onChange={(e) => setHairLength(e.target.value)}
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500"
                                        >
                                            <option value="">Sélectionner</option>
                                            {Object.entries(hairFactors.length).map(([key, value]) => (
                                                <option key={key} value={key}>
                                                    {value.label} - {value.description}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Épaisseur des cheveux */}
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Épaisseur des cheveux
                                        </label>
                                        <select
                                            value={hairThickness}
                                            onChange={(e) => setHairThickness(e.target.value)}
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500"
                                        >
                                            <option value="">Sélectionner</option>
                                            {Object.entries(hairFactors.thickness).map(([key, value]) => (
                                                <option key={key} value={key}>
                                                    {value.label} - {value.description}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Taille des tresses */}
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Taille des tresses
                                        </label>
                                        <select
                                            value={braidSize}
                                            onChange={(e) => setBraidSize(e.target.value)}
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500"
                                        >
                                            <option value="">Sélectionner</option>
                                            {Object.entries(hairFactors.braidSize).map(([key, value]) => (
                                                <option key={key} value={key}>
                                                    {value.label} - {value.description}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Densité */}
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Densité souhaitée
                                        </label>
                                        <select
                                            value={density}
                                            onChange={(e) => setDensity(e.target.value)}
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500"
                                        >
                                            <option value="">Sélectionner</option>
                                            {Object.entries(hairFactors.density).map(([key, value]) => (
                                                <option key={key} value={key}>
                                                    {value.label} - {value.description}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Affichage du temps estimé */}
                                {estimatedTime && (
                                    <motion.div
                                        initial={{opacity: 0, y: 20}}
                                        animate={{opacity: 1, y: 0}}
                                        className="mt-4 p-4 bg-white rounded-lg shadow-sm"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <Clock className="h-5 w-5 text-indigo-600 mr-2"/>
                                                <span className="text-sm font-medium">Temps estimé:</span>
                                            </div>
                                            <span className="text-lg font-bold text-indigo-800">
                        {estimatedTime.toFixed(1)} heures
                      </span>
                                        </div>
                                        {adjustedHourlyRate && (
                                            <div className="mt-2 text-sm text-gray-600">
                                                Taux horaire ajusté: {formatCurrency(adjustedHourlyRate)}/heure
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                            </motion.div>
                        )}


                        <motion.div
                            variants={fadeIn}
                            initial="initial"
                            animate="animate"
                            className="space-y-2"
                        >
                            <label htmlFor="travelDistance" className="block text-sm font-medium text-gray-700">
                                Distance de déplacement
                            </label>
                            <div className="relative">
                                <input
                                    id="travelDistance"
                                    type="number"
                                    value={travelDistance}
                                    onChange={(e) => setTravelDistance(e.target.value)}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                                    placeholder="Distance en kilomètres"
                                />
                                <motion.div
                                    className="absolute right-3 top-2 text-sm text-gray-500"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                >
                                    km
                                </motion.div>
                            </div>
                            {errors.travelDistance && (
                                <motion.p
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="text-red-500 text-sm mt-1"
                                >
                                    {errors.travelDistance}
                                </motion.p>
                            )}
                        </motion.div>

                        {/* Services additionnels */}
                        <motion.div
                            variants={fadeIn}
                            initial="initial"
                            animate="animate"
                            className="space-y-3"
                        >
                            <label className="block text-sm font-medium text-gray-700">
                                Services additionnels
                            </label>
                            <div className="grid grid-cols-2 gap-4">
                                {servicesData.additionalServices.map((service) => (
                                    <motion.div
                                        key={service.type}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="relative"
                                    >
                                        <label
                                            className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                                                additionalServices.includes(service.type)
                                                    ? 'bg-indigo-50 border-indigo-500'
                                                    : 'border-gray-200 hover:border-indigo-300'
                                            }`}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={additionalServices.includes(service.type)}
                                                onChange={(e) => {
                                                    const checked = e.target.checked;
                                                    setAdditionalServices(prev =>
                                                        checked
                                                            ? [...prev, service.type]
                                                            : prev.filter(s => s !== service.type)
                                                    );
                                                }}
                                                className="hidden"
                                            />
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium">{service.name}</span>
                                                <span className="text-xs text-gray-500">
                          {formatCurrency(service.price)} - {service.duration}h
                        </span>
                                                <span className="text-xs text-gray-400 mt-1">
                          {service.description}
                        </span>
                                            </div>
                                        </label>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Bouton de calcul */}
                        <motion.button
                            type="submit"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full py-3 px-4 bg-indigo-600 text-white font-medium rounded-lg shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200"
                        >
                            Calculer le prix
                        </motion.button>
                    </form>

                    {/* Affichage des résultats */}
                    <AnimatePresence>
                        {priceDetails && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="mt-8"
                            >
                                <motion.div
                                    className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 shadow-sm"
                                    initial={{ scale: 0.95 }}
                                    animate={{ scale: 1 }}
                                    transition={springTransition}
                                >
                                    <div className="flex items-start space-x-4">
                                        <div className="flex-shrink-0">
                                            <motion.div
                                                initial={{ rotate: -180 }}
                                                animate={{ rotate: 0 }}
                                                transition={{ duration: 0.5 }}
                                            >
                                                <DollarSign className="h-6 w-6 text-indigo-600" />
                                            </motion.div>
                                        </div>

                                        <div className="flex-1">
                                            <motion.h3
                                                className="text-lg font-semibold text-indigo-800 mb-4"
                                                initial={{ x: -20 }}
                                                animate={{ x: 0 }}
                                            >
                                                Résumé du Prix
                                            </motion.h3>

                                            <div className="space-y-3">
                                                {/* Détails du service */}
                                                <motion.div
                                                    className="bg-white rounded-lg p-4 shadow-sm"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{ delay: 0.2 }}
                                                >
                                                    <h4 className="font-medium text-gray-700 mb-2">Détails du service</h4>
                                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                                        <div className="text-gray-600">Niveau d'expérience:</div>
                                                        <div className="text-right font-medium">
                                                            {experienceLevels[priceDetails.experienceLevel].label}
                                                        </div>
                                                        <div className="text-gray-600">Temps estimé:</div>
                                                        <div className="text-right font-medium">
                                                            {priceDetails.estimatedTime.toFixed(1)} heures
                                                        </div>
                                                        <div className="text-gray-600">Taux horaire:</div>
                                                        <div className="text-right font-medium">
                                                            {formatCurrency(priceDetails.hourlyRate)}/heure
                                                        </div>
                                                    </div>
                                                </motion.div>

                                                {/* Facteurs appliqués */}
                                                <motion.div
                                                    className="bg-white rounded-lg p-4 shadow-sm"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{ delay: 0.3 }}
                                                >
                                                    <h4 className="font-medium text-gray-700 mb-2">Facteurs appliqués</h4>
                                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                                        <div className="text-gray-600">Longueur:</div>
                                                        <div className="text-right font-medium">
                                                            {hairFactors.length[priceDetails.factors.hairLength].label}
                                                        </div>
                                                        <div className="text-gray-600">Épaisseur:</div>
                                                        <div className="text-right font-medium">
                                                            {hairFactors.thickness[priceDetails.factors.hairThickness].label}
                                                        </div>
                                                        <div className="text-gray-600">Taille des tresses:</div>
                                                        <div className="text-right font-medium">
                                                            {hairFactors.braidSize[priceDetails.factors.braidSize].label}
                                                        </div>
                                                        <div className="text-gray-600">Densité:</div>
                                                        <div className="text-right font-medium">
                                                            {hairFactors.density[priceDetails.factors.density].label}
                                                        </div>
                                                    </div>
                                                </motion.div>

                                                {/* Résumé des coûts */}
                                                <motion.div
                                                    className="grid grid-cols-2 gap-2 text-sm"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{ delay: 0.4 }}
                                                >
                                                    <div className="text-gray-600">Coût de base:</div>
                                                    <div className="text-right font-medium">
                                                        {formatCurrency(priceDetails.laborCost)}
                                                    </div>

                                                    <div className="text-gray-600">Frais de déplacement:</div>
                                                    <div className="text-right font-medium">
                                                        {formatCurrency(priceDetails.travelFee)}
                                                    </div>

                                                    <div className="text-gray-600">Services additionnels:</div>
                                                    <div className="text-right font-medium">
                                                        {formatCurrency(priceDetails.additionalServicesTotal)}
                                                    </div>

                                                    <motion.div
                                                        className="col-span-2 border-t border-indigo-200 my-2"
                                                        initial={{ scaleX: 0 }}
                                                        animate={{ scaleX: 1 }}
                                                    />

                                                    <div className="text-gray-600">Sous-total:</div>
                                                    <div className="text-right font-medium">
                                                        {formatCurrency(priceDetails.laborCost + priceDetails.travelFee + priceDetails.additionalServicesTotal)}
                                                    </div>

                                                    <div className="text-gray-600">
                                                        Taxes ({(servicesData.taxRate * 100).toFixed(0)}%):
                                                    </div>
                                                    <div className="text-right font-medium">
                                                        {formatCurrency(priceDetails.taxAmount)}
                                                    </div>

                                                    <motion.div
                                                        className="col-span-2 border-t border-indigo-300 my-2"
                                                        initial={{ scaleX: 0 }}
                                                        animate={{ scaleX: 1 }}
                                                        transition={{ delay: 0.3 }}
                                                    />

                                                    <motion.div
                                                        className="text-lg font-bold text-indigo-800"
                                                        initial={{ scale: 0.9 }}
                                                        animate={{ scale: 1 }}
                                                        transition={{ delay: 0.4 }}
                                                    >
                                                        Prix total:
                                                    </motion.div>
                                                    <motion.div
                                                        className="text-right text-lg font-bold text-indigo-800"
                                                        initial={{ scale: 0.9 }}
                                                        animate={{ scale: 1 }}
                                                        transition={{ delay: 0.4 }}
                                                    >
                                                        {formatCurrency(priceDetails.totalPrice)}
                                                    </motion.div>
                                                </motion.div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </motion.div>
    );
}


const HelpTooltip = ({ isVisible }) => {
    if (!isVisible) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 top-8 w-80 bg-white p-4 rounded-lg shadow-xl border border-indigo-100 z-50"
        >
            <div className="space-y-3">
                <h4 className="font-semibold text-indigo-800">Guide d'utilisation</h4>

                <div className="space-y-2 text-sm text-gray-600">
                    <p className="font-medium text-indigo-600">Comment choisir les options :</p>

                    <div className="space-y-2">
                        <div>
                            <span className="font-medium">Niveau d'expérience :</span>
                            <p className="text-gray-500">Sélectionnez votre niveau d'expertise en coiffure. Cela affectera le temps et le tarif.</p>
                        </div>

                        <div>
                            <span className="font-medium">Longueur des cheveux :</span>
                            <p className="text-gray-500">Choisissez en fonction de la longueur réelle des cheveux du client.</p>
                        </div>

                        <div>
                            <span className="font-medium">Épaisseur des cheveux :</span>
                            <p className="text-gray-500">Évaluez la densité naturelle des cheveux du client.</p>
                        </div>

                        <div>
                            <span className="font-medium">Taille des tresses :</span>
                            <p className="text-gray-500">Plus les tresses sont fines, plus le temps de réalisation sera long.</p>
                        </div>

                        <div>
                            <span className="font-medium">Densité souhaitée :</span>
                            <p className="text-gray-500">Influence le nombre de tresses et donc le temps de réalisation.</p>
                        </div>
                    </div>

                    <p className="text-xs text-indigo-600 mt-2">
                        Note : Le temps estimé est calculé automatiquement en fonction de vos sélections.
                    </p>
                </div>
            </div>

            <div className="absolute -top-2 right-4 w-4 h-4 bg-white transform rotate-45 border-t border-l border-indigo-100" />
        </motion.div>
    );
};