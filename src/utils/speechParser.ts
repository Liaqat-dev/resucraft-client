// ── Speech Parser ──────────────────────────────────────────────────────────────
// Parses free-form transcript text into structured form fields using keyword
// matching. Longer keyword phrases are matched first to avoid partial matches.

export type FieldTriggers<T> = Record<string, keyof T>;

// ── Month Name → Zero-padded Number ──────────────────────────────────────────
const MONTH_MAP: Record<string, string> = {
    january: "01", jan: "01",
    february: "02", feb: "02",
    march: "03", mar: "03",
    april: "04", apr: "04",
    may: "05",
    june: "06", jun: "06",
    july: "07", jul: "07",
    august: "08", aug: "08",
    september: "09", sep: "09", sept: "09",
    october: "10", oct: "10",
    november: "11", nov: "11",
    december: "12", dec: "12",
};

/**
 * Attempts to parse a freeform date string into "YYYY-MM" format.
 * Handles: "January 2022", "jan 2022", "2022-01", "01/2022"
 */
export function parseMonthYear(text: string): string {
    const lower = text.toLowerCase().trim();
    const yearMatch = lower.match(/\b(20\d{2}|19\d{2})\b/);
    if (!yearMatch) return "";
    const year = yearMatch[1];

    // Try named month
    for (const [name, num] of Object.entries(MONTH_MAP)) {
        if (lower.includes(name)) return `${year}-${num}`;
    }

    // Try numeric month  e.g. "01/2022" or "2022-01"
    const numMatch = lower.match(/\b(0?[1-9]|1[0-2])\b/);
    if (numMatch) return `${year}-${numMatch[1].padStart(2, "0")}`;

    return "";
}

/**
 * Parses a transcript string into a partial form object using keyword triggers.
 *
 * @param transcript  Raw speech transcript
 * @param triggers    Map of phrase → field key. Longer phrases checked first.
 * @param dateFields  Fields whose values should be parsed as "YYYY-MM" dates
 */
export function parseTranscript<T extends object>(
    transcript: string,
    triggers: FieldTriggers<T>,
    dateFields: (keyof T)[] = []
): Partial<Record<keyof T, string>> {
    const lower = transcript.toLowerCase();
    const result: Partial<Record<keyof T, string>> = {};

    // Sort triggers longest-first to avoid "start" shadowing "start date"
    const sorted = Object.entries(triggers).sort((a, b) => b[0].length - a[0].length);

    const matches: { index: number; end: number; field: keyof T }[] = [];

    for (const [trigger, field] of sorted) {
        const idx = lower.indexOf(trigger);
        if (idx === -1) continue;
        // Skip if this field was already found via a longer trigger
        if (matches.find((m) => m.field === field)) continue;
        matches.push({ index: idx, end: idx + trigger.length, field: field as keyof T });
    }

    matches.sort((a, b) => a.index - b.index);

    for (let i = 0; i < matches.length; i++) {
        const { end, field } = matches[i];
        const valueEnd = matches[i + 1]?.index ?? transcript.length;
        let value = transcript
            .slice(end, valueEnd)
            .replace(/^[\s,:.]+/, "")   // strip leading separators
            .replace(/[\s,;.]+$/, "")   // strip trailing punctuation
            .trim();

        if (!value) continue;

        if (dateFields.includes(field)) {
            const parsed = parseMonthYear(value);
            if (parsed) result[field] = parsed;
        } else {
            result[field] = value;
        }
    }

    return result;
}
