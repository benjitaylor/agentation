export function Footer() {
  return (
    <footer className="footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <p>
        Made by{" "}
        <a
          href="https://x.com/benjitaylor"
          target="_blank"
          rel="noopener noreferrer"
        >
          Benji Taylor
        </a>
        ,{" "}
        <a
          href="https://x.com/seldom"
          target="_blank"
          rel="noopener noreferrer"
        >
          Dennis Jin
        </a>
        , and{" "}
        <a
          href="https://x.com/alexvanderzon"
          target="_blank"
          rel="noopener noreferrer"
        >
          Alex Vanderzon
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
