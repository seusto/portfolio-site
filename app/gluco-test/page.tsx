import Averages from "@/components/Averages";
import DailyFormGlucoTest from "@/components/DailyFormGlucoTest";
import TrendChart from "@/components/TrendCharts";
import DayList from "@/components/DayList";


export const metadata = { title: "Daily Tracker" };

export default function GlucoTestPage() {
  return (
    <main className="mx-auto px-4 py-12 space-y-8">
      <header>
        <h1 className="text-3xl font-bold">Daily Tracker</h1>
        <p className="text-gray-600">Inserisci il valore del giorno e guarda la media</p>
      </header>

      <DailyFormGlucoTest />

    
      <Averages days={10} />

        <div className="w-full flex flex-col sm:flex-row gap-4">
        <section className="space-y-3 flex-1 basis-0 min-w-0 p-4 rounded">
            <h2 className="text-xl font-semibold">Andamento ultimi 60 giorni</h2>
            <TrendChart days={60} />
        </section>
        <section className="flex-1 basis-0 min-w-0 p-4 rounded">
            <DayList />
        </section>
        </div>

    </main>
  );
}
