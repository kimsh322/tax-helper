export default function RateTable({
  headers,
  rows,
  footnote,
}: {
  headers: string[];
  rows: string[][];
  footnote?: string;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b-2 border-ink/10">
            {headers.map((h, i) => (
              <th
                key={i}
                className={`px-3 py-2.5 font-bold text-ink ${i === 0 ? "text-left" : "text-right"}`}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-ink/5">
          {rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td
                  key={j}
                  className={`px-3 py-2 ${j === 0 ? "text-left text-ink/80" : "text-right font-mono text-ink"}`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {footnote && (
        <p className="mt-2 text-xs text-muted">{footnote}</p>
      )}
    </div>
  );
}
