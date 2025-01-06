import Image from 'next/image';
import Link from 'next/link';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
          <div className="col-span-1">
            <Image
              src="/qedit-logo-white.svg"
              alt="QEDIT Logo"
              width={100}
              height={35}
              className="w-24 h-auto"
              priority
            />
          </div>
          
          {/* Company Column */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-3">
              <li><Link href="/about" className="text-gray-400 hover:text-white">About</Link></li>
              <li><Link href="/careers" className="text-gray-400 hover:text-white">Careers</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-white">Contact</Link></li>
            </ul>
          </div>

          {/* Solutions Column */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Solutions</h3>
            <ul className="space-y-3">
              <li><Link href="/asset-management" className="text-gray-400 hover:text-white">Asset Management</Link></li>
              <li><Link href="/privacy-solutions" className="text-gray-400 hover:text-white">Privacy Solutions</Link></li>
              <li><Link href="/blockchain" className="text-gray-400 hover:text-white">Blockchain</Link></li>
            </ul>
          </div>

          {/* Resources Column */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-3">
              <li><Link href="/blog" className="text-gray-400 hover:text-white">Blog</Link></li>
              <li><Link href="/documentation" className="text-gray-400 hover:text-white">Documentation</Link></li>
              <li><Link href="/case-studies" className="text-gray-400 hover:text-white">Case Studies</Link></li>
            </ul>
          </div>

          {/* Legal Column */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-3">
              <li><Link href="/privacy-policy" className="text-gray-400 hover:text-white">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-gray-400 hover:text-white">Terms of Service</Link></li>
              <li><Link href="/cookies" className="text-gray-400 hover:text-white">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="flex flex-col items-center space-y-2">
              <span className="text-sm text-gray-400">© {currentYear} QEDIT</span>
              <span className="text-sm text-gray-400">All Rights Reserved</span>
              <span className="text-sm text-gray-400">Rothschild 22, Tel-Aviv - Yafo, Israel</span>
            </div>
            
            <div className="flex flex-col items-center space-y-4">
              <span className="text-sm text-gray-500">Designed And Developed By YARA</span>
              <div className="flex space-x-6">
                <a href="https://twitter.com/QED_IT" target="_blank" rel="noopener noreferrer">
                  <span className="sr-only">X (Twitter)</span>
                  {/* Add X icon */}
                </a>
                <a href="https://www.linkedin.com/company/qed-it/" target="_blank" rel="noopener noreferrer">
                  <span className="sr-only">LinkedIn</span>
                  {/* Add LinkedIn icon */}
                </a>
                <a href="https://www.facebook.com/QEDITBlockchain/" target="_blank" rel="noopener noreferrer">
                  <span className="sr-only">Facebook</span>
                  {/* Add Facebook icon */}
                </a>
                <a href="https://medium.com/qed-it" target="_blank" rel="noopener noreferrer">
                  <span className="sr-only">Medium</span>
                  {/* Add Medium icon */}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;