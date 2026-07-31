import Sidebar from "@/components/layout/Sidebar";
import Breadcrumb from "@/components/ui/Breadcrumb";
import AdSlot from "@/components/ui/AdSlot";

interface ToolLayoutProps {
  title: string;
  description: string;
  currentPath: string;
  children: React.ReactNode;
  seoContent: string;
}

export default function ToolLayout({
  title,
  description,
  currentPath,
  children,
  seoContent,
}: ToolLayoutProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb
        items={[{ label: title }]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main content */}
        <div className="lg:col-span-3">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {title}
            </h1>
            <p className="text-gray-500 dark:text-gray-400">{description}</p>
          </div>

          <AdSlot position="top" />

          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
            {children}
          </div>

          <AdSlot position="bottom" />

          {/* SEO content */}
          <div className="mt-8 prose prose-sm dark:prose-invert max-w-none">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              About this tool
            </h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              {seoContent}
            </p>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <Sidebar currentPath={currentPath} />
          </div>
        </div>
      </div>
    </div>
  );
}
