import type { PracticeProblem } from '@/lib/types'

export const ch17Practice: PracticeProblem[] = [
  // ── Group 1: MERGE 기본 구문 ──────────────────────────────
  {
    id: 1701, group: 1, groupTitle: 'MERGE 기본 구문',
    question: 'copy_emp 테이블을 employees로 동기화하시오. 일치하는 행은 salary를 업데이트하고, 없는 행은 모든 열을 삽입하시오.',
    sql: `MERGE INTO copy_emp c
USING employees e
ON    (c.employee_id = e.employee_id)
WHEN MATCHED THEN
  UPDATE SET c.salary = e.salary
WHEN NOT MATCHED THEN
  INSERT VALUES (e.employee_id, e.first_name, e.last_name,
                e.email, e.phone_number, e.hire_date, e.job_id,
                e.salary, e.commission_pct, e.manager_id,
                e.department_id);`,
    result: 'N rows merged.',
    keyPoint: 'MERGE INTO 대상 USING 소스 ON 조인조건 WHEN MATCHED THEN UPDATE SET WHEN NOT MATCHED THEN INSERT — UPSERT 기본 패턴.',
  },
  {
    id: 1702, group: 1, groupTitle: 'MERGE 기본 구문',
    question: 'copy_dept 테이블에 departments의 데이터를 병합하시오. 일치하면 department_name을 업데이트하고, 없으면 삽입하시오.',
    sql: `MERGE INTO copy_dept cd
USING departments d
ON    (cd.department_id = d.department_id)
WHEN MATCHED THEN
  UPDATE SET cd.department_name = d.department_name
WHEN NOT MATCHED THEN
  INSERT (department_id, department_name)
  VALUES (d.department_id, d.department_name);`,
    result: 'N rows merged.',
    keyPoint: 'INSERT 절에 열 목록을 명시적으로 지정할 수 있습니다. 모든 열이 아닌 특정 열만 삽입할 때 유용합니다.',
  },
  {
    id: 1703, group: 1, groupTitle: 'MERGE 기본 구문',
    question: 'WHEN MATCHED THEN만 사용하여 copy_emp의 salary를 employees로 업데이트하시오. (삽입 없음)',
    sql: `MERGE INTO copy_emp c
USING employees e
ON    (c.employee_id = e.employee_id)
WHEN MATCHED THEN
  UPDATE SET c.salary      = e.salary,
             c.job_id      = e.job_id,
             c.department_id = e.department_id;`,
    result: 'N rows merged.',
    keyPoint: 'WHEN MATCHED THEN만 사용하면 일치하는 행만 UPDATE하고 없는 행은 건너뜁니다. WHEN NOT MATCHED는 선택적입니다.',
  },
  {
    id: 1704, group: 1, groupTitle: 'MERGE 기본 구문',
    question: 'WHEN NOT MATCHED THEN만 사용하여 copy_emp에 없는 employees 행만 삽입하시오. (이미 있는 행은 무시)',
    sql: `MERGE INTO copy_emp c
USING employees e
ON    (c.employee_id = e.employee_id)
WHEN NOT MATCHED THEN
  INSERT (employee_id, last_name, salary)
  VALUES (e.employee_id, e.last_name, e.salary);`,
    result: 'N rows merged.',
    keyPoint: 'WHEN NOT MATCHED THEN만 사용하면 "없으면 삽입, 있으면 무시"를 구현합니다. 중복 방지 삽입 패턴에 활용됩니다.',
  },
  {
    id: 1705, group: 1, groupTitle: 'MERGE 기본 구문',
    question: '서브쿼리를 소스로 사용하여 급여가 5000 초과인 employees만 copy_emp에 병합하시오.',
    sql: `MERGE INTO copy_emp c
USING (
  SELECT employee_id, last_name, salary, department_id
  FROM   employees
  WHERE  salary > 5000
) e
ON    (c.employee_id = e.employee_id)
WHEN MATCHED THEN
  UPDATE SET c.salary = e.salary
WHEN NOT MATCHED THEN
  INSERT (employee_id, last_name, salary, department_id)
  VALUES (e.employee_id, e.last_name, e.salary, e.department_id);`,
    result: 'N rows merged.',
    keyPoint: 'USING 절에 서브쿼리(인라인 뷰)를 소스로 사용할 수 있습니다. WHERE로 소스 데이터를 미리 필터링합니다.',
  },
  {
    id: 1706, group: 1, groupTitle: 'MERGE 기본 구문',
    question: '복합 조인 조건(employee_id AND department_id)으로 copy_emp를 employees에 병합하시오.',
    sql: `MERGE INTO copy_emp c
USING employees e
ON    (c.employee_id = e.employee_id AND c.department_id = e.department_id)
WHEN MATCHED THEN
  UPDATE SET c.salary = e.salary
WHEN NOT MATCHED THEN
  INSERT (employee_id, last_name, salary, department_id)
  VALUES (e.employee_id, e.last_name, e.salary, e.department_id);`,
    result: 'N rows merged.',
    keyPoint: 'ON 절에 AND로 복합 조인 조건 사용 가능. 전체 ON 조건은 괄호로 감싸야 합니다.',
  },

  // ── Group 2: MERGE 응용 (WHERE, UPDATE 필터) ─────────────
  {
    id: 1707, group: 2, groupTitle: 'MERGE 응용 (WHERE 필터)',
    question: 'WHEN MATCHED THEN UPDATE에 WHERE 필터를 추가하여 salary가 10000 초과인 행만 업데이트하시오.',
    sql: `MERGE INTO copy_emp c
USING employees e
ON    (c.employee_id = e.employee_id)
WHEN MATCHED THEN
  UPDATE SET c.salary = e.salary
  WHERE  e.salary > 10000;`,
    result: 'N rows merged.',
    keyPoint: 'WHEN MATCHED THEN UPDATE SET ... WHERE 조건: 일치하는 행 중 WHERE 조건을 만족하는 행만 UPDATE합니다.',
  },
  {
    id: 1708, group: 2, groupTitle: 'MERGE 응용 (WHERE 필터)',
    question: 'WHEN NOT MATCHED THEN INSERT에 WHERE 필터를 추가하여 department_id=50인 행만 삽입하시오.',
    sql: `MERGE INTO copy_emp c
USING employees e
ON    (c.employee_id = e.employee_id)
WHEN NOT MATCHED THEN
  INSERT (employee_id, last_name, salary, department_id)
  VALUES (e.employee_id, e.last_name, e.salary, e.department_id)
  WHERE  e.department_id = 50;`,
    result: 'N rows merged.',
    keyPoint: 'WHEN NOT MATCHED THEN INSERT ... WHERE 조건: NOT MATCHED된 행 중 WHERE 조건을 만족하는 행만 삽입합니다.',
  },
  {
    id: 1709, group: 2, groupTitle: 'MERGE 응용 (WHERE 필터)',
    question: '서브쿼리를 소스로, UPDATE WHERE와 INSERT WHERE를 모두 사용하여 정교한 MERGE를 수행하시오.',
    sql: `MERGE INTO copy_emp c
USING (
  SELECT employee_id, last_name, salary, hire_date, department_id
  FROM   employees
) e
ON    (c.employee_id = e.employee_id)
WHEN MATCHED THEN
  UPDATE SET c.salary = e.salary
  WHERE  e.hire_date < DATE '2005-01-01'
WHEN NOT MATCHED THEN
  INSERT (employee_id, last_name, salary, department_id)
  VALUES (e.employee_id, e.last_name, e.salary, e.department_id)
  WHERE  e.department_id IS NOT NULL;`,
    result: 'N rows merged.',
    keyPoint: 'UPDATE WHERE와 INSERT WHERE를 동시에 사용하여 각각 다른 조건으로 필터링할 수 있습니다.',
  },
  {
    id: 1710, group: 2, groupTitle: 'MERGE 응용 (WHERE 필터)',
    question: 'product_prices 테이블을 new_prices 소스와 병합하시오. 가격이 다른 경우만 업데이트하고, 없는 제품은 추가하시오.',
    sql: `MERGE INTO product_prices pp
USING new_prices np
ON    (pp.product_id = np.product_id)
WHEN MATCHED THEN
  UPDATE SET pp.price = np.price
  WHERE  pp.price <> np.price
WHEN NOT MATCHED THEN
  INSERT (product_id, product_name, price)
  VALUES (np.product_id, np.product_name, np.price);`,
    result: 'N rows merged.',
    keyPoint: 'UPDATE WHERE pp.price <> np.price: 실제로 값이 다를 때만 업데이트. 불필요한 UPDATE를 방지하여 성능 향상 및 로그 최소화.',
  },
  {
    id: 1711, group: 2, groupTitle: 'MERGE 응용 (WHERE 필터)',
    question: 'dept_summary 테이블에 부서별 직원 수와 평균 급여를 집계하여 MERGE로 동기화하시오.',
    sql: `MERGE INTO dept_summary ds
USING (
  SELECT department_id,
         COUNT(*)      AS emp_cnt,
         AVG(salary)   AS avg_sal
  FROM   employees
  GROUP BY department_id
) src
ON    (ds.department_id = src.department_id)
WHEN MATCHED THEN
  UPDATE SET ds.emp_cnt = src.emp_cnt,
             ds.avg_sal = src.avg_sal
WHEN NOT MATCHED THEN
  INSERT (department_id, emp_cnt, avg_sal)
  VALUES (src.department_id, src.emp_cnt, src.avg_sal);`,
    result: 'N rows merged.',
    keyPoint: 'USING 서브쿼리에서 GROUP BY 집계 결과를 소스로 사용. 요약 테이블(Summary Table) 증분 갱신에 전형적인 패턴.',
  },
  {
    id: 1712, group: 2, groupTitle: 'MERGE 응용 (WHERE 필터)',
    question: 'employees JOIN departments의 결과를 소스로 사용하여 emp_dept_info 테이블을 MERGE하시오.',
    sql: `MERGE INTO emp_dept_info edi
USING (
  SELECT e.employee_id,
         e.last_name,
         e.salary,
         d.department_name
  FROM   employees e
  JOIN   departments d ON e.department_id = d.department_id
) src
ON    (edi.employee_id = src.employee_id)
WHEN MATCHED THEN
  UPDATE SET edi.salary          = src.salary,
             edi.department_name = src.department_name
WHEN NOT MATCHED THEN
  INSERT (employee_id, last_name, salary, department_name)
  VALUES (src.employee_id, src.last_name, src.salary, src.department_name);`,
    result: 'N rows merged.',
    keyPoint: 'USING 절 서브쿼리에 JOIN을 포함하여 복수 테이블을 소스로 활용할 수 있습니다.',
  },

  // ── Group 3: MERGE DELETE WHERE ──────────────────────────
  {
    id: 1713, group: 3, groupTitle: 'MERGE DELETE WHERE',
    question: 'copy_emp3를 employees와 동기화하되, 커미션이 있는 직원(commission_pct IS NOT NULL)은 UPDATE 후 삭제하시오.',
    sql: `MERGE INTO copy_emp3 c
USING (SELECT * FROM employees) e
ON    (c.employee_id = e.employee_id)
WHEN MATCHED THEN
  UPDATE SET
      c.first_name    = e.first_name,
      c.last_name     = e.last_name,
      c.salary        = e.salary,
      c.department_id = e.department_id
  DELETE WHERE (e.commission_pct IS NOT NULL)
WHEN NOT MATCHED THEN
  INSERT VALUES (e.employee_id, e.first_name, e.last_name,
                e.email, e.phone_number, e.hire_date, e.job_id,
                e.salary, e.commission_pct, e.manager_id,
                e.department_id);`,
    result: 'N rows merged.',
    keyPoint: 'DELETE WHERE: UPDATE 후 조건을 만족하는 행을 추가 삭제. Oracle DML Trigger 발화: UPDATE 트리거 → DELETE 트리거 순.',
  },
  {
    id: 1714, group: 3, groupTitle: 'MERGE DELETE WHERE',
    question: 'copy_dept에 departments를 병합하되, budget > 900인 행은 UPDATE 후 삭제하시오.',
    sql: `MERGE INTO copy_dept cd
USING departments d
ON    (cd.department_id = d.department_id)
WHEN MATCHED THEN
  UPDATE SET cd.budget = d.budget
  DELETE WHERE cd.budget > 900
WHEN NOT MATCHED THEN
  INSERT VALUES (d.department_id, d.budget);`,
    result: 'N rows merged.',
    keyPoint: 'DELETE WHERE는 UPDATE 이후의 값 기준이 아닌 소스/대상 행의 값을 기준으로 조건을 평가합니다.',
  },
  {
    id: 1715, group: 3, groupTitle: 'MERGE DELETE WHERE',
    question: 'target 테이블에서 소스의 status가 INACTIVE인 매칭 행을 UPDATE 후 삭제하고, ACTIVE인 새 행만 삽입하시오.',
    sql: `MERGE INTO target t
USING source s
ON    (t.id = s.id)
WHEN MATCHED THEN
  UPDATE SET t.val    = s.val,
             t.status = s.status
  DELETE WHERE s.status = 'INACTIVE'
WHEN NOT MATCHED THEN
  INSERT (id, val, status)
  VALUES (s.id, s.val, s.status)
  WHERE  s.status = 'ACTIVE';`,
    result: 'N rows merged.',
    keyPoint: 'DELETE WHERE + INSERT WHERE 조합: INACTIVE인 기존 행은 UPDATE 후 삭제, ACTIVE인 새 행만 삽입하여 활성 데이터만 유지.',
  },
  {
    id: 1716, group: 3, groupTitle: 'MERGE DELETE WHERE',
    question: '재고 테이블(inventory)을 갱신하되, 재고량(quantity)이 0이 된 제품은 제거하시오.',
    sql: `MERGE INTO inventory inv
USING daily_updates upd
ON    (inv.product_id = upd.product_id)
WHEN MATCHED THEN
  UPDATE SET inv.quantity = inv.quantity + upd.delta
  DELETE WHERE inv.quantity <= 0
WHEN NOT MATCHED THEN
  INSERT (product_id, product_name, quantity)
  VALUES (upd.product_id, upd.product_name, upd.delta)
  WHERE  upd.delta > 0;`,
    result: 'N rows merged.',
    keyPoint: 'DELETE WHERE inv.quantity <= 0: 재고 업데이트 후 재고가 0 이하가 된 행 삭제. 재고 관리 테이블의 실무 패턴.',
  },
  {
    id: 1717, group: 3, groupTitle: 'MERGE DELETE WHERE',
    question: 'UPDATE WHERE와 DELETE WHERE를 함께 사용하여 salary > 8000이고 commission_pct IS NOT NULL인 행만 업데이트 후 삭제하시오.',
    sql: `MERGE INTO copy_emp c
USING employees e
ON    (c.employee_id = e.employee_id)
WHEN MATCHED THEN
  UPDATE SET c.salary        = e.salary,
             c.commission_pct = e.commission_pct
  WHERE  e.salary > 8000
  DELETE WHERE c.commission_pct IS NOT NULL;`,
    result: 'N rows merged.',
    keyPoint: 'UPDATE WHERE로 업데이트 대상을 제한한 후, DELETE WHERE로 그 중 추가 조건을 만족하는 행을 삭제. UPDATE → DELETE 순서.',
  },
  {
    id: 1718, group: 3, groupTitle: 'MERGE DELETE WHERE',
    question: '서브쿼리 소스를 사용하여 과거 주문(90일 이전)은 copy_orders에서 삭제하고, 최근 주문은 업데이트하시오.',
    sql: `MERGE INTO copy_orders co
USING (
  SELECT order_id, order_date, amount, status
  FROM   orders
) o
ON    (co.order_id = o.order_id)
WHEN MATCHED THEN
  UPDATE SET co.amount = o.amount,
             co.status = o.status
  DELETE WHERE o.order_date < SYSDATE - 90
WHEN NOT MATCHED THEN
  INSERT (order_id, order_date, amount, status)
  VALUES (o.order_id, o.order_date, o.amount, o.status);`,
    result: 'N rows merged.',
    keyPoint: 'DELETE WHERE를 사용하여 90일 이전 주문을 업데이트 후 삭제. 이력 보관 기간 관리(data archiving) 패턴.',
  },

  // ── Group 4: MERGE 실전 응용 ──────────────────────────────
  {
    id: 1719, group: 4, groupTitle: 'MERGE 실전 응용',
    question: '스테이징 테이블(staging_emp)의 데이터를 employees에 병합하시오. 단, ON 절 컬럼(employee_id)은 UPDATE하지 않도록 주의하시오.',
    sql: `MERGE INTO employees e
USING staging_emp s
ON    (e.employee_id = s.employee_id)
WHEN MATCHED THEN
  UPDATE SET e.last_name  = s.last_name,
             e.salary     = s.salary,
             e.job_id     = s.job_id
  -- e.employee_id = s.employee_id 는 ORA-38104 오류 발생 → 제외
WHEN NOT MATCHED THEN
  INSERT (employee_id, last_name, salary, job_id, hire_date)
  VALUES (s.employee_id, s.last_name, s.salary, s.job_id, SYSDATE);`,
    result: 'N rows merged.',
    keyPoint: 'ON 절 조인 컬럼(employee_id)은 UPDATE SET에서 수정 불가(ORA-38104). 다른 열만 UPDATE 대상으로 지정해야 합니다.',
  },
  {
    id: 1720, group: 4, groupTitle: 'MERGE 실전 응용',
    question: '부서별 급여 요약 테이블(salary_summary)을 실시간 employees 데이터로 증분 갱신하시오.',
    sql: `MERGE INTO salary_summary ss
USING (
  SELECT department_id,
         COUNT(*)         AS headcount,
         SUM(salary)      AS total_salary,
         MAX(salary)      AS max_salary,
         MIN(salary)      AS min_salary
  FROM   employees
  GROUP BY department_id
) src
ON    (ss.department_id = src.department_id)
WHEN MATCHED THEN
  UPDATE SET ss.headcount    = src.headcount,
             ss.total_salary = src.total_salary,
             ss.max_salary   = src.max_salary,
             ss.min_salary   = src.min_salary
WHEN NOT MATCHED THEN
  INSERT (department_id, headcount, total_salary, max_salary, min_salary)
  VALUES (src.department_id, src.headcount, src.total_salary, src.max_salary, src.min_salary);`,
    result: 'N rows merged.',
    keyPoint: 'USING 서브쿼리에서 GROUP BY 집계 후 MERGE로 요약 테이블 갱신. ETL 증분 로드(Incremental Load)의 전형적인 패턴.',
  },
  {
    id: 1721, group: 4, groupTitle: 'MERGE 실전 응용',
    question: '고객 테이블(customers)을 외부 데이터(ext_customers)와 동기화하되, 비활성 고객(status=\'INACTIVE\')은 삭제하고 새 고객만 삽입하시오.',
    sql: `MERGE INTO customers c
USING ext_customers ec
ON    (c.customer_id = ec.customer_id)
WHEN MATCHED THEN
  UPDATE SET c.name   = ec.name,
             c.email  = ec.email,
             c.status = ec.status
  DELETE WHERE ec.status = 'INACTIVE'
WHEN NOT MATCHED THEN
  INSERT (customer_id, name, email, status)
  VALUES (ec.customer_id, ec.name, ec.email, ec.status)
  WHERE  ec.status <> 'INACTIVE';`,
    result: 'N rows merged.',
    keyPoint: 'DELETE WHERE + INSERT WHERE 조합으로 비활성 고객 제거 및 활성 신규 고객만 추가하는 CRM 동기화 패턴.',
  },
  {
    id: 1722, group: 4, groupTitle: 'MERGE 실전 응용',
    question: '여러 소스 테이블(new_emp, transfer_emp)을 UNION ALL로 묶어 단일 MERGE 소스로 사용하시오.',
    sql: `MERGE INTO copy_emp c
USING (
  SELECT employee_id, last_name, salary, 'NEW' AS src_type
  FROM   new_emp
  UNION ALL
  SELECT employee_id, last_name, salary, 'TRANSFER' AS src_type
  FROM   transfer_emp
) src
ON    (c.employee_id = src.employee_id)
WHEN MATCHED THEN
  UPDATE SET c.salary = src.salary
WHEN NOT MATCHED THEN
  INSERT (employee_id, last_name, salary)
  VALUES (src.employee_id, src.last_name, src.salary);`,
    result: 'N rows merged.',
    keyPoint: 'USING 절 서브쿼리에 UNION ALL로 복수 소스 통합 후 단일 MERGE 처리. 다중 소스 통합 패턴.',
  },
  {
    id: 1723, group: 4, groupTitle: 'MERGE 실전 응용',
    question: 'copy_emp를 self-merge하여 같은 부서 내 직원 중 급여가 중앙값보다 낮은 행의 salary를 중앙값으로 올리시오.',
    sql: `MERGE INTO copy_emp c
USING (
  SELECT employee_id,
         MEDIAN(salary) OVER (PARTITION BY department_id) AS median_sal
  FROM   copy_emp
) src
ON    (c.employee_id = src.employee_id)
WHEN MATCHED THEN
  UPDATE SET c.salary = src.median_sal
  WHERE  c.salary < src.median_sal;`,
    result: 'N rows merged.',
    keyPoint: 'Self-merge: 같은 테이블을 대상과 소스로 사용. USING 서브쿼리에서 분석 함수(MEDIAN OVER)를 활용한 고급 패턴.',
  },

  // ── Group 5: 종합 활용 ────────────────────────────────────
  {
    id: 1724, group: 5, groupTitle: '종합 활용',
    question: 'MERGE를 사용하여 다음을 수행하시오: ①일치하는 행 중 salary > 0인 경우만 업데이트 ②NULL salary는 INACTIVE 처리 후 삭제 ③새 행은 department_id IS NOT NULL인 경우만 삽입.',
    sql: `MERGE INTO copy_emp c
USING employees e
ON    (c.employee_id = e.employee_id)
WHEN MATCHED THEN
  UPDATE SET c.salary        = NVL(e.salary, 0),
             c.department_id = e.department_id
  WHERE  e.salary > 0
  DELETE WHERE e.salary IS NULL
WHEN NOT MATCHED THEN
  INSERT (employee_id, last_name, salary, department_id)
  VALUES (e.employee_id, e.last_name, e.salary, e.department_id)
  WHERE  e.department_id IS NOT NULL;`,
    result: 'N rows merged.',
    keyPoint: 'UPDATE WHERE + DELETE WHERE + INSERT WHERE를 모두 조합한 복합 MERGE. NVL로 NULL 처리도 포함.',
  },
  {
    id: 1725, group: 5, groupTitle: '종합 활용',
    question: '온라인 쇼핑몰의 주문 데이터를 일 배치로 처리하시오. 기존 주문은 상태 업데이트, 취소 주문(status=CANCELLED)은 삭제, 신규 주문은 삽입하시오.',
    sql: `MERGE INTO orders_main om
USING orders_batch ob
ON    (om.order_id = ob.order_id)
WHEN MATCHED THEN
  UPDATE SET om.status     = ob.status,
             om.updated_at = SYSDATE
  DELETE WHERE ob.status = 'CANCELLED'
WHEN NOT MATCHED THEN
  INSERT (order_id, customer_id, amount, status, created_at)
  VALUES (ob.order_id, ob.customer_id, ob.amount, ob.status, SYSDATE)
  WHERE  ob.status <> 'CANCELLED';

COMMIT;`,
    result: 'N rows merged.',
    keyPoint: 'MERGE + COMMIT: 배치 주문 처리의 전체 흐름. CANCELLED 기존 주문 삭제, 신규 CANCELLED 미삽입, 정상 신규 삽입.',
  },
  {
    id: 1726, group: 5, groupTitle: '종합 활용',
    question: '데이터 웨어하우스 팩트 테이블(sales_fact)을 스테이징(sales_stg)으로 완전히 동기화하는 MERGE를 작성하시오. 집계 소스를 활용하고 COMMIT을 포함하시오.',
    sql: `-- 1. 스테이징 집계 소스로 팩트 테이블 MERGE
MERGE INTO sales_fact sf
USING (
  SELECT product_id,
         region_id,
         sale_date,
         SUM(quantity)  AS total_qty,
         SUM(amount)    AS total_amt
  FROM   sales_stg
  GROUP BY product_id, region_id, sale_date
) src
ON    (sf.product_id = src.product_id
   AND sf.region_id  = src.region_id
   AND sf.sale_date  = src.sale_date)
WHEN MATCHED THEN
  UPDATE SET sf.total_qty = src.total_qty,
             sf.total_amt = src.total_amt
WHEN NOT MATCHED THEN
  INSERT (product_id, region_id, sale_date, total_qty, total_amt)
  VALUES (src.product_id, src.region_id, src.sale_date,
          src.total_qty, src.total_amt);

COMMIT;`,
    result: 'N rows merged.',
    keyPoint: '복합 ON 조건(3개 열), 집계 서브쿼리 소스, MERGE + COMMIT 조합. DW 팩트 테이블 증분 갱신의 완전한 ETL 패턴.',
  },
]
