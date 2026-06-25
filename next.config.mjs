/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Let the sites/[...slug] handler serve directory URLs (with trailing slash)
  // directly, so multi-file sites' relative asset links resolve correctly
  // instead of being 308-redirected to the slashless path.
  skipTrailingSlashRedirect: true,
};

export default nextConfig;

