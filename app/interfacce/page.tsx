const pdfUrl = 'pdf/inter.pdf'; 

export default function pdfInterfacce() {
    return (
        <main>
            <div>
                    <h1 style={{ marginBottom: '0.75rem' }}>PDF di Interfacce</h1>
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
    )
}