import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "storybook/test";
import { AnnotationPopupCSS } from "./index";

const meta: Meta<typeof AnnotationPopupCSS> = {
  title: "AnnotationPopup",
  component: AnnotationPopupCSS,
  args: {
    element: "button.submit-btn",
    onSubmit: fn(),
    onCancel: fn(),
  },
  decorators: [
    (Story) => (
      <div style={{ minHeight: 300, minWidth: 360, position: "relative" }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof AnnotationPopupCSS>;

export const Default: Story = {};

export const EditMode: Story = {
  args: {
    initialValue: "This button should be more prominent",
    submitLabel: "Save",
    onDelete: fn(),
  },
};

export const WithThread: Story = {
  args: {
    initialValue: "The spacing looks off here",
    thread: [
      {
        id: "1",
        role: "human",
        content: "The spacing looks off here",
        timestamp: Date.now() - 60000,
      },
      {
        id: "2",
        role: "agent",
        content: "I see the issue. The padding is 8px but should be 16px per the design spec. I'll fix this now.",
        timestamp: Date.now() - 30000,
      },
      {
        id: "3",
        role: "human",
        content: "Also check the margin-top on the container",
        timestamp: Date.now() - 10000,
      },
    ],
    onReply: fn(),
  },
};

export const WithComputedStyles: Story = {
  args: {
    computedStyles: {
      display: "flex",
      padding: "8px 16px",
      backgroundColor: "rgb(60, 130, 247)",
      borderRadius: "6px",
      fontSize: "14px",
      color: "rgb(255, 255, 255)",
    },
  },
};

export const DarkMode: Story = {
  args: {
    lightMode: false,
  },
};

export const LightMode: Story = {
  args: {
    lightMode: true,
  },
};

export const AccentColor: Story = {
  args: {
    accentColor: "#e74c3c",
    initialValue: "Try a different accent color",
  },
};

export const Exiting: Story = {
  args: {
    isExiting: true,
  },
};

export const WithSelectedText: Story = {
  args: {
    selectedText: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt.",
  },
};
