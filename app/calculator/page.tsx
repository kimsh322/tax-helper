import PageShell from "@/components/layout/PageShell";
import Header from "@/components/layout/Header";
import SalaryCalculator from "./SalaryCalculator";

export default function CalculatorPage() {
  return (
    <PageShell>
      <Header
        number="01"
        title="실수령액 계산기"
        description="연봉을 입력하면 세금과 4대보험료를 제외한 월 실수령액을 계산합니다."
      />
      <SalaryCalculator />
    </PageShell>
  );
}
