import type { PracticeProblem } from '@/lib/types'

export const ch20Practice: PracticeProblem[] = [
  // ========== Group 1: 세션 시간대 설정 및 날짜/시간 함수 비교 ==========
  {
    id: 2001,
    group: 1,
    groupTitle: '세션 시간대 설정',
    question: '세션 시간대를 UTC-5로 설정하고, CURRENT_DATE, CURRENT_TIMESTAMP, LOCALTIMESTAMP를 조회하여 차이를 확인하시오.',
    sql: `ALTER SESSION SET NLS_DATE_FORMAT = 'DD-MON-YYYY HH24:MI:SS';
ALTER SESSION SET TIME_ZONE = '-5:00';

SELECT SESSIONTIMEZONE    AS tz,
       CURRENT_DATE        AS cur_date,
       CURRENT_TIMESTAMP   AS cur_ts,
       LOCALTIMESTAMP      AS local_ts
FROM   DUAL;`,
    result: 'TZ: -05:00 | CURRENT_DATE: DATE | CURRENT_TIMESTAMP: TIMESTAMP WITH TIME ZONE | LOCALTIMESTAMP: TIMESTAMP',
    keyPoint: 'CURRENT_DATE: DATE(시간대 없음), CURRENT_TIMESTAMP: TIMESTAMP WITH TIME ZONE(시간대 포함), LOCALTIMESTAMP: TIMESTAMP(시간대 없음). 세 함수 모두 세션 시간대를 반영합니다.',
  },
  {
    id: 2002,
    group: 1,
    groupTitle: '세션 시간대 설정',
    question: '세션 시간대를 지역명 방식으로 설정하고 SESSIONTIMEZONE을 조회하시오.',
    sql: `ALTER SESSION SET TIME_ZONE = 'America/New_York';

SELECT SESSIONTIMEZONE FROM DUAL;`,
    result: 'SESSIONTIMEZONE: America/New_York',
    keyPoint: '지역명으로 설정하면 SESSIONTIMEZONE은 오프셋이 아닌 지역명 문자열을 반환합니다.',
  },
  {
    id: 2003,
    group: 1,
    groupTitle: '세션 시간대 설정',
    question: 'DB 시간대와 세션 시간대를 각각 조회하시오.',
    sql: `SELECT DBTIMEZONE, SESSIONTIMEZONE FROM DUAL;`,
    result: 'DBTIMEZONE: +00:00 (또는 DB 설정값) | SESSIONTIMEZONE: 현재 세션 설정값',
    keyPoint: 'DBTIMEZONE은 DB 서버 시간대(변경하려면 DBA 권한 필요), SESSIONTIMEZONE은 세션별로 독립 설정 가능합니다.',
  },
  {
    id: 2004,
    group: 1,
    groupTitle: '세션 시간대 설정',
    question: '세션 시간대를 DB 시간대와 동일하게 설정하시오.',
    sql: `ALTER SESSION SET TIME_ZONE = dbtimezone;

SELECT SESSIONTIMEZONE FROM DUAL;`,
    result: 'SESSIONTIMEZONE: DB 시간대와 동일 (예: +00:00)',
    keyPoint: 'ALTER SESSION SET TIME_ZONE = dbtimezone 구문으로 세션 시간대를 DB 시간대와 동일하게 설정합니다.',
  },
  {
    id: 2005,
    group: 1,
    groupTitle: '세션 시간대 설정',
    question: 'SYSDATE와 CURRENT_DATE를 비교하고, 세션 시간대가 -05:00일 때 두 값의 차이를 확인하시오.',
    sql: `ALTER SESSION SET TIME_ZONE = '-05:00';

SELECT SYSDATE        AS db_time,
       CURRENT_DATE   AS session_time,
       (CURRENT_DATE - SYSDATE) * 24 AS diff_hours
FROM   DUAL;`,
    result: 'DB_TIME: DB 서버 시각 | SESSION_TIME: 세션 시각(-5h) | DIFF_HOURS: -5 (DB가 UTC일 때)',
    keyPoint: 'SYSDATE는 DB 서버 시간대 기준, CURRENT_DATE는 세션 시간대 기준입니다. 세션 TZ=-05:00, DB TZ=UTC이면 5시간 차이가 납니다.',
  },
  {
    id: 2006,
    group: 1,
    groupTitle: '세션 시간대 설정',
    question: 'web_orders 테이블(order_date TIMESTAMP WITH TIME ZONE, delivery_time TIMESTAMP WITH LOCAL TIME ZONE)을 생성하고 현재 시각으로 데이터를 삽입하시오.',
    sql: `CREATE TABLE web_orders (
    order_date    TIMESTAMP WITH TIME ZONE,
    delivery_time TIMESTAMP WITH LOCAL TIME ZONE
);

INSERT INTO web_orders VALUES (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + 2);

SELECT * FROM web_orders;`,
    result: 'ORDER_DATE: TIMESTAMP WITH TIME ZONE | DELIVERY_TIME: TIMESTAMP WITH LOCAL TIME ZONE',
    keyPoint: 'TIMESTAMP WITH TIME ZONE은 시간대 정보 그대로 저장, WITH LOCAL TIME ZONE은 DB TZ로 정규화 후 저장(조회 시 세션 TZ로 표시).',
  },
  // ========== Group 2: TIMESTAMP 타입 3종 ==========
  {
    id: 2007,
    group: 2,
    groupTitle: 'TIMESTAMP 타입 3종',
    question: 'employees 테이블의 hire_date 컬럼을 TIMESTAMP 타입으로 변경하고 결과를 조회하시오.',
    sql: `ALTER TABLE emp4 MODIFY hire_date TIMESTAMP;

SELECT hire_date FROM emp4 FETCH FIRST 5 ROWS ONLY;`,
    result: '소수점 초(.000000000)가 포함된 TIMESTAMP 형식으로 표시됩니다.',
    keyPoint: 'DATE를 TIMESTAMP로 변경하면 소수점 초(나노초) 정보가 함께 저장됩니다. DATE의 시간 정보는 보존됩니다.',
  },
  {
    id: 2008,
    group: 2,
    groupTitle: 'TIMESTAMP 타입 3종',
    question: 'FROM_TZ 함수를 사용하여 TIMESTAMP에 호주 북부 시간대를 추가하시오.',
    sql: `SELECT FROM_TZ(TIMESTAMP '2000-07-12 08:00:00', 'Australia/North')
FROM   DUAL;`,
    result: '2000-07-12 08:00:00.000000000 AUSTRALIA/NORTH',
    keyPoint: "FROM_TZ(TIMESTAMP '...', '시간대')는 TIMESTAMP를 TIMESTAMP WITH TIME ZONE으로 변환합니다.",
  },
  {
    id: 2009,
    group: 2,
    groupTitle: 'TIMESTAMP 타입 3종',
    question: "TO_TIMESTAMP 함수로 문자열을 TIMESTAMP로 변환하시오. ('2016-03-06 11:00:00')",
    sql: `SELECT TO_TIMESTAMP('2016-03-06 11:00:00', 'YYYY-MM-DD HH24:MI:SS')
FROM   DUAL;`,
    result: '06-MAR-16 11.00.00.000000000 AM',
    keyPoint: "TO_TIMESTAMP(문자열, 형식마스크)로 문자열을 TIMESTAMP로 변환합니다. DATE 변환의 TO_DATE와 유사합니다.",
  },
  {
    id: 2010,
    group: 2,
    groupTitle: 'TIMESTAMP 타입 3종',
    question: 'TZ_OFFSET 함수로 여러 시간대의 UTC 오프셋을 조회하시오.',
    sql: `SELECT TZ_OFFSET('US/Eastern')   AS eastern,
       TZ_OFFSET('Canada/Yukon')   AS yukon,
       TZ_OFFSET('Europe/London')  AS london,
       TZ_OFFSET('Asia/Seoul')     AS seoul
FROM   DUAL;`,
    result: 'EASTERN: -05:00 | YUKON: -07:00 | LONDON: +00:00 | SEOUL: +09:00',
    keyPoint: 'TZ_OFFSET(지역명)은 해당 시간대의 UTC 기준 오프셋을 반환합니다.',
  },
  {
    id: 2011,
    group: 2,
    groupTitle: 'TIMESTAMP 타입 3종',
    question: 'TIMESTAMP WITH LOCAL TIME ZONE 컬럼에 데이터를 삽입하고, 다른 세션 시간대에서 조회했을 때 자동 변환되는 방식을 이해하는 예제를 작성하시오.',
    sql: `-- 세션1 (서울, UTC+9)에서 삽입
ALTER SESSION SET TIME_ZONE = 'Asia/Seoul';
INSERT INTO web_orders (delivery_time) VALUES (CURRENT_TIMESTAMP);
COMMIT;

-- 세션2 (뉴욕, UTC-5)에서 조회
ALTER SESSION SET TIME_ZONE = 'America/New_York';
SELECT delivery_time FROM web_orders;
-- 14시간 이른 시각이 표시됨`,
    result: '서울 15:00 삽입 → 뉴욕 01:00로 표시 (14시간 차이)',
    keyPoint: 'WITH LOCAL TIME ZONE: 저장 시 DB TZ로 정규화, 조회 시 세션 TZ로 자동 변환. 글로벌 앱에서 세션별 현지 시각 자동 표시에 유용합니다.',
  },
  {
    id: 2012,
    group: 2,
    groupTitle: 'TIMESTAMP 타입 3종',
    question: 'TIMESTAMP WITH TIME ZONE 타입에 CURRENT_TIMESTAMP를 삽입하고 조회하시오.',
    sql: `CREATE TABLE tz_test (
    id      NUMBER,
    ts_col  TIMESTAMP WITH TIME ZONE
);

INSERT INTO tz_test VALUES (1, CURRENT_TIMESTAMP);
COMMIT;

SELECT * FROM tz_test;`,
    result: 'TS_COL: 현재 날짜시각 +세션시간대 오프셋',
    keyPoint: 'CURRENT_TIMESTAMP는 TIMESTAMP WITH TIME ZONE 타입이므로 해당 컬럼에 직접 삽입 가능하며, 세션 시간대 정보가 함께 저장됩니다.',
  },
  // ========== Group 3: INTERVAL 타입 ==========
  {
    id: 2013,
    group: 3,
    groupTitle: 'INTERVAL 타입',
    question: 'warranty 테이블에 다양한 INTERVAL YEAR TO MONTH 값을 삽입하고 조회하시오.',
    sql: `CREATE TABLE warranty (
    prod_id       NUMBER,
    warranty_time INTERVAL YEAR(3) TO MONTH
);

INSERT INTO warranty VALUES (123, INTERVAL '8' MONTH);
INSERT INTO warranty VALUES (155, INTERVAL '200' YEAR(3));
INSERT INTO warranty VALUES (678, '200-11');

SELECT * FROM warranty;`,
    result: '123: +00-08 | 155: +200-00 | 678: +200-11',
    keyPoint: "INTERVAL YEAR TO MONTH 출력 형식은 '+YEAR-MONTH'입니다. '200-11' 문자열 리터럴도 직접 삽입 가능합니다.",
  },
  {
    id: 2014,
    group: 3,
    groupTitle: 'INTERVAL 타입',
    question: 'lab 테이블에 INTERVAL DAY TO SECOND 값을 삽입하고 조회하시오.',
    sql: `CREATE TABLE lab (
    exp_id    NUMBER,
    test_time INTERVAL DAY(2) TO SECOND
);

INSERT INTO lab VALUES (100012, '90 00:00:00');
INSERT INTO lab VALUES (56098,  INTERVAL '6 03:30:16' DAY TO SECOND);

SELECT * FROM lab;`,
    result: '100012: +90 00:00:00.000000 | 56098: +06 03:30:16.000000',
    keyPoint: "INTERVAL DAY TO SECOND 출력 형식은 '+DD HH:MM:SS.ffffff'입니다. 문자열 리터럴과 INTERVAL 키워드 모두 사용 가능합니다.",
  },
  {
    id: 2015,
    group: 3,
    groupTitle: 'INTERVAL 타입',
    question: 'TO_YMINTERVAL을 사용하여 직원 입사일로부터 1년 2개월 후 날짜를 계산하시오.',
    sql: `SELECT hire_date,
       hire_date + TO_YMINTERVAL('01-02') AS hire_plus_14m
FROM   employees
WHERE  department_id = 20;`,
    result: '각 직원의 입사일에서 1년 2개월(14개월) 후 날짜',
    keyPoint: "TO_YMINTERVAL('YEAR-MONTH')로 INTERVAL YEAR TO MONTH 값을 생성합니다. '01-02'는 1년 2개월입니다.",
  },
  {
    id: 2016,
    group: 3,
    groupTitle: 'INTERVAL 타입',
    question: 'TO_DSINTERVAL을 사용하여 입사일로부터 100일 10시간 후 날짜를 계산하시오.',
    sql: `SELECT last_name,
       TO_CHAR(hire_date, 'MM-DD-YY:HH:MI:SS')                     AS hire_date,
       TO_CHAR(hire_date + TO_DSINTERVAL('100 10:00:00'),
               'MM-DD-YY:HH:MI:SS')                                 AS hire_plus
FROM   employees;`,
    result: '각 직원의 입사일에서 100일 10시간 후 날짜+시간',
    keyPoint: "TO_DSINTERVAL('일수 HH:MI:SS')로 INTERVAL DAY TO SECOND 값을 생성합니다. '100 10:00:00'은 100일 10시간입니다.",
  },
  {
    id: 2017,
    group: 3,
    groupTitle: 'INTERVAL 타입',
    question: 'TO_YMINTERVAL과 TO_DSINTERVAL의 결과 차이를 윤년 날짜로 비교하시오.',
    sql: `-- 2024년은 윤년(366일)
SELECT DATE '2024-01-01' + TO_YMINTERVAL('01-00')   AS plus_1year,
       DATE '2024-01-01' + TO_DSINTERVAL('365 00:00:00') AS plus_365days
FROM   DUAL;`,
    result: 'PLUS_1YEAR: 2025-01-01 | PLUS_365DAYS: 2024-12-31 (1일 차이)',
    keyPoint: 'TO_YMINTERVAL은 달력 기준 1년 후(366일 해도 2025-01-01), TO_DSINTERVAL은 정확히 365일 후(윤년이면 2024-12-31)입니다.',
  },
  {
    id: 2018,
    group: 3,
    groupTitle: 'INTERVAL 타입',
    question: "INTERVAL '8' MONTH를 직원의 hire_date에 더하여 수습 기간 종료일을 계산하시오.",
    sql: `SELECT employee_id,
       last_name,
       hire_date,
       hire_date + INTERVAL '8' MONTH AS probation_end
FROM   employees
WHERE  department_id = 80
ORDER BY hire_date
FETCH FIRST 5 ROWS ONLY;`,
    result: '각 직원의 입사일에서 8개월 후 수습 기간 종료일',
    keyPoint: "INTERVAL '8' MONTH는 INTERVAL YEAR TO MONTH 리터럴로 8개월의 간격을 나타냅니다.",
  },
  // ========== Group 4: 날짜/시간 함수 (EXTRACT, TZ_OFFSET, FROM_TZ, TO_TIMESTAMP) ==========
  {
    id: 2019,
    group: 4,
    groupTitle: '날짜/시간 함수',
    question: 'EXTRACT 함수를 사용하여 2007년 이후 입사한 직원을 조회하시오.',
    sql: `SELECT last_name, employee_id, hire_date
FROM   employees
WHERE  EXTRACT(YEAR FROM hire_date) > 2007
ORDER BY hire_date;`,
    result: '2007년 이후 입사한 직원 목록',
    keyPoint: 'EXTRACT(YEAR FROM date_col)로 날짜에서 연도를 추출하여 조건 비교에 활용합니다.',
  },
  {
    id: 2020,
    group: 4,
    groupTitle: '날짜/시간 함수',
    question: 'EXTRACT 함수로 입사 월을 추출하고, CEIL을 사용하여 입사 분기도 함께 계산하시오.',
    sql: `SELECT last_name,
       hire_date,
       EXTRACT(MONTH FROM hire_date)                  AS hire_month,
       CEIL(EXTRACT(MONTH FROM hire_date) / 3)        AS hire_quarter
FROM   employees
WHERE  manager_id = 100;`,
    result: '각 직원의 입사 월과 입사 분기(1~4분기)',
    keyPoint: 'Oracle EXTRACT는 QUARTER를 지원하지 않으므로 CEIL(MONTH/3)으로 분기를 계산합니다.',
  },
  {
    id: 2021,
    group: 4,
    groupTitle: '날짜/시간 함수',
    question: 'EXTRACT로 TIMEZONE_HOUR와 TIMEZONE_MINUTE를 추출하시오.',
    sql: `SELECT EXTRACT(TIMEZONE_HOUR   FROM CURRENT_TIMESTAMP) AS tz_hour,
       EXTRACT(TIMEZONE_MINUTE FROM CURRENT_TIMESTAMP) AS tz_minute
FROM   DUAL;`,
    result: 'TZ_HOUR: 세션 시간대 시간 부분 | TZ_MINUTE: 세션 시간대 분 부분',
    keyPoint: 'TIMESTAMP WITH TIME ZONE에서 EXTRACT(TIMEZONE_HOUR/MINUTE)로 시간대 오프셋의 시간/분을 추출합니다.',
  },
  {
    id: 2022,
    group: 4,
    groupTitle: '날짜/시간 함수',
    question: 'FROM_TZ와 TO_TIMESTAMP를 조합하여 문자열을 특정 시간대의 TIMESTAMP WITH TIME ZONE으로 변환하시오.',
    sql: `SELECT FROM_TZ(
           TO_TIMESTAMP('2024-06-15 10:30:00', 'YYYY-MM-DD HH24:MI:SS'),
           'Asia/Seoul'
       ) AS seoul_ts
FROM   DUAL;`,
    result: '2024-06-15 10:30:00.000000000 ASIA/SEOUL',
    keyPoint: 'FROM_TZ(TO_TIMESTAMP(...), 시간대) 조합으로 문자열 → TIMESTAMP → TIMESTAMP WITH TIME ZONE 변환이 가능합니다.',
  },
  // ========== Group 5: 종합 활용 ==========
  {
    id: 2023,
    group: 5,
    groupTitle: '종합 활용',
    question: 'web_orders 테이블에서 주문 날짜의 연도, 월, 일을 EXTRACT로 분해하고, 주문 후 7일 배송 마감일을 TO_DSINTERVAL로 계산하시오.',
    sql: `SELECT order_date,
       EXTRACT(YEAR  FROM order_date)           AS order_year,
       EXTRACT(MONTH FROM order_date)           AS order_month,
       EXTRACT(DAY   FROM order_date)           AS order_day,
       order_date + TO_DSINTERVAL('7 00:00:00') AS delivery_deadline
FROM   web_orders;`,
    result: '주문 날짜의 연월일 분해 및 7일 후 배송 마감일',
    keyPoint: 'EXTRACT로 날짜 컴포넌트를 분해하고 TO_DSINTERVAL로 일 단위 연산을 수행하는 패턴입니다.',
  },
  {
    id: 2024,
    group: 5,
    groupTitle: '종합 활용',
    question: '전 세계 주문 시스템 쿼리: 한국(UTC+9) 기준으로 입력된 주문 시각을 미국 동부(UTC-5)로 변환하여 표시하시오.',
    sql: `-- FROM_TZ로 한국 시간대 명시, AT TIME ZONE으로 변환
SELECT order_date                                           AS original_ts,
       FROM_TZ(
           CAST(CURRENT_TIMESTAMP AS TIMESTAMP),
           'Asia/Seoul'
       ) AT TIME ZONE 'America/New_York'                    AS ny_time
FROM   web_orders;`,
    result: '한국 시각과 뉴욕 시각(14시간 차이)이 함께 표시됩니다.',
    keyPoint: 'AT TIME ZONE 연산자로 TIMESTAMP WITH TIME ZONE 값을 다른 시간대로 변환하여 표시합니다.',
  },
  {
    id: 2025,
    group: 5,
    groupTitle: '종합 활용',
    question: 'employees 테이블에서 입사 연도별, 분기별 입사 인원을 집계하시오.',
    sql: `SELECT EXTRACT(YEAR  FROM hire_date)                   AS hire_year,
       CEIL(EXTRACT(MONTH FROM hire_date) / 3)           AS hire_quarter,
       COUNT(*)                                           AS head_count
FROM   employees
GROUP BY EXTRACT(YEAR  FROM hire_date),
         CEIL(EXTRACT(MONTH FROM hire_date) / 3)
ORDER BY hire_year, hire_quarter;`,
    result: '연도별, 분기별 입사 인원 집계',
    keyPoint: 'EXTRACT와 CEIL을 GROUP BY절에서 사용하여 분기별 집계를 수행합니다.',
  },
  {
    id: 2026,
    group: 5,
    groupTitle: '종합 활용',
    question: 'warranty 테이블 생성 후 다양한 INTERVAL 타입 데이터를 삽입하고, INTERVAL 연산으로 보증 만료일을 계산하시오.',
    sql: `-- 테이블 생성 (이미 있으면 생략)
CREATE TABLE products (
    prod_id        NUMBER,
    release_date   DATE,
    warranty_years INTERVAL YEAR TO MONTH
);

INSERT INTO products VALUES (1, DATE '2023-01-15', INTERVAL '2' YEAR);
INSERT INTO products VALUES (2, DATE '2022-06-01', INTERVAL '18' MONTH);
INSERT INTO products VALUES (3, DATE '2024-03-01', TO_YMINTERVAL('1-6'));

SELECT prod_id,
       release_date,
       warranty_years,
       release_date + warranty_years AS expiry_date
FROM   products;`,
    result: 'PROD 1: 2025-01-15 | PROD 2: 2024-12-01 | PROD 3: 2025-09-01',
    keyPoint: 'INTERVAL YEAR TO MONTH 값을 DATE에 더하여 보증 만료일을 계산합니다. INTERVAL 리터럴, 문자열, TO_YMINTERVAL 모두 사용 가능합니다.',
  },
]
