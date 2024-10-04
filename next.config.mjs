/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        esmExternals: 'loose',
        serverComponentsExternalPackages: ['axe-html-reporter']
    },
};

export default nextConfig;
