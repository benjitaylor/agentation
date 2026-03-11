import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

import {
  IconClose,
  IconPlus,
  IconCheck,
  IconCheckSmall,
  IconCheckSmallAnimated,
  IconListSparkle,
  IconHelp,
  IconCopyAlt,
  IconCopyAnimated,
  IconSendArrow,
  IconSendAnimated,
  IconEye,
  IconEyeAlt,
  IconEyeClosed,
  IconEyeAnimated,
  IconEyeMinus,
  IconPausePlayAnimated,
  IconGear,
  IconPauseAlt,
  IconPause,
  IconPlayAlt,
  IconTrashAlt,
  IconTrash,
  IconChatEllipsis,
  IconCheckmark,
  IconCheckmarkLarge,
  IconCheckmarkCircle,
  IconXmark,
  IconXmarkLarge,
  IconSun,
  IconMoon,
  IconEdit,
  IconChevronLeft,
  IconChevronRight,
  AnimatedBunny,
} from "./icons";

const IconCell = ({ name, children }: { name: string; children: React.ReactNode }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 8,
      padding: 16,
      borderRadius: 8,
      background: "rgba(255,255,255,0.05)",
      minWidth: 100,
    }}
  >
    <div style={{ color: "#e0e0e0", width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center" }}>
      {children}
    </div>
    <span style={{ fontSize: 10, color: "#888", textAlign: "center", wordBreak: "break-all" }}>
      {name}
    </span>
  </div>
);

const Grid = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))",
      gap: 12,
      maxWidth: 800,
    }}
  >
    {children}
  </div>
);

// =============================================================================
// All Icons
// =============================================================================

const AllIconsComponent = () => (
  <Grid>
    <IconCell name="IconClose"><IconClose size={24} /></IconCell>
    <IconCell name="IconPlus"><IconPlus size={24} /></IconCell>
    <IconCell name="IconCheck"><IconCheck size={24} /></IconCell>
    <IconCell name="IconCheckSmall"><IconCheckSmall size={24} /></IconCell>
    <IconCell name="IconListSparkle"><IconListSparkle size={24} /></IconCell>
    <IconCell name="IconHelp"><IconHelp size={24} /></IconCell>
    <IconCell name="IconCopyAlt"><IconCopyAlt size={24} /></IconCell>
    <IconCell name="IconEye"><IconEye size={24} /></IconCell>
    <IconCell name="IconEyeAlt"><IconEyeAlt size={24} /></IconCell>
    <IconCell name="IconEyeClosed"><IconEyeClosed size={24} /></IconCell>
    <IconCell name="IconEyeMinus"><IconEyeMinus size={24} /></IconCell>
    <IconCell name="IconGear"><IconGear size={24} /></IconCell>
    <IconCell name="IconPauseAlt"><IconPauseAlt size={24} /></IconCell>
    <IconCell name="IconPause"><IconPause size={24} /></IconCell>
    <IconCell name="IconPlayAlt"><IconPlayAlt size={24} /></IconCell>
    <IconCell name="IconTrashAlt"><IconTrashAlt size={24} /></IconCell>
    <IconCell name="IconTrash"><IconTrash size={24} /></IconCell>
    <IconCell name="IconChatEllipsis"><IconChatEllipsis size={24} /></IconCell>
    <IconCell name="IconCheckmark"><IconCheckmark size={24} /></IconCell>
    <IconCell name="IconCheckmarkLarge"><IconCheckmarkLarge size={24} /></IconCell>
    <IconCell name="IconCheckmarkCircle"><IconCheckmarkCircle size={24} /></IconCell>
    <IconCell name="IconXmark"><IconXmark size={24} /></IconCell>
    <IconCell name="IconXmarkLarge"><IconXmarkLarge size={24} /></IconCell>
    <IconCell name="IconSun"><IconSun size={24} /></IconCell>
    <IconCell name="IconMoon"><IconMoon size={24} /></IconCell>
    <IconCell name="IconEdit"><IconEdit size={24} /></IconCell>
    <IconCell name="IconChevronLeft"><IconChevronLeft size={24} /></IconCell>
    <IconCell name="IconChevronRight"><IconChevronRight size={24} /></IconCell>
    <IconCell name="AnimatedBunny"><AnimatedBunny size={24} /></IconCell>
  </Grid>
);

const meta: Meta = {
  title: "Icons",
};

export default meta;

export const AllIcons: StoryObj = {
  render: () => <AllIconsComponent />,
};

// =============================================================================
// Animated Icons
// =============================================================================

const AnimatedIconsComponent = () => {
  const [copied, setCopied] = useState(false);
  const [sent, setSent] = useState(false);
  const [sendState, setSendState] = useState<"idle" | "sending" | "sent" | "failed">("idle");
  const [eyeOpen, setEyeOpen] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, color: "#e0e0e0" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <span style={{ fontSize: 12, width: 140 }}>IconCheckSmallAnimated</span>
        <IconCheckSmallAnimated size={24} />
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <span style={{ fontSize: 12, width: 140 }}>IconCopyAnimated</span>
        <button onClick={() => setCopied((c) => !c)} style={{ background: "none", border: "1px solid #555", borderRadius: 4, padding: "4px 8px", color: "#e0e0e0", cursor: "pointer" }}>
          {copied ? "Reset" : "Toggle copied"}
        </button>
        <IconCopyAnimated size={24} copied={copied} />
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <span style={{ fontSize: 12, width: 140 }}>IconSendAnimated</span>
        <button onClick={() => setSent((s) => !s)} style={{ background: "none", border: "1px solid #555", borderRadius: 4, padding: "4px 8px", color: "#e0e0e0", cursor: "pointer" }}>
          {sent ? "Reset" : "Toggle sent"}
        </button>
        <IconSendAnimated size={24} sent={sent} />
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <span style={{ fontSize: 12, width: 140 }}>IconSendArrow</span>
        <div style={{ display: "flex", gap: 4 }}>
          {(["idle", "sending", "sent", "failed"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setSendState(s)}
              style={{
                background: sendState === s ? "#333" : "none",
                border: "1px solid #555",
                borderRadius: 4,
                padding: "4px 8px",
                color: "#e0e0e0",
                cursor: "pointer",
                fontSize: 11,
              }}
            >
              {s}
            </button>
          ))}
        </div>
        <IconSendArrow size={24} state={sendState} />
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <span style={{ fontSize: 12, width: 140 }}>IconEyeAnimated</span>
        <button onClick={() => setEyeOpen((o) => !o)} style={{ background: "none", border: "1px solid #555", borderRadius: 4, padding: "4px 8px", color: "#e0e0e0", cursor: "pointer" }}>
          {eyeOpen ? "Close" : "Open"}
        </button>
        <IconEyeAnimated size={24} isOpen={eyeOpen} />
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <span style={{ fontSize: 12, width: 140 }}>IconPausePlayAnimated</span>
        <button onClick={() => setIsPaused((p) => !p)} style={{ background: "none", border: "1px solid #555", borderRadius: 4, padding: "4px 8px", color: "#e0e0e0", cursor: "pointer" }}>
          {isPaused ? "Play" : "Pause"}
        </button>
        <IconPausePlayAnimated size={24} isPaused={isPaused} />
      </div>
    </div>
  );
};

export const AnimatedIcons: StoryObj = {
  render: () => <AnimatedIconsComponent />,
};
