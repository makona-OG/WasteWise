import { Mail, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-lg font-semibold mb-4">WasteFix</h3>
          <p className="text-gray-400">
            Smart waste management solutions for a cleaner future.
          </p>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <Link to="/" className="text-gray-400 hover:text-white">
                Home
              </Link>
            </li>
            <li>
              <Link to="/contact" className="text-gray-400 hover:text-white">
                Contact Us
              </Link>
            </li>
            <li>
              <Link to="/report" className="text-gray-400 hover:text-white">
                Report Issue
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4">Contact</h3>
          <div className="space-y-2 text-gray-400">
            <p className="flex items-center gap-2">
              <Mail size={16} />
              <a href="mailto:info@wastefix.com" className="hover:text-white">
                info@wastefix.com
              </a>
            </p>
            <p className="flex items-center gap-2">
              <Phone size={16} />
              <a href="tel:+254712961615" className="hover:text-white">
                +254 712 961 615
              </a>
            </p>
            <p className="flex items-center gap-2">
              <MapPin size={16} />
              Nairobi, Kenya
            </p>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4 text-center text-gray-400">
          © {new Date().getFullYear()} WasteFix. All rights reserved.
        </div>
      </div>
    </footer>
  );
}