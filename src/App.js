import React, { useState } from 'react';
import { DollarSign } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Données des services mises à jour pour le marché d'Ottawa
const servicesData = {
  hairstyles: [
    {
      type: "boxBraids",
      name: "Tresses (Box braids)",
      priceRange: [80, 120],
      timeRange: [5, 7],
      hourlyRate: 17.14,
    },
    {
      type: "knotlessBraids",
      name: "Tresses sans nœuds (Knotless)",
      priceRange: [90, 130],
      timeRange: [3, 7],
      hourlyRate: 20.00,
    },
    {
      type: "cornrows",
      name: "Cornrows",
      priceRange: [40, 90],
      timeRange: [1, 5],
      hourlyRate: 22.00,
    },
    {
      type: "twists",
      name: "Twists (Regular/Kinky)",
      priceRange: [60, 100],
      timeRange: [4, 8],
      hourlyRate: 15.00,
    },
    {
      type: "crochetBraids",
      name: "Crochet braids",
      priceRange: [70, 90],
      timeRange: [2, 3],
      hourlyRate: 30.00,
    },
    {
      type: "weaves",
      name: "Weave (Tissage)",
      priceRange: [80, 100],
      timeRange: [2, 3],
      hourlyRate: 35.00,
    },
    {
      type: "childrensBraids",
      name: "Coiffure pour enfants",
      priceRange: [40, 80],
      timeRange: [1, 3],
      hourlyRate: 30.00,
    },
    {
      type: "dreadlocks",
      name: "Locks / Dreadlocks",
      priceRange: [80, 200],
      timeRange: [4, 8],
      hourlyRate: 22.00,
    },
  ],

  additionalServices: [
    { type: "deepConditioning", name: "Soin profond", price: 20 },
    { type: "coloring", name: "Coloration", price: 30 },
    { type: "relaxing", name: "Défrisage", price: 25 },
    { type: "scalpMassage", name: "Massage du cuir chevelu", price: 15 },
    { type: "hairMask", name: "Masque capillaire", price: 10 },
  ],
  travelFeeBase: 10, // Frais de déplacement de base
  travelFeePerKm: 1, // Frais supplémentaires par km au-delà de 15 km
  taxRate: 0.13 // 13% de TVH en Ontario
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('fr-CA', { style: 'currency', currency: 'CAD' }).format(amount);
};

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

const springTransition = {
  type: "spring",
  stiffness: 300,
  damping: 30
};

export default function App() {
  const [hairstyleType, setHairstyleType] = useState('');
  const [numberOfHours, setNumberOfHours] = useState('');
  const [travelDistance, setTravelDistance] = useState('');
  const [additionalServices, setAdditionalServices] = useState([]);
  const [priceDetails, setPriceDetails] = useState(null);
  const [errors, setErrors] = useState({});

  const validateInputs = () => {
    const newErrors = {};
    if (!hairstyleType) newErrors.hairstyleType = "Veuillez sélectionner un type de coiffure.";
    if (!numberOfHours) newErrors.numberOfHours = "Veuillez entrer le nombre d'heures.";
    else {
      const selectedHairstyle = servicesData.hairstyles.find(h => h.type === hairstyleType);
      const minHours = selectedHairstyle.timeRange[0];
      const maxHours = selectedHairstyle.timeRange[1];
      if (Number(numberOfHours) < minHours || Number(numberOfHours) > maxHours) {
        newErrors.numberOfHours = `Le nombre d'heures doit être entre ${minHours} et ${maxHours}.`;
      }
    }
    if (travelDistance === '') newErrors.travelDistance = "Veuillez entrer la distance de déplacement.";
    else if (Number(travelDistance) < 0) newErrors.travelDistance = "La distance ne peut pas être négative.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCalculate = () => {
    if (!validateInputs()) return;

    const selectedHairstyle = servicesData.hairstyles.find(h => h.type === hairstyleType);
    const hourlyRate = selectedHairstyle.hourlyRate;
    let laborCost = hourlyRate * Number(numberOfHours);

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
      hourlyRate,
      numberOfHours: Number(numberOfHours),
      travelFee,
      additionalServicesTotal,
      taxAmount,
      totalPrice,
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
            className="w-full max-w-md mx-auto bg-white shadow-xl rounded-2xl overflow-hidden"
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
                        setNumberOfHours('');
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
              {selectedHairstyle && (
                  <AnimatePresence mode="wait">
                    <motion.div
                        key="hours-input"
                        variants={fadeIn}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className="space-y-2"
                    >
                      <label htmlFor="numberOfHours" className="block text-sm font-medium text-gray-700">
                        Nombre d'heures
                      </label>
                      <div className="relative">
                        <input
                            id="numberOfHours"
                            type="number"
                            step="0.5"
                            value={numberOfHours}
                            onChange={(e) => setNumberOfHours(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                            placeholder={`${selectedHairstyle.timeRange[0]} - ${selectedHairstyle.timeRange[1]} heures`}
                        />
                        <motion.div
                            className="absolute right-3 top-2 text-sm text-gray-500"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                          h
                        </motion.div>
                      </div>
                      {errors.numberOfHours && (
                          <motion.p
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              className="text-red-500 text-sm mt-1"
                          >
                            {errors.numberOfHours}
                          </motion.p>
                      )}
                      <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-sm text-indigo-600 mt-1"
                      >
                        Taux horaire: {formatCurrency(selectedHairstyle.hourlyRate)}/heure
                      </motion.p>
                    </motion.div>
                  </AnimatePresence>
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
                          {formatCurrency(service.price)}
                        </span>
                          </div>
                        </label>
                      </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 px-4 bg-indigo-600 text-white font-medium rounded-lg shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200"
              >
                Calculer le prix
              </motion.button>
            </form>
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
                            <motion.div
                                className="grid grid-cols-2 gap-2 text-sm"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2 }}
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

                            <motion.div
                                className="mt-4 p-3 bg-white rounded-lg shadow-sm"
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.5 }}
                            >
                              <div className="text-sm text-gray-600">
                                <div className="flex justify-between items-center mb-1">
                                  <span>Durée estimée:</span>
                                  <span className="font-medium">{priceDetails.numberOfHours} heures</span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span>Taux horaire:</span>
                                  <span className="font-medium">{formatCurrency(priceDetails.hourlyRate)}/heure</span>
                                </div>
                              </div>
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
