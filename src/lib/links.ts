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
];

export default links;

export type LinkType = {
    title: string;
    description: string;
    tag: "Health" | "Conversion" | "Other";
    icon: string;
    href: string;
};
