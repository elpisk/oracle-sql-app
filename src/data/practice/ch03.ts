import type { PracticeProblem } from '@/lib/types'

export const ch03Practice: PracticeProblem[] = [

  // ─────────────────────────────────────────────────────────
  // Group 1: 문자 함수
  // ─────────────────────────────────────────────────────────
  {
    id: 301, group: 1, groupTitle: '문자 함수',
    question: "EMPLOYEES 테이블에서 last_name을 소문자로, first_name의 첫 글자만 대문자로 출력하시오 (처음 5행).",
    keyPoint: "LOWER()는 소문자 변환, INITCAP()은 단어 첫 글자 대문자 변환입니다. MySQL에는 INITCAP이 없습니다.",
    sql: `SELECT LOWER(last_name)    AS lower_name,
       INITCAP(first_name)  AS initcap_name
FROM   employees
WHERE  ROWNUM <= 5;`,
    result:
`LOWER_NAME  INITCAP_NAME
----------- ------------
king        Steven
kochhar     Neena
de haan     Lex
hunold      Alexander
ernst       Bruce`,
  },
  {
    id: 302, group: 1, groupTitle: '문자 함수',
    question: "last_name의 첫 3자를 대문자로 추출하시오. 출력: last_name, substr_upper (처음 5행).",
    keyPoint: "SUBSTR(string, start, length)로 부분 문자열을 추출합니다. Oracle의 위치는 1부터 시작합니다.",
    sql: `SELECT last_name,
       UPPER(SUBSTR(last_name, 1, 3)) AS substr_upper
FROM   employees
WHERE  ROWNUM <= 5;`,
    result:
`LAST_NAME   SUBSTR_UPPER
----------- ------------
King        KIN
Kochhar     KOC
De Haan     DE
Hunold      HUN
Ernst       ERN`,
  },
  {
    id: 303, group: 1, groupTitle: '문자 함수',
    question: "'CORPORATE FLOOR' 문자열에서 'OR'가 처음 나타나는 위치와 3번 위치 이후 두 번째로 나타나는 위치를 각각 조회하시오.",
    keyPoint: "INSTR(string, substr, start, occurrence): start 위치부터 occurrence번째 출현 위치를 반환합니다.",
    sql: `SELECT INSTR('CORPORATE FLOOR', 'OR')          AS first_pos,
       INSTR('CORPORATE FLOOR', 'OR', 3, 2)   AS second_from_3
FROM   dual;`,
    result:
`FIRST_POS SECOND_FROM_3
--------- -------------
        2            14`,
  },
  {
    id: 304, group: 1, groupTitle: '문자 함수',
    question: "salary를 10자리로 오른쪽 정렬하여 왼쪽을 *로 채워 출력하시오 (처음 5행).",
    keyPoint: "LPAD(string, total_length, pad_char): 왼쪽을 지정 문자로 채웁니다. 급여 정렬 출력에 활용됩니다.",
    sql: `SELECT last_name,
       LPAD(salary, 10, '*') AS padded_salary
FROM   employees
WHERE  ROWNUM <= 5;`,
    result:
`LAST_NAME   PADDED_SALARY
----------- --------------------
King        *****24000
Kochhar     *****17000
De Haan     *****17000
Hunold      ******9000
Ernst       ******6000`,
  },
  {
    id: 305, group: 1, groupTitle: '문자 함수',
    question: "REPLACE를 사용하여 phone_number에서 '.'(점)을 '-'(하이픈)으로 변경하여 출력하시오 (처음 5행).",
    keyPoint: "REPLACE(string, old, new): 모든 old 문자열을 new로 교체합니다.",
    sql: `SELECT last_name,
       phone_number,
       REPLACE(phone_number, '.', '-') AS formatted_phone
FROM   employees
WHERE  ROWNUM <= 5;`,
    result:
`LAST_NAME   PHONE_NUMBER     FORMATTED_PHONE
----------- ---------------- ---------------
King        515.123.4567     515-123-4567
Kochhar     515.123.4568     515-123-4568
De Haan     515.123.4569     515-123-4569
Hunold      590.423.4567     590-423-4567
Ernst       590.423.4568     590-423-4568`,
  },

  // ─────────────────────────────────────────────────────────
  // Group 2: 숫자 함수
  // ─────────────────────────────────────────────────────────
  {
    id: 306, group: 2, groupTitle: '숫자 함수',
    question: "DUAL을 사용하여 ROUND, TRUNC, MOD 함수를 각각 확인하시오.\n- ROUND(45.926, 2)\n- TRUNC(45.926, 2)\n- MOD(1600, 300)",
    keyPoint: "ROUND는 반올림, TRUNC는 버림, MOD는 나머지를 반환합니다.",
    sql: `SELECT ROUND(45.926, 2)  AS rounded,
       TRUNC(45.926, 2)  AS truncated,
       MOD(1600, 300)    AS remainder
FROM   dual;`,
    result:
`ROUNDED TRUNCATED REMAINDER
------- --------- ---------
  45.93     45.92       100`,
  },
  {
    id: 307, group: 2, groupTitle: '숫자 함수',
    question: "salary를 1000 단위로 반올림하여 출력하시오 (처음 5행).",
    keyPoint: "ROUND(number, -3): 음수 자리는 정수 부분을 반올림합니다. -3은 1000 단위입니다.",
    sql: `SELECT last_name, salary,
       ROUND(salary, -3) AS rounded_k
FROM   employees
WHERE  ROWNUM <= 5;`,
    result:
`LAST_NAME   SALARY ROUNDED_K
----------- ------ ---------
King         24000     24000
Kochhar      17000     17000
De Haan      17000     17000
Hunold        9000      9000
Ernst         6000      6000`,
  },
  {
    id: 308, group: 2, groupTitle: '숫자 함수',
    question: "employee_id를 5로 나눈 나머지가 0인 직원(employee_id가 5의 배수)의 employee_id, last_name을 조회하시오 (처음 5행).",
    keyPoint: "MOD(employee_id, 5) = 0 조건으로 5의 배수를 필터링합니다.",
    sql: `SELECT employee_id, last_name
FROM   employees
WHERE  MOD(employee_id, 5) = 0
  AND  ROWNUM <= 5;`,
    result:
`EMPLOYEE_ID LAST_NAME
----------- -----------
        100 King
        105 Austin
        110 Chen
        115 Khoo
        120 Weiss`,
  },
  {
    id: 309, group: 2, groupTitle: '숫자 함수',
    question: "salary * commission_pct 를 소수점 2자리로 반올림하여 커미션 금액을 계산하시오. 커미션이 없으면 0으로 처리 (처음 5행, commission_pct IS NOT NULL 조건).",
    keyPoint: "ROUND와 NVL을 결합합니다. NVL로 NULL을 0으로 대체 후 계산합니다.",
    sql: `SELECT last_name, salary, commission_pct,
       ROUND(salary * NVL(commission_pct, 0), 2) AS commission
FROM   employees
WHERE  commission_pct IS NOT NULL
  AND  ROWNUM <= 5;`,
    result:
`LAST_NAME   SALARY COMMISSION_PCT COMMISSION
----------- ------ -------------- ----------
Russell      14000            0.4       5600
Partners     13500            0.3       4050
Errazuriz    12000            0.3       3600
Cambrault    11000            0.3       3300
Zlotkey      10500            0.2       2100`,
  },

  // ─────────────────────────────────────────────────────────
  // Group 3: 날짜 함수 (Oracle 전용)
  // ─────────────────────────────────────────────────────────
  {
    id: 310, group: 3, groupTitle: '날짜 함수 (Oracle 전용)',
    question: "DUAL을 사용하여 현재 날짜(SYSDATE)와 오늘 자정(TRUNC(SYSDATE)), 6개월 후(ADD_MONTHS)를 조회하시오.",
    keyPoint: "SYSDATE: 현재 날짜+시간. TRUNC(SYSDATE): 시간 부분 제거. ADD_MONTHS: Oracle 전용 월 덧셈.",
    sql: `SELECT SYSDATE                         AS now,
       TRUNC(SYSDATE)                  AS today,
       ADD_MONTHS(SYSDATE, 6)          AS six_months_later
FROM   dual;`,
    result:
`NOW              TODAY      SIX_MONTHS_LATER
---------------- ---------- ----------------
01-JUL-26        01-JUL-26  01-JAN-27`,
  },
  {
    id: 311, group: 3, groupTitle: '날짜 함수 (Oracle 전용)',
    question: "EMPLOYEES 테이블에서 입사 후 경과 개월 수와 경과 연수를 계산하시오 (처음 5행).",
    keyPoint: "MONTHS_BETWEEN(SYSDATE, hire_date): Oracle 전용 함수로 두 날짜 사이의 월 수를 반환합니다.",
    sql: `SELECT last_name, hire_date,
       TRUNC(MONTHS_BETWEEN(SYSDATE, hire_date))      AS months_worked,
       TRUNC(MONTHS_BETWEEN(SYSDATE, hire_date) / 12) AS years_worked
FROM   employees
WHERE  ROWNUM <= 5;`,
    result:
`LAST_NAME   HIRE_DATE  MONTHS_WORKED YEARS_WORKED
----------- ---------- ------------- ------------
King        17-JUN-03            265           22
Kochhar     21-SEP-05            249           20
De Haan     13-JAN-01            294           24
Hunold      03-JAN-06            246           20
Ernst       21-MAY-07            230           19`,
  },
  {
    id: 312, group: 3, groupTitle: '날짜 함수 (Oracle 전용)',
    question: "hire_date가 속한 달의 마지막 날(LAST_DAY)과 입사 다음 일요일(NEXT_DAY)을 조회하시오 (처음 3행).",
    keyPoint: "LAST_DAY(date): 해당 월의 마지막 날. NEXT_DAY(date, '요일'): 다음 해당 요일. 둘 다 Oracle 전용 함수입니다.",
    sql: `SELECT last_name, hire_date,
       LAST_DAY(hire_date)         AS last_of_month,
       NEXT_DAY(hire_date, 'SUNDAY') AS next_sunday
FROM   employees
WHERE  ROWNUM <= 3;`,
    result:
`LAST_NAME HIRE_DATE  LAST_OF_MONTH NEXT_SUNDAY
--------- ---------- ------------- -----------
King      17-JUN-03  30-JUN-03     22-JUN-03
Kochhar   21-SEP-05  30-SEP-05     25-SEP-05
De Haan   13-JAN-01  31-JAN-01     14-JAN-01`,
  },
  {
    id: 313, group: 3, groupTitle: '날짜 함수 (Oracle 전용)',
    question: "SYSDATE를 기준으로 90일 후 날짜와 hire_date와의 차이(일 수)를 계산하시오 (처음 3행).",
    keyPoint: "Oracle DATE - DATE = NUMBER(일 수). DATE + NUMBER = 날짜 덧셈.",
    sql: `SELECT last_name, hire_date,
       SYSDATE + 90                    AS ninety_days_later,
       TRUNC(SYSDATE - hire_date)      AS days_worked
FROM   employees
WHERE  ROWNUM <= 3;`,
    result:
`LAST_NAME HIRE_DATE  NINETY_DAYS_LATER DAYS_WORKED
--------- ---------- ----------------- -----------
King      17-JUN-03  29-SEP-26               8415
Kochhar   21-SEP-05  29-SEP-26               7588
De Haan   13-JAN-01  29-SEP-26               9300`,
  },
  {
    id: 314, group: 3, groupTitle: '날짜 함수 (Oracle 전용)',
    question: "hire_date를 'YYYY년 MM월 DD일 (DY)' 형식으로 변환하여 출력하시오 (처음 3행).",
    keyPoint: "TO_CHAR(date, format): Oracle 날짜 형식 변환. MySQL의 DATE_FORMAT() 대신 TO_CHAR()를 사용합니다.",
    sql: `SELECT last_name,
       TO_CHAR(hire_date, 'YYYY"년" MM"월" DD"일" (DY)') AS hire_fmt
FROM   employees
WHERE  ROWNUM <= 3;`,
    result:
`LAST_NAME HIRE_FMT
--------- ---------------------------------
King      2003년 06월 17일 (TUE)
Kochhar   2005년 09월 21일 (WED)
De Haan   2001년 01월 13일 (SAT)`,
  },

  // ─────────────────────────────────────────────────────────
  // Group 4: 변환 함수 (TO_CHAR, TO_NUMBER, TO_DATE)
  // ─────────────────────────────────────────────────────────
  {
    id: 315, group: 4, groupTitle: '변환 함수',
    question: "salary를 '$999,999' 형식의 통화 문자열로 변환하시오 (처음 5행).",
    keyPoint: "TO_CHAR(number, format): 숫자를 형식 문자열로 변환합니다. $ 기호와 , 천단위 구분 포함.",
    sql: `SELECT last_name, salary,
       TO_CHAR(salary, '$999,999') AS formatted_salary
FROM   employees
WHERE  ROWNUM <= 5;`,
    result:
`LAST_NAME   SALARY FORMATTED_SALARY
----------- ------ ----------------
King         24000          $24,000
Kochhar      17000          $17,000
De Haan      17000          $17,000
Hunold        9000           $9,000
Ernst         6000           $6,000`,
  },
  {
    id: 316, group: 4, groupTitle: '변환 함수',
    question: "문자열 '2024-12-25'를 DATE 타입으로 변환하여 오늘과의 차이(일 수)를 계산하시오.",
    keyPoint: "TO_DATE(string, format): 문자열을 DATE 타입으로 변환합니다. MySQL의 STR_TO_DATE()에 해당합니다.",
    sql: `SELECT TO_DATE('2024-12-25', 'YYYY-MM-DD')       AS christmas,
       TRUNC(SYSDATE - TO_DATE('2024-12-25','YYYY-MM-DD'))
                                                   AS days_since
FROM   dual;`,
    result:
`CHRISTMAS  DAYS_SINCE
---------- ----------
25-DEC-24         188`,
  },
  {
    id: 317, group: 4, groupTitle: '변환 함수',
    question: "TO_NUMBER를 사용하여 문자열 '12,345.67'을 숫자로 변환하고 100을 더하시오.",
    keyPoint: "TO_NUMBER(string, format): 형식 문자열을 NUMBER로 변환합니다. 천단위 구분 포함 시 형식 지정 필요합니다.",
    sql: `SELECT TO_NUMBER('12,345.67', '99,999.99') + 100 AS result
FROM   dual;`,
    result:
`RESULT
----------
  12445.67`,
  },
  {
    id: 318, group: 4, groupTitle: '변환 함수',
    question: "hire_date를 'YYYY'로 변환하여 입사 연도를 추출하고, 연도별 직원 수를 집계하시오.",
    keyPoint: "TO_CHAR(date, 'YYYY')로 연도를 문자열로 추출합니다. GROUP BY에서 활용합니다.",
    sql: `SELECT TO_CHAR(hire_date, 'YYYY') AS hire_year,
       COUNT(*)                     AS emp_count
FROM   employees
GROUP BY TO_CHAR(hire_date, 'YYYY')
ORDER BY hire_year;`,
    result:
`HIRE_YEAR EMP_COUNT
--------- ---------
2001              1
2002              1
2003              6
2004              2
2005             11
2006             17
2007             31
2008             18`,
  },
  {
    id: 319, group: 4, groupTitle: '변환 함수',
    question: "employee_id, last_name, salary를 조회하되, salary를 'FM999,999' 형식으로 변환하시오 (처음 5행).\n(FM: 선행 공백 제거)",
    keyPoint: "FM 형식 요소: 앞의 공백과 선행 0을 제거합니다. 출력이 깔끔해집니다.",
    sql: `SELECT employee_id, last_name,
       TO_CHAR(salary, 'FM999,999') AS salary_fmt
FROM   employees
WHERE  ROWNUM <= 5;`,
    result:
`EMPLOYEE_ID LAST_NAME   SALARY_FMT
----------- ----------- ----------
        100 King        24,000
        101 Kochhar     17,000
        102 De Haan     17,000
        103 Hunold      9,000
        104 Ernst       6,000`,
  },

  // ─────────────────────────────────────────────────────────
  // Group 5: 일반 함수 (NVL, NVL2, NULLIF, COALESCE)
  // ─────────────────────────────────────────────────────────
  {
    id: 320, group: 5, groupTitle: '일반 함수 (NVL, NVL2, NULLIF, COALESCE)',
    question: "NVL2를 사용하여 커미션이 있는 직원은 salary * (1 + commission_pct), 없는 직원은 salary를 출력하시오 (처음 5행, 모든 직원).",
    keyPoint: "NVL2(expr, val_if_not_null, val_if_null): NVL보다 유연하게 NULL/비NULL 두 경우 모두 다른 값 반환.",
    sql: `SELECT last_name, salary, commission_pct,
       NVL2(commission_pct,
            salary * (1 + commission_pct),
            salary)                   AS total_comp
FROM   employees
WHERE  ROWNUM <= 5;`,
    result:
`LAST_NAME   SALARY COMMISSION_PCT TOTAL_COMP
----------- ------ -------------- ----------
King         24000                     24000
Kochhar      17000                     17000
De Haan      17000                     17000
Hunold        9000                      9000
Ernst         6000                      6000`,
  },
  {
    id: 321, group: 5, groupTitle: '일반 함수 (NVL, NVL2, NULLIF, COALESCE)',
    question: "COALESCE를 사용하여 commission_pct, manager_id/1000, 0 순으로 첫 번째 NULL이 아닌 값을 반환하시오 (처음 5행).",
    keyPoint: "COALESCE(v1, v2, ..., vn): 첫 번째 NULL이 아닌 값 반환. NVL보다 여러 대안을 처리할 때 유용합니다.",
    sql: `SELECT last_name, commission_pct, manager_id,
       COALESCE(commission_pct, manager_id/1000, 0) AS fallback
FROM   employees
WHERE  ROWNUM <= 5;`,
    result:
`LAST_NAME   COMMISSION_PCT MANAGER_ID FALLBACK
----------- -------------- ---------- --------
King                                         0
Kochhar                            100      .1
De Haan                            100      .1
Hunold                             102    .102
Ernst                              103    .103`,
  },
  {
    id: 322, group: 5, groupTitle: '일반 함수 (NVL, NVL2, NULLIF, COALESCE)',
    question: "NULLIF를 활용하여 job_id가 'SA_REP'인 경우 NULL로, 아니면 job_id를 그대로 반환하시오 (처음 5행, SA_REP 포함).",
    keyPoint: "NULLIF(expr1, expr2): 두 값이 같으면 NULL, 다르면 expr1 반환. 특정 값을 NULL로 마스킹할 때 사용합니다.",
    sql: `SELECT last_name, job_id,
       NULLIF(job_id, 'SA_REP') AS masked_job
FROM   employees
WHERE  job_id IN ('SA_REP', 'IT_PROG')
  AND  ROWNUM <= 5;`,
    result:
`LAST_NAME   JOB_ID     MASKED_JOB
----------- ---------- ----------
Hunold      IT_PROG    IT_PROG
Ernst       IT_PROG    IT_PROG
Austin      IT_PROG    IT_PROG
Pataballa   IT_PROG    IT_PROG
Lorentz     IT_PROG    IT_PROG`,
  },
  {
    id: 323, group: 5, groupTitle: '일반 함수 (NVL, NVL2, NULLIF, COALESCE)',
    question: "AVG(NULLIF(salary, 0))를 사용하여 salary가 0인 직원을 제외한 평균 급여를 계산하시오.",
    keyPoint: "NULLIF(salary, 0): salary가 0이면 NULL 반환. AVG()는 NULL을 무시하므로 0인 행이 평균에서 제외됩니다.",
    sql: `SELECT AVG(salary)              AS avg_all,
       AVG(NULLIF(salary, 0))  AS avg_excl_zero
FROM   employees;`,
    result:
`  AVG_ALL AVG_EXCL_ZERO
--------- -------------
6461.8318     6461.8318
(salary=0인 직원이 없으면 동일)`,
  },

  // ─────────────────────────────────────────────────────────
  // Group 6: DECODE와 CASE
  // ─────────────────────────────────────────────────────────
  {
    id: 324, group: 6, groupTitle: 'DECODE와 CASE',
    question: "DECODE를 사용하여 job_id에 따라 인상률을 계산하시오.\n- IT_PROG: 1.10배\n- ST_CLERK: 1.15배\n- SA_REP: 1.20배\n- 그 외: 1.05배 (처음 5행)",
    keyPoint: "DECODE(expr, s1,r1, s2,r2, ..., default): Oracle 전용 IF-THEN-ELSE 함수. CASE 표현식으로 대체 가능합니다.",
    sql: `SELECT last_name, job_id, salary,
       DECODE(job_id,
              'IT_PROG',  salary * 1.10,
              'ST_CLERK', salary * 1.15,
              'SA_REP',   salary * 1.20,
                          salary * 1.05) AS new_salary
FROM   employees
WHERE  ROWNUM <= 5;`,
    result:
`LAST_NAME   JOB_ID     SALARY NEW_SALARY
----------- ---------- ------ ----------
King        AD_PRES     24000      25200
Kochhar     AD_VP       17000      17850
De Haan     AD_VP       17000      17850
Hunold      IT_PROG      9000       9900
Ernst       IT_PROG      6000       6600`,
  },
  {
    id: 325, group: 6, groupTitle: 'DECODE와 CASE',
    question: "검색 CASE 표현식을 사용하여 salary 구간별 등급을 부여하시오.\n- 10000 이상: '상'\n- 5000~9999: '중'\n- 5000 미만: '하' (처음 7행)",
    keyPoint: "검색 CASE: CASE WHEN condition THEN result ... END. 임의 조건식을 사용할 수 있어 단순 CASE보다 유연합니다.",
    sql: `SELECT last_name, salary,
       CASE WHEN salary >= 10000 THEN '상'
            WHEN salary >= 5000  THEN '중'
            ELSE                      '하'
       END AS grade
FROM   employees
WHERE  ROWNUM <= 7;`,
    result:
`LAST_NAME   SALARY GRADE
----------- ------ -----
King         24000 상
Kochhar      17000 상
De Haan      17000 상
Hunold        9000 중
Ernst         6000 중
Austin        4800 하
Pataballa     4800 하`,
  },
  {
    id: 326, group: 6, groupTitle: 'DECODE와 CASE',
    question: "단순 CASE로 department_id 값에 따라 부서명을 매핑하시오.\n- 90: '임원실'\n- 60: 'IT부서'\n- 50: '물류부서'\n- 그 외: '기타' (처음 7행)",
    keyPoint: "단순 CASE: CASE expr WHEN val THEN result ... END. 등치 비교만 가능하지만 간결합니다.",
    sql: `SELECT last_name, department_id,
       CASE department_id
            WHEN 90 THEN '임원실'
            WHEN 60 THEN 'IT부서'
            WHEN 50 THEN '물류부서'
            ELSE         '기타'
       END AS dept_name_kr
FROM   employees
WHERE  ROWNUM <= 7;`,
    result:
`LAST_NAME   DEPARTMENT_ID DEPT_NAME_KR
----------- ------------- ------------
King                   90 임원실
Kochhar                90 임원실
De Haan                90 임원실
Hunold                 60 IT부서
Ernst                  60 IT부서
Austin                 60 IT부서
Pataballa              60 IT부서`,
  },

  // ─────────────────────────────────────────────────────────
  // Group 7: 종합 실습
  // ─────────────────────────────────────────────────────────
  {
    id: 327, group: 7, groupTitle: '종합 실습',
    question: "다음 형식으로 직원 보고서를 출력하시오 (처음 5행).\n- 이름: 'LAST, First' 형식\n- 입사일: 'YYYY-MM-DD'\n- 근무연수: N년\n- 연봉: '$N,NNN,NNN'\n- 등급: 연봉 기준 상/중/하",
    keyPoint: "문자함수(UPPER, INITCAP) + 날짜함수(TO_CHAR, MONTHS_BETWEEN) + 변환함수(TO_CHAR 숫자) + CASE를 종합합니다.",
    sql: `SELECT UPPER(last_name) || ', ' || INITCAP(first_name)     AS name,
       TO_CHAR(hire_date, 'YYYY-MM-DD')                         AS hire_dt,
       TRUNC(MONTHS_BETWEEN(SYSDATE, hire_date) / 12) || '년'  AS tenure,
       TO_CHAR(salary * 12, 'FM$9,999,999')                    AS annual_sal,
       CASE WHEN salary >= 10000 THEN '상'
            WHEN salary >= 5000  THEN '중'
            ELSE                      '하'
       END                                                      AS grade
FROM   employees
WHERE  ROWNUM <= 5;`,
    result:
`NAME               HIRE_DT    TENURE ANNUAL_SAL GRADE
------------------ ---------- ------ ---------- -----
KING, Steven       2003-06-17 22년   $288,000   상
KOCHHAR, Neena     2005-09-21 20년   $204,000   상
DE HAAN, Lex       2001-01-13 24년   $204,000   상
HUNOLD, Alexander  2006-01-03 19년   $108,000   중
ERNST, Bruce       2007-05-21 18년    $72,000   중`,
  },
  {
    id: 328, group: 7, groupTitle: '종합 실습',
    question: "department_id별 평균 급여를 계산하여, 평균 급여를 '$N,NNN' 형식으로, 최고 급여도 같은 형식으로 출력하시오.",
    keyPoint: "GROUP BY + 집계 함수 + TO_CHAR 형식 변환을 결합합니다.",
    sql: `SELECT department_id,
       TO_CHAR(ROUND(AVG(salary), 0), 'FM$999,999') AS avg_salary,
       TO_CHAR(MAX(salary),           'FM$999,999') AS max_salary,
       COUNT(*)                                     AS emp_count
FROM   employees
WHERE  department_id IS NOT NULL
GROUP BY department_id
ORDER BY department_id;`,
    result:
`DEPARTMENT_ID AVG_SALARY MAX_SALARY EMP_COUNT
------------- ---------- ---------- ---------
           10 $4,400     $4,400             1
           20 $9,500     $13,000            2
           30 $4,150     $11,000            6
           ...`,
  },
]
