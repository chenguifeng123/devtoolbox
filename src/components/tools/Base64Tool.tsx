"use client";

import { useState, useRef } from "react";
import { useTranslations } from "next-intl";
import CopyButton from "@/components/ui/CopyButton";
import ClearButton from "@/components/ui/ClearButton";

type Mode = "encode" | "decode";

export default function Base64Tool() {
  const t = useTranslations("tools.base64");
  const [mode, setMode] = useState<Mode>("encode");
  const [urlSafe, setUrlSafe] = useState(false);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const encode = () => {
    try {
      const encoded = btoa(unescape(encodeURIComponent(input)));
      if (urlSafe) {
        setOutput(
          encoded.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "")
        );
      } else {
        setOutput(encoded);
      }
      setError("");
    } catch (e) {
      setError(String(e));
      setOutput("");
    }
  };

  const decode = () => {
    try {
      let toDecode = input;
      if (urlSafe) {
        toDecode = toDecode.replace(/-/g, "+").replace(/_/g, "/");
        while (toDecode.length % 4) toDecode += "=";
      }
      const decoded = decodeURIComponent(escape(atob(toDecode)));
      setOutput(decoded);
      setError("");
    } catch (e) {
      setError("Invalid Base64 string");
      setOutput("");
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      setError("File too large. Max 10MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(",")[1];
      setOutput(base64);
      setInput(file.name);
      setError("");
    };
    reader.readAsDataURL(file);
  };

  const process = () => {
    if (mode === "encode") encode();
    else decode();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <button
            onClick={() => setMode("encode")}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              mode === "encode"
                ? "bg-blue-600 text-white"
                : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            }`}
          >
            {t("encode")}
          </button>
          <button
            onClick={() => setMode("decode")}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              mode === "decode"
                ? "bg-blue-600 text-white"
                : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            }`}
          >
            {t("decode")}
          </button>
        </div>

        <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
          <input
            type="checkbox"
            checked={urlSafe}
            onChange={(e) => setUrlSafe(e.target.checked)}
            className="rounded border-gray-300 dark:border-gray-600"
          />
          {t("urlSafe")}
        </label>

        <button
          onClick={process}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          {mode === "encode" ? t("encode") : t("decode")}
        </button>

        <button
          onClick={() => fileInputRef.current?.click()}
          className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          {t("fileToBase64")}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileUpload}
          className="hidden"
          accept="*/*"
        />

        <ClearButton
          onClick={() => {
            setInput("");
            setOutput("");
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
            className="w-full h-48 p-3 font-mono text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-y focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
            placeholder={t("outputPlaceholder")}
            className="w-full h-48 p-3 font-mono text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white resize-y"
          />
        </div>
      </div>
    </div>
  );
}
