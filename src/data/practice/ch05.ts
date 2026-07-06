import type { PracticeProblem } from '@/lib/types'

export const ch05Practice: PracticeProblem[] = [

  // ─────────────────────────────────────────────────────────
  // Group 1: INNER JOIN (ANSI)
  // ─────────────────────────────────────────────────────────
  {
    id: 501, group: 1, groupTitle: 'INNER JOIN (ANSI)',
    question: '직원 이름(last_name), 부서 ID, 부서 이름을 조회하시오. 부서가 없는 직원은 제외합니다. 부서 이름 오름차순 정렬하시오.',
    keyPoint: 'ANSI INNER JOIN ... ON: 조인 조건을 ON 절에 명시합니다. department_id가 NULL인 직원은 자동 제외됩니다.',
    sql: `SELECT e.last_name,
       e.department_id,
       d.department_name
FROM   employees e
JOIN   departments d ON e.department_id = d.department_id
ORDER BY d.department_name;`,
    result:
`LAST_NAME   DEPARTMENT_ID  DEPARTMENT_NAME
----------  -------------  ---------------
Fay         20             Marketing
Hartstein   20             Marketing
...
(106행 반환)`,
  },
  {
    id: 502, group: 1, groupTitle: 'INNER JOIN (ANSI)',
    question: '직원 이름, 부서 이름, 근무 위치 도시(city)를 조회하시오. EMPLOYEES → DEPARTMENTS → LOCATIONS 3개 테이블을 조인하시오. 도시 오름차순 정렬하시오.',
    keyPoint: '3테이블 조인: JOIN을 연쇄 적용합니다. n개 테이블에는 n-1개의 조인 조건이 필요합니다.',
    sql: `SELECT e.last_name,
       d.department_name,
       l.city
FROM   employees   e
JOIN   departments d ON e.department_id = d.department_id
JOIN   locations   l ON d.location_id   = l.location_id
ORDER BY l.city;`,
    result:
`LAST_NAME   DEPARTMENT_NAME   CITY
----------  ----------------  ----------
Gietz       Accounting        Seattle
Higgins     Accounting        Seattle
...`,
  },
  {
    id: 503, group: 1, groupTitle: 'INNER JOIN (ANSI)',
    question: '직무 이름(job_title)과 해당 직무를 가진 직원 수를 조회하시오. EMPLOYEES와 JOBS를 job_id로 조인하고, 직원 수 내림차순 정렬하시오.',
    keyPoint: 'JOIN + GROUP BY 조합: 조인 후 집계 함수를 적용합니다.',
    sql: `SELECT j.job_title,
       COUNT(e.employee_id) AS 직원수
FROM   employees e
JOIN   jobs j ON e.job_id = j.job_id
GROUP BY j.job_title
ORDER BY COUNT(e.employee_id) DESC;`,
    result:
`JOB_TITLE                     직원수
----------------------------  ------
Sales Representative          34
Stock Clerk                   20
...`,
  },
  {
    id: 504, group: 1, groupTitle: 'INNER JOIN (ANSI)',
    question: "부서별 평균 급여를 조회하되, 부서 이름도 함께 표시하시오. 평균 급여 내림차순 정렬하시오.",
    keyPoint: 'JOIN 후 GROUP BY d.department_name, d.department_id로 집계합니다.',
    sql: `SELECT d.department_id,
       d.department_name,
       ROUND(AVG(e.salary), 2) AS 평균급여
FROM   employees   e
JOIN   departments d ON e.department_id = d.department_id
GROUP BY d.department_id, d.department_name
ORDER BY AVG(e.salary) DESC;`,
    result:
`DEPARTMENT_ID  DEPARTMENT_NAME   평균급여
-------------  ----------------  --------
90             Executive         19333.33
20             Marketing         9500.00
...`,
  },

  // ─────────────────────────────────────────────────────────
  // Group 2: Oracle 전통 조인 구문
  // ─────────────────────────────────────────────────────────
  {
    id: 505, group: 2, groupTitle: 'Oracle 전통 조인 구문',
    question: 'Oracle 전통 구문(FROM t1, t2 WHERE ...)으로 직원 이름, 부서 이름, 도시를 조회하시오. 부서가 없는 직원은 제외합니다.',
    keyPoint: 'Oracle 전통 구문: FROM 절에 테이블 나열, WHERE 절에 조인 조건 작성. 결과는 ANSI JOIN과 동일합니다.',
    sql: `SELECT e.last_name,
       d.department_name,
       l.city
FROM   employees   e,
       departments d,
       locations   l
WHERE  e.department_id = d.department_id
AND    d.location_id   = l.location_id
ORDER BY l.city;`,
    result:
`LAST_NAME   DEPARTMENT_NAME   CITY
----------  ----------------  ----------
(ANSI JOIN과 동일한 결과)`,
  },
  {
    id: 506, group: 2, groupTitle: 'Oracle 전통 조인 구문',
    question: 'Oracle 전통 구문으로 부서가 없는 직원도 포함하여 직원 이름과 부서 이름을 조회하시오. (+) 구문을 사용하시오.',
    keyPoint: "Oracle (+): WHERE e.department_id = d.department_id(+) — (+)를 DEPARTMENTS 쪽(데이터 부족한 쪽)에 붙이면 LEFT OUTER JOIN과 동일합니다.",
    sql: `SELECT e.last_name,
       e.department_id,
       d.department_name
FROM   employees   e,
       departments d
WHERE  e.department_id = d.department_id(+)
ORDER BY e.department_id;`,
    result:
`LAST_NAME   DEPARTMENT_ID  DEPARTMENT_NAME
----------  -------------  ---------------
Grant       (NULL)         (NULL)
Whalen      10             Administration
...
(107행 반환 — Grant 포함)`,
  },
  {
    id: 507, group: 2, groupTitle: 'Oracle 전통 조인 구문',
    question: 'Oracle 전통 구문으로 직원이 없는 부서도 포함하여 부서 이름과 직원 수를 조회하시오. (+) 구문을 사용하시오.',
    keyPoint: "WHERE e.department_id(+) = d.department_id — (+)를 EMPLOYEES 쪽에 붙이면 RIGHT OUTER JOIN (DEPARTMENTS 기준) 과 동일합니다.",
    sql: `SELECT d.department_id,
       d.department_name,
       COUNT(e.employee_id) AS 직원수
FROM   employees   e,
       departments d
WHERE  e.department_id(+) = d.department_id
GROUP BY d.department_id, d.department_name
ORDER BY d.department_id;`,
    result:
`DEPARTMENT_ID  DEPARTMENT_NAME   직원수
-------------  ----------------  ------
10             Administration    1
20             Marketing         2
...
120            Treasury          0
...
(직원 없는 부서 포함 27행)`,
  },

  // ─────────────────────────────────────────────────────────
  // Group 3: NON-EQUIJOIN (비등가 조인)
  // ─────────────────────────────────────────────────────────
  {
    id: 508, group: 3, groupTitle: 'NON-EQUIJOIN (비등가 조인)',
    question: "직원 이름, 급여, 급여 등급(A~E)을 조회하시오. JOB_GRADES 테이블(grade, lowest_sal, highest_sal)과 BETWEEN으로 비등가 조인하시오. 급여 등급 오름차순 정렬하시오.",
    keyPoint: 'NON-EQUIJOIN: = 대신 BETWEEN ... AND를 사용합니다. JOB_GRADES는 HR 스키마에 없으므로 임시로 DUAL로 대체합니다.',
    sql: `-- JOB_GRADES 테이블이 있다고 가정한 표준 비등가 조인
SELECT e.last_name,
       e.salary,
       j.grade
FROM   employees  e
JOIN   job_grades j ON e.salary BETWEEN j.lowest_sal AND j.highest_sal
ORDER BY j.grade;

-- HR 스키마에서 실습 가능한 급여 구간 CASE 대체 버전
SELECT last_name,
       salary,
       CASE
         WHEN salary < 3000  THEN 'A'
         WHEN salary < 5000  THEN 'B'
         WHEN salary < 8000  THEN 'C'
         WHEN salary < 12000 THEN 'D'
         ELSE                     'E'
       END AS grade
FROM   employees
ORDER BY grade;`,
    result:
`LAST_NAME   SALARY  GRADE
----------  ------  -----
Vargas      2500    A
...
King        24000   E`,
  },
  {
    id: 509, group: 3, groupTitle: 'NON-EQUIJOIN (비등가 조인)',
    question: '직원의 급여가 부서 평균 급여의 1.2배 이상인 직원 이름, 부서 ID, 급여를 조회하시오. (인라인 뷰 + NON-EQUIJOIN 응용)',
    keyPoint: '인라인 뷰로 부서 평균 급여를 먼저 구하고, 직원 급여와 비교합니다.',
    sql: `SELECT e.last_name,
       e.department_id,
       e.salary,
       ROUND(d.avg_sal, 2) AS 부서평균급여
FROM   employees e
JOIN   (SELECT department_id,
               AVG(salary) AS avg_sal
        FROM   employees
        GROUP BY department_id) d
    ON  e.department_id = d.department_id
   AND  e.salary >= d.avg_sal * 1.2
ORDER BY e.department_id, e.salary DESC;`,
    result:
`LAST_NAME   DEPARTMENT_ID  SALARY  부서평균급여
----------  -------------  ------  ------------
(각 부서 평균의 1.2배 이상인 직원 목록)`,
  },
  {
    id: 510, group: 3, groupTitle: 'NON-EQUIJOIN (비등가 조인)',
    question: '직원 이름과 급여를 조회하되, 자신보다 급여가 높은 직원 수(rank)를 함께 표시하시오. (SELF 비등가 조인 응용)',
    keyPoint: '같은 테이블을 SELF JOIN하고, e2.salary > e1.salary 조건으로 자신보다 높은 사람 수를 카운트합니다.',
    sql: `SELECT e1.last_name,
       e1.salary,
       COUNT(e2.employee_id) AS 상위직원수
FROM   employees e1
LEFT   JOIN employees e2 ON e2.salary > e1.salary
GROUP BY e1.last_name, e1.salary
ORDER BY e1.salary DESC
FETCH FIRST 10 ROWS ONLY;`,
    result:
`LAST_NAME   SALARY  상위직원수
----------  ------  ----------
King        24000   0
Kochhar     17000   1
De Haan     17000   1
...`,
  },
  {
    id: 511, group: 3, groupTitle: 'NON-EQUIJOIN (비등가 조인)',
    question: "동일 부서 내에서 급여 차이가 5000 이상인 직원 쌍을 조회하시오. (SELF NON-EQUIJOIN)",
    keyPoint: 'e1.employee_id < e2.employee_id 조건으로 중복 쌍을 제거합니다.',
    sql: `SELECT e1.department_id,
       e1.last_name      AS 직원1,
       e1.salary         AS 급여1,
       e2.last_name      AS 직원2,
       e2.salary         AS 급여2,
       ABS(e1.salary - e2.salary) AS 급여차이
FROM   employees e1
JOIN   employees e2
    ON  e1.department_id  = e2.department_id
   AND  e1.employee_id    < e2.employee_id
   AND  ABS(e1.salary - e2.salary) >= 5000
ORDER BY e1.department_id, 급여차이 DESC;`,
    result:
`DEPARTMENT_ID  직원1      급여1   직원2    급여2   급여차이
-------------  ---------  ------  -------  ------  --------
20             Hartstein  13000   Fay      6000    7000
...`,
  },

  // ─────────────────────────────────────────────────────────
  // Group 4: OUTER JOIN
  // ─────────────────────────────────────────────────────────
  {
    id: 512, group: 4, groupTitle: 'OUTER JOIN',
    question: '모든 직원(부서 없는 직원 포함)의 이름과 부서 이름을 조회하시오. 부서가 없으면 부서 이름을 \'미배정\'으로 표시하시오.',
    keyPoint: "LEFT OUTER JOIN + NVL로 NULL 부서 이름을 '미배정'으로 변환합니다.",
    sql: `SELECT e.last_name,
       NVL(d.department_name, '미배정') AS 부서이름
FROM   employees   e
LEFT   JOIN departments d ON e.department_id = d.department_id
ORDER BY e.last_name;`,
    result:
`LAST_NAME   부서이름
----------  ----------------
Abel        Sales
Ande        Sales
...
Grant       미배정
...
(107행 반환)`,
  },
  {
    id: 513, group: 4, groupTitle: 'OUTER JOIN',
    question: '직원이 없는 부서도 포함하여 부서 이름과 직원 수를 조회하시오. RIGHT OUTER JOIN을 사용하시오.',
    keyPoint: 'RIGHT OUTER JOIN: 오른쪽 테이블(DEPARTMENTS)의 모든 행을 유지합니다. 직원이 없는 부서는 COUNT=0.',
    sql: `SELECT d.department_id,
       d.department_name,
       COUNT(e.employee_id) AS 직원수
FROM   employees   e
RIGHT  JOIN departments d ON e.department_id = d.department_id
GROUP BY d.department_id, d.department_name
ORDER BY d.department_id;`,
    result:
`DEPARTMENT_ID  DEPARTMENT_NAME   직원수
-------------  ----------------  ------
10             Administration    1
20             Marketing         2
...
120            Treasury          0
...
(27행 반환)`,
  },
  {
    id: 514, group: 4, groupTitle: 'OUTER JOIN',
    question: '직원이 없는 부서 목록만 조회하시오. OUTER JOIN 후 NULL 필터링 방법을 사용하시오.',
    keyPoint: 'RIGHT OUTER JOIN 후 WHERE e.employee_id IS NULL 조건으로 직원이 없는 부서만 필터링합니다.',
    sql: `SELECT d.department_id,
       d.department_name
FROM   employees   e
RIGHT  JOIN departments d ON e.department_id = d.department_id
WHERE  e.employee_id IS NULL
ORDER BY d.department_id;`,
    result:
`DEPARTMENT_ID  DEPARTMENT_NAME
-------------  -----------------------
120            Treasury
130            Corporate Tax
...
(직원 없는 부서 목록)`,
  },
  {
    id: 515, group: 4, groupTitle: 'OUTER JOIN',
    question: '부서가 없는 직원과 직원이 없는 부서를 모두 조회하시오. FULL OUTER JOIN을 사용하시오.',
    keyPoint: 'FULL OUTER JOIN: LEFT + RIGHT OUTER JOIN의 합집합. Oracle (+) 구문으로는 표현 불가 — ANSI 구문 필수입니다.',
    sql: `SELECT e.last_name,
       e.department_id        AS emp_dept_id,
       d.department_id        AS dept_id,
       d.department_name
FROM   employees   e
FULL   JOIN departments d ON e.department_id = d.department_id
WHERE  e.employee_id   IS NULL
OR     d.department_id IS NULL
ORDER BY e.last_name, d.department_id;`,
    result:
`LAST_NAME   EMP_DEPT_ID  DEPT_ID  DEPARTMENT_NAME
----------  -----------  -------  ---------------
Grant       (NULL)       (NULL)   (NULL)
(NULL)      (NULL)       120      Treasury
...`,
  },

  // ─────────────────────────────────────────────────────────
  // Group 5: SELF JOIN
  // ─────────────────────────────────────────────────────────
  {
    id: 516, group: 5, groupTitle: 'SELF JOIN',
    question: '직원 이름과 해당 직원의 관리자 이름을 조회하시오. 관리자가 없는 직원(King)은 제외합니다.',
    keyPoint: 'SELF JOIN: 같은 테이블을 두 별칭(e, m)으로 참조합니다. e.manager_id = m.employee_id 로 연결합니다.',
    sql: `SELECT e.last_name   AS 직원,
       m.last_name   AS 관리자
FROM   employees e
JOIN   employees m ON e.manager_id = m.employee_id
ORDER BY m.last_name, e.last_name;`,
    result:
`직원         관리자
-----------  -----------
Fay          Hartstein
Whalen       Kochhar
...
(106행 반환 — King 제외)`,
  },
  {
    id: 517, group: 5, groupTitle: 'SELF JOIN',
    question: '모든 직원과 관리자 이름을 조회하시오. 관리자가 없는 King도 포함하고, 관리자 이름이 없으면 \'최고 경영자\'로 표시하시오.',
    keyPoint: "LEFT OUTER JOIN + NVL: SELF JOIN에서도 OUTER JOIN을 사용할 수 있습니다.",
    sql: `SELECT e.last_name                       AS 직원,
       NVL(m.last_name, '최고 경영자')     AS 관리자
FROM   employees e
LEFT   JOIN employees m ON e.manager_id = m.employee_id
ORDER BY m.last_name NULLS LAST, e.last_name;`,
    result:
`직원         관리자
-----------  ----------
King         최고 경영자
...
(107행 반환 — King 포함)`,
  },
  {
    id: 518, group: 5, groupTitle: 'SELF JOIN',
    question: '같은 부서에서 근무하는 직원 쌍을 조회하시오. 동일인 쌍 제거, 중복 쌍 제거(A-B만, B-A 제외). 부서 ID와 직원 이름 오름차순 정렬하시오.',
    keyPoint: 'SELF JOIN + e1.employee_id < e2.employee_id 조건으로 중복 쌍을 제거합니다.',
    sql: `SELECT e1.department_id,
       e1.last_name AS 직원1,
       e2.last_name AS 직원2
FROM   employees e1
JOIN   employees e2
    ON  e1.department_id = e2.department_id
   AND  e1.employee_id   < e2.employee_id
ORDER BY e1.department_id, e1.last_name, e2.last_name;`,
    result:
`DEPARTMENT_ID  직원1     직원2
-------------  --------  --------
20             Fay       Hartstein
60             Austin    Ernst
60             Austin    Hunold
...`,
  },
  {
    id: 519, group: 5, groupTitle: 'SELF JOIN',
    question: '직원과 같은 직무(job_id)를 가진 다른 직원을 조회하시오. 동일인 제외, 직무별로 직원 쌍을 출력하시오.',
    keyPoint: 'SELF JOIN에서 e1.job_id = e2.job_id AND e1.employee_id != e2.employee_id 조건을 사용합니다.',
    sql: `SELECT e1.job_id,
       e1.last_name AS 직원1,
       e2.last_name AS 직원2
FROM   employees e1
JOIN   employees e2
    ON  e1.job_id       = e2.job_id
   AND  e1.employee_id  < e2.employee_id
WHERE  e1.job_id IN ('SA_REP', 'ST_CLERK')
ORDER BY e1.job_id, e1.last_name
FETCH FIRST 10 ROWS ONLY;`,
    result:
`JOB_ID    직원1    직원2
--------  -------  -------
SA_REP    Abel     Ande
SA_REP    Abel     Banda
...`,
  },

  // ─────────────────────────────────────────────────────────
  // Group 6: 다중 조인
  // ─────────────────────────────────────────────────────────
  {
    id: 520, group: 6, groupTitle: '다중 조인',
    question: '직원 이름, 직무 이름, 부서 이름, 근무 도시를 조회하시오. 4개 테이블(EMPLOYEES, JOBS, DEPARTMENTS, LOCATIONS)을 조인하시오.',
    keyPoint: '4테이블 조인: EMPLOYEES→JOBS, EMPLOYEES→DEPARTMENTS→LOCATIONS 경로로 3번 JOIN합니다.',
    sql: `SELECT e.last_name,
       j.job_title,
       d.department_name,
       l.city
FROM   employees   e
JOIN   jobs        j ON e.job_id        = j.job_id
JOIN   departments d ON e.department_id = d.department_id
JOIN   locations   l ON d.location_id   = l.location_id
ORDER BY l.city, d.department_name, e.last_name;`,
    result:
`LAST_NAME   JOB_TITLE               DEPARTMENT_NAME   CITY
----------  ----------------------  ----------------  -------
Gietz       Accounting Manager      Accounting        Seattle
Higgins     Public Accountant       Accounting        Seattle
...`,
  },
  {
    id: 521, group: 6, groupTitle: '다중 조인',
    question: '국가별 직원 수와 평균 급여를 조회하시오. EMPLOYEES → DEPARTMENTS → LOCATIONS → COUNTRIES를 조인하시오.',
    keyPoint: '5테이블 경로: e.department_id → d → l.location_id → l → c.country_id.',
    sql: `SELECT c.country_name,
       COUNT(e.employee_id)     AS 직원수,
       ROUND(AVG(e.salary), 2)  AS 평균급여
FROM   employees   e
JOIN   departments d ON e.department_id = d.department_id
JOIN   locations   l ON d.location_id   = l.location_id
JOIN   countries   c ON l.country_id    = c.country_id
GROUP BY c.country_name
ORDER BY COUNT(e.employee_id) DESC;`,
    result:
`COUNTRY_NAME           직원수  평균급여
---------------------  ------  --------
United States of America  104  6586.68
...`,
  },
  {
    id: 522, group: 6, groupTitle: '다중 조인',
    question: '부서별 관리자 이름과 직원 수, 평균 급여를 조회하시오. EMPLOYEES(직원), DEPARTMENTS, EMPLOYEES(관리자)를 사용하시오.',
    keyPoint: 'DEPARTMENTS.manager_id → EMPLOYEES.employee_id 로 관리자 이름을 가져옵니다.',
    sql: `SELECT d.department_name,
       m.last_name              AS 관리자,
       COUNT(e.employee_id)     AS 직원수,
       ROUND(AVG(e.salary), 2)  AS 평균급여
FROM   departments d
JOIN   employees   m ON d.manager_id    = m.employee_id
JOIN   employees   e ON e.department_id = d.department_id
GROUP BY d.department_name, m.last_name
ORDER BY d.department_name;`,
    result:
`DEPARTMENT_NAME   관리자    직원수  평균급여
----------------  --------  ------  --------
Accounting        Higgins   2       8300.00
Administration    Whalen    1       4400.00
...`,
  },
  {
    id: 523, group: 6, groupTitle: '다중 조인',
    question: "직원 이름, 부서 이름, 도시를 조회하되 도시가 'Seattle'인 직원만 포함하시오. 부서가 없는 직원도 포함하시오.",
    keyPoint: 'LEFT OUTER JOIN + WHERE 조건 조합. OUTER JOIN에서 WHERE 필터는 조인 후 적용됩니다.',
    sql: `SELECT e.last_name,
       d.department_name,
       l.city
FROM   employees   e
LEFT   JOIN departments d ON e.department_id = d.department_id
LEFT   JOIN locations   l ON d.location_id   = l.location_id
WHERE  l.city = 'Seattle'
   OR  e.department_id IS NULL
ORDER BY e.last_name;`,
    result:
`LAST_NAME   DEPARTMENT_NAME   CITY
----------  ----------------  -------
Gietz       Accounting        Seattle
Grant       (NULL)            (NULL)
Higgins     Accounting        Seattle`,
  },

  // ─────────────────────────────────────────────────────────
  // Group 7: 종합
  // ─────────────────────────────────────────────────────────
  {
    id: 524, group: 7, groupTitle: '종합',
    question: '부서별 직원 수, 평균 급여, 최고 급여자 이름을 한 번에 조회하시오. 직원이 없는 부서도 포함하고, 평균 급여 내림차순 정렬하시오.',
    keyPoint: 'OUTER JOIN + 집계 함수 + 서브쿼리 조합. 최고 급여자는 상관 서브쿼리로 조회합니다.',
    sql: `SELECT d.department_name,
       COUNT(e.employee_id)     AS 직원수,
       ROUND(AVG(e.salary), 2)  AS 평균급여,
       MAX(e.salary)            AS 최고급여,
       (SELECT last_name
        FROM   employees
        WHERE  department_id = d.department_id
        AND    salary = MAX(e.salary)
        AND    ROWNUM = 1)       AS 최고급여자
FROM   departments d
LEFT   JOIN employees e ON e.department_id = d.department_id
GROUP BY d.department_id, d.department_name
ORDER BY AVG(e.salary) DESC NULLS LAST;`,
    result:
`DEPARTMENT_NAME   직원수  평균급여   최고급여  최고급여자
----------------  ------  ---------  --------  ----------
Executive         3       19333.33   24000     King
Marketing         2       9500.00    13000     Hartstein
...`,
  },
  {
    id: 525, group: 7, groupTitle: '종합',
    question: "직원 이름, 관리자 이름, 부서 이름, 도시를 조회하시오. 관리자가 없는 직원도 포함하고, 부서가 없는 직원은 제외하시오.",
    keyPoint: 'SELF JOIN(LEFT) + INNER JOIN 혼합: 관리자는 LEFT JOIN, 부서·위치는 INNER JOIN을 사용합니다.',
    sql: `SELECT e.last_name                     AS 직원,
       NVL(m.last_name, '최고경영자')    AS 관리자,
       d.department_name               AS 부서,
       l.city                          AS 도시
FROM   employees   e
LEFT   JOIN employees   m ON e.manager_id    = m.employee_id
JOIN   departments  d ON e.department_id = d.department_id
JOIN   locations    l ON d.location_id   = l.location_id
ORDER BY l.city, d.department_name, e.last_name;`,
    result:
`직원        관리자     부서          도시
----------  ---------  ------------  -------
Gietz       Higgins    Accounting    Seattle
Higgins     Kochhar    Accounting    Seattle
...
(106행 반환 — 부서 없는 Grant 제외)`,
  },
  {
    id: 526, group: 7, groupTitle: '종합',
    question: '부서별 입사 연도별 직원 수를 조회하시오. 부서 이름과 입사 연도로 집계하고, 직원이 없는 부서는 제외합니다. 부서 이름·연도 오름차순 정렬하시오.',
    keyPoint: 'JOIN + GROUP BY 다중 컬럼 + TO_CHAR(hire_date) 조합.',
    sql: `SELECT d.department_name,
       TO_CHAR(e.hire_date, 'YYYY') AS 입사연도,
       COUNT(*)                     AS 직원수
FROM   employees   e
JOIN   departments d ON e.department_id = d.department_id
GROUP BY d.department_name, TO_CHAR(e.hire_date, 'YYYY')
ORDER BY d.department_name, TO_CHAR(e.hire_date, 'YYYY');`,
    result:
`DEPARTMENT_NAME   입사연도  직원수
----------------  --------  ------
Accounting        1994      1
Accounting        1999      1
Administration    1987      1
...`,
  },
  {
    id: 527, group: 7, groupTitle: '종합',
    question: '같은 직무(job_id)를 가진 직원들의 급여 차이가 10000 이상인 쌍을 조회하시오. 직무 이름도 함께 출력하시오.',
    keyPoint: 'SELF JOIN(NON-EQUIJOIN) + INNER JOIN with JOBS 테이블 — 다중 조인과 비등가 조인 응용.',
    sql: `SELECT j.job_title,
       e1.last_name         AS 직원1,
       e1.salary            AS 급여1,
       e2.last_name         AS 직원2,
       e2.salary            AS 급여2,
       e1.salary - e2.salary AS 급여차이
FROM   employees e1
JOIN   employees e2
    ON  e1.job_id      = e2.job_id
   AND  e1.employee_id < e2.employee_id
   AND  e1.salary - e2.salary >= 10000
JOIN   jobs j ON e1.job_id = j.job_id
ORDER BY j.job_title, 급여차이 DESC;`,
    result:
`JOB_TITLE               직원1     급여1   직원2    급여2   급여차이
----------------------  --------  ------  -------  ------  --------
Sales Manager           ...       14000   ...       10000   4000
...`,
  },
  {
    id: 528, group: 7, groupTitle: '종합',
    question: '직원 이름, 급여, 부서 평균 급여, 전체 평균 급여를 한 번에 조회하시오. 자신이 부서 평균보다 높은지 여부도 표시하시오.',
    keyPoint: '인라인 뷰로 부서별 평균 급여를 계산 후 JOIN, 전체 평균은 스칼라 서브쿼리나 CROSS JOIN으로 조회합니다.',
    sql: `SELECT e.last_name,
       e.salary,
       ROUND(da.avg_sal,  2)  AS 부서평균급여,
       ROUND(ta.total_avg, 2) AS 전체평균급여,
       CASE WHEN e.salary > da.avg_sal THEN 'Y' ELSE 'N' END AS 부서평균초과
FROM   employees e
JOIN  (SELECT department_id, AVG(salary) AS avg_sal
       FROM   employees
       GROUP BY department_id) da
    ON  e.department_id = da.department_id
CROSS JOIN
      (SELECT AVG(salary) AS total_avg FROM employees) ta
ORDER BY e.salary DESC
FETCH FIRST 10 ROWS ONLY;`,
    result:
`LAST_NAME   SALARY  부서평균급여  전체평균급여  부서평균초과
----------  ------  ------------  ------------  ----------
King        24000   19333.33      6461.83       Y
Kochhar     17000   19333.33      6461.83       N
...`,
  },
]
