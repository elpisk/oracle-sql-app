import type { QuizQuestion } from '@/lib/types'

export const ch09Quiz: QuizQuestion[] = [
  // ── 하(기초) 1~20 ──────────────────────────────────────────
  {
    id: 901, level: 'basic',
    question: 'DDL의 약자와 의미로 올바른 것은?',
    options: [
      'DML — 데이터 조작 언어',
      'DDL — 데이터 정의 언어',
      'DCL — 데이터 제어 언어',
      'DQL — 데이터 조회 언어',
    ],
    correctAnswer: 1,
    explanation: 'DDL은 Data Definition Language(데이터 정의 언어)의 약자입니다. CREATE, ALTER, DROP, RENAME, TRUNCATE 등 데이터베이스 객체를 정의하는 SQL 문을 포함합니다.',
  },
  {
    id: 902, level: 'basic',
    question: '다음 중 데이터베이스 객체가 아닌 것은?',
    options: ['테이블(Table)', '인덱스(Index)', '트랜잭션(Transaction)', '시퀀스(Sequence)'],
    correctAnswer: 2,
    explanation: '트랜잭션은 데이터베이스 객체가 아닌 DML의 개념입니다. 데이터베이스 객체에는 테이블, 뷰, 인덱스, 시퀀스, 동의어, 프로시저 등이 있습니다.',
  },
  {
    id: 903, level: 'basic',
    question: '테이블 이름의 명명 규칙으로 올바른 것은?',
    options: [
      '숫자로 시작할 수 있다',
      '최대 50자까지 가능하다',
      '공백 문자를 포함할 수 있다',
      '문자로 시작하며 1~30자 길이여야 한다',
    ],
    correctAnswer: 3,
    explanation: '테이블 이름은 문자(A-Z)로 시작해야 하며, 1~30자 길이여야 합니다. 사용 가능한 문자: A-Z, 0-9, _, $, #. 공백, 특수문자, 예약어는 사용 불가.',
  },
  {
    id: 904, level: 'basic',
    question: 'VARCHAR2(50) 데이터 타입의 특징으로 올바른 것은?',
    options: [
      '항상 50바이트를 사용하는 고정 길이',
      '최대 50바이트의 가변 길이 문자 데이터',
      '50개의 숫자만 저장 가능',
      '50행의 데이터를 저장 가능',
    ],
    correctAnswer: 1,
    explanation: "VARCHAR2(n)은 최대 n바이트의 가변 길이 문자 데이터를 저장합니다. 실제 데이터 길이만큼만 저장 공간을 사용합니다. CHAR(n)은 항상 n바이트를 사용하는 고정 길이 타입입니다.",
  },
  {
    id: 905, level: 'basic',
    question: 'NUMBER(7, 2) 데이터 타입으로 저장 가능한 값은?',
    options: ['1234567.89', '12345.67', '123456789', '12345.678'],
    correctAnswer: 1,
    explanation: 'NUMBER(7,2)는 전체 7자리, 소수점 이하 2자리. 최대값은 99999.99. ①1234567.89는 전체 9자리 초과, ③123456789는 소수 자리 없어도 8자리 초과, ④12345.678은 소수 3자리 초과.',
  },
  {
    id: 906, level: 'basic',
    question: '열에 기본값을 지정하는 Oracle DDL 옵션은?',
    options: ['SET DEFAULT', 'DEFAULT', 'INITIAL', 'INIT VALUE'],
    correctAnswer: 1,
    explanation: 'DEFAULT expr 형태로 열의 기본값을 지정합니다. INSERT 시 해당 열에 값을 제공하지 않으면 DEFAULT 값이 사용됩니다. 예: hire_date DATE DEFAULT SYSDATE',
  },
  {
    id: 907, level: 'basic',
    question: 'NOT NULL 제약 조건에 대한 올바른 설명은?',
    options: [
      '열의 모든 값이 고유해야 함',
      '해당 열에 NULL 값을 허용하지 않음',
      '다른 테이블의 기본 키를 참조함',
      '각 행이 만족해야 하는 조건 정의',
    ],
    correctAnswer: 1,
    explanation: 'NOT NULL 제약 조건은 해당 열에 NULL 값을 허용하지 않습니다. 반드시 값을 입력해야 하는 필수 열에 사용합니다. 열 수준에서만 정의 가능합니다.',
  },
  {
    id: 908, level: 'basic',
    question: 'UNIQUE 제약 조건에 대한 올바른 설명은?',
    options: [
      'NULL 값을 허용하지 않는다',
      '열의 모든 값이 고유해야 하며 NULL은 허용됨',
      '테이블당 하나만 존재 가능',
      '다른 테이블을 참조한다',
    ],
    correctAnswer: 1,
    explanation: 'UNIQUE 제약 조건은 열의 모든 값이 고유해야 합니다. NULL 값은 허용되며, 여러 NULL이 같은 열에 있어도 UNIQUE 위반이 아닙니다. 테이블당 여러 개 정의 가능합니다.',
  },
  {
    id: 909, level: 'basic',
    question: 'PRIMARY KEY 제약 조건에 대한 올바른 설명은?',
    options: [
      'NULL 허용, 중복 허용',
      'NULL 불허, 중복 허용',
      'NULL 불허, 중복 불허',
      'NULL 허용, 중복 불허',
    ],
    correctAnswer: 2,
    explanation: 'PRIMARY KEY = NOT NULL + UNIQUE의 조합입니다. 각 행을 유일하게 식별하므로 NULL 불허, 중복 불허입니다. 테이블당 하나만 정의할 수 있습니다.',
  },
  {
    id: 910, level: 'basic',
    question: 'FOREIGN KEY 제약 조건의 역할로 올바른 것은?',
    options: [
      '열의 모든 값이 고유해야 함',
      '참조 무결성 유지 — 자식 테이블의 열이 부모 테이블의 기본 키를 참조',
      'NULL 값 불허',
      '각 행의 조건 검사',
    ],
    correctAnswer: 1,
    explanation: 'FOREIGN KEY는 참조 무결성을 유지합니다. 자식 테이블의 FK 값은 부모 테이블의 기본 키(또는 UNIQUE) 값 중 하나이거나 NULL이어야 합니다.',
  },
  {
    id: 911, level: 'basic',
    question: 'CHECK 제약 조건의 특징으로 올바른 것은?',
    options: [
      '다른 테이블의 열을 참조할 수 있다',
      '각 행이 만족해야 하는 조건을 정의한다',
      '테이블당 하나만 정의 가능하다',
      'NULL 값을 자동으로 거부한다',
    ],
    correctAnswer: 1,
    explanation: 'CHECK 제약 조건은 각 행이 만족해야 하는 논리 조건을 정의합니다. SYSDATE 의사열 참조 불가, 서브쿼리 불가, 다른 행 참조 불가. 테이블당 여러 개 정의 가능합니다.',
  },
  {
    id: 912, level: 'basic',
    question: 'ALTER TABLE 문으로 기존 테이블에 새 열을 추가할 때 사용하는 절은?',
    options: ['MODIFY', 'INSERT', 'ADD', 'APPEND'],
    correctAnswer: 2,
    explanation: 'ALTER TABLE table_name ADD (column_name data_type)으로 새 열을 추가합니다. 추가된 열은 항상 테이블의 마지막 열이 됩니다.',
  },
  {
    id: 913, level: 'basic',
    question: 'ALTER TABLE 문으로 열의 데이터 타입이나 크기를 변경할 때 사용하는 절은?',
    options: ['ADD', 'MODIFY', 'CHANGE', 'UPDATE'],
    correctAnswer: 1,
    explanation: 'ALTER TABLE table_name MODIFY (column_name new_type)으로 열의 타입이나 크기를 변경합니다. 크기 확장은 항상 가능하지만, 축소는 기존 데이터가 새 크기에 맞을 때만 가능합니다.',
  },
  {
    id: 914, level: 'basic',
    question: 'ALTER TABLE 문으로 열을 삭제할 때 사용하는 절은?',
    options: ['REMOVE', 'DELETE', 'DROP', 'ERASE'],
    correctAnswer: 2,
    explanation: 'ALTER TABLE table_name DROP (column_name)으로 열을 삭제합니다. 또는 SET UNUSED 후 DROP UNUSED COLUMNS로 단계적으로 삭제할 수 있습니다.',
  },
  {
    id: 915, level: 'basic',
    question: 'DROP TABLE 문의 기본 동작으로 올바른 것은?',
    options: [
      '테이블을 즉시 완전 삭제한다',
      '테이블을 휴지통(Recycle Bin)으로 이동한다',
      '테이블 구조만 삭제하고 데이터는 유지한다',
      '테이블을 잠금 처리한다',
    ],
    correctAnswer: 1,
    explanation: 'DROP TABLE은 기본적으로 테이블을 Recycle Bin으로 이동합니다. FLASHBACK TABLE ... TO BEFORE DROP으로 복구 가능합니다. PURGE 옵션을 사용하면 즉시 완전 삭제됩니다.',
  },
  {
    id: 916, level: 'basic',
    question: '서브쿼리를 사용하여 테이블을 생성하는 구문은?',
    options: [
      'CREATE TABLE t AS SELECT ...',
      'CREATE TABLE t FROM SELECT ...',
      'CREATE TABLE t INSERT SELECT ...',
      'CREATE TABLE t COPY SELECT ...',
    ],
    correctAnswer: 0,
    explanation: 'CREATE TABLE table_name AS SELECT ... 구문으로 서브쿼리 결과를 기반으로 새 테이블을 생성합니다. 구조와 데이터가 함께 복사되며, NOT NULL 제외 제약 조건은 복사되지 않습니다.',
  },
  {
    id: 917, level: 'basic',
    question: 'CHAR(10) 데이터 타입의 특징으로 올바른 것은?',
    options: [
      '가변 길이로 최대 10바이트',
      '항상 10바이트를 사용하는 고정 길이',
      '10개의 숫자를 저장',
      '10행의 데이터를 저장',
    ],
    correctAnswer: 1,
    explanation: 'CHAR(n)은 항상 n바이트를 사용하는 고정 길이 문자 타입입니다. 저장 데이터가 n보다 짧으면 공백으로 채웁니다. VARCHAR2는 가변 길이입니다.',
  },
  {
    id: 918, level: 'basic',
    question: 'SET UNUSED 옵션의 목적으로 올바른 것은?',
    options: [
      '열을 즉시 삭제한다',
      '열을 미사용으로 표시하여 나중에 삭제한다',
      '열 데이터를 NULL로 초기화한다',
      '열을 읽기 전용으로 설정한다',
    ],
    correctAnswer: 1,
    explanation: 'SET UNUSED는 열을 미사용(invisible) 상태로 표시만 합니다. 실제 삭제는 ALTER TABLE table DROP UNUSED COLUMNS로 나중에 수행합니다. 대형 테이블에서 즉시 삭제 시 성능 부담을 줄이기 위해 사용합니다.',
  },
  {
    id: 919, level: 'basic',
    question: '테이블을 읽기 전용으로 설정하는 올바른 구문은?',
    options: [
      'LOCK TABLE employees;',
      'ALTER TABLE employees READ ONLY;',
      'SET TABLE employees READONLY;',
      'GRANT READ ONLY ON employees;',
    ],
    correctAnswer: 1,
    explanation: 'ALTER TABLE table_name READ ONLY로 테이블을 읽기 전용으로 설정합니다. 이 상태에서는 DML이 불가합니다. ALTER TABLE table_name READ WRITE로 다시 쓰기 가능 상태로 복원합니다.',
  },
  {
    id: 920, level: 'basic',
    question: '제약 조건을 생성할 때 이름을 지정하지 않으면 Oracle이 자동으로 부여하는 이름 형식은?',
    options: ['CON_n', 'SYS_Cn', 'ORA_Cn', 'CONS_n'],
    correctAnswer: 1,
    explanation: '제약 조건 이름을 CONSTRAINT 키워드로 명시하지 않으면 Oracle이 SYS_Cn 형식의 이름을 자동 생성합니다. 오류 메시지에서 제약 조건을 쉽게 식별하려면 명시적 이름을 사용하는 것이 권장됩니다.',
  },

  // ── 중(응용) 21~40 ─────────────────────────────────────────
  {
    id: 921, level: 'intermediate',
    question: '다음 CREATE TABLE 문에서 오류가 발생하는 이유는?\nCREATE TABLE 123_employee\n(id NUMBER, name VARCHAR2(50));',
    options: [
      '테이블 이름이 예약어임',
      '테이블 이름이 숫자로 시작함',
      '열 개수가 부족함',
      '데이터 타입 오류',
    ],
    correctAnswer: 1,
    explanation: '테이블 이름 123_employee는 숫자(1)로 시작하므로 명명 규칙 위반입니다. 테이블 이름은 반드시 문자(A-Z)로 시작해야 합니다.',
  },
  {
    id: 922, level: 'intermediate',
    question: '다음 중 올바른 CREATE TABLE 구문은?',
    options: [
      "CREATE TABLE emp (id NUMBER, name CHAR DEFAULT 'Unknown');",
      'CREATE TABLE emp (id NUMBER PRIMARY, name VARCHAR2(50));',
      'CREATE TABLE emp (id NUMBER PRIMARY KEY, name VARCHAR2(50) NOT NULL);',
      'CREATE TABLE emp (id NUMBER UNIQUE NULL, name VARCHAR2(50));',
    ],
    correctAnswer: 2,
    explanation: '①은 CHAR에 크기 미지정(기본 1바이트, 문법 허용), ②는 PRIMARY→PRIMARY KEY가 올바른 키워드, ③이 올바른 구문, ④는 UNIQUE NULL 조합이 모순적 (UNIQUE는 NULL 허용이 기본).',
  },
  {
    id: 923, level: 'intermediate',
    question: 'ALTER TABLE dept80 ADD (job_id VARCHAR2(9));\n실행 결과로 올바른 것은?',
    options: [
      'dept80의 첫 번째 열로 job_id 추가',
      'dept80의 마지막 열로 job_id 추가',
      '오류 발생 — 열은 CREATE TABLE에서만 추가 가능',
      '기존 job_id 열 수정',
    ],
    correctAnswer: 1,
    explanation: 'ALTER TABLE ADD로 추가된 열은 항상 테이블의 마지막 열이 됩니다. 기존 열의 중간에 삽입할 수 없습니다.',
  },
  {
    id: 924, level: 'intermediate',
    question: '다음 SQL에서 오류가 발생하는 이유는?\nUPDATE employees\nSET    department_id = 55\nWHERE  department_id = 110;',
    options: [
      'department_id 55는 DEPARTMENTS에 존재하지 않아 FK 위반',
      'department_id 110이 존재하지 않음',
      'UPDATE 문법 오류',
      'WHERE 절 없이 UPDATE 불가',
    ],
    correctAnswer: 0,
    explanation: 'employees.department_id에는 FOREIGN KEY가 있어 DEPARTMENTS에 존재하는 값만 입력 가능합니다. department_id=55가 DEPARTMENTS에 없으므로 ORA-02291: integrity constraint violated - parent key not found 오류가 발생합니다.',
  },
  {
    id: 925, level: 'intermediate',
    question: 'ON DELETE CASCADE 옵션의 동작으로 올바른 것은?',
    options: [
      '부모 행 삭제 시 자식 행의 FK 값을 NULL로 변경',
      '부모 행 삭제 시 자식 행도 자동으로 삭제',
      '부모 행 삭제를 금지',
      '자식 행 삭제 시 부모 행도 삭제',
    ],
    correctAnswer: 1,
    explanation: 'ON DELETE CASCADE는 부모 테이블의 행이 삭제될 때 해당 행을 참조하는 자식 테이블의 행들도 자동으로 삭제합니다.',
  },
  {
    id: 926, level: 'intermediate',
    question: 'PRIMARY KEY와 UNIQUE 제약 조건의 차이점으로 올바른 것은?',
    options: [
      'UNIQUE는 NULL을 허용하지 않음',
      'PRIMARY KEY는 NULL을 허용하고 UNIQUE는 허용하지 않음',
      'PRIMARY KEY는 NULL 불허 + 고유, UNIQUE는 NULL 허용 + 고유',
      '두 제약 조건은 완전히 동일하다',
    ],
    correctAnswer: 2,
    explanation: 'PRIMARY KEY = NOT NULL + UNIQUE. UNIQUE는 NULL을 허용합니다. 또한 테이블당 PRIMARY KEY는 1개만, UNIQUE는 여러 개 정의 가능합니다.',
  },
  {
    id: 927, level: 'intermediate',
    question: 'CREATE TABLE dept80 AS SELECT employee_id, last_name FROM employees WHERE department_id = 80;\n위 서브쿼리로 테이블을 생성할 때 복사되는 것은?',
    options: [
      '테이블 구조(열 정의)만',
      '데이터만',
      '테이블 구조 + 데이터 + 모든 제약 조건',
      '테이블 구조 + 데이터 (NOT NULL 제외 제약 조건은 복사 안 됨)',
    ],
    correctAnswer: 3,
    explanation: 'CREATE TABLE AS SELECT로 생성 시 테이블 구조(열 정의)와 데이터는 복사되지만, PRIMARY KEY/UNIQUE/FOREIGN KEY/CHECK 제약 조건은 복사되지 않습니다. NOT NULL은 복사됩니다.',
  },
  {
    id: 928, level: 'intermediate',
    question: 'ALTER TABLE dept80 SET UNUSED (job_id);\n이 SQL의 목적으로 올바른 것은?',
    options: [
      'job_id 열을 즉시 삭제',
      'job_id 열을 미사용으로 표시 (실제 삭제는 나중에)',
      'job_id 열의 값을 NULL로 초기화',
      'job_id 열을 읽기 전용으로 설정',
    ],
    correctAnswer: 1,
    explanation: 'SET UNUSED는 열을 미사용 상태로 표시만 합니다. 표시된 열은 SELECT, DML에서 접근 불가해집니다. 실제 삭제는 ALTER TABLE t DROP UNUSED COLUMNS 명령으로 별도 실행합니다.',
  },
  {
    id: 929, level: 'intermediate',
    question: '다음 중 CHECK 제약 조건으로 유효한 것은?',
    options: [
      'CHECK (salary > commission) — 다른 열 참조 불가',
      'CHECK (salary > 0)',
      'CHECK (hire_date > SYSDATE) — 의사열 참조 불가',
      'CHECK (employee_id IN (SELECT employee_id FROM other_table)) — 서브쿼리 불가',
    ],
    correctAnswer: 1,
    explanation: 'CHECK 제약 조건 제한: SYSDATE 의사열 참조 불가, 서브쿼리 불가, ROWID 등 의사열 불가. ① 같은 테이블의 다른 열 참조는 사실 Oracle에서 허용되지만, 일반적으로 ② 단순 상수 비교가 가장 안전한 유효한 형태입니다.',
  },
  {
    id: 930, level: 'intermediate',
    question: 'ALTER TABLE MODIFY 문의 제한 사항으로 올바른 것은?',
    options: [
      '모든 데이터 타입으로 언제든지 변경 가능',
      '기존 데이터와 호환되어야 하며, 데이터가 있을 때 크기 축소는 제한됨',
      '열 수정은 비어있는 테이블에서만 가능',
      'MODIFY는 이름 변경에만 사용 가능',
    ],
    correctAnswer: 1,
    explanation: 'MODIFY 규칙: 크기 늘리기(항상 가능), 크기 줄이기(기존 데이터가 새 크기에 맞을 때만), DEFAULT만 변경(항상 가능), 빈 테이블에서 타입 변경(가능). ORA-01441 오류: 기존 데이터 초과 시 크기 축소 불가.',
  },
  {
    id: 931, level: 'intermediate',
    question: 'CONSTRAINT emp_dept_fk FOREIGN KEY (department_id) REFERENCES departments(department_id) ON DELETE SET NULL\n이 구문에 대한 올바른 설명은?',
    options: [
      '부모 행 삭제 시 자식 행도 삭제됨',
      '부모 행 삭제 시 자식의 department_id가 NULL로 변경됨',
      '자식 행이 있으면 부모 행 삭제 불가',
      'NULL 값을 자동으로 기본값으로 변경',
    ],
    correctAnswer: 1,
    explanation: 'ON DELETE SET NULL은 부모 테이블의 행이 삭제될 때 자식 테이블의 외래 키 값을 NULL로 변경합니다. 단, 해당 열에 NOT NULL 제약이 있으면 오류가 발생합니다.',
  },
  {
    id: 932, level: 'intermediate',
    question: 'DROP TABLE 문에 PURGE를 추가하면 어떻게 되는가?',
    options: [
      '테이블이 휴지통으로 이동됨',
      '테이블과 데이터가 즉시 완전히 삭제됨 (복구 불가)',
      '테이블 구조만 삭제됨',
      '오류 발생',
    ],
    correctAnswer: 1,
    explanation: 'DROP TABLE table_name PURGE는 Recycle Bin을 거치지 않고 즉시 완전히 삭제합니다. FLASHBACK으로 복구 불가합니다. PURGE 없이 DROP하면 Recycle Bin으로 이동되어 복구 가능합니다.',
  },
  {
    id: 933, level: 'intermediate',
    question: '다음 중 열 수준 제약 조건으로 정의할 수 없는 것은?',
    options: [
      'NOT NULL',
      'UNIQUE',
      'PRIMARY KEY (단일 열)',
      '복합 PRIMARY KEY (여러 열 조합)',
    ],
    correctAnswer: 3,
    explanation: '복합 PRIMARY KEY(여러 열 조합)는 반드시 테이블 수준에서 정의해야 합니다: CONSTRAINT pk PRIMARY KEY (col1, col2). 단일 열 PRIMARY KEY는 열 수준 또는 테이블 수준 모두 가능합니다.',
  },
  {
    id: 934, level: 'intermediate',
    question: 'NUMBER(5) 열에 저장 가능한 최대 값은?',
    options: ['5', '99999', '99999.9', '9999999999'],
    correctAnswer: 1,
    explanation: 'NUMBER(5)는 정수 5자리: 최대 99999입니다. NUMBER(5, 2)는 전체 5자리, 소수 2자리: 최대 999.99. NUMBER(p)는 정수 p자리를 의미합니다.',
  },
  {
    id: 935, level: 'intermediate',
    question: '다음 DEFAULT 옵션 사용 중 잘못된 것은?',
    options: [
      'hire_date DATE DEFAULT SYSDATE',
      "status VARCHAR2(10) DEFAULT 'Active'",
      'dept_id NUMBER DEFAULT department_id (다른 열 참조)',
      'count NUMBER DEFAULT 0',
    ],
    correctAnswer: 2,
    explanation: "DEFAULT 값으로 다른 열 이름이나 의사열(ROWNUM, ROWID 등)은 사용 불가합니다. 리터럴, 표현식, SQL 함수(SYSDATE, USER 등)는 허용됩니다. department_id는 다른 열을 참조하므로 오류입니다.",
  },
  {
    id: 936, level: 'intermediate',
    question: 'SET UNUSED로 표시된 열을 실제로 제거하는 올바른 방법은?',
    options: [
      'ALTER TABLE dept80 DROP (job_id);',
      'ALTER TABLE dept80 DROP UNUSED COLUMNS;',
      'DELETE COLUMN job_id FROM dept80;',
      'TRUNCATE COLUMN job_id FROM dept80;',
    ],
    correctAnswer: 1,
    explanation: 'ALTER TABLE table_name DROP UNUSED COLUMNS는 SET UNUSED로 표시된 모든 열을 실제로 삭제합니다. SET UNUSED 상태의 열들을 한 번에 처리합니다.',
  },
  {
    id: 937, level: 'intermediate',
    question: 'FOREIGN KEY 제약 조건 없이 참조 무결성을 위반하는 경우는?',
    options: [
      '자식 테이블에 NULL 삽입',
      '부모 테이블에 없는 값을 자식 테이블에 삽입',
      '부모 테이블의 기본 키 값 수정',
      '자식 테이블에서 행 삭제',
    ],
    correctAnswer: 1,
    explanation: 'FOREIGN KEY 참조 무결성 위반: 자식 테이블에 부모 테이블에 없는 값 삽입 시 ORA-02291 오류 발생. NULL 삽입은 허용됩니다. 자식 행 삭제는 제약 조건 위반이 아닙니다.',
  },
  {
    id: 938, level: 'intermediate',
    question: 'TIMESTAMP와 DATE 데이터 타입의 차이점으로 올바른 것은?',
    options: [
      'TIMESTAMP는 날짜만, DATE는 시간도 포함',
      'TIMESTAMP는 소수 초를 포함, DATE는 초 단위까지만',
      'TIMESTAMP는 문자로 저장, DATE는 숫자로 저장',
      '차이 없음',
    ],
    correctAnswer: 1,
    explanation: 'DATE는 날짜+시분초까지 저장합니다. TIMESTAMP는 DATE보다 정밀하여 소수 초(fractional seconds, 최대 9자리)까지 저장합니다. 정밀한 시간 기록이 필요할 때 TIMESTAMP를 사용합니다.',
  },
  {
    id: 939, level: 'intermediate',
    question: "서브쿼리로 테이블 생성 시 WHERE 절을 'WHERE 1=2'로 하면?",
    options: [
      '오류 발생',
      '모든 데이터 복사',
      '테이블 구조만 복사되고 데이터는 없음',
      '첫 번째 행만 복사',
    ],
    correctAnswer: 2,
    explanation: 'WHERE 1=2는 항상 거짓이므로 행이 하나도 선택되지 않습니다. 결과적으로 테이블 구조(열 정의)만 복사된 빈 테이블이 생성됩니다. 백업 테이블 구조를 만들 때 자주 사용하는 패턴입니다.',
  },
  {
    id: 940, level: 'intermediate',
    question: 'ALTER TABLE로 열 이름을 변경하는 올바른 구문은?',
    options: [
      'ALTER TABLE t MODIFY old_col TO new_col;',
      'ALTER TABLE t RENAME COLUMN old_col TO new_col;',
      'ALTER TABLE t CHANGE old_col TO new_col;',
      'ALTER TABLE t SET old_col = new_col;',
    ],
    correctAnswer: 1,
    explanation: 'Oracle에서 열 이름 변경: ALTER TABLE table_name RENAME COLUMN old_name TO new_name. MODIFY는 타입/크기 변경, RENAME은 이름 변경에 사용합니다.',
  },

  // ── 상(심화) 41~50 ─────────────────────────────────────────
  {
    id: 941, level: 'advanced',
    question: `다음 CREATE TABLE 문의 분석으로 올바른 것은?
CREATE TABLE orders (
    order_id    NUMBER(10)   PRIMARY KEY,
    order_date  DATE         DEFAULT SYSDATE,
    status      VARCHAR2(20) DEFAULT 'PENDING'
                             CHECK (status IN ('PENDING','SHIPPED','CANCELLED')),
    amount      NUMBER(12,2) CHECK (amount > 0)
);`,
    options: [
      '오류 — DEFAULT와 CHECK를 함께 사용 불가',
      "status 열에 DEFAULT와 CHECK가 모두 적용되는 유효한 구문",
      'CHECK 제약 조건은 테이블 수준에서만 정의 가능',
      'amount 열에는 음수를 저장할 수 있음',
    ],
    correctAnswer: 1,
    explanation: "열 수준에서 DEFAULT와 CHECK를 동시에 정의하는 것은 완전히 유효한 Oracle 구문입니다. INSERT 시 status 미지정→'PENDING', 잘못된 값 입력 시 CHECK 위반. amount CHECK (amount > 0)이므로 음수 불가.",
  },
  {
    id: 942, level: 'advanced',
    question: `다음 두 제약 조건 정의 방식의 차이점으로 올바른 것은?
(A) 열 수준: employee_id NUMBER(6) CONSTRAINT emp_pk PRIMARY KEY
(B) 테이블 수준: CONSTRAINT emp_pk PRIMARY KEY (employee_id)`,
    options: [
      '(A)는 단일 열에만 적용 가능, (B)는 복합 키에도 사용 가능',
      '(A)가 항상 더 빠르다',
      '(B)는 이름 지정 불가',
      '차이 없음',
    ],
    correctAnswer: 0,
    explanation: '열 수준(A)은 해당 단일 열에만 제약 조건을 정의합니다. 테이블 수준(B)은 열 목록 아래 별도로 정의하므로 복합 기본 키(여러 열 조합)도 가능합니다: CONSTRAINT pk PRIMARY KEY (col1, col2).',
  },
  {
    id: 943, level: 'advanced',
    question: 'DELETE FROM departments WHERE department_id = 60;\nORA-02292 오류가 발생하는 이유는?',
    options: [
      'department_id 60이 존재하지 않음',
      '부서 60에 소속된 사원이 EMPLOYEES 테이블에 FK로 참조하고 있어 삭제 불가',
      'DELETE 권한 없음',
      'WHERE 절에 비교 연산자 오류',
    ],
    correctAnswer: 1,
    explanation: 'ORA-02292: integrity constraint violated - child record found. EMPLOYEES.department_id가 DEPARTMENTS.department_id를 FK로 참조하므로, 부서 60을 참조하는 사원이 있으면 삭제 불가. ON DELETE CASCADE나 사원을 먼저 이동/삭제해야 합니다.',
  },
  {
    id: 944, level: 'advanced',
    question: `다음 SQL의 실행 결과로 올바른 것은?
CREATE TABLE emp_backup AS
SELECT * FROM employees WHERE 1=2;
INSERT INTO emp_backup SELECT * FROM employees WHERE hire_date < '01-JAN-2000';`,
    options: [
      "오류 발생 — WHERE 1=2는 유효하지 않음",
      '구조만 있는 빈 테이블 생성 후, 2000년 이전 입사자 데이터 삽입',
      '모든 직원 데이터로 백업 테이블 생성',
      'hire_date 2000년 이후 사원만 백업',
    ],
    correctAnswer: 1,
    explanation: '첫 SQL: WHERE 1=2로 빈 테이블 생성(구조만, NOT NULL 제외 제약 없음). 두 번째 SQL: 2000년 이전 입사자를 빈 테이블에 삽입. 이는 선택적 데이터 백업 패턴입니다.',
  },
  {
    id: 945, level: 'advanced',
    question: 'ALTER TABLE MODIFY에서 오류가 발생할 수 있는 상황은?',
    options: [
      '열 크기를 현재보다 크게 늘리는 경우',
      '데이터가 있는 열의 크기를 현재 데이터보다 작게 줄이는 경우',
      '기본값(DEFAULT)만 변경하는 경우',
      '빈 테이블에서 NUMBER를 VARCHAR2로 변경하는 경우',
    ],
    correctAnswer: 1,
    explanation: 'ORA-01441: cannot decrease column length because some value is too large. 데이터가 있는 열의 크기를 기존 데이터보다 작게 줄이면 오류가 발생합니다. 크기 확장, DEFAULT 변경, 빈 테이블의 타입 변경은 항상 가능합니다.',
  },
  {
    id: 946, level: 'advanced',
    question: 'ON DELETE CASCADE와 ON DELETE SET NULL을 비교할 때 올바른 것은?',
    options: [
      'ON DELETE CASCADE는 부모 행만 삭제하고 자식은 유지',
      'ON DELETE SET NULL은 자식 테이블에 NOT NULL 제약이 있으면 오류 발생 가능',
      'ON DELETE CASCADE는 참조 무결성을 위반한다',
      '두 옵션은 동일한 결과를 낸다',
    ],
    correctAnswer: 1,
    explanation: 'ON DELETE SET NULL은 부모 행 삭제 시 자식의 FK 열을 NULL로 바꾸려 합니다. 그런데 해당 열에 NOT NULL 제약이 있다면 ORA-01407 오류가 발생합니다. 설계 시 이 충돌을 주의해야 합니다.',
  },
  {
    id: 947, level: 'advanced',
    question: `다음 CREATE TABLE 문의 특이 사항으로 올바른 것은?
CREATE TABLE employees (
    employee_id   NUMBER(6),
    email         VARCHAR2(25),
    department_id NUMBER(4),
    CONSTRAINT emp_pk    PRIMARY KEY (employee_id),
    CONSTRAINT emp_email_uk UNIQUE (email),
    CONSTRAINT emp_dept_fk  FOREIGN KEY (department_id)
        REFERENCES departments(department_id)
        ON DELETE CASCADE
);`,
    options: [
      '오류 — 제약 조건은 하나만 정의 가능',
      '복합 제약 조건이 올바르게 테이블 수준에서 정의됨',
      'FOREIGN KEY에 ON DELETE CASCADE가 있으면 UNIQUE 불필요',
      'PRIMARY KEY와 UNIQUE를 같은 열에 정의했으므로 오류',
    ],
    correctAnswer: 1,
    explanation: '여러 제약 조건(PRIMARY KEY, UNIQUE, FOREIGN KEY ON DELETE CASCADE)을 테이블 수준에서 정의한 완전히 유효한 DDL 패턴입니다. 테이블 수준은 복합 키에도 사용 가능하며 제약 조건 이름을 명시하고 있습니다.',
  },
  {
    id: 948, level: 'advanced',
    question: 'SET UNUSED를 사용하는 이유로 가장 적절한 것은?',
    options: [
      'SET UNUSED가 DROP COLUMN보다 안전하다',
      '대형 테이블에서 즉시 열 삭제 시 오랜 시간 소요 — UNUSED 표시 후 사용량이 적은 시간대에 DROP',
      'UNUSED 열은 복구할 수 있다',
      'UNUSED 열은 여전히 DML에서 사용 가능하다',
    ],
    correctAnswer: 1,
    explanation: '수억 건의 대형 테이블에서 ALTER TABLE DROP COLUMN은 데이터 재구성으로 장시간 소요되고 테이블 잠금이 발생합니다. SET UNUSED로 먼저 숨기면 업무 시간에 영향 없이 실행하고, 사용량 적은 새벽에 DROP UNUSED COLUMNS를 실행할 수 있습니다.',
  },
  {
    id: 949, level: 'advanced',
    question: `다음 SQL 시퀀스의 실행 결과로 올바른 것은?
CREATE TABLE test_tbl AS SELECT employee_id, salary FROM employees;
ALTER TABLE test_tbl ADD (dept_id NUMBER(4));
ALTER TABLE test_tbl MODIFY (salary NUMBER(10,2));
ALTER TABLE test_tbl SET UNUSED (dept_id);
ALTER TABLE test_tbl DROP UNUSED COLUMNS;
DESCRIBE test_tbl;`,
    options: [
      'employee_id, salary, dept_id 세 열이 존재',
      'employee_id, salary 두 열만 존재 (dept_id는 SET UNUSED 후 DROP으로 제거됨)',
      '모든 ALTER TABLE이 실패하여 원래 구조 유지',
      'salary 타입 변경 실패로 오류',
    ],
    correctAnswer: 1,
    explanation: '①ADD dept_id → ②MODIFY salary(크기 확장, 성공) → ③SET UNUSED dept_id → ④DROP UNUSED COLUMNS (dept_id 실제 삭제). 최종: employee_id, salary 두 열만 존재. salary 타입 변경은 NUMBER→NUMBER(10,2) 확장이므로 성공.',
  },
  {
    id: 950, level: 'advanced',
    question: `다음 요구사항에 맞는 올바른 CREATE TABLE 구문 조합은?
- product_id: 고유 식별자, NULL 불허
- product_name: 필수 입력, 중복 허용
- price: 0보다 커야 함
- category_id: categories 테이블의 category_id 참조
- sku: 고유해야 하지만 없을 수도 있음`,
    options: [
      'A: PRIMARY KEY, B: NOT NULL, C: CHECK(price > 0), D: REFERENCES categories(category_id), E: UNIQUE',
      'A: UNIQUE, B: NOT NULL UNIQUE, C: CHECK(price >= 0), D: FOREIGN KEY, E: PRIMARY KEY',
      'A: NOT NULL, B: NOT NULL, C: NOT NULL, D: NOT NULL, E: UNIQUE',
      'A: PRIMARY KEY, B: UNIQUE, C: NOT NULL, D: FOREIGN KEY, E: NOT NULL',
    ],
    correctAnswer: 0,
    explanation: '분석: product_id(고유+NOT NULL)→PRIMARY KEY, product_name(필수, 중복 허용)→NOT NULL, price(>0)→CHECK(price>0), category_id(참조)→REFERENCES, sku(고유, NULL가능)→UNIQUE(NULL허용). ①이 모든 요구사항에 정확히 일치합니다.',
  },
]
