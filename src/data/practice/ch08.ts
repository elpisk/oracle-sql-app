import type { PracticeProblem } from '@/lib/types'

export const ch08Practice: PracticeProblem[] = [

  // ──────────────────────────────────────────────────────────
  // Group 1: INSERT 문
  // ──────────────────────────────────────────────────────────
  {
    id: 801, group: 1, groupTitle: 'INSERT 문',
    question: 'DEPARTMENTS 테이블에 다음 부서를 삽입하시오. (열 목록 명시, 모든 값 제공)\ndepartment_id=280, department_name=Research, manager_id=100, location_id=1700',
    keyPoint: 'INSERT INTO table (col,...) VALUES (val,...) — 열 목록과 값의 개수·순서가 일치해야 한다.',
    sql: `INSERT INTO departments (department_id, department_name, manager_id, location_id)
VALUES (280, 'Research', 100, 1700);`,
    result: '1 row created.',
  },
  {
    id: 802, group: 1, groupTitle: 'INSERT 문',
    question: 'DEPARTMENTS 테이블에 부서를 삽입하시오. manager_id와 location_id는 열 목록에서 생략하여 암묵적으로 NULL로 설정하시오.\ndepartment_id=290, department_name=Corporate Tax',
    keyPoint: '열 목록에서 열을 생략하면 해당 열은 암묵적으로 NULL이 된다 (암묵적 NULL 삽입).',
    sql: `INSERT INTO departments (department_id, department_name)
VALUES (290, 'Corporate Tax');`,
    result: '1 row created.',
  },
  {
    id: 803, group: 1, groupTitle: 'INSERT 문',
    question: 'DEPARTMENTS 테이블에 부서를 삽입하시오. manager_id와 location_id에 NULL 키워드를 명시적으로 사용하시오.\ndepartment_id=300, department_name=Strategy',
    keyPoint: 'VALUES 절에 NULL 키워드를 직접 기입하는 것이 명시적(Explicit) NULL 삽입이다.',
    sql: `INSERT INTO departments (department_id, department_name, manager_id, location_id)
VALUES (300, 'Strategy', NULL, NULL);`,
    result: '1 row created.',
  },
  {
    id: 804, group: 1, groupTitle: 'INSERT 문',
    question: 'EMPLOYEES 테이블에 새 사원을 삽입하시오. hire_date에는 CURRENT_DATE 함수를, commission_pct는 NULL로 설정하시오.\nemployee_id=207, first_name=James, last_name=Brown, email=JBROWN, phone=515.123.9999, job_id=IT_PROG, salary=7500, manager_id=103, department_id=60',
    keyPoint: 'CURRENT_DATE는 현재 세션 시간대 기준 날짜/시간을 반환한다. 날짜 함수를 VALUES 절에 직접 사용 가능.',
    sql: `INSERT INTO employees (employee_id, first_name, last_name, email,
                       phone_number, hire_date, job_id, salary,
                       commission_pct, manager_id, department_id)
VALUES (207, 'James', 'Brown', 'JBROWN', '515.123.9999',
        CURRENT_DATE, 'IT_PROG', 7500, NULL, 103, 60);`,
    result: '1 row created.',
  },
  {
    id: 805, group: 1, groupTitle: 'INSERT 문',
    question: "EMPLOYEES 테이블에 새 사원을 삽입하시오. hire_date는 TO_DATE 함수로 '15-JAN-2020'을 변환하시오.\nemployee_id=208, first_name=Alice, last_name=Kim, email=AKIM, phone=515.123.8888, job_id=SA_REP, salary=8500, commission_pct=0.15, manager_id=145, department_id=80",
    keyPoint: "TO_DATE(문자열, 형식) 함수로 날짜 문자열을 DATE 타입으로 변환한다. 형식: 'DD-MON-YYYY'",
    sql: `INSERT INTO employees (employee_id, first_name, last_name, email,
                       phone_number, hire_date, job_id, salary,
                       commission_pct, manager_id, department_id)
VALUES (208, 'Alice', 'Kim', 'AKIM', '515.123.8888',
        TO_DATE('15-JAN-2020', 'DD-MON-YYYY'),
        'SA_REP', 8500, 0.15, 145, 80);`,
    result: '1 row created.',
  },
  {
    id: 806, group: 1, groupTitle: 'INSERT 문',
    question: "서브쿼리를 사용하여 EMPLOYEES 테이블에서 job_id에 'REP'가 포함된 사원을 COPY_EMP 테이블로 복사하시오. VALUES 절을 사용하지 않는다.",
    keyPoint: 'INSERT INTO ... SELECT ... 구문은 VALUES 절 없이 서브쿼리 결과를 모두 삽입한다. 한 번에 다중 행 삽입 가능.',
    sql: `INSERT INTO copy_emp
SELECT * FROM employees
WHERE  job_id LIKE '%REP%';`,
    result: 'N rows created. (job_id에 REP가 포함된 사원 수만큼)',
  },

  // ──────────────────────────────────────────────────────────
  // Group 2: UPDATE 문
  // ──────────────────────────────────────────────────────────
  {
    id: 807, group: 2, groupTitle: 'UPDATE 문',
    question: 'COPY_EMP 테이블에서 employee_id = 100인 사원의 salary를 25000으로 변경하시오.',
    keyPoint: 'WHERE 절로 특정 행을 지정하지 않으면 모든 행이 수정된다. 항상 WHERE 조건을 명시해야 한다.',
    sql: `UPDATE copy_emp
SET    salary = 25000
WHERE  employee_id = 100;`,
    result: '1 row updated.',
  },
  {
    id: 808, group: 2, groupTitle: 'UPDATE 문',
    question: 'COPY_EMP 테이블에서 department_id가 50인 모든 사원의 salary를 10% 인상하시오.',
    keyPoint: 'SET salary = salary * 1.1 — 기존 값을 기준으로 연산한 결과로 업데이트할 수 있다.',
    sql: `UPDATE copy_emp
SET    salary = salary * 1.1
WHERE  department_id = 50;`,
    result: 'N rows updated. (부서 50 사원 수만큼)',
  },
  {
    id: 809, group: 2, groupTitle: 'UPDATE 문',
    question: 'COPY_EMP 테이블에서 employee_id=200인 사원의 job_id와 salary를 employee_id=205인 사원의 값으로 동시에 변경하시오.',
    keyPoint: 'SET (col1, col2) = (SELECT col1, col2 FROM ...) — 다중 열을 서브쿼리 하나로 동시에 업데이트.',
    sql: `UPDATE copy_emp
SET    (job_id, salary) = (SELECT job_id, salary
                            FROM   copy_emp
                            WHERE  employee_id = 205)
WHERE  employee_id = 200;`,
    result: '1 row updated.',
  },
  {
    id: 810, group: 2, groupTitle: 'UPDATE 문',
    question: 'COPY_EMP 테이블에서 employee_id = 115인 사원의 commission_pct를 NULL로 변경하시오.',
    keyPoint: 'UPDATE에서 열을 NULL로 설정할 때는 SET column = NULL을 사용한다.',
    sql: `UPDATE copy_emp
SET    commission_pct = NULL
WHERE  employee_id = 115;`,
    result: '1 row updated.',
  },
  {
    id: 811, group: 2, groupTitle: 'UPDATE 문',
    question: "COPY_EMP 테이블에서 job_id가 'IT_PROG'인 사원들의 department_id를 employee_id=100인 사원의 department_id와 동일하게 변경하시오.",
    keyPoint: 'SET 절 서브쿼리로 다른 행의 값을 참조하여 업데이트할 수 있다.',
    sql: `UPDATE copy_emp
SET    department_id = (SELECT department_id
                        FROM   copy_emp
                        WHERE  employee_id = 100)
WHERE  job_id = 'IT_PROG';`,
    result: 'N rows updated. (IT_PROG 사원 수만큼)',
  },
  {
    id: 812, group: 2, groupTitle: 'UPDATE 문',
    question: 'COPY_EMP 테이블에서 salary가 전체 평균 급여보다 낮은 모든 사원의 salary를 전체 평균 급여로 업데이트하시오.',
    keyPoint: 'Oracle UPDATE 서브쿼리는 UPDATE 이전 시점의 데이터 기준으로 계산된다. SET/WHERE 모두 서브쿼리 사용 가능.',
    sql: `UPDATE copy_emp
SET    salary = (SELECT AVG(salary) FROM copy_emp)
WHERE  salary < (SELECT AVG(salary) FROM copy_emp);`,
    result: 'N rows updated.',
  },

  // ──────────────────────────────────────────────────────────
  // Group 3: DELETE / TRUNCATE
  // ──────────────────────────────────────────────────────────
  {
    id: 813, group: 3, groupTitle: 'DELETE / TRUNCATE',
    question: 'COPY_EMP 테이블에서 employee_id = 207인 사원을 삭제하시오.',
    keyPoint: 'DELETE FROM table WHERE condition — WHERE 조건으로 특정 행만 삭제. ROLLBACK으로 복구 가능.',
    sql: `DELETE FROM copy_emp
WHERE  employee_id = 207;`,
    result: '1 row deleted.',
  },
  {
    id: 814, group: 3, groupTitle: 'DELETE / TRUNCATE',
    question: 'COPY_EMP 테이블에서 department_id가 NULL인 사원을 모두 삭제하시오.',
    keyPoint: 'NULL 비교는 = NULL이 아닌 IS NULL을 사용한다.',
    sql: `DELETE FROM copy_emp
WHERE  department_id IS NULL;`,
    result: '1 row deleted. (Grant 사원 1명)',
  },
  {
    id: 815, group: 3, groupTitle: 'DELETE / TRUNCATE',
    question: "서브쿼리를 사용하여 COPY_EMP 테이블에서 department_name에 'Public'이 포함된 부서에 속한 사원을 삭제하시오.",
    keyPoint: 'DELETE WHERE IN (서브쿼리) — 다른 테이블의 조건을 참조하여 삭제할 수 있다.',
    sql: `DELETE FROM copy_emp
WHERE  department_id IN (
    SELECT department_id
    FROM   departments
    WHERE  department_name LIKE '%Public%'
);`,
    result: 'N rows deleted. (Public Relations 부서 사원 수)',
  },
  {
    id: 816, group: 3, groupTitle: 'DELETE / TRUNCATE',
    question: "COPY_EMP 테이블에서 salary가 전체 최대 급여(MAX)보다 낮고 job_id가 'AD_VP'인 사원을 삭제하시오.",
    keyPoint: 'AND 조건 결합과 서브쿼리를 함께 사용하여 복합 조건으로 삭제할 수 있다.',
    sql: `DELETE FROM copy_emp
WHERE  salary < (SELECT MAX(salary) FROM copy_emp)
AND    job_id = 'AD_VP';`,
    result: '2 rows deleted. (Kochhar, De Haan)',
  },
  {
    id: 817, group: 3, groupTitle: 'DELETE / TRUNCATE',
    question: 'COPY_EMP 테이블의 모든 행을 DELETE 문으로 삭제하시오. 삭제 후 COUNT(*)로 확인하고, ROLLBACK으로 복원한 뒤 행 수를 재확인하시오.',
    keyPoint: 'DELETE는 DML이므로 ROLLBACK으로 복구 가능하다. WHERE 없는 DELETE는 모든 행을 삭제한다.',
    sql: `DELETE FROM copy_emp;
SELECT COUNT(*) FROM copy_emp;  -- 0

ROLLBACK;
SELECT COUNT(*) FROM copy_emp;  -- 원래 행 수 반환`,
    result:
`DELETE 후 COUNT(*): 0
ROLLBACK 후 COUNT(*): 원래 행 수 (예: 107)`,
  },
  {
    id: 818, group: 3, groupTitle: 'DELETE / TRUNCATE',
    question: 'COPY_EMP 테이블의 모든 행을 TRUNCATE 문으로 삭제하시오. 실행 후 COUNT(*)로 0행임을 확인하시오.',
    keyPoint: 'TRUNCATE는 DDL — 자동 커밋, ROLLBACK 불가, WHERE 조건 불가, DELETE보다 빠름.',
    sql: `TRUNCATE TABLE copy_emp;
SELECT COUNT(*) FROM copy_emp;`,
    result:
`Table truncated.
COUNT(*): 0
(ROLLBACK 불가 — DDL 자동 커밋)`,
  },

  // ──────────────────────────────────────────────────────────
  // Group 4: 트랜잭션 제어
  // ──────────────────────────────────────────────────────────
  {
    id: 819, group: 4, groupTitle: '트랜잭션 제어',
    question: '다음 순서로 실행하고 결과를 확인하시오:\n1. DEPARTMENTS에 (310, Test Dept, NULL, 1700) 삽입\n2. SAVEPOINT sp1\n3. DEPARTMENTS에 (320, Test Dept 2, NULL, 1700) 삽입\n4. ROLLBACK TO sp1\n5. 부서 310, 320 중 어떤 것이 남는지 SELECT로 확인',
    keyPoint: 'ROLLBACK TO savepoint는 해당 SAVEPOINT 이후의 변경만 취소한다. 이전 변경은 유지된다.',
    sql: `INSERT INTO departments VALUES (310, 'Test Dept', NULL, 1700);
SAVEPOINT sp1;
INSERT INTO departments VALUES (320, 'Test Dept 2', NULL, 1700);
ROLLBACK TO sp1;
SELECT department_id, department_name
FROM   departments
WHERE  department_id IN (310, 320);
ROLLBACK;`,
    result:
`DEPARTMENT_ID  DEPARTMENT_NAME
310            Test Dept
(부서 320은 취소됨)`,
  },
  {
    id: 820, group: 4, groupTitle: '트랜잭션 제어',
    question: '다음 순서로 실행하고 최종 커밋 상태를 확인하시오:\n1. DEPARTMENTS에 (330, Alpha, NULL, 1700) 삽입\n2. SAVEPOINT sp_a\n3. DEPARTMENTS에 (340, Beta, NULL, 1700) 삽입\n4. SAVEPOINT sp_b\n5. 부서 330 이름을 Alpha Updated로 UPDATE\n6. ROLLBACK TO sp_b\n7. COMMIT\n최종 결과는?',
    keyPoint: 'ROLLBACK TO sp_b는 sp_b 이후(UPDATE)만 취소. INSERT 330, 340은 sp_b 이전이므로 COMMIT됨.',
    sql: `INSERT INTO departments VALUES (330, 'Alpha', NULL, 1700);
SAVEPOINT sp_a;
INSERT INTO departments VALUES (340, 'Beta', NULL, 1700);
SAVEPOINT sp_b;
UPDATE departments SET department_name='Alpha Updated' WHERE department_id=330;
ROLLBACK TO sp_b;
COMMIT;
SELECT department_id, department_name FROM departments WHERE department_id IN (330, 340);`,
    result:
`330  Alpha
340  Beta
(UPDATE 'Alpha Updated'는 취소됨)`,
  },
  {
    id: 821, group: 4, groupTitle: '트랜잭션 제어',
    question: 'COMMIT 전과 후의 데이터 가시성을 확인하시오:\n1. DEPARTMENTS에 (350, Gamma, NULL, 1700) 삽입\n2. COMMIT 전 현재 세션에서 SELECT 확인\n3. COMMIT 후 SELECT 재확인',
    keyPoint: 'COMMIT 전에도 현재 세션에서는 자신의 변경을 조회할 수 있다. 다른 세션은 COMMIT 후에만 볼 수 있다.',
    sql: `INSERT INTO departments VALUES (350, 'Gamma', NULL, 1700);
-- COMMIT 전 — 현재 세션에서 조회 가능
SELECT department_id, department_name FROM departments WHERE department_id = 350;

COMMIT;
-- COMMIT 후 — 모든 세션에서 조회 가능
SELECT department_id, department_name FROM departments WHERE department_id = 350;`,
    result:
`COMMIT 전 (현재 세션): 350  Gamma  ← 보임
COMMIT 후 (모든 세션): 350  Gamma  ← 영구 저장`,
  },
  {
    id: 822, group: 4, groupTitle: '트랜잭션 제어',
    question: 'ROLLBACK으로 여러 DML 변경을 한 번에 취소하시오:\n1. COPY_EMP에서 employee_id=100의 salary를 99999로 UPDATE\n2. DEPARTMENTS에 (360, Delta, NULL, 1700) INSERT\n3. SELECT로 변경 확인\n4. ROLLBACK\n5. 재확인 (원래 값으로 복원됨)',
    keyPoint: 'ROLLBACK은 현재 트랜잭션의 모든 미커밋 DML을 한 번에 취소한다.',
    sql: `UPDATE copy_emp SET salary = 99999 WHERE employee_id = 100;
INSERT INTO departments VALUES (360, 'Delta', NULL, 1700);
SELECT salary FROM copy_emp WHERE employee_id = 100;  -- 99999

ROLLBACK;
SELECT salary FROM copy_emp WHERE employee_id = 100;  -- 24000 복원`,
    result:
`ROLLBACK 전: salary = 99999
ROLLBACK 후: salary = 24000 (원래 값 복원)
부서 360도 사라짐`,
  },
  {
    id: 823, group: 4, groupTitle: '트랜잭션 제어',
    question: 'SAVEPOINT를 활용하여 UPDATE는 보존하고 DELETE만 취소하시오:\n1. COPY_EMP에서 department_id=10 사원 salary를 5000으로 UPDATE\n2. SAVEPOINT after_update\n3. department_id=10 사원 DELETE\n4. ROLLBACK TO after_update\n5. 재확인 (UPDATE 유지, DELETE 취소)',
    keyPoint: 'ROLLBACK TO after_update는 DELETE만 취소한다. SAVEPOINT 이전의 UPDATE는 유지된다.',
    sql: `UPDATE copy_emp SET salary = 5000 WHERE department_id = 10;
SAVEPOINT after_update;
DELETE FROM copy_emp WHERE department_id = 10;
-- 0 rows
SELECT * FROM copy_emp WHERE department_id = 10;

ROLLBACK TO after_update;
-- DELETE 취소, UPDATE 유지
SELECT employee_id, last_name, salary FROM copy_emp WHERE department_id = 10;
ROLLBACK;`,
    result:
`ROLLBACK TO 후:
EMPLOYEE_ID  LAST_NAME  SALARY
200          Whalen     5000   ← salary=5000 유지, DELETE 취소됨`,
  },
  {
    id: 824, group: 4, groupTitle: '트랜잭션 제어',
    question: 'DDL 문 실행 시 자동 커밋을 확인하시오:\n1. COPY_EMP에서 employee_id=100 salary를 99999로 UPDATE\n2. SELECT로 확인\n3. CREATE TABLE temp_test (id NUMBER) 실행 (DDL → 자동 커밋)\n4. ROLLBACK\n5. salary 재확인\nROLLBACK 후에도 salary가 99999인 이유는?',
    keyPoint: 'DDL 실행 시 이전의 미커밋 DML도 함께 자동 커밋된다. 따라서 이후 ROLLBACK은 효과 없음.',
    sql: `UPDATE copy_emp SET salary = 99999 WHERE employee_id = 100;
SELECT salary FROM copy_emp WHERE employee_id = 100;  -- 99999

-- DDL → 자동 커밋 (UPDATE도 함께 커밋됨)
CREATE TABLE temp_test (id NUMBER);
ROLLBACK;  -- 이미 커밋됨 — 효과 없음

SELECT salary FROM copy_emp WHERE employee_id = 100;
-- 99999 유지 (DDL 자동 커밋으로 ROLLBACK 불가)`,
    result:
`ROLLBACK 후 salary = 99999
(DDL CREATE TABLE이 이전 UPDATE를 자동 커밋했기 때문)`,
  },

  // ──────────────────────────────────────────────────────────
  // Group 5: 종합 응용
  // ──────────────────────────────────────────────────────────
  {
    id: 825, group: 5, groupTitle: '종합 응용',
    question: '다음 요구사항을 순서대로 작성하시오:\n1. COPY_EMP를 TRUNCATE 후 EMPLOYEES 데이터 전체 INSERT\n2. salary < 6000인 사원을 모두 DELETE\n3. 삭제된 행 수 확인\n4. ROLLBACK하여 복원 후 COUNT(*) 재확인',
    keyPoint: 'TRUNCATE(DDL)는 자동 커밋. 이후 INSERT가 새 트랜잭션 시작. DELETE는 DML이므로 ROLLBACK 가능.',
    sql: `TRUNCATE TABLE copy_emp;
INSERT INTO copy_emp SELECT * FROM employees;

DELETE FROM copy_emp WHERE salary < 6000;
SELECT COUNT(*) FROM employees WHERE salary < 6000;

ROLLBACK;
SELECT COUNT(*) FROM copy_emp;`,
    result:
`DELETE N rows.
ROLLBACK 후 COUNT(*): 107 (원상 복원)`,
  },
  {
    id: 826, group: 5, groupTitle: '종합 응용',
    question: "부서 50에 신규 사원을 추가하는 트랜잭션을 작성하시오:\n1. COPY_EMP에 INSERT: employee_id=209, first_name=Tom, last_name=Lee, email=TLEE, phone=515.000.1111, hire_date='2024-01-15', job_id=ST_CLERK, salary=3200, commission_pct=NULL, manager_id=121, department_id=50\n2. 부서 50의 평균 급여 확인 (신규 사원 포함)\n3. COMMIT",
    keyPoint: "TO_DATE('YYYY-MM-DD') 형식 날짜 변환, INSERT 후 COMMIT까지 하나의 트랜잭션으로 처리.",
    sql: `INSERT INTO copy_emp (employee_id, first_name, last_name, email,
                      phone_number, hire_date, job_id, salary,
                      commission_pct, manager_id, department_id)
VALUES (209, 'Tom', 'Lee', 'TLEE', '515.000.1111',
        TO_DATE('2024-01-15', 'YYYY-MM-DD'),
        'ST_CLERK', 3200, NULL, 121, 50);

SELECT ROUND(AVG(salary)) AS avg_salary
FROM   copy_emp
WHERE  department_id = 50;

COMMIT;`,
    result:
`1 row created.
AVG_SALARY: ~3398
Commit complete.`,
  },
]
