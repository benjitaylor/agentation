import styles from "./styles.module.scss";

interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Switch = ({
  className = "",
  checked,
  onChange,
  ...props
}: SwitchProps) => {
  return (
    <div
      className={`${styles.switchContainer} ${className}`}
      data-checked={checked ? "" : undefined}
    >
      <input
        className={styles.switchInput}
        checked={checked}
        onChange={onChange}
        type="checkbox"
        {...props}
      />
      <div className={styles.switchThumb} />
    </div>
  );
};
