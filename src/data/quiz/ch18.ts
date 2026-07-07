import type { QuizQuestion } from '@/lib/types'

export const ch18Quiz: QuizQuestion[] = [
  // ── 하(기초) 1~20 ──────────────────────────────────────────
  {
    id: 1801, level: 'basic',
    question: '다중 테이블 INSERT(Multitable INSERT)의 주된 목적은?',
    options: [
      '하나의 테이블에 여러 행을 한 번에 삽입한다',
      '하나의 DML 문으로 여러 테이블에 행을 삽입한다',
      '여러 테이블에서 행을 SELECT하여 하나로 합친다',
      '여러 테이블의 인덱스를 동시에 재구성한다',
    ],
    correctAnswer: 1,
    explanation: '다중 테이블 INSERT는 단일 DML 문으로 하나의 소스(SELECT 결과)를 여러 대상 테이블에 삽입합니다. 데이터 웨어하우스 ETL 환경에서 소스를 한 번만 읽어 여러 테이블에 분배할 때 효율적입니다.',
  },
  {
    id: 1802, level: 'basic',
    question: '조건 없이 모든 INTO 절에 행을 삽입하는 다중 테이블 INSERT 유형은?',
    options: [
      'INSERT FIRST',
      'INSERT MERGE',
      'INSERT ALL',
      'INSERT ANY',
    ],
    correctAnswer: 2,
    explanation: 'INSERT ALL은 조건(WHEN) 없이 소스의 각 행을 모든 INTO 절에 삽입합니다. INTO 절이 N개이고 소스가 M행이면 총 N×M행이 삽입됩니다.',
  },
  {
    id: 1803, level: 'basic',
    question: 'Conditional INSERT ALL에서 한 행이 여러 WHEN 조건을 동시에 만족하면 어떻게 되는가?',
    options: [
      '첫 번째 조건의 테이블에만 삽입된다',
      '오류가 발생한다',
      '조건을 만족하는 모든 테이블에 삽입된다',
      '마지막 조건의 테이블에만 삽입된다',
    ],
    correctAnswer: 2,
    explanation: 'Conditional INSERT ALL: 소스의 각 행에 대해 모든 WHEN 조건을 평가하여 만족하는 모든 INTO 절에 삽입합니다. 따라서 한 행이 여러 조건을 만족하면 여러 테이블에 중복 삽입됩니다.',
  },
  {
    id: 1804, level: 'basic',
    question: 'Conditional INSERT FIRST에서 한 행이 첫 번째 WHEN 조건을 만족하면 어떻게 되는가?',
    options: [
      '모든 WHEN 조건을 계속 평가한다',
      '첫 번째 조건의 INTO 절에 삽입하고 나머지 조건 평가를 중단한다',
      '마지막 WHEN 조건의 테이블에도 삽입된다',
      'ELSE 절에도 삽입된다',
    ],
    correctAnswer: 1,
    explanation: 'INSERT FIRST: WHEN 조건을 순서대로 평가하여 첫 번째로 만족하는 INTO 절에만 삽입하고 나머지 조건 평가를 중단합니다. 각 행은 최대 하나의 테이블에만 삽입됩니다.',
  },
  {
    id: 1805, level: 'basic',
    question: 'Pivoting INSERT의 주된 목적은?',
    options: [
      '테이블 구조를 변경한다',
      '여러 행을 하나의 열로 집계한다',
      '열 기반(가로) 데이터를 행 기반(세로) 데이터로 변환하여 삽입한다',
      '중복 행을 제거하고 삽입한다',
    ],
    correctAnswer: 2,
    explanation: 'Pivoting INSERT: 비관계형(열 기반) 형태의 데이터를 관계형(행 기반)으로 변환하여 삽입합니다. 예: 요일별 매출(MON, TUE, WED 열) → (날짜, 매출) 행 형태로 변환.',
  },
  {
    id: 1806, level: 'basic',
    question: 'Unconditional INSERT ALL에서 소스 3행, INTO 절 2개일 때 총 삽입 행 수는?',
    options: ['3행', '6행', '5행', '2행'],
    correctAnswer: 1,
    explanation: 'Unconditional INSERT ALL: 소스의 각 행이 모든 INTO 절에 삽입됩니다. 소스 3행 × INTO 2개 = 6행.',
  },
  {
    id: 1807, level: 'basic',
    question: '다중 테이블 INSERT의 소스(데이터 제공자)는 무엇인가?',
    options: [
      'INSERT INTO ... VALUES의 VALUES 절',
      'INSERT ALL/FIRST 문 끝에 오는 SELECT 문',
      'USING 절의 테이블',
      'FROM 절의 테이블',
    ],
    correctAnswer: 1,
    explanation: '다중 테이블 INSERT의 소스는 문 끝에 오는 SELECT 문입니다: INSERT ALL INTO t1 ... INTO t2 ... SELECT col1, col2 FROM source. SELECT 결과가 각 INTO 절로 분배됩니다.',
  },
  {
    id: 1808, level: 'basic',
    question: 'INSERT ALL과 INSERT FIRST의 가장 큰 차이는?',
    options: [
      'INSERT ALL은 조건을 사용할 수 없다',
      'INSERT ALL은 모든 WHEN 조건을 평가하여 여러 테이블에 삽입 가능, INSERT FIRST는 첫 번째 조건만 적용 후 중단',
      'INSERT FIRST는 항상 빠르다',
      'INSERT ALL은 ELSE를 사용할 수 없다',
    ],
    correctAnswer: 1,
    explanation: 'INSERT ALL: 모든 WHEN 조건 평가, 만족하는 모든 테이블에 삽입(중복 가능). INSERT FIRST: 첫 번째 만족 조건에만 삽입 후 나머지 조건 무시(상호 배타적).',
  },
  {
    id: 1809, level: 'basic',
    question: 'Conditional INSERT FIRST에서 ELSE 절이 동작하는 조건은?',
    options: [
      '모든 WHEN 조건을 만족할 때',
      '어떤 WHEN 조건도 만족하지 않을 때',
      '첫 번째 WHEN 조건만 만족할 때',
      'INTO 절이 없을 때',
    ],
    correctAnswer: 1,
    explanation: 'ELSE 절: 소스의 특정 행이 어떤 WHEN 조건도 만족하지 않을 때 삽입됩니다. INSERT ALL과 INSERT FIRST 모두 ELSE를 사용할 수 있습니다.',
  },
  {
    id: 1810, level: 'basic',
    question: 'INSERT ALL의 기본 구문에서 각 INTO 절의 위치는?',
    options: [
      'SELECT 문 안에 위치한다',
      'INSERT ALL 키워드와 SELECT 문 사이에 위치한다',
      'SELECT 문 뒤에 위치한다',
      'FROM 절 안에 위치한다',
    ],
    correctAnswer: 1,
    explanation: 'INSERT ALL의 구문 순서: INSERT ALL [INTO t1 ... INTO t2 ...] SELECT col1, col2 FROM source. INTO 절들은 INSERT ALL 키워드 다음, SELECT 문 이전에 위치합니다.',
  },
  {
    id: 1811, level: 'basic',
    question: '다중 테이블 INSERT가 데이터 웨어하우스에서 유리한 이유는?',
    options: [
      '자동으로 커밋된다',
      '소스 데이터를 한 번만 읽어 여러 테이블에 분배할 수 있어 I/O 효율이 높다',
      '병렬 실행이 항상 보장된다',
      'DDL 작업이 포함된다',
    ],
    correctAnswer: 1,
    explanation: '다중 테이블 INSERT의 장점: 소스를 한 번만 읽어 여러 대상 테이블에 동시 삽입합니다. 개별 INSERT를 반복하면 소스를 여러 번 읽어야 하지만 INSERT ALL은 단일 패스(Single-pass)로 처리합니다.',
  },
  {
    id: 1812, level: 'basic',
    question: 'INSERT ALL에서 WHEN 조건을 사용하면 어떤 유형이 되는가?',
    options: [
      'Unconditional INSERT ALL',
      'Conditional INSERT ALL',
      'Pivoting INSERT',
      'INSERT FIRST',
    ],
    correctAnswer: 1,
    explanation: 'INSERT ALL에 WHEN 조건이 추가되면 Conditional INSERT ALL입니다. WHEN 없이 모든 INTO 절에 삽입하면 Unconditional INSERT ALL입니다.',
  },
  {
    id: 1813, level: 'basic',
    question: 'Conditional INSERT ALL에서 소스의 특정 행이 모든 WHEN 조건을 만족하지 않으면 어떻게 되는가?',
    options: [
      '오류가 발생한다',
      'ELSE 절이 없으면 해당 행은 어느 테이블에도 삽입되지 않는다',
      '자동으로 첫 번째 INTO 절에 삽입된다',
      'NULL로 삽입된다',
    ],
    correctAnswer: 1,
    explanation: 'Conditional INSERT ALL에서 어떤 WHEN 조건도 만족하지 않으면 해당 행은 버려집니다. ELSE 절이 없으면 무시되고, ELSE 절이 있으면 ELSE INTO에 삽입됩니다.',
  },
  {
    id: 1814, level: 'basic',
    question: 'Pivoting INSERT에서 소스 1행(emp_id=1, mon=100, tue=200, wed=300)을 3개 요일로 변환하면 삽입 행 수는?',
    options: ['1행', '2행', '3행', '6행'],
    correctAnswer: 2,
    explanation: 'Pivoting INSERT: 소스 1행 × INTO 3개(MON, TUE, WED) = 3행 삽입. 소스 2행이면 6행이 삽입됩니다. 열 기반 데이터를 행 기반으로 전환합니다.',
  },
  {
    id: 1815, level: 'basic',
    question: 'INSERT ALL과 INSERT FIRST 모두 공통적으로 문 끝에 반드시 있어야 하는 것은?',
    options: [
      'COMMIT 문',
      'WHEN 조건',
      'SELECT 문',
      'ELSE 절',
    ],
    correctAnswer: 2,
    explanation: '다중 테이블 INSERT는 INSERT ALL/FIRST ... (INTO 절들) ... SELECT col FROM source; 형태로, 소스 데이터를 제공하는 SELECT 문이 반드시 필요합니다.',
  },
  {
    id: 1816, level: 'basic',
    question: 'Conditional INSERT FIRST에서 salary=4500이고 commission_pct가 있는 직원이 다음 조건에 해당한다면 어느 테이블에 삽입되는가?\n① WHEN salary < 5000 THEN INTO low_sal\n② WHEN commission_pct IS NOT NULL THEN INTO comm_emp',
    options: [
      'low_sal과 comm_emp 모두 삽입',
      'low_sal에만 삽입',
      'comm_emp에만 삽입',
      '어디에도 삽입되지 않음',
    ],
    correctAnswer: 1,
    explanation: 'INSERT FIRST: salary=4500은 ①WHEN salary < 5000 조건을 먼저 만족합니다. → low_sal에 삽입하고 ②조건은 평가하지 않습니다. INSERT ALL이었다면 두 테이블 모두 삽입됩니다.',
  },
  {
    id: 1817, level: 'basic',
    question: 'Conditional INSERT ALL에서 salary=4500이고 commission_pct가 있는 직원이 다음 조건에 해당한다면 어느 테이블에 삽입되는가?\n① WHEN salary < 5000 THEN INTO low_sal\n② WHEN commission_pct IS NOT NULL THEN INTO comm_emp',
    options: [
      'low_sal에만 삽입',
      'comm_emp에만 삽입',
      'low_sal과 comm_emp 두 테이블 모두 삽입',
      '어디에도 삽입되지 않음',
    ],
    correctAnswer: 2,
    explanation: 'INSERT ALL: 모든 WHEN 조건을 평가합니다. salary=4500은 ①salary < 5000 만족 → low_sal 삽입. ②commission_pct IS NOT NULL 만족 → comm_emp 삽입. 두 조건 모두 만족하므로 양쪽에 삽입됩니다.',
  },
  {
    id: 1818, level: 'basic',
    question: 'Pivoting INSERT에서 소스에 NULL인 열 데이터가 있으면 어떻게 되는가?',
    options: [
      'NULL이 있으면 INSERT 자체가 실패한다',
      'NULL 값이 있는 열의 행은 자동으로 건너뛴다',
      'NULL 값도 그대로 삽입되며, 필요하면 WHEN 조건으로 NULL 행 제외 가능하다',
      'Pivoting INSERT는 NULL을 0으로 변환한다',
    ],
    correctAnswer: 2,
    explanation: 'Pivoting INSERT(사실 Unconditional INSERT ALL의 응용)는 NULL 값도 그대로 삽입합니다. NULL 행을 제외하려면 WHEN 조건을 추가해야 합니다: WHEN sales_mon IS NOT NULL THEN INTO sales_info ...',
  },
  {
    id: 1819, level: 'basic',
    question: '다중 테이블 INSERT에서 VALUES 절 없이 INTO만 사용하면 어떻게 되는가?\nINSERT ALL INTO t1 INTO t2 SELECT * FROM source;',
    options: [
      '오류가 발생한다',
      'SELECT의 모든 열이 각 INTO 테이블의 열 순서대로 삽입된다',
      '첫 번째 열만 삽입된다',
      'NULL로 삽입된다',
    ],
    correctAnswer: 1,
    explanation: 'INTO 테이블명 (VALUES 없음): SELECT의 모든 열이 대상 테이블 정의 순서대로 삽입됩니다. 열 수와 데이터 타입이 일치해야 합니다. VALUES를 명시하면 소스 열의 부분 집합이나 순서 변경이 가능합니다.',
  },
  {
    id: 1820, level: 'basic',
    question: 'INSERT ALL 문은 어떤 유형의 Oracle 명령인가?',
    options: [
      'DDL (Data Definition Language)',
      'DML (Data Manipulation Language)',
      'DCL (Data Control Language)',
      'TCL (Transaction Control Language)',
    ],
    correctAnswer: 1,
    explanation: 'INSERT ALL/FIRST는 DML(데이터 조작 언어)입니다. 따라서 명시적 COMMIT이 필요하고 ROLLBACK으로 취소할 수 있습니다. DDL처럼 자동 커밋되지 않습니다.',
  },

  // ── 중(응용) 21~40 ─────────────────────────────────────────
  {
    id: 1821, level: 'intermediate',
    question: `다음 INSERT ALL 실행 시 employee_id > 200인 직원이 5명이라면 sal_history에 삽입되는 행 수는?
INSERT ALL
    INTO sal_history VALUES (empid, hiredate, sal)
    INTO mgr_history VALUES (empid, mgr, sal)
SELECT employee_id empid, hire_date hiredate, salary sal, manager_id mgr
FROM   employees WHERE employee_id > 200;`,
    options: ['0행', '5행', '10행', '소스 전체 행 수'],
    correctAnswer: 1,
    explanation: 'Unconditional INSERT ALL: 소스 5행 × INTO 2개(sal_history, mgr_history) = 총 10행 삽입. sal_history에는 5행, mgr_history에도 5행 삽입됩니다.',
  },
  {
    id: 1822, level: 'intermediate',
    question: `다음 INSERT ALL에서 employees 107명이 소스일 때 총 삽입 행 수는?
INSERT ALL
    INTO sal_history VALUES (empid, hiredate, sal)
    INTO mgr_history VALUES (empid, mgr, sal)
SELECT employee_id empid, hire_date hiredate, salary sal, manager_id mgr
FROM   employees;`,
    options: ['107행', '214행', '321행', '조건에 따라 다름'],
    correctAnswer: 1,
    explanation: 'Unconditional INSERT ALL: 소스 107행 × INTO 2개 = 214행 총 삽입. sal_history 107행 + mgr_history 107행 = 214행.',
  },
  {
    id: 1823, level: 'intermediate',
    question: `다음 INSERT FIRST에서 salary=24000인 employee_id=100은 어느 테이블에 삽입되는가?
INSERT FIRST
    WHEN salary < 10000 THEN INTO low_sal VALUES (employee_id, salary)
    WHEN salary < 15000 THEN INTO mid_sal VALUES (employee_id, salary)
    ELSE INTO high_sal VALUES (employee_id, salary)
SELECT employee_id, salary FROM employees WHERE employee_id = 100;`,
    options: ['low_sal에 삽입', 'mid_sal에 삽입', 'high_sal에 삽입', 'low_sal과 high_sal 두 곳에 삽입'],
    correctAnswer: 2,
    explanation: 'salary=24000: ①WHEN salary < 10000 → 거짓. ②WHEN salary < 15000 → 거짓. ③ELSE → high_sal에 삽입. INSERT FIRST이므로 ELSE에 삽입됩니다.',
  },
  {
    id: 1824, level: 'intermediate',
    question: `INSERT FIRST로 employees 107명을 분류할 때 총 삽입 행 수는?
salary > 10000: 8명 / salary BETWEEN 5000 AND 10000: 40명 / 나머지: 59명
INSERT FIRST
    WHEN salary > 10000 THEN INTO high_sal VALUES (employee_id, salary)
    WHEN salary BETWEEN 5000 AND 10000 THEN INTO mid_sal VALUES (employee_id, salary)
    ELSE INTO low_sal VALUES (employee_id, salary)
SELECT employee_id, salary FROM employees;`,
    options: ['107행', '214행', '59행만', '273행'],
    correctAnswer: 0,
    explanation: 'INSERT FIRST: 각 행은 최대 하나의 테이블에만 삽입됩니다. 107명 전원이 각자 하나의 테이블에 삽입 → 총 107행. high_sal 8행 + mid_sal 40행 + low_sal 59행 = 107행.',
  },
  {
    id: 1825, level: 'intermediate',
    question: `Pivoting INSERT에서 소스 2행이 있을 때 sales_info에 삽입되는 총 행 수는?
소스 행 1: emp_id=1, week=1, mon=100, tue=200, wed=300, thur=400, fri=500
소스 행 2: emp_id=2, week=1, mon=150, tue=250, wed=350, thur=450, fri=550
INSERT ALL
    INTO sales_info VALUES (emp_id, week_id, sales_mon)
    INTO sales_info VALUES (emp_id, week_id, sales_tue)
    INTO sales_info VALUES (emp_id, week_id, sales_wed)
    INTO sales_info VALUES (emp_id, week_id, sales_thur)
    INTO sales_info VALUES (emp_id, week_id, sales_fri)
SELECT emp_id, week_id, sales_mon, sales_tue, sales_wed, sales_thur, sales_fri FROM sales_source;`,
    options: ['2행', '5행', '10행', '25행'],
    correctAnswer: 2,
    explanation: '소스 2행 × INTO 5개(요일) = 10행. 소스 행 1 → 5행(mon~fri), 소스 행 2 → 5행(mon~fri) = 총 10행 삽입.',
  },
  {
    id: 1826, level: 'intermediate',
    question: `INSERT ALL과 INSERT FIRST에서 salary=4500, commission_pct=0.1인 행의 차이를 설명한 것으로 올바른 것은?
WHEN salary < 5000 THEN INTO low_sal
WHEN commission_pct IS NOT NULL THEN INTO comm_emp`,
    options: [
      'INSERT ALL과 INSERT FIRST 결과가 동일하다',
      'INSERT ALL: low_sal + comm_emp 모두 삽입 / INSERT FIRST: low_sal에만 삽입',
      'INSERT ALL: low_sal에만 삽입 / INSERT FIRST: comm_emp에만 삽입',
      'INSERT ALL: 오류 발생 / INSERT FIRST: low_sal에 삽입',
    ],
    correctAnswer: 1,
    explanation: 'INSERT ALL: 두 조건 모두 만족 → low_sal, comm_emp 양쪽 삽입. INSERT FIRST: salary < 5000 먼저 만족 → low_sal에만 삽입, commission_pct 조건은 평가하지 않음.',
  },
  {
    id: 1827, level: 'intermediate',
    question: `Conditional INSERT ALL에서 hiredate < 2015-01-01이고 commission_pct IS NOT NULL인 직원은 어느 테이블에 삽입되는가?
INSERT ALL
    WHEN hiredate < DATE '2015-01-01' THEN INTO emp_history VALUES (empid, hiredate, sal)
    WHEN comm IS NOT NULL THEN INTO emp_sales VALUES (empid, comm, sal)
SELECT employee_id empid, hire_date hiredate, salary sal, commission_pct comm FROM employees;`,
    options: [
      'emp_history에만 삽입',
      'emp_sales에만 삽입',
      'emp_history와 emp_sales 모두 삽입',
      '어디에도 삽입되지 않음',
    ],
    correctAnswer: 2,
    explanation: 'INSERT ALL은 모든 WHEN 조건을 독립적으로 평가합니다. hiredate < 2015-01-01 만족 → emp_history 삽입. comm IS NOT NULL 만족 → emp_sales 삽입. 두 조건을 모두 만족하므로 양쪽에 삽입됩니다.',
  },
  {
    id: 1828, level: 'intermediate',
    question: `Pivoting INSERT에서 NULL 값이 있는 요일 행을 제외하는 올바른 방법은?`,
    options: [
      'SELECT에서 WHERE로 NULL 열 전체를 제외한다',
      'INSERT ALL에서 각 INTO 절마다 WHEN 조건으로 NULL 제외: WHEN sales_mon IS NOT NULL THEN INTO sales_info ...',
      'NVL 함수로 0으로 치환하여 삽입한다',
      'NULL 값이 있으면 Pivoting INSERT 자체가 불가하다',
    ],
    correctAnswer: 1,
    explanation: 'Conditional INSERT ALL의 WHEN 조건으로 NULL 제외: WHEN sales_mon IS NOT NULL THEN INTO sales_info VALUES (emp_id, week_id, sales_mon). 각 INTO 절마다 개별 조건을 지정합니다.',
  },
  {
    id: 1829, level: 'intermediate',
    question: `INSERT ALL에서 같은 테이블을 여러 INTO 절에 지정할 수 있는가?`,
    options: [
      '불가능하다 — 각 INTO 절은 서로 다른 테이블이어야 한다',
      '가능하다 — 같은 테이블을 여러 INTO 절로 지정하면 해당 행이 여러 번 삽입된다',
      '가능하지만 한 테이블에 최대 2번까지만 허용된다',
      'Oracle 12c 이상에서만 가능하다',
    ],
    correctAnswer: 1,
    explanation: '같은 테이블을 여러 INTO 절에 지정할 수 있습니다. 예: sales_info를 5개 INTO 절로 지정하면 소스 1행당 5개 행이 sales_info에 삽입됩니다(Pivoting INSERT 패턴).',
  },
  {
    id: 1830, level: 'intermediate',
    question: `다음 INSERT FIRST에서 ELSE 절의 역할은?
INSERT FIRST
    WHEN salary > 15000 THEN INTO high_sal VALUES (employee_id, salary)
    WHEN salary > 8000 THEN INTO mid_sal VALUES (employee_id, salary)
    ELSE INTO low_sal VALUES (employee_id, salary)
SELECT employee_id, salary FROM employees;`,
    options: [
      'ELSE는 모든 조건에 만족하는 행을 삽입한다',
      'salary가 8000 이하인 행을 low_sal에 삽입한다',
      'ELSE는 오류 처리용으로 실제 삽입하지 않는다',
      'ELSE는 salary > 15000인 행을 중복 삽입한다',
    ],
    correctAnswer: 1,
    explanation: 'ELSE: 어떤 WHEN 조건도 만족하지 않는 행(salary ≤ 8000)을 low_sal에 삽입합니다. salary > 15000이면 high_sal, 8000 < salary ≤ 15000이면 mid_sal, salary ≤ 8000이면 low_sal로 분류됩니다.',
  },
  {
    id: 1831, level: 'intermediate',
    question: `INSERT ALL에서 소스 SELECT에 별칭(alias)이 있을 때 INTO 절의 VALUES에서 어떻게 참조하는가?`,
    options: [
      '원래 열 이름으로만 참조 가능하다',
      'SELECT 별칭으로 참조해야 한다',
      '위치 번호(1, 2, 3...)로 참조한다',
      '참조 없이 자동 매핑된다',
    ],
    correctAnswer: 1,
    explanation: 'INSERT ALL/FIRST의 VALUES에서는 SELECT 절에 정의된 별칭으로 참조합니다. 예: SELECT employee_id empid, salary sal → VALUES (empid, sal). 별칭이 없으면 원래 열 이름으로 참조합니다.',
  },
  {
    id: 1832, level: 'intermediate',
    question: `다음 INSERT ALL에서 오류가 발생하는 이유는?
INSERT ALL
    INTO t1 (id, name) VALUES (employee_id, last_name)
    INTO t2 (id, sal) VALUES (employee_id, salary)
SELECT department_id, last_name, salary FROM employees;`,
    options: [
      '오류 없이 정상 실행된다',
      'SELECT에 employee_id 열이 없어 참조 불가 오류',
      'INTO 절에 별칭을 사용해야 한다',
      'WHEN 조건이 없어서 실행 불가',
    ],
    correctAnswer: 1,
    explanation: 'SELECT 절에 department_id, last_name, salary가 있지만 VALUES에서 employee_id를 참조합니다. employee_id는 SELECT 결과에 없으므로 ORA-00904 오류가 발생합니다. SELECT에 employee_id를 포함해야 합니다.',
  },
  {
    id: 1833, level: 'intermediate',
    question: `Unconditional INSERT ALL과 Conditional INSERT ALL의 공통점은?`,
    options: [
      '두 유형 모두 ELSE 절이 필수이다',
      '두 유형 모두 한 소스 행이 여러 INTO 절에 삽입될 수 있다',
      '두 유형 모두 WHEN 조건이 필수이다',
      '두 유형의 총 삽입 행 수가 항상 같다',
    ],
    correctAnswer: 1,
    explanation: '두 유형 모두 소스의 한 행이 여러 INTO 절에 삽입될 수 있습니다. Unconditional은 항상 모든 INTO 절에, Conditional은 조건에 따라 여러 INTO 절에 삽입됩니다. INSERT FIRST만 최대 하나의 INTO 절에 삽입합니다.',
  },
  {
    id: 1834, level: 'intermediate',
    question: `다음 중 다중 테이블 INSERT 구문의 올바른 형태는?`,
    options: [
      'INSERT ALL FROM source INTO t1 INTO t2',
      'INSERT ALL INTO t1 VALUES (...) INTO t2 VALUES (...) SELECT ... FROM source',
      'INSERT INTO t1, t2 SELECT ... FROM source',
      'INSERT ALL SELECT ... FROM source INTO t1 INTO t2',
    ],
    correctAnswer: 1,
    explanation: '올바른 구문: INSERT ALL INTO t1 VALUES (...) INTO t2 VALUES (...) SELECT 열 FROM 소스. INTO 절들이 INSERT ALL 직후, SELECT 이전에 위치합니다.',
  },
  {
    id: 1835, level: 'intermediate',
    question: `INSERT FIRST에서 한 행에 대해 어떤 WHEN 조건도 만족하지 않고 ELSE도 없으면 어떻게 되는가?`,
    options: [
      '오류가 발생한다',
      '해당 행은 어느 테이블에도 삽입되지 않고 건너뛴다',
      '자동으로 첫 번째 INTO 절에 삽입된다',
      'NULL로 첫 번째 테이블에 삽입된다',
    ],
    correctAnswer: 1,
    explanation: 'ELSE가 없고 어떤 WHEN 조건도 만족하지 않으면 해당 행은 모든 INTO 절에 삽입되지 않고 건너뜁니다. INSERT ALL과 INSERT FIRST 모두 동일하게 동작합니다.',
  },
  {
    id: 1836, level: 'intermediate',
    question: `INSERT ALL에서 여러 조건 중 하나만 ELSE로 처리하고 싶을 때 올바른 방법은?`,
    options: [
      'INSERT ALL에는 ELSE 절을 사용할 수 없다',
      'INSERT ALL에도 ELSE 절을 사용할 수 있다 — 모든 WHEN 조건을 만족하지 않는 행을 ELSE로 처리',
      'ELSE 대신 WHEN TRUE THEN을 사용한다',
      'ELSE는 INSERT FIRST에서만 사용 가능하다',
    ],
    correctAnswer: 1,
    explanation: 'INSERT ALL과 INSERT FIRST 모두 ELSE 절을 사용할 수 있습니다. INSERT ALL의 ELSE: 모든 WHEN 조건을 만족하지 않는 행을 ELSE INTO 절에 삽입합니다.',
  },
  {
    id: 1837, level: 'intermediate',
    question: `Pivoting INSERT에서 각 요일을 별도 행으로 변환할 때 같은 테이블(sales_info)을 여러 INTO로 지정하는 이유는?`,
    options: [
      '성능 향상을 위해',
      '소스의 각 열(MON, TUE, WED...)을 개별 행으로 분리하기 위해',
      '중복 데이터를 방지하기 위해',
      '각 INTO 절이 서로 다른 파티션에 삽입되기 때문에',
    ],
    correctAnswer: 1,
    explanation: 'Pivoting INSERT: 소스의 열(MON, TUE, WED)을 각각 별도 행으로 삽입하기 위해 같은 테이블을 여러 INTO 절에 지정합니다. 소스 1행 → N개 INTO = N개 행(열 → 행 변환).',
  },
  {
    id: 1838, level: 'intermediate',
    question: `INSERT ALL에서 DML 트리거는 어떻게 발화되는가?`,
    options: [
      'INSERT ALL 전체에 대해 트리거가 한 번만 발화된다',
      '삽입되는 각 행에 대해 BEFORE/AFTER INSERT 트리거가 각각 발화된다',
      'INSERT ALL은 트리거를 발화하지 않는다',
      'INSERT ALL 트리거가 별도로 필요하다',
    ],
    correctAnswer: 1,
    explanation: 'INSERT ALL의 각 INTO 절에 삽입되는 행마다 해당 테이블의 BEFORE/AFTER INSERT 트리거가 발화됩니다. STATEMENT-level 트리거는 각 INTO 절별 테이블에 한 번씩 발화됩니다.',
  },
  {
    id: 1839, level: 'intermediate',
    question: `다음 INSERT ALL에서 select 결과가 0행이면 어떻게 되는가?`,
    options: [
      '오류가 발생한다',
      '아무 행도 삽입되지 않고 "0 rows inserted" 결과가 반환된다',
      'INTO 절의 테이블에 NULL 행이 삽입된다',
      'ELSE 절이 실행된다',
    ],
    correctAnswer: 1,
    explanation: 'SELECT가 0행을 반환하면 INSERT ALL/FIRST는 아무 행도 삽입하지 않고 정상 종료됩니다(0 rows inserted). 오류가 발생하지 않습니다.',
  },
  {
    id: 1840, level: 'intermediate',
    question: `다음 중 INSERT ALL과 INSERT FIRST를 선택하는 기준으로 올바른 것은?`,
    options: [
      '항상 INSERT ALL이 더 빠르므로 INSERT ALL을 선택한다',
      '행을 여러 테이블에 동시 복사: INSERT ALL / 상호 배타적 분류(한 테이블에만): INSERT FIRST',
      'INSERT FIRST는 조건이 없을 때 사용한다',
      '데이터 양이 많으면 INSERT FIRST, 적으면 INSERT ALL',
    ],
    correctAnswer: 1,
    explanation: '선택 기준: ①INSERT ALL: 소스의 한 행을 여러 테이블에 동시 복사하거나 여러 조건을 중복 허용. ②INSERT FIRST: 급여 범위처럼 행을 상호 배타적으로 분류하여 하나의 테이블에만 삽입할 때 사용.',
  },

  // ── 상(심화) 41~50 ─────────────────────────────────────────
  {
    id: 1841, level: 'advanced',
    question: `다음 INSERT ALL 실행 결과, emp_history와 emp_sales 각각의 삽입 행 수는?
-- employees: 107명. 그 중 hire_date < 2015-01-01: 60명 / commission_pct IS NOT NULL: 35명 / 두 조건 모두 만족: 20명
INSERT ALL
    WHEN hire_date < DATE '2015-01-01' THEN INTO emp_history VALUES (employee_id, hire_date)
    WHEN commission_pct IS NOT NULL THEN INTO emp_sales VALUES (employee_id, commission_pct)
SELECT employee_id, hire_date, commission_pct FROM employees;`,
    options: [
      'emp_history: 60행, emp_sales: 35행',
      'emp_history: 60행, emp_sales: 15행',
      'emp_history: 40행, emp_sales: 35행',
      'emp_history: 80행, emp_sales: 55행',
    ],
    correctAnswer: 0,
    explanation: 'INSERT ALL은 모든 WHEN 조건을 독립적으로 평가합니다. emp_history: hire_date < 2015-01-01인 60명 전원. emp_sales: commission_pct IS NOT NULL인 35명 전원. 두 조건을 모두 만족하는 20명은 양쪽에 중복 삽입됩니다.',
  },
  {
    id: 1842, level: 'advanced',
    question: `다음 INSERT FIRST에서 동일한 employees 107명 기준으로 emp_history와 emp_sales 각각의 삽입 행 수는?
-- hire_date < 2015-01-01: 60명 / commission_pct IS NOT NULL: 35명 / 두 조건 모두 만족: 20명
INSERT FIRST
    WHEN hire_date < DATE '2015-01-01' THEN INTO emp_history VALUES (employee_id, hire_date)
    WHEN commission_pct IS NOT NULL THEN INTO emp_sales VALUES (employee_id, commission_pct)
SELECT employee_id, hire_date, commission_pct FROM employees;`,
    options: [
      'emp_history: 60행, emp_sales: 35행',
      'emp_history: 60행, emp_sales: 15행',
      'emp_history: 40행, emp_sales: 35행',
      'emp_history: 80행, emp_sales: 55행',
    ],
    correctAnswer: 1,
    explanation: 'INSERT FIRST: 첫 번째 조건 만족 시 중단. hire_date < 2015인 60명 → emp_history(이 중 두 조건 모두 만족하는 20명은 두 번째 조건 평가 안 함). 두 번째 조건은 hire_date >= 2015이면서 commission IS NOT NULL인 35-20=15명에게만 적용. emp_sales: 15행.',
  },
  {
    id: 1843, level: 'advanced',
    question: `다음 시나리오에서 INSERT ALL의 총 삽입 행 수와 INSERT FIRST의 총 삽입 행 수 차이는?
-- 소스 100행 중: A조건 만족 70행, B조건 만족 50행, 두 조건 모두 만족 30행, 어떤 조건도 불만족 10행
-- INSERT ALL: WHEN A THEN INTO t1 / WHEN B THEN INTO t2
-- INSERT FIRST: WHEN A THEN INTO t1 / WHEN B THEN INTO t2`,
    options: [
      'INSERT ALL과 INSERT FIRST 총 삽입 행 수가 동일하다',
      'INSERT ALL이 30행 더 많다 (중복 삽입된 행)',
      'INSERT FIRST가 30행 더 많다',
      'INSERT ALL이 10행 더 많다',
    ],
    correctAnswer: 1,
    explanation: 'INSERT ALL: A 만족 70행(t1) + B 만족 50행(t2) = 120행. INSERT FIRST: A 만족 70행(t1) + A 불만족이면서 B 만족 20행(t2) = 90행. 차이: 120 - 90 = 30행(두 조건 모두 만족하는 30행이 INSERT ALL에서 중복 삽입).',
  },
  {
    id: 1844, level: 'advanced',
    question: `INSERT ALL을 사용한 Pivoting INSERT에서 WHEN 조건을 추가하여 NULL이 아닌 요일 데이터만 삽입하는 가장 효율적인 방법은?`,
    options: [
      'SELECT에서 전체 행을 미리 필터링한다',
      '각 INTO 절에 WHEN sales_col IS NOT NULL THEN 조건을 추가하여 해당 열이 NULL인 경우 삽입 제외',
      'NVL로 NULL을 0으로 변환 후 전체 삽입한다',
      'Pivoting INSERT에서는 NULL 필터링이 불가능하다',
    ],
    correctAnswer: 1,
    explanation: '각 INTO 절마다 WHEN 조건 추가: WHEN sales_mon IS NOT NULL THEN INTO sales_info VALUES (emp_id, week_id, sales_mon). 요일마다 독립 조건으로 해당 열이 NULL인 행만 해당 INTO 절을 건너뜁니다.',
  },
  {
    id: 1845, level: 'advanced',
    question: `다음 INSERT ALL에서 발생할 수 있는 문제점은?
INSERT ALL
    INTO sal_history VALUES (empid, hiredate, sal)
    INTO mgr_history VALUES (empid, mgr, sal)
SELECT employee_id empid, hire_date hiredate, salary sal, manager_id mgr
FROM employees;
-- sal_history와 mgr_history에 PRIMARY KEY(empid) 제약이 있고 employees에 동일 employee_id가 없음`,
    options: [
      '문제없이 정상 실행된다',
      '두 테이블에 동일 empid가 삽입되지만 각 테이블 내에서는 중복이 없으므로 정상',
      '동일 empid가 여러 소스 행에서 들어오면 PRIMARY KEY 위반 오류 발생 가능',
      'INSERT ALL은 PRIMARY KEY를 자동으로 처리한다',
    ],
    correctAnswer: 1,
    explanation: 'employees의 employee_id가 PK이므로 소스에 중복이 없어 각 테이블에 한 번씩 삽입됩니다. 정상 실행됩니다. 하지만 소스가 employee_id 중복을 허용하는 뷰/서브쿼리라면 PK 위반이 발생할 수 있습니다.',
  },
  {
    id: 1846, level: 'advanced',
    question: `INSERT ALL과 별도 INSERT 문 반복의 성능 차이가 큰 이유는?`,
    options: [
      '두 방식은 성능이 동일하다',
      'INSERT ALL은 소스를 단일 패스(Single-pass)로 읽고 여러 테이블에 분배하여 I/O 절감. 별도 INSERT 반복 시 소스를 N번 읽음',
      'INSERT ALL은 병렬 실행이 보장되어 빠르다',
      'INSERT ALL은 UNDO 데이터를 생성하지 않는다',
    ],
    correctAnswer: 1,
    explanation: 'INSERT ALL의 핵심 성능 이점: 소스(Full Table Scan 포함)를 한 번만 읽고 여러 대상에 분배(Single-pass). 별도 INSERT N개는 소스를 N번 읽어 I/O가 N배 발생합니다. 대용량 ETL 환경에서 이 차이가 큽니다.',
  },
  {
    id: 1847, level: 'advanced',
    question: `INSERT ALL에서 APPEND 힌트 사용 시의 효과와 주의사항은?`,
    options: [
      'APPEND 힌트는 INSERT ALL에서 사용 불가',
      'APPEND 힌트 사용 시 Direct-Path INSERT로 성능 향상 가능. 단, 해당 세션에서 대상 테이블에 배타 잠금 발생하여 동시성 저하',
      'APPEND 힌트를 사용하면 ROLLBACK이 불가',
      'APPEND는 각 INTO 절에 개별로 지정해야 한다',
    ],
    correctAnswer: 1,
    explanation: '/*+ APPEND */: Direct-Path INSERT를 활성화합니다. INSERT ALL에서 APPEND 힌트 사용 시 대용량 데이터 삽입 성능이 향상됩니다. 단, 테이블에 배타 잠금이 걸려 다른 세션의 DML이 차단됩니다.',
  },
  {
    id: 1848, level: 'advanced',
    question: `다음 INSERT ALL과 Pivoting INSERT를 결합한 고급 패턴에서 올바른 설명은?
INSERT ALL
    WHEN mon IS NOT NULL THEN INTO sales VALUES (emp_id, week_id, 'MON', mon)
    WHEN tue IS NOT NULL THEN INTO sales VALUES (emp_id, week_id, 'TUE', tue)
    WHEN wed IS NOT NULL THEN INTO sales VALUES (emp_id, week_id, 'WED', wed)
SELECT emp_id, week_id, sales_mon mon, sales_tue tue, sales_wed wed FROM src;`,
    options: [
      'INSERT FIRST를 사용해야 정상 동작한다',
      'INSERT ALL + WHEN 조건 조합으로 NULL 열 제외 및 요일 레이블을 포함한 Pivoting INSERT가 가능하다',
      'VALUES에 리터럴 문자열(\'MON\')을 사용할 수 없다',
      'WHEN 조건에서는 SELECT 별칭을 사용할 수 없다',
    ],
    correctAnswer: 1,
    explanation: 'Conditional INSERT ALL + Pivoting 조합: ①각 열별 WHEN IS NOT NULL 조건으로 NULL 제외 ②VALUES에 리터럴 문자열(\'MON\')로 요일 레이블 추가 ③열 기반 → 행 기반 변환. SELECT 별칭(mon, tue, wed)을 VALUES에서 참조합니다.',
  },
  {
    id: 1849, level: 'advanced',
    question: `INSERT ALL을 파티션 테이블과 함께 사용할 때의 장점은?`,
    options: [
      'INSERT ALL은 파티션 테이블을 지원하지 않는다',
      '파티션 키 조건을 WHEN에 넣으면 소스를 한 번 읽어 각 파티션에 해당하는 행을 직접 분배하여 파티션 프루닝 효과',
      'INSERT ALL은 항상 모든 파티션에 균등하게 삽입한다',
      '파티션 테이블은 별도 INSERT를 반복해야 한다',
    ],
    correctAnswer: 1,
    explanation: 'INSERT ALL + WHEN 파티션 키 조건: 소스를 한 번 읽어 파티션 조건별로 분배합니다. 이는 소스를 파티션 수만큼 반복 읽는 방식보다 효율적이며, 대용량 파티션 테이블 로드에 유용합니다.',
  },
  {
    id: 1850, level: 'advanced',
    question: `다음 중 다중 테이블 INSERT의 제한사항으로 올바른 것은?`,
    options: [
      'INTO 절은 최대 5개까지만 허용된다',
      'SELECT 서브쿼리(인라인 뷰)를 소스로 사용할 수 없다',
      '객체 테이블(Object table), 원격 테이블, 뷰(일부 제한)에는 삽입 불가. RETURNING 절 미지원',
      '트리거가 있는 테이블에는 삽입 불가',
    ],
    correctAnswer: 2,
    explanation: '다중 테이블 INSERT의 주요 제한사항: ①원격 DB 테이블 불가 ②객체 테이블(Object type) 불가 ③RETURNING 절 미지원 ④뷰에 삽입 시 제한 있음. INTO 절 수의 최대는 999개이며, 서브쿼리 소스와 트리거는 지원됩니다.',
  },
]
