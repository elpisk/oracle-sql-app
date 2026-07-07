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

const CH06_SECTIONS = [
  { title: '1. 서브쿼리 개요', content: `서브쿼리(Subquery)는 다른 SQL 문 안에 중첩된 SELECT 문입니다. 괄호로 감싸야 하며, 외부 쿼리(메인 쿼리)에 필요한 값을 제공합니다.

**서브쿼리 분류**
| 기준 | 종류 | 특징 |
|------|------|------|
| 반환 행 수 | 단일행 | 1행 반환, =/>/<와 사용 |
| | 다중행 | 0~N행 반환, IN/ANY/ALL/EXISTS와 사용 |
| 사용 위치 | WHERE/HAVING | 조건 필터링 |
| | FROM (인라인 뷰) | 임시 테이블처럼 사용 |
| | SELECT (스칼라) | 1행 1컬럼 반환 |
| 외부 참조 | 비상관 | 독립 실행 가능 |
| | 상관 | 외부 쿼리 컬럼 참조, 행마다 실행 |

**서브쿼리 사용 규칙**
- 반드시 괄호로 감싸야 함
- 단일행 연산자와 사용하는 서브쿼리는 반드시 1행만 반환
- 일반적으로 서브쿼리에서는 ORDER BY 미사용 (인라인 뷰 예외)`, code: `-- 서브쿼리 기본 구조: 평균보다 높은 급여 직원
SELECT last_name, salary
FROM   employees
WHERE  salary > (SELECT AVG(salary)    -- 서브쿼리
                 FROM   employees);    -- 결과: 6461.83

-- 서브쿼리 실행 순서: 서브쿼리 먼저 → 외부 쿼리
-- 1) SELECT AVG(salary) FROM employees → 6461.83
-- 2) WHERE salary > 6461.83 로 필터링` },

  { title: '2. 단일행 서브쿼리', content: `단일행 서브쿼리는 정확히 1행 1컬럼을 반환합니다. 단일행 비교 연산자(=, >, <, >=, <=, <>)와 함께 사용합니다.

**주의사항**
- 서브쿼리가 0행 반환 → 비교 값 = NULL → 조건 FALSE (결과 0행)
- 서브쿼리가 2행 이상 반환 → ORA-01427 오류

**HAVING 절에서도 사용 가능**
- HAVING AVG(salary) > (SELECT AVG(salary) FROM employees)

**WHERE, HAVING 모두 단일행 서브쿼리 지원**`, code: `-- Abel과 같은 부서의 직원 조회
SELECT last_name, department_id
FROM   employees
WHERE  department_id = (SELECT department_id
                        FROM   employees
                        WHERE  last_name = 'Abel');

-- 최고 급여자 조회
SELECT last_name, salary
FROM   employees
WHERE  salary = (SELECT MAX(salary) FROM employees);

-- HAVING에서 서브쿼리: 전체 평균보다 높은 부서
SELECT department_id, ROUND(AVG(salary), 2) AS 평균급여
FROM   employees
GROUP BY department_id
HAVING AVG(salary) > (SELECT AVG(salary) FROM employees)
ORDER BY AVG(salary) DESC;` },

  { title: '3. 다중행 서브쿼리 — IN / ANY / ALL', content: `다중행 서브쿼리는 0~N행을 반환합니다. IN, ANY, ALL, EXISTS 연산자와 함께 사용합니다.

**IN / NOT IN**
- IN: 목록 중 하나라도 일치
- NOT IN: 목록에 없는 경우 (NULL 포함 시 주의!)

**ANY / ALL**
| 연산자 | 의미 |
|--------|------|
| >ANY | 최솟값보다 큼 |
| <ANY | 최댓값보다 작음 |
| =ANY | IN과 동일 |
| >ALL | 최댓값보다 큼 |
| <ALL | 최솟값보다 작음 |
| <>ALL | NOT IN과 동일 |

**NOT IN + NULL 함정**
서브쿼리 결과에 NULL이 포함되면 NOT IN 전체 결과가 0행이 됩니다. NOT EXISTS로 대체하거나, 서브쿼리에 WHERE col IS NOT NULL 추가합니다.`, code: `-- IN: Seattle 위치 부서 직원
SELECT last_name, department_id
FROM   employees
WHERE  department_id IN (
         SELECT department_id
         FROM   departments d JOIN locations l ON d.location_id = l.location_id
         WHERE  l.city = 'Seattle');

-- >ANY: 부서 20,50의 최솟값보다 높은 직원
SELECT last_name, salary FROM employees
WHERE  salary > ANY (SELECT salary FROM employees WHERE department_id IN (20, 50));

-- >ALL: 부서 20,50의 최댓값보다 높은 직원
SELECT last_name, salary FROM employees
WHERE  salary > ALL (SELECT salary FROM employees WHERE department_id IN (20, 50));

-- NOT IN + NULL 안전 처리
SELECT last_name FROM employees
WHERE  department_id NOT IN (
         SELECT department_id FROM employees
         WHERE  commission_pct IS NOT NULL
         AND    department_id IS NOT NULL);  -- NULL 제거 필수!` },

  { title: '4. EXISTS · NOT EXISTS · 상관 서브쿼리', content: `**상관 서브쿼리 (Correlated Subquery)**
외부 쿼리의 컬럼을 참조하며, 외부 쿼리 행마다 한 번씩 실행됩니다.

**EXISTS / NOT EXISTS**
- EXISTS: 서브쿼리가 1행 이상 반환 → TRUE
- NOT EXISTS: 서브쿼리가 0행 반환 → TRUE
- 값이 아닌 존재 여부만 확인 → NULL 안전

**EXISTS vs IN 비교**
| 항목 | EXISTS | IN |
|------|--------|----|
| NULL 처리 | 안전 | NULL 포함 시 위험 |
| 대용량 | 유리 (즉시 중단) | 전체 목록 생성 |
| 용도 | 존재 여부 확인 | 값 목록 비교 |

**NOT EXISTS가 NOT IN보다 안전한 이유**
NOT EXISTS는 값을 비교하지 않으므로 NULL의 영향을 받지 않습니다.`, code: `-- EXISTS: 부하 직원이 있는 관리자 조회
SELECT employee_id, last_name, job_id
FROM   employees mgr
WHERE  EXISTS (SELECT 1
               FROM   employees sub
               WHERE  sub.manager_id = mgr.employee_id);

-- NOT EXISTS: 직원이 없는 부서 조회 (NULL 안전)
SELECT department_id, department_name
FROM   departments d
WHERE  NOT EXISTS (SELECT 1
                   FROM   employees e
                   WHERE  e.department_id = d.department_id);

-- 상관 서브쿼리: 부서 평균보다 높은 급여 직원
SELECT last_name, salary, department_id
FROM   employees e_outer
WHERE  salary > (SELECT AVG(salary)
                 FROM   employees e_inner
                 WHERE  e_inner.department_id = e_outer.department_id);` },

  { title: '5. 인라인 뷰와 Top-N 쿼리', content: `**인라인 뷰 (Inline View)**
FROM 절에 작성하는 서브쿼리로, 임시 테이블처럼 사용합니다. 반드시 별칭이 필요합니다.

**Oracle Top-N 쿼리 패턴**
ROWNUM은 행이 반환되기 전에 부여됩니다. ORDER BY와 같이 쓰면 정렬 전에 ROWNUM이 부여되어 잘못된 결과가 나옵니다.

올바른 Top-N 방법:
1. 인라인 뷰에서 ORDER BY로 정렬
2. 외부 쿼리에서 WHERE ROWNUM <= N

**Oracle 12c+ FETCH 문법**
\`\`\`sql
SELECT ... FROM ... ORDER BY col
FETCH FIRST N ROWS ONLY;
FETCH FIRST N PERCENT ROWS ONLY;
OFFSET N ROWS FETCH NEXT M ROWS ONLY;  -- 페이징
\`\`\``, code: `-- Top-5 급여 직원 (ROWNUM 기반)
SELECT last_name, salary
FROM  (SELECT last_name, salary
       FROM   employees
       ORDER BY salary DESC)
WHERE  ROWNUM <= 5;

-- 잘못된 방법 (ROWNUM이 정렬 전에 적용됨)
-- SELECT last_name, salary FROM employees
-- WHERE ROWNUM <= 5 ORDER BY salary DESC;  -- 틀림!

-- 인라인 뷰: 부서 평균 급여와 JOIN
SELECT e.last_name, e.salary, ROUND(d.avg_sal, 2) AS 부서평균
FROM   employees e
JOIN  (SELECT department_id, AVG(salary) AS avg_sal
       FROM   employees GROUP BY department_id) d
    ON  e.department_id = d.department_id
WHERE  e.salary > d.avg_sal;

-- ROWNUM 기반 페이징 (4~6번째 행)
SELECT last_name, hire_date, rn
FROM  (SELECT last_name, hire_date, ROWNUM rn
       FROM  (SELECT last_name, hire_date FROM employees ORDER BY hire_date))
WHERE  rn BETWEEN 4 AND 6;` },

  { title: '6. WITH 절(CTE)과 다중컬럼 서브쿼리', content: `**WITH 절 (CTE: Common Table Expression)**
반복 사용되는 서브쿼리에 이름을 부여하여 재사용합니다.

\`\`\`sql
WITH cte1 AS (SELECT ...),
     cte2 AS (SELECT ...)
SELECT ... FROM cte1 JOIN cte2 ...
\`\`\`

재귀 WITH 절도 지원합니다(UNION ALL).

**다중컬럼 서브쿼리**
두 개 이상의 컬럼을 동시에 비교합니다.

- **쌍 비교 (Pairwise)**: (col1, col2) IN (SELECT col1, col2 FROM ...)
  → 두 컬럼의 조합이 정확히 일치해야 함
- **비쌍 비교 (Non-Pairwise)**: col1 IN (...) AND col2 IN (...)
  → 각 컬럼을 독립적으로 비교, 의도치 않은 조합 포함 가능`, code: `-- WITH 절: 부서 통계 + 전체 평균 비교
WITH dept_avg AS (
  SELECT department_id, AVG(salary) AS avg_sal
  FROM   employees GROUP BY department_id
),
total_avg AS (
  SELECT AVG(salary) AS total FROM employees
)
SELECT d.department_id,
       ROUND(d.avg_sal, 2) AS 부서평균,
       ROUND(t.total, 2)   AS 전체평균
FROM   dept_avg d CROSS JOIN total_avg t
WHERE  d.avg_sal > t.total
ORDER BY d.avg_sal DESC;

-- 다중컬럼 쌍 비교: 각 부서 최저 급여자
SELECT last_name, department_id, salary
FROM   employees
WHERE  (department_id, salary) IN (
         SELECT department_id, MIN(salary)
         FROM   employees
         GROUP BY department_id)
ORDER BY department_id;` },
]

const CH07_SECTIONS = [
  { title: '1. 집합 연산자란?', content: `집합 연산자(Set Operator)는 두 개 이상의 SELECT 문의 결과를 하나로 합치는 연산자입니다. 수학의 집합 연산(합집합, 교집합, 차집합)과 동일한 개념입니다.

**집합 연산자 종류**
| 연산자 | 의미 | 중복 처리 |
|--------|------|-----------|
| UNION | 합집합 | 중복 제거 |
| UNION ALL | 합집합 | 중복 포함 |
| INTERSECT | 교집합 | 중복 제거 |
| MINUS | 차집합 | 중복 제거 |

**사용 규칙**
1. SELECT 목록의 **열 개수가 일치**해야 함
2. 대응되는 열의 **데이터 타입이 호환**되어야 함
3. **ORDER BY** 절은 복합 쿼리 맨 끝에 한 번만 사용
4. 결과의 **열 이름은 첫 번째 SELECT** 쿼리 기준`, code: `-- 집합 연산자 기본 구문
SELECT column1, column2
FROM   table1
UNION | UNION ALL | INTERSECT | MINUS
SELECT column1, column2
FROM   table2
[ORDER BY column1];` },

  { title: '2. UNION / UNION ALL', content: `**UNION**: 두 쿼리의 합집합, 중복 제거
**UNION ALL**: 두 쿼리의 합집합, 중복 포함

UNION ALL은 중복 제거를 위한 정렬 작업이 없으므로 UNION보다 빠릅니다.

**UNION vs UNION ALL 비교**
| 항목 | UNION | UNION ALL |
|------|-------|-----------|
| 중복 제거 | O | X |
| 정렬 | 기본 오름차순 | 없음 |
| 성능 | 느림 | 빠름 |

> **권장:** 두 쿼리 결과에 중복이 없음을 확신할 때는 UNION ALL 사용`, code: `-- UNION: 현재 직무 + 과거 직무 고유 목록
SELECT job_id
FROM   employees
UNION
SELECT job_id
FROM   job_history
ORDER BY job_id;

-- UNION ALL: 중복 포함 전체 목록 (107 + 10 = 117행)
SELECT job_id
FROM   employees
UNION ALL
SELECT job_id
FROM   job_history
ORDER BY job_id;` },

  { title: '3. INTERSECT / MINUS', content: `**INTERSECT (교집합)**: 두 쿼리 결과에 공통으로 존재하는 행만 반환

**MINUS (차집합)**: 첫 번째 쿼리 결과에서 두 번째 쿼리 결과에 있는 행을 제거

> **MINUS 주의사항:** NOT IN 서브쿼리에 NULL이 포함되면 0행이 반환될 수 있지만, MINUS는 NULL을 안전하게 처리합니다.`, code: `-- INTERSECT: 현직무와 과거직무가 동일한 사원
SELECT employee_id, job_id
FROM   employees
INTERSECT
SELECT employee_id, job_id
FROM   job_history;
-- 결과: 176, SA_REP (1행)

-- MINUS: 직무 변경 이력이 없는 사원
SELECT employee_id FROM employees
MINUS
SELECT employee_id FROM job_history
ORDER BY employee_id;
-- 결과: 97행

-- MINUS: 빈 부서 목록 (사원 없는 부서)
SELECT department_id FROM departments
MINUS
SELECT department_id FROM employees
WHERE  department_id IS NOT NULL
ORDER BY department_id;
-- 결과: 120~270 (16개 빈 부서)` },

  { title: '4. 열 일치 · ORDER BY · 우선순위', content: `**열 개수/타입 불일치 시 NULL 변환 사용**
없는 열 자리에 TO_CHAR(NULL), TO_DATE(NULL), 0 등으로 채워 맞춤

**ORDER BY 규칙**
- 복합 쿼리 맨 끝에 한 번만 작성
- 첫 번째 SELECT 쿼리의 열 이름 또는 별칭 사용
- 열 위치 번호(ORDER BY 2) 사용 가능

**집합 연산자 우선순위 (Oracle)**
INTERSECT > UNION = UNION ALL = MINUS
→ 명시적 괄호로 순서를 제어하는 것이 권장됩니다.`, code: `-- 열 타입 불일치 시 NULL 변환
SELECT location_id, department_name "Name", TO_CHAR(NULL) "City"
FROM   departments
UNION
SELECT location_id, TO_CHAR(NULL) "Name", city
FROM   locations
ORDER BY location_id;

-- ORDER BY 열 번호: salary(3번째 열) 내림차순
SELECT 'A' AS grp, employee_id, salary
FROM   employees WHERE department_id = 90
UNION ALL
SELECT 'B', employee_id, salary
FROM   employees WHERE department_id = 80
ORDER BY 3 DESC;

-- 우선순위 주의: INTERSECT가 UNION보다 먼저 처리됨
-- A UNION B INTERSECT C → A UNION (B INTERSECT C)
-- 의도한 순서가 다를 경우 괄호 사용 필수` },
]

const CH08_SECTIONS = [
  { title: 'DML 개요', content: `## DML(Data Manipulation Language)이란?

DML은 테이블의 데이터를 조작하는 SQL 문의 집합입니다.

| 구문 | 기능 |
|------|------|
| INSERT | 테이블에 새 행 추가 |
| UPDATE | 테이블의 기존 행 수정 |
| DELETE | 테이블에서 행 제거 |
| TRUNCATE | 테이블의 모든 행 삭제 (DDL) |

> **DML vs DDL**: INSERT/UPDATE/DELETE는 DML로 ROLLBACK 가능합니다.
> TRUNCATE는 DDL로 자동 커밋되어 ROLLBACK이 불가합니다.

### HR 스키마 실습 테이블 준비
\`\`\`sql
-- COPY_EMP 테이블 생성 (구조만)
CREATE TABLE copy_emp AS SELECT * FROM employees WHERE 1=2;

-- 또는 데이터 포함하여 생성
CREATE TABLE copy_emp AS SELECT * FROM employees;
\`\`\`

실습 후에는 반드시 ROLLBACK 또는 COMMIT으로 트랜잭션을 종료하세요.` },

  { title: 'INSERT 문', content: `## INSERT 문 — 새 행 삽입

### 기본 구문 (열 목록 명시)
\`\`\`sql
INSERT INTO table_name (column1, column2, ...)
VALUES (value1, value2, ...);
\`\`\`

### 열 목록 생략 — 모든 열 순서대로 제공
\`\`\`sql
INSERT INTO departments
VALUES (280, 'Research', 100, 1700);
\`\`\`

### NULL 삽입
\`\`\`sql
-- 암묵적(implicit): 열 목록에서 생략
INSERT INTO departments (department_id, department_name)
VALUES (290, 'Corporate Tax');

-- 명시적(explicit): NULL 키워드 사용
INSERT INTO departments
VALUES (300, 'Strategy', NULL, NULL);
\`\`\`

### 날짜 함수 활용
\`\`\`sql
-- CURRENT_DATE: 현재 날짜/시간 (세션 시간대 기준)
INSERT INTO employees (..., hire_date, ...)
VALUES (..., CURRENT_DATE, ...);

-- TO_DATE: 문자열을 날짜로 변환
INSERT INTO employees (..., hire_date, ...)
VALUES (..., TO_DATE('15-JAN-2020', 'DD-MON-YYYY'), ...);
\`\`\`

### 서브쿼리를 이용한 다중 행 삽입
\`\`\`sql
-- VALUES 절 없이 서브쿼리 사용
INSERT INTO copy_emp
SELECT * FROM employees
WHERE  job_id LIKE '%REP%';
\`\`\`

> **주의**: 서브쿼리 방식은 VALUES 절을 사용하지 않습니다.
> 서브쿼리가 반환하는 모든 행이 한 번에 삽입됩니다.` },

  { title: 'UPDATE 문', content: `## UPDATE 문 — 기존 행 수정

### 기본 구문
\`\`\`sql
UPDATE table_name
SET    column1 = value1 [, column2 = value2, ...]
[WHERE condition];
\`\`\`

### WHERE 절 생략 시 전체 행 수정
\`\`\`sql
-- 모든 사원의 salary를 10% 인상 (주의!)
UPDATE employees
SET    salary = salary * 1.1;
\`\`\`

### 서브쿼리로 값 참조
\`\`\`sql
-- employee_id=103의 job_id, salary를 employee_id=205 기준으로 변경
UPDATE employees
SET    (job_id, salary) = (SELECT job_id, salary
                            FROM   employees
                            WHERE  employee_id = 205)
WHERE  employee_id = 103;
\`\`\`

### NULL로 업데이트
\`\`\`sql
UPDATE employees
SET    commission_pct = NULL
WHERE  employee_id = 115;
\`\`\`

### 서브쿼리 기반 조건 UPDATE
\`\`\`sql
-- 부서 50의 평균 급여보다 낮은 사원을 평균 급여로 업데이트
UPDATE employees
SET    salary = (SELECT AVG(salary) FROM employees WHERE department_id = 50)
WHERE  department_id = 50
AND    salary < (SELECT AVG(salary) FROM employees WHERE department_id = 50);
\`\`\`

> **Oracle 특성**: UPDATE 서브쿼리는 UPDATE 이전 시점의 데이터를 기준으로 계산됩니다.` },

  { title: 'DELETE / TRUNCATE 문', content: `## DELETE 문 — 행 삭제

### 기본 구문
\`\`\`sql
DELETE FROM table_name
[WHERE condition];
\`\`\`

### 단일 행 삭제
\`\`\`sql
DELETE FROM departments
WHERE  department_id = 300;
\`\`\`

### WHERE 생략 시 전체 행 삭제 (ROLLBACK 가능)
\`\`\`sql
DELETE FROM copy_emp;
\`\`\`

### 서브쿼리 기반 삭제
\`\`\`sql
-- 부서 이름에 'Public'이 포함된 부서의 사원 삭제
DELETE FROM employees
WHERE  department_id IN (
    SELECT department_id
    FROM   departments
    WHERE  department_name LIKE '%Public%'
);
\`\`\`

---

## TRUNCATE TABLE — 빠른 전체 삭제

\`\`\`sql
TRUNCATE TABLE copy_emp;
\`\`\`

| 구분 | DELETE | TRUNCATE |
|------|--------|----------|
| 분류 | DML | DDL |
| ROLLBACK | 가능 | 불가 |
| WHERE 조건 | 가능 | 불가 |
| 트리거 실행 | 예 | 아니오 |
| 속도 | 상대적으로 느림 | 빠름 |
| HWM 초기화 | 아니오 | 예 |

> **TRUNCATE 주의**: DDL 문으로 자동 커밋이 발생합니다.
> 이전의 미커밋 DML 변경도 함께 커밋됩니다.` },

  { title: '트랜잭션 제어', content: `## 트랜잭션이란?

트랜잭션은 하나의 논리적 작업 단위로 묶인 DML 문의 집합입니다.

### 트랜잭션 시작과 종료
- **시작**: 첫 번째 DML 문 실행 시
- **종료**: COMMIT, ROLLBACK, DDL/DCL 실행, 정상 세션 종료(자동 커밋), 비정상 종료(자동 롤백)

---

## COMMIT / ROLLBACK / SAVEPOINT

\`\`\`sql
-- COMMIT: 변경 사항 영구 저장
INSERT INTO departments VALUES (280, 'Research', 100, 1700);
COMMIT;

-- ROLLBACK: 모든 미커밋 변경 취소
INSERT INTO departments VALUES (290, 'Test', NULL, NULL);
ROLLBACK;

-- SAVEPOINT + ROLLBACK TO: 특정 시점까지만 취소
INSERT INTO departments VALUES (310, 'Dept A', NULL, 1700);
SAVEPOINT sp1;
INSERT INTO departments VALUES (320, 'Dept B', NULL, 1700);
ROLLBACK TO sp1;  -- Dept B만 취소, Dept A는 유지
COMMIT;           -- Dept A 영구 저장
\`\`\`

---

## 읽기 일관성 (Read Consistency)

Oracle은 **언두(Undo) 세그먼트**를 사용하여 읽기 일관성을 보장합니다.

- 독자(Reader)는 쓰기(Writer)를 기다리지 않습니다.
- 쓰기(Writer)는 읽기(Reader)를 차단하지 않습니다.
- 다른 세션은 COMMIT 전까지 변경 이전 데이터를 봅니다.

---

## FOR UPDATE — 행 잠금

\`\`\`sql
-- 조회한 행에 잠금 설정
SELECT employee_id, salary
FROM   employees
WHERE  job_id = 'SA_REP'
FOR UPDATE;

-- NOWAIT: 잠긴 행 있으면 즉시 오류(ORA-00054) 반환
SELECT employee_id FROM employees WHERE department_id = 50
FOR UPDATE NOWAIT;
\`\`\`

> COMMIT 또는 ROLLBACK 시 잠금이 해제됩니다.

---

## 자동 커밋 / 자동 롤백

| 상황 | 결과 |
|------|------|
| DDL 문 실행 | 자동 커밋 (이전 DML 포함) |
| DCL 문 실행 | 자동 커밋 |
| 정상 세션 종료 | 자동 커밋 |
| 시스템 충돌 / 비정상 종료 | 자동 롤백 |` },
]

const CH09_SECTIONS = [
  { title: 'DDL 개요 및 데이터베이스 객체', content: `## DDL(Data Definition Language)이란?

DDL은 데이터베이스 구조를 정의하는 SQL 문의 집합입니다.

| 구문 | 기능 |
|------|------|
| CREATE | 데이터베이스 객체 생성 |
| ALTER | 기존 객체 구조 변경 |
| DROP | 객체 삭제 |
| RENAME | 객체 이름 변경 |
| TRUNCATE | 테이블의 모든 행 삭제 (DDL) |

> **DDL vs DML**: DDL은 실행 즉시 자동 커밋됩니다. ROLLBACK으로 되돌릴 수 없습니다.

### 데이터베이스 객체 종류

| 객체 | 설명 |
|------|------|
| 테이블(Table) | 기본 데이터 저장 단위 |
| 뷰(View) | 하나 이상의 테이블을 기반으로 하는 가상 테이블 |
| 시퀀스(Sequence) | 자동 번호 생성기 |
| 인덱스(Index) | 검색 성능 향상 |
| 동의어(Synonym) | 객체에 대한 대체 이름 |

### 테이블 이름 명명 규칙

- 문자(A-Z)로 시작
- 1~30자 길이
- A-Z, 0-9, _, $, # 사용 가능
- 공백, 예약어 사용 불가
- 같은 스키마 내에서 고유한 이름` },

  { title: 'CREATE TABLE — 구문·데이터 타입·DEFAULT', content: `## CREATE TABLE 기본 구문

\`\`\`sql
CREATE TABLE table_name (
    column1 datatype [DEFAULT expr] [constraint],
    column2 datatype [DEFAULT expr] [constraint],
    ...
    [table_constraint, ...]
);
\`\`\`

---

## 주요 데이터 타입

| 타입 | 설명 | 예시 |
|------|------|------|
| VARCHAR2(n) | 가변 길이 문자, 최대 n바이트 | VARCHAR2(50) |
| CHAR(n) | 고정 길이 문자, 항상 n바이트 | CHAR(2) |
| NUMBER(p,s) | 숫자, 전체 p자리 소수 s자리 | NUMBER(8,2) |
| DATE | 날짜+시분초 | — |
| TIMESTAMP | 날짜+시분초+소수 초 | TIMESTAMP(6) |
| CLOB | 대용량 텍스트 | — |

> **VARCHAR2 vs CHAR**: VARCHAR2는 실제 길이만큼만 저장. CHAR는 항상 고정 길이.

---

## DEFAULT 옵션

\`\`\`sql
CREATE TABLE employees (
    hire_date  DATE         DEFAULT SYSDATE,
    status     VARCHAR2(10) DEFAULT 'Active',
    count      NUMBER       DEFAULT 0
);
\`\`\`

**DEFAULT 사용 제한:**
- 다른 열 이름 참조 불가
- ROWNUM, ROWID 등 의사열 불가
- 리터럴, 함수(SYSDATE, USER), 표현식은 허용

---

## 서브쿼리로 테이블 생성 (CTAS)

\`\`\`sql
-- 구조 + 데이터 복사
CREATE TABLE dept80 AS
SELECT employee_id, last_name, salary
FROM   employees
WHERE  department_id = 80;

-- 구조만 복사 (데이터 없음)
CREATE TABLE empty_emp AS
SELECT * FROM employees WHERE 1=2;
\`\`\`

**CTAS 복사 범위:**
- 복사됨: 열 정의, 데이터, NOT NULL 제약
- 복사 안 됨: PRIMARY KEY, UNIQUE, FOREIGN KEY, CHECK` },

  { title: '제약 조건 — 5가지 유형', content: `## 제약 조건(Constraint) 개요

제약 조건은 테이블 수준의 규칙으로 데이터 무결성을 보장합니다.

### 5가지 제약 조건 유형

| 유형 | 설명 | NULL 허용 |
|------|------|----------|
| NOT NULL | NULL 값 불허 | — |
| UNIQUE | 모든 값이 고유 | 허용 |
| PRIMARY KEY | NOT NULL + UNIQUE | 불허 |
| FOREIGN KEY | 참조 무결성 유지 | 허용 |
| CHECK | 행 조건 정의 | — |

---

## 제약 조건 정의 위치

\`\`\`sql
-- 열 수준 (Column Level)
CREATE TABLE emp (
    emp_id  NUMBER(6)   CONSTRAINT emp_pk PRIMARY KEY,
    email   VARCHAR2(25) UNIQUE NOT NULL,
    salary  NUMBER(8,2)  CHECK (salary > 0),
    dept_id NUMBER(4)    REFERENCES departments(department_id)
);

-- 테이블 수준 (Table Level) — 복합 키에 필수
CREATE TABLE emp (
    emp_id  NUMBER(6),
    dept_id NUMBER(4),
    CONSTRAINT emp_pk PRIMARY KEY (emp_id),
    CONSTRAINT emp_dept_fk FOREIGN KEY (dept_id)
        REFERENCES departments(department_id)
);
\`\`\`

> **복합 PRIMARY KEY**는 반드시 테이블 수준에서 정의해야 합니다.

---

## FOREIGN KEY 옵션

\`\`\`sql
-- ON DELETE CASCADE: 부모 삭제 시 자식도 삭제
CONSTRAINT fk FOREIGN KEY (dept_id)
    REFERENCES departments(dept_id)
    ON DELETE CASCADE

-- ON DELETE SET NULL: 부모 삭제 시 자식 FK를 NULL로
CONSTRAINT fk FOREIGN KEY (dept_id)
    REFERENCES departments(dept_id)
    ON DELETE SET NULL
\`\`\`

> **ON DELETE SET NULL 주의**: 자식 열에 NOT NULL 제약이 있으면 오류 발생.

---

## CHECK 제약 조건 제한

- 서브쿼리 불가
- SYSDATE, ROWNUM 등 의사열 불가
- 리터럴 비교, 동일 행 열 참조는 가능

\`\`\`sql
CHECK (salary > 0)          -- 유효
CHECK (status IN ('A','B')) -- 유효
CHECK (hire_date > SYSDATE) -- 오류! SYSDATE 불가
\`\`\`` },

  { title: 'ALTER TABLE — 구조 변경', content: `## ALTER TABLE 문

### 열 추가 — ADD
\`\`\`sql
ALTER TABLE dept80
ADD (job_id VARCHAR2(9) DEFAULT 'UNKNOWN');
-- 새 열은 항상 마지막에 추가됨
\`\`\`

### 열 수정 — MODIFY
\`\`\`sql
-- 크기 확장 (항상 가능)
ALTER TABLE dept80
MODIFY (salary NUMBER(10,2));

-- 기본값 변경
ALTER TABLE dept80
MODIFY (job_id DEFAULT 'SA_REP');

-- 크기 축소 (데이터가 새 크기를 초과하면 오류)
-- ORA-01441: cannot decrease column length
\`\`\`

### 열 삭제 — DROP
\`\`\`sql
ALTER TABLE dept80
DROP (commission_pct);
\`\`\`

### 열 이름 변경 — RENAME COLUMN
\`\`\`sql
ALTER TABLE dept80
RENAME COLUMN job_id TO position_id;
\`\`\`

### 미사용 표시 — SET UNUSED
\`\`\`sql
-- 열을 숨김 처리 (SELECT/DML에서 접근 불가)
ALTER TABLE dept80
SET UNUSED (commission_pct);

-- 실제 삭제 (나중에 실행)
ALTER TABLE dept80
DROP UNUSED COLUMNS;
\`\`\`

> **SET UNUSED 사용 이유**: 대형 테이블에서 즉시 DROP COLUMN은 장시간 잠금 발생.
> SET UNUSED로 먼저 숨기고, 사용량이 적은 시간대에 DROP UNUSED COLUMNS 실행.

### 읽기 전용 설정
\`\`\`sql
ALTER TABLE dept80 READ ONLY;   -- DML 불가
ALTER TABLE dept80 READ WRITE;  -- 쓰기 복원
\`\`\`` },

  { title: 'DROP TABLE 및 데이터 딕셔너리', content: `## DROP TABLE 문

### 기본 삭제 — Recycle Bin으로 이동
\`\`\`sql
DROP TABLE dept80;
-- → Recycle Bin으로 이동, FLASHBACK으로 복구 가능
\`\`\`

### 복구 — FLASHBACK TABLE
\`\`\`sql
-- Recycle Bin 확인
SELECT object_name, original_name FROM recyclebin;

-- 복구
FLASHBACK TABLE dept80 TO BEFORE DROP;
\`\`\`

### 즉시 완전 삭제 — PURGE
\`\`\`sql
DROP TABLE dept80 PURGE;
-- → Recycle Bin 없이 즉시 삭제, 복구 불가
\`\`\`

---

## 데이터 딕셔너리 뷰

| 뷰 | 설명 |
|----|------|
| USER_TABLES | 현재 사용자 소유 테이블 목록 |
| USER_CONSTRAINTS | 제약 조건 정보 |
| USER_CONS_COLUMNS | 제약 조건과 열 매핑 |
| USER_COLUMNS | 열 정보 |

\`\`\`sql
-- 테이블 목록 조회
SELECT table_name, status, read_only
FROM   user_tables;

-- 제약 조건 조회
SELECT constraint_name, constraint_type, column_name
FROM   user_constraints c
JOIN   user_cons_columns cc USING (constraint_name, table_name)
WHERE  table_name = 'EMPLOYEES';
\`\`\`

**constraint_type 값:**
- P: PRIMARY KEY
- U: UNIQUE
- R: FOREIGN KEY (Referential)
- C: CHECK (NOT NULL 포함)` },

  { title: 'DDL 종합 — 설계 패턴과 주의사항', content: `## 테이블 설계 실전 패턴

### 1. 명시적 제약 조건 이름 사용
\`\`\`sql
CREATE TABLE orders (
    order_id   NUMBER(10)  CONSTRAINT ord_pk PRIMARY KEY,
    status     VARCHAR2(20) CONSTRAINT ord_status_ck
                            CHECK (status IN ('PENDING','SHIPPED','CANCELLED'))
);
\`\`\`
제약 조건에 이름을 부여하면 오류 메시지에서 어떤 제약 조건인지 쉽게 식별합니다.

### 2. 선택적 데이터 백업 패턴
\`\`\`sql
-- 구조만 있는 빈 백업 테이블 생성
CREATE TABLE emp_backup AS
SELECT * FROM employees WHERE 1=2;

-- 필요한 데이터만 삽입
INSERT INTO emp_backup
SELECT * FROM employees WHERE hire_date < '01-JAN-2000';
\`\`\`

### 3. FK 삭제 순서 주의
\`\`\`sql
-- 자식 테이블 먼저 삭제
DROP TABLE orders;    -- FK: customers, products 참조
DROP TABLE customers;
DROP TABLE products;

-- 또는 CASCADE CONSTRAINTS 사용
DROP TABLE customers CASCADE CONSTRAINTS;
\`\`\`

---

## DDL 주요 제한 사항 정리

| 항목 | 제한 |
|------|------|
| 테이블 이름 | 문자 시작, 1~30자 |
| DEFAULT | 다른 열 참조 불가 |
| CHECK | 서브쿼리, SYSDATE 불가 |
| MODIFY 축소 | 기존 데이터 초과 시 오류 |
| DROP COLUMN | 대형 테이블 잠금 주의 → SET UNUSED 권장 |
| CTAS | NOT NULL 제외 제약 조건 미복사 |
| DROP TABLE | 기본값은 Recycle Bin 이동 |

---

## 자동 커밋 주의

DDL 실행 시 이전의 미커밋 DML도 함께 자동 커밋됩니다.

\`\`\`sql
UPDATE employees SET salary = 99999 WHERE employee_id = 100;
-- ↑ 미커밋 DML

CREATE TABLE temp (id NUMBER);  -- DDL → 자동 커밋 발생
-- ↑ 위 UPDATE도 함께 커밋됨

ROLLBACK;  -- 효과 없음 (이미 커밋됨)
\`\`\`` },
]

const CH10_SECTIONS = [
  { title: '1. 뷰 개요', content: `뷰(View)는 하나 이상의 테이블 또는 다른 뷰를 기반으로 하는 가상 테이블입니다. 데이터를 저장하지 않고 쿼리 정의만 저장합니다.

**뷰의 장점**
| 장점 | 설명 |
|------|------|
| 데이터 보안 | 민감한 열(급여 등)을 숨길 수 있음 |
| 쿼리 단순화 | 복잡한 JOIN을 뷰로 캡슐화 |
| 데이터 독립성 | 테이블 구조 변경 시 애플리케이션 보호 |
| 논리적 구조 | 동일 데이터를 다양한 관점으로 표현 |

**단순 뷰 vs 복합 뷰**
| 항목 | 단순 뷰 | 복합 뷰 |
|------|---------|---------|
| 기반 테이블 | 1개 | 여러 개 가능 |
| 함수·그룹 | 없음 | 포함 가능 |
| DML | 가능 | 제한적 |`, code: `-- 뷰 생성 기본 구문
CREATE [OR REPLACE] [FORCE|NOFORCE] VIEW view_name
  [(alias1, alias2, ...)]
AS subquery
[WITH CHECK OPTION [CONSTRAINT constraint_name]]
[WITH READ ONLY [CONSTRAINT constraint_name]];

-- 단순 뷰 생성 예시
CREATE VIEW empvu80 AS
SELECT employee_id, last_name, salary
FROM   employees
WHERE  department_id = 80;

-- 뷰 조회 (테이블처럼 사용)
SELECT * FROM empvu80;` },

  { title: '2. 뷰 생성 옵션', content: `CREATE VIEW에서 사용할 수 있는 주요 옵션들입니다.

**OR REPLACE**
- 기존 뷰가 있으면 재정의 (DROP 없이)
- 기존에 부여된 권한 유지
- 운영 환경에서 안전한 방법

**FORCE / NOFORCE**
| 옵션 | 설명 |
|------|------|
| NOFORCE (기본) | 기반 테이블이 존재해야 생성 가능 |
| FORCE | 기반 테이블 없어도 강제 생성 (INVALID 상태) |

**열 별칭 지정 방법**
1. 서브쿼리 내 별칭: SELECT salary*12 ANN_SAL ...
2. 뷰 이름 뒤 괄호: CREATE VIEW v (id, name, sal) AS SELECT ...`, code: `-- OR REPLACE: 기존 권한 유지하며 재정의
CREATE OR REPLACE VIEW empvu80 AS
SELECT employee_id, last_name, salary, department_id
FROM   employees WHERE department_id = 80;

-- 열 별칭 방법 1: 서브쿼리 내
CREATE VIEW salvu50 AS
SELECT employee_id ID_NUMBER, last_name NAME, salary*12 ANN_SALARY
FROM   employees WHERE department_id = 50;

-- 열 별칭 방법 2: 뷰 이름 뒤 괄호
CREATE OR REPLACE VIEW empvu80 (id_number, name, sal, dept_id)
AS SELECT employee_id, first_name||' '||last_name, salary, department_id
   FROM   employees WHERE department_id = 80;

-- FORCE: 기반 테이블 없어도 생성 (INVALID 상태)
CREATE FORCE VIEW ghost_vu AS
SELECT id, name FROM ghost_table;

-- STATUS 확인
SELECT object_name, status FROM user_objects WHERE object_name = 'GHOST_VU';` },

  { title: '3. 뷰를 통한 DML', content: `뷰를 통해 INSERT/UPDATE/DELETE를 수행할 수 있지만, 제한 조건이 있습니다.

**DML 불가 조건**
| 조건 | INSERT | UPDATE | DELETE |
|------|--------|--------|--------|
| 그룹 함수 | ✗ | ✗ | ✗ |
| GROUP BY | ✗ | ✗ | ✗ |
| DISTINCT | ✗ | ✗ | ✗ |
| ROWNUM | ✗ | ✗ | ✗ |
| 표현식 열 | ✗ | ✗ | 가능 |
| JOIN (복합) | ✗ | 키 보존 테이블만 | 키 보존만 |

**⚠️ 사라지는 행(Disappearing Rows)**
WITH CHECK OPTION이 없는 뷰에서 뷰 조건 밖의 행을 삽입/수정하면 기반 테이블에는 저장되지만 뷰에서는 보이지 않게 됩니다.`, code: `-- 단순 뷰에서 DML 가능
UPDATE empvu80 SET salary = 8000 WHERE employee_id = 100;
DELETE FROM empvu80 WHERE employee_id = 101;
INSERT INTO empvu80 VALUES (300, 'Kim', 7000);  -- 필수 열 모두 제공 필요

-- 표현식 열이 있는 뷰에서 INSERT 불가
CREATE OR REPLACE VIEW emp_expr_vu AS
SELECT employee_id, last_name, salary * 12 annual_sal
FROM   employees;

INSERT INTO emp_expr_vu VALUES (600, 'Lee', 96000);
-- ORA-01733: virtual column not allowed here

-- GROUP BY 뷰에서 DML 불가
CREATE OR REPLACE VIEW dept_sal_vu AS
SELECT department_id, AVG(salary) avg_sal
FROM   employees GROUP BY department_id;

DELETE FROM dept_sal_vu WHERE department_id = 80;
-- ORA-01732: data manipulation operation not legal on this view` },

  { title: '4. WITH CHECK OPTION / WITH READ ONLY', content: `뷰의 DML을 제어하는 두 가지 옵션입니다.

**WITH CHECK OPTION**
- 뷰의 WHERE 조건을 벗어나는 DML 차단
- INSERT와 UPDATE 모두 적용
- 위반 시: ORA-01402: view WITH CHECK OPTION where-clause violation
- CONSTRAINT 이름 지정으로 오류 메시지에 이름 표시 가능

**WITH READ ONLY**
- 뷰를 통한 모든 DML(INSERT/UPDATE/DELETE) 차단
- SELECT는 정상 허용
- 위반 시: ORA-42399

| 옵션 | INSERT | UPDATE | DELETE | SELECT |
|------|--------|--------|--------|--------|
| 없음 | 뷰 조건 밖도 가능 | 가능 | 가능 | 가능 |
| WITH CHECK OPTION | 조건 내만 | 조건 내만 | 가능 | 가능 |
| WITH READ ONLY | ✗ | ✗ | ✗ | 가능 |`, code: `-- WITH CHECK OPTION: 조건 밖 DML 차단
CREATE OR REPLACE VIEW empvu20 AS
SELECT employee_id, last_name, salary, department_id
FROM   employees WHERE department_id = 20
WITH CHECK OPTION CONSTRAINT empvu20_ck;

-- 위반 시 오류 발생
INSERT INTO empvu20 (employee_id, last_name, email, hire_date, job_id, department_id)
VALUES (500, 'Test', 'TEST', SYSDATE, 'MK_REP', 30);
-- ORA-01402: view WITH CHECK OPTION where-clause violation

-- 정상 삽입 (조건 충족)
INSERT INTO empvu20 (employee_id, last_name, email, hire_date, job_id, department_id)
VALUES (501, 'Good', 'GOOD', SYSDATE, 'MK_REP', 20);

-- WITH READ ONLY: 모든 DML 차단
CREATE OR REPLACE VIEW empvu10 (employee_number, employee_name, job_title)
AS SELECT employee_id, last_name, job_id
   FROM   employees WHERE department_id = 10
WITH READ ONLY;

DELETE FROM empvu10 WHERE employee_number = 200;
-- ORA-42399: cannot perform a DML operation on a read-only view` },

  { title: '5. 뷰 관리와 데이터 딕셔너리', content: `뷰의 삭제, 상태 확인, 딕셔너리 조회 방법입니다.

**뷰 삭제**
\`\`\`sql
DROP VIEW view_name;
\`\`\`
- 기반 테이블과 데이터는 영향 없음
- 다른 사용자의 뷰 삭제: DROP ANY VIEW 권한 필요

**USER_VIEWS 딕셔너리 뷰**
| 컬럼 | 설명 |
|------|------|
| VIEW_NAME | 뷰 이름 |
| TEXT | 뷰 정의 서브쿼리 |
| READ_ONLY | WITH READ ONLY 여부 (Y/N) |

**뷰 상태 (INVALID)**
- 기반 테이블이 삭제/변경되면 뷰가 INVALID 상태
- USER_OBJECTS.STATUS로 확인
- ALTER VIEW 뷰명 COMPILE; 로 재컴파일

**뷰 기반 뷰 (Nested View)**
- 뷰를 기반으로 또 다른 뷰를 생성 가능
- 기반 뷰 삭제 시 상위 뷰도 INVALID`, code: `-- 뷰 삭제
DROP VIEW empvu80;

-- 뷰 목록 조회
SELECT view_name FROM user_views;

-- 뷰 서브쿼리 확인
SELECT text FROM user_views WHERE view_name = 'EMPVU80';

-- 뷰 구조 확인
DESCRIBE empvu80;

-- 뷰 상태 확인
SELECT object_name, status
FROM   user_objects
WHERE  object_type = 'VIEW';

-- 뷰 기반 뷰
CREATE VIEW high_sal_vu AS
SELECT employee_id, last_name, salary, department_id
FROM   employees WHERE salary > 5000;

CREATE VIEW dept80_high_sal_vu AS
SELECT * FROM high_sal_vu WHERE department_id = 80;

SELECT * FROM dept80_high_sal_vu;` },
]

const CH11_SECTIONS = [
  { title: '1. 시퀀스 개요와 생성', content: `시퀀스(Sequence)는 고유한 숫자 값을 자동으로 생성하는 데이터베이스 객체입니다. 주로 기본 키 자동 생성에 사용합니다.

**CREATE SEQUENCE 구문**
\`\`\`sql
CREATE SEQUENCE sequence_name
  [START WITH n]
  [INCREMENT BY n]
  [{MAXVALUE n | NOMAXVALUE}]
  [{MINVALUE n | NOMINVALUE}]
  [{CYCLE | NOCYCLE}]
  [{CACHE n | NOCACHE}]
  [{ORDER | NOORDER}];
\`\`\`

**주요 옵션**
| 옵션 | 기본값 | 설명 |
|------|--------|------|
| START WITH | 1 | 시작 값 |
| INCREMENT BY | 1 | 증가량 (음수면 감소) |
| MAXVALUE | 10^27 | 최대값 |
| NOCYCLE | 기본 | 최대값 도달 시 오류 |
| CACHE 20 | 20 | 메모리에 미리 생성할 값 수 |
| NOCACHE | — | 캐시 없이 매번 디스크 저장 |`, code: `-- 기본 시퀀스 생성
CREATE SEQUENCE dept_deptid_seq
    START WITH   280
    INCREMENT BY 10
    MAXVALUE     9999
    NOCACHE
    NOCYCLE;

-- NEXTVAL: 다음 값 반환 (호출마다 증가)
SELECT dept_deptid_seq.NEXTVAL FROM dual;   -- 280
SELECT dept_deptid_seq.NEXTVAL FROM dual;   -- 290

-- CURRVAL: 현재 세션의 마지막 NEXTVAL 값
SELECT dept_deptid_seq.CURRVAL FROM dual;   -- 290

-- INSERT에 NEXTVAL 사용
INSERT INTO departments (department_id, department_name, location_id)
VALUES (dept_deptid_seq.NEXTVAL, 'Support', 2500);

-- Oracle 12c+: DEFAULT에 시퀀스 사용
CREATE TABLE new_emp (
    id   NUMBER DEFAULT emp_seq.NEXTVAL NOT NULL,
    name VARCHAR2(50)
);
INSERT INTO new_emp (name) VALUES ('Alice');  -- id 자동 할당` },

  { title: '2. 시퀀스 관리', content: `시퀀스의 수정, 삭제, 딕셔너리 조회, 갭 발생 원인을 이해합니다.

**ALTER SEQUENCE**
- INCREMENT BY, MAXVALUE, MINVALUE, CYCLE, CACHE 변경 가능
- **START WITH는 변경 불가** → DROP 후 재생성 필요

**시퀀스 갭(Gap) 발생 원인**
| 원인 | 설명 |
|------|------|
| 트랜잭션 롤백 | NEXTVAL 호출 후 ROLLBACK 해도 시퀀스 복원 안 됨 |
| 시스템 크래시 | CACHE 사용 시 메모리 캐시 손실 |
| 여러 테이블 공유 | 다른 트랜잭션이 NEXTVAL 소비 |

**⚠️ 감사 요건(갭 없음)이 있다면**: NOCACHE 사용

**USER_SEQUENCES 주요 컬럼**
| 컬럼 | 설명 |
|------|------|
| SEQUENCE_NAME | 시퀀스 이름 |
| LAST_NUMBER | 다음 캐시 블록 시작 값 |
| CYCLE_FLAG | CYCLE 여부 |
| CACHE_SIZE | 캐시 크기 |`, code: `-- 시퀀스 수정 (INCREMENT BY, MAXVALUE 변경 가능)
ALTER SEQUENCE dept_deptid_seq
    INCREMENT BY 20
    MAXVALUE 99999;

-- START WITH 변경은 불가 → DROP 후 재생성
DROP SEQUENCE dept_deptid_seq;
CREATE SEQUENCE dept_deptid_seq START WITH 100;

-- 시퀀스 삭제
DROP SEQUENCE dept_deptid_seq;

-- 딕셔너리 조회
SELECT sequence_name, min_value, max_value,
       increment_by, cycle_flag, cache_size, last_number
FROM   user_sequences;

-- 갭 발생 확인
SELECT my_seq.NEXTVAL FROM dual;  -- 1 (시퀀스 진행)
INSERT INTO orders VALUES (my_seq.NEXTVAL, 'A');  -- 2
ROLLBACK;  -- INSERT 취소, 시퀀스는 2에 머묾
SELECT my_seq.NEXTVAL FROM dual;  -- 3 (2는 갭)` },

  { title: '3. 동의어 개요와 생성', content: `동의어(Synonym)는 테이블, 뷰, 시퀀스 등 데이터베이스 객체에 대한 대체 이름입니다. 데이터를 저장하지 않고 딕셔너리에 이름 매핑만 저장합니다.

**동의어의 용도**
- 긴 스키마 한정 이름 단축 (hr.employees → emp)
- 기반 객체 변경 시 애플리케이션 투명성 유지
- 원격 DB 객체 접근 단순화 (DB Link 연계)

**PRIVATE vs PUBLIC 동의어**
| | PRIVATE | PUBLIC |
|---|---|---|
| 접근 범위 | 생성한 사용자만 | 모든 DB 사용자 |
| 생성 권한 | CREATE SYNONYM | CREATE PUBLIC SYNONYM |
| 우선순위 | 동명의 PUBLIC보다 우선 | PRIVATE 없는 경우 적용 |

**구문**
\`\`\`sql
CREATE [OR REPLACE] [PUBLIC] SYNONYM synonym_name
FOR [schema.]object[@dblink];
\`\`\``, code: `-- 개인 동의어 생성
CREATE SYNONYM emp FOR employees;
CREATE SYNONYM emp FOR hr.employees;  -- 다른 스키마 객체

-- 동의어로 SELECT, DML 사용 (일반 테이블과 동일)
SELECT * FROM emp WHERE department_id = 80;
UPDATE emp SET salary = 9000 WHERE employee_id = 100;

-- CREATE OR REPLACE: 기존 동의어 재정의
CREATE OR REPLACE SYNONYM emp FOR departments;  -- 참조 대상 변경

-- PUBLIC 동의어 (DBA 권한 필요)
CREATE PUBLIC SYNONYM employees FOR hr.employees;
-- 모든 사용자가 hr.employees를 employees로 접근 가능

-- 동의어 삭제
DROP SYNONYM emp;
DROP PUBLIC SYNONYM employees;  -- PUBLIC 삭제 시 PUBLIC 키워드 필요` },

  { title: '4. 동의어 관리와 딕셔너리', content: `동의어의 정보 조회, 상태, 주의사항을 정리합니다.

**USER_SYNONYMS 주요 컬럼**
| 컬럼 | 설명 |
|------|------|
| SYNONYM_NAME | 동의어 이름 |
| TABLE_OWNER | 참조 객체 소유자 |
| TABLE_NAME | 참조 객체 이름 |
| DB_LINK | 원격 DB 링크 이름 (로컬이면 NULL) |

**동의어 관련 주의사항**
- 생성 시 참조 객체 존재 여부 검사 안 함 → 사용 시 오류
- 참조 객체 삭제 시 동의어는 자동 삭제 안 됨 → 사용 시 ORA-04043
- 동의어를 통한 DML은 원본 객체에 직접 적용됨
- DESCRIBE 동의어명 → 원본 객체 구조 표시

**범위별 딕셔너리 뷰**
- USER_SYNONYMS: 현재 사용자 소유
- ALL_SYNONYMS: 접근 가능한 모든 동의어
- DBA_SYNONYMS: DB 전체 (DBA 전용)`, code: `-- 동의어 목록 조회
SELECT synonym_name, table_owner, table_name, db_link
FROM   user_synonyms
ORDER BY synonym_name;

-- 특정 동의어 정보 확인
SELECT * FROM user_synonyms WHERE synonym_name = 'EMP';

-- 동의어 구조 확인 (원본 테이블 구조 표시)
DESCRIBE emp;

-- 참조 객체 없는 동의어 생성 (생성은 성공)
CREATE SYNONYM ghost FOR ghost_table;
SELECT * FROM ghost;  -- ORA-04043: object does not exist

-- USER_OBJECTS에서 전체 동의어/시퀀스 확인
SELECT object_name, object_type, status
FROM   user_objects
WHERE  object_type IN ('SYNONYM', 'SEQUENCE')
ORDER BY object_type, object_name;` },
]

const CH12_SECTIONS = [
  { title: '1. 인덱스 개요', content: `인덱스(Index)는 테이블 열에 대한 빠른 검색을 지원하는 스키마 객체입니다. B-TREE 구조로 저장되어 전체 테이블 스캔 없이 원하는 행을 빠르게 찾을 수 있습니다.

**인덱스가 효과적인 경우**
| 조건 | 설명 |
|------|------|
| 대용량 테이블 | 수백만 건 이상 |
| 소량 행 조회 | 전체의 2~4% 미만 |
| 높은 카디널리티 | employee_id, email 같은 고유 값이 많은 열 |
| 자주 사용하는 WHERE 조건 | JOIN, ORDER BY 열 포함 |

**인덱스가 불필요한 경우**
- 작은 테이블
- 대부분의 행을 반환하는 쿼리
- 카디널리티가 낮은 열 (성별, 상태 등)
- DML이 매우 빈번한 열 (갱신 오버헤드)

**인덱스의 단점**
- DML(INSERT/UPDATE/DELETE) 시 자동 갱신 → 쓰기 성능 저하
- 저장 공간 사용`, code: `-- USER_INDEXES: 인덱스 기본 정보
SELECT index_name, table_name, uniqueness, index_type, status, visibility
FROM   user_indexes
WHERE  table_name = 'EMPLOYEES'
ORDER BY index_name;

-- USER_IND_COLUMNS: 인덱스별 열 정보
SELECT index_name, column_name, column_position
FROM   user_ind_columns
WHERE  table_name = 'EMPLOYEES'
ORDER BY index_name, column_position;

-- 자동 생성 인덱스 확인 (PK/UK 제약)
SELECT c.constraint_name, c.constraint_type,
       i.index_name, i.uniqueness
FROM   user_constraints c
JOIN   user_indexes     i ON c.constraint_name = i.index_name
WHERE  c.table_name = 'EMPLOYEES';` },

  { title: '2. 인덱스 생성', content: `다양한 유형의 인덱스를 생성하는 방법을 알아봅니다.

**기본 구문**
\`\`\`sql
CREATE [UNIQUE] INDEX index_name
ON table_name (col1 [, col2, ...]);
\`\`\`

**인덱스 유형**
| 유형 | 설명 | 예시 |
|------|------|------|
| 비고유(Non-Unique) | 중복 허용 (기본) | CREATE INDEX idx ON t(col) |
| 고유(Unique) | 중복 불허 | CREATE UNIQUE INDEX idx ON t(col) |
| 복합(Composite) | 여러 열 | CREATE INDEX idx ON t(col1, col2) |
| 함수 기반 | 표현식 기반 | CREATE INDEX idx ON t(UPPER(col)) |

**USING INDEX**: PK/UK 제약으로 자동 생성되는 인덱스 이름 직접 지정
\`\`\`sql
CREATE TABLE t (
    id NUMBER PRIMARY KEY USING INDEX
        (CREATE INDEX t_pk_idx ON t(id)),
    name VARCHAR2(50)
);
\`\`\``, code: `-- 비고유 인덱스
CREATE INDEX emp_last_name_idx ON employees(last_name);

-- 고유 인덱스
CREATE UNIQUE INDEX emp_email_idx ON employees(email);

-- 복합 인덱스 (선두 열 설계 중요)
CREATE INDEX emp_dept_job_idx ON employees(department_id, job_id);

-- 함수 기반 인덱스 (대소문자 무관 검색)
CREATE INDEX emp_upper_last_idx ON employees(UPPER(last_name));

-- PK 인덱스 이름 직접 지정
CREATE TABLE new_emp (
    id   NUMBER PRIMARY KEY USING INDEX
         (CREATE INDEX new_emp_pk_idx ON new_emp(id)),
    name VARCHAR2(50)
);` },

  { title: '3. 복합 인덱스와 함수 기반 인덱스', content: `복합 인덱스와 함수 기반 인덱스의 특성과 활용 방법입니다.

**복합 인덱스 (Composite Index)**
- 여러 열을 조합하여 생성
- **선두 열 원칙**: 조건절에 선두 열이 포함되어야 인덱스 효과적
- 열 순서가 중요: 가장 자주 필터링하는 열을 선두에

| 조건 | (dept_id, job_id) 인덱스 활용 여부 |
|------|-----------------------------------|
| WHERE dept_id = 80 | O (선두 열) |
| WHERE dept_id = 80 AND job_id = 'SA_REP' | O (두 열 모두) |
| WHERE job_id = 'SA_REP' | X (선두 열 없음) |

**함수 기반 인덱스 (Function-Based Index)**
- 열에 함수를 적용한 결과를 인덱스로 저장
- WHERE 절의 함수 표현식과 정확히 일치해야 활용
- USER_INDEXES.INDEX_TYPE = 'FUNCTION-BASED NORMAL'
- 표현식은 USER_IND_EXPRESSIONS에서 확인`, code: `-- 복합 인덱스 생성
CREATE INDEX emp_dept_job_idx ON employees(department_id, job_id);

-- 선두 열 포함 → 인덱스 활용
SELECT * FROM employees WHERE department_id = 80 AND job_id = 'SA_REP';
SELECT * FROM employees WHERE department_id = 80;

-- 선두 열 없음 → 인덱스 미활용
SELECT * FROM employees WHERE job_id = 'SA_REP';

-- 함수 기반 인덱스
CREATE INDEX emp_upper_last_idx ON employees(UPPER(last_name));

-- 인덱스 활용 (함수 표현식 일치)
SELECT * FROM employees WHERE UPPER(last_name) = 'KING';

-- 인덱스 미활용 (함수 없음)
SELECT * FROM employees WHERE last_name = 'King';

-- 함수 기반 인덱스 표현식 확인
SELECT index_name, column_expression
FROM   user_ind_expressions
WHERE  index_name = 'EMP_UPPER_LAST_IDX';` },

  { title: '4. 인덱스 관리', content: `인덱스의 수정, 재구성, INVISIBLE/VISIBLE 관리 방법입니다.

**ALTER INDEX**
| 명령 | 설명 |
|------|------|
| ALTER INDEX idx REBUILD | 인덱스 재구성 (단편화 해소) |
| ALTER INDEX idx INVISIBLE | 옵티마이저가 사용 안 함 (구조 유지) |
| ALTER INDEX idx VISIBLE | 옵티마이저가 다시 사용 |

**INVISIBLE 인덱스 활용 시나리오**
1. 기존 인덱스를 INVISIBLE로 설정
2. 새 인덱스 생성 후 성능 비교
3. 새 인덱스가 더 좋으면 기존 인덱스 DROP
4. 기존이 더 좋으면 새 인덱스 DROP + INVISIBLE 해제

**인덱스 삭제**
- DROP INDEX 인덱스명
- 테이블 DROP 시 인덱스도 자동 삭제
- PK/UK 제약 삭제 시 자동 생성 인덱스도 삭제`, code: `-- 인덱스 재구성 (단편화 해소)
ALTER INDEX emp_last_name_idx REBUILD;

-- INVISIBLE: 옵티마이저 무시, 구조 유지
ALTER INDEX emp_dept_job_idx INVISIBLE;

-- VISIBLE: 다시 옵티마이저 사용
ALTER INDEX emp_dept_job_idx VISIBLE;

-- 상태 확인
SELECT index_name, visibility, status
FROM   user_indexes
WHERE  table_name = 'EMPLOYEES';

-- 인덱스 삭제
DROP INDEX emp_last_name_idx;
DROP INDEX emp_upper_last_idx;

-- 테이블 DROP 시 인덱스도 자동 삭제됨
DROP TABLE test_tbl;  -- test_tbl의 모든 인덱스 자동 삭제` },

  { title: '5. 딕셔너리 뷰와 인덱스 전략', content: `인덱스 관련 딕셔너리 뷰와 최적 인덱스 설계 전략입니다.

**인덱스 관련 딕셔너리 뷰**
| 뷰 | 설명 |
|----|------|
| USER_INDEXES | 인덱스 기본 정보 (이름, 테이블, 타입, 고유여부, 가시성) |
| USER_IND_COLUMNS | 인덱스별 열 이름과 위치 |
| USER_IND_EXPRESSIONS | 함수 기반 인덱스 표현식 |

**인덱스 설계 원칙**
1. **선택도 높은 열**: employee_id, email 같은 고유 값이 많은 열
2. **자주 사용하는 WHERE/JOIN/ORDER BY 열**
3. **복합 인덱스**: 가장 선택적인 열을 선두에
4. **BITMAP 인덱스**: 카디널리티가 낮고 DML이 적은 열 (DW/분석 환경)
5. **적정 수 유지**: DML 성능 저하를 고려

**EXPLAIN PLAN으로 인덱스 활용 확인**
\`\`\`sql
EXPLAIN PLAN FOR SELECT * FROM ...;
SELECT * FROM TABLE(DBMS_XPLAN.DISPLAY);
\`\`\``, code: `-- 인덱스 종합 현황 조회
SELECT i.index_name, i.uniqueness, i.index_type,
       i.visibility, i.status,
       LISTAGG(c.column_name, ', ')
           WITHIN GROUP (ORDER BY c.column_position) AS columns
FROM   user_indexes     i
JOIN   user_ind_columns c ON i.index_name = c.index_name
WHERE  i.table_name = 'EMPLOYEES'
GROUP BY i.index_name, i.uniqueness, i.index_type, i.visibility, i.status
ORDER BY i.index_name;

-- EXPLAIN PLAN으로 인덱스 활용 확인
EXPLAIN PLAN FOR
SELECT * FROM employees WHERE last_name = 'King';
SELECT * FROM TABLE(DBMS_XPLAN.DISPLAY);

-- DICTIONARY에서 인덱스 관련 뷰 검색
SELECT table_name, comments FROM dictionary
WHERE  table_name LIKE '%INDEX%'
ORDER BY table_name;` },
]

const CH13_SECTIONS = [
  { title: '1. 분석 함수 개요와 OVER() 절', content: `분석 함수(Analytic Function)는 OVER() 절을 사용하여 각 행에 대해 집계/순위/이동 계산을 수행하면서도 원본 행 수를 유지하는 함수입니다.

**GROUP BY 집계 vs 분석 함수**
| 구분 | GROUP BY 집계 | 분석 함수 |
|------|-------------|---------|
| 반환 행 수 | 그룹당 1행 | 원본 행 수 유지 |
| 상세 데이터 | 사라짐 | 유지 |
| 키워드 | 없음 | OVER() |

**OVER() 절 구성**
\`\`\`
함수명() OVER(
  [PARTITION BY 열]   -- 논리적 파티션 분할
  [ORDER BY 열]       -- 파티션 내 정렬
  [윈도우 프레임]     -- 계산 범위 지정
)
\`\`\`

**쿼리 실행 순서**
FROM → WHERE → GROUP BY → HAVING → **분석 함수 실행** → ORDER BY

분석 함수는 WHERE/GROUP BY/HAVING 처리 후 실행됩니다. 따라서 분석 함수 결과를 WHERE 절에서 직접 필터링할 수 없으며, 서브쿼리 또는 CTE를 사용해야 합니다.`, code: `-- PARTITION BY 없음: 전체 집합 하나의 파티션
SELECT employee_id, last_name, salary,
       SUM(salary) OVER() AS total_sal
FROM   employees;

-- PARTITION BY: 부서별 파티션
SELECT employee_id, last_name, department_id, salary,
       SUM(salary) OVER(PARTITION BY department_id) AS dept_sal
FROM   employees;

-- 분석 함수 결과로 필터링: 서브쿼리 필요
SELECT * FROM (
    SELECT employee_id, last_name, salary,
           RANK() OVER(ORDER BY salary DESC) AS rnk
    FROM   employees
)
WHERE rnk <= 5;` },

  { title: '2. 순위 함수 (ROW_NUMBER, RANK, DENSE_RANK)', content: `세 가지 순위 함수는 동점 처리 방식이 다릅니다.

**동점 처리 비교** (급여: 9000, 7000, 7000, 5000)
| 함수 | 동점 처리 | 결과 예 |
|------|---------|--------|
| ROW_NUMBER() | 고유 순번 (임의) | 1, 2, 3, 4 |
| RANK() | 동점 같은 번호, 다음 건너뜀 | 1, 2, 2, 4 |
| DENSE_RANK() | 동점 같은 번호, 연속 | 1, 2, 2, 3 |

**PARTITION BY 사용**: 각 파티션(부서 등)마다 독립적으로 순위 계산

**상위 N위 조회 패턴**
\`\`\`sql
SELECT * FROM (
    SELECT 열들,
           DENSE_RANK() OVER(PARTITION BY 그룹열
                             ORDER BY 정렬열 DESC) AS rnk
    FROM 테이블
)
WHERE rnk <= N;
\`\`\``, code: `-- 세 순위 함수 비교
SELECT employee_id, last_name, salary,
       ROW_NUMBER()  OVER(ORDER BY salary DESC) AS row_num,
       RANK()        OVER(ORDER BY salary DESC) AS rnk,
       DENSE_RANK()  OVER(ORDER BY salary DESC) AS dense_rnk
FROM   employees
ORDER BY salary DESC;

-- 부서별 순위
SELECT employee_id, last_name, department_id, salary,
       RANK() OVER(PARTITION BY department_id
                  ORDER BY salary DESC) AS dept_rank
FROM   employees
WHERE  department_id IS NOT NULL;

-- 부서별 상위 2위
SELECT * FROM (
    SELECT e.*,
           DENSE_RANK() OVER(PARTITION BY department_id
                             ORDER BY salary DESC) AS dr
    FROM employees e WHERE department_id IS NOT NULL
)
WHERE dr <= 2;` },

  { title: '3. NTILE과 집계 분석 함수', content: `**NTILE(n)**: 데이터를 n개의 동등한 버킷으로 분할하여 버킷 번호(1~n) 부여

| 총 행 수 | NTILE(4) 분배 |
|---------|-------------|
| 12행 | 각 버킷 3행 |
| 10행 | 버킷1~2: 3행, 버킷3~4: 2행 (나머지를 앞 버킷에 배분) |
| 7행 | 버킷1~3: 2행, 버킷4: 1행 |

**집계 분석 함수** (SUM, AVG, COUNT, MIN, MAX + OVER)
- **OVER()**: 전체 집합 집계
- **OVER(PARTITION BY)**: 파티션별 집계
- **OVER(ORDER BY)**: 누적 집계 (기본 RANGE UNBOUNDED PRECEDING TO CURRENT ROW)

**PERCENT_RANK()**: (RANK-1)/(전체행수-1) → 0~1 백분위
**CUME_DIST()**: 현재 이하 행 비율 → 0 초과~1`, code: `-- NTILE: 4분위
SELECT employee_id, last_name, salary,
       NTILE(4) OVER(ORDER BY salary) AS quartile
FROM   employees;

-- 분위별 평균
SELECT quartile, COUNT(*) cnt, ROUND(AVG(salary),0) avg_sal
FROM (SELECT salary, NTILE(4) OVER(ORDER BY salary) AS quartile FROM employees)
GROUP BY quartile ORDER BY quartile;

-- 집계 분석 함수
SELECT employee_id, department_id, salary,
       SUM(salary) OVER(PARTITION BY department_id) AS dept_total,
       AVG(salary) OVER(PARTITION BY department_id) AS dept_avg,
       COUNT(*)    OVER(PARTITION BY department_id) AS dept_cnt,
       SUM(salary) OVER()                           AS grand_total
FROM   employees;

-- PERCENT_RANK와 CUME_DIST
SELECT last_name, salary,
       ROUND(PERCENT_RANK() OVER(ORDER BY salary)*100, 1) AS pct_rank,
       ROUND(CUME_DIST()    OVER(ORDER BY salary)*100, 1) AS cum_dist
FROM   employees;` },

  { title: '4. 윈도우 프레임 (ROWS/RANGE BETWEEN)', content: `ORDER BY가 있는 분석 함수는 기본 윈도우가 **RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW** (현재 행까지 누적)입니다.

**윈도우 프레임 구문**
\`\`\`
ROWS|RANGE BETWEEN 시작 AND 끝
\`\`\`

**경계 키워드**
| 키워드 | 의미 |
|--------|------|
| UNBOUNDED PRECEDING | 파티션의 첫 번째 행 |
| n PRECEDING | 현재보다 n행 이전 |
| CURRENT ROW | 현재 행 |
| n FOLLOWING | 현재보다 n행 이후 |
| UNBOUNDED FOLLOWING | 파티션의 마지막 행 |

**ROWS vs RANGE**
- **ROWS**: 물리적 행 개수 기준 (정확한 n번째 행)
- **RANGE**: 값 기준 (동일 값의 모든 행 포함)
- 동점이 없으면 결과 동일, 동점이 있으면 RANGE가 더 많은 행 포함`, code: `-- 누적 합계 (파티션 시작~현재)
SUM(salary) OVER(ORDER BY hire_date
    ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)

-- 전체 파티션 합계
SUM(salary) OVER(PARTITION BY dept
    ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING)

-- 3행 이동 평균 (이전 2행 + 현재)
AVG(salary) OVER(ORDER BY salary
    ROWS BETWEEN 2 PRECEDING AND CURRENT ROW)

-- 5행 이동 윈도우 (이전 2 + 현재 + 다음 2)
AVG(salary) OVER(ORDER BY salary
    ROWS BETWEEN 2 PRECEDING AND 2 FOLLOWING)

-- ROWS vs RANGE 동점 차이
SELECT last_name, salary,
       SUM(salary) OVER(ORDER BY salary
           ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS rows_sum,
       SUM(salary) OVER(ORDER BY salary
           RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS range_sum
FROM employees WHERE department_id = 80 ORDER BY salary;` },

  { title: '5. LAG, LEAD 함수', content: `LAG와 LEAD는 현재 행 기준으로 이전/이후 행의 값을 반환합니다.

**구문**
\`\`\`sql
LAG(열, [오프셋], [기본값]) OVER([PARTITION BY] ORDER BY)
LEAD(열, [오프셋], [기본값]) OVER([PARTITION BY] ORDER BY)
\`\`\`
- 오프셋 기본값 = 1
- 기본값: 이전/이후 행이 없을 때 반환 (기본 NULL)

**활용 사례**
| 활용 | 함수 |
|------|------|
| 전년도 매출 비교 | LAG(매출, 1) OVER(ORDER BY 연도) |
| 전월 대비 증감 | 매출 - LAG(매출) OVER(ORDER BY 월) |
| 다음 목표 급여 | LEAD(salary) OVER(ORDER BY salary) |
| 부서 내 이전 입사자 | LAG(이름) OVER(PARTITION BY dept ORDER BY hire_date) |`, code: `-- 기본 LAG, LEAD
SELECT employee_id, last_name, hire_date, salary,
       LAG(salary, 1, 0)  OVER(ORDER BY hire_date) AS prev_sal,
       LEAD(salary, 1, 0) OVER(ORDER BY hire_date) AS next_sal
FROM   employees
ORDER BY hire_date;

-- 전년 대비 입사 수 증감
SELECT hire_year, cnt,
       LAG(cnt, 1, 0) OVER(ORDER BY hire_year) AS prev_cnt,
       cnt - LAG(cnt, 1, 0) OVER(ORDER BY hire_year) AS diff
FROM (
    SELECT EXTRACT(YEAR FROM hire_date) hire_year, COUNT(*) cnt
    FROM   employees GROUP BY EXTRACT(YEAR FROM hire_date)
)
ORDER BY hire_year;

-- 부서 내 이전 입사자
SELECT last_name, department_id, hire_date,
       LAG(last_name, 1, '(없음)') OVER(
           PARTITION BY department_id ORDER BY hire_date) AS prev_hire
FROM   employees WHERE department_id IS NOT NULL
ORDER BY department_id, hire_date;` },

  { title: '6. FIRST_VALUE, LAST_VALUE, NTH_VALUE', content: `파티션 또는 윈도우 내의 첫 번째, 마지막, n번째 행 값을 반환합니다.

**함수 개요**
| 함수 | 설명 |
|------|------|
| FIRST_VALUE(열) | 윈도우 첫 번째 행의 값 |
| LAST_VALUE(열) | 윈도우 마지막 행의 값 |
| NTH_VALUE(열, n) | 윈도우 n번째 행의 값 |

**⚠️ LAST_VALUE 주의사항**
기본 윈도우가 CURRENT ROW까지이므로 파티션의 마지막 값을 얻으려면 **ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING** 반드시 명시해야 합니다.

**ORDER BY 방향으로 최대/최솟값 활용**
- FIRST_VALUE + ORDER BY DESC = 파티션 내 최댓값
- FIRST_VALUE + ORDER BY ASC = 파티션 내 최솟값`, code: `-- FIRST_VALUE: 부서 최고/최저 급여
SELECT last_name, department_id, salary,
       FIRST_VALUE(salary) OVER(
           PARTITION BY department_id ORDER BY salary DESC
           ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS dept_max,
       FIRST_VALUE(salary) OVER(
           PARTITION BY department_id ORDER BY salary ASC
           ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS dept_min
FROM   employees WHERE department_id IS NOT NULL;

-- LAST_VALUE 올바른 사용 (UNBOUNDED FOLLOWING 필수)
SELECT last_name, salary,
       LAST_VALUE(salary) OVER(
           PARTITION BY department_id ORDER BY salary
           ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS last_val
FROM   employees WHERE department_id = 60 ORDER BY salary;

-- NTH_VALUE: 2위, 3위 급여
SELECT last_name, salary,
       NTH_VALUE(salary, 2) OVER(
           PARTITION BY department_id ORDER BY salary DESC
           ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS second,
       NTH_VALUE(salary, 3) OVER(
           PARTITION BY department_id ORDER BY salary DESC
           ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS third
FROM   employees WHERE department_id IS NOT NULL;` },

  { title: '7. 분석 함수 종합 활용', content: `분석 함수를 결합하여 복잡한 비즈니스 분석을 수행합니다.

**주요 패턴**

1. **분석 결과 필터링**: 서브쿼리 또는 CTE 사용
2. **GROUP BY + 분석 함수**: GROUP BY 후 집계 결과에 순위 부여
3. **분포 분석**: NTILE + GROUP BY 조합
4. **전기간 대비 분석**: LAG + 현재값 - 이전값
5. **누적 비율**: 누적합 / 전체합 * 100

**성능 고려사항**
- 동일한 PARTITION BY/ORDER BY를 가진 여러 분석 함수는 하나의 정렬 작업으로 처리
- PARTITION BY 열에 인덱스가 있으면 성능 향상 가능
- 대용량 테이블에서는 PARTITION BY로 처리 범위를 제한하는 것이 효과적`, code: `-- 부서별 급여 상위 25%(1분위) 직원
SELECT * FROM (
    SELECT last_name, department_id, salary,
           NTILE(4) OVER(PARTITION BY department_id
                         ORDER BY salary DESC) AS quartile
    FROM employees WHERE department_id IS NOT NULL
)
WHERE quartile = 1;

-- 누적 급여 비율 80% 이내 직원 (파레토 분석)
SELECT employee_id, last_name, salary, cum_pct
FROM (
    SELECT employee_id, last_name, salary,
           ROUND(SUM(salary) OVER(ORDER BY salary DESC
               ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)
               / SUM(salary) OVER() * 100, 1) AS cum_pct
    FROM employees
)
WHERE cum_pct <= 80;

-- GROUP BY + 분석 함수: 부서별 합계에 순위 부여
SELECT department_id,
       SUM(salary) dept_total,
       RANK() OVER(ORDER BY SUM(salary) DESC) dept_rank
FROM   employees
WHERE  department_id IS NOT NULL
GROUP BY department_id;` },
]

const CH14_SECTIONS = [
  { title: '1. PIVOT 개요와 기본 구문', content: `PIVOT은 행 데이터를 열로 변환하여 크로스탭(교차표) 형식으로 출력하는 연산자입니다. Oracle 11g부터 지원됩니다.

**PIVOT 기본 구문**
\`\`\`sql
SELECT *
FROM (서브쿼리 또는 테이블)
PIVOT (
    집계함수(집계열) [AS 별칭]
    FOR 피벗열
    IN (값1 [AS 별칭1], 값2 [AS 별칭2], ...)
);
\`\`\`

**세 가지 필수 구성 요소**
| 구성 | 설명 |
|------|------|
| 집계함수 | COUNT, SUM, AVG, MAX, MIN |
| FOR 절 | 어떤 열의 값을 새 열로 변환할지 지정 |
| IN 절 | 새 열이 될 값 목록 (리터럴만 가능) |

**서브쿼리가 필요한 이유**
원본 테이블을 직접 PIVOT하면 집계열/피벗열 외의 모든 열이 자동으로 GROUP BY 기준이 됩니다. 서브쿼리로 필요한 열만 선택하면 원하는 형태의 피벗이 가능합니다.`, code: `-- 기본 PIVOT 예시
SELECT *
FROM (
    SELECT department_id, job_id   -- 필요한 열만 선택
    FROM   employees
    WHERE  department_id IS NOT NULL
)
PIVOT (
    COUNT(*) FOR job_id IN (
        'SA_REP'   AS 영업직,
        'IT_PROG'  AS IT직,
        'ST_CLERK' AS 물류직
    )
)
ORDER BY department_id;

-- IN 절에 없는 값은 자동 제외
-- 해당 교차점에 데이터 없으면 NULL 반환
-- CASE WHEN 동등 표현:
SELECT department_id,
       COUNT(CASE WHEN job_id='SA_REP'   THEN 1 END) AS 영업직,
       COUNT(CASE WHEN job_id='IT_PROG'  THEN 1 END) AS IT직,
       COUNT(CASE WHEN job_id='ST_CLERK' THEN 1 END) AS 물류직
FROM   employees WHERE department_id IS NOT NULL
GROUP BY department_id;` },

  { title: '2. PIVOT 응용', content: `여러 집계 함수 사용, NULL 처리, ORDER BY/WHERE 적용 방법을 알아봅니다.

**여러 집계 함수 사용**
\`\`\`sql
PIVOT (COUNT(*) AS CNT, AVG(salary) AS AVG_SAL
       FOR job_id IN ('SA_REP' AS S, 'IT_PROG' AS I))
\`\`\`
→ 열 이름: **IN별칭_집계별칭** (예: S_CNT, S_AVG_SAL, I_CNT, I_AVG_SAL)

**NULL 처리**
PIVOT에서 데이터가 없는 교차점은 NULL을 반환합니다. NVL 또는 COALESCE로 0 등으로 변환합니다.
\`\`\`sql
SELECT NVL(영업직, 0) AS 영업직, ...
FROM (... PIVOT (...))
\`\`\`

**제약사항**
- IN 절: 리터럴 값만 가능 (서브쿼리 불가)
- 동적 열(런타임 결정): PL/SQL 동적 SQL 필요
- ROLLUP/CUBE와 직접 결합 불가`, code: `-- 여러 집계 함수 PIVOT
SELECT *
FROM (SELECT department_id, job_id, salary FROM employees)
PIVOT (
    COUNT(*)             AS 인원수,
    ROUND(AVG(salary),0) AS 평균급여
    FOR job_id IN (
        'SA_REP'   AS 영업,
        'ST_CLERK' AS 물류
    )
);
-- 결과 열: 영업_인원수, 영업_평균급여, 물류_인원수, 물류_평균급여

-- NULL → 0 변환
SELECT department_id,
       NVL(영업직, 0) AS 영업직,
       NVL(IT직, 0)   AS IT직
FROM (
    SELECT department_id, job_id FROM employees
    WHERE  department_id IS NOT NULL
)
PIVOT (COUNT(*) FOR job_id IN ('SA_REP' AS 영업직, 'IT_PROG' AS IT직));

-- WHERE, ORDER BY 적용
SELECT * FROM ( ... PIVOT ... )
WHERE NVL(영업직, 0) > 0
ORDER BY 영업직 DESC;` },

  { title: '3. UNPIVOT 기본', content: `UNPIVOT은 PIVOT의 반대 연산으로, 여러 열의 값을 행으로 변환합니다.

**UNPIVOT 기본 구문**
\`\`\`sql
SELECT 열들
FROM 테이블
UNPIVOT [INCLUDE NULLS | EXCLUDE NULLS] (
    값열 FOR 레이블열 IN (
        열1 [AS 별칭1], 열2 [AS 별칭2], ...
    )
);
\`\`\`

**결과 행 수**
- 최대 = 원본 행 수 × UNPIVOT 대상 열 수
- EXCLUDE NULLS(기본): 값이 NULL인 행 제외
- INCLUDE NULLS: NULL도 포함

**NULL 처리 옵션 비교**
| 옵션 | 설명 |
|------|------|
| EXCLUDE NULLS (기본) | 변환 열 값이 NULL인 행 제외 |
| INCLUDE NULLS | NULL 값도 행으로 포함 |

**주의**: UNPIVOT 대상 열들은 동일한 데이터 타입이어야 합니다.`, code: `-- UNPIVOT 기본
SELECT prod_id, quarter, sales
FROM quarterly_sales
UNPIVOT (
    sales FOR quarter IN (
        q1_sales AS 'Q1',
        q2_sales AS 'Q2',
        q3_sales AS 'Q3',
        q4_sales AS 'Q4'
    )
);

-- INCLUDE NULLS: NULL 행도 포함
SELECT prod_id, quarter, sales
FROM quarterly_sales
UNPIVOT INCLUDE NULLS (
    sales FOR quarter IN (q1 AS 'Q1', q2 AS 'Q2', q3 AS 'Q3')
);

-- 다중 열 쌍 UNPIVOT
SELECT prod, quarter, qty, price
FROM prod_quarterly
UNPIVOT (
    (qty, price) FOR quarter IN (
        (q1_qty, q1_price) AS 'Q1',
        (q2_qty, q2_price) AS 'Q2'
    )
);` },

  { title: '4. PIVOT/UNPIVOT 종합 활용', content: `PIVOT과 UNPIVOT을 실무 시나리오에 활용하는 패턴을 알아봅니다.

**주요 활용 패턴**

1. **PIVOT + NVL**: NULL을 의미있는 값으로 변환
2. **PIVOT + UNION ALL**: 합계 행 추가
3. **PIVOT + 분석 함수**: 피벗 결과에 순위/누적 등 추가
4. **UNPIVOT + WHERE**: 특정 속성만 필터링
5. **PIVOT → UNPIVOT 왕복**: 데이터 형태 재구성

**PIVOT vs CASE WHEN 선택 기준**
| 상황 | 권장 방법 |
|------|---------|
| 열 목록 고정, 코드 간결성 | PIVOT |
| 동적 열 생성 필요 | PL/SQL 동적 SQL |
| Oracle 11g 미만 환경 | CASE WHEN + GROUP BY |
| 복잡한 조건별 집계 | CASE WHEN |

**데이터 타입 통일 (UNPIVOT용)**
숫자, 날짜 등 다른 타입의 열을 UNPIVOT하려면 TO_CHAR로 문자열로 통일합니다.`, code: `-- PIVOT + 합계 행 (UNION ALL)
SELECT department_id, NVL(영업직,0) AS 영업직, NVL(IT직,0) AS IT직
FROM (SELECT department_id, job_id FROM employees WHERE department_id IS NOT NULL)
PIVOT (COUNT(*) FOR job_id IN ('SA_REP' AS 영업직, 'IT_PROG' AS IT직))
UNION ALL
SELECT NULL,
       COUNT(CASE WHEN job_id='SA_REP'  THEN 1 END),
       COUNT(CASE WHEN job_id='IT_PROG' THEN 1 END)
FROM   employees WHERE department_id IS NOT NULL
ORDER BY department_id NULLS LAST;

-- UNPIVOT + 타입 통일 (TO_CHAR)
SELECT emp_id, attribute, value
FROM (
    SELECT employee_id AS emp_id,
           TO_CHAR(salary)    AS salary_str,
           TO_CHAR(hire_date,'YYYY-MM') AS hire_str
    FROM   employees WHERE employee_id <= 105
)
UNPIVOT (value FOR attribute IN (
    salary_str AS 'SALARY', hire_str AS 'HIRE_YM'));

-- PIVOT 후 분석 함수 추가
SELECT department_id, 영업직, 물류직,
       RANK() OVER(ORDER BY NVL(영업직,0) DESC) AS 영업순위
FROM (SELECT department_id, job_id FROM employees WHERE department_id IS NOT NULL)
PIVOT (COUNT(*) FOR job_id IN ('SA_REP' AS 영업직, 'ST_CLERK' AS 물류직));` },
]

const CH15_SECTIONS = [
  { title: '1. MODEL 절 개요와 기본 구조', content: `MODEL 절은 SQL에서 스프레드시트(엑셀)처럼 배열 참조 방식으로 행 간 계산을 수행합니다. 복리 계산, 점화식, 시뮬레이션 등 이전 행의 결과를 다음 계산에 연쇄 사용하는 패턴에 특히 유용합니다.

**기본 구문**
\`\`\`sql
SELECT ...
FROM 테이블
[WHERE ...]
MODEL
    [PARTITION BY (열)]
    DIMENSION BY (열)
    MEASURES (열 [AS 별칭], ...)
    [RULES [옵션] (
        measures_col[dim_val] = 표현식,
        ...
    )]
[ORDER BY ...]
\`\`\`

**세 가지 핵심 절**
| 절 | 역할 |
|----|------|
| PARTITION BY | 독립 처리 단위 (생략 시 전체가 하나의 파티션) |
| DIMENSION BY | 각 셀(행)을 고유 식별하는 키 열 |
| MEASURES | 계산하거나 참조할 값 열 |

**실행 순서**: WHERE → GROUP BY → HAVING → MODEL → ORDER BY`, code: `-- MODEL 기본 구조
SELECT yr, sales
FROM annual_sales
MODEL
    DIMENSION BY (yr)
    MEASURES     (sales)
    RULES (
        -- 2026년 행 추가 (2025년의 110%)
        sales[2026] = sales[2025] * 1.1,
        sales[2027] = sales[2026] * 1.1
    )
ORDER BY yr;

-- DUAL을 사용한 새 데이터 생성
SELECT n, n * n AS square
FROM DUAL
MODEL
    DIMENSION BY (0 AS n)
    MEASURES     (0 AS dummy)
    RULES (
        dummy[FOR n FROM 1 TO 5 INCREMENT 1] = CV(n)
    )
ORDER BY n;` },

  { title: '2. DIMENSION BY와 MEASURES', content: `DIMENSION BY와 MEASURES의 역할 및 규칙(RULES) 작성 방법을 알아봅니다.

**DIMENSION BY**
- 각 행(셀)을 고유하게 식별하는 열 지정
- 파티션 내에서 중복 차원 값 불허 (ORA-32638 오류)
- 여러 열 조합 가능: DIMENSION BY (year, product_id)

**MEASURES**
- 계산 또는 참조할 값 열
- 초기값 지정 가능: MEASURES (0 AS new_col)
- 여러 열 동시 계산 가능

**규칙(RULES) 기본 패턴**
\`\`\`
measures_col[차원값] = 표현식
\`\`\`
- **단일 셀**: sales[2025] = 50000
- **멀티셀**: sales[year > 2024] = sales[CV(year)-1] * 1.1
- **FOR 루프**: sales[FOR year FROM 2025 TO 2027] = ...

**RULES 옵션**
| 옵션 | 설명 |
|------|------|
| UPSERT ALL(기본) | 없으면 삽입, 있으면 갱신 |
| UPDATE | 있는 행만 갱신 |
| SEQUENTIAL ORDER(기본) | 작성 순서대로 실행 |
| AUTOMATIC ORDER | 의존성 분석 후 자동 순서 |`, code: `-- 단일 셀 규칙
MODEL DIMENSION BY (year) MEASURES (sales)
RULES (sales[2027] = 100000);

-- 멀티셀 규칙 (year > 2025인 모든 행)
RULES (sales[year > 2025] = sales[CV(year)-1] * 1.05)

-- FOR 루프
RULES (
    sales[FOR year FROM 2026 TO 2028 INCREMENT 1]
        = sales[CV(year) - 1] * 1.1
)

-- RULES UPDATE: 기존 행만 갱신
RULES UPDATE (
    price['A'] = price['A'] * 1.1
)

-- RETURN UPDATED ROWS: 갱신/삽입된 행만 반환
MODEL RETURN UPDATED ROWS
    DIMENSION BY (yr) MEASURES (sales)
    RULES (sales[2026] = sales[2025] * 1.1)` },

  { title: '3. CV()와 IS PRESENT', content: `CV()와 IS PRESENT는 MODEL 규칙에서 현재 셀의 차원 값을 참조하고 셀 존재 여부를 확인하는 함수입니다.

**CV(dimension_col)**
- Current Value의 약자
- FOR 루프나 멀티셀 규칙에서 현재 처리 중인 차원 값 반환
- 예: CV(year) → 루프의 현재 연도값

**IS PRESENT**
\`\`\`
measures_col[dim_val] IS PRESENT
\`\`\`
- 해당 차원 값의 셀이 결과에 존재하면 TRUE
- 존재 여부에 따른 조건부 계산에 사용

**집계 범위 참조**
\`\`\`
SUM(measures_col)[dim_col BETWEEN 시작 AND CV(dim_col)]
\`\`\`
누적 합계, 이동 평균 등 범위 집계 가능

**IGNORE NAV vs KEEP NAV**
| 옵션 | 없는 셀 참조 시 |
|------|--------------|
| KEEP NAV(기본) | NULL 반환 |
| IGNORE NAV | 숫자=0, 문자=공백 반환 |`, code: `-- CV() 활용: 전달 대비 계산
SELECT mth, revenue, prev_rev
FROM monthly_data
MODEL DIMENSION BY (mth) MEASURES (revenue, 0 AS prev_rev)
RULES (
    prev_rev[mth > 1] = revenue[CV(mth) - 1]
);

-- IS PRESENT: 셀 존재 시에만 계산
RULES (
    result[n IS NOT NULL] =
        CASE WHEN val[CV(n) - 1] IS PRESENT
             THEN val[CV(n)] + val[CV(n) - 1]
             ELSE val[CV(n)]
        END
)

-- 집계 범위 참조: 누적 합계
RULES (
    cum_sales[yr IS NOT NULL] =
        SUM(sales)[yr BETWEEN 2020 AND CV(yr)]
)

-- IGNORE NAV: 없는 셀 = 0
MODEL IGNORE NAV
    DIMENSION BY (mth) MEASURES (sales, 0 AS diff)
    RULES (diff[mth >= 1] = sales[CV(mth)] - sales[CV(mth)-1])` },

  { title: '4. ITERATE와 반복 계산', content: `ITERATE는 규칙 블록을 지정 횟수만큼 반복 실행합니다. 시뮬레이션, 수렴 계산, 점화식 등에 활용합니다.

**ITERATE 구문**
\`\`\`sql
RULES ITERATE(n) [UNTIL (조건)] (
    규칙들
)
\`\`\`
- ITERATE(n): 최대 n번 반복
- UNTIL(조건): 조건 만족 시 조기 종료
- ITERATION_NUMBER: 현재 반복 횟수 (0부터 시작)

**ITERATION_NUMBER 활용**
\`\`\`
balance[ITERATION_NUMBER + 1]
    = balance[ITERATION_NUMBER] * (1 + rate)
\`\`\`

**복리 계산 패턴**
\`\`\`sql
SELECT yr, ROUND(balance, 0)
FROM DUAL
MODEL
    DIMENSION BY (0 AS yr)
    MEASURES (원금 AS balance)
    RULES (
        balance[FOR yr FROM 1 TO n] =
            balance[CV(yr)-1] * (1 + rate)
    )
\`\`\`

**피보나치 점화식 패턴**
f(n) = f(n-1) + f(n-2)
→ SEQUENTIAL ORDER로 이전 값을 순서대로 계산`, code: `-- 복리 계산 (5년, 연 5%)
SELECT yr, ROUND(balance, 0)
FROM DUAL
MODEL DIMENSION BY (0 AS yr) MEASURES (1000000 AS balance)
RULES (
    balance[FOR yr FROM 1 TO 5 INCREMENT 1]
        = balance[CV(yr)-1] * 1.05
)
ORDER BY yr;

-- ITERATE + ITERATION_NUMBER
SELECT n, val FROM DUAL
MODEL DIMENSION BY (1 AS n) MEASURES (1 AS val)
RULES ITERATE(10) (
    val[ITERATION_NUMBER+1] = val[ITERATION_NUMBER] * 2
)
ORDER BY n;

-- UNTIL 조기 종료
MODEL RULES ITERATE(1000) UNTIL (ABS(x[0] - target) < 0.01) (
    x[ITERATION_NUMBER+1] = x[ITERATION_NUMBER] + step
)

-- 피보나치
RULES SEQUENTIAL ORDER (
    fib[1] = 1, fib[2] = 1,
    fib[FOR n FROM 3 TO 10]
        = fib[CV(n)-1] + fib[CV(n)-2]
)` },

  { title: '5. PARTITION BY와 참조 모델', content: `PARTITION BY와 참조 모델(Reference Model)을 사용하여 복잡한 분석을 수행하는 방법을 알아봅니다.

**PARTITION BY**
- 데이터를 독립적인 파티션으로 분할
- 각 파티션 내에서 DIMENSION BY가 고유 식별
- 예: 제품별, 지역별 독립 예측

**참조 모델(Reference Model)**
\`\`\`sql
MODEL
    REFERENCE ref_name
        ON (서브쿼리)
        DIMENSION BY (...)
        MEASURES (...)
    MAIN main_name
        PARTITION BY (...)
        DIMENSION BY (...)
        MEASURES (...)
        RULES (
            -- ref_name.measure_col[dim_val]로 참조
            result[yr] = main_val[yr] * ref_name.rate[yr]
        )
\`\`\`
- 읽기 전용 외부 데이터 참조
- 주 모델 규칙에서 ref_name.열[차원]으로 접근

**MODEL vs 분석 함수 선택**
| 상황 | 권장 |
|------|------|
| N행 이전 단순 조회 | 분석 함수 (LAG) |
| 계산 결과를 연쇄 참조 | MODEL |
| 복리/점화식/시뮬레이션 | MODEL |`, code: `-- PARTITION BY: 제품별 독립 예측
SELECT product_id, yr, sales
FROM product_sales
MODEL
    PARTITION BY (product_id)
    DIMENSION BY (yr)
    MEASURES     (sales)
    RULES (
        sales[2027] = sales[2026] * 1.1
    )
ORDER BY product_id, yr;

-- 참조 모델 패턴
SELECT yr, main_sales, growth_rate
FROM (SELECT yr, sales AS main_sales FROM main_table)
MODEL
    REFERENCE rate_ref
        ON (SELECT yr, rate FROM growth_rates)
        DIMENSION BY (yr)
        MEASURES (rate)
    MAIN main_m
        DIMENSION BY (yr)
        MEASURES (main_sales)
        RULES (
            main_sales[yr > 2025]
                = main_sales[CV(yr)-1] * (1 + rate_ref.rate[CV(yr)])
        )
ORDER BY yr;` },
]

const CH16_SECTIONS = [
  { title: '1. Flashback 기술 개요와 UNDO 데이터', content: `Oracle Flashback 기술은 UNDO(실행 취소) 데이터를 활용하여 DML 실수를 신속하게 복구하는 기능입니다. 전통적인 백업/복구보다 훨씬 빠르고 간단하게 데이터를 원복할 수 있습니다.

**Flashback 기술 종류**
| 기능 | 저장 기반 | 범위 | 목적 |
|------|-----------|------|------|
| Flashback Query (AS OF) | UNDO | 테이블 | 과거 데이터 조회(읽기 전용) |
| Flashback Version Query | UNDO | 행 | 행 변경 이력 추적 |
| FLASHBACK TABLE | UNDO | 테이블 | 테이블 DML 복구 |
| Flashback Drop | RECYCLEBIN | 테이블 | DROP된 테이블 복구 |
| Flashback Database | Flashback Log | DB 전체 | 데이터베이스 전체 복구 |

**UNDO 데이터 보존**
\`\`\`sql
-- UNDO 보존 기간 설정 (초 단위, 기본 900초)
ALTER SYSTEM SET UNDO_RETENTION = 3600;

-- 현재 SCN 조회
SELECT current_scn FROM v$database;
SELECT dbms_flashback.get_system_change_number FROM dual;

-- SCN ↔ TIMESTAMP 변환
SELECT scn_to_timestamp(current_scn) FROM v$database;
SELECT timestamp_to_scn(SYSTIMESTAMP) FROM dual;
\`\`\`

UNDO_RETENTION은 힌트이므로 공간 부족 시 조기 삭제될 수 있습니다. 보장이 필요하면:
\`\`\`sql
ALTER TABLESPACE undotbs1 RETENTION GUARANTEE;
\`\`\`` },
  { title: '2. Flashback Query (AS OF TIMESTAMP/SCN)', content: `Flashback Query는 테이블 원본을 변경하지 않고 과거 특정 시점의 데이터를 SELECT로 조회합니다.

**AS OF TIMESTAMP 구문**
\`\`\`sql
-- 기본 형태
SELECT 열
FROM   테이블
AS OF TIMESTAMP 표현식
[WHERE 조건];

-- 30분 전 데이터 조회
SELECT employee_id, salary
FROM   employees
AS OF TIMESTAMP (SYSTIMESTAMP - INTERVAL '30' MINUTE)
WHERE  employee_id = 100;

-- 특정 절대 시각 지정
SELECT *
FROM   orders
AS OF TIMESTAMP TO_TIMESTAMP('2024-01-15 09:00:00', 'YYYY-MM-DD HH24:MI:SS');
\`\`\`

**AS OF SCN 구문**
\`\`\`sql
-- SCN으로 더 정확한 시점 지정
SELECT salary
FROM   employees
AS OF SCN 12345
WHERE  employee_id = 100;
\`\`\`

**현재 vs 과거 비교 (조인 활용)**
\`\`\`sql
SELECT cur.employee_id,
       old.salary AS before_salary,
       cur.salary AS current_salary
FROM   employees cur
JOIN   employees AS OF TIMESTAMP (SYSTIMESTAMP - INTERVAL '1' HOUR) old
       ON cur.employee_id = old.employee_id
WHERE  cur.salary <> old.salary;
\`\`\`

**삭제된 행 복원**
\`\`\`sql
-- AS OF로 삭제 전 데이터 확인 후 INSERT
INSERT INTO employees
SELECT *
FROM   employees
AS OF TIMESTAMP (SYSTIMESTAMP - INTERVAL '30' MINUTE)
WHERE  employee_id = 999;
COMMIT;
\`\`\`` },
  { title: '3. Flashback Version Query (VERSIONS BETWEEN)', content: `Flashback Version Query는 특정 기간 동안 행이 어떻게 변경되었는지 이력을 추적합니다. 각 버전(변경 시점)을 행으로 반환합니다.

**기본 구문**
\`\`\`sql
SELECT 의사컬럼, 일반열
FROM   테이블
VERSIONS BETWEEN {TIMESTAMP | SCN} 시작 AND 끝
[WHERE 조건];
\`\`\`

**주요 의사 컬럼(Pseudo Column)**
| 의사 컬럼 | 설명 |
|-----------|------|
| VERSIONS_STARTTIME | 해당 버전 시작 시각 (NULL=범위 시작 이전부터 존재) |
| VERSIONS_ENDTIME | 해당 버전 종료 시각 (NULL=현재 유효한 최신 버전) |
| VERSIONS_STARTSCN | 해당 버전 시작 SCN |
| VERSIONS_ENDSCN | 해당 버전 종료 SCN |
| VERSIONS_OPERATION | I(INSERT), U(UPDATE), D(DELETE) |
| VERSIONS_XID | 트랜잭션 ID (FLASHBACK_TRANSACTION_QUERY 연계) |

**사용 예시**
\`\`\`sql
-- 지난 2시간 내 salary 변경 이력
SELECT versions_starttime,
       versions_endtime,
       versions_operation,
       salary
FROM   employees
VERSIONS BETWEEN TIMESTAMP
       (SYSTIMESTAMP - INTERVAL '2' HOUR) AND SYSTIMESTAMP
WHERE  employee_id = 100;

-- UNDO에 남아 있는 전체 이력
SELECT versions_startscn, versions_endscn,
       versions_operation, versions_xid, salary
FROM   employees
VERSIONS BETWEEN SCN MINVALUE AND MAXVALUE
WHERE  last_name = 'King';

-- 오늘 DELETE된 행 추적
SELECT versions_starttime AS deleted_time,
       product_id, product_name
FROM   products
VERSIONS BETWEEN TIMESTAMP TRUNC(SYSDATE) AND SYSTIMESTAMP
WHERE  versions_operation = 'D';
\`\`\`` },
  { title: '4. FLASHBACK TABLE 문 (DML 복구)', content: `FLASHBACK TABLE은 테이블 데이터를 특정 과거 시점이나 SCN으로 실제 복구합니다. 관련 인덱스와 제약도 함께 복원됩니다.

**사전 조건 및 구문**
\`\`\`sql
-- 1. ROW MOVEMENT 활성화 (TIMESTAMP 기반 복구 필수)
ALTER TABLE employees ENABLE ROW MOVEMENT;

-- 2. TIMESTAMP 기반 복구
FLASHBACK TABLE employees
TO TIMESTAMP (SYSTIMESTAMP - INTERVAL '30' MINUTE);

-- 3. SCN 기반 복구
FLASHBACK TABLE orders TO SCN 12345;

-- 4. 트리거 활성화 옵션 (기본: 트리거 비활성화)
FLASHBACK TABLE employees
TO TIMESTAMP (SYSTIMESTAMP - INTERVAL '1' HOUR)
ENABLE TRIGGERS;
\`\`\`

**주의사항**
| 항목 | 내용 |
|------|------|
| DDL 변경 전 시점 | 복구 불가 (ALTER TABLE, TRUNCATE 이전) |
| UNDO 만료 | ORA-01555 스냅숏 너무 오래됨 오류 발생 |
| 트리거 | 기본 비활성화, ENABLE TRIGGERS로 활성화 가능 |
| 권한 | FLASHBACK ANY TABLE 또는 테이블 소유자 권한 |

**선택적 복원 (특정 행만)**
\`\`\`sql
-- UPDATE 실수 복원 (MERGE 활용)
MERGE INTO employees cur
USING (
  SELECT employee_id, salary
  FROM   employees
  AS OF TIMESTAMP (SYSTIMESTAMP - INTERVAL '1' HOUR)
) old
ON (cur.employee_id = old.employee_id)
WHEN MATCHED THEN
  UPDATE SET cur.salary = old.salary;
COMMIT;
\`\`\`` },
  { title: '5. Flashback Drop과 RECYCLEBIN 관리', content: `DROP TABLE 시 테이블은 즉시 삭제되지 않고 RECYCLEBIN으로 이동합니다. RECYCLEBIN에서 복구하는 기능이 Flashback Drop입니다.

**RECYCLEBIN 조회**
\`\`\`sql
-- 현재 사용자의 RECYCLEBIN
SELECT original_name, object_name, type, droptime
FROM   recyclebin
ORDER BY droptime DESC;

-- SQL*Plus 명령
SHOW RECYCLEBIN
\`\`\`

**Flashback Drop — 테이블 복구**
\`\`\`sql
-- 원래 이름으로 복구
FLASHBACK TABLE emp TO BEFORE DROP;

-- 다른 이름으로 복구 (원래 이름이 이미 존재하는 경우)
FLASHBACK TABLE emp TO BEFORE DROP RENAME TO emp_old;

-- 같은 이름이 여러 개: OBJECT_NAME(BIN$...) 직접 사용
FLASHBACK TABLE "BIN$xxxxxxxxxxxxx" TO BEFORE DROP;
\`\`\`

**RECYCLEBIN 관리 (PURGE)**
\`\`\`sql
-- 특정 테이블 영구 삭제
PURGE TABLE old_emp;

-- 현재 사용자의 RECYCLEBIN 전체 비우기
PURGE RECYCLEBIN;

-- DBA: 모든 사용자의 RECYCLEBIN 비우기
PURGE DBA_RECYCLEBIN;

-- 처음부터 RECYCLEBIN에 넣지 않고 즉시 삭제
DROP TABLE t PURGE;
\`\`\`

**FLASHBACK TABLE TO BEFORE DROP vs TO TIMESTAMP**
| 구분 | Flashback Drop | FLASHBACK TABLE TO TIMESTAMP |
|------|----------------|------------------------------|
| 저장소 | RECYCLEBIN | UNDO 테이블스페이스 |
| ROW MOVEMENT | 불필요 | 필요 |
| 시간 제한 | RECYCLEBIN 공간 있을 때까지 | UNDO_RETENTION 기간 |
| 복구 대상 | DROP 실수 | DML(UPDATE/DELETE) 실수 |` },
  { title: '6. Flashback Transaction Query와 종합 활용', content: `Flashback Version Query와 연계하여 특정 트랜잭션의 UNDO SQL을 조회하고 변경을 역전할 수 있습니다.

**FLASHBACK_TRANSACTION_QUERY 활용**
\`\`\`sql
-- 1단계: Flashback Version Query로 XID 확인
SELECT versions_xid, versions_operation, salary
FROM   employees
VERSIONS BETWEEN SCN MINVALUE AND MAXVALUE
WHERE  employee_id = 100
ORDER BY versions_startscn DESC;

-- 2단계: XID로 UNDO SQL 조회
SELECT operation, table_name, undo_sql
FROM   flashback_transaction_query
WHERE  xid = HEXTORAW('앞서_찾은_XID');
-- undo_sql을 실행하면 해당 변경을 역전 가능
\`\`\`

**종합 복구 시나리오**
\`\`\`sql
-- 시나리오: 중요 작업 전 SCN 저장
SELECT current_scn FROM v$database;  -- 예: 12345

-- UPDATE 실수 후 복구 흐름
-- ① 과거 값 확인
SELECT salary FROM employees AS OF SCN 12345 WHERE employee_id = 100;

-- ② 변경 이력 추적
SELECT versions_startscn, versions_operation, salary
FROM   employees
VERSIONS BETWEEN SCN 12345 AND MAXVALUE
WHERE  employee_id = 100;

-- ③ FLASHBACK TABLE로 원복
ALTER TABLE employees ENABLE ROW MOVEMENT;
FLASHBACK TABLE employees TO SCN 12345;

-- ④ ROW MOVEMENT 비활성화 (선택)
ALTER TABLE employees DISABLE ROW MOVEMENT;
\`\`\`

**Flashback 기능 선택 가이드**
\`\`\`
특정 시점 데이터 확인만 필요 → AS OF TIMESTAMP/SCN
행 변경 이력 추적 필요     → VERSIONS BETWEEN
특정 행만 선택적 복원      → AS OF + INSERT/MERGE
테이블 전체 복구           → FLASHBACK TABLE TO TIMESTAMP/SCN
DROP된 테이블 복구         → FLASHBACK TABLE TO BEFORE DROP
데이터베이스 전체 복구     → FLASHBACK DATABASE (DBA 작업)
\`\`\`` },
]

const CH17_SECTIONS = [
  { title: '1. MERGE 개요와 기본 구문', content: `MERGE 문은 단일 DML로 조인 조건에 따라 행이 대상 테이블에 존재하면 UPDATE, 없으면 INSERT를 수행합니다. 데이터 웨어하우스 ETL, 증분 동기화에 최적화된 명령입니다.

**기본 구문**
\`\`\`sql
MERGE INTO   대상_테이블 대상_별칭
USING        {소스_테이블 | 뷰 | 서브쿼리} 소스_별칭
ON           (조인_조건)
WHEN MATCHED THEN
    UPDATE SET 열1 = 값1, 열2 = 값2
    [DELETE WHERE 조건]
WHEN NOT MATCHED THEN
    INSERT [(열_목록)]
    VALUES (값_목록)
    [WHERE 조건];
\`\`\`

**기본 예제 — copy_emp3를 employees로 동기화**
\`\`\`sql
MERGE INTO copy_emp3 c
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
                  e.department_id);
\`\`\`

**MERGE 특징**
| 항목 | 내용 |
|------|------|
| 단일 패스 | 소스 데이터를 한 번만 읽어 UPDATE/INSERT 동시 처리 |
| 성능 향상 | 개별 UPDATE+INSERT보다 효율적 |
| DML | COMMIT/ROLLBACK 가능 |
| USING 소스 | 테이블, 뷰, 서브쿼리 모두 가능 |
| 절 선택 | WHEN MATCHED, WHEN NOT MATCHED 둘 다 선택적 |` },
  { title: '2. WHEN MATCHED THEN UPDATE/DELETE', content: `WHEN MATCHED THEN은 ON 조건에 일치하는 행(대상에 이미 존재하는 행)에 적용됩니다. UPDATE, UPDATE+DELETE WHERE 조합을 사용할 수 있습니다.

**UPDATE만 사용**
\`\`\`sql
MERGE INTO copy_emp c
USING employees e ON (c.employee_id = e.employee_id)
WHEN MATCHED THEN
    UPDATE SET c.salary = e.salary,
               c.job_id = e.job_id;
\`\`\`

**UPDATE WHERE (조건부 업데이트)**
\`\`\`sql
-- salary > 10000인 행만 업데이트
MERGE INTO copy_emp c
USING employees e ON (c.employee_id = e.employee_id)
WHEN MATCHED THEN
    UPDATE SET c.salary = e.salary
    WHERE  e.salary > 10000;
\`\`\`

**UPDATE + DELETE WHERE**
\`\`\`sql
-- 업데이트 후 commission_pct가 있는 행 삭제
MERGE INTO copy_emp3 c
USING (SELECT * FROM employees) e
ON    (c.employee_id = e.employee_id)
WHEN MATCHED THEN
    UPDATE SET c.salary = e.salary
    DELETE WHERE e.commission_pct IS NOT NULL;
\`\`\`

**주의사항**
\`\`\`sql
-- ORA-38104: ON 절 컬럼 업데이트 불가
MERGE INTO copy_emp c USING employees e
ON (c.employee_id = e.employee_id)
WHEN MATCHED THEN
    UPDATE SET c.employee_id = e.employee_id + 1;  -- 오류!
\`\`\`

DELETE WHERE 실행 순서: ①ON 조건으로 MATCHED 행 찾기 ②UPDATE WHERE 필터링 ③UPDATE 실행 ④DELETE WHERE 평가 ⑤삭제.` },
  { title: '3. WHEN NOT MATCHED THEN INSERT', content: `WHEN NOT MATCHED THEN은 ON 조건에 일치하는 대상 행이 없는 경우(소스에만 있는 행)에 INSERT를 수행합니다.

**기본 INSERT**
\`\`\`sql
MERGE INTO copy_emp c
USING employees e ON (c.employee_id = e.employee_id)
WHEN NOT MATCHED THEN
    INSERT (employee_id, last_name, salary)
    VALUES (e.employee_id, e.last_name, e.salary);
\`\`\`

**INSERT WHERE (조건부 삽입)**
\`\`\`sql
-- department_id가 있는 행만 삽입
MERGE INTO copy_emp c
USING employees e ON (c.employee_id = e.employee_id)
WHEN NOT MATCHED THEN
    INSERT (employee_id, last_name, salary, department_id)
    VALUES (e.employee_id, e.last_name, e.salary, e.department_id)
    WHERE  e.department_id IS NOT NULL;
\`\`\`

**DELETE WHERE와 INSERT WHERE 조합**
\`\`\`sql
MERGE INTO target t
USING source s ON (t.id = s.id)
WHEN MATCHED THEN
    UPDATE SET t.val = s.val, t.status = s.status
    DELETE WHERE s.status = 'INACTIVE'
WHEN NOT MATCHED THEN
    INSERT (id, val, status)
    VALUES (s.id, s.val, s.status)
    WHERE  s.status = 'ACTIVE';  -- ACTIVE인 신규 행만 삽입
\`\`\`

**WHEN NOT MATCHED THEN만 사용 — "없으면 삽입"**
\`\`\`sql
-- 중복 방지 삽입 패턴
MERGE INTO copy_emp c
USING employees e ON (c.employee_id = e.employee_id)
WHEN NOT MATCHED THEN
    INSERT (employee_id, last_name, salary)
    VALUES (e.employee_id, e.last_name, e.salary);
\`\`\`` },
  { title: '4. MERGE 고급 활용과 ETL 패턴', content: `MERGE는 데이터 웨어하우스 ETL, 집계 요약 테이블 갱신, 복수 소스 통합 등 다양한 고급 패턴에 활용됩니다.

**서브쿼리 소스로 집계 결과 동기화**
\`\`\`sql
MERGE INTO dept_summary ds
USING (
  SELECT department_id,
         COUNT(*)      AS headcount,
         SUM(salary)   AS total_salary
  FROM   employees
  GROUP BY department_id
) src
ON    (ds.department_id = src.department_id)
WHEN MATCHED THEN
    UPDATE SET ds.headcount    = src.headcount,
               ds.total_salary = src.total_salary
WHEN NOT MATCHED THEN
    INSERT (department_id, headcount, total_salary)
    VALUES (src.department_id, src.headcount, src.total_salary);
\`\`\`

**복수 소스 통합 (UNION ALL)**
\`\`\`sql
MERGE INTO copy_emp c
USING (
  SELECT employee_id, last_name, salary FROM new_emp
  UNION ALL
  SELECT employee_id, last_name, salary FROM transfer_emp
) src
ON    (c.employee_id = src.employee_id)
WHEN MATCHED THEN UPDATE SET c.salary = src.salary
WHEN NOT MATCHED THEN INSERT (employee_id, last_name, salary)
                      VALUES (src.employee_id, src.last_name, src.salary);
\`\`\`

**주요 오류와 대처**
| 오류 | 원인 | 해결 |
|------|------|------|
| ORA-38104 | ON 절 컬럼을 UPDATE SET에서 수정 | ON 절 컬럼 제외 |
| ORA-30926 | 소스에 ON 키 중복 → 대상 동일 행 반복 수정 | USING 소스에 DISTINCT/GROUP BY 추가 |

**MERGE 전체 흐름**
\`\`\`sql
-- 배치 ETL 예시
MERGE INTO sales_fact sf
USING (
  SELECT product_id, region_id, sale_date,
         SUM(quantity) AS total_qty,
         SUM(amount)   AS total_amt
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
COMMIT;
\`\`\`` },
]

const CONTENT_MAP: Record<string, typeof CH24_SECTIONS> = {
  ch01: CH01_SECTIONS,
  ch02: CH02_SECTIONS,
  ch03: CH03_SECTIONS,
  ch04: CH04_SECTIONS,
  ch05: CH05_SECTIONS,
  ch06: CH06_SECTIONS,
  ch07: CH07_SECTIONS,
  ch08: CH08_SECTIONS,
  ch09: CH09_SECTIONS,
  ch10: CH10_SECTIONS,
  ch11: CH11_SECTIONS,
  ch12: CH12_SECTIONS,
  ch13: CH13_SECTIONS,
  ch14: CH14_SECTIONS,
  ch15: CH15_SECTIONS,
  ch16: CH16_SECTIONS,
  ch17: CH17_SECTIONS,
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
