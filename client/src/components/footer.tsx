import { Link } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Footer() {
  return (
    <footer className="bg-[#2C3E50] text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <i className="ri-quill-pen-line text-[#FFE66D] text-2xl"></i>
              <h3 className="font-heading text-xl font-bold">StoryCanvas</h3>
            </div>
            <p className="font-body text-gray-300 text-sm">
              Transforming imagination into illustrated stories with the power of AI.
            </p>
          </div>
          
          <div>
            <h4 className="font-heading text-lg font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 font-body text-gray-300">
              <li>
                <Link href="/">
                  <a className="hover:text-[#FFE66D] transition-colors">Home</a>
                </Link>
              </li>
              <li>
                <Link href="/">
                  <a className="hover:text-[#FFE66D] transition-colors">Create Story</a>
                </Link>
              </li>
              <li>
                <Link href="/examples">
                  <a className="hover:text-[#FFE66D] transition-colors">Examples</a>
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-[#FFE66D] transition-colors">About</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-heading text-lg font-bold mb-4">Legal</h4>
            <ul className="space-y-2 font-body text-gray-300">
              <li>
                <a href="#" className="hover:text-[#FFE66D] transition-colors">Terms of Service</a>
              </li>
              <li>
                <a href="#" className="hover:text-[#FFE66D] transition-colors">Privacy Policy</a>
              </li>
              <li>
                <a href="#" className="hover:text-[#FFE66D] transition-colors">Cookie Policy</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-heading text-lg font-bold mb-4">Connect</h4>
            <div className="flex space-x-4 mb-4">
              <a href="#" className="text-gray-300 hover:text-[#FFE66D] transition-colors">
                <i className="ri-twitter-fill text-xl"></i>
              </a>
              <a href="#" className="text-gray-300 hover:text-[#FFE66D] transition-colors">
                <i className="ri-instagram-fill text-xl"></i>
              </a>
              <a href="#" className="text-gray-300 hover:text-[#FFE66D] transition-colors">
                <i className="ri-facebook-fill text-xl"></i>
              </a>
              <a href="#" className="text-gray-300 hover:text-[#FFE66D] transition-colors">
                <i className="ri-pinterest-fill text-xl"></i>
              </a>
            </div>
            <p className="font-body text-gray-300 text-sm">
              Subscribe to our newsletter for updates and new features!
            </p>
            <div className="mt-2 flex">
              <Input 
                type="email" 
                placeholder="Your email" 
                className="rounded-r-none bg-white text-foreground" 
              />
              <Button variant="outline" className="bg-[#FFE66D] text-foreground rounded-l-none hover:bg-[#FFE66D]/80">
                <i className="ri-send-plane-fill"></i>
              </Button>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400 text-sm font-body">
          <p>&copy; {new Date().getFullYear()} StoryCanvas. All rights reserved. Unleash your creativity with AI-powered storytelling.</p>
        </div>
      </div>
    </footer>
  );
}
