import { useId } from "react";
import { Checkbox } from "../../../checkbox";
import { HelpTooltip } from "../../../help-tooltip";
import styles from "./styles.module.scss";

interface CheckboxFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  tooltip?: string;
  checked?: boolean;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

export const CheckboxField = ({
  className = "",
  label,
  tooltip,
  checked,
  onChange,
  ...props
}: CheckboxFieldProps) => {
  const id = useId();

  return (
    <div className={`${styles.container} ${className}`} {...props}>
      <Checkbox id={id} onChange={onChange} checked={checked} />
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>
      {tooltip && <HelpTooltip content={tooltip} />}
    </div>
  );
};
