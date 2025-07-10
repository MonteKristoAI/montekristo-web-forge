
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import Logo from './Logo';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navigationItems = [
    { name: 'Use Cases', href: '#agents' },
    { name: 'AI Agents', href: '#protocol' },
    { name: 'Protocol', href: '#protocol' },
    { name: 'Blog', href: '#insights' },
    { name: 'Resources', href: '#contact' }
  ];

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Logo size="md" variant="default" withEffect />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-[#0d1b34] hover:text-[#ff5b5b] px-3 py-2 text-sm font-medium transition-colors duration-200"
              >
                {item.name}
              </a>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden md:flex">
            <a
              href="#strategy"
              className="bg-[#ff5b5b] hover:bg-[#ff4747] text-white px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 hover:shadow-md hover:brightness-110"
            >
              Book AI Strategy Session
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-[#0d1b34] hover:text-[#ff5b5b] hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#ff5b5b]"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div className={cn(
          "md:hidden",
          isMenuOpen ? "block" : "hidden"
        )}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
            {navigationItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-[#0d1b34] hover:text-[#ff5b5b] block px-3 py-2 text-base font-medium transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </a>
            ))}
            <a
              href="#strategy"
              className="bg-[#ff5b5b] hover:bg-[#ff4747] text-white block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 mt-4"
              onClick={() => setIsMenuOpen(false)}
            >
              Book AI Strategy Session
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
