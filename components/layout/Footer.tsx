export default function Footer() {
  return (
    <footer className="border-t border-ink/10 px-6 py-6 md:px-10">
      <div className="max-w-5xl">
        <p className="text-xs text-muted leading-relaxed">
          본 계산기는 참고용이며, 실제 연말정산 결과와 다를 수 있습니다.
          <br />
          정확한 세액은 국세청 홈택스를 통해 확인하시기 바랍니다.
        </p>
        <p className="mt-2 text-xs text-muted/60">&copy; 2026 연말정산 미리계산</p>
      </div>
    </footer>
  );
}
