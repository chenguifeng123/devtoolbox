"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import CopyButton from "@/components/ui/CopyButton";
import { parseExpression } from "cron-parser";

const TEMPLATES = [
  { label: "* * * * *", key: "everyMinute" },
  { label: "0 * * * *", key: "everyHour" },
  { label: "0 0 * * *", key: "everyDay" },
  { label: "0 0 * * 1", key: "everyWeek" },
  { label: "0 0 1 * *", key: "everyMonth" },
  { label: "0 0 1 1 *", key: "everyYear" },
];

export default function CronParserTool() {
  const t = useTranslations("tools.cron");
  const [expression, setExpression] = useState("0 0 * * *");
  const [error, setError] = useState("");

  const parsed = useMemo(() => {
    try {
      if (!expression.trim()) {
        setError("");
        return null;
      }
      const interval = parseExpression(expression);
      setError("");

      const nextRuns: string[] = [];
      for (let i = 0; i < 5; i++) {
        const next = interval.next();
        nextRuns.push(next.toDate().toISOString());
      }

      const humanReadable = describeCron(expression);

      return { nextRuns, humanReadable };
    } catch (e) {
      setError(t("invalidExpression"));
      return null;
    }
  }, [expression, t]);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t("expression")}
        </label>
        <input
          type="text"
          value={expression}
          onChange={(e) => setExpression(e.target.value)}
          placeholder={t("expressionPlaceholder")}
          className="w-full px-3 py-2 font-mono text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Quick templates */}
      <div>
        <label className="block text-sm text-gray-500 dark:text-gray-400 mb-2">
          {t("templates")}
        </label>
        <div className="flex flex-wrap gap-2">
          {TEMPLATES.map((tpl) => (
            <button
              key={tpl.label}
              onClick={() => setExpression(tpl.label)}
              className={`px-3 py-1.5 text-xs font-mono rounded-lg border transition-colors ${
                expression === tpl.label
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400"
                  : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}
            >
              {t(tpl.key as never)} ({tpl.label})
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-700 dark:text-red-300">
          {error}
        </div>
      )}

      {/* Human readable */}
      {parsed && (
        <>
          <div className="p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
            <p className="text-sm text-green-600 dark:text-green-400 mb-1">
              {t("humanReadable")}
            </p>
            <p className="text-lg font-medium text-green-700 dark:text-green-300">
              {parsed.humanReadable}
            </p>
          </div>

          {/* Next executions */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t("nextExecutions")}
            </h3>
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg divide-y divide-gray-200 dark:divide-gray-700">
              {parsed.nextRuns.map((run, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between px-4 py-2.5"
                >
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    #{i + 1}
                  </span>
                  <span className="font-mono text-sm text-gray-900 dark:text-white">
                    {new Date(run).toLocaleString()}
                  </span>
                  <CopyButton text={run} />
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function describeCron(expr: string): string {
  const parts = expr.trim().split(/\s+/);
  if (parts.length !== 5) return expr;

  const [minute, hour, dayOfMonth, month, dayOfWeek] = parts;

  const descriptions: string[] = [];

  // Minute
  if (minute === "*") descriptions.push("every minute");
  else if (minute.startsWith("*/")) descriptions.push(`every ${minute.slice(2)} minutes`);
  else descriptions.push(`at minute ${minute}`);

  // Hour
  if (hour === "*") {
    if (minute !== "*") descriptions.push("of every hour");
  } else if (hour.startsWith("*/")) {
    descriptions.push(`every ${hour.slice(2)} hours`);
  } else {
    descriptions.push(`at ${hour.padStart(2, "0")}:00`);
  }

  // Day of month
  if (dayOfMonth !== "*") {
    if (dayOfMonth.startsWith("*/")) {
      descriptions.push(`every ${dayOfMonth.slice(2)} days`);
    } else {
      descriptions.push(`on day ${dayOfMonth} of the month`);
    }
  }

  // Month
  if (month !== "*") {
    const months = ["", "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"];
    const mNum = parseInt(month);
    if (mNum >= 1 && mNum <= 12) {
      descriptions.push(`in ${months[mNum]}`);
    }
  }

  // Day of week
  if (dayOfWeek !== "*") {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const dNum = parseInt(dayOfWeek);
    if (dNum >= 0 && dNum <= 6) {
      descriptions.push(`on ${days[dNum]}`);
    }
  }

  return descriptions.join(", ");
}
