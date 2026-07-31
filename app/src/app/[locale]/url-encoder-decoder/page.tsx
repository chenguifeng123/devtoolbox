import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import ToolLayout from "@/components/ui/ToolLayout";
import UrlEncoderDecoder from "@/components/tools/UrlEncoderDecoder";

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}) {
  const params = await props.params;
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: "tools.urlEncoder" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default function UrlEncoderDecoderPage() {
  const t = useTranslations("tools.urlEncoder");

  return (
    <ToolLayout
      title={t("title")}
      description={t("description")}
      currentPath="/url-encoder-decoder"
      seoContent={t("seoContent")}
    >
      <UrlEncoderDecoder />
    </ToolLayout>
  );
}
