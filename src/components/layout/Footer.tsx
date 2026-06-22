export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-navy text-white mt-auto">
      {/* Top branding bar — single logo occurrence */}
      <div className="border-b border-navy-light">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-center md:justify-start gap-3">
          <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center text-gold font-black text-lg shrink-0">
            ص
          </div>
          <div>
            <p className="font-black text-lg leading-none text-white">الصوت المحلي</p>
            <p className="text-[11px] text-gold/70 mt-0.5 tracking-wide">
              اهتمام محلي ... التزام وطني
            </p>
          </div>
        </div>
      </div>

      {/* 6-column link grid — RTL order */}
      <div className="max-w-7xl mx-auto px-4 py-5">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-6">
          {/* Column 1 — عن المنصة (was duplicate logo) */}
          <div>
            <h4 className="text-xs font-bold text-gold tracking-wider mb-2">عن المنصة</h4>
            <ul className="space-y-1.5">
              {["من نحن", "هيئة التحرير", "سياسة النشر", "اتصل بنا"].map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm text-gray-400 hover:text-gold transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2 — الأقسام */}
          <div>
            <h4 className="text-xs font-bold text-gold tracking-wider mb-2">الأقسام</h4>
            <ul className="space-y-1.5">
              {["محليات", "الوطن", "العالم", "اقتصاد", "رأي", "متخصصة"].map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm text-gray-400 hover:text-gold transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 — المناطق */}
          <div>
            <h4 className="text-xs font-bold text-gold tracking-wider mb-2">المناطق</h4>
            <ul className="space-y-1.5">
              {["تيارت", "تيسمسيلت", "قصر الشلالة"].map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm text-gray-400 hover:text-gold transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 — الخدمات */}
          <div>
            <h4 className="text-xs font-bold text-gold tracking-wider mb-2">الخدمات</h4>
            <ul className="space-y-1.5">
              {["الدليل الاقتصادي", "الإعلانات", "أعلن معنا"].map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm text-gray-400 hover:text-gold transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 5 — الروابط القانونية */}
          <div>
            <h4 className="text-xs font-bold text-gold tracking-wider mb-2">الروابط القانونية</h4>
            <ul className="space-y-1.5">
              {["سياسة الخصوصية", "شروط الاستخدام"].map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm text-gray-400 hover:text-gold transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 6 — تابعنا */}
          <div>
            <h4 className="text-xs font-bold text-gold tracking-wider mb-2">تابعنا</h4>
            <div className="flex items-center gap-2">
              <a href="#" className="w-8 h-8 rounded-lg bg-navy-light flex items-center justify-center hover:bg-gold transition-colors text-gray-400 hover:text-navy" aria-label="فيسبوك">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href="#" className="w-8 h-8 rounded-lg bg-navy-light flex items-center justify-center hover:bg-gold transition-colors text-gray-400 hover:text-navy" aria-label="إكس">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="#" className="w-8 h-8 rounded-lg bg-navy-light flex items-center justify-center hover:bg-gold transition-colors text-gray-400 hover:text-navy" aria-label="يوتيوب">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
              <a href="#" className="w-8 h-8 rounded-lg bg-navy-light flex items-center justify-center hover:bg-gold transition-colors text-gray-400 hover:text-navy" aria-label="انستغرام">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" strokeWidth="1.5" /><circle cx="12" cy="12" r="5" strokeWidth="1.5" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" /></svg>
              </a>
              <a href="#" className="w-8 h-8 rounded-lg bg-navy-light flex items-center justify-center hover:bg-gold transition-colors text-gray-400 hover:text-navy" aria-label="تيلغرام">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-navy-light">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-gray-500">
          <p>© {year} الصوت المحلي. جميع الحقوق محفوظة.</p>
          <div className="flex items-center gap-3">
            <a href="#" className="hover:text-gold transition-colors">RSS</a>
            <span className="w-px h-3 bg-navy-light" />
            <a href="#" className="hover:text-gold transition-colors">النسخة الورقية</a>
            <span className="w-px h-3 bg-navy-light" />
            <a href="#" className="hover:text-gold transition-colors">تطبيق الجوال</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
