"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import CopyButton from "@/components/ui/CopyButton";
import ClearButton from "@/components/ui/ClearButton";
import { format as formatSQL, minify as minifySQL } from "sql-formatter";

type Dialect = "mysql" | "postgresql" | "sqlite" | "tsql";

const DIALECT_MAP: Record<string, Dialect> = {
  mysql: "mysql",
  postgresql: "postgresql",
  sqlite: "sqlite",
  sqlserver: "tsql",
};

export default function SqlFormatterTool() {
  const t = useTranslations("tools.sqlFormatter");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [dialect, setDialect] = useState<Dialect>("mysql");
  const [error, setError] = useState("");

  const format = () => {
    try {
      const result = formatSQL(input, { language: dialect });
      setOutput(result);
      setError("");
    } catch (e) {
      setError(String(e));
      setOutput("");
    }
  };

  const minify = () => {
    try {
      const result = minifySQL(input, { language: dialect });
      setOutput(result);
      setError("");
    } catch (e) {
      setError(String(e));
      setOutput("");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={format}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          {t("format")}
        </button>
        <button
          onClick={minify}
          className="px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors"
        >
          {t("minify")}
        </button>
        <ClearButton
          onClick={() => {
            setInput("");
            setOutput("");
            setError("");
          }}
        />

        <div className="flex items-center gap-2 ml-auto">
          <label className="text-sm text-gray-500 dark:text-gray-400">
            {t("dialect")}:
          </label>
          <select
            value={dialect}
            onChange={(e) => setDialect(e.target.value as Dialect)}
            className="px-2 py-1 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            {Object.entries(DIALECT_MAP).map(([key, val]) => (
              <option key={key} value={val}>
                {t(`dialects.${key}` as never)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-700 dark:text-red-300">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Input
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t("inputPlaceholder")}
            className="w-full h-64 p-3 font-mono text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-y focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Output
            </label>
            {output && <CopyButton text={output} />}
          </div>
          <textarea
            value={output}
            readOnly
            className="w-full h-64 p-3 font-mono text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white resize-y"
          />
        </div>
      </div>
    </div>
  );
}
