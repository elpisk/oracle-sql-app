import type { PracticeProblem } from '@/lib/types'

export const ch15Practice: PracticeProblem[] = [
  // ── Group 1: MODEL 기본 구조 ──────────────────────────────
  {
    id: 1501, group: 1, groupTitle: 'MODEL 기본 구조',
    question: '부서별 연도별 급여 합계를 MODEL 절로 조회하시오.',
    sql: `SELECT department_id, yr, total_sal
FROM (
    SELECT department_id,
           EXTRACT(YEAR FROM hire_date) AS yr,
           SUM(salary) AS total_sal
    FROM   employees
    WHERE  department_id IS NOT NULL
    GROUP BY department_id, EXTRACT(YEAR FROM hire_date)
)
MODEL
    PARTITION BY (department_id)
    DIMENSION BY (yr)
    MEASURES     (total_sal)
    RULES ()
ORDER BY department_id, yr;`,
    result: '부서별 연도별 급여 합계 출력. RULES 빈 경우 원본 그대로 반환.',
    keyPoint: 'MODEL 기본 골격: PARTITION BY / DIMENSION BY / MEASURES / RULES. RULES()는 빈 규칙.',
  },
  {
    id: 1502, group: 1, groupTitle: 'MODEL 기본 구조',
    question: 'DUAL을 사용하여 1~5까지 수열을 MODEL로 생성하시오.',
    sql: `SELECT n, val
FROM DUAL
MODEL
    DIMENSION BY (0 AS n)
    MEASURES     (0 AS val)
    RULES (
        val[FOR n FROM 1 TO 5 INCREMENT 1] = CV(n) * CV(n)
    )
ORDER BY n;`,
    result: 'n=1~5, val=1,4,9,16,25 (n 제곱)',
    keyPoint: 'DUAL + MODEL: 원본 데이터 없이 새 행 생성. FOR 루프로 차원 범위 지정.',
  },
  {
    id: 1503, group: 1, groupTitle: 'MODEL 기본 구조',
    question: 'MEASURES 열을 새 행에 계산하는 기본 패턴을 실습하시오. (2027년 예측 매출 추가)',
    sql: `CREATE TABLE yr_sales AS
SELECT 2023 AS yr, 100000 AS sales FROM DUAL UNION ALL
SELECT 2024, 115000 FROM DUAL UNION ALL
SELECT 2025, 130000 FROM DUAL;

SELECT yr, sales
FROM yr_sales
MODEL
    DIMENSION BY (yr)
    MEASURES     (sales)
    RULES (
        sales[2026] = sales[2025] * 1.1,
        sales[2027] = sales[2026] * 1.1
    )
ORDER BY yr;

DROP TABLE yr_sales PURGE;`,
    result: 'yr=2023~2027, 2026=143000, 2027=157300 (110%씩 성장)',
    keyPoint: '기존에 없는 차원 값(2026, 2027)을 LHS에 지정 → UPSERT로 새 행 자동 삽입.',
  },
  {
    id: 1504, group: 1, groupTitle: 'MODEL 기본 구조',
    question: 'RETURN UPDATED ROWS로 추가된 예측 행만 조회하시오.',
    sql: `CREATE TABLE yr_sales2 AS
SELECT 2023 AS yr, 100000 AS sales FROM DUAL UNION ALL
SELECT 2024, 115000 FROM DUAL UNION ALL
SELECT 2025, 130000 FROM DUAL;

SELECT yr, sales
FROM yr_sales2
MODEL
    RETURN UPDATED ROWS
    DIMENSION BY (yr)
    MEASURES     (sales)
    RULES (
        sales[2026] = sales[2025] * 1.1,
        sales[2027] = sales[2026] * 1.1
    )
ORDER BY yr;

DROP TABLE yr_sales2 PURGE;`,
    result: '2026과 2027 행만 반환 (원본 2023~2025 제외).',
    keyPoint: 'RETURN UPDATED ROWS: 규칙으로 갱신/삽입된 행만 반환. 예측값만 조회할 때 유용.',
  },
  {
    id: 1505, group: 1, groupTitle: 'MODEL 기본 구조',
    question: 'RULES UPDATE 옵션을 사용하여 기존 행만 갱신하시오.',
    sql: `CREATE TABLE product_price AS
SELECT 'A' AS prod, 1000 AS price FROM DUAL UNION ALL
SELECT 'B', 2000 FROM DUAL UNION ALL
SELECT 'C', 3000 FROM DUAL;

SELECT prod, price
FROM product_price
MODEL
    DIMENSION BY (prod)
    MEASURES     (price)
    RULES UPDATE (
        price['A'] = price['A'] * 1.1,   -- 기존 행 갱신
        price['D'] = 5000                  -- D는 원본에 없음 → UPDATE는 무시
    )
ORDER BY prod;

DROP TABLE product_price PURGE;`,
    result: 'A=1100, B=2000, C=3000. D는 원본에 없으므로 RULES UPDATE에 의해 삽입되지 않음.',
    keyPoint: 'RULES UPDATE: 기존에 있는 셀만 갱신. 없는 셀 지정 시 무시. cf) UPSERT는 없으면 삽입.',
  },
  {
    id: 1506, group: 1, groupTitle: 'MODEL 기본 구조',
    question: 'SEQUENTIAL ORDER와 AUTOMATIC ORDER의 차이를 실습하시오.',
    sql: `CREATE TABLE fib_base AS
SELECT 1 AS n, 1 AS val FROM DUAL UNION ALL
SELECT 2, 1 FROM DUAL;

-- SEQUENTIAL ORDER (기본): 순서대로 실행
SELECT n, val FROM fib_base
MODEL
    DIMENSION BY (n)
    MEASURES     (val)
    RULES SEQUENTIAL ORDER (
        val[3] = val[2] + val[1],
        val[4] = val[3] + val[2],
        val[5] = val[4] + val[3]
    )
ORDER BY n;

DROP TABLE fib_base PURGE;`,
    result: 'n=1~5, val=1,1,2,3,5 (피보나치 수열)',
    keyPoint: 'SEQUENTIAL ORDER: 규칙 순서대로 실행. val[3]이 먼저 계산되어 val[4]에서 사용 가능.',
  },

  // ── Group 2: CV()와 FOR 루프 ─────────────────────────────
  {
    id: 1507, group: 2, groupTitle: 'CV()와 FOR 루프',
    question: 'CV()를 사용하여 각 행의 차원 값에 기반한 계산을 수행하시오.',
    sql: `CREATE TABLE monthly_data AS
SELECT 1 AS mth, 50000 AS revenue FROM DUAL UNION ALL
SELECT 2, 55000 FROM DUAL UNION ALL
SELECT 3, 60000 FROM DUAL;

SELECT mth, revenue, prev_revenue
FROM monthly_data
MODEL
    DIMENSION BY (mth)
    MEASURES     (revenue, 0 AS prev_revenue)
    RULES (
        prev_revenue[mth > 1] = revenue[CV(mth) - 1]
    )
ORDER BY mth;

DROP TABLE monthly_data PURGE;`,
    result: 'mth=1: prev=0(초기값), mth=2: prev=50000, mth=3: prev=55000',
    keyPoint: 'CV(mth): 현재 처리 중인 mth 값. CV(mth)-1로 이전 달 참조.',
  },
  {
    id: 1508, group: 2, groupTitle: 'CV()와 FOR 루프',
    question: 'FOR 루프로 2026~2028년 예측값을 생성하시오. (전년도의 8% 성장)',
    sql: `CREATE TABLE annual_rev AS
SELECT 2023 AS yr, 500000 AS rev FROM DUAL UNION ALL
SELECT 2024, 540000 FROM DUAL UNION ALL
SELECT 2025, 583200 FROM DUAL;

SELECT yr, ROUND(rev, 0) AS rev
FROM annual_rev
MODEL
    DIMENSION BY (yr)
    MEASURES     (CAST(rev AS NUMBER) AS rev)
    RULES (
        rev[FOR yr FROM 2026 TO 2028 INCREMENT 1]
            = rev[CV(yr) - 1] * 1.08
    )
ORDER BY yr;

DROP TABLE annual_rev PURGE;`,
    result: '2023~2028년 데이터. 2026=629856, 2027=680244, 2028=734663 (약 8% 증가)',
    keyPoint: 'FOR yr FROM 2026 TO 2028 + CV(yr)-1: 루프를 돌며 전년도 참조. 연쇄 예측.',
  },
  {
    id: 1509, group: 2, groupTitle: 'CV()와 FOR 루프',
    question: 'IS PRESENT 조건으로 셀 존재 여부에 따른 조건부 계산을 수행하시오.',
    sql: `CREATE TABLE sales_data AS
SELECT 'Q1' AS qtr, 30000 AS sales FROM DUAL UNION ALL
SELECT 'Q2', 35000 FROM DUAL UNION ALL
SELECT 'Q3', 32000 FROM DUAL;

SELECT qtr, sales, yoy_growth
FROM sales_data
MODEL
    DIMENSION BY (qtr)
    MEASURES     (sales, 0 AS yoy_growth)
    RULES (
        yoy_growth[qtr IS NOT NULL] =
            CASE WHEN sales[CV(qtr)] IS PRESENT
                 THEN ROUND(sales[CV(qtr)] / 30000 * 100 - 100, 1)
                 ELSE NULL
            END
    )
ORDER BY qtr;

DROP TABLE sales_data PURGE;`,
    result: 'Q1=0%, Q2=16.7%, Q3=6.7% 증가율 (Q1 대비)',
    keyPoint: 'IS PRESENT: 셀이 존재하는지 확인. CASE WHEN과 결합한 조건부 계산.',
  },
  {
    id: 1510, group: 2, groupTitle: 'CV()와 FOR 루프',
    question: 'FOR 루프의 IN 절로 비연속적인 차원 값에 규칙 적용하시오.',
    sql: `CREATE TABLE category_sales AS
SELECT 'A' AS cat, 10000 AS sales FROM DUAL UNION ALL
SELECT 'B', 20000 FROM DUAL UNION ALL
SELECT 'C', 15000 FROM DUAL UNION ALL
SELECT 'D', 25000 FROM DUAL;

SELECT cat, sales, adj_sales
FROM category_sales
MODEL
    DIMENSION BY (cat)
    MEASURES     (sales, sales AS adj_sales)
    RULES (
        adj_sales[FOR cat IN ('A', 'C')] = sales[CV(cat)] * 1.2,
        adj_sales[FOR cat IN ('B', 'D')] = sales[CV(cat)] * 0.9
    )
ORDER BY cat;

DROP TABLE category_sales PURGE;`,
    result: 'A=12000, B=18000, C=18000, D=22500',
    keyPoint: 'FOR cat IN (목록): 명시된 값에만 규칙 적용. 카테고리별 다른 조정률 적용.',
  },
  {
    id: 1511, group: 2, groupTitle: 'CV()와 FOR 루프',
    question: 'IGNORE NAV 옵션으로 존재하지 않는 셀 참조 시 NULL 대신 0을 사용하시오.',
    sql: `CREATE TABLE monthly_sales AS
SELECT 2 AS mth, 40000 AS sales FROM DUAL UNION ALL
SELECT 3, 45000 FROM DUAL UNION ALL
SELECT 4, 50000 FROM DUAL;

-- IGNORE NAV: 존재하지 않는 mth=1을 0으로 처리
SELECT mth, sales, mom_diff
FROM monthly_sales
MODEL IGNORE NAV
    DIMENSION BY (mth)
    MEASURES     (sales, 0 AS mom_diff)
    RULES (
        mom_diff[mth >= 2] = sales[CV(mth)] - sales[CV(mth) - 1]
    )
ORDER BY mth;

DROP TABLE monthly_sales PURGE;`,
    result: 'mth=2: diff=40000(0에서 차이). mth=3: diff=5000. mth=4: diff=5000',
    keyPoint: 'IGNORE NAV: 없는 셀(mth=1)을 숫자 0으로 처리. 전월 대비 증감 계산.',
  },
  {
    id: 1512, group: 2, groupTitle: 'CV()와 FOR 루프',
    question: '집계 범위 참조로 누적 매출을 계산하시오.',
    sql: `CREATE TABLE weekly_sales AS
SELECT 1 AS wk, 10000 AS sales FROM DUAL UNION ALL
SELECT 2, 12000 FROM DUAL UNION ALL
SELECT 3, 11000 FROM DUAL UNION ALL
SELECT 4, 13000 FROM DUAL UNION ALL
SELECT 5, 14000 FROM DUAL;

SELECT wk, sales, cum_sales
FROM weekly_sales
MODEL
    DIMENSION BY (wk)
    MEASURES     (sales, 0 AS cum_sales)
    RULES (
        cum_sales[wk >= 1] =
            SUM(sales)[wk BETWEEN 1 AND CV(wk)]
    )
ORDER BY wk;

DROP TABLE weekly_sales PURGE;`,
    result: '주별 누적 매출: wk1=10000, wk2=22000, wk3=33000, wk4=46000, wk5=60000',
    keyPoint: 'SUM(measures)[dim BETWEEN 시작 AND CV(dim)]: 집계 범위 참조로 누적 합계.',
  },

  // ── Group 3: ITERATE와 반복 계산 ──────────────────────────
  {
    id: 1513, group: 3, groupTitle: 'ITERATE와 반복 계산',
    question: 'ITERATE로 복리 이자 계산을 수행하시오. (원금: 100만원, 연이율 5%, 5년)',
    sql: `SELECT yr, ROUND(balance, 0) AS balance
FROM DUAL
MODEL
    DIMENSION BY (0 AS yr)
    MEASURES     (1000000 AS balance)
    RULES (
        balance[FOR yr FROM 0 TO 5 INCREMENT 1] =
            CASE WHEN CV(yr) = 0 THEN 1000000
                 ELSE balance[CV(yr) - 1] * 1.05
            END
    )
ORDER BY yr;`,
    result: 'yr=0: 1000000, yr=1: 1050000, yr=2: 1102500, yr=3: 1157625, yr=4: 1215506, yr=5: 1276282',
    keyPoint: 'CASE WHEN CV(yr)=0으로 초기값 처리. balance[CV(yr)-1]로 전년도 잔액 참조.',
  },
  {
    id: 1514, group: 3, groupTitle: 'ITERATE와 반복 계산',
    question: 'ITERATE와 ITERATION_NUMBER를 사용하여 10번 반복 계산을 수행하시오.',
    sql: `SELECT n, val
FROM DUAL
MODEL
    DIMENSION BY (1 AS n)
    MEASURES     (1 AS val)
    RULES ITERATE(10) (
        val[ITERATION_NUMBER + 1] = val[ITERATION_NUMBER] + ITERATION_NUMBER * 2 + 1
    )
ORDER BY n;`,
    result: 'n=1~10, 홀수 제곱수 패턴: 1, 4, 9, 16, 25, 36, 49, 64, 81, 100',
    keyPoint: 'ITERATE(10): 0~9 반복. ITERATION_NUMBER를 배열 인덱스와 계산에 활용.',
  },
  {
    id: 1515, group: 3, groupTitle: 'ITERATE와 반복 계산',
    question: 'UNTIL 조건으로 수렴 시 반복을 조기 종료하시오.',
    sql: `SELECT iter_n, approx_val
FROM DUAL
MODEL
    DIMENSION BY (0 AS iter_n)
    MEASURES     (1.0 AS approx_val)
    RULES ITERATE(1000) UNTIL (ABS(approx_val[ITERATION_NUMBER] - 2) < 0.001) (
        approx_val[ITERATION_NUMBER + 1] =
            approx_val[ITERATION_NUMBER] + 0.1
    )
ORDER BY iter_n;`,
    result: '0~11까지 실행 후 approx_val이 2 근처에 도달하여 종료.',
    keyPoint: 'UNTIL(조건): 조건 만족 시 최대 반복 전에 조기 종료. 수렴 계산에 활용.',
  },
  {
    id: 1516, group: 3, groupTitle: 'ITERATE와 반복 계산',
    question: '피보나치 수열 첫 10개 항을 MODEL로 계산하시오.',
    sql: `SELECT n, fib_val
FROM DUAL
MODEL
    DIMENSION BY (0 AS n)
    MEASURES     (0 AS fib_val)
    RULES (
        fib_val[1] = 1,
        fib_val[2] = 1,
        fib_val[FOR n FROM 3 TO 10 INCREMENT 1]
            = fib_val[CV(n) - 1] + fib_val[CV(n) - 2]
    )
ORDER BY n;`,
    result: 'n=1~10: 1,1,2,3,5,8,13,21,34,55',
    keyPoint: '초기값(1,2항) 먼저 설정 후 FOR 루프로 3항부터 점화식 계산. SEQUENTIAL ORDER 활용.',
  },
  {
    id: 1517, group: 3, groupTitle: 'ITERATE와 반복 계산',
    question: '연도별 원금 감소(대출 상환) 시뮬레이션을 MODEL로 구현하시오.',
    sql: `SELECT yr, ROUND(principal, 0) AS principal,
       ROUND(interest, 0) AS interest
FROM DUAL
MODEL
    DIMENSION BY (0 AS yr)
    MEASURES     (5000000 AS principal, 0 AS interest)
    RULES (
        principal[FOR yr FROM 1 TO 5 INCREMENT 1] =
            CASE WHEN CV(yr) = 1 THEN 5000000
                 ELSE principal[CV(yr)-1] * 0.8
            END,
        interest[FOR yr FROM 1 TO 5 INCREMENT 1] =
            principal[CV(yr)] * 0.05
    )
ORDER BY yr;`,
    result: '연도별 원금(80%씩 감소)과 이자(원금의 5%) 계산.',
    keyPoint: '여러 MEASURES(principal, interest) 동시 계산. principal을 계산 후 interest에서 참조.',
  },
  {
    id: 1518, group: 3, groupTitle: 'ITERATE와 반복 계산',
    question: 'employees 데이터로 입사 연도별 누적 인원을 MODEL로 계산하시오.',
    sql: `SELECT yr, cnt, cum_cnt
FROM (
    SELECT EXTRACT(YEAR FROM hire_date) AS yr,
           COUNT(*) AS cnt
    FROM   employees
    GROUP BY EXTRACT(YEAR FROM hire_date)
)
MODEL
    DIMENSION BY (yr)
    MEASURES     (cnt, 0 AS cum_cnt)
    RULES (
        cum_cnt[yr IS NOT NULL] =
            SUM(cnt)[yr BETWEEN 1987 AND CV(yr)]
    )
ORDER BY yr;`,
    result: '연도별 입사 인원(cnt)과 1987년부터의 누적 입사 인원(cum_cnt).',
    keyPoint: '집계 범위 참조로 누적 카운트. SUM(cnt)[yr BETWEEN 시작 AND CV(yr)].',
  },

  // ── Group 4: PARTITION BY 활용 ────────────────────────────
  {
    id: 1519, group: 4, groupTitle: 'PARTITION BY 활용',
    question: '부서별로 독립적인 MODEL을 사용하여 입사 연도별 누적 급여를 계산하시오.',
    sql: `SELECT department_id, yr, total_sal, cum_sal
FROM (
    SELECT department_id,
           EXTRACT(YEAR FROM hire_date) AS yr,
           SUM(salary) AS total_sal
    FROM   employees
    WHERE  department_id IN (20, 50, 80)
    GROUP BY department_id, EXTRACT(YEAR FROM hire_date)
)
MODEL
    PARTITION BY (department_id)
    DIMENSION BY (yr)
    MEASURES     (total_sal, 0 AS cum_sal)
    RULES (
        cum_sal[yr IS NOT NULL] =
            SUM(total_sal)[yr BETWEEN 1987 AND CV(yr)]
    )
ORDER BY department_id, yr;`,
    result: '부서별 연도별 급여 합계와 부서 내 누적 급여.',
    keyPoint: 'PARTITION BY: 각 부서 독립 MODEL. 파티션 내에서만 집계 범위 참조.',
  },
  {
    id: 1520, group: 4, groupTitle: 'PARTITION BY 활용',
    question: '제품 카테고리별 연도별 매출 예측을 PARTITION BY로 구현하시오.',
    sql: `CREATE TABLE cat_yr_sales AS
SELECT 'ELEC' AS cat, 2023 AS yr, 500000 AS sales FROM DUAL UNION ALL
SELECT 'ELEC', 2024, 550000 FROM DUAL UNION ALL
SELECT 'ELEC', 2025, 600000 FROM DUAL UNION ALL
SELECT 'FOOD', 2023, 300000 FROM DUAL UNION ALL
SELECT 'FOOD', 2024, 315000 FROM DUAL UNION ALL
SELECT 'FOOD', 2025, 330000 FROM DUAL;

SELECT cat, yr, ROUND(sales, 0) AS sales
FROM cat_yr_sales
MODEL
    PARTITION BY (cat)
    DIMENSION BY (yr)
    MEASURES     (CAST(sales AS NUMBER) AS sales)
    RULES (
        sales[2026] = sales[2025] * 1.1,
        sales[2027] = sales[2026] * 1.1
    )
ORDER BY cat, yr;

DROP TABLE cat_yr_sales PURGE;`,
    result: '카테고리별 2026~2027 예측값 추가. ELEC과 FOOD 독립 계산.',
    keyPoint: 'PARTITION BY(cat): 카테고리별 독립 MODEL. 각 파티션에서 rules 독립 실행.',
  },
  {
    id: 1521, group: 4, groupTitle: 'PARTITION BY 활용',
    question: 'PARTITION BY와 FOR 루프를 결합하여 지역별 3개년 성장 예측을 수행하시오.',
    sql: `CREATE TABLE region_sales AS
SELECT 'SEOUL' AS region, 2024 AS yr, 1000000 AS sales FROM DUAL UNION ALL
SELECT 'BUSAN', 2024, 600000 FROM DUAL UNION ALL
SELECT 'DAEGU', 2024, 400000 FROM DUAL;

SELECT region, yr, ROUND(sales, 0) AS sales
FROM region_sales
MODEL
    PARTITION BY (region)
    DIMENSION BY (yr)
    MEASURES     (CAST(sales AS NUMBER) AS sales)
    RULES (
        sales[FOR yr FROM 2025 TO 2027 INCREMENT 1]
            = sales[CV(yr) - 1] * 1.07
    )
ORDER BY region, yr;

DROP TABLE region_sales PURGE;`,
    result: '지역별 2024년 기준 2025~2027년 7% 성장 예측값 추가.',
    keyPoint: 'PARTITION BY + FOR 루프: 지역별 독립 성장 예측. CV(yr)-1로 전년도 연쇄 참조.',
  },

  // ── Group 5: 종합 활용 ────────────────────────────────────
  {
    id: 1522, group: 5, groupTitle: '종합 활용',
    question: '부서별 입사 연도별 인원과 누적 인원, 전년 대비 증감을 MODEL로 조회하시오.',
    sql: `SELECT department_id, yr, cnt, cum_cnt, yoy_diff
FROM (
    SELECT department_id,
           EXTRACT(YEAR FROM hire_date) AS yr,
           COUNT(*) AS cnt
    FROM   employees
    WHERE  department_id IN (50, 80)
    GROUP BY department_id, EXTRACT(YEAR FROM hire_date)
)
MODEL
    PARTITION BY (department_id)
    DIMENSION BY (yr)
    MEASURES     (cnt, 0 AS cum_cnt, 0 AS yoy_diff)
    RULES (
        cum_cnt[yr IS NOT NULL] =
            SUM(cnt)[yr BETWEEN 1990 AND CV(yr)],
        yoy_diff[yr > 2000] =
            cnt[CV(yr)] - NVL(cnt[CV(yr) - 1], 0)
    )
ORDER BY department_id, yr;`,
    result: '부서별 연도별 입사수, 누적수, 전년대비 증감 동시 계산.',
    keyPoint: '여러 MEASURES + 여러 RULES 동시 활용. NVL로 전년 데이터 없을 때 0 처리.',
  },
  {
    id: 1523, group: 5, groupTitle: '종합 활용',
    question: '직급별 급여 성장 시뮬레이션을 MODEL로 수행하시오. (매년 직급별 다른 인상률 적용)',
    sql: `CREATE TABLE job_salary AS
SELECT 'IT_PROG' AS job, 2025 AS yr, 60000 AS sal FROM DUAL UNION ALL
SELECT 'SA_REP',  2025, 50000 FROM DUAL UNION ALL
SELECT 'ST_CLERK', 2025, 30000 FROM DUAL;

SELECT job, yr, ROUND(sal, 0) AS sal
FROM job_salary
MODEL
    PARTITION BY (job)
    DIMENSION BY (yr)
    MEASURES     (CAST(sal AS NUMBER) AS sal)
    RULES (
        sal[FOR yr FROM 2026 TO 2028 INCREMENT 1] =
            sal[CV(yr) - 1] *
            CASE job
                WHEN 'IT_PROG'  THEN 1.12
                WHEN 'SA_REP'   THEN 1.08
                WHEN 'ST_CLERK' THEN 1.05
            END
    )
ORDER BY job, yr;

DROP TABLE job_salary PURGE;`,
    result: '직급별 다른 인상률(IT 12%, 영업 8%, 물류 5%)을 적용한 2026~2028 예측.',
    keyPoint: 'PARTITION BY(job) + CASE job으로 파티션별 다른 인상률 적용.',
  },
  {
    id: 1524, group: 5, groupTitle: '종합 활용',
    question: 'MODEL로 팩토리얼(n!)을 계산하시오. (1!~10!)',
    sql: `SELECT n, factorial
FROM DUAL
MODEL
    DIMENSION BY (0 AS n)
    MEASURES     (1 AS factorial)
    RULES (
        factorial[1] = 1,
        factorial[FOR n FROM 2 TO 10 INCREMENT 1]
            = factorial[CV(n) - 1] * CV(n)
    )
ORDER BY n;`,
    result: 'n=1~10: 1,2,6,24,120,720,5040,40320,362880,3628800',
    keyPoint: 'FOR 루프 + CV(n) * 전항 = 팩토리얼. MODEL의 연쇄 계산 능력 활용.',
  },
  {
    id: 1525, group: 5, groupTitle: '종합 활용',
    question: '연간 매출 데이터에 MODEL로 예측값을 추가하고 분석 함수와 결합하시오.',
    sql: `CREATE TABLE annual_sales AS
SELECT 2021 AS yr, 800000 AS sales FROM DUAL UNION ALL
SELECT 2022, 870000 FROM DUAL UNION ALL
SELECT 2023, 940000 FROM DUAL UNION ALL
SELECT 2024, 1020000 FROM DUAL UNION ALL
SELECT 2025, 1100000 FROM DUAL;

SELECT yr, sales,
       LAG(sales) OVER(ORDER BY yr)            AS prev_sales,
       ROUND((sales - LAG(sales) OVER(ORDER BY yr))
             / LAG(sales) OVER(ORDER BY yr) * 100, 1) AS growth_pct
FROM annual_sales
MODEL
    DIMENSION BY (yr)
    MEASURES     (CAST(sales AS NUMBER) AS sales)
    RULES (
        sales[2026] = sales[2025] * 1.08,
        sales[2027] = sales[2026] * 1.08
    )
ORDER BY yr;

DROP TABLE annual_sales PURGE;`,
    result: '2021~2027년 매출. 예측 포함하여 전년 대비 성장률도 분석 함수로 계산.',
    keyPoint: 'MODEL로 예측행 추가 후 분석 함수(LAG) 결합. 예측 포함 전체 데이터 분석.',
  },
  {
    id: 1526, group: 5, groupTitle: '종합 활용',
    question: '부서별 급여 예측과 예산 대비 초과 여부를 MODEL로 분석하시오.',
    sql: `CREATE TABLE dept_budget AS
SELECT 50 AS dept_id, 200000 AS budget FROM DUAL UNION ALL
SELECT 80, 500000 FROM DUAL;

SELECT d.dept_id, d.yr, ROUND(d.proj_sal, 0) AS proj_sal,
       b.budget,
       CASE WHEN ROUND(d.proj_sal, 0) > b.budget
            THEN '초과'
            ELSE '적정'
       END AS status
FROM (
    SELECT department_id AS dept_id,
           EXTRACT(YEAR FROM hire_date) AS yr,
           SUM(salary) AS total_sal
    FROM   employees
    WHERE  department_id IN (50, 80)
    GROUP BY department_id, EXTRACT(YEAR FROM hire_date)
) src,
LATERAL (
    SELECT yr, CAST(total_sal AS NUMBER) AS proj_sal
    FROM   src
    MODEL
        DIMENSION BY (yr)
        MEASURES     (CAST(total_sal AS NUMBER) AS proj_sal)
        RULES RETURN UPDATED ROWS (
            proj_sal[2026] = proj_sal[(SELECT MAX(yr) FROM src)] * 1.05
        )
) d,
dept_budget b
WHERE d.dept_id = b.dept_id(+)
ORDER BY d.dept_id, d.yr;`,
    result: '부서별 2026년 예측 급여 합계와 예산 비교.',
    keyPoint: 'MODEL + LATERAL + 외부 테이블 JOIN 결합 패턴. 예측값의 실무 활용.',
  },
]
