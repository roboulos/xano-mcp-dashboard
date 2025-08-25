import { FaTwitter, FaGithub, FaLinkedin, FaDiscord } from 'react-icons/fa';

const sections = [
  {
    title: 'Product',
    links: [
      { name: 'Features', href: '#features' },
      { name: 'Pricing', href: '#pricing' },
      { name: 'Documentation', href: '/docs' },
      { name: 'API Reference', href: '/api' },
      { name: 'Changelog', href: '/changelog' },
    ],
  },
  {
    title: 'Company',
    links: [
      { name: 'About', href: '/about' },
      { name: 'Blog', href: '/blog' },
      { name: 'Careers', href: '/careers' },
      { name: 'Contact', href: '/contact' },
      { name: 'Privacy', href: '/privacy' },
    ],
  },
  {
    title: 'Support',
    links: [
      { name: 'Help Center', href: '/help' },
      { name: 'Community', href: '/community' },
      { name: 'Status', href: '/status' },
      { name: 'Security', href: '/security' },
    ],
  },
  {
    title: 'Developers',
    links: [
      { name: 'GitHub', href: 'https://github.com/xano-ai-developer' },
      { name: 'Examples', href: '/examples' },
      { name: 'Tutorials', href: '/tutorials' },
      { name: 'SDKs', href: '/sdks' },
    ],
  },
];

const Footer = () => {
  return (
    <footer className="bg-background border-t">
      <div className="container py-16">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {sections.map((section, sectionIdx) => (
            <div key={sectionIdx}>
              <h3 className="mb-4 font-semibold">{section.title}</h3>
              <ul className="text-muted-foreground space-y-3 text-sm">
                {section.links.map((link, linkIdx) => (
                  <li
                    key={linkIdx}
                    className="hover:text-foreground transition-colors"
                  >
                    <a href={link.href}>{link.name}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 border-t pt-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="bg-primary flex h-8 w-8 items-center justify-center rounded-lg">
                  <span className="text-primary-foreground text-sm font-bold">
                    X
                  </span>
                </div>
                <span className="font-semibold">Xano AI Developer</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <p className="text-muted-foreground text-sm">
                Your own AI Xano developer
              </p>
              <div className="flex gap-3">
                <a
                  href="https://twitter.com/xanoaidev"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Twitter"
                >
                  <FaTwitter className="h-5 w-5" />
                </a>
                <a
                  href="https://github.com/xano-ai-developer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="GitHub"
                >
                  <FaGithub className="h-5 w-5" />
                </a>
                <a
                  href="https://linkedin.com/company/universe-mcp"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="LinkedIn"
                >
                  <FaLinkedin className="h-5 w-5" />
                </a>
                <a
                  href="https://discord.gg/universe-mcp"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Discord"
                >
                  <FaDiscord className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-muted-foreground text-xs">
              © 2025 Universe MCP. All rights reserved. Built with ❤️ for
              developers.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export { Footer };
