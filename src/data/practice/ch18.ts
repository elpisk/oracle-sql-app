import type { PracticeProblem } from '@/lib/types'

export const ch18Practice: PracticeProblem[] = [
  // ── Group 1: Unconditional INSERT ALL ─────────────────────
  {
    id: 1801, group: 1, groupTitle: 'Unconditional INSERT ALL',
    question: 'employee_id > 200인 직원을 sal_history(empid, hiredate, sal)와 mgr_history(empid, mgr, sal)에 동시 삽입하시오.',
    sql: `INSERT ALL
    INTO sal_history VALUES (empid, hiredate, sal)
    INTO mgr_history VALUES (empid, mgr, sal)
SELECT employee_id empid,
       hire_date   hiredate,
       salary      sal,
       manager_id  mgr
FROM   employees
WHERE  employee_id > 200;`,
    result: 'N rows inserted. (소스 행 수 × 2)',
    keyPoint: 'Unconditional INSERT ALL: 소스 각 행이 모든 INTO 절에 삽입됩니다. 소스 M행 × INTO N개 = M×N행 총 삽입.',
  },
  {
    id: 1802, group: 1, groupTitle: 'Unconditional INSERT ALL',
    question: 'employees의 모든 행을 emp_backup1과 emp_backup2에 동시 복사하시오.',
    sql: `INSERT ALL
    INTO emp_backup1 VALUES (employee_id, last_name, salary, department_id)
    INTO emp_backup2 VALUES (employee_id, last_name, salary, department_id)
SELECT employee_id, last_name, salary, department_id
FROM   employees;`,
    result: 'N rows inserted. (employees 행 수 × 2)',
    keyPoint: '같은 데이터를 두 테이블에 동시 백업. INSERT ALL은 소스를 단 한 번만 읽어 처리합니다.',
  },
  {
    id: 1803, group: 1, groupTitle: 'Unconditional INSERT ALL',
    question: 'SELECT 별칭을 사용하여 departments 데이터를 dept_log(dept_no, dept_name, log_time)에 삽입하시오. log_time은 SYSDATE로 지정하시오.',
    sql: `INSERT ALL
    INTO dept_log (dept_no, dept_name, log_time)
    VALUES        (dno, dname, logdt)
SELECT department_id   dno,
       department_name dname,
       SYSDATE         logdt
FROM   departments;`,
    result: 'N rows inserted.',
    keyPoint: 'VALUES에서 SELECT 별칭(dno, dname, logdt)으로 참조합니다. SYSDATE를 별칭으로 소스에 추가하면 INTO 절에서 활용 가능합니다.',
  },
  {
    id: 1804, group: 1, groupTitle: 'Unconditional INSERT ALL',
    question: 'employees와 departments를 JOIN하여 emp_full_info(employee_id, last_name, salary, department_name)과 dept_headcount_log(department_id, department_name)에 동시 삽입하시오.',
    sql: `INSERT ALL
    INTO emp_full_info    (employee_id, last_name, salary, department_name)
    VALUES                (empid, lname, sal, dname)
    INTO dept_headcount_log (department_id, department_name)
    VALUES                (deptid, dname)
SELECT e.employee_id   empid,
       e.last_name     lname,
       e.salary        sal,
       d.department_id deptid,
       d.department_name dname
FROM   employees   e
JOIN   departments d ON e.department_id = d.department_id;`,
    result: 'N rows inserted.',
    keyPoint: 'JOIN 결과를 소스로 사용하여 서로 다른 구조의 두 테이블에 동시 삽입. VALUES에서 필요한 열만 선택적으로 지정합니다.',
  },
  {
    id: 1805, group: 1, groupTitle: 'Unconditional INSERT ALL',
    question: '서브쿼리 소스를 사용하여 급여 > 부서 평균 급여인 직원을 high_earner_log와 dept_exception_log에 동시 삽입하시오.',
    sql: `INSERT ALL
    INTO high_earner_log    (employee_id, last_name, salary)
    VALUES                  (empid, lname, sal)
    INTO dept_exception_log (department_id, employee_id, salary)
    VALUES                  (deptid, empid, sal)
SELECT e.employee_id   empid,
       e.last_name     lname,
       e.salary        sal,
       e.department_id deptid
FROM   employees e
WHERE  e.salary > (
    SELECT AVG(salary)
    FROM   employees
    WHERE  department_id = e.department_id
);`,
    result: 'N rows inserted.',
    keyPoint: '서브쿼리(상관 서브쿼리)를 소스 SELECT의 WHERE 조건에 사용할 수 있습니다. INSERT ALL의 소스는 어떠한 SELECT도 허용합니다.',
  },
  {
    id: 1806, group: 1, groupTitle: 'Unconditional INSERT ALL',
    question: 'APPEND 힌트를 사용하여 대용량 direct-path 방식으로 employees를 emp_archive에 삽입하시오.',
    sql: `INSERT /*+ APPEND */ ALL
    INTO emp_archive (employee_id, last_name, salary, hire_date)
    VALUES           (employee_id, last_name, salary, hire_date)
SELECT employee_id, last_name, salary, hire_date
FROM   employees;

COMMIT;`,
    result: 'N rows inserted.',
    keyPoint: '/*+ APPEND */ 힌트: Direct-Path INSERT로 성능 향상. 단, 대상 테이블에 배타 잠금 발생. 대용량 배치 로드에 활용합니다.',
  },

  // ── Group 2: Conditional INSERT ALL ───────────────────────
  {
    id: 1807, group: 2, groupTitle: 'Conditional INSERT ALL',
    question: 'hire_date < 2015-01-01이면 emp_history에, commission_pct IS NOT NULL이면 emp_sales에 삽입하시오. (두 조건 모두 만족하면 양쪽 삽입)',
    sql: `INSERT ALL
    WHEN hiredate < DATE '2015-01-01' THEN
        INTO emp_history VALUES (empid, hiredate, sal)
    WHEN comm IS NOT NULL THEN
        INTO emp_sales VALUES (empid, comm, sal)
SELECT employee_id  empid,
       hire_date    hiredate,
       salary       sal,
       commission_pct comm
FROM   employees;`,
    result: 'N rows inserted.',
    keyPoint: 'Conditional INSERT ALL: 각 WHEN 조건을 독립적으로 평가. 두 조건 모두 만족하면 두 테이블에 모두 삽입됩니다.',
  },
  {
    id: 1808, group: 2, groupTitle: 'Conditional INSERT ALL',
    question: '급여 범위에 따라 세 테이블(sal_low, sal_mid, sal_high)에 분류하시오. salary < 5000: low, 5000~10000: mid, 나머지: high. INSERT ALL 사용.',
    sql: `INSERT ALL
    WHEN sal < 5000 THEN
        INTO sal_low  VALUES (empid, lname, sal)
    WHEN sal BETWEEN 5000 AND 10000 THEN
        INTO sal_mid  VALUES (empid, lname, sal)
    WHEN sal > 10000 THEN
        INTO sal_high VALUES (empid, lname, sal)
SELECT employee_id empid,
       last_name   lname,
       salary      sal
FROM   employees;`,
    result: 'N rows inserted.',
    keyPoint: 'INSERT ALL + WHEN 조건: 세 조건이 상호 배타적이므로 각 행은 하나의 테이블에만 삽입됩니다. 상호 배타적 조건에는 INSERT FIRST가 더 적합합니다.',
  },
  {
    id: 1809, group: 2, groupTitle: 'Conditional INSERT ALL',
    question: 'ELSE 절을 사용하여 특정 조건에 해당하지 않는 행을 others 테이블에 삽입하시오.',
    sql: `INSERT ALL
    WHEN sal >= 10000 THEN
        INTO high_earners VALUES (empid, lname, sal)
    WHEN dept = 50 THEN
        INTO shipping_dept VALUES (empid, lname, dept)
    ELSE
        INTO others VALUES (empid, lname, sal, dept)
SELECT employee_id empid,
       last_name   lname,
       salary      sal,
       department_id dept
FROM   employees;`,
    result: 'N rows inserted.',
    keyPoint: 'ELSE 절: 모든 WHEN 조건을 만족하지 않는 행을 others에 삽입. INSERT ALL에서도 ELSE 절 사용 가능합니다.',
  },
  {
    id: 1810, group: 2, groupTitle: 'Conditional INSERT ALL',
    question: '부서별로 부서 10번은 t_dept10, 20번은 t_dept20, 나머지는 t_other에 삽입하시오. INSERT ALL과 ELSE를 사용하시오.',
    sql: `INSERT ALL
    WHEN deptid = 10 THEN
        INTO t_dept10 VALUES (empid, lname, sal)
    WHEN deptid = 20 THEN
        INTO t_dept20 VALUES (empid, lname, sal)
    ELSE
        INTO t_other  VALUES (empid, lname, sal, deptid)
SELECT employee_id   empid,
       last_name     lname,
       salary        sal,
       department_id deptid
FROM   employees;`,
    result: 'N rows inserted.',
    keyPoint: 'WHEN deptid = 10, WHEN deptid = 20은 상호 배타적입니다. ELSE로 나머지 부서를 t_other에 삽입합니다.',
  },
  {
    id: 1811, group: 2, groupTitle: 'Conditional INSERT ALL',
    question: 'Conditional INSERT ALL에서 한 행이 두 조건을 모두 만족하는 경우 감사(audit) 테이블에도 삽입하는 패턴을 구현하시오.',
    sql: `INSERT ALL
    WHEN sal > 10000 THEN
        INTO high_sal_emp VALUES (empid, lname, sal)
    WHEN dept = 90 THEN
        INTO exec_dept_emp VALUES (empid, lname, dept)
    WHEN sal > 10000 AND dept = 90 THEN
        INTO high_sal_exec_audit VALUES (empid, lname, sal, dept)
SELECT employee_id   empid,
       last_name     lname,
       salary        sal,
       department_id dept
FROM   employees;`,
    result: 'N rows inserted.',
    keyPoint: 'INSERT ALL은 모든 WHEN 조건을 독립 평가하므로, 두 조건 모두 만족하는 행을 추가 감사 테이블에 기록하는 패턴이 가능합니다.',
  },
  {
    id: 1812, group: 2, groupTitle: 'Conditional INSERT ALL',
    question: '서브쿼리 소스에 계산 열을 추가하여 Conditional INSERT ALL로 세금 등급(tax_bracket)에 따라 삽입하시오.',
    sql: `INSERT ALL
    WHEN annual_sal < 50000 THEN
        INTO tax_low  VALUES (empid, annual_sal)
    WHEN annual_sal BETWEEN 50000 AND 100000 THEN
        INTO tax_mid  VALUES (empid, annual_sal)
    WHEN annual_sal > 100000 THEN
        INTO tax_high VALUES (empid, annual_sal)
SELECT employee_id     empid,
       salary * 12     annual_sal
FROM   employees;`,
    result: 'N rows inserted.',
    keyPoint: 'SELECT에서 salary * 12로 연봉(annual_sal)을 계산한 후 별칭으로 WHEN 조건과 VALUES에서 사용합니다.',
  },

  // ── Group 3: Conditional INSERT FIRST ─────────────────────
  {
    id: 1813, group: 3, groupTitle: 'Conditional INSERT FIRST',
    question: '급여를 세 구간으로 상호 배타적으로 분류하시오. salary < 5000: sal_low, 5000~10000: sal_mid, 나머지: sal_high. INSERT FIRST 사용.',
    sql: `INSERT FIRST
    WHEN salary < 5000 THEN
        INTO sal_low  VALUES (employee_id, last_name, salary)
    WHEN salary BETWEEN 5000 AND 10000 THEN
        INTO sal_mid  VALUES (employee_id, last_name, salary)
    ELSE
        INTO sal_high VALUES (employee_id, last_name, salary)
SELECT employee_id, last_name, salary
FROM   employees;`,
    result: 'N rows inserted. (employees 행 수와 동일)',
    keyPoint: 'INSERT FIRST + ELSE: 상호 배타적 분류의 완전한 패턴. 총 삽입 행 수 = 소스 행 수 (각 행이 하나의 테이블에만 삽입).',
  },
  {
    id: 1814, group: 3, groupTitle: 'Conditional INSERT FIRST',
    question: 'INSERT FIRST를 사용하여 salary > 10000이고 commission_pct IS NOT NULL인 직원을 올바르게 분류하시오.\n- salary > 10000: high_sal\n- commission_pct IS NOT NULL: comm_emp',
    sql: `INSERT FIRST
    WHEN salary > 10000 THEN
        INTO high_sal  VALUES (employee_id, last_name, salary)
    WHEN commission_pct IS NOT NULL THEN
        INTO comm_emp  VALUES (employee_id, last_name, commission_pct)
SELECT employee_id, last_name, salary, commission_pct
FROM   employees;`,
    result: 'N rows inserted.',
    keyPoint: 'INSERT FIRST: salary > 10000이고 커미션도 있는 직원은 high_sal에만 삽입됩니다(두 번째 조건 평가 안 함). INSERT ALL이었다면 두 테이블에 중복 삽입.',
  },
  {
    id: 1815, group: 3, groupTitle: 'Conditional INSERT FIRST',
    question: 'INSERT FIRST와 ELSE를 사용하여 고용 연도별로 분류하시오. 2010년 이전: emp_old, 2010~2019년: emp_mid, 2020년 이후: ELSE emp_new.',
    sql: `INSERT FIRST
    WHEN hire_year < 2010 THEN
        INTO emp_old VALUES (empid, lname, hire_year)
    WHEN hire_year BETWEEN 2010 AND 2019 THEN
        INTO emp_mid VALUES (empid, lname, hire_year)
    ELSE
        INTO emp_new VALUES (empid, lname, hire_year)
SELECT employee_id          empid,
       last_name             lname,
       EXTRACT(YEAR FROM hire_date) hire_year
FROM   employees;`,
    result: 'N rows inserted.',
    keyPoint: 'SELECT에서 EXTRACT로 연도를 추출하여 별칭(hire_year)으로 WHEN 조건과 VALUES에 사용합니다.',
  },
  {
    id: 1816, group: 3, groupTitle: 'Conditional INSERT FIRST',
    question: 'INSERT FIRST로 job_id 접두사에 따라 직무 테이블을 분류하시오. SA로 시작: sales_jobs, IT으로 시작: it_jobs, 나머지: other_jobs.',
    sql: `INSERT FIRST
    WHEN job_id LIKE 'SA%' THEN
        INTO sales_jobs  VALUES (employee_id, last_name, job_id)
    WHEN job_id LIKE 'IT%' THEN
        INTO it_jobs     VALUES (employee_id, last_name, job_id)
    ELSE
        INTO other_jobs  VALUES (employee_id, last_name, job_id)
SELECT employee_id, last_name, job_id
FROM   employees;`,
    result: 'N rows inserted.',
    keyPoint: 'WHEN 조건에 LIKE 패턴 사용 가능. INSERT FIRST이므로 job_id가 SA로 시작하면 sales_jobs에만 삽입됩니다.',
  },
  {
    id: 1817, group: 3, groupTitle: 'Conditional INSERT FIRST',
    question: 'INSERT FIRST와 INSERT ALL의 결과 차이를 확인하는 예제를 작성하시오. salary < 15000이고 commission_pct IS NOT NULL인 직원에 대해 각각 실행하시오.',
    sql: `-- INSERT ALL (두 조건 모두 만족 시 양쪽 삽입)
INSERT ALL
    WHEN salary < 15000 THEN
        INTO test_all_low VALUES (employee_id, salary)
    WHEN commission_pct IS NOT NULL THEN
        INTO test_all_comm VALUES (employee_id, commission_pct)
SELECT employee_id, salary, commission_pct FROM employees;

-- INSERT FIRST (첫 조건 만족 시 두 번째 조건 무시)
INSERT FIRST
    WHEN salary < 15000 THEN
        INTO test_first_low VALUES (employee_id, salary)
    WHEN commission_pct IS NOT NULL THEN
        INTO test_first_comm VALUES (employee_id, commission_pct)
SELECT employee_id, salary, commission_pct FROM employees;`,
    result: 'INSERT ALL: test_all_low + test_all_comm 합계 > employees 수. INSERT FIRST: test_first_low + test_first_comm = employees 수.',
    keyPoint: 'INSERT ALL: 두 조건 모두 만족 시 중복 삽입(총 행 수 > 소스). INSERT FIRST: 중복 없이 각 행은 한 테이블에만(총 행 수 = 소스).',
  },
  {
    id: 1818, group: 3, groupTitle: 'Conditional INSERT FIRST',
    question: '부서별 인원수에 따라 분류하시오. 소스는 집계 서브쿼리를 사용하고 INSERT FIRST로 분류하시오.',
    sql: `INSERT FIRST
    WHEN headcount >= 10 THEN
        INTO large_dept  VALUES (department_id, headcount, avg_sal)
    WHEN headcount BETWEEN 5 AND 9 THEN
        INTO medium_dept VALUES (department_id, headcount, avg_sal)
    ELSE
        INTO small_dept  VALUES (department_id, headcount, avg_sal)
SELECT department_id,
       COUNT(*)      headcount,
       AVG(salary)   avg_sal
FROM   employees
GROUP BY department_id;`,
    result: 'N rows inserted.',
    keyPoint: 'GROUP BY 집계 결과를 소스로 사용하는 INSERT FIRST. 부서를 인원수 기준으로 상호 배타적으로 세 테이블에 분류합니다.',
  },

  // ── Group 4: Pivoting INSERT ──────────────────────────────
  {
    id: 1819, group: 4, groupTitle: 'Pivoting INSERT',
    question: 'sales_source_data(employee_id, week_id, sales_mon~fri)를 sales_info(employee_id, week_id, sales)로 변환 삽입하시오.',
    sql: `INSERT ALL
    INTO sales_info VALUES (employee_id, week_id, sales_mon)
    INTO sales_info VALUES (employee_id, week_id, sales_tue)
    INTO sales_info VALUES (employee_id, week_id, sales_wed)
    INTO sales_info VALUES (employee_id, week_id, sales_thur)
    INTO sales_info VALUES (employee_id, week_id, sales_fri)
SELECT employee_id, week_id,
       sales_mon, sales_tue, sales_wed, sales_thur, sales_fri
FROM   sales_source_data;`,
    result: 'N rows inserted. (소스 행 수 × 5)',
    keyPoint: 'Pivoting INSERT: 열 기반(가로) → 행 기반(세로) 변환. 소스 1행 × INTO 5개 = 5행 삽입. 동일 테이블(sales_info)을 5번 INTO로 지정합니다.',
  },
  {
    id: 1820, group: 4, groupTitle: 'Pivoting INSERT',
    question: 'NULL 요일 데이터를 제외하는 Pivoting INSERT를 작성하시오. sales_mon IS NULL이면 해당 INTO 절은 건너뛰시오.',
    sql: `INSERT ALL
    WHEN sales_mon IS NOT NULL THEN
        INTO sales_info VALUES (employee_id, week_id, sales_mon)
    WHEN sales_tue IS NOT NULL THEN
        INTO sales_info VALUES (employee_id, week_id, sales_tue)
    WHEN sales_wed IS NOT NULL THEN
        INTO sales_info VALUES (employee_id, week_id, sales_wed)
    WHEN sales_thur IS NOT NULL THEN
        INTO sales_info VALUES (employee_id, week_id, sales_thur)
    WHEN sales_fri IS NOT NULL THEN
        INTO sales_info VALUES (employee_id, week_id, sales_fri)
SELECT employee_id, week_id,
       sales_mon, sales_tue, sales_wed, sales_thur, sales_fri
FROM   sales_source_data;`,
    result: 'N rows inserted. (NULL 열 제외한 유효 데이터만)',
    keyPoint: 'WHEN col IS NOT NULL THEN: 각 요일별 개별 조건으로 NULL 열을 건너뜁니다. Conditional INSERT ALL과 Pivoting INSERT의 조합.',
  },
  {
    id: 1821, group: 4, groupTitle: 'Pivoting INSERT',
    question: '요일 레이블을 포함한 Pivoting INSERT를 작성하시오. sales_detail(employee_id, week_id, day_name, amount)에 삽입하시오.',
    sql: `INSERT ALL
    WHEN sales_mon IS NOT NULL THEN
        INTO sales_detail VALUES (employee_id, week_id, 'MON', sales_mon)
    WHEN sales_tue IS NOT NULL THEN
        INTO sales_detail VALUES (employee_id, week_id, 'TUE', sales_tue)
    WHEN sales_wed IS NOT NULL THEN
        INTO sales_detail VALUES (employee_id, week_id, 'WED', sales_wed)
    WHEN sales_thur IS NOT NULL THEN
        INTO sales_detail VALUES (employee_id, week_id, 'THU', sales_thur)
    WHEN sales_fri IS NOT NULL THEN
        INTO sales_detail VALUES (employee_id, week_id, 'FRI', sales_fri)
SELECT employee_id, week_id,
       sales_mon, sales_tue, sales_wed, sales_thur, sales_fri
FROM   sales_source_data;`,
    result: 'N rows inserted.',
    keyPoint: 'VALUES에 리터럴 문자열(\'MON\', \'TUE\'...)을 포함하여 요일 레이블을 행으로 기록합니다. 열 기반 데이터를 레이블 포함 행 기반으로 정규화합니다.',
  },
  {
    id: 1822, group: 4, groupTitle: 'Pivoting INSERT',
    question: '분기별 실적(q1~q4) 데이터를 quarterly_sales(product_id, quarter, amount)로 Pivoting INSERT하시오.',
    sql: `INSERT ALL
    INTO quarterly_sales VALUES (product_id, 1, q1_amount)
    INTO quarterly_sales VALUES (product_id, 2, q2_amount)
    INTO quarterly_sales VALUES (product_id, 3, q3_amount)
    INTO quarterly_sales VALUES (product_id, 4, q4_amount)
SELECT product_id, q1_amount, q2_amount, q3_amount, q4_amount
FROM   annual_sales_wide;`,
    result: 'N rows inserted. (소스 행 수 × 4)',
    keyPoint: '분기 번호(1, 2, 3, 4)를 리터럴로 지정하여 열 기반 분기 데이터를 행 기반으로 변환합니다.',
  },

  // ── Group 5: 종합 활용 ────────────────────────────────────
  {
    id: 1823, group: 5, groupTitle: '종합 활용',
    question: 'INSERT ALL과 INSERT FIRST를 모두 사용하여 employees 데이터를 처리하시오.\n① INSERT ALL로 전체 직원을 emp_all과 active_log에 동시 삽입\n② INSERT FIRST로 급여 구간별 분류',
    sql: `-- ① INSERT ALL: 전체를 두 테이블에 동시 삽입
INSERT ALL
    INTO emp_all   VALUES (employee_id, last_name, salary)
    INTO active_log VALUES (employee_id, SYSDATE)
SELECT employee_id, last_name, salary
FROM   employees;

-- ② INSERT FIRST: 급여 구간 상호 배타적 분류
INSERT FIRST
    WHEN salary < 5000 THEN
        INTO sal_low  VALUES (employee_id, last_name, salary)
    WHEN salary < 10000 THEN
        INTO sal_mid  VALUES (employee_id, last_name, salary)
    ELSE
        INTO sal_high VALUES (employee_id, last_name, salary)
SELECT employee_id, last_name, salary
FROM   employees;`,
    result: '①: employees 수 × 2행 삽입. ②: employees 수와 동일한 행 수 삽입.',
    keyPoint: '①INSERT ALL: 동시 복제/로깅 패턴. ②INSERT FIRST: 상호 배타적 급여 분류. 두 유형의 적합한 사용 사례를 구분합니다.',
  },
  {
    id: 1824, group: 5, groupTitle: '종합 활용',
    question: 'ETL 파이프라인을 구현하시오: orders_stg(주문 스테이징)에서 ①amount > 10000: large_orders ②status=\'PENDING\': pending_orders ③NULL이 아닌 요일별 주문: daily_breakdown(order_id, day_name, amount) (Pivoting)',
    sql: `-- ① + ②: Conditional INSERT ALL
INSERT ALL
    WHEN amount > 10000 THEN
        INTO large_orders   VALUES (order_id, amount, order_date)
    WHEN status = 'PENDING' THEN
        INTO pending_orders VALUES (order_id, status, order_date)
SELECT order_id, amount, status, order_date
FROM   orders_stg;

-- ③: Pivoting INSERT
INSERT ALL
    WHEN mon_amt IS NOT NULL THEN
        INTO daily_breakdown VALUES (order_id, 'MON', mon_amt)
    WHEN tue_amt IS NOT NULL THEN
        INTO daily_breakdown VALUES (order_id, 'TUE', tue_amt)
    WHEN wed_amt IS NOT NULL THEN
        INTO daily_breakdown VALUES (order_id, 'WED', wed_amt)
SELECT order_id, mon_amt, tue_amt, wed_amt
FROM   orders_stg;`,
    result: 'N rows inserted (각 INSERT ALL 실행).',
    keyPoint: '다중 테이블 INSERT를 목적에 따라 분리: ①②Conditional INSERT ALL, ③Pivoting INSERT. ETL의 다양한 패턴을 조합합니다.',
  },
  {
    id: 1825, group: 5, groupTitle: '종합 활용',
    question: '소스 집계 + INSERT FIRST + COMMIT을 포함한 완전한 배치 처리를 구현하시오. 부서별 평균급여에 따라 세 등급 테이블로 분류하시오.',
    sql: `INSERT FIRST
    WHEN avg_sal >= 10000 THEN
        INTO high_avg_dept  (department_id, dept_name, avg_sal)
        VALUES              (deptid, dname, avg_sal)
    WHEN avg_sal BETWEEN 5000 AND 9999 THEN
        INTO mid_avg_dept   (department_id, dept_name, avg_sal)
        VALUES              (deptid, dname, avg_sal)
    ELSE
        INTO low_avg_dept   (department_id, dept_name, avg_sal)
        VALUES              (deptid, dname, avg_sal)
SELECT d.department_id            deptid,
       d.department_name          dname,
       ROUND(AVG(e.salary), 0)    avg_sal
FROM   employees   e
JOIN   departments d ON e.department_id = d.department_id
GROUP BY d.department_id, d.department_name;

COMMIT;`,
    result: 'N rows inserted.',
    keyPoint: 'GROUP BY 집계 소스 + JOIN + INSERT FIRST + COMMIT: 완전한 배치 처리 패턴. 부서를 평균급여 기준으로 상호 배타적으로 등급화합니다.',
  },
  {
    id: 1826, group: 5, groupTitle: '종합 활용',
    question: '다음 전체 흐름을 구현하시오: ①employees 전체를 emp_log에 백업(INSERT ALL) ②급여 > 15000인 경우 audit_high_sal에도 기록 ③Pivoting으로 부서별 분기 실적(dept_q1~q4)을 dept_quarterly_fact에 삽입',
    sql: `-- ①② Unconditional + Conditional INSERT ALL
INSERT ALL
    INTO emp_log            VALUES (employee_id, last_name, salary, SYSDATE)
    WHEN salary > 15000 THEN
        INTO audit_high_sal VALUES (employee_id, salary, SYSDATE)
SELECT employee_id, last_name, salary
FROM   employees;

-- ③ Pivoting INSERT (부서별 분기 실적)
INSERT ALL
    INTO dept_quarterly_fact VALUES (dept_id, 'Q1', q1_sales)
    INTO dept_quarterly_fact VALUES (dept_id, 'Q2', q2_sales)
    INTO dept_quarterly_fact VALUES (dept_id, 'Q3', q3_sales)
    INTO dept_quarterly_fact VALUES (dept_id, 'Q4', q4_sales)
SELECT department_id dept_id,
       q1_sales, q2_sales, q3_sales, q4_sales
FROM   dept_quarterly_src;

COMMIT;`,
    result: '①② N rows inserted. ③ M rows inserted.',
    keyPoint: 'INSERT ALL에서 WHEN 없는 INTO와 WHEN 있는 INTO를 혼합할 수 있습니다. ①emp_log: 항상 삽입. ②audit_high_sal: 조건부 삽입. ③Pivoting: 열→행 변환.',
  },
]
