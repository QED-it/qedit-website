import Image from 'next/image';
import Link from 'next/link';

const Header = () => {
  const menuItems = [
    {
      title: 'ZKProof',
      href: 'https://zkproof.org',
      external: true
    },
    {
      title: 'Product',
      items: [
        { title: 'Overview', href: '/product-overview' },
        { title: 'Asset Transfer', href: '/asset-transfer' },
        { title: 'Stable Coin', href: '/stable-coin' },
        { title: 'TLS Notary', href: '/tls-notary' },
        { title: 'Privacy for Blockchain', href: '/privacy-on-blockchains' },
        { title: 'Custom Services', href: '/custom-services' },
        { title: 'FAQ', href: '/faq' }
      ]
    },
    {
      title: 'Company',
      items: [
        { title: 'About Us', href: '/about-us' },
        { title: 'Careers', href: '/careers' },
        { title: 'Partners', href: '/partners' },
        { title: 'Security', href: '/security' }
      ]
    },
    {
      title: 'Media',
      items: [
        { title: 'News', href: '/news' },
        { title: 'Blog', href: '/blog' }
      ]
    },
    {
      title: 'Contact',
      href: '/contact-us'
    }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 bg-[#1e2125] backdrop-blur-md z-50">
      <div className="mx-4 sm:mx-6 lg:mx-[80px] px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-20">
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/images/qedit-logo.svg"
              alt="QEDIT Logo"
              width={120}
              height={40}
              className="w-28 h-auto"
              priority
            />
          </Link>
          <nav className="hidden md:flex space-x-8 ml-auto">
            {menuItems.map((item) => (
              <div key={item.title} className="relative group">
                {item.external ? (
                  <a
                    href={item.href}
                    className="text-white hover:text-[#38b1df] transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {item.title}
                  </a>
                ) : item.items ? (
                  <>
                    <button className="text-white hover:text-[#38b1df] transition-colors inline-flex items-center">
                      {item.title}
                      <svg
                        className="ml-1 w-4 h-4 text-[#38b1df]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                    <div className="absolute hidden group-hover:block w-48 pt-2 left-1/2 -translate-x-1/2">
                      <div className="bg-[#1e2125] rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                        {item.items.map((subItem) => (
                          <Link
                            key={subItem.title}
                            href={subItem.href}
                            className="block px-4 py-2 text-sm text-white hover:text-[#38b1df] hover:bg-[#2a2e33]"
                          >
                            {subItem.title}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <Link
                    href={item.href}
                    className={`transition-colors ${
                      item.title === 'Contact' 
                        ? 'border-2 border-[#38b1df] rounded-full px-6 py-2 text-white hover:bg-[#38b1df] hover:text-white'
                        : 'text-white hover:text-[#38b1df]'
                    }`}
                  >
                    {item.title}
                  </Link>
                )}
              </div>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;