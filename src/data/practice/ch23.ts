import type { PracticeProblem } from '@/lib/types'

export const ch23Practice: PracticeProblem[] = [
  // ── Group 1: CONNECT BY 기본 ────────────────────────────────
  {
    id: 2301, group: 1, groupTitle: 'CONNECT BY 기본',
    question: 'EMPLOYEES 테이블에서 King(employee_id=100)을 루트로 전체 조직도를 조회하세요.',
    sql: `SELECT employee_id, last_name, manager_id, LEVEL
FROM   employees
START WITH  manager_id IS NULL
CONNECT BY  PRIOR employee_id = manager_id
ORDER SIBLINGS BY last_name;`,
    result: `EMPLOYEE_ID  LAST_NAME  MANAGER_ID  LEVEL
----------- --------- ---------- -----
        100  King             --      1
        101  Kochhar         100      2
        108  Greenberg       101      3
...`,
    keyPoint: 'START WITH manager_id IS NULL으로 최상위 관리자를 루트로 지정합니다. ORDER SIBLINGS BY는 계층을 유지하면서 같은 레벨끼리 정렬합니다.',
  },
  {
    id: 2302, group: 1, groupTitle: 'CONNECT BY 기본',
    question: '특정 직원(employee_id=101)의 모든 부하 직원을 조회하세요.',
    sql: `SELECT employee_id, last_name, LEVEL
FROM   employees
START WITH  employee_id = 101
CONNECT BY  PRIOR employee_id = manager_id
ORDER SIBLINGS BY last_name;`,
    result: `EMPLOYEE_ID  LAST_NAME  LEVEL
----------- --------- -----
        101  Kochhar       1
        108  Greenberg     2
        109  Faviet        3
...`,
    keyPoint: 'START WITH에 특정 employee_id를 지정하면 해당 직원의 서브트리만 조회됩니다.',
  },
  {
    id: 2303, group: 1, groupTitle: 'CONNECT BY 기본',
    question: '직원 205(Gietz)에서 루트까지 상위 보고 체계를 bottom-up으로 조회하세요.',
    sql: `SELECT employee_id, last_name, manager_id, LEVEL
FROM   employees
START WITH  employee_id = 205
CONNECT BY  PRIOR manager_id = employee_id
ORDER BY    LEVEL;`,
    result: `EMPLOYEE_ID  LAST_NAME  MANAGER_ID  LEVEL
----------- --------- ---------- -----
        205  Gietz           205      1
        205  Higgins         101      2
        101  Kochhar         100      3
        100  King             --      4`,
    keyPoint: 'PRIOR manager_id = employee_id로 방향을 역전시켜 현재 노드에서 루트로 거슬러 올라갑니다.',
  },
  {
    id: 2304, group: 1, groupTitle: 'CONNECT BY 기본',
    question: '계층 구조를 2단계까지만(LEVEL <= 2) 조회하세요.',
    sql: `SELECT employee_id, last_name, LEVEL
FROM   employees
START WITH  manager_id IS NULL
CONNECT BY  PRIOR employee_id = manager_id
        AND LEVEL <= 2
ORDER SIBLINGS BY last_name;`,
    result: `EMPLOYEE_ID  LAST_NAME  LEVEL
----------- --------- -----
        100  King          1
        101  Kochhar       2
        102  De Haan       2
...`,
    keyPoint: 'CONNECT BY 절에 LEVEL 조건을 추가하면 해당 단계 이하 자손 탐색 자체가 중단됩니다.',
  },

  // ── Group 2: LEVEL과 들여쓰기 ────────────────────────────────
  {
    id: 2305, group: 2, groupTitle: 'LEVEL과 들여쓰기',
    question: "LPAD를 활용하여 계층 구조를 시각적으로 들여쓰기하여 표시하세요.",
    sql: `SELECT LPAD(' ', (LEVEL - 1) * 4) || last_name AS org_chart,
       LEVEL,
       employee_id
FROM   employees
START WITH  manager_id IS NULL
CONNECT BY  PRIOR employee_id = manager_id
ORDER SIBLINGS BY last_name
FETCH FIRST 12 ROWS ONLY;`,
    result: `ORG_CHART            LEVEL  EMPLOYEE_ID
-------------------- ----- -----------
King                     1         100
    De Haan              2         102
        Hunold           3         103
    Kochhar              2         101
        Greenberg        3         108`,
    keyPoint: "LPAD(' ', (LEVEL-1)*4)로 LEVEL에 비례하는 공백을 생성해 트리 구조를 시각화합니다.",
  },
  {
    id: 2306, group: 2, groupTitle: 'LEVEL과 들여쓰기',
    question: '각 LEVEL의 직원 수를 집계하세요.',
    sql: `SELECT LEVEL, COUNT(*) AS emp_count
FROM   employees
START WITH  manager_id IS NULL
CONNECT BY  PRIOR employee_id = manager_id
GROUP BY LEVEL
ORDER BY LEVEL;`,
    result: `LEVEL  EMP_COUNT
----- ---------
    1          1
    2          3
    3         11
    4         85`,
    keyPoint: '계층 쿼리 결과에 GROUP BY LEVEL을 적용하여 단계별 인원을 집계할 수 있습니다.',
  },

  // ── Group 3: CONNECT_BY_ROOT / SYS_CONNECT_BY_PATH ──────────
  {
    id: 2307, group: 3, groupTitle: 'CONNECT_BY_ROOT & PATH',
    question: '각 직원의 이름과 자신이 속한 최상위 관리자(루트) 이름을 함께 조회하세요.',
    sql: `SELECT employee_id,
       last_name,
       CONNECT_BY_ROOT last_name AS root_name,
       LEVEL
FROM   employees
START WITH  manager_id IS NULL
CONNECT BY  PRIOR employee_id = manager_id
ORDER SIBLINGS BY last_name
FETCH FIRST 10 ROWS ONLY;`,
    result: `EMPLOYEE_ID  LAST_NAME  ROOT_NAME  LEVEL
----------- --------- --------- -----
        100  King       King          1
        102  De Haan    King          2
        103  Hunold     King          3`,
    keyPoint: 'CONNECT_BY_ROOT는 계층 최상위 행의 컬럼 값을 반환합니다.',
  },
  {
    id: 2308, group: 3, groupTitle: 'CONNECT_BY_ROOT & PATH',
    question: '루트부터 현재 직원까지의 이름 경로를 슬래시(/)로 구분하여 표시하세요.',
    sql: `SELECT employee_id,
       last_name,
       SUBSTR(SYS_CONNECT_BY_PATH(last_name, '/'), 2) AS full_path
FROM   employees
START WITH  manager_id IS NULL
CONNECT BY  PRIOR employee_id = manager_id
ORDER SIBLINGS BY last_name
FETCH FIRST 10 ROWS ONLY;`,
    result: `EMPLOYEE_ID  LAST_NAME  FULL_PATH
----------- --------- -----------------------
        100  King       King
        102  De Haan    King/De Haan
        103  Hunold     King/De Haan/Hunold`,
    keyPoint: 'SYS_CONNECT_BY_PATH 결과의 첫 문자(구분자)를 SUBSTR(..., 2)로 제거합니다.',
  },
  {
    id: 2309, group: 3, groupTitle: 'CONNECT_BY_ROOT & PATH',
    question: '각 직원의 부서 경로를 부서 이름 기준으로 조회하세요(JOIN 포함).',
    sql: `SELECT e.last_name,
       d.department_name,
       SUBSTR(SYS_CONNECT_BY_PATH(e.last_name, '>'), 2) AS name_path
FROM   employees   e
JOIN   departments d ON e.department_id = d.department_id
START WITH  e.manager_id IS NULL
CONNECT BY  PRIOR e.employee_id = e.manager_id
ORDER SIBLINGS BY e.last_name
FETCH FIRST 8 ROWS ONLY;`,
    result: `LAST_NAME  DEPARTMENT_NAME  NAME_PATH
--------- --------------- -------------------------
King       Executive        King
Kochhar    Executive        King>Kochhar
Greenberg  Finance          King>Kochhar>Greenberg`,
    keyPoint: '계층 쿼리의 FROM 절에서 JOIN을 사용하여 관련 테이블의 컬럼을 함께 조회할 수 있습니다.',
  },

  // ── Group 4: CONNECT_BY_ISLEAF ───────────────────────────────
  {
    id: 2310, group: 4, groupTitle: 'CONNECT_BY_ISLEAF',
    question: '리프 노드(부하직원이 없는 직원)만 조회하세요.',
    sql: `SELECT employee_id, last_name, LEVEL
FROM   employees
WHERE  CONNECT_BY_ISLEAF = 1
START WITH  manager_id IS NULL
CONNECT BY  PRIOR employee_id = manager_id
ORDER BY LEVEL DESC, last_name
FETCH FIRST 10 ROWS ONLY;`,
    result: `EMPLOYEE_ID  LAST_NAME  LEVEL
----------- --------- -----
        116  Baida         4
        117  Tobias        4
...`,
    keyPoint: 'CONNECT_BY_ISLEAF는 해당 행이 자식이 없는 리프 노드이면 1을 반환합니다.',
  },
  {
    id: 2311, group: 4, groupTitle: 'CONNECT_BY_ISLEAF',
    question: '리프 노드와 내부 노드의 수를 구분하여 집계하세요.',
    sql: `SELECT CONNECT_BY_ISLEAF AS is_leaf,
       COUNT(*)             AS node_count
FROM   employees
START WITH  manager_id IS NULL
CONNECT BY  PRIOR employee_id = manager_id
GROUP BY CONNECT_BY_ISLEAF;`,
    result: `IS_LEAF  NODE_COUNT
------- ----------
      0         18
      1         89`,
    keyPoint: 'CONNECT_BY_ISLEAF 값으로 GROUP BY하면 리프/내부 노드 비율을 파악할 수 있습니다.',
  },

  // ── Group 5: ORDER SIBLINGS BY ──────────────────────────────
  {
    id: 2312, group: 5, groupTitle: 'ORDER SIBLINGS BY',
    question: '계층을 유지하면서 같은 레벨의 직원을 급여 내림차순으로 정렬하세요.',
    sql: `SELECT LPAD(' ', (LEVEL-1)*4) || last_name AS name,
       salary, LEVEL
FROM   employees
START WITH  manager_id IS NULL
CONNECT BY  PRIOR employee_id = manager_id
ORDER SIBLINGS BY salary DESC
FETCH FIRST 12 ROWS ONLY;`,
    result: `NAME                SALARY  LEVEL
------------------- ------- -----
King                 24000      1
    Kochhar          17000      2
        Greenberg    12000      3
    De Haan          17000      2
        Hunold        9000      3`,
    keyPoint: 'ORDER SIBLINGS BY salary DESC는 형제 노드끼리만 급여 순으로 정렬합니다. 계층 구조는 유지됩니다.',
  },
  {
    id: 2313, group: 5, groupTitle: 'ORDER SIBLINGS BY',
    question: '일반 ORDER BY와 ORDER SIBLINGS BY의 차이를 확인하는 쿼리를 작성하세요.',
    sql: `-- ORDER SIBLINGS BY (계층 유지)
SELECT LPAD(' ',(LEVEL-1)*2) || last_name AS name_siblings, LEVEL
FROM   employees
START WITH manager_id IS NULL
CONNECT BY PRIOR employee_id = manager_id
ORDER SIBLINGS BY last_name
FETCH FIRST 8 ROWS ONLY;`,
    result: `NAME_SIBLINGS         LEVEL
--------------------- -----
King                      1
  De Haan                 2
    Hunold                3
  Kochhar                 2
    Greenberg             3`,
    keyPoint: 'ORDER SIBLINGS BY는 트리 구조를 유지하지만, ORDER BY last_name으로 바꾸면 전체를 알파벳순으로 재정렬하여 계층이 깨집니다.',
  },

  // ── Group 6: 종합 실습 ──────────────────────────────────────
  {
    id: 2314, group: 6, groupTitle: '종합 실습',
    question: '완성형 조직도: 들여쓰기, 경로, 루트 이름, 리프 여부, 급여를 한 번에 조회하세요.',
    sql: `SELECT
  LPAD(' ', (LEVEL-1)*4) || last_name             AS org_chart,
  LEVEL                                             AS depth,
  CONNECT_BY_ROOT last_name                         AS root_mgr,
  SUBSTR(SYS_CONNECT_BY_PATH(last_name, '>'), 2)   AS full_path,
  CONNECT_BY_ISLEAF                                 AS is_leaf,
  salary
FROM   employees
START WITH  manager_id IS NULL
CONNECT BY  PRIOR employee_id = manager_id
ORDER SIBLINGS BY last_name
FETCH FIRST 10 ROWS ONLY;`,
    result: `ORG_CHART         DEPTH  ROOT_MGR  FULL_PATH             IS_LEAF  SALARY
----------------- -----  --------  --------------------- -------  ------
King                  1  King      King                        0   24000
    De Haan           2  King      King>De Haan                0   17000
        Hunold        3  King      King>De Haan>Hunold         0    9000`,
    keyPoint: 'CONNECT_BY_ROOT, SYS_CONNECT_BY_PATH, CONNECT_BY_ISLEAF, LEVEL을 통합하여 완전한 조직도 보고서를 만듭니다.',
  },
  {
    id: 2315, group: 6, groupTitle: '종합 실습',
    question: '각 관리자별 서브트리 인원 수와 최대/평균 급여를 집계하세요.',
    sql: `SELECT
  e.last_name                              AS manager,
  COUNT(sub.employee_id)                   AS subtree_size,
  MAX(sub.salary)                          AS max_sal,
  ROUND(AVG(sub.salary), 0)               AS avg_sal
FROM   employees e
JOIN   employees sub ON sub.employee_id IN (
  SELECT employee_id
  FROM   employees
  START WITH  manager_id = e.employee_id
  CONNECT BY  PRIOR employee_id = manager_id
)
WHERE e.employee_id IN (SELECT DISTINCT manager_id FROM employees WHERE manager_id IS NOT NULL)
GROUP BY e.employee_id, e.last_name
ORDER BY subtree_size DESC
FETCH FIRST 5 ROWS ONLY;`,
    result: `MANAGER   SUBTREE_SIZE  MAX_SAL  AVG_SAL
--------- ------------ -------- -------
King                99   17000    6462
Kochhar             34   12008    8082
...`,
    keyPoint: '서브쿼리 내 CONNECT BY로 각 관리자의 전체 서브트리를 찾아 집계합니다.',
  },
]
