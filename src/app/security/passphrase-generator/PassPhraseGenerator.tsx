"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import {
    AlertTriangle,
    Check,
    Copy,
    Info,
    Loader2,
    Plus,
    Shield,
    X,
    Dice6,
    Award,
    Database,
    Zap,
    Shuffle,
    Eye,
    Settings,
    Lock,
    Star,
} from "lucide-react";
import { useState } from "react";

interface WordBreakdown {
    word: string;
    source: "custom" | "random" | "number" | "symbol";
}

interface PassphraseResponse {
    passphrase: string;
    words: string[];
    wordBreakdown: WordBreakdown[];
    strength: {
        entropy: number;
        combinations: string;
        timeEstimates: {
            personal: string;
            professional: string;
            distributed: string;
        };
    };
    metadata: {
        length: number;
        totalWordCount: number;
        customWordCount: number;
        randomWordCount: number;
        hasNumbers: boolean;
        hasSymbols: boolean;
        dictionarySize: number;
        blendMode: string;
    };
    warnings: string[];
}

function PassPhraseGenerator() {
    const [wordCount, setWordCount] = useState([4]);
    const [wordCategory, setWordCategory] = useState("common");
    const [separator, setSeparator] = useState("hyphen");
    const [includeNumbers, setIncludeNumbers] = useState(false);
    const [includeSymbols, setIncludeSymbols] = useState(false);
    const [capitalizeWords, setCapitalizeWords] = useState(false);
    const [customSeparator, setCustomSeparator] = useState("");

    // Custom words functionality
    const [customWords, setCustomWords] = useState<string[]>([]);
    const [newCustomWord, setNewCustomWord] = useState("");
    const [blendMode, setBlendMode] = useState<"replace" | "add">("replace");

    const [passphrase, setPassphrase] = useState("");
    const [wordBreakdown, setWordBreakdown] = useState<WordBreakdown[]>([]);
    const [copied, setCopied] = useState(false);
    const [loading, setLoading] = useState(false);
    const [strength, setStrength] = useState<
        PassphraseResponse["strength"] | null
    >(null);
    const [metadata, setMetadata] = useState<
        PassphraseResponse["metadata"] | null
    >(null);
    const [warnings, setWarnings] = useState<string[]>([]);
    const [error, setError] = useState("");
    const [originalWords, setOriginalWords] = useState<string[]>([]); // Store original word array

    const addCustomWord = () => {
        const word = newCustomWord.trim();
        if (
            word &&
            !customWords.includes(word.toLowerCase()) &&
            customWords.length < wordCount[0]
        ) {
            setCustomWords([...customWords, word.toLowerCase()]);
            setNewCustomWord("");
        }
    };

    const removeCustomWord = (index: number) => {
        setCustomWords(customWords.filter((_, i) => i !== index));
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            addCustomWord();
        }
    };

    const applyClientSideSeparator = (
        words: string[],
        sepType: string,
        customSep = ""
    ) => {
        if (words.length === 0) return "";

        const separators = {
            hyphen: "-",
            underscore: "_",
            dot: ".",
            space: " ",
            none: "",
            custom: customSep || "",
        };

        const finalSeparator =
            separators[sepType as keyof typeof separators] || "-";

        // Handle camelCase specially
        if (sepType === "camel") {
            return words
                .map((word, index) => {
                    if (index === 0) {
                        return word.toLowerCase();
                    }
                    return (
                        word.charAt(0).toUpperCase() +
                        word.slice(1).toLowerCase()
                    );
                })
                .join("");
        } else {
            return words.join(finalSeparator);
        }
    };

    const handleSeparatorChange = (
        newSeparator: string,
        newCustomSeparator = ""
    ) => {
        if (originalWords.length > 0) {
            const newPassphrase = applyClientSideSeparator(
                originalWords,
                newSeparator,
                newCustomSeparator
            );
            setPassphrase(newPassphrase);
            setCopied(false); // Reset copy status when passphrase changes
        }
    };

    const generatePassphrase = async () => {
        setLoading(true);
        setError("");

        try {
            const response = await fetch("/api/passphrase", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    wordCount: wordCount[0],
                    category: wordCategory,
                    separator,
                    customSeparator,
                    includeNumbers,
                    includeSymbols,
                    capitalizeWords,
                    customWords,
                    blendMode,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(
                    errorData.error || "Failed to generate passphrase"
                );
            }

            const data: PassphraseResponse = await response.json();

            // Extract original words from the response for client-side separator changes
            const wordsOnly = data.wordBreakdown
                .filter((item) => !["number", "symbol"].includes(item.source))
                .map((item) => item.word);

            // Add numbers and symbols back
            const allElements = [...wordsOnly];
            if (data.metadata.hasNumbers) {
                const numberMatch = data.passphrase.match(/\d+/);
                if (numberMatch) allElements.push(numberMatch[0]);
            }
            if (data.metadata.hasSymbols) {
                const symbolMatch = data.passphrase.match(/[!@#$%&*+=?]/);
                if (symbolMatch) allElements.push(symbolMatch[0]);
            }

            setPassphrase(data.passphrase);
            setWordBreakdown(data.wordBreakdown);
            setStrength(data.strength);
            setMetadata(data.metadata);
            setWarnings(data.warnings);
            setOriginalWords(allElements); // Store for client-side separator changes
            setCopied(false);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = async () => {
        if (!passphrase) return;

        try {
            await navigator.clipboard.writeText(passphrase);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            console.error("Failed to copy to clipboard:", error);
            console.error("Failed to copy to clipboard");
        }
    };

    const getStrengthColor = (entropy: number) => {
        if (entropy < 40) return "text-red-600";
        if (entropy < 60) return "text-yellow-600";
        if (entropy < 80) return "text-blue-600";
        return "text-green-600";
    };

    const getStrengthLabel = (entropy: number) => {
        if (entropy < 40) return "Weak";
        if (entropy < 60) return "Fair";
        if (entropy < 80) return "Good";
        return "Strong";
    };

    const getSourceBadgeColor = (source: string) => {
        switch (source) {
            case "custom":
                return "bg-purple-100 text-purple-800 border-purple-200";
            case "random":
                return "bg-blue-100 text-blue-800 border-blue-200";
            case "number":
                return "bg-green-100 text-green-800 border-green-200";
            case "symbol":
                return "bg-orange-100 text-orange-800 border-orange-200";
            default:
                return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };

    const getCategoryDescription = (category: string) => {
        const descriptions = {
            common: "Most frequently used English words",
            animals: "Animal names from around the world",
            nature: "Natural phenomena and landscapes",
            technology: "Computing and digital technology terms",
            colors: "Color names and shades",
        };
        return descriptions[category as keyof typeof descriptions] || "";
    };

    return (
        <div className="mx-auto space-y-8 grid grid-cols-2 gap-6">
            <div
                aria-label="Left panel for passphrase configuration"
                className="w-full space-y-6 bg-white p-6 rounded-lg border"
            >
                <div>
                    <h3>Create Your Passphrase</h3>
                    <p>
                        Configure settings and add your own words to create a
                        personalized yet secure passphrase
                    </p>
                </div>

                {/* Word Count */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="word-count">Number of Words</Label>
                        <span className="text-sm font-medium text-gray-600">
                            {wordCount[0]} words
                        </span>
                    </div>
                    <Slider
                        id="word-count"
                        min={2}
                        max={8}
                        step={1}
                        value={wordCount}
                        onValueChange={setWordCount}
                        className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                        <span>2</span>
                        <span>8</span>
                    </div>
                </div>

                {/* Custom Words Section */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <Label>Custom Words (Optional)</Label>
                        <span className="text-xs text-gray-500">
                            {customWords.length}/{wordCount[0]} words
                        </span>
                    </div>

                    <div className="flex gap-2">
                        <Input
                            placeholder="Add your own word..."
                            value={newCustomWord}
                            onChange={(e) => setNewCustomWord(e.target.value)}
                            onKeyPress={handleKeyPress}
                            maxLength={15}
                            className="flex-1"
                        />
                        <Button
                            onClick={addCustomWord}
                            disabled={
                                !newCustomWord.trim() ||
                                customWords.length >= wordCount[0] ||
                                customWords.includes(
                                    newCustomWord.trim().toLowerCase()
                                )
                            }
                            size="sm"
                        >
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>

                    {customWords.length > 0 && (
                        <div className="space-y-3">
                            <div className="flex flex-wrap gap-2">
                                {customWords.map((word, index) => (
                                    <Badge
                                        key={index}
                                        variant="outline"
                                        className="bg-purple-50 text-purple-700 border-purple-200 flex items-center gap-1"
                                    >
                                        {word}
                                        <button
                                            onClick={() =>
                                                removeCustomWord(index)
                                            }
                                            className="ml-1 hover:text-purple-900"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </Badge>
                                ))}
                            </div>

                            <div className="space-y-2">
                                <Label>How to blend custom words:</Label>
                                <RadioGroup
                                    value={blendMode}
                                    onValueChange={(value: "replace" | "add") =>
                                        setBlendMode(value)
                                    }
                                >
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem
                                            value="replace"
                                            id="replace"
                                        />
                                        <Label
                                            htmlFor="replace"
                                            className="text-sm"
                                        >
                                            Replace random words (total:{" "}
                                            {wordCount[0]} words)
                                        </Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="add" id="add" />
                                        <Label
                                            htmlFor="add"
                                            className="text-sm"
                                        >
                                            Add to random words (total:{" "}
                                            {wordCount[0] + customWords.length}{" "}
                                            words)
                                        </Label>
                                    </div>
                                </RadioGroup>
                            </div>
                        </div>
                    )}

                    <Alert className="bg-purple-50 border-purple-200">
                        <Info className="h-4 w-4 text-purple-600" />
                        <AlertDescription className="text-purple-700 text-sm">
                            Custom words make passphrases more memorable but may
                            reduce security. Avoid personal information like
                            names, birthdays, or addresses.
                        </AlertDescription>
                    </Alert>
                </div>

                {/* Word Category */}
                <div className="space-y-2">
                    <Label htmlFor="category">Random Word Category</Label>
                    <Select
                        value={wordCategory}
                        onValueChange={setWordCategory}
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="common">
                                <div className="flex flex-col items-start">
                                    <span>Common Words</span>
                                    <span className="text-xs text-gray-500">
                                        Most frequently used English words
                                    </span>
                                </div>
                            </SelectItem>
                            <SelectItem value="animals">
                                <div className="flex flex-col items-start">
                                    <span>Animals</span>
                                    <span className="text-xs text-gray-500">
                                        Animal names from around the world
                                    </span>
                                </div>
                            </SelectItem>
                            <SelectItem value="nature">
                                <div className="flex flex-col items-start">
                                    <span>Nature</span>
                                    <span className="text-xs text-gray-500">
                                        Natural phenomena and landscapes
                                    </span>
                                </div>
                            </SelectItem>
                            <SelectItem value="technology">
                                <div className="flex flex-col items-start">
                                    <span>Technology</span>
                                    <span className="text-xs text-gray-500">
                                        Computing and digital technology terms
                                    </span>
                                </div>
                            </SelectItem>
                            <SelectItem value="colors">
                                <div className="flex flex-col items-start">
                                    <span>Colors</span>
                                    <span className="text-xs text-gray-500">
                                        Color names and shades
                                    </span>
                                </div>
                            </SelectItem>
                        </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-500">
                        {getCategoryDescription(wordCategory)}
                    </p>
                </div>

                {/* Separator - Enhanced with client-side preview */}
                <div className="space-y-2">
                    <Label htmlFor="separator">Word Separator</Label>
                    <Select
                        value={separator}
                        onValueChange={(value) => {
                            setSeparator(value);
                            handleSeparatorChange(value, customSeparator);
                        }}
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="hyphen">Hyphen (-)</SelectItem>
                            <SelectItem value="underscore">
                                Underscore (_)
                            </SelectItem>
                            <SelectItem value="dot">Dot (.)</SelectItem>
                            <SelectItem value="space">Space ( )</SelectItem>
                            <SelectItem value="camel">CamelCase</SelectItem>
                            <SelectItem value="none">No Separator</SelectItem>
                            <SelectItem value="custom">Custom</SelectItem>
                        </SelectContent>
                    </Select>
                    {separator === "custom" && (
                        <Input
                            placeholder="Enter custom separator"
                            value={customSeparator}
                            onChange={(e) => {
                                setCustomSeparator(e.target.value);
                                handleSeparatorChange("custom", e.target.value);
                            }}
                            maxLength={3}
                        />
                    )}
                </div>

                {/* Additional Options */}
                <div className="space-y-4">
                    <Label>Additional Options</Label>
                    <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="capitalize"
                                checked={capitalizeWords}
                                onCheckedChange={(value) =>
                                    setCapitalizeWords(value as boolean)
                                }
                            />
                            <Label htmlFor="capitalize">
                                Capitalize first letter of each word
                            </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="numbers"
                                checked={includeNumbers}
                                onCheckedChange={(value) =>
                                    setIncludeNumbers(value as boolean)
                                }
                            />
                            <Label htmlFor="numbers">
                                Include random number (1-9999)
                            </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="symbols"
                                checked={includeSymbols}
                                onCheckedChange={(value) => {
                                    setIncludeSymbols(value as boolean);
                                }}
                            />
                            <Label htmlFor="symbols">
                                Include random symbol (!@#$%&*+=?)
                            </Label>
                        </div>
                    </div>
                </div>

                {/* Generate Button */}
                <Button
                    onClick={generatePassphrase}
                    className="w-full bg-emerald-600 hover:bg-emerald-700"
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Generating...
                        </>
                    ) : (
                        <>
                            <Dice6 className="h-4 w-4 mr-2" />
                            Generate Passphrase
                        </>
                    )}
                </Button>

                {/* Error Display */}
                {error && (
                    <Alert className="bg-red-50 border-red-200">
                        <AlertTitle className="text-red-800">Error</AlertTitle>
                        <AlertDescription className="text-red-700">
                            {error}
                        </AlertDescription>
                    </Alert>
                )}
            </div>

            {/* Generated Passphrase */}

            {passphrase && !error && (
                <div className="w-full space-y-6 bg-white p-6 rounded-lg border">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="generated-passphrase">
                                    Generated Passphrase
                                </Label>
                                <Button
                                    onClick={copyToClipboard}
                                    variant="outline"
                                    size="sm"
                                    className="flex items-center space-x-2"
                                >
                                    {copied ? (
                                        <>
                                            <Check className="h-4 w-4" />
                                            <span>Copied!</span>
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="h-4 w-4" />
                                            <span>Copy</span>
                                        </>
                                    )}
                                </Button>
                            </div>
                            <div className="relative">
                                <Input
                                    id="generated-passphrase"
                                    value={passphrase}
                                    readOnly
                                    className="font-mono text-lg bg-gray-50 select-all"
                                />
                            </div>

                            {/* Metadata */}
                            {metadata && (
                                <div className="flex flex-wrap gap-2 text-sm">
                                    <Badge variant="secondary">
                                        Length: {metadata.length} chars
                                    </Badge>
                                    <Badge variant="secondary">
                                        Total Words: {metadata.totalWordCount}
                                    </Badge>
                                    {metadata.customWordCount > 0 && (
                                        <Badge className="bg-purple-100 text-purple-800">
                                            Custom: {metadata.customWordCount}
                                        </Badge>
                                    )}
                                    {metadata.randomWordCount > 0 && (
                                        <Badge className="bg-blue-100 text-blue-800">
                                            Random: {metadata.randomWordCount}
                                        </Badge>
                                    )}
                                    <Badge variant="secondary">
                                        Dictionary:{" "}
                                        {metadata.dictionarySize.toLocaleString()}
                                    </Badge>
                                    {metadata.hasNumbers && (
                                        <Badge variant="outline">Numbers</Badge>
                                    )}
                                    {metadata.hasSymbols && (
                                        <Badge variant="outline">Symbols</Badge>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Word Breakdown */}
                        {wordBreakdown.length > 0 && (
                            <div className="space-y-2">
                                <Label>Word Breakdown:</Label>
                                <div className="flex flex-wrap gap-2">
                                    {wordBreakdown.map((item, index) => (
                                        <Badge
                                            key={index}
                                            className={`text-sm ${getSourceBadgeColor(
                                                item.source
                                            )}`}
                                        >
                                            {item.word}
                                            <span className="ml-1 text-xs opacity-75">
                                                ({item.source})
                                            </span>
                                        </Badge>
                                    ))}
                                </div>
                                <div className="text-xs text-gray-500 space-y-1">
                                    <div className="flex flex-wrap gap-4">
                                        <span className="flex items-center gap-1">
                                            <div className="w-3 h-3 rounded bg-purple-200"></div>
                                            Custom
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <div className="w-3 h-3 rounded bg-blue-200"></div>
                                            Random
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <div className="w-3 h-3 rounded bg-green-200"></div>
                                            Number
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <div className="w-3 h-3 rounded bg-orange-200"></div>
                                            Symbol
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Strength Analysis */}
                        {strength && (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <Label className="flex items-center">
                                        <Shield className="h-4 w-4 mr-2" />
                                        Passphrase Strength
                                    </Label>
                                    <span
                                        className={`font-semibold ${getStrengthColor(
                                            strength.entropy
                                        )}`}
                                    >
                                        {getStrengthLabel(strength.entropy)}
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="text-center p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                                        <div className="text-2xl font-bold text-emerald-700">
                                            {strength.entropy} bits
                                        </div>
                                        <div className="text-sm text-emerald-600">
                                            Entropy
                                        </div>
                                    </div>
                                    <div className="text-center p-4 bg-teal-50 rounded-lg border border-teal-200">
                                        <div className="text-2xl font-bold text-teal-700">
                                            {strength.combinations}
                                        </div>
                                        <div className="text-sm text-teal-600">
                                            Combinations
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <h4 className="font-semibold text-gray-900">
                                        Time to Crack (Dictionary Attack):
                                    </h4>
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center p-2 bg-white rounded border">
                                            <span className="text-sm font-medium text-gray-800">
                                                Personal Computer:
                                            </span>
                                            <span className="text-sm font-bold text-gray-900">
                                                {
                                                    strength.timeEstimates
                                                        .personal
                                                }
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center p-2 bg-white rounded border">
                                            <span className="text-sm font-medium text-gray-800">
                                                Professional Hardware:
                                            </span>
                                            <span className="text-sm font-bold text-gray-900">
                                                {
                                                    strength.timeEstimates
                                                        .professional
                                                }
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center p-2 bg-white rounded border">
                                            <span className="text-sm font-medium text-gray-800">
                                                Distributed Attack:
                                            </span>
                                            <span className="text-sm font-bold text-gray-900">
                                                {
                                                    strength.timeEstimates
                                                        .distributed
                                                }
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Warnings */}
                        {warnings.length > 0 && (
                            <Alert className="bg-yellow-50 border-yellow-200">
                                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                                <AlertTitle className="text-yellow-800">
                                    Security Notice
                                </AlertTitle>
                                <AlertDescription className="text-yellow-700">
                                    <ul className="list-disc list-inside space-y-1 text-sm">
                                        {warnings.map((warning, index) => (
                                            <li key={index}>{warning}</li>
                                        ))}
                                    </ul>
                                </AlertDescription>
                            </Alert>
                        )}
                    </div>
                </div>
            )}

            <div
                className={cn(
                    "space-y-4 bg-white p-6 rounded-lg border",
                    passphrase ? "col-span-2" : "col-span-1"
                )}
            >
                <Alert className="bg-blue-50 border-blue-200">
                    <Info className="h-4 w-4 text-blue-600" />
                    <AlertTitle className="text-blue-800">
                        Custom Words Feature
                    </AlertTitle>
                    <AlertDescription className="text-blue-700 text-sm">
                        Add your own memorable words to create personalized
                        passphrases. Your custom words are blended with randomly
                        selected words for the perfect balance of memorability
                        and security.
                    </AlertDescription>
                </Alert>

                <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
                    <h4 className="font-semibold text-emerald-900 mb-3">
                        Custom Words Best Practices
                    </h4>
                    <ul className="space-y-1 text-sm text-emerald-800">
                        <li>
                            • Use words that are meaningful to you but not
                            obvious to others
                        </li>
                        <li>
                            • Avoid personal information like names, birthdays,
                            or addresses
                        </li>
                        <li>
                            • Mix custom words with random words for better
                            security
                        </li>
                        <li>• Consider using made-up words or inside jokes</li>
                        <li>
                            • Keep custom words between 3-8 characters for best
                            results
                        </li>
                        <li>
                            • Remember: more custom words = more memorable but
                            less secure
                        </li>
                    </ul>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-3">
                        Blend Modes Explained
                    </h4>
                    <div className="space-y-2 text-sm text-gray-700">
                        <div>
                            <strong>Replace Mode:</strong> Your custom words
                            replace some random words, keeping the total word
                            count the same.
                        </div>
                        <div>
                            <strong>Add Mode:</strong> Your custom words are
                            added to the random words, increasing the total
                            length.
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg border space-y-4 col-span-2">
                {/* SEO Section - Why Our Passphrase Generator is the Best */}

                <div className="text-center space-y-2">
                    <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Award className="h-6 w-6 text-white" />
                    </div>
                    <h2 className="text-2xl">
                        Why Our Passphrase Generator is the Best Choice
                    </h2>
                    <p>
                        Discover what makes our passphrase generator the most
                        advanced, secure, and user-friendly tool available
                        online
                    </p>
                </div>
                <div className="space-y-8">
                    {/* Feature Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="text-center p-4 tone-green">
                            <Database className="h-8 w-8 mx-auto mb-3" />
                            <h4 className="font-semibold mb-2">
                                Premium Word Collections
                            </h4>
                            <p className="text-sm">
                                Access to thousands of curated words from
                                professional npm packages including animals,
                                nature, technology, and colors
                            </p>
                        </div>

                        <div className="text-center p-4 tone-purple">
                            <Plus className="h-8 w-8 mx-auto mb-3" />
                            <h4 className="font-semibold mb-2">
                                Custom Words Integration
                            </h4>
                            <p className="text-sm">
                                Unique feature to blend your personal words with
                                random selections for maximum memorability and
                                security
                            </p>
                        </div>

                        <div className="text-center p-4 tone-blue">
                            <Zap className="h-8 w-8 mx-auto mb-3" />
                            <h4 className="font-semibold mb-2">
                                Instant Separator Preview
                            </h4>
                            <p className="text-sm">
                                Change separators instantly without regenerating
                                - try hyphens, underscores, camelCase, and
                                custom separators in real-time
                            </p>
                        </div>

                        <div className="text-center p-4 tone-green">
                            <Shield className="h-8 w-8 mx-auto mb-3" />
                            <h4 className="font-semibold mb-2">
                                Advanced Security Analysis
                            </h4>
                            <p className="text-sm">
                                Detailed entropy calculations, crack time
                                estimates, and security warnings with
                                transparent methodology
                            </p>
                        </div>

                        <div className="text-center p-4 tone-orange">
                            <Shuffle className="h-8 w-8 mx-auto mb-3" />
                            <h4 className="font-semibold mb-2">
                                Smart Word Blending
                            </h4>
                            <p className="text-sm">
                                Intelligent mixing of custom and random words
                                with duplicate prevention and optimal
                                randomization
                            </p>
                        </div>

                        <div className="text-center p-4 tone-green">
                            <Eye className="h-8 w-8  mx-auto mb-3" />
                            <h4 className="font-semibold mb-2">
                                Complete Transparency
                            </h4>
                            <p className="text-sm">
                                See exactly which words are custom vs random,
                                understand security trade-offs, and get
                                personalized recommendations
                            </p>
                        </div>
                    </div>

                    {/* Security & Privacy */}
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200">
                        <h3 className="text-xl font-bold text-green-900 mb-4 flex items-center">
                            <Lock className="h-5 w-5 mr-2" />
                            Security & Privacy Commitment
                        </h3>
                        <div className="space-y-3">
                            <div className="flex items-start space-x-3">
                                <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                                <div>
                                    <h4 className="font-semibold text-green-800">
                                        No Data Storage
                                    </h4>
                                    <p className="text-sm text-green-700">
                                        Your passphrases and custom words are
                                        never stored on our servers. All
                                        processing happens in-memory and is
                                        immediately discarded.
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-3">
                                <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                                <div>
                                    <h4 className="font-semibold text-green-800">
                                        Transparent Security Analysis
                                    </h4>
                                    <p className="text-sm text-green-700">
                                        Complete transparency about how security
                                        is calculated, including the impact of
                                        custom words on overall entropy and
                                        crack resistance.
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-3">
                                <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                                <div>
                                    <h4 className="font-semibold text-green-800">
                                        Educational Approach
                                    </h4>
                                    <p className="text-sm text-green-700">
                                        We educate users about password
                                        security, helping them understand the
                                        trade-offs between memorability and
                                        security for informed decisions.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* User Experience */}
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6 border border-purple-200">
                        <h3 className="text-xl font-bold text-purple-900 mb-4 flex items-center">
                            <Star className="h-5 w-5 mr-2" />
                            Unmatched User Experience
                        </h3>
                        <div className="grid grid-cols-1 justify-items-center md:grid-cols-3 gap-4">
                            <div className="text-center max-w-xs">
                                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                    <Zap className="h-6 w-6 text-purple-600" />
                                </div>
                                <h4 className="font-semibold text-purple-800 mb-1">
                                    Lightning Fast
                                </h4>
                                <p className="text-xs text-purple-700">
                                    Instant generation and real-time separator
                                    changes for immediate results
                                </p>
                            </div>
                            <div className="text-center max-w-xs">
                                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                    <Eye className="h-6 w-6 text-purple-600" />
                                </div>
                                <h4 className="font-semibold text-purple-800 mb-1">
                                    Visual Clarity
                                </h4>
                                <p className="text-xs text-purple-700">
                                    Color-coded word sources, clear security
                                    indicators, and intuitive interface design
                                </p>
                            </div>
                            <div className="text-center max-w-xs">
                                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                    <Settings className="h-6 w-6 text-purple-600" />
                                </div>
                                <h4 className="font-semibold text-purple-800 mb-1">
                                    Highly Customizable
                                </h4>
                                <p className="text-xs text-purple-700">
                                    Extensive options for word count,
                                    categories, separators, and personal
                                    customization
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* SEO Keywords Section */}
                    <div className="text-center text-sm text-gray-600 space-y-2">
                        <p>
                            <strong>Keywords:</strong> passphrase generator,
                            secure password creator, memorable password
                            generator, XKCD password, diceware generator, custom
                            word passphrase, random word password, password
                            security tool, entropy calculator, password strength
                            analyzer
                        </p>
                        <p>
                            <strong>Related:</strong> password manager,
                            two-factor authentication, cybersecurity tools, data
                            protection, online security, password best
                            practices, digital privacy, secure authentication
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PassPhraseGenerator;
