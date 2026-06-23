"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { LogIn } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("البريد الإلكتروني أو كلمة المرور غير صحيحة");
      return;
    }

    router.push("/admin");
    router.refresh();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50" dir="rtl">
      <div className="w-full max-w-sm mx-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-navy">الصوت المحلي</h1>
          <p className="text-sm text-muted-foreground mt-1">تسجيل الدخول إلى لوحة التحكم</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-sm p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-sm px-4 py-2 text-xs text-red-700">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-navy mb-1">البريد الإلكتروني</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@thelocalecho.dz"
              required
              className="w-full border border-gray-200 rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-gold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-navy mb-1">كلمة المرور</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full border border-gray-200 rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-gold"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-navy hover:bg-navy-light text-white font-bold px-4 py-2.5 rounded-sm text-sm transition-colors disabled:opacity-50 cursor-pointer"
          >
            <LogIn className="w-4 h-4" />
            {loading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
          </button>
        </form>

        <p className="text-center text-[10px] text-muted-foreground mt-6">
          منصة إعلامية جهوية — الصوت المحلي
        </p>
      </div>
    </div>
  );
}
