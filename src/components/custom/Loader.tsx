import React, { CSSProperties, FC, ReactElement, useEffect, useMemo, useState } from "react";

/**
 * SpinLoader.tsx
 * ----------------
 * Reusable, extendable loader component with built-in variants.
 *
 * - Default export: SpinLoader (use this in your app)
 * - Named export: registerSpinVariant (to add new variants dynamically)
 *
 * Behavior:
 * - wraps loader into your requested centering class
 * - detects primary color from CSS variables or Tailwind class fallback
 * - easy to add more variants via registerSpinVariant
 */

/* -----------------------
   Types
   ----------------------- */
export type SizeKey = "xs" | "sm" | "md" | "lg" | "xl";
export type VariantKey = "modern" | "classic" | "pulse" | "dots" | "ring" | string;
export type SpeedKey = "slow" | "normal" | "fast";

export interface SpinLoaderProps {
    size?: SizeKey;
    variant?: VariantKey;
    color?: string; // 'primary' | 'red' | 'blue' | '#ff0000' | 'rgb(...)' | any CSS color
    speed?: SpeedKey;
    className?: string; // extra classes applied to inner loader element
    wrapperClassName?: string; // override wrapper (centering) class if needed
    // role/aria: optional
    ariaLabel?: string;
}

/* Props forwarded to variant rendering functions */
export interface VariantRenderProps {
    sizePx: number;
    colorValue: string; // resolved CSS color value (hex or rgb)
    duration: string; // e.g. '1.5s'
    className?: string;
}

/* -----------------------
   Variant registry (extensible)
   ----------------------- */
const variantRegistry = new Map<string, (props: VariantRenderProps) => ReactElement>();

/**
 * Register a new variant renderer to the global registry.
 * This allows consumers to add custom loader types at runtime.
 */
export const registerSpinVariant = (
    name: string,
    renderer: (props: VariantRenderProps) => ReactElement
) => {
    variantRegistry.set(name, renderer);
};

/* -----------------------
   Helpers
   ----------------------- */

/** Default fallback primary color (Tailwind blue-500) */
const DEFAULT_PRIMARY = "#3b82f6";

/** Try to read --color-primary-500 CSS variable or detect via a `bg-primary-500` element. */
const detectPrimaryColor = (): string => {
    try {
        const root = document.documentElement;
        const cssVar = getComputedStyle(root).getPropertyValue("--color-primary-500")?.trim();
        if (cssVar) return cssVar;

        // Fallback: append a temporary element with Tailwind bg class and read computed background
        const el = document.createElement("div");
        el.className = "bg-primary-500";
        el.style.position = "absolute";
        el.style.left = "-9999px";
        el.style.top = "-9999px";
        el.style.opacity = "0";
        document.body.appendChild(el);
        const computed = getComputedStyle(el).backgroundColor;
        document.body.removeChild(el);

        if (computed && computed !== "rgba(0, 0, 0, 0)" && computed !== "transparent") return computed;
    } catch {
        // ignore
    }
    return DEFAULT_PRIMARY;
};

/** Resolve color param to a usable CSS color string.
 *  - If color === 'primary' -> detected primary color
 *  - If color is a named color we map to hex
 *  - else we return the value passed (assume valid CSS color like '#fff' or 'rgb(...)')
 */
const resolveColorValue = (color: string | undefined, primary: string): string => {
    if (!color || color === "primary") return primary;

    const named: Record<string, string> = {
        red: "#ef4444",
        blue: "#3b82f6",
        green: "#10b981",
        yellow: "#f59e0b",
        purple: "#8b5cf6",
        pink: "#ec4899",
        indigo: "#6366f1",
        teal: "#14b8a6",
        orange: "#f97316",
        // add more if you want
    };

    if (named[color]) return named[color];
    return color;
};

/* -----------------------
   Size + speed maps
   ----------------------- */
/** px widths for loader main container (keeps aspect-ratio in variants that need it) */
const SIZE_MAP: Record<SizeKey, number> = {
    xs: 20,
    sm: 30,
    md: 50,
    lg: 72,
    xl: 96,
};

const SPEED_MAP: Record<SpeedKey, string> = {
    slow: "2s",
    normal: "1.5s",
    fast: "1s",
};

/* -----------------------
   Built-in variants
   ----------------------- */

/**
 * ModernSpin: replicates conic-gradient + two animated layers (s and -s) like your original CSS
 */
const ModernSpinVariant: FC<VariantRenderProps> = ({ sizePx, colorValue, duration, className }) => {
    const styleOuter: CSSProperties = {
        width: `${sizePx}px`,
        aspectRatio: "1.154",
        position: "relative",
        // conic gradient uses the resolved color
        background: `conic-gradient(from 120deg at 50% 64%, transparent, ${colorValue} 1deg 120deg, transparent 121deg)`,
        animation: `sl-rotate-0 ${duration} infinite cubic-bezier(0.3,1,0,1)`,
    };

    const childCommon: CSSProperties = {
        position: "absolute",
        inset: "0",
        background: "inherit",
        transformOrigin: "50% 66%",
        animation: `sl-rotate-1 ${duration} infinite`,
    } as CSSProperties;

    return (
        <div className={className} style={styleOuter} aria-hidden>
            <div style={childCommon as CSSProperties} />
            <div style={{ ...childCommon, ["--s" as any]: -1 } as CSSProperties} />
        </div>
    );
};

/**
 * ClassicSpin: simple bordered spinner where top border is the highlight
 */
const ClassicSpinVariant: FC<VariantRenderProps> = ({ sizePx, colorValue, duration, className }) => {
    const stroke = colorValue;
    const base = `${stroke}55`; // best-effort translucent fallback; if colorValue is rgb(), this will not work well -> keep simple
    const styleOuter: CSSProperties = {
        width: `${sizePx}px`,
        height: `${sizePx}px`,
        display: "inline-block",
        borderRadius: "9999px",
        borderStyle: "solid",
        borderWidth: Math.max(2, Math.round(sizePx * 0.08)),
        borderColor: base,
        borderTopColor: stroke,
        animation: `sl-spin ${duration} linear infinite`,
    };

    return <div className={className} style={styleOuter} aria-hidden />;
};

/**
 * Pulse: three dots scaling in sequence
 */
const PulseVariant: FC<VariantRenderProps> = ({ sizePx, colorValue, duration, className }) => {
    const dotSize = Math.max(6, Math.round(sizePx * 0.28));
    const wrapperStyle: CSSProperties = {
        display: "flex",
        gap: Math.round(dotSize / 2),
        alignItems: "center",
        justifyContent: "center",
    };
    const dotStyle = (delay: number): CSSProperties => ({
        width: `${dotSize}px`,
        height: `${dotSize}px`,
        borderRadius: "9999px",
        backgroundColor: colorValue,
        animation: `sl-pulse ${duration} infinite ${delay}s`,
    });

    return (
        <div className={className} style={wrapperStyle} aria-hidden>
            <div style={dotStyle(0)} />
            <div style={dotStyle(0.15)} />
            <div style={dotStyle(0.3)} />
        </div>
    );
};

/**
 * Dots: three small bouncing dots
 */
const DotsVariant: FC<VariantRenderProps> = ({ sizePx, colorValue, duration, className }) => {
    const dotSize = Math.max(6, Math.round(sizePx * 0.16));
    const wrapperStyle: CSSProperties = {
        display: "flex",
        gap: Math.round(dotSize / 2),
        alignItems: "center",
        justifyContent: "center",
    };
    const dotStyle = (delay: number): CSSProperties => ({
        width: `${dotSize}px`,
        height: `${dotSize}px`,
        borderRadius: "9999px",
        backgroundColor: colorValue,
        animation: `sl-bounce ${duration} infinite ${delay}s`,
    });

    return (
        <div className={className} style={wrapperStyle} aria-hidden>
            <div style={dotStyle(0)} />
            <div style={dotStyle(0.12)} />
            <div style={dotStyle(0.24)} />
        </div>
    );
};

/**
 * Ring: bordered ring with left color highlight
 */
const RingVariant: FC<VariantRenderProps> = ({ sizePx, colorValue, duration, className }) => {
    const border = Math.max(3, Math.round(sizePx * 0.08));
    const styleOuter: CSSProperties = {
        width: `${sizePx}px`,
        height: `${sizePx}px`,
        borderRadius: "9999px",
        borderStyle: "solid",
        borderWidth: border,
        borderColor: `${colorValue}33`,
        borderLeftColor: colorValue,
        animation: `sl-spin ${duration} linear infinite`,
    };

    return <div className={className} style={styleOuter} aria-hidden />;
};

/* Register built-in variants */
variantRegistry.set("modern", ModernSpinVariant);
variantRegistry.set("classic", ClassicSpinVariant);
variantRegistry.set("pulse", PulseVariant);
variantRegistry.set("dots", DotsVariant);
variantRegistry.set("ring", RingVariant);

/* -----------------------
   Main component
   ----------------------- */
const CENTER_CLASS = "absolute top-2/4 left-1/2 -translate-x-1/2 -translate-y-1/2";

const SpinLoader: FC<SpinLoaderProps> = ({
                                             size = "md",
                                             variant = "modern",
                                             color = "primary",
                                             speed = "normal",
                                             className = "",
                                             wrapperClassName,
                                             ariaLabel = "Loading",
                                         }) => {
    // detect primary color once (on mount)
    const [primaryColor, setPrimaryColor] = useState<string>(DEFAULT_PRIMARY);
    useEffect(() => {
        const c = detectPrimaryColor();
        setPrimaryColor(c);
    }, []);

    // resolved values (memoized)
    const sizePx = useMemo(() => SIZE_MAP[size] ?? SIZE_MAP.md, [size]);
    const duration = useMemo(() => SPEED_MAP[speed] ?? SPEED_MAP.normal, [speed]);
    const colorValue = useMemo(() => resolveColorValue(color, primaryColor), [color, primaryColor]);

    // pick variant renderer
    const renderer = variantRegistry.get(variant) ?? variantRegistry.get("modern")!;

    // wrapper class (use provided or default center class)
    const outerClass = wrapperClassName ?? CENTER_CLASS;

    return (
        <div className={outerClass} role="status" aria-label={ariaLabel}>
            {/* Render the selected variant */}
            {renderer({ sizePx, colorValue, duration, className })}

            {/* Scoped keyframes and helper animations (kept inside component to avoid global edits).
          This is lightweight and safe. If you instantiate many loaders you may get duplicates;
          that's fine for typical usage. */}
            <style>
                {`
          /* rotation (modern variant) */
          @keyframes sl-rotate-0 {
            0%, 30% { transform: rotate(0deg); }
            70%     { transform: rotate(120deg); }
            70.01%, 100% { transform: rotate(360deg); }
          }

          @keyframes sl-rotate-1 {
            0% { transform: rotate(calc(var(--s, 1) * 120deg)) translate(0); }
            30%,70% { transform: rotate(calc(var(--s, 1) * 120deg)) translate(calc(var(--s, 1) * -5px), 10px); }
            100% { transform: rotate(calc(var(--s, 1) * 120deg)) translate(0); }
          }

          /* generic spin used by classic / ring */
          @keyframes sl-spin {
            from { transform: rotate(0deg); }
            to   { transform: rotate(360deg); }
          }

          /* pulse scale for three dots */
          @keyframes sl-pulse {
            0% { transform: scale(1); opacity: 1; }
            50% { transform: scale(0.6); opacity: 0.6; }
            100% { transform: scale(1); opacity: 1; }
          }

          /* bounce for dots */
          @keyframes sl-bounce {
            0% { transform: translateY(0); opacity: 0.8; }
            40% { transform: translateY(-6px); opacity: 1; }
            100% { transform: translateY(0); opacity: 0.8; }
          }
        `}
            </style>
        </div>
    );
};

export default SpinLoader;
