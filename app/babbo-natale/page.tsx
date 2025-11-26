// app/babbo-natale/page.tsx
import { supabaseAdmin } from '../../lib/supabaseAdmin';
import { redirect } from 'next/navigation';
import styles from './babbo-natale.module.css';

// ----- TIPI DI SUPPORTO -----
type ParticipantRow = {
  id: number;
  event_id: number;
  name: string;
  access_code: string;
};

type SimpleParticipant = {
  id: number;
};

type AssignmentRow = {
  id: number;
  receiver_id: number;
  notes: string | null;
};

type EventRow = {
  name: string;
};

type ViewModel = {
  code: string;
  error?: string;
  eventName?: string;
  participantName?: string;
  participantId?: number;
  receiverName?: string;
  notes?: string;
};

// ----- FUNZIONI DI SUPPORTO -----
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

async function ensureAssignmentsForEvent(eventId: number): Promise<void> {
  const { data: participantsData, error: pErr } = await supabaseAdmin
    .from('participants')
    .select('id')
    .eq('event_id', eventId);

  if (pErr) {
    console.error('Errore nel leggere i partecipanti:', pErr.message);
    throw pErr;
  }

  const participants = (participantsData ?? []) as SimpleParticipant[];

  if (participants.length < 2) {
    console.log('Servono almeno 2 partecipanti per creare gli abbinamenti.');
    return;
  }

  const { data: assignmentsData, error: aErr } = await supabaseAdmin
    .from('assignments')
    .select('id')
    .eq('event_id', eventId);

  if (aErr) {
    console.error('Errore nel leggere gli assignments:', aErr.message);
    throw aErr;
  }

  const existingAssignments = assignmentsData ?? [];
  if (existingAssignments.length === participants.length) {
    return;
  }

  await supabaseAdmin.from('assignments').delete().eq('event_id', eventId);

  const shuffled = shuffleArray(participants);

  const rows = shuffled.map((giver, index) => {
    const receiver = shuffled[(index + 1) % shuffled.length];
    return {
      event_id: eventId,
      giver_id: giver.id,
      receiver_id: receiver.id,
      notes: '',
    };
  });

  const { error: insertErr } = await supabaseAdmin
    .from('assignments')
    .insert(rows);

  if (insertErr) {
    console.error('Errore nel creare gli assignments:', insertErr.message);
    throw insertErr;
  }
}

function getChristmasCountdownText(): string {
  const now = new Date();
  const year = now.getFullYear();
  let target = new Date(year, 11, 25); // 25 dicembre

  if (now > target) {
    target = new Date(year + 1, 11, 25);
  }

  const diffMs = target.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'È il giorno di Natale! 🎉';
  if (diffDays === 1) return 'Manca 1 giorno a Natale ✨';
  return `Mancano ${diffDays} giorni a Natale ✨`;
}

// ----- SERVER ACTION: SALVATAGGIO NOTE -----
export async function saveNotes(formData: FormData) {
  'use server';

  const participantIdStr = formData.get('participantId');
  const accessCode = String(formData.get('accessCode') ?? '').trim();
  const notes = String(formData.get('notes') ?? '');

  if (!participantIdStr) {
    throw new Error('Manca participantId nel form');
  }

  const participantId = Number(participantIdStr);

  const { data: assignmentsData, error: aErr } = await supabaseAdmin
    .from('assignments')
    .select('id')
    .eq('giver_id', participantId);

  if (aErr) {
    console.error('Errore nel leggere l’assignment:', aErr.message);
    throw new Error('Errore nel leggere il tuo abbinamento.');
  }

  const assignment = (assignmentsData ?? [])[0] as
    | { id: number }
    | undefined;

  if (!assignment) {
    throw new Error('Non ho trovato il tuo abbinamento.');
  }

  const { error: updErr } = await supabaseAdmin
    .from('assignments')
    .update({ notes })
    .eq('id', assignment.id);

  if (updErr) {
    console.error('Errore nell’aggiornare le note:', updErr.message);
    throw new Error('Errore nel salvare le note.');
  }

  const redirectCode = accessCode || '';
  redirect(`/babbo-natale?code=${encodeURIComponent(redirectCode)}`);
}

// ----- PAGINA PRINCIPALE -----
type PageProps = {
  searchParams?: { code?: string };
};

export default async function BabboNatalePage({ searchParams }: PageProps) {
  const rawCode = searchParams?.code;
  const code = typeof rawCode === 'string' ? rawCode.trim() : '';

  let view: ViewModel = { code };

  if (code) {
    try {
      const { data: participantsData, error: pErr } = await supabaseAdmin
        .from('participants')
        .select('id, event_id, name, access_code')
        .eq('access_code', code);

      if (pErr) {
        console.error('Errore nel cercare il partecipante:', pErr.message);
        view.error = 'Errore nel leggere i dati. Riprova tra qualche minuto.';
      } else {
        const participant = (participantsData ?? [])[0] as
          | ParticipantRow
          | undefined;

        if (!participant) {
          view.error =
            'Questo codice non risulta valido. Controlla di averlo scritto bene. 😉';
        } else {
          await ensureAssignmentsForEvent(participant.event_id);

          const { data: eventsData, error: eErr } = await supabaseAdmin
            .from('events')
            .select('name')
            .eq('id', participant.event_id);

          const eventRow = (eventsData ?? [])[0] as EventRow | undefined;
          const eventName = !eErr && eventRow ? eventRow.name : 'Il tuo evento';

          const { data: assignmentsData, error: aErr } = await supabaseAdmin
            .from('assignments')
            .select('receiver_id, notes')
            .eq('giver_id', participant.id);

          if (aErr) {
            console.error('Errore nel leggere l’assignment:', aErr.message);
            view.error = 'Non riesco a leggere il tuo abbinamento.';
          } else {
            const assignment = (assignmentsData ?? [])[0] as
              | AssignmentRow
              | undefined;

            if (!assignment) {
              view.error =
                'Non ho trovato il tuo abbinamento. Avvisa l’organizzatore. 🙋‍♂️';
            } else {
              const { data: receiversData, error: rErr } = await supabaseAdmin
                .from('participants')
                .select('name')
                .eq('id', assignment.receiver_id);

              const receiverRow = (receiversData ?? [])[0] as
                | { name: string }
                | undefined;

              const receiverName =
                !rErr && receiverRow ? receiverRow.name : '???';

              view = {
                code,
                eventName,
                participantName: participant.name,
                participantId: participant.id,
                receiverName,
                notes: assignment.notes ?? '',
              };
            }
          }
        }
      }
    } catch (err) {
      console.error('Errore generico:', err);
      if (!view.error) {
        view.error = 'Qualcosa è andato storto. Riprova più tardi.';
      }
    }
  }

  const hasData = !!view.participantName && !!view.receiverName;
  const countdownText = getChristmasCountdownText();

  return (
    <main className={styles.page}>
      <div className={styles.cardWrapper}>
        <section className={styles.card}>
          <div className={styles.decorTop} />
          <div className={styles.decorBottom} />

          {/* Header */}
          <div className={styles.headerRow}>

            <div>
              <div className={styles.titleText}>Babbo Natale di famiglia</div>
              <div className={styles.subtitleText}>
                Un piccolo gioco tra di noi per scambiarci un pensiero.
              </div>
            </div>
          </div>

          {/* Stato: login */}
          {!hasData && (
            <div className={styles.sectionSpacing}>
              <p className={styles.smallMuted} style={{ marginBottom: '0.9rem', fontSize: '0.9rem' }}>
                Inserisci il <strong>codice che ti è stato assegnato</strong>.
                È solo tuo: serve per scoprire a chi preparare il regalino. 🎄
              </p>

              <form method="GET">
                <label htmlFor="code" className={styles.label}>
                  Codice di accesso
                </label>
                <input
                  id="code"
                  name="code"
                  type="text"
                  defaultValue={view.code}
                  required
                  className={styles.input}
                  placeholder="Es. MARIO123"
                />
                <button type="submit" className={styles.buttonPrimary}>
                  Entra nella magia
                </button>
              </form>

              {view.error && <p className={styles.errorText}>{view.error}</p>}

              <p className={styles.smallMuted} style={{ marginTop: '1rem' }}>
                Nessun dato viene condiviso pubblicamente: ognuno vede solo il
                proprio abbinamento e le proprie note. 🤫
              </p>

              <p className={styles.countdown}>{countdownText}</p>
            </div>
          )}

          {/* Stato: dopo login */}
          {hasData && (
            <div className={styles.sectionSpacing}>
              <div className={styles.headerInfoRow}>
                <div className={styles.badge}>
                  🎄 Evento
                  <span>{view.eventName}</span>
                </div>
                <span className={styles.smallMuted}>Codice: {view.code}</span>
              </div>

              <p
                style={{
                  fontSize: '1rem',
                  color: '#5b2112',
                  marginBottom: '0.4rem',
                }}
              >
                Ciao <strong>{view.participantName}</strong> 👋
              </p>
              <p
                className={styles.smallMuted}
                style={{ marginBottom: '0.4rem', fontSize: '0.9rem' }}
              >
                Per questo Babbo Natale segreto, il tuo compito è preparare un
                pensiero per:
              </p>

              <p style={{ marginBottom: '1.2rem' }}>
                <span className={styles.receiverName}>{view.receiverName}</span>
              </p>

              <p
                className={styles.smallMuted}
                style={{ marginBottom: '0.7rem', fontSize: '0.9rem' }}
              >
                Qui puoi segnarti idee, preferenze, budget… quello che ti aiuta
                a scegliere il regalo giusto. Le note le vedi solo tu.
              </p>

              <form action={saveNotes}>
                <textarea
                  name="notes"
                  rows={5}
                  defaultValue={view.notes}
                  placeholder="Idee regalo, cose che piacciono alla persona, budget, indizi da lasciare..."
                  className={styles.textarea}
                />
                <input
                  type="hidden"
                  name="participantId"
                  value={view.participantId ?? ''}
                />
                <input type="hidden" name="accessCode" value={view.code} />
                <button type="submit" className={styles.buttonPrimary}>
                  Salva le tue note
                </button>
              </form>

              <p className={styles.smallMuted} style={{ marginTop: '1rem' }}>
                Non sei tu?{' '}
                <a href="/babbo-natale" className={styles.link}>
                  inserisci un altro codice
                </a>
                .
              </p>

              <p className={styles.countdown}>{countdownText}</p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
