import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import ToolLayout from "@/components/ui/ToolLayout";
import CronParserTool from "@/components/tools/CronParser";

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}) {
  const params = await props.params;
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: "tools.cron" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default function CronParserPage() {
  const t = useTranslations("tools.cron");

  return (
    <ToolLayout
      title={t("title")}
      description={t("description")}
      currentPath="/cron-parser"
      seoContent={t("seoContent")}
    >
      <CronParserTool />
    </ToolLayout>
  );
}
