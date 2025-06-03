import { type Metadata } from "next";
import AgeCalculator from "./AgeCalculator";

export const metadata: Metadata = {
    title: "Age & Zodiac Sign Calculator",
    description:
        "Calculate your age in years, months, and days, including total days, hours, minutes, and zodiac sign.",
    keywords: [
        "age",
        "calculator",
        "years",
        "months",
        "days",
        "zodiac",
        "sign",
        "horoscope",
    ],
};

function AgeCalculatorPage() {
    return (
        <div>
            <div className="flex flex-col sm:flex-row text-center sm:text-left items-center gap-4 mb-6">
                <div className="text-3xl">📅</div>
                <div>
                    <h2>Age & Zodiac Sign Calculator</h2>
                    <p className="text-muted-foreground">
                        Calculate your age in years, months, and days.
                    </p>
                </div>
            </div>

            <AgeCalculator />
        </div>
    );
}

export default AgeCalculatorPage;
