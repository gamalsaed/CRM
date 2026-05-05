import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

module.exports = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/dashboard",
        permanent: true,
      },
    ];
  },
};

const nextConfig: NextConfig = {
  /* config options here */
};
const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
