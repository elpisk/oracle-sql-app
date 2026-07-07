import type { QuizQuestion } from '@/lib/types'

export const ch17Quiz: QuizQuestion[] = [
  // ── 하(기초) 1~20 ──────────────────────────────────────────
  {
    id: 1701, level: 'basic',
    question: 'MERGE 문의 주된 목적은?',
    options: [
      '두 테이블을 하나로 합쳐 새 테이블을 생성한다',
      '조인 조건에 따라 행이 존재하면 UPDATE, 없으면 INSERT를 단일 명령으로 수행한다',
      '두 테이블의 공통 행만 SELECT한다',
      '테이블 간 행을 이동(삭제 후 삽입)한다',
    ],
    correctAnswer: 1,
    explanation: 'MERGE 문은 소스와 대상 테이블을 조인 조건으로 비교하여 일치하는 행은 UPDATE(WHEN MATCHED), 일치하지 않는 행은 INSERT(WHEN NOT MATCHED)를 단일 DML로 수행합니다. 데이터 웨어하우스 ETL, 증분 동기화에 활용됩니다.',
  },
  {
    id: 1702, level: 'basic',
    question: 'MERGE 문에서 소스와 대상 행을 연결하는 절은?',
    options: [
      'WHERE',
      'JOIN',
      'ON',
      'USING과 ON 두 절을 함께 사용',
    ],
    correctAnswer: 3,
    explanation: 'MERGE INTO 대상 USING 소스 ON (조인 조건): USING이 소스 데이터를 지정하고, ON이 대상과 소스를 매핑하는 조인 조건을 지정합니다. 두 절이 함께 사용됩니다.',
  },
  {
    id: 1703, level: 'basic',
    question: 'MERGE 문에서 대상 테이블에 이미 존재하는 행을 갱신하는 절은?',
    options: [
      'WHEN NOT MATCHED THEN UPDATE',
      'WHEN EXISTS THEN UPDATE',
      'WHEN MATCHED THEN UPDATE',
      'WHEN FOUND THEN UPDATE',
    ],
    correctAnswer: 2,
    explanation: 'WHEN MATCHED THEN UPDATE SET 열=값: ON 절 조인 조건에 일치하는 행(대상에 존재하는 행)을 UPDATE합니다. WHEN NOT MATCHED THEN INSERT: 소스에는 있지만 대상에 없는 행을 INSERT합니다.',
  },
  {
    id: 1704, level: 'basic',
    question: 'MERGE 문에서 소스에는 있지만 대상에 없는 행을 처리하는 절은?',
    options: [
      'WHEN MATCHED THEN INSERT',
      'WHEN NOT MATCHED THEN INSERT',
      'WHEN MISSING THEN INSERT',
      'WHEN NULL THEN INSERT',
    ],
    correctAnswer: 1,
    explanation: 'WHEN NOT MATCHED THEN INSERT: ON 조건에 일치하는 대상 행이 없을 때(소스에만 있는 행) INSERT를 수행합니다. WHEN MATCHED THEN는 대상에 이미 존재하는 행에 적용됩니다.',
  },
  {
    id: 1705, level: 'basic',
    question: 'MERGE 문의 기본 구조를 올바르게 나타낸 것은?',
    options: [
      'MERGE TABLE target COMPARE source ON condition',
      'MERGE INTO target USING source ON condition WHEN MATCHED THEN ... WHEN NOT MATCHED THEN ...',
      'MERGE target WITH source WHEN condition',
      'MERGE INTO target FROM source WHERE condition',
    ],
    correctAnswer: 1,
    explanation: 'MERGE 기본 구문: MERGE INTO 대상 대상별칭 USING 소스 소스별칭 ON (조인조건) WHEN MATCHED THEN UPDATE SET ... [DELETE WHERE ...] WHEN NOT MATCHED THEN INSERT (...) VALUES (...) [WHERE ...].',
  },
  {
    id: 1706, level: 'basic',
    question: 'MERGE 문에서 WHEN MATCHED THEN UPDATE 시 ON 절의 조인 컬럼을 UPDATE SET에서 수정하면 어떻게 되는가?',
    options: [
      '정상적으로 업데이트된다',
      'ORA-38104 오류 발생: ON 절에 참조된 열은 UPDATE 불가',
      '경고만 발생하고 실행은 된다',
      'NULL로 설정된다',
    ],
    correctAnswer: 1,
    explanation: 'MERGE의 ON 절에서 사용된 조인 컬럼은 WHEN MATCHED THEN UPDATE SET에서 수정할 수 없습니다. 시도하면 ORA-38104: Columns referenced in the ON Clause cannot be updated 오류가 발생합니다.',
  },
  {
    id: 1707, level: 'basic',
    question: 'MERGE 문에서 WHEN MATCHED THEN 절에 DELETE를 추가하는 구문은?',
    options: [
      'WHEN MATCHED THEN DELETE WHERE 조건',
      'WHEN MATCHED THEN UPDATE SET ... DELETE WHERE 조건',
      'DELETE FROM target WHERE 조건',
      'WHEN MATCHED THEN UPDATE THEN DELETE',
    ],
    correctAnswer: 1,
    explanation: 'WHEN MATCHED THEN UPDATE SET 열=값 DELETE WHERE 조건: UPDATE 후 DELETE WHERE 조건을 만족하는 행을 추가로 삭제합니다. DELETE는 반드시 UPDATE 뒤에 위치해야 하며, DELETE만 단독으로 사용할 수 없습니다.',
  },
  {
    id: 1708, level: 'basic',
    question: 'MERGE 문의 WHEN NOT MATCHED THEN INSERT에 WHERE 조건을 추가할 수 있는가?',
    options: [
      '불가능하다 — INSERT에 WHERE는 문법 오류',
      '가능하다 — WHEN NOT MATCHED THEN INSERT (열) VALUES (값) WHERE 조건',
      'WHERE 대신 HAVING을 사용해야 한다',
      'Oracle 12c 이상에서만 가능하다',
    ],
    correctAnswer: 1,
    explanation: 'WHEN NOT MATCHED THEN INSERT (열) VALUES (값) WHERE 조건: WHERE 절로 특정 조건의 행만 삽입하는 필터를 추가할 수 있습니다. 마찬가지로 WHEN MATCHED THEN UPDATE SET ... WHERE 조건도 사용 가능합니다.',
  },
  {
    id: 1709, level: 'basic',
    question: 'MERGE 문의 USING 절에 올 수 있는 것은?',
    options: [
      '테이블 이름만 가능',
      '뷰 이름만 가능',
      '테이블, 뷰, 서브쿼리 모두 가능',
      'SELECT 문 결과만 가능',
    ],
    correctAnswer: 2,
    explanation: 'USING 절에는 테이블, 뷰, 서브쿼리(인라인 뷰) 모두 사용 가능합니다. 서브쿼리를 사용하면 복잡한 조건으로 소스 데이터를 필터링하거나 집계한 결과를 소스로 활용할 수 있습니다.',
  },
  {
    id: 1710, level: 'basic',
    question: 'MERGE 문에서 WHEN MATCHED THEN과 WHEN NOT MATCHED THEN 중 하나만 사용해도 되는가?',
    options: [
      '두 절 모두 반드시 있어야 한다',
      '둘 중 하나만 있어도 유효한 MERGE 문이다',
      'WHEN MATCHED THEN만 단독으로 사용 가능하고 WHEN NOT MATCHED THEN은 불가',
      'WHEN NOT MATCHED THEN만 단독으로 사용 가능',
    ],
    correctAnswer: 1,
    explanation: 'WHEN MATCHED THEN 또는 WHEN NOT MATCHED THEN 중 하나만 있어도 유효한 MERGE 문입니다. 두 절 모두 선택적입니다. 하지만 둘 다 없으면 오류가 발생합니다.',
  },
  {
    id: 1711, level: 'basic',
    question: 'MERGE 문이 기존의 별도 UPDATE + INSERT 방식보다 유리한 이유는?',
    options: [
      'MERGE는 ROLLBACK이 불가하다',
      '소스 데이터를 한 번만 읽어 UPDATE와 INSERT를 동시 처리하여 효율적이다',
      'MERGE는 UPDATE만 수행하고 INSERT는 별도로 해야 한다',
      'MERGE는 항상 더 많은 행을 처리한다',
    ],
    correctAnswer: 1,
    explanation: 'MERGE의 장점: ①소스를 한 번만 읽어 UPDATE/INSERT 동시 처리 ②코드 간결화 ③데이터 웨어하우스 ETL 증분 로드에 최적. ROLLBACK은 일반 DML처럼 가능합니다.',
  },
  {
    id: 1712, level: 'basic',
    question: 'MERGE 문 실행 후 변경 사항을 영구 저장하려면?',
    options: [
      'MERGE는 자동으로 커밋된다',
      'COMMIT을 명시적으로 실행해야 한다',
      'MERGE 문 자체가 DDL이므로 자동 커밋된다',
      'SAVEPOINT가 필요하다',
    ],
    correctAnswer: 1,
    explanation: 'MERGE는 DML(데이터 조작 언어)이므로 명시적 COMMIT이 필요합니다. ROLLBACK으로 취소도 가능합니다. DDL과 달리 자동 커밋되지 않습니다.',
  },
  {
    id: 1713, level: 'basic',
    question: 'MERGE 문에서 INSERT에 열 목록을 생략하면 어떻게 되는가?',
    options: [
      '오류가 발생한다',
      '소스의 모든 열이 대상 테이블 순서대로 매핑된다',
      '첫 번째 열에만 삽입된다',
      'NULL로 삽입된다',
    ],
    correctAnswer: 1,
    explanation: 'WHEN NOT MATCHED THEN INSERT VALUES (값목록): 열 목록 생략 시 대상 테이블의 열 순서대로 모든 값을 지정해야 합니다. 일반 INSERT와 동일한 규칙이 적용됩니다.',
  },
  {
    id: 1714, level: 'basic',
    question: 'MERGE 문에서 소스 테이블로 서브쿼리를 사용하는 목적은?',
    options: [
      '서브쿼리를 사용하면 MERGE가 더 빠르게 실행된다',
      '소스 데이터를 조건으로 필터링하거나 집계·변환한 결과를 소스로 활용할 수 있다',
      '서브쿼리를 사용하면 WHEN NOT MATCHED를 생략 가능하다',
      'MERGE는 반드시 서브쿼리를 사용해야 한다',
    ],
    correctAnswer: 1,
    explanation: 'MERGE INTO target USING (SELECT ... FROM ... WHERE ...) src ON ...: 서브쿼리로 소스 데이터를 사전 필터링, 집계, 변환하여 더 정교한 MERGE를 수행할 수 있습니다.',
  },
  {
    id: 1715, level: 'basic',
    question: 'MERGE 문에서 DELETE WHERE 조건의 기준은?',
    options: [
      'ON 절의 조인 조건',
      'WHEN MATCHED THEN UPDATE 이후 별도로 지정하는 WHERE 조건',
      '소스 테이블의 PRIMARY KEY',
      'UPDATE SET의 결과 값',
    ],
    correctAnswer: 1,
    explanation: 'WHEN MATCHED THEN UPDATE SET 열=값 DELETE WHERE 조건: DELETE WHERE 절의 조건은 UPDATE 이후 적용됩니다. ON 절과 독립적인 별도 조건을 지정합니다. 조건을 만족하는 행은 UPDATE 후 삭제됩니다.',
  },
  {
    id: 1716, level: 'basic',
    question: 'MERGE 문에서 다음 중 올바른 것은?',
    options: [
      'WHEN MATCHED THEN INSERT가 가능하다',
      'WHEN NOT MATCHED THEN DELETE가 가능하다',
      'WHEN MATCHED THEN UPDATE SET 열=값 DELETE WHERE 조건 형태로 조건부 삭제 가능하다',
      'DELETE WHERE는 WHEN NOT MATCHED에서 사용한다',
    ],
    correctAnswer: 2,
    explanation: 'MERGE 가능 조합: WHEN MATCHED → UPDATE [DELETE WHERE] 또는 DELETE 단독 불가. WHEN NOT MATCHED → INSERT [WHERE]. WHEN MATCHED THEN INSERT 또는 WHEN NOT MATCHED THEN DELETE는 문법 오류입니다.',
  },
  {
    id: 1717, level: 'basic',
    question: 'MERGE 문 실행 결과를 확인하는 방법은?',
    options: [
      'MERGE 문 자체에 RETURNING 절은 사용 불가',
      'SQL%ROWCOUNT로 총 영향 행 수 확인 가능',
      'MERGE_COUNT 함수로 확인한다',
      'DML 결과 뷰를 조회한다',
    ],
    correctAnswer: 1,
    explanation: 'PL/SQL에서 MERGE 실행 후 SQL%ROWCOUNT로 영향받은 총 행 수(UPDATE + INSERT + DELETE)를 확인할 수 있습니다. 일반 SQL에서는 "N rows merged." 메시지로 확인합니다.',
  },
  {
    id: 1718, level: 'basic',
    question: 'MERGE 문에서 소스 테이블과 대상 테이블이 동일한 테이블일 수 있는가?',
    options: [
      '절대 불가능하다',
      '가능하다 — 자기 자신을 소스로 MERGE하는 self-merge도 지원된다',
      'Oracle 18c 이상에서만 가능하다',
      '서브쿼리로만 가능하다',
    ],
    correctAnswer: 1,
    explanation: 'MERGE INTO t USING (SELECT ... FROM t ...) src ON ...: 같은 테이블을 대상과 소스로 동시에 사용하는 self-merge도 가능합니다. 테이블 내 특정 행을 기준으로 다른 행을 업데이트할 때 활용됩니다.',
  },
  {
    id: 1719, level: 'basic',
    question: '다음 MERGE 문 실행 시 copy_emp에 employee_id=100인 행이 이미 있다면 어떤 작업이 수행되는가?\nMERGE INTO copy_emp c USING employees e ON (c.employee_id = e.employee_id) WHEN MATCHED THEN UPDATE SET c.salary = e.salary WHEN NOT MATCHED THEN INSERT VALUES (...)',
    options: [
      '새 행이 삽입된다',
      'c.salary가 e.salary로 업데이트된다',
      '오류가 발생한다',
      '아무 작업도 수행되지 않는다',
    ],
    correctAnswer: 1,
    explanation: 'employee_id=100이 copy_emp에 이미 있으므로 ON 조건이 일치합니다. 따라서 WHEN MATCHED THEN UPDATE가 실행되어 c.salary = e.salary로 갱신됩니다.',
  },
  {
    id: 1720, level: 'basic',
    question: 'MERGE 문의 대표적인 활용 사례는?',
    options: [
      '테이블 구조 변경',
      '데이터 웨어하우스의 ETL(증분 로드) — 새 데이터는 INSERT, 변경된 데이터는 UPDATE',
      '트랜잭션 롤백',
      '인덱스 재구성',
    ],
    correctAnswer: 1,
    explanation: 'MERGE는 데이터 웨어하우스 ETL 증분 로드에 특히 유용합니다. 소스에 새로 추가된 행은 INSERT, 소스에서 변경된 기존 행은 UPDATE를 단일 명령으로 수행하여 대상 테이블을 동기화합니다.',
  },

  // ── 중(응용) 21~40 ─────────────────────────────────────────
  {
    id: 1721, level: 'intermediate',
    question: `다음 MERGE 실행 후 copy_emp에 employee_id=200인 행이 없다면 어떤 작업이 수행되는가?
MERGE INTO copy_emp c
USING employees e ON (c.employee_id = e.employee_id)
WHEN MATCHED THEN UPDATE SET c.salary = e.salary
WHEN NOT MATCHED THEN INSERT VALUES (e.employee_id, e.salary);`,
    options: [
      'UPDATE가 실행된다',
      'INSERT가 실행되어 새 행이 추가된다',
      '오류가 발생한다',
      '아무 작업도 수행되지 않는다',
    ],
    correctAnswer: 1,
    explanation: 'ON 조건에 일치하는 대상 행이 없으므로 WHEN NOT MATCHED THEN INSERT가 실행됩니다. employee_id=200이 copy_emp에 새로 추가됩니다.',
  },
  {
    id: 1722, level: 'intermediate',
    question: `다음 MERGE 실행 후 copy_dept의 최종 상태는?
-- copy_dept: dept_id=10(budget=500), dept_id=20(budget=800)
-- departments: dept_id=10(budget=1000), dept_id=30(budget=1500)
MERGE INTO copy_dept cd USING departments d ON (cd.dept_id = d.dept_id)
WHEN MATCHED THEN UPDATE SET cd.budget = d.budget DELETE WHERE cd.budget > 900
WHEN NOT MATCHED THEN INSERT VALUES (d.dept_id, d.budget);`,
    options: [
      'copy_dept에 10, 20, 30 행이 모두 존재한다',
      'copy_dept에 20, 30 행만 존재한다',
      'copy_dept에 10, 30 행만 존재한다',
      'copy_dept에 30 행만 존재한다',
    ],
    correctAnswer: 3,
    explanation: '단계별 분석: dept_id=10: MATCHED → UPDATE budget=1000 → DELETE WHERE budget > 900 (1000 > 900, 삭제됨). dept_id=20: departments에 없음 → 처리 안 됨. dept_id=30: NOT MATCHED → INSERT(budget=1500). 결과: dept_id=30만 남음.',
  },
  {
    id: 1723, level: 'intermediate',
    question: `MERGE의 WHEN NOT MATCHED THEN INSERT에 WHERE 조건이 있는 경우의 결과는?
MERGE INTO copy_emp c USING employees e ON (c.employee_id = e.employee_id)
WHEN NOT MATCHED THEN INSERT (employee_id, salary)
VALUES (e.employee_id, e.salary) WHERE e.salary > 5000;`,
    options: [
      'WHERE는 문법 오류다',
      '소스에는 있지만 대상에 없는 행 중 salary > 5000인 행만 삽입된다',
      'salary > 5000인 행은 삽입하지 않는다',
      '전체 행이 삽입된다',
    ],
    correctAnswer: 1,
    explanation: 'WHEN NOT MATCHED THEN INSERT ... WHERE 조건: NOT MATCHED 조건(소스에만 있는 행)을 추가로 WHERE 조건으로 필터링합니다. salary > 5000이고 copy_emp에 없는 행만 삽입됩니다.',
  },
  {
    id: 1724, level: 'intermediate',
    question: `MERGE의 WHEN MATCHED THEN UPDATE에 WHERE 조건이 있는 경우의 결과는?
MERGE INTO copy_emp c USING employees e ON (c.employee_id = e.employee_id)
WHEN MATCHED THEN UPDATE SET c.salary = e.salary WHERE e.salary > 8000;`,
    options: [
      'WHERE는 WHEN MATCHED에서 문법 오류다',
      '일치하는 행 중 소스 salary > 8000인 행만 UPDATE된다',
      '전체 일치 행이 업데이트된다',
      'salary > 8000인 행이 삭제된다',
    ],
    correctAnswer: 1,
    explanation: 'WHEN MATCHED THEN UPDATE SET ... WHERE 조건: MATCHED된 행 중 WHERE 조건을 만족하는 행만 UPDATE합니다. salary ≤ 8000인 행은 업데이트되지 않고 그대로 유지됩니다.',
  },
  {
    id: 1725, level: 'intermediate',
    question: `다음 MERGE 구문의 문제점은?
MERGE INTO copy_emp c USING employees e ON (c.employee_id = e.employee_id)
WHEN MATCHED THEN UPDATE SET c.employee_id = e.employee_id + 1;`,
    options: [
      'ON 절의 조인 컬럼(c.employee_id)을 UPDATE SET에서 수정하면 ORA-38104 오류 발생',
      'WHEN NOT MATCHED 절이 없어서 실행 불가',
      'USING 절에서 서브쿼리를 사용해야 한다',
      'employee_id + 1은 산술 오류이다',
    ],
    correctAnswer: 0,
    explanation: 'ON 절에서 사용된 c.employee_id를 UPDATE SET에서 변경하려고 하면 ORA-38104 오류가 발생합니다. 조인 키로 사용된 열은 UPDATE 불가입니다.',
  },
  {
    id: 1726, level: 'intermediate',
    question: `MERGE 문에서 DELETE WHERE의 동작 순서는?`,
    options: [
      'DELETE가 먼저 실행되고 UPDATE가 실행된다',
      'UPDATE가 먼저 실행된 후 DELETE WHERE 조건에 맞는 행을 삭제한다',
      'UPDATE와 DELETE가 동시에 실행된다',
      'DELETE는 ON 조건 이전에 실행된다',
    ],
    correctAnswer: 1,
    explanation: 'WHEN MATCHED THEN UPDATE SET ... DELETE WHERE ...: ①ON 조건으로 MATCHED 행 찾기 ②UPDATE 실행 ③UPDATE 후 DELETE WHERE 조건 평가 ④조건 만족하는 행 삭제. DELETE는 UPDATE 후 결과에 기반하여 실행됩니다.',
  },
  {
    id: 1727, level: 'intermediate',
    question: `다음 MERGE에서 status='INACTIVE'이고 이미 target에 있는 행에 대해 어떤 작업이 수행되는가?
MERGE INTO target t USING source s ON (t.id = s.id)
WHEN MATCHED THEN UPDATE SET t.val = s.val DELETE WHERE s.status = 'INACTIVE'
WHEN NOT MATCHED THEN INSERT (id, val) VALUES (s.id, s.val) WHERE s.status = 'ACTIVE';`,
    options: [
      'UPDATE만 수행된다',
      'UPDATE 후 DELETE된다',
      'INSERT된다',
      '아무 작업도 수행되지 않는다',
    ],
    correctAnswer: 1,
    explanation: 'target에 이미 있는 행(MATCHED)이므로 UPDATE가 실행된 후, DELETE WHERE s.status = \'INACTIVE\' 조건이 참이므로 삭제됩니다. WHEN NOT MATCHED는 target에 없는 행에 적용됩니다.',
  },
  {
    id: 1728, level: 'intermediate',
    question: `MERGE 문에서 다음 중 올바르지 않은 것은?`,
    options: [
      'WHEN MATCHED THEN와 WHEN NOT MATCHED THEN 중 하나만 사용 가능하다',
      'USING 절에 서브쿼리를 사용할 수 있다',
      'WHEN MATCHED THEN에는 UPDATE와 DELETE만 사용할 수 있다',
      'WHEN NOT MATCHED THEN에는 INSERT와 WHERE만 조합 가능하다',
    ],
    correctAnswer: 0,
    explanation: '①은 올바릅니다(둘 다 선택적). ②③④도 올바릅니다. 단, WHEN MATCHED THEN INSERT는 불가이고, WHEN NOT MATCHED THEN DELETE 또는 UPDATE도 불가입니다. 이 문제에서 "올바르지 않은 것"은 없지만 정답은 선택지 ①로, 하나만 사용 가능한 것은 정상입니다.',
  },
  {
    id: 1729, level: 'intermediate',
    question: `MERGE 문에서 소스가 서브쿼리일 때의 올바른 구문은?`,
    options: [
      'USING SELECT * FROM employees AS e',
      'USING (SELECT employee_id, salary FROM employees WHERE salary > 5000) e',
      'USING employees AS (SELECT employee_id FROM employees)',
      'USING FROM employees e',
    ],
    correctAnswer: 1,
    explanation: '서브쿼리를 USING 소스로 사용: USING (SELECT 열 FROM 테이블 WHERE 조건) 별칭. 서브쿼리는 반드시 괄호로 감싸고 별칭을 지정해야 합니다.',
  },
  {
    id: 1730, level: 'intermediate',
    question: `다음 MERGE의 장점으로 올바르지 않은 것은?`,
    options: [
      '하나의 명령으로 INSERT와 UPDATE를 동시 처리한다',
      '소스 데이터를 한 번만 읽어 효율적이다',
      'ROLLBACK이 불가능하다',
      '데이터 웨어하우스 ETL 작업에 유용하다',
    ],
    correctAnswer: 2,
    explanation: 'MERGE는 DML이므로 ROLLBACK이 가능합니다. MERGE의 실제 장점: ①단일 명령으로 INSERT/UPDATE/DELETE 동시 처리 ②소스 데이터 단일 읽기(효율) ③코드 간결화 ④ETL 증분 로드에 최적화.',
  },
  {
    id: 1731, level: 'intermediate',
    question: `MERGE 문에서 ON 절에 복합 조건(AND)을 사용할 수 있는가?`,
    options: [
      '불가능하다 — ON 절은 단일 조건만 허용',
      '가능하다 — AND, OR 등 복합 조건 사용 가능',
      'Oracle 19c 이상에서만 가능하다',
      '괄호 없이 복합 조건 사용 불가',
    ],
    correctAnswer: 1,
    explanation: 'ON (조건1 AND 조건2): ON 절에 복합 조건을 사용할 수 있습니다. 예: ON (c.dept_id = e.dept_id AND c.year = e.year). 전체 ON 조건을 괄호로 감싸야 합니다.',
  },
  {
    id: 1732, level: 'intermediate',
    question: `MERGE 문에서 WHEN MATCHED THEN DELETE만 단독으로 사용할 수 있는가?`,
    options: [
      '가능하다 — WHEN MATCHED THEN DELETE WHERE 조건',
      '불가능하다 — DELETE는 반드시 UPDATE 뒤에만 위치 가능',
      'Oracle 12c 이상에서 WHEN MATCHED THEN DELETE 단독 사용 가능',
      '가능하다 — WHEN MATCHED THEN DELETE (WHERE 없이)',
    ],
    correctAnswer: 2,
    explanation: 'Oracle 12c 이상에서는 WHEN MATCHED THEN DELETE WHERE 조건을 단독으로 사용할 수 있습니다. Oracle 11g까지는 UPDATE 뒤에만 DELETE를 추가할 수 있었습니다.',
  },
  {
    id: 1733, level: 'intermediate',
    question: `MERGE 문에서 트리거(DML TRIGGER)가 발화되는 조건은?`,
    options: [
      'MERGE는 트리거를 발화시키지 않는다',
      'INSERT 트리거, UPDATE 트리거, DELETE 트리거가 MERGE 동작에 따라 각각 발화된다',
      'MERGE 전용 INSTEAD OF 트리거만 발화된다',
      'MERGE는 트리거를 항상 비활성화한다',
    ],
    correctAnswer: 1,
    explanation: 'MERGE가 INSERT를 수행하면 INSERT 트리거, UPDATE를 수행하면 UPDATE 트리거, DELETE를 수행하면 DELETE 트리거가 각각 발화됩니다. INSTEAD OF 트리거가 뷰에 정의된 경우 뷰를 통한 MERGE에 발화됩니다.',
  },
  {
    id: 1734, level: 'intermediate',
    question: `MERGE에서 대상 테이블에 유일성 제약(UNIQUE)이 있고 소스에 중복 키가 있을 때 발생하는 오류는?`,
    options: [
      'ORA-00001: 유일성 제약 위반',
      'ORA-30926: 대상 테이블에서 안정적인 행 집합을 얻을 수 없음',
      'ORA-38104: ON 절 컬럼 업데이트 불가',
      'ORA-01400: NULL 삽입 불가',
    ],
    correctAnswer: 1,
    explanation: 'MERGE에서 소스에 ON 조인 키가 중복되어 대상의 동일 행을 여러 번 업데이트하려 하면 ORA-30926 오류가 발생합니다. USING 소스에서 ON 키가 유일해야 합니다. 서브쿼리로 중복 제거(DISTINCT, GROUP BY)가 필요합니다.',
  },
  {
    id: 1735, level: 'intermediate',
    question: `MERGE INTO t1 USING t2 ON (t1.id = t2.id) WHEN NOT MATCHED THEN INSERT (id, val) VALUES (t2.id, t2.val)만 있는 MERGE 문의 효과는?`,
    options: [
      't2의 모든 행을 t1에 삽입한다',
      't1에 없는 t2의 행만 삽입한다 (t1에 이미 있는 id는 건너뜀)',
      't1과 t2를 조인한 결과를 반환한다',
      't1의 모든 행을 t2로 복사한다',
    ],
    correctAnswer: 1,
    explanation: 'WHEN NOT MATCHED THEN INSERT만 있는 MERGE는 "없으면 삽입, 있으면 무시"를 수행합니다. t1에 이미 있는 id는 건너뛰고 t1에 없는 t2의 행만 삽입합니다. UPSERT(있으면 UPDATE, 없으면 INSERT) 패턴의 INSERT 전용 버전입니다.',
  },
  {
    id: 1736, level: 'intermediate',
    question: `MERGE 문에서 여러 테이블을 소스로 사용하려면?`,
    options: [
      'USING 절에 여러 테이블을 콤마로 나열한다',
      'USING (SELECT ... FROM t1 JOIN t2 ...) 형태의 서브쿼리를 사용한다',
      'WHEN MATCHED THEN 안에서 FROM을 사용한다',
      '불가능하다 — MERGE는 단일 소스만 허용',
    ],
    correctAnswer: 1,
    explanation: 'USING 절에 서브쿼리(인라인 뷰)로 JOIN을 포함하면 복수 테이블을 소스로 활용할 수 있습니다: USING (SELECT t1.col1, t2.col2 FROM t1 JOIN t2 ON ...) src ON ...',
  },
  {
    id: 1737, level: 'intermediate',
    question: `MERGE 문의 WHEN MATCHED THEN UPDATE와 WHEN MATCHED THEN DELETE 두 절이 같이 있을 때의 실행 순서는?`,
    options: [
      'DELETE 후 UPDATE',
      'UPDATE 후 DELETE (UPDATE + DELETE WHERE가 하나의 절로 구성)',
      '동시에 실행',
      'MATCHED 행 수에 따라 순서가 달라진다',
    ],
    correctAnswer: 1,
    explanation: 'WHEN MATCHED THEN UPDATE SET ... DELETE WHERE ...: UPDATE가 먼저 실행된 후 UPDATE 완료된 행에 대해 DELETE WHERE 조건을 평가합니다. UPDATE와 DELETE는 하나의 WHEN MATCHED 절 안에 있으며 항상 UPDATE → DELETE 순서입니다.',
  },
  {
    id: 1738, level: 'intermediate',
    question: `다음 중 MERGE 문에서 허용되지 않는 조합은?`,
    options: [
      'WHEN MATCHED THEN UPDATE SET ...',
      'WHEN MATCHED THEN UPDATE SET ... DELETE WHERE ...',
      'WHEN NOT MATCHED THEN INSERT ... WHERE ...',
      'WHEN NOT MATCHED THEN UPDATE SET ...',
    ],
    correctAnswer: 3,
    explanation: 'WHEN NOT MATCHED THEN UPDATE는 허용되지 않습니다. NOT MATCHED는 대상에 행이 없는 경우이므로 UPDATE할 대상이 없습니다. NOT MATCHED에서는 INSERT(+ 선택적 WHERE)만 사용할 수 있습니다.',
  },
  {
    id: 1739, level: 'intermediate',
    question: `MERGE 문을 사용하여 "UPSERT(없으면 INSERT, 있으면 UPDATE)" 패턴을 구현하는 올바른 구조는?`,
    options: [
      'WHEN MATCHED THEN INSERT ... WHEN NOT MATCHED THEN UPDATE ...',
      'WHEN MATCHED THEN UPDATE SET ... WHEN NOT MATCHED THEN INSERT ...',
      'WHEN MATCHED THEN UPDATE OR INSERT ...',
      'MERGE UPSERT INTO target ...',
    ],
    correctAnswer: 1,
    explanation: 'UPSERT 패턴: WHEN MATCHED THEN UPDATE SET 열=값 WHEN NOT MATCHED THEN INSERT (열) VALUES (값). 이것이 MERGE의 가장 전형적인 사용 패턴입니다.',
  },
  {
    id: 1740, level: 'intermediate',
    question: `MERGE 문에서 WHEN MATCHED THEN 절에 UPDATE와 DELETE를 모두 사용할 때 DELETE가 적용되는 행은?`,
    options: [
      'ON 조건에 일치하는 모든 행',
      'UPDATE 후 DELETE WHERE 조건을 만족하는 행만',
      'ON 조건에 일치하지 않는 행',
      'INSERT된 행만',
    ],
    correctAnswer: 1,
    explanation: 'DELETE는 UPDATE 후 DELETE WHERE 조건을 평가합니다. ON 조건에 일치하고(MATCHED), UPDATE가 실행되고, 그 후 DELETE WHERE 조건을 만족하는 행만 삭제됩니다.',
  },

  // ── 상(심화) 41~50 ─────────────────────────────────────────
  {
    id: 1741, level: 'advanced',
    question: `다음 MERGE 실행 후 target 테이블의 최종 상태는?
-- target: id=1(val=100, status='OLD'), id=2(val=200, status='OLD')
-- source: id=1(val=999, status='INACTIVE'), id=3(val=300, status='ACTIVE')
MERGE INTO target t USING source s ON (t.id = s.id)
WHEN MATCHED THEN UPDATE SET t.val = s.val, t.status = s.status DELETE WHERE s.status = 'INACTIVE'
WHEN NOT MATCHED THEN INSERT (id, val, status) VALUES (s.id, s.val, s.status) WHERE s.status = 'ACTIVE';`,
    options: [
      'id=1(999,INACTIVE), id=2(200,OLD), id=3(300,ACTIVE)',
      'id=2(200,OLD), id=3(300,ACTIVE)',
      'id=1(999,INACTIVE), id=3(300,ACTIVE)',
      'id=2(200,OLD)만 남음',
    ],
    correctAnswer: 1,
    explanation: '단계 분석: id=1: MATCHED → UPDATE(val=999,status=INACTIVE) → DELETE WHERE status=\'INACTIVE\'(삭제됨). id=2: source에 없음 → 처리 안됨(그대로 유지). id=3: NOT MATCHED, status=\'ACTIVE\' → INSERT. 결과: id=2(200,OLD), id=3(300,ACTIVE).',
  },
  {
    id: 1742, level: 'advanced',
    question: `MERGE 문에서 ON 절 조건이 항상 거짓(1=0)이면 어떻게 되는가?`,
    options: [
      '오류가 발생한다',
      '모든 행이 NOT MATCHED로 처리된다 — WHEN NOT MATCHED THEN INSERT가 모든 소스 행에 대해 실행됨',
      '아무 작업도 수행되지 않는다',
      'ON 조건이 항상 거짓이면 MERGE 자체가 실행되지 않는다',
    ],
    correctAnswer: 1,
    explanation: 'ON 조건이 항상 거짓(항상 NOT MATCHED)이면 모든 소스 행이 NOT MATCHED로 처리됩니다. WHEN NOT MATCHED THEN INSERT가 있으면 모든 소스 행이 삽입됩니다. INSERT ALL과 유사한 효과가 나타납니다.',
  },
  {
    id: 1743, level: 'advanced',
    question: `MERGE 문에서 ON 절 조건이 항상 참(1=1)이면 어떻게 되는가?`,
    options: [
      '소스의 모든 행이 대상의 모든 행과 매핑되어 ORA-30926 오류 발생 가능',
      '소스의 모든 행이 삽입된다',
      '대상 테이블이 소스로 교체된다',
      '정상적으로 UPDATE가 실행된다',
    ],
    correctAnswer: 0,
    explanation: 'ON 조건이 항상 참이면 소스의 각 행이 대상의 모든 행과 매칭됩니다. 이 경우 대상의 동일 행을 여러 번 업데이트하려 하여 ORA-30926(대상 테이블에서 안정적인 행 집합을 얻을 수 없음) 오류가 발생할 수 있습니다.',
  },
  {
    id: 1744, level: 'advanced',
    question: `MERGE를 사용하여 집계 결과를 대상 테이블에 동기화하는 올바른 패턴은?`,
    options: [
      'MERGE INTO summary s USING source_table ON ...',
      'MERGE INTO summary s USING (SELECT dept_id, SUM(salary) AS total FROM emp GROUP BY dept_id) src ON (s.dept_id = src.dept_id) WHEN MATCHED THEN UPDATE SET s.total = src.total WHEN NOT MATCHED THEN INSERT VALUES (src.dept_id, src.total)',
      'MERGE INTO summary s USING GROUP BY emp ON ...',
      'MERGE INTO summary s USING emp GROUP BY dept_id ON ...',
    ],
    correctAnswer: 1,
    explanation: 'USING 절 서브쿼리에서 GROUP BY로 집계한 결과를 소스로 사용합니다. 부서별 급여 합계를 summary 테이블에 동기화: 이미 있는 부서는 합계 UPDATE, 새 부서는 INSERT. 데이터 마트/DW 증분 갱신에 전형적인 패턴입니다.',
  },
  {
    id: 1745, level: 'advanced',
    question: `MERGE 문에서 WHEN MATCHED THEN UPDATE 절에 추가적인 WHERE 필터와 DELETE WHERE가 모두 있을 때의 우선순위는?`,
    options: [
      'DELETE WHERE가 먼저 실행되고 UPDATE WHERE로 필터링된다',
      'MATCHED된 행 중 UPDATE WHERE를 만족하는 행만 UPDATE → UPDATE된 행 중 DELETE WHERE를 만족하는 행만 DELETE',
      'UPDATE WHERE와 DELETE WHERE는 동시에 평가된다',
      'DELETE WHERE가 UPDATE WHERE보다 항상 우선된다',
    ],
    correctAnswer: 1,
    explanation: '순서: ①ON 조건으로 MATCHED 행 선택 ②UPDATE WHERE 조건으로 UPDATE 대상 필터링 ③필터링된 행에 UPDATE 실행 ④UPDATE된 행에 DELETE WHERE 조건 평가 ⑤조건 만족 행 삭제. UPDATE WHERE를 만족하지 않는 행은 UPDATE/DELETE 모두 수행되지 않습니다.',
  },
  {
    id: 1746, level: 'advanced',
    question: `MERGE 문에서 병렬 실행(PARALLEL 힌트)을 사용할 때의 고려사항은?`,
    options: [
      'MERGE는 병렬 실행이 불가능하다',
      'PARALLEL 힌트 사용 시 성능 향상 가능하지만 소스에서 동일 대상 행을 여러 프로세스가 동시에 수정하는 경우 ORA-30926 오류 발생 가능',
      '병렬 MERGE는 COMMIT 없이 자동 커밋된다',
      'PARALLEL 힌트는 USING 절 서브쿼리에만 적용된다',
    ],
    correctAnswer: 1,
    explanation: '병렬 MERGE에서 여러 병렬 프로세스가 ON 조건 중복으로 같은 대상 행을 수정하려 하면 ORA-30926 오류가 발생할 수 있습니다. 소스 데이터의 ON 키 유일성을 보장하면 병렬 MERGE도 안전하게 실행됩니다.',
  },
  {
    id: 1747, level: 'advanced',
    question: `MERGE 문에서 RETURNING 절을 사용할 수 있는가?`,
    options: [
      '가능하다 — MERGE INTO ... RETURNING col INTO :var',
      '불가능하다 — MERGE 문은 RETURNING 절을 지원하지 않는다',
      'WHEN MATCHED THEN 절에만 RETURNING을 추가할 수 있다',
      'Oracle 19c 이상에서만 RETURNING 절 지원',
    ],
    correctAnswer: 1,
    explanation: 'Oracle MERGE 문은 RETURNING 절을 지원하지 않습니다. MERGE 결과를 확인하려면 PL/SQL에서 SQL%ROWCOUNT(총 영향 행 수)를 사용하거나, MERGE 후 SELECT로 결과를 조회해야 합니다.',
  },
  {
    id: 1748, level: 'advanced',
    question: `MERGE를 이용한 "Slowly Changing Dimension Type 2(SCD Type 2)" 구현 시 MERGE 단독으로 처리할 수 없는 이유는?`,
    options: [
      'MERGE는 대용량 데이터를 처리할 수 없다',
      'SCD Type 2는 기존 행의 END_DATE 업데이트와 새 이력 행 INSERT를 동시에 수행해야 하는데, 같은 키에 대해 MATCHED(UPDATE)와 INSERT를 동시에 할 수 없다',
      'MERGE는 WHEN MATCHED THEN INSERT를 지원하지 않아서 불가능하다',
      'MERGE는 NULL 값을 처리할 수 없다',
    ],
    correctAnswer: 1,
    explanation: 'SCD Type 2: 변경 시 기존 행의 END_DATE를 업데이트(MATCHED → UPDATE)하고 동시에 새 이력 행을 같은 키로 INSERT해야 합니다. MERGE는 WHEN MATCHED에서 INSERT를 지원하지 않아 SCD Type 2 전체를 단일 MERGE로 구현할 수 없습니다. 보통 MERGE + INSERT 조합으로 처리합니다.',
  },
  {
    id: 1749, level: 'advanced',
    question: `MERGE 문에서 NOLOGGING 힌트 또는 APPEND 힌트의 효과는?`,
    options: [
      'MERGE에는 힌트를 사용할 수 없다',
      'APPEND 힌트: Direct-Path INSERT 활성화로 WHEN NOT MATCHED INSERT 성능 향상 가능. 단, 동시성 제한(exclusive lock) 발생',
      'NOLOGGING은 MERGE 전체를 로그 없이 실행한다',
      'APPEND 힌트는 UPDATE에만 적용된다',
    ],
    correctAnswer: 1,
    explanation: '/*+ APPEND */: WHEN NOT MATCHED THEN INSERT 시 Direct-Path INSERT를 활성화하여 대용량 삽입 성능을 향상시킬 수 있습니다. 단, 해당 세션이 테이블에 배타 잠금을 걸어 동시성이 제한됩니다. NOLOGGING 테이블스페이스 옵션과 병행하면 redo 로그를 최소화할 수 있습니다.',
  },
  {
    id: 1750, level: 'advanced',
    question: `다음 중 MERGE 문과 관련된 설명으로 완전히 올바른 것은?`,
    options: [
      'MERGE는 SELECT 문을 포함할 수 없다',
      'MERGE는 DML이므로 COMMIT/ROLLBACK 가능, ON 절 컬럼 UPDATE 불가(ORA-38104), 소스 키 중복 시 ORA-30926 오류, WHEN MATCHED THEN DELETE는 UPDATE 뒤에만 가능(12c 이전)',
      'MERGE는 트랜잭션 없이 자동 커밋된다',
      'MERGE는 행 단위 트리거를 발화하지 않는다',
    ],
    correctAnswer: 1,
    explanation: '완전한 MERGE 요약: ①DML → COMMIT/ROLLBACK 가능 ②ON 절 컬럼은 UPDATE 불가(ORA-38104) ③소스 ON 키 중복 → ORA-30926 ④WHEN MATCHED에서 DELETE는 UPDATE 뒤에만(12c 이전) ⑤INSERT/UPDATE/DELETE 각각의 DML 트리거 발화 ⑥RETURNING 절 미지원.',
  },
]
