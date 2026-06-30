import type { PracticeProblem } from '@/lib/types'

export const ch02Practice: PracticeProblem[] = [

  // ─────────────────────────────────────────────────────────
  // Group 1: 비교 연산자
  // ─────────────────────────────────────────────────────────
  {
    id: 201, group: 1, groupTitle: '비교 연산자',
    question: 'salary가 10000보다 큰 직원의 employee_id, last_name, salary를 조회하시오.',
    keyPoint: '> 연산자는 경계값을 포함하지 않습니다. 10000은 포함되지 않습니다.',
    sql: `SELECT employee_id, last_name, salary
FROM   employees
WHERE  salary > 10000
ORDER  BY salary DESC;`,
    result:
`EMPLOYEE_ID LAST_NAME   SALARY
----------- ----------- ------
        100 King         24000
        101 Kochhar      17000
        102 De Haan      17000
        ...
(결과: salary > 10000 인 직원들)`,
  },
  {
    id: 202, group: 1, groupTitle: '비교 연산자',
    question: 'job_id가 SA_REP 인 직원의 employee_id, last_name, salary, commission_pct를 조회하시오.',
    keyPoint: "문자열 비교는 대소문자를 구분합니다. 'SA_REP'와 'sa_rep'는 다른 값입니다.",
    sql: `SELECT employee_id, last_name, salary, commission_pct
FROM   employees
WHERE  job_id = 'SA_REP'
ORDER  BY salary DESC;`,
    result:
`EMPLOYEE_ID LAST_NAME   SALARY COMMISSION_PCT
----------- ----------- ------ --------------
        150 Tucker       10000            0.3
        156 King          8000            0.35
        ...
(결과: 직무가 SA_REP인 직원)`,
  },
  {
    id: 203, group: 1, groupTitle: '비교 연산자',
    question: 'salary가 5000 이상 8000 이하(BETWEEN 없이 비교 연산자만 사용)인 직원의 last_name, salary를 조회하시오.',
    keyPoint: '>= 와 <= 는 경계값을 포함합니다. AND로 두 조건을 결합합니다.',
    sql: `SELECT last_name, salary
FROM   employees
WHERE  salary >= 5000
  AND  salary <= 8000
ORDER  BY salary;`,
    result:
`LAST_NAME   SALARY
----------- ------
Nayer         3200
... (5000~8000 사이 직원들)`,
  },
  {
    id: 204, group: 1, groupTitle: '비교 연산자',
    question: 'department_id가 50이 아닌 직원의 employee_id, last_name, department_id를 조회하시오 (처음 5행).',
    keyPoint: "같지 않음은 <>, !=, ^= 모두 Oracle에서 유효합니다.",
    sql: `SELECT employee_id, last_name, department_id
FROM   employees
WHERE  department_id <> 50
  AND  ROWNUM <= 5;`,
    result:
`EMPLOYEE_ID LAST_NAME   DEPARTMENT_ID
----------- ----------- -------------
        100 King                    90
        101 Kochhar                 90
        102 De Haan                 90
        103 Hunold                  60
        104 Ernst                   60`,
  },
  {
    id: 205, group: 1, groupTitle: '비교 연산자',
    question: "hire_date가 2005년 1월 1일 이후인 직원의 last_name, hire_date를 조회하시오 (처음 5행).",
    keyPoint: "Oracle 날짜 비교: TO_DATE('2005-01-01','YYYY-MM-DD') 사용. MySQL의 STR_TO_DATE() 대신 TO_DATE()를 사용합니다.",
    sql: `SELECT last_name, hire_date
FROM   employees
WHERE  hire_date >= TO_DATE('2005-01-01', 'YYYY-MM-DD')
  AND  ROWNUM <= 5;`,
    result:
`LAST_NAME   HIRE_DATE
----------- ----------
OConnell    21-JUN-07
Grant       13-JAN-08
Mikkilineni 28-SEP-06
Landry      14-JAN-07
Markle      27-MAR-08`,
  },

  // ─────────────────────────────────────────────────────────
  // Group 2: BETWEEN, IN 연산자
  // ─────────────────────────────────────────────────────────
  {
    id: 206, group: 2, groupTitle: 'BETWEEN과 IN 연산자',
    question: 'BETWEEN을 사용하여 salary가 5000 이상 8000 이하인 직원의 last_name, salary를 조회하시오.',
    keyPoint: 'BETWEEN A AND B 는 >= A AND <= B 와 동일합니다. 경계값 포함입니다.',
    sql: `SELECT last_name, salary
FROM   employees
WHERE  salary BETWEEN 5000 AND 8000
ORDER  BY salary;`,
    result:
`LAST_NAME   SALARY
----------- ------
Mikkilineni   5000
Taylor        5000
Gee           5000
...
(결과: 경계값 5000, 8000 포함)`,
  },
  {
    id: 207, group: 2, groupTitle: 'BETWEEN과 IN 연산자',
    question: 'department_id가 10, 20, 30 중 하나인 직원의 employee_id, last_name, department_id를 IN 연산자를 사용하여 조회하시오.',
    keyPoint: 'IN (val1, val2, val3)은 = val1 OR = val2 OR = val3 와 동일합니다.',
    sql: `SELECT employee_id, last_name, department_id
FROM   employees
WHERE  department_id IN (10, 20, 30)
ORDER  BY department_id, employee_id;`,
    result:
`EMPLOYEE_ID LAST_NAME   DEPARTMENT_ID
----------- ----------- -------------
        200 Whalen               10
        201 Hartstein            20
        202 Fay                  20
        114 Raphaely             30
        ...`,
  },
  {
    id: 208, group: 2, groupTitle: 'BETWEEN과 IN 연산자',
    question: "job_id가 'IT_PROG', 'FI_ACCOUNT', 'AD_VP' 중 하나인 직원의 last_name, job_id, salary를 조회하시오.",
    keyPoint: 'IN은 문자열에도 사용 가능합니다. 각 값은 작은따옴표로 감쌉니다.',
    sql: `SELECT last_name, job_id, salary
FROM   employees
WHERE  job_id IN ('IT_PROG', 'FI_ACCOUNT', 'AD_VP')
ORDER  BY job_id;`,
    result:
`LAST_NAME   JOB_ID      SALARY
----------- ---------- -------
Kochhar     AD_VP       17000
De Haan     AD_VP       17000
Chen        FI_ACCOUNT   8200
...`,
  },
  {
    id: 209, group: 2, groupTitle: 'BETWEEN과 IN 연산자',
    question: "hire_date가 2006년 1월 1일부터 2007년 12월 31일 사이인 직원의 last_name, hire_date를 BETWEEN으로 조회하시오.",
    keyPoint: "TO_DATE() 함수로 날짜 리터럴을 변환합니다. BETWEEN에서도 날짜 비교가 가능합니다.",
    sql: `SELECT last_name, hire_date
FROM   employees
WHERE  hire_date BETWEEN TO_DATE('2006-01-01', 'YYYY-MM-DD')
                     AND TO_DATE('2007-12-31', 'YYYY-MM-DD')
ORDER  BY hire_date;`,
    result:
`LAST_NAME   HIRE_DATE
----------- ----------
Mikkilineni 28-SEP-06
Landry      14-JAN-07
...`,
  },

  // ─────────────────────────────────────────────────────────
  // Group 3: LIKE 연산자
  // ─────────────────────────────────────────────────────────
  {
    id: 210, group: 3, groupTitle: 'LIKE 연산자',
    question: "last_name이 'K'로 시작하는 직원의 employee_id, last_name을 조회하시오.",
    keyPoint: "'K%': K로 시작하고 뒤에 0개 이상의 임의 문자가 오는 패턴입니다.",
    sql: `SELECT employee_id, last_name
FROM   employees
WHERE  last_name LIKE 'K%'
ORDER  BY last_name;`,
    result:
`EMPLOYEE_ID LAST_NAME
----------- -----------
        156 King
        100 King
        115 Khoo
        101 Kochhar`,
  },
  {
    id: 211, group: 3, groupTitle: 'LIKE 연산자',
    question: "last_name의 두 번째 문자가 'o'인 직원의 last_name을 조회하시오.",
    keyPoint: "'_o%': _ 는 정확히 한 문자를 나타냅니다. 두 번째 위치의 문자를 특정합니다.",
    sql: `SELECT last_name
FROM   employees
WHERE  last_name LIKE '_o%'
ORDER  BY last_name;`,
    result:
`LAST_NAME
-----------
Fohrenbach
Kochhar
Colmenares
Lorentz
...`,
  },
  {
    id: 212, group: 3, groupTitle: 'LIKE 연산자',
    question: "phone_number에 '515'가 포함된 직원의 last_name, phone_number를 조회하시오.",
    keyPoint: "'%515%': 앞뒤로 임의 문자가 오고 중간에 '515'가 포함되는 패턴입니다.",
    sql: `SELECT last_name, phone_number
FROM   employees
WHERE  phone_number LIKE '%515%'
ORDER  BY last_name;`,
    result:
`LAST_NAME   PHONE_NUMBER
----------- ----------------
De Haan     515.123.4569
Kochhar     515.123.4568
King        515.123.4567
...`,
  },
  {
    id: 213, group: 3, groupTitle: 'LIKE 연산자',
    question: "job_id가 'SA_'로 시작하는 직무를 가진 직원의 last_name, job_id를 조회하시오. ESCAPE 절을 사용하여 _ 를 리터럴로 처리하시오.",
    keyPoint: "ESCAPE 절로 와일드카드 _ 를 리터럴로 처리합니다. 'SA\\_%' ESCAPE '\\'",
    sql: `SELECT last_name, job_id
FROM   employees
WHERE  job_id LIKE 'SA\\_%' ESCAPE '\\'
ORDER  BY job_id;`,
    result:
`LAST_NAME   JOB_ID
----------- ----------
De La Cruz  SA_MAN
Russell     SA_MAN
Partners    SA_MAN
Tucker      SA_REP
...`,
  },

  // ─────────────────────────────────────────────────────────
  // Group 4: IS NULL / IS NOT NULL
  // ─────────────────────────────────────────────────────────
  {
    id: 214, group: 4, groupTitle: 'IS NULL / IS NOT NULL',
    question: 'commission_pct가 NULL인 직원의 last_name, salary, commission_pct를 조회하시오 (처음 5행).',
    keyPoint: "IS NULL 은 NULL 값을 가진 행을 선택합니다. = NULL 은 사용할 수 없습니다.",
    sql: `SELECT last_name, salary, commission_pct
FROM   employees
WHERE  commission_pct IS NULL
  AND  ROWNUM <= 5;`,
    result:
`LAST_NAME   SALARY COMMISSION_PCT
----------- ------ --------------
King         24000
Kochhar      17000
De Haan      17000
Hunold        9000
Ernst         6000`,
  },
  {
    id: 215, group: 4, groupTitle: 'IS NULL / IS NOT NULL',
    question: 'commission_pct가 NULL이 아닌(커미션이 있는) 직원의 last_name, salary, commission_pct를 조회하시오.',
    keyPoint: 'IS NOT NULL 은 NULL이 아닌 행을 선택합니다. 커미션이 있는 영업직원이 대상입니다.',
    sql: `SELECT last_name, salary, commission_pct
FROM   employees
WHERE  commission_pct IS NOT NULL
ORDER  BY commission_pct DESC;`,
    result:
`LAST_NAME   SALARY COMMISSION_PCT
----------- ------ --------------
Tucker       10000            0.4
Bernstein     9500            0.4
Hall          9000            0.4
...`,
  },
  {
    id: 216, group: 4, groupTitle: 'IS NULL / IS NOT NULL',
    question: 'manager_id가 NULL인 직원(즉, 최고 관리자)의 employee_id, last_name, job_id를 조회하시오.',
    keyPoint: 'manager_id IS NULL은 관리자가 없는 최상위 직원을 찾습니다. 조직의 루트 노드입니다.',
    sql: `SELECT employee_id, last_name, job_id
FROM   employees
WHERE  manager_id IS NULL;`,
    result:
`EMPLOYEE_ID LAST_NAME JOB_ID
----------- --------- -------
        100 King       AD_PRES`,
  },
  {
    id: 217, group: 4, groupTitle: 'IS NULL / IS NOT NULL',
    question: 'department_id가 NULL이 아니고 salary가 10000 이상인 직원의 last_name, department_id, salary를 조회하시오.',
    keyPoint: 'IS NOT NULL과 비교 연산자를 AND로 결합합니다.',
    sql: `SELECT last_name, department_id, salary
FROM   employees
WHERE  department_id IS NOT NULL
  AND  salary >= 10000
ORDER  BY salary DESC;`,
    result:
`LAST_NAME   DEPARTMENT_ID SALARY
----------- ------------- ------
King                   90  24000
Kochhar                90  17000
De Haan                90  17000
...`,
  },

  // ─────────────────────────────────────────────────────────
  // Group 5: 논리 연산자 (AND, OR, NOT)
  // ─────────────────────────────────────────────────────────
  {
    id: 218, group: 5, groupTitle: '논리 연산자 (AND, OR, NOT)',
    question: "department_id가 90이고 job_id가 'AD_VP'인 직원의 last_name, job_id, department_id를 조회하시오.",
    keyPoint: 'AND는 두 조건 모두 TRUE인 행을 반환합니다.',
    sql: `SELECT last_name, job_id, department_id
FROM   employees
WHERE  department_id = 90
  AND  job_id = 'AD_VP';`,
    result:
`LAST_NAME JOB_ID DEPARTMENT_ID
--------- ------ -------------
Kochhar   AD_VP             90
De Haan   AD_VP             90`,
  },
  {
    id: 219, group: 5, groupTitle: '논리 연산자 (AND, OR, NOT)',
    question: "salary가 12000 이상이거나 department_id가 90인 직원의 last_name, salary, department_id를 조회하시오.",
    keyPoint: 'OR는 둘 중 하나 이상 TRUE인 행을 반환합니다. 결과가 AND보다 많습니다.',
    sql: `SELECT last_name, salary, department_id
FROM   employees
WHERE  salary >= 12000
  OR   department_id = 90
ORDER  BY salary DESC;`,
    result:
`LAST_NAME   SALARY DEPARTMENT_ID
----------- ------ -------------
King         24000            90
Kochhar      17000            90
De Haan      17000            90
...`,
  },
  {
    id: 220, group: 5, groupTitle: '논리 연산자 (AND, OR, NOT)',
    question: "department_id가 10, 20, 30이 아닌 직원의 last_name, department_id를 NOT IN으로 조회하시오 (처음 5행).",
    keyPoint: 'NOT IN은 목록에 없는 값을 선택합니다. NULL이 목록에 있으면 결과가 빈 집합이 되므로 주의합니다.',
    sql: `SELECT last_name, department_id
FROM   employees
WHERE  department_id NOT IN (10, 20, 30)
  AND  ROWNUM <= 5;`,
    result:
`LAST_NAME   DEPARTMENT_ID
----------- -------------
King                   90
Kochhar                90
De Haan                90
Hunold                 60
Ernst                  60`,
  },
  {
    id: 221, group: 5, groupTitle: '논리 연산자 (AND, OR, NOT)',
    question: "salary가 5000 미만이거나 10000 초과인 직원의 last_name, salary를 NOT BETWEEN을 사용하여 조회하시오 (처음 5행).",
    keyPoint: 'NOT BETWEEN A AND B 는 < A OR > B 입니다. 범위 밖 값을 선택합니다.',
    sql: `SELECT last_name, salary
FROM   employees
WHERE  salary NOT BETWEEN 5000 AND 10000
  AND  ROWNUM <= 5;`,
    result:
`LAST_NAME   SALARY
----------- ------
King         24000
Kochhar      17000
De Haan      17000
Gietz         8300
...`,
  },
  {
    id: 222, group: 5, groupTitle: '논리 연산자 (AND, OR, NOT)',
    question: "department_id가 50이고 salary가 3000 이상 5000 이하인 직원의 last_name, department_id, salary를 조회하시오.",
    keyPoint: 'AND와 BETWEEN을 결합합니다. AND가 여러 개면 모든 조건을 동시에 만족해야 합니다.',
    sql: `SELECT last_name, department_id, salary
FROM   employees
WHERE  department_id = 50
  AND  salary BETWEEN 3000 AND 5000
ORDER  BY salary;`,
    result:
`LAST_NAME   DEPARTMENT_ID SALARY
----------- ------------- ------
Nayer                  50   3200
Mikkilineni            50   2700
...`,
  },

  // ─────────────────────────────────────────────────────────
  // Group 6: 종합 실습
  // ─────────────────────────────────────────────────────────
  {
    id: 223, group: 6, groupTitle: '종합 실습',
    question: "last_name이 'J'로 시작하거나 'A'로 끝나는 직원의 last_name을 조회하고, 이름 순으로 정렬하시오.",
    keyPoint: "LIKE 패턴과 OR 연산자를 결합합니다. 'J%' 와 '%A' 를 각각 사용합니다.",
    sql: `SELECT last_name
FROM   employees
WHERE  last_name LIKE 'J%'
  OR   last_name LIKE '%a'
ORDER  BY last_name;`,
    result:
`LAST_NAME
-----------
Fay
Hunold
Johnsonbaugh
Johnson
...`,
  },
  {
    id: 224, group: 6, groupTitle: '종합 실습',
    question: "commission_pct가 있고(IS NOT NULL) salary * (1 + commission_pct) * 12 가 150000 이상인 직원의 last_name, salary, commission_pct를 조회하시오.",
    keyPoint: 'WHERE 절에서 산술 연산과 IS NOT NULL을 결합합니다.',
    sql: `SELECT last_name, salary, commission_pct,
       salary * (1 + commission_pct) * 12 AS annual_total
FROM   employees
WHERE  commission_pct IS NOT NULL
  AND  salary * (1 + commission_pct) * 12 >= 150000
ORDER  BY annual_total DESC;`,
    result:
`LAST_NAME   SALARY COMMISSION_PCT ANNUAL_TOTAL
----------- ------ -------------- ------------
Tucker       10000            0.4       168000
Bernstein     9500            0.4       159600
...`,
  },
  {
    id: 225, group: 6, groupTitle: '종합 실습',
    question: "department_id가 60 또는 90이고, hire_date가 2003년 1월 1일 이전인 직원의 last_name, department_id, hire_date를 조회하시오.",
    keyPoint: 'IN 연산자와 날짜 비교 TO_DATE()를 AND로 결합합니다.',
    sql: `SELECT last_name, department_id, hire_date
FROM   employees
WHERE  department_id IN (60, 90)
  AND  hire_date < TO_DATE('2003-01-01', 'YYYY-MM-DD')
ORDER  BY hire_date;`,
    result:
`LAST_NAME DEPARTMENT_ID HIRE_DATE
--------- ------------- ----------
King                 90 17-JUN-03
De Haan              90 13-JAN-01
Kochhar              90 21-SEP-05
Hunold               60 03-JAN-06
...`,
  },
  {
    id: 226, group: 6, groupTitle: '종합 실습',
    question: "salary가 5000 이상 12000 이하이고, department_id가 20 또는 50이 아니며, last_name에 'a'가 포함된 직원의 last_name, salary, department_id를 조회하시오.",
    keyPoint: 'BETWEEN, NOT IN, LIKE를 AND로 조합하는 복합 WHERE 절입니다.',
    sql: `SELECT last_name, salary, department_id
FROM   employees
WHERE  salary BETWEEN 5000 AND 12000
  AND  department_id NOT IN (20, 50)
  AND  last_name LIKE '%a%'
ORDER  BY salary DESC;`,
    result:
`LAST_NAME   SALARY DEPARTMENT_ID
----------- ------ -------------
Raphaely      11000            30
Popp           6900           100
Marle          4200           ...
...`,
  },
]
