"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import CopyButton from "@/components/ui/CopyButton";
import dayjs from "dayjs";

interface JwtParts {
  header: Record<string, unknown>;
  payload: Record<string, unknown>;
  signature: string;
}

export default function JwtDecoder() {
  const t = useTranslations("tools.jwt");
  const [input, setInput] = useState("");
  const [decoded, setDecoded] = useState<JwtParts | null>(null);
  const [error, setError] = useState("");

  const decode = () => {
    if (!input.trim()) return;

    try {
      const parts = input.trim().split(".");
      if (parts.length !== 3) {
        setError("Invalid JWT format. Expected 3 parts separated by dots.");
        setDecoded(null);
        return;
      }

      const header = JSON.parse(atob(parts[0].replace(/-/g, "+").replace(/_/g, "/")));
      const payload = JSON.parse(atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")));
      const signature = parts[2];

      setDecoded({ header, payload, signature });
      setError("");
    } catch (e) {
      setError("Failed to decode JWT: " + String(e));
      setDecoded(null);
    }
  };

  const getTokenStatus = (): { label: string; color: string } | null => {
    if (!decoded?.payload) return null;
    const now = Math.floor(Date.now() / 1000);
    const exp = decoded.payload.exp as number | undefined;
    const nbf = decoded.payload.nbf as number | undefined;

    if (exp && exp < now) return { label: t("expired"), color: "red" };
    if (nbf && nbf > now) return { label: t("notYetValid"), color: "yellow" };
    if (exp && exp > now) return { label: t("valid"), color: "green" };
    return null;
  };

  const status = getTokenStatus();

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          JWT Token
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onBlur={decode}
          placeholder={t("inputPlaceholder")}
          className="w-full h-32 p-3 font-mono text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-y focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <button
        onClick={decode}
        className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
      >
        Decode
      </button>

      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-700 dark:text-red-300">
          {error}
        </div>
      )}

      {/* Status */}
      {status && (
        <div
          className={`p-3 rounded-lg border ${
            status.color === "red"
              ? "bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300"
              : status.color === "yellow"
              ? "bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-300"
              : "bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300"
          }`}
        >
          <span className="font-medium">{status.label}</span>
          {decoded?.payload?.exp && (
            <span className="ml-2 text-sm">
              — {t("expiresAt")}: {dayjs.unix(decoded.payload.exp as number).format("YYYY-MM-DD HH:mm:ss")}
            </span>
          )}
        </div>
      )}

      {decoded && (
        <div className="space-y-4">
          {/* Header */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {t("header")}
              </h3>
              <CopyButton text={JSON.stringify(decoded.header, null, 2)} />
            </div>
            <pre className="p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-mono text-gray-900 dark:text-white overflow-auto">
              {JSON.stringify(decoded.header, null, 2)}
            </pre>
          </div>

          {/* Payload */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {t("payload")}
              </h3>
              <CopyButton text={JSON.stringify(decoded.payload, null, 2)} />
            </div>
            <pre className="p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-mono text-gray-900 dark:text-white overflow-auto">
              {JSON.stringify(decoded.payload, null, 2)}
            </pre>
          </div>

          {/* Signature */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {t("signature")}
              </h3>
              <CopyButton text={decoded.signature} />
            </div>
            <pre className="p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-mono text-gray-900 dark:text-white break-all">
              {decoded.signature}
            </pre>
          </div>

          {/* Token info */}
          <div className="grid grid-cols-2 gap-3">
            {decoded.payload.iat && (
              <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded text-sm">
                <span className="text-gray-500 dark:text-gray-400">{t("issuedAt")}: </span>
                <span className="text-gray-900 dark:text-white">
                  {dayjs.unix(decoded.payload.iat as number).format("YYYY-MM-DD HH:mm:ss")}
                </span>
              </div>
            )}
            {decoded.payload.exp && (
              <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded text-sm">
                <span className="text-gray-500 dark:text-gray-400">{t("expiresAt")}: </span>
                <span className="text-gray-900 dark:text-white">
                  {dayjs.unix(decoded.payload.exp as number).format("YYYY-MM-DD HH:mm:ss")}
                </span>
              </div>
            )}
            {decoded.payload.sub && (
              <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded text-sm">
                <span className="text-gray-500 dark:text-gray-400">{t("subject")}: </span>
                <span className="text-gray-900 dark:text-white">{String(decoded.payload.sub)}</span>
              </div>
            )}
            {decoded.payload.iss && (
              <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded text-sm">
                <span className="text-gray-500 dark:text-gray-400">{t("issuer")}: </span>
                <span className="text-gray-900 dark:text-white">{String(decoded.payload.iss)}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
