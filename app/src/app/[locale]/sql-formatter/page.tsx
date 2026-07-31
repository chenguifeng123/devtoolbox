import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import ToolLayout from "@/components/ui/ToolLayout";
import SqlFormatterTool from "@/components/tools/SqlFormatterTool";

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}) {
  const params = await props.params;
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: "tools.sqlFormatter" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default function SqlFormatterPage() {
  const t = useTranslations("tools.sqlFormatter");

  return (
    <ToolLayout
      title={t("title")}
      description={t("description")}
      currentPath="/sql-formatter"
      seoContent={t("seoContent")}
    >
      <SqlFormatterTool />
    </ToolLayout>
  );
}
