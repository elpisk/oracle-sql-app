import type { QuizQuestion } from '@/lib/types'

export const ch22Quiz: QuizQuestion[] = [
  // ── 하(기초) 1~20 ──────────────────────────────────────────────
  { id:2201, level:'basic', question:'서브쿼리를 FROM 절에 사용하는 경우를 무엇이라 부르는가?', options:['스칼라 서브쿼리','인라인 뷰','상관 서브쿼리','중첩 서브쿼리'], correctAnswer:1, explanation:'FROM 절의 서브쿼리는 인라인 뷰(Inline View)라 하며 임시 테이블처럼 활용됩니다.' },
  { id:2202, level:'basic', question:'스칼라 서브쿼리가 위치하는 절은?', options:['WHERE','FROM','SELECT','GROUP BY'], correctAnswer:2, explanation:'스칼라 서브쿼리는 SELECT 절에 위치하여 행마다 단일 값을 반환합니다.' },
  { id:2203, level:'basic', question:'EXISTS 연산자가 반환하는 값은?', options:['행 집합','TRUE 또는 FALSE','숫자','NULL'], correctAnswer:1, explanation:'EXISTS는 서브쿼리 결과 행이 하나라도 있으면 TRUE, 없으면 FALSE를 반환합니다.' },
  { id:2204, level:'basic', question:'WITH 절의 다른 이름은?', options:['인라인 뷰','파티션 뷰','공통 테이블 표현식 (CTE)','머티리얼라이즈드 뷰'], correctAnswer:2, explanation:'WITH 절은 Common Table Expression(CTE)이라고도 하며, 쿼리 내 임시 결과를 정의합니다.' },
  { id:2205, level:'basic', question:'상관 서브쿼리와 일반 서브쿼리의 차이점은?', options:['실행 횟수','외부 쿼리 컬럼 참조 여부','반환 행 수','위치'], correctAnswer:1, explanation:'상관 서브쿼리는 외부 쿼리의 컬럼을 참조하며, 외부 쿼리 행마다 한 번씩 실행됩니다.' },
  { id:2206, level:'basic', question:'스칼라 서브쿼리가 여러 행을 반환하면 어떻게 되는가?', options:['첫 번째 행 반환','오류 발생','NULL 반환','전체 행 반환'], correctAnswer:1, explanation:'스칼라 서브쿼리는 반드시 단일 행 · 단일 값을 반환해야 하며, 여러 행이면 ORA-01427 오류가 발생합니다.' },
  { id:2207, level:'basic', question:'인라인 뷰에 반드시 필요한 것은?', options:['WHERE 절','ORDER BY 절','별칭(Alias)','GROUP BY 절'], correctAnswer:2, explanation:'인라인 뷰는 FROM 절에서 사용되므로 테이블처럼 참조할 수 있도록 별칭이 필수입니다.' },
  { id:2208, level:'basic', question:'NOT EXISTS의 동작 방식은?', options:['서브쿼리 결과가 없을 때 TRUE','서브쿼리 결과가 있을 때 TRUE','항상 FALSE','NULL 반환'], correctAnswer:0, explanation:'NOT EXISTS는 서브쿼리 결과가 없을 때 TRUE를 반환합니다.' },
  { id:2209, level:'basic', question:'WITH 절에서 여러 CTE를 정의할 때 구분자는?', options:['세미콜론(;)','콤마(,)','AND','OR'], correctAnswer:1, explanation:'WITH 절에서 여러 CTE는 콤마(,)로 구분하여 연속으로 정의합니다.' },
  { id:2210, level:'basic', question:'다음 중 서브쿼리를 사용할 수 없는 절은?', options:['SELECT','WHERE','FROM','GROUP BY 함수 내'], correctAnswer:3, explanation:'GROUP BY 절의 컬럼 표현식에는 서브쿼리를 직접 사용할 수 없습니다.' },
  { id:2211, level:'basic', question:'인라인 뷰 안에서 외부 쿼리의 컬럼을 참조할 수 있는가?', options:['가능','불가능','조건에 따라 다름','설정에 따라 다름'], correctAnswer:1, explanation:'일반 인라인 뷰는 외부 쿼리를 참조할 수 없습니다. 외부 참조가 필요하면 상관 서브쿼리를 사용합니다.' },
  { id:2212, level:'basic', question:'EXISTS vs IN 에서 NULL 처리가 안전한 것은?', options:['IN','EXISTS','둘 다 안전','둘 다 위험'], correctAnswer:1, explanation:'IN은 NULL 값이 포함되면 예상치 않은 결과를 낼 수 있지만, EXISTS는 NULL에 영향을 받지 않습니다.' },
  { id:2213, level:'basic', question:'WITH 절에서 정의한 CTE는 어디서 참조할 수 있는가?', options:['다른 CTE와 메인 쿼리','메인 쿼리에서만','다른 WITH 절에서만','어디서나'], correctAnswer:0, explanation:'뒤에 오는 다른 CTE와 메인 쿼리 모두에서 참조할 수 있습니다.' },
  { id:2214, level:'basic', question:'서브쿼리 내에서 ORDER BY를 사용하려면 무엇이 필요한가?', options:['ROWNUM 조건','FETCH FIRST 절','WHERE 절','GROUP BY 절'], correctAnswer:1, explanation:'서브쿼리 내 ORDER BY는 단독으로 사용할 수 없으며, FETCH FIRST 등 행 제한 절이 함께 있어야 합니다.' },
  { id:2215, level:'basic', question:'쌍 비교(Pairwise) 서브쿼리에서 비교하는 방식은?', options:['컬럼을 각각 독립적으로 비교','두 컬럼을 쌍으로 동시에 비교','첫 번째 컬럼만 비교','랜덤하게 비교'], correctAnswer:1, explanation:'쌍 비교는 (col1, col2) IN (SELECT col1, col2 ...) 형태로 두 컬럼을 쌍으로 동시에 비교합니다.' },
  { id:2216, level:'basic', question:'스칼라 서브쿼리가 NULL을 반환하면 어떻게 처리되는가?', options:['오류 발생','0으로 대체','NULL로 유지','빈 문자열'], correctAnswer:2, explanation:'스칼라 서브쿼리가 행을 반환하지 않으면 NULL이 반환되며 NULL로 유지됩니다.' },
  { id:2217, level:'basic', question:'인라인 뷰를 사용하는 주된 이점은?', options:['속도 향상','복잡한 집계 후 외부 필터링 가능','트랜잭션 관리','테이블 생성'], correctAnswer:1, explanation:'인라인 뷰로 복잡한 집계나 윈도우 함수를 먼저 계산한 뒤 외부에서 단순 필터링이 가능합니다.' },
  { id:2218, level:'basic', question:'WITH 절의 재귀 CTE는 어떤 키워드를 사용하는가?', options:['LOOP','RECURSIVE','CONNECT BY','CYCLE'], correctAnswer:1, explanation:'표준 SQL의 재귀 CTE는 WITH RECURSIVE를 사용합니다. Oracle에서는 CONNECT BY 또는 표준 재귀 CTE 모두 사용 가능합니다.' },
  { id:2219, level:'basic', question:'상관 서브쿼리의 단점은?', options:['구문이 복잡','외부 행마다 반복 실행으로 성능 저하 가능','NULL 처리 불가','ORDER BY 사용 불가'], correctAnswer:1, explanation:'상관 서브쿼리는 외부 쿼리 행마다 한 번씩 실행되므로 대용량 데이터에서 성능 저하가 발생할 수 있습니다.' },
  { id:2220, level:'basic', question:"다음 SQL에서 서브쿼리의 종류는?\nSELECT (SELECT COUNT(*) FROM employees) AS cnt FROM dual;", options:['인라인 뷰','스칼라 서브쿼리','상관 서브쿼리','다중 행 서브쿼리'], correctAnswer:1, explanation:'SELECT 절에 있으며 단일 값을 반환하므로 스칼라 서브쿼리입니다.' },

  // ── 중(응용) 21~36 ──────────────────────────────────────────────
  { id:2221, level:'intermediate', question:'다음 SQL의 결과는?\nSELECT last_name FROM employees e\nWHERE EXISTS (SELECT 1 FROM employees m WHERE m.employee_id = e.manager_id AND m.salary > 15000);', options:['급여 15000 초과 관리자의 모든 직원','관리자 급여가 15000 초과인 직원','급여 15000 초과인 모든 직원','관리자가 없는 직원'], correctAnswer:1, explanation:'EXISTS 서브쿼리에서 자신의 manager_id에 해당하는 관리자 급여 > 15000인 직원을 반환합니다.' },
  { id:2222, level:'intermediate', question:'WITH 절에서 두 번째 CTE가 첫 번째 CTE를 참조할 수 있는가?', options:['불가','가능','메인 쿼리에서만','별칭이 없으면 불가'], correctAnswer:1, explanation:'WITH 절에서 나중에 정의된 CTE는 앞서 정의된 CTE를 참조할 수 있습니다.' },
  { id:2223, level:'intermediate', question:"인라인 뷰에서 ROWNUM을 사용하여 상위 N행을 가져올 때 올바른 방법은?", code:`SELECT * FROM (
  SELECT last_name, salary
  FROM   employees
  ORDER BY salary DESC
) WHERE ROWNUM <= 5;`, options:['정상 동작 - 급여 상위 5명','오류 발생','결과 없음','랜덤 5명'], correctAnswer:0, explanation:'인라인 뷰 내에서 ORDER BY로 정렬 후 외부에서 ROWNUM으로 상위 N행을 가져오는 올바른 패턴입니다.' },
  { id:2224, level:'intermediate', question:'다중 컬럼 서브쿼리에서 (department_id, job_id) IN (...) 구문의 의미는?', options:['두 조건 중 하나만 만족','두 조건을 동시에 만족하는 쌍','department_id만 비교','job_id만 비교'], correctAnswer:1, explanation:'쌍 비교로 department_id와 job_id가 동시에 일치하는 행만 선택합니다.' },
  { id:2225, level:'intermediate', question:'스칼라 서브쿼리가 성능 문제를 일으킬 때 대체 방법은?', options:['NOT EXISTS','LEFT JOIN + GROUP BY','UNION ALL','WITH 절'], correctAnswer:1, explanation:'행마다 실행되는 스칼라 서브쿼리는 LEFT JOIN과 집계 함수로 변환하면 성능이 개선되는 경우가 많습니다.' },
  { id:2226, level:'intermediate', question:'다음 중 WITH 절을 사용하는 주된 이유가 아닌 것은?', options:['동일 서브쿼리 반복 제거','가독성 향상','트랜잭션 처리','재귀 쿼리 지원'], correctAnswer:2, explanation:'WITH 절은 트랜잭션 처리와는 무관합니다.' },
  { id:2227, level:'intermediate', question:'EXISTS와 IN 중 서브쿼리 결과가 많을 때 일반적으로 성능이 좋은 것은?', options:['IN','EXISTS','동일','경우에 따라 다름'], correctAnswer:1, explanation:'결과 집합이 클 때 EXISTS는 첫 번째 일치 행을 찾으면 즉시 TRUE를 반환하므로 IN보다 빠른 경우가 많습니다.' },
  { id:2228, level:'intermediate', question:'인라인 뷰 내에서 윈도우 함수(RANK, ROW_NUMBER 등)를 사용할 수 있는가?', options:['불가','가능','Oracle 19c에서만 가능','특수 권한 필요'], correctAnswer:1, explanation:'인라인 뷰 안에서 윈도우 함수를 계산하고 외부 쿼리에서 결과를 필터링하는 패턴이 많이 사용됩니다.' },
  { id:2229, level:'intermediate', question:'NOT IN에서 서브쿼리 결과에 NULL이 포함되면?', options:['NULL 제외 후 비교','항상 행 없음 반환','오류 발생','NULL을 0으로 처리'], correctAnswer:1, explanation:'NOT IN 서브쿼리 결과에 NULL이 있으면 전체 결과가 빈 집합이 됩니다. 이 때문에 NOT EXISTS를 권장합니다.' },
  { id:2230, level:'intermediate', question:'WITH 절에서 정의된 CTE는 DML(INSERT/UPDATE/DELETE)에도 사용 가능한가?', options:['SELECT에서만','INSERT에서도 가능','UPDATE에서도 가능','모든 DML에서 사용 가능'], correctAnswer:3, explanation:'Oracle에서 CTE는 SELECT뿐 아니라 INSERT, UPDATE, DELETE, MERGE 문에서도 사용 가능합니다.' },
  { id:2231, level:'intermediate', question:'다음 중 비쌍 비교(Non-pairwise)의 특징은?', options:['두 컬럼을 쌍으로 비교','각 컬럼을 독립적으로 비교','NULL 처리가 쉬움','성능이 더 좋음'], correctAnswer:1, explanation:'비쌍 비교는 각 컬럼을 별도 서브쿼리로 독립 비교하므로, 두 조건의 교집합이 아닌 각각의 합집합 개념입니다.' },
  { id:2232, level:'intermediate', question:'스칼라 서브쿼리에서 상관 관계(correlated)를 사용하면 어떻게 실행되는가?', options:['한 번만 실행','외부 쿼리 행마다 실행','NULL 반환','오류 발생'], correctAnswer:1, explanation:'상관 스칼라 서브쿼리는 외부 쿼리 행마다 외부 값을 참조하여 실행됩니다.' },
  { id:2233, level:'intermediate', question:'인라인 뷰에서 DISTINCT를 사용할 수 있는가?', options:['불가','가능','GROUP BY 대신에만','ORDER BY와 함께만'], correctAnswer:1, explanation:'인라인 뷰 내에서 DISTINCT를 포함한 모든 SELECT 구문을 사용할 수 있습니다.' },
  { id:2234, level:'intermediate', question:'다음 SQL에서 오류가 발생하는 이유는?\nSELECT (SELECT salary, job_id FROM employees WHERE employee_id = 100) FROM dual;', options:['FROM dual 문법 오류','스칼라 서브쿼리가 2개 컬럼을 반환','employee_id 조건 오류','WHERE 절 누락'], correctAnswer:1, explanation:'스칼라 서브쿼리는 단일 컬럼만 반환해야 합니다. salary, job_id 두 컬럼을 반환하므로 오류입니다.' },
  { id:2235, level:'intermediate', question:'WITH cte AS (SELECT ...) 에서 cte를 메인 쿼리에서 두 번 참조하면?', options:['오류 발생','두 번 모두 정상 참조 가능','두 번째 참조 무시','성능 자동 최적화'], correctAnswer:1, explanation:'CTE는 여러 번 참조 가능하며, 옵티마이저가 반복 계산을 최적화할 수 있습니다.' },
  { id:2236, level:'intermediate', question:'인라인 뷰에 별칭을 주지 않으면?', options:['정상 작동','ORA-00998 오류','NULL 반환','빈 결과'], correctAnswer:1, explanation:'Oracle에서 FROM 절의 인라인 뷰에 별칭이 없으면 ORA-00998 오류가 발생합니다.' },

  // ── 상(심화) 37~50 ──────────────────────────────────────────────
  { id:2237, level:'advanced', question:'WITH 절의 CTE가 여러 번 참조될 때 옵티마이저의 동작은?', options:['항상 여러 번 실행','MATERIALIZE 힌트로 한 번만 계산 강제 가능','자동으로 한 번만 계산','오류 발생'], correctAnswer:1, explanation:'/*+ MATERIALIZE */ 힌트를 사용하면 CTE를 임시 테이블로 materialization하여 한 번만 계산합니다. 기본 동작은 옵티마이저 판단에 따릅니다.' },
  { id:2238, level:'advanced', question:'스칼라 서브쿼리를 JOIN으로 리팩토링할 때 주의할 점은?', options:['결과 행 수 차이','NULL 처리 차이','그룹 함수 적용 방식','위 모두'], correctAnswer:3, explanation:'스칼라→JOIN 변환 시 결과 행 수 변화(OUTER JOIN 필요), NULL 처리, 집계 함수 위치 등을 모두 고려해야 합니다.' },
  { id:2239, level:'advanced', question:"다음 패턴의 목적은?\nSELECT * FROM (SELECT ..., ROW_NUMBER() OVER (PARTITION BY dept ORDER BY salary DESC) rn FROM employees) WHERE rn = 1;", options:['부서별 최고 급여자 1명 추출','전체 최고 급여자','부서별 최저 급여자','중복 행 제거'], correctAnswer:0, explanation:'ROW_NUMBER()를 인라인 뷰에서 계산하고 외부에서 rn=1 필터링으로 각 파티션(부서)에서 1위를 추출합니다.' },
  { id:2240, level:'advanced', question:'EXISTS와 JOIN의 차이에서 EXISTS가 유리한 경우는?', options:['결과에 오른쪽 테이블 컬럼이 필요할 때','단순히 존재 여부만 확인할 때','집계 함수 사용 시','카테시안 곱 생성 시'], correctAnswer:1, explanation:'결과 집합에 관련 테이블 컬럼이 필요 없이 존재 여부만 확인할 때 EXISTS가 JOIN보다 효율적입니다.' },
  { id:2241, level:'advanced', question:'재귀 CTE(WITH RECURSIVE)를 Oracle CONNECT BY로 변환할 때 매핑 관계로 올바른 것은?', options:['RECURSIVE → START WITH','앵커 쿼리 → START WITH, 재귀 쿼리 → CONNECT BY','재귀 쿼리 → START WITH','CYCLE → NOCYCLE'], correctAnswer:1, explanation:'재귀 CTE의 앵커 멤버는 START WITH, 재귀 멤버는 CONNECT BY PRIOR로 매핑됩니다.' },
  { id:2242, level:'advanced', question:'다중 CTE에서 순환 참조(A→B→A)가 발생하면?', options:['자동 해결','컴파일 오류 발생','무한 실행','NULL 반환'], correctAnswer:1, explanation:'WITH 절에서 CTE 간 순환 참조는 SQL 파싱 단계에서 오류로 처리됩니다.' },
  { id:2243, level:'advanced', question:'인라인 뷰 내에서 ORDER BY를 사용하고 외부에서 ORDER BY를 생략하면?', options:['인라인 뷰 ORDER BY가 유지','정렬 순서 보장 안됨','오류 발생','랜덤 정렬'], correctAnswer:1, explanation:'인라인 뷰의 ORDER BY는 내부 정렬 목적이며, 외부 결과의 정렬 순서는 보장되지 않습니다. 최종 정렬은 외부 ORDER BY로 해야 합니다.' },
  { id:2244, level:'advanced', question:'EXISTS (SELECT 1 ...) 에서 SELECT 1 대신 SELECT * 또는 SELECT col을 써도 결과가 같은가?', options:['같다','다르다','SELECT *만 오류','SELECT 1만 허용'], correctAnswer:0, explanation:'EXISTS는 서브쿼리 결과의 행 존재 여부만 확인하므로 SELECT 뒤에 무엇을 써도 결과는 동일합니다.' },
  { id:2245, level:'advanced', question:'스칼라 서브쿼리 캐싱(scalar subquery caching)이 동작하는 조건은?', options:['항상 캐싱','입력 값이 동일한 경우 캐시 재사용','외부 쿼리 행 수 < 100','RESULT_CACHE 힌트 사용 시'], correctAnswer:1, explanation:'Oracle 옵티마이저는 스칼라 서브쿼리의 입력 값이 동일하면 이전 결과를 재사용하는 캐싱을 수행합니다.' },
  { id:2246, level:'advanced', question:'WITH 절에서 /*+ INLINE */ 힌트의 효과는?', options:['CTE를 인라인 뷰로 펼쳐서 처리','CTE를 임시 테이블로 materialization','반복 계산 금지','오류 무시'], correctAnswer:0, explanation:'/*+ INLINE */은 MATERIALIZE의 반대로, CTE를 임시 테이블로 구체화하지 않고 매번 인라인으로 전개합니다.' },
  { id:2247, level:'advanced', question:'인라인 뷰에서 MERGE 문의 USING 절로 사용할 때 주의할 점은?', options:['별칭 불필요','조인 조건 중복 가능','유일 키 보장 필요','GROUP BY 필수'], correctAnswer:2, explanation:'MERGE의 USING 절로 사용되는 인라인 뷰는 조인 키가 유일해야 합니다. 중복이 있으면 ORA-30926 오류가 발생합니다.' },
  { id:2248, level:'advanced', question:'비쌍 비교와 쌍 비교의 결과가 달라지는 상황은?', options:['데이터 없을 때','두 컬럼 조합이 실제 데이터에 없지만 각 컬럼은 존재할 때','NULL 포함 시','항상 동일'], correctAnswer:1, explanation:'비쌍 비교는 각 컬럼을 독립적으로 비교하므로, 실제로 존재하지 않는 조합도 통과시킬 수 있습니다.' },
  { id:2249, level:'advanced', question:'CTE를 뷰(VIEW)와 비교할 때 CTE의 한계는?', options:['재사용 불가(해당 쿼리에서만)','성능 저하','NULL 처리 불가','인덱스 사용 불가'], correctAnswer:0, explanation:'CTE는 해당 SQL문 내에서만 유효하며, 다른 세션이나 쿼리에서 재사용할 수 없습니다. 뷰는 영구적으로 재사용 가능합니다.' },
  { id:2250, level:'advanced', question:"다음 패턴이 해결하는 문제는?\nWITH r AS (\n  SELECT 1 AS n FROM dual\n  UNION ALL\n  SELECT n+1 FROM r WHERE n < 10\n)\nSELECT n FROM r;", options:['10개 난수 생성','1~10 연속 숫자 생성','10개 NULL 행 생성','오류 발생'], correctAnswer:1, explanation:'재귀 CTE를 이용하여 앵커(1)에서 시작하여 n+1을 재귀 추가하는 방식으로 1~10 숫자 시퀀스를 생성합니다.' },
]
