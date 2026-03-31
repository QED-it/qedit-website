import Image from 'next/image';
import Link from 'next/link';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-[#1e2125] text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center md:justify-start mb-8 gap-8 items-center">
          <Image
            src="/images/logos/qedit-logo-white.svg"
            alt="QEDIT Logo"
            width={100}
            height={35}
            className="w-24 h-auto"
            priority
          />
          <a
            href="https://financialprivacy.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 opacity-70 hover:opacity-100 transition-opacity"
          >
            <Image
              src="/images/logos/financial-privacy-inc-logo.png"
              alt="Financial Privacy Inc."
              width={28}
              height={28}
              className="w-7 h-7 object-contain"
            />
            <span className="text-sm text-gray-400">Financial Privacy Inc.</span>
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-4 md:mb-8">
          <div className="col-span-1 hidden md:block">
            <h3 className="text-lg font-semibold mb-4">Product</h3>
            <ul className="space-y-3">
              <li><Link href="/product-overview" className="text-gray-400 hover:text-white">Overview</Link></li>
              <li><Link href="/privacy-on-blockchains" className="text-gray-400 hover:text-white">Privacy on Blockchains</Link></li>
              <li><Link href="/faq" className="text-gray-400 hover:text-white">FAQ</Link></li>
            </ul>
          </div>
          
          <div className="col-span-1 hidden md:block">
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-3">
              <li><Link href="/about-us" className="text-gray-400 hover:text-white">About</Link></li>
              <li><Link href="/careers" className="text-gray-400 hover:text-white">Careers</Link></li>
              <li><Link href="/partners" className="text-gray-400 hover:text-white">Partners</Link></li>
              <li><Link href="/security" className="text-gray-400 hover:text-white">Security</Link></li>
            </ul>
          </div>

          <div className="col-span-1 hidden md:block">
            <h3 className="text-lg font-semibold mb-4">Media</h3>
            <ul className="space-y-3">
              <li><Link href="/news" className="text-gray-400 hover:text-white">News</Link></li>
              <li><Link href="/blog" className="text-gray-400 hover:text-white">Blog</Link></li>
            </ul>
          </div>

          <div className="col-span-1 hidden md:block">
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-3">
              <li><Link href="/contact-us" className="text-gray-400 hover:text-white">Contact Us</Link></li>
            </ul>
          </div>

          <div className="col-span-1 hidden md:block">
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-3">
              <li><Link href="/privacy-policy" className="text-gray-400 hover:text-white">Privacy Policy</Link></li>
              {/* <li><Link href="/terms" className="text-gray-400 hover:text-white">Terms of Service</Link></li>
              <li><Link href="/cookies" className="text-gray-400 hover:text-white">Cookie Policy</Link></li> */}
            </ul>
          </div>
        </div>
        
        <div className="border-t border-[#38b1df] pt-8">
          <div className="flex flex-col md:flex-row md:justify-between items-center">
            <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center md:space-x-2">
                <span className="text-sm text-gray-400">© {currentYear} QEDIT. All Rights Reserved</span>
                <span className="hidden md:inline text-gray-400">|</span>
                <span className="text-sm text-gray-400">Rothschild 22, Tel-Aviv - Yafo, Israel</span>
                <span className="hidden md:inline text-gray-400">|</span>
                <span className="text-sm text-gray-500">Designed And Developed By YARA</span>
              </div>
            </div>

            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="https://x.com/qeditzkp" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                <span className="sr-only">X (Twitter)</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M13.6823 10.6218L20.2391 3H18.6854L12.9921 9.67068L8.44486 3H3.2002L10.0765 13.0074L3.2002 21H4.75404L10.7663 14.0185L15.5685 21H20.8131L13.6819 10.6218H13.6823ZM11.5541 13.0956L10.8574 12.0991L5.31391 4.16971H7.70053L12.1742 10.5689L12.8709 11.5655L18.6861 19.8835H16.2995L11.5541 13.096V13.0956Z" />
                </svg>
              </a>
              <a href="https://www.linkedin.com/company/qedit" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                <span className="sr-only">LinkedIn</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              <a href="https://www.facebook.com/qeditzkp/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                <span className="sr-only">Facebook</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="https://medium.com/qed-it" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                <span className="sr-only">Medium</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;