"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Info } from "lucide-react";
import { useState } from "react";

function calculateWaterIntake({
    weight,
    age,
    gender,
    activityLevel,
    climate,
    isPregnant,
    isBreastfeeding,
    unit,
}: {
    weight: number;
    age: number;
    gender: "male" | "female";
    activityLevel:
        | "sedentary"
        | "light"
        | "moderate"
        | "active"
        | "intense"
        | undefined;
    climate:
        | "cold"
        | "temperate"
        | "warm"
        | "hot"
        | "humid"
        | "arid"
        | undefined;
    isPregnant: boolean;
    isBreastfeeding: boolean;
    unit: "metric" | "imperial";
}) {
    if (
        !weight ||
        !age ||
        !gender ||
        !activityLevel ||
        !climate ||
        isNaN(weight) ||
        isNaN(age)
    )
        return null;

    let weightInKg = weight;
    if (unit === "imperial") {
        weightInKg = weightInKg * 0.453592; // pounds to kg
    }

    // Base calculation: 35ml per kg of body weight
    let baseIntake = weightInKg * 35;

    // Age adjustments
    if (age > 65) {
        baseIntake *= 1.1; // Older adults need more water
    } else if (age < 30) {
        baseIntake *= 1.05; // Younger adults have higher metabolism
    }

    // Gender adjustments
    if (gender === "male") {
        baseIntake *= 1.1; // Men generally need more water
    }

    // Activity level adjustments
    const activityMultipliers = {
        sedentary: 1.0,
        light: 1.2,
        moderate: 1.4,
        active: 1.6,
        intense: 1.8,
    };
    baseIntake *=
        activityMultipliers[activityLevel as keyof typeof activityMultipliers];

    // Climate adjustments
    const climateMultipliers = {
        cold: 0.95,
        temperate: 1.0,
        warm: 1.15,
        hot: 1.3,
        humid: 1.25,
    };
    baseIntake *=
        climateMultipliers[climate as keyof typeof climateMultipliers];

    // Pregnancy and breastfeeding adjustments
    if (isPregnant) {
        baseIntake += 300; // Additional 300ml for pregnancy
    }
    if (isBreastfeeding) {
        baseIntake += 700; // Additional 700ml for breastfeeding
    }

    // Convert to liters and calculate glasses/bottles
    const dailyIntakeL = Math.round((baseIntake / 1000) * 10) / 10;
    const glasses = Math.ceil(baseIntake / 250); // 250ml per glass
    const bottles = Math.ceil(baseIntake / 500); // 500ml per bottle

    // Generate personalized tips
    const tips = [];
    if (activityLevel === "active" || activityLevel === "intense") {
        tips.push("Drink extra water before, during, and after exercise");
    }
    if (climate === "hot" || climate === "humid") {
        tips.push("Increase intake in hot weather to prevent dehydration");
    }
    if (age > 65) {
        tips.push(
            "Set reminders to drink water regularly as thirst sensation decreases with age"
        );
    }
    if (isPregnant || isBreastfeeding) {
        tips.push("Monitor urine color - it should be light yellow");
    }
    tips.push("Spread your water intake throughout the day");
    tips.push("Start your day with a glass of water");

    return {
        dailyIntake: dailyIntakeL,
        glasses,
        bottles,
        tips: tips.slice(0, 4), // Show max 4 tips
    };
}

function WaterIntakeCalculator() {
    const [weight, setWeight] = useState<{
        units: "metric" | "imperial";
        value: number;
    }>({
        units: "metric",
        value: 0,
    });
    const [age, setAge] = useState(0);
    const [gender, setGender] = useState<"male" | "female">("male");
    const [activityLevel, setActivityLevel] = useState<
        "sedentary" | "light" | "moderate" | "active" | "intense"
    >();
    const [climate, setClimate] = useState<
        "cold" | "temperate" | "warm" | "hot" | "humid" | "arid"
    >();
    const [isPregnant, setIsPregnant] = useState(false);
    const [isBreastfeeding, setIsBreastfeeding] = useState(false);

    const intake = calculateWaterIntake({
        weight: weight.value,
        age,
        gender,
        activityLevel,
        climate,
        isPregnant,
        isBreastfeeding,
        unit: weight.units,
    });

    return (
        <div className="bg-white p-4 rounded-lg shadow-md flex flex-col sm:flex-row  gap-4 max-w-7xl mx-auto">
            <div className=" flex-1">
                <div>
                    <h3 className="text-lg font-semibold">
                        Enter Your Details
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        Provide your information to get personalized hydration
                        recommendations.
                    </p>
                </div>

                <div className="space-y-6 max-w-xs mt-4">
                    <div className="flex gap-4 items-end flex-wrap sm:flex-nowrap">
                        <Tabs
                            defaultValue="metric"
                            onValueChange={(value) => {
                                const selectedUnit = value as
                                    | "metric"
                                    | "imperial";
                                setWeight((prev) => ({
                                    ...prev,
                                    units: selectedUnit,
                                    value:
                                        prev.units === "metric"
                                            ? prev.value * 2.20462
                                            : prev.value / 2.20462,
                                }));
                            }}
                        >
                            <TabsList>
                                <TabsTrigger value="metric">Metric</TabsTrigger>
                                <TabsTrigger value="imperial">
                                    Imperial
                                </TabsTrigger>
                            </TabsList>
                            <TabsContent value="metric">
                                <div className="space-y-2">
                                    <label htmlFor="weight">Weight (kg)</label>
                                    <Input
                                        id="weight"
                                        type="number"
                                        value={weight.value || ""}
                                        onChange={(e) =>
                                            setWeight({
                                                units: "metric",
                                                value: parseFloat(
                                                    e.target.value
                                                ),
                                            })
                                        }
                                    />
                                </div>
                            </TabsContent>
                            <TabsContent value="imperial">
                                <div className="space-y-2">
                                    <label htmlFor="weight">Weight (lbs)</label>
                                    <Input
                                        id="weight"
                                        type="number"
                                        value={weight.value || ""}
                                        onChange={(e) =>
                                            setWeight({
                                                units: "imperial",
                                                value: parseFloat(
                                                    e.target.value
                                                ),
                                            })
                                        }
                                    />
                                </div>
                            </TabsContent>
                        </Tabs>
                        <div className="space-y-2">
                            <label htmlFor="age">Age (years)</label>
                            <Input
                                id="age"
                                type="number"
                                value={age || ""}
                                onChange={(e) =>
                                    setAge(parseInt(e.target.value))
                                }
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label>Gender</label>
                        <RadioGroup
                            value={gender}
                            onValueChange={(value) => {
                                setGender(value as "male" | "female");
                                if (value === "male") {
                                    setIsPregnant(false);
                                    setIsBreastfeeding(false);
                                }
                            }}
                        >
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="male" id="male" />
                                <label htmlFor="male">Male</label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="female" id="female" />
                                <label htmlFor="female">Female</label>
                            </div>
                        </RadioGroup>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="activity">Activity Level</label>
                        <Select
                            value={activityLevel}
                            onValueChange={(value) => {
                                setActivityLevel(
                                    value as
                                        | "sedentary"
                                        | "light"
                                        | "moderate"
                                        | "active"
                                        | "intense"
                                );
                            }}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select activity level" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="sedentary">
                                    Sedentary (desk job, little exercise)
                                </SelectItem>
                                <SelectItem value="light">
                                    Light (light exercise 1-3 days/week)
                                </SelectItem>
                                <SelectItem value="moderate">
                                    Moderate (moderate exercise 3-5 days/week)
                                </SelectItem>
                                <SelectItem value="active">
                                    Active (hard exercise 6-7 days/week)
                                </SelectItem>
                                <SelectItem value="intense">
                                    Intense (very hard exercise, physical job)
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="climate">Climate/Environment</label>
                        <Select
                            value={climate}
                            onValueChange={(value) => {
                                setClimate(
                                    value as
                                        | "cold"
                                        | "temperate"
                                        | "warm"
                                        | "hot"
                                        | "humid"
                                        | "arid"
                                );
                            }}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select your climate" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="cold">
                                    Cold (below 10°C/50°F)
                                </SelectItem>
                                <SelectItem value="temperate">
                                    Temperate (10-25°C/50-77°F)
                                </SelectItem>
                                <SelectItem value="warm">
                                    Warm (25-30°C/77-86°F)
                                </SelectItem>
                                <SelectItem value="hot">
                                    Hot (above 30°C/86°F)
                                </SelectItem>
                                <SelectItem value="humid">
                                    Humid (high humidity)
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {gender === "female" && (
                        <div className="space-y-4">
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="pregnant"
                                    checked={isPregnant}
                                    onCheckedChange={(checked) =>
                                        setIsPregnant(checked === true)
                                    }
                                />
                                <label htmlFor="pregnant">
                                    Currently pregnant
                                </label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="breastfeeding"
                                    checked={isBreastfeeding}
                                    onCheckedChange={(checked) =>
                                        setIsBreastfeeding(checked === true)
                                    }
                                />
                                <label htmlFor="breastfeeding">
                                    Currently breastfeeding
                                </label>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex-1">
                {intake ? (
                    <div className="mt-8 space-y-6">
                        <div className="text-center">
                            <div className="text-4xl font-bold text-cyan-600 mb-2">
                                {intake.dailyIntake}L
                            </div>
                            <div className="text-lg text-gray-600">
                                Daily Water Intake
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="text-center p-4 bg-cyan-50 rounded-lg">
                                <div className="text-2xl font-bold text-cyan-600 mb-1">
                                    {intake.glasses}
                                </div>
                                <div className="text-sm text-gray-600">
                                    Glasses
                                </div>
                                <div className="text-xs text-gray-500">
                                    (250ml each)
                                </div>
                            </div>
                            <div className="text-center p-4 bg-blue-50 rounded-lg">
                                <div className="text-2xl font-bold text-blue-600 mb-1">
                                    {intake.bottles}
                                </div>
                                <div className="text-sm text-gray-600">
                                    Bottles
                                </div>
                                <div className="text-xs text-gray-500">
                                    (500ml each)
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-lg p-4 border">
                            <h4 className="font-semibold text-cyan-900 mb-3 flex items-center">
                                <Info className="h-4 w-4 mr-2" />
                                Personalized Tips
                            </h4>
                            <ul className="space-y-2">
                                {intake.tips.map((tip, index) => (
                                    <li
                                        key={index}
                                        className="text-sm text-cyan-800 flex items-start"
                                    >
                                        <span className="text-cyan-600 mr-2">
                                            •
                                        </span>
                                        {tip}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="bg-warning rounded-lg p-4 border border-warning-foreground">
                            <h4 className="font-semibold text-warning-foreground mb-2">
                                Important Notes
                            </h4>
                            <div className="space-y-1 text-sm text-warning-foreground">
                                <p>
                                    • This is a general recommendation. Consult
                                    your doctor for specific medical advice.
                                </p>
                                <p>
                                    • Increase intake if you&apos;re ill,
                                    especially with fever, vomiting, or
                                    diarrhea.
                                </p>
                                <p>
                                    • Monitor your urine color - pale yellow
                                    indicates good hydration.
                                </p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center text-gray-500 mt-8">
                        Please fill in all fields to calculate your daily water
                        intake.
                    </div>
                )}
            </div>
        </div>
    );
}

export default WaterIntakeCalculator;
