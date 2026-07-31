import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import ToolLayout from "@/components/ui/ToolLayout";
import TimestampConverter from "@/components/tools/TimestampConverter";

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}) {
  const params = await props.params;
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: "tools.timestamp" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default function TimestampConverterPage() {
  const t = useTranslations("tools.timestamp");

  return (
    <ToolLayout
      title={t("title")}
      description={t("description")}
      currentPath="/timestamp-converter"
      seoContent={t("seoContent")}
    >
      <TimestampConverter />
    </ToolLayout>
  );
}
