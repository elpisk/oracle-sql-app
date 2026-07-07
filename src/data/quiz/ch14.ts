import type { QuizQuestion } from '@/lib/types'

export const ch14Quiz: QuizQuestion[] = [
  // ── 하(기초) 1~20 ──────────────────────────────────────────
  {
    id: 1401, level: 'basic',
    question: 'PIVOT 연산자의 주된 역할은?',
    options: [
      '행을 특정 조건으로 필터링한다',
      '행 데이터를 열로 변환하여 크로스탭(교차표) 형식으로 출력한다',
      '열을 행으로 변환한다',
      '두 테이블을 조인한다',
    ],
    correctAnswer: 1,
    explanation: 'PIVOT은 행 값을 열 헤더로 변환하여 크로스탭(피벗 테이블) 형식으로 데이터를 출력합니다. 예: 부서별 직무 인원수를 행→열로 변환.',
  },
  {
    id: 1402, level: 'basic',
    question: 'PIVOT 구문의 올바른 위치는?',
    options: [
      'SELECT 절 안에 사용한다',
      'WHERE 절 뒤에 사용한다',
      'FROM 절의 서브쿼리 또는 테이블 뒤에 사용한다',
      'GROUP BY 절 대신 사용한다',
    ],
    correctAnswer: 2,
    explanation: 'PIVOT은 FROM 절에서 테이블 또는 인라인 뷰 뒤에 위치합니다. 예: SELECT * FROM (서브쿼리) PIVOT (집계함수 FOR 열 IN (값1, 값2))',
  },
  {
    id: 1403, level: 'basic',
    question: 'PIVOT 절에서 반드시 필요한 세 가지 구성 요소는?',
    options: [
      'GROUP BY, ORDER BY, HAVING',
      '집계 함수, FOR 절(피벗 열), IN 절(열 값 목록)',
      'WHERE, FROM, SELECT',
      'JOIN, ON, USING',
    ],
    correctAnswer: 1,
    explanation: 'PIVOT 구문: PIVOT(집계함수(집계열) FOR 피벗열 IN (값1 AS 별칭1, 값2 AS 별칭2, ...)). 집계 함수, FOR 절(어떤 열의 값을 열로 변환), IN 절(열 값 목록) 세 가지가 필수.',
  },
  {
    id: 1404, level: 'basic',
    question: 'PIVOT을 사용할 때 IN 절에 나열하는 것은?',
    options: [
      '집계할 열 이름',
      '결과 행의 수',
      '피벗 열에서 새 열 헤더가 될 값 목록',
      'GROUP BY 기준 열',
    ],
    correctAnswer: 2,
    explanation: 'IN 절에는 피벗 열(FOR 절의 열)에서 새 열 헤더로 변환할 값 목록을 나열합니다. 예: FOR job_id IN (\'SA_REP\' AS 영업직, \'IT_PROG\' AS IT직)',
  },
  {
    id: 1405, level: 'basic',
    question: 'PIVOT에서 IN 절에 없는 값(피벗 열의 다른 값)은 결과에 어떻게 표시되는가?',
    options: [
      '오류가 발생한다',
      'IN 절에 없는 값은 결과에서 제외(무시)된다',
      '별도 행으로 추가된다',
      '모두 NULL로 표시된다',
    ],
    correctAnswer: 1,
    explanation: 'PIVOT의 IN 절에 명시된 값만 새 열이 됩니다. IN 절에 없는 피벗 열의 값은 결과에서 자동으로 제외됩니다.',
  },
  {
    id: 1406, level: 'basic',
    question: '다음 PIVOT 쿼리에서 결과의 열 이름은?\n`PIVOT(COUNT(*) FOR job_id IN (\'SA_REP\', \'IT_PROG\'))`',
    options: [
      'COUNT, JOB_ID',
      'SA_REP, IT_PROG',
      '\'SA_REP\', \'IT_PROG\'',
      'COL1, COL2',
    ],
    correctAnswer: 1,
    explanation: 'IN 절의 값이 열 이름이 됩니다. 별칭을 지정하지 않으면 값 자체가 열 이름이 되므로 \'SA_REP\'는 SA_REP, \'IT_PROG\'는 IT_PROG가 됩니다. AS 별칭으로 이름 변경 가능.',
  },
  {
    id: 1407, level: 'basic',
    question: 'PIVOT을 사용할 때 서브쿼리가 필요한 이유는?',
    options: [
      'PIVOT은 서브쿼리 없이 사용할 수 없다',
      '피벗 대상 열과 집계 열만 포함한 데이터를 준비하여 불필요한 열을 제거하기 위해',
      '서브쿼리가 없으면 집계 함수를 사용할 수 없다',
      '테이블에는 직접 PIVOT을 적용할 수 없다',
    ],
    correctAnswer: 1,
    explanation: '원본 테이블에 피벗에 포함하지 않을 열이 있으면 해당 열이 자동으로 GROUP BY 기준이 됩니다. 서브쿼리로 필요한 열만 선택하면 원하는 형태로 피벗할 수 있습니다.',
  },
  {
    id: 1408, level: 'basic',
    question: 'UNPIVOT 연산자의 역할은?',
    options: [
      '행을 열로 변환한다',
      '열을 행으로 변환하여 크로스탭 데이터를 세로 형식으로 되돌린다',
      '테이블 행을 삭제한다',
      'NULL 값을 제거한다',
    ],
    correctAnswer: 1,
    explanation: 'UNPIVOT은 PIVOT의 반대 연산으로, 여러 열의 값을 행으로 변환합니다. 예: Q1_SALES, Q2_SALES, Q3_SALES 열 → 분기(QUARTER)와 매출(SALES) 두 열로 변환.',
  },
  {
    id: 1409, level: 'basic',
    question: 'UNPIVOT 구문에서 FOR 절과 IN 절의 역할은?',
    options: [
      'FOR: 집계 기준 열, IN: 필터 조건',
      'FOR: 행으로 변환될 값을 담을 새 열 이름, IN: 열로 변환할 기존 열 목록',
      'FOR: 출력 행 수 제한, IN: 집계 함수 지정',
      'FOR: 정렬 기준, IN: 파티션 기준',
    ],
    correctAnswer: 1,
    explanation: 'UNPIVOT(값열 FOR 레이블열 IN (열1 AS 별칭1, 열2 AS 별칭2)). FOR: 각 열의 값을 담을 새 열(값열)과 원래 열 이름을 담을 열(레이블열). IN: 행으로 변환할 기존 열 목록.',
  },
  {
    id: 1410, level: 'basic',
    question: 'UNPIVOT 기본 동작에서 NULL 값은 어떻게 처리되는가?',
    options: [
      'NULL 값이 있는 행은 모두 포함된다',
      'NULL 값이 있는 열에 해당하는 행은 기본적으로 제외된다',
      'NULL은 0으로 변환된다',
      'NULL은 공백 문자열로 변환된다',
    ],
    correctAnswer: 1,
    explanation: 'UNPIVOT의 기본 동작(EXCLUDE NULLS)은 변환되는 열의 값이 NULL인 행을 결과에서 제외합니다. NULL 행도 포함하려면 INCLUDE NULLS 옵션을 사용합니다.',
  },
  {
    id: 1411, level: 'basic',
    question: 'PIVOT 결과에서 집계 대상 데이터가 없는 교차점의 값은?',
    options: [
      '0이 표시된다',
      'NULL이 표시된다',
      'N/A가 표시된다',
      '오류가 발생한다',
    ],
    correctAnswer: 1,
    explanation: 'PIVOT에서 해당 행-열 교차점에 데이터가 없으면 NULL이 반환됩니다. NVL이나 COALESCE 함수로 NULL을 0 등으로 변환할 수 있습니다.',
  },
  {
    id: 1412, level: 'basic',
    question: 'PIVOT의 집계 함수로 사용할 수 없는 것은?',
    options: [
      'COUNT(*)',
      'SUM(salary)',
      'MAX(salary)',
      'SELECT MAX(salary)',
    ],
    correctAnswer: 3,
    explanation: 'PIVOT의 집계 함수 자리에는 COUNT, SUM, AVG, MAX, MIN 등 단일 집계 함수를 사용합니다. SELECT는 집계 함수가 아닙니다.',
  },
  {
    id: 1413, level: 'basic',
    question: 'PIVOT을 사용하지 않고 CASE WHEN으로 동일한 피벗 결과를 얻을 때의 관계는?',
    options: [
      'PIVOT과 CASE WHEN은 완전히 다른 결과를 반환한다',
      'PIVOT은 CASE WHEN + GROUP BY 패턴의 간결한 표현이다',
      'CASE WHEN은 열을 행으로 변환하고, PIVOT은 행을 열로 변환한다',
      'CASE WHEN이 항상 더 빠르다',
    ],
    correctAnswer: 1,
    explanation: 'PIVOT은 내부적으로 CASE WHEN ... THEN 값 END와 GROUP BY의 조합과 동일한 결과를 반환합니다. PIVOT은 이 패턴을 더 간결하게 표현하는 구문적 설탕(Syntactic Sugar)입니다.',
  },
  {
    id: 1414, level: 'basic',
    question: 'UNPIVOT에서 INCLUDE NULLS 옵션의 역할은?',
    options: [
      'NULL을 0으로 변환한다',
      '변환되는 열의 값이 NULL인 행도 결과에 포함한다',
      'NULL인 행을 제거한다',
      'NULL을 포함한 열만 UNPIVOT한다',
    ],
    correctAnswer: 1,
    explanation: 'UNPIVOT INCLUDE NULLS: 변환 열의 값이 NULL이어도 결과 행에 포함. EXCLUDE NULLS(기본): NULL인 행 제외. 예: Q3_SALES가 NULL이어도 Q3 행을 포함하려면 INCLUDE NULLS 사용.',
  },
  {
    id: 1415, level: 'basic',
    question: 'PIVOT의 IN 절에서 AS 별칭의 역할은?',
    options: [
      '별칭은 집계 결과에 적용된다',
      '피벗 결과 열의 이름을 지정한다',
      'WHERE 절 조건에 사용된다',
      '별칭 없이는 PIVOT 오류가 발생한다',
    ],
    correctAnswer: 1,
    explanation: 'IN 절의 AS 별칭은 피벗 결과에서 해당 값이 열 이름으로 표시되는 방식을 지정합니다. 별칭이 없으면 값 자체(예: \'SA_REP\')가 열 이름이 됩니다.',
  },
  {
    id: 1416, level: 'basic',
    question: '부서별, 직무별 직원 수 피벗 결과에서 원본에 없던 부서-직무 조합은 어떻게 나타나는가?',
    options: [
      '행이 생성되지 않는다',
      '해당 교차점이 NULL로 표시된다',
      '0으로 표시된다',
      'PIVOT 자체가 실패한다',
    ],
    correctAnswer: 1,
    explanation: '피벗 결과에서 특정 부서에 해당 직무 직원이 없으면 COUNT(*)의 집계 결과가 없어 NULL이 표시됩니다. NVL(열, 0)으로 0으로 변환 가능합니다.',
  },
  {
    id: 1417, level: 'basic',
    question: 'UNPIVOT에서 IN 절의 열 이름에 AS 별칭을 붙이면?',
    options: [
      '결과 행에서 해당 열의 원래 열 이름 대신 별칭이 레이블 열에 표시된다',
      '결과 데이터가 변환된다',
      '별칭이 WHERE 절 필터로 사용된다',
      '오류가 발생한다',
    ],
    correctAnswer: 0,
    explanation: 'UNPIVOT의 IN 절에서 AS 별칭은 레이블 열에 열 이름 대신 표시할 문자열을 지정합니다. 예: IN (q1_sales AS \'Q1\', q2_sales AS \'Q2\') → 레이블 열에 Q1, Q2가 표시됨.',
  },
  {
    id: 1418, level: 'basic',
    question: 'PIVOT의 서브쿼리에 불필요한 열이 포함되면 어떤 문제가 생기는가?',
    options: [
      '오류가 발생한다',
      '불필요한 열이 자동으로 GROUP BY 기준이 되어 예상보다 많은 행이 반환된다',
      '집계 함수가 적용되지 않는다',
      'IN 절이 무시된다',
    ],
    correctAnswer: 1,
    explanation: 'PIVOT에서 서브쿼리의 열 중 집계 열, 피벗 열 외의 나머지 열은 자동으로 GROUP BY 기준이 됩니다. 불필요한 열(예: employee_id)이 있으면 각 직원별로 행이 생성되어 피벗이 제대로 되지 않습니다.',
  },
  {
    id: 1419, level: 'basic',
    question: 'PIVOT 결과에서 전체 합계 행을 포함하려면 어떻게 해야 하는가?',
    options: [
      'PIVOT 절에 WITH TOTAL 옵션 추가',
      'ROLLUP이나 CUBE를 PIVOT과 직접 결합할 수 없어 별도 UNION ALL로 합계 행을 추가해야 한다',
      'IN 절에 TOTAL 키워드 추가',
      'PIVOT이 자동으로 합계 행을 생성한다',
    ],
    correctAnswer: 1,
    explanation: 'PIVOT은 ROLLUP/CUBE와 직접 결합할 수 없습니다. 전체 합계가 필요하면 PIVOT 결과와 별도 합계 쿼리를 UNION ALL로 결합하거나, PIVOT 전 서브쿼리에서 ROLLUP으로 집계 후 처리하는 방법을 사용합니다.',
  },
  {
    id: 1420, level: 'basic',
    question: 'UNPIVOT으로 변환하는 열의 데이터 타입이 서로 다르면?',
    options: [
      '자동으로 통일된다',
      '오류 없이 변환된다',
      'UNPIVOT하는 모든 열의 데이터 타입이 호환되어야 하며, 다르면 오류가 발생한다',
      '첫 번째 열의 타입으로 통일된다',
    ],
    correctAnswer: 2,
    explanation: 'UNPIVOT에서 IN 절에 나열하는 열들은 동일한 또는 호환 가능한 데이터 타입이어야 합니다. 타입이 다른 열을 한 UNPIVOT에 넣으면 오류가 발생합니다.',
  },

  // ── 중(응용) 21~40 ─────────────────────────────────────────
  {
    id: 1421, level: 'intermediate',
    question: `다음 쿼리 결과로 올바른 것은?
SELECT * FROM (SELECT department_id, job_id FROM employees)
PIVOT(COUNT(*) FOR job_id IN ('SA_REP' AS 영업직, 'IT_PROG' AS IT직));`,
    options: [
      '전체 직원 수 1행',
      '직무별 열(영업직, IT직)과 부서별 행의 교차표. 해당 직원이 없으면 NULL',
      'job_id별 2열, 전체 1행',
      '오류 발생',
    ],
    correctAnswer: 1,
    explanation: '서브쿼리에 department_id와 job_id가 있으므로 PIVOT 후: 행 = department_id, 열 = 영업직(SA_REP 수), IT직(IT_PROG 수). 해당 부서에 그 직무 직원이 없으면 NULL.',
  },
  {
    id: 1422, level: 'intermediate',
    question: `다음 PIVOT 쿼리의 문제점은?
SELECT * FROM employees
PIVOT(COUNT(*) FOR job_id IN ('SA_REP', 'IT_PROG'));`,
    options: [
      '문제 없다',
      'employees의 모든 열(employee_id 포함)이 GROUP BY 기준이 되어 각 직원별 행이 생성됨',
      'COUNT(*) 대신 SUM을 써야 한다',
      'IN 절에 별칭이 없어서 오류 발생',
    ],
    correctAnswer: 1,
    explanation: 'employees 테이블을 직접 PIVOT하면 employee_id, last_name 등 모든 열이 GROUP BY 기준이 됩니다. 서브쿼리로 필요한 열(department_id, job_id)만 선택하면 부서별 직무 수 피벗이 됩니다.',
  },
  {
    id: 1423, level: 'intermediate',
    question: 'PIVOT에서 여러 집계 함수를 동시에 사용할 때의 열 이름 형식은?',
    options: [
      '집계함수_IN값 형식',
      'IN값_집계함수별칭 형식 (예: SA_REP_COUNT, SA_REP_AVG)',
      'IN값만으로 열 이름 결정',
      '여러 집계 함수는 사용 불가',
    ],
    correctAnswer: 1,
    explanation: '여러 집계 함수 사용 시 열 이름: IN절값_집계별칭. 예: PIVOT(COUNT(*) AS CNT, AVG(salary) AS AVG_SAL FOR job_id IN (\'SA_REP\')) → 열 이름: SA_REP_CNT, SA_REP_AVG_SAL.',
  },
  {
    id: 1424, level: 'intermediate',
    question: `다음 UNPIVOT 쿼리에서 quarter 열과 sales 열에 들어갈 내용은?
SELECT product_id, quarter, sales
FROM sales_data
UNPIVOT(sales FOR quarter IN (q1 AS 'Q1', q2 AS 'Q2', q3 AS 'Q3'));`,
    options: [
      'quarter: 숫자(1~3), sales: 분기 이름',
      'quarter: \'Q1\'~\'Q3\' 문자열, sales: q1~q3 열의 실제 매출 값',
      'quarter: 열 이름(q1, q2, q3), sales: 합계',
      '오류 발생',
    ],
    correctAnswer: 1,
    explanation: 'UNPIVOT(값열 FOR 레이블열 IN (열1 AS 별칭, ...)): quarter(레이블열)에는 Q1/Q2/Q3 별칭, sales(값열)에는 해당 분기의 실제 매출 값이 들어갑니다.',
  },
  {
    id: 1425, level: 'intermediate',
    question: 'PIVOT에서 집계 함수 없이 단일 값을 열로 변환하려면?',
    options: [
      'MAX() 또는 MIN()을 집계 함수로 사용하면 그룹에 단일 값만 있을 때 해당 값이 반환된다',
      'PIVOT은 반드시 COUNT만 사용해야 한다',
      'VALUE() 함수를 사용한다',
      'GROUP BY를 제거하면 된다',
    ],
    correctAnswer: 0,
    explanation: '각 그룹에 단일 값만 있을 때 MAX() 또는 MIN()을 사용하면 실질적으로 해당 값이 그대로 반환됩니다. PIVOT에 집계 함수 없이 직접 값을 사용하는 구문은 없습니다.',
  },
  {
    id: 1426, level: 'intermediate',
    question: `다음 쿼리의 결과 행 수는? (employees: 107행, 부서 수 11개, 직무 수 19개)
SELECT * FROM (SELECT department_id, job_id, salary FROM employees WHERE department_id IS NOT NULL)
PIVOT(AVG(salary) FOR job_id IN ('SA_REP', 'IT_PROG', 'FI_ACCOUNT'));`,
    options: [
      '107행',
      '11행 (부서 수)',
      '3행 (직무 수)',
      '33행 (부서×직무)',
    ],
    correctAnswer: 1,
    explanation: '서브쿼리에 department_id가 있고, job_id는 PIVOT으로 열이 됩니다. 따라서 결과 행 = 부서 수(11개). 각 행에 3개의 직무 평균 급여 열이 추가됩니다.',
  },
  {
    id: 1427, level: 'intermediate',
    question: `다음 두 쿼리 결과의 차이는?
A: UNPIVOT EXCLUDE NULLS
B: UNPIVOT INCLUDE NULLS`,
    options: [
      '결과가 동일하다',
      'A는 변환 열 값이 NULL인 행을 제외, B는 NULL 행도 포함',
      'A가 더 많은 행을 반환한다',
      'B는 오류가 발생한다',
    ],
    correctAnswer: 1,
    explanation: 'EXCLUDE NULLS(기본): 변환되는 열의 값이 NULL이면 해당 행을 결과에서 제외. INCLUDE NULLS: NULL 값이어도 행 포함. 매출이 없는 분기를 포함하려면 INCLUDE NULLS 사용.',
  },
  {
    id: 1428, level: 'intermediate',
    question: 'PIVOT과 CASE WHEN + GROUP BY 비교에서 PIVOT이 유리한 경우는?',
    options: [
      '동적 열 생성이 필요할 때',
      '피벗 열 값이 고정되어 있고, 코드를 간결하게 작성하고 싶을 때',
      '서브쿼리가 복잡할 때',
      'NULL 처리가 필요할 때',
    ],
    correctAnswer: 1,
    explanation: 'PIVOT은 IN 절에 고정된 값 목록이 필요합니다. 값이 고정이고 코드 간결성이 중요할 때 유리합니다. 동적 열(런타임에 결정)이 필요하면 PIVOT이 아닌 동적 SQL이 필요합니다.',
  },
  {
    id: 1429, level: 'intermediate',
    question: `다음 UNPIVOT 쿼리가 반환하는 행 수는? (입력 테이블: 5행, UNPIVOT 대상 열: 4개, 모든 값이 NOT NULL)
SELECT prod_id, quarter, amount FROM sales
UNPIVOT(amount FOR quarter IN (q1, q2, q3, q4));`,
    options: ['5행', '4행', '20행', '9행'],
    correctAnswer: 2,
    explanation: 'UNPIVOT은 각 원본 행 × 변환 열 수 = 5 × 4 = 20행을 생성합니다. INCLUDE/EXCLUDE NULLS에 따라 실제 행 수가 달라질 수 있습니다.',
  },
  {
    id: 1430, level: 'intermediate',
    question: 'PIVOT 결과에서 NULL을 0으로 표시하는 올바른 방법은?',
    options: [
      'PIVOT의 IN 절에 DEFAULT 0 추가',
      'SELECT에서 NVL(피벗열, 0) AS 열이름 사용',
      'WHERE 절에 IS NOT NULL 추가',
      'PIVOT에 NULLS AS 0 옵션 추가',
    ],
    correctAnswer: 1,
    explanation: 'PIVOT에는 NULL 기본값을 지정하는 직접적인 옵션이 없습니다. PIVOT을 서브쿼리로 감싸고 외부 SELECT에서 NVL(열명, 0) 또는 COALESCE(열명, 0)로 NULL을 0으로 변환합니다.',
  },
  {
    id: 1431, level: 'intermediate',
    question: `다음 PIVOT에서 여러 집계 함수를 사용한 예시의 열 이름 생성 규칙은?
PIVOT(COUNT(*) AS CNT, MAX(salary) AS MAX_SAL
      FOR department_id IN (10 AS D10, 20 AS D20))`,
    options: [
      'D10, D20 (IN 별칭만)',
      'CNT, MAX_SAL (집계 별칭만)',
      'D10_CNT, D10_MAX_SAL, D20_CNT, D20_MAX_SAL (IN별칭_집계별칭)',
      'COUNT_D10, MAX_SAL_D20',
    ],
    correctAnswer: 2,
    explanation: '여러 집계 함수와 IN 절을 조합하면: IN별칭_집계별칭 형식으로 열 이름이 생성됩니다. D10_CNT(부서10 직원수), D10_MAX_SAL(부서10 최고급여), D20_CNT, D20_MAX_SAL 네 개의 열이 생성됩니다.',
  },
  {
    id: 1432, level: 'intermediate',
    question: 'UNPIVOT에서 복수의 열 쌍을 동시에 변환하는 방법은?',
    options: [
      '불가능, 한 번에 하나의 열만 변환 가능',
      'UNPIVOT(( 값열1, 값열2) FOR 레이블열 IN ((열1a, 열1b) AS \'L1\', (열2a, 열2b) AS \'L2\'))',
      'UNPIVOT을 여러 번 중첩한다',
      'PIVOT으로만 가능하다',
    ],
    correctAnswer: 1,
    explanation: 'Oracle UNPIVOT에서 다중 열 쌍 변환이 가능합니다. 예: UNPIVOT((unit, price) FOR quarter IN ((q1_unit, q1_price) AS \'Q1\', (q2_unit, q2_price) AS \'Q2\')) — 두 쌍의 열을 동시에 행으로 변환.',
  },
  {
    id: 1433, level: 'intermediate',
    question: '동적 PIVOT(런타임에 열 이름이 결정)을 구현하려면?',
    options: [
      'PIVOT의 IN 절에 서브쿼리를 사용한다 (예: IN (SELECT DISTINCT job_id FROM employees))',
      '동적 SQL을 사용하여 IN 절의 값 목록을 런타임에 구성한다 (EXECUTE IMMEDIATE)',
      'PIVOT이 자동으로 모든 고유 값을 열로 변환한다',
      'ANY 키워드를 IN 절에 사용한다',
    ],
    correctAnswer: 1,
    explanation: 'PIVOT의 IN 절에는 리터럴 값 목록만 가능하며 서브쿼리는 사용할 수 없습니다. 동적 열이 필요하면 PL/SQL의 EXECUTE IMMEDIATE로 런타임에 SQL 문자열을 조립하여 실행합니다.',
  },
  {
    id: 1434, level: 'intermediate',
    question: `다음 PIVOT을 CASE WHEN으로 변환한 동등한 쿼리는?
SELECT * FROM (SELECT department_id, job_id FROM employees)
PIVOT(COUNT(*) FOR job_id IN ('SA_REP' AS SALES, 'IT_PROG' AS IT));`,
    options: [
      'SELECT department_id, COUNT(*) SALES, COUNT(*) IT FROM employees GROUP BY department_id',
      'SELECT department_id, COUNT(CASE WHEN job_id=\'SA_REP\' THEN 1 END) SALES, COUNT(CASE WHEN job_id=\'IT_PROG\' THEN 1 END) IT FROM employees GROUP BY department_id',
      'SELECT department_id, SUM(job_id=\'SA_REP\') SALES FROM employees',
      'SELECT * FROM employees WHERE job_id IN (\'SA_REP\', \'IT_PROG\')',
    ],
    correctAnswer: 1,
    explanation: 'PIVOT의 CASE WHEN 등가: COUNT(CASE WHEN job_id=\'SA_REP\' THEN 1 END) = SA_REP 직무 직원 수. 각 IN 값에 대해 CASE WHEN을 작성하고 GROUP BY로 집계합니다.',
  },
  {
    id: 1435, level: 'intermediate',
    question: 'PIVOT과 UNPIVOT을 같은 쿼리에서 연결 사용하는 목적은?',
    options: [
      '불가능한 조합이다',
      '피벗된 결과를 다시 행으로 변환하여 원본 형태로 복원하거나 다른 형태로 변환하기 위해',
      '성능 향상을 위해',
      'NULL 제거를 위해',
    ],
    correctAnswer: 1,
    explanation: 'PIVOT으로 행→열 변환 후 UNPIVOT으로 다시 열→행 변환을 연속 적용할 수 있습니다. 데이터 형태를 재구성하거나, PIVOT 결과의 특정 열만 UNPIVOT하여 필요한 분석 형태로 변환할 때 사용합니다.',
  },
  {
    id: 1436, level: 'intermediate',
    question: '부서별 연도별 입사 인원 피벗 쿼리에서 EXTRACT(YEAR FROM hire_date)를 사용한다면 IN 절에 들어가야 하는 내용은?',
    options: [
      'IN (YEAR FROM hire_date)',
      'IN (2000, 2001, 2002, ...) 와 같이 연도 값 목록을 직접 나열해야 한다',
      'IN (SELECT DISTINCT EXTRACT(YEAR FROM hire_date) FROM employees)',
      'IN (AUTO)',
    ],
    correctAnswer: 1,
    explanation: 'PIVOT의 IN 절에는 리터럴 값 목록을 직접 나열해야 합니다. 서브쿼리나 동적 표현식은 사용할 수 없으므로 연도 값을 2000, 2001, ... 형식으로 직접 나열해야 합니다.',
  },
  {
    id: 1437, level: 'intermediate',
    question: 'UNPIVOT 결과의 행 수를 예측하는 공식은?',
    options: [
      '원본 행 수 + UNPIVOT 열 수',
      '원본 행 수 × UNPIVOT 열 수 (EXCLUDE NULLS 제외 후)',
      '원본 열 수 × UNPIVOT 열 수',
      '항상 원본과 동일하다',
    ],
    correctAnswer: 1,
    explanation: '최대 행 수 = 원본 행 수 × UNPIVOT 대상 열 수. 단, EXCLUDE NULLS(기본)이면 값이 NULL인 열에 해당하는 행은 제외됩니다. INCLUDE NULLS이면 정확히 원본행수 × 열수.',
  },
  {
    id: 1438, level: 'intermediate',
    question: `다음 PIVOT에서 집계 별칭 없이 두 집계 함수를 사용하면?
PIVOT(COUNT(*), MAX(salary) FOR job_id IN ('SA_REP'))`,
    options: [
      '정상 실행, 열 이름: SA_REP_1, SA_REP_2',
      '오류 발생 — 두 집계 함수 사용 시 각 함수에 별칭이 필요하다',
      '마지막 집계 함수만 적용된다',
      'COUNT 결과만 반환된다',
    ],
    correctAnswer: 1,
    explanation: '여러 집계 함수를 PIVOT에 사용할 때는 각 집계 함수에 별칭이 필요합니다. 별칭이 없으면 Oracle은 열 이름을 자동 생성하는데, 이 경우 혼란이 생길 수 있어 명시적 별칭이 권장됩니다.',
  },
  {
    id: 1439, level: 'intermediate',
    question: 'PIVOT/UNPIVOT은 Oracle 몇 버전부터 지원되는가?',
    options: ['Oracle 9i', 'Oracle 10g', 'Oracle 11g', 'Oracle 12c'],
    correctAnswer: 2,
    explanation: 'PIVOT과 UNPIVOT 연산자는 Oracle 11g(11.1)부터 도입되었습니다. 이전 버전에서는 CASE WHEN + GROUP BY 패턴으로 동일한 결과를 구현해야 했습니다.',
  },
  {
    id: 1440, level: 'intermediate',
    question: '분기별 매출 테이블(q1, q2, q3, q4 열)에서 특정 분기만 UNPIVOT하려면?',
    options: [
      'WHERE 절로 불필요한 분기를 필터링',
      'IN 절에 필요한 분기의 열만 나열하면 해당 열만 UNPIVOT됨',
      'UNPIVOT 후 WHERE로 필터링',
      '불가능, 모든 열을 반드시 UNPIVOT해야 함',
    ],
    correctAnswer: 1,
    explanation: 'UNPIVOT의 IN 절에 필요한 열만 나열하면 해당 열만 행으로 변환됩니다. IN (q1, q2)라고 하면 q3, q4는 원래 열 형태로 유지됩니다.',
  },

  // ── 상(심화) 41~50 ─────────────────────────────────────────
  {
    id: 1441, level: 'advanced',
    question: `다음 PIVOT 결과의 열 이름은?
PIVOT(COUNT(*) AS C, SUM(salary) AS S
      FOR department_id IN (10 AS A, 20 AS B))`,
    options: [
      'C, S, A, B',
      'A_C, A_S, B_C, B_S',
      'COUNT_A, SUM_A, COUNT_B, SUM_B',
      'A_COUNT, B_COUNT, A_SUM, B_SUM',
    ],
    correctAnswer: 1,
    explanation: '다중 집계 함수 + IN 별칭 → 열 이름: IN별칭_집계별칭. A(부서10)_C(COUNT), A(부서10)_S(SUM), B(부서20)_C, B(부서20)_S 총 4열이 생성됩니다.',
  },
  {
    id: 1442, level: 'advanced',
    question: `다음 쿼리에서 최종 결과의 행 수는? (부서 10명: q1=NULL 2개, q2=NULL 3개, 나머지 NOT NULL)
SELECT * FROM dept_sales UNPIVOT(sales FOR quarter IN (q1, q2, q3, q4));`,
    options: [
      '40행 (10명 × 4분기)',
      '35행 (10명 × 4 - NULL 5개)',
      '30행',
      '직접 계산 불가',
    ],
    correctAnswer: 1,
    explanation: 'UNPIVOT 기본(EXCLUDE NULLS): q1의 NULL 2개, q2의 NULL 3개 제외. 10 × 4 = 40 - 5(NULL) = 35행. NULL이 있는 분기 행만 제외됩니다.',
  },
  {
    id: 1443, level: 'advanced',
    question: `PIVOT 후 UNPIVOT을 적용하면 원본과 동일한 결과를 얻을 수 있는가?`,
    options: [
      '항상 원본과 동일하다',
      'PIVOT에서 IN 절에 모든 값이 포함되고 NULL 없으면 동일. IN 절 미포함 값이나 NULL이 있으면 손실 발생',
      'UNPIVOT이 PIVOT을 완전히 역변환하므로 항상 복원 가능',
      '데이터 타입만 동일하면 항상 복원 가능',
    ],
    correctAnswer: 1,
    explanation: 'PIVOT의 IN 절에 없는 값은 제거되고, NULL 교차점은 UNPIVOT EXCLUDE NULLS 시 손실됩니다. 모든 값이 IN 절에 포함되고 NULL 없는 완전한 데이터만 PIVOT→UNPIVOT으로 완전 복원 가능.',
  },
  {
    id: 1444, level: 'advanced',
    question: `다음 동적 PIVOT 요구사항에 가장 적합한 구현 방법은?
"매월 새 직무가 추가될 수 있으며, 항상 현재 존재하는 모든 직무를 열로 표시해야 한다"`,
    options: [
      'PIVOT의 IN 절에 서브쿼리 사용',
      'PL/SQL에서 USER_JOBS 등에서 직무 목록을 동적 조회하여 PIVOT SQL 문자열을 조립하고 EXECUTE IMMEDIATE로 실행',
      'PIVOT에 ANY 키워드 사용',
      'XML PIVOT 기능 활용',
    ],
    correctAnswer: 1,
    explanation: 'Oracle PIVOT의 IN 절은 정적 리터럴 목록만 허용합니다. 동적 피벗은 PL/SQL에서 직무 목록을 쿼리 → LISTAGG로 IN 절 문자열 조립 → EXECUTE IMMEDIATE로 실행하는 방식으로 구현합니다.',
  },
  {
    id: 1445, level: 'advanced',
    question: `부서별, 직무별 인원 수와 평균 급여를 한 번의 PIVOT으로 조회하는 방법은?`,
    options: [
      '불가능, 두 집계를 동시에 PIVOT할 수 없다',
      'PIVOT(COUNT(*) AS CNT, AVG(salary) AS AVG_SAL FOR job_id IN (값 목록))으로 두 집계를 동시에 사용 가능',
      '두 개의 PIVOT을 JOIN으로 결합한다',
      'UNION ALL로 두 쿼리를 결합한다',
    ],
    correctAnswer: 1,
    explanation: 'PIVOT에서 여러 집계 함수를 사용할 수 있습니다. 결과 열은 IN절값_집계별칭 형식. 예: PIVOT(COUNT(*) AS CNT, AVG(salary) AS AVG FOR job_id IN (\'SA_REP\' AS S)) → S_CNT, S_AVG 두 열 생성.',
  },
  {
    id: 1446, level: 'advanced',
    question: `다음 시나리오에서 PIVOT과 CASE WHEN 중 어느 것이 더 적합한가?
"직무 목록이 쿼리 실행 시점마다 달라질 수 있다"`,
    options: [
      'PIVOT: 더 간결하고 빠르다',
      'CASE WHEN: 동일하게 동적 열을 지원한다',
      'CASE WHEN도 동적 열 생성이 불가능하므로 둘 다 부적합. 동적 SQL이 필요하다',
      'PIVOT의 IN ANY 옵션을 사용한다',
    ],
    correctAnswer: 2,
    explanation: 'PIVOT과 CASE WHEN 모두 컴파일 시점에 열 목록이 고정되어야 합니다. 동적 열 생성은 둘 다 직접 지원하지 않으며, PL/SQL 동적 SQL(EXECUTE IMMEDIATE)이 필요합니다.',
  },
  {
    id: 1447, level: 'advanced',
    question: `UNPIVOT 결과를 다시 원본과 동일한 형태로 PIVOT하는 왕복 변환 시 주의사항은?`,
    options: [
      '주의사항 없음, 완전 가역 변환이다',
      'UNPIVOT EXCLUDE NULLS(기본)로 인해 원본에 NULL이 있었다면 PIVOT 후 해당 값이 원본과 다를 수 있다',
      '데이터 타입이 변환 중 바뀔 수 있다',
      'PIVOT은 정수만 처리 가능하다',
    ],
    correctAnswer: 1,
    explanation: '원본에 NULL이 있으면 UNPIVOT EXCLUDE NULLS(기본)로 해당 행이 제거됩니다. 이후 다시 PIVOT하면 해당 교차점이 NULL이 아닌 아예 데이터 없음(집계 없음)으로 처리될 수 있어 원본 NULL과 구분이 어렵습니다.',
  },
  {
    id: 1448, level: 'advanced',
    question: '대용량 테이블에서 PIVOT 성능 최적화 방법은?',
    options: [
      'PIVOT은 자동으로 최적화되므로 추가 작업 불필요',
      '서브쿼리에서 필요한 열과 행만 미리 필터링, GROUP BY 열에 인덱스 활용, 파티션 테이블 활용',
      'PIVOT 대신 항상 CASE WHEN을 사용한다',
      'IN 절 값의 수를 늘린다',
    ],
    correctAnswer: 1,
    explanation: 'PIVOT 성능 최적화: ①서브쿼리에서 WHERE로 행 미리 필터링 ②필요한 열만 선택 ③GROUP BY 기준 열에 인덱스 ④파티션 테이블에서 파티션 프루닝 활용. IN 절 값이 많을수록 처리할 열이 늘어납니다.',
  },
  {
    id: 1449, level: 'advanced',
    question: `PIVOT 결과를 ORDER BY로 정렬할 때 열 이름 지정 방법은?`,
    options: [
      'PIVOT 절 내에 ORDER BY를 직접 포함할 수 있다',
      'PIVOT 결과를 서브쿼리로 감싸고 외부 SELECT에서 ORDER BY 적용. 열 이름은 큰따옴표로 감싸거나 별칭 사용',
      'ORDER BY는 PIVOT과 사용 불가능하다',
      'ORDER BY PIVOT_COLUMN으로 정렬한다',
    ],
    correctAnswer: 1,
    explanation: 'PIVOT 결과를 서브쿼리로 감싸고 외부 쿼리에서 ORDER BY를 사용합니다. IN 절에 AS 별칭을 지정했으면 그 별칭이 열 이름이 됩니다. 특수문자가 있는 열 이름은 큰따옴표로 감쌉니다.',
  },
  {
    id: 1450, level: 'advanced',
    question: `다음 시나리오에 PIVOT이 적합한지 판단하시오.
"학생 성적 테이블에서 과목이 100개이며 과목 수는 고정되어 있다. 각 학생별로 100개 과목 성적을 열로 표시한다."`,
    options: [
      '완벽히 적합하다. PIVOT으로 간단히 구현 가능.',
      'IN 절에 100개 과목을 나열하면 기능상 가능하지만 100개 열을 가진 피벗 결과는 가독성이 낮고, 이런 경우 행 기반(UNPIVOT 형태) 조회가 더 적합할 수 있다',
      '불가능하다. IN 절에는 최대 10개만 나열 가능하다',
      'PIVOT은 숫자 값만 처리하므로 문자열 과목명은 불가능하다',
    ],
    correctAnswer: 1,
    explanation: 'PIVOT은 IN 절 개수에 기술적 제한은 없지만, 100개 열의 피벗 결과는 실용적으로 보기 어렵습니다. 과목 수가 많으면 행 기반 조회나 애플리케이션 레이어에서 피벗을 처리하는 것이 더 실용적입니다.',
  },
]
