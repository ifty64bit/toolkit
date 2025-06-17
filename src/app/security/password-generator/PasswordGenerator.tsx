"use client";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { valibotResolver } from "@hookform/resolvers/valibot";
import * as v from "valibot";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Clock, Copy, RefreshCw, Shield } from "lucide-react";
import { useState } from "react";
import {
    calculateCrackTime,
    calculateStrength,
    copyToClipboard,
    generatePassword,
} from "@/lib/functions";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

function PasswordGenerator() {
    const [password, setPassword] = useState<string>("");
    const [passwordStrength, setPasswordStrength] = useState<ReturnType<
        typeof calculateStrength
    > | null>(null);
    const [crackTime, setCrackTime] = useState<ReturnType<
        typeof calculateCrackTime
    > | null>(null);

    const form = useForm<
        PasswordGeneratorFormInput,
        undefined,
        PasswordGeneratorFormOutput
    >({
        resolver: valibotResolver(passwordGeneratorFormSchema),
        defaultValues: {
            length: 12,
            includeNumbers: true,
            includeSpecialCharacters: true,
            case: "mixed",
        },
    });
    return (
        <div className="flex flex-col sm:flex-row gap-8 bg-white p-8 rounded-lg border container mx-auto">
            <div className="flex-1 space-y-8">
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit((data) => {
                            const password = generatePassword(data);
                            setPassword(password);
                            const strength = calculateStrength(password);
                            setPasswordStrength(strength);
                            const crackTime = calculateCrackTime(
                                password.length,
                                strength.charsetSize
                            );
                            setCrackTime(crackTime);
                        })}
                        className="space-y-8"
                    >
                        <FormField
                            control={form.control}
                            name="length"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="flex items-center justify-between">
                                        <FormLabel>Password Length</FormLabel>
                                        {field.value} characters
                                    </div>

                                    <FormControl>
                                        <Slider
                                            value={[field.value || 12]}
                                            onValueChange={(values) =>
                                                field.onChange(values[0])
                                            }
                                            max={100}
                                            step={1}
                                            min={4}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Strong passwords are at least 12
                                        characters long.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="case"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password Case</FormLabel>
                                    <FormControl>
                                        <Select
                                            value={field.value}
                                            onValueChange={field.onChange}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select case" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="lowercase">
                                                    Lowercase [a-z]
                                                </SelectItem>
                                                <SelectItem value="uppercase">
                                                    Uppercase [A-Z]
                                                </SelectItem>
                                                <SelectItem value="mixed">
                                                    Mixed Case [a-z, A-Z]
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="space-y-4">
                            <Label>Additional Options</Label>
                            <FormField
                                control={form.control}
                                name="includeNumbers"
                                render={({ field }) => (
                                    <FormItem className="flex items-center space-x-2">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={(checked) =>
                                                    field.onChange(checked)
                                                }
                                            />
                                        </FormControl>
                                        <FormLabel>Include Numbers</FormLabel>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="includeSpecialCharacters"
                                render={({ field }) => (
                                    <FormItem className="flex items-center space-x-2">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={(checked) =>
                                                    field.onChange(checked)
                                                }
                                            />
                                        </FormControl>
                                        <FormLabel>
                                            Include Special Characters
                                        </FormLabel>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <Button type="submit" className="w-full">
                            <RefreshCw className="h-4 w-4 mr-2" /> Generate
                            Password
                        </Button>
                    </form>
                </Form>
            </div>
            <div className="flex-1 space-y-6">
                {password && (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="generated-password">
                                    Generated Password
                                </Label>
                                <Button
                                    onClick={async () => {
                                        await copyToClipboard(password);
                                        toast.success(
                                            "Password copied to clipboard!"
                                        );
                                    }}
                                    variant="outline"
                                    size="sm"
                                    className="flex items-center space-x-2"
                                >
                                    <Copy className="h-4 w-4" />
                                </Button>
                            </div>
                            <div className="relative">
                                <Input
                                    id="generated-password"
                                    value={password}
                                    readOnly
                                    className={`font-mono text-lg pr-12 bg-muted text-muted-foreground rounded-lg border border-gray-200`}
                                />
                            </div>
                        </div>

                        {/* Password Strength */}
                        {passwordStrength &&
                            !password.includes("Please select") && (
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label className="flex items-center">
                                            <Shield className="h-4 w-4 mr-2" />
                                            Password Strength
                                        </Label>
                                        <span
                                            className={`font-semibold ${passwordStrength.color}`}
                                        >
                                            {passwordStrength.label}
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className={`h-2 rounded-full transition-all duration-300 ${
                                                passwordStrength.score <= 2
                                                    ? "bg-red-500"
                                                    : passwordStrength.score <=
                                                      4
                                                    ? "bg-yellow-500"
                                                    : passwordStrength.score <=
                                                      6
                                                    ? "bg-blue-500"
                                                    : "bg-green-500"
                                            }`}
                                            style={{
                                                width: `${
                                                    (passwordStrength.score /
                                                        7) *
                                                    100
                                                }%`,
                                            }}
                                        />
                                    </div>
                                </div>
                            )}

                        {/* Password Crack Time Analysis */}
                        {crackTime && !password.includes("Please select") && (
                            <div className="space-y-4">
                                <div className="bg-destructive/20 rounded-lg p-4 border border-red-200 space-y-4">
                                    <h4 className="font-semibold text-destructive-foreground flex items-center">
                                        <Clock className="h-4 w-4 mr-2" />
                                        Time to Crack Analysis
                                    </h4>

                                    <div className="flex gap-4 flex-wrap">
                                        <div className="text-center flex-1 p-3 bg-white/50 rounded-lg">
                                            <div className="text-lg font-bold text-red-700">
                                                {crackTime.entropy} bits
                                            </div>
                                            <div className="text-xs text-red-600">
                                                Password Entropy
                                            </div>
                                        </div>
                                        <div className="text-center flex-1 p-3 bg-white/50 rounded-lg">
                                            <div className="text-lg font-bold text-red-700">
                                                {crackTime.combinations}
                                            </div>
                                            <div className="text-xs text-red-600">
                                                Possible Combinations
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center p-2 bg-white/30 rounded">
                                            <span className="text-sm font-medium text-red-800">
                                                Personal Computer:
                                            </span>
                                            <span className="text-sm font-bold text-red-900">
                                                {
                                                    crackTime.timeEstimates
                                                        .personal
                                                }
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center p-2 bg-white/30 rounded">
                                            <span className="text-sm font-medium text-red-800">
                                                Professional Hardware:
                                            </span>
                                            <span className="text-sm font-bold text-red-900">
                                                {
                                                    crackTime.timeEstimates
                                                        .professional
                                                }
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center p-2 bg-white/30 rounded">
                                            <span className="text-sm font-medium text-red-800">
                                                Distributed Attack:
                                            </span>
                                            <span className="text-sm font-bold text-red-900">
                                                {
                                                    crackTime.timeEstimates
                                                        .distributed
                                                }
                                            </span>
                                        </div>
                                    </div>

                                    <div className="mt-3 text-xs text-red-700">
                                        * Times shown are average estimates for
                                        brute force attacks. Actual security
                                        depends on many factors.
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <h4 className="font-semibold text-blue-900 mb-3">
                        Password Security Tips
                    </h4>
                    <ul className="space-y-1 text-sm text-blue-800">
                        <li>
                            • Use at least 12 characters for better security
                        </li>
                        <li>
                            • Include a mix of uppercase, lowercase, numbers,
                            and symbols
                        </li>
                        <li>
                            • Don&apos;t use personal information or common
                            words
                        </li>
                        <li>• Use a unique password for each account</li>
                        <li>• Consider using a password manager</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default PasswordGenerator;

const passwordGeneratorFormSchema = v.object({
    length: v.pipe(
        v.number(),
        v.minValue(4, "Password length must be at least 4 characters long"),
        v.maxValue(64, "Password length must be at most 64 characters long")
    ),
    includeNumbers: v.boolean(),
    includeSpecialCharacters: v.boolean(),
    case: v.union([
        v.literal("lowercase"),
        v.literal("uppercase"),
        v.literal("mixed"),
    ]),
});

type PasswordGeneratorFormInput = v.InferInput<
    typeof passwordGeneratorFormSchema
>;
export type PasswordGeneratorFormOutput = v.InferOutput<
    typeof passwordGeneratorFormSchema
>;
