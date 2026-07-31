"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import CopyButton from "@/components/ui/CopyButton";
import ClearButton from "@/components/ui/ClearButton";

interface UrlParts {
  protocol: string;
  host: string;
  hostname: string;
  port: string;
  pathname: string;
  search: string;
  hash: string;
  params: [string, string][];
}

export default function UrlEncoderDecoder() {
  const t = useTranslations("tools.urlEncoder");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [parsed, setParsed] = useState<UrlParts | null>(null);
  const [error, setError] = useState("");

  const encode = () => {
    try {
      setOutput(encodeURIComponent(input));
      setError("");
      setParsed(null);
    } catch (e) {
      setError(String(e));
    }
  };

  const decode = () => {
    try {
      setOutput(decodeURIComponent(input));
      setError("");
      setParsed(null);
    } catch (e) {
      setError("Invalid encoded URL");
    }
  };

  const parseUrl = () => {
    try {
      const url = new URL(input);
      const params: [string, string][] = [];
      url.searchParams.forEach((value, key) => {
        params.push([key, value]);
      });

      setParsed({
        protocol: url.protocol,
        host: url.host,
        hostname: url.hostname,
        port: url.port,
        pathname: url.pathname,
        search: url.search,
        hash: url.hash,
        params,
      });
      setError("");
    } catch {
      setError("Invalid URL. Make sure to include protocol (e.g., https://)");
      setParsed(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={encode}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          {t("encode")}
        </button>
        <button
          onClick={decode}
          className="px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors"
        >
          {t("decode")}
        </button>
        <button
          onClick={parseUrl}
          className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors"
        >
          {t("parseUrl")}
        </button>
        <ClearButton
          onClick={() => {
            setInput("");
            setOutput("");
            setParsed(null);
            setError("");
          }}
        />
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
            className="w-full h-40 p-3 font-mono text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-y focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
            className="w-full h-40 p-3 font-mono text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white resize-y"
          />
        </div>
      </div>

      {/* Parsed URL */}
      {parsed && (
        <div>
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            {t("parseUrl")}
          </h3>
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg divide-y divide-gray-200 dark:divide-gray-700">
            <UrlRow label={t("protocol")} value={parsed.protocol} />
            <UrlRow label={t("host")} value={parsed.host} />
            <UrlRow label={t("port")} value={parsed.port || "(default)"} />
            <UrlRow label={t("pathname")} value={parsed.pathname} />
            <UrlRow label={t("hash")} value={parsed.hash || "(none)"} />
          </div>

          {parsed.params.length > 0 && (
            <div className="mt-3">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t("params")}
              </h4>
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-800">
                      <th className="px-4 py-2 text-left text-gray-500 dark:text-gray-400 font-medium">
                        Key
                      </th>
                      <th className="px-4 py-2 text-left text-gray-500 dark:text-gray-400 font-medium">
                        Value
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {parsed.params.map(([key, value], i) => (
                      <tr key={i}>
                        <td className="px-4 py-2 font-mono text-gray-900 dark:text-white">
                          {key}
                        </td>
                        <td className="px-4 py-2 font-mono text-gray-600 dark:text-gray-300 break-all">
                          {value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function UrlRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between px-4 py-2.5">
      <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
      <div className="flex items-center gap-2">
        <span className="font-mono text-sm text-gray-900 dark:text-white max-w-xs truncate">
          {value}
        </span>
        <CopyButton text={value} />
      </div>
    </div>
  );
}
