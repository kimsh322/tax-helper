"use client";

import { useReducer, useState, type ReactNode } from "react";
import { calculateRefund, type RefundInput, type RefundResult } from "@/lib/refund";
import CustomSelect from "@/components/ui/CustomSelect";

function formatNumber(n: number): string {
  return n.toLocaleString("ko-KR");
}

function parseInputNumber(value: string): number {
  return Number(value.replace(/[^0-9]/g, "")) || 0;
}

// ─── State ───────────────────────────────────────────────

interface FormState {
  totalSalary: string;
  dependents: number;
  disabled: number;
  singleParent: number;
  womanDeduction: number;
  seniorCount: number;
  prepaidTax: string;

  nationalPension: string;
  healthInsurance: string;
  employmentInsurance: string;
  housingRentLoan: string;
  housingMortgage: string;
  creditCardDeduction: string;
  otherIncomeDeduction: string;

  medicalSelf: string;
  medicalOther: string;
  educationSelf: string;
  educationChild: string;
  educationUniv: string;
  insurancePremium: string;
  disabledInsurance: string;
  donationCredit: string;
  smeReduction: boolean;
  smeReductionRate: number;
  monthlyRent: string;
  pensionAccount: string;
  irpSavings: string;
  childCount: number;
  marriageCredit: number;
  otherTaxCredit: string;
}

const initialState: FormState = {
  totalSalary: "",
  dependents: 1,
  disabled: 0,
  singleParent: 0,
  womanDeduction: 0,
  seniorCount: 0,
  prepaidTax: "",
  nationalPension: "",
  healthInsurance: "",
  employmentInsurance: "",
  housingRentLoan: "",
  housingMortgage: "",
  creditCardDeduction: "",
  otherIncomeDeduction: "",
  medicalSelf: "",
  medicalOther: "",
  educationSelf: "",
  educationChild: "",
  educationUniv: "",
  insurancePremium: "",
  disabledInsurance: "",
  donationCredit: "",
  smeReduction: false,
  smeReductionRate: 0.7,
  monthlyRent: "",
  pensionAccount: "",
  irpSavings: "",
  childCount: 0,
  marriageCredit: 0,
  otherTaxCredit: "",
};

type Action = { type: "update"; payload: Partial<FormState> };

function reducer(state: FormState, action: Action): FormState {
  return { ...state, ...action.payload };
}

// ─── Accordion Section ───────────────────────────────────

function Section({
  number,
  title,
  summary,
  open,
  onToggle,
  children,
}: {
  number: string;
  title: string;
  summary?: string;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  return (
    <div className="rounded-lg border border-ink/10 bg-surface/40 overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-surface/60 transition-colors"
      >
        <div className="flex items-baseline gap-2">
          <span className="font-mono text-xs text-muted">{number}</span>
          <span className="text-sm font-bold text-ink">{title}</span>
          {!open && summary && (
            <span className="text-xs text-muted ml-2">{summary}</span>
          )}
        </div>
        <span
          className={`text-muted transition-transform ${open ? "rotate-180" : ""}`}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M4 6l4 4 4-4"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>
      {open && <div className="px-6 pb-6 pt-2">{children}</div>}
    </div>
  );
}

// ─── Input helpers ───────────────────────────────────────

function MoneyInput({
  label,
  value,
  onChange,
  hint,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  hint?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-bold text-ink mb-1.5">{label}</label>
      <input
        type="text"
        inputMode="numeric"
        value={value}
        onChange={(e) => {
          const raw = parseInputNumber(e.target.value);
          onChange(raw > 0 ? formatNumber(raw) : "");
        }}
        placeholder={placeholder ?? "0"}
        className="w-full rounded-md border border-ink/15 bg-paper px-4 py-3 font-mono text-sm text-ink placeholder:text-muted/50 focus:border-ink/40 focus:outline-none focus:ring-2 focus:ring-ink/10"
      />
      {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
    </div>
  );
}

// ─── Component ───────────────────────────────────────────

export default function RefundCalculator() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [openSections, setOpenSections] = useState<Set<number>>(
    () => new Set([1, 2, 3]),
  );
  const [result, setResult] = useState<RefundResult | null>(null);

  function update(payload: Partial<FormState>) {
    dispatch({ type: "update", payload });
  }

  function toggleSection(n: number) {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(n)) next.delete(n);
      else next.add(n);
      return next;
    });
  }

  function handleCalculate() {
    const salary = parseInputNumber(state.totalSalary);
    if (salary <= 0) return;

    const input: RefundInput = {
      totalSalary: salary,
      dependents: state.dependents,
      disabled: state.disabled,
      singleParent: state.singleParent,
      womanDeduction: state.womanDeduction,
      seniorCount: state.seniorCount,
      prepaidTax: parseInputNumber(state.prepaidTax),
      nationalPension: parseInputNumber(state.nationalPension),
      healthInsurance: parseInputNumber(state.healthInsurance),
      employmentInsurance: parseInputNumber(state.employmentInsurance),
      housingRentLoan: parseInputNumber(state.housingRentLoan),
      housingMortgage: parseInputNumber(state.housingMortgage),
      creditCardDeduction: parseInputNumber(state.creditCardDeduction),
      otherIncomeDeduction: parseInputNumber(state.otherIncomeDeduction),
      medicalSelf: parseInputNumber(state.medicalSelf),
      medicalOther: parseInputNumber(state.medicalOther),
      educationSelf: parseInputNumber(state.educationSelf),
      educationChild: parseInputNumber(state.educationChild),
      educationUniv: parseInputNumber(state.educationUniv),
      insurancePremium: parseInputNumber(state.insurancePremium),
      disabledInsurance: parseInputNumber(state.disabledInsurance),
      donationCredit: parseInputNumber(state.donationCredit),
      smeReduction: state.smeReduction,
      smeReductionRate: state.smeReductionRate,
      monthlyRent: parseInputNumber(state.monthlyRent),
      pensionAccount: parseInputNumber(state.pensionAccount),
      irpSavings: parseInputNumber(state.irpSavings),
      childCount: state.childCount,
      marriageCredit: state.marriageCredit,
      otherTaxCredit: parseInputNumber(state.otherTaxCredit),
    };

    setResult(calculateRefund(input));
  }

  const f = (v: string) => (parseInputNumber(v) > 0 ? `${formatNumber(parseInputNumber(v))}원` : "");

  return (
    <div className="space-y-4">
      {/* Section 1: 기본 정보 */}
      <Section
        number="01"
        title="기본 정보"
        summary={f(state.totalSalary) ? `총급여 ${f(state.totalSalary)}` : undefined}
        open={openSections.has(1)}
        onToggle={() => toggleSection(1)}
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <MoneyInput
            label="총급여 (원)"
            value={state.totalSalary}
            onChange={(v) => update({ totalSalary: v })}
            placeholder="예: 50,000,000"
            hint="연간 총 급여액 (비과세 포함)"
          />
          <MoneyInput
            label="기납부세액 (원)"
            value={state.prepaidTax}
            onChange={(v) => update({ prepaidTax: v })}
            hint="원천징수영수증에서 확인"
          />
        </div>

        <div className="mt-5 border-t border-ink/10 pt-5">
          <p className="text-xs text-muted mb-4">인적공제</p>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-bold text-ink mb-1.5">
                부양가족 수 (본인 포함)
              </label>
              <CustomSelect
                value={state.dependents}
                onChange={(v) => update({ dependents: v })}
                options={Array.from({ length: 11 }, (_, i) => ({
                  value: i + 1,
                  label: `${i + 1}명`,
                }))}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-ink mb-1.5">
                경로우대 (70세 이상)
              </label>
              <CustomSelect
                value={state.seniorCount}
                onChange={(v) => update({ seniorCount: v })}
                options={Array.from({ length: 6 }, (_, i) => ({
                  value: i,
                  label: `${i}명`,
                }))}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-ink mb-1.5">
                장애인 수
              </label>
              <CustomSelect
                value={state.disabled}
                onChange={(v) => update({ disabled: v })}
                options={Array.from({ length: 6 }, (_, i) => ({
                  value: i,
                  label: `${i}명`,
                }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-ink mb-1.5">
                  한부모
                </label>
                <CustomSelect
                  value={state.singleParent}
                  onChange={(v) => update({ singleParent: v })}
                  options={[
                    { value: 0, label: "해당없음" },
                    { value: 1, label: "해당" },
                  ]}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-ink mb-1.5">
                  부녀자
                </label>
                <CustomSelect
                  value={state.womanDeduction}
                  onChange={(v) => update({ womanDeduction: v })}
                  options={[
                    { value: 0, label: "해당없음" },
                    { value: 1, label: "해당" },
                  ]}
                />
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Section 2: 소득공제 */}
      <Section
        number="02"
        title="소득공제"
        open={openSections.has(2)}
        onToggle={() => toggleSection(2)}
      >
        <p className="text-xs text-muted mb-4">4대보험료</p>
        <div className="grid gap-5 sm:grid-cols-3">
          <MoneyInput
            label="국민연금 (연간)"
            value={state.nationalPension}
            onChange={(v) => update({ nationalPension: v })}
          />
          <MoneyInput
            label="건강보험 (연간)"
            value={state.healthInsurance}
            onChange={(v) => update({ healthInsurance: v })}
            hint="장기요양 포함"
          />
          <MoneyInput
            label="고용보험 (연간)"
            value={state.employmentInsurance}
            onChange={(v) => update({ employmentInsurance: v })}
          />
        </div>

        <div className="mt-5 border-t border-ink/10 pt-5">
          <p className="text-xs text-muted mb-4">주택자금공제</p>
          <div className="grid gap-5 sm:grid-cols-2">
            <MoneyInput
              label="주택임차차입금 원리금상환액"
              value={state.housingRentLoan}
              onChange={(v) => update({ housingRentLoan: v })}
              hint="40% 공제, 연 400만 한도"
            />
            <MoneyInput
              label="장기주택저당차입금 이자상환액"
              value={state.housingMortgage}
              onChange={(v) => update({ housingMortgage: v })}
              hint="연 2,000만 한도"
            />
          </div>
        </div>

        <div className="mt-5 border-t border-ink/10 pt-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <MoneyInput
              label="신용카드 등 소득공제액"
              value={state.creditCardDeduction}
              onChange={(v) => update({ creditCardDeduction: v })}
              hint="홈택스 연말정산 간소화에서 확인"
            />
            <MoneyInput
              label="기타 소득공제"
              value={state.otherIncomeDeduction}
              onChange={(v) => update({ otherIncomeDeduction: v })}
            />
          </div>
        </div>
      </Section>

      {/* Section 3: 세액공제 */}
      <Section
        number="03"
        title="세액공제"
        open={openSections.has(3)}
        onToggle={() => toggleSection(3)}
      >
        <p className="text-xs text-muted mb-4">의료비</p>
        <div className="grid gap-5 sm:grid-cols-2">
          <MoneyInput
            label="본인/경로/장애 의료비"
            value={state.medicalSelf}
            onChange={(v) => update({ medicalSelf: v })}
            hint="한도 없음"
          />
          <MoneyInput
            label="기타 의료비"
            value={state.medicalOther}
            onChange={(v) => update({ medicalOther: v })}
            hint="연 700만 한도"
          />
        </div>

        <div className="mt-5 border-t border-ink/10 pt-5">
          <p className="text-xs text-muted mb-4">교육비</p>
          <div className="grid gap-5 sm:grid-cols-3">
            <MoneyInput
              label="본인 교육비"
              value={state.educationSelf}
              onChange={(v) => update({ educationSelf: v })}
              hint="한도 없음"
            />
            <MoneyInput
              label="유치원~고등학교"
              value={state.educationChild}
              onChange={(v) => update({ educationChild: v })}
              hint="연 300만 한도"
            />
            <MoneyInput
              label="대학생"
              value={state.educationUniv}
              onChange={(v) => update({ educationUniv: v })}
              hint="연 900만 한도"
            />
          </div>
        </div>

        <div className="mt-5 border-t border-ink/10 pt-5">
          <p className="text-xs text-muted mb-4">보험료</p>
          <div className="grid gap-5 sm:grid-cols-2">
            <MoneyInput
              label="보장성보험료"
              value={state.insurancePremium}
              onChange={(v) => update({ insurancePremium: v })}
              hint="연 100만 한도, 12%"
            />
            <MoneyInput
              label="장애인 보장성보험료"
              value={state.disabledInsurance}
              onChange={(v) => update({ disabledInsurance: v })}
              hint="연 100만 한도, 15%"
            />
          </div>
        </div>

        <div className="mt-5 border-t border-ink/10 pt-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <MoneyInput
              label="기부금 세액공제"
              value={state.donationCredit}
              onChange={(v) => update({ donationCredit: v })}
              hint="홈택스에서 확인한 공제액"
            />
          </div>
        </div>

        <div className="mt-5 border-t border-ink/10 pt-5">
          <p className="text-xs text-muted mb-4">중소기업 취업자 소득세 감면</p>
          <div className="flex items-center gap-4 mb-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={state.smeReduction}
                onChange={(e) =>
                  update({ smeReduction: e.target.checked })
                }
                className="size-4 rounded border-ink/20 accent-seal"
              />
              <span className="text-sm text-ink">해당</span>
            </label>
            {state.smeReduction && (
              <div className="w-40">
                <CustomSelect
                  value={state.smeReductionRate * 100}
                  onChange={(v) => update({ smeReductionRate: v / 100 })}
                  options={[
                    { value: 70, label: "70% 감면" },
                    { value: 90, label: "90% 감면" },
                    { value: 100, label: "100% 감면" },
                  ]}
                />
              </div>
            )}
          </div>
        </div>

        <div className="mt-5 border-t border-ink/10 pt-5">
          <p className="text-xs text-muted mb-4">기타 세액공제</p>
          <div className="grid gap-5 sm:grid-cols-2">
            <MoneyInput
              label="월세 연간 지급액"
              value={state.monthlyRent}
              onChange={(v) => update({ monthlyRent: v })}
              hint="총급여 8천만 이하 시 공제"
            />
            <MoneyInput
              label="연금계좌 (퇴직연금 등)"
              value={state.pensionAccount}
              onChange={(v) => update({ pensionAccount: v })}
            />
            <MoneyInput
              label="IRP/연금저축"
              value={state.irpSavings}
              onChange={(v) => update({ irpSavings: v })}
              hint="연 600만 한도"
            />
            <div>
              <label className="block text-sm font-bold text-ink mb-1.5">
                자녀세액공제 대상 수
              </label>
              <CustomSelect
                value={state.childCount}
                onChange={(v) => update({ childCount: v })}
                options={Array.from({ length: 6 }, (_, i) => ({
                  value: i,
                  label: `${i}명`,
                }))}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-ink mb-1.5">
                결혼세액공제
              </label>
              <CustomSelect
                value={state.marriageCredit}
                onChange={(v) => update({ marriageCredit: v })}
                options={[
                  { value: 0, label: "해당없음" },
                  { value: 1_000_000, label: "100만원" },
                ]}
              />
            </div>
            <MoneyInput
              label="기타 세액공제"
              value={state.otherTaxCredit}
              onChange={(v) => update({ otherTaxCredit: v })}
            />
          </div>
        </div>
      </Section>

      {/* 계산 버튼 */}
      <button
        onClick={handleCalculate}
        className="w-full rounded-md bg-ink py-3.5 text-sm font-bold text-paper transition-colors hover:bg-ink/85 active:bg-ink/75 cursor-pointer"
      >
        계산하기
      </button>

      {/* 결과 */}
      {result && (
        <div className="space-y-6">
          {/* 환급/추가징수 하이라이트 */}
          <div
            className={`rounded-lg border-2 p-6 text-center ${
              result.isRefund
                ? "border-seal/30 bg-seal/5"
                : "border-ink/30 bg-ink/5"
            }`}
          >
            <p className="text-sm text-muted mb-1">
              {result.isRefund ? "예상 환급액" : "예상 추가징수액"}
            </p>
            <p
              className={`font-mono text-4xl font-bold ${
                result.isRefund ? "text-seal" : "text-ink"
              }`}
            >
              {result.isRefund ? "−" : "+"}
              {formatNumber(Math.abs(result.totalDiff))}
              <span
                className={`text-lg ml-1 ${
                  result.isRefund ? "text-seal/60" : "text-ink/60"
                }`}
              >
                원
              </span>
            </p>
            <p className="mt-2 text-xs text-muted">
              소득세 {formatNumber(Math.abs(result.incomeTaxDiff))}원 +
              지방소득세 {formatNumber(Math.abs(result.localTaxDiff))}원
            </p>
          </div>

          {/* 소득공제 내역 */}
          <div className="rounded-lg border border-ink/10 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-ink/10 bg-surface/50">
                  <th className="px-4 py-3 text-left font-bold text-ink">
                    소득공제 내역
                  </th>
                  <th className="px-4 py-3 text-right font-bold text-ink">
                    금액
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/5">
                <tr>
                  <td className="px-4 py-2.5 text-ink/80">총급여</td>
                  <td className="px-4 py-2.5 text-right font-mono text-ink">
                    {formatNumber(parseInputNumber(state.totalSalary))}원
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 text-ink/80">근로소득공제</td>
                  <td className="px-4 py-2.5 text-right font-mono text-ink">
                    −{formatNumber(result.earnedIncomeDeduction)}원
                  </td>
                </tr>
                <tr className="border-t border-ink/10">
                  <td className="px-4 py-2.5 font-bold text-ink">
                    근로소득금액
                  </td>
                  <td className="px-4 py-2.5 text-right font-mono font-bold text-ink">
                    {formatNumber(result.earnedIncome)}원
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 text-ink/80">인적공제</td>
                  <td className="px-4 py-2.5 text-right font-mono text-ink">
                    −{formatNumber(result.personalDeduction)}원
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 text-ink/80">보험료 공제</td>
                  <td className="px-4 py-2.5 text-right font-mono text-ink">
                    −{formatNumber(result.insuranceDeductionTotal)}원
                  </td>
                </tr>
                {result.housingDeduction > 0 && (
                  <tr>
                    <td className="px-4 py-2.5 text-ink/80">주택자금공제</td>
                    <td className="px-4 py-2.5 text-right font-mono text-ink">
                      −{formatNumber(result.housingDeduction)}원
                    </td>
                  </tr>
                )}
                {result.creditCardDeduction > 0 && (
                  <tr>
                    <td className="px-4 py-2.5 text-ink/80">
                      신용카드 등 공제
                    </td>
                    <td className="px-4 py-2.5 text-right font-mono text-ink">
                      −{formatNumber(result.creditCardDeduction)}원
                    </td>
                  </tr>
                )}
                {result.otherIncomeDeduction > 0 && (
                  <tr>
                    <td className="px-4 py-2.5 text-ink/80">기타 소득공제</td>
                    <td className="px-4 py-2.5 text-right font-mono text-ink">
                      −{formatNumber(result.otherIncomeDeduction)}원
                    </td>
                  </tr>
                )}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-ink/15 bg-surface/30">
                  <td className="px-4 py-3 font-bold text-ink">과세표준</td>
                  <td className="px-4 py-3 text-right font-mono font-bold text-ink">
                    {formatNumber(result.taxableIncome)}원
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* 세액공제 내역 */}
          <div className="rounded-lg border border-ink/10 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-ink/10 bg-surface/50">
                  <th className="px-4 py-3 text-left font-bold text-ink">
                    세액 내역
                  </th>
                  <th className="px-4 py-3 text-right font-bold text-ink">
                    금액
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/5">
                <tr>
                  <td className="px-4 py-2.5 font-bold text-ink">산출세액</td>
                  <td className="px-4 py-2.5 text-right font-mono font-bold text-ink">
                    {formatNumber(result.calculatedTax)}원
                  </td>
                </tr>
                {result.useStandardCredit ? (
                  <tr>
                    <td className="px-4 py-2.5 text-ink/80">
                      표준세액공제
                    </td>
                    <td className="px-4 py-2.5 text-right font-mono text-ink">
                      −{formatNumber(result.standardCredit)}원
                    </td>
                  </tr>
                ) : (
                  <>
                    {result.medicalCredit > 0 && (
                      <tr>
                        <td className="px-4 py-2.5 text-ink/80">
                          의료비 세액공제
                        </td>
                        <td className="px-4 py-2.5 text-right font-mono text-ink">
                          −{formatNumber(result.medicalCredit)}원
                        </td>
                      </tr>
                    )}
                    {result.educationCredit > 0 && (
                      <tr>
                        <td className="px-4 py-2.5 text-ink/80">
                          교육비 세액공제
                        </td>
                        <td className="px-4 py-2.5 text-right font-mono text-ink">
                          −{formatNumber(result.educationCredit)}원
                        </td>
                      </tr>
                    )}
                    {result.insuranceCredit > 0 && (
                      <tr>
                        <td className="px-4 py-2.5 text-ink/80">
                          보험료 세액공제
                        </td>
                        <td className="px-4 py-2.5 text-right font-mono text-ink">
                          −{formatNumber(result.insuranceCredit)}원
                        </td>
                      </tr>
                    )}
                    {result.donationCredit > 0 && (
                      <tr>
                        <td className="px-4 py-2.5 text-ink/80">
                          기부금 세액공제
                        </td>
                        <td className="px-4 py-2.5 text-right font-mono text-ink">
                          −{formatNumber(result.donationCredit)}원
                        </td>
                      </tr>
                    )}
                  </>
                )}
                {result.smeReductionAmount > 0 && (
                  <tr>
                    <td className="px-4 py-2.5 text-ink/80">
                      중소기업 감면
                    </td>
                    <td className="px-4 py-2.5 text-right font-mono text-ink">
                      −{formatNumber(result.smeReductionAmount)}원
                    </td>
                  </tr>
                )}
                {result.monthlyRentCredit > 0 && (
                  <tr>
                    <td className="px-4 py-2.5 text-ink/80">월세 세액공제</td>
                    <td className="px-4 py-2.5 text-right font-mono text-ink">
                      −{formatNumber(result.monthlyRentCredit)}원
                    </td>
                  </tr>
                )}
                {result.pensionCredit > 0 && (
                  <tr>
                    <td className="px-4 py-2.5 text-ink/80">
                      연금계좌 세액공제
                    </td>
                    <td className="px-4 py-2.5 text-right font-mono text-ink">
                      −{formatNumber(result.pensionCredit)}원
                    </td>
                  </tr>
                )}
                {result.childCredit > 0 && (
                  <tr>
                    <td className="px-4 py-2.5 text-ink/80">자녀 세액공제</td>
                    <td className="px-4 py-2.5 text-right font-mono text-ink">
                      −{formatNumber(result.childCredit)}원
                    </td>
                  </tr>
                )}
                {result.marriageCredit > 0 && (
                  <tr>
                    <td className="px-4 py-2.5 text-ink/80">결혼 세액공제</td>
                    <td className="px-4 py-2.5 text-right font-mono text-ink">
                      −{formatNumber(result.marriageCredit)}원
                    </td>
                  </tr>
                )}
                <tr>
                  <td className="px-4 py-2.5 text-ink/80">
                    근로소득 세액공제
                  </td>
                  <td className="px-4 py-2.5 text-right font-mono text-ink">
                    −{formatNumber(result.earnedIncomeTaxCredit)}원
                  </td>
                </tr>
                {result.otherTaxCredit > 0 && (
                  <tr>
                    <td className="px-4 py-2.5 text-ink/80">
                      기타 세액공제
                    </td>
                    <td className="px-4 py-2.5 text-right font-mono text-ink">
                      −{formatNumber(result.otherTaxCredit)}원
                    </td>
                  </tr>
                )}
                <tr className="border-t border-ink/10">
                  <td className="px-4 py-2.5 font-bold text-ink">결정세액</td>
                  <td className="px-4 py-2.5 text-right font-mono font-bold text-ink">
                    {formatNumber(result.determinedTax)}원
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 text-ink/80">기납부세액</td>
                  <td className="px-4 py-2.5 text-right font-mono text-ink">
                    −{formatNumber(result.prepaidTax)}원
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr
                  className={`border-t-2 ${
                    result.isRefund
                      ? "border-seal/20 bg-seal/5"
                      : "border-ink/15 bg-ink/5"
                  }`}
                >
                  <td
                    className={`px-4 py-3 font-bold ${
                      result.isRefund ? "text-seal" : "text-ink"
                    }`}
                  >
                    {result.isRefund ? "환급세액" : "추가징수세액"}
                  </td>
                  <td
                    className={`px-4 py-3 text-right font-mono font-bold ${
                      result.isRefund ? "text-seal" : "text-ink"
                    }`}
                  >
                    {result.isRefund ? "−" : "+"}
                    {formatNumber(Math.abs(result.totalDiff))}원
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          <p className="text-xs text-muted leading-relaxed">
            * 본 계산기는 참고용이며 실제 연말정산 결과와 차이가 있을 수
            있습니다. 정확한 계산은 홈택스 연말정산 간소화 서비스를
            이용하세요.
          </p>
        </div>
      )}
    </div>
  );
}
