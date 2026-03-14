import { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@src/slices/store.ts";
import {
    DATA_COLORS,
    LAYOUT_MODE_TYPES,
} from "@src/components/constants/layout";

export interface LandingTheme {
    bg: string;       // main page background
    bgAlt: string;    // alternate section background (stats, etc.)
    bgDeep: string;   // deeper section background (CTA, how-it-works, etc.)
    card: string;     // card / panel background
    border: string;   // border color
    text: string;     // primary text
    textSub: string;  // secondary text
    textMuted: string;// muted / placeholder text
    accent: string;   // accent color (replaces GOLD)
    accentLight: string; // lighter accent (replaces GOLD_T)
    accentDark: string;  // darker accent for gradients
    isDark: boolean;
}

// [accent, accentLight, accentDark]
const ACCENT_MAP: Record<string, [string, string, string]> = {
    [DATA_COLORS.DEFAULT]: ['#C09A3A', '#D4B06A', '#8B6914'],
    [DATA_COLORS.GREEN]:   ['#16a34a', '#4ade80', '#15803d'],
    [DATA_COLORS.VIOLET]:  ['#7c3aed', '#a78bfa', '#5b21b6'],
    [DATA_COLORS.ORANGE]:  ['#ea580c', '#fb923c', '#c2410c'],
    [DATA_COLORS.TEAL]:    ['#0d9488', '#2dd4bf', '#0f766e'],
    [DATA_COLORS.FUCHSIA]: ['#c026d3', '#e879f9', '#a21caf'],
    [DATA_COLORS.LIME]:    ['#65a30d', '#a3e635', '#4d7c0f'],
    [DATA_COLORS.AMBER]:   ['#d97706', '#fcd34d', '#b45309'],
};

const DARK_BASE = {
    bg: '#0F172A',
    bgAlt: '#111827',
    bgDeep: '#0c1520',
    card: '#1e293b',
    border: '#334155',
    text: '#f8fafc',
    textSub: '#94a3b8',
    textMuted: '#64748b',
    isDark: true,
};

const LIGHT_BASE = {
    bg: '#ffffff',
    bgAlt: '#f8fafc',
    bgDeep: '#f1f5f9',
    card: '#ffffff',
    border: '#e2e8f0',
    text: '#0f172a',
    textSub: '#475569',
    textMuted: '#94a3b8',
    isDark: false,
};

const BW_BASE = {
    bg: '#000000',
    bgAlt: '#0d0d0d',
    bgDeep: '#080808',
    card: '#111111',
    border: '#222222',
    text: '#ffffff',
    textSub: '#aaaaaa',
    textMuted: '#555555',
    isDark: true,
};

export function useLandingTheme(): LandingTheme {
    const { layoutMode, layoutDataColor } = useSelector(
        (state: RootState) => state.Layout,
    );

    const theme = useMemo(() => {
        let base;
        if (layoutMode === LAYOUT_MODE_TYPES.LIGHT) {
            base = LIGHT_BASE;
        } else if (layoutMode === LAYOUT_MODE_TYPES.BLACKWHITE) {
            base = BW_BASE;
        } else {
            base = DARK_BASE; // DARK and DEFAULT both use dark theme for landing
        }

        const [accent, accentLight, accentDark] =
            ACCENT_MAP[layoutDataColor] ?? ACCENT_MAP[DATA_COLORS.DEFAULT];

        return { ...base, accent, accentLight, accentDark };
    }, [layoutMode, layoutDataColor]);

    // Sync theme colors to CSS custom properties so .rc-* classes respond to theme
    useEffect(() => {
        const root = document.documentElement;
        root.style.setProperty('--rc-bg',           theme.bg);
        root.style.setProperty('--rc-bg-alt',       theme.bgAlt);
        root.style.setProperty('--rc-bg-deep',      theme.bgDeep);
        root.style.setProperty('--rc-card',         theme.card);
        root.style.setProperty('--rc-border',       theme.border);
        root.style.setProperty('--rc-text',         theme.text);
        root.style.setProperty('--rc-text-sub',     theme.textSub);
        root.style.setProperty('--rc-text-muted',   theme.textMuted);
        root.style.setProperty('--rc-accent',       theme.accent);
        root.style.setProperty('--rc-accent-light', theme.accentLight);
        root.style.setProperty('--rc-accent-dark',  theme.accentDark);
    }, [theme]);

    return theme;
}
