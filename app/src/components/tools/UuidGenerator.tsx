"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import CopyButton from "@/components/ui/CopyButton";
import { v4 as uuidv4 } from "uuid";

export default function UuidGenerator() {
  const t = useTranslations("tools.uuid");
  const [uuids, setUuids] = useState<string[]>([]);
  const [count, setCount] = useState(1);
  const [uppercase, setUppercase] = useState(false);
  const [noHyphens, setNoHyphens] = useState(false);

  const formatUuid = (uuid: string): string => {
    let result = uuid;
    if (noHyphens) result = result.replace(/-/g, "");
    if (uppercase) result = result.toUpperCase();
    return result;
  };

  const generate = () => {
    const newUuids = Array.from({ length: count }, () =>
      formatUuid(uuidv4())
    );
    setUuids(newUuids);
  };

  const allText = uuids.join("\n");

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4">
        <button
          onClick={generate}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          {count === 1 ? t("generate") : t("batchGenerate")}
        </button>

        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-500 dark:text-gray-400">
            {t("count")}:
          </label>
          <input
            type="number"
            min={1}
            max={100}
            value={count}
            onChange={(e) => setCount(Math.min(100, Math.max(1, Number(e.target.value))))}
            className="w-20 px-2 py-1 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>

        <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
          <input
            type="checkbox"
            checked={uppercase}
            onChange={(e) => {
              setUppercase(e.target.checked);
              setUuids((prev) => prev.map(formatUuid));
            }}
            className="rounded border-gray-300 dark:border-gray-600"
          />
          {t("uppercase")}
        </label>

        <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
          <input
            type="checkbox"
            checked={noHyphens}
            onChange={(e) => {
              setNoHyphens(e.target.checked);
              setUuids((prev) => prev.map(formatUuid));
            }}
            className="rounded border-gray-300 dark:border-gray-600"
          />
          {t("noHyphens")}
        </label>

        {uuids.length > 0 && (
          <CopyButton text={allText} className="ml-auto" />
        )}
      </div>

      {uuids.length > 0 && (
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg divide-y divide-gray-200 dark:divide-gray-700">
          {uuids.map((uuid, index) => (
            <div
              key={index}
              className="flex items-center justify-between px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <span className="font-mono text-sm text-gray-900 dark:text-white">
                {uuid}
              </span>
              <CopyButton text={uuid} />
            </div>
          ))}
        </div>
      )}

      {uuids.length === 0 && (
        <div className="text-center py-12 text-gray-400 dark:text-gray-500 text-sm">
          {t("placeholder")}
        </div>
      )}
    </div>
  );
}
