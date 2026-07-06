import type { PracticeProblem } from '@/lib/types'

export const ch07Practice: PracticeProblem[] = [

  // ─────────────────────────────────────────────────────────
  // Group 1: UNION / UNION ALL
  // ─────────────────────────────────────────────────────────
  {
    id: 701, group: 1, groupTitle: 'UNION / UNION ALL',
    question: "EMPLOYEES 테이블의 job_id와 JOB_HISTORY 테이블의 job_id를 합쳐 고유한 직무 목록을 출력하시오. (중복 제거, job_id 오름차순)",
    keyPoint: 'UNION은 중복을 제거한 합집합. ORDER BY는 복합 쿼리 맨 끝에 한 번만 사용.',
    sql: `SELECT job_id
FROM   employees
UNION
SELECT job_id
FROM   job_history
ORDER BY job_id;`,
    result:
`JOB_ID
-----------
AC_ACCOUNT
AC_MGR
AD_ASST
AD_PRES
...
(19개 행)`,
  },
  {
    id: 702, group: 1, groupTitle: 'UNION / UNION ALL',
    question: "EMPLOYEES의 job_id와 JOB_HISTORY의 job_id를 합쳐 중복 포함 전체 목록을 출력하시오. (job_id 오름차순)",
    keyPoint: 'UNION ALL은 중복을 제거하지 않는다. employees 107행 + job_history 10행 = 117행.',
    sql: `SELECT job_id
FROM   employees
UNION ALL
SELECT job_id
FROM   job_history
ORDER BY job_id;`,
    result:
`JOB_ID
-----------
AC_ACCOUNT
AC_MGR
AD_ASST
AD_PRES
AD_VP
AD_VP
...
(117개 행, 중복 포함)`,
  },
  {
    id: 703, group: 1, groupTitle: 'UNION / UNION ALL',
    question: "EMPLOYEES 테이블의 department_id와 DEPARTMENTS 테이블의 department_id를 UNION으로 합쳐 고유 부서 번호 목록을 출력하시오. (department_id 오름차순)",
    keyPoint: 'EMPLOYEES의 NULL department_id를 IS NOT NULL로 제외. UNION이 중복 자동 제거.',
    sql: `SELECT department_id
FROM   employees
WHERE  department_id IS NOT NULL
UNION
SELECT department_id
FROM   departments
ORDER BY department_id;`,
    result:
`DEPARTMENT_ID
-------------
           10
           20
           30
           ...
          270
(27개 행)`,
  },
  {
    id: 704, group: 1, groupTitle: 'UNION / UNION ALL',
    question: "EMPLOYEES 테이블에서 부서 20, 30, 40에 근무하는 사원의 last_name, department_id를 각각 조회하여 UNION ALL로 합치시오. (중복 포함 전체 출력, department_id 오름차순)",
    keyPoint: '세 개의 SELECT를 UNION ALL로 연결. ORDER BY는 마지막에 한 번만.',
    sql: `SELECT last_name, department_id
FROM   employees
WHERE  department_id = 20
UNION ALL
SELECT last_name, department_id
FROM   employees
WHERE  department_id = 30
UNION ALL
SELECT last_name, department_id
FROM   employees
WHERE  department_id = 40
ORDER BY department_id;`,
    result:
`LAST_NAME        DEPARTMENT_ID
---------------- -------------
Hartstein                   20
Fay                         20
Raphaely                    30
...
(9개 행, 중복 포함)`,
  },
  {
    id: 705, group: 1, groupTitle: 'UNION / UNION ALL',
    question: "집합 A(job_id='SA_REP'인 사원의 employee_id, last_name, salary)와 집합 B(job_id='IT_PROG'인 사원의 employee_id, last_name, salary)를 UNION으로 결합하시오. (salary 내림차순)",
    keyPoint: 'UNION은 동일한 테이블의 서로 다른 조건으로도 사용 가능. salary DESC 정렬.',
    sql: `SELECT employee_id, last_name, salary
FROM   employees
WHERE  job_id = 'SA_REP'
UNION
SELECT employee_id, last_name, salary
FROM   employees
WHERE  job_id = 'IT_PROG'
ORDER BY salary DESC;`,
    result:
`EMPLOYEE_ID LAST_NAME        SALARY
----------- ---------------- ------
        150 Tucker            10000
        151 Bernstein          9500
        156 King               9000
...
(34개 행)`,
  },
  {
    id: 706, group: 1, groupTitle: 'UNION / UNION ALL',
    question: "현재와 과거의 직무-부서 조합을 고유하게 출력하시오. (EMPLOYEES: employee_id, job_id, department_id / JOB_HISTORY: employee_id, job_id, department_id, employee_id 오름차순)",
    keyPoint: 'UNION이 두 테이블의 (employee_id, job_id, department_id) 조합의 중복을 제거.',
    sql: `SELECT employee_id, job_id, department_id
FROM   employees
WHERE  department_id IS NOT NULL
UNION
SELECT employee_id, job_id, department_id
FROM   job_history
ORDER BY employee_id;`,
    result:
`EMPLOYEE_ID JOB_ID      DEPARTMENT_ID
----------- ----------- -------------
        100 AD_PRES                90
        101 AC_ACCOUNT            110
        101 AC_MGR                110
        101 AD_VP                  90
...`,
  },

  // ─────────────────────────────────────────────────────────
  // Group 2: INTERSECT
  // ─────────────────────────────────────────────────────────
  {
    id: 707, group: 2, groupTitle: 'INTERSECT',
    question: "EMPLOYEES와 JOB_HISTORY 테이블에서 공통으로 나타나는 employee_id를 조회하시오. (직무 변경 이력이 있는 사원, employee_id 오름차순)",
    keyPoint: 'INTERSECT는 교집합. 두 테이블 모두에 존재하는 employee_id만 반환.',
    sql: `SELECT employee_id
FROM   employees
INTERSECT
SELECT employee_id
FROM   job_history
ORDER BY employee_id;`,
    result:
`EMPLOYEE_ID
-----------
        101
        102
        114
        122
        176
        200
        201
        202
(10개 행)`,
  },
  {
    id: 708, group: 2, groupTitle: 'INTERSECT',
    question: "EMPLOYEES와 JOB_HISTORY 양쪽 모두에 존재하는 (employee_id, job_id) 조합을 출력하시오. (현재 직무와 과거 직무가 동일한 경우, employee_id 오름차순)",
    keyPoint: '다중 열 INTERSECT: (employee_id, job_id) 조합이 두 테이블 모두에 있는 경우.',
    sql: `SELECT employee_id, job_id
FROM   employees
INTERSECT
SELECT employee_id, job_id
FROM   job_history
ORDER BY employee_id;`,
    result:
`EMPLOYEE_ID JOB_ID
----------- -----------
        176 SA_REP
(1개 행)`,
  },
  {
    id: 709, group: 2, groupTitle: 'INTERSECT',
    question: "EMPLOYEES와 DEPARTMENTS 테이블에서 공통으로 나타나는 department_id를 조회하시오. (두 테이블 모두에 존재하는 부서 번호, 오름차순)",
    keyPoint: 'EMPLOYEES의 NULL 부서 제외 후 INTERSECT. 사원이 소속된 부서이면서 DEPARTMENTS에 존재하는 부서.',
    sql: `SELECT department_id
FROM   employees
WHERE  department_id IS NOT NULL
INTERSECT
SELECT department_id
FROM   departments
ORDER BY department_id;`,
    result:
`DEPARTMENT_ID
-------------
           10
           20
           30
           40
           50
           60
           70
           80
           90
          100
          110
(11개 행)`,
  },
  {
    id: 710, group: 2, groupTitle: 'INTERSECT',
    question: "EMPLOYEES 테이블에서 부서 50 또는 80에 근무하는 사원의 job_id와, JOB_HISTORY의 job_id가 공통으로 나타나는 job_id를 조회하시오. (INTERSECT 사용, job_id 오름차순)",
    keyPoint: 'WHERE로 특정 부서 필터링 후 INTERSECT. 현직 직무와 JOB_HISTORY 직무의 교집합.',
    sql: `SELECT job_id
FROM   employees
WHERE  department_id IN (50, 80)
INTERSECT
SELECT job_id
FROM   job_history
ORDER BY job_id;`,
    result:
`JOB_ID
-----------
SA_REP
SH_CLERK
ST_CLERK
(3개 행)`,
  },
  {
    id: 711, group: 2, groupTitle: 'INTERSECT',
    question: "집합 A(EMPLOYEES에서 salary >= 8000인 사원의 employee_id)와 집합 B(JOB_HISTORY에 이력이 있는 사원의 employee_id)의 교집합을 구하시오. (employee_id 오름차순)",
    keyPoint: '고연봉이면서 직무 변경 이력도 있는 사원 = INTERSECT.',
    sql: `SELECT employee_id
FROM   employees
WHERE  salary >= 8000
INTERSECT
SELECT employee_id
FROM   job_history
ORDER BY employee_id;`,
    result:
`EMPLOYEE_ID
-----------
        101
        102
        114
        201
(4개 행)`,
  },
  {
    id: 712, group: 2, groupTitle: 'INTERSECT',
    question: "EMPLOYEES와 JOB_HISTORY에서 공통 department_id를 조회하시오. (두 테이블 모두에 나타나는 부서 번호, 오름차순)",
    keyPoint: 'EMPLOYEES와 JOB_HISTORY 양쪽에서 사용된 부서 번호의 교집합.',
    sql: `SELECT department_id
FROM   employees
WHERE  department_id IS NOT NULL
INTERSECT
SELECT department_id
FROM   job_history
ORDER BY department_id;`,
    result:
`DEPARTMENT_ID
-------------
           20
           50
           60
           80
           90
          100
          110
(7개 행)`,
  },

  // ─────────────────────────────────────────────────────────
  // Group 3: MINUS
  // ─────────────────────────────────────────────────────────
  {
    id: 713, group: 3, groupTitle: 'MINUS',
    question: "EMPLOYEES에는 있지만 JOB_HISTORY에는 없는 employee_id를 조회하시오. (직무 변경 이력이 없는 사원, employee_id 오름차순)",
    keyPoint: 'MINUS = 첫 쿼리에만 있는 행. 직무 변경 없이 현직무가 처음인 사원.',
    sql: `SELECT employee_id
FROM   employees
MINUS
SELECT employee_id
FROM   job_history
ORDER BY employee_id;`,
    result:
`EMPLOYEE_ID
-----------
        100
        103
        104
        107
...
(97개 행)`,
  },
  {
    id: 714, group: 3, groupTitle: 'MINUS',
    question: "JOB_HISTORY에는 있지만 현재 EMPLOYEES에는 없는 employee_id를 조회하시오. (JOB_HISTORY 기준 employee_id 오름차순)",
    keyPoint: 'JOB_HISTORY MINUS EMPLOYEES = 퇴직자. HR 스키마에서는 모두 현직이므로 0행.',
    sql: `SELECT employee_id
FROM   job_history
MINUS
SELECT employee_id
FROM   employees
ORDER BY employee_id;`,
    result:
`EMPLOYEE_ID
-----------
(결과 없음 — JOB_HISTORY의 모든 employee_id가 현재도 재직 중)`,
  },
  {
    id: 715, group: 3, groupTitle: 'MINUS',
    question: "DEPARTMENTS에는 있지만 EMPLOYEES에는 소속 사원이 없는 department_id를 조회하시오. (빈 부서 번호, department_id 오름차순)",
    keyPoint: 'DEPARTMENTS MINUS EMPLOYEES = 빈 부서. IS NOT NULL 필터로 NULL 행 제외.',
    sql: `SELECT department_id
FROM   departments
MINUS
SELECT department_id
FROM   employees
WHERE  department_id IS NOT NULL
ORDER BY department_id;`,
    result:
`DEPARTMENT_ID
-------------
          120
          130
          140
          ...
          270
(16개 행)`,
  },
  {
    id: 716, group: 3, groupTitle: 'MINUS',
    question: "관리자가 아닌 사원의 employee_id를 출력하시오. (MINUS 사용, IS NOT NULL 필터 포함, employee_id 오름차순)",
    keyPoint: 'EMPLOYEES employee_id MINUS manager_id(IS NOT NULL). MINUS는 NULL을 자동 제외하므로 IS NOT NULL 명시 권장.',
    sql: `SELECT employee_id
FROM   employees
MINUS
SELECT manager_id
FROM   employees
WHERE  manager_id IS NOT NULL
ORDER BY employee_id;`,
    result:
`EMPLOYEE_ID
-----------
        103
        104
        107
        109
...
(89개 행)`,
  },
  {
    id: 717, group: 3, groupTitle: 'MINUS',
    question: "EMPLOYEES의 job_id 목록에서 JOB_HISTORY에 나타난 적 있는 job_id를 제거하여, JOB_HISTORY에 한 번도 등장하지 않은 현직 job_id를 출력하시오. (job_id 오름차순)",
    keyPoint: 'EMPLOYEES job_id MINUS JOB_HISTORY job_id = 이력에 없는 현직 직무.',
    sql: `SELECT job_id
FROM   employees
MINUS
SELECT job_id
FROM   job_history
ORDER BY job_id;`,
    result:
`JOB_ID
-----------
AD_PRES
HR_REP
MK_REP
PR_REP
PU_MAN
SA_MAN
SH_CLERK
ST_MAN
(8개 행)`,
  },
  {
    id: 718, group: 3, groupTitle: 'MINUS',
    question: "EMPLOYEES 부서 90의 사원 employee_id 집합에서 EMPLOYEES 부서 80의 manager_id 집합을 제거하여, 부서 90 사원 중 부서 80의 관리자가 아닌 사원의 employee_id를 출력하시오.",
    keyPoint: '부서 90 사원: 100,101,102. 부서 80 관리자: 100,101,... MINUS 후 102만 남음.',
    sql: `SELECT employee_id
FROM   employees
WHERE  department_id = 90
MINUS
SELECT manager_id
FROM   employees
WHERE  department_id = 80
AND    manager_id IS NOT NULL
ORDER BY employee_id;`,
    result:
`EMPLOYEE_ID
-----------
        102
(1개 행)`,
  },

  // ─────────────────────────────────────────────────────────
  // Group 4: 열 일치 · ORDER BY
  // ─────────────────────────────────────────────────────────
  {
    id: 719, group: 4, groupTitle: '열 일치 · ORDER BY',
    question: "두 집합을 UNION으로 결합하되 열 개수와 타입을 맞추시오. (집합 A: EMPLOYEES의 employee_id, last_name, hire_date / 집합 B: JOB_HISTORY의 employee_id, job_id, start_date, employee_id 오름차순)",
    keyPoint: 'hire_date와 start_date가 모두 DATE 타입이므로 변환 불필요. 열 이름은 첫 쿼리 기준.',
    sql: `SELECT employee_id, last_name, hire_date
FROM   employees
UNION
SELECT employee_id, job_id, start_date
FROM   job_history
ORDER BY employee_id;`,
    result:
`EMPLOYEE_ID LAST_NAME/JOB_ID    HIRE_DATE
----------- ------------------- ----------
        100 King                 17-JUN-87
        101 Kochhar              21-SEP-89
        101 AC_ACCOUNT           28-OCT-97
        101 AC_MGR               28-OCT-97
...`,
  },
  {
    id: 720, group: 4, groupTitle: '열 일치 · ORDER BY',
    question: "두 집합을 UNION으로 결합하여 location_id와 관련 정보를 출력하시오. (집합 A: DEPARTMENTS의 location_id, department_name \"Name\", TO_CHAR(NULL) \"City\" / 집합 B: LOCATIONS의 location_id, TO_CHAR(NULL) \"Name\", city, location_id 오름차순)",
    keyPoint: 'TO_CHAR(NULL)로 없는 열 자리를 채워 열 개수/타입 일치. 별칭은 첫 쿼리 기준.',
    sql: `SELECT location_id, department_name "Name", TO_CHAR(NULL) "City"
FROM   departments
UNION
SELECT location_id, TO_CHAR(NULL) "Name", city
FROM   locations
ORDER BY location_id;`,
    result:
`LOCATION_ID Name                           City
----------- ------------------------------ --------
       1000                                Roma
       1100                                Venice
       ...
       1700 Accounting
       1700 Administration
...`,
  },
  {
    id: 721, group: 4, groupTitle: '열 일치 · ORDER BY',
    question: "EMPLOYEES의 job_id와 JOBS 테이블의 job_id를 UNION으로 결합하되, 두 번째 열로 각각 'EMPLOYEE' / 'MASTER'라는 구분 레이블을 추가하시오. (job_id 오름차순)",
    keyPoint: "리터럴 상수를 두 번째 열로 추가하여 출처 구분. 별칭은 첫 번째 쿼리에만 지정.",
    sql: `SELECT job_id, 'EMPLOYEE' AS "SOURCE"
FROM   employees
UNION
SELECT job_id, 'MASTER'
FROM   jobs
ORDER BY job_id;`,
    result:
`JOB_ID       SOURCE
----------- --------
AC_ACCOUNT   EMPLOYEE
AC_ACCOUNT   MASTER
AC_MGR       EMPLOYEE
AC_MGR       MASTER
...`,
  },
  {
    id: 722, group: 4, groupTitle: '열 일치 · ORDER BY',
    question: "다음 세 집합을 UNION ALL로 결합하고 salary 내림차순으로 정렬하시오. (부서 90 사원 / 부서 80 관리자(job_id='SA_MAN') / 부서 100 사원의 employee_id, last_name, salary)",
    keyPoint: 'UNION ALL로 세 집합 결합. 중복 포함 허용. ORDER BY salary DESC는 마지막에.',
    sql: `SELECT employee_id, last_name, salary
FROM   employees
WHERE  department_id = 90
UNION ALL
SELECT employee_id, last_name, salary
FROM   employees
WHERE  job_id = 'SA_MAN'
UNION ALL
SELECT employee_id, last_name, salary
FROM   employees
WHERE  department_id = 100
ORDER BY salary DESC;`,
    result:
`EMPLOYEE_ID LAST_NAME        SALARY
----------- ---------------- ------
        100 King              24000
        101 Kochhar           17000
        102 De Haan           17000
        145 Russell           14000
...`,
  },
  {
    id: 723, group: 4, groupTitle: '열 일치 · ORDER BY',
    question: "EMPLOYEES와 JOB_HISTORY에서 job_id를 UNION으로 합치되, 두 번째 열로 각각 COUNT(*)를 추가하고 결과를 두 번째 열의 내림차순으로 정렬하시오.",
    keyPoint: 'GROUP BY + UNION으로 집계 후 합치기. ORDER BY 2 DESC로 두 번째 열 기준 정렬.',
    sql: `SELECT job_id, COUNT(*) AS cnt
FROM   employees
GROUP BY job_id
UNION
SELECT job_id, COUNT(*) AS cnt
FROM   job_history
GROUP BY job_id
ORDER BY 2 DESC;`,
    result:
`JOB_ID       CNT
----------- ----
SA_REP        30
ST_CLERK      20
SH_CLERK      20
...`,
  },
  {
    id: 724, group: 4, groupTitle: '열 일치 · ORDER BY',
    question: "UNION을 사용하여 두 집합을 결합하고, 열 이름을 'EMP_ID', 'POSITION', 'DEPT' 형식으로 출력하시오. (집합 A: EMPLOYEES의 employee_id, job_id, department_id (IS NOT NULL) / 집합 B: JOB_HISTORY의 employee_id, job_id, department_id, employee_id 오름차순)",
    keyPoint: '별칭은 첫 번째 SELECT에만 지정하면 전체 결과에 적용. 두 번째 쿼리는 별칭 불필요.',
    sql: `SELECT employee_id AS "EMP_ID", job_id AS "POSITION", department_id AS "DEPT"
FROM   employees
WHERE  department_id IS NOT NULL
UNION
SELECT employee_id, job_id, department_id
FROM   job_history
ORDER BY employee_id;`,
    result:
`EMP_ID POSITION    DEPT
------ ----------- ----
   100 AD_PRES       90
   101 AC_ACCOUNT   110
   101 AC_MGR       110
   101 AD_VP         90
...`,
  },

  // ─────────────────────────────────────────────────────────
  // Group 5: 종합 응용
  // ─────────────────────────────────────────────────────────
  {
    id: 725, group: 5, groupTitle: '종합 응용',
    question: "현재 EMPLOYEES에서 salary > 10000인 사원의 employee_id 목록에서 JOB_HISTORY에 이력이 있는 employee_id를 제거하여, 고연봉이면서 직무 변경이 없었던 사원의 employee_id를 출력하시오. (employee_id 오름차순)",
    keyPoint: 'salary > 10000 MINUS JOB_HISTORY = 고연봉 + 직무 변경 없음.',
    sql: `SELECT employee_id
FROM   employees
WHERE  salary > 10000
MINUS
SELECT employee_id
FROM   job_history
ORDER BY employee_id;`,
    result:
`EMPLOYEE_ID
-----------
        100
        108
        145
        146
        168
        174
(6개 행)`,
  },
  {
    id: 726, group: 5, groupTitle: '종합 응용',
    question: "JOB_HISTORY에 이력이 있는 사원 중, 현재 EMPLOYEES에서 salary >= 10000인 사원의 employee_id를 출력하시오. (INTERSECT 사용, employee_id 오름차순)",
    keyPoint: 'JOB_HISTORY INTERSECT (salary >= 10000인 EMPLOYEES) = 이력 있고 고연봉인 사원.',
    sql: `SELECT employee_id
FROM   job_history
INTERSECT
SELECT employee_id
FROM   employees
WHERE  salary >= 10000
ORDER BY employee_id;`,
    result:
`EMPLOYEE_ID
-----------
        101
        102
        201
(3개 행)`,
  },
]
