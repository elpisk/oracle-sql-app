import type { QuizQuestion } from '@/lib/types'

export const ch11Quiz: QuizQuestion[] = [
  // ── 하(기초) 1~20 ──────────────────────────────────────────
  {
    id: 1101, level: 'basic',
    question: '시퀀스(Sequence)의 주요 목적으로 올바른 것은?',
    options: ['테이블 데이터를 정렬한다', '고유한 숫자 값을 자동으로 생성한다', '테이블 검색 속도를 향상시킨다', '객체에 대체 이름을 부여한다'],
    correctAnswer: 1,
    explanation: '시퀀스는 고유한 숫자 값을 자동으로 생성하는 데이터베이스 객체입니다. 주로 기본 키 값을 자동 생성하는 데 사용합니다.',
  },
  {
    id: 1102, level: 'basic',
    question: 'CREATE SEQUENCE에서 시작 값을 100으로 설정하는 옵션은?',
    options: ['BEGIN WITH 100', 'INITIAL VALUE 100', 'START WITH 100', 'FIRST VALUE 100'],
    correctAnswer: 2,
    explanation: 'START WITH n 옵션으로 시퀀스의 시작 값을 지정합니다. 이후 NEXTVAL 호출 시 이 값부터 시작됩니다.',
  },
  {
    id: 1103, level: 'basic',
    question: '시퀀스의 다음 값을 반환하는 의사열(pseudocolumn)은?',
    options: ['seq.CURRENT', 'seq.NEXTVAL', 'seq.NEXT', 'seq.INCREMENT'],
    correctAnswer: 1,
    explanation: 'seq.NEXTVAL은 시퀀스의 다음 값을 반환하는 의사열입니다. 호출할 때마다 INCREMENT BY만큼 증가한 새 값을 반환합니다.',
  },
  {
    id: 1104, level: 'basic',
    question: 'seq.CURRVAL을 사용하기 전에 반드시 먼저 실행해야 하는 것은?',
    options: ['seq.RESET', 'seq.MINVAL', 'seq.NEXTVAL', 'SELECT seq FROM dual'],
    correctAnswer: 2,
    explanation: 'CURRVAL은 현재 세션에서 이미 NEXTVAL을 최소 한 번 호출한 후에만 사용할 수 있습니다. NEXTVAL 호출 없이 CURRVAL을 먼저 사용하면 ORA-08002 오류가 발생합니다.',
  },
  {
    id: 1105, level: 'basic',
    question: '시퀀스에서 NOCYCLE 옵션의 의미는?',
    options: ['최대값 도달 시 1부터 다시 시작', '최대값 도달 시 오류 반환 (더 이상 값 생성 안 함)', '값을 순환하며 무한 반복', '음수 값도 허용'],
    correctAnswer: 1,
    explanation: 'NOCYCLE은 시퀀스가 MAXVALUE에 도달하면 ORA-08004 오류를 반환하며 더 이상 값을 생성하지 않습니다. 반대로 CYCLE은 MAXVALUE 도달 후 MINVALUE부터 다시 시작합니다.',
  },
  {
    id: 1106, level: 'basic',
    question: '시퀀스에서 CACHE 20 옵션의 효과는?',
    options: ['20개의 시퀀스만 생성 가능', '메모리에 20개의 시퀀스 값을 미리 생성하여 빠른 접근 제공', '20초마다 캐시를 갱신', '20개의 테이블에서 공유 가능'],
    correctAnswer: 1,
    explanation: 'CACHE n은 시퀀스 값을 n개씩 미리 메모리에 생성해 두어 빠른 접근을 제공합니다. 시스템 크래시 시 캐시의 나머지 값이 소실되어 갭이 발생할 수 있습니다.',
  },
  {
    id: 1107, level: 'basic',
    question: '시퀀스 값에 갭(gap)이 발생할 수 있는 상황이 아닌 것은?',
    options: ['트랜잭션 롤백 발생', '시스템 크래시', 'COMMIT 실행', '같은 시퀀스를 다른 테이블에서 사용'],
    correctAnswer: 2,
    explanation: 'COMMIT은 시퀀스 갭과 무관합니다. 갭이 발생하는 경우: 트랜잭션 롤백(NEXTVAL 호출 후 롤백), 시스템 크래시(캐시 손실), 여러 테이블에서 동일 시퀀스 사용.',
  },
  {
    id: 1108, level: 'basic',
    question: '기존 시퀀스의 증가값을 5로 변경하는 구문은?',
    options: ['MODIFY SEQUENCE seq INCREMENT BY 5;', 'ALTER SEQUENCE seq INCREMENT BY 5;', 'UPDATE SEQUENCE seq SET INCREMENT = 5;', 'CHANGE SEQUENCE seq INCREMENT BY 5;'],
    correctAnswer: 1,
    explanation: 'ALTER SEQUENCE 시퀀스명 옵션 형식으로 시퀀스를 변경합니다. INCREMENT BY, MAXVALUE, MINVALUE, CYCLE, CACHE 등을 변경할 수 있습니다.',
  },
  {
    id: 1109, level: 'basic',
    question: '시퀀스를 삭제하는 올바른 구문은?',
    options: ['DELETE SEQUENCE dept_seq;', 'REMOVE SEQUENCE dept_seq;', 'DROP SEQUENCE dept_seq;', 'TRUNCATE SEQUENCE dept_seq;'],
    correctAnswer: 2,
    explanation: 'DROP SEQUENCE 시퀀스명으로 시퀀스를 삭제합니다. 삭제 후에는 해당 시퀀스를 참조하는 DEFAULT 절이 있는 열들도 영향을 받습니다.',
  },
  {
    id: 1110, level: 'basic',
    question: '시퀀스 정보를 조회하는 딕셔너리 뷰는?',
    options: ['USER_OBJECTS', 'USER_SEQ_INFO', 'USER_SEQUENCES', 'USER_AUTOINCREMENT'],
    correctAnswer: 2,
    explanation: 'USER_SEQUENCES 딕셔너리 뷰에서 시퀀스 정의를 조회합니다. 주요 컬럼: SEQUENCE_NAME, MIN_VALUE, MAX_VALUE, INCREMENT_BY, CYCLE_FLAG, CACHE_SIZE, LAST_NUMBER.',
  },
  {
    id: 1111, level: 'basic',
    question: '동의어(Synonym)의 특징으로 올바른 것은?',
    options: ['별도의 저장 공간이 필요하다', '데이터 딕셔너리에 정의만 저장된다', '테이블 데이터를 복사한다', '쿼리 성능을 향상시킨다'],
    correctAnswer: 1,
    explanation: '동의어는 데이터 딕셔너리에 정의(이름과 참조 대상)만 저장되며, 별도의 데이터 저장 공간이 필요하지 않습니다. 데이터를 복사하지 않고 원본 객체의 별칭 역할만 합니다.',
  },
  {
    id: 1112, level: 'basic',
    question: '개인(private) 동의어를 생성하는 올바른 구문은?',
    options: ['CREATE SYNONYM dept FOR departments;', 'CREATE PRIVATE SYNONYM dept FOR departments;', 'CREATE ALIAS dept AS departments;', 'RENAME departments TO dept;'],
    correctAnswer: 0,
    explanation: 'CREATE SYNONYM 동의어명 FOR 참조객체명; 형식으로 개인 동의어를 생성합니다. PRIVATE 키워드는 사용하지 않으며 기본값이 PRIVATE입니다.',
  },
  {
    id: 1113, level: 'basic',
    question: '공용(PUBLIC) 동의어 생성에 필요한 권한은?',
    options: ['일반 사용자 권한', 'SELECT ANY TABLE 권한', 'CREATE PUBLIC SYNONYM 권한 (보통 DBA 보유)', 'GRANT 권한'],
    correctAnswer: 2,
    explanation: 'PUBLIC 동의어를 생성하려면 CREATE PUBLIC SYNONYM 시스템 권한이 필요합니다. 이 권한은 일반적으로 DBA가 보유합니다. 개인 동의어는 CREATE SYNONYM 권한으로 생성 가능합니다.',
  },
  {
    id: 1114, level: 'basic',
    question: '동의어를 삭제하는 올바른 구문은?',
    options: ['DELETE SYNONYM dept;', 'REMOVE SYNONYM dept;', 'DROP SYNONYM dept;', 'ALTER SYNONYM dept REMOVE;'],
    correctAnswer: 2,
    explanation: 'DROP SYNONYM 동의어명으로 개인 동의어를 삭제합니다. PUBLIC 동의어는 DROP PUBLIC SYNONYM 동의어명으로 삭제합니다.',
  },
  {
    id: 1115, level: 'basic',
    question: '동의어를 사용하는 주요 이유가 아닌 것은?',
    options: ['긴 스키마 한정 이름을 단축할 수 있다', '다른 사용자의 객체에 간단하게 접근할 수 있다', '테이블 데이터에 접근 제어를 추가할 수 있다', '응용 프로그램에서 기반 객체가 변경되어도 동의어 이름을 유지할 수 있다'],
    correctAnswer: 2,
    explanation: '동의어 자체는 접근 제어 기능이 없습니다. 접근 제어는 GRANT/REVOKE로 처리합니다. 동의어의 목적: 이름 단축, 원격 객체 접근 단순화, 기반 객체 변경 시 투명성 제공.',
  },
  {
    id: 1116, level: 'basic',
    question: 'USER_SYNONYMS 뷰에서 확인 가능한 정보는?',
    options: ['동의어 생성 날짜', '동의어 이름과 참조하는 테이블/스키마 이름', '동의어에 접근한 사용자 목록', '동의어 사용 횟수'],
    correctAnswer: 1,
    explanation: 'USER_SYNONYMS의 주요 컬럼: SYNONYM_NAME(동의어 이름), TABLE_OWNER(참조 객체 소유자), TABLE_NAME(참조 객체 이름), DB_LINK(원격 DB 링크). 생성 날짜나 접근 이력은 USER_SYNONYMS에 없습니다.',
  },
  {
    id: 1117, level: 'basic',
    question: 'PUBLIC 동의어와 PRIVATE 동의어의 차이점으로 올바른 것은?',
    options: ['PRIVATE 동의어는 DBA만 생성할 수 있다', 'PUBLIC 동의어는 모든 데이터베이스 사용자가 접근할 수 있다', 'PUBLIC 동의어는 하나만 생성할 수 있다', 'PRIVATE 동의어는 성능이 더 느리다'],
    correctAnswer: 1,
    explanation: 'PUBLIC 동의어는 모든 DB 사용자가 접근할 수 있습니다. PRIVATE 동의어는 생성한 사용자만 사용합니다. 동일한 이름의 PRIVATE와 PUBLIC 동의어가 있으면 PRIVATE가 우선합니다.',
  },
  {
    id: 1118, level: 'basic',
    question: '동의어를 통해 SELECT 외에 DML(INSERT/UPDATE/DELETE)이 가능한가?',
    options: ['SELECT만 가능하다', 'SELECT와 UPDATE만 가능하다', '동의어를 통해 원본 객체에 대한 모든 DML이 가능하다', 'DML은 원본 테이블에 직접 해야만 한다'],
    correctAnswer: 2,
    explanation: '동의어는 원본 객체의 별칭이므로, 원본 객체에서 가능한 모든 작업(SELECT, INSERT, UPDATE, DELETE)을 동의어를 통해 수행할 수 있습니다.',
  },
  {
    id: 1119, level: 'basic',
    question: '존재하지 않는 테이블에 대한 동의어를 생성하면?',
    options: ['오류가 발생하여 동의어가 생성되지 않는다', '동의어가 생성되지만 사용 시 오류가 발생한다', '동의어가 자동으로 테이블을 생성한다', '동의어는 항상 먼저 객체를 생성한 후에만 만들 수 있다'],
    correctAnswer: 1,
    explanation: 'Oracle은 동의어 생성 시 참조 객체가 존재하는지 검사하지 않습니다. 동의어 생성은 성공하지만, 실제로 사용하려고 하면 ORA-04043: object does not exist 오류가 발생합니다.',
  },
  {
    id: 1120, level: 'basic',
    question: 'DESCRIBE 명령어를 동의어에 사용하면?',
    options: ['오류가 발생한다', '동의어가 참조하는 원본 객체의 열 구조가 표시된다', '동의어 자체의 정의가 표시된다', 'DESCRIBE는 테이블에만 사용 가능하다'],
    correctAnswer: 1,
    explanation: 'DESCRIBE(DESC) 동의어명은 동의어가 참조하는 원본 객체(테이블, 뷰 등)의 열 이름과 데이터 타입을 보여줍니다. 마치 원본 객체를 DESCRIBE하는 것과 동일합니다.',
  },

  // ── 중(응용) 21~40 ─────────────────────────────────────────
  {
    id: 1121, level: 'intermediate',
    question: `다음 시퀀스 생성문에서 첫 번째 NEXTVAL 값은?
CREATE SEQUENCE my_seq START WITH 100 INCREMENT BY 5 MAXVALUE 200 NOCYCLE;`,
    options: ['5', '95', '100', '105'],
    correctAnswer: 2,
    explanation: 'START WITH 100이므로 첫 번째 NEXTVAL은 100입니다. 이후 NEXTVAL은 100→105→110 순으로 5씩 증가합니다.',
  },
  {
    id: 1122, level: 'intermediate',
    question: `두 번의 INSERT 후 my_seq.CURRVAL의 값은? (START WITH 1, INCREMENT BY 1 기준)
INSERT INTO orders VALUES (my_seq.NEXTVAL, 'OrderA');
INSERT INTO orders VALUES (my_seq.NEXTVAL, 'OrderB');
SELECT my_seq.CURRVAL FROM dual;`,
    options: ['1', '2', '3', '0'],
    correctAnswer: 1,
    explanation: '1번째 INSERT: NEXTVAL = 1. 2번째 INSERT: NEXTVAL = 2. CURRVAL = 마지막 NEXTVAL = 2.',
  },
  {
    id: 1123, level: 'intermediate',
    question: `다음 SQL로 DEFAULT 값에 시퀀스를 사용하는 테이블이 올바르게 생성되는가?
CREATE SEQUENCE emp_seq START WITH 1;
CREATE TABLE emp_new (id NUMBER DEFAULT emp_seq.NEXTVAL NOT NULL, name VARCHAR2(50));`,
    options: ['오류 — DEFAULT에 시퀀스 사용 불가', '올바른 구문 — INSERT 시 id 미지정 시 시퀀스 자동 사용', '오류 — NOT NULL과 DEFAULT 병용 불가', '오류 — START WITH 1은 유효하지 않음'],
    correctAnswer: 1,
    explanation: 'Oracle 12c 이후 DEFAULT 절에 시퀀스의 NEXTVAL을 사용할 수 있습니다. INSERT 시 id를 생략하면 emp_seq.NEXTVAL이 자동으로 할당됩니다.',
  },
  {
    id: 1124, level: 'intermediate',
    question: '시퀀스를 100번에서 재시작하려면 어떻게 해야 하는가?',
    options: ['ALTER SEQUENCE seq START WITH 100;', 'UPDATE SEQUENCE seq SET current_value = 100;', 'DROP SEQUENCE seq; 후 CREATE SEQUENCE seq START WITH 100;', 'RESET SEQUENCE seq TO 100;'],
    correctAnswer: 2,
    explanation: 'ALTER SEQUENCE로는 START WITH를 변경할 수 없습니다. 현재 값을 재설정하려면 DROP SEQUENCE 후 새 시작 값으로 CREATE SEQUENCE 해야 합니다.',
  },
  {
    id: 1125, level: 'intermediate',
    question: 'USER_SEQUENCES 뷰에서 확인할 수 없는 정보는?',
    options: ['MIN_VALUE', 'MAX_VALUE', 'LAST_NUMBER', 'CURRENT_USER'],
    correctAnswer: 3,
    explanation: 'USER_SEQUENCES 컬럼: SEQUENCE_NAME, MIN_VALUE, MAX_VALUE, INCREMENT_BY, CYCLE_FLAG, ORDER_FLAG, CACHE_SIZE, LAST_NUMBER. CURRENT_USER는 USER_SEQUENCES의 컬럼이 아닙니다.',
  },
  {
    id: 1126, level: 'intermediate',
    question: `다음 시퀀스 생성문에서 오류가 발생하는 이유는?
CREATE SEQUENCE test_seq START WITH 100 INCREMENT BY 10 MAXVALUE 50;`,
    options: ['INCREMENT BY가 너무 크다', 'START WITH 값(100)이 MAXVALUE(50)보다 크다', 'NOCYCLE을 명시해야 한다', "이름에 '_'가 포함될 수 없다"],
    correctAnswer: 1,
    explanation: 'START WITH 100이 MAXVALUE 50보다 크므로 ORA-04006 오류가 발생합니다. START WITH 값은 MAXVALUE를 초과할 수 없습니다.',
  },
  {
    id: 1127, level: 'intermediate',
    question: 'ALTER SEQUENCE로 변경할 수 없는 것은?',
    options: ['INCREMENT BY', 'MAXVALUE', 'CACHE', 'START WITH (현재 값 재설정)'],
    correctAnswer: 3,
    explanation: 'ALTER SEQUENCE로 변경 가능: INCREMENT BY, MAXVALUE, MINVALUE, CYCLE, CACHE, ORDER. START WITH(현재 값 재설정)는 ALTER SEQUENCE로 변경 불가 → DROP 후 재생성 필요.',
  },
  {
    id: 1128, level: 'intermediate',
    question: 'ORDER 옵션이 필요한 환경은?',
    options: ['단일 인스턴스 Oracle 환경', 'RAC(Real Application Clusters) 등 다중 인스턴스 환경에서 순서 보장 필요 시', '음수 시퀀스 값이 필요할 때', 'CYCLE 옵션과 함께 사용할 때'],
    correctAnswer: 1,
    explanation: 'ORDER 옵션은 RAC 환경에서 여러 인스턴스가 동일 시퀀스를 사용할 때 요청 순서대로 값이 생성되도록 보장합니다. 단일 인스턴스에서는 NOORDER와 차이가 없습니다.',
  },
  {
    id: 1129, level: 'intermediate',
    question: 'MINVALUE와 MAXVALUE를 설정하지 않으면 기본값은?',
    options: ['MINVALUE=0, MAXVALUE=999', 'MINVALUE=1, MAXVALUE=10^27 (매우 큰 수)', 'MINVALUE=1, MAXVALUE=9999', 'MINVALUE=0, MAXVALUE는 무제한'],
    correctAnswer: 1,
    explanation: '기본값: NOMINVALUE → 오름차순은 1, 내림차순은 -10^26. NOMAXVALUE → 오름차순은 10^27, 내림차순은 -1. 지정하지 않으면 실질적으로 제한 없음.',
  },
  {
    id: 1130, level: 'intermediate',
    question: 'NOCACHE 옵션을 사용하면 CACHE 20 대비 어떤 차이가 있는가?',
    options: ['NEXTVAL 호출마다 디스크에서 읽으므로 성능은 느리지만 갭이 발생하지 않는다', 'NOCACHE는 갭도 발생하고 성능도 느리다', 'NOCACHE를 사용하면 시퀀스를 영구적으로 사용 불가로 만든다', 'NOCACHE와 CACHE 20은 차이가 없다'],
    correctAnswer: 0,
    explanation: 'NOCACHE는 NEXTVAL마다 디스크 I/O가 발생하여 CACHE보다 느리지만, 시스템 크래시 시 캐시 손실로 인한 갭이 발생하지 않습니다. 감사 요건이 있는 경우 NOCACHE를 사용합니다.',
  },
  {
    id: 1131, level: 'intermediate',
    question: `CREATE SYNONYM emp FOR hr.employees; 실행 후 올바른 쿼리는?`,
    options: ['SELECT * FROM employees;', 'SELECT * FROM emp;', 'SELECT * FROM hr.emp;', 'SELECT * FROM synonym.emp;'],
    correctAnswer: 1,
    explanation: '동의어 emp는 hr.employees의 별칭입니다. SELECT * FROM emp로 접근합니다. hr.emp는 hr 스키마의 emp 테이블(동의어 아님)을 가리킵니다.',
  },
  {
    id: 1132, level: 'intermediate',
    question: '동의어가 같은 이름의 PRIVATE와 PUBLIC이 모두 존재할 때 어느 것이 우선하는가?',
    options: ['PUBLIC 동의어가 우선한다', 'PRIVATE 동의어가 우선한다', '오류가 발생한다', '알파벳 순으로 결정된다'],
    correctAnswer: 1,
    explanation: '동일 이름의 PRIVATE와 PUBLIC 동의어가 모두 존재하면 PRIVATE 동의어가 우선합니다. PUBLIC 동의어는 PRIVATE가 없는 사용자에게만 적용됩니다.',
  },
  {
    id: 1133, level: 'intermediate',
    question: '동의어가 참조하는 테이블이 삭제되면 어떻게 되는가?',
    options: ['동의어도 자동으로 삭제된다', '동의어는 그대로 남아 있지만 사용 시 오류가 발생한다', '동의어가 NULL로 변경된다', '자동으로 다른 테이블을 참조한다'],
    correctAnswer: 1,
    explanation: '참조 테이블이 삭제되어도 동의어 정의는 딕셔너리에 남아 있습니다. 동의어를 사용하면 ORA-04043: object does not exist 오류가 발생합니다.',
  },
  {
    id: 1134, level: 'intermediate',
    question: 'USER_SYNONYMS 뷰에서 확인 가능한 정보로 올바른 것은?',
    options: ['동의어 이름, 참조하는 테이블/스키마 이름', '동의어가 사용된 쿼리 목록', '동의어 생성일', '동의어에 연결된 사용자 목록'],
    correctAnswer: 0,
    explanation: 'USER_SYNONYMS 주요 컬럼: SYNONYM_NAME(동의어 이름), TABLE_OWNER(참조 객체 소유자), TABLE_NAME(참조 객체 이름), DB_LINK. 쿼리 이력이나 생성일은 제공하지 않습니다.',
  },
  {
    id: 1135, level: 'intermediate',
    question: '동의어를 통해 INSERT를 실행하면?',
    options: ['오류가 발생한다', '동의어 테이블에 임시 저장된다', '원본 테이블에 직접 삽입된다', 'WITH CHECK OPTION 없이는 INSERT 불가하다'],
    correctAnswer: 2,
    explanation: '동의어를 통한 DML은 원본 테이블에 직접 수행됩니다. 동의어는 단순 별칭이므로 INSERT INTO 동의어명 VALUES(...)은 원본 테이블에 삽입하는 것과 동일합니다.',
  },
  {
    id: 1136, level: 'intermediate',
    question: 'PUBLIC 동의어를 삭제하는 올바른 구문은?',
    options: ['DROP SYNONYM pub_emp;', 'DROP PUBLIC SYNONYM pub_emp;', 'DELETE PUBLIC SYNONYM pub_emp;', 'REVOKE PUBLIC SYNONYM pub_emp;'],
    correctAnswer: 1,
    explanation: 'PUBLIC 동의어는 DROP PUBLIC SYNONYM 동의어명 형식으로 삭제합니다. 단순 DROP SYNONYM은 PRIVATE 동의어에만 사용합니다.',
  },
  {
    id: 1137, level: 'intermediate',
    question: '동의어에 DB_LINK가 지정되면 어떤 의미인가?',
    options: ['동의어가 로컬 데이터베이스의 테이블을 참조한다', '동의어가 원격 데이터베이스의 객체를 참조한다', 'DB_LINK는 동의어와 무관한 컬럼이다', '동의어가 비활성화되어 있음을 나타낸다'],
    correctAnswer: 1,
    explanation: 'DB_LINK가 설정된 동의어는 원격 데이터베이스의 객체를 참조합니다. CREATE SYNONYM remote_emp FOR hr.employees@dblink_name 형식으로 생성하며, 사용자는 원격 DB를 로컬처럼 쿼리할 수 있습니다.',
  },
  {
    id: 1138, level: 'intermediate',
    question: '동의어와 뷰의 차이점으로 올바른 것은?',
    options: ['동의어는 데이터를 저장하지만 뷰는 저장하지 않는다', '동의어는 WHERE 조건으로 데이터를 필터링할 수 없다', '동의어는 뷰보다 더 많은 저장 공간을 사용한다', '뷰는 SQL 정의를 저장하지만 동의어는 이름 매핑만 저장한다'],
    correctAnswer: 1,
    explanation: '동의어는 원본 객체의 이름 매핑만 저장하며 데이터 필터링 기능이 없습니다. 뷰는 SQL 정의(WHERE 절, JOIN 등)를 저장하여 데이터를 가공·필터링할 수 있습니다.',
  },
  {
    id: 1139, level: 'intermediate',
    question: 'ALL_SYNONYMS 뷰가 USER_SYNONYMS와 다른 점은?',
    options: ['ALL_SYNONYMS는 PUBLIC 동의어만 표시한다', 'ALL_SYNONYMS는 현재 사용자가 접근 권한을 가진 모든 사용자의 동의어를 보여준다', 'ALL_SYNONYMS는 DBA만 조회할 수 있다', 'ALL_SYNONYMS는 삭제된 동의어도 포함한다'],
    correctAnswer: 1,
    explanation: 'USER_SYNONYMS: 현재 사용자 소유 동의어. ALL_SYNONYMS: 현재 사용자가 접근 가능한 모든 사용자의 동의어. DBA_SYNONYMS: DB 전체 동의어(DBA 전용).',
  },
  {
    id: 1140, level: 'intermediate',
    question: '동의어를 수정(재정의)하려면 어떻게 해야 하는가?',
    options: ['ALTER SYNONYM 동의어명 FOR 새객체명;', 'CREATE OR REPLACE SYNONYM 동의어명 FOR 새객체명;', 'MODIFY SYNONYM 동의어명 FOR 새객체명;', 'DROP SYNONYM 후 CREATE SYNONYM만 가능하다'],
    correctAnswer: 1,
    explanation: 'CREATE OR REPLACE SYNONYM 동의어명 FOR 새객체명 형식으로 기존 동의어를 재정의할 수 있습니다. ALTER SYNONYM 구문은 일부 버전에서 지원하지 않으며, OR REPLACE가 표준적입니다.',
  },

  // ── 상(심화) 41~50 ─────────────────────────────────────────
  {
    id: 1141, level: 'advanced',
    question: `시퀀스 NEXTVAL을 세 번 호출 후 ROLLBACK했을 때 시퀀스의 다음 NEXTVAL은?
CREATE SEQUENCE s START WITH 1 INCREMENT BY 1 NOCACHE;
SELECT s.NEXTVAL FROM dual;  -- 1
SELECT s.NEXTVAL FROM dual;  -- 2
SELECT s.NEXTVAL FROM dual;  -- 3
ROLLBACK;`,
    options: ['1 (ROLLBACK으로 복원됨)', '4 (ROLLBACK이 시퀀스에 영향 없음)', '0 (초기화됨)', '3 (마지막 값 유지)'],
    correctAnswer: 1,
    explanation: '시퀀스는 ROLLBACK에 영향을 받지 않습니다. DML 롤백이 발생해도 시퀀스 카운터는 복원되지 않습니다. 세 번 NEXTVAL 후 ROLLBACK 해도 다음 NEXTVAL = 4. 이것이 시퀀스 갭 발생의 주요 원인입니다.',
  },
  {
    id: 1142, level: 'advanced',
    question: `CACHE 20 시퀀스에서 시스템 크래시 발생 시 재시작 후 NEXTVAL은?
CREATE SEQUENCE seq1 START WITH 1 INCREMENT BY 1 CACHE 20;
-- 1~5 사용 중 크래시 (캐시에 6~20이 남아있던 상황)`,
    options: ['크래시 전 마지막 값(5)의 다음인 6부터 시작', '21부터 시작 (캐시 블록의 다음부터)', '1부터 다시 시작', '20부터 시작'],
    correctAnswer: 1,
    explanation: 'CACHE 20이면 1~20을 메모리에 미리 생성합니다. 5개 사용 중 크래시 → 캐시의 나머지 6~20은 영구 손실. 재시작 후 Oracle은 다음 블록(21~40)부터 시작. 따라서 21부터 시작하며 갭(6~20)이 발생합니다.',
  },
  {
    id: 1143, level: 'advanced',
    question: `감사 요건 "시스템 재시작 후에도 갭 없음"을 충족하는 시퀀스 설계는?
요구사항: 주문번호 10000001부터, 1씩 증가, 절대 중복 없음, 갭 없음(감사 요건)`,
    options: [
      'CREATE SEQUENCE ord_seq START WITH 10000001 INCREMENT BY 1 CACHE 20;',
      'CREATE SEQUENCE ord_seq START WITH 10000001 INCREMENT BY 1 NOCACHE;',
      'CREATE SEQUENCE ord_seq START WITH 10000001 INCREMENT BY 1 CYCLE;',
      'CREATE SEQUENCE ord_seq START WITH 1 INCREMENT BY 1 MAXVALUE 10000001;',
    ],
    correctAnswer: 1,
    explanation: '갭 없음 = NOCACHE 필수. CACHE 사용 시 크래시 후 갭 발생. CYCLE은 중복 발생 가능. NOCACHE는 NEXTVAL마다 디스크에 저장하므로 크래시 후에도 연속 번호를 보장합니다.',
  },
  {
    id: 1144, level: 'advanced',
    question: `다음 SQL 실행 결과를 SELECT * FROM t ORDER BY id 로 조회하면?
CREATE SEQUENCE s1 START WITH 1 INCREMENT BY 1;
CREATE TABLE t (id NUMBER DEFAULT s1.NEXTVAL, val VARCHAR2(10));
INSERT INTO t (val) VALUES ('A');
INSERT INTO t (id, val) VALUES (999, 'B');
INSERT INTO t (val) VALUES ('C');`,
    options: ['1, 999, 2 순서 (ORDER BY id: 1, 2, 999)', '1, 999, 3 순서', '오류 발생 — id=999가 시퀀스 범위 초과', '1, 2, 3 순서'],
    correctAnswer: 0,
    explanation: '1번째 INSERT: id = NEXTVAL = 1. 2번째 INSERT: id = 명시적 999, NEXTVAL 미호출. 3번째 INSERT: id = NEXTVAL = 2. ORDER BY id: 1, 2, 999 순서. 명시적 id 지정 시 시퀀스가 호출되지 않음에 주의.',
  },
  {
    id: 1145, level: 'advanced',
    question: '시퀀스에서 갭(gap)이 발생하는 모든 원인을 올바르게 나열한 것은?',
    options: [
      'ROLLBACK, 시스템 크래시만 해당됨',
      'ROLLBACK, 시스템 크래시, CACHE 사용(크래시 시), 여러 테이블에서 동일 시퀀스 사용',
      'COMMIT 실행, ROLLBACK, 시스템 크래시',
      'SELECT 문에서 NEXTVAL 호출 시만 발생',
    ],
    correctAnswer: 1,
    explanation: '시퀀스 갭 발생 원인: ①트랜잭션 롤백(NEXTVAL 호출 후 롤백), ②시스템 크래시(특히 CACHE 사용 시 캐시 손실), ③여러 테이블에서 동일 시퀀스 공유(다른 트랜잭션이 NEXTVAL 소비). COMMIT은 갭과 무관.',
  },
  {
    id: 1146, level: 'advanced',
    question: '동의어를 통해 DML을 수행할 때 올바른 설명은?',
    options: [
      '동의어를 통한 DML은 항상 금지된다',
      '동의어는 원본 테이블에 대한 모든 DML을 허용한다 (원본 객체에 권한이 있을 때)',
      '동의어를 통한 DML은 SELECT만 허용된다',
      '동의어를 통한 INSERT만 가능하다',
    ],
    correctAnswer: 1,
    explanation: '동의어는 원본 객체의 별칭이므로, 원본 객체에 대한 DML 권한이 있으면 동의어를 통해 INSERT/UPDATE/DELETE 모두 가능합니다. WITH READ ONLY 뷰의 동의어는 예외.',
  },
  {
    id: 1147, level: 'advanced',
    question: 'PUBLIC 동의어를 사용해야 하는 가장 적절한 상황은?',
    options: [
      '개인 스키마에서 테이블 이름을 단축할 때',
      '여러 개발팀이 DBA 스키마의 공용 테이블에 스키마명 없이 접근할 때',
      '뷰 대신 동의어로 데이터 필터링할 때',
      '외래 키 참조를 단순화할 때',
    ],
    correctAnswer: 1,
    explanation: 'PUBLIC 동의어는 여러 사용자가 동일 스키마 한정 이름 없이 공용 객체에 접근할 때 사용합니다. 예: hr.employees → CREATE PUBLIC SYNONYM employees FOR hr.employees → 모든 사용자가 SELECT * FROM employees 사용 가능.',
  },
  {
    id: 1148, level: 'advanced',
    question: '동의어의 참조 대상을 변경하는 가장 올바른 방법은?',
    options: [
      'ALTER SYNONYM old_name TO new_table;',
      'CREATE OR REPLACE SYNONYM syn_name FOR new_table;',
      'UPDATE user_synonyms SET table_name = \'NEW_TABLE\' WHERE synonym_name = \'SYN_NAME\';',
      'DROP SYNONYM syn_name; CREATE SYNONYM syn_name FOR new_table;',
    ],
    correctAnswer: 1,
    explanation: 'CREATE OR REPLACE SYNONYM 동의어명 FOR 새객체명 형식이 가장 권장됩니다. DROP 후 재생성도 가능하지만 OR REPLACE가 더 안전합니다. 딕셔너리를 직접 UPDATE하는 것은 절대 금지됩니다.',
  },
  {
    id: 1149, level: 'advanced',
    question: `다음 시나리오에서 올바른 설명은?
세션 A: CREATE SYNONYM my_emp FOR employees;
세션 B: 동일 사용자로 접속, SELECT * FROM my_emp;`,
    options: [
      '세션 B에서 my_emp를 사용할 수 없다 — 동의어는 세션 전용이다',
      '세션 B에서 my_emp를 정상 사용할 수 있다 — 동의어는 스키마 레벨 객체다',
      '오류 발생 — 동의어는 SESSION PRIVATE 상태다',
      '세션 B는 PUBLIC 동의어만 사용할 수 있다',
    ],
    correctAnswer: 1,
    explanation: 'PRIVATE 동의어는 세션이 아닌 스키마(사용자) 레벨 객체입니다. 같은 사용자라면 다른 세션에서도 동의어를 사용할 수 있습니다. 세션이 종료되어도 동의어는 유지됩니다.',
  },
  {
    id: 1150, level: 'advanced',
    question: `다음 시나리오를 분석하시오.
1. user_a가 CREATE PUBLIC SYNONYM emp_pub FOR user_a.employees;
2. user_b가 SELECT * FROM emp_pub; 실행
3. user_b가 INSERT INTO emp_pub VALUES (...); 실행`,
    options: [
      '2, 3 모두 성공',
      '2는 성공(SELECT 권한 있으면), 3은 실패(INSERT 권한 없으면 ORA-01031)',
      '2, 3 모두 실패 — PUBLIC 동의어는 DML 불가',
      '2는 성공, 3은 항상 성공 — PUBLIC 동의어는 DML 항상 허용',
    ],
    correctAnswer: 1,
    explanation: 'PUBLIC 동의어 자체는 권한을 부여하지 않습니다. user_b가 SELECT * FROM emp_pub를 실행하려면 user_a.employees에 대한 SELECT 권한이 있어야 합니다. INSERT도 마찬가지로 권한이 있어야 합니다. 동의어는 이름만 제공하고 권한은 별도로 GRANT해야 합니다.',
  },
]
