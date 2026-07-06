import type { PracticeProblem } from '@/lib/types'

export const ch04Practice: PracticeProblem[] = [

  // ─────────────────────────────────────────────────────────
  // Group 1: 기본 집계 함수
  // ─────────────────────────────────────────────────────────
  {
    id: 401, group: 1, groupTitle: '기본 집계 함수',
    question: 'EMPLOYEES 테이블에서 전체 직원 수, 최고 급여, 최저 급여, 평균 급여(소수 둘째 자리 반올림), 급여 합계를 조회하시오.',
    keyPoint: 'GROUP BY 없이 집계 함수만 사용하면 전체 테이블이 하나의 그룹으로 처리됩니다.',
    sql: `SELECT COUNT(*)                    AS 직원수,
       MAX(salary)                   AS 최고급여,
       MIN(salary)                   AS 최저급여,
       ROUND(AVG(salary), 2)         AS 평균급여,
       SUM(salary)                   AS 급여합계
FROM   employees;`,
    result:
`직원수  최고급여  최저급여  평균급여   급여합계
------  --------  --------  ---------  --------
107     24000     2100      6461.83    691416`,
  },
  {
    id: 402, group: 1, groupTitle: '기본 집계 함수',
    question: 'EMPLOYEES 테이블에서 전체 행 수(COUNT(*))와 커미션이 있는 직원 수(COUNT(commission_pct))를 함께 조회하시오.',
    keyPoint: 'COUNT(*)는 NULL 포함 전체 행, COUNT(column)은 NULL이 아닌 행만 카운트합니다.',
    sql: `SELECT COUNT(*)            AS 전체직원수,
       COUNT(commission_pct)  AS 커미션있는직원수
FROM   employees;`,
    result:
`전체직원수  커미션있는직원수
----------  ----------------
107         35`,
  },
  {
    id: 403, group: 1, groupTitle: '기본 집계 함수',
    question: "EMPLOYEES 테이블에서 가장 오래된 입사일(MIN)과 가장 최근 입사일(MAX)을 'YYYY-MM-DD' 형식으로 조회하시오.",
    keyPoint: 'MIN/MAX는 DATE 타입에도 사용할 수 있습니다. TO_CHAR로 형식을 지정합니다.',
    sql: `SELECT TO_CHAR(MIN(hire_date), 'YYYY-MM-DD') AS 최초입사일,
       TO_CHAR(MAX(hire_date), 'YYYY-MM-DD') AS 최근입사일
FROM   employees;`,
    result:
`최초입사일   최근입사일
-----------  -----------
1987-06-17   2000-04-21`,
  },
  {
    id: 404, group: 1, groupTitle: '기본 집계 함수',
    question: 'EMPLOYEES 테이블에서 현재 존재하는 고유한(중복 제거) job_id의 수를 조회하시오.',
    keyPoint: 'COUNT(DISTINCT column)으로 중복을 제거한 고유 값의 수를 카운트합니다.',
    sql: `SELECT COUNT(DISTINCT job_id) AS 고유직무수
FROM   employees;`,
    result:
`고유직무수
----------
19`,
  },
  {
    id: 405, group: 1, groupTitle: '기본 집계 함수',
    question: 'AVG(commission_pct)와 AVG(NVL(commission_pct, 0))을 함께 조회하여 NULL 처리 방식의 차이를 확인하시오. 소수 넷째 자리까지 반올림하시오.',
    keyPoint: 'AVG(col): NULL 제외 35명 기준, AVG(NVL(col,0)): 0 포함 107명 기준 — 분모가 달라 결과가 다릅니다.',
    sql: `SELECT ROUND(AVG(commission_pct),       4) AS NULL_제외_평균,
       ROUND(AVG(NVL(commission_pct, 0)), 4) AS NULL_0포함_평균
FROM   employees;`,
    result:
`NULL_제외_평균  NULL_0포함_평균
--------------  ---------------
0.2229          0.0728`,
  },

  // ─────────────────────────────────────────────────────────
  // Group 2: GROUP BY
  // ─────────────────────────────────────────────────────────
  {
    id: 406, group: 2, groupTitle: 'GROUP BY',
    question: '부서 ID별로 직원 수와 평균 급여(소수 둘째 자리 반올림)를 조회하시오. 부서 ID 오름차순으로 정렬하시오. (NULL 부서 포함)',
    keyPoint: 'GROUP BY에서 NULL 값도 하나의 그룹으로 처리됩니다.',
    sql: `SELECT department_id,
       COUNT(*)             AS 직원수,
       ROUND(AVG(salary),2) AS 평균급여
FROM   employees
GROUP BY department_id
ORDER BY department_id;`,
    result:
`DEPARTMENT_ID  직원수  평균급여
-------------  ------  --------
(NULL)         1       7000.00
10             1       4400.00
20             2       9500.00
...
110            2       8300.00
(12행 반환)`,
  },
  {
    id: 407, group: 2, groupTitle: 'GROUP BY',
    question: '직무 ID(job_id)별로 급여 최솟값과 최댓값을 조회하시오. 최댓값 기준 내림차순으로 정렬하시오.',
    keyPoint: 'GROUP BY + ORDER BY MAX(salary) DESC — ORDER BY에서 집계 함수 직접 사용 가능합니다.',
    sql: `SELECT job_id,
       MIN(salary) AS 최저급여,
       MAX(salary) AS 최고급여
FROM   employees
GROUP BY job_id
ORDER BY MAX(salary) DESC;`,
    result:
`JOB_ID      최저급여  최고급여
----------  --------  --------
AD_PRES     24000     24000
AD_VP       17000     17000
SA_MAN      10000     14000
...
(19행 반환)`,
  },
  {
    id: 408, group: 2, groupTitle: 'GROUP BY',
    question: '부서 ID와 직무 ID의 조합별로 직원 수를 조회하시오. 부서 ID, 직무 ID 오름차순 정렬하시오.',
    keyPoint: 'SELECT에 비집계 컬럼이 2개 있으면 GROUP BY에도 2개 모두 포함해야 합니다. (ORA-00979 방지)',
    sql: `SELECT department_id,
       job_id,
       COUNT(*) AS 직원수
FROM   employees
GROUP BY department_id, job_id
ORDER BY department_id, job_id;`,
    result:
`DEPARTMENT_ID  JOB_ID      직원수
-------------  ----------  ------
(NULL)         SA_REP      1
10             AD_ASST     1
20             MK_MAN      1
20             MK_REP      1
...
(20행 반환)`,
  },
  {
    id: 409, group: 2, groupTitle: 'GROUP BY',
    question: "입사 연도(TO_CHAR(hire_date, 'YYYY'))별로 입사자 수를 조회하시오. 연도 오름차순으로 정렬하시오.",
    keyPoint: "GROUP BY에 표현식 TO_CHAR(hire_date, 'YYYY')를 직접 사용할 수 있습니다.",
    sql: `SELECT TO_CHAR(hire_date, 'YYYY') AS 입사연도,
       COUNT(*)                    AS 입사자수
FROM   employees
GROUP BY TO_CHAR(hire_date, 'YYYY')
ORDER BY TO_CHAR(hire_date, 'YYYY');`,
    result:
`입사연도  입사자수
--------  --------
1987      2
1989      4
1990      1
...
2000      9
(13행 반환)`,
  },
  {
    id: 410, group: 2, groupTitle: 'GROUP BY',
    question: '관리자 ID(manager_id)별로 직속 부하 직원 수를 조회하시오. manager_id가 NULL인 행은 제외하고, 부하 수 내림차순으로 정렬하시오.',
    keyPoint: 'GROUP BY 전에 WHERE로 NULL을 제외하면 GROUP BY 처리 대상이 줄어 효율적입니다.',
    sql: `SELECT manager_id,
       COUNT(*) AS 직속부하수
FROM   employees
WHERE  manager_id IS NOT NULL
GROUP BY manager_id
ORDER BY COUNT(*) DESC;`,
    result:
`MANAGER_ID  직속부하수
----------  ----------
100         14
101         5
102         1
...
(18행 반환)`,
  },

  // ─────────────────────────────────────────────────────────
  // Group 3: HAVING
  // ─────────────────────────────────────────────────────────
  {
    id: 411, group: 3, groupTitle: 'HAVING',
    question: '직원이 3명 이상인 부서의 부서 ID와 직원 수를 조회하시오. 직원 수 내림차순 정렬하시오.',
    keyPoint: 'HAVING COUNT(*) >= 3 — 집계 결과로 그룹을 필터링합니다.',
    sql: `SELECT department_id,
       COUNT(*) AS 직원수
FROM   employees
GROUP BY department_id
HAVING COUNT(*) >= 3
ORDER BY COUNT(*) DESC;`,
    result:
`DEPARTMENT_ID  직원수
-------------  ------
80             34
50             45
(조건 만족 부서 목록)`,
  },
  {
    id: 412, group: 3, groupTitle: 'HAVING',
    question: '부서별 평균 급여가 8000 이상인 부서의 부서 ID와 평균 급여를 조회하시오. 평균 급여 내림차순 정렬하시오.',
    keyPoint: 'HAVING AVG(salary) >= 8000 — GROUP BY 이후 집계 결과를 필터링합니다.',
    sql: `SELECT department_id,
       ROUND(AVG(salary), 2) AS 평균급여
FROM   employees
GROUP BY department_id
HAVING AVG(salary) >= 8000
ORDER BY AVG(salary) DESC;`,
    result:
`DEPARTMENT_ID  평균급여
-------------  --------
90             19333.33
20             9500.00
110            8300.00`,
  },
  {
    id: 413, group: 3, groupTitle: 'HAVING',
    question: 'commission_pct가 NOT NULL인 직원만 대상으로 부서별 평균 커미션을 계산하여, 평균 커미션이 0.2 이상인 부서를 조회하시오.',
    keyPoint: 'WHERE로 행 필터(집계 전) → GROUP BY → HAVING으로 그룹 필터(집계 후) — 두 절의 역할이 다릅니다.',
    sql: `SELECT department_id,
       ROUND(AVG(commission_pct), 4) AS 평균커미션
FROM   employees
WHERE  commission_pct IS NOT NULL
GROUP BY department_id
HAVING AVG(commission_pct) >= 0.2
ORDER BY department_id;`,
    result:
`DEPARTMENT_ID  평균커미션
-------------  ----------
(조건 만족 부서 목록)`,
  },
  {
    id: 414, group: 3, groupTitle: 'HAVING',
    question: '부서별 급여 합계가 50000 이상인 부서의 부서 ID, 직원 수, 급여 합계를 조회하시오. 급여 합계 내림차순 정렬하시오.',
    keyPoint: 'HAVING SUM(salary) >= 50000 — 집계 함수(SUM)를 HAVING에서 조건으로 사용합니다.',
    sql: `SELECT department_id,
       COUNT(*)    AS 직원수,
       SUM(salary) AS 급여합계
FROM   employees
GROUP BY department_id
HAVING SUM(salary) >= 50000
ORDER BY SUM(salary) DESC;`,
    result:
`DEPARTMENT_ID  직원수  급여합계
-------------  ------  --------
80             34      304500
50             45      156400
...`,
  },

  // ─────────────────────────────────────────────────────────
  // Group 4: NULL과 그룹 함수
  // ─────────────────────────────────────────────────────────
  {
    id: 415, group: 4, groupTitle: 'NULL과 그룹 함수',
    question: "부서 ID가 NULL인 직원을 포함하여 부서별 직원 수를 조회하시오. NULL 부서는 '미배정'으로 표시하시오.",
    keyPoint: "NVL(TO_CHAR(department_id), '미배정')으로 NULL을 문자열로 변환합니다.",
    sql: `SELECT NVL(TO_CHAR(department_id), '미배정') AS 부서,
       COUNT(*) AS 직원수
FROM   employees
GROUP BY department_id
ORDER BY department_id;`,
    result:
`부서    직원수
------  ------
미배정  1
10      1
20      2
...
(12행 반환)`,
  },
  {
    id: 416, group: 4, groupTitle: 'NULL과 그룹 함수',
    question: '부서별로 커미션 합계를 계산하시오. 커미션 직원이 없는 부서는 0으로 표시하시오. 부서 ID 오름차순 정렬하시오.',
    keyPoint: 'NVL(SUM(col), 0): SUM은 NULL 행 무시 후 결과를 반환하는데, 해당 그룹에 값이 전혀 없으면 NULL을 반환합니다.',
    sql: `SELECT department_id,
       NVL(SUM(commission_pct), 0) AS 커미션합계
FROM   employees
GROUP BY department_id
ORDER BY department_id;`,
    result:
`DEPARTMENT_ID  커미션합계
-------------  ----------
(NULL)         .25
10             0
20             0
...`,
  },
  {
    id: 417, group: 4, groupTitle: 'NULL과 그룹 함수',
    question: '부서별로 전체 직원 수(COUNT(*))와 커미션이 있는 직원 수(COUNT(commission_pct))를 함께 조회하시오. 부서 ID 오름차순 정렬하시오.',
    keyPoint: 'COUNT(*)와 COUNT(column)을 동시에 사용하여 NULL 포함/제외 차이를 비교합니다.',
    sql: `SELECT department_id,
       COUNT(*)              AS 전체직원수,
       COUNT(commission_pct) AS 커미션보유직원수
FROM   employees
GROUP BY department_id
ORDER BY department_id;`,
    result:
`DEPARTMENT_ID  전체직원수  커미션보유직원수
-------------  ----------  ----------------
(NULL)         1           1
10             1           0
20             2           0
80             34          34
...`,
  },

  // ─────────────────────────────────────────────────────────
  // Group 5: ROLLUP · CUBE · LISTAGG
  // ─────────────────────────────────────────────────────────
  {
    id: 418, group: 5, groupTitle: 'ROLLUP · CUBE · LISTAGG',
    question: "부서 ID별 급여 합계를 조회하되, 전체 합계 행도 함께 출력하시오. ROLLUP을 사용하며 총계 행의 부서는 '전체합계'로 표시하시오.",
    keyPoint: 'GROUP BY ROLLUP(col)은 col별 집계 + 전체 합계를 생성합니다. GROUPING() 함수로 소계 행을 식별합니다.',
    sql: `SELECT CASE WHEN GROUPING(department_id) = 1
            THEN '전체합계'
            ELSE NVL(TO_CHAR(department_id), '미배정')
       END AS 부서,
       SUM(salary) AS 급여합계
FROM   employees
GROUP BY ROLLUP(department_id)
ORDER BY GROUPING(department_id), department_id;`,
    result:
`부서    급여합계
------  --------
미배정  7000
10      4400
20      19000
...
전체합계 691416
(13행 반환)`,
  },
  {
    id: 419, group: 5, groupTitle: 'ROLLUP · CUBE · LISTAGG',
    question: '부서 ID와 직무 ID별 급여 합계를 ROLLUP으로 조회하시오. 부서별 소계와 전체 합계가 포함되어야 합니다.',
    keyPoint: 'ROLLUP(a, b)는 (a,b) 상세 + (a) 소계 + () 총계를 생성합니다.',
    sql: `SELECT department_id,
       job_id,
       SUM(salary) AS 급여합계
FROM   employees
GROUP BY ROLLUP(department_id, job_id)
ORDER BY department_id, job_id;`,
    result:
`DEPARTMENT_ID  JOB_ID    급여합계
-------------  --------  --------
(NULL)         SA_REP    7000
(NULL)         (NULL)    7000   ← 부서 소계
10             AD_ASST   4400
10             (NULL)    4400   ← 부서 소계
...
(NULL)         (NULL)    691416 ← 전체 합계
(33행 반환)`,
  },
  {
    id: 420, group: 5, groupTitle: 'ROLLUP · CUBE · LISTAGG',
    question: '부서 ID가 50번, 60번, 90번인 부서의 직원 이름(last_name)을 알파벳 순으로 콤마로 연결하여 조회하시오.',
    keyPoint: "LISTAGG(col, delim) WITHIN GROUP (ORDER BY col)는 Oracle 전용 문자열 집계 함수입니다. MySQL의 GROUP_CONCAT()에 해당합니다.",
    sql: `SELECT department_id,
       LISTAGG(last_name, ', ')
         WITHIN GROUP (ORDER BY last_name) AS 직원목록
FROM   employees
WHERE  department_id IN (50, 60, 90)
GROUP BY department_id
ORDER BY department_id;`,
    result:
`DEPARTMENT_ID  직원목록
-------------  -----------------------------------------------
50             Atkinson, Bell, Bissot, ...
60             Austin, Ernst, Hunold, Lorentz, Pataballa
90             De Haan, King, Kochhar`,
  },
  {
    id: 421, group: 5, groupTitle: 'ROLLUP · CUBE · LISTAGG',
    question: "부서별 급여 합계를 ROLLUP으로 조회하되, GROUPING(department_id) 값도 함께 표시하여 소계 행을 명시적으로 식별하시오.",
    keyPoint: 'GROUPING(col): ROLLUP/CUBE 소계 행이면 1, 일반 행이면 0을 반환하여 소계 NULL과 실제 NULL을 구분합니다.',
    sql: `SELECT department_id,
       GROUPING(department_id) AS is_subtotal,
       SUM(salary)             AS 급여합계
FROM   employees
GROUP BY ROLLUP(department_id)
ORDER BY GROUPING(department_id), department_id;`,
    result:
`DEPARTMENT_ID  IS_SUBTOTAL  급여합계
-------------  -----------  --------
(NULL)         0            7000
10             0            4400
...
(NULL)         1            691416  ← is_subtotal=1: 총계 행`,
  },

  // ─────────────────────────────────────────────────────────
  // Group 6: 종합
  // ─────────────────────────────────────────────────────────
  {
    id: 422, group: 6, groupTitle: '종합',
    question: '부서별로 직원 수, 최저·최고·평균 급여(소수 둘째 자리 반올림), 급여 합계를 조회하시오. 직원이 2명 이상인 부서만 포함하고, 평균 급여 내림차순으로 정렬하시오.',
    keyPoint: 'GROUP BY + HAVING COUNT(*) >= 2 + 여러 집계 함수 조합 — 종합 집계 쿼리의 기본 패턴입니다.',
    sql: `SELECT department_id,
       COUNT(*)             AS 직원수,
       MIN(salary)          AS 최저급여,
       MAX(salary)          AS 최고급여,
       ROUND(AVG(salary),2) AS 평균급여,
       SUM(salary)          AS 급여합계
FROM   employees
GROUP BY department_id
HAVING COUNT(*) >= 2
ORDER BY AVG(salary) DESC;`,
    result:
`DEPARTMENT_ID  직원수  최저급여  최고급여  평균급여   급여합계
-------------  ------  --------  --------  ---------  --------
90             3       17000     24000     19333.33   58000
20             2       6000      13000     9500.00    19000
...
(9행 반환)`,
  },
  {
    id: 423, group: 6, groupTitle: '종합',
    question: '2000년 이전 입사 직원을 대상으로 입사 연도와 부서 ID별 인원을 조회하시오. 5명 이상인 조합만 표시하고, 연도·부서 ID 오름차순 정렬하시오.',
    keyPoint: "WHERE로 날짜 조건 필터(행 단위) → GROUP BY 두 컬럼 → HAVING COUNT(*) >= 5",
    sql: `SELECT TO_CHAR(hire_date, 'YYYY') AS 입사연도,
       department_id,
       COUNT(*)                    AS 입사자수
FROM   employees
WHERE  hire_date < TO_DATE('2000-01-01', 'YYYY-MM-DD')
GROUP BY TO_CHAR(hire_date, 'YYYY'), department_id
HAVING COUNT(*) >= 5
ORDER BY TO_CHAR(hire_date, 'YYYY'), department_id;`,
    result:
`입사연도  DEPARTMENT_ID  입사자수
--------  -------------  --------
(조건 만족 연도·부서 조합)`,
  },
  {
    id: 424, group: 6, groupTitle: '종합',
    question: '부서별 평균 급여가 전체 평균 급여보다 높은 부서를 조회하시오. 부서 ID와 평균 급여(소수 둘째 자리)를 내림차순으로 정렬하시오.',
    keyPoint: 'HAVING에서 서브쿼리 사용 가능: HAVING AVG(salary) > (SELECT AVG(salary) FROM employees)',
    sql: `SELECT department_id,
       ROUND(AVG(salary), 2) AS 평균급여
FROM   employees
GROUP BY department_id
HAVING AVG(salary) > (SELECT AVG(salary) FROM employees)
ORDER BY AVG(salary) DESC;`,
    result:
`DEPARTMENT_ID  평균급여
-------------  --------
90             19333.33
20             9500.00
110            8300.00
80             8955.88
(전체 평균 6461.83 초과 부서 목록)`,
  },
  {
    id: 425, group: 6, groupTitle: '종합',
    question: "CASE WHEN으로 급여 구간을 '하(5000미만)', '중(5000~9999)', '상(10000이상)'으로 분류한 뒤, 구간별 직원 수와 평균 급여를 조회하시오.",
    keyPoint: 'GROUP BY CASE WHEN ... 표현식을 사용합니다. SELECT와 GROUP BY에 동일한 CASE 식을 작성합니다.',
    sql: `SELECT CASE
         WHEN salary <  5000 THEN '하(5000미만)'
         WHEN salary < 10000 THEN '중(5000~9999)'
         ELSE                     '상(10000이상)'
       END                    AS 급여구간,
       COUNT(*)               AS 직원수,
       ROUND(AVG(salary), 2)  AS 평균급여
FROM   employees
GROUP BY CASE
           WHEN salary <  5000 THEN '하(5000미만)'
           WHEN salary < 10000 THEN '중(5000~9999)'
           ELSE                     '상(10000이상)'
         END
ORDER BY MIN(salary);`,
    result:
`급여구간       직원수  평균급여
-------------  ------  --------
하(5000미만)   36      3201.14
중(5000~9999)  38      6976.58
상(10000이상)  33      13994.55`,
  },
  {
    id: 426, group: 6, groupTitle: '종합',
    question: '부서 ID별 급여 합계를 ROLLUP으로 조회하고, 각 부서의 직원 이름(last_name)을 알파벳 순 콤마 목록(LISTAGG)으로 함께 표시하시오.',
    keyPoint: 'ROLLUP과 LISTAGG를 한 쿼리에서 조합합니다. 총계 행(GROUPING=1)에도 LISTAGG가 전체 목록을 반환합니다.',
    sql: `SELECT department_id,
       SUM(salary)                                                 AS 급여합계,
       LISTAGG(last_name, ', ') WITHIN GROUP (ORDER BY last_name) AS 직원목록
FROM   employees
GROUP BY ROLLUP(department_id)
ORDER BY GROUPING(department_id), department_id;`,
    result:
`DEPARTMENT_ID  급여합계  직원목록
-------------  --------  ----------------------------
(NULL)         7000      Grant
10             4400      Whalen
...
(NULL)         691416    Abel, Ande, ...  ← 총계 행
(13행 반환)`,
  },
]
