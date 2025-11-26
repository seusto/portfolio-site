export type Project ={
    slug: string;
    title: string;
    summary: string;
    category: "integration" | "backend" | "frontend" | "devops";
    tech: string[];            // es. ["WSO2","Java","SOAP"]
    links?: { live?: string; repo?: string };
} 


export const projects: Project[] = [
  {
    slug: "sftp-wso2-e2e",
    title: "Pipeline SFTP E2E con WSO2",
    summary: "Polling, deduplica e trasferimenti idempotenti.",
    category: "integration",
    tech: ["WSO2","SFTP","Java"]
  },
  {
    slug: "apim-soap-rest",
    title: "Gateway SOAP→REST con APIM 4.3",
    summary: "Gestione SOAPAction e policy di sicurezza.",
    category: "integration",
    tech: ["WSO2 APIM","SOAP","REST"]
  },
  {
    slug: "angular-spese",
    title: "App spese personali",
    summary: "Angular + Node/Express + Postgres (Docker).",
    category: "frontend",
    tech: ["Angular","Node","Postgres","Docker"]
  }
];

export const categories = [
  { key: "all", label: "Tutte" },
  { key: "integration", label: "Integration" },
  { key: "backend", label: "Backend" },
  { key: "frontend", label: "Frontend" },
  { key: "devops", label: "DevOps" },
] as const;

export const allTech = Array.from(
  new Set(projects.flatMap(p => p.tech))
).sort();
