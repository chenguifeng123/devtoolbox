import { Link } from "@/i18n/routing";
import { tools } from "@/lib/constants";
import { useTranslations } from "next-intl";
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

interface SidebarProps {
  currentPath: string;
}

export default function Sidebar({ currentPath }: SidebarProps) {
  const t = useTranslations("common");
  const toolT = useTranslations("tools");

  const relatedTools = tools.filter((tool) => tool.path !== currentPath);

  return (
    <aside className="w-full">
      <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
        {t("relatedTools")}
      </h3>
      <div className="space-y-2">
        {relatedTools.map((tool) => {
          const Icon = iconMap[tool.icon] || Braces;
          return (
            <Link
              key={tool.path}
              href={tool.path}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
            >
              <Icon className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {toolT(`${tool.nameKey}.title` as never)}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  {toolT(`${tool.nameKey}.description` as never)}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
