
import { Separator } from "@/components/ui/separator";
import Logo from "./Logo";

export const Footer = () => {
  return (
    <footer className="bg-[#081228] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-4">
            <Logo size="sm" variant="light" />
            <p className="text-gray-400 text-sm leading-relaxed">
              Precision AI agents tailored to your sales & ops stack.
            </p>
          </div>
          
          {/* Navigation Column 1 */}
          <div className="space-y-4">
            <h4 className="font-semibold text-white">Solutions</h4>
            <div className="space-y-2">
              <a 
                href="#agents" 
                className="block text-gray-400 hover:text-[#ff5b5b] transition-colors duration-200 text-sm"
              >
                Use Cases
              </a>
              <a 
                href="#protocol" 
                className="block text-gray-400 hover:text-[#ff5b5b] transition-colors duration-200 text-sm"
              >
                AI Agent Catalog
              </a>
              <a 
                href="#insights" 
                className="block text-gray-400 hover:text-[#ff5b5b] transition-colors duration-200 text-sm"
              >
                Blog
              </a>
            </div>
          </div>
          
          {/* Navigation Column 2 */}
          <div className="space-y-4">
            <h4 className="font-semibold text-white">Company</h4>
            <div className="space-y-2">
              <a 
                href="#" 
                className="block text-gray-400 hover:text-[#ff5b5b] transition-colors duration-200 text-sm"
              >
                Careers
              </a>
              <a 
                href="#faq" 
                className="block text-gray-400 hover:text-[#ff5b5b] transition-colors duration-200 text-sm"
              >
                FAQ
              </a>
            </div>
          </div>
          
          {/* Newsletter */}
          <div className="space-y-4">
            <h4 className="font-semibold text-white">Stay Updated</h4>
            <div className="space-y-3">
              <input
                type="email"
                placeholder="Enter your work email"
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#ff5b5b] focus:border-transparent"
              />
              <button className="w-full bg-[#ff5b5b] hover:bg-[#ff4747] text-white px-4 py-2 rounded text-sm font-medium transition-colors duration-200">
                Subscribe
              </button>
            </div>
          </div>
        </div>
        
        <Separator className="bg-gray-700 mb-6" />
        
        <div className="text-center">
          <p className="text-gray-400 text-sm">
            © 2025 Montekristo AI — All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
