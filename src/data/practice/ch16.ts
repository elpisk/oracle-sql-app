import type { PracticeProblem } from '@/lib/types'

export const ch16Practice: PracticeProblem[] = [
  // ── Group 1: Flashback Query (AS OF) ──────────────────────
  {
    id: 1601, group: 1, groupTitle: 'Flashback Query (AS OF)',
    question: '30분 전 시점의 employees 테이블에서 employee_id=100인 행의 salary를 조회하시오.',
    sql: `SELECT employee_id, salary
FROM   employees
AS OF TIMESTAMP (SYSTIMESTAMP - INTERVAL '30' MINUTE)
WHERE  employee_id = 100;`,
    result: 'employee_id=100의 30분 전 salary 값이 반환됨.',
    keyPoint: 'AS OF TIMESTAMP (SYSTIMESTAMP - INTERVAL \'30\' MINUTE): 현재로부터 30분 전 시점의 UNDO 스냅숏을 조회합니다.',
  },
  {
    id: 1602, group: 1, groupTitle: 'Flashback Query (AS OF)',
    question: 'SCN 1000 시점의 orders 테이블에서 모든 행을 조회하시오.',
    sql: `SELECT *
FROM   orders
AS OF SCN 1000;`,
    result: 'SCN 1000 시점의 orders 전체 행 반환.',
    keyPoint: 'AS OF SCN scn_번호: 타임스탬프보다 더 정확한 시점 지정. TIMESTAMP_TO_SCN() / SCN_TO_TIMESTAMP()로 상호 변환 가능.',
  },
  {
    id: 1603, group: 1, groupTitle: 'Flashback Query (AS OF)',
    question: '1시간 전 시점의 employees 테이블에서 department_id=90인 행들을 조회하시오.',
    sql: `SELECT employee_id, last_name, salary, department_id
FROM   employees
AS OF TIMESTAMP (SYSTIMESTAMP - INTERVAL '1' HOUR)
WHERE  department_id = 90;`,
    result: 'department_id=90의 1시간 전 데이터 반환.',
    keyPoint: 'INTERVAL \'1\' HOUR: 1시간. 단위는 MINUTE, HOUR, DAY, MONTH, YEAR 사용 가능. AS OF TIMESTAMP는 FROM 절의 테이블명 바로 뒤에 위치.',
  },
  {
    id: 1604, group: 1, groupTitle: 'Flashback Query (AS OF)',
    question: '2일 전의 products 테이블에서 price > 1000인 행을 조회하시오.',
    sql: `SELECT product_id, product_name, price
FROM   products
AS OF TIMESTAMP (SYSDATE - 2)
WHERE  price > 1000;`,
    result: '2일 전 기준 price > 1000인 제품 반환.',
    keyPoint: 'SYSDATE - 2: DATE 타입으로 2일 전. AS OF TIMESTAMP에 DATE 타입도 자동 변환됩니다.',
  },
  {
    id: 1605, group: 1, groupTitle: 'Flashback Query (AS OF)',
    question: '10분 전 시점의 orders 테이블에서 부서별 주문 건수와 합계 금액을 조회하시오.',
    sql: `SELECT department_id,
       COUNT(*)        AS order_count,
       SUM(amount)     AS total_amount
FROM   orders
AS OF TIMESTAMP (SYSTIMESTAMP - INTERVAL '10' MINUTE)
GROUP BY department_id
ORDER BY department_id;`,
    result: '10분 전 기준 부서별 주문 건수와 합계 반환.',
    keyPoint: 'AS OF TIMESTAMP 뒤에 WHERE, GROUP BY, ORDER BY 등 일반 SQL 절 모두 사용 가능.',
  },
  {
    id: 1606, group: 1, groupTitle: 'Flashback Query (AS OF)',
    question: '현재 employees와 1시간 전 버전을 비교하여 salary가 변경된 직원을 조회하시오.',
    sql: `SELECT cur.employee_id,
       old.salary AS salary_before,
       cur.salary AS salary_now
FROM   employees cur
JOIN   employees AS OF TIMESTAMP (SYSTIMESTAMP - INTERVAL '1' HOUR) old
       ON cur.employee_id = old.employee_id
WHERE  cur.salary <> old.salary;`,
    result: '지난 1시간 내 salary가 변경된 직원 목록 반환.',
    keyPoint: '현재 테이블과 AS OF 버전을 JOIN하여 변경 감지. AS OF는 FROM 절에서 테이블 별칭 전에 위치합니다.',
  },

  // ── Group 2: Flashback Version Query (VERSIONS BETWEEN) ───
  {
    id: 1607, group: 2, groupTitle: 'Flashback Version Query',
    question: 'employees 테이블에서 employee_id=100의 지난 2시간 내 salary 변경 이력을 조회하시오.',
    sql: `SELECT versions_starttime,
       versions_endtime,
       versions_operation,
       salary
FROM   employees
VERSIONS BETWEEN TIMESTAMP
       (SYSTIMESTAMP - INTERVAL '2' HOUR) AND SYSTIMESTAMP
WHERE  employee_id = 100;`,
    result: '지난 2시간 내 employee_id=100의 salary 버전 이력 반환.',
    keyPoint: 'VERSIONS BETWEEN TIMESTAMP 시작 AND 끝: 기간 내 행의 모든 변경 버전 반환. VERSIONS_OPERATION: I/U/D.',
  },
  {
    id: 1608, group: 2, groupTitle: 'Flashback Version Query',
    question: 'orders 테이블에서 SCN 1000부터 현재까지 order_id=500인 행의 변경 이력을 조회하시오.',
    sql: `SELECT versions_startscn,
       versions_endscn,
       versions_operation,
       order_id,
       status
FROM   orders
VERSIONS BETWEEN SCN 1000 AND MAXVALUE
WHERE  order_id = 500;`,
    result: 'SCN 1000 이후 order_id=500의 버전 이력 반환.',
    keyPoint: 'VERSIONS BETWEEN SCN: SCN 기반 범위. MAXVALUE는 현재까지, MINVALUE는 가용한 가장 오래된 SCN.',
  },
  {
    id: 1609, group: 2, groupTitle: 'Flashback Version Query',
    question: `employees 테이블에서 last_name='King'인 행의 UNDO 가용 전체 변경 이력을 조회하시오.`,
    sql: `SELECT versions_starttime,
       versions_endtime,
       versions_operation,
       versions_xid,
       salary
FROM   employees
VERSIONS BETWEEN SCN MINVALUE AND MAXVALUE
WHERE  last_name = 'King';`,
    result: 'UNDO에 남아 있는 King의 전체 버전 이력 반환.',
    keyPoint: 'SCN MINVALUE AND MAXVALUE: 현재 UNDO에서 가용한 최전 ~ 최신 전체 범위. VERSIONS_XID는 트랜잭션 ID.',
  },
  {
    id: 1610, group: 2, groupTitle: 'Flashback Version Query',
    question: 'products 테이블에서 오늘 DELETE된 행들의 이력을 조회하시오. 삭제 시각과 product_id를 포함하시오.',
    sql: `SELECT versions_starttime   AS deleted_time,
       versions_xid,
       product_id,
       product_name
FROM   products
VERSIONS BETWEEN TIMESTAMP TRUNC(SYSDATE) AND SYSTIMESTAMP
WHERE  versions_operation = 'D';`,
    result: '오늘 삭제된 제품 이력 반환.',
    keyPoint: 'VERSIONS_OPERATION = \'D\': DELETE 버전만 필터링. VERSIONS_STARTTIME은 DELETE 커밋 시각.',
  },
  {
    id: 1611, group: 2, groupTitle: 'Flashback Version Query',
    question: 'employees 테이블에서 employee_id=100의 최근 변경 트랜잭션의 UNDO SQL을 FLASHBACK_TRANSACTION_QUERY로 조회하시오.',
    sql: `-- 1단계: 트랜잭션 ID 조회
SELECT versions_xid, versions_operation, salary
FROM   employees
VERSIONS BETWEEN SCN MINVALUE AND MAXVALUE
WHERE  employee_id = 100
ORDER BY versions_startscn DESC;

-- 2단계: UNDO SQL 조회
SELECT operation, table_name, undo_sql
FROM   flashback_transaction_query
WHERE  xid = HEXTORAW('여기에_XID_값_입력');`,
    result: '해당 트랜잭션의 DML과 역전 SQL(UNDO_SQL) 반환.',
    keyPoint: 'FLASHBACK_TRANSACTION_QUERY 연계 2단계: ①VERSIONS_XID 확인 ②undo_sql 조회 후 실행으로 변경 역전 가능.',
  },
  {
    id: 1612, group: 2, groupTitle: 'Flashback Version Query',
    question: 'employees 테이블에서 지난 1시간 내 employee_id=200의 버전 이력을 조회하고, 현재 유효 버전인지 표시하시오.',
    sql: `SELECT versions_starttime,
       versions_endtime,
       versions_operation,
       salary,
       CASE WHEN versions_endtime IS NULL
            THEN '현재 유효'
            ELSE '과거 버전'
       END AS version_status
FROM   employees
VERSIONS BETWEEN TIMESTAMP
       (SYSTIMESTAMP - INTERVAL '1' HOUR) AND SYSTIMESTAMP
WHERE  employee_id = 200;`,
    result: '버전별 상태(현재 유효/과거 버전) 포함 이력 반환.',
    keyPoint: 'VERSIONS_ENDTIME IS NULL → 현재 유효 최신 버전. VERSIONS_STARTTIME IS NULL → 범위 시작 전부터 존재.',
  },

  // ── Group 3: FLASHBACK TABLE ──────────────────────────────
  {
    id: 1613, group: 3, groupTitle: 'FLASHBACK TABLE (시점/SCN 복구)',
    question: 'employees 테이블에 FLASHBACK TABLE(TIMESTAMP 기반)을 사용하기 위한 ROW MOVEMENT를 활성화하시오.',
    sql: `ALTER TABLE employees ENABLE ROW MOVEMENT;`,
    result: 'Table altered.',
    keyPoint: 'FLASHBACK TABLE TO TIMESTAMP 복구 시 Oracle이 행 ROWID를 변경하므로 ENABLE ROW MOVEMENT가 필수.',
  },
  {
    id: 1614, group: 3, groupTitle: 'FLASHBACK TABLE (시점/SCN 복구)',
    question: 'employees 테이블을 30분 전 시점으로 복구하시오.',
    sql: `ALTER TABLE employees ENABLE ROW MOVEMENT;

FLASHBACK TABLE employees
TO TIMESTAMP (SYSTIMESTAMP - INTERVAL '30' MINUTE);`,
    result: 'Flashback complete.',
    keyPoint: 'FLASHBACK TABLE 테이블명 TO TIMESTAMP 표현식: 테이블 전체를 지정 시점으로 복구. 인덱스, 제약도 함께 복구.',
  },
  {
    id: 1615, group: 3, groupTitle: 'FLASHBACK TABLE (시점/SCN 복구)',
    question: 'orders 테이블을 SCN 5000 시점으로 복구하시오.',
    sql: `ALTER TABLE orders ENABLE ROW MOVEMENT;

FLASHBACK TABLE orders TO SCN 5000;`,
    result: 'Flashback complete.',
    keyPoint: 'TO SCN scn_번호: 타임스탬프보다 정확. SCN_TO_TIMESTAMP(5000)으로 해당 SCN 시각 확인 가능.',
  },
  {
    id: 1616, group: 3, groupTitle: 'FLASHBACK TABLE (시점/SCN 복구)',
    question: 'employees 테이블을 1시간 전으로 복구할 때 트리거를 활성화한 채로 실행하시오.',
    sql: `ALTER TABLE employees ENABLE ROW MOVEMENT;

FLASHBACK TABLE employees
TO TIMESTAMP (SYSTIMESTAMP - INTERVAL '1' HOUR)
ENABLE TRIGGERS;`,
    result: 'Flashback complete. (트리거 발화됨)',
    keyPoint: 'FLASHBACK TABLE은 기본 트리거 비활성화. ENABLE TRIGGERS 명시 시 복구 중 트리거가 발화됨.',
  },
  {
    id: 1617, group: 3, groupTitle: 'FLASHBACK TABLE (시점/SCN 복구)',
    question: 'AS OF TIMESTAMP로 어제 삭제된 employee_id=999 행만 선택적으로 복원하시오.',
    sql: `INSERT INTO employees
SELECT *
FROM   employees
AS OF TIMESTAMP (SYSDATE - 1)
WHERE  employee_id = 999;

COMMIT;`,
    result: '1 row created.',
    keyPoint: 'AS OF로 과거 스냅숏 조회 후 INSERT INTO로 선택적 복원. FLASHBACK TABLE은 전체 복구, 특정 행만 복원할 때는 이 패턴 사용.',
  },
  {
    id: 1618, group: 3, groupTitle: 'FLASHBACK TABLE (시점/SCN 복구)',
    question: '1시간 전에 실수로 salary를 일괄 UPDATE한 경우 AS OF TIMESTAMP와 MERGE로 salary만 원복하시오.',
    sql: `MERGE INTO employees cur
USING (
  SELECT employee_id, salary
  FROM   employees
  AS OF TIMESTAMP (SYSTIMESTAMP - INTERVAL '1' HOUR)
) old
ON (cur.employee_id = old.employee_id)
WHEN MATCHED THEN
  UPDATE SET cur.salary = old.salary;

COMMIT;`,
    result: 'N rows merged.',
    keyPoint: 'AS OF 결과를 MERGE USING 소스로 사용하여 salary만 선택적 원복. FLASHBACK TABLE과 달리 다른 열은 영향받지 않음.',
  },

  // ── Group 4: Flashback Drop & RECYCLEBIN ─────────────────
  {
    id: 1619, group: 4, groupTitle: 'Flashback Drop & RECYCLEBIN 관리',
    question: '현재 사용자의 RECYCLEBIN에서 TABLE 유형 목록을 삭제 시각 내림차순으로 조회하시오.',
    sql: `SELECT original_name,
       object_name,
       type,
       droptime
FROM   user_recyclebin
WHERE  type = 'TABLE'
ORDER BY droptime DESC;`,
    result: 'RECYCLEBIN 내 TABLE 목록 반환.',
    keyPoint: 'USER_RECYCLEBIN(=RECYCLEBIN): 현재 사용자의 RECYCLEBIN. ORIGINAL_NAME: 삭제 전 이름. OBJECT_NAME: BIN$... 형태의 내부 이름.',
  },
  {
    id: 1620, group: 4, groupTitle: 'Flashback Drop & RECYCLEBIN 관리',
    question: 'RECYCLEBIN에 있는 emp 테이블을 원래 이름으로 복구하시오.',
    sql: `FLASHBACK TABLE emp TO BEFORE DROP;`,
    result: 'Flashback complete.',
    keyPoint: 'FLASHBACK TABLE 테이블명 TO BEFORE DROP: DROP TABLE 시 RECYCLEBIN으로 이동한 테이블 복구. ROW MOVEMENT 불필요.',
  },
  {
    id: 1621, group: 4, groupTitle: 'Flashback Drop & RECYCLEBIN 관리',
    question: 'RECYCLEBIN에 있는 emp 테이블을 emp_recovered라는 이름으로 복구하시오.',
    sql: `FLASHBACK TABLE emp TO BEFORE DROP RENAME TO emp_recovered;`,
    result: 'Flashback complete.',
    keyPoint: 'RENAME TO 새이름: 동일 이름 테이블이 이미 존재하거나 다른 이름으로 복구할 때 사용.',
  },
  {
    id: 1622, group: 4, groupTitle: 'Flashback Drop & RECYCLEBIN 관리',
    question: 'RECYCLEBIN에 있는 old_emp 테이블을 완전히 영구 삭제하시오.',
    sql: `PURGE TABLE old_emp;`,
    result: 'Table purged.',
    keyPoint: 'PURGE TABLE 테이블명: RECYCLEBIN의 특정 테이블 영구 삭제. PURGE 후 TO BEFORE DROP 복구 불가.',
  },
  {
    id: 1623, group: 4, groupTitle: 'Flashback Drop & RECYCLEBIN 관리',
    question: '현재 사용자의 RECYCLEBIN을 모두 비우시오.',
    sql: `PURGE RECYCLEBIN;`,
    result: 'Recyclebin purged.',
    keyPoint: 'PURGE RECYCLEBIN: 현재 사용자 RECYCLEBIN 전체 비우기. PURGE DBA_RECYCLEBIN: DBA가 전체 비우기. DROP TABLE t PURGE: 처음부터 RECYCLEBIN 건너뜀.',
  },
  {
    id: 1624, group: 4, groupTitle: 'Flashback Drop & RECYCLEBIN 관리',
    question: 'RECYCLEBIN에 emp가 여러 개 있을 때 가장 오래된 버전을 OBJECT_NAME으로 복구하시오.',
    sql: `-- RECYCLEBIN 내부 이름 확인 (오래된 것 먼저)
SELECT original_name, object_name, droptime
FROM   recyclebin
WHERE  original_name = 'EMP'
ORDER BY droptime ASC;

-- 원하는 버전의 OBJECT_NAME으로 복구
FLASHBACK TABLE "BIN$xxxxxxxxxxxxx" TO BEFORE DROP
RENAME TO emp_oldest;`,
    result: 'Flashback complete.',
    keyPoint: 'OBJECT_NAME(BIN$...)으로 특정 버전 지정 복구. 큰따옴표("") 필수. 이름 없이 FLASHBACK TABLE emp TO BEFORE DROP은 가장 최근 DROP된 것을 복구.',
  },

  // ── Group 5: 종합 활용 ────────────────────────────────────
  {
    id: 1625, group: 5, groupTitle: '종합 활용',
    question: `다음 상황별로 적합한 Flashback 기술을 적용하시오.
① 30분 전 salary 값 확인만 필요 (테이블 변경 불가)
② 실수로 DELETE된 행 복원
③ 실수로 DROP된 테이블 복원`,
    sql: `-- ① 과거 데이터 조회만 (읽기 전용)
SELECT employee_id, salary
FROM   employees
AS OF TIMESTAMP (SYSTIMESTAMP - INTERVAL '30' MINUTE)
WHERE  department_id = 50;

-- ② 삭제된 행 복원
INSERT INTO employees
SELECT *
FROM   employees
AS OF TIMESTAMP (SYSTIMESTAMP - INTERVAL '10' MINUTE)
WHERE  employee_id = 999;
COMMIT;

-- ③ DROP된 테이블 복원
FLASHBACK TABLE dept_backup TO BEFORE DROP;`,
    result: '각 상황에 맞는 Flashback 기능 적용 완료.',
    keyPoint: '①AS OF: 읽기 전용, ②AS OF + INSERT: 행 선택 복원, ③TO BEFORE DROP: DROP 복구. 상황에 맞는 도구 선택이 핵심.',
  },
  {
    id: 1626, group: 5, groupTitle: '종합 활용',
    question: `다음 시나리오를 순서대로 구현하시오.
1. 현재 SCN 저장
2. employees에서 employee_id=100의 salary를 50000으로 UPDATE 후 COMMIT
3. AS OF SCN으로 변경 전 salary 확인
4. VERSIONS BETWEEN으로 변경 이력 확인
5. FLASHBACK TABLE로 원복`,
    sql: `-- 1. 현재 SCN 저장 (예: 12345 반환됨)
SELECT current_scn FROM v$database;

-- 2. salary 변경
UPDATE employees SET salary = 50000 WHERE employee_id = 100;
COMMIT;

-- 3. AS OF SCN으로 변경 전 확인
SELECT salary
FROM   employees
AS OF SCN 12345
WHERE  employee_id = 100;

-- 4. VERSIONS BETWEEN으로 이력 확인
SELECT versions_startscn, versions_operation, salary
FROM   employees
VERSIONS BETWEEN SCN 12345 AND MAXVALUE
WHERE  employee_id = 100;

-- 5. FLASHBACK TABLE로 원복
ALTER TABLE employees ENABLE ROW MOVEMENT;
FLASHBACK TABLE employees TO SCN 12345;`,
    result: '단계별 Flashback 기능 완료.',
    keyPoint: '실무 패턴: ①작업 전 SCN 기록 ②AS OF로 이전 값 확인 ③VERSIONS BETWEEN으로 이력 추적 ④FLASHBACK TABLE로 원복. SCN이 타임스탬프보다 정밀.',
  },
]
