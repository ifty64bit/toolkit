const links: LinkType[] = [
    // {
    //     title: "Unit Conversion",
    //     description: "Convert between different units of measurement",
    //     tag: "Conversion",
    //     icon: "⚖️",
    //     href: "/unit-conversion",
    // },
    {
        title: "BMI Calculator",
        description: "Calculate your Body Mass Index",
        tag: "Health",
        icon: "🏋️‍♂️",
        href: "health/bmi-calculator",
    },
    {
        title: "BMR Calculator",
        description: "Calculate your Basal Metabolic Rate",
        tag: "Health",
        icon: "🔥",
        href: "health/bmr-calculator",
    },
    {
        title: "Age Calculator",
        description: "Calculate your age in years, months, and days",
        tag: "Date",
        icon: "📅",
        href: "date/age-calculator",
    },
    {
        title: "Water Intake Calculator",
        description: "Calculate your daily water intake",
        tag: "Health",
        icon: "💧",
        href: "health/water-intake-calculator",
    },
    {
        title: "Password Generator",
        description: "Generate secure passwords",
        tag: "Security",
        icon: "🔒",
        href: "security/password-generator",
    },
    {
        title: "Password Strength Checker",
        description: "Check the strength of your passwords",
        tag: "Security",
        icon: "🔍",
        href: "security/password-strength-checker",
    },
];

export default links;

export type LinkType = {
    title: string;
    description: string;
    tag: "Health" | "Conversion" | "Date" | "Security" | "Other";
    icon: string;
    href: string;
};
