// Marketplace pages use root SiteChrome for header/footer
// No additional wrappers needed — keep empty
export default function MarketplaceLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}