import AgeCalculator from "./AgeCalculator";

function AgeCalculatorPage() {
    return (
        <div>
            <div className="flex flex-col sm:flex-row text-center sm:text-left items-center gap-4 mb-6">
                <div className="text-3xl">📅</div>
                <div>
                    <h2>Age Calculator</h2>
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
