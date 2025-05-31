import { type Metadata } from "next";
import BMICalculator from "./BMICalculator";

export const metadata: Metadata = {
    title: "BMI Calculator",
    description:
        "Calculate your Body Mass Index (BMI) to assess your body weight relative to your height.",
    keywords: [
        "BMI Calculator",
        "Body Mass Index",
        "Health",
        "Weight Management",
    ],
};

function BMICalculatorPage() {
    return (
        <div>
            <div className="flex flex-col sm:flex-row text-center sm:text-left items-center gap-4 mb-6">
                <div className="text-3xl">🏋️‍♂️</div>
                <div>
                    <h2>BMI Calculator</h2>
                    <p className="text-muted-foreground">
                        Calculate your Body Mass Index (BMI) to assess your body
                        weight relative to your height.
                    </p>
                </div>
            </div>

            <BMICalculator />
        </div>
    );
}

export default BMICalculatorPage;
