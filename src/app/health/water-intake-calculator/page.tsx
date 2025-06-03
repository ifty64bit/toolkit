import { type Metadata } from "next";
import WaterIntakeCalculator from "./WaterIntakeCalculator";

export const metadata: Metadata = {
    title: "Water Intake Calculator",
    description:
        "Calculate your daily water intake needs based on your lifestyle and activity level.",
    keywords: [
        "water",
        "intake",
        "calculator",
        "hydration",
        "health",
        "wellness",
        "daily water intake",
        "activity level",
    ],
};

function WaterIntakeCalculatorPage() {
    return (
        <div>
            <div className="flex flex-col sm:flex-row text-center sm:text-left items-center gap-4 mb-6">
                <div className="text-3xl">💧</div>
                <div>
                    <h2>Water Intake Calculator</h2>
                    <p className="text-muted-foreground">
                        Calculate your daily water intake needs based on your
                        lifestyle and activity level.
                    </p>
                </div>
            </div>
            <WaterIntakeCalculator />
        </div>
    );
}

export default WaterIntakeCalculatorPage;
