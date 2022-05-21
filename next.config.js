/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: process.env.NODE_ENV === "production" ? "/test-gh-actions-deploy" : "",
  reactStrictMode: true,
}

module.exports = nextConfig
