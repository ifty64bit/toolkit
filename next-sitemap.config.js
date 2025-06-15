/** @type {import('next-sitemap').IConfig} */
const config = {
    siteUrl: process.env.SITE_URL || "https://tooldeck.app",
    generateRobotsTxt: true,
};

export default config;
