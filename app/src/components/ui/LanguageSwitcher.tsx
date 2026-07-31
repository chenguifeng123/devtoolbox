"use client";

import { Link, usePathname } from "@/i18n/routing";
import { useLocale } from "next-intl";

export default function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();

  const targetLocale = locale === "en" ? "zh" : "en";

  return (
    <Link
      href={pathname}
      locale={targetLocale}
      className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
    >
      {locale === "en" ? "🇨🇳 中文" : "🇺🇸 EN"}
    </Link>
  );
}
