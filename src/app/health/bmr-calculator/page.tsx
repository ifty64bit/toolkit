import { type Metadata } from "next";
import BMRCalculator from "./BMRCalculator";

export const metadata: Metadata = {
    title: "BMR Calculator",
    description:
        "Calculate your Basal Metabolic Rate (BMR) to understand how many calories your body needs at rest.",
    keywords: [
        "BMR Calculator",
        "Basal Metabolic Rate",
        "Health",
        "Calorie Needs",
    ],
};

function BMRCalculatorPage() {
    return (
        <div>
            <div className="flex flex-col sm:flex-row text-center sm:text-left items-center gap-4 mb-6">
                <div className="text-3xl">🔥</div>
                <div>
                    <h2>BMR Calculator</h2>
                    <p className="text-muted-foreground">
                        Calculate your Basal Metabolic Rate (BMR) to understand
                        how many calories your body needs at rest.
                    </p>
                </div>
            </div>
            <BMRCalculator />
        </div>
    );
}

export default BMRCalculatorPage;
