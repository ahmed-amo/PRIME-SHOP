import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "@inertiajs/react";
import { Instagram, Linkedin, Twitter, Youtube } from "lucide-react";

export default function FooterV2() {
  return (
    <footer className="w-full text-black">
      <div className="container px-4 py-16 md:px-6 mx-auto border-orange">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold">PRIME SH</span>
            </div>
            <p className="text-sm text-black/90">
              Trusted in more than 100 countries & 5 million customers. Have any
              query? contact us we are here for you.
            </p>
            <div className="flex space-x-4">
              <Link
                href="#"
                className="rounded-full bg-black p-2 hover:bg-white/90"
              >
                <Twitter className="h-4 w-4 text-[#f97316]" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link
                href="#"
                className="rounded-full bg-white p-2 hover:bg-white/90"
              >
                <Instagram className="h-4 w-4 text-[#f97316]" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link
                href="#"
                className="rounded-full bg-white p-2 hover:bg-white/90"
              >
                <Linkedin className="h-4 w-4 text-[#f97316]" />
                <span className="sr-only">LinkedIn</span>
              </Link>
              <Link
                href="#"
                className="rounded-full bg-white p-2 hover:bg-white/90"
              >
                <Youtube className="h-4 w-4 text-[#f97316]" />
                <span className="sr-only">YouTube</span>
              </Link>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-bold">Get In Touch</h3>
            <div className="space-y-2 text-sm">
              <p>support@pagedone.com</p>
              <p>+91 945 658 3256</p>
              <p>61-A, Elm street, Gujarat, India.</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-2">
            <div className="space-y-4">
              <h3 className="text-lg font-bold">Quick Links</h3>
              <nav className="flex flex-col space-y-2 text-sm">
                <Link className="hover:underline" href="#">
                  Home
                </Link>
                <Link className="hover:underline" href="#">
                  FAQs
                </Link>
                <Link className="hover:underline" href="#">
                  Price Plan
                </Link>
                <Link className="hover:underline" href="#">
                  Features
                </Link>
              </nav>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-bold invisible">Links</h3>
              <nav className="flex flex-col space-y-2 text-sm">
                <Link className="hover:underline" href="#">
                  Careers
                </Link>
                <Link className="hover:underline" href="#">
                  About
                </Link>
                <Link className="hover:underline" href="#">
                  Contact
                </Link>
                <Link className="hover:underline" href="#">
                  Products
                </Link>
              </nav>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-bold">Newsletter</h3>
            <form className="space-y-2">
              <Input
                className="bg-white/10 border-white/20 placeholder:text-white/50"
                placeholder="Enter email.."
                type="email"
              />
              <Button
                className="w-full bg-white text-[#f97316] hover:bg-white/90"
                type="submit"
              >
                Subscribe
                <svg
                  className="ml-2 h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Button>
            </form>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="  mx-auto container flex flex-col items-center justify-center gap-4 py-6 text-center text-sm md:h-16 md:flex-row md:py-0">
          <div className="text-black/60 mx-auto">
            Copyright@2023 All Right Reserved Pagedone.
          </div>
        </div>
      </div>
    </footer>
  );
}
