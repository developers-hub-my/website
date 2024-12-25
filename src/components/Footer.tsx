import React from 'react';
import { Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#home" className="hover:text-blue-400 transition-colors">Home</a></li>
              <li><a href="#about-us" className="hover:text-blue-400 transition-colors">About Us</a></li>
              <li><a href="#services" className="hover:text-blue-400 transition-colors">Services</a></li>
              <li><a href="#programs" className="hover:text-blue-400 transition-colors">Programs</a></li>
              <li>
                <a 
                  href="https://blog.devhub.my" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-blue-400 transition-colors"
                >
                  Blog
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              <li>Education and Training</li>
              <li>Software Development</li>
              <li>IT Consultation</li>
              <li>Business Solutions</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-2">
              <li>contact@devhub.my</li>
              <li>+60 3-1234 5678</li>
              <li>Level 30, Menara Prestige</li>
              <li>50450 Kuala Lumpur</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-blue-400 transition-colors">
                <Facebook className="w-6 h-6" />
              </a>
              <a href="#" className="hover:text-blue-400 transition-colors">
                <Twitter className="w-6 h-6" />
              </a>
              <a href="#" className="hover:text-blue-400 transition-colors">
                <Linkedin className="w-6 h-6" />
              </a>
              <a href="#" className="hover:text-blue-400 transition-colors">
                <Instagram className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-sm text-gray-400">
          <p>© {new Date().getFullYear()} Developers Hub Sdn. Bhd. All rights reserved.</p>
          <p className="mt-2">Company Registration No.: 1376248V | State: Wilayah Persekutuan</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;