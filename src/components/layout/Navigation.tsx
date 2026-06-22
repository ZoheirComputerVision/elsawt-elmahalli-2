"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";

const navItems = [
  { label: "الرئيسية", href: "/" },
  { label: "تيارت", href: "/tiaret" },
  { label: "تيسمسيلت", href: "/tissemsilt" },
  { label: "قصر الشلالة", href: "/ksar-chellala" },
  { label: "اقتصاد", href: "/economy" },
  { label: "رياضة", href: "/sports" },
  { label: "ثقافة", href: "/culture" },
  { label: "رأي", href: "/opinion" },
];

export default function Navigation() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-navy text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-12">
          <button
            className="md:hidden p-2 hover:bg-navy-light rounded"
            onClick={() => setOpen(!open)}
            aria-label="القائمة"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <ul className="hidden md:flex items-center gap-1 h-full">
            {navItems.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="px-4 h-full flex items-center text-sm font-medium hover:bg-navy-light transition-colors relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-gold after:scale-x-0 hover:after:scale-x-100 after:transition-transform"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="text-xs text-gold/80 font-semibold hidden md:block">
            العدد الرقمي
          </div>
        </div>

        {open && (
          <div className="md:hidden border-t border-navy-light pb-3 pt-2">
            <ul className="flex flex-col gap-1">
              {navItems.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="block px-4 py-2 text-sm hover:bg-navy-light rounded"
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
}
