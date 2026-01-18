/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  // Allow importing from parent directory (the package source)
  transpilePackages: ['@benji/feedback-tool'],
};

module.exports = nextConfig;
