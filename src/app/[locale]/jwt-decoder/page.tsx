import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import ToolLayout from "@/components/ui/ToolLayout";
import JwtDecoder from "@/components/tools/JwtDecoder";

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}) {
  const params = await props.params;
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: "tools.jwt" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default function JwtDecoderPage() {
  const t = useTranslations("tools.jwt");

  return (
    <ToolLayout
      title={t("title")}
      description={t("description")}
      currentPath="/jwt-decoder"
      seoContent={t("seoContent")}
    >
      <JwtDecoder />
    </ToolLayout>
  );
}
