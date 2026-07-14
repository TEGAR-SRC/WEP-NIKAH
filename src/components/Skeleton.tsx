export function Skeleton({ width, height, style }: { width?: number | string; height?: number | string; style?: React.CSSProperties }) {
  return (
    <div style={{
      width: width ?? "100%",
      height: height ?? 16,
      borderRadius: 6,
      background: "linear-gradient(90deg, var(--inv-border) 25%, rgba(174,116,0,0.08) 50%, var(--inv-border) 75%)",
      backgroundSize: "200% 100%",
      animation: "shimmer 1.2s ease-in-out infinite",
      ...style,
    }} />
  );
}

export function TableSkeleton({ rows = 5, cols = 5 }: { rows?: number; cols?: number }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, padding: 4 }}>
      <div style={{ display: "flex", gap: 8, marginBottom: 4 }}>
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} height={14} style={{ flex: 1 }} />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} style={{ display: "flex", gap: 8 }}>
          {Array.from({ length: cols }).map((_, c) => (
            <Skeleton key={c} height={12} style={{ flex: 1, opacity: 0.7 - r * 0.08 }} />
          ))}
        </div>
      ))}
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div style={{ padding: 16, borderRadius: 8, border: "1px solid var(--inv-border)", marginBottom: 16 }}>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} style={{ flex: "1 0 120px" }}>
            <Skeleton height={12} style={{ marginBottom: 4, width: "60%" }} />
            <Skeleton height={32} />
          </div>
        ))}
      </div>
      <Skeleton height={36} style={{ marginTop: 8 }} />
    </div>
  );
}
