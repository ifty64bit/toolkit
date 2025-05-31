"use client";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

function getBMICategory(bmi: number) {
    if (bmi < 18.5) return "Underweight";
    if (bmi < 25) return "Normal weight";
    if (bmi < 30) return "Overweight";
    return "Obese";
}

function calculateBMI(
    height: number,
    weight: number,
    heightUnit: "cm" | "m",
    weightUnit: "kg" | "gm"
) {
    if (heightUnit === "m") height *= 100; // Convert meters to centimeters
    if (weightUnit === "gm") weight /= 1000; // Convert grams to kilograms

    const heightInMeters = height / 100; // Convert centimeters to meters
    return weight / (heightInMeters * heightInMeters);
}

function BMICalculator() {
    const [height, setHeight] = useState<{ unit: "cm" | "m"; value: string }>({
        unit: "cm",
        value: "",
    });

    const [weight, setWeight] = useState<{ unit: "kg" | "gm"; value: string }>({
        unit: "kg",
        value: "",
    });

    const BMI =
        height.value && weight.value
            ? calculateBMI(
                  parseFloat(height.value),
                  parseFloat(weight.value),
                  height.unit,
                  weight.unit
              )
            : null;

    return (
        <div>
            <div className="flex items-center gap-4 mb-6">
                <div className="text-3xl">🏋️‍♂️</div>
                <div>
                    <h2>BMI Calculator</h2>
                    <p className="text-muted-foreground">
                        Calculate your Body Mass Index (BMI) to assess your body
                        weight relative to your height.
                    </p>
                </div>
            </div>

            <div className="flex gap-4">
                <div className="flex gap-2 flex-col w-1/2 bg-white p-6 rounded-lg shadow-md">
                    <h3>Enter your details</h3>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="height">Height</label>
                        <div className="flex gap-2">
                            <Input
                                type="number"
                                id="height"
                                placeholder="Enter height"
                                value={height.value}
                                onChange={(e) =>
                                    setHeight((prev) => ({
                                        ...prev,
                                        value: e.target.value,
                                    }))
                                }
                                className="max-w-28"
                            />
                            <Select
                                value={height.unit}
                                onValueChange={(value) => {
                                    setHeight((prev) => ({
                                        ...prev,
                                        unit: value as "cm" | "m",
                                    }));
                                }}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Unit" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="cm">
                                        Centimeters (cm)
                                    </SelectItem>
                                    <SelectItem value="m">
                                        Meters (m)
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="weight">Weight</label>
                        <div className="flex gap-2">
                            <Input
                                type="number"
                                id="weight"
                                placeholder="Enter weight"
                                className="max-w-28"
                                value={weight.value}
                                onChange={(e) =>
                                    setWeight((prev) => ({
                                        ...prev,
                                        value: e.target.value,
                                    }))
                                }
                            />
                            <Select
                                value={weight.unit}
                                onValueChange={(value) => {
                                    setWeight((prev) => ({
                                        ...prev,
                                        unit: value as "kg" | "gm",
                                    }));
                                }}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Unit" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="kg">
                                        Kilograms (kg)
                                    </SelectItem>
                                    <SelectItem value="gm">
                                        Grams (gm)
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
                <div className="w-1/2 bg-white p-6 rounded-lg shadow-md">
                    <div className="flex flex-col gap-4">
                        <h3>Your BMI</h3>
                        {BMI ? (
                            <>
                                <p className="text-2xl font-bold">
                                    {BMI.toFixed(2)}
                                </p>
                                <h3>CATEGORY</h3>
                                <Badge
                                    variant={
                                        getBMICategory(BMI) === "Obese"
                                            ? "destructive"
                                            : getBMICategory(BMI) ===
                                              "Overweight"
                                            ? "warning"
                                            : getBMICategory(BMI) ===
                                              "Normal weight"
                                            ? "success"
                                            : getBMICategory(BMI) ===
                                              "Underweight"
                                            ? "warning"
                                            : "default"
                                    }
                                    className="px-2 py-1 text-base"
                                >
                                    {getBMICategory(BMI)}
                                </Badge>
                            </>
                        ) : (
                            <p className="text-muted-foreground">
                                Please enter your height and weight to calculate
                                your BMI.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BMICalculator;
