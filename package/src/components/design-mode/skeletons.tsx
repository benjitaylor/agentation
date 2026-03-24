"use client";

import type { ComponentType } from "./types";

// =============================================================================
// Wireframe Skeleton Renderers
// =============================================================================
//
// Each component type gets a skeleton wireframe that scales to the given dimensions.
// Uses inline styles referencing CSS custom properties from the layout mode overlay.

type SkeletonProps = { width: number; height: number; text?: string };

function Bar({ w, h = 3, strong }: { w: number | string; h?: number; strong?: boolean }) {
  return (
    <div
      style={{
        width: typeof w === "number" ? `${w}px` : w,
        height: h,
        borderRadius: 2,
        background: strong ? "var(--agd-bar-strong)" : "var(--agd-bar)",
        flexShrink: 0,
      }}
    />
  );
}

function Block({
  w,
  h,
  radius = 3,
  style,
}: {
  w: number | string;
  h: number | string;
  radius?: number;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={{
        width: typeof w === "number" ? `${w}px` : w,
        height: typeof h === "number" ? `${h}px` : h,
        borderRadius: radius,
        border: "1px dashed var(--agd-stroke)",
        background: "var(--agd-fill)",
        flexShrink: 0,
        ...style,
      }}
    />
  );
}

function Circle({ size }: { size: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        border: "1px dashed var(--agd-stroke)",
        background: "var(--agd-fill)",
        flexShrink: 0,
      }}
    />
  );
}

// --- Skeleton renderers per type ---

function NavigationSkeleton({ width, height }: SkeletonProps) {
  const pad = Math.max(8, height * 0.2);
  return (
    <div style={{ display: "flex", alignItems: "center", height: "100%", padding: `0 ${pad}px`, gap: width * 0.02 }}>
      <Block w={Math.max(20, height * 0.5)} h={Math.max(12, height * 0.4)} radius={2} />
      <div style={{ flex: 1, display: "flex", gap: width * 0.03, marginLeft: width * 0.04 }}>
        <Bar w={width * 0.06} />
        <Bar w={width * 0.07} />
        <Bar w={width * 0.05} />
        <Bar w={width * 0.06} />
      </div>
      <Block w={width * 0.1} h={Math.min(28, height * 0.5)} radius={4} />
    </div>
  );
}

function HeroSkeleton({ width, height, text }: SkeletonProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: height * 0.05 }}>
      {text ? (
        <span style={{ fontSize: Math.min(20, height * 0.08), fontWeight: 600, color: "var(--agd-text-3)", textAlign: "center", maxWidth: "80%" }}>{text}</span>
      ) : (
        <Bar w={width * 0.5} h={Math.max(6, height * 0.04)} strong />
      )}
      <Bar w={width * 0.6} />
      <Bar w={width * 0.4} />
      <Block w={Math.min(140, width * 0.2)} h={Math.min(36, height * 0.12)} radius={6} style={{ marginTop: height * 0.06 }} />
    </div>
  );
}

function SidebarSkeleton({ width, height }: SkeletonProps) {
  const items = Math.max(3, Math.floor(height / 36));
  return (
    <div style={{ padding: width * 0.08, display: "flex", flexDirection: "column", gap: height * 0.03 }}>
      <Bar w={width * 0.6} h={4} strong />
      {Array.from({ length: items }, (_, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <Block w={10} h={10} radius={2} />
          <Bar w={width * (0.4 + ((i * 17) % 30) / 100)} />
        </div>
      ))}
    </div>
  );
}

function FooterSkeleton({ width, height }: SkeletonProps) {
  const cols = Math.max(2, Math.min(4, Math.floor(width / 160)));
  return (
    <div style={{ display: "flex", padding: `${height * 0.12}px ${width * 0.03}px`, gap: width * 0.05 }}>
      {Array.from({ length: cols }, (_, i) => (
        <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
          <Bar w="60%" h={3} strong />
          <Bar w="80%" h={2} />
          <Bar w="70%" h={2} />
          <Bar w="60%" h={2} />
        </div>
      ))}
    </div>
  );
}

function ModalSkeleton({ width, height }: SkeletonProps) {
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "10px 12px", borderBottom: "1px solid var(--agd-stroke)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Bar w={width * 0.3} h={4} strong />
        <div style={{ width: 14, height: 14, border: "1px solid var(--agd-stroke)", borderRadius: 3 }} />
      </div>
      <div style={{ flex: 1, padding: 12, display: "flex", flexDirection: "column", gap: 6 }}>
        <Bar w="90%" />
        <Bar w="70%" />
        <Bar w="80%" />
      </div>
      <div style={{ padding: "10px 12px", borderTop: "1px solid var(--agd-stroke)", display: "flex", justifyContent: "flex-end", gap: 8 }}>
        <Block w={70} h={26} radius={4} />
        <Block w={70} h={26} radius={4} style={{ background: "var(--agd-bar)" }} />
      </div>
    </div>
  );
}

function CardSkeleton({ width, height }: SkeletonProps) {
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ height: "40%", background: "var(--agd-fill)", borderBottom: "1px dashed var(--agd-stroke)" }} />
      <div style={{ flex: 1, padding: 10, display: "flex", flexDirection: "column", gap: 5 }}>
        <Bar w="70%" h={4} strong />
        <Bar w="95%" h={2} />
        <Bar w="85%" h={2} />
        <Bar w="50%" h={2} />
      </div>
    </div>
  );
}

function TextSkeleton({ width, height, text }: SkeletonProps) {
  if (text) {
    return (
      <div style={{ padding: 4, fontSize: Math.min(14, height * 0.3), lineHeight: 1.5, color: "var(--agd-text-3)", wordBreak: "break-word", overflow: "hidden" }}>
        {text}
      </div>
    );
  }
  const lines = Math.max(2, Math.floor(height / 18));
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, padding: 4 }}>
      <Bar w={width * 0.6} h={5} strong />
      {Array.from({ length: lines }, (_, i) => (
        <Bar key={i} w={`${70 + ((i * 13) % 25)}%`} h={2} />
      ))}
    </div>
  );
}

function ImageSkeleton({ width, height }: SkeletonProps) {
  return (
    <div style={{ height: "100%", position: "relative" }}>
      <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" fill="none">
        <line x1="0" y1="0" x2={width} y2={height} stroke="var(--agd-stroke)" strokeWidth="1" />
        <line x1={width} y1="0" x2="0" y2={height} stroke="var(--agd-stroke)" strokeWidth="1" />
        <circle cx={width * 0.3} cy={height * 0.3} r={Math.min(width, height) * 0.08} fill="var(--agd-fill)" stroke="var(--agd-stroke)" strokeWidth="0.8" />
      </svg>
    </div>
  );
}

function TableSkeleton({ width, height }: SkeletonProps) {
  const cols = Math.max(2, Math.min(5, Math.floor(width / 100)));
  const rows = Math.max(2, Math.min(6, Math.floor(height / 32)));
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", borderBottom: "1px solid var(--agd-stroke)", padding: "6px 0" }}>
        {Array.from({ length: cols }, (_, i) => (
          <div key={i} style={{ flex: 1, padding: "0 8px" }}><Bar w="70%" h={3} strong /></div>
        ))}
      </div>
      {Array.from({ length: rows }, (_, r) => (
        <div key={r} style={{ display: "flex", borderBottom: "1px solid rgba(255,255,255,0.03)", padding: "6px 0" }}>
          {Array.from({ length: cols }, (_, c) => (
            <div key={c} style={{ flex: 1, padding: "0 8px" }}><Bar w={`${50 + ((r * 7 + c * 13) % 40)}%`} h={2} /></div>
          ))}
        </div>
      ))}
    </div>
  );
}

function ListSkeleton({ width, height }: SkeletonProps) {
  const items = Math.max(2, Math.floor(height / 28));
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4, padding: 4 }}>
      {Array.from({ length: items }, (_, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 0" }}>
          <Circle size={8} />
          <Bar w={`${55 + ((i * 17) % 35)}%`} h={2} />
        </div>
      ))}
    </div>
  );
}

function ButtonSkeleton({ width, height, text }: SkeletonProps) {
  return (
    <div style={{
      height: "100%",
      borderRadius: Math.min(8, height / 3),
      border: "1px solid var(--agd-stroke)",
      background: "var(--agd-fill)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}>
      {text ? (
        <span style={{ fontSize: Math.min(13, height * 0.4), fontWeight: 500, color: "var(--agd-text-3)", letterSpacing: "-0.01em" }}>{text}</span>
      ) : (
        <Bar w={Math.max(20, width * 0.5)} h={3} strong />
      )}
    </div>
  );
}

function InputSkeleton({ width, height }: SkeletonProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4, height: "100%", justifyContent: "center" }}>
      <Bar w={Math.min(80, width * 0.3)} h={2} />
      <div style={{
        height: Math.min(36, height * 0.6),
        borderRadius: 4,
        border: "1px dashed var(--agd-stroke)",
        background: "var(--agd-fill)",
        display: "flex",
        alignItems: "center",
        paddingLeft: 8,
      }}>
        <Bar w="40%" h={2} />
      </div>
    </div>
  );
}

function FormSkeleton({ width, height }: SkeletonProps) {
  const fields = Math.max(2, Math.min(5, Math.floor(height / 56)));
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: height * 0.04, padding: 8 }}>
      {Array.from({ length: fields }, (_, i) => (
        <div key={i} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <Bar w={60 + ((i * 17) % 30)} h={2} />
          <Block w="100%" h={28} radius={4} />
        </div>
      ))}
      <Block w={Math.min(120, width * 0.35)} h={30} radius={6} style={{ marginTop: 8, alignSelf: "flex-end", background: "var(--agd-bar)" }} />
    </div>
  );
}

function TabsSkeleton({ width, height }: SkeletonProps) {
  const tabCount = Math.max(2, Math.min(4, Math.floor(width / 120)));
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", gap: 2, borderBottom: "1px solid var(--agd-stroke)" }}>
        {Array.from({ length: tabCount }, (_, i) => (
          <div key={i} style={{ padding: "8px 12px", borderBottom: i === 0 ? "2px solid var(--agd-bar-strong)" : "none" }}>
            <Bar w={60} h={3} strong={i === 0} />
          </div>
        ))}
      </div>
      <div style={{ flex: 1, padding: 12, display: "flex", flexDirection: "column", gap: 6 }}>
        <Bar w="80%" h={2} />
        <Bar w="65%" h={2} />
        <Bar w="75%" h={2} />
      </div>
    </div>
  );
}

function AvatarSkeleton({ width, height }: SkeletonProps) {
  const r = Math.min(width, height) / 2;
  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} fill="none">
      <circle cx={width / 2} cy={height / 2} r={r - 1} stroke="var(--agd-stroke)" fill="var(--agd-fill)" strokeWidth="1.5" strokeDasharray="3 2" />
      <circle cx={width / 2} cy={height * 0.38} r={r * 0.28} stroke="var(--agd-stroke)" fill="var(--agd-fill)" strokeWidth="0.8" />
      <path
        d={`M${width / 2 - r * 0.55} ${height * 0.78} C${width / 2 - r * 0.55} ${height * 0.55} ${width / 2 + r * 0.55} ${height * 0.55} ${width / 2 + r * 0.55} ${height * 0.78}`}
        stroke="var(--agd-stroke)"
        fill="var(--agd-fill)"
        strokeWidth="0.8"
      />
    </svg>
  );
}

function BadgeSkeleton({ width, height }: SkeletonProps) {
  return (
    <div style={{
      height: "100%",
      borderRadius: height / 2,
      border: "1px solid var(--agd-stroke)",
      background: "var(--agd-fill)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}>
      <Bar w={Math.max(16, width * 0.5)} h={2} strong />
    </div>
  );
}

function HeaderSkeleton({ width, height }: SkeletonProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: height * 0.08 }}>
      <Bar w={width * 0.5} h={Math.max(5, height * 0.06)} strong />
      <Bar w={width * 0.35} />
    </div>
  );
}

function SectionSkeleton({ width, height }: SkeletonProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", gap: height * 0.04, padding: width * 0.04 }}>
      <Bar w={width * 0.3} h={4} strong />
      <Bar w={width * 0.7} />
      <Bar w={width * 0.5} />
      <div style={{ flex: 1, display: "flex", gap: width * 0.03, marginTop: height * 0.06 }}>
        <Block w="33%" h="100%" radius={4} />
        <Block w="33%" h="100%" radius={4} />
        <Block w="33%" h="100%" radius={4} />
      </div>
    </div>
  );
}

function GridSkeleton({ width, height }: SkeletonProps) {
  const cols = Math.max(2, Math.min(4, Math.floor(width / 140)));
  const rows = Math.max(1, Math.min(3, Math.floor(height / 120)));
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gridTemplateRows: `repeat(${rows}, 1fr)`, gap: 6, height: "100%" }}>
      {Array.from({ length: cols * rows }, (_, i) => (
        <Block key={i} w="100%" h="100%" radius={4} />
      ))}
    </div>
  );
}

function DropdownSkeleton({ width, height }: SkeletonProps) {
  const items = Math.max(2, Math.floor((height - 32) / 28));
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "6px 8px", borderBottom: "1px solid var(--agd-stroke)" }}>
        <Bar w={width * 0.5} h={3} strong />
      </div>
      <div style={{ flex: 1, padding: 4, display: "flex", flexDirection: "column", gap: 2 }}>
        {Array.from({ length: items }, (_, i) => (
          <div key={i} style={{ padding: "4px 6px", borderRadius: 3, background: i === 0 ? "var(--agd-fill)" : "transparent" }}>
            <Bar w={`${50 + ((i * 17) % 35)}%`} h={2} strong={i === 0} />
          </div>
        ))}
      </div>
    </div>
  );
}

function ToggleSkeleton({ width, height }: SkeletonProps) {
  const r = Math.min(width, height) / 2;
  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} fill="none">
      <rect x="1" y="1" width={width - 2} height={height - 2} rx={r} stroke="var(--agd-stroke)" strokeWidth="1" />
      <circle cx={width - r} cy={height / 2} r={r * 0.7} fill="var(--agd-bar)" />
    </svg>
  );
}

function SearchSkeleton({ width, height }: SkeletonProps) {
  const r = Math.min(height / 2, 20);
  return (
    <div style={{ height: "100%", borderRadius: r, border: "1px dashed var(--agd-stroke)", background: "var(--agd-fill)", display: "flex", alignItems: "center", padding: `0 ${r * 0.6}px`, gap: 6 }}>
      <Circle size={Math.min(14, height * 0.4)} />
      <Bar w="50%" h={2} />
    </div>
  );
}

function ToastSkeleton({ width, height }: SkeletonProps) {
  return (
    <div style={{ height: "100%", borderRadius: 8, border: "1px dashed var(--agd-stroke)", background: "var(--agd-fill)", display: "flex", alignItems: "center", padding: "0 10px", gap: 8 }}>
      <Circle size={Math.min(20, height * 0.5)} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 3 }}>
        <Bar w="60%" h={3} strong />
        <Bar w="80%" h={2} />
      </div>
      <div style={{ width: 14, height: 14, border: "1px solid var(--agd-stroke)", borderRadius: 3, flexShrink: 0 }} />
    </div>
  );
}

function ProgressSkeleton({ width, height }: SkeletonProps) {
  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} fill="none">
      <rect x="0" y="0" width={width} height={height} rx={height / 2} stroke="var(--agd-stroke)" strokeWidth="0.8" />
      <rect x="1" y="1" width={width * 0.65} height={height - 2} rx={(height - 2) / 2} fill="var(--agd-bar)" />
    </svg>
  );
}

function ChartSkeleton({ width, height }: SkeletonProps) {
  const bars = Math.max(3, Math.min(7, Math.floor(width / 50)));
  const barW = width / (bars * 2);
  return (
    <div style={{ height: "100%", display: "flex", alignItems: "flex-end", justifyContent: "space-around", padding: "0 4px", borderBottom: "1px solid var(--agd-stroke)" }}>
      {Array.from({ length: bars }, (_, i) => {
        const h = 30 + ((i * 37 + 17) % 55);
        return <Block key={i} w={barW} h={`${h}%`} radius={2} />;
      })}
    </div>
  );
}

function VideoSkeleton({ width, height }: SkeletonProps) {
  const btnR = Math.min(width, height) * 0.12;
  return (
    <div style={{ height: "100%", position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Block w="100%" h="100%" radius={4} />
      <div style={{ position: "absolute", width: btnR * 2, height: btnR * 2, borderRadius: "50%", border: "1.5px solid var(--agd-stroke)", background: "var(--agd-fill)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 0, height: 0, borderLeft: `${btnR * 0.6}px solid var(--agd-bar-strong)`, borderTop: `${btnR * 0.4}px solid transparent`, borderBottom: `${btnR * 0.4}px solid transparent`, marginLeft: btnR * 0.15 }} />
      </div>
    </div>
  );
}

function TooltipSkeleton({ width, height }: SkeletonProps) {
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ flex: 1, width: "100%", borderRadius: 6, border: "1px dashed var(--agd-stroke)", background: "var(--agd-fill)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Bar w="60%" h={2} />
      </div>
      <div style={{ width: 8, height: 8, background: "var(--agd-fill)", border: "1px dashed var(--agd-stroke)", borderTop: "none", borderLeft: "none", transform: "rotate(45deg)", marginTop: -5 }} />
    </div>
  );
}

function BreadcrumbSkeleton({ width, height }: SkeletonProps) {
  const items = Math.max(2, Math.min(4, Math.floor(width / 80)));
  return (
    <div style={{ display: "flex", alignItems: "center", height: "100%", gap: 4 }}>
      {Array.from({ length: items }, (_, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 4 }}>
          {i > 0 && <span style={{ color: "var(--agd-stroke)", fontSize: 10 }}>/</span>}
          <Bar w={40 + ((i * 13) % 20)} h={2} strong={i === items - 1} />
        </div>
      ))}
    </div>
  );
}

function PaginationSkeleton({ width, height }: SkeletonProps) {
  const count = Math.max(3, Math.min(5, Math.floor(width / 40)));
  const sz = Math.min(28, height * 0.8);
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", gap: 4 }}>
      {Array.from({ length: count }, (_, i) => (
        <Block key={i} w={sz} h={sz} radius={4} style={i === 1 ? { background: "var(--agd-bar)" } : undefined} />
      ))}
    </div>
  );
}

function DividerSkeleton({ width }: SkeletonProps) {
  return (
    <div style={{ display: "flex", alignItems: "center", height: "100%" }}>
      <div style={{ width: "100%", height: 1, background: "var(--agd-stroke)" }} />
    </div>
  );
}

function AccordionSkeleton({ width, height }: SkeletonProps) {
  const items = Math.max(2, Math.min(4, Math.floor(height / 40)));
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {Array.from({ length: items }, (_, i) => (
        <div key={i} style={{ borderBottom: "1px solid var(--agd-stroke)", padding: "8px 6px", display: "flex", alignItems: "center", justifyContent: "space-between", flex: i === 0 ? 2 : 1 }}>
          <Bar w={`${40 + ((i * 17) % 25)}%`} h={3} strong />
          <span style={{ fontSize: 8, color: "var(--agd-stroke)" }}>{i === 0 ? "▼" : "▶"}</span>
        </div>
      ))}
    </div>
  );
}

function CarouselSkeleton({ width, height }: SkeletonProps) {
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", gap: 6 }}>
      <div style={{ flex: 1, display: "flex", gap: 6, alignItems: "center" }}>
        <span style={{ fontSize: 12, color: "var(--agd-stroke)" }}>‹</span>
        <Block w="100%" h="100%" radius={4} />
        <span style={{ fontSize: 12, color: "var(--agd-stroke)" }}>›</span>
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: 4 }}>
        <Circle size={5} />
        <Circle size={5} />
        <Circle size={5} />
      </div>
    </div>
  );
}

function PricingSkeleton({ width, height }: SkeletonProps) {
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", padding: 10, gap: height * 0.04 }}>
      <Bar w={width * 0.4} h={3} strong />
      <Bar w={width * 0.3} h={6} strong />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4, width: "100%", padding: "8px 0" }}>
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <Circle size={5} />
            <Bar w={`${50 + ((i * 17) % 35)}%`} h={2} />
          </div>
        ))}
      </div>
      <Block w={width * 0.7} h={Math.min(32, height * 0.1)} radius={6} style={{ background: "var(--agd-bar)" }} />
    </div>
  );
}

function TestimonialSkeleton({ width, height }: SkeletonProps) {
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", padding: 10, gap: 8 }}>
      <span style={{ fontSize: 18, lineHeight: 1, color: "var(--agd-stroke)", fontFamily: "serif" }}>&ldquo;</span>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
        <Bar w="90%" h={2} />
        <Bar w="75%" h={2} />
        <Bar w="60%" h={2} />
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <Circle size={20} />
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Bar w={60} h={3} strong />
          <Bar w={40} h={2} />
        </div>
      </div>
    </div>
  );
}

function CtaSkeleton({ width, height }: SkeletonProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: height * 0.08 }}>
      <Bar w={width * 0.5} h={Math.max(4, height * 0.05)} strong />
      <Bar w={width * 0.35} />
      <Block w={Math.min(140, width * 0.25)} h={Math.min(32, height * 0.15)} radius={6} style={{ marginTop: height * 0.04, background: "var(--agd-bar)" }} />
    </div>
  );
}

function AlertSkeleton({ width, height }: SkeletonProps) {
  return (
    <div style={{ height: "100%", borderRadius: 6, border: "1px dashed var(--agd-stroke)", background: "var(--agd-fill)", display: "flex", alignItems: "center", padding: "0 10px", gap: 8 }}>
      <div style={{ width: 16, height: 16, borderRadius: "50%", border: "1.5px solid var(--agd-bar-strong)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <div style={{ width: 2, height: 6, background: "var(--agd-bar-strong)", borderRadius: 1 }} />
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 3 }}>
        <Bar w="40%" h={3} strong />
        <Bar w="70%" h={2} />
      </div>
    </div>
  );
}

function BannerSkeleton({ width, height }: SkeletonProps) {
  return (
    <div style={{ height: "100%", background: "var(--agd-fill)", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "0 12px" }}>
      <Bar w={width * 0.4} h={3} strong />
      <Block w={60} h={Math.min(24, height * 0.6)} radius={4} />
    </div>
  );
}

function StatSkeleton({ width, height }: SkeletonProps) {
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: height * 0.06 }}>
      <Bar w={width * 0.5} h={2} />
      <Bar w={width * 0.4} h={Math.max(8, height * 0.18)} strong />
      <Bar w={width * 0.3} h={2} />
    </div>
  );
}

function StepperSkeleton({ width, height }: SkeletonProps) {
  const steps = Math.max(3, Math.min(5, Math.floor(width / 100)));
  const dotR = Math.min(12, height * 0.35);
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: "100%", padding: "0 8px" }}>
      {Array.from({ length: steps }, (_, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 0, flex: 1 }}>
          <div style={{ width: dotR, height: dotR, borderRadius: "50%", border: "1.5px solid var(--agd-stroke)", background: i === 0 ? "var(--agd-bar)" : "transparent", flexShrink: 0 }} />
          {i < steps - 1 && <div style={{ flex: 1, height: 1, background: "var(--agd-stroke)", margin: "0 4px" }} />}
        </div>
      ))}
    </div>
  );
}

function TagSkeleton({ width, height }: SkeletonProps) {
  return (
    <div style={{ height: "100%", borderRadius: 4, border: "1px solid var(--agd-stroke)", background: "var(--agd-fill)", display: "flex", alignItems: "center", justifyContent: "center", gap: 4, padding: "0 6px" }}>
      <Bar w={Math.max(16, width * 0.5)} h={2} strong />
      <div style={{ width: 8, height: 8, borderRadius: "50%", border: "1px solid var(--agd-stroke)", flexShrink: 0 }} />
    </div>
  );
}

function RatingSkeleton({ width, height }: SkeletonProps) {
  const stars = 5;
  const sz = Math.min(height * 0.7, width / (stars * 1.5));
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", gap: sz * 0.2 }}>
      {Array.from({ length: stars }, (_, i) => (
        <svg key={i} width={sz} height={sz} viewBox="0 0 16 16" fill="none">
          <path d="M8 1.5l2 4 4.5.7-3.25 3.1.75 4.5L8 11.4l-4 2.4.75-4.5L1.5 6.2 6 5.5z" stroke="var(--agd-stroke)" strokeWidth="0.8" fill={i < 3 ? "var(--agd-bar)" : "none"} />
        </svg>
      ))}
    </div>
  );
}

function MapSkeleton({ width, height }: SkeletonProps) {
  return (
    <div style={{ height: "100%", position: "relative", borderRadius: 4, border: "1px dashed var(--agd-stroke)", background: "var(--agd-fill)", overflow: "hidden" }}>
      <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} fill="none" style={{ position: "absolute", inset: 0 }}>
        <line x1={0} y1={height * 0.3} x2={width} y2={height * 0.7} stroke="var(--agd-stroke)" strokeWidth="0.5" opacity=".2" />
        <line x1={0} y1={height * 0.6} x2={width} y2={height * 0.2} stroke="var(--agd-stroke)" strokeWidth="0.5" opacity=".15" />
        <line x1={width * 0.4} y1={0} x2={width * 0.6} y2={height} stroke="var(--agd-stroke)" strokeWidth="0.5" opacity=".15" />
      </svg>
      <div style={{ position: "absolute", left: "50%", top: "40%", transform: "translate(-50%, -100%)" }}>
        <svg width="16" height="22" viewBox="0 0 16 22" fill="none">
          <path d="M8 0C3.6 0 0 3.6 0 8c0 6 8 14 8 14s8-8 8-14c0-4.4-3.6-8-8-8z" fill="var(--agd-bar)" opacity=".4" />
          <circle cx="8" cy="8" r="3" fill="var(--agd-fill)" />
        </svg>
      </div>
    </div>
  );
}

function TimelineSkeleton({ width, height }: SkeletonProps) {
  const items = Math.max(3, Math.min(5, Math.floor(height / 60)));
  return (
    <div style={{ display: "flex", height: "100%", padding: "8px 0" }}>
      <div style={{ width: 16, display: "flex", flexDirection: "column", alignItems: "center" }}>
        {Array.from({ length: items }, (_, i) => (
          <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
            <Circle size={8} />
            {i < items - 1 && <div style={{ flex: 1, width: 1, background: "var(--agd-stroke)" }} />}
          </div>
        ))}
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-around", paddingLeft: 8 }}>
        {Array.from({ length: items }, (_, i) => (
          <div key={i} style={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Bar w={`${35 + ((i * 13) % 25)}%`} h={3} strong />
            <Bar w={`${50 + ((i * 17) % 30)}%`} h={2} />
          </div>
        ))}
      </div>
    </div>
  );
}

function FileUploadSkeleton({ width, height }: SkeletonProps) {
  return (
    <div style={{ height: "100%", borderRadius: 8, border: "2px dashed var(--agd-stroke)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: height * 0.06 }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M12 16V4m0 0l-4 4m4-4l4 4" stroke="var(--agd-stroke)" strokeWidth="1.5" />
        <path d="M4 17v2a1 1 0 001 1h14a1 1 0 001-1v-2" stroke="var(--agd-stroke)" strokeWidth="1.5" />
      </svg>
      <Bar w={width * 0.4} h={2} />
      <Bar w={width * 0.25} h={2} />
    </div>
  );
}

function CodeBlockSkeleton({ width, height }: SkeletonProps) {
  const lines = Math.max(3, Math.min(8, Math.floor(height / 20)));
  return (
    <div style={{ height: "100%", borderRadius: 6, background: "var(--agd-fill)", border: "1px solid var(--agd-stroke)", padding: 8, display: "flex", flexDirection: "column", gap: 4 }}>
      <div style={{ display: "flex", gap: 3, marginBottom: 4 }}>
        <Circle size={6} />
        <Circle size={6} />
        <Circle size={6} />
      </div>
      {Array.from({ length: lines }, (_, i) => (
        <div key={i} style={{ display: "flex", gap: 6, paddingLeft: ((i > 0 && i < lines - 1) ? 12 : 0) }}>
          <Bar w={`${25 + ((i * 23) % 50)}%`} h={2} strong={i === 0} />
        </div>
      ))}
    </div>
  );
}

function CalendarSkeleton({ width, height }: SkeletonProps) {
  const cols = 7;
  const rows = 5;
  const cellSz = Math.min((width - 16) / cols, (height - 40) / (rows + 1));
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 8px" }}>
        <span style={{ fontSize: 8, color: "var(--agd-stroke)" }}>‹</span>
        <Bar w={width * 0.3} h={3} strong />
        <span style={{ fontSize: 8, color: "var(--agd-stroke)" }}>›</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 2, padding: "0 4px", flex: 1 }}>
        {Array.from({ length: cols }, (_, i) => (
          <div key={`h${i}`} style={{ display: "flex", alignItems: "center", justifyContent: "center", height: cellSz * 0.6 }}>
            <Bar w={cellSz * 0.5} h={2} />
          </div>
        ))}
        {Array.from({ length: cols * rows }, (_, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "center", height: cellSz }}>
            <div style={{ width: cellSz * 0.6, height: cellSz * 0.6, borderRadius: "50%", background: i === 12 ? "var(--agd-bar)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ width: 2, height: 2, borderRadius: 1, background: "var(--agd-bar-strong)", opacity: i === 12 ? 1 : 0.3 }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function NotificationSkeleton({ width, height }: SkeletonProps) {
  return (
    <div style={{ height: "100%", borderRadius: 8, border: "1px dashed var(--agd-stroke)", background: "var(--agd-fill)", display: "flex", alignItems: "center", padding: "0 10px", gap: 8 }}>
      <Circle size={Math.min(32, height * 0.55)} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 3 }}>
        <Bar w="50%" h={3} strong />
        <Bar w="75%" h={2} />
      </div>
      <Bar w={30} h={2} />
    </div>
  );
}

function ProductCardSkeleton({ width, height }: SkeletonProps) {
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ height: "50%", background: "var(--agd-fill)", borderBottom: "1px dashed var(--agd-stroke)" }} />
      <div style={{ flex: 1, padding: 10, display: "flex", flexDirection: "column", gap: 5 }}>
        <Bar w="65%" h={4} strong />
        <Bar w="40%" h={3} />
        <div style={{ flex: 1 }} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Bar w="30%" h={5} strong />
          <Block w={Math.min(70, width * 0.3)} h={26} radius={4} style={{ background: "var(--agd-bar)" }} />
        </div>
      </div>
    </div>
  );
}

function ProfileSkeleton({ width, height }: SkeletonProps) {
  const avatarSz = Math.min(48, height * 0.3);
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: height * 0.06 }}>
      <Circle size={avatarSz} />
      <Bar w={width * 0.45} h={4} strong />
      <Bar w={width * 0.3} h={2} />
      <div style={{ display: "flex", gap: width * 0.08, marginTop: height * 0.04 }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
          <Bar w={20} h={3} strong />
          <Bar w={28} h={2} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
          <Bar w={20} h={3} strong />
          <Bar w={28} h={2} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
          <Bar w={20} h={3} strong />
          <Bar w={28} h={2} />
        </div>
      </div>
    </div>
  );
}

function DrawerSkeleton({ width, height }: SkeletonProps) {
  const panelW = Math.max(width * 0.6, 80);
  const items = Math.max(3, Math.floor(height / 40));
  return (
    <div style={{ height: "100%", display: "flex" }}>
      <div style={{ width: width - panelW, background: "var(--agd-fill)", opacity: 0.3 }} />
      <div style={{ flex: 1, borderLeft: "1px solid var(--agd-stroke)", display: "flex", flexDirection: "column", padding: width * 0.04 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: height * 0.06 }}>
          <Bar w={panelW * 0.4} h={4} strong />
          <div style={{ width: 12, height: 12, border: "1px solid var(--agd-stroke)", borderRadius: 3 }} />
        </div>
        {Array.from({ length: items }, (_, i) => (
          <div key={i} style={{ padding: "6px 0" }}>
            <Bar w={`${50 + ((i * 17) % 35)}%`} h={2} strong={i === 0} />
          </div>
        ))}
      </div>
    </div>
  );
}

function PopoverSkeleton({ width, height }: SkeletonProps) {
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ flex: 1, width: "100%", borderRadius: 8, border: "1px dashed var(--agd-stroke)", background: "var(--agd-fill)", padding: 10, display: "flex", flexDirection: "column", gap: 5 }}>
        <Bar w="70%" h={3} strong />
        <Bar w="90%" h={2} />
        <Bar w="60%" h={2} />
      </div>
      <div style={{ width: 10, height: 10, background: "var(--agd-fill)", border: "1px dashed var(--agd-stroke)", borderTop: "none", borderLeft: "none", transform: "rotate(45deg)", marginTop: -6 }} />
    </div>
  );
}

function LogoSkeleton({ width, height }: SkeletonProps) {
  const iconSz = Math.min(height * 0.7, width * 0.3);
  return (
    <div style={{ height: "100%", display: "flex", alignItems: "center", gap: width * 0.08 }}>
      <Block w={iconSz} h={iconSz} radius={iconSz * 0.25} />
      <Bar w={width * 0.45} h={Math.max(4, height * 0.2)} strong />
    </div>
  );
}

function FaqSkeleton({ width, height }: SkeletonProps) {
  const items = Math.max(2, Math.min(5, Math.floor(height / 56)));
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {Array.from({ length: items }, (_, i) => (
        <div key={i} style={{ borderBottom: "1px solid var(--agd-stroke)", padding: "8px 6px", display: "flex", alignItems: "center", justifyContent: "space-between", flex: i === 0 ? 2 : 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 9, fontWeight: 700, color: "var(--agd-stroke)" }}>Q</span>
            <Bar w={width * (0.3 + ((i * 13) % 25) / 100)} h={3} strong />
          </div>
          <span style={{ fontSize: 8, color: "var(--agd-stroke)" }}>{i === 0 ? "▼" : "▶"}</span>
        </div>
      ))}
    </div>
  );
}

function GallerySkeleton({ width, height }: SkeletonProps) {
  const cols = Math.max(2, Math.min(4, Math.floor(width / 120)));
  const rows = Math.max(1, Math.min(3, Math.floor(height / 120)));
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gridTemplateRows: `repeat(${rows}, 1fr)`, gap: 4, height: "100%" }}>
      {Array.from({ length: cols * rows }, (_, i) => (
        <div key={i} style={{ borderRadius: 4, border: "1px dashed var(--agd-stroke)", background: "var(--agd-fill)", position: "relative", overflow: "hidden" }}>
          <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" fill="none">
            <line x1="0" y1="0" x2="100" y2="100" stroke="var(--agd-stroke)" strokeWidth="0.5" />
            <line x1="100" y1="0" x2="0" y2="100" stroke="var(--agd-stroke)" strokeWidth="0.5" />
          </svg>
        </div>
      ))}
    </div>
  );
}

function CheckboxSkeleton({ width, height }: SkeletonProps) {
  const sz = Math.min(width, height);
  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} fill="none">
      <rect x="1" y={(height - sz + 2) / 2} width={sz - 2} height={sz - 2} rx={sz * 0.15} stroke="var(--agd-stroke)" strokeWidth="1.5" />
      <path d={`M${sz * 0.25} ${height / 2}l${sz * 0.2} ${sz * 0.2} ${sz * 0.3}-${sz * 0.35}`} stroke="var(--agd-bar)" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function RadioSkeleton({ width, height }: SkeletonProps) {
  const r = Math.min(width, height) / 2 - 1;
  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} fill="none">
      <circle cx={width / 2} cy={height / 2} r={r} stroke="var(--agd-stroke)" strokeWidth="1.5" />
      <circle cx={width / 2} cy={height / 2} r={r * 0.45} fill="var(--agd-bar)" />
    </svg>
  );
}

function SliderSkeleton({ width, height }: SkeletonProps) {
  const trackH = Math.max(2, height * 0.12);
  const thumbR = Math.min(height * 0.35, 10);
  const fillW = width * 0.55;
  return (
    <div style={{ height: "100%", display: "flex", alignItems: "center", position: "relative" }}>
      <div style={{ width: "100%", height: trackH, borderRadius: trackH / 2, background: "var(--agd-fill)", border: "1px solid var(--agd-stroke)", position: "relative" }}>
        <div style={{ width: fillW, height: "100%", borderRadius: trackH / 2, background: "var(--agd-bar)" }} />
      </div>
      <div style={{ position: "absolute", left: fillW - thumbR, width: thumbR * 2, height: thumbR * 2, borderRadius: "50%", border: "1.5px solid var(--agd-stroke)", background: "var(--agd-fill)" }} />
    </div>
  );
}

function DatePickerSkeleton({ width, height }: SkeletonProps) {
  const inputH = Math.min(36, height * 0.15);
  const cols = 7;
  const rows = 4;
  const cellSz = Math.min((width - 16) / cols, (height - inputH - 40) / (rows + 1));
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", gap: 4 }}>
      <div style={{ height: inputH, borderRadius: 4, border: "1px dashed var(--agd-stroke)", background: "var(--agd-fill)", display: "flex", alignItems: "center", padding: "0 8px", justifyContent: "space-between" }}>
        <Bar w="40%" h={2} />
        <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><rect x="2" y="3" width="12" height="11" rx="1" stroke="var(--agd-stroke)" strokeWidth="1" /><line x1="2" y1="6" x2="14" y2="6" stroke="var(--agd-stroke)" strokeWidth="0.5" /></svg>
      </div>
      <div style={{ flex: 1, borderRadius: 6, border: "1px dashed var(--agd-stroke)", background: "var(--agd-fill)", display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "4px 6px" }}>
          <span style={{ fontSize: 7, color: "var(--agd-stroke)" }}>‹</span>
          <Bar w={width * 0.25} h={2} strong />
          <span style={{ fontSize: 7, color: "var(--agd-stroke)" }}>›</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 1, padding: "0 4px", flex: 1 }}>
          {Array.from({ length: cols * rows }, (_, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "center", height: cellSz }}>
              <div style={{ width: cellSz * 0.5, height: cellSz * 0.5, borderRadius: "50%", background: i === 10 ? "var(--agd-bar)" : "transparent" }}>
                <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ width: 1.5, height: 1.5, borderRadius: 1, background: "var(--agd-bar-strong)", opacity: i === 10 ? 1 : 0.25 }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SkeletonSkeletonRenderer({ width, height }: SkeletonProps) {
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", gap: height * 0.08, padding: 4 }}>
      <div style={{ width: "100%", height: height * 0.2, borderRadius: 4, background: "var(--agd-fill)" }} />
      <div style={{ width: "70%", height: Math.max(6, height * 0.1), borderRadius: 3, background: "var(--agd-fill)" }} />
      <div style={{ width: "90%", height: Math.max(4, height * 0.06), borderRadius: 3, background: "var(--agd-fill)" }} />
      <div style={{ width: "50%", height: Math.max(4, height * 0.06), borderRadius: 3, background: "var(--agd-fill)" }} />
    </div>
  );
}

function ChipSkeleton({ width, height }: SkeletonProps) {
  return (
    <div style={{ height: "100%", display: "flex", alignItems: "center", gap: 6 }}>
      <div style={{ height: "100%", flex: 1, borderRadius: height / 2, border: "1px solid var(--agd-stroke)", background: "var(--agd-fill)", display: "flex", alignItems: "center", padding: `0 ${height * 0.3}px`, gap: 4 }}>
        <Bar w="60%" h={2} strong />
        <div style={{ width: Math.max(6, height * 0.3), height: Math.max(6, height * 0.3), borderRadius: "50%", border: "1px solid var(--agd-stroke)", flexShrink: 0, marginLeft: "auto" }} />
      </div>
    </div>
  );
}

function IconSkeleton({ width, height }: SkeletonProps) {
  const sz = Math.min(width, height);
  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} fill="none">
      <path
        d={`M${width / 2} ${(height - sz) / 2 + sz * 0.1}l${sz * 0.12} ${sz * 0.25} ${sz * 0.28} ${sz * 0.04}-${sz * 0.2} ${sz * 0.2} ${sz * 0.05} ${sz * 0.28}-${sz * 0.25}-${sz * 0.12}-${sz * 0.25} ${sz * 0.12} ${sz * 0.05}-${sz * 0.28}-${sz * 0.2}-${sz * 0.2} ${sz * 0.28}-${sz * 0.04}z`}
        stroke="var(--agd-stroke)"
        strokeWidth="1"
        fill="var(--agd-fill)"
      />
    </svg>
  );
}

function SpinnerSkeleton({ width, height }: SkeletonProps) {
  const r = Math.min(width, height) / 2 - 2;
  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} fill="none">
      <circle cx={width / 2} cy={height / 2} r={r} stroke="var(--agd-stroke)" strokeWidth="1.5" opacity=".2" />
      <path d={`M${width / 2} ${height / 2 - r}a${r} ${r} 0 0 1 ${r} ${r}`} stroke="var(--agd-bar-strong)" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function FeatureSkeleton({ width, height }: SkeletonProps) {
  const iconSz = Math.min(36, height * 0.25, width * 0.12);
  const items = Math.max(1, Math.min(3, Math.floor(height / 80)));
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", justifyContent: "space-around", padding: 8 }}>
      {Array.from({ length: items }, (_, i) => (
        <div key={i} style={{ display: "flex", gap: width * 0.04, alignItems: "flex-start" }}>
          <Block w={iconSz} h={iconSz} radius={iconSz * 0.25} />
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
            <Bar w={`${40 + ((i * 13) % 20)}%`} h={3} strong />
            <Bar w={`${60 + ((i * 17) % 25)}%`} h={2} />
          </div>
        </div>
      ))}
    </div>
  );
}

function TeamSkeleton({ width, height }: SkeletonProps) {
  const cols = Math.max(2, Math.min(4, Math.floor(width / 120)));
  const avatarSz = Math.min(36, height * 0.25);
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: height * 0.06, padding: height * 0.06 }}>
      <Bar w={width * 0.3} h={4} strong />
      <div style={{ display: "flex", gap: width * 0.06, justifyContent: "center", flex: 1, alignItems: "center" }}>
        {Array.from({ length: cols }, (_, i) => (
          <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <Circle size={avatarSz} />
            <Bar w={width * 0.12} h={3} strong />
            <Bar w={width * 0.08} h={2} />
          </div>
        ))}
      </div>
    </div>
  );
}

function LoginSkeleton({ width, height }: SkeletonProps) {
  const fields = Math.max(2, Math.min(3, Math.floor(height / 80)));
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", padding: width * 0.06, gap: height * 0.04 }}>
      <Bar w={width * 0.5} h={Math.max(5, height * 0.04)} strong />
      <Bar w={width * 0.35} h={2} />
      <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: height * 0.03, marginTop: height * 0.04 }}>
        {Array.from({ length: fields }, (_, i) => (
          <div key={i} style={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Bar w={Math.min(60, width * 0.2)} h={2} />
            <Block w="100%" h={Math.min(32, height * 0.1)} radius={4} />
          </div>
        ))}
      </div>
      <Block w="100%" h={Math.min(36, height * 0.12)} radius={6} style={{ marginTop: height * 0.03, background: "var(--agd-bar)" }} />
      <Bar w={width * 0.4} h={2} />
    </div>
  );
}

function ContactSkeleton({ width, height }: SkeletonProps) {
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", padding: width * 0.04, gap: height * 0.03 }}>
      <Bar w={width * 0.4} h={4} strong />
      <Bar w={width * 0.6} h={2} />
      <div style={{ display: "flex", gap: 6, marginTop: height * 0.03 }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 3 }}>
          <Bar w={50} h={2} />
          <Block w="100%" h={Math.min(28, height * 0.1)} radius={4} />
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 3 }}>
          <Bar w={40} h={2} />
          <Block w="100%" h={Math.min(28, height * 0.1)} radius={4} />
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <Bar w={50} h={2} />
        <Block w="100%" h={Math.min(28, height * 0.1)} radius={4} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 3, flex: 1 }}>
        <Bar w={60} h={2} />
        <Block w="100%" h="100%" radius={4} />
      </div>
      <Block w={Math.min(120, width * 0.3)} h={Math.min(30, height * 0.1)} radius={6} style={{ alignSelf: "flex-end", background: "var(--agd-bar)" }} />
    </div>
  );
}

// --- Skeleton registry ---

const SKELETON_RENDERERS: Partial<Record<ComponentType, (props: SkeletonProps) => JSX.Element>> = {
  navigation: NavigationSkeleton,
  hero: HeroSkeleton,
  sidebar: SidebarSkeleton,
  footer: FooterSkeleton,
  modal: ModalSkeleton,
  card: CardSkeleton,
  text: TextSkeleton,
  image: ImageSkeleton,
  table: TableSkeleton,
  list: ListSkeleton,
  button: ButtonSkeleton,
  input: InputSkeleton,
  form: FormSkeleton,
  tabs: TabsSkeleton,
  avatar: AvatarSkeleton,
  badge: BadgeSkeleton,
  header: HeaderSkeleton,
  section: SectionSkeleton,
  grid: GridSkeleton,
  dropdown: DropdownSkeleton,
  toggle: ToggleSkeleton,
  search: SearchSkeleton,
  toast: ToastSkeleton,
  progress: ProgressSkeleton,
  chart: ChartSkeleton,
  video: VideoSkeleton,
  tooltip: TooltipSkeleton,
  breadcrumb: BreadcrumbSkeleton,
  pagination: PaginationSkeleton,
  divider: DividerSkeleton,
  accordion: AccordionSkeleton,
  carousel: CarouselSkeleton,
  pricing: PricingSkeleton,
  testimonial: TestimonialSkeleton,
  cta: CtaSkeleton,
  alert: AlertSkeleton,
  banner: BannerSkeleton,
  stat: StatSkeleton,
  stepper: StepperSkeleton,
  tag: TagSkeleton,
  rating: RatingSkeleton,
  map: MapSkeleton,
  timeline: TimelineSkeleton,
  fileUpload: FileUploadSkeleton,
  codeBlock: CodeBlockSkeleton,
  calendar: CalendarSkeleton,
  notification: NotificationSkeleton,
  productCard: ProductCardSkeleton,
  profile: ProfileSkeleton,
  drawer: DrawerSkeleton,
  popover: PopoverSkeleton,
  logo: LogoSkeleton,
  faq: FaqSkeleton,
  gallery: GallerySkeleton,
  checkbox: CheckboxSkeleton,
  radio: RadioSkeleton,
  slider: SliderSkeleton,
  datePicker: DatePickerSkeleton,
  skeleton: SkeletonSkeletonRenderer,
  chip: ChipSkeleton,
  icon: IconSkeleton,
  spinner: SpinnerSkeleton,
  feature: FeatureSkeleton,
  team: TeamSkeleton,
  login: LoginSkeleton,
  contact: ContactSkeleton,
};

export function Skeleton({ type, width, height, text }: { type: ComponentType; width: number; height: number; text?: string }) {
  const Renderer = SKELETON_RENDERERS[type];
  if (!Renderer) {
    return (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: 10, fontWeight: 600, color: "var(--agd-text-3)", textTransform: "uppercase", letterSpacing: "0.06em", opacity: 0.5 }}>{type}</span>
      </div>
    );
  }
  return (
    <div style={{ width: "100%", height: "100%", padding: 8, position: "relative", pointerEvents: "none" }}>
      <Renderer width={width} height={height} text={text} />
    </div>
  );
}
