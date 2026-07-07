import type { QuizQuestion } from '@/lib/types'

export const ch15Quiz: QuizQuestion[] = [
  // ── 하(기초) 1~20 ──────────────────────────────────────────
  {
    id: 1501, level: 'basic',
    question: 'MODEL 절의 주된 목적은?',
    options: [
      '테이블을 생성하고 열을 정의한다',
      '스프레드시트처럼 배열 참조 방식으로 행 간 계산을 수행한다',
      '두 테이블을 조인한다',
      'NULL 값을 처리한다',
    ],
    correctAnswer: 1,
    explanation: 'MODEL 절은 SQL에서 스프레드시트(엑셀)와 유사하게 배열 참조로 행 간 계산을 수행합니다. DIMENSION BY로 셀을 식별하고, MEASURES 열의 값을 규칙(RULES)으로 계산하거나 새 행을 삽입합니다.',
  },
  {
    id: 1502, level: 'basic',
    question: 'MODEL 절의 세 가지 핵심 절(clause)은?',
    options: [
      'SELECT, FROM, WHERE',
      'PARTITION BY, DIMENSION BY, MEASURES',
      'GROUP BY, HAVING, ORDER BY',
      'JOIN, ON, USING',
    ],
    correctAnswer: 1,
    explanation: 'MODEL의 세 핵심 절: PARTITION BY(독립 처리 파티션), DIMENSION BY(셀을 고유 식별하는 차원 열), MEASURES(계산 대상 열). 규칙(RULES)에서 이 세 절을 활용해 값을 계산합니다.',
  },
  {
    id: 1503, level: 'basic',
    question: 'DIMENSION BY 절의 역할은?',
    options: [
      '결과를 정렬한다',
      '각 행을 고유하게 식별하는 키(차원) 열을 지정한다',
      '집계 함수를 적용한다',
      'NULL 값을 처리한다',
    ],
    correctAnswer: 1,
    explanation: 'DIMENSION BY는 배열에서 특정 셀(행)을 고유하게 식별하는 차원 열을 지정합니다. 스프레드시트의 행/열 인덱스와 유사합니다. 예: DIMENSION BY (year, product)로 연도+제품으로 셀 식별.',
  },
  {
    id: 1504, level: 'basic',
    question: 'MEASURES 절의 역할은?',
    options: [
      'DIMENSION을 정렬한다',
      '계산 또는 참조할 값 열을 지정한다 (스프레드시트 셀 값)',
      'GROUP BY 기준을 설정한다',
      '파티션 범위를 지정한다',
    ],
    correctAnswer: 1,
    explanation: 'MEASURES는 계산하거나 참조할 값 열(측정값)을 지정합니다. 스프레드시트에서 셀에 들어가는 값에 해당합니다. 예: MEASURES (sales)로 sales 열을 규칙에서 읽거나 쓸 수 있습니다.',
  },
  {
    id: 1505, level: 'basic',
    question: 'MODEL 절에서 RULES의 역할은?',
    options: [
      '결과의 행 수를 제한한다',
      '각 셀(행)의 값을 계산하거나 새 행을 삽입하는 표현식을 정의한다',
      '파티션을 정의한다',
      '차원 열을 지정한다',
    ],
    correctAnswer: 1,
    explanation: 'RULES는 MODEL에서 셀 값을 계산하는 규칙입니다. 배열 표기로 특정 셀을 참조합니다. 예: sales[2026] = sales[2025] * 1.1 → 2026년 sales를 2025년의 110%로 계산.',
  },
  {
    id: 1506, level: 'basic',
    question: 'CV() 함수의 역할은?',
    options: [
      '누적 값(Cumulative Value)을 계산한다',
      '현재 처리 중인 셀의 차원 값(Current Value)을 반환한다',
      '열의 최솟값을 반환한다',
      'NULL 값을 대체한다',
    ],
    correctAnswer: 1,
    explanation: 'CV(dimension_col)는 현재 처리 중인 셀의 해당 차원 열 값을 반환합니다. FOR 루프나 패턴 매칭 규칙에서 "현재 차원 값"을 참조할 때 사용합니다.',
  },
  {
    id: 1507, level: 'basic',
    question: 'MODEL 절은 쿼리의 어느 위치에 작성하는가?',
    options: [
      'FROM 절 앞',
      'WHERE 절 뒤, GROUP BY 앞',
      'GROUP BY/HAVING 뒤, ORDER BY 앞',
      'SELECT 절 내부',
    ],
    correctAnswer: 2,
    explanation: 'MODEL 절은 WHERE → GROUP BY → HAVING 이후, ORDER BY 이전에 위치합니다. 구문 순서: SELECT ... FROM ... [WHERE] [GROUP BY] [HAVING] MODEL [...] [ORDER BY].',
  },
  {
    id: 1508, level: 'basic',
    question: 'MODEL RULES에서 왼쪽(LHS)과 오른쪽(RHS)의 역할은?',
    options: [
      'LHS: 조건, RHS: 결과',
      'LHS: 대입할 셀(목표), RHS: 계산 표현식(원본)',
      'LHS: 파티션, RHS: 차원',
      'LHS: 집계, RHS: 필터',
    ],
    correctAnswer: 1,
    explanation: 'RULES에서 좌변(LHS)은 값을 대입할 셀을 배열 표기로 지정하고, 우변(RHS)은 계산 표현식입니다. 예: sales[2026] = sales[2025] * 1.1에서 sales[2026]이 LHS, sales[2025] * 1.1이 RHS.',
  },
  {
    id: 1509, level: 'basic',
    question: 'MODEL RULES에서 존재하지 않는 셀을 참조하면?',
    options: [
      '오류가 발생한다',
      '기본적으로 NULL을 반환한다 (NaN 또는 NULL)',
      '0을 반환한다',
      '해당 행이 자동 생성된다',
    ],
    correctAnswer: 1,
    explanation: 'MODEL에서 존재하지 않는 차원 값을 참조하면 기본적으로 NULL을 반환합니다. RULES UPSERT 옵션을 사용하면 해당 셀을 자동 생성할 수 있습니다.',
  },
  {
    id: 1510, level: 'basic',
    question: 'PARTITION BY 절이 없는 MODEL은 어떻게 동작하는가?',
    options: [
      '오류가 발생한다',
      '전체 결과 집합을 하나의 파티션으로 처리한다',
      'ORDER BY 기준으로 자동 파티션된다',
      'DIMENSION BY만으로 파티션이 결정된다',
    ],
    correctAnswer: 1,
    explanation: 'PARTITION BY를 생략하면 전체 결과 집합이 하나의 파티션으로 처리됩니다. PARTITION BY를 사용하면 각 파티션 내에서 독립적으로 MODEL 계산이 수행됩니다.',
  },
  {
    id: 1511, level: 'basic',
    question: 'MODEL RULES AUTOMATIC ORDER와 SEQUENTIAL ORDER의 차이는?',
    options: [
      '두 옵션은 동일하다',
      'SEQUENTIAL ORDER: 규칙을 나열 순서대로 실행. AUTOMATIC ORDER: 의존성 분석 후 최적 순서 실행',
      'AUTOMATIC ORDER가 항상 빠르다',
      'SEQUENTIAL ORDER만 새 행 삽입이 가능하다',
    ],
    correctAnswer: 1,
    explanation: 'SEQUENTIAL ORDER(기본): 규칙을 작성 순서대로 실행. AUTOMATIC ORDER: Oracle이 규칙 간 의존성을 분석하여 올바른 순서로 자동 실행. 규칙 순서에 의존성이 있을 때 AUTOMATIC ORDER가 유용.',
  },
  {
    id: 1512, level: 'basic',
    question: 'RULES UPSERT와 RULES UPDATE의 차이는?',
    options: [
      '두 옵션은 동일하다',
      'UPSERT: 존재하면 갱신, 없으면 새 행 삽입. UPDATE: 존재하는 행만 갱신(없으면 무시)',
      'UPDATE가 더 빠르다',
      'UPSERT는 PARTITION BY와만 사용 가능하다',
    ],
    correctAnswer: 1,
    explanation: 'RULES UPSERT ALL(기본): 셀이 없으면 새로 삽입, 있으면 갱신. RULES UPDATE: 기존에 존재하는 셀만 갱신. 새 행(예: 미래 연도)을 추가할 때는 UPSERT를 사용합니다.',
  },
  {
    id: 1513, level: 'basic',
    question: 'MODEL 절로 새 행(기존에 없는 차원 값)을 추가하려면?',
    options: [
      'INSERT INTO를 사용해야 한다',
      'RULES에서 존재하지 않는 차원 값을 LHS에 지정하면 UPSERT 옵션에 의해 자동 삽입된다',
      'DIMENSION BY에 새 값을 추가한다',
      'MODEL은 기존 행만 수정 가능하다',
    ],
    correctAnswer: 1,
    explanation: 'RULES에서 LHS에 새 차원 값(예: year=2027)을 지정하면 UPSERT 동작으로 해당 행이 결과에 새로 추가됩니다. 이를 통해 미래 예측값 행을 SELECT 결과에 추가할 수 있습니다.',
  },
  {
    id: 1514, level: 'basic',
    question: 'MODEL 절에서 ITERATE와 UNTIL의 역할은?',
    options: [
      'ITERATE: 결과 반복 출력, UNTIL: 반복 횟수 제한',
      'ITERATE(n): 규칙을 n번 반복. UNTIL(조건): 조건 만족 시 반복 중단',
      'ITERATE: 파티션 반복, UNTIL: 파티션 종료',
      'ITERATE와 UNTIL은 DIMENSION BY 대신 사용한다',
    ],
    correctAnswer: 1,
    explanation: 'ITERATE(n)은 RULES 블록을 최대 n번 반복 실행합니다. UNTIL(조건)을 추가하면 조건이 참이 될 때 조기 종료됩니다. 수렴 계산이나 반복 시뮬레이션에 사용합니다.',
  },
  {
    id: 1515, level: 'basic',
    question: 'MODEL RULES에서 FOR 루프의 역할은?',
    options: [
      '결과를 반복 출력한다',
      '차원 범위나 목록에 대해 규칙을 반복 적용한다',
      '조인을 반복 수행한다',
      'ITERATE와 동일하다',
    ],
    correctAnswer: 1,
    explanation: 'RULES의 FOR 루프: FOR dim_col IN (값1, 값2, ...) 또는 FOR dim_col FROM 시작 TO 끝 [INCREMENT n] 형식으로 차원 범위에 대해 규칙을 반복 적용합니다.',
  },
  {
    id: 1516, level: 'basic',
    question: 'ITERATION_NUMBER는 무엇을 반환하는가?',
    options: [
      '현재 파티션 번호',
      '현재 ITERATE 반복 횟수 (0부터 시작)',
      '처리된 행 수',
      '현재 DIMENSION 값',
    ],
    correctAnswer: 1,
    explanation: 'ITERATION_NUMBER는 ITERATE 반복 중 현재 반복 횟수를 반환합니다. 0부터 시작하여 n-1까지 증가합니다. 규칙 내에서 반복 횟수에 따른 계산에 활용합니다.',
  },
  {
    id: 1517, level: 'basic',
    question: 'MODEL 절에서 RETURN UPDATED ROWS 옵션의 역할은?',
    options: [
      '갱신된 행을 테이블에 저장한다',
      '규칙에 의해 값이 변경(갱신/삽입)된 행만 결과에 반환한다',
      '원본 행만 반환하고 새 행은 제외한다',
      'DIMENSION BY 행만 반환한다',
    ],
    correctAnswer: 1,
    explanation: 'RETURN UPDATED ROWS: MODEL 규칙에 의해 갱신되거나 삽입된 행만 SELECT 결과에 포함합니다. 기본값은 RETURN ALL ROWS로 원본 행과 새 행을 모두 반환합니다.',
  },
  {
    id: 1518, level: 'basic',
    question: 'MODEL 절의 DIMENSION BY 열은 반드시 어떤 조건을 만족해야 하는가?',
    options: [
      'NULL이 아니어야 한다',
      '파티션 내에서 각 행을 고유하게 식별할 수 있어야 한다 (유일 값)',
      '정수형이어야 한다',
      'SELECT 절에 포함되어야 한다',
    ],
    correctAnswer: 1,
    explanation: 'DIMENSION BY 열(들)의 값은 파티션 내에서 각 행을 고유하게 식별해야 합니다. 중복 차원 값이 있으면 ORA-32638 오류가 발생합니다.',
  },
  {
    id: 1519, level: 'basic',
    question: 'MODEL 절에서 IS PRESENT 조건의 역할은?',
    options: [
      '열 값이 NULL인지 확인한다',
      '셀(차원 값)이 결과 집합에 존재하는지 확인한다',
      '테이블에 행이 있는지 확인한다',
      'PARTITION이 존재하는지 확인한다',
    ],
    correctAnswer: 1,
    explanation: 'dimension_col[value] IS PRESENT는 해당 차원 값의 셀이 현재 결과 집합에 존재하면 TRUE를 반환합니다. CASE WHEN과 함께 조건부 계산에 사용됩니다.',
  },
  {
    id: 1520, level: 'basic',
    question: 'MODEL 절에서 기본 RULES 옵션(명시하지 않을 때)은?',
    options: [
      'RULES UPDATE SEQUENTIAL ORDER',
      'RULES UPSERT ALL SEQUENTIAL ORDER',
      'RULES INSERT AUTOMATIC ORDER',
      'RULES OVERWRITE SEQUENTIAL ORDER',
    ],
    correctAnswer: 1,
    explanation: '명시하지 않으면 기본값은 RULES UPSERT ALL SEQUENTIAL ORDER입니다. UPSERT ALL은 LHS 셀이 없으면 삽입, 있으면 갱신. SEQUENTIAL ORDER는 작성 순서대로 규칙 실행.',
  },

  // ── 중(응용) 21~40 ─────────────────────────────────────────
  {
    id: 1521, level: 'intermediate',
    question: `다음 MODEL 규칙의 의미는?
sales[2027] = sales[2026] * 1.1`,
    options: [
      '2026년 sales를 2027년에 복사한다',
      '2027년 행(없으면 삽입)의 sales를 2026년 sales의 110%로 설정한다',
      'sales 열을 2027번째 요소로 접근한다',
      '2026년과 2027년의 sales 합계를 계산한다',
    ],
    correctAnswer: 1,
    explanation: 'sales[2027]: 차원 값 2027인 행의 sales 열. 우변 sales[2026] * 1.1은 2026년 행의 sales를 읽어 10% 증가한 값을 2027년 행에 대입. 2027년 행이 없으면 UPSERT로 새로 삽입됩니다.',
  },
  {
    id: 1522, level: 'intermediate',
    question: `다음 MODEL 규칙에서 CV()의 역할은?
sales[FOR year FROM 2025 TO 2027 INCREMENT 1] = sales[CV(year) - 1] * 1.1`,
    options: [
      'sales 열의 누적값 반환',
      'FOR 루프에서 현재 처리 중인 year 차원 값을 반환 (예: 2025, 2026, 2027 순)',
      '현재 파티션 번호 반환',
      '이전 ITERATE 값 반환',
    ],
    correctAnswer: 1,
    explanation: 'CV(year): FOR year FROM 2025 TO 2027 루프에서 현재 year 값(2025, 2026, 2027 순). CV(year) - 1은 각 연도의 전년도. 따라서 각 연도의 sales = 전년도 sales × 1.1.',
  },
  {
    id: 1523, level: 'intermediate',
    question: `다음 쿼리에서 MODEL 결과에 포함되는 year 값은?
SELECT year, sales FROM t
MODEL DIMENSION BY (year) MEASURES (sales)
RULES (sales[2026] = sales[2025] * 1.05,
       sales[2027] = sales[2026] * 1.05);`,
    options: [
      'year = 2025, 2026만 포함',
      '원본 t의 모든 year + 규칙으로 추가된 2026, 2027',
      '2026, 2027만 포함',
      '원본 t의 모든 year만 포함 (추가 행 없음)',
    ],
    correctAnswer: 1,
    explanation: 'RETURN ALL ROWS(기본): 원본 행 + 규칙으로 추가/갱신된 행 모두 포함. 원본 t에 2025년 데이터가 있으면 원본의 모든 행 + 새로 삽입된 2026, 2027 행이 결과에 포함됩니다.',
  },
  {
    id: 1524, level: 'intermediate',
    question: `PARTITION BY를 사용한 MODEL 예시의 동작은?
PARTITION BY (product_id)
DIMENSION BY (year)
MEASURES (sales)`,
    options: [
      '모든 제품의 데이터를 하나의 배열로 처리한다',
      '각 product_id별로 독립적인 배열을 구성하여 규칙을 적용한다',
      'product_id 기준 정렬만 수행한다',
      'product_id = year로 처리된다',
    ],
    correctAnswer: 1,
    explanation: 'PARTITION BY (product_id): 각 제품마다 독립적인 MODEL 배열이 만들어집니다. 규칙이 각 파티션 내에서 독립적으로 실행되므로 서로 다른 제품의 sales[year]는 별개로 처리됩니다.',
  },
  {
    id: 1525, level: 'intermediate',
    question: `다음 ITERATE 규칙의 결과로 올바른 것은?
MODEL DIMENSION BY (n) MEASURES (val)
RULES ITERATE(3) (val[1] = val[1] + 10);`,
    options: [
      'val[1]이 1번 +10된다',
      'val[1]이 3번 +10된다 (총 +30)',
      'val[1]이 3으로 설정된다',
      '오류가 발생한다',
    ],
    correctAnswer: 1,
    explanation: 'ITERATE(3): 규칙 블록을 3번 반복. val[1] = val[1] + 10이 3회 실행되므로 val[1]은 원래 값 + 30이 됩니다.',
  },
  {
    id: 1526, level: 'intermediate',
    question: `RULES ITERATE(100) UNTIL(ABS(val[1] - val[2]) < 0.001)은?`,
    options: [
      '항상 100번 반복한다',
      '최대 100번 반복하되, val[1]과 val[2]의 차이가 0.001 미만이 되면 조기 종료한다',
      'val[1] - val[2] = 0.001이 될 때까지 반복한다',
      'UNTIL 조건이 참이 되면 오류가 발생한다',
    ],
    correctAnswer: 1,
    explanation: 'ITERATE(100) UNTIL(조건): 최대 100번 반복하되, 각 반복 후 UNTIL 조건이 참이면 조기 종료. 수치 계산의 수렴 조건 등에 활용합니다.',
  },
  {
    id: 1527, level: 'intermediate',
    question: `다음 FOR 루프 규칙의 의미는?
sales[FOR year FROM 2024 TO 2027 INCREMENT 1] = sales[CV(year) - 1] * growth_rate[CV(year)]`,
    options: [
      '2024년 sales만 계산한다',
      '2024~2027 각 연도의 sales를 전년도 sales × 해당 연도 성장률로 계산한다',
      'growth_rate를 4배로 늘린다',
      '2024에서 2027까지 연도를 삭제한다',
    ],
    correctAnswer: 1,
    explanation: 'FOR year FROM 2024 TO 2027: 연도 2024, 2025, 2026, 2027을 순서대로 처리. CV(year)는 현재 연도, CV(year)-1은 전년도. 각 연도의 sales = 전년도 sales × 해당 연도의 성장률.',
  },
  {
    id: 1528, level: 'intermediate',
    question: 'RETURN UPDATED ROWS 옵션을 사용하면?',
    options: [
      '원본 행과 갱신된 행을 모두 반환한다',
      'MODEL 규칙에 의해 갱신/삽입된 행만 반환하고 원본 행은 제외한다',
      '삭제된 행을 반환한다',
      '갱신된 행을 테이블에 저장한다',
    ],
    correctAnswer: 1,
    explanation: 'RETURN UPDATED ROWS: 규칙에 의해 변경된(갱신 또는 삽입) 행만 SELECT 결과에 포함. 원본 행은 제외. 예측값이나 계산값 행만 조회할 때 유용합니다.',
  },
  {
    id: 1529, level: 'intermediate',
    question: `다음 MODEL 쿼리에서 오류가 발생하는 이유는?
SELECT year, dept, sales FROM emp_sales
MODEL DIMENSION BY (year) MEASURES (dept, sales)
RULES (sales[2025] = 50000);`,
    options: [
      '문법 오류 없음, 정상 실행',
      '같은 year 값이 여러 dept를 가질 수 있어 DIMENSION BY (year)만으로 행을 고유 식별할 수 없다',
      'dept는 MEASURES에 넣을 수 없다',
      'RULES에서 리터럴 값을 사용할 수 없다',
    ],
    correctAnswer: 1,
    explanation: 'DIMENSION BY의 열들이 파티션 내에서 각 행을 고유하게 식별해야 합니다. year 하나로는 year=2025인 여러 부서 행을 구분할 수 없어 ORA-32638(중복 차원) 오류 발생. DIMENSION BY (year, dept)로 수정 필요.',
  },
  {
    id: 1530, level: 'intermediate',
    question: `MODEL RULES에서 다음 두 규칙의 실행 순서 차이는?
SEQUENTIAL: R1: x[3] = x[2] + x[1];  R2: x[4] = x[3] + x[2]
AUTOMATIC:  같은 규칙`,
    options: [
      '차이 없다',
      'SEQUENTIAL: R1 실행 후 R2 실행(R2가 R1의 결과 사용). AUTOMATIC: 의존성 분석 후 동일하게 처리',
      'AUTOMATIC: R2 먼저 실행',
      'SEQUENTIAL에서만 R2가 R1 결과를 사용할 수 있다',
    ],
    correctAnswer: 1,
    explanation: 'SEQUENTIAL ORDER: 항상 R1 → R2 순서 실행. R2는 R1이 갱신한 x[3] 값 사용 가능. AUTOMATIC ORDER: 의존성 분석으로 x[3]이 x[4]에 필요함을 파악하여 올바른 순서 결정. 이 경우 결과는 동일.',
  },
  {
    id: 1531, level: 'intermediate',
    question: `다음 MODEL에서 3번째 실행(ITERATION_NUMBER=2) 후 val[1] 값은? (초기값 val[1]=10)
RULES ITERATE(5) (val[1] = val[1] * 2)`,
    options: ['20', '40', '80', '160'],
    correctAnswer: 1,
    explanation: 'ITERATE 0: 10×2=20, ITERATE 1: 20×2=40, ITERATE 2: 40×2=80. ITERATION_NUMBER는 0부터 시작하므로 세 번째 실행은 ITERATION_NUMBER=2. 결과: 40.',
  },
  {
    id: 1532, level: 'intermediate',
    question: `참조 모델(Reference Model)의 역할은?`,
    options: [
      '결과를 저장하는 임시 테이블',
      '읽기 전용 참조 배열 — MEASURES 값을 읽을 수만 있고 쓸 수 없음',
      'PARTITION BY를 대체하는 기능',
      'DIMENSION BY의 다른 이름',
    ],
    correctAnswer: 1,
    explanation: '참조 모델(Reference Model)은 REFERENCE 키워드로 정의하는 읽기 전용 배열입니다. 주 모델(Main Model)의 규칙에서 참조 데이터를 조회할 때 사용합니다. 참조 모델의 값은 직접 수정할 수 없습니다.',
  },
  {
    id: 1533, level: 'intermediate',
    question: `다음 중 MODEL 절이 적합한 사용 사례는?`,
    options: [
      '단순 GROUP BY 집계',
      '이전 행의 값을 참조하여 계산하는 연쇄 계산 (예: 복리 이자, 점화식)',
      '두 테이블 JOIN',
      'NULL 값 처리',
    ],
    correctAnswer: 1,
    explanation: 'MODEL은 이전 행의 값을 참조하는 연쇄 계산(복리, 점화식, 시뮬레이션)에 특히 유용합니다. 분석 함수(LAG)로도 가능하지만 여러 단계의 연쇄 계산은 MODEL이 더 직관적입니다.',
  },
  {
    id: 1534, level: 'intermediate',
    question: `RULES에서 범위 참조 집계의 올바른 구문은?
(전년도까지의 누적 sales 합산)`,
    options: [
      'sales[year < CV(year)]',
      'SUM(sales)[year <= CV(year)]',
      'SUM(sales)[year BETWEEN 시작연도 AND CV(year)]',
      '범위 참조는 MODEL에서 불가',
    ],
    correctAnswer: 2,
    explanation: 'MODEL에서 집계 범위 참조: SUM(measures_col)[dimension_col BETWEEN 시작 AND 끝] 형식. 예: SUM(sales)[year BETWEEN 2020 AND CV(year)]은 2020년부터 현재 연도까지의 sales 합계.',
  },
  {
    id: 1535, level: 'intermediate',
    question: `MODEL 절에서 IGNORE NAV 옵션의 역할은?`,
    options: [
      'NAV(Non-Available Value)인 NULL을 0 또는 기본값으로 처리한다',
      'NAV는 양수 값만 반환한다',
      'NAV 오류가 발생하면 행을 제외한다',
      'DIMENSION BY NAV를 무시한다',
    ],
    correctAnswer: 0,
    explanation: 'IGNORE NAV: 숫자 NAV(비가용 값)를 0으로, 문자 NAV를 공백으로 처리합니다. 존재하지 않는 셀을 참조할 때 NULL 대신 타입에 따른 기본값을 사용하여 계산 연속성을 유지합니다.',
  },
  {
    id: 1536, level: 'intermediate',
    question: `다음 FOR 루프에서 생성되는 차원 값은?
FOR year IN (2023, 2025, 2027)`,
    options: [
      '2023부터 2027까지 모든 연도',
      '2023, 2025, 2027 세 값만',
      '2023과 2027만',
      '2024, 2026만 (중간 값)',
    ],
    correctAnswer: 1,
    explanation: 'FOR year IN (2023, 2025, 2027): 명시된 값 목록(2023, 2025, 2027)에 대해서만 규칙 적용. FOR year FROM 2023 TO 2027 INCREMENT 2와 동일한 결과.',
  },
  {
    id: 1537, level: 'intermediate',
    question: `RULES에서 단일 셀 참조와 멀티셀 참조의 차이는?`,
    options: [
      '차이 없다',
      '단일 셀: sales[2025]처럼 특정 값 지정. 멀티셀: sales[year != 2024]처럼 여러 셀에 일괄 적용',
      '멀티셀은 INSERT에서만 사용 가능하다',
      '단일 셀은 MEASURES에만 적용 가능하다',
    ],
    correctAnswer: 1,
    explanation: '단일 셀 참조: sales[2025]처럼 특정 차원 값 하나 지정. 멀티셀 참조: sales[year != 2024] 또는 패턴 매칭으로 여러 셀에 동일 규칙을 일괄 적용. 멀티셀 좌변은 각 매칭 셀마다 규칙이 실행됩니다.',
  },
  {
    id: 1538, level: 'intermediate',
    question: `MODEL 절에서 KEEP NAV 옵션이란?`,
    options: [
      'NAV를 NULL로 유지하는 기본 동작',
      'NAV를 0으로 변환한다',
      '모든 NAV를 제거한다',
      'IGNORE NAV의 반대 — NAV를 특정 값으로 치환한다',
    ],
    correctAnswer: 0,
    explanation: 'KEEP NAV(기본 동작): 존재하지 않는 셀 참조 시 NULL(숫자) 또는 NULL(문자)을 반환합니다. IGNORE NAV는 타입별 기본값(숫자=0, 문자=공백)으로 NAV를 대체합니다.',
  },
  {
    id: 1539, level: 'intermediate',
    question: `다음 쿼리에서 year 2027 행의 sales 값은? (원본: 2025=100, 2026=110)
MODEL DIMENSION BY (year) MEASURES (sales)
RULES (sales[2026] = sales[2025] * 1.1,
       sales[2027] = sales[2026] * 1.1);`,
    options: ['110', '121', '100', '220'],
    correctAnswer: 1,
    explanation: 'SEQUENTIAL ORDER: 먼저 sales[2026] = 100 × 1.1 = 110 (원본이 110이면 덮어씀). 그 다음 sales[2027] = sales[2026] × 1.1 = 110 × 1.1 = 121.',
  },
  {
    id: 1540, level: 'intermediate',
    question: `MODEL에서 멀티셀 LHS(왼쪽) 규칙의 결과는?
RULES (sales[year > 2024] = sales[CV(year) - 1] * 1.1)`,
    options: [
      '2024년 이후의 모든 연도에 대해 전년도 sales × 1.1을 계산한다',
      '2024년 이전 데이터만 갱신된다',
      '오류가 발생한다',
      'year > 2024 조건 자체가 오류',
    ],
    correctAnswer: 0,
    explanation: 'year > 2024 멀티셀 LHS: 원본 데이터에서 year가 2024보다 큰 모든 행(예: 2025, 2026, 2027...)에 대해 sales = 전년도(CV(year)-1) × 1.1 규칙이 적용됩니다.',
  },

  // ── 상(심화) 41~50 ─────────────────────────────────────────
  {
    id: 1541, level: 'advanced',
    question: `다음 MODEL로 피보나치 수열을 계산하는 규칙으로 올바른 것은?`,
    options: [
      'RULES (fib[n] = fib[n-1] + fib[n-2])',
      'RULES ITERATE(10) (fib[ITERATION_NUMBER+3] = fib[ITERATION_NUMBER+2] + fib[ITERATION_NUMBER+1])',
      'RULES (fib[FOR n FROM 3 TO 10] = fib[CV(n)-1] + fib[CV(n)-2])',
      'RULES (fib[n] = SUM(fib)[n-1])',
    ],
    correctAnswer: 2,
    explanation: '피보나치: fib[n] = fib[n-1] + fib[n-2]. FOR n FROM 3 TO 10과 CV(n)으로 각 n값의 전전 값(CV(n)-2)과 이전 값(CV(n)-1)을 합산. 초기값 fib[1]=1, fib[2]=1은 원본 데이터에 있어야 합니다.',
  },
  {
    id: 1542, level: 'advanced',
    question: `RULES UPSERT ALL vs RULES UPSERT 차이는?`,
    options: [
      '동일하다',
      'UPSERT ALL: LHS가 패턴 매칭할 때 기존 행 없으면 모두 삽입. UPSERT: LHS가 단일 셀 값이면 삽입, 패턴 매칭 LHS에서는 기존 행만 갱신',
      'UPSERT ALL은 항상 모든 행을 삽입한다',
      'UPSERT ALL은 PARTITION BY와만 사용 가능하다',
    ],
    correctAnswer: 1,
    explanation: 'UPSERT: 단일 셀 LHS는 삽입/갱신, 멀티셀(패턴) LHS는 기존 행만 갱신. UPSERT ALL: 멀티셀 LHS도 매칭되지 않으면 삽입. 미래 연도 데이터 생성 시 UPSERT ALL이 필요.',
  },
  {
    id: 1543, level: 'advanced',
    question: `복리 이자 계산을 위해 ITERATE와 ITERATION_NUMBER를 활용하는 방법은?`,
    options: [
      'ITERATE가 ITERATION_NUMBER를 자동 증가시켜 배열 인덱스로 사용한다',
      'RULES ITERATE(10) (balance[ITERATION_NUMBER+1] = balance[ITERATION_NUMBER] * (1 + rate))',
      'ITERATE(n)이 자동으로 복리 계산을 수행한다',
      'ITERATION_NUMBER는 MEASURES에서만 사용 가능하다',
    ],
    correctAnswer: 1,
    explanation: 'ITERATE(10) + ITERATION_NUMBER 활용: balance[1]=초기값, balance[ITERATION_NUMBER+1] = balance[ITERATION_NUMBER] × (1+rate)로 각 연도 잔액을 계산. ITERATION_NUMBER가 0→9로 증가하며 1~10 연도 계산.',
  },
  {
    id: 1544, level: 'advanced',
    question: `참조 모델(Reference Model)과 주 모델(Main Model)을 함께 사용하는 패턴은?`,
    options: [
      '참조 모델은 주 모델의 RULES에서 갱신 가능하다',
      'REFERENCE ref_model ON (서브쿼리) DIMENSION BY (...) MEASURES (...) 로 정의하고, 주 모델 RULES에서 ref_model.measures_col[dim_val]로 읽기 전용 접근',
      '참조 모델과 주 모델은 같은 DIMENSION BY를 공유해야 한다',
      '참조 모델은 PARTITION BY 없이 사용할 수 없다',
    ],
    correctAnswer: 1,
    explanation: '참조 모델: REFERENCE 이름 ON (쿼리) DIMENSION BY (...) MEASURES (...). 주 모델 RULES에서 ref_name.measure[dim] 형식으로 참조 데이터를 읽기 전용으로 접근합니다.',
  },
  {
    id: 1545, level: 'advanced',
    question: `다음 시나리오에 MODEL이 분석 함수(LAG)보다 유리한 경우는?`,
    options: [
      'N행 이전 값을 단순히 조회할 때',
      '이전 행의 계산 결과를 다음 행의 계산에 즉시 사용하는 연쇄 계산 (LAG는 원본 값만 참조 가능)',
      '순위 계산이 필요할 때',
      '윈도우 집계가 필요할 때',
    ],
    correctAnswer: 1,
    explanation: 'LAG는 원본 데이터의 이전 행 값을 참조합니다. MODEL은 규칙으로 갱신한 값을 다음 규칙의 입력으로 즉시 사용할 수 있습니다. 복리 계산처럼 이전 계산 결과를 연쇄 참조해야 할 때 MODEL이 더 적합합니다.',
  },
  {
    id: 1546, level: 'advanced',
    question: `다음 AUTOMATIC ORDER vs SEQUENTIAL ORDER 선택 기준은?`,
    options: [
      '항상 AUTOMATIC ORDER가 더 좋다',
      'SEQUENTIAL: 규칙 실행 순서를 직접 제어할 때. AUTOMATIC: 규칙 간 의존성이 복잡하여 순서 결정이 어려울 때',
      'AUTOMATIC은 단일 규칙에서만 사용 가능하다',
      'SEQUENTIAL은 ITERATE와 함께 사용할 수 없다',
    ],
    correctAnswer: 1,
    explanation: 'SEQUENTIAL ORDER: 작성 순서대로 실행 — 순서 제어가 중요한 규칙에 적합. AUTOMATIC ORDER: 의존성 분석 후 Oracle이 순서 결정 — 규칙 간 의존성이 복잡하고 순서 오류 위험이 있을 때 안전.',
  },
  {
    id: 1547, level: 'advanced',
    question: `다음 쿼리에서 PARTITION BY 없이 여러 제품의 연도별 예측이 섞이는 문제를 해결하는 방법은?`,
    options: [
      'WHERE 절로 제품을 하나씩 필터링하여 여러 번 실행한다',
      'PARTITION BY (product_id)를 추가하여 각 제품별로 독립적인 MODEL 배열을 구성한다',
      'DIMENSION BY에 product_id를 추가하여 (product_id, year)로 각 셀 식별',
      '두 방법(B 또는 C) 모두 가능하지만 목적이 다름 — B는 파티션별 독립, C는 단일 배열에서 2차원',
    ],
    correctAnswer: 3,
    explanation: 'PARTITION BY 추가: 제품마다 완전히 독립된 MODEL 배열 구성, 각 파티션 내 year만 DIMENSION. DIMENSION BY에 product_id 추가: 단일 배열에서 (product_id, year)로 셀 식별. 둘 다 가능하지만 규칙이 단순하면 PARTITION BY가 간결합니다.',
  },
  {
    id: 1548, level: 'advanced',
    question: `MODEL 절에서 집계 범위 참조 SUM(sales)[year BETWEEN 2020 AND CV(year)]의 성능 특성은?`,
    options: [
      '상수 시간(O(1))으로 처리된다',
      '각 행마다 범위의 모든 셀을 스캔하므로 행 수가 늘어나면 성능이 저하될 수 있다',
      '인덱스를 자동으로 활용한다',
      '한 번만 계산되어 모든 행에 재사용된다',
    ],
    correctAnswer: 1,
    explanation: 'MODEL의 집계 범위 참조는 각 행에서 지정 범위의 셀을 반복 스캔합니다. 행 수와 범위 크기에 비례하여 O(n²)의 성능을 보일 수 있습니다. 분석 함수의 ROWS BETWEEN이 더 효율적인 경우가 많습니다.',
  },
  {
    id: 1549, level: 'advanced',
    question: `다음 MODEL 결과에서 IGNORE NAV와 KEEP NAV의 차이를 계산하시오.
원본: sales[2025]=100, sales[2023]=존재하지 않음
RULES: sales[2024] = sales[2023] + sales[2025] * 0.1`,
    options: [
      'KEEP NAV: NULL+100×0.1=NULL. IGNORE NAV: 0+100×0.1=10',
      'KEEP NAV: 10. IGNORE NAV: NULL',
      '두 옵션 모두 10 반환',
      '두 옵션 모두 NULL 반환',
    ],
    correctAnswer: 0,
    explanation: 'KEEP NAV: sales[2023] = NULL → NULL + 10 = NULL. IGNORE NAV: sales[2023] = 0(숫자 NAV 기본값) → 0 + 10 = 10. 존재하지 않는 셀 참조 시 NAV 처리 방식이 결과를 결정합니다.',
  },
  {
    id: 1550, level: 'advanced',
    question: `대용량 데이터에서 MODEL 절의 성능 최적화 방법은?`,
    options: [
      'MODEL은 항상 빠르므로 최적화가 불필요하다',
      'WHERE로 데이터 미리 필터링, PARTITION BY로 병렬 처리 분할, 불필요한 MEASURES 열 제거, ITERATE 횟수 최소화',
      'ITERATE(999999)로 최대 반복 횟수를 늘린다',
      'RETURN ALL ROWS를 항상 사용한다',
    ],
    correctAnswer: 1,
    explanation: 'MODEL 성능 최적화: ①WHERE로 처리 행 수 최소화 ②PARTITION BY로 병렬/독립 처리 ③MEASURES에 필요한 열만 포함 ④ITERATE 횟수 최소화 ⑤RETURN UPDATED ROWS로 결과 행 최소화. 집계 범위 참조 대신 분석 함수 조합 고려.',
  },
]
