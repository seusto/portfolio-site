"use client";
import { useState } from "react";

const GROUP_SLUG = "natale-2025-amici"; // <-- USA lo stesso slug messo in Supabase

export default function SecretSantaPage() {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [recipient, setRecipient] = useState<{ name: string|null, code: string|null } | null>(null);

  const disabled = !name || !code;

  const handleSubmit = async () => {
    setLoading(true);
    const r = await fetch("/api/santa/admin/seed", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ groupSlug: GROUP_SLUG, code, name })
    });
    const data = await r.json();
    setLoading(false);
    if (!r.ok) return alert(data.error || "Errore");
    setRecipient({ name: data.recipientName, code: data.recipientCode });
  };

  return (
    <main className="mx-auto max-w-md px-4 py-10">
      <h1 className="text-2xl font-bold">Secret Santa 🎁</h1>
      <p className="mt-2 text-gray-600">Inserisci il tuo <b>Nome</b> e il <b>Codice</b> che ti è stato dato.</p>

      <div className="mt-6 space-y-3">
        <input
          className="w-full border rounded px-3 py-2"
          placeholder="Il tuo nome"
          value={name}
          onChange={e=>setName(e.target.value)}
        />
        <input
          className="w-full border rounded px-3 py-2 uppercase"
          placeholder="Codice (es. ABCD2345)"
          value={code}
          onChange={e=>setCode(e.target.value.toUpperCase())}
        />
        <button
          className="w-full px-4 py-2 rounded bg-black text-white disabled:opacity-50"
          disabled={disabled || loading}
          onClick={handleSubmit}
        >
          {loading ? "Carico..." : "Mostra destinatario"}
        </button>
      </div>

      {recipient && (
        <section className="mt-8">
          <h2 className="text-xl font-semibold">Il tuo destinatario</h2>
          {recipient.name ? (
            <p className="mt-2">Regalo per: <b>{recipient.name}</b></p>
          ) : (
            <p className="mt-2 text-gray-600">
              Il destinatario non ha ancora inserito il proprio nome.
              (Codice destinatario: {recipient.code})
            </p>
          )}
        </section>
      )}
    </main>
  );
}
