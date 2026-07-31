import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import ToolLayout from "@/components/ui/ToolLayout";
import RegexTester from "@/components/tools/RegexTester";

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}) {
  const params = await props.params;
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: "tools.regex" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default function RegexTesterPage() {
  const t = useTranslations("tools.regex");

  return (
    <ToolLayout
      title={t("title")}
      description={t("description")}
      currentPath="/regex-tester"
      seoContent={t("seoContent")}
    >
      <RegexTester />
    </ToolLayout>
  );
}
