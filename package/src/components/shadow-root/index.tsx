import {
  useRef,
  useState,
  useLayoutEffect,
  type ReactNode,
  type ElementType,
  type ComponentPropsWithRef,
} from "react";
import { createPortal } from "react-dom";

export interface ShadowRootProps extends ComponentPropsWithRef<"div"> {
  mode?: ShadowRootMode;
  delegatesFocus?: boolean;
  slotAssignment?: SlotAssignmentMode;
  children?: ReactNode;
  host?: keyof HTMLElementTagNameMap | (string & {});
}

export const ShadowRoot = ({
  mode = "open",
  delegatesFocus,
  slotAssignment,
  host = "div",
  children,
  ...hostProps
}: ShadowRootProps) => {
  const hostRef = useRef<HTMLElement>(null);
  const [shadowContainer, setShadowContainer] = useState<HTMLDivElement | null>(
    null,
  );

  useLayoutEffect(() => {
    const hostElement = hostRef.current;
    if (!hostElement || hostElement.shadowRoot) return;
    const shadow = hostElement.attachShadow({
      mode,
      delegatesFocus,
      slotAssignment,
    });
    setShadowContainer(shadow as unknown as HTMLDivElement);
  }, []);

  const Host = host as ElementType;

  return (
    <Host ref={hostRef} {...hostProps}>
      {shadowContainer && createPortal(children, shadowContainer)}
    </Host>
  );
};
