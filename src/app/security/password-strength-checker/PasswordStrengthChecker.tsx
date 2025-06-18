"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    AlertTriangle,
    CheckCircle,
    Eye,
    EyeOff,
    Info,
    XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { analyzePassword } from "./functions";

const initialStrength = {
    score: 0,
    maxScore: 100,
    percentage: 0,
    label: "",
    color: "",
};

const initialAnalysis = {
    length: { score: 0, feedback: "", status: "" },
    uppercase: { score: 0, feedback: "", status: "" },
    lowercase: { score: 0, feedback: "", status: "" },
    numbers: { score: 0, feedback: "", status: "" },
    symbols: { score: 0, feedback: "", status: "" },
    common: { score: 0, feedback: "", status: "" },
    patterns: { score: 0, feedback: "", status: "" },
    sequential: { score: 0, feedback: "", status: "" },
    repeated: { score: 0, feedback: "", status: "" },
};

const initialCrackTime = {
    entropy: 0,
    combinations: "",
    timeEstimates: {
        personal: "",
        professional: "",
        distributed: "",
    },
};

function PasswordStrengthChecker() {
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [strength, setStrength] = useState(initialStrength);
    const [analysis, setAnalysis] = useState(initialAnalysis);
    const [crackTime, setCrackTime] = useState(initialCrackTime);
    const [suggestions, setSuggestions] = useState<string[]>([]);

    useEffect(() => {
        if (password === "") {
            setStrength(initialStrength);
            setAnalysis(initialAnalysis);
            setCrackTime(initialCrackTime);
            setSuggestions([]);
        } else {
            const result = analyzePassword(password);
            setStrength(result.strength);
            setAnalysis(result.analysis);
            setCrackTime(result.crackTime);
            setSuggestions(result.suggestions);
        }
    }, [password]);
    return (
        <div className="max-w-4xl mx-auto p-6 shadow-xl bg-gradient-to-br from-indigo-50 to-purple-100 rounded-lg border">
            <div className="mb-6 text-center">
                <h2>Check Your Password Strength</h2>
                <p>
                    Enter your password below to analyze its security level and
                    get personalized recommendations
                </p>
            </div>
            <div className="space-y-6">
                {/* Password Input */}
                <div className="space-y-2">
                    <Label htmlFor="password">Enter Password</Label>
                    <div className="relative">
                        <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Type your password here..."
                            className="pr-10 bg-white"
                            aria-describedby="password-description"
                        />
                        <button
                            type="button"
                            onClick={() => {
                                setShowPassword((pre) => !pre);
                            }}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            aria-label={
                                showPassword ? "Hide password" : "Show password"
                            }
                        >
                            {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                            ) : (
                                <Eye className="h-4 w-4" />
                            )}
                        </button>
                    </div>
                    <p
                        id="password-description"
                        className="text-xs text-gray-500"
                    >
                        Your password is never stored or transmitted. All
                        analysis happens in your browser.
                    </p>
                </div>

                {password && (
                    <>
                        {/* Overall Strength */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold">
                                    Password Strength
                                </h3>
                                <span
                                    className={`font-bold ${
                                        strength.score < 40
                                            ? "text-red-600"
                                            : strength.score < 60
                                            ? "text-yellow-600"
                                            : strength.score < 80
                                            ? "text-blue-600"
                                            : "text-green-600"
                                    }`}
                                >
                                    {strength.label}
                                </span>
                            </div>
                            <Progress
                                value={strength.percentage}
                                className={`h-2 ${strength.color}`}
                            />
                        </div>

                        {/* Tabs for detailed analysis */}
                        <Tabs defaultValue="analysis" className="w-full">
                            <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="analysis">
                                    Analysis
                                </TabsTrigger>
                                <TabsTrigger value="cracktime">
                                    Crack Time
                                </TabsTrigger>
                                <TabsTrigger value="suggestions">
                                    Suggestions
                                </TabsTrigger>
                            </TabsList>

                            {/* Analysis Tab */}
                            <TabsContent
                                value="analysis"
                                className="space-y-4 pt-4"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div
                                        className={`p-3 rounded-lg border ${
                                            analysis.length.status === "success"
                                                ? "bg-green-50 border-green-200"
                                                : analysis.length.status ===
                                                  "warning"
                                                ? "bg-yellow-50 border-yellow-200"
                                                : "bg-red-50 border-red-200"
                                        }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="font-medium">
                                                Length
                                            </span>
                                            {analysis.length.status ===
                                            "success" ? (
                                                <CheckCircle className="h-4 w-4 text-green-600" />
                                            ) : analysis.length.status ===
                                              "warning" ? (
                                                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                                            ) : (
                                                <XCircle className="h-4 w-4 text-red-600" />
                                            )}
                                        </div>
                                        <p className="text-sm mt-1">
                                            {analysis.length.feedback}
                                        </p>
                                    </div>

                                    <div
                                        className={`p-3 rounded-lg border ${
                                            analysis.uppercase.status ===
                                            "success"
                                                ? "bg-green-50 border-green-200"
                                                : "bg-red-50 border-red-200"
                                        }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="font-medium">
                                                Uppercase
                                            </span>
                                            {analysis.uppercase.status ===
                                            "success" ? (
                                                <CheckCircle className="h-4 w-4 text-green-600" />
                                            ) : (
                                                <XCircle className="h-4 w-4 text-red-600" />
                                            )}
                                        </div>
                                        <p className="text-sm mt-1">
                                            {analysis.uppercase.feedback}
                                        </p>
                                    </div>

                                    <div
                                        className={`p-3 rounded-lg border ${
                                            analysis.lowercase.status ===
                                            "success"
                                                ? "bg-green-50 border-green-200"
                                                : "bg-red-50 border-red-200"
                                        }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="font-medium">
                                                Lowercase
                                            </span>
                                            {analysis.lowercase.status ===
                                            "success" ? (
                                                <CheckCircle className="h-4 w-4 text-green-600" />
                                            ) : (
                                                <XCircle className="h-4 w-4 text-red-600" />
                                            )}
                                        </div>
                                        <p className="text-sm mt-1">
                                            {analysis.lowercase.feedback}
                                        </p>
                                    </div>

                                    <div
                                        className={`p-3 rounded-lg border ${
                                            analysis.numbers.status ===
                                            "success"
                                                ? "bg-green-50 border-green-200"
                                                : "bg-red-50 border-red-200"
                                        }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="font-medium">
                                                Numbers
                                            </span>
                                            {analysis.numbers.status ===
                                            "success" ? (
                                                <CheckCircle className="h-4 w-4 text-green-600" />
                                            ) : (
                                                <XCircle className="h-4 w-4 text-red-600" />
                                            )}
                                        </div>
                                        <p className="text-sm mt-1">
                                            {analysis.numbers.feedback}
                                        </p>
                                    </div>

                                    <div
                                        className={`p-3 rounded-lg border ${
                                            analysis.symbols.status ===
                                            "success"
                                                ? "bg-green-50 border-green-200"
                                                : "bg-red-50 border-red-200"
                                        }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="font-medium">
                                                Special Characters
                                            </span>
                                            {analysis.symbols.status ===
                                            "success" ? (
                                                <CheckCircle className="h-4 w-4 text-green-600" />
                                            ) : (
                                                <XCircle className="h-4 w-4 text-red-600" />
                                            )}
                                        </div>
                                        <p className="text-sm mt-1">
                                            {analysis.symbols.feedback}
                                        </p>
                                    </div>

                                    <div
                                        className={`p-3 rounded-lg border ${
                                            analysis.common.status === "success"
                                                ? "bg-green-50 border-green-200"
                                                : "bg-red-50 border-red-200"
                                        }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="font-medium">
                                                Common Password
                                            </span>
                                            {analysis.common.status ===
                                            "success" ? (
                                                <CheckCircle className="h-4 w-4 text-green-600" />
                                            ) : (
                                                <XCircle className="h-4 w-4 text-red-600" />
                                            )}
                                        </div>
                                        <p className="text-sm mt-1">
                                            {analysis.common.feedback}
                                        </p>
                                    </div>

                                    <div
                                        className={`p-3 rounded-lg border ${
                                            analysis.patterns.status ===
                                            "success"
                                                ? "bg-green-50 border-green-200"
                                                : "bg-red-50 border-red-200"
                                        }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="font-medium">
                                                Patterns
                                            </span>
                                            {analysis.patterns.status ===
                                            "success" ? (
                                                <CheckCircle className="h-4 w-4 text-green-600" />
                                            ) : (
                                                <XCircle className="h-4 w-4 text-red-600" />
                                            )}
                                        </div>
                                        <p className="text-sm mt-1">
                                            {analysis.patterns.feedback}
                                        </p>
                                    </div>

                                    <div
                                        className={`p-3 rounded-lg border ${
                                            analysis.sequential.status ===
                                            "success"
                                                ? "bg-green-50 border-green-200"
                                                : "bg-red-50 border-red-200"
                                        }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="font-medium">
                                                Sequential Characters
                                            </span>
                                            {analysis.sequential.status ===
                                            "success" ? (
                                                <CheckCircle className="h-4 w-4 text-green-600" />
                                            ) : (
                                                <XCircle className="h-4 w-4 text-red-600" />
                                            )}
                                        </div>
                                        <p className="text-sm mt-1">
                                            {analysis.sequential.feedback}
                                        </p>
                                    </div>

                                    <div
                                        className={`p-3 rounded-lg border ${
                                            analysis.repeated.status ===
                                            "success"
                                                ? "bg-green-50 border-green-200"
                                                : analysis.repeated.status ===
                                                  "warning"
                                                ? "bg-yellow-50 border-yellow-200"
                                                : "bg-red-50 border-red-200"
                                        }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="font-medium">
                                                Repeated Characters
                                            </span>
                                            {analysis.repeated.status ===
                                            "success" ? (
                                                <CheckCircle className="h-4 w-4 text-green-600" />
                                            ) : analysis.repeated.status ===
                                              "warning" ? (
                                                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                                            ) : (
                                                <XCircle className="h-4 w-4 text-red-600" />
                                            )}
                                        </div>
                                        <p className="text-sm mt-1">
                                            {analysis.repeated.feedback}
                                        </p>
                                    </div>
                                </div>
                            </TabsContent>

                            {/* Crack Time Tab */}
                            <TabsContent
                                value="cracktime"
                                className="space-y-4 pt-4"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div className="text-center p-4 bg-indigo-50 rounded-lg border border-indigo-100">
                                        <div className="text-lg font-bold text-indigo-700">
                                            {crackTime.entropy} bits
                                        </div>
                                        <div className="text-xs text-indigo-600">
                                            Password Entropy
                                        </div>
                                    </div>
                                    <div className="text-center p-4 bg-indigo-50 rounded-lg border border-indigo-100">
                                        <div className="text-lg font-bold text-indigo-700">
                                            {crackTime.combinations}
                                        </div>
                                        <div className="text-xs text-indigo-600">
                                            Possible Combinations
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <h4 className="font-semibold text-gray-900">
                                        Time to Crack by Attack Type:
                                    </h4>
                                    <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-200">
                                        <span className="text-sm font-medium text-gray-800">
                                            Personal Computer:
                                        </span>
                                        <span className="text-sm font-bold text-gray-900">
                                            {crackTime.timeEstimates.personal}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-200">
                                        <span className="text-sm font-medium text-gray-800">
                                            Professional Hardware:
                                        </span>
                                        <span className="text-sm font-bold text-gray-900">
                                            {
                                                crackTime.timeEstimates
                                                    .professional
                                            }
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-200">
                                        <span className="text-sm font-medium text-gray-800">
                                            Distributed Attack:
                                        </span>
                                        <span className="text-sm font-bold text-gray-900">
                                            {
                                                crackTime.timeEstimates
                                                    .distributed
                                            }
                                        </span>
                                    </div>
                                </div>

                                <Alert className="bg-blue-50 border-blue-200">
                                    <Info className="h-4 w-4 text-blue-600" />
                                    <AlertTitle className="text-blue-800">
                                        About Crack Time Estimates
                                    </AlertTitle>
                                    <AlertDescription className="text-blue-700 text-sm">
                                        These estimates are based on brute force
                                        attacks where every possible combination
                                        is tried. Dictionary attacks, rainbow
                                        tables, or known patterns could crack
                                        passwords much faster.
                                    </AlertDescription>
                                </Alert>
                            </TabsContent>

                            {/* Suggestions Tab */}
                            <TabsContent
                                value="suggestions"
                                className="space-y-4 pt-4"
                            >
                                {suggestions.length > 0 ? (
                                    <div className="space-y-3">
                                        <h4 className="font-semibold text-gray-900">
                                            Improvement Suggestions:
                                        </h4>
                                        <ul className="space-y-2">
                                            {suggestions.map(
                                                (suggestion, index) => (
                                                    <li
                                                        key={index}
                                                        className="flex items-start p-3 bg-white rounded-lg border border-gray-200"
                                                    >
                                                        <AlertTriangle className="h-4 w-4 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                                                        <span className="text-sm">
                                                            {suggestion}
                                                        </span>
                                                    </li>
                                                )
                                            )}
                                        </ul>
                                    </div>
                                ) : (
                                    <Alert className="bg-green-50 border-green-200">
                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                        <AlertTitle className="text-green-800">
                                            Great Password!
                                        </AlertTitle>
                                        <AlertDescription className="text-green-700 text-sm">
                                            Your password meets all our security
                                            criteria. Remember to use unique
                                            passwords for different accounts and
                                            consider using a password manager.
                                        </AlertDescription>
                                    </Alert>
                                )}

                                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                    <h4 className="font-semibold text-gray-900 mb-3">
                                        Password Best Practices
                                    </h4>
                                    <ul className="space-y-1 text-sm text-gray-700">
                                        <li>• Use at least 12-16 characters</li>
                                        <li>
                                            • Include uppercase and lowercase
                                            letters, numbers, and symbols
                                        </li>
                                        <li>
                                            • Avoid dictionary words, names, or
                                            common phrases
                                        </li>
                                        <li>
                                            • Don&apos;t use personal
                                            information (birthdays, names, etc.)
                                        </li>
                                        <li>
                                            • Use a different password for each
                                            account
                                        </li>
                                        <li>
                                            • Consider using a password manager
                                        </li>
                                        <li>
                                            • Enable two-factor authentication
                                            when available
                                        </li>
                                    </ul>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </>
                )}
            </div>
        </div>
    );
}

export default PasswordStrengthChecker;
