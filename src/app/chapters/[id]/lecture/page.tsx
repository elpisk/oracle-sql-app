'use client'
import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { getChapter } from '@/data/chapters'

const CH22_SECTIONS = [
  { title: '1. 고급 서브쿼리 개요', content: `서브쿼리는 SELECT, FROM, WHERE, HAVING, ORDER BY 절에 모두 사용 가능합니다. 고급 서브쿼리는 상관 관계, 다중 컬럼, 스칼라, 인라인 뷰 등 복잡한 패턴을 다룹니다.

**사용 위치별 분류**
| 위치 | 종류 | 예시 |
|------|------|------|
| SELECT | 스칼라 서브쿼리 | (SELECT name FROM ...) |
| FROM | 인라인 뷰 | (SELECT ... FROM t) alias |
| WHERE/HAVING | 조건 서브쿼리 | WHERE col IN (SELECT ...) |
| WITH | CTE | WITH cte AS (SELECT ...) |` },

  { title: '2. 스칼라 서브쿼리', content: `SELECT 절에서 단일 값을 반환하는 서브쿼리입니다. 행마다 한 번 실행되므로 성능 주의가 필요합니다.

**특징**
- 반드시 단일 행·단일 컬럼 반환
- NULL을 반환하면 NULL로 대체됨
- 상관 서브쿼리로 주로 사용됨`, code: `-- 직원별 부서 평균 급여 비교
SELECT employee_id, last_name, salary,
       (SELECT ROUND(AVG(salary), 0)
        FROM   employees e2
        WHERE  e2.department_id = e.department_id) AS dept_avg,
       salary - (SELECT ROUND(AVG(salary), 0)
                 FROM   employees e2
                 WHERE  e2.department_id = e.department_id) AS diff
FROM   employees e
ORDER BY department_id, salary DESC
FETCH FIRST 10 ROWS ONLY;` },

  { title: '3. 인라인 뷰', content: `FROM 절에 위치하는 서브쿼리로, 임시 테이블처럼 사용합니다. 복잡한 집계나 순위 계산을 먼저 수행한 뒤 외부 쿼리로 필터링합니다.

**특징**
- 별칭(alias) 필수
- 외부 쿼리에서 컬럼 참조 가능
- 인라인 뷰 내부에서는 외부 쿼리 컬럼 참조 불가 (비상관)`, code: `-- 부서별 평균 급여 상위 3개 부서
SELECT *
FROM (
  SELECT d.department_name,
         ROUND(AVG(e.salary), 0) AS avg_sal,
         COUNT(*) AS emp_cnt
  FROM   employees e
  JOIN   departments d ON e.department_id = d.department_id
  GROUP BY d.department_name
  ORDER BY avg_sal DESC
)
WHERE ROWNUM <= 3;` },

  { title: '4. 상관 서브쿼리', content: `외부 쿼리의 값을 참조하는 서브쿼리입니다. 외부 쿼리 행마다 한 번씩 실행되므로 일반 서브쿼리보다 느릴 수 있습니다.

**실행 순서**
1. 외부 쿼리가 행 하나를 읽음
2. 내부 서브쿼리에 외부 값 전달
3. 서브쿼리 결과로 외부 행 필터링
4. 다음 행으로 반복`, code: `-- 자기 부서 평균보다 급여가 높은 직원
SELECT employee_id, last_name, salary, department_id
FROM   employees e_outer
WHERE  salary > (
  SELECT AVG(salary)
  FROM   employees e_inner
  WHERE  e_inner.department_id = e_outer.department_id
)
ORDER BY department_id, salary DESC;` },

  { title: '5. EXISTS / NOT EXISTS', content: `서브쿼리 결과가 존재하는지 여부만 확인합니다. IN보다 성능이 좋은 경우가 많으며, NULL 처리에서도 안전합니다.

**EXISTS vs IN**
| 항목 | EXISTS | IN |
|------|--------|----|
| 반환 | TRUE/FALSE | 값 목록 |
| NULL 처리 | 안전 | NULL 포함 시 주의 |
| 성능 | 대용량에 유리 | 소용량에 유리 |`, code: `-- 부하직원이 있는 관리자 목록
SELECT employee_id, last_name, job_id
FROM   employees mgr
WHERE  EXISTS (
  SELECT 1 FROM employees sub
  WHERE  sub.manager_id = mgr.employee_id
)
ORDER BY employee_id;

-- 한 번도 주문하지 않은 부서
SELECT department_id, department_name
FROM   departments d
WHERE  NOT EXISTS (
  SELECT 1 FROM employees e
  WHERE  e.department_id = d.department_id
);` },

  { title: '6. WITH 절 (CTE)', content: `공통 테이블 표현식(Common Table Expression)입니다. 복잡한 쿼리를 단계별로 분해하여 가독성과 재사용성을 높입니다.

**구문**
\`\`\`sql
WITH cte_name AS (
  SELECT ...
)
SELECT ... FROM cte_name;
\`\`\`

**장점**
- 반복 서브쿼리 제거
- 재귀 쿼리 지원 (CYCLE 감지 포함)
- 가독성 향상`, code: `-- WITH로 부서 통계 + 상위 급여자 결합
WITH dept_stats AS (
  SELECT department_id,
         ROUND(AVG(salary), 0) AS avg_sal,
         MAX(salary)            AS max_sal,
         COUNT(*)               AS cnt
  FROM   employees
  GROUP BY department_id
),
top_earners AS (
  SELECT employee_id, last_name, salary, department_id
  FROM   employees
  WHERE  salary > 10000
)
SELECT t.last_name, t.salary, d.avg_sal, d.max_sal
FROM   top_earners t
JOIN   dept_stats  d ON t.department_id = d.department_id
ORDER BY t.salary DESC;` },

  { title: '7. 다중 컬럼 서브쿼리', content: `두 개 이상의 컬럼을 동시에 비교하는 서브쿼리입니다. 쌍 비교(pairwise)와 비쌍 비교(non-pairwise) 방식이 있습니다.

**쌍 비교(Pairwise)** — 두 컬럼을 쌍으로 일치
**비쌍 비교(Non-pairwise)** — 각 컬럼을 개별 비교`, code: `-- 쌍 비교: 같은 부서 + 같은 직급의 최솟값 급여자와 동일 조건
SELECT employee_id, last_name, department_id, job_id, salary
FROM   employees
WHERE  (department_id, job_id) IN (
  SELECT department_id, job_id
  FROM   employees
  WHERE  salary = (SELECT MIN(salary) FROM employees)
)
ORDER BY department_id;` },

  { title: '8. 종합 예제', content: `WITH·스칼라·EXISTS를 단일 쿼리에서 통합하는 예제입니다.`, code: `-- 급여 상위 25% 직원 + 부서 통계 + 관리자 여부 통합
WITH quartile AS (
  SELECT employee_id, last_name, salary, department_id,
         NTILE(4) OVER (ORDER BY salary DESC) AS q
  FROM   employees
)
SELECT q.employee_id,
       q.last_name,
       q.salary,
       (SELECT department_name FROM departments d
        WHERE  d.department_id = q.department_id) AS dept_name,
       CASE WHEN EXISTS (
              SELECT 1 FROM employees sub
              WHERE  sub.manager_id = q.employee_id
            ) THEN '관리자' ELSE '일반직원'
       END AS role
FROM   quartile q
WHERE  q.q = 1
ORDER BY q.salary DESC;` },
]

const CH23_SECTIONS = [
  { title: '1. 계층 데이터 개요', content: `계층 데이터(Hierarchical Data)는 부모-자식 관계로 구성된 트리 구조 데이터입니다. Oracle은 CONNECT BY 절로 계층 쿼리를 지원합니다.

**EMPLOYEES 테이블 계층 구조**
- KING(100) — CEO, manager_id IS NULL
- KOCHHAR(101), DE HAAN(102) — King의 부하
- 각 매니저 아래 여러 직원들
` },

  { title: '2. CONNECT BY 기본 구문', content: `**구문**
\`\`\`sql
SELECT ...
FROM   table
START WITH  condition   -- 루트 행 조건
CONNECT BY  PRIOR parent_col = child_col;
\`\`\`

**PRIOR 방향**
- \`PRIOR employee_id = manager_id\` : 위→아래 (top-down)
- \`PRIOR manager_id = employee_id\` : 아래→위 (bottom-up)`, code: `-- King에서 시작하는 조직도 (top-down)
SELECT employee_id, last_name, manager_id, job_id
FROM   employees
START WITH  manager_id IS NULL
CONNECT BY  PRIOR employee_id = manager_id
ORDER SIBLINGS BY last_name;` },

  { title: '3. LEVEL 의사컬럼', content: `LEVEL은 계층 깊이를 나타내는 의사컬럼입니다. 루트가 1, 자식이 2, 손자가 3...

**활용**
- 들여쓰기: \`LPAD(' ', (LEVEL-1)*2) || last_name\`
- 필터링: \`WHERE LEVEL <= 3\` (3단계까지만)`, code: `-- 들여쓰기로 계층 구조 시각화
SELECT LPAD(' ', (LEVEL - 1) * 4) || last_name AS org_chart,
       LEVEL,
       employee_id,
       manager_id
FROM   employees
START WITH  manager_id IS NULL
CONNECT BY  PRIOR employee_id = manager_id
ORDER SIBLINGS BY last_name;` },

  { title: '4. CONNECT_BY_ROOT', content: `CONNECT_BY_ROOT 연산자는 현재 행의 루트 값을 반환합니다. 각 행이 어느 최상위 노드에 속하는지 파악할 때 사용합니다.

\`CONNECT_BY_ROOT column\` — column의 루트 값 반환`, code: `-- 각 직원의 최상위 관리자 이름 함께 표시
SELECT employee_id,
       last_name,
       CONNECT_BY_ROOT last_name AS root_name,
       LEVEL
FROM   employees
START WITH  manager_id IS NULL
CONNECT BY  PRIOR employee_id = manager_id
ORDER SIBLINGS BY last_name
FETCH FIRST 15 ROWS ONLY;` },

  { title: '5. SYS_CONNECT_BY_PATH', content: `루트에서 현재 행까지의 경로를 문자열로 반환합니다.

\`SYS_CONNECT_BY_PATH(column, separator)\`
- \`column\`: 경로에 포함할 컬럼
- \`separator\`: 구분자 (컬럼 값에 포함되면 안됨)`, code: `-- 조직 경로 전체 표시
SELECT employee_id,
       last_name,
       SYS_CONNECT_BY_PATH(last_name, ' / ') AS path,
       LEVEL
FROM   employees
START WITH  manager_id IS NULL
CONNECT BY  PRIOR employee_id = manager_id
ORDER SIBLINGS BY last_name
FETCH FIRST 15 ROWS ONLY;` },

  { title: '6. CONNECT_BY_ISLEAF', content: `현재 행이 리프 노드(자식 없음)인지 반환합니다. 1이면 리프, 0이면 내부 노드입니다.

부서별 조직도에서 최하위 직원을 찾거나, 트리의 말단 노드를 처리할 때 활용합니다.`, code: `-- 리프 노드(부하 없는 직원)만 조회
SELECT employee_id, last_name, LEVEL,
       CONNECT_BY_ISLEAF AS is_leaf
FROM   employees
START WITH  manager_id IS NULL
CONNECT BY  PRIOR employee_id = manager_id
ORDER SIBLINGS BY last_name;

-- 리프만 필터
SELECT employee_id, last_name
FROM   employees
WHERE  CONNECT_BY_ISLEAF = 1
START WITH  manager_id IS NULL
CONNECT BY  PRIOR employee_id = manager_id;` },

  { title: '7. 순환 참조 처리', content: `데이터에 순환 참조(A→B→C→A)가 있으면 CONNECT BY가 무한 루프 에러를 일으킵니다.

**해결책**
- \`CONNECT BY NOCYCLE PRIOR ...\` — 순환 감지 후 중지
- \`CONNECT_BY_ISCYCLE\` — 순환 발생 시 1 반환`, code: `-- NOCYCLE로 순환 참조 안전 처리
SELECT employee_id, last_name, manager_id,
       CONNECT_BY_ISCYCLE AS is_cycle
FROM   employees
START WITH  manager_id IS NULL
CONNECT BY  NOCYCLE PRIOR employee_id = manager_id;` },

  { title: '8. ORDER SIBLINGS BY', content: `계층 구조를 유지하면서 같은 부모의 자식들 사이에서만 정렬합니다. 일반 ORDER BY는 계층을 무너뜨릴 수 있습니다.

**차이점**
- \`ORDER BY last_name\` → 계층 구조 파괴
- \`ORDER SIBLINGS BY last_name\` → 계층 유지 + 형제끼리 정렬`, code: `-- 같은 레벨 내에서 이름순 정렬
SELECT LPAD(' ', (LEVEL-1)*4) || last_name AS name,
       salary, LEVEL
FROM   employees
START WITH  manager_id IS NULL
CONNECT BY  PRIOR employee_id = manager_id
ORDER SIBLINGS BY last_name;` },

  { title: '9. 종합 예제', content: `LEVEL, SYS_CONNECT_BY_PATH, CONNECT_BY_ROOT, CONNECT_BY_ISLEAF를 통합한 완성형 조직도 쿼리입니다.`, code: `-- 완성형 조직도: 들여쓰기 + 경로 + 루트 + 리프 표시
SELECT
  LPAD(' ', (LEVEL-1)*4) || last_name             AS org_chart,
  LEVEL                                             AS depth,
  CONNECT_BY_ROOT last_name                         AS root_mgr,
  SYS_CONNECT_BY_PATH(last_name, '>')               AS full_path,
  CONNECT_BY_ISLEAF                                 AS is_leaf,
  salary
FROM   employees
START WITH  manager_id IS NULL
CONNECT BY  PRIOR employee_id = manager_id
ORDER SIBLINGS BY last_name;` },
]

const CH24_SECTIONS = [
  { title: '1. 정규표현식 개요', content: `정규표현식(Regular Expression)은 문자열 패턴을 정의하는 강력한 언어입니다. Oracle 10g부터 POSIX 표준을 지원하며 기존 LIKE 연산자보다 훨씬 복잡한 패턴 검색이 가능합니다.

**LIKE vs 정규표현식**
| 기능 | LIKE | 정규표현식 |
|------|------|-----------|
| 임의의 한 문자 | \`_\` | \`.\` |
| 임의의 0개 이상 | \`%\` | \`.*\` |
| 문자 집합 | 불가 | \`[abc]\` |
| 반복 횟수 지정 | 불가 | \`{n}\`, \`{n,m}\` |` },

  { title: '2. 핵심 메타문자', content: `| 메타문자 | 의미 |
|----------|------|
| \`.\` | 임의의 한 문자 |
| \`*\` | 0회 이상 반복 |
| \`+\` | 1회 이상 반복 |
| \`?\` | 0회 또는 1회 |
| \`^\` | 문자열 시작 |
| \`$\` | 문자열 끝 |
| \`[...]\` | 문자 집합 |
| \`[^...]\` | 부정 문자 집합 |
| \`{n,m}\` | n~m회 반복 |
| \`\\|\\|\` | OR |
| \`()\` | 그룹 캡처 |`, code: `-- POSIX 클래스 예
[[:alpha:]]  -- 알파벳
[[:digit:]]  -- 숫자 = [0-9]
[[:alnum:]]  -- 알파벳 + 숫자
[[:upper:]]  -- 대문자
[[:lower:]]  -- 소문자` },

  { title: '3. REGEXP_LIKE', content: `WHERE 절에서 패턴 기반 행 필터링. TRUE/FALSE 반환.

\`\`\`sql
REGEXP_LIKE(source_string, pattern [, match_param])
\`\`\`

**match_param 옵션**
- \`i\` : 대소문자 무시
- \`c\` : 대소문자 구분 (기본값)
- \`n\` : \`.\`이 줄바꿈도 일치
- \`m\` : 다중행 모드`, code: `-- 이름이 모음으로 시작하는 직원
SELECT employee_id, first_name, last_name
FROM   employees
WHERE  REGEXP_LIKE(first_name, '^[AEIOU]', 'i')
ORDER BY first_name;

-- 이메일이 4~6자 대문자인 직원
SELECT employee_id, last_name, email
FROM   employees
WHERE  REGEXP_LIKE(email, '^[A-Z]{4,6}$');` },

  { title: '4. REGEXP_INSTR', content: `문자열 내 패턴의 위치를 반환. 불일치 시 **0** 반환.

\`\`\`sql
REGEXP_INSTR(source, pattern [, pos [, occurrence [, return_opt [, match_param [, subexpr]]]]])
\`\`\`

- \`return_opt=0\` : 시작 위치 (기본값)
- \`return_opt=1\` : 끝 위치 + 1`, code: `-- 전화번호 두 번째 숫자 그룹 위치
SELECT last_name, phone_number,
       REGEXP_INSTR(phone_number, '[0-9]+', 1, 2) AS second_pos
FROM   employees
WHERE  REGEXP_LIKE(phone_number, '^\\d{3}\\.\\d{3}\\.\\d{4}$')
FETCH FIRST 5 ROWS ONLY;
-- 결과: 515.123.4567 → second_pos = 5` },

  { title: '5. REGEXP_SUBSTR', content: `패턴에 일치하는 부분 문자열 추출. 불일치 시 **NULL** 반환.

\`\`\`sql
REGEXP_SUBSTR(source, pattern [, pos [, occurrence [, match_param [, subexpr]]]])
\`\`\`

- \`subexpr=0\` : 전체 일치 (기본값)
- \`subexpr=n\` : n번째 캡처 그룹`, code: `-- 전화번호 분해
SELECT last_name, phone_number,
       REGEXP_SUBSTR(phone_number, '[0-9]+', 1, 1) AS area_code,
       REGEXP_SUBSTR(phone_number, '[0-9]+', 1, 2) AS exchange,
       REGEXP_SUBSTR(phone_number, '[0-9]+', 1, 3) AS number
FROM   employees
WHERE  REGEXP_LIKE(phone_number, '^\\d{3}\\.\\d{3}\\.\\d{4}$')
FETCH FIRST 5 ROWS ONLY;` },

  { title: '6. REGEXP_REPLACE', content: `패턴에 일치하는 부분을 지정 문자열로 치환.

\`\`\`sql
REGEXP_REPLACE(source, pattern [, replace [, pos [, occurrence [, match_param]]]])
\`\`\`

- \`occurrence=0\` : 모든 일치 치환 (기본값)
- **역참조**: \`\\1\`, \`\\2\` — 캡처 그룹 내용 참조`, code: `-- 점(.) → 하이픈
SELECT REGEXP_REPLACE(phone_number, '\\.', '-') AS fmt
FROM   employees WHERE REGEXP_LIKE(phone_number, '^\\d{3}\\.\\d{3}\\.\\d{4}$');

-- 이름 순서 교환 (성 이름 → 이름 성)
SELECT REGEXP_REPLACE(
    last_name || ' ' || first_name,
    '^(\\S+)\\s+(\\S+)$', '\\2 \\1'
) AS swapped
FROM employees FETCH FIRST 5 ROWS ONLY;` },

  { title: '7. REGEXP_COUNT', content: `패턴 출현 횟수 반환 (Oracle 11g+). 불일치 시 **0** 반환.

\`\`\`sql
REGEXP_COUNT(source, pattern [, pos [, match_param]])
\`\`\``, code: `-- 이름에서 모음 개수
SELECT last_name,
       REGEXP_COUNT(last_name, '[aeiou]', 1, 'i') AS vowels
FROM   employees
ORDER BY vowels DESC FETCH FIRST 10 ROWS ONLY;

-- 모음 개수별 직원 수
SELECT REGEXP_COUNT(last_name, '[aeiou]', 1, 'i') AS vowel_cnt,
       COUNT(*)                                    AS emp_count
FROM   employees
GROUP BY REGEXP_COUNT(last_name, '[aeiou]', 1, 'i')
ORDER BY vowel_cnt;` },

  { title: '8. 종합 예제', content: `5개 함수를 단일 쿼리에서 통합 활용하는 예제입니다.`, code: `-- 이메일 분석 보고서
SELECT employee_id, last_name,
       -- REGEXP_LIKE: 유효성 검사
       CASE WHEN REGEXP_LIKE(email, '^[A-Z]+$')
            THEN LOWER(email) || '@oracle.com'
            ELSE 'INVALID'
       END                                          AS full_email,
       -- REGEXP_COUNT: 이메일 길이 분류
       CASE WHEN REGEXP_COUNT(email, '[A-Z]') <= 4
            THEN '짧음' ELSE '보통'
       END                                          AS len_cat,
       -- REGEXP_SUBSTR: 이니셜 추출
       REGEXP_SUBSTR(first_name, '^[A-Za-z]') || '.' AS initial
FROM   employees
ORDER BY len_cat, employee_id FETCH FIRST 10 ROWS ONLY;` },
]

const CH01_SECTIONS = [
  { title: '1. SELECT 문 기본 구조 (Oracle 19c)', content: `SELECT 문은 데이터베이스에서 데이터를 조회하는 기본 SQL 명령입니다.

**Oracle 기본 구문**
\`\`\`sql
SELECT  {*, column [alias], ...}
FROM    table;
\`\`\`

**⚠️ Oracle vs MySQL 핵심 차이**
| 항목 | Oracle 19c | MySQL |
|------|-----------|-------|
| FROM 절 | 필수 (없으면 오류) | SELECT 1+1 가능 |
| 더미 테이블 | FROM DUAL 사용 | FROM 생략 가능 |
| 행 제한 | WHERE ROWNUM <= N | LIMIT N |
| NULL 대체 | NVL() | IFNULL() |
| 문자 연결 | \|\| 연산자 | CONCAT() 또는 + |

**SQL 규칙**
- 키워드는 대소문자 구분 없음
- 세미콜론(;)으로 문장 종료
- 여러 줄에 걸쳐 작성 가능`, code: `-- 모든 컬럼 조회
SELECT *
FROM   employees;

-- 특정 컬럼만 조회
SELECT employee_id, last_name, salary
FROM   employees;

-- Oracle 전용 DUAL: 테이블 없이 식 계산
SELECT SYSDATE, 1 + 1, 'Oracle' AS db_type
FROM   dual;` },

  { title: '2. 컬럼 선택과 산술 연산자', content: `SELECT 절에서 컬럼명을 나열하거나 산술 연산식을 사용할 수 있습니다.

**산술 연산자 우선순위**
| 연산자 | 의미 | 우선순위 |
|--------|------|----------|
| * | 곱하기 | 높음 |
| / | 나누기 | 높음 |
| + | 더하기 | 낮음 |
| - | 빼기 | 낮음 |

- 같은 우선순위는 왼쪽에서 오른쪽으로 처리
- 괄호()로 우선순위를 직접 지정

**Oracle DUAL 테이블 활용**
함수나 식의 결과를 바로 확인할 때 FROM DUAL 사용`, code: `-- 연봉 계산
SELECT last_name, salary, salary * 12
FROM   employees
WHERE  ROWNUM <= 5;

-- 괄호로 우선순위 조정
SELECT last_name, salary, (salary + 300) * 12
FROM   employees
WHERE  ROWNUM <= 5;

-- DUAL로 연산 확인 (Oracle 전용)
SELECT 2 + 3 * 4 AS "곱셈우선",
       (2 + 3) * 4 AS "괄호우선"
FROM   dual;` },

  { title: '3. NULL 값과 NVL() 함수 (Oracle 전용)', content: `NULL은 알 수 없는 값, 적용 불가한 값을 의미합니다.

**NULL의 특성**
- NULL은 0이나 공백 문자열과 다릅니다
- NULL이 포함된 산술 연산 결과는 항상 NULL입니다
- NULL 비교는 반드시 IS NULL / IS NOT NULL을 사용합니다

**Oracle 전용 NVL() 함수**
\`\`\`sql
NVL(expr, default_value)
-- expr이 NULL이면 default_value 반환
-- MySQL의 IFNULL(), SQL Server의 ISNULL()에 해당
\`\`\`

> ⚠️ = NULL 이나 != NULL 은 항상 UNKNOWN — 반드시 IS NULL 사용`, code: `-- NULL이 포함된 산술 연산 → 결과: NULL
SELECT last_name, salary, commission_pct,
       salary * commission_pct AS commission
FROM   employees
WHERE  employee_id = 100;

-- Oracle NVL()로 NULL 대체
SELECT last_name, commission_pct,
       NVL(commission_pct, 0) AS comm_or_zero,
       salary * 12 * (1 + NVL(commission_pct, 0)) AS annual_total
FROM   employees
WHERE  ROWNUM <= 5;

-- DUAL에서 NVL 확인 (Oracle 전용)
SELECT NVL(NULL, '없음'), NVL('값', '없음')
FROM   dual;` },

  { title: '4. 컬럼 별칭 — Oracle 큰따옴표 규칙', content: `컬럼 별칭은 컬럼 헤더를 원하는 이름으로 변경합니다.

**별칭 지정 방법**
\`\`\`sql
컬럼명 AS 별칭        -- AS 키워드 사용 (권장)
컬럼명 별칭           -- AS 생략 가능
컬럼명 "별칭"         -- 큰따옴표 사용
\`\`\`

**⚠️ Oracle vs MySQL 별칭 차이**
| 항목 | Oracle | MySQL |
|------|--------|-------|
| 특수/공백 별칭 | 큰따옴표 "" | 백틱 \`\` 또는 "" |
| 별칭 대소문자 | 큰따옴표 없으면 대문자로 변환 | 그대로 유지 |

**큰따옴표 필수 상황**
- 공백 포함: "Annual Salary"
- 한글: "연봉", "사번"
- 특수문자: "Sal_$"
- 대소문자 유지: "empName"`, code: `-- 기본 별칭 (큰따옴표 없음 → 대문자로 출력됨)
SELECT last_name AS name, salary * 12 AS annual_sal
FROM   employees
WHERE  ROWNUM <= 3;
-- 결과: NAME, ANNUAL_SAL (대문자)

-- 큰따옴표로 한글·공백 별칭 (Oracle 전용)
SELECT last_name        "성명",
       salary           "기본급",
       salary * 12      "연간급여"
FROM   employees
WHERE  ROWNUM <= 3;
-- 결과: 성명, 기본급, 연간급여 (그대로 출력)` },

  { title: '5. 연결 연산자 || 와 대체 인용 q\'[...]\'', content: `Oracle에서 문자열 연결은 || 연산자를 사용합니다. MySQL의 CONCAT()이나 SQL Server의 + 대신 사용됩니다.

**연결 연산자 ||**
\`\`\`sql
column1 || column2           -- 컬럼 연결
column || '문자열 리터럴'     -- 컬럼 + 문자
\`\`\`
- NUMBER 타입도 자동으로 문자로 변환됨

**대체 인용 연산자 q (Oracle 전용)**
문자열 내에 작은따옴표를 자유롭게 쓸 수 있습니다.
\`\`\`sql
q'[It's a test]'    -- 작은따옴표 포함 가능
q'{Oracle's SQL}'
q'<Don't stop>'
\`\`\`

**문자열 내 작은따옴표 처리**
\`\`\`sql
'It''s OK'          -- 연속 두 개 → 작은따옴표 하나
q'[It's OK]'        -- 대체 인용 연산자 사용
\`\`\``, code: `-- || 로 이름 연결 (Oracle 전용 문법)
SELECT first_name || ' ' || last_name AS full_name,
       employee_id || '번 직원' AS emp_info
FROM   employees
WHERE  ROWNUM <= 5;

-- 문장 형태 출력
SELECT last_name || q'['s salary: ]' || salary AS info
FROM   employees
WHERE  ROWNUM <= 3;

-- 대체 인용 연산자 확인 (DUAL 사용)
SELECT q'[It's Oracle 19c!]' AS message
FROM   dual;` },

  { title: '6. DISTINCT와 Oracle 행 제한(ROWNUM)', content: `DISTINCT는 중복 행을 제거합니다. Oracle에서 행 수를 제한할 때는 ROWNUM 의사컬럼을 사용합니다.

**DISTINCT 구문**
\`\`\`sql
SELECT DISTINCT column1 [, column2, ...]
FROM   table;
\`\`\`

**Oracle 행 제한 — ROWNUM (MySQL의 LIMIT 대신)**
\`\`\`sql
-- Oracle 전통 방식 (Oracle 8i~19c 모두 지원)
WHERE ROWNUM <= N

-- Oracle 12c+ 추가 문법 (SQL 표준)
FETCH FIRST N ROWS ONLY
\`\`\`

**ch01 핵심 Oracle 전용 요소 정리**
| 개념 | Oracle 19c | MySQL |
|------|-----------|-------|
| 더미 테이블 | FROM DUAL | 생략 가능 |
| NULL 대체 | NVL() | IFNULL() |
| 문자 연결 | \|\| 연산자 | CONCAT() |
| 컬럼 별칭 구분자 | 큰따옴표 "" | 백틱 \`\` |
| 행 제한 | WHERE ROWNUM <= N | LIMIT N |
| 현재 날짜 | SYSDATE | NOW() |`, code: `-- DISTINCT: 중복 제거 (NULL도 1개로)
SELECT DISTINCT department_id
FROM   employees;

-- 여러 컬럼 조합 중복 제거
SELECT DISTINCT department_id, job_id
FROM   employees;

-- Oracle ROWNUM으로 행 제한 (MySQL LIMIT 대신)
SELECT employee_id,
       first_name || ' ' || last_name   AS full_name,
       salary * 12                      AS annual_sal,
       NVL(commission_pct, 0)           AS comm_rate
FROM   employees
WHERE  ROWNUM <= 10;` },
]

const CH02_SECTIONS = [
  { title: '1. WHERE 절 기본 구조와 비교 연산자', content: `WHERE 절은 SELECT 결과에서 조건을 만족하는 행만 반환합니다.

**기본 구문**
\`\`\`sql
SELECT column1, column2
FROM   table
WHERE  condition;
\`\`\`

**비교 연산자**
| 연산자 | 의미 | Oracle 특이사항 |
|--------|------|----------------|
| = | 같음 | |
| <>, !=, ^= | 같지 않음 | 세 가지 모두 유효 |
| > | 초과 | |
| < | 미만 | |
| >= | 이상 | |
| <= | 이하 | |

**⚠️ Oracle 문자열 비교는 대소문자 구분**
- WHERE last_name = 'King' ✓
- WHERE last_name = 'king' → 결과 없음`, code: `-- 급여 10000 초과 직원
SELECT employee_id, last_name, salary
FROM   employees
WHERE  salary > 10000;

-- 특정 직무 직원 (대소문자 구분 주의)
SELECT last_name, job_id
FROM   employees
WHERE  job_id = 'SA_REP';

-- Oracle 날짜 비교: TO_DATE() 사용
SELECT last_name, hire_date
FROM   employees
WHERE  hire_date >= TO_DATE('2005-01-01', 'YYYY-MM-DD');` },

  { title: '2. BETWEEN ... AND / IN 연산자', content: `범위 조건과 목록 조건을 간결하게 표현합니다.

**BETWEEN ... AND**
\`\`\`sql
WHERE column BETWEEN lower AND upper
\`\`\`
- **경계값 포함**: >= lower AND <= upper 와 동일
- 숫자, 날짜, 문자열에 모두 사용 가능

**IN 연산자**
\`\`\`sql
WHERE column IN (val1, val2, val3)
\`\`\`
- = val1 OR = val2 OR = val3 와 동일
- ⚠️ **NOT IN 목록에 NULL 포함 시 아무 행도 반환되지 않음**

**NOT 버전**
- NOT BETWEEN A AND B → < A OR > B
- NOT IN (val1, val2) → <> val1 AND <> val2`, code: `-- BETWEEN: 경계값 포함
SELECT last_name, salary
FROM   employees
WHERE  salary BETWEEN 5000 AND 10000;

-- IN: 특정 부서 직원
SELECT last_name, department_id
FROM   employees
WHERE  department_id IN (10, 20, 30);

-- NOT IN 안전 사용 (NULL 주의)
SELECT last_name, department_id
FROM   employees
WHERE  department_id NOT IN (10, 20, 30)
  AND  department_id IS NOT NULL;` },

  { title: '3. LIKE 연산자와 와일드카드', content: `패턴 매칭으로 문자열을 부분 검색합니다.

**와일드카드**
| 기호 | 의미 |
|------|------|
| % | 0개 이상의 임의 문자 |
| _ | 정확히 1개의 임의 문자 |

**패턴 예시**
| 패턴 | 매칭 예시 |
|------|-----------|
| 'K%' | King, Kochhar, Khoo |
| '%n' | Chen, Austin, Johnson |
| '_o%' | Kochhar, Colmenares |
| 'J__n' | John (4자) |
| '%e%' | e를 포함하는 모든 |

**ESCAPE 절 — 와일드카드 자체를 검색할 때**
\`\`\`sql
LIKE 'SA\\_%' ESCAPE '\\'
-- \\ 뒤의 _ 는 와일드카드가 아닌 리터럴 _ 문자
\`\`\``, code: `-- K로 시작하는 last_name
SELECT last_name
FROM   employees
WHERE  last_name LIKE 'K%';

-- 두 번째 문자가 o
SELECT last_name
FROM   employees
WHERE  last_name LIKE '_o%';

-- ESCAPE: job_id 'SA_'로 시작 (SA_REP, SA_MAN)
SELECT last_name, job_id
FROM   employees
WHERE  job_id LIKE 'SA\\_%' ESCAPE '\\';` },

  { title: '4. IS NULL / IS NOT NULL', content: `NULL 값은 = 으로 비교할 수 없습니다. IS NULL / IS NOT NULL을 사용합니다.

**NULL 비교 규칙**
\`\`\`sql
WHERE column IS NULL        -- NULL인 행 선택 ✓
WHERE column IS NOT NULL    -- NULL이 아닌 행 ✓
WHERE column = NULL         -- 항상 UNKNOWN → 아무 행도 반환 안 함 ✗
\`\`\`

**⚠️ Oracle 고유: 빈 문자열 = NULL**
MySQL, PostgreSQL과 달리 Oracle에서 '' (빈 문자열)은 NULL로 처리됩니다.

**NVL과 함께 활용**
\`\`\`sql
-- NULL이면 0으로 계산
WHERE NVL(commission_pct, 0) > 0.2
-- 또는
WHERE commission_pct IS NOT NULL
  AND commission_pct > 0.2
\`\`\``, code: `-- 커미션이 없는 직원 (commission_pct IS NULL)
SELECT last_name, salary, commission_pct
FROM   employees
WHERE  commission_pct IS NULL;

-- 커미션이 있는 직원
SELECT last_name, salary, commission_pct
FROM   employees
WHERE  commission_pct IS NOT NULL
ORDER  BY commission_pct DESC;

-- 최상위 관리자 (manager_id가 없는 직원)
SELECT employee_id, last_name, job_id
FROM   employees
WHERE  manager_id IS NULL;` },

  { title: '5. AND, OR, NOT 논리 연산자와 우선순위', content: `여러 조건을 결합하여 복잡한 필터를 만듭니다.

**논리 연산자**
| 연산자 | 의미 |
|--------|------|
| AND | 두 조건 모두 TRUE |
| OR | 하나 이상 TRUE |
| NOT | 조건의 반대 |

**⚠️ Oracle 연산자 우선순위 (높음 → 낮음)**
1. 산술 연산자 (+, -, *, /)
2. 비교 연산자 (=, <>, >, < ...)
3. IS NULL, LIKE, IN, BETWEEN
4. NOT
5. **AND** ← OR보다 먼저!
6. OR

**주의**: AND가 OR보다 우선순위가 높으므로 괄호를 명시하는 것이 좋습니다.
\`\`\`sql
-- 아래 두 쿼리는 다른 결과
WHERE a = 1 OR b = 2 AND c = 3    -- OR (b AND c)
WHERE (a = 1 OR b = 2) AND c = 3  -- 명시적 그룹화
\`\`\``, code: `-- AND: 두 조건 모두 만족
SELECT last_name, department_id, salary
FROM   employees
WHERE  department_id = 90
  AND  salary > 15000;

-- OR: 하나 이상 만족
SELECT last_name, department_id, salary
FROM   employees
WHERE  department_id = 90
  OR   salary > 12000;

-- 괄호로 우선순위 명시 (권장)
SELECT last_name, department_id, salary
FROM   employees
WHERE  (department_id = 30 OR department_id = 50)
  AND  salary BETWEEN 4000 AND 8000;` },

  { title: '6. Oracle 날짜 비교와 종합 정리', content: `Oracle의 DATE 타입 비교와 복합 WHERE 절을 정리합니다.

**Oracle 날짜 비교**
\`\`\`sql
-- TO_DATE 함수 사용 (명시적, 권장)
WHERE hire_date >= TO_DATE('2005-01-01', 'YYYY-MM-DD')

-- NLS 형식 문자열 직접 비교 (기본: DD-MON-RR)
WHERE hire_date >= '01-JAN-05'

-- BETWEEN으로 날짜 범위
WHERE hire_date BETWEEN TO_DATE('2006-01-01','YYYY-MM-DD')
                    AND TO_DATE('2007-12-31','YYYY-MM-DD')
\`\`\`

**ch02 핵심 요약**
| 구문 | 역할 |
|------|------|
| WHERE col = val | 동등 비교 |
| BETWEEN A AND B | 범위 조건 (경계 포함) |
| IN (v1, v2) | 목록 일치 |
| LIKE '%패턴%' | 문자열 패턴 |
| IS NULL / IS NOT NULL | NULL 조건 |
| AND / OR / NOT | 논리 연산 |`, code: `-- 종합: 특정 부서, 날짜, 급여 복합 조건
SELECT last_name, department_id, salary, hire_date
FROM   employees
WHERE  department_id IN (50, 60, 80)
  AND  hire_date >= TO_DATE('2006-01-01', 'YYYY-MM-DD')
  AND  salary BETWEEN 4000 AND 10000
ORDER  BY department_id, salary DESC;

-- LIKE + IS NOT NULL 조합
SELECT last_name, job_id, commission_pct
FROM   employees
WHERE  last_name LIKE '%s%'
  AND  commission_pct IS NOT NULL
ORDER  BY last_name;` },
]

const CH03_SECTIONS = [
  { title: '1. 단일행 함수 개요', content: `단일행 함수(Single-Row Function)는 행마다 하나의 결과를 반환합니다.

**단일행 함수 분류**
| 유형 | Oracle 대표 함수 |
|------|----------------|
| 문자 | UPPER, LOWER, INITCAP, SUBSTR, LENGTH, INSTR, LPAD, RPAD, TRIM, REPLACE |
| 숫자 | ROUND, TRUNC, MOD |
| 날짜 | SYSDATE, MONTHS_BETWEEN, ADD_MONTHS, NEXT_DAY, LAST_DAY |
| 변환 | TO_CHAR, TO_NUMBER, TO_DATE |
| 일반 | NVL, NVL2, NULLIF, COALESCE, DECODE, CASE |

**특징**
- 각 행에 독립적으로 적용
- 중첩 사용 가능: UPPER(SUBSTR(col, 1, 3))
- SELECT, WHERE, ORDER BY 절 모두 사용 가능`, code: `-- 함수 중첩 예제
SELECT employee_id,
       UPPER(SUBSTR(last_name, 1,3)) AS name_code,
       ROUND(salary / 12, 2)         AS monthly_sal
FROM   employees
WHERE  ROWNUM <= 5;` },

  { title: '2. 문자 함수', content: `Oracle 문자 함수로 문자열을 변환·추출·검색합니다.

**대소문자 변환**
| 함수 | 역할 | MySQL 대응 |
|------|------|-----------|
| UPPER(s) | 대문자 변환 | UPPER() |
| LOWER(s) | 소문자 변환 | LOWER() |
| INITCAP(s) | 단어 첫 글자만 대문자 | 없음 (Oracle 전용) |

**추출·검색**
| 함수 | 역할 |
|------|------|
| SUBSTR(s, pos, len) | 부분 문자열 추출 (1-base) |
| LENGTH(s) | 문자열 길이 |
| INSTR(s, sub, pos, occ) | 부분 문자열 위치 |

**변환·채우기**
| 함수 | 역할 |
|------|------|
| LPAD(s, n, c) | 왼쪽 채우기 |
| RPAD(s, n, c) | 오른쪽 채우기 |
| TRIM(c FROM s) | 양쪽 문자 제거 |
| REPLACE(s, old, new) | 문자열 교체 |`, code: `-- 대소문자 변환
SELECT UPPER('oracle'), LOWER('SQL'), INITCAP('hello world')
FROM   dual;
-- ORACLE, sql, Hello World

-- 부분 문자열 추출
SELECT SUBSTR('Hello World', 7)     AS from7,    -- World
       SUBSTR('Hello World', 7, 3)  AS three_ch   -- Wor
FROM   dual;

-- LPAD로 보고서 정렬
SELECT LPAD(salary, 10, ' ') AS salary_fmt
FROM   employees WHERE ROWNUM <= 3;` },

  { title: '3. 숫자 함수', content: `Oracle 숫자 함수로 반올림, 버림, 나머지를 계산합니다.

**주요 숫자 함수**
| 함수 | 역할 | 예시 |
|------|------|------|
| ROUND(n, d) | d자리로 반올림 | ROUND(45.926,2)=45.93 |
| TRUNC(n, d) | d자리에서 버림 | TRUNC(45.926,2)=45.92 |
| MOD(m, n) | m÷n 나머지 | MOD(1600,300)=100 |

**ROUND / TRUNC 음수 자리수**
- ROUND(45.926, 0) = 46 (정수 반올림)
- ROUND(45.926, -1) = 50 (십의 자리 반올림)
- ROUND(45.926, -2) = 0 (백의 자리 반올림)

**MOD 활용**
- 짝수/홀수 판별: MOD(n, 2) = 0 이면 짝수
- 배수 판별: MOD(n, 5) = 0 이면 5의 배수`, code: `-- 기본 숫자 함수
SELECT ROUND(45.926, 2)  AS r_2,    -- 45.93
       ROUND(45.926, 0)  AS r_0,    -- 46
       ROUND(45.926, -1) AS r_m1,   -- 50
       TRUNC(45.926, 2)  AS t_2,    -- 45.92
       MOD(1600, 300)    AS mod_val  -- 100
FROM   dual;

-- 커미션 계산 (반올림)
SELECT last_name, salary, commission_pct,
       ROUND(salary * NVL(commission_pct, 0), 0) AS commission
FROM   employees WHERE commission_pct IS NOT NULL AND ROWNUM <= 5;` },

  { title: '4. 날짜 함수 (Oracle 전용)', content: `Oracle 날짜 함수는 MySQL과 큰 차이가 있습니다.

**Oracle 날짜 산술**
- DATE + NUMBER = DATE (날짜에 일 수 더하기)
- DATE - DATE = NUMBER (두 날짜 사이의 일 수)

**Oracle 전용 날짜 함수**
| 함수 | 역할 | MySQL 대응 |
|------|------|-----------|
| SYSDATE | 현재 날짜+시간 | NOW() |
| MONTHS_BETWEEN(d1,d2) | 두 날짜 사이 월 수 | PERIOD_DIFF() |
| ADD_MONTHS(d, n) | n개월 더하기 | DATE_ADD(d, INTERVAL n MONTH) |
| NEXT_DAY(d, day) | 다음 해당 요일 날짜 | 없음 |
| LAST_DAY(d) | 해당 월 마지막 날 | LAST_DAY() |
| TRUNC(date) | 날짜 시간 부분 제거 | DATE() |`, code: `-- Oracle 날짜 산술
SELECT SYSDATE,
       SYSDATE + 7                AS next_week,
       SYSDATE - 7                AS last_week,
       TRUNC(SYSDATE)             AS today_midnight
FROM   dual;

-- Oracle 전용 날짜 함수
SELECT hire_date,
       MONTHS_BETWEEN(SYSDATE, hire_date)   AS months,
       ADD_MONTHS(hire_date, 3)             AS plus3m,
       LAST_DAY(hire_date)                  AS last_of_month,
       NEXT_DAY(hire_date, 'FRIDAY')        AS next_fri
FROM   employees WHERE ROWNUM <= 3;` },

  { title: '5. 변환 함수 (TO_CHAR, TO_NUMBER, TO_DATE)', content: `Oracle 변환 함수는 데이터 타입 간 변환을 명시적으로 수행합니다.

**TO_CHAR — 날짜/숫자 → 문자열**
\`\`\`sql
TO_CHAR(date, format)    -- 날짜를 문자열로
TO_CHAR(number, format)  -- 숫자를 문자열로
\`\`\`
| 형식 요소 | 의미 |
|-----------|------|
| YYYY | 4자리 연도 |
| MM | 2자리 월 |
| DD | 2자리 일 |
| HH24:MI:SS | 시간 |
| DY | 요일 약어 (MON) |
| Day | 요일 전체 (Monday) |
| 9 | 숫자 자리 |
| , | 천단위 구분 |
| $ | 달러 기호 |
| FM | 선행 공백 제거 |

**TO_DATE — 문자열 → 날짜**
\`\`\`sql
TO_DATE('2024-01-15', 'YYYY-MM-DD')
\`\`\`

**TO_NUMBER — 문자열 → 숫자**
\`\`\`sql
TO_NUMBER('12,345.67', '99,999.99')
\`\`\``, code: `-- TO_CHAR: 날짜 형식
SELECT TO_CHAR(hire_date, 'YYYY-MM-DD')          AS date1,
       TO_CHAR(hire_date, 'Day DD Month YYYY')    AS date2
FROM   employees WHERE ROWNUM <= 2;

-- TO_CHAR: 숫자 형식
SELECT TO_CHAR(salary, 'FM$999,999')  AS sal_fmt
FROM   employees WHERE ROWNUM <= 3;

-- TO_DATE: 문자 → 날짜
SELECT TO_DATE('2024-12-25', 'YYYY-MM-DD') AS christmas
FROM   dual;` },

  { title: '6. 일반 함수와 DECODE / CASE', content: `NULL 처리 함수와 조건 표현식입니다.

**NULL 처리 함수**
| 함수 | 역할 | MySQL 대응 |
|------|------|-----------|
| NVL(e, d) | NULL이면 d 반환 | IFNULL() |
| NVL2(e, a, b) | NULL 아니면 a, NULL이면 b | IF(e IS NOT NULL, a, b) |
| NULLIF(e1, e2) | e1=e2이면 NULL, 아니면 e1 | NULLIF() |
| COALESCE(v1,...) | 첫 번째 NOT NULL 반환 | COALESCE() |

**DECODE — Oracle 전용 IF-THEN-ELSE**
\`\`\`sql
DECODE(expr, s1,r1, s2,r2, ..., default)
-- MySQL에는 없는 Oracle 고유 함수
\`\`\`

**CASE — SQL 표준 조건 표현식**
\`\`\`sql
-- 단순 CASE (등치)
CASE expr WHEN val THEN result ... ELSE d END
-- 검색 CASE (임의 조건)
CASE WHEN cond THEN result ... ELSE d END
\`\`\``, code: `-- NVL2: NULL 여부에 따른 다른 값
SELECT last_name,
       NVL2(commission_pct, '커미션 있음', '커미션 없음') AS comm_status
FROM   employees WHERE ROWNUM <= 5;

-- DECODE: job_id별 급여 인상률 (Oracle 전용)
SELECT last_name, job_id,
       DECODE(job_id, 'IT_PROG', salary*1.1,
                      'SA_REP',  salary*1.2,
                                 salary*1.05) AS new_sal
FROM   employees WHERE ROWNUM <= 5;

-- CASE: 급여 구간별 등급
SELECT last_name, salary,
       CASE WHEN salary >= 10000 THEN '상'
            WHEN salary >= 5000  THEN '중'
            ELSE '하' END AS grade
FROM   employees WHERE ROWNUM <= 7;` },

  { title: '7. 함수 중첩과 종합 정리', content: `단일행 함수는 중첩하여 복잡한 변환을 수행할 수 있습니다.

**함수 중첩 원칙**
- 안쪽 함수가 먼저 실행됨
- 최대 중첩 단계 제한 없음
- 가독성을 위해 적절히 사용

**ch03 핵심 요약**
| 범주 | 대표 함수 | Oracle 특유 |
|------|-----------|------------|
| 문자 | SUBSTR, LENGTH | INITCAP, INSTR |
| 숫자 | ROUND, TRUNC, MOD | — |
| 날짜 | SYSDATE, TRUNC | MONTHS_BETWEEN, ADD_MONTHS, NEXT_DAY, LAST_DAY |
| 변환 | TO_CHAR | TO_DATE, TO_NUMBER |
| 일반 | COALESCE, NULLIF | NVL, NVL2, DECODE |`, code: `-- 종합: 직원 보고서
SELECT UPPER(last_name) || ', ' || INITCAP(first_name)     AS name,
       TO_CHAR(hire_date, 'YYYY-MM-DD')                    AS hire_dt,
       TRUNC(MONTHS_BETWEEN(SYSDATE,hire_date)/12)||'년'   AS tenure,
       TO_CHAR(salary*12, 'FM$9,999,999')                  AS annual_sal,
       NVL2(commission_pct, '커미션O', '커미션X')           AS comm_yn,
       CASE WHEN salary >= 10000 THEN '상'
            WHEN salary >= 5000  THEN '중'
            ELSE '하' END                                   AS grade
FROM   employees
WHERE  ROWNUM <= 5;` },
]

const CH04_SECTIONS = [
  { title: '1. 그룹 함수 개요', content: `그룹 함수(집계 함수)는 여러 행을 하나의 결과로 집계합니다. Oracle에서는 GROUP BY와 함께 사용하여 데이터를 요약합니다.

**주요 그룹 함수**
| 함수 | 설명 | NULL 처리 |
|------|------|-----------|
| COUNT(*) | 전체 행 수 | NULL 포함 |
| COUNT(col) | 컬럼 값 있는 행 수 | NULL 제외 |
| SUM(col) | 합계 | NULL 무시 |
| AVG(col) | 평균 | NULL 무시 |
| MAX(col) | 최댓값 | NULL 무시 |
| MIN(col) | 최솟값 | NULL 무시 |

**중요:** 그룹 함수는 NULL 값을 자동으로 무시합니다. AVG(commission_pct)는 NULL이 아닌 행들의 평균만 계산합니다.

**COUNT(*) vs COUNT(column)**
- COUNT(*): NULL 포함 모든 행 카운트
- COUNT(column): NULL이 아닌 행만 카운트
- COUNT(DISTINCT column): 중복 제거 후 카운트`, code: `-- 전체 직원 통계 (GROUP BY 없음 = 전체가 하나의 그룹)
SELECT COUNT(*)                    AS 전체직원수,
       COUNT(commission_pct)        AS 커미션보유수,
       ROUND(AVG(salary), 2)        AS 평균급여,
       SUM(salary)                  AS 급여합계,
       MAX(salary)                  AS 최고급여,
       MIN(hire_date)               AS 최초입사일
FROM   employees;

-- NULL 처리 비교: AVG vs AVG(NVL)
SELECT ROUND(AVG(commission_pct),       4) AS NULL_제외_평균,
       ROUND(AVG(NVL(commission_pct,0)), 4) AS NULL_0포함_평균
FROM   employees;` },

  { title: '2. GROUP BY 절', content: `GROUP BY는 지정한 컬럼의 고유한 값(또는 조합)마다 하나의 그룹을 생성합니다.

**핵심 규칙**
- SELECT에 그룹 함수 + 일반 컬럼을 함께 쓰면 일반 컬럼은 반드시 GROUP BY에 포함
- GROUP BY에서 SELECT 별칭 사용 불가 (GROUP BY가 SELECT보다 먼저 실행)
- GROUP BY에 NULL 값도 하나의 그룹으로 처리됨

**SQL 실행 순서**
\`\`\`
FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY
\`\`\`

**ORA-00979** 오류: SELECT의 비집계 컬럼이 GROUP BY에 없을 때 발생합니다.`, code: `-- 부서별 직원 수와 평균 급여
SELECT department_id,
       COUNT(*)             AS 직원수,
       ROUND(AVG(salary),2) AS 평균급여
FROM   employees
GROUP BY department_id
ORDER BY department_id;

-- 부서·직무 조합별 집계 (두 컬럼 모두 GROUP BY에 포함)
SELECT department_id,
       job_id,
       COUNT(*) AS 직원수,
       SUM(salary) AS 급여합계
FROM   employees
GROUP BY department_id, job_id
ORDER BY department_id, job_id;

-- 입사 연도별 입사자 수
SELECT TO_CHAR(hire_date, 'YYYY') AS 입사연도,
       COUNT(*)                    AS 입사자수
FROM   employees
GROUP BY TO_CHAR(hire_date, 'YYYY')
ORDER BY 입사연도;` },

  { title: '3. HAVING 절', content: `HAVING은 GROUP BY 이후 집계된 그룹을 필터링합니다. WHERE와의 차이가 중요합니다.

**WHERE vs HAVING**
| 항목 | WHERE | HAVING |
|------|-------|--------|
| 처리 대상 | 개별 행 | 그룹 |
| 실행 순서 | GROUP BY 이전 | GROUP BY 이후 |
| 집계 함수 | 사용 불가 (ORA-00934) | 사용 가능 |

**성능 팁:** 집계 함수가 없는 조건은 WHERE에 작성하면 GROUP BY 처리 대상이 줄어 더 빠릅니다.`, code: `-- 직원 수가 5명 이상인 부서
SELECT department_id,
       COUNT(*) AS 직원수
FROM   employees
GROUP BY department_id
HAVING COUNT(*) >= 5
ORDER BY COUNT(*) DESC;

-- WHERE + HAVING 조합
-- WHERE: 그룹화 전 행 필터 / HAVING: 그룹화 후 그룹 필터
SELECT department_id,
       ROUND(AVG(salary), 2) AS 평균급여
FROM   employees
WHERE  job_id != 'SA_REP'          -- 먼저 행 필터
GROUP BY department_id
HAVING AVG(salary) > 7000          -- 집계 후 그룹 필터
ORDER BY AVG(salary) DESC;

-- 오류 예시: WHERE에 집계 함수 사용 불가
-- SELECT department_id FROM employees
-- WHERE COUNT(*) > 5              -- ORA-00934 오류!
-- GROUP BY department_id;` },

  { title: '4. ROLLUP · CUBE · GROUPING SETS', content: `Oracle 전용 확장 GROUP BY로 소계와 합계를 자동 생성합니다. MySQL에는 제한적인 동등 기능만 있습니다.

**ROLLUP(col1, col2)**
- (col1, col2) 상세 + col1 소계 + 전체 합계 (n+1개 집계)
- 계층적 구조에 적합

**CUBE(col1, col2)**
- 모든 가능한 조합 (col1,col2), (col1), (col2), () 집계
- 교차 분석(Cross-tab)에 적합

**GROUPING SETS((a,b),(a),())**
- 필요한 집계 조합만 명시적으로 지정

**GROUPING(col) 함수**
- 소계/총계 행: 1 반환
- 일반 행: 0 반환 (소계 NULL과 실제 NULL 구분용)`, code: `-- ROLLUP: 부서별 소계 + 전체 합계
SELECT CASE WHEN GROUPING(department_id)=1
            THEN '전체합계'
            ELSE NVL(TO_CHAR(department_id),'미배정')
       END AS 부서,
       SUM(salary) AS 급여합계
FROM   employees
GROUP BY ROLLUP(department_id);

-- ROLLUP: 부서·직무별 상세 + 부서 소계 + 전체 합계
SELECT department_id,
       job_id,
       SUM(salary) AS 급여합계
FROM   employees
GROUP BY ROLLUP(department_id, job_id)
ORDER BY department_id, job_id;

-- GROUPING SETS: 원하는 집계만 선택
SELECT department_id,
       job_id,
       SUM(salary) AS 급여합계
FROM   employees
GROUP BY GROUPING SETS((department_id, job_id), (department_id), ());` },

  { title: '5. LISTAGG와 종합 정리', content: `LISTAGG는 그룹 내 값을 지정 구분자로 연결하는 Oracle 전용 집계 함수입니다. MySQL의 GROUP_CONCAT()에 해당합니다.

**LISTAGG 구문**
\`\`\`sql
LISTAGG(column, delimiter) WITHIN GROUP (ORDER BY col)
\`\`\`

**Oracle 19c 추가 옵션**
- ON OVERFLOW TRUNCATE: 4000자 초과 시 잘라냄
- ON OVERFLOW ERROR: 초과 시 오류 (기본값)

**그룹 함수 중첩**
Oracle에서 그룹 함수를 한 단계 중첩할 수 있습니다:
- AVG(SUM(salary)): 부서별 급여 합계의 평균

**전체 흐름 요약**
\`\`\`
FROM → WHERE(행 필터) → GROUP BY(그룹화)
→ HAVING(그룹 필터) → SELECT → ORDER BY
\`\`\``, code: `-- LISTAGG: 부서별 직원 이름 목록
SELECT department_id,
       LISTAGG(last_name, ', ')
         WITHIN GROUP (ORDER BY last_name) AS 직원목록
FROM   employees
WHERE  department_id IN (50, 60, 90)
GROUP BY department_id;

-- LISTAGG ON OVERFLOW TRUNCATE (Oracle 19c)
SELECT department_id,
       LISTAGG(last_name, ', ' ON OVERFLOW TRUNCATE '...')
         WITHIN GROUP (ORDER BY last_name) AS 직원목록
FROM   employees
GROUP BY department_id;

-- 그룹 함수 중첩: 부서별 급여합계의 최댓값
SELECT MAX(SUM(salary)) AS 최대급여합계
FROM   employees
GROUP BY department_id;

-- 종합: 평균 급여보다 높은 부서 + 직원 목록
SELECT department_id,
       ROUND(AVG(salary), 0)                                    AS 평균급여,
       LISTAGG(last_name, ', ') WITHIN GROUP (ORDER BY salary DESC) AS 직원목록
FROM   employees
GROUP BY department_id
HAVING AVG(salary) > (SELECT AVG(salary) FROM employees)
ORDER BY AVG(salary) DESC;` },
]

const CH05_SECTIONS = [
  { title: '1. 조인 개요와 카테시안 곱', content: `조인(JOIN)은 두 개 이상의 테이블에서 관련 데이터를 결합합니다. Oracle은 ANSI 표준 구문과 Oracle 전통 구문 두 가지를 모두 지원합니다.

**카테시안 곱 (Cartesian Product)**
- 조인 조건이 없을 때 발생
- 테이블 A(n행) × 테이블 B(m행) = n×m행
- 반드시 올바른 조인 조건으로 방지해야 함

**조인 종류 요약**
| 종류 | 설명 |
|------|------|
| INNER JOIN | 조건 만족하는 행만 반환 |
| LEFT OUTER JOIN | 왼쪽 테이블 전체 + 매핑되는 오른쪽 |
| RIGHT OUTER JOIN | 오른쪽 테이블 전체 + 매핑되는 왼쪽 |
| FULL OUTER JOIN | 양쪽 테이블 모두 포함 |
| SELF JOIN | 같은 테이블끼리 조인 |
| NON-EQUIJOIN | = 이외의 조건으로 조인 |
| CROSS JOIN | 카테시안 곱 명시 |

**n개 테이블 → 최소 (n-1)개 조인 조건 필요**`, code: `-- 카테시안 곱 예시 (조인 조건 없음 — 의도하지 않은 결과 주의)
SELECT e.last_name, d.department_name
FROM   employees e, departments d;
-- 107 × 27 = 2889행 반환!

-- 올바른 INNER JOIN
SELECT e.last_name, d.department_name
FROM   employees   e
JOIN   departments d ON e.department_id = d.department_id;
-- 106행 반환 (department_id가 NULL인 직원 1명 제외)` },

  { title: '2. INNER JOIN — ANSI와 Oracle 전통 구문', content: `INNER JOIN은 두 테이블에서 조인 조건을 만족하는 행만 반환합니다.

**ANSI 구문 (권장)**
\`\`\`sql
SELECT ... FROM t1 JOIN t2 ON t1.col = t2.col
SELECT ... FROM t1 JOIN t2 USING (col_name)
SELECT ... FROM t1 NATURAL JOIN t2
\`\`\`

**Oracle 전통 구문**
\`\`\`sql
SELECT ... FROM t1, t2 WHERE t1.col = t2.col
\`\`\`

**JOIN ... USING 주의사항**
- USING 절의 컬럼에 테이블 별칭 사용 불가 (ORA-25154)
- 두 테이블의 컬럼 이름이 동일해야 함

**NATURAL JOIN 주의사항**
- 이름이 같은 모든 컬럼을 자동 조인 조건으로 사용 → 의도치 않은 행 제외 가능`, code: `-- ANSI INNER JOIN (ON 절)
SELECT e.last_name, d.department_name
FROM   employees   e
JOIN   departments d ON e.department_id = d.department_id;

-- Oracle 전통 구문 (동일 결과)
SELECT e.last_name, d.department_name
FROM   employees   e,
       departments d
WHERE  e.department_id = d.department_id;

-- JOIN USING (컬럼 이름 동일 시)
SELECT last_name, department_name
FROM   employees
JOIN   departments USING (department_id);  -- 별칭 없이 컬럼명만

-- 3테이블 조인
SELECT e.last_name, d.department_name, l.city
FROM   employees   e
JOIN   departments d ON e.department_id = d.department_id
JOIN   locations   l ON d.location_id   = l.location_id;` },

  { title: '3. NON-EQUIJOIN과 SELF JOIN', content: `**NON-EQUIJOIN (비등가 조인)**
= 이외의 연산자(BETWEEN, <, >, <=, >=)를 조인 조건으로 사용합니다.

대표 사례: 직원 급여 → 급여 등급 테이블의 범위에 매핑

**SELF JOIN (자기 조인)**
동일한 테이블을 서로 다른 별칭으로 두 번 참조합니다.

대표 사례:
- 직원(e)의 manager_id → 관리자(m)의 employee_id 연결
- 같은 부서 직원 쌍 조회
- 같은 급여 직원 비교`, code: `-- NON-EQUIJOIN: 급여 등급 조회 (BETWEEN 사용)
SELECT e.last_name,
       e.salary,
       j.grade
FROM   employees  e
JOIN   job_grades j ON e.salary BETWEEN j.lowest_sal AND j.highest_sal;

-- SELF JOIN: 직원과 관리자 이름 조회
SELECT e.last_name AS 직원,
       m.last_name AS 관리자
FROM   employees e
JOIN   employees m ON e.manager_id = m.employee_id
ORDER BY m.last_name;

-- SELF JOIN: 같은 부서 직원 쌍 (중복 제거)
SELECT e1.department_id,
       e1.last_name AS 직원1,
       e2.last_name AS 직원2
FROM   employees e1
JOIN   employees e2
    ON  e1.department_id = e2.department_id
   AND  e1.employee_id   < e2.employee_id;` },

  { title: '4. OUTER JOIN — LEFT, RIGHT, FULL', content: `OUTER JOIN은 조인 조건을 만족하지 않는 행도 결과에 포함합니다.

**LEFT OUTER JOIN**
- 왼쪽 테이블의 모든 행 유지
- 오른쪽에서 일치하지 않으면 NULL 채움

**RIGHT OUTER JOIN**
- 오른쪽 테이블의 모든 행 유지
- 왼쪽에서 일치하지 않으면 NULL 채움

**FULL OUTER JOIN**
- 양쪽 모두 포함, ANSI 구문 필수 (Oracle (+) 불가)

**Oracle (+) 전통 구문**
- WHERE t1.col = t2.col(+) → t1 기준 LEFT OUTER JOIN
- WHERE t1.col(+) = t2.col → t2 기준 RIGHT OUTER JOIN
- (+)를 양쪽에 사용하면 오류 발생 (FULL OUTER JOIN 불가)`, code: `-- LEFT OUTER JOIN: 부서 없는 직원 포함
SELECT e.last_name, d.department_name
FROM   employees   e
LEFT   JOIN departments d ON e.department_id = d.department_id;

-- Oracle (+) 전통 구문 (동일 결과)
SELECT e.last_name, d.department_name
FROM   employees   e, departments d
WHERE  e.department_id = d.department_id(+);

-- RIGHT OUTER JOIN: 직원 없는 부서 포함
SELECT d.department_name, COUNT(e.employee_id) AS 직원수
FROM   employees   e
RIGHT  JOIN departments d ON e.department_id = d.department_id
GROUP BY d.department_name
ORDER BY d.department_name;

-- FULL OUTER JOIN (ANSI 필수)
SELECT e.last_name, d.department_name
FROM   employees   e
FULL   JOIN departments d ON e.department_id = d.department_id
WHERE  e.employee_id IS NULL OR d.department_id IS NULL;` },

  { title: '5. CROSS JOIN · 다중 조인 · 종합 정리', content: `**CROSS JOIN**
조인 조건 없이 모든 행의 조합을 반환합니다.
- ANSI: FROM t1 CROSS JOIN t2
- Oracle 전통: FROM t1, t2 (WHERE 조건 없음)

**다중 테이블 조인**
- JOIN을 순차적으로 연결
- n개 테이블 → (n-1)개 조인 조건

**조인 구문 비교표**
| 구분 | ANSI 구문 | Oracle (+) |
|------|-----------|------------|
| INNER | JOIN ... ON | WHERE t1.c = t2.c |
| LEFT OUTER | LEFT JOIN ... ON | WHERE t1.c = t2.c(+) |
| RIGHT OUTER | RIGHT JOIN ... ON | WHERE t1.c(+) = t2.c |
| FULL OUTER | FULL JOIN ... ON | **불가** |
| CROSS | CROSS JOIN | FROM t1, t2 (조건 없음) |

**권장:** Oracle 19c에서는 ANSI 표준 구문 사용 권장`, code: `-- CROSS JOIN (107 × 27 = 2889행)
SELECT e.last_name, d.department_name
FROM   employees   e
CROSS  JOIN departments d;

-- 4테이블 다중 조인
SELECT e.last_name, j.job_title, d.department_name, l.city
FROM   employees   e
JOIN   jobs        j ON e.job_id        = j.job_id
JOIN   departments d ON e.department_id = d.department_id
JOIN   locations   l ON d.location_id   = l.location_id
ORDER BY l.city;

-- 관리자가 없는 직원 포함 SELF JOIN + 부서 INNER JOIN 혼합
SELECT e.last_name                    AS 직원,
       NVL(m.last_name, '최고경영자') AS 관리자,
       d.department_name
FROM   employees   e
LEFT   JOIN employees   m ON e.manager_id    = m.employee_id
JOIN   departments  d ON e.department_id = d.department_id
ORDER BY d.department_name, e.last_name;` },

  { title: '6. 조인 심화 — ON 절과 WHERE 절 차이', content: `**OUTER JOIN에서 ON 절과 WHERE 절의 차이**

| 위치 | 처리 시점 | OUTER JOIN 영향 |
|------|-----------|----------------|
| ON 절 추가 조건 | 조인 단계 | 불일치 행도 NULL로 포함 |
| WHERE 절 조건 | 조인 완료 후 | NULL 행 제거 (INNER JOIN화) |

**INNER JOIN에서는 ON과 WHERE 위치가 결과에 영향 없음**

**조인 최적화 팁**
- 조인 컬럼에 인덱스 생성
- WHERE로 먼저 행을 줄인 후 조인
- 불필요한 컬럼 SELECT 피하기
- INNER JOIN 가능하면 OUTER JOIN 대신 사용`, code: `-- OUTER JOIN에서 ON vs WHERE 차이 비교

-- ① ON에 추가 조건: 부서 90이 아니어도 직원 행은 유지됨
SELECT e.last_name, d.department_id, d.department_name
FROM   employees   e
LEFT   JOIN departments d
    ON  e.department_id = d.department_id
   AND  d.department_id = 90;
-- 107행 반환, 부서 90 외 직원은 department_name = NULL

-- ② WHERE에 추가 조건: 부서 90 또는 부서 없는 직원만
SELECT e.last_name, d.department_id, d.department_name
FROM   employees   e
LEFT   JOIN departments d ON e.department_id = d.department_id
WHERE  d.department_id = 90
   OR  d.department_id IS NULL;
-- 4행 반환 (부서 90: 3명 + 미배정: 1명)` },

  { title: '7. 조인 종합 실습', content: `다양한 조인 패턴을 결합한 실전 쿼리입니다.

**실전 쿼리 패턴**
1. JOIN + GROUP BY + HAVING — 부서 통계
2. SELF JOIN + OUTER JOIN — 조직도
3. 다중 JOIN + 서브쿼리 — 복합 보고서
4. FULL OUTER JOIN + NULL 필터 — 불일치 데이터 탐지

**Oracle 전통 vs ANSI 비교 요약**
- 새 개발: ANSI 구문 사용 (더 가독성 높고 FULL OUTER JOIN 지원)
- 레거시 코드 이해: Oracle (+) 구문 해독 가능해야 함
- (+)의 한계: FULL OUTER JOIN 불가, OR 조건 혼용 불가, IN 절 혼용 불가`, code: `-- 종합 예제 1: 부서별 관리자·직원수·평균급여
SELECT d.department_name,
       m.last_name                  AS 관리자,
       COUNT(e.employee_id)         AS 직원수,
       ROUND(AVG(e.salary), 2)      AS 평균급여
FROM   departments d
JOIN   employees   m ON d.manager_id    = m.employee_id
LEFT   JOIN employees   e ON e.department_id = d.department_id
GROUP BY d.department_name, m.last_name
HAVING COUNT(e.employee_id) >= 2
ORDER BY AVG(e.salary) DESC;

-- 종합 예제 2: 국가별 직원 수
SELECT c.country_name,
       COUNT(e.employee_id)    AS 직원수
FROM   employees   e
JOIN   departments d ON e.department_id = d.department_id
JOIN   locations   l ON d.location_id   = l.location_id
JOIN   countries   c ON l.country_id    = c.country_id
GROUP BY c.country_name
ORDER BY 직원수 DESC;` },
]

const CONTENT_MAP: Record<string, typeof CH24_SECTIONS> = {
  ch01: CH01_SECTIONS,
  ch02: CH02_SECTIONS,
  ch03: CH03_SECTIONS,
  ch04: CH04_SECTIONS,
  ch05: CH05_SECTIONS,
  ch22: CH22_SECTIONS,
  ch23: CH23_SECTIONS,
  ch24: CH24_SECTIONS,
}

export default function LecturePage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const ch = getChapter(id)
  const sections = CONTENT_MAP[id] ?? []
  const [current, setCurrent] = useState(0)

  if (!ch) { router.push('/'); return null }

  if (!sections.length) return (
    <div className="min-h-screen bg-apple-bg flex flex-col items-center justify-center gap-4">
      <p className="text-[17px] font-semibold text-apple-text">강의 내용 준비 중입니다</p>
      <p className="text-[14px] text-apple-secondary">곧 업데이트됩니다.</p>
      <button onClick={() => router.push(`/chapters/${id}`)}
        className="mt-2 flex items-center gap-2 px-5 py-2.5 rounded-full border border-apple-border text-[14px] font-medium text-apple-text hover:bg-apple-gray-bg transition-colors">
        <ArrowLeft size={14} /> 챕터로 돌아가기
      </button>
    </div>
  )

  const sec = sections[current]
  const isLast = current === sections.length - 1

  return (
    <div className="min-h-screen bg-apple-bg flex flex-col">
      {/* 상단 진도 */}
      <div className="sticky top-[52px] z-40 bg-white/90 border-b border-apple-border px-6 py-3"
        style={{ backdropFilter: 'blur(20px)' }}>
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between text-[13px] text-apple-secondary mb-2">
            <button onClick={() => router.push(`/chapters/${id}`)} className="flex items-center gap-1 hover:text-apple-text">
              <ArrowLeft size={14} /> CH{ch.number} {ch.title}
            </button>
            <span className="font-semibold text-apple-text">{current + 1} / {sections.length}</span>
          </div>
          <div className="h-1 rounded-full bg-apple-gray-bg overflow-hidden">
            <div className="h-full bg-apple-blue rounded-full transition-all duration-500"
              style={{ width: `${((current + 1) / sections.length) * 100}%` }} />
          </div>
        </div>
      </div>

      {/* 콘텐츠 */}
      <div className="flex-1 max-w-2xl mx-auto w-full px-6 py-10 fade-up" key={current}>
        <h2 className="text-2xl font-bold text-apple-text mb-6">{sec.title}</h2>
        <div className="text-[15px] leading-relaxed text-apple-text space-y-4 whitespace-pre-wrap mb-8">
          {sec.content}
        </div>
        {sec.code && (
          <div>
            <p className="text-[12px] font-semibold text-apple-secondary uppercase tracking-wider mb-2">SQL 예제</p>
            <pre className="text-[13px]"><code className="text-green-400">{sec.code}</code></pre>
          </div>
        )}
      </div>

      {/* 하단 네비게이션 */}
      <div className="sticky bottom-0 bg-white/90 border-t border-apple-border px-6 py-4"
        style={{ backdropFilter: 'blur(20px)' }}>
        <div className="max-w-2xl mx-auto flex justify-between items-center">
          <button onClick={() => setCurrent(p => p - 1)} disabled={current === 0}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-apple-border text-[14px] font-medium text-apple-text
              disabled:opacity-30 hover:bg-apple-gray-bg transition-colors">
            <ArrowLeft size={14} /> 이전
          </button>

          {isLast ? (
            <button onClick={() => router.push(`/chapters/${id}`)}
              className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-apple-blue text-white text-[14px] font-semibold hover:bg-apple-blue-dark transition-colors">
              완료 <ArrowRight size={14} />
            </button>
          ) : (
            <button onClick={() => setCurrent(p => p + 1)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-apple-blue text-white text-[14px] font-semibold hover:bg-apple-blue-dark transition-colors">
              다음 <ArrowRight size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
