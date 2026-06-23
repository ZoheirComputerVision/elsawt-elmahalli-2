"use client";

import { useState } from "react";

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <h1 className="text-xl font-bold text-navy mb-6">الإعدادات</h1>

      <div className="space-y-4">
        <div className="bg-white border border-gray-200 rounded-sm p-4">
          <h2 className="text-sm font-bold text-navy mb-3">إعدادات الموقع</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">اسم الموقع</label>
              <input defaultValue="الصوت المحلي" className="w-full border border-gray-200 rounded-sm px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">الوصف</label>
              <input defaultValue="منصة إعلامية جهوية" className="w-full border border-gray-200 rounded-sm px-3 py-2 text-sm" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-sm p-4">
          <h2 className="text-sm font-bold text-navy mb-3">إعدادات النشر</h2>
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" defaultChecked /> النشر التلقائي بعد الموافقة
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" defaultChecked /> إرسال إشعارات للمراسلين
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" /> تفعيل نظام الموافقات المتعددة
            </label>
          </div>
        </div>

        <div className="flex gap-2">
          <button onClick={handleSave} className="bg-navy text-white px-6 py-2 rounded-sm text-sm font-bold hover:bg-navy-light transition-colors cursor-pointer">
            حفظ الإعدادات
          </button>
          {saved && <span className="text-green-600 text-xs font-bold self-center">✅ تم الحفظ</span>}
        </div>
      </div>
    </div>
  );
}
