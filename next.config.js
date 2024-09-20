/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "standalone",

    webpack: (config) => {
        // Adding alias support for "@"
        const path = require('path');
        config.resolve.alias['@'] = path.resolve(__dirname);

        return config;
    },
};

module.exports = nextConfig;

