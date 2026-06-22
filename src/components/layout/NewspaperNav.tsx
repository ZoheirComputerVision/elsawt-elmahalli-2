"use client";

import { useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";

const navTree = [
  { label: "الرئيسية", href: "/", children: null },
  {
    label: "محليات",
    href: "/local",
    children: [
      { label: "تيارت", href: "/tiaret" },
      { label: "تيسمسيلت", href: "/tissemsilt" },
      { label: "قصر الشلالة", href: "/ksar-chellala" },
      { label: "البلديات", href: "/municipalities" },
    ],
  },
  {
    label: "الوطن",
    href: "/nation",
    children: [
      { label: "سياسة", href: "/politics" },
      { label: "مجتمع", href: "/society" },
      { label: "تنمية", href: "/development" },
      { label: "مؤسسات", href: "/institutions" },
    ],
  },
  {
    label: "العالم",
    href: "/world",
    children: [
      { label: "عربي", href: "/arab" },
      { label: "إفريقيا", href: "/africa" },
      { label: "دولي", href: "/international" },
    ],
  },
  {
    label: "اقتصاد",
    href: "/economy",
    children: [
      { label: "استثمار", href: "/investment" },
      { label: "فلاحة", href: "/agriculture" },
      { label: "صناعة", href: "/industry" },
      { label: "تشغيل", href: "/employment" },
      { label: "دليل اقتصادي", href: "/directory" },
    ],
  },
  {
    label: "رأي",
    href: "/opinion",
    children: [
      { label: "افتتاحيات", href: "/editorials" },
      { label: "مقالات رأي", href: "/opinions" },
      { label: "تحليلات", href: "/analysis" },
    ],
  },
  {
    label: "متخصصة",
    href: "/specialized",
    children: [
      { label: "رياضة", href: "/sports" },
      { label: "ثقافة", href: "/culture" },
      { label: "تعليم", href: "/education" },
      { label: "صحة", href: "/health" },
      { label: "تكنولوجيا", href: "/tech" },
      { label: "بيئة", href: "/environment" },
    ],
  },
];

function DesktopNavItem({ item }: { item: (typeof navTree)[number] }) {
  const [hover, setHover] = useState(false);

  return (
    <li
      className="h-full relative"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <a
        href={item.href}
        className={`px-3.5 h-full flex items-center gap-1 text-[13px] font-medium tracking-wide hover:bg-navy-light transition-colors relative
          ${!item.children && item.href === "/" ? "bg-gold text-navy font-bold" : ""}
          after:absolute after:bottom-0 after:left-2 after:right-2 after:h-0.5 after:bg-gold after:scale-x-0 hover:after:scale-x-100 after:transition-transform`}
      >
        {item.label}
        {item.children && <ChevronDown className="w-3 h-3" />}
      </a>

      {item.children && hover && (
        <div className="absolute top-full right-0 bg-navy border-t-2 border-gold shadow-xl z-50 min-w-[160px]">
          {item.children.map((child) => (
            <a
              key={child.href}
              href={child.href}
              className="block px-4 py-2.5 text-sm text-white hover:bg-navy-light hover:text-gold transition-colors border-b border-navy-light last:border-0 whitespace-nowrap"
            >
              {child.label}
            </a>
          ))}
        </div>
      )}
    </li>
  );
}

function MobileAccordion({ item, depth = 0 }: { item: (typeof navTree)[number]; depth?: number }) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <a
        href={item.href}
        onClick={(e) => {
          if (item.children) { e.preventDefault(); setOpen(!open); }
        }}
        className={`flex items-center justify-between px-4 py-2.5 text-sm hover:bg-navy-light rounded ${depth > 0 ? "pr-8 text-[13px] text-gray-300" : ""}`}
      >
        {item.label}
        {item.children && (
          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
        )}
      </a>
      {open && item.children && (
        <div className="border-r-2 border-gold/30 mr-4">
          {item.children.map((child) => (
            <MobileAccordion key={child.href} item={{ ...child, children: null }} depth={1} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function NewspaperNav() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-navy text-white sticky top-0 z-50 shadow-lg shadow-black/10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-11">
          <button
            className="md:hidden p-2 hover:bg-navy-light rounded"
            onClick={() => setOpen(!open)}
            aria-label="القائمة"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <ul className="hidden md:flex items-center h-full gap-0">
            {navTree.map((item) => (
              <DesktopNavItem key={item.href} item={item} />
            ))}
          </ul>

          <span className="text-[10px] text-gold/60 hidden md:block">العدد الرقمي • 2026</span>
        </div>

        {open && (
          <div className="md:hidden border-t border-navy-light pb-3 pt-2">
            {navTree.map((item) => (
              <MobileAccordion key={item.href} item={item} />
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
