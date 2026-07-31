import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import ToolLayout from "@/components/ui/ToolLayout";
import UuidGenerator from "@/components/tools/UuidGenerator";

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}) {
  const params = await props.params;
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: "tools.uuid" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default function UuidGeneratorPage() {
  const t = useTranslations("tools.uuid");

  return (
    <ToolLayout
      title={t("title")}
      description={t("description")}
      currentPath="/uuid-generator"
      seoContent={t("seoContent")}
    >
      <UuidGenerator />
    </ToolLayout>
  );
}
