import { Card } from "@/components/ui/card";

export function DataTable({
  headers,
  children
}: Readonly<{ headers: string[]; children: React.ReactNode }>) {
  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left">
          <thead className="bg-white/80">
            <tr>
              {headers.map((header) => (
                <th
                  key={header}
                  className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>{children}</tbody>
        </table>
      </div>
    </Card>
  );
}
