import {
  FaAndroid,
  FaApple,
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaRedditAlien,
  FaTwitter,
} from 'react-icons/fa';

const sections = [
  {
    title: 'Product',
    links: [
      { name: 'Overview', href: '#' },
      { name: 'Pricing', href: '#' },
      { name: 'Marketplace', href: '#' },
      { name: 'Features', href: '#' },
      { name: 'Integrations', href: '#' },
      { name: 'Pricing', href: '#' },
    ],
  },
  {
    title: 'Company',
    links: [
      { name: 'About', href: '#' },
      { name: 'Team', href: '#' },
      { name: 'Blog', href: '#' },
      { name: 'Careers', href: '#' },
      { name: 'Contact', href: '#' },
      { name: 'Privacy', href: '#' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { name: 'Help', href: '#' },
      { name: 'Sales', href: '#' },
      { name: 'Advertise', href: '#' },
    ],
  },
  {
    title: 'Social',
    links: [
      { name: 'Twitter', href: '#' },
      { name: 'Instagram', href: '#' },
      { name: 'LinkedIn', href: '#' },
    ],
  },
];

const Footer5 = () => {
  return (
    <section className="py-32">
      <div className="container">
        <footer>
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
            {sections.map((section, sectionIdx) => (
              <div key={sectionIdx}>
                <h3 className="mb-4 font-bold">{section.title}</h3>
                <ul className="text-muted-foreground space-y-4">
                  {section.links.map((link, linkIdx) => (
                    <li
                      key={linkIdx}
                      className="hover:text-primary font-medium"
                    >
                      <a href={link.href}>{link.name}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-10 gap-10">
            <div className="grid gap-8 lg:grid-cols-4 lg:flex-row">
              <div className="col-span-3">
                <p className="mb-3 font-bold">Follow us</p>
                <ul className="text-muted-foreground flex items-center gap-2">
                  <li className="font-medium">
                    <a href="#">
                      <span className="bg-muted hover:text-primary flex size-12 items-center justify-center rounded-full transition-colors">
                        <FaFacebook className="size-6" />
                      </span>
                    </a>
                  </li>
                  <li className="font-medium">
                    <a href="#">
                      <span className="bg-muted hover:text-primary flex size-12 items-center justify-center rounded-full transition-colors">
                        <FaRedditAlien className="size-6" />
                      </span>
                    </a>
                  </li>
                  <li className="font-medium">
                    <a href="#">
                      <span className="bg-muted hover:text-primary flex size-12 items-center justify-center rounded-full transition-colors">
                        <FaTwitter className="size-6" />
                      </span>
                    </a>
                  </li>
                  <li className="font-medium">
                    <a href="#">
                      <span className="bg-muted hover:text-primary flex size-12 items-center justify-center rounded-full transition-colors">
                        <FaInstagram className="size-6" />
                      </span>
                    </a>
                  </li>
                  <li className="font-medium">
                    <a href="#">
                      <span className="bg-muted hover:text-primary flex size-12 items-center justify-center rounded-full transition-colors">
                        <FaLinkedin className="size-6" />
                      </span>
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <p className="mb-3 font-bold">Mobile App</p>
                <ul className="text-muted-foreground flex items-center gap-2">
                  <li className="font-medium">
                    <a href="#">
                      <span className="bg-muted hover:text-primary flex size-12 items-center justify-center rounded-full transition-colors">
                        <FaAndroid className="size-6" />
                      </span>
                    </a>
                  </li>
                  <li className="font-medium">
                    <a href="#">
                      <span className="bg-muted hover:text-primary flex size-12 items-center justify-center rounded-full transition-colors">
                        <FaApple className="size-6" />
                      </span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-24 border-t pt-8">
            <p className="text-muted-foreground text-center text-sm font-medium">
              © 2024 Shadcnblocks.com. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </section>
  );
};

export { Footer5 };
