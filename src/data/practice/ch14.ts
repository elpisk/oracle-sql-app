import type { PracticeProblem } from '@/lib/types'

export const ch14Practice: PracticeProblem[] = [
  // ── Group 1: PIVOT 기본 ───────────────────────────────────
  {
    id: 1401, group: 1, groupTitle: 'PIVOT 기본',
    question: '부서별, 직무별 직원 수를 PIVOT으로 교차표 형식으로 조회하시오. (직무: SA_REP, IT_PROG, ST_CLERK)',
    sql: `SELECT *
FROM (
    SELECT department_id, job_id
    FROM   employees
    WHERE  department_id IS NOT NULL
)
PIVOT (
    COUNT(*) FOR job_id IN (
        'SA_REP'   AS 영업직,
        'IT_PROG'  AS IT직,
        'ST_CLERK' AS 물류직
    )
)
ORDER BY department_id;`,
    result: '부서별 행, 직무별 열. 해당 직원 없으면 NULL.',
    keyPoint: 'PIVOT 기본 구조: 서브쿼리 → PIVOT(집계함수 FOR 피벗열 IN (값 목록)). 서브쿼리에 필요한 열만 포함.',
  },
  {
    id: 1402, group: 1, groupTitle: 'PIVOT 기본',
    question: 'PIVOT 결과의 NULL을 0으로 변환하여 출력하시오.',
    sql: `SELECT department_id,
       NVL(영업직, 0) AS 영업직,
       NVL(IT직, 0)  AS IT직,
       NVL(물류직, 0) AS 물류직
FROM (
    SELECT department_id, job_id
    FROM   employees
    WHERE  department_id IS NOT NULL
)
PIVOT (
    COUNT(*) FOR job_id IN (
        'SA_REP'   AS 영업직,
        'IT_PROG'  AS IT직,
        'ST_CLERK' AS 물류직
    )
)
ORDER BY department_id;`,
    result: 'NULL 대신 0 표시. NVL을 PIVOT 외부 SELECT에서 적용.',
    keyPoint: 'PIVOT 결과 NULL 처리: 서브쿼리로 감싸고 NVL 또는 COALESCE 적용.',
  },
  {
    id: 1403, group: 1, groupTitle: 'PIVOT 기본',
    question: '부서별 연도별 입사 인원을 PIVOT으로 조회하시오. (2004~2007년)',
    sql: `SELECT *
FROM (
    SELECT department_id,
           EXTRACT(YEAR FROM hire_date) AS hire_year
    FROM   employees
    WHERE  department_id IS NOT NULL
)
PIVOT (
    COUNT(*) FOR hire_year IN (
        2004 AS "2004년",
        2005 AS "2005년",
        2006 AS "2006년",
        2007 AS "2007년"
    )
)
ORDER BY department_id;`,
    result: '부서별 행, 연도별 열로 입사 인원 표시.',
    keyPoint: '숫자 값도 PIVOT IN 절에 사용 가능. AS로 큰따옴표 열 이름 지정.',
  },
  {
    id: 1404, group: 1, groupTitle: 'PIVOT 기본',
    question: 'PIVOT 없이 CASE WHEN으로 동일한 결과를 구현하시오. (직무별 직원 수 교차표)',
    sql: `SELECT department_id,
       COUNT(CASE WHEN job_id = 'SA_REP'   THEN 1 END) AS 영업직,
       COUNT(CASE WHEN job_id = 'IT_PROG'  THEN 1 END) AS IT직,
       COUNT(CASE WHEN job_id = 'ST_CLERK' THEN 1 END) AS 물류직
FROM   employees
WHERE  department_id IS NOT NULL
GROUP BY department_id
ORDER BY department_id;`,
    result: 'PIVOT과 동일한 결과. CASE WHEN 없는 직무는 NULL(또는 0).',
    keyPoint: 'PIVOT = CASE WHEN + GROUP BY의 간결한 표현. 두 방식은 동등한 결과를 반환.',
  },
  {
    id: 1405, group: 1, groupTitle: 'PIVOT 기본',
    question: '직무별 부서 수와 평균 급여를 PIVOT으로 조회하시오. (부서: 10, 20, 50, 80)',
    sql: `SELECT job_id, "10", "20", "50", "80"
FROM (
    SELECT job_id, department_id, salary
    FROM   employees
    WHERE  department_id IN (10, 20, 50, 80)
)
PIVOT (
    ROUND(AVG(salary), 0) FOR department_id IN (
        10 AS "10", 20 AS "20",
        50 AS "50", 80 AS "80"
    )
)
ORDER BY job_id;`,
    result: '직무별 행, 부서별 평균 급여 열. 해당 직무가 없는 부서-직무 조합은 NULL.',
    keyPoint: '그룹 기준 열(job_id)이 행이 됨. 피벗 열(department_id)이 열이 됨. AVG 집계 적용.',
  },
  {
    id: 1406, group: 1, groupTitle: 'PIVOT 기본',
    question: '관리자(manager_id) 기준으로 직원의 직무별 최고 급여를 PIVOT으로 조회하시오.',
    sql: `SELECT *
FROM (
    SELECT manager_id, job_id, salary
    FROM   employees
    WHERE  manager_id IS NOT NULL
)
PIVOT (
    MAX(salary) FOR job_id IN (
        'SA_REP'   AS 영업최고,
        'IT_PROG'  AS IT최고,
        'ST_CLERK' AS 물류최고
    )
)
ORDER BY manager_id;`,
    result: '관리자별 행, 직무별 최고 급여 열.',
    keyPoint: 'MAX(salary) PIVOT: 각 그룹의 최고 급여를 열로 표시.',
  },

  // ── Group 2: PIVOT 응용 ───────────────────────────────────
  {
    id: 1407, group: 2, groupTitle: 'PIVOT 응용',
    question: '부서별 직무별 직원 수와 평균 급여를 한 번의 PIVOT으로 조회하시오.',
    sql: `SELECT *
FROM (
    SELECT department_id, job_id, salary
    FROM   employees
    WHERE  department_id IN (20, 50, 80)
)
PIVOT (
    COUNT(*)             AS 인원수,
    ROUND(AVG(salary),0) AS 평균급여
    FOR job_id IN (
        'SA_REP'   AS 영업,
        'IT_PROG'  AS IT,
        'ST_CLERK' AS 물류
    )
)
ORDER BY department_id;`,
    result: '열 이름: 영업_인원수, 영업_평균급여, IT_인원수, IT_평균급여, 물류_인원수, 물류_평균급여',
    keyPoint: '다중 집계 함수: 열 이름 = IN별칭_집계별칭 형식.',
  },
  {
    id: 1408, group: 2, groupTitle: 'PIVOT 응용',
    question: '연도별 부서별 입사 인원과 최고 급여를 다중 집계 PIVOT으로 조회하시오.',
    sql: `SELECT *
FROM (
    SELECT EXTRACT(YEAR FROM hire_date) AS yr,
           department_id, salary
    FROM   employees
    WHERE  department_id IS NOT NULL
      AND  EXTRACT(YEAR FROM hire_date) BETWEEN 2005 AND 2007
)
PIVOT (
    COUNT(*)     AS CNT,
    MAX(salary)  AS MAX_SAL
    FOR yr IN (2005 AS Y05, 2006 AS Y06, 2007 AS Y07)
)
ORDER BY department_id;`,
    result: '열 이름: Y05_CNT, Y05_MAX_SAL, Y06_CNT, Y06_MAX_SAL, Y07_CNT, Y07_MAX_SAL',
    keyPoint: '연도를 PIVOT 기준으로 사용. 다중 집계로 인원 수와 최고 급여 동시 표시.',
  },
  {
    id: 1409, group: 2, groupTitle: 'PIVOT 응용',
    question: '임시 테이블을 사용하여 분기별 지역별 매출 피벗을 시연하시오.',
    sql: `-- 시연용 임시 데이터 생성
CREATE TABLE region_sales_tmp AS
SELECT 'Seoul'     AS region, 'Q1' AS quarter, 15000 AS sales FROM DUAL UNION ALL
SELECT 'Seoul',    'Q2', 18000 FROM DUAL UNION ALL
SELECT 'Seoul',    'Q3', 22000 FROM DUAL UNION ALL
SELECT 'Busan',    'Q1', 9000  FROM DUAL UNION ALL
SELECT 'Busan',    'Q2', 11000 FROM DUAL UNION ALL
SELECT 'Daegu',    'Q3', 7000  FROM DUAL;

-- PIVOT 조회
SELECT *
FROM region_sales_tmp
PIVOT (
    SUM(sales) FOR quarter IN (
        'Q1' AS Q1매출, 'Q2' AS Q2매출, 'Q3' AS Q3매출
    )
)
ORDER BY region;

DROP TABLE region_sales_tmp PURGE;`,
    result: '지역별 행, 분기별 매출 열. Daegu의 Q1, Q2는 NULL.',
    keyPoint: '분기(행) → 열 변환. 데이터 없는 교차점 = NULL.',
  },
  {
    id: 1410, group: 2, groupTitle: 'PIVOT 응용',
    question: 'PIVOT 결과에 ORDER BY와 WHERE 필터를 적용하시오.',
    sql: `SELECT *
FROM (
    SELECT department_id, job_id
    FROM   employees
    WHERE  department_id IS NOT NULL
)
PIVOT (
    COUNT(*) FOR job_id IN (
        'SA_REP'   AS 영업직,
        'IT_PROG'  AS IT직,
        'ST_CLERK' AS 물류직
    )
)
WHERE NVL(영업직, 0) > 0   -- 영업직이 있는 부서만
ORDER BY 영업직 DESC;`,
    result: '영업직 직원이 있는 부서만 영업직 수 내림차순으로 출력.',
    keyPoint: 'PIVOT 결과를 서브쿼리 없이 직접 WHERE 적용 가능. 별칭이 열 이름으로 사용.',
  },
  {
    id: 1411, group: 2, groupTitle: 'PIVOT 응용',
    question: '국가별 도시 수를 PIVOT으로 조회하시오. (countries, locations 테이블 활용)',
    sql: `SELECT *
FROM (
    SELECT c.region_id, l.country_id
    FROM   locations l
    JOIN   countries c ON l.country_id = c.country_id
)
PIVOT (
    COUNT(*) FOR country_id IN (
        'US' AS 미국,
        'UK' AS 영국,
        'DE' AS 독일,
        'CA' AS 캐나다
    )
)
ORDER BY region_id;`,
    result: '지역(region_id)별 행, 국가별 도시 수 열.',
    keyPoint: 'JOIN 결과를 서브쿼리로 사용 후 PIVOT. 복잡한 소스에서도 PIVOT 적용 가능.',
  },
  {
    id: 1412, group: 2, groupTitle: 'PIVOT 응용',
    question: '관리자별 부하 직원의 직무별 인원 수를 PIVOT 조회하고 인원 합계를 추가하시오.',
    sql: `SELECT manager_id,
       NVL(영업직, 0) + NVL(IT직, 0) + NVL(물류직, 0) AS 소계,
       NVL(영업직, 0) AS 영업직,
       NVL(IT직, 0)   AS IT직,
       NVL(물류직, 0) AS 물류직
FROM (
    SELECT manager_id, job_id
    FROM   employees
    WHERE  manager_id IS NOT NULL
)
PIVOT (
    COUNT(*) FOR job_id IN (
        'SA_REP'   AS 영업직,
        'IT_PROG'  AS IT직,
        'ST_CLERK' AS 물류직
    )
)
ORDER BY 소계 DESC;`,
    result: '관리자별 부하 직원 직무 분포와 소계 열 추가.',
    keyPoint: 'PIVOT 결과 열들의 산술 연산. NVL로 NULL을 0으로 처리 후 합산.',
  },

  // ── Group 3: UNPIVOT 기본 ─────────────────────────────────
  {
    id: 1413, group: 3, groupTitle: 'UNPIVOT 기본',
    question: '분기별 매출 열(Q1~Q4)을 UNPIVOT으로 행으로 변환하시오.',
    sql: `-- 시연용 피벗 테이블 생성
CREATE TABLE quarterly_sales AS
SELECT 1001 AS prod_id, 50000 AS q1_sales, 60000 AS q2_sales,
       NULL AS q3_sales, 75000 AS q4_sales FROM DUAL UNION ALL
SELECT 1002, 30000, 35000, 40000, NULL FROM DUAL;

-- UNPIVOT (기본: EXCLUDE NULLS)
SELECT prod_id, quarter, sales
FROM quarterly_sales
UNPIVOT (
    sales FOR quarter IN (
        q1_sales AS 'Q1', q2_sales AS 'Q2',
        q3_sales AS 'Q3', q4_sales AS 'Q4'
    )
);

DROP TABLE quarterly_sales PURGE;`,
    result: '각 제품 × 분기 행으로 변환. NULL인 q3(1001), q4(1002) 행은 제외.',
    keyPoint: 'UNPIVOT: 열→행 변환. 기본 EXCLUDE NULLS으로 NULL 행 제외.',
  },
  {
    id: 1414, group: 3, groupTitle: 'UNPIVOT 기본',
    question: 'INCLUDE NULLS와 EXCLUDE NULLS의 차이를 비교하시오.',
    sql: `CREATE TABLE qsales AS
SELECT 101 AS pid, 1000 AS q1, NULL AS q2, 3000 AS q3 FROM DUAL UNION ALL
SELECT 102, NULL, 2000, NULL FROM DUAL;

-- EXCLUDE NULLS (기본)
SELECT pid, qtr, amt FROM qsales
UNPIVOT EXCLUDE NULLS (amt FOR qtr IN (q1 AS 'Q1', q2 AS 'Q2', q3 AS 'Q3'));

-- INCLUDE NULLS
SELECT pid, qtr, amt FROM qsales
UNPIVOT INCLUDE NULLS (amt FOR qtr IN (q1 AS 'Q1', q2 AS 'Q2', q3 AS 'Q3'));

DROP TABLE qsales PURGE;`,
    result: 'EXCLUDE: 4행(NULL 제외). INCLUDE: 6행(모든 조합 포함, NULL 값 그대로).',
    keyPoint: 'EXCLUDE NULLS(기본): NULL 값 행 제외. INCLUDE NULLS: NULL도 포함.',
  },
  {
    id: 1415, group: 3, groupTitle: 'UNPIVOT 기본',
    question: 'employees 테이블의 employee_id를 행 기반(세로) 형식으로 UNPIVOT 패턴을 적용하시오.',
    sql: `-- 직원 정보를 세로 형식으로 출력 (UNPIVOT 패턴)
SELECT employee_id,
       attribute, value
FROM (
    SELECT employee_id,
           TO_CHAR(salary)    AS salary_str,
           TO_CHAR(hire_date, 'YYYY-MM-DD') AS hiredate_str,
           job_id
    FROM   employees
    WHERE  employee_id IN (100, 101, 102)
)
UNPIVOT (
    value FOR attribute IN (
        salary_str   AS 'SALARY',
        hiredate_str AS 'HIRE_DATE',
        job_id       AS 'JOB_ID'
    )
)
ORDER BY employee_id, attribute;`,
    result: '각 직원의 급여, 입사일, 직무가 attribute-value 쌍의 행으로 변환.',
    keyPoint: 'UNPIVOT의 모든 열은 동일 타입이어야 함. TO_CHAR로 타입 통일 후 UNPIVOT.',
  },
  {
    id: 1416, group: 3, groupTitle: 'UNPIVOT 기본',
    question: '다중 열 쌍 UNPIVOT으로 분기별 수량과 가격을 동시에 행으로 변환하시오.',
    sql: `CREATE TABLE prod_quarterly AS
SELECT 'P001' AS prod, 100 AS q1_qty, 500 AS q1_price,
                       120 AS q2_qty, 520 AS q2_price FROM DUAL UNION ALL
SELECT 'P002', 200, 450, 180, 430 FROM DUAL;

SELECT prod, quarter, qty, price
FROM prod_quarterly
UNPIVOT (
    (qty, price) FOR quarter IN (
        (q1_qty, q1_price) AS 'Q1',
        (q2_qty, q2_price) AS 'Q2'
    )
)
ORDER BY prod, quarter;

DROP TABLE prod_quarterly PURGE;`,
    result: '각 제품 × 분기별로 qty와 price가 함께 행으로 변환.',
    keyPoint: '다중 열 쌍 UNPIVOT: (값열1, 값열2) FOR 레이블열 IN ((열1a, 열1b) AS 별칭).',
  },
  {
    id: 1417, group: 3, groupTitle: 'UNPIVOT 기본',
    question: 'UNPIVOT 결과를 다시 PIVOT하여 원본 형태로 복원하시오.',
    sql: `CREATE TABLE src_data AS
SELECT 'A' AS category, 100 AS v1, 200 AS v2, 300 AS v3 FROM DUAL UNION ALL
SELECT 'B', 400, 500, 600 FROM DUAL;

-- UNPIVOT
SELECT category, col_name, val
FROM src_data
UNPIVOT (val FOR col_name IN (v1 AS 'V1', v2 AS 'V2', v3 AS 'V3'));

-- PIVOT으로 복원
SELECT *
FROM (
    SELECT category, col_name, val
    FROM src_data
    UNPIVOT (val FOR col_name IN (v1 AS 'V1', v2 AS 'V2', v3 AS 'V3'))
)
PIVOT (MAX(val) FOR col_name IN ('V1' AS V1, 'V2' AS V2, 'V3' AS V3))
ORDER BY category;

DROP TABLE src_data PURGE;`,
    result: 'UNPIVOT 후 PIVOT 복원. NULL 없으면 원본과 동일.',
    keyPoint: 'PIVOT → UNPIVOT → PIVOT 왕복 가능. NULL 없으면 원본 데이터 복원.',
  },
  {
    id: 1418, group: 3, groupTitle: 'UNPIVOT 기본',
    question: 'UNPIVOT 후 특정 분기만 필터링하여 조회하시오.',
    sql: `CREATE TABLE sales_wide AS
SELECT 'S01' AS store, 1000 AS q1, 1200 AS q2, 900 AS q3, 1100 AS q4 FROM DUAL UNION ALL
SELECT 'S02', 800, NULL, 1500, 1300 FROM DUAL;

SELECT store, quarter, sales
FROM (
    SELECT store, quarter, sales
    FROM   sales_wide
    UNPIVOT INCLUDE NULLS (
        sales FOR quarter IN (q1 AS 'Q1', q2 AS 'Q2', q3 AS 'Q3', q4 AS 'Q4')
    )
)
WHERE quarter IN ('Q1', 'Q3')   -- Q1, Q3만 조회
ORDER BY store, quarter;

DROP TABLE sales_wide PURGE;`,
    result: 'INCLUDE NULLS로 S02의 Q1(NULL)도 포함. Q1과 Q3 행만 필터링.',
    keyPoint: 'UNPIVOT 후 WHERE로 원하는 행 필터링. INCLUDE NULLS 사용 시 NULL도 포함.',
  },

  // ── Group 4: 종합 활용 ────────────────────────────────────
  {
    id: 1419, group: 4, groupTitle: '종합 활용',
    question: '부서별 직무별 인원 수 피벗에서 직무가 없는 부서도 표시하고 합계 행을 추가하시오.',
    sql: `-- 부서별 직무 피벗 (NULL → 0)
SELECT department_id,
       NVL(영업직,0) AS 영업직, NVL(IT직,0) AS IT직, NVL(물류직,0) AS 물류직
FROM (
    SELECT department_id, job_id
    FROM   employees WHERE department_id IS NOT NULL
)
PIVOT (COUNT(*) FOR job_id IN (
    'SA_REP' AS 영업직, 'IT_PROG' AS IT직, 'ST_CLERK' AS 물류직))
UNION ALL
-- 전체 합계 행 추가
SELECT NULL AS department_id,
       COUNT(CASE WHEN job_id='SA_REP'   THEN 1 END),
       COUNT(CASE WHEN job_id='IT_PROG'  THEN 1 END),
       COUNT(CASE WHEN job_id='ST_CLERK' THEN 1 END)
FROM   employees WHERE department_id IS NOT NULL
ORDER BY department_id NULLS LAST;`,
    result: '부서별 피벗 행 + 전체 합계 행(department_id=NULL).',
    keyPoint: 'PIVOT + UNION ALL로 합계 행 추가. NULLS LAST로 합계 행을 마지막에.',
  },
  {
    id: 1420, group: 4, groupTitle: '종합 활용',
    question: '연도별 부서별 입사 인원 피벗을 수행하고, 입사가 없는 부서-연도 조합은 0으로 표시하시오.',
    sql: `SELECT department_id,
       NVL("2004년", 0) AS "2004년",
       NVL("2005년", 0) AS "2005년",
       NVL("2006년", 0) AS "2006년",
       NVL("2007년", 0) AS "2007년"
FROM (
    SELECT department_id,
           EXTRACT(YEAR FROM hire_date) AS yr
    FROM   employees
    WHERE  department_id IS NOT NULL
      AND  EXTRACT(YEAR FROM hire_date) BETWEEN 2004 AND 2007
)
PIVOT (
    COUNT(*) FOR yr IN (
        2004 AS "2004년", 2005 AS "2005년",
        2006 AS "2006년", 2007 AS "2007년"
    )
)
ORDER BY department_id;`,
    result: 'NULL 없이 0으로 표시된 부서-연도 교차표.',
    keyPoint: 'PIVOT 외부 SELECT에서 NVL로 NULL→0 변환. 열 이름이 한글/특수문자면 큰따옴표.',
  },
  {
    id: 1421, group: 4, groupTitle: '종합 활용',
    question: '직원 정보를 세로(행) 형식으로 UNPIVOT하고 특정 속성만 필터링하시오.',
    sql: `SELECT employee_id, last_name, attribute, value
FROM (
    SELECT employee_id, last_name,
           TO_CHAR(salary)               AS salary_v,
           department_id || ''           AS dept_v,
           TO_CHAR(hire_date, 'YYYY-MM') AS hire_v
    FROM   employees
    WHERE  employee_id BETWEEN 100 AND 105
)
UNPIVOT (
    value FOR attribute IN (
        salary_v AS 'SALARY',
        dept_v   AS 'DEPT_ID',
        hire_v   AS 'HIRE_YM'
    )
)
WHERE attribute = 'SALARY'
ORDER BY employee_id;`,
    result: '직원별 급여 속성 행만 출력 (6행).',
    keyPoint: 'UNPIVOT 후 WHERE로 특정 속성 필터링. TO_CHAR로 숫자/날짜를 문자로 통일.',
  },
  {
    id: 1422, group: 4, groupTitle: '종합 활용',
    question: 'PIVOT 결과를 다시 UNPIVOT하여 분기가 없는(NULL) 행만 찾으시오.',
    sql: `CREATE TABLE store_q AS
SELECT 'S01' AS sid, 1200 AS q1, NULL AS q2, 900 AS q3 FROM DUAL UNION ALL
SELECT 'S02', 800, 1100, NULL FROM DUAL UNION ALL
SELECT 'S03', NULL, NULL, 700 FROM DUAL;

-- INCLUDE NULLS로 NULL 포함 조회
SELECT sid, quarter, sales
FROM store_q
UNPIVOT INCLUDE NULLS (
    sales FOR quarter IN (q1 AS 'Q1', q2 AS 'Q2', q3 AS 'Q3')
)
WHERE sales IS NULL   -- 매출 없는(NULL) 분기-매장 조합만 조회
ORDER BY sid, quarter;

DROP TABLE store_q PURGE;`,
    result: 'S01 Q2, S02 Q3, S03 Q1, S03 Q2 — 매출 데이터가 없는 조합만 출력.',
    keyPoint: 'INCLUDE NULLS + WHERE IS NULL: 데이터가 없는 조합 파악에 유용.',
  },
  {
    id: 1423, group: 4, groupTitle: '종합 활용',
    question: 'PIVOT 결과를 분석 함수(RANK)와 결합하여 부서별 직무 순위를 구하시오.',
    sql: `SELECT department_id, 영업직, IT직, 물류직,
       RANK() OVER(ORDER BY NVL(영업직,0) DESC) AS 영업_순위
FROM (
    SELECT department_id, job_id
    FROM   employees WHERE department_id IS NOT NULL
)
PIVOT (COUNT(*) FOR job_id IN (
    'SA_REP'   AS 영업직,
    'IT_PROG'  AS IT직,
    'ST_CLERK' AS 물류직
))
ORDER BY 영업_순위, department_id;`,
    result: '부서별 영업직 인원 수 기준 순위 출력.',
    keyPoint: 'PIVOT 결과에 분석 함수 적용. PIVOT을 서브쿼리로 감싸지 않고 직접 적용 가능.',
  },
  {
    id: 1424, group: 4, groupTitle: '종합 활용',
    question: '동일한 결과를 PIVOT과 CASE WHEN 두 가지 방식으로 구현하고 비교하시오.',
    sql: `-- 방법 1: PIVOT 사용
SELECT *
FROM (SELECT department_id, job_id, salary FROM employees WHERE department_id IN (20,50,80))
PIVOT (ROUND(AVG(salary),0) FOR job_id IN (
    'SA_REP' AS 영업, 'ST_CLERK' AS 물류));

-- 방법 2: CASE WHEN 사용
SELECT department_id,
       ROUND(AVG(CASE WHEN job_id='SA_REP'   THEN salary END), 0) AS 영업,
       ROUND(AVG(CASE WHEN job_id='ST_CLERK' THEN salary END), 0) AS 물류
FROM   employees
WHERE  department_id IN (20, 50, 80)
GROUP BY department_id
ORDER BY department_id;`,
    result: '두 방식 모두 동일한 결과 반환.',
    keyPoint: 'PIVOT = CASE WHEN + GROUP BY의 문법적 동등. PIVOT이 더 간결.',
  },
  {
    id: 1425, group: 4, groupTitle: '종합 활용',
    question: '월별 직무별 입사 인원을 UNPIVOT으로 세로 형식으로 변환하시오.',
    sql: `-- 먼저 PIVOT으로 월별 직무 피벗 생성
CREATE TABLE monthly_hire AS
SELECT *
FROM (
    SELECT TO_CHAR(hire_date,'MM') AS hire_month, job_id
    FROM   employees
    WHERE  EXTRACT(YEAR FROM hire_date) = 2006
)
PIVOT (COUNT(*) FOR job_id IN (
    'SA_REP' AS sa_rep, 'IT_PROG' AS it_prog, 'ST_CLERK' AS st_clerk));

-- UNPIVOT으로 다시 세로 변환
SELECT hire_month, job_id, hire_cnt
FROM monthly_hire
UNPIVOT EXCLUDE NULLS (
    hire_cnt FOR job_id IN (
        sa_rep   AS 'SA_REP',
        it_prog  AS 'IT_PROG',
        st_clerk AS 'ST_CLERK'
    )
)
ORDER BY hire_month, job_id;

DROP TABLE monthly_hire PURGE;`,
    result: '월별 직무별 입사 인원(0 제외)을 세로 형식으로 출력.',
    keyPoint: 'PIVOT 결과 테이블을 UNPIVOT으로 재변환. NULL(입사 없음)은 EXCLUDE로 자동 제외.',
  },
  {
    id: 1426, group: 4, groupTitle: '종합 활용',
    question: '국가별 위치 수를 PIVOT으로 집계하고 합계와 비율을 계산하시오.',
    sql: `SELECT region_id,
       NVL(미국, 0) AS 미국,
       NVL(영국, 0) AS 영국,
       NVL(독일, 0) AS 독일,
       NVL(미국,0) + NVL(영국,0) + NVL(독일,0) AS 소계,
       ROUND((NVL(미국,0) + NVL(영국,0) + NVL(독일,0)) /
             SUM(NVL(미국,0) + NVL(영국,0) + NVL(독일,0)) OVER() * 100, 1) AS pct
FROM (
    SELECT c.region_id, l.country_id
    FROM   locations l JOIN countries c ON l.country_id = c.country_id
)
PIVOT (COUNT(*) FOR country_id IN (
    'US' AS 미국, 'UK' AS 영국, 'DE' AS 독일))
ORDER BY region_id;`,
    result: '지역별 국가별 위치 수와 소계, 전체 대비 비율(%) 출력.',
    keyPoint: 'PIVOT + 산술 연산 + 분석 함수(SUM OVER) 조합. 피벗 결과를 다양하게 가공.',
  },
]
