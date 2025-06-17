import React from "react";
import PasswordGenerator from "./PasswordGenerator";
import { type Metadata } from "next";

export const metadata: Metadata = {
    title: "Password Generator | Create Secure & Random Strong Passwords Online",
    description:
        "Generate strong, secure, and random passwords instantly. Customize password length, include numbers, symbols, and mixed case to enhance your online security. Perfect for protecting accounts, apps, and websites.",
    keywords: [
        "password generator",
        "secure password",
        "strong password",
        "random password generator",
        "online password generator",
        "create password",
        "generate password",
        "cybersecurity tools",
        "password security",
    ],
};

function PasswordGeneratorPage() {
    return (
        <div>
            <div className="flex flex-col sm:flex-row text-center sm:text-left items-center gap-4 mb-6">
                <div className="text-3xl">🔒</div>
                <div>
                    <h2>Password Generator</h2>
                    <p className="text-muted-foreground">
                        Generate secure passwords with customizable options.
                    </p>
                </div>
            </div>
            <PasswordGenerator />
        </div>
    );
}

export default PasswordGeneratorPage;
