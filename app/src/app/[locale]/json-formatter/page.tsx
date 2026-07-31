import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import ToolLayout from "@/components/ui/ToolLayout";
import JsonFormatter from "@/components/tools/JsonFormatter";

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}) {
  const params = await props.params;
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: "tools.jsonFormatter" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default function JsonFormatterPage() {
  const t = useTranslations("tools.jsonFormatter");

  return (
    <ToolLayout
      title={t("title")}
      description={t("description")}
      currentPath="/json-formatter"
      seoContent={t("seoContent")}
    >
      <JsonFormatter />
    </ToolLayout>
  );
}
