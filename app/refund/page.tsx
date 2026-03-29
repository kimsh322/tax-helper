import { Suspense } from "react";
import PageShell from "@/components/layout/PageShell";
import Header from "@/components/layout/Header";
import RefundCalculator from "./RefundCalculator";

export default function RefundPage() {
  return (
    <PageShell>
      <Header
        number="02"
        title="환급액 예상"
        description="소득공제와 세액공제 내역을 입력하면 예상 환급액을 계산합니다."
      />
      <Suspense>
        <RefundCalculator />
      </Suspense>
    </PageShell>
  );
}
