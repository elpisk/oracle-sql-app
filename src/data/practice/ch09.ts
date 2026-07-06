import type { PracticeProblem } from '@/lib/types'

export const ch09Practice: PracticeProblem[] = [

  // ──────────────────────────────────────────────────────────
  // Group 1: CREATE TABLE 기초 실습
  // ──────────────────────────────────────────────────────────
  {
    id: 901, group: 1, groupTitle: 'CREATE TABLE 기초',
    question: '다음 요건에 맞게 my_departments 테이블을 생성하시오.\n- dept_id: NUMBER(4), 기본 키\n- dept_name: VARCHAR2(30), NOT NULL\n- location: VARCHAR2(50), 기본값 Seoul',
    keyPoint: 'PRIMARY KEY, NOT NULL, DEFAULT를 열 수준에서 정의한다. 생성 순서 주의 (my_departments를 먼저 생성해야 my_employees에서 FK 참조 가능).',
    sql: `CREATE TABLE my_departments (
    dept_id   NUMBER(4)    PRIMARY KEY,
    dept_name VARCHAR2(30) NOT NULL,
    location  VARCHAR2(50) DEFAULT 'Seoul'
);`,
    result: 'Table created.',
  },
  {
    id: 902, group: 1, groupTitle: 'CREATE TABLE 기초',
    question: '다음 요건에 맞게 my_employees 테이블을 생성하시오. (my_departments보다 나중에 생성)\n- emp_id: NUMBER(6), 기본 키\n- first_name: VARCHAR2(20)\n- last_name: VARCHAR2(25), NOT NULL\n- email: VARCHAR2(25), UNIQUE, NOT NULL\n- hire_date: DATE, 기본값 SYSDATE\n- salary: NUMBER(8,2), CHECK(salary > 0)\n- dept_id: NUMBER(4), my_departments(dept_id) 참조',
    keyPoint: 'FK를 통해 참조되는 부모 테이블(my_departments)이 먼저 존재해야 한다. REFERENCES 단축 구문으로 FK를 열 수준에서 정의.',
    sql: `CREATE TABLE my_employees (
    emp_id     NUMBER(6)    PRIMARY KEY,
    first_name VARCHAR2(20),
    last_name  VARCHAR2(25) NOT NULL,
    email      VARCHAR2(25) UNIQUE NOT NULL,
    hire_date  DATE         DEFAULT SYSDATE,
    salary     NUMBER(8,2)  CHECK (salary > 0),
    dept_id    NUMBER(4)    REFERENCES my_departments(dept_id)
);`,
    result: 'Table created.',
  },
  {
    id: 903, group: 1, groupTitle: 'CREATE TABLE 기초',
    question: 'my_employees 테이블 생성 후 DESCRIBE 명령어로 구조를 확인하시오.',
    keyPoint: 'DESCRIBE(또는 DESC)는 테이블의 열 이름, NULL 허용 여부, 데이터 타입을 확인한다.',
    sql: `DESCRIBE my_employees;`,
    result:
`Name          Null?    Type
------------- -------- ---------------
EMP_ID        NOT NULL NUMBER(6)
FIRST_NAME             VARCHAR2(20)
LAST_NAME     NOT NULL VARCHAR2(25)
EMAIL         NOT NULL VARCHAR2(25)
HIRE_DATE               DATE
SALARY                  NUMBER(8,2)
DEPT_ID                 NUMBER(4)`,
  },
  {
    id: 904, group: 1, groupTitle: 'CREATE TABLE 기초',
    question: '다음 조건으로 projects 테이블을 생성하시오. 모든 제약 조건에 명시적 이름을 부여하시오.\n- project_id: NUMBER(5), PK (proj_pk)\n- project_name: VARCHAR2(50), NOT NULL (proj_name_nn)\n- budget: NUMBER(12,2), CHECK(budget >= 0) (proj_budget_ck)\n- status: VARCHAR2(20), CHECK(IN PLANNING/ACTIVE/CLOSED) (proj_status_ck)\n- start_date: DATE, 기본값 SYSDATE',
    keyPoint: 'CONSTRAINT 이름 제약_이름 TYPE 형식으로 명시적 이름을 부여하면 오류 발생 시 어떤 제약 조건인지 쉽게 식별할 수 있다.',
    sql: `CREATE TABLE projects (
    project_id   NUMBER(5)    CONSTRAINT proj_pk PRIMARY KEY,
    project_name VARCHAR2(50) CONSTRAINT proj_name_nn NOT NULL,
    budget       NUMBER(12,2) CONSTRAINT proj_budget_ck CHECK (budget >= 0),
    status       VARCHAR2(20) CONSTRAINT proj_status_ck
                              CHECK (status IN ('PLANNING','ACTIVE','CLOSED')),
    start_date   DATE         DEFAULT SYSDATE
);`,
    result: 'Table created.',
  },
  {
    id: 905, group: 1, groupTitle: 'CREATE TABLE 기초',
    question: 'CREATE TABLE AS SELECT로 dept80_copy 테이블을 생성하시오. 부서 80 사원의 employee_id, last_name, salary, hire_date만 복사하고, 생성 후 행 수를 확인하시오.',
    keyPoint: 'CREATE TABLE AS SELECT는 구조와 데이터를 동시에 복사한다. PRIMARY KEY/UNIQUE/FK/CHECK는 복사되지 않으며 NOT NULL만 복사된다.',
    sql: `CREATE TABLE dept80_copy AS
SELECT employee_id, last_name, salary, hire_date
FROM   employees
WHERE  department_id = 80;

SELECT COUNT(*) FROM dept80_copy;`,
    result:
`Table created.

COUNT(*)
--------
      34`,
  },
  {
    id: 906, group: 1, groupTitle: 'CREATE TABLE 기초',
    question: 'EMPLOYEES 테이블과 동일한 구조이지만 데이터는 없는 빈 테이블 empty_emp를 생성하시오.',
    keyPoint: "WHERE 1=2는 항상 거짓이므로 행이 선택되지 않는다. 구조(열 정의)만 복사되고 데이터 없는 빈 테이블이 생성된다. 백업 테이블 구조 생성 시 자주 사용하는 패턴.",
    sql: `CREATE TABLE empty_emp AS
SELECT * FROM employees WHERE 1=2;

SELECT COUNT(*) FROM empty_emp;`,
    result:
`Table created.

COUNT(*): 0 (데이터 없음)
-- EMPLOYEES와 동일한 구조, NOT NULL 이외의 제약 조건은 복사되지 않음`,
  },

  // ──────────────────────────────────────────────────────────
  // Group 2: 제약 조건 실습
  // ──────────────────────────────────────────────────────────
  {
    id: 907, group: 2, groupTitle: '제약 조건',
    question: 'my_departments 테이블에 데이터를 삽입하고 기본 키 중복 오류를 확인하시오.\n1. INSERT VALUES (10, Sales, Busan)\n2. INSERT VALUES (20, HR, Seoul)\n3. INSERT VALUES (10, IT, Daejeon) → 어떤 오류가 발생하는가?',
    keyPoint: 'PRIMARY KEY는 NOT NULL + UNIQUE. 같은 dept_id(10)가 이미 존재하므로 중복 삽입 불가. ORA-00001 오류 발생.',
    sql: `INSERT INTO my_departments VALUES (10, 'Sales', 'Busan');
INSERT INTO my_departments VALUES (20, 'HR', 'Seoul');

-- 중복 기본 키 삽입 시도
INSERT INTO my_departments VALUES (10, 'IT', 'Daejeon');`,
    result:
`1 row created.
1 row created.
ORA-00001: unique constraint (USER.SYS_Cn) violated
오류 원인: dept_id=10이 이미 존재하므로 PK 중복 삽입 불가`,
  },
  {
    id: 908, group: 2, groupTitle: '제약 조건',
    question: 'my_employees 테이블에서 FOREIGN KEY 제약 조건 위반을 확인하시오.\nINSERT INTO my_employees (emp_id, last_name, email, dept_id) VALUES (1, Kim, SKIM, 99);\n→ dept_id=99는 my_departments에 없음',
    keyPoint: 'FK 제약 조건: 자식 테이블의 FK 값은 부모 테이블의 기본 키에 존재하거나 NULL이어야 한다.',
    sql: `INSERT INTO my_employees (emp_id, last_name, email, dept_id)
VALUES (1, 'Kim', 'SKIM', 99);`,
    result:
`ORA-02291: integrity constraint violated - parent key not found
오류 원인: dept_id=99는 my_departments 테이블에 존재하지 않음`,
  },
  {
    id: 909, group: 2, groupTitle: '제약 조건',
    question: 'my_employees 테이블에서 CHECK 제약 조건 위반을 확인하시오.\n1. INSERT (30, Finance, Seoul) into my_departments\n2. INSERT emp_id=1, salary=5000 into my_employees\n3. UPDATE salary = -100 → 어떤 오류가 발생하는가?',
    keyPoint: 'CHECK(salary > 0) 제약 조건은 모든 DML(INSERT, UPDATE)에 적용된다. 음수 salary는 CHECK 위반.',
    sql: `INSERT INTO my_departments VALUES (30, 'Finance', 'Seoul');
INSERT INTO my_employees (emp_id, last_name, email, salary, dept_id)
VALUES (1, 'Park', 'SPARK', 5000, 30);

-- CHECK 제약 위반 시도
UPDATE my_employees SET salary = -100 WHERE emp_id = 1;`,
    result:
`1 row created.
1 row created.
ORA-02290: check constraint violated
오류 원인: CHECK(salary > 0) 조건에 의해 음수 salary 불가`,
  },
  {
    id: 910, group: 2, groupTitle: '제약 조건',
    question: "my_employees 테이블에서 UNIQUE 제약 조건 위반을 확인하시오.\n기존 데이터: emp_id=1, email='SPARK'\nINSERT emp_id=2, email='SPARK' → 어떤 오류가 발생하는가?",
    keyPoint: "UNIQUE 제약 조건은 같은 값의 중복을 허용하지 않는다. NULL은 여러 행에 있어도 위반이 아님.",
    sql: `INSERT INTO my_employees (emp_id, last_name, email, dept_id)
VALUES (2, 'Lee', 'SPARK', 30);`,
    result:
`ORA-00001: unique constraint violated
오류 원인: email 'SPARK'가 이미 존재하므로 UNIQUE 중복 삽입 불가`,
  },
  {
    id: 911, group: 2, groupTitle: '제약 조건',
    question: 'ON DELETE CASCADE 동작을 확인하시오.\n1. cascade_parent, cascade_child 테이블 생성 (ON DELETE CASCADE)\n2. 데이터 삽입 후 COMMIT\n3. parent_id=1 삭제\n4. cascade_child에서 어떤 행이 사라지는지 확인',
    keyPoint: 'ON DELETE CASCADE: 부모 행 삭제 시 자식 행도 자동으로 함께 삭제된다.',
    sql: `CREATE TABLE cascade_parent (
    parent_id   NUMBER(5) PRIMARY KEY,
    parent_name VARCHAR2(30)
);
CREATE TABLE cascade_child (
    child_id  NUMBER(5) PRIMARY KEY,
    parent_id NUMBER(5),
    CONSTRAINT fk_cascade FOREIGN KEY (parent_id)
        REFERENCES cascade_parent(parent_id)
        ON DELETE CASCADE
);

INSERT INTO cascade_parent VALUES (1, 'Alpha');
INSERT INTO cascade_parent VALUES (2, 'Beta');
INSERT INTO cascade_child VALUES (101, 1);
INSERT INTO cascade_child VALUES (102, 1);
INSERT INTO cascade_child VALUES (103, 2);
COMMIT;

DELETE FROM cascade_parent WHERE parent_id = 1;
SELECT * FROM cascade_child;`,
    result:
`CHILD_ID  PARENT_ID
--------  ---------
103       2
-- child_id 101, 102는 ON DELETE CASCADE로 자동 삭제됨`,
  },
  {
    id: 912, group: 2, groupTitle: '제약 조건',
    question: 'ON DELETE SET NULL 동작을 확인하시오.\n1. setnull_child 테이블 생성 (ON DELETE SET NULL, cascade_parent 참조)\n2. parent_id=2 참조 데이터 삽입\n3. cascade_parent에서 parent_id=2 삭제\n4. setnull_child에서 어떤 변화가 생기는지 확인',
    keyPoint: 'ON DELETE SET NULL: 부모 행 삭제 시 자식의 FK 값이 NULL로 변경된다. 행 자체는 삭제되지 않는다.',
    sql: `CREATE TABLE setnull_child (
    child_id  NUMBER(5) PRIMARY KEY,
    parent_id NUMBER(5),
    CONSTRAINT fk_setnull FOREIGN KEY (parent_id)
        REFERENCES cascade_parent(parent_id)
        ON DELETE SET NULL
);

INSERT INTO setnull_child VALUES (201, 2);
INSERT INTO setnull_child VALUES (202, 2);
COMMIT;

DELETE FROM cascade_parent WHERE parent_id = 2;
SELECT * FROM setnull_child;`,
    result:
`CHILD_ID  PARENT_ID
--------  ---------
201       (null)
202       (null)
-- ON DELETE SET NULL: 행은 유지되고 parent_id만 NULL로 변경됨`,
  },

  // ──────────────────────────────────────────────────────────
  // Group 3: ALTER TABLE 실습
  // ──────────────────────────────────────────────────────────
  {
    id: 913, group: 3, groupTitle: 'ALTER TABLE',
    question: "dept80_copy 테이블에 새 열을 추가하시오.\n- 열 이름: job_id\n- 데이터 타입: VARCHAR2(10)\n- 기본값: 'UNKNOWN'\n추가 후 DESCRIBE로 확인하시오.",
    keyPoint: 'ALTER TABLE ADD로 추가된 열은 항상 테이블의 마지막 열이 된다. 기존 행의 새 열 값은 DEFAULT 또는 NULL이 된다.',
    sql: `ALTER TABLE dept80_copy
ADD (job_id VARCHAR2(10) DEFAULT 'UNKNOWN');

DESCRIBE dept80_copy;`,
    result:
`Table altered.

Name          Null?    Type
------------- -------- ---------------
EMPLOYEE_ID            NUMBER(6)
LAST_NAME              VARCHAR2(25)
SALARY                 NUMBER(8,2)
HIRE_DATE              DATE
JOB_ID                 VARCHAR2(10)  ← 마지막에 추가됨`,
  },
  {
    id: 914, group: 3, groupTitle: 'ALTER TABLE',
    question: 'dept80_copy 테이블에서 salary 열의 데이터 타입을 NUMBER(10, 2)로 수정하시오.',
    keyPoint: '열 크기 확장(NUMBER(8,2) → NUMBER(10,2))은 항상 가능하다. 크기 축소는 기존 데이터가 새 크기를 초과하면 오류가 발생한다.',
    sql: `ALTER TABLE dept80_copy
MODIFY (salary NUMBER(10, 2));`,
    result: 'Table altered.\n(NUMBER(8,2) → NUMBER(10,2) 크기 확장 — 항상 성공)',
  },
  {
    id: 915, group: 3, groupTitle: 'ALTER TABLE',
    question: "dept80_copy 테이블의 job_id 열에 데이터를 채운 후 크기 축소를 시도하시오.\n1. UPDATE dept80_copy SET job_id = 'SA_REP'\n2. ALTER TABLE MODIFY (job_id VARCHAR2(5)) → 어떤 결과가 나오는가?",
    keyPoint: "ORA-01441: 기존 데이터가 새 크기를 초과하면 크기 축소가 불가하다. 'SA_REP'은 6자이므로 VARCHAR2(5)로 축소 불가.",
    sql: `-- 데이터 채우기
UPDATE dept80_copy SET job_id = 'SA_REP';

-- VARCHAR2(5)로 축소 시도 → 오류
ALTER TABLE dept80_copy
MODIFY (job_id VARCHAR2(5));`,
    result:
`N rows updated. (job_id = 'SA_REP' 입력됨)
ORA-01441: cannot decrease column length because some value is too large
오류 원인: 'SA_REP'(6자)가 VARCHAR2(5)를 초과함`,
  },
  {
    id: 916, group: 3, groupTitle: 'ALTER TABLE',
    question: 'dept80_copy 테이블에 commission_pct 열을 추가한 후 SET UNUSED로 표시하고, DROP UNUSED COLUMNS로 제거하시오. 각 단계 후 DESCRIBE로 변화를 확인하시오.',
    keyPoint: 'SET UNUSED → DESCRIBE에서 보이지 않음 (숨겨진 상태) → DROP UNUSED COLUMNS로 실제 삭제. 대형 테이블에서 유용한 2단계 삭제 패턴.',
    sql: `-- 1단계: 열 추가
ALTER TABLE dept80_copy ADD (commission_pct NUMBER(4,2));
DESCRIBE dept80_copy;  -- commission_pct 확인됨

-- 2단계: SET UNUSED
ALTER TABLE dept80_copy SET UNUSED (commission_pct);
DESCRIBE dept80_copy;  -- commission_pct 보이지 않음

-- 3단계: 실제 삭제
ALTER TABLE dept80_copy DROP UNUSED COLUMNS;
DESCRIBE dept80_copy;  -- commission_pct 완전히 제거됨`,
    result:
`ADD 후: commission_pct 열 보임
SET UNUSED 후: commission_pct 보이지 않음 (숨겨진 상태)
DROP UNUSED COLUMNS 후: commission_pct 완전히 제거됨`,
  },
  {
    id: 917, group: 3, groupTitle: 'ALTER TABLE',
    question: 'my_departments 테이블에서 location 열을 삭제하시오. 삭제 후 DESCRIBE로 확인하시오.',
    keyPoint: 'ALTER TABLE DROP (column_name)으로 열을 즉시 삭제한다. 삭제된 열은 복구할 수 없다. 중요한 열을 삭제하기 전에는 백업을 권장한다.',
    sql: `ALTER TABLE my_departments
DROP (location);

DESCRIBE my_departments;`,
    result:
`Table altered.

Name          Null?    Type
------------- -------- ---------------
DEPT_ID       NOT NULL NUMBER(4)
DEPT_NAME     NOT NULL VARCHAR2(30)
(location 열이 삭제됨)`,
  },
  {
    id: 918, group: 3, groupTitle: 'ALTER TABLE',
    question: 'dept80_copy 테이블의 job_id 열 이름을 position_id로 변경하시오.',
    keyPoint: 'ALTER TABLE RENAME COLUMN old_name TO new_name — Oracle 전용 구문으로 열 이름을 변경한다.',
    sql: `ALTER TABLE dept80_copy
RENAME COLUMN job_id TO position_id;

DESCRIBE dept80_copy;`,
    result:
`Table altered.

Name          Null?    Type
------------- -------- ---------------
EMPLOYEE_ID            NUMBER(6)
LAST_NAME              VARCHAR2(25)
SALARY                 NUMBER(10,2)
HIRE_DATE              DATE
POSITION_ID            VARCHAR2(10)  ← JOB_ID → POSITION_ID로 변경됨`,
  },

  // ──────────────────────────────────────────────────────────
  // Group 4: 읽기 전용 테이블 및 DROP TABLE
  // ──────────────────────────────────────────────────────────
  {
    id: 919, group: 4, groupTitle: '읽기 전용 / DROP TABLE',
    question: 'dept80_copy 테이블을 읽기 전용으로 설정하고 DML 시도 시 오류를 확인하시오.\n1. READ ONLY 설정\n2. UPDATE 시도 → 오류\n3. READ WRITE로 복원\n4. UPDATE 재시도 → 성공, ROLLBACK',
    keyPoint: 'ALTER TABLE READ ONLY → DML 불가. ALTER TABLE READ WRITE → 다시 쓰기 가능. DDL(DROP, ALTER 등)도 READ ONLY 상태에서는 일부 제한됨.',
    sql: `-- 1. 읽기 전용 설정
ALTER TABLE dept80_copy READ ONLY;

-- 2. DML 시도 → 오류
UPDATE dept80_copy SET salary = 9999 WHERE ROWNUM = 1;
-- ORA-12081: update operation not allowed on table

-- 3. 읽기/쓰기 복원
ALTER TABLE dept80_copy READ WRITE;

-- 4. DML 재시도
UPDATE dept80_copy SET salary = 9999 WHERE ROWNUM = 1;
ROLLBACK;`,
    result:
`ALTER TABLE dept80_copy READ ONLY: Table altered.
UPDATE (READ ONLY 상태): ORA-12081: update operation not allowed
ALTER TABLE dept80_copy READ WRITE: Table altered.
UPDATE (READ WRITE 상태): 1 row updated.`,
  },
  {
    id: 920, group: 4, groupTitle: '읽기 전용 / DROP TABLE',
    question: 'USER_TABLES 딕셔너리 뷰로 생성한 테이블 목록을 조회하시오.\n(MY_DEPARTMENTS, MY_EMPLOYEES, DEPT80_COPY, PROJECTS)',
    keyPoint: 'USER_TABLES: 현재 사용자가 소유한 테이블 목록. STATUS(VALID/UNUSABLE), READ_ONLY(YES/NO) 등을 확인할 수 있다.',
    sql: `SELECT table_name, status, read_only
FROM   user_tables
WHERE  table_name IN ('MY_DEPARTMENTS', 'MY_EMPLOYEES', 'DEPT80_COPY', 'PROJECTS');`,
    result:
`TABLE_NAME        STATUS  READ_ONLY
----------------- ------- ---------
MY_DEPARTMENTS    VALID   NO
MY_EMPLOYEES      VALID   NO
DEPT80_COPY       VALID   NO
PROJECTS          VALID   NO`,
  },
  {
    id: 921, group: 4, groupTitle: '읽기 전용 / DROP TABLE',
    question: 'projects 테이블을 DROP하고 Recycle Bin에서 확인한 후 FLASHBACK으로 복구하시오.\n1. 데이터 삽입 후 COMMIT\n2. DROP TABLE\n3. Recycle Bin 확인\n4. FLASHBACK TABLE projects TO BEFORE DROP\n5. 복구 확인',
    keyPoint: 'DROP TABLE은 기본적으로 Recycle Bin으로 이동. FLASHBACK TABLE ... TO BEFORE DROP으로 복구 가능. Recycle Bin이 활성화된 환경에서만 사용 가능.',
    sql: `-- 1. 데이터 삽입
INSERT INTO projects VALUES (1, 'Alpha Project', 1000000, 'ACTIVE', SYSDATE);
COMMIT;

-- 2. DROP
DROP TABLE projects;

-- 3. Recycle Bin 확인
SELECT object_name, original_name, type
FROM   recyclebin
WHERE  original_name = 'PROJECTS';

-- 4. FLASHBACK 복구
FLASHBACK TABLE projects TO BEFORE DROP;

-- 5. 복구 확인
SELECT * FROM projects;`,
    result:
`Recycle Bin: BIN$xxxxx==$0  PROJECTS  TABLE
FLASHBACK TABLE: Flashback complete.
SELECT 결과: 1  Alpha Project  1000000  ACTIVE  [날짜]`,
  },
  {
    id: 922, group: 4, groupTitle: '읽기 전용 / DROP TABLE',
    question: 'empty_emp 테이블을 PURGE 옵션으로 삭제하고 Recycle Bin에 남지 않음을 확인하시오.',
    keyPoint: 'DROP TABLE ... PURGE: Recycle Bin을 거치지 않고 즉시 완전 삭제. FLASHBACK으로 복구 불가. 공간을 즉시 반납하고 싶을 때 사용.',
    sql: `-- PURGE로 삭제
DROP TABLE empty_emp PURGE;

-- Recycle Bin 확인
SELECT object_name, original_name
FROM   recyclebin
WHERE  original_name = 'EMPTY_EMP';`,
    result:
`Table dropped. (즉시 완전 삭제)
Recycle Bin 조회: 0 rows selected (Recycle Bin에 없음 — 복구 불가)`,
  },
  {
    id: 923, group: 4, groupTitle: '읽기 전용 / DROP TABLE',
    question: 'USER_CONSTRAINTS 딕셔너리 뷰로 my_employees 테이블의 제약 조건을 조회하시오. constraint_type 값(P, U, R, C)의 의미를 설명하시오.',
    keyPoint: 'USER_CONSTRAINTS, USER_CONS_COLUMNS: 데이터 딕셔너리 뷰로 제약 조건 정보를 조회한다. 제약 조건 디버깅에 유용.',
    sql: `SELECT c.constraint_name,
       c.constraint_type,
       c.status,
       cc.column_name,
       c.search_condition
FROM   user_constraints c
JOIN   user_cons_columns cc
    ON c.constraint_name = cc.constraint_name
   AND c.table_name = cc.table_name
WHERE  c.table_name = 'MY_EMPLOYEES'
ORDER BY c.constraint_type;`,
    result:
`constraint_type 의미:
P → PRIMARY KEY
U → UNIQUE
R → FOREIGN KEY (Referential integrity)
C → CHECK 제약 조건 (NOT NULL 포함)

MY_EMPLOYEES 예상 결과:
- P: EMP_ID (기본 키)
- U: EMAIL (고유)
- R: DEPT_ID → my_departments (FK)
- C: LAST_NAME, EMAIL (NOT NULL), SALARY (salary > 0)`,
  },
  {
    id: 924, group: 4, groupTitle: '읽기 전용 / DROP TABLE',
    question: 'CREATE TABLE AS SELECT로 급여 상위 10명의 백업 테이블을 생성하시오.\n1. top_earners_backup 테이블 생성 (employee_id, last_name, salary, department_id 포함, 상위 10명)\n2. COUNT(*) 확인\n3. 원본 테이블과 급여 비교',
    keyPoint: 'FETCH FIRST n ROWS ONLY(Oracle 12c+)로 상위 N행을 선택하여 테이블을 생성할 수 있다.',
    sql: `-- 1. 상위 10명 백업 테이블 생성
CREATE TABLE top_earners_backup AS
SELECT employee_id, last_name, salary, department_id
FROM   employees
ORDER BY salary DESC
FETCH FIRST 10 ROWS ONLY;

-- 2. 확인
SELECT COUNT(*) FROM top_earners_backup;

-- 3. 원본 비교
SELECT e.employee_id, e.last_name, e.salary, t.salary AS backup_salary
FROM   employees e
JOIN   top_earners_backup t ON e.employee_id = t.employee_id
ORDER BY e.salary DESC;`,
    result:
`Table created.
COUNT(*): 10
원본 비교: salary = backup_salary (정확히 복사됨)
상위 10명: King(24000), Kochhar(17000), De Haan(17000) ...`,
  },

  // ──────────────────────────────────────────────────────────
  // Group 5: 종합 DDL 실습
  // ──────────────────────────────────────────────────────────
  {
    id: 925, group: 5, groupTitle: '종합 DDL',
    question: '온라인 쇼핑몰 데이터베이스 테이블 3개를 생성하시오.\n① customers: customer_id(PK), customer_name(NN), email(UNIQUE+NN), join_date(DEFAULT SYSDATE), grade(DEFAULT BRONZE, CHECK IN BRONZE/SILVER/GOLD)\n② products: product_id(PK), product_name(NN), price(CHECK>0), stock_qty(DEFAULT 0, CHECK>=0)\n③ orders: order_id(PK), customer_id(FK→customers), product_id(FK→products), order_date(DEFAULT SYSDATE), quantity(CHECK>0), total_price',
    keyPoint: 'FK를 포함한 orders는 참조하는 customers, products보다 나중에 생성해야 한다. DEFAULT와 CHECK를 열 수준에서 함께 정의할 수 있다.',
    sql: `-- 1. customers 테이블
CREATE TABLE customers (
    customer_id   NUMBER(6)    PRIMARY KEY,
    customer_name VARCHAR2(50) NOT NULL,
    email         VARCHAR2(50) UNIQUE NOT NULL,
    join_date     DATE         DEFAULT SYSDATE,
    grade         VARCHAR2(10) DEFAULT 'BRONZE'
                               CHECK (grade IN ('BRONZE','SILVER','GOLD'))
);

-- 2. products 테이블
CREATE TABLE products (
    product_id   NUMBER(8)     PRIMARY KEY,
    product_name VARCHAR2(100) NOT NULL,
    price        NUMBER(10,2)  CHECK (price > 0),
    stock_qty    NUMBER(6)     DEFAULT 0 CHECK (stock_qty >= 0)
);

-- 3. orders 테이블 (FK: customers, products 먼저 생성 후)
CREATE TABLE orders (
    order_id    NUMBER(10)   PRIMARY KEY,
    customer_id NUMBER(6)    REFERENCES customers(customer_id),
    product_id  NUMBER(8)    REFERENCES products(product_id),
    order_date  DATE         DEFAULT SYSDATE,
    quantity    NUMBER(4)    CHECK (quantity > 0),
    total_price NUMBER(12,2)
);`,
    result: 'Table created. (3개)',
  },
  {
    id: 926, group: 5, groupTitle: '종합 DDL',
    question: '실습 정리: 이번 실습에서 생성한 모든 테이블을 올바른 순서로 삭제하시오. FK 참조 관계를 고려하여 자식 테이블부터 삭제하시오.',
    keyPoint: 'FK 참조 관계가 있을 때는 자식 테이블을 먼저 삭제해야 한다. 또는 DROP TABLE ... CASCADE CONSTRAINTS로 FK 제약까지 함께 삭제할 수 있다.',
    sql: `-- 1단계: 자식 테이블 먼저 삭제 (FK 포함)
DROP TABLE orders;
DROP TABLE cascade_child;
DROP TABLE setnull_child;

-- 2단계: 나머지 테이블 삭제
DROP TABLE customers;
DROP TABLE products;
DROP TABLE cascade_parent;
DROP TABLE my_employees;
DROP TABLE my_departments;
DROP TABLE dept80_copy;
DROP TABLE top_earners_backup;
DROP TABLE projects;  -- FLASHBACK 복구한 경우

-- 확인
SELECT table_name FROM user_tables
WHERE  table_name IN ('MY_DEPARTMENTS','MY_EMPLOYEES','DEPT80_COPY',
                      'PROJECTS','CUSTOMERS','PRODUCTS','ORDERS',
                      'CASCADE_PARENT','CASCADE_CHILD','SETNULL_CHILD',
                      'TOP_EARNERS_BACKUP');`,
    result: 'no rows selected (모두 삭제 완료)',
  },
]
