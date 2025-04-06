'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';

const Header = () => {
  const [isMenuOpen,setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string>('');

  const menuItems = [
    {
      title: 'ZKProof',
      href: 'https://zkproof.org',
      external: true
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

  useEffect(() => {
    if (!isMenuOpen) {
      setOpenDropdown('');
    }
  }, [isMenuOpen]);

  return (
    <header className="fixed top-0 left-0 right-0 bg-[#1e2125] backdrop-blur-md z-50">
      <div className="mx-4 sm:mx-6 lg:mx-[80px] px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-20 md:h-32">
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/images/logos/qedit-logo-white.svg"
              alt="QEDIT Logo"
              width={120}
              height={40}
              className="w-28 md:w-36 h-auto"
              priority
            />
          </Link>
          
          {/* Hamburger Menu Button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden ml-auto p-2"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              />
            </svg>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8 ml-auto">
            {menuItems.map((item) => (
              <div key={item.title} className="relative group">
                {item.external ? (
                  <a
                    href={item.href}
                    className="text-white hover:text-[#38b1df] transition-colors text-xl"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {item.title}
                  </a>
                ) : item.items ? (
                  <>
                    <button className="text-white hover:text-[#38b1df] transition-colors inline-flex items-center text-xl">
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
                            className="block px-4 py-2 text-xl text-white hover:text-[#38b1df] hover:bg-[#2a2e33]"
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
                    className={`transition-colors text-xl ${
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

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="absolute top-full left-0 right-0 bg-[#1e2125] md:hidden min-h-[calc(100vh-5rem)]">
              <nav className="flex flex-col divide-y divide-gray-700">
                {menuItems.map((item) => (
                  <div key={item.title} className="py-3 px-6">
                    {item.external ? (
                      <a
                        href={item.href}
                        className="text-white hover:text-[#38b1df] transition-colors text-xl"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {item.title}
                      </a>
                    ) : item.items ? (
                      <div className="space-y-3">
                        <button 
                          className="flex items-center justify-between w-full text-white hover:text-[#38b1df] transition-colors text-xl"
                          onClick={() => {
                            setOpenDropdown(openDropdown === item.title ? '' : item.title);
                          }}
                        >
                          <span>{item.title}</span>
                          <svg
                            className={`w-4 h-4 text-[#38b1df] transition-transform ${
                              openDropdown === item.title ? 'rotate-90' : ''
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </button>
                        {openDropdown === item.title && (
                          <div className="pl-4 space-y-3">
                            {item.items.map((subItem) => (
                              <Link
                                key={subItem.title}
                                href={subItem.href}
                                className="block text-gray-400 hover:text-[#38b1df] transition-colors text-xl"
                                onClick={() => setIsMenuOpen(false)}
                              >
                                {subItem.title}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <Link
                        href={item.href}
                        className={`block transition-colors text-xl ${
                          item.title === 'Contact'
                            ? 'inline-block border-2 border-[#38b1df] rounded-full px-8 py-2 text-white hover:bg-[#38b1df] hover:text-white text-center mt-2'
                            : 'text-white hover:text-[#38b1df]'
                        }`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {item.title}
                      </Link>
                    )}
                  </div>
                ))}
              </nav>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;