/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["img.youtube.com"],
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push("@sparticuz/chromium");
    }
    return config;
  },
  serverExternalPackages: ["puppeteer-core", "@sparticuz/chromium"],
};

module.exports = nextConfig;
