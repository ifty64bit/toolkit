"use client";

import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

function calculateBMR(
    gender: "male" | "female",
    weight: string,
    height: string,
    age: string
) {
    const w = parseFloat(weight);
    const h = parseFloat(height);
    const a = parseInt(age);

    if (!gender || isNaN(w) || isNaN(h) || isNaN(a)) {
        return 0;
    }

    const result =
        gender === "male"
            ? 10 * w + 6.25 * h - 5 * a + 5
            : 10 * w + 6.25 * h - 5 * a - 161;
    return Math.round(result);
}

function BMRCalculator() {
    const [gender, setGender] = useState<"male" | "female">("male");
    const [age, setAge] = useState<string>("");
    const [height, setHeight] = useState<{ unit: "cm" | "m"; value: string }>({
        unit: "cm",
        value: "",
    });
    const [weight, setWeight] = useState<{ unit: "kg" | "gm"; value: string }>({
        unit: "kg",
        value: "",
    });

    const BMR = calculateBMR(gender, weight.value, height.value, age);

    return (
        <div className="flex gap-4 flex-col sm:flex-row ">
            <div className="flex gap-2 flex-col sm:w-1/2 bg-white p-6 rounded-lg shadow-md">
                <h3>Enter your details</h3>
                <div className="mb-4">
                    <RadioGroup
                        defaultValue={gender}
                        onValueChange={(value) =>
                            setGender(value as "male" | "female")
                        }
                        className="flex gap-4"
                    >
                        <div className="flex gap-2 items-center">
                            <RadioGroupItem value="male" id="male" />
                            <label htmlFor="male">Male</label>
                        </div>
                        <div className="flex gap-2 items-center">
                            <RadioGroupItem value="female" id="female" />
                            <label htmlFor="female">Female</label>
                        </div>
                    </RadioGroup>
                </div>

                <div className="flex flex-col gap-2">
                    <label htmlFor="age">Age</label>
                    <Input
                        type="number"
                        id="age"
                        placeholder="Enter age"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        className="max-w-28"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label htmlFor="height">Height</label>
                    <div className="flex flex-col sm:flex-row gap-2">
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
                                <SelectItem value="m">Meters (m)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <label htmlFor="weight">Weight</label>
                    <div className="flex gap-2 flex-col sm:flex-row">
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
                                <SelectItem value="gm">Grams (gm)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>
            <div className="sm:w-1/2 bg-white p-6 rounded-lg shadow-md">
                <div className="flex flex-col gap-4 justify-between h-full">
                    <div>
                        <h3>Your BMR</h3>
                        {BMR ? (
                            <>
                                <p className="text-2xl font-bold">
                                    {BMR} cal/day
                                </p>
                            </>
                        ) : (
                            <p className="text-muted-foreground">
                                Please enter your height and weight to calculate
                                your BMR.
                            </p>
                        )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                        <p>
                            Your Basal Metabolic Rate (BMR) is the number of
                            calories your body needs to maintain basic
                            physiological functions at rest. This value can help
                            you understand your daily caloric needs for weight
                            management.
                        </p>
                        <p>
                            Note: The BMR calculation is based on the Mifflin-St
                            Jeor Equation, which is widely used for estimating
                            BMR.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BMRCalculator;
