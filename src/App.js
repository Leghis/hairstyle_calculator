import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { DollarSign } from "lucide-react"; // Changement de l'icône pour le dollar canadien

// Données des services mises à jour pour le marché d'Ottawa
const servicesData = {
  hairstyles: [
    { type: "smallMediumBoxBraids", name: "Tresses petites/moyennes", price: 184 }, // 160 $ * 1.15
    { type: "largeBraidsBobBraids", name: "Grandes tresses/Tresses bob", price: 138 }, // 120 $ * 1.15
    { type: "simpleCornrows", name: "Cornrows simples", price: 80.5 }, // 70 $ * 1.15
    { type: "knotlessBraids", name: "Tresses sans nœuds", price: 138 }, // 120 $ * 1.15
    { type: "twistsVanilles", name: "Twists/Vanilles", price: 143.75 }, // 125 $ * 1.15
    { type: "weaves", name: "Tissages", price: 115 }, // 100 $ * 1.15
    { type: "childrensBraids", name: "Tresses pour enfants", price: 57.5 }, // 50 $ * 1.15
    // Vous pouvez ajouter d'autres styles si nécessaire
  ],
  lengthMultipliers: {
    court: { name: "Court", multiplier: 1 },
    moyen: { name: "Moyen", multiplier: 1 },
    long: { name: "Long", multiplier: 1.2 }, // Augmentation de 20% pour cheveux longs
    trèsLong: { name: "Très Long", multiplier: 1.3 }, // Augmentation de 30% pour cheveux très longs
  },
  complexityMultipliers: {
    simple: { name: "Simple", multiplier: 1 },
    moyen: { name: "Moyen", multiplier: 1 },
    complexe: { name: "Complexe", multiplier: 1.2 }, // Augmentation de 20% pour styles complexes
  },
  additionalServices: [
    { type: "deepConditioning", name: "Soin profond", price: 23 },
    { type: "coloring", name: "Coloration", price: 34.5 },
    { type: "relaxing", name: "Défrisage", price: 28.75 },
    { type: "scalpMassage", name: "Massage du cuir chevelu", price: 17.25 },
    { type: "hairMask", name: "Masque capillaire", price: 11.5 },
  ],
  travelFeeBase: 10, // Frais de déplacement de base
  travelFeePerKm: 1, // Frais supplémentaires par km au-delà de 15 km
  taxRate: 0.13 // 13% de TVH en Ontario
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(amount);
};

export default function App() {
  const [hairstyleType, setHairstyleType] = useState('');
  const [hairLength, setHairLength] = useState('');
  const [complexity, setComplexity] = useState('');
  const [travelDistance, setTravelDistance] = useState('');
  const [additionalServices, setAdditionalServices] = useState([]);
  const [priceDetails, setPriceDetails] = useState(null);
  const [errors, setErrors] = useState({});

  const validateInputs = () => {
    const newErrors = {};
    if (!hairstyleType) newErrors.hairstyleType = "Veuillez sélectionner un type de coiffure.";
    if (!hairLength) newErrors.hairLength = "Veuillez sélectionner la longueur des cheveux.";
    if (!complexity) newErrors.complexity = "Veuillez sélectionner la complexité.";
    if (travelDistance === '') newErrors.travelDistance = "Veuillez entrer la distance de déplacement.";
    else if (Number(travelDistance) < 0) newErrors.travelDistance = "La distance ne peut pas être négative.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCalculate = () => {
    if (!validateInputs()) return;

    const selectedService = servicesData.hairstyles.find(h => h.type === hairstyleType);
    const basePrice = selectedService ? selectedService.price : 0;

    const lengthMultiplier = servicesData.lengthMultipliers[hairLength]?.multiplier || 1;
    const complexityMultiplier = servicesData.complexityMultipliers[complexity]?.multiplier || 1;

    const adjustedPrice = basePrice * lengthMultiplier * complexityMultiplier;

    const travelFee = Number(travelDistance) > 15
        ? servicesData.travelFeeBase + ((Number(travelDistance) - 15) * servicesData.travelFeePerKm)
        : servicesData.travelFeeBase;

    const additionalServicesTotal = additionalServices.reduce((total, serviceType) => {
      const service = servicesData.additionalServices.find(s => s.type === serviceType);
      return total + (service ? service.price : 0);
    }, 0);

    const subtotal = adjustedPrice + travelFee + additionalServicesTotal;
    const taxAmount = subtotal * servicesData.taxRate;
    const totalPrice = subtotal + taxAmount;

    setPriceDetails({
      basePrice,
      adjustedPrice,
      travelFee,
      additionalServicesTotal,
      taxAmount,
      totalPrice,
    });
  };

  return (
      <Card className="w-[400px] max-w-full mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Calculateur de Prix de Coiffure</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={(e) => { e.preventDefault(); handleCalculate(); }} className="space-y-4">
            <div>
              <Label htmlFor="hairstyleType">Type de coiffure</Label>
              <Select value={hairstyleType} onValueChange={setHairstyleType}>
                <SelectTrigger id="hairstyleType" className={errors.hairstyleType ? "border-red-500" : ""}>
                  <SelectValue placeholder="Sélectionnez" />
                </SelectTrigger>
                <SelectContent>
                  {servicesData.hairstyles.map((service) => (
                      <SelectItem key={service.type} value={service.type}>
                        {service.name} ({formatCurrency(service.price)})
                      </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.hairstyleType && <p className="text-red-500 text-sm mt-1">{errors.hairstyleType}</p>}
            </div>

            <div>
              <Label htmlFor="hairLength">Longueur des cheveux</Label>
              <Select value={hairLength} onValueChange={setHairLength}>
                <SelectTrigger id="hairLength" className={errors.hairLength ? "border-red-500" : ""}>
                  <SelectValue placeholder="Sélectionnez" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(servicesData.lengthMultipliers).map(([key, value]) => (
                      <SelectItem key={key} value={key}>
                        {value.name} (x{value.multiplier})
                      </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.hairLength && <p className="text-red-500 text-sm mt-1">{errors.hairLength}</p>}
            </div>

            <div>
              <Label htmlFor="complexity">Complexité</Label>
              <Select value={complexity} onValueChange={setComplexity}>
                <SelectTrigger id="complexity" className={errors.complexity ? "border-red-500" : ""}>
                  <SelectValue placeholder="Sélectionnez" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(servicesData.complexityMultipliers).map(([key, value]) => (
                      <SelectItem key={key} value={key}>
                        {value.name} (x{value.multiplier})
                      </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.complexity && <p className="text-red-500 text-sm mt-1">{errors.complexity}</p>}
            </div>

            <div>
              <Label htmlFor="travelDistance">Distance de déplacement (km)</Label>
              <Input
                  id="travelDistance"
                  type="number"
                  value={travelDistance}
                  onChange={(e) => setTravelDistance(e.target.value)}
                  className={errors.travelDistance ? "border-red-500" : ""}
              />
              {errors.travelDistance && <p className="text-red-500 text-sm mt-1">{errors.travelDistance}</p>}
            </div>

            <div>
              <Label>Services additionnels</Label>
              <div className="space-y-2">
                {servicesData.additionalServices.map((service) => (
                    <div key={service.type} className="flex items-center">
                      <Checkbox
                          id={service.type}
                          checked={additionalServices.includes(service.type)}
                          onCheckedChange={(checked) => {
                            setAdditionalServices(prev =>
                                checked
                                    ? [...prev, service.type]
                                    : prev.filter(s => s !== service.type)
                            );
                          }}
                      />
                      <label
                          htmlFor={service.type}
                          className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {service.name} ({formatCurrency(service.price)})
                      </label>
                    </div>
                ))}
              </div>
            </div>

            <Button type="submit" className="w-full">Calculer le prix</Button>
          </form>

          {priceDetails && (
              <Alert className="mt-6">
                <DollarSign className="h-4 w-4" />
                <AlertTitle>Résumé du Prix</AlertTitle>
                <AlertDescription>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Prix de base : {formatCurrency(priceDetails.basePrice)}</li>
                    <li>Prix ajusté : {formatCurrency(priceDetails.adjustedPrice)}</li>
                    <li>Frais de déplacement : {formatCurrency(priceDetails.travelFee)}</li>
                    <li>Services additionnels : {formatCurrency(priceDetails.additionalServicesTotal)}</li>
                    <li>Sous-total : {formatCurrency(priceDetails.adjustedPrice + priceDetails.travelFee + priceDetails.additionalServicesTotal)}</li>
                    <li>Taxes ({servicesData.taxRate * 100}%): {formatCurrency(priceDetails.taxAmount)}</li>
                    <li className="font-bold">Prix total : {formatCurrency(priceDetails.totalPrice)}</li>
                  </ul>
                </AlertDescription>
              </Alert>
          )}
        </CardContent>
      </Card>
  );
}
