import type { PracticeProblem } from '@/lib/types'

export const ch24Practice: PracticeProblem[] = [
  { id:1, group:1, groupTitle:'REGEXP_LIKE — 패턴 필터링',
    question:'employees 테이블에서 first_name이 모음(A,E,I,O,U)으로 시작하는 직원을 조회하시오.',
    sql:`SELECT employee_id, first_name, last_name
FROM   employees
WHERE  REGEXP_LIKE(first_name, '^[AEIOU]', 'i')
ORDER BY first_name;`,
    result:`EMPLOYEE_ID  FIRST_NAME  LAST_NAME
-----------  ----------  ----------
174          Ellen       Abel
166          Sundar      Ande`,
    keyPoint:"^[AEIOU]: 시작(^) 앵커 + 모음 집합. 'i' 옵션으로 소문자 모음도 일치." },

  { id:2, group:1, groupTitle:'REGEXP_LIKE — 패턴 필터링',
    question:'last_name에 연속된 같은 문자(예: hh, nn)가 포함된 직원을 조회하시오.',
    sql:`SELECT employee_id, last_name
FROM   employees
WHERE  REGEXP_LIKE(last_name, '(.)\\1', 'i')
ORDER BY last_name;`,
    keyPoint:'(.) 임의 문자 캡처, \\1 역참조 → 같은 문자 연속 2회. 예: Kochhar(hh).' },

  { id:3, group:1, groupTitle:'REGEXP_LIKE — 패턴 필터링',
    question:'phone_number가 NNN.NNN.NNNN 형식(점 구분)인 직원을 조회하시오.',
    sql:`SELECT employee_id, last_name, phone_number
FROM   employees
WHERE  REGEXP_LIKE(phone_number, '^\\d{3}\\.\\d{3}\\.\\d{4}$')
ORDER BY employee_id;`,
    result:`EMPLOYEE_ID  LAST_NAME  PHONE_NUMBER
-----------  ---------  -------------
100          King       515.123.4567`,
    keyPoint:'\\.: 리터럴 점(메타문자 이스케이프). 국제 번호(+1 650...)는 패턴 불일치.' },

  { id:4, group:1, groupTitle:'REGEXP_LIKE — 패턴 필터링',
    question:'email이 정확히 4~6자의 대문자 알파벳으로만 구성된 직원을 조회하시오.',
    sql:`SELECT employee_id, last_name, email
FROM   employees
WHERE  REGEXP_LIKE(email, '^[A-Z]{4,6}$')
ORDER BY LENGTH(email), email;`,
    keyPoint:'^[A-Z]{4,6}$: 시작~끝이 모두 대문자 4~6자. {n,m}으로 반복 횟수 범위 지정.' },

  { id:5, group:1, groupTitle:'REGEXP_LIKE — 패턴 필터링',
    question:'last_name이 자음으로 시작하고 두 번째 글자가 모음인 직원을 조회하시오.',
    sql:`SELECT employee_id, last_name
FROM   employees
WHERE  REGEXP_LIKE(last_name, '^[^AEIOU][AEIOU]', 'i')
ORDER BY last_name;`,
    keyPoint:'[^AEIOU]: 모음이 아닌 문자(자음). 연속 패턴으로 두 문자 순서 지정.' },

  { id:6, group:2, groupTitle:'REGEXP_INSTR — 위치 찾기',
    question:'전화번호에서 숫자 그룹의 첫·두·세 번째 시작 위치를 각각 조회하시오.',
    sql:`SELECT last_name, phone_number,
       REGEXP_INSTR(phone_number, '[0-9]+', 1, 1) AS first_pos,
       REGEXP_INSTR(phone_number, '[0-9]+', 1, 2) AS second_pos,
       REGEXP_INSTR(phone_number, '[0-9]+', 1, 3) AS third_pos
FROM   employees
WHERE  REGEXP_LIKE(phone_number, '^\\d{3}\\.\\d{3}\\.\\d{4}$')
ORDER BY employee_id FETCH FIRST 5 ROWS ONLY;`,
    result:`LAST_NAME  PHONE_NUMBER   FIRST_POS  SECOND_POS  THIRD_POS
---------  -------------  ---------  ----------  ---------
King       515.123.4567           1           5          9`,
    keyPoint:'515.123.4567 → 1번째 숫자 위치=1, 2번째=5, 3번째=9.' },

  { id:7, group:2, groupTitle:'REGEXP_INSTR — 위치 찾기',
    question:'last_name에서 모음이 처음 나타나는 위치를 조회하시오.',
    sql:`SELECT last_name,
       REGEXP_INSTR(last_name, '[aeiou]', 1, 1, 0, 'i') AS first_vowel_pos
FROM   employees
ORDER BY first_vowel_pos, last_name FETCH FIRST 10 ROWS ONLY;`,
    keyPoint:'5번째 파라미터 0=시작 위치 반환. 모음이 없으면 0 반환.' },

  { id:8, group:2, groupTitle:'REGEXP_INSTR — 위치 찾기',
    question:'last_name에서 두 번째 모음 위치를 조회하시오. 두 번째 모음이 없는 경우 제외.',
    sql:`SELECT last_name,
       REGEXP_INSTR(last_name, '[aeiou]', 1, 2, 0, 'i') AS second_vowel_pos
FROM   employees
WHERE  REGEXP_INSTR(last_name, '[aeiou]', 1, 2, 0, 'i') > 0
ORDER BY second_vowel_pos DESC, last_name FETCH FIRST 10 ROWS ONLY;`,
    keyPoint:'occurrence=2: 두 번째 일치 위치. WHERE > 0으로 두 번째 모음 없는 행 제외.' },

  { id:9, group:2, groupTitle:'REGEXP_INSTR — 위치 찾기',
    question:'first_name + last_name 전체 이름에서 공백 위치를 조회하시오.',
    sql:`SELECT first_name || ' ' || last_name AS full_name,
       REGEXP_INSTR(first_name || ' ' || last_name, '\\s') AS space_pos
FROM   employees
ORDER BY employee_id FETCH FIRST 8 ROWS ONLY;`,
    keyPoint:'\\s: 공백 문자 클래스. space_pos = first_name 길이 + 1.' },

  { id:10, group:3, groupTitle:'REGEXP_SUBSTR — 부분 추출',
    question:'phone_number를 지역번호·국번·번호로 분리하여 조회하시오.',
    sql:`SELECT last_name, phone_number,
       REGEXP_SUBSTR(phone_number, '[0-9]+', 1, 1) AS area_code,
       REGEXP_SUBSTR(phone_number, '[0-9]+', 1, 2) AS exchange,
       REGEXP_SUBSTR(phone_number, '[0-9]+', 1, 3) AS number
FROM   employees
WHERE  REGEXP_LIKE(phone_number, '^\\d{3}\\.\\d{3}\\.\\d{4}$')
ORDER BY employee_id FETCH FIRST 5 ROWS ONLY;`,
    result:`LAST_NAME  AREA_CODE  EXCHANGE  NUMBER
---------  ---------  --------  ------
King       515        123       4567`,
    keyPoint:'occurrence=1,2,3으로 각 숫자 그룹을 개별 추출.' },

  { id:11, group:3, groupTitle:'REGEXP_SUBSTR — 부분 추출',
    question:'first_name의 첫 글자(이니셜)를 추출하시오.',
    sql:`SELECT first_name, last_name,
       REGEXP_SUBSTR(first_name, '^[A-Za-z]') || '.' AS initial
FROM   employees
ORDER BY last_name FETCH FIRST 10 ROWS ONLY;`,
    keyPoint:'^[A-Za-z]: 시작 위치의 알파벳 한 글자. || .으로 점 추가.' },

  { id:12, group:3, groupTitle:'REGEXP_SUBSTR — 부분 추출',
    question:'last_name의 마지막 글자를 추출하시오.',
    sql:`SELECT last_name,
       REGEXP_SUBSTR(last_name, '[A-Za-z]$') AS last_char
FROM   employees
ORDER BY last_char, last_name FETCH FIRST 10 ROWS ONLY;`,
    keyPoint:'[A-Za-z]$: 끝($) 앵커 바로 앞 알파벳 한 글자.' },

  { id:13, group:3, groupTitle:'REGEXP_SUBSTR — 부분 추출',
    question:'last_name에서 두 번째 모음 문자를 추출하시오. 없으면 NULL 표시.',
    sql:`SELECT last_name,
       REGEXP_SUBSTR(last_name, '[aeiou]', 1, 2, 'i') AS second_vowel
FROM   employees
ORDER BY second_vowel NULLS LAST, last_name FETCH FIRST 10 ROWS ONLY;`,
    keyPoint:'두 번째 모음 없으면 NULL 반환. NULLS LAST로 정렬 말미 배치.' },

  { id:14, group:3, groupTitle:'REGEXP_SUBSTR — 부분 추출',
    question:'job_id에서 언더스코어(_) 앞 직군 코드와 뒤 역할 코드를 분리하시오.',
    sql:`SELECT job_id,
       REGEXP_SUBSTR(job_id, '^[A-Z]+') AS dept_code,
       REGEXP_SUBSTR(job_id, '[A-Z]+$') AS role_code
FROM   employees
GROUP BY job_id ORDER BY job_id;`,
    result:`JOB_ID    DEPT_CODE  ROLE_CODE
--------  ---------  ---------
IT_PROG   IT         PROG
SA_REP    SA         REP`,
    keyPoint:'^[A-Z]+: 언더스코어 전 대문자. [A-Z]+$: 언더스코어 후 대문자.' },

  { id:15, group:4, groupTitle:'REGEXP_REPLACE — 패턴 치환',
    question:'phone_number의 점(.)을 하이픈(-)으로 변환하시오.',
    sql:`SELECT last_name, phone_number,
       REGEXP_REPLACE(phone_number, '\\.', '-') AS formatted
FROM   employees
WHERE  REGEXP_LIKE(phone_number, '^\\d{3}\\.\\d{3}\\.\\d{4}$')
ORDER BY employee_id FETCH FIRST 5 ROWS ONLY;`,
    result:`LAST_NAME  PHONE_NUMBER   FORMATTED
---------  -------------  -------------
King       515.123.4567   515-123-4567`,
    keyPoint:'occurrence=0(기본): 모든 일치 치환. \\.: 리터럴 점.' },

  { id:16, group:4, groupTitle:'REGEXP_REPLACE — 패턴 치환',
    question:'last_name + first_name을 이름 성 순서로 변환하시오.',
    sql:`SELECT last_name || ' ' || first_name AS original,
       REGEXP_REPLACE(
           last_name || ' ' || first_name,
           '^(\\S+)\\s+(\\S+)$', '\\2 \\1'
       ) AS swapped
FROM   employees ORDER BY employee_id FETCH FIRST 5 ROWS ONLY;`,
    result:`ORIGINAL       SWAPPED
-------------  -------------
King Steven    Steven King`,
    keyPoint:'(\\S+): 비공백 그룹 캡처. \\2 \\1: 두 번째·첫 번째 그룹으로 순서 교환.' },

  { id:17, group:4, groupTitle:'REGEXP_REPLACE — 패턴 치환',
    question:'phone_number를 (NNN) NNN-NNNN 형식으로 변환하시오.',
    sql:`SELECT phone_number,
       REGEXP_REPLACE(
           phone_number,
           '^(\\d{3})\\.(\\d{3})\\.(\\d{4})$',
           '(\\1) \\2-\\3'
       ) AS new_format
FROM   employees
WHERE  REGEXP_LIKE(phone_number, '^\\d{3}\\.\\d{3}\\.\\d{4}$')
ORDER BY employee_id FETCH FIRST 5 ROWS ONLY;`,
    result:`PHONE_NUMBER   NEW_FORMAT
-------------  ---------------
515.123.4567   (515) 123-4567`,
    keyPoint:'3개 그룹 캡처 → (\\1) \\2-\\3 패턴으로 형식 재구성.' },

  { id:18, group:4, groupTitle:'REGEXP_REPLACE — 패턴 치환',
    question:'last_name의 모든 모음을 * 로 치환하시오.',
    sql:`SELECT last_name,
       REGEXP_REPLACE(last_name, '[aeiou]', '*', 1, 0, 'i') AS masked
FROM   employees ORDER BY employee_id FETCH FIRST 10 ROWS ONLY;`,
    result:`LAST_NAME  MASKED
---------  ----------
King       K*ng
Kochhar    K*chh*r`,
    keyPoint:'occurrence=0: 모든 모음 치환. i 옵션: 대소문자 무시.' },

  { id:19, group:4, groupTitle:'REGEXP_REPLACE — 패턴 치환',
    question:'last_name에서 연속된 같은 문자를 하나로 줄이시오.',
    sql:`SELECT last_name,
       REGEXP_REPLACE(last_name, '(.)\\1', '\\1', 1, 0, 'i') AS dedup
FROM   employees
WHERE  REGEXP_LIKE(last_name, '(.)\\1', 'i')
ORDER BY last_name;`,
    result:`LAST_NAME  DEDUP
---------  ------
Kochhar    Kochar`,
    keyPoint:'(.)\\1 일치 → \\1(한 글자)로 치환 = 중복 제거.' },

  { id:20, group:5, groupTitle:'REGEXP_COUNT — 횟수 집계',
    question:'last_name에서 모음(a,e,i,o,u) 개수를 집계하여 많은 순으로 조회하시오.',
    sql:`SELECT last_name,
       REGEXP_COUNT(last_name, '[aeiou]', 1, 'i') AS vowel_count
FROM   employees
ORDER BY vowel_count DESC, last_name
FETCH FIRST 10 ROWS ONLY;`,
    result:`LAST_NAME      VOWEL_COUNT
-------------  -----------
Mikkilineni              4
Livingston               3`,
    keyPoint:"REGEXP_COUNT: Oracle 11g+. 일치 없으면 0 반환." },

  { id:21, group:5, groupTitle:'REGEXP_COUNT — 횟수 집계',
    question:'모음 개수별 직원 수 분포를 조회하시오.',
    sql:`SELECT REGEXP_COUNT(last_name, '[aeiou]', 1, 'i') AS vowel_count,
       COUNT(*) AS emp_count
FROM   employees
GROUP BY REGEXP_COUNT(last_name, '[aeiou]', 1, 'i')
ORDER BY vowel_count;`,
    keyPoint:'GROUP BY에 REGEXP_COUNT 직접 사용 가능.' },

  { id:22, group:5, groupTitle:'REGEXP_COUNT — 횟수 집계',
    question:'phone_number의 숫자 그룹 개수가 3개인 직원을 조회하시오.',
    sql:`SELECT employee_id, last_name, phone_number,
       REGEXP_COUNT(phone_number, '[0-9]+') AS digit_groups
FROM   employees
WHERE  REGEXP_COUNT(phone_number, '[0-9]+') = 3
ORDER BY employee_id FETCH FIRST 8 ROWS ONLY;`,
    keyPoint:'점 구분 형식은 숫자 그룹 3개. 국제 번호는 그룹 수 다름.' },

  { id:23, group:5, groupTitle:'REGEXP_COUNT — 횟수 집계',
    question:'last_name의 자음 개수를 구하여 내림차순 상위 5명을 조회하시오.',
    sql:`SELECT last_name,
       LENGTH(last_name) AS total_len,
       REGEXP_COUNT(last_name, '[aeiou]', 1, 'i') AS vowels,
       LENGTH(last_name) - REGEXP_COUNT(last_name, '[aeiou]', 1, 'i') AS consonants
FROM   employees
ORDER BY consonants DESC, last_name FETCH FIRST 5 ROWS ONLY;`,
    keyPoint:'자음 수 = 전체 길이 - 모음 수.' },

  { id:24, group:6, groupTitle:'종합 실습',
    question:'이메일 유효성 검사 + 길이 분류 + 전체 이메일 생성을 한 쿼리로 조회하시오.',
    sql:`SELECT employee_id, last_name, email,
       CASE WHEN REGEXP_LIKE(email, '^[A-Z]+$')
            THEN LOWER(email) || '@oracle.com'
            ELSE '이메일 형식 오류'
       END AS full_email,
       CASE WHEN REGEXP_COUNT(email, '[A-Z]') BETWEEN 1 AND 4 THEN '짧음'
            WHEN REGEXP_COUNT(email, '[A-Z]') BETWEEN 5 AND 6 THEN '보통'
            ELSE '김'
       END AS length_category
FROM   employees
ORDER BY length_category, employee_id FETCH FIRST 10 ROWS ONLY;`,
    keyPoint:'REGEXP_LIKE 검증 + LOWER 변환 + REGEXP_COUNT 분류를 단일 쿼리에 통합.' },

  { id:25, group:6, groupTitle:'종합 실습',
    question:'전화번호 형식 변환 + 지역번호·국번·번호 분해를 동시에 조회하시오.',
    sql:`SELECT last_name, phone_number,
       REGEXP_REPLACE(phone_number, '^(\\d{3})\\.(\\d{3})\\.(\\d{4})$', '(\\1) \\2-\\3') AS formatted,
       REGEXP_SUBSTR(phone_number, '[0-9]+', 1, 1) AS area_code,
       REGEXP_SUBSTR(phone_number, '[0-9]+', 1, 2) AS exchange,
       REGEXP_SUBSTR(phone_number, '[0-9]+', 1, 3) AS number
FROM   employees
WHERE  REGEXP_LIKE(phone_number, '^\\d{3}\\.\\d{3}\\.\\d{4}$')
ORDER BY employee_id FETCH FIRST 5 ROWS ONLY;`,
    keyPoint:'REGEXP_REPLACE(형식 변환) + REGEXP_SUBSTR(분해)를 단일 쿼리에서 동시 활용.' },

  { id:26, group:6, groupTitle:'종합 실습',
    question:'last_name 종합 분석 보고서: 길이·모음 수·자음 수·중복 여부·이니셜을 조회하시오.',
    sql:`SELECT employee_id, last_name, first_name,
       LENGTH(last_name) AS name_len,
       REGEXP_COUNT(last_name, '[aeiou]', 1, 'i') AS vowels,
       LENGTH(last_name) - REGEXP_COUNT(last_name, '[aeiou]', 1, 'i') AS consonants,
       CASE WHEN REGEXP_LIKE(last_name, '(.)\\1', 'i') THEN 'Y' ELSE 'N' END AS has_double,
       REGEXP_SUBSTR(first_name, '^[A-Za-z]') || '.'
         || REGEXP_SUBSTR(last_name, '^[A-Za-z]') || '.' AS initials
FROM   employees
ORDER BY vowels DESC, name_len DESC FETCH FIRST 15 ROWS ONLY;`,
    keyPoint:'5가지 정규표현식 함수(REGEXP_COUNT, REGEXP_LIKE, REGEXP_SUBSTR)를 단일 쿼리에 통합.' },

  { id:27, group:6, groupTitle:'종합 실습',
    question:'job_id 직군 코드별 직원 수·평균 급여·최대 급여를 집계하시오.',
    sql:`SELECT REGEXP_SUBSTR(job_id, '^[A-Z]+') AS dept_code,
       COUNT(*) AS emp_count,
       ROUND(AVG(salary), 0) AS avg_salary,
       MAX(salary) AS max_salary
FROM   employees
GROUP BY REGEXP_SUBSTR(job_id, '^[A-Z]+')
ORDER BY avg_salary DESC;`,
    keyPoint:'REGEXP_SUBSTR로 추출한 값을 GROUP BY에 직접 사용.' },

  { id:28, group:6, groupTitle:'종합 실습',
    question:'이름 약식 표시(성, 이니셜.) + 모음 마스킹 + 모음 3개 이상 플래그를 조회하시오.',
    sql:`SELECT last_name, first_name,
       last_name || ', ' || REGEXP_SUBSTR(first_name, '^[A-Za-z]') || '.' AS abbrev_name,
       REGEXP_REPLACE(last_name, '[aeiou]', '*', 1, 0, 'i') AS masked_name,
       REGEXP_COUNT(last_name, '[aeiou]', 1, 'i') AS vowel_count,
       CASE WHEN REGEXP_COUNT(last_name, '[aeiou]', 1, 'i') >= 3
            THEN '★ 모음 많음' ELSE '' END AS flag
FROM   employees
ORDER BY vowel_count DESC, last_name FETCH FIRST 15 ROWS ONLY;`,
    keyPoint:'REGEXP_SUBSTR(이니셜) + REGEXP_REPLACE(마스킹) + REGEXP_COUNT(집계) 통합 쿼리.' },
]
