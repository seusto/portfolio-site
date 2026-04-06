"use client";
import Calendar from "@/components/daily-check/Calendar";


export default function DailyCheckPage(){
    return(
        <div>
            Sergios today
            <Calendar
            onChange={(d) => console.log("Selezionato:", d.toISOString().slice(0,10))}
            className="rounded-3xl bg-neutral-50 p-3 dark:bg-neutral-900"
            />
        </div>
        
    );
}