import type { Meta, StoryObj } from "@storybook/react";
import { fn, userEvent, waitFor } from "storybook/test";
import { localStorageForStorybook } from "@alexgorbatchev/storybook-addon-localstorage";
import { PageFeedbackToolbarCSS } from "./index";

const STORAGE_KEY = `feedback-annotations-/iframe.html`;

const sampleAnnotations = [
  {
    id: "ann-1",
    x: 50,
    y: 120,
    comment: "This heading needs to be larger",
    element: "h1",
    elementPath: "body > div > h1",
    timestamp: Date.now() - 120000,
    thread: [
      {
        id: "t1-1",
        role: "human",
        content: "This heading needs to be larger",
        timestamp: Date.now() - 120000,
      },
      {
        id: "t1-2",
        role: "agent",
        content: "I'll increase the font-size from 24px to 32px and add font-weight: 700.",
        timestamp: Date.now() - 90000,
      },
    ],
  },
  {
    id: "ann-2",
    x: 30,
    y: 220,
    comment: "Change button color to match brand",
    element: "button.submit",
    elementPath: "body > div > button",
    timestamp: Date.now() - 60000,
    thread: [
      {
        id: "t2-1",
        role: "human",
        content: "Change button color to match brand",
        timestamp: Date.now() - 60000,
      },
      {
        id: "t2-2",
        role: "agent",
        content: "Updated the button background from #3c82f7 to your brand color #e74c3c.",
        timestamp: Date.now() - 45000,
      },
    ],
  },
  {
    id: "ann-3",
    x: 70,
    y: 350,
    comment: "Add more padding to this card",
    element: "div.card",
    elementPath: "body > div > div",
    timestamp: Date.now() - 30000,
    selectedText: "A card component",
    thread: [
      {
        id: "t3-1",
        role: "human",
        content: "Add more padding to this card",
        timestamp: Date.now() - 30000,
      },
    ],
  },
];

const sampleResolvedAnnotations = [
  {
    id: "ann-1",
    x: 50,
    y: 120,
    comment: "This heading needs to be larger",
    element: "h1",
    elementPath: "body > div > h1",
    timestamp: Date.now() - 120000,
    status: "resolved",
    thread: [
      {
        id: "t1-1",
        role: "human",
        content: "This heading needs to be larger",
        timestamp: Date.now() - 120000,
      },
      {
        id: "t1-2",
        role: "agent",
        content: "I'll increase the font-size from 24px to 32px and add font-weight: 700.",
        timestamp: Date.now() - 90000,
      },
    ],
  },
  {
    id: "ann-2",
    x: 30,
    y: 220,
    comment: "Change button color to match brand",
    element: "button.submit",
    elementPath: "body > div > button",
    timestamp: Date.now() - 60000,
    status: "resolved",
    thread: [
      {
        id: "t2-1",
        role: "human",
        content: "Change button color to match brand",
        timestamp: Date.now() - 60000,
      },
      {
        id: "t2-2",
        role: "agent",
        content: "Updated the button background from #3c82f7 to your brand color #e74c3c.",
        timestamp: Date.now() - 45000,
      },
      {
        id: "t2-3",
        role: "human",
        content: "Actually use #d63031 instead, it has better contrast",
        timestamp: Date.now() - 30000,
      },
      {
        id: "t2-4",
        role: "agent",
        content: "Done. Switched to #d63031 — contrast ratio is now 4.8:1 against white.",
        timestamp: Date.now() - 15000,
      },
    ],
  },
  {
    id: "ann-3",
    x: 70,
    y: 350,
    comment: "Add more padding to this card",
    element: "div.card",
    elementPath: "body > div > div",
    timestamp: Date.now() - 30000,
    selectedText: "A card component",
    status: "dismissed",
    thread: [
      {
        id: "t3-1",
        role: "human",
        content: "Add more padding to this card",
        timestamp: Date.now() - 30000,
      },
    ],
  },
];

async function clickToolbar() {
  await waitFor(
    () => {
      const btn = document.querySelector<HTMLElement>('[title="Start feedback mode"]');
      if (!btn) throw new Error("Toolbar not found");
      return btn;
    },
    { timeout: 5000 }
  );
  const btn = document.querySelector<HTMLElement>('[title="Start feedback mode"]')!;
  await userEvent.click(btn);
  btn.blur();
}

const meta: Meta<typeof PageFeedbackToolbarCSS> = {
  title: "PageToolbar",
  component: PageFeedbackToolbarCSS,
  parameters: {
    localStorage: localStorageForStorybook({
      [STORAGE_KEY]: [],
    }),
  },
  decorators: [
    (Story) => (
      <div>
        {/* Mock page content for the toolbar to annotate */}
        <div style={{ maxWidth: 600, margin: "0 auto", color: "#e0e0e0" }}>
          <h1 style={{ fontSize: 24, marginBottom: 16 }}>Sample Page</h1>
          <p style={{ marginBottom: 12, lineHeight: 1.6 }}>
            This is sample content to demonstrate the toolbar annotation system.
            Click the toolbar to start annotating elements on this page.
          </p>
          <button
            style={{
              padding: "8px 16px",
              background: "#3c82f7",
              color: "white",
              border: "none",
              borderRadius: 6,
              cursor: "pointer",
              marginBottom: 12,
            }}
          >
            Submit Button
          </button>
          <div
            style={{
              padding: 16,
              background: "rgba(255,255,255,0.05)",
              borderRadius: 8,
              marginBottom: 12,
            }}
          >
            <p>A card component with some content inside it.</p>
          </div>
          <input
            type="text"
            placeholder="Text input field"
            style={{
              padding: "8px 12px",
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: 4,
              color: "#e0e0e0",
              width: "100%",
            }}
          />
        </div>
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof PageFeedbackToolbarCSS>;

export const Default: Story = {};

export const Expanded: Story = {
  play: async () => {
    await clickToolbar();
  },
};

export const WithAnnotations: Story = {
  parameters: {
    localStorage: localStorageForStorybook({
      [STORAGE_KEY]: sampleAnnotations,
    }),
  },
  play: async () => {
    await clickToolbar();
  },
};

export const ReviewQueue: Story = {
  parameters: {
    localStorage: localStorageForStorybook({
      [STORAGE_KEY]: sampleResolvedAnnotations,
    }),
  },
};

export const ReviewQueueExpanded: Story = {
  parameters: {
    localStorage: localStorageForStorybook({
      [STORAGE_KEY]: sampleResolvedAnnotations,
    }),
  },
  play: async () => {
    await clickToolbar();
    await userEvent.keyboard("q");
  },
};

export const WithCallbacks: Story = {
  args: {
    onAnnotationAdd: fn(),
    onAnnotationDelete: fn(),
    onAnnotationUpdate: fn(),
    onAnnotationsClear: fn(),
    onCopy: fn(),
    onSubmit: fn(),
  },
};
