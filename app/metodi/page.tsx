// app/pdf-uno/page.tsx

const pdfUrl = '/pdf/metodo.pdf';

export default function PdfUnoPage() {
  return (
    <main
      style={{
        minHeight: '100vh',
        padding: '2rem 1rem',
        display: 'flex',
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
        fontFamily:
          'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '900px',
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          padding: '1.5rem',
          boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
        }}
      >
        <h1 style={{ marginBottom: '0.75rem' }}>PDF di prova 1</h1>
        <p style={{ marginBottom: '1rem', color: '#555' }}>
          Questo è il PDF <code>prova-1.pdf</code> dalla cartella <code>public/pdfs</code>.
        </p>

        <p style={{ marginBottom: '0.75rem' }}>
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#d7263d', fontWeight: 600 }}
          >
            Apri il PDF in una nuova scheda
          </a>
        </p>

        <div
          style={{
            border: '1px solid #ccc',
            borderRadius: '8px',
            overflow: 'hidden',
          }}
        >
          <iframe
            src={pdfUrl}
            style={{
              width: '100%',
              height: '500px',
              border: 'none',
            }}
          />
        </div>
      </div>
    </main>
  );
}
