/** @type {import('next').NextConfig} */
const nextConfig = {
  // Github Pages に host された時の url がサブディレクトリ構造となるため 
  basePath: process.env.NODE_ENV === "production" ? "/test-gh-actions-deploy" : "",
  reactStrictMode: true,
}

module.exports = nextConfig
