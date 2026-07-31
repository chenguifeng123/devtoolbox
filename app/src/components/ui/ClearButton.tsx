"use client";

import { X } from "lucide-react";
import { useTranslations } from "next-intl";

interface ClearButtonProps {
  onClick: () => void;
  className?: string;
}

export default function ClearButton({ onClick, className = "" }: ClearButtonProps) {
  const t = useTranslations("common");

  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${className}`}
    >
      <X className="w-3.5 h-3.5" />
      {t("clear")}
    </button>
  );
}
