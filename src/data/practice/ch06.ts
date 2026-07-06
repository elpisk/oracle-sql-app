import type { PracticeProblem } from '@/lib/types'

export const ch06Practice: PracticeProblem[] = [

  // ─────────────────────────────────────────────────────────
  // Group 1: 단일행 서브쿼리
  // ─────────────────────────────────────────────────────────
  {
    id: 601, group: 1, groupTitle: '단일행 서브쿼리',
    question: "전체 직원의 평균 급여보다 높은 급여를 받는 직원의 이름과 급여를 조회하시오. 급여 내림차순 정렬하시오.",
    keyPoint: '단일행 서브쿼리: WHERE salary > (SELECT AVG(salary) FROM employees). 서브쿼리가 1행 1컬럼 반환 → 단일행 연산자 = / > 사용 가능.',
    sql: `SELECT last_name, salary
FROM   employees
WHERE  salary > (SELECT AVG(salary) FROM employees)
ORDER BY salary DESC;`,
    result:
`LAST_NAME   SALARY
----------  ------
King        24000
Kochhar     17000
...
(51행 반환)`,
  },
  {
    id: 602, group: 1, groupTitle: '단일행 서브쿼리',
    question: "'Abel'과 같은 부서에서 근무하는 직원의 이름과 부서 ID를 조회하시오. Abel 자신은 제외하시오.",
    keyPoint: '서브쿼리로 Abel의 department_id를 구한 뒤 같은 부서 직원을 찾습니다.',
    sql: `SELECT last_name, department_id
FROM   employees
WHERE  department_id = (SELECT department_id
                        FROM   employees
                        WHERE  last_name = 'Abel')
AND    last_name != 'Abel'
ORDER BY last_name;`,
    result:
`LAST_NAME   DEPARTMENT_ID
----------  -------------
Ande        80
Banda       80
...`,
  },
  {
    id: 603, group: 1, groupTitle: '단일행 서브쿼리',
    question: "직원 중 최고 급여자의 이름, 직무, 급여를 조회하시오.",
    keyPoint: '단일행 서브쿼리: WHERE salary = (SELECT MAX(salary) FROM employees).',
    sql: `SELECT last_name, job_id, salary
FROM   employees
WHERE  salary = (SELECT MAX(salary) FROM employees);`,
    result:
`LAST_NAME  JOB_ID    SALARY
---------  --------  ------
King       AD_PRES   24000`,
  },
  {
    id: 604, group: 1, groupTitle: '단일행 서브쿼리',
    question: "부서 ID가 90인 부서의 평균 급여보다 높고, 부서 ID가 90인 부서의 최저 급여보다 높은 직원을 조회하시오.",
    keyPoint: '두 개의 단일행 서브쿼리를 AND로 결합합니다.',
    sql: `SELECT last_name, salary, department_id
FROM   employees
WHERE  salary > (SELECT AVG(salary) FROM employees WHERE department_id = 90)
AND    salary > (SELECT MIN(salary) FROM employees WHERE department_id = 90)
ORDER BY salary DESC;`,
    result:
`LAST_NAME  SALARY  DEPARTMENT_ID
---------  ------  -------------
King       24000   90
Kochhar    17000   90
De Haan    17000   90`,
  },
  {
    id: 605, group: 1, groupTitle: '단일행 서브쿼리',
    question: "HAVING 절에 서브쿼리를 사용하여 전체 평균 급여보다 부서 평균 급여가 높은 부서를 조회하시오.",
    keyPoint: 'HAVING 절에서도 서브쿼리 사용 가능합니다.',
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
80             8955.88
110            8300.00
(전체 평균 6461.83 초과 부서)`,
  },

  // ─────────────────────────────────────────────────────────
  // Group 2: 다중행 서브쿼리 (IN / ANY / ALL)
  // ─────────────────────────────────────────────────────────
  {
    id: 606, group: 2, groupTitle: '다중행 서브쿼리 (IN · ANY · ALL)',
    question: "'Seattle'에 위치한 부서에 근무하는 직원의 이름과 부서 ID를 조회하시오. IN 서브쿼리를 사용하시오.",
    keyPoint: 'IN: WHERE department_id IN (SELECT ... WHERE city = \'Seattle\').',
    sql: `SELECT last_name, department_id
FROM   employees
WHERE  department_id IN (
         SELECT d.department_id
         FROM   departments d
         JOIN   locations   l ON d.location_id = l.location_id
         WHERE  l.city = 'Seattle'
       )
ORDER BY last_name;`,
    result:
`LAST_NAME   DEPARTMENT_ID
----------  -------------
Gietz       110
Higgins     110
(Seattle 위치 부서 직원 목록)`,
  },
  {
    id: 607, group: 2, groupTitle: '다중행 서브쿼리 (IN · ANY · ALL)',
    question: "부서 번호 20 또는 50에 근무하는 직원의 최소 급여보다 높은 급여를 받는 직원을 조회하시오. >ANY를 사용하시오.",
    keyPoint: '>ANY: 서브쿼리 결과 중 최솟값보다 크면 TRUE. MIN()과 동일한 효과.',
    sql: `SELECT last_name, salary
FROM   employees
WHERE  salary > ANY (SELECT salary
                     FROM   employees
                     WHERE  department_id IN (20, 50))
ORDER BY salary;`,
    result:
`LAST_NAME   SALARY
----------  ------
(부서 20,50 최저급여인 2100보다 높은 직원 전체)`,
  },
  {
    id: 608, group: 2, groupTitle: '다중행 서브쿼리 (IN · ANY · ALL)',
    question: "부서 번호 20 또는 50에 근무하는 직원의 최대 급여보다 높은 급여를 받는 직원을 조회하시오. >ALL을 사용하시오.",
    keyPoint: '>ALL: 서브쿼리의 모든 값보다 커야 TRUE → 최댓값 초과.',
    sql: `SELECT last_name, salary
FROM   employees
WHERE  salary > ALL (SELECT salary
                     FROM   employees
                     WHERE  department_id IN (20, 50))
ORDER BY salary;`,
    result:
`LAST_NAME   SALARY
----------  ------
King        24000
Kochhar     17000
De Haan     17000
...
(부서 20,50 최고급여인 13000보다 높은 직원)`,
  },
  {
    id: 609, group: 2, groupTitle: '다중행 서브쿼리 (IN · ANY · ALL)',
    question: "커미션을 받는 직원(commission_pct IS NOT NULL)이 한 명도 없는 부서의 부서 ID와 부서 이름을 조회하시오. NOT IN을 사용하시오. (NULL 안전 처리 포함)",
    keyPoint: 'NOT IN 서브쿼리 사용 시 NULL이 포함되지 않도록 WHERE commission_pct IS NOT NULL AND department_id IS NOT NULL 조건을 추가합니다.',
    sql: `SELECT department_id, department_name
FROM   departments
WHERE  department_id NOT IN (
         SELECT department_id
         FROM   employees
         WHERE  commission_pct IS NOT NULL
         AND    department_id IS NOT NULL
       )
ORDER BY department_id;`,
    result:
`DEPARTMENT_ID  DEPARTMENT_NAME
-------------  ---------------
10             Administration
20             Marketing
...
(커미션 직원이 없는 부서 목록)`,
  },

  // ─────────────────────────────────────────────────────────
  // Group 3: EXISTS / NOT EXISTS
  // ─────────────────────────────────────────────────────────
  {
    id: 610, group: 3, groupTitle: 'EXISTS · NOT EXISTS',
    question: "부하 직원이 있는 관리자의 employee_id, 이름, 직무를 조회하시오. EXISTS를 사용하시오.",
    keyPoint: 'EXISTS(상관 서브쿼리): sub.manager_id = mgr.employee_id가 존재하면 TRUE.',
    sql: `SELECT employee_id, last_name, job_id
FROM   employees mgr
WHERE  EXISTS (
         SELECT 1
         FROM   employees sub
         WHERE  sub.manager_id = mgr.employee_id
       )
ORDER BY employee_id;`,
    result:
`EMPLOYEE_ID  LAST_NAME   JOB_ID
-----------  ----------  --------
100          King        AD_PRES
101          Kochhar     AD_VP
...
(관리자 역할인 직원 목록 18행)`,
  },
  {
    id: 611, group: 3, groupTitle: 'EXISTS · NOT EXISTS',
    question: "직원이 한 명도 없는 부서의 부서 이름을 조회하시오. NOT EXISTS를 사용하시오.",
    keyPoint: 'NOT EXISTS: 해당 부서에 직원이 없으면 TRUE. NULL이 포함되어도 안전합니다.',
    sql: `SELECT department_id, department_name
FROM   departments d
WHERE  NOT EXISTS (
         SELECT 1
         FROM   employees e
         WHERE  e.department_id = d.department_id
       )
ORDER BY department_id;`,
    result:
`DEPARTMENT_ID  DEPARTMENT_NAME
-------------  -----------------------
120            Treasury
130            Corporate Tax
...
(직원 없는 부서 목록)`,
  },
  {
    id: 612, group: 3, groupTitle: 'EXISTS · NOT EXISTS',
    question: "커미션을 받는 직원이 있는 부서의 부서 이름과 직원 수를 조회하시오. EXISTS를 사용하시오.",
    keyPoint: 'EXISTS로 조건 부서를 필터링한 후 COUNT(*) GROUP BY로 집계합니다.',
    sql: `SELECT d.department_id,
       d.department_name,
       COUNT(e.employee_id) AS 직원수
FROM   departments d
JOIN   employees   e ON e.department_id = d.department_id
WHERE  EXISTS (
         SELECT 1
         FROM   employees e2
         WHERE  e2.department_id = d.department_id
         AND    e2.commission_pct IS NOT NULL
       )
GROUP BY d.department_id, d.department_name
ORDER BY d.department_id;`,
    result:
`DEPARTMENT_ID  DEPARTMENT_NAME  직원수
-------------  ---------------  ------
80             Sales            34
(커미션 있는 직원이 존재하는 부서)`,
  },

  // ─────────────────────────────────────────────────────────
  // Group 4: 다중컬럼 서브쿼리
  // ─────────────────────────────────────────────────────────
  {
    id: 613, group: 4, groupTitle: '다중컬럼 서브쿼리',
    question: "각 부서에서 최저 급여를 받는 직원의 이름, 부서 ID, 급여를 조회하시오. 다중컬럼 쌍 비교를 사용하시오.",
    keyPoint: '(department_id, salary) IN (SELECT department_id, MIN(salary) FROM ... GROUP BY department_id) — 쌍 비교.',
    sql: `SELECT last_name, department_id, salary
FROM   employees
WHERE  (department_id, salary) IN (
         SELECT department_id, MIN(salary)
         FROM   employees
         GROUP BY department_id
       )
ORDER BY department_id;`,
    result:
`LAST_NAME   DEPARTMENT_ID  SALARY
----------  -------------  ------
Whalen      10             4400
Fay         20             6000
...
(각 부서 최저 급여자 목록)`,
  },
  {
    id: 614, group: 4, groupTitle: '다중컬럼 서브쿼리',
    question: "부서 ID가 30인 부서의 직원과 같은 직무 AND 같은 급여를 가진 다른 직원을 조회하시오. 쌍 비교를 사용하시오.",
    keyPoint: '(job_id, salary) IN (SELECT job_id, salary FROM employees WHERE department_id = 30).',
    sql: `SELECT last_name, job_id, salary, department_id
FROM   employees
WHERE  (job_id, salary) IN (
         SELECT job_id, salary
         FROM   employees
         WHERE  department_id = 30
       )
AND    department_id != 30
ORDER BY job_id, salary;`,
    result:
`LAST_NAME  JOB_ID  SALARY  DEPARTMENT_ID
---------  ------  ------  -------------
(부서 30과 직무+급여가 동일한 다른 부서 직원 — 없으면 0행)`,
  },
  {
    id: 615, group: 4, groupTitle: '다중컬럼 서브쿼리',
    question: "관리자 ID가 같고 부서 ID도 같은 직원 쌍에서 급여가 더 높은 직원을 조회하시오. 쌍 비교를 사용하시오.",
    keyPoint: '(manager_id, department_id) IN (서브쿼리에서 조건 만족 조합).',
    sql: `SELECT last_name, salary, manager_id, department_id
FROM   employees
WHERE  (manager_id, department_id) IN (
         SELECT manager_id, department_id
         FROM   employees
         GROUP BY manager_id, department_id
         HAVING COUNT(*) >= 2
       )
ORDER BY department_id, salary DESC;`,
    result:
`LAST_NAME   SALARY  MANAGER_ID  DEPARTMENT_ID
----------  ------  ----------  -------------
(같은 관리자·부서 소속 직원 목록)`,
  },
  {
    id: 616, group: 4, groupTitle: '다중컬럼 서브쿼리',
    question: "입사 연도와 부서 ID가 동일한 직원 그룹에서 최고 급여자를 조회하시오. 다중컬럼 서브쿼리를 사용하시오.",
    keyPoint: "(TO_CHAR(hire_date,'YYYY'), department_id, salary) IN (... MAX(salary) GROUP BY).",
    sql: `SELECT last_name,
       TO_CHAR(hire_date, 'YYYY') AS 입사연도,
       department_id,
       salary
FROM   employees
WHERE  (TO_CHAR(hire_date, 'YYYY'), department_id, salary) IN (
         SELECT TO_CHAR(hire_date, 'YYYY'),
                department_id,
                MAX(salary)
         FROM   employees
         GROUP BY TO_CHAR(hire_date, 'YYYY'), department_id
       )
ORDER BY department_id, salary DESC;`,
    result:
`LAST_NAME   입사연도  DEPARTMENT_ID  SALARY
----------  --------  -------------  ------
(각 입사연도·부서 조합 최고 급여자 목록)`,
  },

  // ─────────────────────────────────────────────────────────
  // Group 5: 인라인 뷰와 Top-N
  // ─────────────────────────────────────────────────────────
  {
    id: 617, group: 5, groupTitle: '인라인 뷰와 Top-N',
    question: "급여 상위 5명의 직원 이름과 급여를 조회하시오. Oracle ROWNUM을 사용하는 Top-N 패턴을 적용하시오.",
    keyPoint: '인라인 뷰에서 ORDER BY 후 외부 쿼리에서 ROWNUM <= 5. 반드시 이 순서를 지켜야 올바른 Top-N이 됩니다.',
    sql: `SELECT last_name, salary
FROM  (SELECT last_name, salary
       FROM   employees
       ORDER BY salary DESC)
WHERE  ROWNUM <= 5;`,
    result:
`LAST_NAME   SALARY
----------  ------
King        24000
Kochhar     17000
De Haan     17000
Greenberg   12000
Hartstein   13000`,
  },
  {
    id: 618, group: 5, groupTitle: '인라인 뷰와 Top-N',
    question: "부서별 평균 급여를 계산한 인라인 뷰를 활용하여, 자신의 부서 평균보다 급여가 높은 직원을 조회하시오.",
    keyPoint: 'FROM 절 인라인 뷰: 집계 결과를 임시 테이블처럼 JOIN하여 사용합니다.',
    sql: `SELECT e.last_name,
       e.salary,
       ROUND(d.avg_sal, 2) AS 부서평균급여
FROM   employees e
JOIN  (SELECT department_id,
              AVG(salary) AS avg_sal
       FROM   employees
       GROUP BY department_id) d
    ON  e.department_id = d.department_id
WHERE  e.salary > d.avg_sal
ORDER BY e.department_id, e.salary DESC;`,
    result:
`LAST_NAME   SALARY  부서평균급여
----------  ------  ------------
Hartstein   13000   9500.00
...
(각 부서 평균 초과 직원 목록)`,
  },
  {
    id: 619, group: 5, groupTitle: '인라인 뷰와 Top-N',
    question: "부서별 급여 합계 상위 3개 부서를 조회하시오. 인라인 뷰와 ROWNUM을 사용하시오.",
    keyPoint: '집계 결과를 인라인 뷰로 정렬 → 외부에서 ROWNUM으로 상위 N개 추출.',
    sql: `SELECT department_id, 급여합계
FROM  (SELECT department_id,
              SUM(salary) AS 급여합계
       FROM   employees
       GROUP BY department_id
       ORDER BY SUM(salary) DESC)
WHERE  ROWNUM <= 3;`,
    result:
`DEPARTMENT_ID  급여합계
-------------  --------
80             304500
50             156400
100            51600`,
  },
  {
    id: 620, group: 5, groupTitle: '인라인 뷰와 Top-N',
    question: "WITH 절을 사용하여 ① 부서별 평균 급여와 ② 전체 평균 급여를 각각 CTE로 정의하고, 부서 평균이 전체 평균보다 높은 부서를 조회하시오.",
    keyPoint: 'WITH 절에 여러 CTE를 정의하고 메인 쿼리에서 JOIN하여 사용합니다.',
    sql: `WITH dept_avg AS (
  SELECT department_id,
         AVG(salary) AS avg_sal
  FROM   employees
  GROUP BY department_id
),
total_avg AS (
  SELECT AVG(salary) AS total
  FROM   employees
)
SELECT d.department_id,
       ROUND(d.avg_sal, 2) AS 부서평균,
       ROUND(t.total, 2)   AS 전체평균
FROM   dept_avg d
CROSS  JOIN total_avg t
WHERE  d.avg_sal > t.total
ORDER BY d.avg_sal DESC;`,
    result:
`DEPARTMENT_ID  부서평균   전체평균
-------------  ---------  --------
90             19333.33   6461.83
20             9500.00    6461.83
80             8955.88    6461.83
110            8300.00    6461.83`,
  },
  {
    id: 621, group: 5, groupTitle: '인라인 뷰와 Top-N',
    question: "입사일 순서로 4번째~6번째 직원을 조회하시오. (ROWNUM 기반 페이징)",
    keyPoint: 'ROWNUM으로 페이징: 인라인 뷰에서 ROWNUM에 별칭(rn)을 부여한 후 외부에서 범위 필터링합니다.',
    sql: `SELECT last_name, hire_date, rn
FROM  (SELECT last_name,
              hire_date,
              ROWNUM AS rn
       FROM  (SELECT last_name, hire_date
              FROM   employees
              ORDER BY hire_date)
      )
WHERE  rn BETWEEN 4 AND 6;`,
    result:
`LAST_NAME   HIRE_DATE   RN
----------  ----------  --
(입사일 4~6번째 직원 3명)`,
  },

  // ─────────────────────────────────────────────────────────
  // Group 6: 종합
  // ─────────────────────────────────────────────────────────
  {
    id: 622, group: 6, groupTitle: '종합',
    question: "자신의 관리자보다 급여가 높은 직원의 이름, 급여, 관리자 이름, 관리자 급여를 조회하시오.",
    keyPoint: '상관 서브쿼리: WHERE salary > (SELECT salary FROM employees WHERE employee_id = e.manager_id).',
    sql: `SELECT e.last_name         AS 직원,
       e.salary             AS 직원급여,
       m.last_name          AS 관리자,
       m.salary             AS 관리자급여
FROM   employees e
JOIN   employees m ON e.manager_id = m.employee_id
WHERE  e.salary > m.salary
ORDER BY e.salary DESC;`,
    result:
`직원         직원급여  관리자      관리자급여
-----------  --------  ----------  ----------
(자신의 관리자보다 급여가 높은 직원 목록)`,
  },
  {
    id: 623, group: 6, groupTitle: '종합',
    question: "전 직원 중 급여 기준 상위 10%에 해당하는 직원을 조회하시오. 인라인 뷰와 ROWNUM을 조합하시오.",
    keyPoint: '전체 인원의 10%: CEIL(COUNT(*) * 0.1) 또는 FETCH FIRST 10 PERCENT ROWS ONLY (Oracle 12c+).',
    sql: `-- 방법 1: ROWNUM 기반 (Oracle 전통)
SELECT last_name, salary
FROM  (SELECT last_name, salary
       FROM   employees
       ORDER BY salary DESC)
WHERE  ROWNUM <= CEIL((SELECT COUNT(*) FROM employees) * 0.1);

-- 방법 2: Oracle 12c+ FETCH
SELECT last_name, salary
FROM   employees
ORDER BY salary DESC
FETCH FIRST 10 PERCENT ROWS ONLY;`,
    result:
`LAST_NAME   SALARY
----------  ------
King        24000
Kochhar     17000
De Haan     17000
...
(107명의 10% = 약 11명)`,
  },
  {
    id: 624, group: 6, groupTitle: '종합',
    question: "부서별로 두 번째로 높은 급여를 받는 직원을 조회하시오. 인라인 뷰와 다중컬럼 서브쿼리를 활용하시오.",
    keyPoint: '인라인 뷰에서 DENSE_RANK() 또는 서브쿼리로 2번째 급여를 추출합니다.',
    sql: `-- 방법: 부서별 최고 급여보다 낮은 최고 급여 = 2번째 급여
SELECT e.last_name, e.department_id, e.salary
FROM   employees e
WHERE  e.salary = (
         SELECT MAX(salary)
         FROM   employees
         WHERE  department_id = e.department_id
         AND    salary < (SELECT MAX(salary)
                          FROM   employees
                          WHERE  department_id = e.department_id)
       )
ORDER BY e.department_id;`,
    result:
`LAST_NAME   DEPARTMENT_ID  SALARY
----------  -------------  ------
(각 부서에서 두 번째로 높은 급여를 받는 직원)`,
  },
  {
    id: 625, group: 6, groupTitle: '종합',
    question: "WITH 절로 부서별 직원 수를 구하고, 직원 수가 전체 부서 평균 직원 수 이상인 부서의 이름과 직원 수를 조회하시오.",
    keyPoint: 'WITH 절 + AVG()로 평균 부서 직원 수를 계산하여 필터링합니다.',
    sql: `WITH dept_cnt AS (
  SELECT d.department_id,
         d.department_name,
         COUNT(e.employee_id) AS 직원수
  FROM   departments d
  LEFT   JOIN employees e ON e.department_id = d.department_id
  GROUP BY d.department_id, d.department_name
)
SELECT department_name,
       직원수
FROM   dept_cnt
WHERE  직원수 >= (SELECT AVG(직원수) FROM dept_cnt)
ORDER BY 직원수 DESC;`,
    result:
`DEPARTMENT_NAME  직원수
---------------  ------
Shipping         45
Sales            34
Finance          6
(전체 부서 평균 직원 수 이상인 부서)`,
  },
  {
    id: 626, group: 6, groupTitle: '종합',
    question: "NOT EXISTS를 사용하여 한 번도 관리자를 맡아 본 적 없는 직원(부하 직원이 없는 직원)의 이름과 직무를 조회하시오.",
    keyPoint: 'NOT EXISTS(상관 서브쿼리): 다른 직원의 manager_id로 등록된 적이 없는 직원을 찾습니다.',
    sql: `SELECT last_name, job_id
FROM   employees e
WHERE  NOT EXISTS (
         SELECT 1
         FROM   employees sub
         WHERE  sub.manager_id = e.employee_id
       )
ORDER BY last_name;`,
    result:
`LAST_NAME   JOB_ID
----------  --------
Atkinson    ST_CLERK
Bell        SH_CLERK
...
(부하 직원이 없는 직원 — 관리자가 아닌 직원들)`,
  },
]
