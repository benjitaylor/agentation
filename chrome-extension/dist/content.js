import { r as reactExports, j as jsxRuntimeExports, a as reactDomExports, c as createRoot, R as React } from './chunks/client-DJHG-Y1K.js';
import { l as loadAnnotations, s as saveAnnotations } from './chunks/storage-BlbiK-hs.js';

const popup = "_popup_utw9p_38";
const enter$1 = "_enter_utw9p_53";
const entered = "_entered_utw9p_56";
const exit$1 = "_exit_utw9p_60";
const shake = "_shake_utw9p_63";
const header = "_header_utw9p_67";
const element = "_element_utw9p_74";
const timestamp = "_timestamp_utw9p_85";
const quote = "_quote_utw9p_94";
const textarea = "_textarea_utw9p_105";
const actions = "_actions_utw9p_138";
const cancel = "_cancel_utw9p_145";
const submit = "_submit_utw9p_146";
const light$1 = "_light_utw9p_175";
const styles$1 = {
	popup: popup,
	enter: enter$1,
	entered: entered,
	exit: exit$1,
	shake: shake,
	header: header,
	element: element,
	timestamp: timestamp,
	quote: quote,
	textarea: textarea,
	actions: actions,
	cancel: cancel,
	submit: submit,
	light: light$1
};

const AnnotationPopupCSS = reactExports.forwardRef(
  function AnnotationPopupCSS2({
    element,
    timestamp,
    selectedText,
    placeholder = "What should change?",
    initialValue = "",
    submitLabel = "Add",
    onSubmit,
    onCancel,
    style,
    accentColor = "#3c82f7",
    isExiting = false,
    lightMode = false
  }, ref) {
    const [text, setText] = reactExports.useState(initialValue);
    const [isShaking, setIsShaking] = reactExports.useState(false);
    const [animState, setAnimState] = reactExports.useState("initial");
    const [isFocused, setIsFocused] = reactExports.useState(false);
    const textareaRef = reactExports.useRef(null);
    const popupRef = reactExports.useRef(null);
    reactExports.useEffect(() => {
      if (isExiting && animState !== "exit") {
        setAnimState("exit");
      }
    }, [isExiting, animState]);
    reactExports.useEffect(() => {
      requestAnimationFrame(() => {
        setAnimState("enter");
      });
      const enterTimer = setTimeout(() => {
        setAnimState("entered");
      }, 200);
      const focusTimer = setTimeout(() => {
        const textarea = textareaRef.current;
        if (textarea) {
          textarea.focus();
          textarea.selectionStart = textarea.selectionEnd = textarea.value.length;
          textarea.scrollTop = textarea.scrollHeight;
        }
      }, 50);
      return () => {
        clearTimeout(enterTimer);
        clearTimeout(focusTimer);
      };
    }, []);
    const shake = reactExports.useCallback(() => {
      setIsShaking(true);
      setTimeout(() => {
        setIsShaking(false);
        textareaRef.current?.focus();
      }, 250);
    }, []);
    reactExports.useImperativeHandle(ref, () => ({
      shake
    }), [shake]);
    const handleCancel = reactExports.useCallback(() => {
      setAnimState("exit");
      setTimeout(() => {
        onCancel();
      }, 150);
    }, [onCancel]);
    const handleSubmit = reactExports.useCallback(() => {
      if (!text.trim()) return;
      onSubmit(text.trim());
    }, [text, onSubmit]);
    const handleKeyDown = reactExports.useCallback(
      (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          handleSubmit();
        }
        if (e.key === "Escape") {
          handleCancel();
        }
      },
      [handleSubmit, handleCancel]
    );
    const popupClassName = [
      styles$1.popup,
      lightMode ? styles$1.light : "",
      animState === "enter" ? styles$1.enter : "",
      animState === "entered" ? styles$1.entered : "",
      animState === "exit" ? styles$1.exit : "",
      isShaking ? styles$1.shake : ""
    ].filter(Boolean).join(" ");
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        ref: popupRef,
        className: popupClassName,
        "data-annotation-popup": true,
        style,
        onClick: (e) => e.stopPropagation(),
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.header, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$1.element, children: element }),
            timestamp && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$1.timestamp, children: timestamp })
          ] }),
          selectedText && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.quote, children: [
            "“",
            selectedText.slice(0, 80),
            selectedText.length > 80 ? "..." : "",
            "”"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "textarea",
            {
              ref: textareaRef,
              className: styles$1.textarea,
              style: { borderColor: isFocused ? accentColor : void 0 },
              placeholder,
              value: text,
              onChange: (e) => setText(e.target.value),
              onFocus: () => setIsFocused(true),
              onBlur: () => setIsFocused(false),
              rows: 2,
              onKeyDown: handleKeyDown
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.actions, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: styles$1.cancel, onClick: handleCancel, children: "Cancel" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                className: styles$1.submit,
                style: {
                  backgroundColor: accentColor,
                  opacity: text.trim() ? 1 : 0.4
                },
                onClick: handleSubmit,
                disabled: !text.trim(),
                children: submitLabel
              }
            )
          ] })
        ]
      }
    );
  }
);

const IconClose = ({ size = 16 }) => /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { width: size, height: size, viewBox: "0 0 16 16", fill: "none", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
  "path",
  {
    d: "M4 4l8 8M12 4l-8 8",
    stroke: "currentColor",
    strokeWidth: "1.5",
    strokeLinecap: "round"
  }
) });
const IconPlus = ({ size = 16 }) => /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { width: size, height: size, viewBox: "0 0 16 16", fill: "none", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
  "path",
  {
    d: "M8 3v10M3 8h10",
    stroke: "currentColor",
    strokeWidth: "1.5",
    strokeLinecap: "round"
  }
) });
const IconListSparkle = ({
  size = 24,
  style = {}
}) => /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "none", style, children: [
  /* @__PURE__ */ jsxRuntimeExports.jsxs("g", { clipPath: "url(#clip0_list_sparkle)", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "path",
      {
        d: "M11.5 12L5.5 12",
        stroke: "currentColor",
        strokeWidth: "1.5",
        strokeLinecap: "round",
        strokeLinejoin: "round"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "path",
      {
        d: "M18.5 6.75L5.5 6.75",
        stroke: "currentColor",
        strokeWidth: "1.5",
        strokeLinecap: "round",
        strokeLinejoin: "round"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "path",
      {
        d: "M9.25 17.25L5.5 17.25",
        stroke: "currentColor",
        strokeWidth: "1.5",
        strokeLinecap: "round",
        strokeLinejoin: "round"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "path",
      {
        d: "M16 12.75L16.5179 13.9677C16.8078 14.6494 17.3506 15.1922 18.0323 15.4821L19.25 16L18.0323 16.5179C17.3506 16.8078 16.8078 17.3506 16.5179 18.0323L16 19.25L15.4821 18.0323C15.1922 17.3506 14.6494 16.8078 13.9677 16.5179L12.75 16L13.9677 15.4821C14.6494 15.1922 15.1922 14.6494 15.4821 13.9677L16 12.75Z",
        stroke: "currentColor",
        strokeWidth: "1.5",
        strokeLinejoin: "round"
      }
    )
  ] }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("defs", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("clipPath", { id: "clip0_list_sparkle", children: /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { width: "24", height: "24", fill: "white" }) }) })
] });
const IconHelp = ({ size = 20 }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: size, height: size, viewBox: "0 0 20 20", fill: "none", children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx(
    "path",
    {
      d: "M10 16.0417C6.66328 16.0417 3.95834 13.3367 3.95834 10C3.95834 6.66328 6.66328 3.95833 10 3.95833C13.3367 3.95833 16.0417 6.66328 16.0417 10C16.0417 13.3367 13.3367 16.0417 10 16.0417Z",
      stroke: "currentColor",
      strokeOpacity: "0.2",
      strokeWidth: "1.25",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }
  ),
  /* @__PURE__ */ jsxRuntimeExports.jsx(
    "path",
    {
      d: "M8.24188 8.18736C8.38392 7.78357 8.66429 7.44309 9.03331 7.22621C9.40234 7.00933 9.83621 6.93005 10.2581 7.00241C10.68 7.07477 11.0626 7.29411 11.3383 7.62157C11.6139 7.94903 11.7648 8.36348 11.7642 8.79152C11.7642 9.99986 10 10.604 10 10.604V10.8333",
      stroke: "currentColor",
      strokeOpacity: "0.2",
      strokeWidth: "1.25",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }
  ),
  /* @__PURE__ */ jsxRuntimeExports.jsx(
    "path",
    {
      d: "M10 13.0208H10.006",
      stroke: "currentColor",
      strokeOpacity: "0.2",
      strokeWidth: "1.25",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }
  )
] });
const IconCheckSmallAnimated = ({ size = 14 }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: size, height: size, viewBox: "0 0 14 14", fill: "none", children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: `
      @keyframes checkDraw {
        0% {
          stroke-dashoffset: 12;
        }
        100% {
          stroke-dashoffset: 0;
        }
      }
      @keyframes checkBounce {
        0% {
          transform: scale(0.5);
          opacity: 0;
        }
        50% {
          transform: scale(1.12);
          opacity: 1;
        }
        75% {
          transform: scale(0.95);
        }
        100% {
          transform: scale(1);
        }
      }
      .check-path-animated {
        stroke-dasharray: 12;
        stroke-dashoffset: 0;
        transform-origin: center;
        animation: checkDraw 0.18s ease-out, checkBounce 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
      }
    ` }),
  /* @__PURE__ */ jsxRuntimeExports.jsx(
    "path",
    {
      className: "check-path-animated",
      d: "M3.9375 7L6.125 9.1875L10.5 4.8125",
      stroke: "currentColor",
      strokeWidth: "1.5",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }
  )
] });
const IconCopyAnimated = ({ size = 24, copied = false }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "none", children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: `
      .copy-icon, .check-icon {
        transition: opacity 0.2s ease, transform 0.2s ease;
      }
    ` }),
  /* @__PURE__ */ jsxRuntimeExports.jsxs("g", { className: "copy-icon", style: { opacity: copied ? 0 : 1, transform: copied ? "scale(0.8)" : "scale(1)", transformOrigin: "center" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "path",
      {
        d: "M4.75 11.25C4.75 10.4216 5.42157 9.75 6.25 9.75H12.75C13.5784 9.75 14.25 10.4216 14.25 11.25V17.75C14.25 18.5784 13.5784 19.25 12.75 19.25H6.25C5.42157 19.25 4.75 18.5784 4.75 17.75V11.25Z",
        stroke: "currentColor",
        strokeWidth: "1.5"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "path",
      {
        d: "M17.25 14.25H17.75C18.5784 14.25 19.25 13.5784 19.25 12.75V6.25C19.25 5.42157 18.5784 4.75 17.75 4.75H11.25C10.4216 4.75 9.75 5.42157 9.75 6.25V6.75",
        stroke: "currentColor",
        strokeWidth: "1.5",
        strokeLinecap: "round"
      }
    )
  ] }),
  /* @__PURE__ */ jsxRuntimeExports.jsxs("g", { className: "check-icon", style: { opacity: copied ? 1 : 0, transform: copied ? "scale(1)" : "scale(0.8)", transformOrigin: "center" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "path",
      {
        d: "M12 20C7.58172 20 4 16.4182 4 12C4 7.58172 7.58172 4 12 4C16.4182 4 20 7.58172 20 12C20 16.4182 16.4182 20 12 20Z",
        stroke: "currentColor",
        strokeWidth: "1.5",
        strokeLinecap: "round",
        strokeLinejoin: "round"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "path",
      {
        d: "M15 10L11 14.25L9.25 12.25",
        stroke: "currentColor",
        strokeWidth: "1.5",
        strokeLinecap: "round",
        strokeLinejoin: "round"
      }
    )
  ] })
] });
const IconEyeAnimated = ({ size = 24, isOpen = true }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "none", children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: `
      .eye-open, .eye-closed {
        transition: opacity 0.2s ease;
      }
    ` }),
  /* @__PURE__ */ jsxRuntimeExports.jsxs("g", { className: "eye-open", style: { opacity: isOpen ? 1 : 0 }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "path",
      {
        d: "M3.91752 12.7539C3.65127 12.2996 3.65037 11.7515 3.9149 11.2962C4.9042 9.59346 7.72688 5.49994 12 5.49994C16.2731 5.49994 19.0958 9.59346 20.0851 11.2962C20.3496 11.7515 20.3487 12.2996 20.0825 12.7539C19.0908 14.4459 16.2694 18.4999 12 18.4999C7.73064 18.4999 4.90918 14.4459 3.91752 12.7539Z",
        stroke: "currentColor",
        strokeWidth: "1.5",
        strokeLinecap: "round",
        strokeLinejoin: "round"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "path",
      {
        d: "M12 14.8261C13.5608 14.8261 14.8261 13.5608 14.8261 12C14.8261 10.4392 13.5608 9.17392 12 9.17392C10.4392 9.17392 9.17391 10.4392 9.17391 12C9.17391 13.5608 10.4392 14.8261 12 14.8261Z",
        stroke: "currentColor",
        strokeWidth: "1.5",
        strokeLinecap: "round",
        strokeLinejoin: "round"
      }
    )
  ] }),
  /* @__PURE__ */ jsxRuntimeExports.jsxs("g", { className: "eye-closed", style: { opacity: isOpen ? 0 : 1 }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "path",
      {
        d: "M18.6025 9.28503C18.9174 8.9701 19.4364 8.99481 19.7015 9.35271C20.1484 9.95606 20.4943 10.507 20.7342 10.9199C21.134 11.6086 21.1329 12.4454 20.7303 13.1328C20.2144 14.013 19.2151 15.5225 17.7723 16.8193C16.3293 18.1162 14.3852 19.2497 12.0008 19.25C11.4192 19.25 10.8638 19.1823 10.3355 19.0613C9.77966 18.934 9.63498 18.2525 10.0382 17.8493C10.2412 17.6463 10.5374 17.573 10.8188 17.6302C11.1993 17.7076 11.5935 17.75 12.0008 17.75C13.8848 17.7497 15.4867 16.8568 16.7693 15.7041C18.0522 14.5511 18.9606 13.1867 19.4363 12.375C19.5656 12.1543 19.5659 11.8943 19.4373 11.6729C19.2235 11.3049 18.921 10.8242 18.5364 10.3003C18.3085 9.98991 18.3302 9.5573 18.6025 9.28503ZM12.0008 4.75C12.5814 4.75006 13.1358 4.81803 13.6632 4.93953C14.2182 5.06741 14.362 5.74812 13.9593 6.15091C13.7558 6.35435 13.4589 6.42748 13.1771 6.36984C12.7983 6.29239 12.4061 6.25006 12.0008 6.25C10.1167 6.25 8.51415 7.15145 7.23028 8.31543C5.94678 9.47919 5.03918 10.8555 4.56426 11.6729C4.43551 11.8945 4.43582 12.1542 4.56524 12.375C4.77587 12.7343 5.07189 13.2012 5.44718 13.7105C5.67623 14.0213 5.65493 14.4552 5.38193 14.7282C5.0671 15.0431 4.54833 15.0189 4.28292 14.6614C3.84652 14.0736 3.50813 13.5369 3.27129 13.1328C2.86831 12.4451 2.86717 11.6088 3.26739 10.9199C3.78185 10.0345 4.77959 8.51239 6.22247 7.2041C7.66547 5.89584 9.61202 4.75 12.0008 4.75Z",
        fill: "currentColor"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "path",
      {
        d: "M5 19L19 5",
        stroke: "currentColor",
        strokeWidth: "1.5",
        strokeLinecap: "round"
      }
    )
  ] })
] });
const IconPausePlayAnimated = ({ size = 24, isPaused = false }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "none", children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: `
      .pause-bar, .play-triangle {
        transition: opacity 0.15s ease;
      }
    ` }),
  /* @__PURE__ */ jsxRuntimeExports.jsx(
    "path",
    {
      className: "pause-bar",
      d: "M8 6L8 18",
      stroke: "currentColor",
      strokeWidth: "1.5",
      strokeLinecap: "round",
      style: { opacity: isPaused ? 0 : 1 }
    }
  ),
  /* @__PURE__ */ jsxRuntimeExports.jsx(
    "path",
    {
      className: "pause-bar",
      d: "M16 18L16 6",
      stroke: "currentColor",
      strokeWidth: "1.5",
      strokeLinecap: "round",
      style: { opacity: isPaused ? 0 : 1 }
    }
  ),
  /* @__PURE__ */ jsxRuntimeExports.jsx(
    "path",
    {
      className: "play-triangle",
      d: "M17.75 10.701C18.75 11.2783 18.75 12.7217 17.75 13.299L8.75 18.4952C7.75 19.0725 6.5 18.3509 6.5 17.1962L6.5 6.80384C6.5 5.64914 7.75 4.92746 8.75 5.50481L17.75 10.701Z",
      stroke: "currentColor",
      strokeWidth: "1.5",
      style: { opacity: isPaused ? 1 : 0 }
    }
  )
] });
const IconGear = ({ size = 16 }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "none", children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx(
    "path",
    {
      d: "M10.6504 5.81117C10.9939 4.39628 13.0061 4.39628 13.3496 5.81117C13.5715 6.72517 14.6187 7.15891 15.4219 6.66952C16.6652 5.91193 18.0881 7.33479 17.3305 8.57815C16.8411 9.38134 17.2748 10.4285 18.1888 10.6504C19.6037 10.9939 19.6037 13.0061 18.1888 13.3496C17.2748 13.5715 16.8411 14.6187 17.3305 15.4219C18.0881 16.6652 16.6652 18.0881 15.4219 17.3305C14.6187 16.8411 13.5715 17.2748 13.3496 18.1888C13.0061 19.6037 10.9939 19.6037 10.6504 18.1888C10.4285 17.2748 9.38135 16.8411 8.57815 17.3305C7.33479 18.0881 5.91193 16.6652 6.66952 15.4219C7.15891 14.6187 6.72517 13.5715 5.81117 13.3496C4.39628 13.0061 4.39628 10.9939 5.81117 10.6504C6.72517 10.4285 7.15891 9.38134 6.66952 8.57815C5.91193 7.33479 7.33479 5.91192 8.57815 6.66952C9.38135 7.15891 10.4285 6.72517 10.6504 5.81117Z",
      stroke: "currentColor",
      strokeWidth: "1.5",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }
  ),
  /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "12", cy: "12", r: "2.5", stroke: "currentColor", strokeWidth: "1.5" })
] });
const IconTrashAlt = ({ size = 16 }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "none", children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx(
    "path",
    {
      d: "M10 11.5L10.125 15.5",
      stroke: "currentColor",
      strokeOpacity: "1",
      strokeWidth: "1.5",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }
  ),
  /* @__PURE__ */ jsxRuntimeExports.jsx(
    "path",
    {
      d: "M14 11.5L13.87 15.5",
      stroke: "currentColor",
      strokeOpacity: "1",
      strokeWidth: "1.5",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }
  ),
  /* @__PURE__ */ jsxRuntimeExports.jsx(
    "path",
    {
      d: "M9 7.5V6.25C9 5.42157 9.67157 4.75 10.5 4.75H13.5C14.3284 4.75 15 5.42157 15 6.25V7.5",
      stroke: "currentColor",
      strokeOpacity: "1",
      strokeWidth: "1.5",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }
  ),
  /* @__PURE__ */ jsxRuntimeExports.jsx(
    "path",
    {
      d: "M5.5 7.75H18.5",
      stroke: "currentColor",
      strokeOpacity: "1",
      strokeWidth: "1.5",
      strokeLinecap: "round"
    }
  ),
  /* @__PURE__ */ jsxRuntimeExports.jsx(
    "path",
    {
      d: "M6.75 7.75L7.11691 16.189C7.16369 17.2649 7.18708 17.8028 7.41136 18.2118C7.60875 18.5717 7.91211 18.8621 8.28026 19.0437C8.69854 19.25 9.23699 19.25 10.3139 19.25H13.6861C14.763 19.25 15.3015 19.25 15.7197 19.0437C16.0879 18.8621 16.3912 18.5717 16.5886 18.2118C16.8129 17.8028 16.8363 17.2649 16.8831 16.189L17.25 7.75",
      stroke: "currentColor",
      strokeOpacity: "1",
      strokeWidth: "1.5",
      strokeLinecap: "round"
    }
  )
] });
const IconXmark = ({ size = 16 }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "none", children: [
  /* @__PURE__ */ jsxRuntimeExports.jsxs("g", { clipPath: "url(#clip0_2_53)", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "path",
      {
        d: "M16.25 16.25L7.75 7.75",
        stroke: "currentColor",
        strokeWidth: "1.5",
        strokeLinecap: "round",
        strokeLinejoin: "round"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "path",
      {
        d: "M7.75 16.25L16.25 7.75",
        stroke: "currentColor",
        strokeWidth: "1.5",
        strokeLinecap: "round",
        strokeLinejoin: "round"
      }
    )
  ] }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("defs", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("clipPath", { id: "clip0_2_53", children: /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { width: "24", height: "24", fill: "white" }) }) })
] });
const IconXmarkLarge = ({ size = 24 }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "none", children: [
  /* @__PURE__ */ jsxRuntimeExports.jsxs("g", { clipPath: "url(#clip0_1_660)", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "path",
      {
        d: "M17.25 17.25L6.75 6.75",
        stroke: "currentColor",
        strokeWidth: "1.5",
        strokeLinecap: "round",
        strokeLinejoin: "round"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "path",
      {
        d: "M6.75 17.25L17.25 6.75",
        stroke: "currentColor",
        strokeWidth: "1.5",
        strokeLinecap: "round",
        strokeLinejoin: "round"
      }
    )
  ] }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("defs", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("clipPath", { id: "clip0_1_660", children: /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { width: "24", height: "24", fill: "white" }) }) })
] });
const IconSun = ({ size = 16 }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "none", children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "12", cy: "12", r: "4", stroke: "currentColor", strokeWidth: "1.5" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M12 5V3", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M12 21V19", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M16.95 7.05L18.36 5.64", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M5.64 18.36L7.05 16.95", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M19 12H21", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M3 12H5", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M16.95 16.95L18.36 18.36", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M5.64 5.64L7.05 7.05", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round" })
] });
const IconMoon = ({ size = 16 }) => /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "none", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
  "path",
  {
    d: "M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z",
    stroke: "currentColor",
    strokeWidth: "1.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }
) });

function getElementPath(target, maxDepth = 4) {
  const parts = [];
  let current = target;
  let depth = 0;
  while (current && depth < maxDepth) {
    const tag = current.tagName.toLowerCase();
    if (tag === "html" || tag === "body") break;
    let identifier = tag;
    if (current.id) {
      identifier = `#${current.id}`;
    } else if (current.className && typeof current.className === "string") {
      const meaningfulClass = current.className.split(/\s+/).find((c) => c.length > 2 && !c.match(/^[a-z]{1,2}$/) && !c.match(/[A-Z0-9]{5,}/));
      if (meaningfulClass) {
        identifier = `.${meaningfulClass.split("_")[0]}`;
      }
    }
    parts.unshift(identifier);
    current = current.parentElement;
    depth++;
  }
  return parts.join(" > ");
}
function identifyElement(target) {
  const path = getElementPath(target);
  if (target.dataset.element) {
    return { name: target.dataset.element, path };
  }
  const tag = target.tagName.toLowerCase();
  if (["path", "circle", "rect", "line", "g"].includes(tag)) {
    const svg = target.closest("svg");
    if (svg) {
      const parent = svg.parentElement;
      if (parent) {
        const parentName = identifyElement(parent).name;
        return { name: `graphic in ${parentName}`, path };
      }
    }
    return { name: "graphic element", path };
  }
  if (tag === "svg") {
    const parent = target.parentElement;
    if (parent?.tagName.toLowerCase() === "button") {
      const btnText = parent.textContent?.trim();
      return { name: btnText ? `icon in "${btnText}" button` : "button icon", path };
    }
    return { name: "icon", path };
  }
  if (tag === "button") {
    const text = target.textContent?.trim();
    const ariaLabel = target.getAttribute("aria-label");
    if (ariaLabel) return { name: `button [${ariaLabel}]`, path };
    return { name: text ? `button "${text.slice(0, 25)}"` : "button", path };
  }
  if (tag === "a") {
    const text = target.textContent?.trim();
    const href = target.getAttribute("href");
    if (text) return { name: `link "${text.slice(0, 25)}"`, path };
    if (href) return { name: `link to ${href.slice(0, 30)}`, path };
    return { name: "link", path };
  }
  if (tag === "input") {
    const type = target.getAttribute("type") || "text";
    const placeholder = target.getAttribute("placeholder");
    const name = target.getAttribute("name");
    if (placeholder) return { name: `input "${placeholder}"`, path };
    if (name) return { name: `input [${name}]`, path };
    return { name: `${type} input`, path };
  }
  if (["h1", "h2", "h3", "h4", "h5", "h6"].includes(tag)) {
    const text = target.textContent?.trim();
    return { name: text ? `${tag} "${text.slice(0, 35)}"` : tag, path };
  }
  if (tag === "p") {
    const text = target.textContent?.trim();
    if (text) return { name: `paragraph: "${text.slice(0, 40)}${text.length > 40 ? "..." : ""}"`, path };
    return { name: "paragraph", path };
  }
  if (tag === "span" || tag === "label") {
    const text = target.textContent?.trim();
    if (text && text.length < 40) return { name: `"${text}"`, path };
    return { name: tag, path };
  }
  if (tag === "li") {
    const text = target.textContent?.trim();
    if (text && text.length < 40) return { name: `list item: "${text.slice(0, 35)}"`, path };
    return { name: "list item", path };
  }
  if (tag === "blockquote") return { name: "blockquote", path };
  if (tag === "code") {
    const text = target.textContent?.trim();
    if (text && text.length < 30) return { name: `code: \`${text}\``, path };
    return { name: "code", path };
  }
  if (tag === "pre") return { name: "code block", path };
  if (tag === "img") {
    const alt = target.getAttribute("alt");
    return { name: alt ? `image "${alt.slice(0, 30)}"` : "image", path };
  }
  if (tag === "video") return { name: "video", path };
  if (["div", "section", "article", "nav", "header", "footer", "aside", "main"].includes(tag)) {
    const className = target.className;
    const role = target.getAttribute("role");
    const ariaLabel = target.getAttribute("aria-label");
    if (ariaLabel) return { name: `${tag} [${ariaLabel}]`, path };
    if (role) return { name: `${role}`, path };
    if (typeof className === "string" && className) {
      const words = className.split(/[\s_-]+/).map((c) => c.replace(/[A-Z0-9]{5,}.*$/, "")).filter((c) => c.length > 2 && !/^[a-z]{1,2}$/.test(c)).slice(0, 2);
      if (words.length > 0) return { name: words.join(" "), path };
    }
    return { name: tag === "div" ? "container" : tag, path };
  }
  return { name: tag, path };
}
function getNearbyText(element) {
  const texts = [];
  const ownText = element.textContent?.trim();
  if (ownText && ownText.length < 100) {
    texts.push(ownText);
  }
  const prev = element.previousElementSibling;
  if (prev) {
    const prevText = prev.textContent?.trim();
    if (prevText && prevText.length < 50) {
      texts.unshift(`[before: "${prevText.slice(0, 40)}"]`);
    }
  }
  const next = element.nextElementSibling;
  if (next) {
    const nextText = next.textContent?.trim();
    if (nextText && nextText.length < 50) {
      texts.push(`[after: "${nextText.slice(0, 40)}"]`);
    }
  }
  return texts.join(" ");
}
function getNearbyElements(element) {
  const parent = element.parentElement;
  if (!parent) return "";
  const siblings = Array.from(parent.children).filter(
    (child) => child !== element && child instanceof HTMLElement
  );
  if (siblings.length === 0) return "";
  const siblingIds = siblings.slice(0, 4).map((sib) => {
    const tag = sib.tagName.toLowerCase();
    const className = sib.className;
    let cls = "";
    if (typeof className === "string" && className) {
      const meaningful = className.split(/\s+/).map((c) => c.replace(/[_][a-zA-Z0-9]{5,}.*$/, "")).find((c) => c.length > 2 && !/^[a-z]{1,2}$/.test(c));
      if (meaningful) cls = `.${meaningful}`;
    }
    if (tag === "button" || tag === "a") {
      const text = sib.textContent?.trim().slice(0, 15);
      if (text) return `${tag}${cls} "${text}"`;
    }
    return `${tag}${cls}`;
  });
  const parentTag = parent.tagName.toLowerCase();
  let parentId = parentTag;
  if (typeof parent.className === "string" && parent.className) {
    const parentCls = parent.className.split(/\s+/).map((c) => c.replace(/[_][a-zA-Z0-9]{5,}.*$/, "")).find((c) => c.length > 2 && !/^[a-z]{1,2}$/.test(c));
    if (parentCls) parentId = `.${parentCls}`;
  }
  const total = parent.children.length;
  const suffix = total > siblingIds.length + 1 ? ` (${total} total in ${parentId})` : "";
  return siblingIds.join(", ") + suffix;
}
function getElementClasses(target) {
  const className = target.className;
  if (typeof className !== "string" || !className) return "";
  const classes = className.split(/\s+/).filter((c) => c.length > 0).map((c) => {
    const match = c.match(/^([a-zA-Z][a-zA-Z0-9_-]*?)(?:_[a-zA-Z0-9]{5,})?$/);
    return match ? match[1] : c;
  }).filter((c, i, arr) => arr.indexOf(c) === i);
  return classes.join(", ");
}
function getDetailedComputedStyles(target) {
  if (typeof window === "undefined") return {};
  const styles = window.getComputedStyle(target);
  const result = {};
  const properties = [
    "color",
    "backgroundColor",
    "borderColor",
    "fontSize",
    "fontWeight",
    "fontFamily",
    "lineHeight",
    "letterSpacing",
    "textAlign",
    "width",
    "height",
    "padding",
    "margin",
    "border",
    "borderRadius",
    "display",
    "position",
    "top",
    "right",
    "bottom",
    "left",
    "zIndex",
    "flexDirection",
    "justifyContent",
    "alignItems",
    "gap",
    "opacity",
    "visibility",
    "overflow",
    "boxShadow",
    "transform"
  ];
  for (const prop of properties) {
    const value = styles.getPropertyValue(prop.replace(/([A-Z])/g, "-$1").toLowerCase());
    if (value && value !== "none" && value !== "normal" && value !== "auto" && value !== "0px" && value !== "rgba(0, 0, 0, 0)") {
      result[prop] = value;
    }
  }
  return result;
}
function getAccessibilityInfo(target) {
  const parts = [];
  const role = target.getAttribute("role");
  const ariaLabel = target.getAttribute("aria-label");
  const ariaDescribedBy = target.getAttribute("aria-describedby");
  const tabIndex = target.getAttribute("tabindex");
  const ariaHidden = target.getAttribute("aria-hidden");
  if (role) parts.push(`role="${role}"`);
  if (ariaLabel) parts.push(`aria-label="${ariaLabel}"`);
  if (ariaDescribedBy) parts.push(`aria-describedby="${ariaDescribedBy}"`);
  if (tabIndex) parts.push(`tabindex=${tabIndex}`);
  if (ariaHidden === "true") parts.push("aria-hidden");
  const focusable = target.matches("a, button, input, select, textarea, [tabindex]");
  if (focusable) parts.push("focusable");
  return parts.join(", ");
}
function getFullElementPath(target) {
  const parts = [];
  let current = target;
  while (current && current.tagName.toLowerCase() !== "html") {
    const tag = current.tagName.toLowerCase();
    let identifier = tag;
    if (current.id) {
      identifier = `${tag}#${current.id}`;
    } else if (current.className && typeof current.className === "string") {
      const cls = current.className.split(/\s+/).map((c) => c.replace(/[_][a-zA-Z0-9]{5,}.*$/, "")).find((c) => c.length > 2);
      if (cls) identifier = `${tag}.${cls}`;
    }
    parts.unshift(identifier);
    current = current.parentElement;
  }
  return parts.join(" > ");
}

const toolbar = "_toolbar_1g407_151";
const toolbarContainer = "_toolbarContainer_1g407_162";
const dragging = "_dragging_1g407_177";
const entrance = "_entrance_1g407_181";
const collapsed = "_collapsed_1g407_184";
const expanded = "_expanded_1g407_200";
const toggleContent = "_toggleContent_1g407_212";
const visible = "_visible_1g407_219";
const hidden = "_hidden_1g407_224";
const controlsContent = "_controlsContent_1g407_229";
const badge = "_badge_1g407_249";
const fadeOut = "_fadeOut_1g407_270";
const controlButton = "_controlButton_1g407_279";
const divider = "_divider_1g407_312";
const overlay = "_overlay_1g407_319";
const hoverHighlight = "_hoverHighlight_1g407_329";
const enter = "_enter_1g407_339";
const multiSelectOutline = "_multiSelectOutline_1g407_343";
const exit = "_exit_1g407_355";
const singleSelectOutline = "_singleSelectOutline_1g407_359";
const hoverTooltip = "_hoverTooltip_1g407_375";
const markersLayer = "_markersLayer_1g407_393";
const fixedMarkersLayer = "_fixedMarkersLayer_1g407_406";
const marker = "_marker_1g407_393";
const clearing = "_clearing_1g407_443";
const pending = "_pending_1g407_460";
const fixed = "_fixed_1g407_406";
const multiSelect = "_multiSelect_1g407_343";
const hovered = "_hovered_1g407_477";
const renumber = "_renumber_1g407_481";
const markerTooltip = "_markerTooltip_1g407_496";
const markerQuote = "_markerQuote_1g407_515";
const markerNote = "_markerNote_1g407_527";
const settingsPanel = "_settingsPanel_1g407_548";
const settingsHeader = "_settingsHeader_1g407_559";
const settingsBrand = "_settingsBrand_1g407_560";
const settingsBrandSlash = "_settingsBrandSlash_1g407_561";
const settingsVersion = "_settingsVersion_1g407_562";
const settingsSection = "_settingsSection_1g407_563";
const settingsLabel = "_settingsLabel_1g407_564";
const cycleButton = "_cycleButton_1g407_565";
const cycleDot = "_cycleDot_1g407_566";
const toggleLabel = "_toggleLabel_1g407_568";
const customCheckbox = "_customCheckbox_1g407_569";
const helpIcon = "_helpIcon_1g407_572";
const themeToggle = "_themeToggle_1g407_573";
const dark = "_dark_1g407_589";
const selected = "_selected_1g407_602";
const settingsRow = "_settingsRow_1g407_645";
const light = "_light_1g407_691";
const cycleButtonText = "_cycleButtonText_1g407_705";
const cycleDots = "_cycleDots_1g407_710";
const active = "_active_1g407_724";
const settingsLabelMarker = "_settingsLabelMarker_1g407_786";
const colorOptions = "_colorOptions_1g407_884";
const colorOption = "_colorOption_1g407_884";
const colorOptionRing = "_colorOptionRing_1g407_907";
const settingsToggle = "_settingsToggle_1g407_915";
const checked = "_checked_1g407_957";
const dragSelection = "_dragSelection_1g407_1024";
const highlightsContainer = "_highlightsContainer_1g407_1052";
const styles = {
	toolbar: toolbar,
	toolbarContainer: toolbarContainer,
	dragging: dragging,
	entrance: entrance,
	collapsed: collapsed,
	expanded: expanded,
	toggleContent: toggleContent,
	visible: visible,
	hidden: hidden,
	controlsContent: controlsContent,
	badge: badge,
	fadeOut: fadeOut,
	controlButton: controlButton,
	divider: divider,
	overlay: overlay,
	hoverHighlight: hoverHighlight,
	enter: enter,
	multiSelectOutline: multiSelectOutline,
	exit: exit,
	singleSelectOutline: singleSelectOutline,
	hoverTooltip: hoverTooltip,
	markersLayer: markersLayer,
	fixedMarkersLayer: fixedMarkersLayer,
	marker: marker,
	clearing: clearing,
	pending: pending,
	fixed: fixed,
	multiSelect: multiSelect,
	hovered: hovered,
	renumber: renumber,
	markerTooltip: markerTooltip,
	markerQuote: markerQuote,
	markerNote: markerNote,
	settingsPanel: settingsPanel,
	settingsHeader: settingsHeader,
	settingsBrand: settingsBrand,
	settingsBrandSlash: settingsBrandSlash,
	settingsVersion: settingsVersion,
	settingsSection: settingsSection,
	settingsLabel: settingsLabel,
	cycleButton: cycleButton,
	cycleDot: cycleDot,
	toggleLabel: toggleLabel,
	customCheckbox: customCheckbox,
	helpIcon: helpIcon,
	themeToggle: themeToggle,
	dark: dark,
	selected: selected,
	settingsRow: settingsRow,
	light: light,
	cycleButtonText: cycleButtonText,
	cycleDots: cycleDots,
	active: active,
	settingsLabelMarker: settingsLabelMarker,
	colorOptions: colorOptions,
	colorOption: colorOption,
	colorOptionRing: colorOptionRing,
	settingsToggle: settingsToggle,
	checked: checked,
	dragSelection: dragSelection,
	highlightsContainer: highlightsContainer};

const VERSION = "1.0.0";
let hasPlayedEntranceAnimation = false;
const DEFAULT_TOOLBAR_SETTINGS = {
  outputDetail: "standard",
  autoClearAfterCopy: false,
  annotationColor: "#3c82f7",
  blockInteractions: false
};
const OUTPUT_DETAIL_OPTIONS = [
  { value: "compact", label: "Compact" },
  { value: "standard", label: "Standard" },
  { value: "detailed", label: "Detailed" },
  { value: "forensic", label: "Forensic" }
];
const COLOR_OPTIONS = [
  { value: "#AF52DE", label: "Purple" },
  { value: "#3c82f7", label: "Blue" },
  { value: "#5AC8FA", label: "Cyan" },
  { value: "#34C759", label: "Green" },
  { value: "#FFD60A", label: "Yellow" },
  { value: "#FF9500", label: "Orange" },
  { value: "#FF3B30", label: "Red" }
];
function isElementFixed(element) {
  let current = element;
  while (current && current !== document.body) {
    const style = window.getComputedStyle(current);
    const position = style.position;
    if (position === "fixed" || position === "sticky") {
      return true;
    }
    current = current.parentElement;
  }
  return false;
}
function generateOutput(annotations, pathname, detailLevel = "standard") {
  if (annotations.length === 0) return "";
  const viewport = `${window.innerWidth}×${window.innerHeight}`;
  let output = `## Page Feedback: ${pathname}
`;
  if (detailLevel === "forensic") {
    output += `
**Environment:**
`;
    output += `- Viewport: ${viewport}
`;
    output += `- URL: ${window.location.href}
`;
    output += `- User Agent: ${navigator.userAgent}
`;
    output += `- Timestamp: ${(/* @__PURE__ */ new Date()).toISOString()}
`;
    output += `- Device Pixel Ratio: ${window.devicePixelRatio}
`;
    output += `
---
`;
  } else if (detailLevel !== "compact") {
    output += `**Viewport:** ${viewport}
`;
  }
  output += "\n";
  annotations.forEach((a, i) => {
    if (detailLevel === "compact") {
      output += `${i + 1}. **${a.element}**: ${a.comment}`;
      if (a.selectedText) {
        output += ` (re: "${a.selectedText.slice(0, 30)}${a.selectedText.length > 30 ? "..." : ""}")`;
      }
      output += "\n";
    } else if (detailLevel === "forensic") {
      output += `### ${i + 1}. ${a.element}
`;
      if (a.isMultiSelect && a.fullPath) {
        output += `*Forensic data shown for first element of selection*
`;
      }
      if (a.fullPath) {
        output += `**Full DOM Path:** ${a.fullPath}
`;
      }
      if (a.cssClasses) {
        output += `**CSS Classes:** ${a.cssClasses}
`;
      }
      if (a.boundingBox) {
        output += `**Position:** x:${Math.round(a.boundingBox.x)}, y:${Math.round(a.boundingBox.y)} (${Math.round(a.boundingBox.width)}×${Math.round(a.boundingBox.height)}px)
`;
      }
      output += `**Annotation at:** ${a.x.toFixed(1)}% from left, ${Math.round(a.y)}px from top
`;
      if (a.selectedText) {
        output += `**Selected text:** "${a.selectedText}"
`;
      }
      if (a.nearbyText && !a.selectedText) {
        output += `**Context:** ${a.nearbyText.slice(0, 100)}
`;
      }
      if (a.computedStyles) {
        output += `**Computed Styles:** ${a.computedStyles}
`;
      }
      if (a.accessibility) {
        output += `**Accessibility:** ${a.accessibility}
`;
      }
      if (a.nearbyElements) {
        output += `**Nearby Elements:** ${a.nearbyElements}
`;
      }
      output += `**Feedback:** ${a.comment}

`;
    } else {
      output += `### ${i + 1}. ${a.element}
`;
      output += `**Location:** ${a.elementPath}
`;
      if (detailLevel === "detailed") {
        if (a.cssClasses) {
          output += `**Classes:** ${a.cssClasses}
`;
        }
        if (a.boundingBox) {
          output += `**Position:** ${Math.round(a.boundingBox.x)}px, ${Math.round(a.boundingBox.y)}px (${Math.round(a.boundingBox.width)}×${Math.round(a.boundingBox.height)}px)
`;
        }
      }
      if (a.selectedText) {
        output += `**Selected text:** "${a.selectedText}"
`;
      }
      if (detailLevel === "detailed" && a.nearbyText && !a.selectedText) {
        output += `**Context:** ${a.nearbyText.slice(0, 100)}
`;
      }
      output += `**Feedback:** ${a.comment}

`;
    }
  });
  return output.trim();
}
function PageFeedbackToolbar() {
  const [isActive, setIsActive] = reactExports.useState(false);
  const [annotations, setAnnotations] = reactExports.useState([]);
  const [showMarkers, setShowMarkers] = reactExports.useState(true);
  const [markersVisible, setMarkersVisible] = reactExports.useState(false);
  const [markersExiting, setMarkersExiting] = reactExports.useState(false);
  const [hoverInfo, setHoverInfo] = reactExports.useState(null);
  const [hoverPosition, setHoverPosition] = reactExports.useState({ x: 0, y: 0 });
  const [pendingAnnotation, setPendingAnnotation] = reactExports.useState(null);
  const [copied, setCopied] = reactExports.useState(false);
  const [cleared, setCleared] = reactExports.useState(false);
  const [isClearing, setIsClearing] = reactExports.useState(false);
  const [hoveredMarkerId, setHoveredMarkerId] = reactExports.useState(null);
  const [deletingMarkerId, setDeletingMarkerId] = reactExports.useState(null);
  const [renumberFrom, setRenumberFrom] = reactExports.useState(null);
  const [editingAnnotation, setEditingAnnotation] = reactExports.useState(null);
  const [scrollY, setScrollY] = reactExports.useState(0);
  const [isScrolling, setIsScrolling] = reactExports.useState(false);
  const [mounted, setMounted] = reactExports.useState(false);
  const [isFrozen, setIsFrozen] = reactExports.useState(false);
  const [showSettings, setShowSettings] = reactExports.useState(false);
  const [showSettingsVisible, setShowSettingsVisible] = reactExports.useState(false);
  const [settings, setSettings] = reactExports.useState(DEFAULT_TOOLBAR_SETTINGS);
  const [isDarkMode, setIsDarkMode] = reactExports.useState(true);
  const [showEntranceAnimation, setShowEntranceAnimation] = reactExports.useState(false);
  const [toolbarPosition, setToolbarPosition] = reactExports.useState(null);
  const [isDraggingToolbar, setIsDraggingToolbar] = reactExports.useState(false);
  const [dragStartPos, setDragStartPos] = reactExports.useState(null);
  const [dragRotation, setDragRotation] = reactExports.useState(0);
  const justFinishedToolbarDragRef = reactExports.useRef(false);
  const [animatedMarkers, setAnimatedMarkers] = reactExports.useState(/* @__PURE__ */ new Set());
  const [exitingMarkers, setExitingMarkers] = reactExports.useState(/* @__PURE__ */ new Set());
  const [pendingExiting, setPendingExiting] = reactExports.useState(false);
  const [editExiting, setEditExiting] = reactExports.useState(false);
  const [isDragging, setIsDragging] = reactExports.useState(false);
  reactExports.useRef(null);
  reactExports.useRef(null);
  const dragRectRef = reactExports.useRef(null);
  const highlightsContainerRef = reactExports.useRef(null);
  const justFinishedDragRef = reactExports.useRef(false);
  reactExports.useRef(0);
  const recentlyAddedIdRef = reactExports.useRef(null);
  const popupRef = reactExports.useRef(null);
  const editPopupRef = reactExports.useRef(null);
  const scrollTimeoutRef = reactExports.useRef(null);
  const currentUrl = window.location.href;
  reactExports.useEffect(() => {
    const handleToggle = () => {
      setIsActive((prev) => !prev);
    };
    window.addEventListener("agentation-toggle", handleToggle);
    return () => window.removeEventListener("agentation-toggle", handleToggle);
  }, []);
  reactExports.useEffect(() => {
    if (showSettings) {
      setShowSettingsVisible(true);
    } else {
      const timer = setTimeout(() => setShowSettingsVisible(false), 0);
      return () => clearTimeout(timer);
    }
  }, [showSettings]);
  const shouldShowMarkers = isActive && showMarkers;
  reactExports.useEffect(() => {
    if (shouldShowMarkers) {
      setMarkersExiting(false);
      setMarkersVisible(true);
      setAnimatedMarkers(/* @__PURE__ */ new Set());
      const timer = setTimeout(() => {
        setAnimatedMarkers((prev) => {
          const newSet = new Set(prev);
          annotations.forEach((a) => newSet.add(a.id));
          return newSet;
        });
      }, 350);
      return () => clearTimeout(timer);
    } else if (markersVisible) {
      setMarkersExiting(true);
      const timer = setTimeout(() => {
        setMarkersVisible(false);
        setMarkersExiting(false);
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [shouldShowMarkers, annotations]);
  reactExports.useEffect(() => {
    setMounted(true);
    setScrollY(window.scrollY);
    loadAnnotations(currentUrl).then((stored) => {
      setAnnotations(stored);
      chrome.runtime.sendMessage({
        type: "UPDATE_BADGE",
        count: stored.length
      }).catch(() => {
      });
    });
    chrome.storage.sync.get("agentation-settings").then((result) => {
      if (result["agentation-settings"]) {
        setSettings({ ...DEFAULT_TOOLBAR_SETTINGS, ...result["agentation-settings"] });
      }
    }).catch(() => {
    });
    chrome.storage.sync.get("agentation-theme").then((result) => {
      if (result["agentation-theme"] !== void 0) {
        setIsDarkMode(result["agentation-theme"] === "dark");
      }
    }).catch(() => {
    });
    if (!hasPlayedEntranceAnimation) {
      setShowEntranceAnimation(true);
      hasPlayedEntranceAnimation = true;
      setTimeout(() => setShowEntranceAnimation(false), 750);
    }
  }, [currentUrl]);
  reactExports.useEffect(() => {
    if (mounted) {
      chrome.storage.sync.set({ "agentation-settings": settings }).catch(() => {
      });
    }
  }, [settings, mounted]);
  reactExports.useEffect(() => {
    if (mounted) {
      chrome.storage.sync.set({ "agentation-theme": isDarkMode ? "dark" : "light" }).catch(() => {
      });
    }
  }, [isDarkMode, mounted]);
  reactExports.useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      setIsScrolling(true);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
      }, 150);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);
  reactExports.useEffect(() => {
    if (mounted) {
      saveAnnotations(currentUrl, annotations).then(() => {
        chrome.runtime.sendMessage({
          type: "UPDATE_BADGE",
          count: annotations.length
        }).catch(() => {
        });
      });
    }
  }, [annotations, currentUrl, mounted]);
  const freezeAnimations = reactExports.useCallback(() => {
    if (isFrozen) return;
    const style = document.createElement("style");
    style.id = "agentation-freeze-styles";
    style.textContent = `
      *:not([data-feedback-toolbar]):not([data-feedback-toolbar] *):not([data-annotation-popup]):not([data-annotation-popup] *):not([data-annotation-marker]):not([data-annotation-marker] *)::before,
      *:not([data-feedback-toolbar]):not([data-feedback-toolbar] *):not([data-annotation-popup]):not([data-annotation-popup] *):not([data-annotation-marker]):not([data-annotation-marker] *)::after {
        animation-play-state: paused !important;
        transition: none !important;
      }
    `;
    document.head.appendChild(style);
    document.querySelectorAll("video").forEach((video) => {
      if (!video.paused) {
        video.dataset.wasPaused = "false";
        video.pause();
      }
    });
    setIsFrozen(true);
  }, [isFrozen]);
  const unfreezeAnimations = reactExports.useCallback(() => {
    if (!isFrozen) return;
    const style = document.getElementById("agentation-freeze-styles");
    if (style) style.remove();
    document.querySelectorAll("video").forEach((video) => {
      if (video.dataset.wasPaused === "false") {
        video.play();
        delete video.dataset.wasPaused;
      }
    });
    setIsFrozen(false);
  }, [isFrozen]);
  const toggleFreeze = reactExports.useCallback(() => {
    if (isFrozen) {
      unfreezeAnimations();
    } else {
      freezeAnimations();
    }
  }, [isFrozen, freezeAnimations, unfreezeAnimations]);
  reactExports.useEffect(() => {
    if (!isActive) {
      setPendingAnnotation(null);
      setEditingAnnotation(null);
      setHoverInfo(null);
      setShowSettings(false);
      if (isFrozen) {
        unfreezeAnimations();
      }
    }
  }, [isActive, isFrozen, unfreezeAnimations]);
  reactExports.useEffect(() => {
    if (!isActive) return;
    const style = document.createElement("style");
    style.id = "agentation-cursor-styles";
    style.textContent = `
      body * {
        cursor: crosshair !important;
      }
      body p, body span, body h1, body h2, body h3, body h4, body h5, body h6,
      body li, body td, body th, body label, body blockquote, body figcaption,
      body caption, body legend, body dt, body dd, body pre, body code,
      body em, body strong, body b, body i, body u, body s, body a,
      body time, body address, body cite, body q, body abbr, body dfn,
      body mark, body small, body sub, body sup, body [contenteditable],
      body p *, body span *, body h1 *, body h2 *, body h3 *, body h4 *,
      body h5 *, body h6 *, body li *, body a *, body label *, body pre *,
      body code *, body blockquote *, body [contenteditable] * {
        cursor: text !important;
      }
      [data-feedback-toolbar], [data-feedback-toolbar] * {
        cursor: default !important;
      }
      [data-annotation-marker], [data-annotation-marker] * {
        cursor: pointer !important;
      }
    `;
    document.head.appendChild(style);
    return () => {
      const existingStyle = document.getElementById("agentation-cursor-styles");
      if (existingStyle) existingStyle.remove();
    };
  }, [isActive]);
  reactExports.useEffect(() => {
    if (!isActive || pendingAnnotation) return;
    const handleMouseMove = (e) => {
      if (e.target.closest("[data-feedback-toolbar]")) {
        setHoverInfo(null);
        return;
      }
      const elementUnder = document.elementFromPoint(e.clientX, e.clientY);
      if (!elementUnder || elementUnder.closest("[data-feedback-toolbar]")) {
        setHoverInfo(null);
        return;
      }
      const { name, path } = identifyElement(elementUnder);
      const rect = elementUnder.getBoundingClientRect();
      setHoverInfo({ element: name, elementPath: path, rect });
      setHoverPosition({ x: e.clientX, y: e.clientY });
    };
    document.addEventListener("mousemove", handleMouseMove);
    return () => document.removeEventListener("mousemove", handleMouseMove);
  }, [isActive, pendingAnnotation]);
  reactExports.useEffect(() => {
    if (!isActive) return;
    const handleClick = (e) => {
      if (justFinishedDragRef.current) {
        justFinishedDragRef.current = false;
        return;
      }
      const target = e.target;
      if (target.closest("[data-feedback-toolbar]")) return;
      if (target.closest("[data-annotation-popup]")) return;
      if (target.closest("[data-annotation-marker]")) return;
      const isInteractive = target.closest(
        "button, a, input, select, textarea, [role='button'], [onclick]"
      );
      if (settings.blockInteractions && isInteractive) {
        e.preventDefault();
        e.stopPropagation();
      }
      if (pendingAnnotation) {
        if (isInteractive && !settings.blockInteractions) {
          return;
        }
        e.preventDefault();
        popupRef.current?.shake();
        return;
      }
      if (editingAnnotation) {
        if (isInteractive && !settings.blockInteractions) {
          return;
        }
        e.preventDefault();
        editPopupRef.current?.shake();
        return;
      }
      e.preventDefault();
      const elementUnder = document.elementFromPoint(e.clientX, e.clientY);
      if (!elementUnder) return;
      const { name, path } = identifyElement(elementUnder);
      const rect = elementUnder.getBoundingClientRect();
      const x = e.clientX / window.innerWidth * 100;
      const isFixed = isElementFixed(elementUnder);
      const y = isFixed ? e.clientY : e.clientY + window.scrollY;
      const selection = window.getSelection();
      let selectedText;
      if (selection && selection.toString().trim().length > 0) {
        selectedText = selection.toString().trim().slice(0, 500);
      }
      const computedStylesObj = getDetailedComputedStyles(elementUnder);
      const computedStylesStr = Object.entries(computedStylesObj).map(([k, v]) => `${k}: ${v}`).join("; ");
      setPendingAnnotation({
        x,
        y,
        clientY: e.clientY,
        element: name,
        elementPath: path,
        selectedText,
        boundingBox: {
          x: rect.left,
          y: isFixed ? rect.top : rect.top + window.scrollY,
          width: rect.width,
          height: rect.height
        },
        nearbyText: getNearbyText(elementUnder),
        cssClasses: getElementClasses(elementUnder),
        isFixed,
        fullPath: getFullElementPath(elementUnder),
        accessibility: getAccessibilityInfo(elementUnder),
        computedStyles: computedStylesStr,
        nearbyElements: getNearbyElements(elementUnder)
      });
      setHoverInfo(null);
    };
    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [isActive, pendingAnnotation, editingAnnotation, settings.blockInteractions]);
  const addAnnotation = reactExports.useCallback(
    (comment) => {
      if (!pendingAnnotation) return;
      const newAnnotation = {
        id: Date.now().toString(),
        x: pendingAnnotation.x,
        y: pendingAnnotation.y,
        comment,
        element: pendingAnnotation.element,
        elementPath: pendingAnnotation.elementPath,
        timestamp: Date.now(),
        selectedText: pendingAnnotation.selectedText,
        boundingBox: pendingAnnotation.boundingBox,
        nearbyText: pendingAnnotation.nearbyText,
        cssClasses: pendingAnnotation.cssClasses,
        isMultiSelect: pendingAnnotation.isMultiSelect,
        isFixed: pendingAnnotation.isFixed,
        fullPath: pendingAnnotation.fullPath,
        accessibility: pendingAnnotation.accessibility,
        computedStyles: pendingAnnotation.computedStyles,
        nearbyElements: pendingAnnotation.nearbyElements
      };
      setAnnotations((prev) => [...prev, newAnnotation]);
      recentlyAddedIdRef.current = newAnnotation.id;
      setTimeout(() => {
        recentlyAddedIdRef.current = null;
      }, 300);
      setTimeout(() => {
        setAnimatedMarkers((prev) => new Set(prev).add(newAnnotation.id));
      }, 250);
      setPendingExiting(true);
      setTimeout(() => {
        setPendingAnnotation(null);
        setPendingExiting(false);
      }, 150);
      window.getSelection()?.removeAllRanges();
    },
    [pendingAnnotation]
  );
  const cancelAnnotation = reactExports.useCallback(() => {
    setPendingExiting(true);
    setTimeout(() => {
      setPendingAnnotation(null);
      setPendingExiting(false);
    }, 150);
  }, []);
  const deleteAnnotation = reactExports.useCallback(
    (id) => {
      const deletedIndex = annotations.findIndex((a) => a.id === id);
      setDeletingMarkerId(id);
      setExitingMarkers((prev) => new Set(prev).add(id));
      setTimeout(() => {
        setAnnotations((prev) => prev.filter((a) => a.id !== id));
        setExitingMarkers((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
        setDeletingMarkerId(null);
        if (deletedIndex < annotations.length - 1) {
          setRenumberFrom(deletedIndex);
          setTimeout(() => setRenumberFrom(null), 200);
        }
      }, 150);
    },
    [annotations]
  );
  const startEditAnnotation = reactExports.useCallback((annotation) => {
    setEditingAnnotation(annotation);
    setHoveredMarkerId(null);
  }, []);
  const updateAnnotation = reactExports.useCallback(
    (newComment) => {
      if (!editingAnnotation) return;
      setAnnotations(
        (prev) => prev.map(
          (a) => a.id === editingAnnotation.id ? { ...a, comment: newComment } : a
        )
      );
      setEditExiting(true);
      setTimeout(() => {
        setEditingAnnotation(null);
        setEditExiting(false);
      }, 150);
    },
    [editingAnnotation]
  );
  const cancelEditAnnotation = reactExports.useCallback(() => {
    setEditExiting(true);
    setTimeout(() => {
      setEditingAnnotation(null);
      setEditExiting(false);
    }, 150);
  }, []);
  const clearAll = reactExports.useCallback(() => {
    const count = annotations.length;
    if (count === 0) return;
    setIsClearing(true);
    setCleared(true);
    const totalAnimationTime = count * 30 + 200;
    setTimeout(() => {
      setAnnotations([]);
      setAnimatedMarkers(/* @__PURE__ */ new Set());
      setIsClearing(false);
    }, totalAnimationTime);
    setTimeout(() => setCleared(false), 1500);
  }, [annotations.length]);
  const copyOutput = reactExports.useCallback(async () => {
    const pathname = window.location.pathname;
    const output = generateOutput(annotations, pathname, settings.outputDetail);
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2e3);
    if (settings.autoClearAfterCopy) {
      setTimeout(() => clearAll(), 500);
    }
  }, [annotations, settings.outputDetail, settings.autoClearAfterCopy, clearAll]);
  reactExports.useEffect(() => {
    if (!dragStartPos) return;
    const DRAG_THRESHOLD2 = 5;
    const handleMouseMove = (e) => {
      const deltaX = e.clientX - dragStartPos.x;
      const deltaY = e.clientY - dragStartPos.y;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      if (!isDraggingToolbar && distance > DRAG_THRESHOLD2) {
        setIsDraggingToolbar(true);
      }
      if (isDraggingToolbar || distance > DRAG_THRESHOLD2) {
        let newX = dragStartPos.toolbarX + deltaX;
        let newY = dragStartPos.toolbarY + deltaY;
        const padding = 20;
        const containerWidth = 257;
        const circleWidth = 44;
        const toolbarHeight = 44;
        if (isActive) {
          newX = Math.max(padding, Math.min(window.innerWidth - containerWidth - padding, newX));
        } else {
          const circleOffset = containerWidth - circleWidth;
          const minX = padding - circleOffset;
          const maxX = window.innerWidth - padding - circleOffset - circleWidth;
          newX = Math.max(minX, Math.min(maxX, newX));
        }
        newY = Math.max(padding, Math.min(window.innerHeight - toolbarHeight - padding, newY));
        setToolbarPosition({ x: newX, y: newY });
      }
    };
    const handleMouseUp = () => {
      if (isDraggingToolbar) {
        justFinishedToolbarDragRef.current = true;
        setTimeout(() => {
          justFinishedToolbarDragRef.current = false;
        }, 50);
      }
      setIsDraggingToolbar(false);
      setDragStartPos(null);
    };
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragStartPos, isDraggingToolbar, isActive]);
  const handleToolbarMouseDown = reactExports.useCallback(
    (e) => {
      if (e.target.closest("button") || e.target.closest(`.${styles.settingsPanel}`)) {
        return;
      }
      const toolbarParent = e.currentTarget.parentElement;
      if (!toolbarParent) return;
      const rect = toolbarParent.getBoundingClientRect();
      const currentX = toolbarPosition?.x ?? rect.left;
      const currentY = toolbarPosition?.y ?? rect.top;
      const randomRotation = (Math.random() - 0.5) * 10;
      setDragRotation(randomRotation);
      setDragStartPos({
        x: e.clientX,
        y: e.clientY,
        toolbarX: currentX,
        toolbarY: currentY
      });
    },
    [toolbarPosition]
  );
  reactExports.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        if (pendingAnnotation) ; else if (isActive) {
          setIsActive(false);
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isActive, pendingAnnotation]);
  if (!mounted) return null;
  const hasAnnotations = annotations.length > 0;
  const visibleAnnotations = annotations.filter((a) => !exitingMarkers.has(a.id));
  annotations.filter((a) => exitingMarkers.has(a.id));
  return reactDomExports.createPortal(
    /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: styles.toolbar,
          "data-feedback-toolbar": true,
          style: toolbarPosition ? {
            left: toolbarPosition.x,
            top: toolbarPosition.y,
            right: "auto",
            bottom: "auto"
          } : void 0,
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: `${styles.toolbarContainer} ${!isDarkMode ? styles.light : ""} ${isActive ? styles.expanded : styles.collapsed} ${showEntranceAnimation ? styles.entrance : ""} ${isDraggingToolbar ? styles.dragging : ""}`,
              onClick: !isActive ? (e) => {
                if (justFinishedToolbarDragRef.current) {
                  e.preventDefault();
                  return;
                }
                setIsActive(true);
              } : void 0,
              onMouseDown: handleToolbarMouseDown,
              role: !isActive ? "button" : void 0,
              tabIndex: !isActive ? 0 : -1,
              title: !isActive ? "Start feedback mode" : void 0,
              style: isDraggingToolbar ? {
                transform: `scale(1.05) rotate(${dragRotation}deg)`,
                cursor: "grabbing"
              } : void 0,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `${styles.toggleContent} ${!isActive ? styles.visible : styles.hidden}`, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(IconListSparkle, { size: 24 }),
                  hasAnnotations && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: `${styles.badge} ${isActive ? styles.fadeOut : ""} ${showEntranceAnimation ? styles.entrance : ""}`,
                      style: { backgroundColor: settings.annotationColor },
                      children: annotations.length
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `${styles.controlsContent} ${isActive ? styles.visible : styles.hidden}`, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      className: `${styles.controlButton} ${!isDarkMode ? styles.light : ""}`,
                      onClick: (e) => {
                        e.stopPropagation();
                        toggleFreeze();
                      },
                      title: isFrozen ? "Resume animations" : "Pause animations",
                      "data-active": isFrozen,
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(IconPausePlayAnimated, { size: 24, isPaused: isFrozen })
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      className: `${styles.controlButton} ${!isDarkMode ? styles.light : ""}`,
                      onClick: (e) => {
                        e.stopPropagation();
                        setShowMarkers(!showMarkers);
                      },
                      disabled: !hasAnnotations,
                      title: showMarkers ? "Hide markers" : "Show markers",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(IconEyeAnimated, { size: 24, isOpen: showMarkers })
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      className: `${styles.controlButton} ${!isDarkMode ? styles.light : ""}`,
                      onClick: (e) => {
                        e.stopPropagation();
                        copyOutput();
                      },
                      disabled: !hasAnnotations,
                      title: "Copy feedback",
                      "data-active": copied,
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(IconCopyAnimated, { size: 24, copied })
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      className: `${styles.controlButton} ${!isDarkMode ? styles.light : ""}`,
                      onClick: (e) => {
                        e.stopPropagation();
                        clearAll();
                      },
                      disabled: !hasAnnotations,
                      title: "Clear all",
                      "data-danger": true,
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(IconTrashAlt, { size: 24 })
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      className: `${styles.controlButton} ${!isDarkMode ? styles.light : ""}`,
                      onClick: (e) => {
                        e.stopPropagation();
                        setShowSettings(!showSettings);
                      },
                      title: "Settings",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(IconGear, { size: 24 })
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `${styles.divider} ${!isDarkMode ? styles.light : ""}` }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      className: `${styles.controlButton} ${!isDarkMode ? styles.light : ""}`,
                      onClick: (e) => {
                        e.stopPropagation();
                        setIsActive(false);
                      },
                      title: "Exit feedback mode",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(IconXmarkLarge, { size: 24 })
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: `${styles.settingsPanel} ${isDarkMode ? styles.dark : styles.light} ${showSettingsVisible ? styles.enter : styles.exit}`,
                    onClick: (e) => e.stopPropagation(),
                    style: toolbarPosition && toolbarPosition.y < 230 ? { bottom: "auto", top: "calc(100% + 0.5rem)" } : void 0,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.settingsHeader, children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: styles.settingsBrand, children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "span",
                            {
                              className: styles.settingsBrandSlash,
                              style: { color: settings.annotationColor, transition: "color 0.2s ease" },
                              children: "/"
                            }
                          ),
                          "agentation"
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: styles.settingsVersion, children: [
                          "v",
                          VERSION
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "button",
                          {
                            className: styles.themeToggle,
                            onClick: () => setIsDarkMode(!isDarkMode),
                            title: isDarkMode ? "Switch to light mode" : "Switch to dark mode",
                            children: isDarkMode ? /* @__PURE__ */ jsxRuntimeExports.jsx(IconSun, { size: 14 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(IconMoon, { size: 14 })
                          }
                        )
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.settingsSection, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.settingsRow, children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `${styles.settingsLabel} ${!isDarkMode ? styles.light : ""}`, children: [
                          "Output Detail",
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "span",
                            {
                              className: styles.helpIcon,
                              "data-tooltip": "Controls how much detail is included in the copied output",
                              children: /* @__PURE__ */ jsxRuntimeExports.jsx(IconHelp, { size: 20 })
                            }
                          )
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs(
                          "button",
                          {
                            className: `${styles.cycleButton} ${!isDarkMode ? styles.light : ""}`,
                            onClick: () => {
                              const currentIndex = OUTPUT_DETAIL_OPTIONS.findIndex(
                                (opt) => opt.value === settings.outputDetail
                              );
                              const nextIndex = (currentIndex + 1) % OUTPUT_DETAIL_OPTIONS.length;
                              setSettings((s) => ({
                                ...s,
                                outputDetail: OUTPUT_DETAIL_OPTIONS[nextIndex].value
                              }));
                            },
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.cycleButtonText, children: OUTPUT_DETAIL_OPTIONS.find((opt) => opt.value === settings.outputDetail)?.label }, settings.outputDetail),
                              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.cycleDots, children: OUTPUT_DETAIL_OPTIONS.map((option) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                                "span",
                                {
                                  className: `${styles.cycleDot} ${!isDarkMode ? styles.light : ""} ${settings.outputDetail === option.value ? styles.active : ""}`
                                },
                                option.value
                              )) })
                            ]
                          }
                        )
                      ] }) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.settingsSection, children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `${styles.settingsLabel} ${styles.settingsLabelMarker} ${!isDarkMode ? styles.light : ""}`, children: "Marker Colour" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.colorOptions, children: COLOR_OPTIONS.map((color) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "div",
                          {
                            onClick: () => setSettings((s) => ({ ...s, annotationColor: color.value })),
                            style: {
                              borderColor: settings.annotationColor === color.value ? color.value : "transparent"
                            },
                            className: `${styles.colorOptionRing} ${settings.annotationColor === color.value ? styles.selected : ""}`,
                            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "div",
                              {
                                className: `${styles.colorOption} ${settings.annotationColor === color.value ? styles.selected : ""}`,
                                style: { backgroundColor: color.value },
                                title: color.label
                              }
                            )
                          },
                          color.value
                        )) })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.settingsSection, children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: styles.settingsToggle, children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "input",
                            {
                              type: "checkbox",
                              id: "autoClearAfterCopy",
                              checked: settings.autoClearAfterCopy,
                              onChange: (e) => setSettings((s) => ({ ...s, autoClearAfterCopy: e.target.checked }))
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "label",
                            {
                              className: `${styles.customCheckbox} ${settings.autoClearAfterCopy ? styles.checked : ""}`,
                              htmlFor: "autoClearAfterCopy",
                              children: settings.autoClearAfterCopy && /* @__PURE__ */ jsxRuntimeExports.jsx(IconCheckSmallAnimated, { size: 14 })
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `${styles.toggleLabel} ${!isDarkMode ? styles.light : ""}`, children: [
                            "Clear after output",
                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.helpIcon, "data-tooltip": "Automatically clear annotations after copying", children: /* @__PURE__ */ jsxRuntimeExports.jsx(IconHelp, { size: 20 }) })
                          ] })
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: styles.settingsToggle, children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "input",
                            {
                              type: "checkbox",
                              id: "blockInteractions",
                              checked: settings.blockInteractions,
                              onChange: (e) => setSettings((s) => ({ ...s, blockInteractions: e.target.checked }))
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "label",
                            {
                              className: `${styles.customCheckbox} ${settings.blockInteractions ? styles.checked : ""}`,
                              htmlFor: "blockInteractions",
                              children: settings.blockInteractions && /* @__PURE__ */ jsxRuntimeExports.jsx(IconCheckSmallAnimated, { size: 14 })
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `${styles.toggleLabel} ${!isDarkMode ? styles.light : ""}`, children: "Block page interactions" })
                        ] })
                      ] })
                    ]
                  }
                )
              ]
            }
          )
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.markersLayer, "data-feedback-toolbar": true, children: markersVisible && visibleAnnotations.filter((a) => !a.isFixed).map((annotation, index) => {
        const isHovered = !markersExiting && hoveredMarkerId === annotation.id;
        const isDeleting = deletingMarkerId === annotation.id;
        const showDeleteState = isHovered || isDeleting;
        const isMulti = annotation.isMultiSelect;
        const markerColor = isMulti ? "#34C759" : settings.annotationColor;
        const globalIndex = annotations.findIndex((a) => a.id === annotation.id);
        const needsEnterAnimation = !animatedMarkers.has(annotation.id);
        const animClass = markersExiting ? styles.exit : isClearing ? styles.clearing : needsEnterAnimation ? styles.enter : "";
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: `${styles.marker} ${showDeleteState ? styles.hovered : ""} ${isMulti ? styles.multiSelect : ""} ${animClass}`,
            "data-annotation-marker": true,
            style: {
              left: `${annotation.x}%`,
              top: annotation.y,
              backgroundColor: showDeleteState ? void 0 : markerColor,
              animationDelay: markersExiting ? `${(visibleAnnotations.length - 1 - index) * 20}ms` : `${index * 20}ms`
            },
            onMouseEnter: () => !markersExiting && annotation.id !== recentlyAddedIdRef.current && setHoveredMarkerId(annotation.id),
            onMouseLeave: () => setHoveredMarkerId(null),
            onClick: (e) => {
              e.stopPropagation();
              if (!markersExiting) deleteAnnotation(annotation.id);
            },
            onContextMenu: (e) => {
              e.preventDefault();
              e.stopPropagation();
              if (!markersExiting) startEditAnnotation(annotation);
            },
            children: [
              showDeleteState ? /* @__PURE__ */ jsxRuntimeExports.jsx(IconXmark, { size: isMulti ? 18 : 16 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: renumberFrom !== null && globalIndex >= renumberFrom ? styles.renumber : void 0,
                  children: globalIndex + 1
                }
              ),
              isHovered && !editingAnnotation && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `${styles.markerTooltip} ${!isDarkMode ? styles.light : ""} ${styles.enter}`, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: styles.markerQuote, children: [
                  annotation.element,
                  annotation.selectedText && ` "${annotation.selectedText.slice(0, 30)}${annotation.selectedText.length > 30 ? "..." : ""}"`
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.markerNote, children: annotation.comment })
              ] })
            ]
          },
          annotation.id
        );
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.fixedMarkersLayer, "data-feedback-toolbar": true, children: markersVisible && visibleAnnotations.filter((a) => a.isFixed).map((annotation, index) => {
        const fixedAnnotations = visibleAnnotations.filter((a) => a.isFixed);
        const isHovered = !markersExiting && hoveredMarkerId === annotation.id;
        const isDeleting = deletingMarkerId === annotation.id;
        const showDeleteState = isHovered || isDeleting;
        const isMulti = annotation.isMultiSelect;
        const markerColor = isMulti ? "#34C759" : settings.annotationColor;
        const globalIndex = annotations.findIndex((a) => a.id === annotation.id);
        const needsEnterAnimation = !animatedMarkers.has(annotation.id);
        const animClass = markersExiting ? styles.exit : isClearing ? styles.clearing : needsEnterAnimation ? styles.enter : "";
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: `${styles.marker} ${styles.fixed} ${showDeleteState ? styles.hovered : ""} ${isMulti ? styles.multiSelect : ""} ${animClass}`,
            "data-annotation-marker": true,
            style: {
              left: `${annotation.x}%`,
              top: annotation.y,
              backgroundColor: showDeleteState ? void 0 : markerColor,
              animationDelay: markersExiting ? `${(fixedAnnotations.length - 1 - index) * 20}ms` : `${index * 20}ms`
            },
            onMouseEnter: () => !markersExiting && annotation.id !== recentlyAddedIdRef.current && setHoveredMarkerId(annotation.id),
            onMouseLeave: () => setHoveredMarkerId(null),
            onClick: (e) => {
              e.stopPropagation();
              if (!markersExiting) deleteAnnotation(annotation.id);
            },
            onContextMenu: (e) => {
              e.preventDefault();
              e.stopPropagation();
              if (!markersExiting) startEditAnnotation(annotation);
            },
            children: [
              showDeleteState ? /* @__PURE__ */ jsxRuntimeExports.jsx(IconClose, { size: isMulti ? 12 : 10 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: renumberFrom !== null && globalIndex >= renumberFrom ? styles.renumber : void 0,
                  children: globalIndex + 1
                }
              ),
              isHovered && !editingAnnotation && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `${styles.markerTooltip} ${!isDarkMode ? styles.light : ""} ${styles.enter}`, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: styles.markerQuote, children: [
                  annotation.element,
                  annotation.selectedText && ` "${annotation.selectedText.slice(0, 30)}${annotation.selectedText.length > 30 ? "..." : ""}"`
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.markerNote, children: annotation.comment })
              ] })
            ]
          },
          annotation.id
        );
      }) }),
      isActive && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: styles.overlay,
          "data-feedback-toolbar": true,
          style: pendingAnnotation || editingAnnotation ? { zIndex: 99999 } : void 0,
          children: [
            hoverInfo?.rect && !pendingAnnotation && !isScrolling && !isDragging && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: `${styles.hoverHighlight} ${styles.enter}`,
                style: {
                  left: hoverInfo.rect.left,
                  top: hoverInfo.rect.top,
                  width: hoverInfo.rect.width,
                  height: hoverInfo.rect.height,
                  borderColor: `${settings.annotationColor}80`,
                  backgroundColor: `${settings.annotationColor}0A`
                }
              }
            ),
            hoverInfo && !pendingAnnotation && !isScrolling && !isDragging && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: `${styles.hoverTooltip} ${styles.enter}`,
                style: {
                  left: Math.max(8, Math.min(hoverPosition.x, window.innerWidth - 100)),
                  top: Math.max(hoverPosition.y - 32, 8)
                },
                children: hoverInfo.element
              }
            ),
            pendingAnnotation && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              pendingAnnotation.boundingBox && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: `${pendingAnnotation.isMultiSelect ? styles.multiSelectOutline : styles.singleSelectOutline} ${pendingExiting ? styles.exit : styles.enter}`,
                  style: {
                    left: pendingAnnotation.boundingBox.x,
                    top: pendingAnnotation.boundingBox.y - scrollY,
                    width: pendingAnnotation.boundingBox.width,
                    height: pendingAnnotation.boundingBox.height,
                    ...pendingAnnotation.isMultiSelect ? {} : {
                      borderColor: `${settings.annotationColor}99`,
                      backgroundColor: `${settings.annotationColor}0D`
                    }
                  }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: `${styles.marker} ${styles.pending} ${pendingAnnotation.isMultiSelect ? styles.multiSelect : ""} ${pendingExiting ? styles.exit : styles.enter}`,
                  style: {
                    left: `${pendingAnnotation.x}%`,
                    top: pendingAnnotation.clientY,
                    backgroundColor: pendingAnnotation.isMultiSelect ? "#34C759" : settings.annotationColor
                  },
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(IconPlus, { size: 12 })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                AnnotationPopupCSS,
                {
                  ref: popupRef,
                  element: pendingAnnotation.element,
                  selectedText: pendingAnnotation.selectedText,
                  placeholder: pendingAnnotation.element === "Area selection" ? "What should change in this area?" : pendingAnnotation.isMultiSelect ? "Feedback for this group of elements..." : "What should change?",
                  onSubmit: addAnnotation,
                  onCancel: cancelAnnotation,
                  isExiting: pendingExiting,
                  lightMode: !isDarkMode,
                  accentColor: pendingAnnotation.isMultiSelect ? "#34C759" : settings.annotationColor,
                  style: {
                    left: Math.max(160, Math.min(window.innerWidth - 160, pendingAnnotation.x / 100 * window.innerWidth)),
                    top: Math.max(20, Math.min(pendingAnnotation.clientY + 20, window.innerHeight - 180))
                  }
                }
              )
            ] }),
            editingAnnotation && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              editingAnnotation.boundingBox && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: `${editingAnnotation.isMultiSelect ? styles.multiSelectOutline : styles.singleSelectOutline} ${styles.enter}`,
                  style: {
                    left: editingAnnotation.boundingBox.x,
                    top: editingAnnotation.boundingBox.y - scrollY,
                    width: editingAnnotation.boundingBox.width,
                    height: editingAnnotation.boundingBox.height,
                    ...editingAnnotation.isMultiSelect ? {} : {
                      borderColor: `${settings.annotationColor}99`,
                      backgroundColor: `${settings.annotationColor}0D`
                    }
                  }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                AnnotationPopupCSS,
                {
                  ref: editPopupRef,
                  element: editingAnnotation.element,
                  selectedText: editingAnnotation.selectedText,
                  placeholder: "Edit your feedback...",
                  initialValue: editingAnnotation.comment,
                  submitLabel: "Save",
                  onSubmit: updateAnnotation,
                  onCancel: cancelEditAnnotation,
                  isExiting: editExiting,
                  lightMode: !isDarkMode,
                  accentColor: editingAnnotation.isMultiSelect ? "#34C759" : settings.annotationColor,
                  style: {
                    left: Math.max(160, Math.min(window.innerWidth - 160, editingAnnotation.x / 100 * window.innerWidth)),
                    top: Math.max(
                      20,
                      Math.min(
                        (editingAnnotation.isFixed ? editingAnnotation.y : editingAnnotation.y - scrollY) + 20,
                        window.innerHeight - 180
                      )
                    )
                  }
                }
              )
            ] }),
            isDragging && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: dragRectRef, className: styles.dragSelection }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: highlightsContainerRef, className: styles.highlightsContainer })
            ] })
          ]
        }
      )
    ] }),
    document.body
  );
}

function createContainer() {
  const containerId = "agentation-extension-root";
  let container = document.getElementById(containerId);
  if (container) {
    return container;
  }
  container = document.createElement("div");
  container.id = containerId;
  container.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 0;
    height: 0;
    z-index: 2147483647;
    pointer-events: none;
  `;
  document.body.appendChild(container);
  return container;
}
function init() {
  if (window.location.protocol === "chrome-extension:" || document.getElementById("agentation-extension-root")) {
    return;
  }
  const container = createContainer();
  const root = createRoot(container);
  root.render(
    /* @__PURE__ */ jsxRuntimeExports.jsx(React.StrictMode, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(PageFeedbackToolbar, {}) })
  );
}
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === "TOGGLE_TOOLBAR") {
    window.dispatchEvent(new CustomEvent("agentation-toggle"));
    sendResponse({ success: true });
  }
  return true;
});
