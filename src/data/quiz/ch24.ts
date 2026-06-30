import type { QuizQuestion } from '@/lib/types'

export const ch24Quiz: QuizQuestion[] = [
  // ── 하(기초) 1-20 ───────────────────────────────────────────────
  { id:1,  level:'basic', question:'Oracle에서 정규표현식을 지원하기 위해 도입된 버전은?',
    options:['Oracle 8i','Oracle 9i','Oracle 10g','Oracle 11g'], correctAnswer:2,
    explanation:'Oracle 10g에서 POSIX 표준 정규표현식 지원이 처음 도입되었습니다.' },

  { id:2,  level:'basic', question:'정규표현식에서 임의의 한 문자를 나타내는 메타문자는?',
    options:['%','_','.','*'], correctAnswer:2,
    explanation:'.(점)은 줄바꿈을 제외한 임의의 한 문자에 일치합니다. %와 _는 LIKE 연산자의 와일드카드입니다.' },

  { id:3,  level:'basic', question:'정규표현식에서 문자열의 시작을 나타내는 메타문자는?',
    options:['$','^','|','\\'], correctAnswer:1,
    explanation:'^는 문자열(또는 행) 시작 앵커입니다. $는 끝 앵커입니다.' },

  { id:4,  level:'basic', question:'정규표현식에서 앞 문자가 1회 이상 반복됨을 나타내는 메타문자는?',
    options:['*','?','+','.'], correctAnswer:2,
    explanation:'+는 1회 이상, *는 0회 이상, ?는 0회 또는 1회 반복을 나타냅니다.' },

  { id:5,  level:'basic', question:'다음 중 [aeiou]가 의미하는 것은?',
    options:['문자열 "aeiou"와 정확히 일치','a, e, i, o, u 중 하나의 문자','a부터 u까지의 범위','a, e, i, o, u 모두 포함'],
    correctAnswer:1, explanation:'[...] 문자 집합은 나열된 문자 중 하나와 일치합니다. a~u 범위는 [a-u]로 표현합니다.' },

  { id:6,  level:'basic', question:'REGEXP_LIKE의 반환값 형태는?',
    options:['숫자','문자열','TRUE 또는 FALSE','NULL'], correctAnswer:2,
    explanation:'REGEXP_LIKE는 조건 함수로 TRUE/FALSE를 반환하며 WHERE/HAVING 절에서 사용합니다.' },

  { id:7,  level:'basic', question:'REGEXP_INSTR 함수가 패턴과 일치하지 않을 때 반환하는 값은?',
    options:['-1','NULL','0','1'], correctAnswer:2,
    explanation:'REGEXP_INSTR는 일치 없을 때 0을 반환합니다. INSTR 함수와 동일한 동작입니다.' },

  { id:8,  level:'basic', question:'REGEXP_SUBSTR 함수가 패턴과 일치하지 않을 때 반환하는 값은?',
    options:['0','-1','빈 문자열(\'\')','NULL'], correctAnswer:3,
    explanation:'REGEXP_SUBSTR는 일치 없을 때 NULL을 반환합니다. REGEXP_INSTR(0 반환)와 다릅니다.' },

  { id:9,  level:'basic', question:'match_param에서 대소문자를 무시하도록 설정하는 옵션은?',
    options:['c','i','n','m'], correctAnswer:1,
    explanation:"'i' = case-insensitive(대소문자 무시), 'c' = case-sensitive(기본값)입니다." },

  { id:10, level:'basic', question:'POSIX 문자 클래스 [:digit:]는 다음 중 무엇과 동일한가?',
    options:['[a-z]','[A-Z]','[0-9]','[a-zA-Z]'], correctAnswer:2,
    explanation:'[:digit:]는 [0-9]와 동일한 POSIX 숫자 클래스입니다. [[:digit:]]처럼 이중 대괄호로 사용합니다.' },

  { id:11, level:'basic', question:'정규표현식 {3}이 의미하는 것은?',
    options:['최소 3회 반복','정확히 3회 반복','최대 3회 반복','3회 미만 반복'], correctAnswer:1,
    explanation:'{n}은 정확히 n회 반복, {n,}은 n회 이상, {n,m}은 n~m회 반복을 의미합니다.' },

  { id:12, level:'basic', question:'REGEXP_REPLACE 함수의 역참조에 사용하는 표기법은?',
    options:['$1, $2','%1, %2','\\1, \\2','&1, &2'], correctAnswer:2,
    explanation:'Oracle 정규표현식에서 역참조는 \\1, \\2를 사용합니다. JavaScript나 Python의 $1과 다릅니다.' },

  { id:13, level:'basic', question:'REGEXP_COUNT 함수가 추가된 Oracle 버전은?',
    options:['Oracle 9i','Oracle 10g','Oracle 11g','Oracle 12c'], correctAnswer:2,
    explanation:'REGEXP_COUNT는 Oracle 11g에서 추가되었습니다. 나머지 4개 함수는 Oracle 10g에서 도입되었습니다.' },

  { id:14, level:'basic', question:'정규표현식 [^0-9]가 의미하는 것은?',
    options:['0~9 사이의 숫자 한 개','숫자가 아닌 문자 한 개','0부터 9까지 범위 밖','0 또는 9'], correctAnswer:1,
    explanation:'[^...]는 부정 문자 집합으로, 대괄호 안의 문자가 아닌 한 문자에 일치합니다.' },

  { id:15, level:'basic', question:'REGEXP_LIKE는 SQL 문의 어느 절에서 주로 사용되는가?',
    options:['SELECT','FROM','WHERE','GROUP BY'], correctAnswer:2,
    explanation:'REGEXP_LIKE는 조건 함수로 WHERE 절과 HAVING 절에서 사용합니다.' },

  { id:16, level:'basic', question:'정규표현식 ^[A-Z]가 의미하는 것은?',
    options:['대문자로 시작하는 문자열','대문자만으로 이루어진 문자열','대문자 A부터 Z','대문자로 끝나는 문자열'], correctAnswer:0,
    explanation:'^는 시작 앵커, [A-Z]는 대문자 한 글자 → "대문자로 시작하는 문자열"을 의미합니다.' },

  { id:17, level:'basic', question:"정규표현식 colou?r에 일치하는 것은?",
    options:["'colour'만","'color'만","'colour'와 'color' 모두","'colouur'도 포함"], correctAnswer:2,
    explanation:"?는 앞 문자(u) 0회 또는 1회 → 'color'(u 없음)와 'colour'(u 1회) 모두 일치합니다." },

  { id:18, level:'basic', question:'REGEXP_INSTR의 return_opt 파라미터 값이 1일 때 반환하는 것은?',
    options:['일치하는 문자열의 시작 위치','일치하는 문자열의 끝 위치 + 1','일치하는 문자열 길이','일치 횟수'], correctAnswer:1,
    explanation:'return_opt=0(기본): 시작 위치, return_opt=1: 끝 위치+1(다음 검색 시작점)을 반환합니다.' },

  { id:19, level:'basic', question:'정규표현식 .+가 일치하는 최소 문자열 길이는?',
    options:['0','1','2','제한 없음'], correctAnswer:1,
    explanation:'.은 임의의 한 문자, +는 1회 이상이므로 최소 1글자의 문자열에 일치합니다.' },

  { id:20, level:'basic', question:"match_param 'm'(다중행 모드)에서 ^과 $의 동작 변화는?",
    options:['각 행의 시작과 끝에도 적용','전체 문자열 시작과 끝에만 적용','^ 과 $를 무시','줄바꿈 문자와 일치'], correctAnswer:0,
    explanation:"'m' 옵션: ^/$ 가 전체 문자열이 아닌 각 줄의 시작/끝에 적용됩니다." },

  // ── 중(응용) 21-36 ───────────────────────────────────────────────
  { id:21, level:'intermediate', question:"다음 SQL의 실행 결과로 맞는 것은?\nSELECT last_name FROM employees WHERE REGEXP_LIKE(first_name, '^[AEIOU]', 'i');",
    options:['last_name이 모음으로 끝나는 직원','last_name이 모음으로 시작하는 직원','last_name에 모음이 포함된 직원','last_name이 모음만으로 구성된 직원'],
    correctAnswer:1, explanation:"^[AEIOU]는 시작(^) 앵커 + 모음 집합. 'i' 옵션으로 소문자 모음도 포함 → first_name이 모음으로 시작하는 직원." },

  { id:22, level:'intermediate', question:"다음 SQL에서 반환되는 값은?\nSELECT REGEXP_INSTR('515.123.4567', '[0-9]+', 1, 2) FROM dual;",
    options:['1','4','5','8'], correctAnswer:2,
    explanation:"'515.123.4567'에서 [0-9]+의 두 번째(occurrence=2) 일치는 '123' → 시작 위치 5." },

  { id:23, level:'intermediate', question:"다음 SQL의 결과는?\nSELECT REGEXP_SUBSTR('Oracle Database 19c', '[A-Za-z]+', 1, 2) FROM dual;",
    options:["'Oracle'","'Database'","'19c'","NULL"], correctAnswer:1,
    explanation:"[A-Za-z]+ 의 두 번째(occurrence=2) 일치 → 'Database'. '19c'는 숫자가 포함되어 제외됩니다." },

  { id:24, level:'intermediate', question:"다음 SQL에서 반환되는 값은?\nSELECT REGEXP_REPLACE('Hello   World', '\\s+', ' ') FROM dual;",
    options:["'Hello World'","'HelloWorld'","'Hello   World'","NULL"], correctAnswer:0,
    explanation:"\\s+는 공백 1개 이상. 3개 연속 공백 → 단일 공백으로 치환 = 'Hello World'." },

  { id:25, level:'intermediate', question:"다음 SQL에서 REGEXP_COUNT의 반환값은?\nSELECT REGEXP_COUNT('Mississippi', 's', 1, 'i') FROM dual;",
    options:['2','4','5','3'], correctAnswer:1,
    explanation:"'Mississippi'에서 's'(대소문자 무시) 개수: s, s, s, s → 4회." },

  { id:26, level:'intermediate', question:"다음 SQL의 결과는?\nSELECT last_name FROM employees WHERE REGEXP_LIKE(email, '^[A-Z]{4,6}$');",
    options:['이메일이 4~6자 소문자로 구성된 직원','이메일이 4~6자 대문자로 구성된 직원','이메일이 정확히 5자 대문자인 직원','이메일이 4~6개 문자(숫자 포함)로 구성된 직원'],
    correctAnswer:1, explanation:"^[A-Z]{4,6}$: 대문자만 4~6자. HR 스키마 email은 대문자 알파벳 전용이므로 해당 직원 반환." },

  { id:27, level:'intermediate', question:"다음 SQL의 결과로 알맞은 것은?\nSELECT REGEXP_REPLACE('King Steven', '^(\\S+)\\s+(\\S+)$', '\\2 \\1') FROM dual;",
    options:["'King Steven'","'Steven King'","'\\2 \\1'","NULL"], correctAnswer:1,
    explanation:"그룹1=King, 그룹2=Steven → '\\2 \\1' = 'Steven King'. 역참조로 이름 순서를 교환합니다." },

  { id:28, level:'intermediate', question:"패턴 \\d{3}\\.\\d{3}\\.\\d{4}와 일치하는 문자열은?",
    options:["'123-456-7890'","'123.456.7890'","'12.34.567'","'ABC.123.4567'"], correctAnswer:1,
    explanation:"\\d{3}: 숫자 3자리, \\.: 리터럴 점 → '123.456.7890'만 일치합니다." },

  { id:29, level:'intermediate', question:"다음 SQL에서 오류가 발생하는 이유는?\nSELECT last_name FROM employees WHERE REGEXP_LIKE(last_name, '[A-Z');",
    options:["대괄호를 닫지 않아 잘못된 패턴","REGEXP_LIKE는 WHERE에 사용 불가","last_name이 정규표현식 지원 안 함","[A-Z]는 유효한 패턴"],
    correctAnswer:0, explanation:"'[A-Z'는 ]로 닫히지 않은 패턴 → ORA-12726: unterminated bracket expression 오류." },

  { id:30, level:'intermediate', question:"다음 SQL에서 반환되는 값은?\nSELECT REGEXP_SUBSTR('abc123def456', '[0-9]+', 1, 1) FROM dual;",
    options:["'abc'","'123'","'def'","'456'"], correctAnswer:1,
    explanation:"[0-9]+ 첫 번째(occurrence=1) 일치 → '123'." },

  { id:31, level:'intermediate', question:"다음 SQL의 결과는?\nSELECT last_name FROM employees WHERE REGEXP_LIKE(last_name, '(.)\\1');",
    options:['last_name에 같은 문자가 2번 연속 나오는 직원','last_name에 문자가 반복되는 직원','last_name 길이가 홀수인 직원','last_name이 두 글자인 직원'],
    correctAnswer:0, explanation:"(.) 임의 문자 캡처, \\1 역참조 → 같은 문자가 연속 2회 등장하는 패턴. 예: Kochhar(hh)." },

  { id:32, level:'intermediate', question:"다음 SQL에서 REGEXP_INSTR의 결과는?\nSELECT REGEXP_INSTR('abcabcabc', 'abc', 1, 3) FROM dual;",
    options:['1','4','7','9'], correctAnswer:2,
    explanation:"'abcabcabc'에서 'abc' 세 번째 일치: 1(1st), 4(2nd), 7(3rd) → 7." },

  { id:33, level:'intermediate', question:"REGEXP_REPLACE로 문자열에서 숫자만 제거하는 올바른 코드는?",
    options:["REGEXP_REPLACE(str, '[0-9]', '')","REGEXP_REPLACE(str, '[^0-9]', '')","REGEXP_REPLACE(str, '[0-9]+', NULL)","REGEXP_REPLACE(str, '\\d', 'X')"],
    correctAnswer:0, explanation:"[0-9]를 ''(빈문자열)로 치환(occurrence=0: 모두) → 모든 숫자 제거. ②는 숫자 아닌 문자 제거입니다." },

  { id:34, level:'intermediate', question:"다음 SQL에서 반환되는 값은?\nSELECT REGEXP_COUNT('aababab', 'ab') FROM dual;",
    options:['2','3','4','1'], correctAnswer:1,
    explanation:"'aababab'에서 'ab' 비겹침 일치: 위치2(ab), 위치4(ab), 위치6(ab) → 3회." },

  { id:35, level:'intermediate', question:"다음 SQL에서 반환되는 값은?\nSELECT REGEXP_SUBSTR('2024-01-15', '(\\d{4})-(\\d{2})-(\\d{2})', 1, 1, NULL, 2) FROM dual;",
    options:["'2024'","'01'","'15'","'2024-01-15'"], correctAnswer:1,
    explanation:"subexpr=2: 두 번째 캡처 그룹 (\\d{2}) = '01'. subexpr=0이면 전체 일치를 반환합니다." },

  { id:36, level:'intermediate', question:"match_param 'i'와 'c' 옵션에 대한 설명으로 옳은 것은?",
    options:["'i'는 Oracle 12c 이상에서만 지원","두 옵션을 동시에 지정하면 'i'가 우선","기본값은 'c'(대소문자 구분)","'c'는 대소문자를 무시"],
    correctAnswer:2, explanation:"기본값은 'c'(대소문자 구분). 'i'와 'c'는 Oracle 10g+. 동시 지정 시 오류 발생합니다." },

  // ── 상(심화) 37-50 ───────────────────────────────────────────────
  { id:37, level:'advanced', question:"다음 SQL이 수행하는 작업은?\nREGEXP_REPLACE(last_name, '([aeiou])', '[\\1]', 1, 0, 'i')",
    options:['모음을 대괄호로 감싸서 표시','모음을 삭제','모음을 X로 치환','모음을 대문자로 변환'], correctAnswer:0,
    explanation:"([aeiou]) 캡처 → 역참조 [\\1]로 [a], [e] 등 대괄호로 감쌈. King → K[i]ng." },

  { id:38, level:'advanced', question:"다음 조건의 의미는?\nWHERE REGEXP_LIKE(last_name, '^[^AEIOU][AEIOU]', 'i')",
    options:['last_name이 자음으로 시작하고 두 번째 문자가 모음인 직원','last_name이 모음이 아닌 문자로 시작하는 직원','last_name의 첫 두 글자가 자음인 직원','last_name에 자음과 모음이 번갈아 나오는 직원'],
    correctAnswer:0, explanation:"^[^AEIOU]: 시작이 자음(모음 아닌 문자), [AEIOU]: 다음 글자가 모음 → King(Ki), De Haan(De) 등." },

  { id:39, level:'advanced', question:"다음 SQL에서 subexpr=3의 역할은?\nREGEXP_SUBSTR('John Smith 30', '(\\w+)\\s+(\\w+)\\s+(\\d+)', 1, 1, NULL, 3)",
    options:["전체 패턴을 추출","세 번째 그룹 (\\d+)의 값 '30'을 추출","세 번째 일치 항목을 추출","세 번째 캡처 그룹의 시작 위치 반환"],
    correctAnswer:1, explanation:"subexpr=3: 세 번째 캡처 그룹 (\\d+) = '30'. 그룹1=John, 그룹2=Smith, 그룹3=30." },

  { id:40, level:'advanced', question:"다음 SQL에서 반환되는 값은?\nSELECT REGEXP_INSTR('Hello World', 'o', 1, 2) FROM dual;",
    options:['5','8','9','10'], correctAnswer:1,
    explanation:"'Hello World'에서 'o' 두 번째 일치: Hell(o)=5, W(o)rld=8 → 8." },

  { id:41, level:'advanced', question:"다음 REGEXP_REPLACE가 수행하는 작업은?\nREGEXP_REPLACE(phone_number, '^(\\d{3})\\.(\\d{3})\\.(\\d{4})$', '(\\1) \\2-\\3')",
    options:['전화번호의 점(.)을 하이픈(-)으로 교체','515.123.4567 → (515) 123-4567 형식으로 변환','전화번호에서 숫자만 추출','전화번호의 지역번호를 제거'],
    correctAnswer:1, explanation:"3개 그룹 캡처(지역번호·국번·번호) → '(\\1) \\2-\\3' 패턴으로 재조합." },

  { id:42, level:'advanced', question:"유효한 이메일 주소(user@domain.com) 필터링 패턴으로 가장 적합한 것은?",
    options:["'^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$'","'^[A-Za-z]+@[A-Za-z]+\\.com$'","'%@%.%'","'^.*@.*\\..*$'"],
    correctAnswer:0, explanation:"①은 로컬파트·도메인·TLD를 모두 검증. ②는 너무 제한적, ③은 LIKE 문법, ④는 너무 느슨합니다." },

  { id:43, level:'advanced', question:"'the cat sat on the mat'에서 단어 끝 'at' 출현 횟수는?\n(cat, sat, mat 에서 at로 끝나는 단어 기준)",
    options:['3','2','4','1'], correctAnswer:0,
    explanation:"cat, sat, mat 세 단어 모두 at로 끝남 → 3회. REGEXP_COUNT로는 'at\\b' 패턴(단어 경계) 사용." },

  { id:44, level:'advanced', question:"다음 쿼리가 수행하는 작업을 가장 정확하게 설명한 것은?\nLISTAGG(REGEXP_SUBSTR(str, '[^,]+', 1, LEVEL)) ... CONNECT BY LEVEL <= REGEXP_COUNT(str, ',')+1",
    options:['콤마로 구분된 문자열을 행으로 분리 (CSV Parsing)','각 문자를 별도 행으로 분리','콤마를 제거한 문자열 반환','중복 단어 제거'],
    correctAnswer:0, explanation:"[^,]+ 는 콤마 아닌 문자 그룹(각 토큰). LEVEL을 occurrence로 활용하여 CSV를 행으로 분리." },

  { id:45, level:'advanced', question:"REGEXP_REPLACE의 occurrence 파라미터가 0일 때 동작은?",
    options:['첫 번째 일치만 치환','마지막 일치만 치환','모든 일치를 치환','치환하지 않음'], correctAnswer:2,
    explanation:"occurrence=0(기본값): 모든 일치를 치환. occurrence=n(n≥1): n번째 일치만 치환합니다." },

  { id:46, level:'advanced', question:"다음 WHERE 조건이 반환하는 행은?\nREGEXP_LIKE(last_name, '^[A-Z][a-z]+$')",
    options:['첫 글자만 대문자이고 나머지가 소문자인 last_name','대문자만으로 구성된 last_name','첫 글자가 대문자인 last_name','소문자만으로 구성된 last_name'],
    correctAnswer:0, explanation:"^[A-Z]: 첫 글자 대문자, [a-z]+: 이후 소문자 1개 이상, $: 끝 → 첫 글자만 대문자·나머지 소문자." },

  { id:47, level:'advanced', question:"다음 두 쿼리의 결과가 다른 이유는?\nA: REGEXP_LIKE(last_name, 'king', 'i')\nB: REGEXP_LIKE(last_name, '^king$', 'i')",
    options:['A는 king 포함 모든 행, B는 정확히 king인 행','A와 B는 동일한 결과','B는 오류 발생','A는 대소문자 구분, B는 무시'],
    correctAnswer:0, explanation:"A: 'king' 부분 포함 → Kingsleigh도 해당. B: ^king$으로 정확히 king인 행만 → King 1명." },

  { id:48, level:'advanced', question:"다음 표현식의 의미는?\nLENGTH(last_name) - LENGTH(REGEXP_REPLACE(last_name, '[aeiou]', '', 1, 0, 'i'))",
    options:['모음을 제거한 후 남은 자음의 수','원래 길이에서 모음 제거 후 길이를 빼어 모음의 수를 계산','모음 제거 후 문자열을 반환','REGEXP_COUNT와 동일한 결과'],
    correctAnswer:1, explanation:"모음 제거 후 길이를 원래 길이에서 빼면 모음 수. REGEXP_COUNT('[aeiou]', 1, 'i')와 동일한 결과." },

  { id:49, level:'advanced', question:"정규표현식 사용 시 성능 관점에서 옳지 않은 것은?",
    options:['인덱스 컬럼에 REGEXP_LIKE를 사용하면 인덱스 스캔이 활성화된다','복잡한 패턴은 단순한 패턴보다 CPU를 더 사용한다','단순한 패턴은 LIKE가 더 빠를 수 있다','대용량 데이터에서 정규표현식은 Full Table Scan을 유발할 수 있다'],
    correctAnswer:0, explanation:"REGEXP_LIKE는 함수 기반 조건으로 B-Tree 인덱스를 활용하지 못해 Full Table Scan 발생. FBI(함수 기반 인덱스) 필요." },

  { id:50, level:'advanced', question:"다음 SQL의 목적은?\nSELECT TRIM(REGEXP_SUBSTR('a,bb,ccc', '[^,]+', 1, LEVEL)) AS token FROM dual\nCONNECT BY LEVEL <= REGEXP_COUNT('a,bb,ccc', ',')+1",
    options:['콤마로 구분된 문자열을 행으로 분리 (CSV Parsing)','각 문자를 별도 행으로 분리','콤마를 제거한 문자열 반환','중복 단어 제거'],
    correctAnswer:0, explanation:"[^,]+: 콤마 아닌 토큰. LEVEL을 occurrence로 사용. REGEXP_COUNT(',')+1 = 토큰 수. 결과: a/bb/ccc 3행." },
]
