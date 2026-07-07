import type { QuizQuestion } from '@/lib/types'

export const ch16Quiz: QuizQuestion[] = [
  // ── 하(기초) 1~20 ──────────────────────────────────────────
  {
    id: 1601, level: 'basic',
    question: 'Oracle Flashback 기술의 주된 목적은?',
    options: [
      '테이블 구조(DDL)를 이전 버전으로 변경한다',
      'UNDO 데이터를 활용하여 실수로 변경된 데이터를 과거 시점으로 조회하거나 복구한다',
      '데이터베이스 파일을 백업한다',
      '인덱스를 재구성한다',
    ],
    correctAnswer: 1,
    explanation: 'Oracle Flashback 기술은 UNDO 데이터(또는 Flashback Log)를 활용하여 데이터 변경 실수를 복구하거나 과거 시점의 데이터를 조회합니다. 전통적인 백업/복구보다 훨씬 빠르고 간단합니다.',
  },
  {
    id: 1602, level: 'basic',
    question: 'Oracle Flashback 기능의 기반이 되는 저장 영역은?',
    options: [
      'REDO LOG',
      'TEMP 테이블스페이스',
      'UNDO 테이블스페이스',
      'SYSAUX 테이블스페이스',
    ],
    correctAnswer: 2,
    explanation: '대부분의 Flashback 기능(Flashback Query, Flashback Version Query, FLASHBACK TABLE)은 UNDO 테이블스페이스에 저장된 UNDO 데이터를 사용합니다. Flashback Database는 별도의 Flashback Log를 사용합니다.',
  },
  {
    id: 1603, level: 'basic',
    question: 'Flashback Query(AS OF)의 역할은?',
    options: [
      '테이블을 과거 시점으로 복구한다',
      '과거 특정 시점의 데이터를 SELECT로 조회한다 (테이블 원본은 변경되지 않음)',
      '과거 트랜잭션을 취소한다',
      'RECYCLEBIN에서 삭제된 테이블을 복원한다',
    ],
    correctAnswer: 1,
    explanation: 'Flashback Query(AS OF TIMESTAMP 또는 AS OF SCN)는 테이블 원본을 건드리지 않고 과거 특정 시점의 데이터를 SELECT로 조회합니다. DML 실수 확인이나 과거 데이터 비교에 활용합니다.',
  },
  {
    id: 1604, level: 'basic',
    question: 'Flashback Query의 기본 구문은?',
    options: [
      'SELECT ... FROM t PRIOR TO TIMESTAMP expr',
      'SELECT ... FROM t AS OF TIMESTAMP expr',
      'SELECT ... FROM t WHERE TIMESTAMP = expr',
      'SELECT HISTORY ... FROM t',
    ],
    correctAnswer: 1,
    explanation: 'Flashback Query 구문: SELECT 열 FROM 테이블 AS OF TIMESTAMP 표현식 [WHERE 조건]. AS OF SCN scn_번호로 SCN 기준 조회도 가능합니다.',
  },
  {
    id: 1605, level: 'basic',
    question: '1시간 전 데이터를 조회하는 Flashback Query의 올바른 표현은?',
    options: [
      'AS OF TIMESTAMP SYSDATE - 60',
      'AS OF TIMESTAMP (SYSTIMESTAMP - INTERVAL \'1\' HOUR)',
      'AS OF TIMESTAMP SYSTIMESTAMP - 3600',
      'AS OF TIMESTAMP NOW() - 1',
    ],
    correctAnswer: 1,
    explanation: 'SYSTIMESTAMP - INTERVAL \'1\' HOUR는 현재 타임스탬프에서 1시간을 뺀 TIMESTAMP 값을 반환합니다. SYSDATE는 DATE 타입이므로 INTERVAL 단위를 분(MINUTE), 시간(HOUR), 일(DAY) 등으로 지정합니다.',
  },
  {
    id: 1606, level: 'basic',
    question: 'SCN(System Change Number)이란?',
    options: [
      '테이블의 행 수를 나타내는 카운터',
      'Oracle 데이터베이스의 모든 변경(커밋)에 순서대로 부여되는 고유 번호',
      '세션 연결 번호',
      '테이블 스페이스 식별 번호',
    ],
    correctAnswer: 1,
    explanation: 'SCN(System Change Number)은 Oracle이 데이터베이스 변경(커밋)마다 순서대로 부여하는 단조 증가 숫자입니다. Flashback 기능에서 특정 시점을 정확히 지정할 때 TIMESTAMP 대신 SCN을 사용하면 더 정확합니다.',
  },
  {
    id: 1607, level: 'basic',
    question: 'Flashback Version Query에서 사용하는 절은?',
    options: [
      'AS OF TIMESTAMP',
      'VERSIONS BETWEEN',
      'HISTORY BETWEEN',
      'ARCHIVE BETWEEN',
    ],
    correctAnswer: 1,
    explanation: 'Flashback Version Query: SELECT ... FROM 테이블 VERSIONS BETWEEN {SCN | TIMESTAMP} 시작 AND 끝 [WHERE 조건]. 특정 행의 모든 변경 이력(버전)을 조회합니다.',
  },
  {
    id: 1608, level: 'basic',
    question: 'VERSIONS BETWEEN SCN MINVALUE AND MAXVALUE의 의미는?',
    options: [
      'SCN 최솟값(0)부터 최댓값(MAX_NUMBER)까지',
      'UNDO에서 현재 가용한 가장 오래된 SCN부터 가장 최신 SCN까지 전체 범위',
      '현재 세션의 SCN 범위',
      '테이블이 생성된 SCN부터 현재까지',
    ],
    correctAnswer: 1,
    explanation: 'MINVALUE: UNDO에서 현재 접근 가능한 가장 오래된 SCN. MAXVALUE: 현재 최신 SCN. MINVALUE AND MAXVALUE를 사용하면 현재 UNDO에서 조회 가능한 전체 이력을 반환합니다.',
  },
  {
    id: 1609, level: 'basic',
    question: 'Flashback Version Query에서 각 버전의 시작/종료 시간을 나타내는 의사 컬럼은?',
    options: [
      'versions_start_scn, versions_end_scn',
      'versions_starttime, versions_endtime',
      'start_time, end_time',
      'from_timestamp, to_timestamp',
    ],
    correctAnswer: 1,
    explanation: 'Flashback Version Query의 의사 컬럼: VERSIONS_STARTTIME(버전 시작 시각), VERSIONS_ENDTIME(버전 종료 시각), VERSIONS_STARTSCN, VERSIONS_ENDSCN, VERSIONS_OPERATION(I/U/D), VERSIONS_XID(트랜잭션 ID).',
  },
  {
    id: 1610, level: 'basic',
    question: 'FLASHBACK TABLE 명령의 주된 용도는?',
    options: [
      '테이블 구조(열 정의)를 과거로 되돌린다',
      '테이블 데이터를 특정 과거 시점 또는 SCN으로 복구한다',
      '테이블 이름을 변경한다',
      '테이블 통계를 수집한다',
    ],
    correctAnswer: 1,
    explanation: 'FLASHBACK TABLE table_name TO {TIMESTAMP expr | SCN expr | BEFORE DROP}: 테이블 데이터를 지정한 과거 시점 또는 SCN으로 인플레이스 복구합니다. 관련 인덱스, 제약 조건도 함께 복원됩니다.',
  },
  {
    id: 1611, level: 'basic',
    question: 'FLASHBACK TABLE을 TIMESTAMP 기반으로 복구하기 전에 반드시 설정해야 하는 것은?',
    options: [
      'ALTER TABLE t ENABLE FLASHBACK',
      'ALTER TABLE t ENABLE ROW MOVEMENT',
      'ALTER TABLE t ENABLE UNDO RETENTION',
      'CREATE FLASHBACK ON TABLE t',
    ],
    correctAnswer: 1,
    explanation: 'FLASHBACK TABLE TO TIMESTAMP 복구 시 Oracle이 행의 ROWID를 변경할 수 있어야 합니다. 이를 위해 ALTER TABLE 테이블명 ENABLE ROW MOVEMENT를 먼저 실행해야 합니다.',
  },
  {
    id: 1612, level: 'basic',
    question: 'DROP TABLE 후 RECYCLEBIN에 있는 테이블을 복구하는 올바른 구문은?',
    options: [
      'FLASHBACK TABLE emp TO UNDO',
      'FLASHBACK TABLE emp TO BEFORE DROP',
      'RESTORE TABLE emp FROM RECYCLEBIN',
      'RECOVER TABLE emp BEFORE DROP',
    ],
    correctAnswer: 1,
    explanation: 'FLASHBACK TABLE 테이블명 TO BEFORE DROP: DROP TABLE 시 RECYCLEBIN에 이동한 테이블을 원래 이름으로 복구합니다. RENAME TO 새이름을 추가하면 다른 이름으로 복구할 수 있습니다.',
  },
  {
    id: 1613, level: 'basic',
    question: 'DROP TABLE 시 테이블이 이동하는 기본 위치는?',
    options: [
      '즉시 영구 삭제된다',
      'RECYCLEBIN (Oracle의 휴지통)',
      'UNDO 테이블스페이스',
      'TEMP 테이블스페이스',
    ],
    correctAnswer: 1,
    explanation: 'PURGE 옵션 없이 DROP TABLE을 실행하면 테이블은 즉시 삭제되지 않고 RECYCLEBIN으로 이동합니다. RECYCLEBIN에 있는 동안은 FLASHBACK TABLE TO BEFORE DROP으로 복구 가능합니다.',
  },
  {
    id: 1614, level: 'basic',
    question: 'RECYCLEBIN 내용을 조회하는 뷰는?',
    options: [
      'DBA_DROPPED_OBJECTS',
      'USER_DELETED_TABLES',
      'USER_RECYCLEBIN (또는 RECYCLEBIN)',
      'DROPPED_TABLES',
    ],
    correctAnswer: 2,
    explanation: 'RECYCLEBIN 또는 USER_RECYCLEBIN 뷰로 자신의 RECYCLEBIN 내용을 조회합니다. 주요 열: ORIGINAL_NAME(원래 이름), OBJECT_NAME(RECYCLEBIN 이름), OPERATION(DROP), DROPTIME.',
  },
  {
    id: 1615, level: 'basic',
    question: 'RECYCLEBIN을 완전히 비우는 명령은?',
    options: [
      'EMPTY RECYCLEBIN',
      'PURGE RECYCLEBIN',
      'DROP RECYCLEBIN',
      'CLEAR RECYCLEBIN',
    ],
    correctAnswer: 1,
    explanation: 'PURGE RECYCLEBIN: 현재 세션의 RECYCLEBIN 전체 비우기. PURGE TABLE 테이블명: 특정 테이블만 영구 삭제. DROP TABLE 테이블명 PURGE: RECYCLEBIN 건너뛰고 즉시 영구 삭제.',
  },
  {
    id: 1616, level: 'basic',
    question: 'Flashback 기능이 UNDO 보존 기간을 초과한 데이터에 접근하려 하면?',
    options: [
      '자동으로 가장 오래된 가용 버전을 반환한다',
      'ORA-01555 스냅숏이 너무 오래됨(Snapshot Too Old) 오류가 발생한다',
      'NULL을 반환한다',
      '현재 데이터를 반환한다',
    ],
    correctAnswer: 1,
    explanation: 'UNDO 데이터가 만료되어 더 이상 접근할 수 없으면 ORA-01555 "Snapshot Too Old" 오류가 발생합니다. UNDO_RETENTION 파라미터로 UNDO 보존 시간을 조정할 수 있습니다.',
  },
  {
    id: 1617, level: 'basic',
    question: 'DBMS_FLASHBACK.GET_SYSTEM_CHANGE_NUMBER()의 역할은?',
    options: [
      '현재 SCN을 반환한다',
      '테이블의 변경 횟수를 반환한다',
      'UNDO 데이터 크기를 반환한다',
      'RECYCLEBIN 크기를 반환한다',
    ],
    correctAnswer: 0,
    explanation: 'DBMS_FLASHBACK.GET_SYSTEM_CHANGE_NUMBER() 또는 SELECT CURRENT_SCN FROM V$DATABASE로 현재 SCN을 조회합니다. 특정 시점을 SCN으로 기록해 두면 나중에 정확한 Flashback 기준점으로 활용합니다.',
  },
  {
    id: 1618, level: 'basic',
    question: 'Flashback Version Query에서 VERSIONS_OPERATION 의사 컬럼의 값과 의미는?',
    options: [
      'C=CREATE, D=DELETE, M=MODIFY',
      'I=INSERT, U=UPDATE, D=DELETE',
      'A=ADD, R=REMOVE, C=CHANGE',
      'S=START, E=END, N=NEUTRAL',
    ],
    correctAnswer: 1,
    explanation: 'VERSIONS_OPERATION: I(INSERT), U(UPDATE), D(DELETE). 해당 버전이 어떤 DML 작업으로 생성되었는지 나타냅니다. NULL이면 쿼리 시작 시점에 이미 존재하던 버전입니다.',
  },
  {
    id: 1619, level: 'basic',
    question: 'PURGE TABLE 테이블명의 효과는?',
    options: [
      '테이블 데이터만 삭제하고 구조는 유지한다',
      'RECYCLEBIN의 특정 테이블을 완전히 영구 삭제한다',
      '테이블을 RECYCLEBIN으로 이동한다',
      'UNDO 데이터를 삭제한다',
    ],
    correctAnswer: 1,
    explanation: 'PURGE TABLE 테이블명: RECYCLEBIN에 있는 특정 테이블을 즉시 영구 삭제합니다. PURGE 후에는 FLASHBACK TABLE TO BEFORE DROP으로 복구 불가능합니다.',
  },
  {
    id: 1620, level: 'basic',
    question: 'Flashback Query(AS OF)로 조회한 과거 데이터를 현재 테이블에 복원하는 패턴은?',
    options: [
      'RESTORE INTO t SELECT * FROM t AS OF TIMESTAMP ...',
      'INSERT INTO t (SELECT * FROM t AS OF TIMESTAMP ... WHERE ...)',
      'UPDATE t SET (SELECT * FROM t AS OF TIMESTAMP ...)',
      'FLASHBACK INSERT INTO t AS OF TIMESTAMP ...',
    ],
    correctAnswer: 1,
    explanation: 'AS OF 조회 결과를 현재 테이블에 INSERT하여 복원합니다. 예: INSERT INTO employees SELECT * FROM employees AS OF TIMESTAMP (SYSTIMESTAMP - INTERVAL \'30\' MINUTE) WHERE employee_id = 100. 먼저 현재 행을 DELETE한 후 INSERT하는 패턴을 사용합니다.',
  },

  // ── 중(응용) 21~40 ─────────────────────────────────────────
  {
    id: 1621, level: 'intermediate',
    question: `다음 Flashback Query의 결과는?
SELECT salary FROM employees
AS OF TIMESTAMP (SYSTIMESTAMP - INTERVAL '30' MINUTE)
WHERE employee_id = 100;`,
    options: [
      '현재 시각 기준 30분 후의 salary',
      '현재 시각 기준 30분 전의 salary',
      '30번째 행의 salary',
      'employee_id = 30인 salary',
    ],
    correctAnswer: 1,
    explanation: 'AS OF TIMESTAMP (SYSTIMESTAMP - INTERVAL \'30\' MINUTE): 현재로부터 30분 전 시점의 UNDO 데이터를 조회합니다. 30분 전에 employee_id=100의 salary가 어떤 값이었는지 확인할 수 있습니다.',
  },
  {
    id: 1622, level: 'intermediate',
    question: `Flashback Version Query에서 versions_endtime이 NULL인 행은 무엇을 의미하는가?`,
    options: [
      '해당 버전이 삭제되었음을 의미한다',
      '해당 버전이 현재 시점까지 유효한 최신 버전임을 의미한다',
      '버전 정보를 알 수 없음을 의미한다',
      'UNDO 데이터가 만료되었음을 의미한다',
    ],
    correctAnswer: 1,
    explanation: 'VERSIONS_ENDTIME이 NULL이면 해당 버전이 아직 종료되지 않았음, 즉 현재 시점에도 유효한 최신 버전임을 나타냅니다. VERSIONS_STARTTIME이 NULL이면 쿼리 시작 이전부터 존재하던 버전입니다.',
  },
  {
    id: 1623, level: 'intermediate',
    question: `다음 Flashback Version Query로 조회할 수 있는 정보는?
SELECT versions_starttime, versions_endtime, versions_operation, salary
FROM employees
VERSIONS BETWEEN TIMESTAMP SYSTIMESTAMP - INTERVAL '2' HOUR AND SYSTIMESTAMP
WHERE employee_id = 100;`,
    options: [
      '현재 salary만 조회된다',
      '지난 2시간 내 employee_id=100의 salary 변경 이력 전체',
      '2시간 전의 단일 salary 값',
      'UNDO가 없으면 오류',
    ],
    correctAnswer: 1,
    explanation: '지난 2시간 동안 employee_id=100의 salary가 언제, 어떻게(I/U/D) 변경되었는지 모든 버전을 반환합니다. 각 버전의 시작/종료 시간과 작업 유형(VERSIONS_OPERATION)도 확인할 수 있습니다.',
  },
  {
    id: 1624, level: 'intermediate',
    question: `FLASHBACK TABLE이 성공하려면 어떤 조건이 충족되어야 하는가? (TIMESTAMP 기반)`,
    options: [
      'DBA 권한 필요, ROW MOVEMENT 불필요',
      'ALTER TABLE ENABLE ROW MOVEMENT 설정 + UNDO 데이터가 대상 시점까지 유지되어야 함',
      'RECYCLEBIN에 테이블이 있어야 함',
      'UNDO 불필요, Flashback Log 필요',
    ],
    correctAnswer: 1,
    explanation: 'FLASHBACK TABLE TO TIMESTAMP 조건: ①ALTER TABLE ENABLE ROW MOVEMENT 설정 ②UNDO 데이터가 복구 대상 시점까지 유지 ③FLASHBACK ANY TABLE 또는 테이블 소유자 권한. UNDO가 만료되면 ORA-01555 오류.',
  },
  {
    id: 1625, level: 'intermediate',
    question: `DROP TABLE emp PURGE와 DROP TABLE emp의 차이는?`,
    options: [
      '두 명령은 동일하다',
      'PURGE 없이 DROP하면 RECYCLEBIN으로 이동(복구 가능). PURGE 포함이면 즉시 영구 삭제(복구 불가)',
      'PURGE 포함이면 RECYCLEBIN에 더 오래 보존된다',
      'DROP TABLE emp은 RECYCLEBIN을 사용하지 않는다',
    ],
    correctAnswer: 1,
    explanation: 'DROP TABLE t: RECYCLEBIN으로 이동 → FLASHBACK TABLE t TO BEFORE DROP으로 복구 가능. DROP TABLE t PURGE: 즉시 영구 삭제 → 복구 불가능. TRUNCATE TABLE도 RECYCLEBIN에 보존되지 않습니다.',
  },
  {
    id: 1626, level: 'intermediate',
    question: `PURGE RECYCLEBIN 후 FLASHBACK TABLE emp TO BEFORE DROP을 실행하면?`,
    options: [
      '성공적으로 복구된다',
      'ORA-38305: RECYCLEBIN에 emp가 없어서 오류 발생',
      'emp가 빈 테이블로 복구된다',
      'UNDO에서 자동으로 복구된다',
    ],
    correctAnswer: 1,
    explanation: 'PURGE RECYCLEBIN으로 RECYCLEBIN을 비우면 테이블이 영구 삭제됩니다. FLASHBACK TABLE TO BEFORE DROP은 RECYCLEBIN에 있는 테이블만 복구 가능하므로 ORA-38305 오류가 발생합니다.',
  },
  {
    id: 1627, level: 'intermediate',
    question: `Flashback Query와 FLASHBACK TABLE의 차이는?`,
    options: [
      '두 기능은 동일하다',
      'Flashback Query(AS OF): 원본 변경 없이 과거 데이터 SELECT만 가능. FLASHBACK TABLE: 테이블 데이터를 실제로 과거 시점으로 복구(DML 필요)',
      'Flashback Query가 더 강력하다',
      'FLASHBACK TABLE은 SELECT만 가능하다',
    ],
    correctAnswer: 1,
    explanation: 'Flashback Query(AS OF): 읽기 전용 조회, 테이블 원본 불변. FLASHBACK TABLE: 테이블 데이터를 실제로 과거 시점 값으로 되돌림(Rollback과 유사). ROW MOVEMENT가 필요하며 기존 현재 데이터가 대체됩니다.',
  },
  {
    id: 1628, level: 'intermediate',
    question: `현재 SCN 기준 SCN 1000 이전 시점으로 Flashback Query를 수행하는 구문은?`,
    options: [
      'SELECT * FROM t AS OF SCN = 1000',
      'SELECT * FROM t AS OF SCN 1000',
      'SELECT * FROM t WHERE SCN < 1000',
      'SELECT * FROM t FLASHBACK SCN 1000',
    ],
    correctAnswer: 1,
    explanation: 'AS OF SCN 구문: SELECT 열 FROM 테이블 AS OF SCN scn_번호. 타임스탬프 대신 SCN으로 더 정확한 시점 지정. 예: SELECT * FROM employees AS OF SCN 1000 WHERE employee_id = 100.',
  },
  {
    id: 1629, level: 'intermediate',
    question: `FLASHBACK TABLE emp TO BEFORE DROP RENAME TO emp_restored의 의미는?`,
    options: [
      '복구된 테이블을 emp_restored라는 이름으로 저장',
      'emp를 복구하면서 새 이름 emp_restored를 부여 (원래 이름 emp가 이미 존재하는 경우 유용)',
      '오류가 발생한다',
      'emp와 emp_restored 두 테이블이 모두 생성된다',
    ],
    correctAnswer: 1,
    explanation: 'FLASHBACK TABLE emp TO BEFORE DROP RENAME TO emp_restored: DROP된 테이블을 복구하면서 새 이름을 부여합니다. 같은 이름의 테이블이 이미 존재하거나, 원본 이름 대신 다른 이름으로 복구하고 싶을 때 사용합니다.',
  },
  {
    id: 1630, level: 'intermediate',
    question: `FLASHBACK_TRANSACTION_QUERY 뷰의 역할은?`,
    options: [
      'Flashback Query의 성능을 조회한다',
      '과거 트랜잭션에서 실행된 DML의 UNDO SQL을 조회하여 변경을 역순으로 취소 가능',
      'RECYCLEBIN의 트랜잭션 목록을 조회한다',
      'SCN 매핑 정보를 조회한다',
    ],
    correctAnswer: 1,
    explanation: 'FLASHBACK_TRANSACTION_QUERY 뷰: 특정 트랜잭션(XID)의 변경 내역과 UNDO_SQL(변경을 역전할 SQL)을 제공합니다. Flashback Version Query로 찾은 VERSIONS_XID를 사용하여 해당 트랜잭션의 UNDO SQL을 확인할 수 있습니다.',
  },
  {
    id: 1631, level: 'intermediate',
    question: `RECYCLEBIN의 테이블이 같은 이름으로 여러 개 있을 때 FLASHBACK TABLE emp TO BEFORE DROP을 실행하면?`,
    options: [
      '모든 emp 테이블이 한 번에 복구된다',
      '가장 최근에 DROP된 emp 테이블이 복구된다',
      '가장 오래전에 DROP된 emp 테이블이 복구된다',
      '오류가 발생한다',
    ],
    correctAnswer: 1,
    explanation: '같은 이름의 테이블이 RECYCLEBIN에 여러 개 있으면 FLASHBACK TABLE TO BEFORE DROP은 가장 최근에 DROP된 버전을 복구합니다. 특정 버전을 복구하려면 OBJECT_NAME(RECYCLEBIN 내부 이름)을 직접 사용합니다.',
  },
  {
    id: 1632, level: 'intermediate',
    question: `Flashback 기능에서 UNDO_RETENTION 파라미터의 역할은?`,
    options: [
      'UNDO 데이터를 영구적으로 보존한다',
      '최소한 이 기간(초) 동안 UNDO 데이터를 보존하도록 Oracle에 힌트 제공',
      'UNDO 테이블스페이스의 크기를 지정한다',
      'RECYCLEBIN 보존 기간을 설정한다',
    ],
    correctAnswer: 1,
    explanation: 'UNDO_RETENTION = 900(초, 기본값)은 커밋된 UNDO를 최소 900초(15분) 보존하도록 Oracle에 힌트를 줍니다. GUARANTEE 옵션이 없으면 공간 부족 시 조기 삭제될 수 있습니다. Flashback 가능 기간은 이 설정에 의존합니다.',
  },
  {
    id: 1633, level: 'intermediate',
    question: `TIMESTAMP_TO_SCN() 함수의 역할은?`,
    options: [
      'SCN을 타임스탬프로 변환한다',
      '타임스탬프를 해당 시점의 SCN으로 변환한다',
      'SCN 목록을 조회한다',
      'UNDO 타임스탬프를 초기화한다',
    ],
    correctAnswer: 1,
    explanation: 'TIMESTAMP_TO_SCN(timestamp): 주어진 타임스탬프에 해당하는 SCN 값을 반환합니다. SCN_TO_TIMESTAMP(scn): 반대로 SCN을 타임스탬프로 변환합니다. Flashback에서 시점과 SCN을 상호 변환할 때 사용합니다.',
  },
  {
    id: 1634, level: 'intermediate',
    question: `다음 상황에서 Flashback Version Query로 조회되는 버전 수는?
09:00 INSERT employee_id=200 (커밋)
09:10 UPDATE salary: 5000→6000 (커밋)
09:20 UPDATE salary: 6000→7000 (커밋)
09:30 DELETE (커밋)
VERSIONS BETWEEN TIMESTAMP 09:00 AND 09:30`,
    options: ['1개 버전', '2개 버전', '3개 버전', '4개 버전'],
    correctAnswer: 3,
    explanation: '4개의 버전이 생성됩니다: ①09:00 INSERT 버전(salary=5000), ②09:10 UPDATE 버전(salary=6000), ③09:20 UPDATE 버전(salary=7000), ④09:30 DELETE 버전. VERSIONS_OPERATION은 I, U, U, D.',
  },
  {
    id: 1635, level: 'intermediate',
    question: `FLASHBACK TABLE이 DDL 변경 이후의 시점으로 복구를 지원하는가?`,
    options: [
      '항상 DDL 이전으로도 복구 가능하다',
      'DDL 변경(ALTER TABLE, TRUNCATE 등) 이전 시점으로는 복구할 수 없다',
      'TRUNCATE만 예외이고 ALTER TABLE은 가능하다',
      'DDL 종류에 관계없이 모든 시점으로 복구 가능하다',
    ],
    correctAnswer: 1,
    explanation: 'FLASHBACK TABLE은 DML(INSERT, UPDATE, DELETE) 실수 복구에 사용합니다. DDL(ALTER TABLE로 열 추가/삭제, TRUNCATE, DROP) 이전 시점으로는 복구할 수 없습니다. DDL 변경 이후 시점만 복구 가능합니다.',
  },
  {
    id: 1636, level: 'intermediate',
    question: `Flashback Drop(TO BEFORE DROP)은 어떤 저장 영역을 사용하는가?`,
    options: [
      'UNDO 테이블스페이스',
      'Flashback Log',
      'RECYCLEBIN (동일한 테이블스페이스 내)',
      'SYSAUX 테이블스페이스',
    ],
    correctAnswer: 2,
    explanation: 'Flashback Drop(TO BEFORE DROP)은 UNDO를 사용하지 않습니다. Oracle은 DROP TABLE 시 테이블을 RECYCLEBIN(동일한 테이블스페이스 내 이름만 변경)으로 이동합니다. PURGE 또는 테이블스페이스 공간 부족 시 RECYCLEBIN 객체가 삭제됩니다.',
  },
  {
    id: 1637, level: 'intermediate',
    question: `다음 Flashback 사용 사례와 적합한 기능의 연결이 올바른 것은?`,
    options: [
      '실수로 UPDATE한 데이터 확인 → Flashback Drop',
      '실수로 DROP한 테이블 복구 → Flashback Version Query',
      '실수로 DELETE한 행 복구 → Flashback Query(AS OF) 후 INSERT',
      '데이터베이스 전체 복구 → FLASHBACK TABLE',
    ],
    correctAnswer: 2,
    explanation: '실수로 DELETE한 행 복구: AS OF TIMESTAMP로 삭제 전 시점 조회 후 INSERT INTO로 복원. Flashback Drop(TO BEFORE DROP): DROP된 테이블 복구. Flashback Version Query: 행 변경 이력 추적. Flashback Database: 전체 DB 복구.',
  },
  {
    id: 1638, level: 'intermediate',
    question: `Flashback Version Query의 VERSIONS_XID는 무엇에 활용되는가?`,
    options: [
      '트랜잭션 ID. FLASHBACK_TRANSACTION_QUERY 뷰와 JOIN하여 UNDO SQL 조회',
      '버전 번호. 특정 버전으로 직접 복구',
      '행 ID. 특정 행을 직접 조회',
      'SCN 번호. AS OF SCN에 사용',
    ],
    correctAnswer: 0,
    explanation: 'VERSIONS_XID는 해당 버전을 생성한 트랜잭션 ID입니다. FLASHBACK_TRANSACTION_QUERY 뷰의 XID 열과 JOIN하면 해당 트랜잭션에서 실행된 모든 DML과 각 DML의 UNDO_SQL(역전 SQL)을 확인할 수 있습니다.',
  },
  {
    id: 1639, level: 'intermediate',
    question: `SHOW RECYCLEBIN 명령의 역할은?`,
    options: [
      'RECYCLEBIN 크기를 조회한다',
      'SQL*Plus에서 USER_RECYCLEBIN 뷰의 내용을 간략히 표시한다',
      'RECYCLEBIN을 초기화한다',
      'DBA_RECYCLEBIN 전체를 조회한다',
    ],
    correctAnswer: 1,
    explanation: 'SQL*Plus 명령 SHOW RECYCLEBIN은 USER_RECYCLEBIN(현재 사용자의 RECYCLEBIN)의 내용을 간략히 보여줍니다. SELECT * FROM recyclebin과 유사한 결과를 제공합니다.',
  },
  {
    id: 1640, level: 'intermediate',
    question: `테이블에 FK 참조가 있을 때 FLASHBACK TABLE TO BEFORE DROP이 실패할 수 있는 이유는?`,
    options: [
      'FK가 있는 테이블은 DROP 자체가 불가하다',
      '참조하는 부모 테이블이 복구되지 않았거나 이미 다른 이름으로 재생성된 경우 FK 제약 재설정이 불가능해 오류 발생',
      'FK가 있으면 RECYCLEBIN에 보관되지 않는다',
      'FK가 있는 테이블은 TO BEFORE DROP을 지원하지 않는다',
    ],
    correctAnswer: 1,
    explanation: 'FLASHBACK TABLE TO BEFORE DROP은 인덱스와 제약을 함께 복구합니다. 그런데 참조된 부모 테이블이 존재하지 않거나 이름이 바뀐 경우 FK 제약 재설정에 실패할 수 있습니다. FLASHBACK TABLE TO BEFORE DROP 시 연관 객체도 함께 검토해야 합니다.',
  },

  // ── 상(심화) 41~50 ─────────────────────────────────────────
  {
    id: 1641, level: 'advanced',
    question: `다음 시나리오에서 Flashback Version Query로 조회 가능한 데이터의 제한은?
09:00 — salary=5000 (SCN: 1000)
09:10 — UPDATE salary=6000 (SCN: 2000)
09:30 — UNDO_RETENTION 만료로 SCN 1000 이전 UNDO 삭제됨
현재 VERSIONS BETWEEN SCN MINVALUE AND MAXVALUE`,
    options: [
      '5000, 6000 모두 조회 가능',
      '6000만 조회 가능 (UNDO 만료로 salary=5000 버전 조회 불가)',
      '5000만 조회 가능',
      'FLASHBACK 기능 자체가 비활성화되어 오류',
    ],
    correctAnswer: 1,
    explanation: 'UNDO_RETENTION 만료로 SCN 1000 이전 UNDO가 삭제되었으므로 salary=5000(SCN 1000) 버전은 조회 불가합니다. MINVALUE는 현재 가용한 가장 오래된 SCN부터이므로 SCN 2000 이후 버전(salary=6000)만 반환됩니다.',
  },
  {
    id: 1642, level: 'advanced',
    question: `Flashback Version Query와 FLASHBACK_TRANSACTION_QUERY를 결합하여 특정 트랜잭션의 UNDO SQL을 찾는 올바른 패턴은?`,
    options: [
      'FLASHBACK_TRANSACTION_QUERY를 직접 조회한다',
      '1단계: Flashback Version Query로 VERSIONS_XID를 얻고, 2단계: SELECT undo_sql FROM flashback_transaction_query WHERE xid = VERSIONS_XID',
      'VERSIONS BETWEEN에서 UNDO_SQL 의사 컬럼을 직접 조회한다',
      'DBMS_FLASHBACK.TRANSACTION_QUERY() 프로시저를 호출한다',
    ],
    correctAnswer: 1,
    explanation: '2단계 패턴: ①VERSIONS BETWEEN으로 대상 행의 VERSIONS_XID 확인 ②SELECT undo_sql FROM flashback_transaction_query WHERE xid = 앞서_찾은_XID로 해당 트랜잭션의 UNDO SQL(역전 SQL) 조회. 이 UNDO_SQL을 실행하면 변경을 취소할 수 있습니다.',
  },
  {
    id: 1643, level: 'advanced',
    question: `다음 시나리오에서 Flashback Query와 FLASHBACK TABLE의 선택 기준은?
"실수로 UPDATE한 100개 행을 30분 전 값으로 되돌려야 한다"`,
    options: [
      'Flashback Query(AS OF)만 사용하여 자동 복구',
      'FLASHBACK TABLE이 더 간단. ROW MOVEMENT만 있으면 한 명령으로 처리',
      'Flashback Query로 확인 후 FLASHBACK TABLE로 복구. 또는 Flashback Query 결과를 MERGE/UPDATE로 복원',
      'PURGE RECYCLEBIN 후 TO BEFORE DROP으로 복구',
    ],
    correctAnswer: 2,
    explanation: '권장 패턴: ①AS OF TIMESTAMP로 30분 전 값 확인 ②FLASHBACK TABLE t TO TIMESTAMP (SYSTIMESTAMP - INTERVAL \'30\' MINUTE)으로 전체 복구. 또는 AS OF 결과를 UPDATE/MERGE로 선택적 복원. FLASHBACK TABLE은 테이블 전체를 되돌리므로 다른 정상 변경도 함께 롤백될 수 있음을 주의해야 합니다.',
  },
  {
    id: 1644, level: 'advanced',
    question: `Flashback Database와 FLASHBACK TABLE의 차이점은?`,
    options: [
      '두 기능은 동일하며 명칭만 다르다',
      'Flashback Database: DB 전체를 과거로 복구(Flashback Log 필요, DBA 작업, DB를 MOUNT 상태로). FLASHBACK TABLE: 테이블 단위, UNDO 사용, DB 온라인 상태에서 가능',
      'FLASHBACK TABLE이 더 강력하다',
      'Flashback Database는 SQL로 실행할 수 없다',
    ],
    correctAnswer: 1,
    explanation: 'Flashback Database: DB 전체를 과거 시점으로 복구. Flashback Archive Log 필요. DB를 MOUNT 상태로 전환 후 실행. DBA 권한. FLASHBACK TABLE: 테이블 단위 복구. UNDO 데이터 사용. 온라인(OPEN) 상태에서 실행 가능. SQL 명령으로 실행.',
  },
  {
    id: 1645, level: 'advanced',
    question: `다음 중 Oracle Flashback 기능의 분류와 설명이 모두 올바른 것은?`,
    options: [
      'Flashback Query: DDL 복구 / FLASHBACK TABLE: DML 복구',
      'Flashback Query(AS OF): 과거 데이터 조회(읽기 전용) / Flashback Version Query: 행 변경 이력 추적 / FLASHBACK TABLE: 테이블 DML 복구 / Flashback Drop: DROP된 테이블 복구 / Flashback Database: DB 전체 복구',
      'Flashback Drop: UNDO 기반 / Flashback Query: Flashback Log 기반',
      '모든 Flashback 기능은 UNDO 기반이다',
    ],
    correctAnswer: 1,
    explanation: '5가지 주요 Flashback 기능: ①Flashback Query(AS OF, UNDO 기반, 조회 전용) ②Flashback Version Query(VERSIONS BETWEEN, UNDO 기반, 이력 추적) ③FLASHBACK TABLE(UNDO 기반, 테이블 복구) ④Flashback Drop(RECYCLEBIN 기반, DROP 복구) ⑤Flashback Database(Flashback Log 기반, DB 전체 복구).',
  },
  {
    id: 1646, level: 'advanced',
    question: `FLASHBACK TABLE을 사용할 때 트리거(TRIGGER)와 관련된 고려사항은?`,
    options: [
      'FLASHBACK TABLE 실행 시 트리거는 항상 실행된다',
      'FLASHBACK TABLE은 기본적으로 트리거를 비활성화(DISABLE)한 상태에서 실행되며, ENABLE TRIGGERS 옵션으로 활성화 가능',
      '트리거가 있으면 FLASHBACK TABLE이 실패한다',
      '트리거는 FLASHBACK TABLE에 영향을 주지 않는다',
    ],
    correctAnswer: 1,
    explanation: 'FLASHBACK TABLE은 기본적으로 해당 테이블의 트리거를 비활성화한 상태에서 복구를 수행합니다. FLASHBACK TABLE t TO TIMESTAMP ... ENABLE TRIGGERS를 명시하면 트리거를 활성화한 채로 복구를 수행합니다.',
  },
  {
    id: 1647, level: 'advanced',
    question: `고가용성 환경에서 Flashback 기능을 사용할 때의 주의사항은?`,
    options: [
      'RAC 환경에서는 Flashback을 사용할 수 없다',
      'UNDO_RETENTION은 힌트이므로 공간 부족 시 UNDO가 조기 삭제될 수 있다. GUARANTEE가 필요하면 UNDO 테이블스페이스에 RETENTION GUARANTEE 설정 필요',
      'Flashback은 단일 인스턴스에서만 동작한다',
      'Standby DB에서만 Flashback을 사용해야 한다',
    ],
    correctAnswer: 1,
    explanation: 'UNDO_RETENTION은 보존 목표(힌트)이며 공간 부족 시 Oracle이 조기 삭제할 수 있습니다. 보장이 필요하면 ALTER TABLESPACE undo_ts RETENTION GUARANTEE로 설정합니다. GUARANTEE 시 공간 부족 ORA-30036 오류가 발생할 수 있으므로 충분한 UNDO 공간 할당이 필요합니다.',
  },
  {
    id: 1648, level: 'advanced',
    question: `SELECT * FROM t AS OF TIMESTAMP와 FLASHBACK TABLE t TO TIMESTAMP의 원자성(Atomicity) 차이는?`,
    options: [
      '두 명령 모두 트랜잭션이므로 ROLLBACK이 가능하다',
      'AS OF: SELECT이므로 트랜잭션 없음. FLASHBACK TABLE: DML과 동일하게 트랜잭션 발생, 커밋 필요 또는 ROLLBACK 가능',
      'FLASHBACK TABLE은 자동 커밋된다',
      '둘 다 자동 커밋된다',
    ],
    correctAnswer: 1,
    explanation: 'AS OF(Flashback Query)는 SELECT이므로 트랜잭션이 없습니다. FLASHBACK TABLE은 내부적으로 DELETE+INSERT의 DML을 수행하므로 트랜잭션이 발생합니다. 명시적 COMMIT이 필요하며, 원하지 않을 경우 ROLLBACK으로 취소할 수 있습니다.',
  },
  {
    id: 1649, level: 'advanced',
    question: `Flashback Version Query에서 INSERT된 행의 VERSIONS_STARTTIME이 NULL인 경우는?`,
    options: [
      '항상 NULL이다',
      '해당 행이 VERSIONS BETWEEN 범위의 시작 시점 이전부터 이미 존재했을 때 NULL',
      '행이 삭제되었을 때 NULL',
      '커밋이 안 된 상태일 때 NULL',
    ],
    correctAnswer: 1,
    explanation: 'VERSIONS_STARTTIME이 NULL인 경우: 해당 버전이 VERSIONS BETWEEN 쿼리 범위의 시작 시점(시작 SCN/TIMESTAMP) 이전부터 존재했을 때. 즉 이 버전의 시작이 조회 범위를 벗어납니다. 마찬가지로 VERSIONS_ENDTIME이 NULL이면 버전이 현재 조회 시점에도 유효합니다.',
  },
  {
    id: 1650, level: 'advanced',
    question: `다음 시나리오에서 가장 적절한 복구 전략은?
"오늘 오전 10시에 실수로 DELETE FROM orders WHERE order_date < DATE '2024-01-01'을 실행하고 커밋했다. 현재 시각은 오전 11시이며 UNDO_RETENTION = 3600초(1시간)"`,
    options: [
      'FLASHBACK TABLE orders TO BEFORE DROP',
      'AS OF TIMESTAMP (SYSTIMESTAMP - INTERVAL \'1\' HOUR)로 삭제 전 데이터 조회 후 INSERT로 복원. 또는 FLASHBACK TABLE orders TO TIMESTAMP (SYSDATE - 1/24)',
      'RECOVER TABLE orders',
      'UNDO_RETENTION을 늘리고 재실행',
    ],
    correctAnswer: 1,
    explanation: 'UNDO_RETENTION = 3600초(1시간)이고 1시간 이내에 발견했으므로 UNDO 데이터가 아직 유효합니다. ①FLASHBACK TABLE orders TO TIMESTAMP ... 또는 ②AS OF TIMESTAMP (삭제 전 시점) 조회 후 INSERT INTO로 복원. FLASHBACK TABLE이 더 간단하지만 10시 이후 정상 변경도 함께 되돌릴 수 있어 주의 필요.',
  },
]
