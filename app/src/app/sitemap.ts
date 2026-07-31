import { MetadataRoute } from "next";
import { tools } from "@/lib/constants";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://devtoolbox.io";
  const locales = ["en", "zh"];

  const pages: MetadataRoute.Sitemap = [
    ...locales.map((locale) => ({
      url: `${baseUrl}/${locale}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 1,
      alternates: {
        languages: {
          en: `${baseUrl}/en`,
          zh: `${baseUrl}/zh`,
        },
      },
    })),
  ];

  tools.forEach((tool) => {
    locales.forEach((locale) => {
      pages.push({
        url: `${baseUrl}/${locale}${tool.path}`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.8,
        alternates: {
          languages: {
            en: `${baseUrl}/en${tool.path}`,
            zh: `${baseUrl}/zh${tool.path}`,
          },
        },
      });
    });
  });

  return pages;
}
