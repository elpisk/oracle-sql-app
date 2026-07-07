import type { PracticeProblem } from '@/lib/types'

export const ch21Practice: PracticeProblem[] = [
  // ========== Group 1: INTERVAL YEAR TO MONTH 기본 ==========
  {
    id: 2101,
    group: 1,
    groupTitle: 'INTERVAL YEAR TO MONTH 기본',
    question: 'warranty 테이블(prod_id NUMBER, warranty_time INTERVAL YEAR(3) TO MONTH)을 생성하고 다양한 INTERVAL YEAR TO MONTH 값을 삽입하시오.',
    sql: `CREATE TABLE warranty (
    prod_id       NUMBER,
    warranty_time INTERVAL YEAR(3) TO MONTH
);

INSERT INTO warranty VALUES (123, INTERVAL '8' MONTH);
INSERT INTO warranty VALUES (155, INTERVAL '200' YEAR(3));
INSERT INTO warranty VALUES (678, '200-11');
INSERT INTO warranty VALUES (999, TO_YMINTERVAL('1-6'));

SELECT * FROM warranty;`,
    result: '123: +00-08 | 155: +200-00 | 678: +200-11 | 999: +01-06',
    keyPoint: "INTERVAL YEAR TO MONTH 삽입 방법: INTERVAL '값' 단위, 문자열 리터럴 'YEAR-MONTH', TO_YMINTERVAL() 함수. 출력 형식: +YEAR-MONTH.",
  },
  {
    id: 2102,
    group: 1,
    groupTitle: 'INTERVAL YEAR TO MONTH 기본',
    question: 'NUMTOYMINTERVAL 함수를 사용하여 다양한 값을 INTERVAL YEAR TO MONTH로 변환하시오.',
    sql: `SELECT NUMTOYMINTERVAL(18, 'MONTH')   AS months_18,
       NUMTOYMINTERVAL(30, 'MONTH')   AS months_30,
       NUMTOYMINTERVAL(2, 'YEAR')     AS years_2,
       NUMTOYMINTERVAL(2.5, 'YEAR')   AS years_2_5
FROM   DUAL;`,
    result: 'MONTHS_18: +01-06 | MONTHS_30: +02-06 | YEARS_2: +02-00 | YEARS_2_5: +02-06',
    keyPoint: "NUMTOYMINTERVAL(숫자, 'MONTH'|'YEAR')로 숫자를 INTERVAL YEAR TO MONTH로 변환합니다. 자동으로 정규화됩니다.",
  },
  {
    id: 2103,
    group: 1,
    groupTitle: 'INTERVAL YEAR TO MONTH 기본',
    question: 'TO_YMINTERVAL을 사용하여 입사일로부터 1년 2개월 후 날짜를 계산하시오.',
    sql: `SELECT hire_date,
       hire_date + TO_YMINTERVAL('01-02') AS hire_plus_14m
FROM   employees
WHERE  department_id = 20;`,
    result: '각 직원의 입사일에서 1년 2개월(14개월) 후 날짜',
    keyPoint: "TO_YMINTERVAL('YEAR-MONTH')로 INTERVAL YEAR TO MONTH를 생성하여 날짜에 더합니다. '01-02' = 1년 2개월.",
  },
  {
    id: 2104,
    group: 1,
    groupTitle: 'INTERVAL YEAR TO MONTH 기본',
    question: 'INTERVAL을 사용하여 보증 만료일을 계산하는 쿼리를 작성하시오.',
    sql: `CREATE TABLE products (
    prod_id        NUMBER,
    release_date   DATE,
    warranty_time  INTERVAL YEAR TO MONTH
);

INSERT INTO products VALUES (1, DATE '2023-01-15', INTERVAL '2' YEAR);
INSERT INTO products VALUES (2, DATE '2022-06-01', INTERVAL '18' MONTH);
INSERT INTO products VALUES (3, DATE '2024-03-01', TO_YMINTERVAL('1-6'));

SELECT prod_id,
       release_date,
       warranty_time,
       release_date + warranty_time AS expiry_date
FROM   products;`,
    result: 'PROD 1: 2025-01-15 | PROD 2: 2023-12-01 | PROD 3: 2025-09-01',
    keyPoint: 'DATE + INTERVAL YEAR TO MONTH로 보증 만료일을 계산합니다. INTERVAL은 컬럼에 저장된 값도 사용 가능합니다.',
  },
  {
    id: 2105,
    group: 1,
    groupTitle: 'INTERVAL YEAR TO MONTH 기본',
    question: "INTERVAL YEAR TO MONTH에서 EXTRACT로 연도와 월 값을 추출하시오.",
    sql: `SELECT INTERVAL '2-11' YEAR TO MONTH              AS interval_val,
       EXTRACT(YEAR  FROM INTERVAL '2-11' YEAR TO MONTH) AS ext_year,
       EXTRACT(MONTH FROM INTERVAL '2-11' YEAR TO MONTH) AS ext_month
FROM   DUAL;`,
    result: 'INTERVAL_VAL: +02-11 | EXT_YEAR: 2 | EXT_MONTH: 11',
    keyPoint: 'EXTRACT(YEAR|MONTH FROM interval_val)로 INTERVAL YEAR TO MONTH에서 연도나 월 값을 숫자로 추출할 수 있습니다.',
  },
  {
    id: 2106,
    group: 1,
    groupTitle: 'INTERVAL YEAR TO MONTH 기본',
    question: "재직 기간을 INTERVAL YEAR TO MONTH 형식으로 계산하시오. (MONTHS_BETWEEN과 NUMTOYMINTERVAL 활용)",
    sql: `SELECT employee_id,
       last_name,
       hire_date,
       NUMTOYMINTERVAL(
           TRUNC(MONTHS_BETWEEN(SYSDATE, hire_date)),
           'MONTH'
       ) AS tenure
FROM   employees
WHERE  department_id = 90
ORDER BY hire_date;`,
    result: '각 직원의 재직 기간이 +YY-MM 형식으로 표시됩니다.',
    keyPoint: 'MONTHS_BETWEEN으로 개월 수를 구하고 NUMTOYMINTERVAL로 INTERVAL로 변환합니다. 재직 기간 계산 패턴입니다.',
  },
  // ========== Group 2: INTERVAL DAY TO SECOND 기본 ==========
  {
    id: 2107,
    group: 2,
    groupTitle: 'INTERVAL DAY TO SECOND 기본',
    question: 'lab 테이블에 INTERVAL DAY TO SECOND 값을 삽입하고 조회하시오.',
    sql: `CREATE TABLE lab (
    exp_id    NUMBER,
    test_time INTERVAL DAY(2) TO SECOND
);

INSERT INTO lab VALUES (100012, '90 00:00:00');
INSERT INTO lab VALUES (56098,  INTERVAL '6 03:30:16' DAY TO SECOND);
INSERT INTO lab VALUES (77001,  TO_DSINTERVAL('14 12:30:00'));
INSERT INTO lab VALUES (88002,  NUMTODSINTERVAL(2.5, 'DAY'));

SELECT * FROM lab;`,
    result: "100012: +90 00:00:00 | 56098: +06 03:30:16 | 77001: +14 12:30:00 | 88002: +02 12:00:00",
    keyPoint: "INTERVAL DAY TO SECOND 삽입: 문자열 'DD HH:MI:SS', INTERVAL '...' DAY TO SECOND, TO_DSINTERVAL(), NUMTODSINTERVAL(). 출력: +DD HH:MM:SS.ffffff.",
  },
  {
    id: 2108,
    group: 2,
    groupTitle: 'INTERVAL DAY TO SECOND 기본',
    question: 'TO_DSINTERVAL을 사용하여 입사일로부터 100일 10시간 후를 계산하시오.',
    sql: `SELECT last_name,
       TO_CHAR(hire_date, 'YYYY-MM-DD HH24:MI:SS')                      AS hire_date,
       TO_CHAR(hire_date + TO_DSINTERVAL('100 10:00:00'),
               'YYYY-MM-DD HH24:MI:SS')                                  AS hire_plus
FROM   employees
ORDER BY hire_date
FETCH FIRST 5 ROWS ONLY;`,
    result: '각 직원의 입사일에서 100일 10시간 후 날짜+시간',
    keyPoint: "TO_DSINTERVAL('일수 HH:MI:SS')로 INTERVAL DAY TO SECOND를 생성합니다. '100 10:00:00' = 100일 10시간.",
  },
  {
    id: 2109,
    group: 2,
    groupTitle: 'INTERVAL DAY TO SECOND 기본',
    question: 'NUMTODSINTERVAL 함수로 다양한 단위를 INTERVAL DAY TO SECOND로 변환하시오.',
    sql: `SELECT NUMTODSINTERVAL(2,     'DAY')    AS days_2,
       NUMTODSINTERVAL(36,    'HOUR')   AS hours_36,
       NUMTODSINTERVAL(90,    'MINUTE') AS min_90,
       NUMTODSINTERVAL(3600,  'SECOND') AS sec_3600
FROM   DUAL;`,
    result: "DAYS_2: +02 00:00:00 | HOURS_36: +01 12:00:00 | MIN_90: +00 01:30:00 | SEC_3600: +00 01:00:00",
    keyPoint: "NUMTODSINTERVAL(숫자, 'DAY'|'HOUR'|'MINUTE'|'SECOND')로 숫자를 INTERVAL DAY TO SECOND로 변환합니다.",
  },
  {
    id: 2110,
    group: 2,
    groupTitle: 'INTERVAL DAY TO SECOND 기본',
    question: '스프린트 일정 관리: 프로젝트 시작일에 스프린트 기간(14일)을 더해 종료일을 계산하시오.',
    sql: `SELECT 'Sprint 1'                                        AS sprint,
       DATE '2024-01-15'                                AS start_date,
       DATE '2024-01-15' + INTERVAL '14' DAY           AS end_date,
       DATE '2024-01-15' + NUMTODSINTERVAL(14, 'DAY')  AS end_date2
FROM   DUAL;`,
    result: 'START_DATE: 2024-01-15 | END_DATE: 2024-01-29',
    keyPoint: "DATE + INTERVAL '14' DAY 또는 DATE + NUMTODSINTERVAL(14, 'DAY')로 동일한 결과를 계산합니다.",
  },
  {
    id: 2111,
    group: 2,
    groupTitle: 'INTERVAL DAY TO SECOND 기본',
    question: '배달 주문 시스템: 주문 시각에서 배달 예상 시간(2시간 30분)을 더해 예상 도착 시각을 계산하시오.',
    sql: `SELECT CURRENT_TIMESTAMP                                        AS order_time,
       CURRENT_TIMESTAMP + INTERVAL '0 02:30:00' DAY TO SECOND   AS estimated_arrival,
       CURRENT_TIMESTAMP + NUMTODSINTERVAL(2.5, 'HOUR')          AS estimated_arrival2
FROM   DUAL;`,
    result: '주문 시각에서 2시간 30분 후 예상 도착 시각',
    keyPoint: "INTERVAL '0 02:30:00' DAY TO SECOND 또는 NUMTODSINTERVAL(2.5, 'HOUR')로 2시간 30분을 표현합니다.",
  },
  {
    id: 2112,
    group: 2,
    groupTitle: 'INTERVAL DAY TO SECOND 기본',
    question: '근무 시간 계산: INTERVAL DAY TO SECOND로 일별 근무 시간(8시간)을 저장하고 주간 근무 시간을 계산하시오.',
    sql: `CREATE TABLE work_schedule (
    emp_id     NUMBER,
    work_day   DATE,
    work_hours INTERVAL DAY TO SECOND
);

INSERT INTO work_schedule VALUES (100, DATE '2024-01-15', INTERVAL '0 08:00:00' DAY TO SECOND);
INSERT INTO work_schedule VALUES (100, DATE '2024-01-16', INTERVAL '0 09:30:00' DAY TO SECOND);
INSERT INTO work_schedule VALUES (100, DATE '2024-01-17', INTERVAL '0 07:45:00' DAY TO SECOND);

SELECT emp_id,
       NUMTODSINTERVAL(
           SUM(EXTRACT(HOUR   FROM work_hours) * 3600
             + EXTRACT(MINUTE FROM work_hours) * 60
             + EXTRACT(SECOND FROM work_hours)),
           'SECOND'
       ) AS total_weekly_hours
FROM   work_schedule
GROUP BY emp_id;`,
    result: 'EMP 100의 주간 근무 시간: +01 01:15:00 (1일 1시간 15분 = 25시간 15분)',
    keyPoint: 'EXTRACT로 INTERVAL의 각 필드를 초로 변환하여 합산하고, 다시 NUMTODSINTERVAL로 변환합니다.',
  },
  // ========== Group 3: INTERVAL 산술 연산 ==========
  {
    id: 2113,
    group: 3,
    groupTitle: 'INTERVAL 산술 연산',
    question: 'INTERVAL YEAR TO MONTH 간의 덧셈과 뺄셈을 수행하시오.',
    sql: `SELECT INTERVAL '2' YEAR + INTERVAL '6' MONTH  AS sum_interval,
       INTERVAL '3' YEAR - INTERVAL '8' MONTH  AS diff_interval,
       INTERVAL '1-6'  + INTERVAL '0-8'        AS str_sum
FROM   DUAL;`,
    result: 'SUM: +02-06 | DIFF: +02-04 | STR_SUM: +02-02',
    keyPoint: '동일 타입(INTERVAL YEAR TO MONTH끼리)의 덧셈, 뺄셈이 가능합니다.',
  },
  {
    id: 2114,
    group: 3,
    groupTitle: 'INTERVAL 산술 연산',
    question: 'INTERVAL DAY TO SECOND 간의 덧셈과 뺄셈을 수행하시오.',
    sql: `SELECT INTERVAL '10' HOUR + INTERVAL '90' MINUTE  AS sum_int,
       INTERVAL '5' DAY - INTERVAL '12' HOUR    AS diff_int,
       NUMTODSINTERVAL(48, 'HOUR') + NUMTODSINTERVAL(30, 'MINUTE') AS sum2
FROM   DUAL;`,
    result: 'SUM_INT: +00 11:30:00 | DIFF_INT: +04 12:00:00 | SUM2: +02 00:30:00',
    keyPoint: '동일 타입(INTERVAL DAY TO SECOND끼리)의 덧셈, 뺄셈이 가능합니다.',
  },
  {
    id: 2115,
    group: 3,
    groupTitle: 'INTERVAL 산술 연산',
    question: '날짜 - 날짜 연산 결과를 NUMTODSINTERVAL을 활용하여 INTERVAL DAY TO SECOND로 변환하시오.',
    sql: `SELECT employee_id,
       last_name,
       SYSDATE - hire_date                                      AS days_number,
       NUMTODSINTERVAL(SYSDATE - hire_date, 'DAY')             AS days_interval
FROM   employees
WHERE  department_id = 90
ORDER BY hire_date;`,
    result: '재직일수(NUMBER)와 INTERVAL DAY TO SECOND 형식으로 함께 표시',
    keyPoint: 'DATE - DATE는 NUMBER(일수)를 반환합니다. NUMTODSINTERVAL(일수, \'DAY\')로 INTERVAL로 변환할 수 있습니다.',
  },
  {
    id: 2116,
    group: 3,
    groupTitle: 'INTERVAL 산술 연산',
    question: '음수 INTERVAL을 사용하여 과거 날짜를 계산하시오.',
    sql: `SELECT SYSDATE                                AS today,
       SYSDATE - INTERVAL '1' YEAR           AS one_year_ago,
       SYSDATE + (-INTERVAL '6' MONTH)       AS six_months_ago,
       SYSDATE - TO_YMINTERVAL('2-0')        AS two_years_ago
FROM   DUAL;`,
    result: '오늘 날짜 기준으로 1년 전, 6개월 전, 2년 전 날짜',
    keyPoint: "DATE - INTERVAL 또는 DATE + (-INTERVAL)로 과거 날짜를 계산합니다.",
  },
  {
    id: 2117,
    group: 3,
    groupTitle: 'INTERVAL 산술 연산',
    question: '여러 INTERVAL을 연속 적용하여 복합 날짜 계산을 수행하시오.',
    sql: `SELECT DATE '2023-06-15'                      AS base_date,
       DATE '2023-06-15'
           + INTERVAL '1' YEAR
           + INTERVAL '6' MONTH
           - INTERVAL '15' DAY              AS result_date,
       DATE '2023-06-15'
           + TO_YMINTERVAL('1-6')
           - TO_DSINTERVAL('15 00:00:00')   AS result_date2
FROM   DUAL;`,
    result: 'BASE_DATE: 2023-06-15 | RESULT_DATE: 2024-12-01 | RESULT_DATE2: 2024-12-01',
    keyPoint: '여러 INTERVAL을 연속으로 더하거나 빼서 복합 날짜 계산이 가능합니다. YEAR TO MONTH와 DAY TO SECOND를 혼합할 수 있습니다.',
  },
  {
    id: 2118,
    group: 3,
    groupTitle: 'INTERVAL 산술 연산',
    question: 'INTERVAL 비교 연산자를 사용하여 보증 기간이 2년 이상인 제품을 조회하시오.',
    sql: `SELECT prod_id,
       warranty_time
FROM   warranty
WHERE  warranty_time >= INTERVAL '2' YEAR;`,
    result: '보증 기간이 2년 이상인 제품 목록',
    keyPoint: '동일 타입의 INTERVAL끼리는 비교 연산자(>=, <=, =, >, <)를 사용할 수 있습니다.',
  },
  // ========== Group 4: INTERVAL 활용 ==========
  {
    id: 2119,
    group: 4,
    groupTitle: 'INTERVAL 종합 활용',
    question: "employees 테이블에서 입사일로부터 근무 기간이 5년을 초과하는 직원을 조회하시오.",
    sql: `SELECT employee_id,
       last_name,
       hire_date,
       NUMTOYMINTERVAL(
           TRUNC(MONTHS_BETWEEN(SYSDATE, hire_date)),
           'MONTH'
       ) AS tenure
FROM   employees
WHERE  SYSDATE > hire_date + INTERVAL '5' YEAR
ORDER BY hire_date;`,
    result: '현재 기준 입사 5년 초과 직원 목록',
    keyPoint: 'INTERVAL을 WHERE 조건에서 비교 연산자와 함께 사용하여 기간 필터링이 가능합니다.',
  },
  {
    id: 2120,
    group: 4,
    groupTitle: 'INTERVAL 종합 활용',
    question: "CASE 문으로 급여에 따른 수습 기간을 INTERVAL로 계산하여 수습 완료일을 구하시오.",
    sql: `SELECT employee_id,
       last_name,
       hire_date,
       salary,
       hire_date + CASE
           WHEN salary > 10000 THEN TO_YMINTERVAL('0-3')
           WHEN salary > 5000  THEN TO_YMINTERVAL('0-6')
           ELSE                     TO_YMINTERVAL('1-0')
       END AS probation_end
FROM   employees
WHERE  department_id = 80
ORDER BY salary DESC
FETCH FIRST 5 ROWS ONLY;`,
    result: '급여 구간별로 다른 수습 기간(3개월/6개월/12개월) 후 완료일',
    keyPoint: 'CASE 문에서 INTERVAL 값을 반환하여 조건부 날짜 계산에 활용할 수 있습니다.',
  },
  {
    id: 2121,
    group: 4,
    groupTitle: 'INTERVAL 종합 활용',
    question: "SLA(서비스 수준 협약) 관리: 티켓 생성 시각 기준으로 마감 기한(4시간)을 초과한 미처리 티켓을 조회하시오.",
    sql: `CREATE TABLE tickets (
    ticket_id   NUMBER,
    created_at  TIMESTAMP,
    status      VARCHAR2(20)
);

INSERT INTO tickets VALUES (1, CURRENT_TIMESTAMP - INTERVAL '5 00:00:00' DAY TO SECOND, 'OPEN');
INSERT INTO tickets VALUES (2, CURRENT_TIMESTAMP - INTERVAL '0 03:00:00' DAY TO SECOND, 'OPEN');
INSERT INTO tickets VALUES (3, CURRENT_TIMESTAMP - INTERVAL '0 06:00:00' DAY TO SECOND, 'RESOLVED');

SELECT ticket_id,
       created_at,
       created_at + NUMTODSINTERVAL(4, 'HOUR') AS sla_deadline,
       status
FROM   tickets
WHERE  status = 'OPEN'
AND    created_at + NUMTODSINTERVAL(4, 'HOUR') < CURRENT_TIMESTAMP;`,
    result: 'SLA 초과 미처리 티켓: ticket_id 1',
    keyPoint: 'TIMESTAMP + INTERVAL DAY TO SECOND로 마감 기한을 계산하고 현재 시각과 비교합니다.',
  },
  {
    id: 2122,
    group: 4,
    groupTitle: 'INTERVAL 종합 활용',
    question: "구독 서비스 관리: 구독 시작일과 구독 기간(INTERVAL YEAR TO MONTH)으로 만료일과 갱신 알림일(만료 30일 전)을 계산하시오.",
    sql: `CREATE TABLE subscriptions (
    sub_id       NUMBER,
    start_date   DATE,
    duration     INTERVAL YEAR TO MONTH
);

INSERT INTO subscriptions VALUES (1, DATE '2024-01-01', INTERVAL '1' YEAR);
INSERT INTO subscriptions VALUES (2, DATE '2023-07-15', INTERVAL '2' YEAR);
INSERT INTO subscriptions VALUES (3, DATE '2024-03-01', TO_YMINTERVAL('0-6'));

SELECT sub_id,
       start_date,
       duration,
       start_date + duration                               AS expiry_date,
       start_date + duration - TO_DSINTERVAL('30 00:00:00') AS renewal_notice
FROM   subscriptions
ORDER BY expiry_date;`,
    result: '각 구독의 만료일과 30일 전 갱신 알림일 계산',
    keyPoint: 'DATE + INTERVAL YEAR TO MONTH로 만료일을 계산하고, 만료일 - INTERVAL DAY TO SECOND로 알림일을 계산합니다.',
  },
  // ========== Group 5: 종합 활용 ==========
  {
    id: 2123,
    group: 5,
    groupTitle: '종합 활용',
    question: "프로젝트 타임라인: 시작일과 단계별 소요 기간을 INTERVAL로 관리하고, 각 단계의 예정일을 계산하시오.",
    sql: `CREATE TABLE project_phases (
    project_id    NUMBER,
    phase         VARCHAR2(30),
    phase_start   DATE,
    duration_ym   INTERVAL YEAR TO MONTH,
    duration_ds   INTERVAL DAY TO SECOND
);

INSERT INTO project_phases VALUES (1, '분석', DATE '2024-01-01', INTERVAL '0-2' YEAR TO MONTH, NULL);
INSERT INTO project_phases VALUES (1, '설계', DATE '2024-03-01', NULL, INTERVAL '45 00:00:00' DAY TO SECOND);
INSERT INTO project_phases VALUES (1, '개발', DATE '2024-04-15', INTERVAL '0-6' YEAR TO MONTH, NULL);
INSERT INTO project_phases VALUES (1, '테스트', DATE '2024-10-15', NULL, INTERVAL '30 00:00:00' DAY TO SECOND);

SELECT phase,
       phase_start,
       CASE
           WHEN duration_ym IS NOT NULL THEN phase_start + duration_ym
           ELSE phase_start + duration_ds
       END AS phase_end
FROM   project_phases
ORDER BY phase_start;`,
    result: '각 단계의 예정 종료일 계산 (INTERVAL YEAR TO MONTH 또는 DAY TO SECOND 활용)',
    keyPoint: 'CASE WHEN으로 두 INTERVAL 타입을 구분하여 적절한 타입으로 날짜를 계산합니다.',
  },
  {
    id: 2124,
    group: 5,
    groupTitle: '종합 활용',
    question: "연령 분석: 직원의 나이를 INTERVAL로 계산하고, 연령대별 그룹을 지정하시오.",
    sql: `SELECT employee_id,
       last_name,
       TRUNC(MONTHS_BETWEEN(SYSDATE, hire_date) / 12) AS years_employed,
       NUMTOYMINTERVAL(
           TRUNC(MONTHS_BETWEEN(SYSDATE, hire_date)),
           'MONTH'
       ) AS tenure_interval,
       CASE
           WHEN MONTHS_BETWEEN(SYSDATE, hire_date) < 24  THEN '신입 (2년 미만)'
           WHEN MONTHS_BETWEEN(SYSDATE, hire_date) < 60  THEN '경력 (2~5년)'
           WHEN MONTHS_BETWEEN(SYSDATE, hire_date) < 120 THEN '시니어 (5~10년)'
           ELSE '베테랑 (10년 이상)'
       END AS seniority
FROM   employees
ORDER BY hire_date;`,
    result: '각 직원의 재직 기간(INTERVAL 형식)과 연령대 그룹',
    keyPoint: 'MONTHS_BETWEEN, NUMTOYMINTERVAL, CASE를 조합하여 재직 기간 기반의 분류 쿼리를 작성합니다.',
  },
  {
    id: 2125,
    group: 5,
    groupTitle: '종합 활용',
    question: "INTERVAL을 집계 함수와 활용: 부서별 평균 재직 기간을 계산하고 NUMTOYMINTERVAL로 변환하시오.",
    sql: `SELECT d.department_name,
       COUNT(e.employee_id) AS headcount,
       ROUND(AVG(MONTHS_BETWEEN(SYSDATE, e.hire_date)), 0) AS avg_months,
       NUMTOYMINTERVAL(
           ROUND(AVG(MONTHS_BETWEEN(SYSDATE, e.hire_date)), 0),
           'MONTH'
       ) AS avg_tenure
FROM   employees e
JOIN   departments d ON e.department_id = d.department_id
GROUP BY d.department_name
HAVING COUNT(e.employee_id) >= 3
ORDER BY avg_months DESC;`,
    result: '3명 이상 부서의 부서명, 인원수, 평균 재직 기간(INTERVAL 형식)',
    keyPoint: 'AVG(MONTHS_BETWEEN(...))으로 평균 개월 수를 구하고 NUMTOYMINTERVAL로 INTERVAL 형식으로 변환합니다.',
  },
  {
    id: 2126,
    group: 5,
    groupTitle: '종합 활용',
    question: "비즈니스 일정 관리 종합: 연간 계획 수립을 위해 현재 날짜 기준의 분기별 마감일과 연간 검토일을 계산하시오.",
    sql: `SELECT SYSDATE                                        AS today,
       -- 분기별 마감일
       TRUNC(SYSDATE, 'Q') + TO_YMINTERVAL('0-3') - 1 AS q1_end,
       TRUNC(SYSDATE, 'Q') + TO_YMINTERVAL('0-6') - 1 AS q2_end,
       TRUNC(SYSDATE, 'Q') + TO_YMINTERVAL('0-9') - 1 AS q3_end,
       TRUNC(SYSDATE, 'Q') + TO_YMINTERVAL('1-0') - 1 AS q4_end,
       -- 6개월 후 중간 검토일
       SYSDATE + TO_YMINTERVAL('0-6')               AS mid_review,
       -- 1년 후 연간 검토일
       SYSDATE + TO_YMINTERVAL('1-0')               AS annual_review,
       -- 배포 주기 (90일마다)
       SYSDATE + TO_DSINTERVAL('90 00:00:00')        AS next_release
FROM   DUAL;`,
    result: '오늘 기준 분기별 마감일, 중간 검토일(+6개월), 연간 검토일(+1년), 다음 배포일(+90일)',
    keyPoint: 'INTERVAL YEAR TO MONTH와 DAY TO SECOND를 혼합하여 비즈니스 일정을 체계적으로 관리합니다.',
  },
]
