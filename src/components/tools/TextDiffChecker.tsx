"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { diffLines } from "diff";

interface DiffPart {
  value: string;
  added?: boolean;
  removed?: boolean;
}

export default function TextDiffChecker() {
  const t = useTranslations("tools.diffChecker");
  const [original, setOriginal] = useState("");
  const [modified, setModified] = useState("");

  const diffResult = useMemo((): DiffPart[] => {
    if (!original || !modified) return [];
    return diffLines(original, modified);
  }, [original, modified]);

  const stats = useMemo(() => {
    let added = 0;
    let removed = 0;
    let unchanged = 0;
    diffResult.forEach((part) => {
      const lines = part.value.split("\n").filter((l) => l !== "");
      if (part.added) added += lines.length;
      else if (part.removed) removed += lines.length;
      else unchanged += lines.length;
    });
    return { added, removed, unchanged };
  }, [diffResult]);

  const hasDiff = diffResult.length > 0 && (stats.added > 0 || stats.removed > 0);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t("originalText")}
          </label>
          <textarea
            value={original}
            onChange={(e) => setOriginal(e.target.value)}
            placeholder={t("originalPlaceholder")}
            className="w-full h-48 p-3 font-mono text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-y focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t("modifiedText")}
          </label>
          <textarea
            value={modified}
            onChange={(e) => setModified(e.target.value)}
            placeholder={t("modifiedPlaceholder")}
            className="w-full h-48 p-3 font-mono text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-y focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Stats */}
      {diffResult.length > 0 && (
        <div className="flex flex-wrap items-center gap-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {t("stats")}:
          </h3>
          {stats.added > 0 && (
            <span className="text-sm text-green-600 dark:text-green-400">
              +{stats.added} {t("linesAdded")}
            </span>
          )}
          {stats.removed > 0 && (
            <span className="text-sm text-red-600 dark:text-red-400">
              -{stats.removed} {t("linesRemoved")}
            </span>
          )}
          {stats.unchanged > 0 && (
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {stats.unchanged} {t("linesUnchanged")}
            </span>
          )}
        </div>
      )}

      {/* No differences */}
      {original && modified && !hasDiff && diffResult.length > 0 && (
        <div className="p-4 text-center text-gray-500 dark:text-gray-400">
          {t("noDifferences")}
        </div>
      )}

      {/* Diff output */}
      {hasDiff && (
        <div>
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t("differences")}
          </h3>
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-auto max-h-96">
            <pre className="p-4 text-sm font-mono leading-relaxed">
              {diffResult.map((part, index) => {
                if (part.added) {
                  return (
                    <span
                      key={index}
                      className="block bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                    >
                      {part.value.split("\n").map((line, i) => (
                        <span key={i}>
                          {i > 0 && "\n"}
                          {line && `+ ${line}`}
                          {!line && ""}
                        </span>
                      ))}
                    </span>
                  );
                }
                if (part.removed) {
                  return (
                    <span
                      key={index}
                      className="block bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 line-through"
                    >
                      {part.value.split("\n").map((line, i) => (
                        <span key={i}>
                          {i > 0 && "\n"}
                          {line && `- ${line}`}
                          {!line && ""}
                        </span>
                      ))}
                    </span>
                  );
                }
                return (
                  <span
                    key={index}
                    className="block text-gray-600 dark:text-gray-400"
                  >
                    {part.value}
                  </span>
                );
              })}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
