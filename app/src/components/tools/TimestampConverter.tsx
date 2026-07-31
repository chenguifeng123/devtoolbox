"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import CopyButton from "@/components/ui/CopyButton";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);

const TIMEZONES = [
  { key: "utc", tz: "UTC" },
  { key: "beijing", tz: "Asia/Shanghai" },
  { key: "tokyo", tz: "Asia/Tokyo" },
  { key: "newYork", tz: "America/New_York" },
  { key: "london", tz: "Europe/London" },
];

export default function TimestampConverter() {
  const t = useTranslations("tools.timestamp");
  const [now, setNow] = useState(Math.floor(Date.now() / 1000));
  const [timestampInput, setTimestampInput] = useState("");
  const [dateInput, setDateInput] = useState("");
  const [convertedDate, setConvertedDate] = useState("");
  const [convertedTimestamp, setConvertedTimestamp] = useState("");
  const [dateFormats, setDateFormats] = useState<Record<string, string>>({});

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Math.floor(Date.now() / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const convertTimestampToDate = () => {
    if (!timestampInput) return;
    let ts = Number(timestampInput);
    if (isNaN(ts)) return;

    // Auto-detect seconds vs milliseconds
    if (ts < 1e12) ts = ts * 1000;

    const d = dayjs(ts);
    if (!d.isValid()) return;

    setConvertedDate(d.format("YYYY-MM-DD HH:mm:ss"));
    const formats: Record<string, string> = {
      ISO: d.toISOString(),
      RFC2822: d.toDate().toUTCString(),
      Local: d.format("YYYY-MM-DD HH:mm:ss Z"),
      Relative: d.fromNow(),
    };
    TIMEZONES.forEach((tz) => {
      formats[tz.key] = dayjs(ts).tz(tz.tz).format("YYYY-MM-DD HH:mm:ss");
    });
    setDateFormats(formats);
  };

  const convertDateToTimestamp = () => {
    if (!dateInput) return;
    const d = dayjs(dateInput);
    if (!d.isValid()) return;

    const tsSeconds = d.unix();
    const tsMillis = d.valueOf();
    setConvertedTimestamp(`${tsSeconds} / ${tsMillis}`);
  };

  return (
    <div className="space-y-6">
      {/* Current timestamp */}
      <div className="p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
        <p className="text-sm text-blue-600 dark:text-blue-400 mb-1">
          {t("currentTime")}
        </p>
        <div className="flex items-center gap-3">
          <span className="text-2xl font-mono font-bold text-blue-700 dark:text-blue-300">
            {now}
          </span>
          <CopyButton text={String(now)} />
          <span className="text-sm text-blue-500 dark:text-blue-400">
            {now * 1000}
          </span>
          <CopyButton text={String(now * 1000)} />
        </div>
      </div>

      {/* Unix → Date */}
      <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
        <h3 className="font-medium text-gray-900 dark:text-white mb-3">
          {t("unixToDate")}
        </h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={timestampInput}
            onChange={(e) => setTimestampInput(e.target.value)}
            placeholder={t("enterTimestamp")}
            className="flex-1 px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={convertTimestampToDate}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Convert
          </button>
        </div>
        {convertedDate && (
          <div className="mt-3 space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-lg font-mono text-gray-900 dark:text-white">
                {convertedDate}
              </span>
              <CopyButton text={convertedDate} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {Object.entries(dateFormats).map(([key, value]) => (
                <div
                  key={key}
                  className="flex items-center gap-2 text-sm p-2 bg-gray-50 dark:bg-gray-800 rounded"
                >
                  <span className="text-gray-500 dark:text-gray-400 w-20 shrink-0">
                    {t(`timezones.${key}` as never) || key}:
                  </span>
                  <span className="font-mono text-gray-900 dark:text-white truncate">
                    {value}
                  </span>
                  <CopyButton text={value} className="ml-auto shrink-0" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Date → Unix */}
      <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
        <h3 className="font-medium text-gray-900 dark:text-white mb-3">
          {t("dateToUnix")}
        </h3>
        <div className="flex gap-2">
          <input
            type="datetime-local"
            value={dateInput}
            onChange={(e) => setDateInput(e.target.value)}
            className="flex-1 px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={convertDateToTimestamp}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Convert
          </button>
        </div>
        {convertedTimestamp && (
          <div className="mt-3 flex items-center gap-2">
            <span className="text-lg font-mono text-gray-900 dark:text-white">
              {convertedTimestamp}
            </span>
            <CopyButton
              text={convertedTimestamp.split(" / ")[0]}
            />
          </div>
        )}
      </div>
    </div>
  );
}
