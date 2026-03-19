"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";

const actors = [
  { id: "browser", label: "Browser", sublabel: "Agentation" },
  { id: "webhook", label: "Webhook", sublabel: "Server" },
  { id: "service", label: "Service", sublabel: "Slack, GitHub..." },
];

const messages = [
  { from: 0, to: 1, label: "annotation.add", direction: "right", type: "request" as const },
  { from: 1, to: 2, label: "POST /slack", direction: "right", type: "request" as const },
  { from: 2, to: 1, label: "200 OK", direction: "left", type: "response" as const },
  { from: 0, to: 1, label: "submit", direction: "right", type: "request" as const },
  { from: 1, to: 2, label: "POST /github/issues", direction: "right", type: "request" as const },
  { from: 2, to: 1, label: "201 Created", direction: "left", type: "response" as const },
];

const PULSE_COLOR = "#60a5fa";
const LOOP_INTERVAL = 1400;
const INITIAL_DELAY = 2000;

const PULSE_CSS = `
@keyframes webhookPulseLabel {
  0% { fill: rgba(0,0,0,0.45); }
  17% { fill: ${PULSE_COLOR}; }
  50% { fill: ${PULSE_COLOR}; }
  100% { fill: rgba(0,0,0,0.45); }
}
@keyframes webhookPulseActor {
  0% {
    border-color: rgba(0,0,0,0.1);
    box-shadow: 0 1px 3px rgba(0,0,0,0.04);
  }
  17% {
    border-color: ${PULSE_COLOR}60;
    box-shadow: 0 0 12px 4px ${PULSE_COLOR}25, 0 0 4px 1px ${PULSE_COLOR}20;
  }
  50% {
    border-color: ${PULSE_COLOR}60;
    box-shadow: 0 0 12px 4px ${PULSE_COLOR}25, 0 0 4px 1px ${PULSE_COLOR}20;
  }
  100% {
    border-color: rgba(0,0,0,0.1);
    box-shadow: 0 1px 3px rgba(0,0,0,0.04);
  }
}
`;

function ActorPill({
  actor,
  index,
  isVisible,
  isActive,
  pulseKey,
}: {
  actor: typeof actors[0];
  index: number;
  isVisible: boolean;
  isActive: boolean;
  pulseKey: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: -10 }}
      animate={isVisible ? { opacity: 1, scale: 1, y: 0 } : {}}
      transition={{
        duration: 0.4,
        delay: index * 0.1,
        ease: [0.16, 1, 0.3, 1]
      }}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "2px",
      }}
    >
      <div
        key={isActive ? `active-${pulseKey}` : "inactive"}
        style={{
          padding: "8px 16px",
          background: "#fff",
          border: "1px solid rgba(0,0,0,0.1)",
          borderRadius: "8px",
          fontSize: "12px",
          fontWeight: 600,
          color: "#1a1a1a",
          fontFamily: "system-ui, sans-serif",
          animation: isActive ? `webhookPulseActor ${LOOP_INTERVAL}ms ease-in-out forwards` : "none",
        }}
      >
        {actor.label}
      </div>
      <div
        style={{
          fontSize: "10px",
          color: "rgba(0,0,0,0.4)",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {actor.sublabel}
      </div>
    </motion.div>
  );
}

function MessageArrow({
  message,
  index,
  isVisible,
  isActive,
  actorPositions,
  pulseKey,
}: {
  message: typeof messages[0];
  index: number;
  isVisible: boolean;
  isActive: boolean;
  actorPositions: number[];
  pulseKey: number;
}) {
  const fromX = actorPositions[message.from];
  const toX = actorPositions[message.to];
  const y = 32 + index * 42;
  const isLeft = message.direction === "left";
  const isResponse = message.type === "response";

  const startX = fromX;
  const endX = toX;
  const midX = (startX + endX) / 2;

  const baseColor = isResponse ? "rgba(0,0,0,0.2)" : "rgba(0,0,0,0.3)";

  return (
    <g>
      {/* Arrow line */}
      {isResponse ? (
        <motion.line
          x1={startX}
          y1={y}
          x2={endX}
          y2={y}
          stroke={baseColor}
          strokeWidth={1.5}
          strokeDasharray="6 4"
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : {}}
          transition={{ duration: 0.3, delay: 0.4 + index * 0.15 }}
        />
      ) : (
        <motion.line
          x1={startX}
          y1={y}
          x2={endX}
          y2={y}
          stroke={baseColor}
          strokeWidth={1.5}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={isVisible ? { pathLength: 1, opacity: 1 } : {}}
          transition={{
            pathLength: { duration: 0.4, delay: 0.4 + index * 0.15, ease: "easeOut" },
            opacity: { duration: 0.1, delay: 0.4 + index * 0.15 },
          }}
        />
      )}

      {/* Arrow head */}
      <motion.polyline
        points={
          isLeft
            ? `${endX + 5},${y - 4} ${endX},${y} ${endX + 5},${y + 4}`
            : `${endX - 5},${y - 4} ${endX},${y} ${endX - 5},${y + 4}`
        }
        fill="none"
        stroke={baseColor}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ opacity: 0, pathLength: 0 }}
        animate={isVisible ? { opacity: 1, pathLength: 1 } : {}}
        transition={{
          duration: 0.15,
          delay: 0.4 + index * 0.15 + 0.25,
          ease: "easeOut",
        }}
      />

      {/* Label */}
      <motion.text
        x={midX}
        y={y - 7}
        textAnchor="middle"
        fontSize={10}
        fontFamily="'SF Mono', ui-monospace, monospace"
        fill="rgba(0,0,0,0.45)"
        initial={{ opacity: 0 }}
        animate={isVisible ? { opacity: 1 } : {}}
        transition={{ duration: 0.3, delay: 0.4 + index * 0.15 + 0.2 }}
      >
        {message.label}
      </motion.text>

      {/* Label pulse overlay */}
      {isActive && (
        <text
          key={`label-pulse-${pulseKey}`}
          x={midX}
          y={y - 7}
          textAnchor="middle"
          fontSize={10}
          fontFamily="'SF Mono', ui-monospace, monospace"
          style={{
            animation: `webhookPulseLabel ${LOOP_INTERVAL}ms ease-in-out forwards`,
            pointerEvents: "none",
          }}
        >
          {message.label}
        </text>
      )}
    </g>
  );
}

function VerticalLine({
  x,
  height,
  index,
  isVisible,
}: {
  x: number;
  height: number;
  index: number;
  isVisible: boolean;
}) {
  return (
    <motion.line
      x1={x}
      y1={10}
      x2={x}
      y2={height}
      stroke="rgba(0,0,0,0.08)"
      strokeWidth={1}
      strokeDasharray="3 3"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={isVisible ? { pathLength: 1, opacity: 1 } : {}}
      transition={{
        pathLength: { duration: 0.5, delay: 0.3 + index * 0.08, ease: "easeOut" },
        opacity: { duration: 0.2, delay: 0.3 + index * 0.08 },
      }}
    />
  );
}

function Legend({ isVisible }: { isVisible: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={isVisible ? { opacity: 1 } : {}}
      transition={{ duration: 0.4, delay: 1.8 }}
      style={{
        display: "flex",
        justifyContent: "center",
        gap: "20px",
        marginTop: "12px",
        fontSize: "10px",
        color: "rgba(0,0,0,0.4)",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        <svg width="24" height="2">
          <line x1="0" y1="1" x2="24" y2="1" stroke="rgba(0,0,0,0.3)" strokeWidth="1.5" />
        </svg>
        <span>request</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        <svg width="24" height="2">
          <line x1="0" y1="1" x2="24" y2="1" stroke="rgba(0,0,0,0.15)" strokeWidth="1.5" strokeDasharray="6 4" />
        </svg>
        <span>response</span>
      </div>
    </motion.div>
  );
}

export function WebhooksDiagram() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-50px" });
  const [activeMessageIndex, setActiveMessageIndex] = useState(-1);
  const [pulseKey, setPulseKey] = useState(0);

  // Inject CSS
  useEffect(() => {
    const styleId = "webhooks-diagram-pulse-css";
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.textContent = PULSE_CSS;
      document.head.appendChild(style);
    }
    return () => {
      const existing = document.getElementById(styleId);
      if (existing) existing.remove();
    };
  }, []);

  // Start loop
  useEffect(() => {
    if (!isInView) return;
    const startLoop = setTimeout(() => {
      setActiveMessageIndex(0);
      setPulseKey(1);
    }, INITIAL_DELAY);
    return () => clearTimeout(startLoop);
  }, [isInView]);

  // Loop through messages
  useEffect(() => {
    if (activeMessageIndex < 0) return;
    const interval = setInterval(() => {
      setActiveMessageIndex((prev) => (prev + 1) % messages.length);
      setPulseKey((prev) => prev + 1);
    }, LOOP_INTERVAL);
    return () => clearInterval(interval);
  }, [activeMessageIndex]);

  // Active actors
  const activeActors = new Set<number>();
  if (activeMessageIndex >= 0) {
    const msg = messages[activeMessageIndex];
    activeActors.add(msg.from);
    activeActors.add(msg.to);
  }

  const width = 440;
  const padding = 50;
  const actorSpacing = (width - padding * 2) / (actors.length - 1);
  const actorPositions = actors.map((_, i) => padding + i * actorSpacing);
  const svgHeight = 32 + (messages.length - 1) * 42 + 30;

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        marginTop: "1.5rem",
        marginBottom: "1rem",
        padding: "24px",
        background: "#fafafa",
        borderRadius: "12px",
        border: "1px solid rgba(0,0,0,0.06)",
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: `${width}px`,
          margin: "0 auto",
        }}
      >
        {/* Actor pills */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "0px",
          }}
        >
          {actors.map((actor, i) => (
            <ActorPill
              key={actor.id}
              actor={actor}
              index={i}
              isVisible={isInView}
              isActive={activeActors.has(i)}
              pulseKey={pulseKey}
            />
          ))}
        </div>

        {/* SVG */}
        <svg
          width="100%"
          viewBox={`0 0 ${width} ${svgHeight}`}
          style={{ display: "block" }}
        >
          {/* Vertical lifelines */}
          {actorPositions.map((x, i) => (
            <VerticalLine
              key={i}
              x={x}
              height={svgHeight - 10}
              index={i}
              isVisible={isInView}
            />
          ))}

          {/* Message arrows */}
          {messages.map((message, i) => (
            <MessageArrow
              key={i}
              message={message}
              index={i}
              isVisible={isInView}
              isActive={activeMessageIndex === i}
              actorPositions={actorPositions}
              pulseKey={pulseKey}
            />
          ))}
        </svg>

        {/* Legend */}
        <Legend isVisible={isInView} />
      </div>
    </div>
  );
}
