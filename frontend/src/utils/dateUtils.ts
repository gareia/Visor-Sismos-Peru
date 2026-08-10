export function formatPeruDate(date:string): string{
    return new Date(date).toLocaleString("es-PE", {
        timeZone: "America/Lima",
        dateStyle: "short",
        timeStyle: "short",
    });
}