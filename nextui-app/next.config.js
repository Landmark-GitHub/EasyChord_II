/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        formats: ['image/avif', 'image/webp'],
        remotePatterns: [
                {
                    protocol: 'https',
                    hostname: '**', // อนุญาตทุก hostname
                },
            ],
    },
}
module.exports = nextConfig;