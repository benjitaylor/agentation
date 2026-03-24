"use client";

export default function NotFound() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '70vh',
      paddingBottom: '6rem',
      gap: '1rem',
    }}>
      <img
        src="/icon.png"
        alt=""
        width={48}
        height={48}
        style={{
          filter: 'grayscale(1)',
          opacity: 0.15,
        }}
      />
      <p style={{ color: 'rgba(0,0,0,0.3)', fontSize: '0.875rem', fontWeight: 400 }}>Page not found.</p>
    </div>
  );
}
