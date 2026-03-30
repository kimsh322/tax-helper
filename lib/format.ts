export function formatNumber(n: number): string {
  return n.toLocaleString("ko-KR");
}

export function parseInputNumber(value: string): number {
  return Number(value.replace(/[^0-9]/g, "")) || 0;
}
