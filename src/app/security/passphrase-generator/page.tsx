import React from "react";
import PassPhraseGenerator from "./PassPhraseGenerator";
import { type Metadata } from "next";

export const metadata: Metadata = {
    title: "PassPhrase Generator",
    description:
        "Generate secure passphrases with customizable options. A passphrase is a sequence of words or a sentence that is used to authenticate a user, often providing better security than traditional passwords.",
    keywords: [
        "passphrase generator",
        "secure passphrase",
        "customizable passphrase",
        "authentication",
        "password security",
        "generate passphrase",
        "random words",
        "passphrase options",
    ],
};

function PassPhraseGeneratorPage() {
    return (
        <div>
            <div className="flex flex-col sm:flex-row text-center sm:text-left items-center gap-4 mb-6">
                <div className="text-3xl">🔑</div>
                <div>
                    <h2>PassPhrase Generator</h2>
                    <p className="text-muted-foreground">
                        Generate secure passphrases with customizable options. A
                        passphrase is a sequence of words or a sentence that is
                        used to authenticate a user, often providing better
                        security than traditional passwords.
                    </p>
                </div>
            </div>
            <PassPhraseGenerator />
        </div>
    );
}

export default PassPhraseGeneratorPage;
