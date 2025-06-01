/** @type {import('next-sitemap').IConfig} */
const config = {
    siteUrl: process.env.SITE_URL || "https://toolkit-box.pages.dev",
    generateRobotsTxt: true,
};

export default config;
