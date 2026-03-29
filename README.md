# 연말정산 미리계산

2026년 귀속 연말정산 모의계산기입니다. 연봉을 입력하면 실수령액과 예상 환급액을 미리 계산해볼 수 있습니다.

**<a href="https://kimsh322.github.io/tax-helper/" target="_blank">https://kimsh322.github.io/tax-helper/</a>**

## 주요 기능

- **실수령액 계산기** — 연봉에서 4대보험·소득세를 제외한 월 실수령액 계산 (간이세액표 기반)
- **환급액 예상** — 소득공제·세액공제 항목을 입력하면 연말정산 예상 환급액(또는 추가징수액) 계산
- **공제 항목 설명** — 근로소득공제, 종합소득세율, 각종 세액공제 항목의 요율·한도·계산식 정리
- **퀵 시뮬레이션** — 홈에서 연봉만 입력하면 실수령액과 환급액을 바로 확인
- **페이지 간 데이터 연동** — 실수령액 계산 결과를 환급액 계산기로 자동 전달

## 기술 스택

- Next.js 16 (App Router, Static Export)
- TypeScript
- Tailwind CSS v4
- pnpm
- GitHub Pages + GitHub Actions

## 실행

```bash
pnpm install
pnpm dev       # 개발 서버 (http://localhost:3000)
pnpm build     # 프로덕션 빌드 (out/ 디렉토리)
pnpm lint      # ESLint
```

## 프로젝트 구조

```
app/
  page.tsx                    # 홈 (퀵 시뮬레이션)
  QuickSimulation.tsx         # 퀵 시뮬레이션 컴포넌트
  calculator/
    page.tsx                  # 실수령액 계산기 페이지
    SalaryCalculator.tsx      # 실수령액 계산 UI
    SalaryTable.tsx           # 연봉별 실수령액 표
    CalculatorTabs.tsx        # 탭 전환
  refund/
    page.tsx                  # 환급액 예상 페이지
    RefundCalculator.tsx      # 환급액 계산 UI
  deductions/
    page.tsx                  # 공제 항목 설명
  tips/
    page.tsx                  # 절세 팁 (준비중)
lib/
  salary.ts                   # 급여 계산 로직
  refund.ts                   # 환급액 계산 로직
  tax-table.ts                # 간이세액표 데이터
components/
  layout/                     # PageShell, Header, Navigation, Footer
  ui/                         # CustomSelect
```

## 배포

`main` 브랜치에 push하면 GitHub Actions가 자동으로 빌드 후 GitHub Pages에 배포합니다.
