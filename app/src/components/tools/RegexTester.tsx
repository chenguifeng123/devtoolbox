"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import CopyButton from "@/components/ui/CopyButton";

interface MatchResult {
  index: number;
  match: string;
  groups: Record<string, string> | undefined;
}

export default function RegexTester() {
  const t = useTranslations("tools.regex");
  const [pattern, setPattern] = useState("");
  const [testString, setTestString] = useState("");
  const [flagG, setFlagG] = useState(true);
  const [flagI, setFlagI] = useState(false);
  const [flagM, setFlagM] = useState(false);
  const [flagS, setFlagS] = useState(false);
  const [error, setError] = useState("");

  const flags = useMemo(() => {
    let f = "";
    if (flagG) f += "g";
    if (flagI) f += "i";
    if (flagM) f += "m";
    if (flagS) f += "s";
    return f;
  }, [flagG, flagI, flagM, flagS]);

  const matches = useMemo((): MatchResult[] => {
    if (!pattern || !testString) return [];
    try {
      const regex = new RegExp(pattern, flags);
      const results: MatchResult[] = [];
      let match: RegExpExecArray | null;

      if (flags.includes("g")) {
        while ((match = regex.exec(testString)) !== null) {
          results.push({
            index: match.index,
            match: match[0],
            groups: match.groups,
          });
          if (match.index === regex.lastIndex) regex.lastIndex++;
        }
      } else {
        match = regex.exec(testString);
        if (match) {
          results.push({
            index: match.index,
            match: match[0],
            groups: match.groups,
          });
        }
      }
      setError("");
      return results;
    } catch (e) {
      setError(String(e));
      return [];
    }
  }, [pattern, testString, flags]);

  // Build highlighted text
  const highlightedText = useMemo(() => {
    if (!matches.length || !testString) return testString;

    const parts: string[] = [];
    let lastIndex = 0;

    matches.forEach((m) => {
      if (m.index > lastIndex) {
        parts.push(
          escapeHtml(testString.slice(lastIndex, m.index))
        );
      }
      parts.push(
        `<mark class="bg-yellow-200 dark:bg-yellow-800 rounded px-0.5">${escapeHtml(m.match)}</mark>`
      );
      lastIndex = m.index + m.match.length;
    });

    if (lastIndex < testString.length) {
      parts.push(escapeHtml(testString.slice(lastIndex)));
    }

    return parts.join("");
  }, [matches, testString]);

  return (
    <div className="space-y-4">
      {/* Pattern */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t("pattern")}
        </label>
        <div className="flex gap-2">
          <div className="flex-1 flex items-center border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
            <span className="pl-3 text-gray-400">/</span>
            <input
              type="text"
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              placeholder={t("patternPlaceholder")}
              className="flex-1 px-1 py-2 text-sm font-mono bg-transparent text-gray-900 dark:text-white focus:outline-none"
            />
            <span className="text-gray-400">/{flags}</span>
          </div>
        </div>
      </div>

      {/* Flags */}
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {t("flags")}:
        </span>
        {[
          { label: "g", checked: flagG, setter: setFlagG, title: "Global" },
          { label: "i", checked: flagI, setter: setFlagI, title: "Case Insensitive" },
          { label: "m", checked: flagM, setter: setFlagM, title: "Multiline" },
          { label: "s", checked: flagS, setter: setFlagS, title: "Dot All" },
        ].map((flag) => (
          <label
            key={flag.label}
            className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-300"
            title={flag.title}
          >
            <input
              type="checkbox"
              checked={flag.checked}
              onChange={(e) => flag.setter(e.target.checked)}
              className="rounded border-gray-300 dark:border-gray-600"
            />
            <span className="font-mono">{flag.label}</span>
          </label>
        ))}
      </div>

      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-700 dark:text-red-300">
          {error}
        </div>
      )}

      {/* Test string with highlights */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t("testString")}
        </label>
        <textarea
          value={testString}
          onChange={(e) => setTestString(e.target.value)}
          placeholder={t("testPlaceholder")}
          className="w-full h-40 p-3 font-mono text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-y focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Highlighted result */}
      {testString && matches.length > 0 && (
        <div className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
          <p
            className="font-mono text-sm whitespace-pre-wrap break-all text-gray-900 dark:text-white"
            dangerouslySetInnerHTML={{ __html: highlightedText }}
          />
        </div>
      )}

      {/* Match list */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {matches.length > 0
              ? t("matchCount", { count: matches.length })
              : t("noMatches")}
          </h3>
        </div>

        {matches.length > 0 && (
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg divide-y divide-gray-200 dark:divide-gray-700 max-h-60 overflow-auto">
            {matches.map((m, i) => (
              <div key={i} className="px-4 py-2 flex items-start gap-4 text-sm">
                <span className="text-gray-400 w-8 shrink-0">#{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 text-xs">
                      {t("index")}: {m.index}
                    </span>
                  </div>
                  <code className="font-mono text-blue-600 dark:text-blue-400 break-all">
                    {m.match}
                  </code>
                  <CopyButton text={m.match} className="ml-2" />
                  {m.groups && (
                    <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      {t("groups")}: {JSON.stringify(m.groups)}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
