import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import ToolLayout from "@/components/ui/ToolLayout";
import Base64Tool from "@/components/tools/Base64Tool";

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}) {
  const params = await props.params;
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: "tools.base64" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default function Base64Page() {
  const t = useTranslations("tools.base64");

  return (
    <ToolLayout
      title={t("title")}
      description={t("description")}
      currentPath="/base64-encode-decode"
      seoContent={t("seoContent")}
    >
      <Base64Tool />
    </ToolLayout>
  );
}
