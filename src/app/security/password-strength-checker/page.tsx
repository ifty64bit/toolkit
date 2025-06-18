import { type Metadata } from "next";
import React from "react";
import PasswordStrengthChecker from "./PasswordStrengthChecker";

export const metadata: Metadata = {
    title: "Password Strength Checker - Test Your Password Security",
    description:
        "Check the strength of your passwords with our free password strength checker to ensure they are secure against attacks. Get insights on how to improve your password security. Get detailed analysis, security score, and tips to improve your password security.",
    keywords: [
        "password strength checker, password security, strong password, password analyzer, password test, password security score, password entropy",
    ],
    openGraph: {
        title: "Password Strength Checker - Test Your Password Security",
        description:
            "Check how strong your password is with our free password strength checker tool. Get detailed analysis, security score, and tips to improve your password security.",
        type: "website",
    },
};

function PasswordStrengthCheckerPage() {
    return (
        <div>
            <div className="flex flex-col sm:flex-row text-center sm:text-left items-center gap-4 mb-6">
                <div className="text-3xl">🔍</div>
                <div>
                    <h2>Password Strength Checker</h2>
                    <p className="text-muted-foreground">
                        Test your password security and get detailed analysis
                        with actionable improvement tips
                    </p>
                </div>
            </div>

            <PasswordStrengthChecker />

            <hr className="my-6 max-w-4xl mx-auto" />
            <div className="prose max-w-4xl mx-auto prose-sm text-gray-700 bg-white p-6 rounded-lg shadow-md border">
                <h3 className="text-lg font-semibold text-gray-900">
                    Why Password Strength Matters
                </h3>
                <p>
                    Strong passwords are your first line of defense against
                    unauthorized access to your accounts. With data breaches
                    becoming increasingly common, having a strong, unique
                    password for each account is more important than ever.
                </p>
                <h4 className="font-medium text-gray-900 mt-4">
                    What Makes a Strong Password?
                </h4>
                <p>
                    A strong password should be long (at least 12 characters),
                    complex (using a mix of character types), unpredictable
                    (avoiding common words or patterns), and unique (not used
                    for multiple accounts).
                </p>
                <h4 className="font-medium text-gray-900 mt-4">
                    How Our Password Strength Checker Works
                </h4>
                <p>
                    Our tool analyzes multiple factors including length,
                    character variety, common patterns, and predictability. We
                    calculate entropy (randomness) and estimate how long it
                    would take different types of attacks to crack your
                    password.
                </p>
                <p className="text-xs text-gray-500 mt-6">
                    Note: This tool performs all analysis locally in your
                    browser. Your password is never sent to our servers or
                    stored anywhere.
                </p>
            </div>
        </div>
    );
}

export default PasswordStrengthCheckerPage;
