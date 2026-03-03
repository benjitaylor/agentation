const browserGlobal = globalThis as Record<string, unknown>;

if (typeof browserGlobal.process === "undefined") {
  browserGlobal.process = {
    env: {
      NODE_ENV: "production",
    },
  };
}

export {};
