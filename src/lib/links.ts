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
];

export default links;

export type LinkType = {
    title: string;
    description: string;
    tag: "Health" | "Conversion" | "Date" | "Other";
    icon: string;
    href: string;
};
