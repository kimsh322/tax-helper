import PageShell from "@/components/layout/PageShell";
import Header from "@/components/layout/Header";

function SectionTitle({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-4">
      <div className="flex items-baseline gap-2">
        <span className="font-mono text-xs text-muted">{number}</span>
        <h2 className="font-serif text-lg font-bold text-ink">{title}</h2>
      </div>
      {description && (
        <p className="mt-1 text-sm text-muted">{description}</p>
      )}
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-ink/10 bg-surface/40 p-6">
      {children}
    </div>
  );
}

function RateTable({
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

function Formula({
  label,
  formula,
}: {
  label: string;
  formula: string;
}) {
  return (
    <div className="flex flex-col gap-1 rounded-md border border-ink/10 bg-paper px-4 py-3">
      <span className="text-xs text-muted">{label}</span>
      <span className="font-mono text-sm text-ink">{formula}</span>
    </div>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block rounded-full border border-seal/30 bg-seal/5 px-2.5 py-0.5 text-xs font-bold text-seal">
      {children}
    </span>
  );
}

export default function DeductionsPage() {
  return (
    <PageShell>
      <Header
        number="04"
        title="공제 항목 설명"
        description="연말정산의 계산 흐름과 소득공제/세액공제 항목을 한눈에 정리했습니다."
      />

      <div className="space-y-8">
        {/* ─── 계산 흐름 요약 ─── */}
        <Card>
          <SectionTitle
            number="00"
            title="연말정산 계산 흐름"
            description="총급여에서 최종 환급/추가징수까지의 단계"
          />
          <div className="mt-4 grid gap-2">
            {[
              ["총급여", "연간 급여 총액"],
              ["− 근로소득공제", "소득 구간별 자동 공제"],
              ["= 근로소득금액", ""],
              ["− 소득공제 합계", "인적공제 + 보험료 + 주택 + 신용카드 등"],
              ["= 과세표준", "세금을 매기는 기준 금액"],
              ["× 세율", "8단계 누진세율 적용"],
              ["= 산출세액", ""],
              ["− 세액공제 합계", "특별세액공제 + 기타 세액공제"],
              ["= 결정세액", "실제 내야 할 세금"],
              ["− 기납부세액", "이미 원천징수된 세금"],
              ["= 환급 또는 추가징수", "음수이면 환급, 양수이면 추가징수"],
            ].map(([step, desc], i) => (
              <div
                key={i}
                className={`flex items-baseline gap-3 px-3 py-1.5 rounded ${
                  step.startsWith("=")
                    ? "bg-surface/60 font-bold"
                    : ""
                }`}
              >
                <span className="font-mono text-sm text-ink min-w-[160px] shrink-0">
                  {step}
                </span>
                <span className="text-xs text-muted">{desc}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* ─── 1. 근로소득공제 ─── */}
        <Card>
          <SectionTitle
            number="01"
            title="근로소득공제"
            description="총급여에서 소득 규모에 따라 자동으로 차감되는 공제입니다."
          />
          <RateTable
            headers={["총급여 구간", "공제액", "간편계산식"]}
            rows={[
              ["500만원 이하", "총급여 × 70%", "총급여 × 0.7"],
              ["500만원 ~ 1,500만원", "350만 + (총급여 − 500만) × 40%", "총급여 × 0.4 + 150만"],
              ["1,500만원 ~ 4,500만원", "750만 + (총급여 − 1,500만) × 15%", "총급여 × 0.15 + 525만"],
              ["4,500만원 ~ 1억원", "1,200만 + (총급여 − 4,500만) × 5%", "총급여 × 0.05 + 975만"],
              ["1억원 ~ 3억6,250만원", "1,475만 + (총급여 − 1억) × 2%", "총급여 × 0.02 + 1,275만"],
              ["3억6,250만원 초과", "2,000만원 (한도)", "2,000만원"],
            ]}
          />
          <div className="mt-4">
            <Formula
              label="예시: 총급여 5,000만원"
              formula="5,000만 × 0.15 + 525만 = 1,275만원 공제"
            />
          </div>
        </Card>

        {/* ─── 2. 소득공제 항목 ─── */}
        <Card>
          <SectionTitle
            number="02"
            title="소득공제 항목"
            description="근로소득금액에서 차감하여 과세표준을 낮추는 공제들입니다."
          />

          {/* 인적공제 */}
          <div className="mb-5">
            <h3 className="text-sm font-bold text-ink mb-2">인적공제</h3>
            <RateTable
              headers={["구분", "1인당 공제액"]}
              rows={[
                ["기본공제 (본인 포함 부양가족)", "150만원"],
                ["장애인 추가공제", "200만원"],
                ["경로우대 (70세 이상)", "100만원"],
                ["한부모 추가공제", "100만원"],
                ["부녀자 추가공제", "50만원"],
              ]}
              footnote="한부모와 부녀자 공제는 중복 적용 불가 (한부모 우선)"
            />
          </div>

          {/* 보험료 공제 */}
          <div className="mb-5 border-t border-ink/10 pt-5">
            <h3 className="text-sm font-bold text-ink mb-2">
              보험료 소득공제
            </h3>
            <p className="text-sm text-ink/70 mb-2">
              국민연금, 건강보험(장기요양 포함), 고용보험 본인부담분은{" "}
              <Badge>전액 공제</Badge>
            </p>
          </div>

          {/* 주택자금공제 */}
          <div className="mb-5 border-t border-ink/10 pt-5">
            <h3 className="text-sm font-bold text-ink mb-2">주택자금공제</h3>
            <RateTable
              headers={["구분", "공제율/한도"]}
              rows={[
                ["주택임차차입금 원리금상환액", "상환액 × 40%, 연 400만원 한도"],
                ["장기주택저당차입금 이자상환액", "이자상환액, 연 2,000만원 한도"],
              ]}
              footnote="주택자금공제 합계 한도: 연 2,000만원"
            />
            <div className="mt-3">
              <Formula
                label="주택자금공제 계산식"
                formula="(임차차입금 × 40%, 최대 400만) + (장기주택 이자, 최대 2,000만) → 합계 최대 2,000만원"
              />
            </div>
          </div>

          {/* 신용카드 */}
          <div className="border-t border-ink/10 pt-5">
            <h3 className="text-sm font-bold text-ink mb-2">
              신용카드 등 소득공제
            </h3>
            <p className="text-sm text-ink/70">
              사용금액이 총급여의 25%를 초과하는 부분에 대해 결제수단별
              공제율(15~40%)을 적용합니다. 계산이 복잡하므로{" "}
              <span className="font-bold text-ink">
                홈택스 연말정산 간소화
              </span>
              에서 확인한 최종 공제액을 입력하세요.
            </p>
          </div>
        </Card>

        {/* ─── 3. 과세표준 & 세율 ─── */}
        <Card>
          <SectionTitle
            number="03"
            title="종합소득세율 (8단계 누진)"
            description="과세표준에 적용되는 세율입니다."
          />
          <RateTable
            headers={["과세표준 구간", "세율", "누진공제", "간편계산식"]}
            rows={[
              ["1,400만원 이하", "6%", "—", "과세표준 × 0.06"],
              ["1,400만원 ~ 5,000만원", "15%", "126만원", "과세표준 × 0.15 − 126만"],
              ["5,000만원 ~ 8,800만원", "24%", "576만원", "과세표준 × 0.24 − 576만"],
              ["8,800만원 ~ 1.5억원", "35%", "1,544만원", "과세표준 × 0.35 − 1,544만"],
              ["1.5억원 ~ 3억원", "38%", "1,994만원", "과세표준 × 0.38 − 1,994만"],
              ["3억원 ~ 5억원", "40%", "2,594만원", "과세표준 × 0.40 − 2,594만"],
              ["5억원 ~ 10억원", "42%", "3,594만원", "과세표준 × 0.42 − 3,594만"],
              ["10억원 초과", "45%", "6,594만원", "과세표준 × 0.45 − 6,594만"],
            ]}
          />
          <div className="mt-4">
            <Formula
              label="예시: 과세표준 4,000만원"
              formula="4,000만 × 0.15 − 126만 = 474만원 (산출세액)"
            />
          </div>
        </Card>

        {/* ─── 4. 세액공제 항목 ─── */}
        <Card>
          <SectionTitle
            number="04"
            title="세액공제 항목"
            description="산출세액에서 직접 차감하는 공제들입니다. 소득공제보다 절세 효과가 큽니다."
          />

          {/* 특별세액공제 */}
          <div className="mb-5">
            <h3 className="text-sm font-bold text-ink mb-1">
              특별세액공제{" "}
              <span className="text-xs font-normal text-muted">
                (합계 13만원 미만이면 표준세액공제 13만원 적용)
              </span>
            </h3>

            <div className="mt-3 space-y-4">
              {/* 의료비 */}
              <div>
                <h4 className="text-sm font-bold text-ink/80 mb-1">의료비</h4>
                <RateTable
                  headers={["구분", "공제율", "한도"]}
                  rows={[
                    ["본인/경로/장애인", "15%", "한도 없음"],
                    ["기타 부양가족", "15%", "연 700만원"],
                  ]}
                  footnote="총급여의 3%를 초과하는 금액만 공제 대상"
                />
                <div className="mt-2">
                  <Formula
                    label="의료비 세액공제"
                    formula="(의료비 합계 − 총급여 × 3%) × 15%"
                  />
                </div>
              </div>

              {/* 교육비 */}
              <div className="border-t border-ink/10 pt-4">
                <h4 className="text-sm font-bold text-ink/80 mb-1">교육비</h4>
                <RateTable
                  headers={["구분", "공제율", "한도"]}
                  rows={[
                    ["본인", "15%", "한도 없음"],
                    ["유치원 ~ 고등학교", "15%", "연 300만원"],
                    ["대학생", "15%", "연 900만원"],
                  ]}
                />
              </div>

              {/* 보장성보험 */}
              <div className="border-t border-ink/10 pt-4">
                <h4 className="text-sm font-bold text-ink/80 mb-1">
                  보장성보험료
                </h4>
                <RateTable
                  headers={["구분", "공제율", "한도"]}
                  rows={[
                    ["일반 보장성보험", "12%", "연 100만원"],
                    ["장애인 보장성보험", "15%", "연 100만원"],
                  ]}
                />
              </div>

              {/* 기부금 */}
              <div className="border-t border-ink/10 pt-4">
                <h4 className="text-sm font-bold text-ink/80 mb-1">기부금</h4>
                <p className="text-sm text-ink/70">
                  기부 유형과 금액에 따라 15~30% 공제율이 적용됩니다.
                  홈택스에서 확인한 최종 공제액을 입력하세요.
                </p>
              </div>
            </div>
          </div>

          {/* 근로소득 세액공제 */}
          <div className="mb-5 border-t border-ink/10 pt-5">
            <h3 className="text-sm font-bold text-ink mb-2">
              근로소득 세액공제
            </h3>
            <RateTable
              headers={["산출세액 구간", "공제율"]}
              rows={[
                ["130만원 이하", "산출세액 × 55%"],
                ["130만원 초과", "71.5만 + (산출세액 − 130만) × 30%"],
              ]}
            />
            <div className="mt-3">
              <h4 className="text-xs text-muted mb-1">총급여별 한도</h4>
              <RateTable
                headers={["총급여", "한도"]}
                rows={[
                  ["3,300만원 이하", "74만원"],
                  ["3,300만원 ~ 7,000만원", "66만원"],
                  ["7,000만원 초과", "50만원"],
                ]}
              />
            </div>
          </div>

          {/* 자녀 세액공제 */}
          <div className="mb-5 border-t border-ink/10 pt-5">
            <h3 className="text-sm font-bold text-ink mb-2">자녀세액공제</h3>
            <RateTable
              headers={["자녀 수", "공제액"]}
              rows={[
                ["1명", "15만원"],
                ["2명", "35만원"],
                ["3명 이상", "35만 + (3명째부터 1인당 30만원)"],
              ]}
            />
          </div>

          {/* 연금계좌 */}
          <div className="mb-5 border-t border-ink/10 pt-5">
            <h3 className="text-sm font-bold text-ink mb-2">
              연금계좌 세액공제
            </h3>
            <RateTable
              headers={["총급여", "공제율", "IRP/연금저축 한도", "합계 한도"]}
              rows={[
                ["5,500만원 이하", "15%", "연 600만원", "연 900만원"],
                ["5,500만원 초과", "12%", "연 600만원", "연 900만원"],
              ]}
            />
          </div>

          {/* 월세 세액공제 */}
          <div className="mb-5 border-t border-ink/10 pt-5">
            <h3 className="text-sm font-bold text-ink mb-2">월세 세액공제</h3>
            <RateTable
              headers={["총급여", "공제율", "한도"]}
              rows={[
                ["5,500만원 이하", "17%", "연 1,000만원"],
                ["5,500만원 ~ 8,000만원", "15%", "연 1,000만원"],
                ["8,000만원 초과", "공제 불가", "—"],
              ]}
              footnote="무주택 세대주, 국민주택규모 이하 또는 기준시가 4억 이하 주택"
            />
          </div>

          {/* 중소기업 감면 */}
          <div className="mb-5 border-t border-ink/10 pt-5">
            <h3 className="text-sm font-bold text-ink mb-2">
              중소기업 취업자 소득세 감면
            </h3>
            <RateTable
              headers={["대상", "감면율", "한도"]}
              rows={[
                ["청년 (15~34세)", "90%", "연 200만원"],
                ["고령자/장애인/경력단절여성", "70%", "연 200만원"],
              ]}
              footnote="취업일로부터 5년간 (청년은 5년) 적용"
            />
          </div>

          {/* 결혼 세액공제 */}
          <div className="border-t border-ink/10 pt-5">
            <h3 className="text-sm font-bold text-ink mb-2">결혼세액공제</h3>
            <p className="text-sm text-ink/70">
              2024~2026년 혼인신고 시 <Badge>100만원</Badge> 세액공제 (1회
              한정)
            </p>
          </div>
        </Card>

        {/* ─── 5. 최종 계산 ─── */}
        <Card>
          <SectionTitle
            number="05"
            title="최종 환급/추가징수 계산"
            description="결정세액에서 기납부세액을 빼면 최종 결과가 나옵니다."
          />
          <div className="space-y-3">
            <Formula
              label="차감소득세"
              formula="(결정세액 − 기납부세액)의 10원 미만 버림"
            />
            <Formula
              label="차감지방소득세"
              formula="(차감소득세 × 10%)의 10원 미만 버림"
            />
            <Formula
              label="최종 결과"
              formula="차감소득세 + 차감지방소득세"
            />
          </div>
          <div className="mt-4 rounded-md border border-seal/20 bg-seal/5 px-4 py-3">
            <p className="text-sm text-ink/80">
              결과가 <span className="font-bold text-seal">음수</span>이면{" "}
              <span className="font-bold text-seal">환급</span>, 양수이면
              추가징수입니다. 10원 미만의 끝자리는 버림 처리됩니다.
            </p>
          </div>
        </Card>

        <p className="text-xs text-muted leading-relaxed pb-4">
          * 2024년 귀속 기준으로 작성되었으며, 세법 개정에 따라 변경될 수
          있습니다. 정확한 계산은 국세청 홈택스를 이용하세요.
        </p>
      </div>
    </PageShell>
  );
}
