import styles from "./styles.module.scss";

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Checkbox = ({ className = "", ...props }: CheckboxProps) => {
  return (
    <div className={`${styles.checkboxContainer} ${className}`}>
      <input className={styles.checkboxInput} type="checkbox" {...props} />
      <svg
        className={styles.checkboxCheck}
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
      >
        <path
          className={styles.checkboxCheckPath}
          d="M3.94 7L6.13 9.19L10.5 4.81"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};
