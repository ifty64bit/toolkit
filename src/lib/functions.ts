import type { PasswordGeneratorFormOutput } from "@/app/security/password-generator/PasswordGenerator";

export function getZodiacSign(
    month: number,
    day: number
): { sign: string; emoji: string; dates: string } {
    const zodiacSigns = [
        {
            sign: "Capricorn",
            emoji: "♑",
            start: [12, 22],
            end: [1, 19],
            dates: "Dec 22 - Jan 19",
        },
        {
            sign: "Aquarius",
            emoji: "♒",
            start: [1, 20],
            end: [2, 18],
            dates: "Jan 20 - Feb 18",
        },
        {
            sign: "Pisces",
            emoji: "♓",
            start: [2, 19],
            end: [3, 20],
            dates: "Feb 19 - Mar 20",
        },
        {
            sign: "Aries",
            emoji: "♈",
            start: [3, 21],
            end: [4, 19],
            dates: "Mar 21 - Apr 19",
        },
        {
            sign: "Taurus",
            emoji: "♉",
            start: [4, 20],
            end: [5, 20],
            dates: "Apr 20 - May 20",
        },
        {
            sign: "Gemini",
            emoji: "♊",
            start: [5, 21],
            end: [6, 20],
            dates: "May 21 - Jun 20",
        },
        {
            sign: "Cancer",
            emoji: "♋",
            start: [6, 21],
            end: [7, 22],
            dates: "Jun 21 - Jul 22",
        },
        {
            sign: "Leo",
            emoji: "♌",
            start: [7, 23],
            end: [8, 22],
            dates: "Jul 23 - Aug 22",
        },
        {
            sign: "Virgo",
            emoji: "♍",
            start: [8, 23],
            end: [9, 22],
            dates: "Aug 23 - Sep 22",
        },
        {
            sign: "Libra",
            emoji: "♎",
            start: [9, 23],
            end: [10, 22],
            dates: "Sep 23 - Oct 22",
        },
        {
            sign: "Scorpio",
            emoji: "♏",
            start: [10, 23],
            end: [11, 21],
            dates: "Oct 23 - Nov 21",
        },
        {
            sign: "Sagittarius",
            emoji: "♐",
            start: [11, 22],
            end: [12, 21],
            dates: "Nov 22 - Dec 21",
        },
    ];

    for (const zodiac of zodiacSigns) {
        const [startMonth, startDay] = zodiac.start;
        const [endMonth, endDay] = zodiac.end;

        if (
            (month === startMonth && day >= startDay) ||
            (month === endMonth && day <= endDay) ||
            (startMonth > endMonth &&
                (month === startMonth || month === endMonth))
        ) {
            return zodiac;
        }
    }

    return zodiacSigns[0];
}

export function generatePassword({
    case: caseOption,
    includeNumbers,
    includeSpecialCharacters: includeSpecialChars,
    length,
}: PasswordGeneratorFormOutput) {
    const numbers = "0123456789";
    const specialChars = "!@#$%^&*()_+-=[]{}|;:,.<>?";
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    let charset = "";

    if (caseOption === "lowercase") {
        charset += lowercase;
    } else if (caseOption === "uppercase") {
        charset += uppercase;
    } else if (caseOption === "mixed") {
        charset += lowercase + uppercase;
    }

    if (includeNumbers) {
        charset += numbers;
    }

    // Add special characters if selected
    if (includeSpecialChars) {
        charset += specialChars;
    }

    let generatedPassword = "";
    const passwordLength = length;

    const requiredChars = [];
    if (caseOption === "lowercase") requiredChars.push(lowercase);
    if (caseOption === "uppercase") requiredChars.push(uppercase);
    if (caseOption === "mixed") {
        requiredChars.push(lowercase, uppercase);
    }
    if (includeNumbers) requiredChars.push(numbers);
    if (includeSpecialChars) requiredChars.push(specialChars);

    // Add one character from each required type
    for (const charSet of requiredChars) {
        if (generatedPassword.length < passwordLength) {
            generatedPassword += charSet.charAt(
                Math.floor(Math.random() * charSet.length)
            );
        }
    }

    // Fill the rest randomly
    for (let i = generatedPassword.length; i < passwordLength; i++) {
        generatedPassword += charset.charAt(
            Math.floor(Math.random() * charset.length)
        );
    }

    // Shuffle the password
    generatedPassword = generatedPassword
        .split("")
        .sort(() => Math.random() - 0.5)
        .join("");

    return generatedPassword;
}

export function calculateStrength(password: string) {
    let score = 0;
    let charsetSize = 0;

    // Calculate character set size
    const hasLowercase = /[a-z]/.test(password);
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    const hasSpecialChars = /[^A-Za-z0-9]/.test(password);

    if (hasLowercase) charsetSize += 26;
    if (hasUppercase) charsetSize += 26;
    if (hasNumbers) charsetSize += 10;
    if (hasSpecialChars) charsetSize += 32; // Common special characters

    // Length check
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    if (password.length >= 16) score += 1;

    // Character variety checks
    if (hasLowercase) score += 1;
    if (hasUppercase) score += 1;
    if (hasNumbers) score += 1;
    if (hasSpecialChars) score += 1;

    let label = "";
    let color = "";

    if (score <= 2) {
        label = "Weak";
        color = "text-red-600";
    } else if (score <= 4) {
        label = "Fair";
        color = "text-yellow-600";
    } else if (score <= 6) {
        label = "Good";
        color = "text-blue-600";
    } else {
        label = "Strong";
        color = "text-green-600";
    }

    return {
        label,
        color,
        score,
        charsetSize,
    };
}

export function calculateCrackTime(length: number, charsetSize: number) {
    // Calculate entropy (bits)
    const entropy = Math.log2(Math.pow(charsetSize, length));

    // Total possible combinations
    const totalCombinations = Math.pow(charsetSize, length);

    // Average time to crack (half of total combinations)
    const avgCombinations = totalCombinations / 2;

    // Different attack scenarios (guesses per second)
    const attackSpeeds = {
        personal: 1000000, // 1 million guesses/sec (personal computer)
        professional: 1000000000, // 1 billion guesses/sec (professional hardware)
        distributed: 1000000000000, // 1 trillion guesses/sec (distributed/quantum)
    };

    const formatTime = (seconds: number): string => {
        if (seconds < 1) return "Instantly";
        if (seconds < 60) return `${Math.round(seconds)} seconds`;
        if (seconds < 3600) return `${Math.round(seconds / 60)} minutes`;
        if (seconds < 86400) return `${Math.round(seconds / 3600)} hours`;
        if (seconds < 31536000) return `${Math.round(seconds / 86400)} days`;
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

    return {
        entropy: Math.round(entropy * 10) / 10,
        combinations: formatCombinations(totalCombinations),
        timeEstimates: {
            personal: formatTime(avgCombinations / attackSpeeds.personal),
            professional: formatTime(
                avgCombinations / attackSpeeds.professional
            ),
            distributed: formatTime(avgCombinations / attackSpeeds.distributed),
        },
    };
}

export async function copyToClipboard(text: string) {
    await navigator.clipboard.writeText(text);
}
