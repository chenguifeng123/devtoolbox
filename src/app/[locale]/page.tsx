import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { tools } from "@/lib/constants";
import {
  Braces,
  FileText,
  Clock,
  Fingerprint,
  Regex,
  CalendarClock,
  Key,
  Link2,
  Database,
  GitCompare,
} from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Braces,
  FileText,
  Clock,
  Fingerprint,
  Regex,
  CalendarClock,
  Key,
  Link: Link2,
  Database,
  GitCompare,
};

export default function HomePage() {
  const t = useTranslations("home");
  const toolT = useTranslations("tools");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Hero */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          {t("title")}
        </h1>
        <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
          {t("subtitle")}
        </p>
      </div>

      {/* Tools Grid */}
      <div id="tools">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
          {t("toolsTitle")}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {tools.map((tool) => {
            const Icon = iconMap[tool.icon] || Braces;
            return (
              <Link
                key={tool.path}
                href={tool.path}
                className="group p-5 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-lg transition-all duration-200 bg-white dark:bg-gray-900"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950 group-hover:bg-blue-100 dark:group-hover:bg-blue-900 transition-colors">
                    <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {toolT(`${tool.nameKey}.title` as never)}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {toolT(`${tool.nameKey}.description` as never)}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* SEO Content */}
      <div className="mt-16 max-w-3xl mx-auto">
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
          {t("description")}
        </p>
      </div>
    </div>
  );
}
