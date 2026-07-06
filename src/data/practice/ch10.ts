import type { PracticeProblem } from '@/lib/types'

export const ch10Practice: PracticeProblem[] = [
  // ── Group 1: 단순 뷰 생성 & 조회 ──────────────────────────
  {
    id: 1001, group: 1, groupTitle: '단순 뷰 생성 & 조회',
    question: '부서 번호가 50인 직원의 employee_id, last_name, salary, hire_date를 포함하는 emp_dept50_vu 뷰를 생성하시오.',
    sql: `CREATE VIEW emp_dept50_vu AS
SELECT employee_id, last_name, salary, hire_date
FROM   employees
WHERE  department_id = 50;`,
    result: 'View created.',
    keyPoint: 'CREATE VIEW 기본 구문. 특정 열과 WHERE 조건으로 단순 뷰 생성.',
  },
  {
    id: 1002, group: 1, groupTitle: '단순 뷰 생성 & 조회',
    question: 'emp_dept50_vu 뷰를 조회하여 모든 데이터를 출력하시오.',
    sql: `SELECT *
FROM   emp_dept50_vu;`,
    result: '부서 50번 직원의 employee_id, last_name, salary, hire_date 출력 (45행)',
    keyPoint: '뷰는 일반 테이블처럼 SELECT * FROM 뷰명으로 조회.',
  },
  {
    id: 1003, group: 1, groupTitle: '단순 뷰 생성 & 조회',
    question: 'emp_dept50_vu 뷰의 구조를 확인하시오.',
    sql: `DESCRIBE emp_dept50_vu;`,
    result: 'EMPLOYEE_ID, LAST_NAME, SALARY, HIRE_DATE의 이름과 데이터 타입 표시',
    keyPoint: 'DESCRIBE(DESC) 뷰명으로 뷰의 열 이름과 데이터 타입 확인 가능.',
  },
  {
    id: 1004, group: 1, groupTitle: '단순 뷰 생성 & 조회',
    question: 'salary*12를 annual_salary 별칭으로 표현한 열을 포함하여, 직원 번호와 이름을 함께 표시하는 emp_annual_sal_vu 뷰를 생성하시오.',
    sql: `CREATE VIEW emp_annual_sal_vu AS
SELECT employee_id, last_name, salary * 12 annual_salary
FROM   employees;`,
    result: 'View created.',
    keyPoint: '표현식 열은 반드시 별칭을 지정해야 합니다.',
  },
  {
    id: 1005, group: 1, groupTitle: '단순 뷰 생성 & 조회',
    question: 'emp_dept50_vu를 열 별칭 방식으로 재생성하시오. (employee_id→EMP_ID, last_name→NAME, salary→MONTHLY_SAL, hire_date→START_DATE)',
    sql: `CREATE OR REPLACE VIEW emp_dept50_vu
  (EMP_ID, NAME, MONTHLY_SAL, START_DATE)
AS SELECT employee_id, last_name, salary, hire_date
   FROM   employees
   WHERE  department_id = 50;`,
    result: 'View created.',
    keyPoint: 'CREATE OR REPLACE VIEW 뷰명 (alias1, alias2, ...) AS SELECT ... 형식으로 열 별칭 지정.',
  },
  {
    id: 1006, group: 1, groupTitle: '단순 뷰 생성 & 조회',
    question: 'USER_VIEWS에서 현재 사용자가 보유한 뷰 이름 목록을 조회하시오.',
    sql: `SELECT view_name
FROM   user_views;`,
    result: 'EMP_DEPT50_VU, EMP_ANNUAL_SAL_VU 등 생성된 뷰 목록 출력',
    keyPoint: 'USER_VIEWS는 현재 사용자가 소유한 뷰 목록 딕셔너리 뷰.',
  },

  // ── Group 2: 뷰 수정 & 복합 뷰 ───────────────────────────
  {
    id: 1007, group: 2, groupTitle: '뷰 수정 & 복합 뷰',
    question: 'emp_dept50_vu에 department_id 열을 추가하고, 열 별칭을 제거하여 원래 열 이름을 사용하도록 수정하시오.',
    sql: `CREATE OR REPLACE VIEW emp_dept50_vu AS
SELECT employee_id, last_name, salary, hire_date, department_id
FROM   employees
WHERE  department_id = 50;`,
    result: 'View created.',
    keyPoint: 'CREATE OR REPLACE VIEW는 기존 권한을 유지하면서 뷰를 재정의.',
  },
  {
    id: 1008, group: 2, groupTitle: '뷰 수정 & 복합 뷰',
    question: 'employees, departments, locations를 JOIN하는 복합 뷰를 생성하시오. (뷰명: emp_dept_vu, 포함 열: employee_id, last_name, department_name, city)',
    sql: `CREATE VIEW emp_dept_vu AS
SELECT e.employee_id, e.last_name,
       d.department_name, l.city
FROM   employees e
       JOIN departments d ON e.department_id = d.department_id
       JOIN locations l   ON d.location_id   = l.location_id;`,
    result: 'View created.',
    keyPoint: '여러 테이블을 JOIN한 복합 뷰. DML에 제한이 있음.',
  },
  {
    id: 1009, group: 2, groupTitle: '뷰 수정 & 복합 뷰',
    question: '부서별 최소 급여, 최대 급여, 평균 급여를 보여주는 복합 뷰를 생성하시오. (뷰명: dept_sal_stats_vu, 열 별칭: department_name, min_sal, max_sal, avg_sal)',
    sql: `CREATE VIEW dept_sal_stats_vu AS
SELECT d.department_name,
       MIN(e.salary) min_sal,
       MAX(e.salary) max_sal,
       ROUND(AVG(e.salary), 0) avg_sal
FROM   employees e
       JOIN departments d ON e.department_id = d.department_id
GROUP BY d.department_name;`,
    result: 'View created.',
    keyPoint: 'GROUP BY + 집계 함수를 포함한 복합 뷰. DML 전체 불가.',
  },
  {
    id: 1010, group: 2, groupTitle: '뷰 수정 & 복합 뷰',
    question: '직종(job_id)별 평균 급여가 8000 이상인 직종만 표시하는 뷰 job_avg_sal_vu를 생성하시오.',
    sql: `CREATE VIEW job_avg_sal_vu AS
SELECT job_id, ROUND(AVG(salary), 0) avg_sal
FROM   employees
GROUP BY job_id
HAVING AVG(salary) >= 8000;`,
    result: 'View created.',
    keyPoint: 'HAVING 절을 포함한 복합 뷰. GROUP BY 포함 시 DML 불가.',
  },
  {
    id: 1011, group: 2, groupTitle: '뷰 수정 & 복합 뷰',
    question: 'emp_dept_vu 뷰(문제 1008)를 사용하여 도시가 Seattle인 직원의 이름과 부서명을 조회하시오.',
    sql: `SELECT last_name, department_name
FROM   emp_dept_vu
WHERE  city = 'Seattle';`,
    result: 'Seattle 위치 부서의 직원 이름과 부서명 출력',
    keyPoint: '뷰를 테이블처럼 WHERE 조건을 추가하여 사용 가능.',
  },
  {
    id: 1012, group: 2, groupTitle: '뷰 수정 & 복합 뷰',
    question: 'USER_VIEWS에서 dept_sal_stats_vu 뷰의 서브쿼리 텍스트(TEXT)를 조회하시오.',
    sql: `SELECT text
FROM   user_views
WHERE  view_name = 'DEPT_SAL_STATS_VU';`,
    result: 'dept_sal_stats_vu를 정의한 서브쿼리 텍스트 출력',
    keyPoint: "USER_VIEWS.TEXT 컬럼에 뷰 정의 서브쿼리 저장. view_name 대문자 비교.",
  },

  // ── Group 3: WITH CHECK OPTION & WITH READ ONLY ───────────
  {
    id: 1013, group: 3, groupTitle: 'WITH CHECK OPTION & WITH READ ONLY',
    question: '부서 번호가 20인 직원만 포함하는 emp_dept20_ck_vu 뷰를 WITH CHECK OPTION CONSTRAINT empvu20_ck로 생성하시오.',
    sql: `CREATE VIEW emp_dept20_ck_vu AS
SELECT employee_id, last_name, email, hire_date, job_id, department_id
FROM   employees
WHERE  department_id = 20
WITH CHECK OPTION CONSTRAINT empvu20_ck;`,
    result: 'View created.',
    keyPoint: 'WITH CHECK OPTION은 뷰의 WHERE 조건 밖 DML을 차단. CONSTRAINT로 오류 메시지에 이름 표시.',
  },
  {
    id: 1014, group: 3, groupTitle: 'WITH CHECK OPTION & WITH READ ONLY',
    question: 'emp_dept20_ck_vu를 통해 department_id=30인 직원 행을 삽입하려고 시도하고, 발생하는 오류를 확인하시오.',
    sql: `INSERT INTO emp_dept20_ck_vu
    (employee_id, last_name, email, hire_date, job_id, department_id)
VALUES (500, 'TestUser', 'TESTUSER', SYSDATE, 'MK_REP', 30);`,
    result: 'ORA-01402: view WITH CHECK OPTION where-clause violation',
    keyPoint: 'department_id=30은 뷰의 WHERE 조건(department_id=20) 위반 → ORA-01402 오류.',
  },
  {
    id: 1015, group: 3, groupTitle: 'WITH CHECK OPTION & WITH READ ONLY',
    question: 'emp_dept20_ck_vu를 통해 department_id=20인 유효한 직원을 삽입하고, 뷰와 기반 테이블을 확인 후 ROLLBACK하시오.',
    sql: `INSERT INTO emp_dept20_ck_vu
    (employee_id, last_name, email, hire_date, job_id, department_id)
VALUES (501, 'GoodUser', 'GOODUSER', SYSDATE, 'MK_REP', 20);

SELECT * FROM emp_dept20_ck_vu WHERE employee_id = 501;
SELECT * FROM employees WHERE employee_id = 501;
ROLLBACK;`,
    result: '1 row created. 뷰와 employees 테이블 모두에서 employee_id=501 확인 후 ROLLBACK.',
    keyPoint: '뷰를 통한 DML은 기반 테이블에 직접 반영됨. ROLLBACK으로 취소.',
  },
  {
    id: 1016, group: 3, groupTitle: 'WITH CHECK OPTION & WITH READ ONLY',
    question: '부서 번호가 10인 직원 정보를 읽기 전용으로 보여주는 emp_dept10_ro_vu 뷰를 생성하시오. (열 별칭: employee_number, employee_name, job_title)',
    sql: `CREATE VIEW emp_dept10_ro_vu (employee_number, employee_name, job_title)
AS SELECT employee_id, last_name, job_id
   FROM   employees
   WHERE  department_id = 10
WITH READ ONLY;`,
    result: 'View created.',
    keyPoint: 'WITH READ ONLY는 모든 DML을 차단. SELECT만 허용.',
  },
  {
    id: 1017, group: 3, groupTitle: 'WITH CHECK OPTION & WITH READ ONLY',
    question: 'emp_dept10_ro_vu 뷰를 통해 DELETE를 시도하고 발생하는 오류를 확인하시오.',
    sql: `DELETE FROM emp_dept10_ro_vu WHERE employee_number = 200;`,
    result: 'ORA-42399: cannot perform a DML operation on a read-only view',
    keyPoint: 'WITH READ ONLY 뷰에서 DML 시도 시 ORA-42399 오류.',
  },
  {
    id: 1018, group: 3, groupTitle: 'WITH CHECK OPTION & WITH READ ONLY',
    question: '"사라지는 행" 현상을 실습하시오. emp_dept80_vu(부서 80번 뷰)를 통해 department_id=90인 행을 삽입 후 뷰와 employees에서 확인, ROLLBACK.',
    sql: `CREATE VIEW emp_dept80_vu AS
SELECT employee_id, last_name, salary, department_id
FROM   employees WHERE department_id = 80;

INSERT INTO emp_dept80_vu (employee_id, last_name, email, hire_date, job_id, department_id)
VALUES (502, 'Ghost', 'GHOST', SYSDATE, 'SA_REP', 90);

-- 뷰에서 조회 (department_id=80 조건으로 보이지 않음)
SELECT * FROM emp_dept80_vu WHERE employee_id = 502;

-- 기반 테이블에서 확인 (존재함)
SELECT * FROM employees WHERE employee_id = 502;
ROLLBACK;`,
    result: '뷰 조회: 0 rows. employees 조회: 1 row. 사라지는 행 현상 확인.',
    keyPoint: 'WITH CHECK OPTION 없으면 뷰 조건 밖 행도 삽입 가능. 뷰에서는 보이지 않음.',
  },

  // ── Group 4: DML 제한 사항 ────────────────────────────────
  {
    id: 1019, group: 4, groupTitle: 'DML 제한 사항',
    question: 'GROUP BY + MAX 집계 함수를 포함한 dept_sal_vu 뷰를 통해 DELETE를 시도하고 결과를 확인하시오.',
    sql: `CREATE OR REPLACE VIEW dept_sal_vu AS
SELECT department_id, MAX(salary) max_sal
FROM   employees GROUP BY department_id;

DELETE FROM dept_sal_vu WHERE department_id = 80;`,
    result: 'ORA-01732: data manipulation operation not legal on this view',
    keyPoint: 'GROUP BY + 집계 함수가 있는 복합 뷰에서 DML 불가. ORA-01732 오류.',
  },
  {
    id: 1020, group: 4, groupTitle: 'DML 제한 사항',
    question: '표현식 열(salary*12)이 포함된 emp_expr_vu 뷰에서 INSERT를 시도하고 결과를 확인하시오.',
    sql: `CREATE OR REPLACE VIEW emp_expr_vu AS
SELECT employee_id, last_name, salary * 12 annual_sal
FROM   employees;

INSERT INTO emp_expr_vu VALUES (600, 'Kim', 96000);`,
    result: 'ORA-01733: virtual column not allowed here',
    keyPoint: '표현식(virtual) 열에 직접 값을 삽입할 수 없어 ORA-01733 오류 발생.',
  },
  {
    id: 1021, group: 4, groupTitle: 'DML 제한 사항',
    question: '단순 뷰 emp_simple_vu(부서 10,20,30 직원)에서 UPDATE, DELETE, INSERT를 각각 시도하고 성공/실패를 확인하시오. 작업 후 ROLLBACK.',
    sql: `CREATE OR REPLACE VIEW emp_simple_vu AS
SELECT employee_id, last_name, salary, department_id
FROM   employees WHERE department_id IN (10, 20, 30);

UPDATE emp_simple_vu SET salary = 7000 WHERE employee_id = 200;   -- 성공
DELETE FROM emp_simple_vu WHERE employee_id = 200;                 -- 성공
INSERT INTO emp_simple_vu (employee_id, last_name, email, hire_date, job_id, department_id)
VALUES (601, 'Test', 'TEST', SYSDATE, 'AD_ASST', 10);             -- 성공
ROLLBACK;`,
    result: 'UPDATE 1 row, DELETE 1 row, INSERT 1 row 모두 성공. 단순 뷰에서 DML 가능.',
    keyPoint: '단순 뷰(1개 테이블, 함수/그룹/표현식 없음)에서는 DML 가능.',
  },
  {
    id: 1022, group: 4, groupTitle: 'DML 제한 사항',
    question: 'DISTINCT를 포함한 distinct_dept_vu 뷰에서 DELETE를 시도하고 결과를 확인하시오.',
    sql: `CREATE OR REPLACE VIEW distinct_dept_vu AS
SELECT DISTINCT department_id FROM employees;

DELETE FROM distinct_dept_vu WHERE department_id = 80;`,
    result: 'ORA-01732: data manipulation operation not legal on this view',
    keyPoint: 'DISTINCT 포함 뷰에서는 특정 행 식별 불가 → DML 불가.',
  },
  {
    id: 1023, group: 4, groupTitle: 'DML 제한 사항',
    question: 'ROWNUM을 포함한 top10_emp_vu 뷰에서 UPDATE를 시도하고 결과를 확인하시오.',
    sql: `CREATE OR REPLACE VIEW top10_emp_vu AS
SELECT employee_id, last_name, salary
FROM   employees WHERE ROWNUM <= 10;

UPDATE top10_emp_vu SET salary = 9999 WHERE employee_id = 100;`,
    result: 'ORA-01733: data manipulation operation not legal on this view (또는 0 rows updated)',
    keyPoint: 'ROWNUM 포함 뷰에서는 DML이 제한됨.',
  },
  {
    id: 1024, group: 4, groupTitle: 'DML 제한 사항',
    question: 'JOIN 뷰 emp_dept_join_vu에서 UPDATE와 DELETE를 시도하고 각 결과를 확인하시오.',
    sql: `CREATE OR REPLACE VIEW emp_dept_join_vu AS
SELECT e.employee_id, e.last_name, d.department_name
FROM   employees e JOIN departments d USING (department_id);

UPDATE emp_dept_join_vu SET last_name = 'NewName' WHERE employee_id = 100;
-- 키 보존 테이블(employees)의 열이므로 UPDATE 가능

DELETE FROM emp_dept_join_vu WHERE employee_id = 100;
-- ORA-01752: cannot delete from view without exactly one key-preserved table`,
    result: 'UPDATE 1 row 성공(employees.last_name 변경). DELETE ORA-01752 오류.',
    keyPoint: 'JOIN 뷰에서 UPDATE는 키 보존 테이블 열만 가능, DELETE는 기본 불가.',
  },

  // ── Group 5: 뷰 삭제 & 종합 ──────────────────────────────
  {
    id: 1025, group: 5, groupTitle: '뷰 삭제 & 종합',
    question: '뷰 기반 뷰(Nested View)를 생성하고 조회하시오. (high_sal_vu: 급여 5000 초과, dept80_high_sal_vu: high_sal_vu 기반 부서 80번)',
    sql: `CREATE VIEW high_sal_vu AS
SELECT employee_id, last_name, salary, department_id
FROM   employees WHERE salary > 5000;

CREATE VIEW dept80_high_sal_vu AS
SELECT * FROM high_sal_vu WHERE department_id = 80;

SELECT * FROM dept80_high_sal_vu;`,
    result: '부서 80번 중 급여 5000 초과 직원 목록 출력',
    keyPoint: '뷰를 기반으로 또 다른 뷰 생성 가능. 기반 뷰 삭제 시 상위 뷰가 INVALID 상태.',
  },
  {
    id: 1026, group: 5, groupTitle: '뷰 삭제 & 종합',
    question: '종합 실습: 직원 번호, 풀네임, 부서명, 직종명, 연봉(salary*12)을 포함하고 연봉 5만 이상인 보고용 뷰 emp_summary_vu를 생성하시오. (DML 차단, 부서명 기준 정렬 조회)',
    sql: `CREATE VIEW emp_summary_vu AS
SELECT e.employee_id,
       e.first_name || ' ' || e.last_name full_name,
       d.department_name,
       j.job_title,
       e.salary * 12 annual_salary
FROM   employees e
       JOIN departments d ON e.department_id = d.department_id
       JOIN jobs j         ON e.job_id        = j.job_id
WHERE  e.salary * 12 >= 50000
WITH READ ONLY;

SELECT * FROM emp_summary_vu ORDER BY department_name;`,
    result: '연봉 5만 이상 직원 목록 부서명 순 출력. WITH READ ONLY로 DML 차단.',
    keyPoint: 'WITH READ ONLY로 보고용 뷰 생성. 여러 테이블 JOIN, 표현식 열, WHERE 조건 조합.',
  },
]
