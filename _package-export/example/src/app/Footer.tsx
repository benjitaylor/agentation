export function Footer() {
  return (
    <footer className="footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <p>
        Made by{" "}
        <a
          href="https://benji.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Benji Taylor
        </a>{" "}
        and{" "}
        <a
          href="https://dennisjin.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Dennis Jin
        </a>
      </p>
      <span>
        Icons by{" "}
        <a
          href="https://dip.benji.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Dip
        </a>
      </span>
    </footer>
  );
}
