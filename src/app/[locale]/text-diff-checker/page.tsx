import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import ToolLayout from "@/components/ui/ToolLayout";
import TextDiffChecker from "@/components/tools/TextDiffChecker";

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}) {
  const params = await props.params;
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: "tools.diffChecker" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default function TextDiffCheckerPage() {
  const t = useTranslations("tools.diffChecker");

  return (
    <ToolLayout
      title={t("title")}
      description={t("description")}
      currentPath="/text-diff-checker"
      seoContent={t("seoContent")}
    >
      <TextDiffChecker />
    </ToolLayout>
  );
}
