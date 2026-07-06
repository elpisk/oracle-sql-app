import type { PracticeProblem } from '@/lib/types'

export const ch13Practice: PracticeProblem[] = [
  // ── Group 1: 순위 함수 (ROW_NUMBER, RANK, DENSE_RANK) ──────
  {
    id: 1301, group: 1, groupTitle: '순위 함수',
    question: '모든 직원을 급여 내림차순으로 정렬하여 전체 순위(ROW_NUMBER)를 부여하시오.',
    sql: `SELECT employee_id, last_name, salary,
       ROW_NUMBER() OVER(ORDER BY salary DESC) AS row_num
FROM   employees
ORDER BY salary DESC;`,
    result: '107행. 동점 급여가 있어도 각 행에 고유 순번 부여.',
    keyPoint: 'ROW_NUMBER() OVER(ORDER BY): 동점 무관 고유 순번. 같은 값도 다른 번호.',
  },
  {
    id: 1302, group: 1, groupTitle: '순위 함수',
    question: '급여 기준 전체 순위를 ROW_NUMBER, RANK, DENSE_RANK 세 가지로 동시에 표시하시오.',
    sql: `SELECT employee_id, last_name, salary,
       ROW_NUMBER()  OVER(ORDER BY salary DESC) AS row_num,
       RANK()        OVER(ORDER BY salary DESC) AS rnk,
       DENSE_RANK()  OVER(ORDER BY salary DESC) AS dense_rnk
FROM   employees
ORDER BY salary DESC
FETCH FIRST 15 ROWS ONLY;`,
    result: '동점 급여 행에서 ROW_NUMBER=고유번호, RANK=건너뜀, DENSE_RANK=연속번호 차이 확인.',
    keyPoint: '세 함수 동점 처리 차이: ROW_NUMBER(고유) vs RANK(건너뜀) vs DENSE_RANK(연속).',
  },
  {
    id: 1303, group: 1, groupTitle: '순위 함수',
    question: '각 부서별로 급여 순위(RANK)를 매기시오. 부서 내 순위도 함께 표시하시오.',
    sql: `SELECT employee_id, last_name, department_id, salary,
       RANK() OVER(PARTITION BY department_id
                  ORDER BY salary DESC) AS dept_rank
FROM   employees
WHERE  department_id IS NOT NULL
ORDER BY department_id, dept_rank;`,
    result: '각 부서 내 급여 높은 순으로 1위부터 순위 부여. 부서가 바뀌면 순위 초기화.',
    keyPoint: 'PARTITION BY department_id: 부서별 독립 순위. 부서 바뀌면 1부터 재시작.',
  },
  {
    id: 1304, group: 1, groupTitle: '순위 함수',
    question: '각 부서에서 급여 상위 2위(DENSE_RANK 기준) 이내인 직원만 조회하시오.',
    sql: `SELECT employee_id, last_name, department_id, salary, dense_rnk
FROM (
    SELECT employee_id, last_name, department_id, salary,
           DENSE_RANK() OVER(PARTITION BY department_id
                             ORDER BY salary DESC) AS dense_rnk
    FROM   employees
    WHERE  department_id IS NOT NULL
)
WHERE  dense_rnk <= 2
ORDER BY department_id, dense_rnk;`,
    result: '각 부서 급여 1~2위 직원. 동점이면 2위 이내 기준으로 여러 명 포함.',
    keyPoint: '분석 함수 결과로 필터링: 서브쿼리 필수. DENSE_RANK=2이면 동점자 모두 포함.',
  },
  {
    id: 1305, group: 1, groupTitle: '순위 함수',
    question: '직무별 입사일 순위(ROW_NUMBER)를 구하고, 직무별 첫 번째 입사자를 조회하시오.',
    sql: `-- 직무별 입사일 순위
SELECT employee_id, last_name, job_id, hire_date,
       ROW_NUMBER() OVER(PARTITION BY job_id ORDER BY hire_date) AS job_hire_rank
FROM   employees
ORDER BY job_id, job_hire_rank;

-- 직무별 최초 입사자만 조회
SELECT employee_id, last_name, job_id, hire_date
FROM (
    SELECT employee_id, last_name, job_id, hire_date,
           ROW_NUMBER() OVER(PARTITION BY job_id ORDER BY hire_date) AS rn
    FROM   employees
)
WHERE rn = 1
ORDER BY job_id;`,
    result: '각 직무의 첫 번째 입사자(hire_date 기준) 1명씩 출력.',
    keyPoint: 'ROW_NUMBER는 동점 시 임의 고유번호. 동점 입사일 처리에 유의.',
  },
  {
    id: 1306, group: 1, groupTitle: '순위 함수',
    question: 'NTILE(4)로 직원을 급여 기준 4분위로 나누고 각 그룹의 평균 급여를 구하시오.',
    sql: `-- 4분위 배정
SELECT employee_id, last_name, salary,
       NTILE(4) OVER(ORDER BY salary) AS quartile
FROM   employees
ORDER BY quartile, salary;

-- 분위별 평균 급여
SELECT quartile, COUNT(*) cnt, ROUND(AVG(salary), 0) avg_sal
FROM (
    SELECT salary, NTILE(4) OVER(ORDER BY salary) AS quartile
    FROM   employees
)
GROUP BY quartile
ORDER BY quartile;`,
    result: '1~4분위별 행 수와 평균 급여 출력. 107행을 4분위로 배분.',
    keyPoint: 'NTILE(4): 1분위=하위, 4분위=상위. 행 수가 4로 나눠지지 않으면 앞 버킷에 1행 더.',
  },

  // ── Group 2: 집계 분석 함수 (SUM/AVG/COUNT OVER) ──────────
  {
    id: 1307, group: 2, groupTitle: '집계 분석 함수',
    question: '각 직원 행에 소속 부서의 급여 합계와 전체 급여 합계를 함께 표시하시오.',
    sql: `SELECT employee_id, last_name, department_id, salary,
       SUM(salary) OVER(PARTITION BY department_id) AS dept_total,
       SUM(salary) OVER()                           AS grand_total
FROM   employees
WHERE  department_id IS NOT NULL
ORDER BY department_id, salary DESC;`,
    result: '각 직원 행에 dept_total(부서 합계)와 grand_total(전체 합계) 추가 표시.',
    keyPoint: 'PARTITION BY dept → 부서별 합계. OVER() → 전체 합계. 원본 행 수 유지.',
  },
  {
    id: 1308, group: 2, groupTitle: '집계 분석 함수',
    question: '각 직원의 급여가 부서 평균 대비 몇 % 차이인지 계산하시오.',
    sql: `SELECT employee_id, last_name, department_id, salary,
       ROUND(AVG(salary) OVER(PARTITION BY department_id), 0) AS dept_avg,
       ROUND((salary - AVG(salary) OVER(PARTITION BY department_id))
             / AVG(salary) OVER(PARTITION BY department_id) * 100, 1) AS diff_pct
FROM   employees
WHERE  department_id IS NOT NULL
ORDER BY department_id, diff_pct DESC;`,
    result: 'diff_pct > 0: 부서 평균보다 높음. diff_pct < 0: 부서 평균보다 낮음.',
    keyPoint: '분석 함수 결과를 산술 표현식에 활용. (개인급여 - 부서평균) / 부서평균 * 100.',
  },
  {
    id: 1309, group: 2, groupTitle: '집계 분석 함수',
    question: '입사일 기준 누적 직원 수와 누적 급여 합계를 계산하시오.',
    sql: `SELECT employee_id, last_name, hire_date, salary,
       COUNT(*) OVER(ORDER BY hire_date
                    ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS cum_count,
       SUM(salary) OVER(ORDER BY hire_date
                        ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS cum_salary
FROM   employees
ORDER BY hire_date;`,
    result: '입사일 순서대로 누적 직원 수와 누적 급여 합계 증가.',
    keyPoint: 'ROWS UNBOUNDED PRECEDING TO CURRENT ROW = 파티션 시작부터 현재 행까지 누적.',
  },
  {
    id: 1310, group: 2, groupTitle: '집계 분석 함수',
    question: '급여 기준 3행 이동 평균을 계산하시오 (이전 2행 + 현재 행).',
    sql: `SELECT employee_id, last_name, salary,
       ROUND(AVG(salary) OVER(ORDER BY salary
                              ROWS BETWEEN 2 PRECEDING AND CURRENT ROW), 0) AS moving_avg_3
FROM   employees
ORDER BY salary;`,
    result: '처음 2행은 이용 가능한 행만으로 평균 계산. 3행부터 3행 이동 평균.',
    keyPoint: 'ROWS BETWEEN 2 PRECEDING AND CURRENT ROW: 이전 2행 + 현재 행 = 최대 3행.',
  },
  {
    id: 1311, group: 2, groupTitle: '집계 분석 함수',
    question: '부서별 급여 합계 기준 순위를 분석 함수와 GROUP BY를 함께 사용하여 구하시오.',
    sql: `SELECT department_id,
       SUM(salary)                                    AS dept_total,
       RANK() OVER(ORDER BY SUM(salary) DESC)         AS dept_rank,
       DENSE_RANK() OVER(ORDER BY SUM(salary) DESC)   AS dept_dense_rank
FROM   employees
WHERE  department_id IS NOT NULL
GROUP BY department_id
ORDER BY dept_rank;`,
    result: '부서별 급여 합계와 합계 기준 순위 출력.',
    keyPoint: 'GROUP BY + 분석 함수 동시 사용 가능. 집계 함수 결과를 분석 함수 ORDER BY에 사용.',
  },
  {
    id: 1312, group: 2, groupTitle: '집계 분석 함수',
    question: '각 직원의 급여가 전체에서 상위 몇 %에 해당하는지 PERCENT_RANK로 계산하시오.',
    sql: `SELECT employee_id, last_name, salary,
       ROUND(PERCENT_RANK() OVER(ORDER BY salary) * 100, 1) AS pct_rank,
       ROUND(CUME_DIST()    OVER(ORDER BY salary) * 100, 1) AS cum_dist_pct
FROM   employees
ORDER BY salary DESC
FETCH FIRST 20 ROWS ONLY;`,
    result: 'pct_rank: 0~100% 백분위 순위. cum_dist_pct: 누적 분포 비율.',
    keyPoint: 'PERCENT_RANK: 0~1(첫 행=0). CUME_DIST: 0 초과~1(마지막=1). 둘 다 *100으로 %로 변환.',
  },

  // ── Group 3: 윈도우 절 (ROWS/RANGE BETWEEN) ──────────────
  {
    id: 1313, group: 3, groupTitle: '윈도우 절',
    question: '급여 기준 5행 이동 합계(이전 4행 + 현재 행)를 계산하시오.',
    sql: `SELECT employee_id, last_name, salary,
       SUM(salary) OVER(ORDER BY salary
                        ROWS BETWEEN 4 PRECEDING AND CURRENT ROW) AS moving_sum_5
FROM   employees
ORDER BY salary;`,
    result: '처음 4행은 이용 가능한 행만 합산. 5행부터 5행 이동 합계.',
    keyPoint: 'ROWS BETWEEN 4 PRECEDING AND CURRENT ROW: 현재 행 포함 최대 5행 합산.',
  },
  {
    id: 1314, group: 3, groupTitle: '윈도우 절',
    question: '각 직원 기준 이전 1행, 현재 행, 이후 1행의 급여 합계를 계산하시오.',
    sql: `SELECT employee_id, last_name, salary,
       SUM(salary) OVER(ORDER BY salary
                        ROWS BETWEEN 1 PRECEDING AND 1 FOLLOWING) AS window_sum
FROM   employees
ORDER BY salary;`,
    result: '첫 행: 현재+다음. 중간 행: 이전+현재+다음(최대 3행). 마지막 행: 이전+현재.',
    keyPoint: 'ROWS BETWEEN 1 PRECEDING AND 1 FOLLOWING: 슬라이딩 윈도우.',
  },
  {
    id: 1315, group: 3, groupTitle: '윈도우 절',
    question: 'ROWS와 RANGE의 차이를 동점 급여 데이터로 확인하시오.',
    sql: `-- 테스트: 동일 급여 직원이 있는 부서 조회
SELECT department_id, salary, COUNT(*) cnt
FROM   employees
GROUP BY department_id, salary
HAVING COUNT(*) > 1
ORDER BY department_id, salary
FETCH FIRST 5 ROWS ONLY;

-- ROWS vs RANGE 비교 (80부서, 급여 오름차순)
SELECT last_name, salary,
       SUM(salary) OVER(PARTITION BY department_id ORDER BY salary
                        ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS rows_sum,
       SUM(salary) OVER(PARTITION BY department_id ORDER BY salary
                        RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS range_sum
FROM   employees
WHERE  department_id = 80
ORDER BY salary;`,
    result: '동점 급여 행에서 ROWS와 RANGE 값이 다름. RANGE는 동점 행 동시 포함.',
    keyPoint: 'ROWS: 물리 행 하나씩. RANGE: 같은 값 전체 포함. 동점 없으면 결과 동일.',
  },
  {
    id: 1316, group: 3, groupTitle: '윈도우 절',
    question: '입사일 기준 누적 평균 급여와 전체 파티션 평균을 비교하시오.',
    sql: `SELECT employee_id, last_name, hire_date, salary,
       ROUND(AVG(salary) OVER(ORDER BY hire_date
                              ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW), 0) AS cum_avg,
       ROUND(AVG(salary) OVER(), 0) AS total_avg
FROM   employees
ORDER BY hire_date;`,
    result: 'cum_avg는 행이 누적될수록 total_avg에 수렴. 초기 입사자 급여 구성 파악.',
    keyPoint: 'ROWS UNBOUNDED PRECEDING TO CURRENT ROW = 누적. OVER() = 전체. 두 값 비교.',
  },

  // ── Group 4: LAG, LEAD, FIRST_VALUE, LAST_VALUE ──────────
  {
    id: 1317, group: 4, groupTitle: 'LAG, LEAD, FIRST/LAST_VALUE',
    question: '각 직원의 급여와 입사일 기준 이전·다음 직원의 급여를 함께 표시하시오.',
    sql: `SELECT employee_id, last_name, hire_date, salary,
       LAG(salary, 1, 0)  OVER(ORDER BY hire_date) AS prev_salary,
       LEAD(salary, 1, 0) OVER(ORDER BY hire_date) AS next_salary
FROM   employees
ORDER BY hire_date;`,
    result: '첫 행: prev_salary=0(기본값). 마지막 행: next_salary=0(기본값).',
    keyPoint: 'LAG(열, 오프셋, 기본값): 이전 행. LEAD: 다음 행. 기본값은 행 없을 때 반환.',
  },
  {
    id: 1318, group: 4, groupTitle: 'LAG, LEAD, FIRST/LAST_VALUE',
    question: '연도별 직원 입사 수를 구하고 전년 대비 증감을 LAG로 계산하시오.',
    sql: `SELECT hire_year,
       cnt,
       LAG(cnt, 1, 0) OVER(ORDER BY hire_year) AS prev_year_cnt,
       cnt - LAG(cnt, 1, 0) OVER(ORDER BY hire_year) AS yoy_diff
FROM (
    SELECT EXTRACT(YEAR FROM hire_date) AS hire_year,
           COUNT(*) AS cnt
    FROM   employees
    GROUP BY EXTRACT(YEAR FROM hire_date)
)
ORDER BY hire_year;`,
    result: '연도별 입사 수와 전년 대비 증감(+면 증가, -면 감소). 첫 연도는 prev=0.',
    keyPoint: 'LAG로 전년도 값을 현재 행에 가져와 차이 계산. 집계 서브쿼리 결과에 분석 함수 적용.',
  },
  {
    id: 1319, group: 4, groupTitle: 'LAG, LEAD, FIRST/LAST_VALUE',
    question: '각 부서에서 현재 직원의 급여와 부서 내 최고·최저 급여를 FIRST/LAST_VALUE로 구하시오.',
    sql: `SELECT employee_id, last_name, department_id, salary,
       FIRST_VALUE(salary) OVER(
           PARTITION BY department_id ORDER BY salary DESC
           ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS dept_max,
       FIRST_VALUE(salary) OVER(
           PARTITION BY department_id ORDER BY salary ASC
           ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS dept_min
FROM   employees
WHERE  department_id IS NOT NULL
ORDER BY department_id, salary DESC;`,
    result: '각 직원 행에 부서 최고 급여(dept_max)와 최저 급여(dept_min) 표시.',
    keyPoint: 'FIRST_VALUE + ORDER BY DESC = 최댓값. ORDER BY ASC = 최솟값. UNBOUNDED FOLLOWING 명시.',
  },
  {
    id: 1320, group: 4, groupTitle: 'LAG, LEAD, FIRST/LAST_VALUE',
    question: 'LAST_VALUE의 기본 윈도우 문제를 UNBOUNDED FOLLOWING으로 해결하시오.',
    sql: `-- 문제: 기본 윈도우로 LAST_VALUE 사용 (각 행마다 다른 결과)
SELECT last_name, department_id, salary,
       LAST_VALUE(salary) OVER(
           PARTITION BY department_id ORDER BY salary) AS wrong_last
FROM   employees WHERE department_id = 60 ORDER BY salary;

-- 해결: UNBOUNDED FOLLOWING 추가
SELECT last_name, department_id, salary,
       LAST_VALUE(salary) OVER(
           PARTITION BY department_id ORDER BY salary
           ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS correct_last
FROM   employees WHERE department_id = 60 ORDER BY salary;`,
    result: 'wrong_last: 행마다 다름. correct_last: 모든 행에 부서 최고 급여 동일하게 표시.',
    keyPoint: 'LAST_VALUE 기본 윈도우 = CURRENT ROW까지. 전체 파티션 마지막 값 = UNBOUNDED FOLLOWING 필요.',
  },
  {
    id: 1321, group: 4, groupTitle: 'LAG, LEAD, FIRST/LAST_VALUE',
    question: 'NTH_VALUE로 부서 내 급여 2위와 3위 값을 각 행에 표시하시오.',
    sql: `SELECT last_name, department_id, salary,
       NTH_VALUE(salary, 2) OVER(
           PARTITION BY department_id ORDER BY salary DESC
           ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS second_sal,
       NTH_VALUE(salary, 3) OVER(
           PARTITION BY department_id ORDER BY salary DESC
           ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS third_sal
FROM   employees
WHERE  department_id IS NOT NULL
ORDER BY department_id, salary DESC;`,
    result: '각 행에 부서 내 급여 2위와 3위 값 표시. 직원 수 < 3이면 third_sal = NULL.',
    keyPoint: 'NTH_VALUE(열, n): n번째 행 값. UNBOUNDED FOLLOWING 없으면 일부 행 NULL 발생.',
  },
  {
    id: 1322, group: 4, groupTitle: 'LAG, LEAD, FIRST/LAST_VALUE',
    question: '부서별 입사 순서로 이전·다음 입사자 이름을 LAG/LEAD로 표시하시오.',
    sql: `SELECT employee_id, last_name, department_id, hire_date,
       LAG(last_name, 1, '(첫 입사)')  OVER(PARTITION BY department_id
                                           ORDER BY hire_date) AS prev_hire,
       LEAD(last_name, 1, '(최근 입사)') OVER(PARTITION BY department_id
                                            ORDER BY hire_date) AS next_hire
FROM   employees
WHERE  department_id IS NOT NULL
ORDER BY department_id, hire_date;`,
    result: '각 직원 기준 같은 부서 내 입사일 기준 앞·뒤 직원 이름 표시.',
    keyPoint: 'PARTITION BY + LAG/LEAD: 파티션 내에서만 이전/다음 행 조회. 기본값으로 문자열 지정 가능.',
  },

  // ── Group 5: 종합 활용 ────────────────────────────────────
  {
    id: 1323, group: 5, groupTitle: '종합 활용',
    question: '각 직원의 급여가 부서 내에서 상위 몇 %인지 계산하시오. (낮을수록 높은 순위)',
    sql: `SELECT employee_id, last_name, department_id, salary,
       ROUND(PERCENT_RANK() OVER(
           PARTITION BY department_id ORDER BY salary DESC) * 100, 1) AS dept_pct_rank
FROM   employees
WHERE  department_id IS NOT NULL
ORDER BY department_id, dept_pct_rank;`,
    result: '부서 내 1위 = 0%, 꼴찌 = 100%. salary DESC 기준 PERCENT_RANK.',
    keyPoint: 'PARTITION BY + PERCENT_RANK + ORDER BY DESC: 부서 내 상위 백분위 순위.',
  },
  {
    id: 1324, group: 5, groupTitle: '종합 활용',
    question: '급여가 부서 평균보다 20% 이상 높은 직원을 분석 함수를 활용하여 조회하시오.',
    sql: `SELECT employee_id, last_name, department_id, salary, dept_avg, diff_pct
FROM (
    SELECT employee_id, last_name, department_id, salary,
           ROUND(AVG(salary) OVER(PARTITION BY department_id), 0) AS dept_avg,
           ROUND((salary / AVG(salary) OVER(PARTITION BY department_id) - 1) * 100, 1) AS diff_pct
    FROM   employees
    WHERE  department_id IS NOT NULL
)
WHERE diff_pct >= 20
ORDER BY diff_pct DESC;`,
    result: '부서 평균보다 20% 이상 높은 급여를 받는 직원 목록 출력.',
    keyPoint: '분석 함수 결과 필터링 = 서브쿼리 필수. diff_pct = (salary/avg - 1) * 100.',
  },
  {
    id: 1325, group: 5, groupTitle: '종합 활용',
    question: '부서별 급여를 ROW_NUMBER + PIVOT 패턴으로 상위 3위까지 한 행에 표시하시오.',
    sql: `SELECT department_id,
       MAX(CASE WHEN rn = 1 THEN salary END) AS "1위_급여",
       MAX(CASE WHEN rn = 2 THEN salary END) AS "2위_급여",
       MAX(CASE WHEN rn = 3 THEN salary END) AS "3위_급여"
FROM (
    SELECT department_id, salary,
           ROW_NUMBER() OVER(PARTITION BY department_id
                             ORDER BY salary DESC) AS rn
    FROM   employees
    WHERE  department_id IS NOT NULL
)
WHERE rn <= 3
GROUP BY department_id
ORDER BY department_id;`,
    result: '부서별 급여 상위 1~3위를 각각 다른 열로 표시.',
    keyPoint: 'ROW_NUMBER + CASE WHEN PIVOT 패턴. 직원 수 < 3인 부서는 NULL 표시.',
  },
  {
    id: 1326, group: 5, groupTitle: '종합 활용',
    question: '직원별 급여와 전체 누적 급여 비율을 계산하고, 누적 비율 80% 이내 직원을 조회하시오.',
    sql: `SELECT employee_id, last_name, salary, cum_pct
FROM (
    SELECT employee_id, last_name, salary,
           ROUND(SUM(salary) OVER(ORDER BY salary DESC
                                  ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)
                 / SUM(salary) OVER() * 100, 1) AS cum_pct
    FROM   employees
)
WHERE cum_pct <= 80
ORDER BY salary DESC;`,
    result: '급여 높은 직원부터 누적 비율이 80%에 도달하는 직원까지 표시.',
    keyPoint: '누적합 / 전체합 * 100 = 누적 비율. 파레토 분석(상위 20% 직원이 전체 80% 급여) 확인.',
  },
  {
    id: 1327, group: 5, groupTitle: '종합 활용',
    question: '부서별 매니저의 급여와 부서 내 최고 급여 차이를 분석하시오.',
    sql: `SELECT e.department_id,
       m.last_name AS manager_name, m.salary AS manager_sal,
       dept_max.max_sal AS dept_max_sal,
       dept_max.max_sal - m.salary AS gap
FROM   employees e
JOIN   employees m ON e.manager_id = m.employee_id
JOIN (
    SELECT department_id,
           MAX(salary) AS max_sal
    FROM   employees
    WHERE  department_id IS NOT NULL
    GROUP BY department_id
) dept_max ON e.department_id = dept_max.department_id
WHERE  e.department_id IS NOT NULL
GROUP BY e.department_id, m.last_name, m.salary, dept_max.max_sal
ORDER BY gap DESC;`,
    result: '부서별 매니저 급여와 부서 최고 급여의 차이 출력.',
    keyPoint: '분석 함수와 JOIN 결합 패턴. 매니저-부하 간 급여 격차 분석.',
  },
  {
    id: 1328, group: 5, groupTitle: '종합 활용',
    question: '전체 급여 분포를 10개 버킷으로 나누어 각 버킷의 인원수와 평균 급여를 구하시오.',
    sql: `SELECT bucket,
       COUNT(*)              AS cnt,
       MIN(salary)           AS min_sal,
       MAX(salary)           AS max_sal,
       ROUND(AVG(salary), 0) AS avg_sal
FROM (
    SELECT salary,
           NTILE(10) OVER(ORDER BY salary) AS bucket
    FROM   employees
)
GROUP BY bucket
ORDER BY bucket;`,
    result: '1~10 버킷별 인원수, 최소/최대/평균 급여. 급여 분포 히스토그램 구성.',
    keyPoint: 'NTILE(10): 10분위 분포 분석. 버킷별 집계로 급여 분포 파악.',
  },
]
