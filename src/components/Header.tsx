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
    <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/qedit-logo.svg"
              alt="QEDIT Logo"
              width={120}
              height={40}
              className="w-28 h-auto"
              priority
            />
          </Link>
          <nav className="hidden md:flex space-x-8">
            {menuItems.map((item) => (
              <div key={item.title} className="relative group">
                {item.external ? (
                  <a
                    href={item.href}
                    className="text-gray-700 hover:text-[#38b1de] transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {item.title}
                  </a>
                ) : item.items ? (
                  <>
                    <button className="text-gray-700 hover:text-[#38b1de] transition-colors">
                      {item.title}
                    </button>
                    <div className="absolute hidden group-hover:block w-48 pt-2 left-1/2 -translate-x-1/2">
                      <div className="bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                        {item.items.map((subItem) => (
                          <Link
                            key={subItem.title}
                            href={subItem.href}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
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
                    className="text-gray-700 hover:text-[#38b1de] transition-colors"
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