import type { PracticeProblem } from '@/lib/types'

export const ch11Practice: PracticeProblem[] = [
  // ── Group 1: 시퀀스 생성 & 기본 사용 ─────────────────────
  {
    id: 1101, group: 1, groupTitle: '시퀀스 생성 & 기본 사용',
    question: 'DEPARTMENTS 기본 키용 시퀀스를 생성하시오. (이름: dept_deptid_seq, 시작: 280, 증가: 10, 최대: 9999, NOCACHE, NOCYCLE)',
    sql: `CREATE SEQUENCE dept_deptid_seq
    START WITH 280
    INCREMENT BY 10
    MAXVALUE 9999
    NOCACHE
    NOCYCLE;`,
    result: 'Sequence created.',
    keyPoint: 'CREATE SEQUENCE 기본 구문. START WITH, INCREMENT BY, MAXVALUE, NOCACHE, NOCYCLE 옵션 지정.',
  },
  {
    id: 1102, group: 1, groupTitle: '시퀀스 생성 & 기본 사용',
    question: 'USER_SEQUENCES 뷰로 dept_deptid_seq의 정보를 확인하시오.',
    sql: `SELECT sequence_name, min_value, max_value,
       increment_by, cache_size, cycle_flag, last_number
FROM   user_sequences
WHERE  sequence_name = 'DEPT_DEPTID_SEQ';`,
    result: 'DEPT_DEPTID_SEQ, 1, 9999, 10, 0, N, 280',
    keyPoint: 'USER_SEQUENCES 딕셔너리 뷰에서 시퀀스 정의 확인. LAST_NUMBER는 캐시 다음으로 디스크에 저장된 값.',
  },
  {
    id: 1103, group: 1, groupTitle: '시퀀스 생성 & 기본 사용',
    question: 'dept_deptid_seq를 사용하여 DEPARTMENTS 테이블에 새 부서를 삽입하고, CURRVAL을 확인 후 ROLLBACK하시오.',
    sql: `INSERT INTO departments (department_id, department_name, location_id)
VALUES (dept_deptid_seq.NEXTVAL, 'Support', 2500);

SELECT dept_deptid_seq.CURRVAL FROM dual;

SELECT department_id, department_name
FROM   departments
WHERE  department_name = 'Support';

ROLLBACK;`,
    result: '1 row created. CURRVAL = 280. department_id=280인 Support 부서 확인.',
    keyPoint: 'NEXTVAL로 시퀀스 다음 값 사용. CURRVAL로 현재 값 확인. ROLLBACK으로 DML 취소해도 시퀀스는 복원되지 않음.',
  },
  {
    id: 1104, group: 1, groupTitle: '시퀀스 생성 & 기본 사용',
    question: 'NEXTVAL을 세 번 연속 호출하고 각 값을 확인하시오. 세 번째 값과 CURRVAL이 같은지 확인하시오.',
    sql: `SELECT dept_deptid_seq.NEXTVAL FROM dual;
SELECT dept_deptid_seq.NEXTVAL FROM dual;
SELECT dept_deptid_seq.NEXTVAL FROM dual;
SELECT dept_deptid_seq.CURRVAL FROM dual;`,
    result: '280 → 290 → 300 → CURRVAL = 300 (ROLLBACK 후 재호출 시 갭 발생)',
    keyPoint: 'NEXTVAL 연속 호출로 INCREMENT BY만큼 증가. CURRVAL은 현재 세션의 마지막 NEXTVAL 값과 동일.',
  },
  {
    id: 1105, group: 1, groupTitle: '시퀀스 생성 & 기본 사용',
    question: '직원 ID용 시퀀스를 생성하고, DEFAULT 값으로 사용하는 테이블을 만들어 데이터를 삽입하시오.',
    sql: `CREATE SEQUENCE emp_id_seq
    START WITH 300
    INCREMENT BY 1
    MAXVALUE 9999
    NOCACHE NOCYCLE;

CREATE TABLE new_employees (
    emp_id   NUMBER DEFAULT emp_id_seq.NEXTVAL NOT NULL,
    emp_name VARCHAR2(50) NOT NULL,
    hire_date DATE DEFAULT SYSDATE
);

INSERT INTO new_employees (emp_name) VALUES ('김철수');
INSERT INTO new_employees (emp_name) VALUES ('이영희');
INSERT INTO new_employees (emp_name) VALUES ('박민준');

SELECT * FROM new_employees;`,
    result: 'emp_id: 300, 301, 302로 자동 할당. emp_name과 hire_date도 출력.',
    keyPoint: 'Oracle 12c+ DEFAULT emp_seq.NEXTVAL로 INSERT 시 자동 ID 할당. emp_id 생략 시 시퀀스 값 자동 적용.',
  },
  {
    id: 1106, group: 1, groupTitle: '시퀀스 생성 & 기본 사용',
    question: 'dept_deptid_seq 시퀀스를 수정하시오. (증가량 20으로, MAXVALUE 99999로 변경 후 확인)',
    sql: `ALTER SEQUENCE dept_deptid_seq
    INCREMENT BY 20
    MAXVALUE 99999;

SELECT sequence_name, increment_by, max_value
FROM   user_sequences
WHERE  sequence_name = 'DEPT_DEPTID_SEQ';

SELECT dept_deptid_seq.NEXTVAL FROM dual;
SELECT dept_deptid_seq.NEXTVAL FROM dual;`,
    result: 'Sequence altered. increment_by=20, max_value=99999로 변경. NEXTVAL 호출 시 20씩 증가 확인.',
    keyPoint: 'ALTER SEQUENCE로 INCREMENT BY, MAXVALUE 등 변경 가능. START WITH는 ALTER로 변경 불가.',
  },

  // ── Group 2: 동의어 생성 & 사용 ───────────────────────────
  {
    id: 1107, group: 2, groupTitle: '동의어 생성 & 사용',
    question: 'DEPARTMENTS 테이블의 단축 동의어를 생성하고 동의어로 조회하시오.',
    sql: `CREATE SYNONYM dept FOR departments;

SELECT department_id, department_name
FROM   dept
ORDER BY department_id;`,
    result: 'Synonym created. departments 테이블의 모든 부서 출력.',
    keyPoint: 'CREATE SYNONYM 동의어명 FOR 원본객체명 형식. 동의어로 원본 테이블처럼 조회 가능.',
  },
  {
    id: 1108, group: 2, groupTitle: '동의어 생성 & 사용',
    question: 'USER_SYNONYMS 뷰로 생성한 DEPT 동의어 정보를 조회하시오.',
    sql: `SELECT synonym_name, table_owner, table_name
FROM   user_synonyms
WHERE  synonym_name = 'DEPT';`,
    result: 'DEPT, [현재사용자], DEPARTMENTS',
    keyPoint: 'USER_SYNONYMS에서 동의어 이름, 소유자, 참조 테이블 확인.',
  },
  {
    id: 1109, group: 2, groupTitle: '동의어 생성 & 사용',
    question: 'EMPLOYEES 테이블의 동의어를 생성하고 DML(UPDATE)이 가능한지 확인하시오. 확인 후 ROLLBACK.',
    sql: `CREATE SYNONYM emp FOR employees;

SELECT employee_id, last_name, salary
FROM   emp
WHERE  department_id = 80
ORDER BY salary DESC
FETCH FIRST 5 ROWS ONLY;

UPDATE emp
SET    salary = salary * 1.01
WHERE  employee_id = 100;

ROLLBACK;`,
    result: '부서 80번 상위 5명 출력. 1 row updated (employee_id=100 급여 1% 인상). ROLLBACK.',
    keyPoint: '동의어를 통한 SELECT, UPDATE 가능 확인. 원본 테이블에 직접 적용됨.',
  },
  {
    id: 1110, group: 2, groupTitle: '동의어 생성 & 사용',
    question: 'JOBS 테이블의 동의어를 생성하고 emp와 JOIN에서 사용하시오.',
    sql: `CREATE SYNONYM j FOR jobs;

SELECT e.employee_id, e.last_name, j.job_title, e.salary
FROM   emp e
JOIN   j   ON e.job_id = j.job_id
WHERE  e.department_id = 60;`,
    result: '부서 60번 직원의 employee_id, last_name, job_title, salary 출력.',
    keyPoint: '동의어를 JOIN에서도 테이블처럼 사용 가능.',
  },
  {
    id: 1111, group: 2, groupTitle: '동의어 생성 & 사용',
    question: '존재하지 않는 테이블에 대한 동의어를 생성하고, 사용 시 오류를 확인하시오.',
    sql: `CREATE SYNONYM ghost_syn FOR nonexistent_table;

SELECT * FROM ghost_syn;

SELECT * FROM user_synonyms WHERE synonym_name = 'GHOST_SYN';`,
    result: 'Synonym created. ORA-04043: object NONEXISTENT_TABLE does not exist. USER_SYNONYMS에서 GHOST_SYN 존재 확인.',
    keyPoint: '동의어 생성 시 참조 객체 존재 여부를 검사하지 않음. 사용 시 오류 발생.',
  },
  {
    id: 1112, group: 2, groupTitle: '동의어 생성 & 사용',
    question: '생성한 동의어들을 모두 삭제하고 삭제 여부를 확인하시오.',
    sql: `DROP SYNONYM dept;
DROP SYNONYM emp;
DROP SYNONYM j;
DROP SYNONYM ghost_syn;

SELECT synonym_name FROM user_synonyms
WHERE  synonym_name IN ('DEPT','EMP','J','GHOST_SYN');`,
    result: '4개 Synonym dropped. SELECT 결과: 0 rows.',
    keyPoint: 'DROP SYNONYM 동의어명으로 개인 동의어 삭제. 원본 테이블은 영향 없음.',
  },

  // ── Group 3: 딕셔너리 뷰 조회 ─────────────────────────────
  {
    id: 1113, group: 3, groupTitle: '딕셔너리 뷰 조회',
    question: 'USER_SEQUENCES 뷰로 현재 스키마의 모든 시퀀스를 조회하시오.',
    sql: `SELECT sequence_name, min_value, max_value,
       increment_by, cycle_flag, order_flag,
       cache_size, last_number
FROM   user_sequences
ORDER BY sequence_name;`,
    result: '생성된 시퀀스(dept_deptid_seq, emp_id_seq 등) 목록과 설정 값 출력.',
    keyPoint: 'USER_SEQUENCES에서 시퀀스 전체 정보 조회. LAST_NUMBER는 다음 할당될 캐시 블록 시작 값.',
  },
  {
    id: 1114, group: 3, groupTitle: '딕셔너리 뷰 조회',
    question: 'USER_SYNONYMS 뷰로 현재 스키마의 모든 동의어를 조회하고, DB_LINK 컬럼의 의미를 확인하시오.',
    sql: `SELECT synonym_name, table_owner, table_name, db_link
FROM   user_synonyms
ORDER BY synonym_name;`,
    result: '생성된 동의어 목록 출력. DB_LINK: NULL이면 로컬 객체, 값이 있으면 원격 DB 링크 사용.',
    keyPoint: 'DB_LINK에 값이 있으면 원격 데이터베이스의 객체를 참조하는 동의어.',
  },
  {
    id: 1115, group: 3, groupTitle: '딕셔너리 뷰 조회',
    question: 'DICTIONARY 뷰에서 시퀀스·동의어 관련 딕셔너리 뷰를 검색하시오.',
    sql: `SELECT table_name, comments FROM dictionary
WHERE  table_name LIKE '%SEQUENCE%';

SELECT table_name, comments FROM dictionary
WHERE  table_name LIKE '%SYNONYM%';`,
    result: 'USER_SEQUENCES, ALL_SEQUENCES, DBA_SEQUENCES 등. USER_SYNONYMS, ALL_SYNONYMS, DBA_SYNONYMS 등 표시.',
    keyPoint: 'DICTIONARY 뷰에서 관련 딕셔너리 뷰 이름과 설명 검색 가능.',
  },
  {
    id: 1116, group: 3, groupTitle: '딕셔너리 뷰 조회',
    question: 'USER_OBJECTS 뷰에서 SEQUENCE와 SYNONYM 유형 객체 수를 집계하시오.',
    sql: `SELECT object_type, COUNT(*) AS cnt
FROM   user_objects
WHERE  object_type IN ('SEQUENCE', 'SYNONYM')
GROUP BY object_type
ORDER BY object_type;`,
    result: 'SEQUENCE: N개, SYNONYM: N개 (생성된 수에 따라 다름)',
    keyPoint: 'USER_OBJECTS에서 모든 스키마 객체 유형 조회. 시퀀스와 동의어도 포함.',
  },

  // ── Group 4: 시퀀스 고급 & ALTER ──────────────────────────
  {
    id: 1117, group: 4, groupTitle: '시퀀스 고급 & 갭 발생',
    question: '시퀀스의 갭(gap) 발생을 직접 확인하시오. NEXTVAL 호출 후 ROLLBACK하고 갭 발생을 확인.',
    sql: `-- 현재 시퀀스 값 확인
SELECT emp_id_seq.NEXTVAL FROM dual;  -- 현재 값 기록

-- 3건 INSERT 후 ROLLBACK (갭 발생)
INSERT INTO new_employees (emp_name) VALUES ('테스트1');
INSERT INTO new_employees (emp_name) VALUES ('테스트2');
INSERT INTO new_employees (emp_name) VALUES ('테스트3');
SELECT emp_id_seq.CURRVAL FROM dual;  -- 값 기록
ROLLBACK;  -- INSERT 취소

-- ROLLBACK 후 NEXTVAL 확인 (갭 발생 여부)
SELECT emp_id_seq.NEXTVAL FROM dual;  -- ROLLBACK 전 CURRVAL + 1

-- 실제 데이터 확인
SELECT emp_id FROM new_employees ORDER BY emp_id;`,
    result: 'NEXTVAL 계속 증가. ROLLBACK 후에도 시퀀스 복원 안 됨. 실제 데이터에 갭 발생 확인.',
    keyPoint: 'ROLLBACK해도 시퀀스는 복원되지 않음 → 갭 발생. 시퀀스는 트랜잭션과 독립적.',
  },
  {
    id: 1118, group: 4, groupTitle: '시퀀스 고급 & 갭 발생',
    question: 'CYCLE 옵션을 가진 시퀀스를 생성하고 최대값 도달 후 동작을 확인하시오.',
    sql: `CREATE SEQUENCE cycle_seq
    START WITH 1
    INCREMENT BY 1
    MAXVALUE 3
    MINVALUE 1
    CYCLE
    NOCACHE;

SELECT cycle_seq.NEXTVAL FROM dual;  -- 1
SELECT cycle_seq.NEXTVAL FROM dual;  -- 2
SELECT cycle_seq.NEXTVAL FROM dual;  -- 3 (MAXVALUE)
SELECT cycle_seq.NEXTVAL FROM dual;  -- 1 (MINVALUE로 재시작)
SELECT cycle_seq.NEXTVAL FROM dual;  -- 2

DROP SEQUENCE cycle_seq;`,
    result: '1, 2, 3 이후 MINVALUE(1)로 재시작하여 1, 2 순서로 반복.',
    keyPoint: 'CYCLE 옵션: MAXVALUE 도달 후 MINVALUE부터 재시작. 중복 발생 가능 — PK에는 부적합.',
  },
  {
    id: 1119, group: 4, groupTitle: '시퀀스 고급 & 갭 발생',
    question: 'START WITH 값이 MAXVALUE보다 큰 경우 오류를 확인하시오.',
    sql: `CREATE SEQUENCE bad_seq
    START WITH 100
    INCREMENT BY 10
    MAXVALUE 50;`,
    result: 'ORA-04006: START WITH value cannot be made to exceed MAXVALUE',
    keyPoint: 'START WITH 값은 MAXVALUE를 초과할 수 없음. ORA-04006 오류 발생.',
  },
  {
    id: 1120, group: 4, groupTitle: '시퀀스 고급 & 갭 발생',
    question: '내림차순 시퀀스(감소하는 시퀀스)를 생성하고 동작을 확인하시오.',
    sql: `CREATE SEQUENCE down_seq
    START WITH 100
    INCREMENT BY -10
    MINVALUE 50
    MAXVALUE 100
    NOCACHE NOCYCLE;

SELECT down_seq.NEXTVAL FROM dual;  -- 100
SELECT down_seq.NEXTVAL FROM dual;  -- 90
SELECT down_seq.NEXTVAL FROM dual;  -- 80
SELECT down_seq.NEXTVAL FROM dual;  -- 70
SELECT down_seq.NEXTVAL FROM dual;  -- 60
SELECT down_seq.NEXTVAL FROM dual;  -- 50
SELECT down_seq.NEXTVAL FROM dual;  -- ORA-08004 (MINVALUE 도달)

DROP SEQUENCE down_seq;`,
    result: '100, 90, 80, 70, 60, 50 → ORA-08004 오류.',
    keyPoint: 'INCREMENT BY 음수 값으로 내림차순 시퀀스 생성. MINVALUE 도달 후 NOCYCLE이면 오류.',
  },
  {
    id: 1121, group: 4, groupTitle: '시퀀스 고급 & 갭 발생',
    question: 'CREATE OR REPLACE SYNONYM으로 기존 동의어를 재정의하시오.',
    sql: `-- 기존 동의어 생성
CREATE SYNONYM my_obj FOR employees;

-- 재정의 (참조 대상 변경)
CREATE OR REPLACE SYNONYM my_obj FOR departments;

-- 변경 확인
SELECT synonym_name, table_name
FROM   user_synonyms
WHERE  synonym_name = 'MY_OBJ';

DROP SYNONYM my_obj;`,
    result: 'Synonym created. Synonym created. MY_OBJ → DEPARTMENTS로 변경 확인.',
    keyPoint: 'CREATE OR REPLACE SYNONYM으로 기존 동의어를 재정의. DROP 없이도 참조 대상 변경 가능.',
  },

  // ── Group 5: 종합 실습 ────────────────────────────────────
  {
    id: 1122, group: 5, groupTitle: '종합 실습',
    question: '미니 주문 시스템을 위한 시퀀스와 동의어를 함께 설계하시오.',
    sql: `-- 1. 주문 ID 시퀀스 생성
CREATE SEQUENCE order_id_seq
    START WITH 1000
    INCREMENT BY 1
    MAXVALUE 9999999
    CACHE 20
    NOCYCLE;

-- 2. 주문 테이블 생성
CREATE TABLE my_orders (
    order_id      NUMBER DEFAULT order_id_seq.NEXTVAL PRIMARY KEY,
    customer_name VARCHAR2(100) NOT NULL,
    product_name  VARCHAR2(100) NOT NULL,
    qty           NUMBER(5) DEFAULT 1 CHECK (qty > 0),
    order_date    DATE DEFAULT SYSDATE,
    status        VARCHAR2(20) DEFAULT 'PENDING'
                               CHECK (status IN ('PENDING','SHIPPED','CANCELLED'))
);

-- 3. 동의어 생성
CREATE SYNONYM mo FOR my_orders;

-- 4. 데이터 삽입 (시퀀스 자동 사용, 동의어 경유)
INSERT INTO mo (customer_name, product_name, qty)
VALUES ('김철수', 'Oracle 교재', 2);

INSERT INTO mo (customer_name, product_name, qty, status)
VALUES ('이영희', 'USB 허브', 1, 'SHIPPED');

INSERT INTO mo (customer_name, product_name)
VALUES ('박민준', '마우스');

COMMIT;

-- 5. 조회
SELECT order_id, customer_name, product_name, qty, status, order_date
FROM   mo
ORDER BY order_id;`,
    result: 'order_id: 1000, 1001, 1002 자동 할당. 3건 INSERT 후 SELECT로 확인.',
    keyPoint: '시퀀스 DEFAULT 사용, 동의어를 통한 DML, COMMIT으로 영구 저장까지 종합 흐름.',
  },
  {
    id: 1123, group: 5, groupTitle: '종합 실습',
    question: '종합 실습에서 생성한 시스템의 딕셔너리 뷰를 조회하시오.',
    sql: `-- 시퀀스 정보
SELECT sequence_name, last_number, increment_by, cache_size
FROM   user_sequences
WHERE  sequence_name = 'ORDER_ID_SEQ';

-- 동의어 정보
SELECT synonym_name, table_name
FROM   user_synonyms
WHERE  synonym_name = 'MO';

-- USER_OBJECTS에서 생성된 객체 확인
SELECT object_name, object_type, status
FROM   user_objects
WHERE  object_name IN ('ORDER_ID_SEQ', 'MY_ORDERS', 'MO');`,
    result: 'ORDER_ID_SEQ 정보, MO→MY_ORDERS 동의어, 세 객체 VALID 상태 확인.',
    keyPoint: 'USER_SEQUENCES, USER_SYNONYMS, USER_OBJECTS를 통한 종합 딕셔너리 조회.',
  },
  {
    id: 1124, group: 5, groupTitle: '종합 실습',
    question: '시퀀스 갭을 발생시키고 딕셔너리에서 변화를 확인하시오.',
    sql: `SELECT order_id_seq.NEXTVAL FROM dual;  -- 현재 값 기록

-- 갭 발생: INSERT 후 ROLLBACK
INSERT INTO mo (customer_name, product_name) VALUES ('테스트', '갭테스트');
SELECT order_id_seq.CURRVAL FROM dual;
ROLLBACK;

-- ROLLBACK 후 NEXTVAL 확인
SELECT order_id_seq.NEXTVAL FROM dual;  -- 갭 발생 확인

-- USER_SEQUENCES LAST_NUMBER 변화 확인
SELECT last_number FROM user_sequences WHERE sequence_name = 'ORDER_ID_SEQ';`,
    result: 'ROLLBACK 후에도 NEXTVAL이 증가. 실제 데이터에 갭 발생.',
    keyPoint: '시퀀스와 트랜잭션은 독립적. ROLLBACK으로 시퀀스 복원 불가 → 갭 발생.',
  },
  {
    id: 1125, group: 5, groupTitle: '종합 실습',
    question: 'ALTER SEQUENCE로 order_id_seq를 수정하고 변경을 확인하시오. (INCREMENT BY 5, MAXVALUE 9999999 유지)',
    sql: `ALTER SEQUENCE order_id_seq
    INCREMENT BY 5;

SELECT sequence_name, increment_by, max_value
FROM   user_sequences
WHERE  sequence_name = 'ORDER_ID_SEQ';

-- 수정 후 NEXTVAL이 5씩 증가하는지 확인
SELECT order_id_seq.NEXTVAL FROM dual;
SELECT order_id_seq.NEXTVAL FROM dual;`,
    result: 'Sequence altered. increment_by=5. NEXTVAL 호출 시 5씩 증가 확인.',
    keyPoint: 'ALTER SEQUENCE로 INCREMENT BY 변경 가능. 즉시 다음 NEXTVAL부터 적용.',
  },
  {
    id: 1126, group: 5, groupTitle: '종합 실습',
    question: '실습 정리 — 생성한 모든 시퀀스, 동의어, 테이블을 삭제하시오.',
    sql: `DROP SYNONYM mo;

DROP TABLE my_orders PURGE;
DROP TABLE new_employees PURGE;

DROP SEQUENCE order_id_seq;
DROP SEQUENCE emp_id_seq;
DROP SEQUENCE dept_deptid_seq;

SELECT object_name, object_type
FROM   user_objects
WHERE  object_name IN (
    'MO', 'MY_ORDERS', 'NEW_EMPLOYEES',
    'ORDER_ID_SEQ', 'EMP_ID_SEQ', 'DEPT_DEPTID_SEQ'
);`,
    result: 'Synonym dropped, Tables dropped, Sequences dropped. SELECT 결과: 0 rows.',
    keyPoint: '실습 후 정리 순서: 동의어→테이블→시퀀스 DROP. PURGE로 Recycle Bin 없이 완전 삭제.',
  },
]
