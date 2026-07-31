export interface ToolItem {
  nameKey: string;
  path: string;
  icon: string;
  descKey: string;
  category: string;
}

export const tools: ToolItem[] = [
  {
    nameKey: "jsonFormatter",
    path: "/json-formatter",
    icon: "Braces",
    descKey: "jsonFormatter",
    category: "formatters",
  },
  {
    nameKey: "base64",
    path: "/base64-encode-decode",
    icon: "FileText",
    descKey: "base64",
    category: "converters",
  },
  {
    nameKey: "timestamp",
    path: "/timestamp-converter",
    icon: "Clock",
    descKey: "timestamp",
    category: "converters",
  },
  {
    nameKey: "uuid",
    path: "/uuid-generator",
    icon: "Fingerprint",
    descKey: "uuid",
    category: "generators",
  },
  {
    nameKey: "regex",
    path: "/regex-tester",
    icon: "Regex",
    descKey: "regex",
    category: "testers",
  },
  {
    nameKey: "cron",
    path: "/cron-parser",
    icon: "CalendarClock",
    descKey: "cron",
    category: "parsers",
  },
  {
    nameKey: "jwt",
    path: "/jwt-decoder",
    icon: "Key",
    descKey: "jwt",
    category: "decoders",
  },
  {
    nameKey: "urlEncoder",
    path: "/url-encoder-decoder",
    icon: "Link",
    descKey: "urlEncoder",
    category: "converters",
  },
  {
    nameKey: "sqlFormatter",
    path: "/sql-formatter",
    icon: "Database",
    descKey: "sqlFormatter",
    category: "formatters",
  },
  {
    nameKey: "diffChecker",
    path: "/text-diff-checker",
    icon: "GitCompare",
    descKey: "diffChecker",
    category: "testers",
  },
];

export const toolPaths = tools.map((t) => t.path);
