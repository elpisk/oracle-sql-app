import type { QuizQuestion } from '@/lib/types'

export const ch13Quiz: QuizQuestion[] = [
  // ── 하(기초) 1~20 ──────────────────────────────────────────
  {
    id: 1301, level: 'basic',
    question: '분석 함수(Analytic Function)의 핵심 특징으로 올바른 것은?',
    options: [
      'GROUP BY처럼 행을 그룹으로 묶어 단일 결과 행을 반환한다',
      'OVER() 절을 사용하며 각 행에 대해 집계 결과를 반환하되 원본 행 수를 유지한다',
      'WHERE 절에서만 사용할 수 있다',
      'DML 문에서만 사용할 수 있다',
    ],
    correctAnswer: 1,
    explanation: '분석 함수는 OVER() 절을 사용하며, GROUP BY와 달리 원본 행 수를 유지하면서 각 행에 집계/순위/이동 계산 결과를 반환합니다. SELECT 절에서 사용합니다.',
  },
  {
    id: 1302, level: 'basic',
    question: 'OVER() 절에서 PARTITION BY의 역할은?',
    options: [
      '결과를 특정 열 기준으로 정렬한다',
      '데이터를 논리적 그룹(파티션)으로 나누어 각 파티션 내에서 분석 계산을 수행한다',
      '반환되는 행 수를 제한한다',
      '특정 행 범위를 지정한다',
    ],
    correctAnswer: 1,
    explanation: 'PARTITION BY는 데이터를 논리적 파티션으로 분할하여 각 파티션 내에서 독립적으로 분석 함수를 계산합니다. GROUP BY처럼 행을 줄이지 않고 원본 행 수를 유지합니다.',
  },
  {
    id: 1303, level: 'basic',
    question: '분석 함수에서 ORDER BY 없이 OVER()만 사용하면?',
    options: [
      '오류가 발생한다',
      '전체 결과 집합을 하나의 파티션으로 처리한다',
      '자동으로 기본 키 기준으로 정렬된다',
      'NULL이 반환된다',
    ],
    correctAnswer: 1,
    explanation: 'OVER() 절에 PARTITION BY와 ORDER BY를 모두 생략하면 전체 결과 집합이 하나의 파티션으로 처리됩니다. 예: SUM(salary) OVER() → 전체 급여 합계를 모든 행에 반환.',
  },
  {
    id: 1304, level: 'basic',
    question: 'ROW_NUMBER() 함수에 대한 설명으로 올바른 것은?',
    options: [
      '동일한 값이 있어도 각 행에 고유한 순번을 부여한다',
      '동일한 값에는 같은 번호를 부여하고 다음 번호를 건너뛴다',
      '동일한 값에는 같은 번호를 부여하고 다음 번호를 건너뛰지 않는다',
      '1부터 시작하지 않을 수 있다',
    ],
    correctAnswer: 0,
    explanation: 'ROW_NUMBER()는 동일한 값(동점)이 있어도 각 행에 항상 고유한 순번을 부여합니다. 동점 처리 없이 임의로 순번을 구분합니다.',
  },
  {
    id: 1305, level: 'basic',
    question: 'RANK()와 DENSE_RANK()의 차이점으로 올바른 것은?',
    options: [
      '두 함수는 동일하다',
      'RANK()는 동점 시 번호를 건너뛰고, DENSE_RANK()는 건너뛰지 않는다',
      'DENSE_RANK()는 동점 시 번호를 건너뛰고, RANK()는 건너뛰지 않는다',
      'RANK()만 PARTITION BY를 사용할 수 있다',
    ],
    correctAnswer: 1,
    explanation: 'RANK(): 동점 시 다음 순위를 건너뜀 (1,2,2,4). DENSE_RANK(): 동점이어도 연속된 순위 부여 (1,2,2,3). 순위 경쟁에서 "공동 2위 다음 4위" vs "공동 2위 다음 3위"의 차이.',
  },
  {
    id: 1306, level: 'basic',
    question: '급여가 [5000, 5000, 7000, 9000]인 4명에게 DENSE_RANK() OVER(ORDER BY salary DESC) 적용 시 결과는?',
    options: ['1, 2, 3, 4', '1, 1, 2, 3', '1, 1, 3, 4', '1, 2, 2, 3'],
    correctAnswer: 1,
    explanation: 'DENSE_RANK() DESC: 9000→1, 7000→2, 5000(두 명)→3, 5000→3. 급여 내림차순 기준: 9000=1위, 7000=2위, 5000=3위(두 명). 결과: 1, 2, 3, 3.',
  },
  {
    id: 1307, level: 'basic',
    question: 'NTILE(4)의 역할은?',
    options: [
      '4번째 행을 반환한다',
      '데이터를 4개의 동등한 그룹으로 나누어 각 행에 그룹 번호(1~4)를 부여한다',
      '상위 4개 행만 반환한다',
      '4행씩 건너뛰며 번호를 부여한다',
    ],
    correctAnswer: 1,
    explanation: 'NTILE(n)은 데이터를 n개의 동등한 버킷으로 분할하고 각 행에 1~n 버킷 번호를 부여합니다. 총 행 수가 n으로 나눠지지 않으면 앞 버킷에 1행씩 더 배정됩니다.',
  },
  {
    id: 1308, level: 'basic',
    question: 'SUM(salary) OVER(PARTITION BY department_id)의 결과는?',
    options: [
      '전체 직원의 급여 합계를 단일 행으로 반환한다',
      '각 직원 행에 해당 직원이 속한 부서의 급여 합계를 함께 반환한다',
      '부서별로 하나의 합계 행을 반환한다',
      '오류가 발생한다',
    ],
    correctAnswer: 1,
    explanation: 'SUM(salary) OVER(PARTITION BY department_id): 원본 행 수는 유지하면서 각 직원 행에 자신이 속한 부서의 급여 합계를 추가로 반환합니다. GROUP BY와 달리 개별 행도 함께 표시됩니다.',
  },
  {
    id: 1309, level: 'basic',
    question: 'AVG(salary) OVER(PARTITION BY department_id ORDER BY hire_date)의 ORDER BY 역할은?',
    options: [
      '결과를 hire_date 기준으로 정렬한다',
      '누적 평균 계산을 위한 기본 윈도우 범위를 설정한다',
      'hire_date 기준 최신 직원만 포함한다',
      'hire_date 기준 파티션을 추가로 분할한다',
    ],
    correctAnswer: 1,
    explanation: '분석 함수에서 ORDER BY는 윈도우 프레임의 기준 순서를 정의합니다. ORDER BY가 있으면 기본 윈도우가 RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW(누적)로 설정됩니다.',
  },
  {
    id: 1310, level: 'basic',
    question: 'COUNT(*) OVER()의 결과는?',
    options: [
      'NULL을 반환한다',
      '각 행에 전체 행 수를 반환한다',
      '각 행에 해당 행까지의 누적 행 수를 반환한다',
      '오류가 발생한다',
    ],
    correctAnswer: 1,
    explanation: 'COUNT(*) OVER()는 PARTITION BY 없이 전체 결과 집합을 하나의 파티션으로 처리하므로, 모든 행에 전체 행 수를 반환합니다.',
  },
  {
    id: 1311, level: 'basic',
    question: 'LAG(salary, 1) OVER(ORDER BY hire_date)의 결과는?',
    options: [
      '현재 행의 급여를 1 증가시켜 반환한다',
      '현재 행보다 hire_date 기준 1행 이전(앞) 직원의 급여를 반환한다',
      '현재 행보다 hire_date 기준 1행 이후(뒤) 직원의 급여를 반환한다',
      '현재 행의 급여를 이전 행에 반환한다',
    ],
    correctAnswer: 1,
    explanation: 'LAG(값, n)은 ORDER BY 기준으로 현재 행보다 n행 이전(앞)의 값을 반환합니다. 첫 번째 행에는 이전 행이 없으므로 NULL(또는 지정한 기본값)을 반환합니다.',
  },
  {
    id: 1312, level: 'basic',
    question: 'LEAD(salary, 1, 0) OVER(ORDER BY hire_date)에서 세 번째 인수 0의 역할은?',
    options: [
      '오프셋(몇 행 앞/뒤)을 지정한다',
      '다음 행이 없을 때 반환하는 기본값이다',
      '윈도우 시작 위치를 지정한다',
      '소수점 자릿수를 지정한다',
    ],
    correctAnswer: 1,
    explanation: 'LEAD(열, 오프셋, 기본값) 형식. 세 번째 인수는 마지막 행처럼 다음 행이 없을 때 반환하는 기본값입니다. 지정하지 않으면 NULL이 반환됩니다.',
  },
  {
    id: 1313, level: 'basic',
    question: 'FIRST_VALUE(salary) OVER(PARTITION BY department_id ORDER BY salary DESC)의 결과는?',
    options: [
      '부서 내 첫 번째 입사자의 급여',
      '부서 내 가장 높은 급여 값을 모든 행에 반환',
      '부서 내 가장 낮은 급여 값',
      '전체 첫 번째 행의 급여',
    ],
    correctAnswer: 1,
    explanation: 'FIRST_VALUE(salary) OVER(PARTITION BY dept ORDER BY salary DESC): ORDER BY salary DESC이므로 파티션 내 첫 번째 값 = 가장 높은 급여. 이 값이 부서 내 모든 행에 반복 표시됩니다.',
  },
  {
    id: 1314, level: 'basic',
    question: 'LAST_VALUE 함수에서 주의해야 할 기본 윈도우 범위는?',
    options: [
      '기본적으로 전체 파티션을 대상으로 한다',
      '기본 윈도우가 ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW이므로 파티션 끝 값을 얻으려면 ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING이 필요하다',
      'ORDER BY 없이 사용해야 한다',
      'PARTITION BY와 함께만 사용할 수 있다',
    ],
    correctAnswer: 1,
    explanation: 'LAST_VALUE의 기본 윈도우는 현재 행까지(CURRENT ROW)이므로 각 행마다 "마지막" 값이 달라집니다. 파티션 전체의 마지막 값을 얻으려면 ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING을 명시해야 합니다.',
  },
  {
    id: 1315, level: 'basic',
    question: 'ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW의 의미는?',
    options: [
      '현재 행만 포함한다',
      '파티션 시작부터 현재 행까지 포함한다 (누적)',
      '파티션 전체를 포함한다',
      '현재 행 이후만 포함한다',
    ],
    correctAnswer: 1,
    explanation: 'UNBOUNDED PRECEDING은 파티션의 첫 번째 행, CURRENT ROW는 현재 행을 의미합니다. 따라서 파티션 시작부터 현재 행까지의 누적 범위를 지정하는 윈도우 프레임입니다.',
  },
  {
    id: 1316, level: 'basic',
    question: 'ROWS와 RANGE 윈도우 프레임의 차이점은?',
    options: [
      '두 방식은 항상 동일한 결과를 반환한다',
      'ROWS는 물리적 행 개수, RANGE는 논리적 값 범위(동점 행 포함)를 기준으로 한다',
      'RANGE만 PARTITION BY와 함께 사용 가능하다',
      'ROWS는 오름차순, RANGE는 내림차순에서만 사용 가능하다',
    ],
    correctAnswer: 1,
    explanation: 'ROWS: 물리적 행 수 기준(정확히 n번째 행). RANGE: 값 기준(동일 값의 모든 행 포함). 동점이 있으면 ROWS와 RANGE 결과가 달라집니다.',
  },
  {
    id: 1317, level: 'basic',
    question: '분석 함수와 GROUP BY 집계 함수의 차이점으로 올바른 것은?',
    options: [
      '분석 함수는 GROUP BY 없이는 사용할 수 없다',
      '분석 함수는 각 행의 상세 데이터를 유지하면서 집계 계산을 추가한다',
      'GROUP BY 집계 함수가 분석 함수보다 항상 빠르다',
      '분석 함수는 SELECT 절에 사용할 수 없다',
    ],
    correctAnswer: 1,
    explanation: 'GROUP BY는 행을 그룹으로 묶어 그룹당 1행을 반환합니다. 분석 함수는 원본 행 수를 유지하면서 각 행에 집계 결과를 추가합니다. 두 방식을 함께 사용할 수도 있습니다.',
  },
  {
    id: 1318, level: 'basic',
    question: '분석 함수는 쿼리의 어느 처리 단계에서 실행되는가?',
    options: [
      'WHERE 절 처리 전',
      'GROUP BY, HAVING 처리 후, ORDER BY 처리 전',
      'FROM 절 처리와 동시에',
      'SELECT 절의 다른 표현식보다 먼저',
    ],
    correctAnswer: 1,
    explanation: '분석 함수는 WHERE, GROUP BY, HAVING 처리가 모두 완료된 후 실행되며, ORDER BY 이전에 계산됩니다. 따라서 WHERE 절에서 분석 함수 결과로 필터링할 수 없습니다(서브쿼리 필요).',
  },
  {
    id: 1319, level: 'basic',
    question: 'UNBOUNDED FOLLOWING의 의미는?',
    options: [
      '이전 모든 행',
      '다음 모든 행 (파티션 끝까지)',
      '현재 행',
      '특정 N행 이후',
    ],
    correctAnswer: 1,
    explanation: 'UNBOUNDED FOLLOWING은 파티션의 마지막 행을 의미합니다. ROWS BETWEEN CURRENT ROW AND UNBOUNDED FOLLOWING은 현재 행부터 파티션 끝까지를 지정합니다.',
  },
  {
    id: 1320, level: 'basic',
    question: 'NTH_VALUE(salary, 3) OVER(...)의 기능은?',
    options: [
      '상위 3개의 평균을 반환한다',
      '윈도우 내 3번째 행의 값을 반환한다',
      '3으로 나눈 나머지를 반환한다',
      '소수점 3자리까지 반환한다',
    ],
    correctAnswer: 1,
    explanation: 'NTH_VALUE(열, n)은 윈도우 프레임 내에서 n번째 행의 값을 반환합니다. FIRST_VALUE는 1번째, NTH_VALUE(col, 2)는 2번째, LAST_VALUE는 마지막 값을 반환합니다.',
  },

  // ── 중(응용) 21~40 ─────────────────────────────────────────
  {
    id: 1321, level: 'intermediate',
    question: `다음 쿼리에서 employee_id=100의 rn 값은? (employees: 107행)
SELECT employee_id, ROW_NUMBER() OVER(ORDER BY employee_id) rn FROM employees WHERE employee_id = 100;`,
    options: [
      '100',
      '1 (employee_id=100이 ORDER BY employee_id 기준 첫 번째 행이므로)',
      '해당 행의 실제 순번 (ORDER BY employee_id 기준)',
      'NULL',
    ],
    correctAnswer: 2,
    explanation: 'ROW_NUMBER() OVER(ORDER BY employee_id): employee_id=100은 100번째(또는 실제 위치)의 순번이 부여됩니다. WHERE 절 후 남은 결과 집합 내에서의 순번이므로, WHERE employee_id=100이면 1행만 남아 rn=1.',
  },
  {
    id: 1322, level: 'intermediate',
    question: `급여가 [9000, 8000, 7000, 7000, 6000]인 5명에게 RANK() OVER(ORDER BY salary DESC) 적용 결과는?`,
    options: ['1, 2, 3, 4, 5', '1, 2, 3, 3, 5', '1, 2, 3, 3, 4', '1, 1, 3, 3, 5'],
    correctAnswer: 1,
    explanation: 'RANK()는 동점 시 다음 순위를 건너뜁니다. 9000→1, 8000→2, 7000(두 명)→3, 3, 6000→5(4를 건너뜀). 결과: 1, 2, 3, 3, 5.',
  },
  {
    id: 1323, level: 'intermediate',
    question: '각 부서에서 급여 상위 3위까지만 조회하는 올바른 쿼리는?',
    options: [
      'SELECT * FROM employees WHERE RANK() OVER(PARTITION BY department_id ORDER BY salary DESC) <= 3',
      'SELECT * FROM (SELECT e.*, RANK() OVER(PARTITION BY department_id ORDER BY salary DESC) AS rnk FROM employees e) WHERE rnk <= 3',
      'SELECT * FROM employees GROUP BY department_id HAVING RANK() <= 3',
      'SELECT TOP 3 * FROM employees PARTITION BY department_id ORDER BY salary DESC',
    ],
    correctAnswer: 1,
    explanation: '분석 함수 결과로 필터링하려면 서브쿼리가 필요합니다. 분석 함수는 WHERE 절보다 나중에 실행되므로 WHERE에서 직접 사용할 수 없습니다. 서브쿼리로 감싸고 외부 WHERE에서 필터링합니다.',
  },
  {
    id: 1324, level: 'intermediate',
    question: `다음 쿼리의 누적 합계 결과로 올바른 것은? (salary: 1000, 2000, 3000 순서)
SUM(salary) OVER(ORDER BY hire_date ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)`,
    options: [
      '6000, 6000, 6000 (전체 합계)',
      '1000, 2000, 3000 (각 행의 급여)',
      '1000, 3000, 6000 (누적 합계)',
      '3000, 2000, 1000 (역순)',
    ],
    correctAnswer: 2,
    explanation: 'ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW는 파티션 시작부터 현재 행까지 누적합니다. 1행: 1000, 2행: 1000+2000=3000, 3행: 1000+2000+3000=6000.',
  },
  {
    id: 1325, level: 'intermediate',
    question: `SUM(salary) OVER(PARTITION BY department_id ORDER BY hire_date) 에서 ORDER BY가 있을 때 기본 윈도우는?`,
    options: [
      'ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING (전체 파티션)',
      'RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW (누적)',
      'ROWS BETWEEN 1 PRECEDING AND 1 FOLLOWING (이동 윈도우)',
      'ROWS BETWEEN CURRENT ROW AND UNBOUNDED FOLLOWING',
    ],
    correctAnswer: 1,
    explanation: '분석 함수에서 ORDER BY가 있고 윈도우 절이 없으면 기본값은 RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW입니다. 이는 파티션 시작부터 현재 행(동일 값 포함)까지의 누적을 의미합니다.',
  },
  {
    id: 1326, level: 'intermediate',
    question: `LAG(salary, 2, 0) OVER(ORDER BY hire_date) 에서 세 번째 인수 0의 의미와 두 번째 인수 2의 의미는?`,
    options: [
      '0=소수점자리, 2=파티션수',
      '2=2행 이전 값을 조회, 0=이전 2행이 없을 때 반환할 기본값',
      '2=2행 이후 값, 0=마지막 행 처리',
      '두 인수 모두 윈도우 크기를 지정한다',
    ],
    correctAnswer: 1,
    explanation: 'LAG(열, 오프셋, 기본값): 오프셋=2이면 2행 이전 값 조회, 기본값=0이면 이전 2행이 없는 첫 두 행에서 0을 반환합니다.',
  },
  {
    id: 1327, level: 'intermediate',
    question: '이동 평균(Moving Average)을 3행 기준으로 계산하는 올바른 윈도우 절은?',
    options: [
      'ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW',
      'ROWS BETWEEN 2 PRECEDING AND CURRENT ROW',
      'ROWS BETWEEN 3 PRECEDING AND CURRENT ROW',
      'RANGE BETWEEN 3 PRECEDING AND 3 FOLLOWING',
    ],
    correctAnswer: 1,
    explanation: '3행 이동 평균 = 현재 행과 이전 2행(총 3행)의 평균. ROWS BETWEEN 2 PRECEDING AND CURRENT ROW로 이전 2행(2 PRECEDING)부터 현재 행(CURRENT ROW)까지 3행을 포함합니다.',
  },
  {
    id: 1328, level: 'intermediate',
    question: `다음 쿼리에서 first_sal의 역할은?
SELECT employee_id, department_id, salary,
       FIRST_VALUE(salary) OVER(PARTITION BY department_id ORDER BY salary DESC) first_sal
FROM employees;`,
    options: [
      '부서 내 가장 낮은 급여',
      '부서 내 가장 높은 급여 (ORDER BY DESC 기준 첫 번째 값)',
      '전체 직원 중 가장 높은 급여',
      '현재 행의 급여',
    ],
    correctAnswer: 1,
    explanation: 'FIRST_VALUE(salary) OVER(PARTITION BY dept ORDER BY salary DESC): ORDER BY salary DESC이면 파티션(부서) 내 첫 번째 값 = 가장 높은 급여. 이 값이 부서의 모든 행에 동일하게 표시됩니다.',
  },
  {
    id: 1329, level: 'intermediate',
    question: '직원 수가 10명인 부서에 NTILE(4)를 적용하면 각 버킷의 크기는?',
    options: [
      '모두 2명씩 (10/4=2.5, 반올림)',
      '버킷1~2는 3명, 버킷3~4는 2명',
      '버킷1~3은 3명, 버킷4는 1명',
      '모두 3명씩 (나머지 2명은 제외)',
    ],
    correctAnswer: 1,
    explanation: '10명을 4버킷으로: 10 ÷ 4 = 2 나머지 2. 나머지 2명은 앞 2개 버킷에 1명씩 추가. 버킷1=3명, 버킷2=3명, 버킷3=2명, 버킷4=2명.',
  },
  {
    id: 1330, level: 'intermediate',
    question: `다음 쿼리에서 prev_sal이 NULL인 행은?
SELECT employee_id, salary,
       LAG(salary) OVER(ORDER BY hire_date) AS prev_sal
FROM employees;`,
    options: [
      '마지막 행 (이전 행이 없음)',
      '첫 번째 행 (이전 행이 없음)',
      'salary가 NULL인 행',
      'NULL인 행은 없다',
    ],
    correctAnswer: 1,
    explanation: 'LAG(salary)의 첫 번째 행은 이전 행이 없으므로 NULL을 반환합니다. 기본값을 지정하지 않았으므로 NULL. LAG(salary, 1, 0)으로 기본값을 0으로 지정하면 NULL 대신 0이 반환됩니다.',
  },
  {
    id: 1331, level: 'intermediate',
    question: 'ROWS BETWEEN 1 PRECEDING AND 1 FOLLOWING의 의미는?',
    options: [
      '현재 행만 포함',
      '현재 행과 앞뒤 각 1행씩 포함하는 이동 윈도우 (총 3행)',
      '이전 1행부터 파티션 끝까지',
      '처음부터 이후 1행까지',
    ],
    correctAnswer: 1,
    explanation: '1 PRECEDING AND 1 FOLLOWING은 현재 행 기준으로 이전 1행 + 현재 행 + 다음 1행 = 3행의 이동 윈도우를 지정합니다. 이동 평균이나 이동 합계 계산에 사용됩니다.',
  },
  {
    id: 1332, level: 'intermediate',
    question: `다음 쿼리에서 dept_ratio의 의미는?
SELECT employee_id, department_id, salary,
       ROUND(salary / SUM(salary) OVER(PARTITION BY department_id) * 100, 2) AS dept_ratio
FROM employees;`,
    options: [
      '전체 직원 급여 대비 비율',
      '해당 직원의 급여가 소속 부서 전체 급여에서 차지하는 비율(%)',
      '부서 평균 급여 대비 비율',
      '부서 최고 급여 대비 비율',
    ],
    correctAnswer: 1,
    explanation: 'SUM(salary) OVER(PARTITION BY department_id): 부서 전체 급여 합계. 개인 salary / 부서 합계 * 100 = 해당 직원의 급여가 부서 전체에서 차지하는 비율(%).',
  },
  {
    id: 1333, level: 'intermediate',
    question: '동일 파티션 내에서 RANK와 DENSE_RANK의 결과가 달라지는 조건은?',
    options: [
      '파티션 내 행이 1개일 때',
      '파티션 내 동일 ORDER BY 값(동점)이 있을 때',
      'ORDER BY 컬럼이 NULL을 포함할 때',
      'PARTITION BY를 사용하지 않을 때',
    ],
    correctAnswer: 1,
    explanation: '동점(동일 ORDER BY 값)이 없으면 RANK와 DENSE_RANK 결과가 동일합니다. 동점이 있으면: RANK는 같은 순위 부여 후 건너뛰고, DENSE_RANK는 같은 순위 후 연속 번호를 부여하여 결과가 달라집니다.',
  },
  {
    id: 1334, level: 'intermediate',
    question: '부서별 급여 순위에서 각 부서 1위만 조회하는 올바른 쿼리 패턴은?',
    options: [
      'SELECT * FROM employees WHERE ROW_NUMBER() OVER(PARTITION BY department_id ORDER BY salary DESC) = 1',
      'SELECT * FROM (SELECT e.*, ROW_NUMBER() OVER(PARTITION BY department_id ORDER BY salary DESC) rn FROM employees e) WHERE rn = 1',
      'SELECT FIRST employee_id FROM employees GROUP BY department_id ORDER BY salary DESC',
      'SELECT * FROM employees HAVING ROW_NUMBER() = 1',
    ],
    correctAnswer: 1,
    explanation: '분석 함수 결과를 WHERE로 필터링하려면 서브쿼리나 CTE(WITH)를 사용해야 합니다. 외부 WHERE rn = 1로 각 파티션의 1위만 필터링합니다.',
  },
  {
    id: 1335, level: 'intermediate',
    question: `OVER(PARTITION BY department_id ORDER BY salary DESC ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING)에서 ROWS UNBOUNDED FOLLOWING의 효과는?`,
    options: [
      '현재 행까지만 포함',
      '파티션 시작부터 끝까지 전체 파티션을 대상으로 계산',
      '다음 행부터 파티션 끝까지만 포함',
      'ORDER BY를 무시하고 전체 집계',
    ],
    correctAnswer: 1,
    explanation: 'ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING은 파티션 전체를 윈도우로 지정합니다. LAST_VALUE 등에서 파티션의 진짜 마지막 값을 얻을 때 사용합니다.',
  },
  {
    id: 1336, level: 'intermediate',
    question: '분석 함수를 WHERE 절에서 직접 사용할 수 없는 이유는?',
    options: [
      '분석 함수는 문법적으로 WHERE에서 사용 불가하다',
      '분석 함수는 WHERE/GROUP BY/HAVING 처리 후에 실행되므로 WHERE에서 참조할 수 없다',
      '분석 함수는 너무 복잡하여 필터로 사용하면 성능 문제가 생긴다',
      '분석 함수는 숫자 값만 반환하므로 조건 비교가 불가하다',
    ],
    correctAnswer: 1,
    explanation: '쿼리 실행 순서: FROM → WHERE → GROUP BY → HAVING → SELECT(분석 함수 실행) → ORDER BY. 분석 함수는 SELECT 단계에서 실행되므로 WHERE 단계에서는 아직 실행되지 않아 참조할 수 없습니다.',
  },
  {
    id: 1337, level: 'intermediate',
    question: `다음 두 쿼리의 차이는?
A: SELECT dept, SUM(salary) FROM employees GROUP BY dept
B: SELECT dept, salary, SUM(salary) OVER(PARTITION BY dept) total FROM employees`,
    options: [
      'A와 B의 결과는 동일하다',
      'A는 부서별 1행을 반환하고, B는 각 직원 행에 부서 합계를 추가하여 원본 행 수를 유지한다',
      'B가 더 빠르다',
      'A는 분석 함수를 사용하고 B는 GROUP BY를 사용한다',
    ],
    correctAnswer: 1,
    explanation: 'A(GROUP BY): 부서별 1행 × N개 부서 = N행. B(분석 함수): 원본 107행 유지하면서 각 행에 부서 합계 추가. 개별 직원 정보(salary 등)와 부서 합계를 동시에 보고 싶을 때 B가 유용합니다.',
  },
  {
    id: 1338, level: 'intermediate',
    question: `PERCENT_RANK() OVER(ORDER BY salary DESC)의 결과로 올바른 것은?`,
    options: [
      '1부터 N까지의 순위를 반환한다',
      '0~1 사이 백분위 순위를 반환한다 (첫 행=0, 마지막=1)',
      'NULL을 반환한다',
      '0~100 사이의 백분율을 반환한다',
    ],
    correctAnswer: 1,
    explanation: 'PERCENT_RANK()는 (RANK-1)/(전체행수-1) 공식으로 0~1 사이의 상대적 백분위 순위를 반환합니다. 가장 높은 순위(1위)=0, 가장 낮은 순위=1.',
  },
  {
    id: 1339, level: 'intermediate',
    question: 'CUME_DIST() 함수가 반환하는 값은?',
    options: [
      '누적 거리(행 간 차이)를 반환한다',
      '현재 행 이하의 값을 가진 행의 비율(0 초과~1 이하)을 반환한다',
      '현재 행까지의 누적 합계를 반환한다',
      'PERCENT_RANK와 동일한 결과를 반환한다',
    ],
    correctAnswer: 1,
    explanation: 'CUME_DIST()는 누적 분포 함수로, 현재 행의 값과 같거나 작은(오름차순 기준) 행의 비율을 반환합니다. 항상 0 초과 1 이하이며, 마지막 행은 항상 1입니다.',
  },
  {
    id: 1340, level: 'intermediate',
    question: `다음 쿼리에서 prev_sal과 next_sal이 모두 NULL인 행은?
SELECT employee_id,
       LAG(salary) OVER(ORDER BY hire_date) AS prev_sal,
       LEAD(salary) OVER(ORDER BY hire_date) AS next_sal
FROM employees;`,
    options: [
      '중간 행들 (양 옆이 있는 행)',
      '없다 — 한 행에 prev_sal과 next_sal이 동시에 NULL일 수 없다',
      '첫 번째 행 (이전 없음)과 마지막 행 (다음 없음) 모두 해당',
      '테이블이 1행이면 둘 다 NULL인 행이 존재한다',
    ],
    correctAnswer: 3,
    explanation: '테이블이 1행이면: prev_sal=NULL(이전 없음), next_sal=NULL(다음 없음). 일반적으로 첫 행은 prev_sal만 NULL, 마지막 행은 next_sal만 NULL. 1행 테이블에서는 둘 다 NULL.',
  },

  // ── 상(심화) 41~50 ─────────────────────────────────────────
  {
    id: 1341, level: 'advanced',
    question: `각 직원이 자신의 부서 평균 급여 대비 몇 % 더 받는지 계산하는 쿼리가 있습니다.
직원 급여가 부서 평균보다 10% 이상 높은 직원만 조회하려면?`,
    options: [
      'WHERE salary > AVG(salary) OVER(PARTITION BY department_id) * 1.1',
      'WITH cte AS (SELECT e.*, AVG(salary) OVER(PARTITION BY department_id) avg_sal FROM employees e) SELECT * FROM cte WHERE salary > avg_sal * 1.1',
      'HAVING salary > AVG(salary) * 1.1',
      'SELECT * FROM employees WHERE salary > dept_avg * 1.1',
    ],
    correctAnswer: 1,
    explanation: '분석 함수는 WHERE에서 직접 사용 불가. CTE(WITH)나 서브쿼리로 분석 함수 결과를 먼저 계산한 후 외부 WHERE에서 필터링해야 합니다.',
  },
  {
    id: 1342, level: 'advanced',
    question: `다음 쿼리에서 last_sal 결과에 문제가 있습니다. 문제와 해결책은?
SELECT employee_id, salary,
       LAST_VALUE(salary) OVER(PARTITION BY department_id ORDER BY salary) last_sal
FROM employees;`,
    options: [
      '문제 없음 — LAST_VALUE가 항상 파티션 마지막 값을 반환함',
      '기본 윈도우(RANGE UNBOUNDED PRECEDING TO CURRENT ROW)로 인해 last_sal이 파티션 끝 값이 아닌 현재 행까지의 마지막 값이 됨 → ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING 추가 필요',
      'LAST_VALUE는 ORDER BY DESC에서만 사용 가능',
      'PARTITION BY와 ORDER BY를 동시에 사용할 수 없다',
    ],
    correctAnswer: 1,
    explanation: 'LAST_VALUE의 기본 윈도우는 현재 행까지이므로 각 행마다 last_sal이 달라집니다. 파티션의 진짜 마지막(최대) 값을 모든 행에 표시하려면 ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING을 명시해야 합니다.',
  },
  {
    id: 1343, level: 'advanced',
    question: `연도별 매출과 전년도 매출을 같은 행에 표시하는 쿼리를 작성할 때 가장 적합한 함수는?`,
    options: [
      'FIRST_VALUE(매출) OVER(ORDER BY 연도)',
      'LAG(매출, 1) OVER(ORDER BY 연도)',
      'LEAD(매출, 1) OVER(ORDER BY 연도)',
      'NTH_VALUE(매출, -1) OVER(ORDER BY 연도)',
    ],
    correctAnswer: 1,
    explanation: '전년도(1년 이전) 값을 현재 행에 표시: LAG(매출, 1) OVER(ORDER BY 연도). LAG는 이전 행 값, LEAD는 이후 행 값을 반환합니다. 전년 대비 증감 분석에 자주 사용됩니다.',
  },
  {
    id: 1344, level: 'advanced',
    question: `다음 쿼리에서 running_total과 dept_total의 차이를 설명하시오.
running_total: SUM(salary) OVER(PARTITION BY dept ORDER BY hire_date)
dept_total: SUM(salary) OVER(PARTITION BY dept)`,
    options: [
      '두 결과는 동일하다',
      'running_total은 hire_date 기준 누적 합계(행마다 다름), dept_total은 부서 전체 합계(부서 내 모든 행 동일)',
      'dept_total이 누적이고 running_total이 전체 합계다',
      'running_total만 NULL을 포함할 수 있다',
    ],
    correctAnswer: 1,
    explanation: 'running_total: ORDER BY가 있어 기본 윈도우 = RANGE UNBOUNDED PRECEDING TO CURRENT ROW → hire_date 기준 누적 합계. dept_total: ORDER BY 없어 전체 파티션 → 부서 전체 합계. hire_date가 증가할수록 running_total이 dept_total에 수렴합니다.',
  },
  {
    id: 1345, level: 'advanced',
    question: `동일 급여 직원이 있을 때 ROWS BETWEEN과 RANGE BETWEEN 결과 차이가 발생하는 쿼리는?
SUM(salary) OVER(ORDER BY salary ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)
SUM(salary) OVER(ORDER BY salary RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)
급여: [3000, 5000, 5000, 8000]`,
    options: [
      '두 결과는 항상 동일하다',
      'ROWS: 3000, 8000, 13000, 21000. RANGE: 3000, 13000, 13000, 21000 (동점 5000 두 행이 함께 누적)',
      'RANGE: 3000, 8000, 13000, 21000. ROWS: 3000, 13000, 13000, 21000',
      '동점이 있으면 둘 다 오류가 발생한다',
    ],
    correctAnswer: 1,
    explanation: 'ROWS: 물리적 행 하나씩 누적 → 3000, 8000, 13000, 21000. RANGE: 같은 값(5000) 두 행을 동시에 포함 → 3000, (3000+5000+5000=13000), 13000, 21000. 동점이 있을 때 ROWS/RANGE 결과가 달라집니다.',
  },
  {
    id: 1346, level: 'advanced',
    question: `다음 쿼리에서 오류가 발생하는 이유는?
SELECT department_id, SUM(salary), RANK() OVER(ORDER BY SUM(salary) DESC) AS rnk
FROM employees
GROUP BY department_id;`,
    options: [
      '문법 오류 없음, 정상 실행',
      '분석 함수 RANK() 내에서 SUM(salary) 집계 함수를 ORDER BY에 사용하는 것은 허용됨',
      'GROUP BY와 분석 함수를 함께 사용할 때 SELECT의 일반 집계 함수는 분석 함수의 ORDER BY에 사용 가능',
      'RANK() 내 ORDER BY에 집계 함수(SUM) 직접 사용은 일부 버전에서 오류 발생 가능',
    ],
    correctAnswer: 1,
    explanation: 'Oracle에서는 GROUP BY와 분석 함수를 함께 사용할 때, 분석 함수의 ORDER BY에 집계 함수 결과를 사용할 수 있습니다. 이 쿼리는 부서별 급여 합계 기준 순위를 반환하는 유효한 쿼리입니다.',
  },
  {
    id: 1347, level: 'advanced',
    question: '중앙값(Median)을 분석 함수로 계산하려면?',
    options: [
      'MEDIAN(salary) OVER(PARTITION BY department_id)',
      'NTH_VALUE(salary, COUNT(*)/2) OVER(PARTITION BY department_id ORDER BY salary)',
      'PERCENTILE_CONT(0.5) WITHIN GROUP(ORDER BY salary) OVER(PARTITION BY department_id)',
      'FIRST_VALUE(salary) OVER(PARTITION BY department_id ORDER BY salary) WHERE ROWNUM = COUNT(*)/2',
    ],
    correctAnswer: 2,
    explanation: 'PERCENTILE_CONT(0.5) WITHIN GROUP(ORDER BY salary)로 중앙값을 계산합니다. OVER(PARTITION BY)를 추가하면 파티션별 중앙값을 각 행에 표시합니다. WITHIN GROUP은 순서형 집합 함수에서 사용합니다.',
  },
  {
    id: 1348, level: 'advanced',
    question: `다음 분석 쿼리가 실행되는 단계별 처리 순서를 올바르게 나열하시오.
SELECT dept, salary, RANK() OVER(PARTITION BY dept ORDER BY salary DESC) rnk
FROM employees WHERE salary > 5000 ORDER BY dept, rnk;`,
    options: [
      'SELECT → FROM → WHERE → RANK() → ORDER BY',
      'FROM → WHERE(salary>5000 필터) → SELECT+RANK() 계산 → ORDER BY',
      'RANK() → FROM → WHERE → SELECT → ORDER BY',
      'FROM → SELECT → WHERE → RANK() → ORDER BY',
    ],
    correctAnswer: 1,
    explanation: '실행 순서: ①FROM employees 행 읽기 → ②WHERE salary>5000 필터 → ③SELECT 처리 + RANK() OVER(PARTITION BY dept ORDER BY salary DESC) 계산 → ④ORDER BY dept, rnk 정렬. 분석 함수는 WHERE 필터 후 실행됩니다.',
  },
  {
    id: 1349, level: 'advanced',
    question: '성능 최적화 관점에서 분석 함수 사용 시 권장 사항은?',
    options: [
      '분석 함수는 항상 GROUP BY보다 느리므로 사용을 피해야 한다',
      'PARTITION BY 열에 인덱스가 있으면 성능이 향상될 수 있으며, 동일 PARTITION BY/ORDER BY를 가진 함수들은 하나의 윈도우 소트로 처리된다',
      '분석 함수마다 별도 서브쿼리로 분리해야 최적화된다',
      '분석 함수는 소규모 테이블에서만 사용해야 한다',
    ],
    correctAnswer: 1,
    explanation: 'Oracle은 동일한 PARTITION BY/ORDER BY를 가진 여러 분석 함수를 하나의 정렬 작업으로 처리합니다. PARTITION BY 열에 적절한 인덱스가 있으면 정렬 비용을 줄일 수 있습니다.',
  },
  {
    id: 1350, level: 'advanced',
    question: `직원을 급여 기준 상위 25%(NTILE 버킷 1)와 하위 25%(버킷 4)로 분류하고, 두 그룹의 평균 급여 차이를 계산하는 쿼리 접근법은?`,
    options: [
      'GROUP BY salary HAVING salary > AVG(salary)',
      'CTE로 NTILE(4) OVER(ORDER BY salary DESC) 버킷 번호를 구하고, 외부 쿼리에서 버킷 1과 4를 필터링하여 AVG(salary) 비교',
      'RANK() = 1 AND RANK() = 4 조건으로 필터링',
      'WHERE NTILE(4) = 1 OR NTILE(4) = 4 조건 사용',
    ],
    correctAnswer: 1,
    explanation: 'NTILE 결과는 WHERE에서 직접 사용 불가. CTE/서브쿼리로 NTILE(4) OVER(ORDER BY salary DESC)를 계산하고, 외부 쿼리에서 bucket=1(상위 25%)과 bucket=4(하위 25%)를 필터링하여 AVG를 비교합니다.',
  },
]
