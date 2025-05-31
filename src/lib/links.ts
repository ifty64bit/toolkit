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
        href: "/bmi-calculator",
    },
];

export default links;

export type LinkType = {
    title: string;
    description: string;
    tag: string;
    icon: string;
    href: string;
};
