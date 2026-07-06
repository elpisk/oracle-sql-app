import type { PracticeProblem } from '@/lib/types'

export const ch12Practice: PracticeProblem[] = [
  // ── Group 1: 인덱스 생성 & 기본 조회 ─────────────────────
  {
    id: 1201, group: 1, groupTitle: '인덱스 생성 & 기본 조회',
    question: 'EMPLOYEES 테이블의 LAST_NAME 열에 비고유 인덱스를 생성하시오.',
    sql: `CREATE INDEX emp_last_name_idx
ON employees (last_name);

SELECT index_name, table_name, uniqueness
FROM   user_indexes
WHERE  table_name = 'EMPLOYEES'
AND    index_name = 'EMP_LAST_NAME_IDX';`,
    result: 'Index created. INDEX_NAME=EMP_LAST_NAME_IDX, UNIQUENESS=NONUNIQUE',
    keyPoint: 'CREATE INDEX 기본 구문. UNIQUE 키워드 없으면 비고유 인덱스 생성.',
  },
  {
    id: 1202, group: 1, groupTitle: '인덱스 생성 & 기본 조회',
    question: 'EMPLOYEES 테이블의 EMAIL 열에 UNIQUE 인덱스를 생성하시오. (이미 UK 제약이 있는 경우 이름 충돌 확인)',
    sql: `CREATE UNIQUE INDEX emp_email_manual_idx
ON employees (email);`,
    result: 'Index created.',
    keyPoint: 'CREATE UNIQUE INDEX 구문. PK/UK 제약에 의해 이미 인덱스가 있는 열에 추가 생성은 오류 또는 중복.',
  },
  {
    id: 1203, group: 1, groupTitle: '인덱스 생성 & 기본 조회',
    question: 'USER_INDEXES와 USER_IND_COLUMNS를 조회하여 EMPLOYEES의 모든 인덱스 정보를 확인하시오.',
    sql: `SELECT index_name, uniqueness, index_type
FROM   user_indexes
WHERE  table_name = 'EMPLOYEES'
ORDER BY index_name;

SELECT i.index_name, c.column_name, i.uniqueness
FROM   user_indexes     i
JOIN   user_ind_columns c ON i.index_name = c.index_name
WHERE  i.table_name = 'EMPLOYEES'
ORDER BY i.index_name, c.column_position;`,
    result: 'EMP_DEPARTMENT_IX, EMP_EMAIL_UK, EMP_EMP_ID_PK, EMP_JOB_IX, EMP_LAST_NAME_IDX 등 인덱스 목록과 열 정보 출력.',
    keyPoint: 'USER_INDEXES: 인덱스 기본 정보. USER_IND_COLUMNS: 인덱스별 열 정보. JOIN으로 종합 조회.',
  },
  {
    id: 1204, group: 1, groupTitle: '인덱스 생성 & 기본 조회',
    question: 'USER_CONSTRAINTS와 USER_INDEXES를 JOIN하여 자동 생성된 인덱스와 수동 생성 인덱스를 구분하시오.',
    sql: `SELECT c.constraint_name,
       c.constraint_type,
       i.index_name,
       i.uniqueness
FROM   user_constraints c
JOIN   user_indexes     i ON c.constraint_name = i.index_name
WHERE  c.table_name = 'EMPLOYEES';`,
    result: 'EMP_EMP_ID_PK(P), EMP_EMAIL_UK(U) — PK/UK 제약 이름 = 자동 생성 인덱스 이름.',
    keyPoint: 'PK/UK 제약으로 자동 생성된 인덱스는 CONSTRAINT_NAME = INDEX_NAME. 수동 인덱스는 이 JOIN에 나타나지 않음.',
  },
  {
    id: 1205, group: 1, groupTitle: '인덱스 생성 & 기본 조회',
    question: 'DEPARTMENTS 테이블에 LOCATION_ID 열 인덱스를 생성하고 딕셔너리에서 확인하시오.',
    sql: `CREATE INDEX dept_loc_idx
ON departments (location_id);

SELECT index_name, table_name, uniqueness, index_type
FROM   user_indexes
WHERE  index_name = 'DEPT_LOC_IDX';`,
    result: 'Index created. DEPT_LOC_IDX, DEPARTMENTS, NONUNIQUE, NORMAL',
    keyPoint: '외래 키 열에 인덱스 생성. FK 열에 인덱스가 없으면 부모 테이블 DELETE/UPDATE 시 잠금 문제 발생 가능.',
  },
  {
    id: 1206, group: 1, groupTitle: '인덱스 생성 & 기본 조회',
    question: 'USING INDEX를 사용하여 PK 인덱스 이름을 직접 지정하는 테이블을 생성하고 인덱스 이름을 확인하시오.',
    sql: `CREATE TABLE prod_orders (
    order_id     NUMBER(10)
        PRIMARY KEY USING INDEX
        (CREATE INDEX prod_ord_pk_idx ON prod_orders(order_id)),
    product_name VARCHAR2(100) NOT NULL,
    qty          NUMBER(5) DEFAULT 1
);

SELECT index_name, table_name, uniqueness
FROM   user_indexes
WHERE  table_name = 'PROD_ORDERS';

DROP TABLE prod_orders;`,
    result: 'Table created. PROD_ORD_PK_IDX, PROD_ORDERS, UNIQUE 확인.',
    keyPoint: 'USING INDEX로 PK/UK 제약에 대한 인덱스 이름 직접 지정. Oracle 자동 생성 이름(SYS_C...) 대신 의미 있는 이름.',
  },

  // ── Group 2: 복합 인덱스 ─────────────────────────────────
  {
    id: 1207, group: 2, groupTitle: '복합 인덱스',
    question: 'EMPLOYEES 테이블에 DEPARTMENT_ID, JOB_ID 복합 인덱스를 생성하고 열 정보를 확인하시오.',
    sql: `CREATE INDEX emp_dept_job_idx
ON employees (department_id, job_id);

SELECT index_name, column_name, column_position
FROM   user_ind_columns
WHERE  index_name = 'EMP_DEPT_JOB_IDX'
ORDER BY column_position;`,
    result: 'Index created. DEPARTMENT_ID(position=1), JOB_ID(position=2)',
    keyPoint: 'CREATE INDEX 인덱스명 ON 테이블명(열1, 열2) 형식. USER_IND_COLUMNS에서 COLUMN_POSITION으로 열 순서 확인.',
  },
  {
    id: 1208, group: 2, groupTitle: '복합 인덱스',
    question: '복합 인덱스 활용 쿼리를 실행하시오. 선두 열 포함/미포함 조건의 차이를 확인하시오.',
    sql: `-- 선두 열 포함 → 복합 인덱스 활용 가능
SELECT employee_id, last_name, salary
FROM   employees
WHERE  department_id = 80
AND    job_id = 'SA_REP';

-- 선두 열만 사용 → 인덱스 활용 가능
SELECT employee_id, last_name
FROM   employees
WHERE  department_id = 80;

-- 선두 열 없음 → emp_dept_job_idx 미활용
SELECT employee_id, last_name
FROM   employees
WHERE  job_id = 'SA_REP';`,
    result: '첫 두 쿼리는 복합 인덱스 활용 가능. 세 번째 쿼리는 job_id 단독 인덱스 없으면 풀 스캔.',
    keyPoint: '복합 인덱스는 선두 열(department_id)을 포함하는 조건에서만 효과적.',
  },
  {
    id: 1209, group: 2, groupTitle: '복합 인덱스',
    question: '세 열을 포함하는 복합 인덱스를 생성하고 USER_IND_COLUMNS에서 열 순서를 확인하시오.',
    sql: `CREATE INDEX emp_name_dept_idx
ON employees (last_name, first_name, department_id);

SELECT index_name, column_name, column_position
FROM   user_ind_columns
WHERE  index_name = 'EMP_NAME_DEPT_IDX'
ORDER BY column_position;`,
    result: 'Index created. last_name(1), first_name(2), department_id(3)',
    keyPoint: '세 열 이상 복합 인덱스도 가능. 자주 조회하는 열 순서대로 배치하는 것이 설계 핵심.',
  },
  {
    id: 1210, group: 2, groupTitle: '복합 인덱스',
    question: '동일 열로 순서를 바꾼 두 복합 인덱스를 생성하고 각각 효과적인 쿼리를 실행하시오.',
    sql: `CREATE INDEX emp_dept_sal_idx ON employees(department_id, salary);
CREATE INDEX emp_sal_dept_idx ON employees(salary, department_id);

-- emp_dept_sal_idx에 효과적인 쿼리 (선두: department_id)
SELECT employee_id, last_name, salary
FROM   employees
WHERE  department_id = 80 AND salary > 5000;

-- emp_sal_dept_idx에 효과적인 쿼리 (선두: salary)
SELECT employee_id, last_name, department_id
FROM   employees
WHERE  salary > 10000 AND department_id = 90;`,
    result: '두 쿼리 모두 정상 실행. 열 순서에 따라 각각 다른 인덱스가 효과적.',
    keyPoint: '같은 열로 구성된 복합 인덱스도 열 순서에 따라 활용되는 쿼리 패턴이 다름.',
  },
  {
    id: 1211, group: 2, groupTitle: '복합 인덱스',
    question: '현재 EMPLOYEES 테이블의 모든 인덱스를 종합 조회하시오.',
    sql: `SELECT i.index_name,
       i.uniqueness,
       i.index_type,
       i.visibility,
       LISTAGG(c.column_name, ', ')
           WITHIN GROUP (ORDER BY c.column_position) AS columns
FROM   user_indexes     i
JOIN   user_ind_columns c ON i.index_name = c.index_name
WHERE  i.table_name = 'EMPLOYEES'
GROUP BY i.index_name, i.uniqueness, i.index_type, i.visibility
ORDER BY i.index_name;`,
    result: '모든 인덱스 이름, 고유 여부, 타입, 가시성, 포함 열 목록 출력.',
    keyPoint: 'LISTAGG로 복합 인덱스의 열을 한 행에 조합하여 조회.',
  },
  {
    id: 1212, group: 2, groupTitle: '복합 인덱스',
    question: '실습에서 생성한 복합 인덱스들을 삭제하시오.',
    sql: `DROP INDEX emp_dept_job_idx;
DROP INDEX emp_name_dept_idx;
DROP INDEX emp_dept_sal_idx;
DROP INDEX emp_sal_dept_idx;

SELECT index_name FROM user_indexes
WHERE  index_name IN (
    'EMP_DEPT_JOB_IDX','EMP_NAME_DEPT_IDX',
    'EMP_DEPT_SAL_IDX','EMP_SAL_DEPT_IDX');`,
    result: '4개 Index dropped. SELECT 결과: 0 rows.',
    keyPoint: 'DROP INDEX 인덱스명으로 삭제. 테이블은 영향 없음. 자동 생성 인덱스(PK/UK)는 제약 조건 삭제 시 함께 삭제.',
  },

  // ── Group 3: 함수 기반 인덱스 ─────────────────────────────
  {
    id: 1213, group: 3, groupTitle: '함수 기반 인덱스',
    question: '대소문자 무관 검색을 위한 함수 기반 인덱스를 생성하고 INDEX_TYPE을 확인하시오.',
    sql: `CREATE INDEX emp_upper_last_idx
ON employees (UPPER(last_name));

SELECT index_name, index_type
FROM   user_indexes
WHERE  index_name = 'EMP_UPPER_LAST_IDX';`,
    result: "Index created. EMP_UPPER_LAST_IDX, FUNCTION-BASED NORMAL",
    keyPoint: "함수 기반 인덱스 INDEX_TYPE = 'FUNCTION-BASED NORMAL'. 일반 B-TREE는 'NORMAL'.",
  },
  {
    id: 1214, group: 3, groupTitle: '함수 기반 인덱스',
    question: '함수 기반 인덱스 활용 쿼리 vs 미활용 쿼리를 실행하고 차이를 확인하시오.',
    sql: `-- 함수 기반 인덱스 활용 (UPPER 사용)
SELECT employee_id, last_name
FROM   employees
WHERE  UPPER(last_name) = 'KING';

-- 일반 인덱스 활용 (UPPER 미사용)
SELECT employee_id, last_name
FROM   employees
WHERE  last_name = 'King';`,
    result: "두 쿼리 모두 employee_id=100, last_name='King' 반환.",
    keyPoint: "UPPER(last_name) 인덱스는 UPPER() 함수 사용 쿼리에서만 활용. 일반 last_name 조건은 다른 인덱스 사용.",
  },
  {
    id: 1215, group: 3, groupTitle: '함수 기반 인덱스',
    question: 'USER_IND_EXPRESSIONS 뷰에서 함수 기반 인덱스의 표현식을 조회하시오.',
    sql: `SELECT index_name, column_expression, column_position
FROM   user_ind_expressions
WHERE  index_name = 'EMP_UPPER_LAST_IDX';`,
    result: 'EMP_UPPER_LAST_IDX, UPPER("LAST_NAME"), 1',
    keyPoint: 'USER_IND_EXPRESSIONS에서 함수 기반 인덱스의 실제 표현식 확인. USER_IND_COLUMNS에는 SYS_NC로 표시됨.',
  },
  {
    id: 1216, group: 3, groupTitle: '함수 기반 인덱스',
    question: '연봉 기반 검색을 위한 함수 기반 인덱스를 생성하고 활용 쿼리를 실행하시오.',
    sql: `CREATE INDEX emp_annual_sal_idx
ON employees (salary * 12);

-- 인덱스 활용 쿼리 (표현식 동일)
SELECT employee_id, last_name, salary * 12 AS annual_sal
FROM   employees
WHERE  salary * 12 > 100000;`,
    result: 'Index created. salary * 12 > 100000 조건에 해당하는 직원 출력.',
    keyPoint: '표현식 기반 인덱스는 동일한 표현식을 WHERE에 사용할 때 활용됨.',
  },
  {
    id: 1217, group: 3, groupTitle: '함수 기반 인덱스',
    question: 'EXPLAIN PLAN으로 인덱스 활용 여부를 확인하시오.',
    sql: `-- 1. 함수 기반 인덱스 활용 예
EXPLAIN PLAN FOR
SELECT * FROM employees WHERE UPPER(last_name) = 'KING';
SELECT * FROM TABLE(DBMS_XPLAN.DISPLAY);

-- 2. 함수 적용으로 인덱스 미활용 예
EXPLAIN PLAN FOR
SELECT * FROM employees WHERE last_name = 'King';
SELECT * FROM TABLE(DBMS_XPLAN.DISPLAY);`,
    result: '첫 번째: INDEX RANGE SCAN (EMP_UPPER_LAST_IDX). 두 번째: 다른 인덱스 또는 TABLE ACCESS FULL.',
    keyPoint: 'EXPLAIN PLAN + DBMS_XPLAN.DISPLAY로 실행 계획에서 인덱스 활용 여부 확인.',
  },
  {
    id: 1218, group: 3, groupTitle: '함수 기반 인덱스',
    question: '함수 기반 인덱스들을 삭제하시오.',
    sql: `DROP INDEX emp_upper_last_idx;
DROP INDEX emp_annual_sal_idx;

SELECT index_name FROM user_indexes
WHERE  index_name IN ('EMP_UPPER_LAST_IDX', 'EMP_ANNUAL_SAL_IDX');`,
    result: '2개 Index dropped. SELECT 결과: 0 rows.',
    keyPoint: 'DROP INDEX로 함수 기반 인덱스도 동일하게 삭제. 원본 테이블 데이터 영향 없음.',
  },

  // ── Group 4: INVISIBLE/VISIBLE & 인덱스 관리 ─────────────
  {
    id: 1219, group: 4, groupTitle: 'INVISIBLE/VISIBLE & 인덱스 관리',
    question: '인덱스를 INVISIBLE로 설정하고 USER_INDEXES에서 VISIBILITY를 확인하시오.',
    sql: `CREATE INDEX emp_dept_ix1
ON employees (department_id, salary);

ALTER INDEX emp_dept_ix1 INVISIBLE;

SELECT index_name, visibility, status
FROM   user_indexes
WHERE  index_name = 'EMP_DEPT_IX1';`,
    result: "Index created. Altered. EMP_DEPT_IX1, INVISIBLE, VALID",
    keyPoint: 'INVISIBLE 상태에서도 인덱스 구조는 유지되고 DML 시 갱신됨. 옵티마이저만 사용하지 않음.',
  },
  {
    id: 1220, group: 4, groupTitle: 'INVISIBLE/VISIBLE & 인덱스 관리',
    question: 'INVISIBLE 상태의 인덱스를 VISIBLE로 되돌리고 상태를 확인하시오.',
    sql: `ALTER INDEX emp_dept_ix1 VISIBLE;

SELECT index_name, visibility
FROM   user_indexes
WHERE  index_name = 'EMP_DEPT_IX1';`,
    result: "Altered. EMP_DEPT_IX1, VISIBLE",
    keyPoint: 'ALTER INDEX 인덱스명 VISIBLE로 옵티마이저가 다시 사용하도록 복원.',
  },
  {
    id: 1221, group: 4, groupTitle: 'INVISIBLE/VISIBLE & 인덱스 관리',
    question: '인덱스를 REBUILD하여 단편화를 해소하시오. REBUILD 전후 STATUS를 확인하시오.',
    sql: `-- REBUILD 전 상태 확인
SELECT index_name, status, visibility
FROM   user_indexes
WHERE  index_name = 'EMP_DEPT_IX1';

-- 인덱스 재구성
ALTER INDEX emp_dept_ix1 REBUILD;

-- REBUILD 후 상태 확인
SELECT index_name, status, visibility
FROM   user_indexes
WHERE  index_name = 'EMP_DEPT_IX1';`,
    result: 'Index altered. 두 쿼리 모두 STATUS=VALID.',
    keyPoint: 'ALTER INDEX REBUILD로 인덱스 재구성. 대량 DML 후 성능 회복에 사용.',
  },
  {
    id: 1222, group: 4, groupTitle: 'INVISIBLE/VISIBLE & 인덱스 관리',
    question: 'INVISIBLE 전략으로 새 인덱스를 테스트하시오. 기존 인덱스를 INVISIBLE로, 새 인덱스를 생성하여 비교하시오.',
    sql: `-- 1. 기존 인덱스를 INVISIBLE로 (성능 비교를 위해)
ALTER INDEX emp_dept_ix1 INVISIBLE;

-- 2. 다른 열 순서로 새 인덱스 생성
CREATE INDEX emp_sal_dept_ix2
ON employees (salary, department_id);

-- 3. 두 인덱스 정보 비교
SELECT i.index_name, i.visibility,
       c.column_name, c.column_position
FROM   user_indexes     i
JOIN   user_ind_columns c ON i.index_name = c.index_name
WHERE  i.index_name IN ('EMP_DEPT_IX1', 'EMP_SAL_DEPT_IX2')
ORDER BY i.index_name, c.column_position;

-- 4. emp_dept_ix1 다시 VISIBLE로 복원
ALTER INDEX emp_dept_ix1 VISIBLE;`,
    result: 'EMP_DEPT_IX1: INVISIBLE, dept_id(1)/salary(2). EMP_SAL_DEPT_IX2: VISIBLE, salary(1)/dept_id(2).',
    keyPoint: 'INVISIBLE로 기존 인덱스를 비활성화하고 새 인덱스 효과를 안전하게 테스트하는 전략.',
  },

  // ── Group 5: 종합 실습 ────────────────────────────────────
  {
    id: 1223, group: 5, groupTitle: '종합 실습',
    question: '미니 주문 시스템에 최적화된 인덱스를 설계하고 생성하시오.',
    sql: `CREATE TABLE my_orders (
    order_id      NUMBER PRIMARY KEY,
    customer_id   NUMBER NOT NULL,
    status        VARCHAR2(20) DEFAULT 'PENDING'
                               CHECK (status IN ('PENDING','SHIPPED','CANCELLED')),
    order_date    DATE DEFAULT SYSDATE,
    total_amount  NUMBER(10, 2)
);

-- 고객별 주문 조회 (자주 사용)
CREATE INDEX mo_customer_idx ON my_orders (customer_id);

-- 상태별 필터 + 날짜 범위 (자주 사용)
CREATE INDEX mo_status_date_idx ON my_orders (status, order_date);

-- 대소문자 무관 상태 검색 (간혹 사용)
CREATE INDEX mo_upper_status_idx ON my_orders (UPPER(status));

-- 인덱스 확인
SELECT index_name, uniqueness, index_type
FROM   user_indexes
WHERE  table_name = 'MY_ORDERS'
ORDER BY index_name;`,
    result: '4개 인덱스: MY_ORDERS PK 자동 + 수동 3개 (MO_CUSTOMER_IDX, MO_STATUS_DATE_IDX, MO_UPPER_STATUS_IDX).',
    keyPoint: '쿼리 패턴 분석 후 최적 인덱스 설계: 단일/복합/함수기반 혼합 사용.',
  },
  {
    id: 1224, group: 5, groupTitle: '종합 실습',
    question: '생성한 인덱스를 딕셔너리 뷰로 종합 조회하시오.',
    sql: `SELECT i.index_name,
       i.uniqueness,
       i.index_type,
       i.visibility,
       LISTAGG(c.column_name, ', ')
           WITHIN GROUP (ORDER BY c.column_position) AS columns
FROM   user_indexes     i
JOIN   user_ind_columns c ON i.index_name = c.index_name
WHERE  i.table_name = 'MY_ORDERS'
GROUP BY i.index_name, i.uniqueness, i.index_type, i.visibility
ORDER BY i.index_name;`,
    result: '4개 인덱스 정보 (이름, 고유여부, 타입, 가시성, 포함열) 출력.',
    keyPoint: 'USER_INDEXES + USER_IND_COLUMNS JOIN + LISTAGG로 인덱스 전체 현황 파악.',
  },
  {
    id: 1225, group: 5, groupTitle: '종합 실습',
    question: 'EXPLAIN PLAN으로 다양한 쿼리의 인덱스 활용을 확인하시오.',
    sql: `-- 1. 복합 인덱스 활용 (status + order_date)
EXPLAIN PLAN FOR
SELECT * FROM my_orders
WHERE  status = 'PENDING' AND order_date >= SYSDATE - 7;
SELECT * FROM TABLE(DBMS_XPLAN.DISPLAY);

-- 2. 함수 기반 인덱스 활용
EXPLAIN PLAN FOR
SELECT * FROM my_orders
WHERE  UPPER(status) = 'PENDING';
SELECT * FROM TABLE(DBMS_XPLAN.DISPLAY);

-- 3. 인덱스 미활용 (선두열 없음)
EXPLAIN PLAN FOR
SELECT * FROM my_orders
WHERE  order_date >= SYSDATE - 7;
SELECT * FROM TABLE(DBMS_XPLAN.DISPLAY);`,
    result: '1번: INDEX RANGE SCAN (MO_STATUS_DATE_IDX). 2번: INDEX RANGE SCAN (MO_UPPER_STATUS_IDX). 3번: 상황에 따라 풀스캔 또는 다른 인덱스.',
    keyPoint: 'EXPLAIN PLAN으로 실행 계획 확인. 인덱스 설계가 쿼리 패턴에 맞는지 검증.',
  },
  {
    id: 1226, group: 5, groupTitle: '종합 실습',
    question: '실습 정리 — 생성한 모든 인덱스와 테이블을 삭제하시오.',
    sql: `-- 수동 생성 인덱스 삭제
DROP INDEX emp_last_name_idx;
DROP INDEX emp_email_manual_idx;
DROP INDEX dept_loc_idx;
DROP INDEX emp_dept_ix1;
DROP INDEX emp_sal_dept_ix2;
DROP INDEX mo_customer_idx;
DROP INDEX mo_status_date_idx;
DROP INDEX mo_upper_status_idx;

-- 테이블 삭제 (PK 인덱스도 함께 삭제됨)
DROP TABLE my_orders PURGE;

-- 삭제 확인
SELECT index_name FROM user_indexes
WHERE  index_name IN (
    'EMP_LAST_NAME_IDX','EMP_EMAIL_MANUAL_IDX',
    'DEPT_LOC_IDX','EMP_DEPT_IX1',
    'EMP_SAL_DEPT_IX2','MO_CUSTOMER_IDX',
    'MO_STATUS_DATE_IDX','MO_UPPER_STATUS_IDX');`,
    result: 'Index dropped (여러 번). Table dropped. SELECT 결과: 0 rows.',
    keyPoint: 'DROP TABLE 시 해당 테이블의 모든 인덱스 자동 삭제. 인덱스 먼저 삭제 후 테이블 삭제도 가능.',
  },
]
