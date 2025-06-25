import { type NextRequest, NextResponse } from "next/server";
import commonWords from "an-array-of-english-words";
import animals from "animals";

export const runtime = "edge";

const colors = [
    "red",
    "blue",
    "green",
    "yellow",
    "orange",
    "purple",
    "pink",
    "brown",
    "black",
    "white",
    "gray",
    "silver",
    "gold",
    "bronze",
    "copper",
    "crimson",
    "scarlet",
    "maroon",
    "burgundy",
    "coral",
    "salmon",
    "peach",
    "amber",
    "ivory",
    "cream",
    "beige",
    "tan",
    "khaki",
    "olive",
    "lime",
    "mint",
    "teal",
    "cyan",
    "azure",
    "navy",
    "indigo",
    "violet",
    "magenta",
    "fuchsia",
    "lavender",
    "plum",
    "mauve",
    "rose",
    "ruby",
    "emerald",
    "jade",
    "turquoise",
    "sapphire",
];

const nature = [
    "mountain",
    "river",
    "forest",
    "ocean",
    "desert",
    "valley",
    "meadow",
    "canyon",
    "glacier",
    "volcano",
    "sunrise",
    "sunset",
    "rainbow",
    "thunder",
    "lightning",
    "breeze",
    "storm",
    "mist",
    "frost",
    "dew",
    "flower",
    "tree",
    "grass",
    "moss",
    "fern",
    "coral",
    "shell",
    "pebble",
    "crystal",
    "stream",
    "pond",
    "lake",
    "waterfall",
    "spring",
    "cave",
    "cliff",
    "peak",
    "ridge",
    "plateau",
    "cloud",
    "star",
    "moon",
    "sun",
    "comet",
    "aurora",
    "eclipse",
];

const technology = [
    "computer",
    "internet",
    "software",
    "hardware",
    "network",
    "database",
    "server",
    "client",
    "browser",
    "website",
    "mobile",
    "tablet",
    "laptop",
    "desktop",
    "keyboard",
    "mouse",
    "monitor",
    "printer",
    "scanner",
    "camera",
    "digital",
    "virtual",
    "cloud",
    "data",
    "code",
    "program",
    "system",
    "platform",
    "interface",
    "protocol",
    "wireless",
    "bluetooth",
    "wifi",
    "ethernet",
    "fiber",
    "satellite",
    "antenna",
    "signal",
    "frequency",
    "bandwidth",
];

const filteredCommonWords = commonWords.filter(
    (word: string) =>
        word.length >= 3 && word.length <= 8 && /^[a-zA-Z]+$/.test(word)
);

const wordLists = {
    common: filteredCommonWords.slice(0, 1000), // Limit to 1000 most common words
    animals: animals,
    nature: nature,
    technology: technology,
    colors: colors,
};

interface PassphraseRequest {
    wordCount: number;
    category: string;
    separator: string;
    customSeparator?: string;
    includeNumbers: boolean;
    includeSymbols: boolean;
    capitalizeWords: boolean;
    customWords?: string[];
    blendMode?: "replace" | "add"; // replace some random words or add to total count
}

function validateCustomWords(words: string[]): {
    valid: string[];
    invalid: string[];
} {
    const valid: string[] = [];
    const invalid: string[] = [];

    words.forEach((word) => {
        const cleanWord = word.trim().toLowerCase();
        // Allow letters, numbers, and basic punctuation, but keep it reasonable
        if (
            cleanWord.length >= 2 &&
            cleanWord.length <= 15 &&
            /^[a-zA-Z0-9\-']+$/.test(cleanWord)
        ) {
            valid.push(cleanWord);
        } else {
            invalid.push(word);
        }
    });

    return { valid, invalid };
}

export async function POST(request: NextRequest) {
    try {
        const body: PassphraseRequest = await request.json();

        const {
            wordCount,
            category,
            separator,
            customSeparator,
            includeNumbers,
            includeSymbols,
            capitalizeWords,
            customWords = [],
            blendMode = "replace",
        } = body;

        // Validate input
        if (wordCount < 2 || wordCount > 8) {
            return NextResponse.json(
                { error: "Word count must be between 2 and 8" },
                { status: 400 }
            );
        }

        if (!wordLists[category as keyof typeof wordLists]) {
            return NextResponse.json(
                { error: "Invalid category" },
                { status: 400 }
            );
        }

        // Validate custom words
        const { valid: validCustomWords, invalid: invalidCustomWords } =
            validateCustomWords(customWords);

        if (invalidCustomWords.length > 0) {
            return NextResponse.json(
                {
                    error: `Invalid custom words: ${invalidCustomWords.join(
                        ", "
                    )}. Words must be 2-15 characters and contain only letters, numbers, hyphens, and apostrophes.`,
                },
                { status: 400 }
            );
        }

        if (validCustomWords.length > wordCount) {
            return NextResponse.json(
                {
                    error: `Too many custom words (${validCustomWords.length}). Maximum allowed is ${wordCount}.`,
                },
                { status: 400 }
            );
        }

        const selectedWordList = wordLists[category as keyof typeof wordLists];
        const words: string[] = [];
        const wordSources: string[] = []; // Track source of each word for metadata

        // Determine how many random words we need
        let randomWordsNeeded = wordCount;
        if (blendMode === "replace") {
            randomWordsNeeded = wordCount - validCustomWords.length;
        } else if (blendMode === "add") {
            randomWordsNeeded = wordCount;
        }

        // Add custom words first
        validCustomWords.forEach((word) => {
            let processedWord = word;
            if (capitalizeWords) {
                processedWord = word.charAt(0).toUpperCase() + word.slice(1);
            }
            words.push(processedWord);
            wordSources.push("custom");
        });

        // Generate random words
        const usedWords = new Set(validCustomWords.map((w) => w.toLowerCase()));

        for (let i = 0; i < randomWordsNeeded; i++) {
            let attempts = 0;
            let word = "";

            // Try to find a unique word (avoid duplicates)
            do {
                const randomIndex = Math.floor(
                    Math.random() * selectedWordList.length
                );
                if (Array.isArray(selectedWordList)) {
                    word = selectedWordList[randomIndex].toLowerCase();
                }
                attempts++;
            } while (usedWords.has(word) && attempts < 50); // Prevent infinite loop

            usedWords.add(word);

            // Capitalize if requested
            if (capitalizeWords) {
                word = word.charAt(0).toUpperCase() + word.slice(1);
            }

            words.push(word);
            wordSources.push("random");
        }

        // Shuffle the words to mix custom and random words
        const shuffledData = words.map((word, index) => ({
            word,
            source: wordSources[index],
        }));
        for (let i = shuffledData.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledData[i], shuffledData[j]] = [
                shuffledData[j],
                shuffledData[i],
            ];
        }

        const finalWords = shuffledData.map((item) => item.word);
        const finalSources = shuffledData.map((item) => item.source);

        // Add numbers if requested
        if (includeNumbers) {
            const randomNumber = Math.floor(Math.random() * 9999) + 1;
            finalWords.push(randomNumber.toString());
            finalSources.push("number");
        }

        // Add symbols if requested
        if (includeSymbols) {
            const symbols = ["!", "@", "#", "$", "%", "&", "*", "+", "=", "?"];
            const randomSymbol =
                symbols[Math.floor(Math.random() * symbols.length)];
            finalWords.push(randomSymbol);
            finalSources.push("symbol");
        }

        // Determine separator
        const separators = {
            hyphen: "-",
            underscore: "_",
            dot: ".",
            space: " ",
            none: "",
            custom: customSeparator || "",
        };

        const finalSeparator =
            separators[separator as keyof typeof separators] || "-";

        // Handle camelCase specially
        let passphrase = "";
        if (separator === "camel") {
            passphrase = finalWords
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
            passphrase = finalWords.join(finalSeparator);
        }

        // Calculate strength metrics
        const dictionarySize = selectedWordList.length;
        const customWordCount = validCustomWords.length;
        const randomWordCount = finalWords.filter(
            (_, index) => finalSources[index] === "random"
        ).length;

        // Calculate entropy considering custom words have lower entropy (known to user)
        // Custom words contribute less entropy since they're chosen by user
        let baseEntropy = 0;

        // Random words contribute full entropy
        if (randomWordCount > 0) {
            baseEntropy += Math.log2(Math.pow(dictionarySize, randomWordCount));
        }

        // Custom words contribute reduced entropy (assume 1 bit each as they're user-chosen)
        if (customWordCount > 0) {
            baseEntropy += customWordCount * 1; // Very low entropy for user-chosen words
        }

        if (includeNumbers) {
            baseEntropy += Math.log2(9999);
        }
        if (includeSymbols) {
            baseEntropy += Math.log2(10);
        }

        // Calculate combinations (more complex with custom words)
        let totalCombinations = 1;
        if (randomWordCount > 0) {
            totalCombinations *= Math.pow(dictionarySize, randomWordCount);
        }
        if (customWordCount > 0) {
            totalCombinations *= Math.pow(2, customWordCount); // Low multiplier for custom words
        }
        if (includeNumbers) totalCombinations *= 9999;
        if (includeSymbols) totalCombinations *= 10;

        const avgCombinations = totalCombinations / 2;

        // Attack speed estimates (words per second for dictionary attacks)
        const attackSpeeds = {
            personal: 1000,
            professional: 100000,
            distributed: 10000000,
        };

        const formatTime = (seconds: number): string => {
            if (seconds < 1) return "Instantly";
            if (seconds < 60) return `${Math.round(seconds)} seconds`;
            if (seconds < 3600) return `${Math.round(seconds / 60)} minutes`;
            if (seconds < 86400) return `${Math.round(seconds / 3600)} hours`;
            if (seconds < 31536000)
                return `${Math.round(seconds / 86400)} days`;
            if (seconds < 31536000000)
                return `${Math.round(seconds / 31536000)} years`;
            return `${(seconds / 31536000000).toExponential(2)} billion years`;
        };

        const formatCombinations = (num: number): string => {
            if (num < 1000) return num.toString();
            if (num < 1000000) return `${(num / 1000).toFixed(1)}K`;
            if (num < 1000000000) return `${(num / 1000000).toFixed(1)}M`;
            if (num < 1000000000000) return `${(num / 1000000000).toFixed(1)}B`;
            return `${(num / 1000000000000).toFixed(1)}T`;
        };

        // Create word breakdown with sources
        const wordBreakdown = finalWords.map((word, index) => ({
            word,
            source: finalSources[index],
        }));

        const response = {
            passphrase,
            words: finalWords.filter(
                (_, index) =>
                    !["number", "symbol"].includes(finalSources[index])
            ),
            wordBreakdown,
            strength: {
                entropy: Math.round(baseEntropy * 10) / 10,
                combinations: formatCombinations(totalCombinations),
                timeEstimates: {
                    personal: formatTime(
                        avgCombinations / attackSpeeds.personal
                    ),
                    professional: formatTime(
                        avgCombinations / attackSpeeds.professional
                    ),
                    distributed: formatTime(
                        avgCombinations / attackSpeeds.distributed
                    ),
                },
            },
            metadata: {
                length: passphrase.length,
                totalWordCount: finalWords.filter(
                    (_, index) =>
                        !["number", "symbol"].includes(finalSources[index])
                ).length,
                customWordCount,
                randomWordCount,
                hasNumbers: includeNumbers,
                hasSymbols: includeSymbols,
                dictionarySize,
                blendMode,
            },
            warnings:
                customWordCount > 0
                    ? [
                          "Custom words reduce overall entropy since they're not randomly selected",
                          "Avoid using personal information that others might guess",
                          "Consider the trade-off between memorability and security",
                      ]
                    : [],
        };

        return NextResponse.json(response);
    } catch (error) {
        console.error("Passphrase generation error:", error);
        return NextResponse.json(
            { error: "Failed to generate passphrase" },
            { status: 500 }
        );
    }
}

export async function GET() {
    return NextResponse.json({
        message: "Passphrase Generator API",
        endpoints: {
            POST: "/api/passphrase - Generate a new passphrase",
        },
        categories: Object.keys(wordLists),
        separators: [
            "hyphen",
            "underscore",
            "dot",
            "space",
            "camel",
            "none",
            "custom",
        ],
        customWordsSupport: {
            maxWords: 8,
            blendModes: ["replace", "add"],
            validation:
                "2-15 characters, letters/numbers/hyphens/apostrophes only",
        },
    });
}
