import type { PracticeProblem } from '@/lib/types'

export const ch01Practice: PracticeProblem[] = [

  // ─────────────────────────────────────────────────────────
  // Group 1: 기본 SELECT — 전체·특정 컬럼 조회
  // ─────────────────────────────────────────────────────────
  {
    id: 101, group: 1, groupTitle: '기본 SELECT 구조',
    question: 'EMPLOYEES 테이블의 모든 컬럼과 모든 행을 조회하시오.',
    keyPoint: 'SELECT * FROM table_name — Oracle에서는 FROM 절이 반드시 필요합니다.',
    sql: `SELECT *
FROM   employees;`,
    result:
`EMPLOYEE_ID FIRST_NAME  LAST_NAME   EMAIL    ...
----------- ----------- ----------- -------- ---
        100 Steven      King        SKING    ...
        101 Neena       Kochhar     NKOCHHAR ...
       (107개 행)`,
  },
  {
    id: 102, group: 1, groupTitle: '기본 SELECT 구조',
    question: 'EMPLOYEES 테이블에서 employee_id, first_name, last_name, salary 컬럼만 조회하시오.',
    keyPoint: '필요한 컬럼만 명시하면 SELECT *보다 성능이 좋고, 테이블 변경 시 안전합니다.',
    sql: `SELECT employee_id, first_name, last_name, salary
FROM   employees;`,
    result:
`EMPLOYEE_ID FIRST_NAME  LAST_NAME   SALARY
----------- ----------- ----------- ------
        100 Steven      King         24000
        101 Neena       Kochhar      17000
        102 Lex         De Haan      17000
       (107개 행)`,
  },
  {
    id: 103, group: 1, groupTitle: '기본 SELECT 구조',
    question: 'DEPARTMENTS 테이블의 모든 컬럼을 조회하시오.',
    keyPoint: 'HR 스키마의 DEPARTMENTS 테이블: department_id, department_name, manager_id, location_id.',
    sql: `SELECT *
FROM   departments;`,
    result:
`DEPARTMENT_ID DEPARTMENT_NAME  MANAGER_ID LOCATION_ID
------------- ---------------- ---------- -----------
           10 Administration          200        1700
           20 Marketing               201        1800
           30 Purchasing              114        1700
          ...(27개 행)`,
  },
  {
    id: 104, group: 1, groupTitle: '기본 SELECT 구조',
    question: 'JOBS 테이블에서 job_id, job_title 컬럼을 조회하시오.',
    keyPoint: 'JOBS 테이블에는 직무 코드와 최저/최고 급여 범위가 포함되어 있습니다.',
    sql: `SELECT job_id, job_title
FROM   jobs;`,
    result:
`JOB_ID     JOB_TITLE
---------- -----------------------------------
AD_PRES    President
AD_VP      Administration Vice President
AD_ASST    Administration Assistant
          ...(19개 행)`,
  },
  {
    id: 105, group: 1, groupTitle: '기본 SELECT 구조',
    question: 'ROWNUM을 활용하여 EMPLOYEES 테이블에서 처음 5개 행만 조회하시오.',
    keyPoint: 'WHERE ROWNUM <= N 은 Oracle 전통적 행 제한 방법입니다. MySQL의 LIMIT N 대신 사용합니다.',
    sql: `SELECT employee_id, first_name, last_name
FROM   employees
WHERE  ROWNUM <= 5;`,
    result:
`EMPLOYEE_ID FIRST_NAME  LAST_NAME
----------- ----------- -----------
        100 Steven      King
        101 Neena       Kochhar
        102 Lex         De Haan
        103 Alexander   Hunold
        104 Bruce       Ernst`,
  },

  // ─────────────────────────────────────────────────────────
  // Group 2: 산술 연산자
  // ─────────────────────────────────────────────────────────
  {
    id: 106, group: 2, groupTitle: '산술 연산자',
    question: 'EMPLOYEES 테이블에서 employee_id, last_name, salary, 연봉(salary * 12)을 조회하시오 (처음 5행).',
    keyPoint: 'Oracle에서 NUMBER 컬럼에 직접 사칙연산을 적용할 수 있습니다.',
    sql: `SELECT employee_id, last_name, salary, salary * 12
FROM   employees
WHERE  ROWNUM <= 5;`,
    result:
`EMPLOYEE_ID LAST_NAME   SALARY SALARY*12
----------- ----------- ------ ---------
        100 King         24000    288000
        101 Kochhar      17000    204000
        102 De Haan      17000    204000
        103 Hunold        9000    108000
        104 Ernst         6000     72000`,
  },
  {
    id: 107, group: 2, groupTitle: '산술 연산자',
    question: 'EMPLOYEES 테이블에서 last_name, salary, salary + 300 을 조회하시오 (처음 5행).',
    keyPoint: '덧셈 연산자는 곱셈/나눗셈보다 우선순위가 낮습니다.',
    sql: `SELECT last_name, salary, salary + 300
FROM   employees
WHERE  ROWNUM <= 5;`,
    result:
`LAST_NAME   SALARY SALARY+300
----------- ------ ----------
King         24000      24300
Kochhar      17000      17300
De Haan      17000      17300
Hunold        9000       9300
Ernst         6000       6300`,
  },
  {
    id: 108, group: 2, groupTitle: '산술 연산자',
    question: 'EMPLOYEES 테이블에서 last_name, salary, (salary + 100) * 12 를 조회하시오 (처음 5행).',
    keyPoint: '괄호()로 연산 우선순위를 지정합니다. (salary+100)*12 와 salary*12+100 은 다릅니다.',
    sql: `SELECT last_name, salary, (salary + 100) * 12
FROM   employees
WHERE  ROWNUM <= 5;`,
    result:
`LAST_NAME   SALARY (SALARY+100)*12
----------- ------ ---------------
King         24000          289200
Kochhar      17000          205200
De Haan      17000          205200
Hunold        9000          109200
Ernst         6000           73200`,
  },
  {
    id: 109, group: 2, groupTitle: '산술 연산자',
    question: 'DUAL 테이블을 사용하여 2 + 3 * 4 와 (2 + 3) * 4 를 각각 조회하시오.',
    keyPoint: 'Oracle은 FROM DUAL 없이 SELECT만 쓸 수 없습니다. DUAL은 Oracle 전용 더미 테이블입니다.',
    sql: `SELECT 2 + 3 * 4       AS "곱셈_우선",
       (2 + 3) * 4     AS "괄호_우선"
FROM   dual;`,
    result:
`곱셈_우선 괄호_우선
--------- ---------
       14        20`,
  },
  {
    id: 110, group: 2, groupTitle: '산술 연산자',
    question: 'EMPLOYEES 테이블에서 employee_id = 100인 직원의 commission_pct 와 salary * commission_pct 를 조회하시오.',
    keyPoint: 'NULL이 포함된 산술 연산 결과는 항상 NULL입니다. King(100)의 commission_pct는 NULL입니다.',
    sql: `SELECT employee_id, last_name, commission_pct,
       salary * commission_pct AS commission_amount
FROM   employees
WHERE  employee_id = 100;`,
    result:
`EMPLOYEE_ID LAST_NAME COMMISSION_PCT COMMISSION_AMOUNT
----------- --------- -------------- -----------------
        100 King                                       `,
  },

  // ─────────────────────────────────────────────────────────
  // Group 3: NULL 값 처리 — NVL() 함수
  // ─────────────────────────────────────────────────────────
  {
    id: 111, group: 3, groupTitle: 'NULL 값과 NVL() 함수',
    question: 'commission_pct가 NULL인 직원의 last_name과 commission_pct를 조회하시오 (처음 5행).',
    keyPoint: 'NULL 확인은 반드시 IS NULL을 사용합니다. = NULL 은 항상 UNKNOWN을 반환합니다.',
    sql: `SELECT last_name, commission_pct
FROM   employees
WHERE  commission_pct IS NULL
  AND  ROWNUM <= 5;`,
    result:
`LAST_NAME   COMMISSION_PCT
----------- --------------
King
Kochhar
De Haan
Hunold
Ernst                     `,
  },
  {
    id: 112, group: 3, groupTitle: 'NULL 값과 NVL() 함수',
    question: 'NVL() 함수를 사용하여 commission_pct가 NULL인 경우 0으로 대체하여 표시하시오 (처음 5행).',
    keyPoint: "NVL(expr, default)은 Oracle 전용 함수입니다. MySQL의 IFNULL()과 동일한 역할입니다.",
    sql: `SELECT last_name, commission_pct,
       NVL(commission_pct, 0) AS comm_or_zero
FROM   employees
WHERE  ROWNUM <= 5;`,
    result:
`LAST_NAME   COMMISSION_PCT COMM_OR_ZERO
----------- -------------- ------------
King                                  0
Kochhar                               0
De Haan                               0
Hunold                                0
Ernst                                 0`,
  },
  {
    id: 113, group: 3, groupTitle: 'NULL 값과 NVL() 함수',
    question: 'NVL()을 활용하여 salary * 12 * (1 + NVL(commission_pct, 0)) 으로 연간 총 보상액을 계산하시오 (처음 5행).',
    keyPoint: 'NVL로 NULL을 0으로 대체하면 산술 연산에서 NULL 전파를 방지할 수 있습니다.',
    sql: `SELECT employee_id, last_name, salary, commission_pct,
       salary * 12 * (1 + NVL(commission_pct, 0)) AS annual_comp
FROM   employees
WHERE  ROWNUM <= 5;`,
    result:
`EMPLOYEE_ID LAST_NAME   SALARY COMMISSION_PCT ANNUAL_COMP
----------- ----------- ------ -------------- -----------
        100 King         24000                     288000
        101 Kochhar      17000                     204000
        102 De Haan      17000                     204000
        103 Hunold        9000                     108000
        104 Ernst         6000                      72000`,
  },
  {
    id: 114, group: 3, groupTitle: 'NULL 값과 NVL() 함수',
    question: "DUAL 테이블을 사용하여 NVL(NULL, '값없음') 과 NVL('존재', '값없음') 의 결과를 확인하시오.",
    keyPoint: "NVL의 첫 번째 인수가 NULL인 경우만 두 번째 인수가 반환됩니다.",
    sql: `SELECT NVL(NULL, '값없음')   AS "null인경우",
       NVL('존재', '값없음')  AS "값있는경우"
FROM   dual;`,
    result:
`null인경우 값있는경우
---------- ----------
값없음     존재      `,
  },

  // ─────────────────────────────────────────────────────────
  // Group 4: 컬럼 별칭 (Alias)
  // ─────────────────────────────────────────────────────────
  {
    id: 115, group: 4, groupTitle: '컬럼 별칭',
    question: 'last_name을 "성명", salary를 "기본급", salary * 12를 "연간급여"로 별칭 지정하여 조회하시오 (처음 5행).',
    keyPoint: "Oracle에서 공백·한글 별칭은 큰따옴표(\"\")로 감쌉니다. MySQL의 백틱(`)은 Oracle에서 사용하지 않습니다.",
    sql: `SELECT last_name         AS "성명",
       salary           AS "기본급",
       salary * 12      AS "연간급여"
FROM   employees
WHERE  ROWNUM <= 5;`,
    result:
`성명        기본급  연간급여
----------- ------- --------
King          24000   288000
Kochhar       17000   204000
De Haan       17000   204000
Hunold         9000   108000
Ernst          6000    72000`,
  },
  {
    id: 116, group: 4, groupTitle: '컬럼 별칭',
    question: '큰따옴표 없이 별칭 annual_sal 을 사용할 때 헤더가 어떻게 출력되는지 확인하시오 (처음 3행).',
    keyPoint: '큰따옴표 없는 별칭은 Oracle이 자동으로 대문자로 변환합니다.',
    sql: `SELECT last_name, salary * 12 annual_sal
FROM   employees
WHERE  ROWNUM <= 3;`,
    result:
`LAST_NAME   ANNUAL_SAL
----------- ----------
King            288000
Kochhar         204000
De Haan         204000`,
  },
  {
    id: 117, group: 4, groupTitle: '컬럼 별칭',
    question: 'AS 없이 별칭을 지정하는 방법으로 employee_id를 "사번", last_name을 "성"으로 표시하시오 (처음 3행).',
    keyPoint: 'AS 키워드는 생략 가능합니다. 컬럼명 뒤에 공백 후 별칭을 쓸 수 있습니다.',
    sql: `SELECT employee_id "사번",
       last_name    "성"
FROM   employees
WHERE  ROWNUM <= 3;`,
    result:
`사번        성
----------- -----------
        100 King
        101 Kochhar
        102 De Haan`,
  },

  // ─────────────────────────────────────────────────────────
  // Group 5: 연결 연산자(||)와 DISTINCT
  // ─────────────────────────────────────────────────────────
  {
    id: 118, group: 5, groupTitle: '연결 연산자(||)와 DISTINCT',
    question: "|| 연산자를 사용하여 first_name과 last_name을 공백으로 연결하여 '전체이름'으로 표시하시오 (처음 5행).",
    keyPoint: "Oracle의 || 연산자는 문자열을 연결합니다. MySQL의 CONCAT() 대신 사용합니다.",
    sql: `SELECT first_name || ' ' || last_name AS "전체이름",
       employee_id
FROM   employees
WHERE  ROWNUM <= 5;`,
    result:
`전체이름             EMPLOYEE_ID
-------------------- -----------
Steven King                  100
Neena Kochhar                101
Lex De Haan                  102
Alexander Hunold             103
Bruce Ernst                  104`,
  },
  {
    id: 119, group: 5, groupTitle: '연결 연산자(||)와 DISTINCT',
    question: "|| 를 사용하여 'employee_id번 last_name의 급여는 salary원입니다.' 형식으로 출력하시오 (employee_id 100~102).",
    keyPoint: "NUMBER 타입(employee_id, salary)을 || 로 연결하면 Oracle이 자동으로 문자로 변환합니다.",
    sql: `SELECT employee_id || '번 ' || last_name ||
       '의 급여는 ' || salary || '원입니다.' AS 급여안내
FROM   employees
WHERE  employee_id IN (100, 101, 102);`,
    result:
`급여안내
----------------------------------------------
100번 King의 급여는 24000원입니다.
101번 Kochhar의 급여는 17000원입니다.
102번 De Haan의 급여는 17000원입니다.`,
  },
  {
    id: 120, group: 5, groupTitle: '연결 연산자(||)와 DISTINCT',
    question: "q'[...]' 대체 인용 연산자를 사용하여 last_name || q'['s salary is ]' || salary 를 출력하시오 (처음 3행).",
    keyPoint: "q'[...]' 는 Oracle 전용 대체 인용 연산자입니다. 내부에 작은따옴표를 자유롭게 사용할 수 있습니다.",
    sql: `SELECT last_name || q'['s salary is ]' || salary AS info
FROM   employees
WHERE  ROWNUM <= 3;`,
    result:
`INFO
---------------------------------------------
King's salary is 24000
Kochhar's salary is 17000
De Haan's salary is 17000`,
  },
  {
    id: 121, group: 5, groupTitle: '연결 연산자(||)와 DISTINCT',
    question: 'EMPLOYEES 테이블에서 department_id의 중복을 제거하여 조회하시오.',
    keyPoint: 'DISTINCT는 SELECT 절 바로 뒤에 위치하며, 결과에서 중복 행을 제거합니다.',
    sql: `SELECT DISTINCT department_id
FROM   employees
ORDER  BY department_id;`,
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
              `,
  },
  {
    id: 122, group: 5, groupTitle: '연결 연산자(||)와 DISTINCT',
    question: 'EMPLOYEES 테이블에서 (department_id, job_id) 조합의 고유한 목록을 조회하시오 (처음 5행).',
    keyPoint: 'DISTINCT는 뒤에 나열된 모든 컬럼의 조합에 대해 중복을 제거합니다.',
    sql: `SELECT DISTINCT department_id, job_id
FROM   employees
WHERE  ROWNUM <= 5;`,
    result:
`DEPARTMENT_ID JOB_ID
------------- ----------
           90 AD_PRES
           90 AD_VP
           60 IT_PROG`,
  },

  // ─────────────────────────────────────────────────────────
  // Group 6: 종합 실습
  // ─────────────────────────────────────────────────────────
  {
    id: 123, group: 6, groupTitle: '종합 실습',
    question: "EMPLOYEES 테이블에서 employee_id, first_name || ' ' || last_name AS full_name, salary, NVL(commission_pct, 0) AS comm, salary * 12 + salary * 12 * NVL(commission_pct, 0) AS annual_total 을 조회하시오 (처음 5행).",
    keyPoint: 'NVL, ||, 별칭, 산술 연산을 모두 결합한 종합 쿼리입니다.',
    sql: `SELECT employee_id,
       first_name || ' ' || last_name                               AS full_name,
       salary,
       NVL(commission_pct, 0)                                       AS comm,
       salary * 12 + salary * 12 * NVL(commission_pct, 0)          AS annual_total
FROM   employees
WHERE  ROWNUM <= 5;`,
    result:
`EMPLOYEE_ID FULL_NAME          SALARY  COMM ANNUAL_TOTAL
----------- ------------------ ------- ---- ------------
        100 Steven King         24000     0       288000
        101 Neena Kochhar       17000     0       204000
        102 Lex De Haan         17000     0       204000
        103 Alexander Hunold     9000     0       108000
        104 Bruce Ernst          6000     0        72000`,
  },
  {
    id: 124, group: 6, groupTitle: '종합 실습',
    question: 'DUAL 테이블을 사용하여 현재 날짜(SYSDATE)와 현재 날짜 + 7일 후 날짜를 조회하시오.',
    keyPoint: "SYSDATE는 Oracle 전용 현재 날짜/시간 의사컬럼입니다. MySQL의 NOW()에 해당합니다. DUAL 없이는 SELECT SYSDATE를 사용할 수 없습니다.",
    sql: `SELECT SYSDATE            AS "오늘",
       SYSDATE + 7         AS "7일후"
FROM   dual;`,
    result:
`오늘       7일후
---------- ----------
01-JUL-26  08-JUL-26`,
  },
  {
    id: 125, group: 6, groupTitle: '종합 실습',
    question: "employee_id = 174인 직원 정보를 '사번: id, 이름: full_name, 연봉: annual_sal원, 커미션율: comm%' 형식으로 출력하시오.",
    keyPoint: "|| 연결, NVL, 별칭을 종합 활용합니다. employee_id=174(Ellen Abel)는 commission_pct가 있는 직원입니다.",
    sql: `SELECT '사번: ' || employee_id ||
       ', 이름: ' || first_name || ' ' || last_name ||
       ', 연봉: ' || salary * 12 || '원' ||
       ', 커미션율: ' || NVL(commission_pct * 100, 0) || '%'
       AS 직원정보
FROM   employees
WHERE  employee_id = 174;`,
    result:
`직원정보
-------------------------------------------------------
사번: 174, 이름: Ellen Abel, 연봉: 120000원, 커미션율: 30%`,
  },
  {
    id: 126, group: 6, groupTitle: '종합 실습',
    question: 'EMPLOYEES 테이블에서 commission_pct가 NULL이 아닌(커미션이 있는) 직원의 employee_id, last_name, salary, commission_pct를 조회하시오 (처음 5행).',
    keyPoint: 'IS NOT NULL로 값이 있는 행을 필터링합니다. Oracle 전통 방식 ROWNUM으로 행 수를 제한합니다.',
    sql: `SELECT employee_id, last_name, salary, commission_pct
FROM   employees
WHERE  commission_pct IS NOT NULL
  AND  ROWNUM <= 5;`,
    result:
`EMPLOYEE_ID LAST_NAME   SALARY COMMISSION_PCT
----------- ----------- ------ --------------
        145 Russell      14000            0.4
        146 Partners     13500            0.3
        147 Errazuriz    12000            0.3
        148 Cambrault    11000            0.3
        149 Zlotkey      10500            0.2`,
  },
]
