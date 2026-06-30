import type { PracticeProblem } from '@/lib/types'

export const ch22Practice: PracticeProblem[] = [
  // ── Group 1: 스칼라 서브쿼리 ──────────────────────────────────
  {
    id: 2201, group: 1, groupTitle: '스칼라 서브쿼리',
    question: '각 직원의 이름, 급여, 그리고 자신이 속한 부서의 평균 급여를 조회하세요.',
    sql: `SELECT last_name,
       salary,
       (SELECT ROUND(AVG(salary), 0)
        FROM   employees e2
        WHERE  e2.department_id = e.department_id) AS dept_avg
FROM   employees e
ORDER BY department_id, salary DESC
FETCH FIRST 10 ROWS ONLY;`,
    result: `LAST_NAME   SALARY  DEPT_AVG
--------- -------- --------
Whalen       4400     4400
Hartstein   13000    9500
Fay          6000    9500
...`,
    keyPoint: 'SELECT 절의 스칼라 서브쿼리는 외부 쿼리의 department_id를 참조하는 상관 서브쿼리로, 행마다 실행됩니다.',
  },
  {
    id: 2202, group: 1, groupTitle: '스칼라 서브쿼리',
    question: '각 직원의 이름과 본인 급여가 부서 평균 대비 얼마나 차이나는지(diff)를 조회하세요.',
    sql: `SELECT last_name,
       salary,
       salary - (SELECT ROUND(AVG(salary), 0)
                 FROM   employees e2
                 WHERE  e2.department_id = e.department_id) AS diff
FROM   employees e
ORDER BY ABS(salary - (SELECT ROUND(AVG(salary), 0)
                       FROM   employees e3
                       WHERE  e3.department_id = e.department_id)) DESC
FETCH FIRST 5 ROWS ONLY;`,
    result: `LAST_NAME    SALARY    DIFF
--------- --------- -------
King         24000   19296
...`,
    keyPoint: '스칼라 서브쿼리는 SELECT·ORDER BY 절 모두에서 사용할 수 있으나, 같은 서브쿼리를 반복하면 성능이 저하됩니다.',
  },
  {
    id: 2203, group: 1, groupTitle: '스칼라 서브쿼리',
    question: '각 부서 ID와 해당 부서에서 가장 최근에 입사한 직원의 이름을 조회하세요.',
    sql: `SELECT DISTINCT department_id,
       (SELECT last_name
        FROM   employees e2
        WHERE  e2.department_id    = e.department_id
        AND    e2.hire_date = (SELECT MAX(hire_date)
                               FROM   employees e3
                               WHERE  e3.department_id = e.department_id)
        AND    ROWNUM = 1) AS latest_hire
FROM   employees e
WHERE  department_id IS NOT NULL
ORDER BY department_id;`,
    result: `DEPARTMENT_ID  LATEST_HIRE
------------- -----------
           10  Whalen
           20  Fay
...`,
    keyPoint: '중첩 스칼라 서브쿼리로 부서별 최신 입사자를 찾습니다. ROWNUM = 1로 단일 행 반환을 보장합니다.',
  },
  {
    id: 2204, group: 1, groupTitle: '스칼라 서브쿼리',
    question: '전체 직원 수와 각 직원 급여의 전체 평균 대비 비율(%)을 조회하세요.',
    sql: `SELECT last_name,
       salary,
       ROUND(salary / (SELECT AVG(salary) FROM employees) * 100, 1) AS pct_of_avg
FROM   employees
ORDER BY pct_of_avg DESC
FETCH FIRST 5 ROWS ONLY;`,
    result: `LAST_NAME  SALARY  PCT_OF_AVG
--------- ------- ----------
King        24000      353.5
...`,
    keyPoint: '비상관 스칼라 서브쿼리(외부 참조 없음)는 한 번만 실행되어 캐싱됩니다.',
  },

  // ── Group 2: 인라인 뷰 ────────────────────────────────────────
  {
    id: 2205, group: 2, groupTitle: '인라인 뷰',
    question: '부서별 평균 급여를 계산하고, 평균 급여가 8000 이상인 부서만 조회하세요.',
    sql: `SELECT department_id, avg_sal, emp_cnt
FROM (
  SELECT department_id,
         ROUND(AVG(salary), 0) AS avg_sal,
         COUNT(*)               AS emp_cnt
  FROM   employees
  WHERE  department_id IS NOT NULL
  GROUP BY department_id
)
WHERE avg_sal >= 8000
ORDER BY avg_sal DESC;`,
    result: `DEPARTMENT_ID  AVG_SAL  EMP_CNT
------------- -------- -------
           90    19333       3
          110    10150       2
...`,
    keyPoint: '인라인 뷰에서 GROUP BY 집계 후 외부 WHERE로 필터링합니다. HAVING 대신 인라인 뷰 패턴을 사용할 수도 있습니다.',
  },
  {
    id: 2206, group: 2, groupTitle: '인라인 뷰',
    question: '전체 직원 중 급여 상위 5명의 이름과 급여를 조회하세요.',
    sql: `SELECT last_name, salary
FROM (
  SELECT last_name, salary
  FROM   employees
  ORDER BY salary DESC
)
WHERE ROWNUM <= 5;`,
    result: `LAST_NAME  SALARY
--------- -------
King        24000
Kochhar     17000
De Haan     17000
Russell     14000
Partners    13500`,
    keyPoint: '인라인 뷰에서 ORDER BY 후 외부 ROWNUM 필터로 TOP-N 조회합니다. FETCH FIRST도 동일한 결과를 얻을 수 있습니다.',
  },
  {
    id: 2207, group: 2, groupTitle: '인라인 뷰',
    question: '부서별 최고 급여자의 이름, 부서 ID, 급여를 조회하세요.',
    sql: `SELECT e.last_name, e.department_id, e.salary
FROM   employees e
JOIN (
  SELECT department_id, MAX(salary) AS max_sal
  FROM   employees
  WHERE  department_id IS NOT NULL
  GROUP BY department_id
) m ON e.department_id = m.department_id
    AND e.salary       = m.max_sal
ORDER BY e.department_id;`,
    result: `LAST_NAME  DEPARTMENT_ID  SALARY
--------- ------------- -------
Whalen               10    4400
Hartstein            20   13000
...`,
    keyPoint: '인라인 뷰로 부서별 MAX를 구한 뒤 원본 테이블과 조인하여 최고 급여자의 상세 정보를 얻습니다.',
  },
  {
    id: 2208, group: 2, groupTitle: '인라인 뷰',
    question: 'ROW_NUMBER()를 인라인 뷰에서 활용하여 부서별 급여 2위 직원을 조회하세요.',
    sql: `SELECT last_name, department_id, salary
FROM (
  SELECT last_name, department_id, salary,
         ROW_NUMBER() OVER (PARTITION BY department_id ORDER BY salary DESC) AS rn
  FROM   employees
  WHERE  department_id IS NOT NULL
)
WHERE rn = 2
ORDER BY department_id;`,
    result: `LAST_NAME  DEPARTMENT_ID  SALARY
--------- ------------- -------
Fay                  20    6000
Raphaely             30   11000
...`,
    keyPoint: '인라인 뷰 내 ROW_NUMBER()로 순위를 부여한 뒤 외부에서 rn=2 필터로 정확히 2위만 추출합니다.',
  },

  // ── Group 3: EXISTS / NOT EXISTS ────────────────────────────────
  {
    id: 2209, group: 3, groupTitle: 'EXISTS / NOT EXISTS',
    question: '부하 직원이 있는 관리자(manager_id로 참조되는 직원)를 조회하세요.',
    sql: `SELECT employee_id, last_name, job_id
FROM   employees mgr
WHERE  EXISTS (
  SELECT 1
  FROM   employees sub
  WHERE  sub.manager_id = mgr.employee_id
)
ORDER BY employee_id;`,
    result: `EMPLOYEE_ID  LAST_NAME  JOB_ID
----------- --------- --------
        100  King       AD_PRES
        101  Kochhar    AD_VP
...`,
    keyPoint: 'EXISTS는 서브쿼리에서 SELECT 1을 사용해도 결과가 동일합니다. 행 존재 여부만 확인하므로 효율적입니다.',
  },
  {
    id: 2210, group: 3, groupTitle: 'EXISTS / NOT EXISTS',
    question: '직원이 한 명도 없는 부서 ID와 부서명을 조회하세요.',
    sql: `SELECT department_id, department_name
FROM   departments d
WHERE  NOT EXISTS (
  SELECT 1
  FROM   employees e
  WHERE  e.department_id = d.department_id
)
ORDER BY department_id;`,
    result: `DEPARTMENT_ID  DEPARTMENT_NAME
------------- ------------------
          120  Treasury
          130  Corporate Tax
...`,
    keyPoint: 'NOT EXISTS는 서브쿼리 결과가 없을 때 TRUE를 반환합니다. NOT IN과 달리 NULL이 있어도 안전합니다.',
  },
  {
    id: 2211, group: 3, groupTitle: 'EXISTS / NOT EXISTS',
    question: '모든 직종(job_id)에 최소 한 명의 직원이 있는지 확인하는 쿼리를 작성하세요.',
    sql: `SELECT job_id, job_title
FROM   jobs j
WHERE  NOT EXISTS (
  SELECT 1
  FROM   employees e
  WHERE  e.job_id = j.job_id
)
ORDER BY job_id;`,
    result: `JOB_ID   JOB_TITLE
-------- -----------------------
AC_MGR   Accounting Manager
...`,
    keyPoint: '직원이 없는 직종을 찾아내는 패턴입니다. 결과가 없으면 모든 직종에 직원이 존재합니다.',
  },

  // ── Group 4: WITH 절 (CTE) ───────────────────────────────────
  {
    id: 2212, group: 4, groupTitle: 'WITH 절 (CTE)',
    question: 'WITH 절로 부서별 평균 급여를 구한 뒤, 평균보다 높은 급여를 받는 직원을 조회하세요.',
    sql: `WITH dept_avg AS (
  SELECT department_id,
         ROUND(AVG(salary), 0) AS avg_sal
  FROM   employees
  WHERE  department_id IS NOT NULL
  GROUP BY department_id
)
SELECT e.last_name, e.salary, d.avg_sal
FROM   employees e
JOIN   dept_avg  d ON e.department_id = d.department_id
WHERE  e.salary > d.avg_sal
ORDER BY e.department_id, e.salary DESC
FETCH FIRST 10 ROWS ONLY;`,
    result: `LAST_NAME  SALARY  AVG_SAL
--------- ------- -------
Hartstein   13000    9500
King        24000   19333
...`,
    keyPoint: 'CTE를 JOIN의 오른쪽 테이블처럼 사용합니다. 동일한 집계를 여러 번 참조해야 할 때 WITH 절이 유용합니다.',
  },
  {
    id: 2213, group: 4, groupTitle: 'WITH 절 (CTE)',
    question: 'WITH 절을 두 개 사용하여 부서 통계와 급여 상위 직원을 결합하세요.',
    sql: `WITH dept_stats AS (
  SELECT department_id,
         ROUND(AVG(salary), 0) AS avg_sal,
         MAX(salary)            AS max_sal
  FROM   employees
  WHERE  department_id IS NOT NULL
  GROUP BY department_id
),
top_emp AS (
  SELECT employee_id, last_name, salary, department_id
  FROM   employees
  WHERE  salary >= 12000
)
SELECT t.last_name, t.salary,
       d.avg_sal, d.max_sal
FROM   top_emp    t
JOIN   dept_stats d ON t.department_id = d.department_id
ORDER BY t.salary DESC;`,
    result: `LAST_NAME  SALARY  AVG_SAL  MAX_SAL
--------- ------- -------- -------
King        24000    19333   24000
Kochhar     17000    19333   24000
...`,
    keyPoint: '두 번째 CTE(top_emp)는 앞서 정의된 첫 번째 CTE(dept_stats)를 참조할 수 있습니다.',
  },
  {
    id: 2214, group: 4, groupTitle: 'WITH 절 (CTE)',
    question: 'WITH 절로 연도별 입사자 수를 구하고, 가장 많이 채용된 연도 TOP 3를 조회하세요.',
    sql: `WITH yearly_hire AS (
  SELECT EXTRACT(YEAR FROM hire_date) AS hire_year,
         COUNT(*)                      AS cnt
  FROM   employees
  GROUP BY EXTRACT(YEAR FROM hire_date)
)
SELECT hire_year, cnt
FROM   yearly_hire
ORDER BY cnt DESC
FETCH FIRST 3 ROWS ONLY;`,
    result: `HIRE_YEAR  CNT
--------- ----
     2005   29
     2006   23
     2007   16`,
    keyPoint: 'CTE 내에서 EXTRACT 함수로 연도를 추출하고 GROUP BY로 집계합니다.',
  },

  // ── Group 5: 다중 컬럼 서브쿼리 ─────────────────────────────
  {
    id: 2215, group: 5, groupTitle: '다중 컬럼 서브쿼리',
    question: '자신의 부서에서 가장 낮은 급여를 받는 직원을 쌍 비교로 조회하세요.',
    sql: `SELECT employee_id, last_name, department_id, salary
FROM   employees
WHERE  (department_id, salary) IN (
  SELECT department_id, MIN(salary)
  FROM   employees
  WHERE  department_id IS NOT NULL
  GROUP BY department_id
)
ORDER BY department_id;`,
    result: `EMPLOYEE_ID  LAST_NAME  DEPARTMENT_ID  SALARY
----------- --------- ------------- -------
        200  Whalen               10    4400
        202  Fay                  20    6000
...`,
    keyPoint: '쌍 비교(pairwise): (department_id, salary)를 쌍으로 비교하여 부서-최저급여 조합이 정확히 일치하는 행만 반환합니다.',
  },
  {
    id: 2216, group: 5, groupTitle: '다중 컬럼 서브쿼리',
    question: '부서별 최고 급여자와 동일한 직종(job_id)을 가진 다른 직원을 조회하세요.',
    sql: `SELECT employee_id, last_name, job_id, department_id, salary
FROM   employees
WHERE  job_id IN (
  SELECT e2.job_id
  FROM   employees e2
  WHERE  (e2.department_id, e2.salary) IN (
    SELECT department_id, MAX(salary)
    FROM   employees
    WHERE  department_id IS NOT NULL
    GROUP BY department_id
  )
)
ORDER BY job_id, salary DESC
FETCH FIRST 10 ROWS ONLY;`,
    result: `EMPLOYEE_ID  LAST_NAME  JOB_ID   DEPARTMENT_ID  SALARY
----------- --------- -------- ------------- -------
        100  King       AD_PRES            90   24000
...`,
    keyPoint: '중첩 서브쿼리로 부서별 최고 급여자를 찾고, 그 직종과 동일한 직원을 외부 쿼리에서 조회합니다.',
  },

  // ── Group 6: 종합 실습 ──────────────────────────────────────
  {
    id: 2217, group: 6, groupTitle: '종합 실습',
    question: '스칼라·EXISTS·WITH를 결합하여 관리자인 직원의 이름, 팀 인원, 팀 평균 급여를 조회하세요.',
    sql: `WITH team_stats AS (
  SELECT manager_id,
         COUNT(*)              AS team_size,
         ROUND(AVG(salary), 0) AS team_avg_sal
  FROM   employees
  WHERE  manager_id IS NOT NULL
  GROUP BY manager_id
)
SELECT e.employee_id,
       e.last_name,
       t.team_size,
       t.team_avg_sal,
       e.salary AS mgr_salary
FROM   employees e
JOIN   team_stats t ON e.employee_id = t.manager_id
ORDER BY t.team_size DESC
FETCH FIRST 5 ROWS ONLY;`,
    result: `EMPLOYEE_ID  LAST_NAME  TEAM_SIZE  TEAM_AVG_SAL  MGR_SALARY
----------- --------- --------- ------------ ----------
        100  King              14         7004      24000
        101  Kochhar            5         9560      17000
...`,
    keyPoint: 'CTE로 관리자별 팀 통계를 미리 계산한 뒤 JOIN으로 관리자 정보와 결합합니다.',
  },
  {
    id: 2218, group: 6, groupTitle: '종합 실습',
    question: '인라인 뷰와 스칼라 서브쿼리를 결합하여 급여 분위수(25%ile, 75%ile)와 각 직원의 위치를 조회하세요.',
    sql: `WITH quartiles AS (
  SELECT
    PERCENTILE_CONT(0.25) WITHIN GROUP (ORDER BY salary) AS q1,
    PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY salary) AS q3
  FROM employees
)
SELECT e.last_name, e.salary,
       CASE
         WHEN e.salary < q.q1 THEN '하위 25%'
         WHEN e.salary > q.q3 THEN '상위 25%'
         ELSE '중간 50%'
       END AS salary_band
FROM   employees e, quartiles q
ORDER BY e.salary DESC
FETCH FIRST 10 ROWS ONLY;`,
    result: `LAST_NAME  SALARY  SALARY_BAND
--------- ------- ----------
King        24000  상위 25%
Kochhar     17000  상위 25%
...`,
    keyPoint: 'PERCENTILE_CONT로 분위수를 계산하고 CASE로 각 직원의 급여 구간을 분류합니다.',
  },
]
