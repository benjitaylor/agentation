import type { Preview } from "@storybook/react";
import React from "react";

const preview: Preview = {
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) =>
      React.createElement(
        "div",
        {
          style: {
            minHeight: "100vh",
            background: "#1a1a2e",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 40,
          },
        },
        React.createElement(Story)
      ),
  ],
};

export default preview;
