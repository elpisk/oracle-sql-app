import type { PracticeProblem } from '@/lib/types'

export const ch19Practice: PracticeProblem[] = [
  // ========== Group 1: INSERT INTO (서브쿼리) ==========
  {
    id: 1901,
    group: 1,
    groupTitle: 'INSERT INTO (서브쿼리)',
    question: 'locations 테이블에서 country_id = \'UK\'인 행만 조회하는 인라인 뷰에 새 행을 삽입하시오. (location_id=3300, city=\'Cardiff\', country_id=\'UK\')',
    sql: `INSERT INTO (
    SELECT location_id, city, country_id
    FROM   locations
    WHERE  country_id = 'UK'
)
VALUES (3300, 'Cardiff', 'UK');`,
    result: '1 row inserted.',
    keyPoint: 'INSERT INTO (subquery) VALUES — 인라인 뷰에 단일 행 삽입. 서브쿼리가 참조하는 기반 테이블(locations)에 실제 데이터가 삽입됩니다.',
  },
  {
    id: 1902,
    group: 1,
    groupTitle: 'INSERT INTO (서브쿼리)',
    question: 'departments 테이블과 locations 테이블을 조인한 인라인 뷰(location_id, city, department_name)에 새 행을 삽입하시오. (location_id=9999, city=\'TestCity\', department_name=\'Test Dept\')',
    sql: `-- 키-보존 테이블이 아닌 조인 뷰는 삽입 불가
-- 대신 기반 테이블에 직접 삽입
INSERT INTO locations (location_id, city, country_id)
VALUES (9999, 'TestCity', 'US');`,
    result: '1 row inserted.',
    keyPoint: 'INSERT INTO (subquery) 에서 서브쿼리에 조인이 포함되면 key-preserved table이 아닐 수 있어 삽입이 불가합니다. 기반 테이블에 직접 삽입합니다.',
  },
  {
    id: 1903,
    group: 1,
    groupTitle: 'INSERT INTO (서브쿼리)',
    question: 'INSERT INTO ... SELECT를 사용하여 employees 테이블에서 department_id = 80인 직원들을 emp_backup 테이블에 복사하시오.',
    sql: `INSERT INTO emp_backup
SELECT employee_id, last_name, salary, department_id
FROM   employees
WHERE  department_id = 80;`,
    result: '34 rows inserted.',
    keyPoint: 'INSERT INTO ... SELECT — 서브쿼리 결과(다중 행)를 대상 테이블에 한 번에 삽입합니다.',
  },
  {
    id: 1904,
    group: 1,
    groupTitle: 'INSERT INTO (서브쿼리)',
    question: 'CTAS(CREATE TABLE AS SELECT)를 사용하여 employees의 구조와 데이터를 모두 복사한 emp_copy 테이블을 생성하시오.',
    sql: `CREATE TABLE emp_copy AS
SELECT * FROM employees;`,
    result: 'Table created.',
    keyPoint: 'CTAS: 테이블 구조 + 데이터를 한 번에 복사합니다. 단, PRIMARY KEY, FOREIGN KEY 등 제약 조건은 복사되지 않습니다.',
  },
  {
    id: 1905,
    group: 1,
    groupTitle: 'INSERT INTO (서브쿼리)',
    question: 'employees 테이블에서 salary가 부서 평균 급여를 초과하는 직원들을 high_earners 테이블에 삽입하시오.',
    sql: `INSERT INTO high_earners (employee_id, last_name, salary, department_id)
SELECT e.employee_id, e.last_name, e.salary, e.department_id
FROM   employees e
WHERE  e.salary > (
    SELECT AVG(salary)
    FROM   employees
    WHERE  department_id = e.department_id
);`,
    result: 'N rows inserted.',
    keyPoint: 'INSERT INTO ... SELECT와 상관 서브쿼리를 결합하여 부서별 평균 초과 직원을 선별 삽입합니다.',
  },
  {
    id: 1906,
    group: 1,
    groupTitle: 'INSERT INTO (서브쿼리)',
    question: 'employees 테이블에서 현재 재직 중인 직원(job_history에 없는 직원)을 current_emp 테이블에 복사하시오.',
    sql: `INSERT INTO current_emp (employee_id, last_name, hire_date)
SELECT employee_id, last_name, hire_date
FROM   employees e
WHERE  NOT EXISTS (
    SELECT NULL FROM job_history jh
    WHERE  jh.employee_id = e.employee_id
);`,
    result: 'N rows inserted.',
    keyPoint: 'INSERT INTO ... SELECT에 NOT EXISTS 서브쿼리를 결합하여 조건에 맞는 행만 선별 삽입합니다.',
  },
  // ========== Group 2: WITH CHECK OPTION ==========
  {
    id: 1907,
    group: 2,
    groupTitle: 'WITH CHECK OPTION',
    question: 'locations 테이블에서 country_id = \'UK\'인 인라인 뷰에 WITH CHECK OPTION을 추가하고, country_id = \'UK\'인 새 행을 삽입하시오.',
    sql: `INSERT INTO (
    SELECT location_id, city, country_id
    FROM   locations
    WHERE  country_id = 'UK'
    WITH CHECK OPTION
)
VALUES (3400, 'Liverpool', 'UK');`,
    result: '1 row inserted.',
    keyPoint: "WITH CHECK OPTION: 삽입할 country_id='UK'가 서브쿼리 조건을 만족하므로 삽입이 성공합니다.",
  },
  {
    id: 1908,
    group: 2,
    groupTitle: 'WITH CHECK OPTION',
    question: 'WITH CHECK OPTION이 설정된 인라인 뷰에 조건을 위반하는 행(country_id=\'US\')을 삽입하여 발생하는 오류를 확인하시오.',
    sql: `-- 이 구문은 ORA-01402 오류를 발생시킵니다
INSERT INTO (
    SELECT location_id, city, country_id
    FROM   locations
    WHERE  country_id = 'UK'
    WITH CHECK OPTION
)
VALUES (9000, 'New York', 'US');
-- ORA-01402: view WITH CHECK OPTION where-clause violation`,
    result: 'ORA-01402: view WITH CHECK OPTION where-clause violation',
    keyPoint: "WITH CHECK OPTION: country_id='US'는 WHERE country_id='UK' 조건을 위반하므로 ORA-01402 오류가 발생합니다.",
  },
  {
    id: 1909,
    group: 2,
    groupTitle: 'WITH CHECK OPTION',
    question: 'UPDATE 문에도 WITH CHECK OPTION 인라인 뷰를 사용하여 country_id = \'UK\'인 location의 city를 변경하시오.',
    sql: `UPDATE (
    SELECT location_id, city, country_id
    FROM   locations
    WHERE  country_id = 'UK'
    WITH CHECK OPTION
)
SET city = 'Edinburgh'
WHERE location_id = 2500;`,
    result: '1 row updated.',
    keyPoint: "WITH CHECK OPTION은 UPDATE에서도 작동합니다. city 변경 후에도 country_id='UK'가 유지되므로 조건을 위반하지 않아 정상 실행됩니다.",
  },
  {
    id: 1910,
    group: 2,
    groupTitle: 'WITH CHECK OPTION',
    question: 'employees 테이블에서 department_id = 80인 인라인 뷰에 WITH CHECK OPTION을 추가하고, department_id = 90인 새 직원을 삽입 시도하시오.',
    sql: `-- 이 구문은 ORA-01402 오류를 발생시킵니다
INSERT INTO (
    SELECT employee_id, first_name, last_name, department_id
    FROM   employees
    WHERE  department_id = 80
    WITH CHECK OPTION
)
VALUES (300, 'John', 'Doe', 90);
-- ORA-01402: department_id=90 은 department_id=80 조건 위반`,
    result: 'ORA-01402: view WITH CHECK OPTION where-clause violation',
    keyPoint: 'WITH CHECK OPTION은 DML 실행 후 서브쿼리 조건을 위반하는 데이터 변경을 차단하는 데이터 무결성 도구입니다.',
  },
  {
    id: 1911,
    group: 2,
    groupTitle: 'WITH CHECK OPTION',
    question: 'salary > 5000인 employees 인라인 뷰에 WITH CHECK OPTION을 추가하고, salary = 3000인 새 직원 삽입 시 결과를 확인하시오.',
    sql: `-- 이 구문은 ORA-01402 오류를 발생시킵니다
INSERT INTO (
    SELECT employee_id, last_name, salary, department_id
    FROM   employees
    WHERE  salary > 5000
    WITH CHECK OPTION
)
VALUES (400, 'Smith', 3000, 80);
-- ORA-01402: salary=3000은 salary > 5000 조건 위반`,
    result: 'ORA-01402: view WITH CHECK OPTION where-clause violation',
    keyPoint: 'WITH CHECK OPTION은 숫자 비교 조건에도 적용됩니다. salary=3000은 salary > 5000 조건을 위반하므로 오류가 발생합니다.',
  },
  {
    id: 1912,
    group: 2,
    groupTitle: 'WITH CHECK OPTION',
    question: 'Europe 지역의 locations 인라인 뷰에 WITH CHECK OPTION을 적용하고, Europe 지역 국가 코드(DE)로 새 행을 삽입하시오.',
    sql: `INSERT INTO (
    SELECT location_id, city, country_id
    FROM   locations
    WHERE  country_id IN (
        SELECT country_id FROM countries c
        JOIN   regions r ON c.region_id = r.region_id
        WHERE  r.region_name = 'Europe'
    )
    WITH CHECK OPTION
)
VALUES (5000, 'Frankfurt', 'DE');`,
    result: '1 row inserted.',
    keyPoint: 'WITH CHECK OPTION은 복잡한 서브쿼리 조건(조인 포함)에도 적용됩니다. DE(독일)는 Europe 지역이므로 조건을 만족합니다.',
  },
  // ========== Group 3: 상관 UPDATE ==========
  {
    id: 1913,
    group: 3,
    groupTitle: '상관 서브쿼리 UPDATE',
    question: 'empl6 테이블의 모든 직원에 대해 departments 테이블에서 해당 부서명을 조회하여 department_name 열을 갱신하시오.',
    sql: `UPDATE empl6 e
SET    department_name = (
    SELECT department_name
    FROM   departments d
    WHERE  d.department_id = e.department_id
);`,
    result: 'N rows updated.',
    keyPoint: '상관 UPDATE: 외부 테이블(empl6)의 각 행에 대해 서브쿼리가 반복 실행되어 다른 테이블(departments)의 값으로 갱신합니다.',
  },
  {
    id: 1914,
    group: 3,
    groupTitle: '상관 서브쿼리 UPDATE',
    question: 'employees 테이블의 각 직원 급여를 소속 부서의 평균 급여로 갱신하시오.',
    sql: `UPDATE employees e
SET    salary = (
    SELECT AVG(salary)
    FROM   employees
    WHERE  department_id = e.department_id
);`,
    result: 'N rows updated.',
    keyPoint: '상관 UPDATE에서 집계 함수(AVG)를 서브쿼리에 사용하면 각 직원을 소속 부서의 통계 값으로 갱신할 수 있습니다.',
  },
  {
    id: 1915,
    group: 3,
    groupTitle: '상관 서브쿼리 UPDATE',
    question: 'employees 테이블에서 manager_id를 가진 직원의 mgr_salary 열을 해당 상관의 salary로 갱신하시오.',
    sql: `ALTER TABLE employees ADD mgr_salary NUMBER;

UPDATE employees e
SET    mgr_salary = (
    SELECT salary
    FROM   employees mgr
    WHERE  mgr.employee_id = e.manager_id
);`,
    result: 'N rows updated.',
    keyPoint: 'manager_id가 NULL인 직원(최상위 관리자)의 mgr_salary는 서브쿼리 0건 반환 → NULL로 갱신됩니다.',
  },
  {
    id: 1916,
    group: 3,
    groupTitle: '상관 서브쿼리 UPDATE',
    question: 'WITH 절(CTE)을 사용하여 부서별 최고 급여를 한 번만 집계하고, employees의 각 직원 급여를 부서 최고 급여의 110%로 갱신하시오.',
    sql: `WITH dept_max AS (
    SELECT department_id, MAX(salary) AS max_sal
    FROM   employees
    GROUP BY department_id
)
UPDATE employees e
SET    salary = (
    SELECT max_sal * 1.1
    FROM   dept_max d
    WHERE  d.department_id = e.department_id
);`,
    result: 'N rows updated.',
    keyPoint: 'WITH 절(CTE)로 집계를 한 번만 수행하면 상관 UPDATE보다 성능이 우수합니다. Oracle 19c에서 WITH 절은 DML에서도 사용 가능합니다.',
  },
  {
    id: 1917,
    group: 3,
    groupTitle: '상관 서브쿼리 UPDATE',
    question: "empl6 테이블에서 job_id가 'SA_REP'인 직원들의 commission_pct를 jobs 테이블의 max_salary / 10000으로 갱신하시오.",
    sql: `UPDATE empl6 e
SET    commission_pct = (
    SELECT j.max_salary / 10000
    FROM   jobs j
    WHERE  j.job_id = e.job_id
)
WHERE  e.job_id = 'SA_REP';`,
    result: 'N rows updated.',
    keyPoint: '상관 UPDATE에 WHERE 절을 추가하면 특정 조건의 행만 선택적으로 갱신할 수 있습니다.',
  },
  {
    id: 1918,
    group: 3,
    groupTitle: '상관 서브쿼리 UPDATE',
    question: '인라인 뷰(JOIN UPDATE)를 사용하여 employees의 급여를 소속 부서 평균 급여의 110%로 갱신하시오.',
    sql: `UPDATE (
    SELECT e.salary, d.avg_sal
    FROM   employees e
    JOIN   (SELECT department_id, AVG(salary) avg_sal
            FROM   employees
            GROUP BY department_id) d
    ON (e.department_id = d.department_id)
)
SET salary = avg_sal * 1.1;`,
    result: 'N rows updated.',
    keyPoint: '인라인 뷰 UPDATE: 집계 결과와 조인한 뷰를 UPDATE 대상으로 사용하면 상관 UPDATE보다 효율적입니다.',
  },
  // ========== Group 4: 상관 DELETE ==========
  {
    id: 1919,
    group: 4,
    groupTitle: '상관 서브쿼리 DELETE',
    question: 'empl6 테이블에서 employee_history 테이블에 이력이 존재하는 직원을 삭제하시오.',
    sql: `DELETE FROM empl6 e
WHERE  EXISTS (
    SELECT NULL
    FROM   employee_history eh
    WHERE  eh.employee_id = e.employee_id
);`,
    result: 'N rows deleted.',
    keyPoint: '상관 DELETE with EXISTS: employee_history에 이력이 있는 직원(EXISTS = TRUE)을 삭제합니다. NULL 처리가 안전합니다.',
  },
  {
    id: 1920,
    group: 4,
    groupTitle: '상관 서브쿼리 DELETE',
    question: 'departments 테이블에서 직원이 한 명도 없는 부서를 삭제하시오.',
    sql: `DELETE FROM departments d
WHERE  NOT EXISTS (
    SELECT NULL
    FROM   employees e
    WHERE  e.department_id = d.department_id
);`,
    result: 'N rows deleted.',
    keyPoint: 'NOT EXISTS: employees에 해당 department_id가 없는(직원이 없는) 부서를 삭제합니다. NULL 처리에 EXISTS가 IN보다 안전합니다.',
  },
  {
    id: 1921,
    group: 4,
    groupTitle: '상관 서브쿼리 DELETE',
    question: 'employees 테이블에서 같은 department_id를 가진 직원 중 salary가 부서 평균보다 낮은 직원을 삭제하시오.',
    sql: `DELETE FROM employees e
WHERE  salary < (
    SELECT AVG(salary)
    FROM   employees
    WHERE  department_id = e.department_id
);`,
    result: 'N rows deleted.',
    keyPoint: '상관 DELETE where절에 스칼라 서브쿼리를 사용하여 동적 기준(부서 평균)보다 낮은 행을 삭제합니다.',
  },
  {
    id: 1922,
    group: 4,
    groupTitle: '상관 서브쿼리 DELETE',
    question: 'NOT IN을 사용하여 manager 역할을 하지 않는 직원을 삭제하려 할 때 NULL 처리 문제를 해결하시오.',
    sql: `-- 문제 있는 구문 (manager_id에 NULL이 있으면 0건 삭제)
-- DELETE FROM employees WHERE employee_id NOT IN (SELECT manager_id FROM employees);

-- 올바른 구문 (NULL 제외)
DELETE FROM employees e
WHERE  NOT EXISTS (
    SELECT NULL
    FROM   employees mgr
    WHERE  mgr.manager_id = e.employee_id
);`,
    result: 'N rows deleted.',
    keyPoint: 'NOT IN은 서브쿼리 결과에 NULL이 포함되면 전체 결과가 0건이 됩니다. NOT EXISTS를 사용하면 NULL 처리가 안전합니다.',
  },
  // ========== Group 5: 종합 활용 ==========
  {
    id: 1923,
    group: 5,
    groupTitle: '종합 활용',
    question: '다음 단계로 데이터를 관리하시오: ①employees에서 부서 80 직원을 emp_temp에 복사, ②emp_temp 직원들의 급여를 부서 최고 급여로 갱신, ③평균 미만 급여 직원 삭제 후 COMMIT.',
    sql: `-- 1단계: 복사
INSERT INTO emp_temp
SELECT * FROM employees WHERE department_id = 80;

-- 2단계: 상관 UPDATE
UPDATE emp_temp e
SET    salary = (
    SELECT MAX(salary)
    FROM   employees
    WHERE  department_id = e.department_id
);

-- 3단계: 조건부 DELETE
DELETE FROM emp_temp e
WHERE  salary < (SELECT AVG(salary) FROM emp_temp);

COMMIT;`,
    result: 'Transaction committed.',
    keyPoint: 'INSERT INTO ... SELECT → 상관 UPDATE → 상관 DELETE → COMMIT 순서로 트랜잭션을 구성합니다.',
  },
  {
    id: 1924,
    group: 5,
    groupTitle: '종합 활용',
    question: 'SAVEPOINT를 활용하여 상관 UPDATE와 상관 DELETE를 수행하고, DELETE 결과가 예상과 다를 경우 SAVEPOINT 이후로 롤백하시오.',
    sql: `SAVEPOINT before_dml;

-- 상관 UPDATE
UPDATE employees e
SET    salary = salary * 1.1
WHERE  department_id = (
    SELECT department_id FROM departments WHERE department_name = 'Sales'
);

-- 상관 DELETE
DELETE FROM employees e
WHERE  EXISTS (
    SELECT NULL FROM job_history jh WHERE jh.employee_id = e.employee_id
    AND jh.end_date < SYSDATE - 365
);

-- 결과 확인 후 필요 시 롤백
-- ROLLBACK TO before_dml;
-- 또는
COMMIT;`,
    result: 'Transaction committed.',
    keyPoint: 'SAVEPOINT로 중간 상태를 저장하고 ROLLBACK TO SAVEPOINT로 특정 시점까지만 취소할 수 있습니다.',
  },
  {
    id: 1925,
    group: 5,
    groupTitle: '종합 활용',
    question: 'WITH CHECK OPTION이 있는 인라인 뷰를 통해 지역별 locations 데이터를 관리하시오. ①조건 만족 데이터 삽입, ②도시명 변경, ③직원 없는 부서 삭제를 연속으로 수행하시오.',
    sql: `-- 1. WITH CHECK OPTION 삽입 (조건 만족)
INSERT INTO (
    SELECT location_id, city, country_id
    FROM   locations WHERE country_id = 'UK'
    WITH CHECK OPTION
)
VALUES (3500, 'Bristol', 'UK');

-- 2. 상관 UPDATE (도시명 수정)
UPDATE locations l
SET    city = UPPER(city)
WHERE  country_id = 'UK'
AND    city = (SELECT city FROM locations WHERE location_id = 3500);

-- 3. 직원 없는 부서 삭제
DELETE FROM departments d
WHERE NOT EXISTS (SELECT NULL FROM employees WHERE department_id = d.department_id);

COMMIT;`,
    result: 'Transaction committed.',
    keyPoint: 'INSERT INTO (subquery) WITH CHECK OPTION, 상관 UPDATE, NOT EXISTS DELETE를 조합한 종합 데이터 관리 패턴입니다.',
  },
  {
    id: 1926,
    group: 5,
    groupTitle: '종합 활용',
    question: '서브쿼리를 이용한 DML 종합: ①job_history에 현재 직원 이력 삽입, ②부서 80번 직원 급여 부서 평균의 110%로 갱신, ③이직 경력 5년 이상 직원 삭제.',
    sql: `-- 1. INSERT INTO ... SELECT: 현재 직원 이력 삽입
INSERT INTO job_history (employee_id, start_date, end_date, job_id, department_id)
SELECT employee_id, hire_date, SYSDATE, job_id, department_id
FROM   employees
WHERE  employee_id NOT IN (SELECT DISTINCT employee_id FROM job_history);

-- 2. 상관 UPDATE: 부서 80번 직원 급여 갱신
UPDATE employees e
SET    salary = (
    SELECT AVG(salary) * 1.1
    FROM   employees
    WHERE  department_id = e.department_id
)
WHERE  department_id = 80;

-- 3. 상관 DELETE: 이직 경력 5년 이상
DELETE FROM employees e
WHERE  EXISTS (
    SELECT NULL FROM job_history jh
    WHERE  jh.employee_id = e.employee_id
    AND    (jh.end_date - jh.start_date) > 365 * 5
);

COMMIT;`,
    result: 'Transaction committed.',
    keyPoint: '서브쿼리 DML 종합 활용: NOT IN 필터 INSERT, 상관 UPDATE(집계), EXISTS 상관 DELETE를 하나의 트랜잭션으로 처리합니다.',
  },
]
