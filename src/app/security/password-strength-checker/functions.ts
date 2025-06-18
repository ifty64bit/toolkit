// Common password lists
const commonPasswords = [
    "password",
    "123456",
    "12345678",
    "qwerty",
    "admin",
    "welcome",
    "123123",
    "abc123",
    "letmein",
    "monkey",
    "1234567",
    "12345",
    "111111",
    "sunshine",
    "princess",
    "dragon",
    "password1",
    "123456789",
    "football",
    "baseball",
    "welcome1",
    "admin123",
];

// Common patterns
const commonPatterns = [
    /^(19|20)\d{2}$/, // Years (1900-2099)
    /^(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])$/, // MMDD dates
    /^(0[1-9]|[12]\d|3[01])(0[1-9]|1[0-2])$/, // DDMM dates
    /^qwerty/i, // Starts with qwerty
    /^asdf/i, // Starts with asdf
    /^zxcv/i, // Starts with zxcv
    /1234/, // Contains 1234
    /abcd/i, // Contains abcd
    /^admin/i, // Starts with admin
    /^pass/i, // Starts with pass
    /^welcome/i, // Starts with welcome
];

// Sequential characters
const sequentialSets = [
    "abcdefghijklmnopqrstuvwxyz",
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    "0123456789",
    "qwertyuiop",
    "asdfghjkl",
    "zxcvbnm",
];

export function analyzePassword(pwd: string) {
    const analysisResult = {
        length: { score: 0, feedback: "", status: "error" },
        uppercase: { score: 0, feedback: "", status: "error" },
        lowercase: { score: 0, feedback: "", status: "error" },
        numbers: { score: 0, feedback: "", status: "error" },
        symbols: { score: 0, feedback: "", status: "error" },
        common: { score: 0, feedback: "", status: "error" },
        patterns: { score: 0, feedback: "", status: "error" },
        sequential: { score: 0, feedback: "", status: "error" },
        repeated: { score: 0, feedback: "", status: "error" },
    };

    const newSuggestions: string[] = [];

    // Length analysis
    if (pwd.length < 8) {
        analysisResult.length.score = 0;
        analysisResult.length.feedback =
            "Password is too short (less than 8 characters)";
        analysisResult.length.status = "error";
        newSuggestions.push("Use at least 8 characters, preferably 12 or more");
    } else if (pwd.length < 12) {
        analysisResult.length.score = 10;
        analysisResult.length.feedback =
            "Password length is acceptable but could be better";
        analysisResult.length.status = "warning";
        newSuggestions.push(
            "Consider using 12 or more characters for better security"
        );
    } else if (pwd.length < 16) {
        analysisResult.length.score = 20;
        analysisResult.length.feedback = "Good password length";
        analysisResult.length.status = "success";
    } else {
        analysisResult.length.score = 25;
        analysisResult.length.feedback = "Excellent password length";
        analysisResult.length.status = "success";
    }

    // Character variety analysis
    const hasUppercase = /[A-Z]/.test(pwd);
    const hasLowercase = /[a-z]/.test(pwd);
    const hasNumbers = /[0-9]/.test(pwd);
    const hasSymbols = /[^A-Za-z0-9]/.test(pwd);

    // Uppercase
    if (hasUppercase) {
        analysisResult.uppercase.score = 10;
        analysisResult.uppercase.feedback = "Contains uppercase letters";
        analysisResult.uppercase.status = "success";
    } else {
        analysisResult.uppercase.feedback = "No uppercase letters";
        newSuggestions.push("Add uppercase letters (A-Z)");
    }

    // Lowercase
    if (hasLowercase) {
        analysisResult.lowercase.score = 10;
        analysisResult.lowercase.feedback = "Contains lowercase letters";
        analysisResult.lowercase.status = "success";
    } else {
        analysisResult.lowercase.feedback = "No lowercase letters";
        newSuggestions.push("Add lowercase letters (a-z)");
    }

    // Numbers
    if (hasNumbers) {
        analysisResult.numbers.score = 10;
        analysisResult.numbers.feedback = "Contains numbers";
        analysisResult.numbers.status = "success";
    } else {
        analysisResult.numbers.feedback = "No numbers";
        newSuggestions.push("Add numbers (0-9)");
    }

    // Symbols
    if (hasSymbols) {
        analysisResult.symbols.score = 15;
        analysisResult.symbols.feedback = "Contains special characters";
        analysisResult.symbols.status = "success";
    } else {
        analysisResult.symbols.feedback = "No special characters";
        newSuggestions.push("Add special characters (!@#$%^&*)");
    }

    // Common password check
    const lowerPwd = pwd.toLowerCase();
    if (commonPasswords.includes(lowerPwd)) {
        analysisResult.common.score = -50;
        analysisResult.common.feedback = "This is a commonly used password!";
        analysisResult.common.status = "error";
        newSuggestions.push(
            "Avoid using common passwords that appear in breach lists"
        );
    } else {
        analysisResult.common.score = 10;
        analysisResult.common.feedback = "Not found in common password lists";
        analysisResult.common.status = "success";
    }

    // Pattern detection
    let hasPattern = false;
    for (const pattern of commonPatterns) {
        if (pattern.test(pwd)) {
            hasPattern = true;
            break;
        }
    }

    if (hasPattern) {
        analysisResult.patterns.score = -15;
        analysisResult.patterns.feedback = "Contains predictable patterns";
        analysisResult.patterns.status = "error";
        newSuggestions.push(
            "Avoid predictable patterns like keyboard sequences or dates"
        );
    } else {
        analysisResult.patterns.score = 10;
        analysisResult.patterns.feedback = "No obvious patterns detected";
        analysisResult.patterns.status = "success";
    }

    // Sequential characters check
    let hasSequential = false;
    for (const seq of sequentialSets) {
        for (let i = 0; i < seq.length - 2; i++) {
            const fragment = seq.substring(i, i + 3);
            if (pwd.toLowerCase().includes(fragment.toLowerCase())) {
                hasSequential = true;
                break;
            }
        }
        if (hasSequential) break;
    }

    if (hasSequential) {
        analysisResult.sequential.score = -10;
        analysisResult.sequential.feedback = "Contains sequential characters";
        analysisResult.sequential.status = "error";
        newSuggestions.push(
            "Avoid sequential characters like 'abc', '123', or 'qwerty'"
        );
    } else {
        analysisResult.sequential.score = 5;
        analysisResult.sequential.feedback =
            "No sequential characters detected";
        analysisResult.sequential.status = "success";
    }

    // Repeated characters check
    const repeatedChars = /(.)\1{2,}/.test(pwd);
    if (repeatedChars) {
        analysisResult.repeated.score = -5;
        analysisResult.repeated.feedback = "Contains repeated characters";
        analysisResult.repeated.status = "warning";
        newSuggestions.push(
            "Avoid repeating the same character multiple times"
        );
    } else {
        analysisResult.repeated.score = 5;
        analysisResult.repeated.feedback = "No repeated characters detected";
        analysisResult.repeated.status = "success";
    }

    // Calculate total score
    let totalScore = Object.values(analysisResult).reduce(
        (sum, item) => sum + item.score,
        0
    );

    // Ensure score is between 0 and 100
    totalScore = Math.max(0, Math.min(100, totalScore));

    // Determine strength label and color
    let label = "";
    let color = "";

    if (totalScore < 20) {
        label = "Very Weak";
        color = "bg-red-600";
    } else if (totalScore < 40) {
        label = "Weak";
        color = "bg-orange-500";
    } else if (totalScore < 60) {
        label = "Fair";
        color = "bg-yellow-500";
    } else if (totalScore < 80) {
        label = "Good";
        color = "bg-blue-500";
    } else {
        label = "Strong";
        color = "bg-green-600";
    }

    // Calculate entropy and crack time
    let charsetSize = 0;
    if (hasLowercase) charsetSize += 26;
    if (hasUppercase) charsetSize += 26;
    if (hasNumbers) charsetSize += 10;
    if (hasSymbols) charsetSize += 32;

    // If no character types are detected, set a minimum charset size
    if (charsetSize === 0) charsetSize = 26;

    // Calculate entropy (bits)
    const entropy = Math.log2(Math.pow(charsetSize, pwd.length));

    // Total possible combinations
    const totalCombinations = Math.pow(charsetSize, pwd.length);

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

    const strength = {
        score: totalScore,
        maxScore: 100,
        percentage: totalScore,
        label,
        color,
    };

    const crackTime = {
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

    return {
        suggestions: newSuggestions,
        analysis: analysisResult,
        crackTime,
        strength,
    };
}
