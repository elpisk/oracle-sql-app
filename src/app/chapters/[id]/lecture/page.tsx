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

const CONTENT_MAP: Record<string, typeof CH24_SECTIONS> = {
  ch01: CH01_SECTIONS,
  ch02: CH02_SECTIONS,
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
