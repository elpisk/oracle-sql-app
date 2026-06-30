import type { Chapter } from '@/lib/types'

export const CHAPTERS: Chapter[] = [
  // SQL 기초
  { id:'ch01', number:'01', title:'SELECT 기본',           titleEn:'Basic SELECT',              sections:6, estimatedMinutes:40, quizCount:50, practiceCount:26, available:true, group:'basic' },
  { id:'ch02', number:'02', title:'WHERE 절 조건',         titleEn:'Restricting and Sorting',   sections:6, estimatedMinutes:35, quizCount:50, practiceCount:26, available:true, group:'basic' },
  { id:'ch03', number:'03', title:'단일행 함수',           titleEn:'Single-Row Functions',      sections:7, estimatedMinutes:45, quizCount:50, practiceCount:28, available:true, group:'basic' },
  { id:'ch04', number:'04', title:'그룹 함수',             titleEn:'Group Functions',           sections:5, estimatedMinutes:35, quizCount:50, practiceCount:26, available:true, group:'basic' },
  { id:'ch05', number:'05', title:'조인',                  titleEn:'Joining Tables',            sections:7, estimatedMinutes:50, quizCount:50, practiceCount:28, available:true, group:'basic' },
  { id:'ch06', number:'06', title:'서브쿼리',              titleEn:'Using Subqueries',          sections:6, estimatedMinutes:40, quizCount:50, practiceCount:26, available:true, group:'basic' },
  { id:'ch07', number:'07', title:'집합 연산자',           titleEn:'Set Operators',             sections:4, estimatedMinutes:30, quizCount:50, practiceCount:26, available:true, group:'basic' },
  { id:'ch08', number:'08', title:'DML',                   titleEn:'Manipulating Data',         sections:5, estimatedMinutes:35, quizCount:50, practiceCount:26, available:true, group:'basic' },
  { id:'ch09', number:'09', title:'DDL',                   titleEn:'Using DDL',                 sections:6, estimatedMinutes:40, quizCount:50, practiceCount:26, available:true, group:'basic' },
  { id:'ch10', number:'10', title:'뷰',                    titleEn:'Creating Views',            sections:5, estimatedMinutes:35, quizCount:50, practiceCount:26, available:true, group:'basic' },
  // SQL 고급
  { id:'ch11', number:'11', title:'시퀀스·동의어',        titleEn:'Sequences and Synonyms',    sections:4, estimatedMinutes:30, quizCount:50, practiceCount:26, available:true, group:'advanced' },
  { id:'ch12', number:'12', title:'인덱스',                titleEn:'Using Indexes',             sections:5, estimatedMinutes:35, quizCount:50, practiceCount:26, available:true, group:'advanced' },
  { id:'ch13', number:'13', title:'분석 함수',             titleEn:'Analytic Functions',        sections:7, estimatedMinutes:50, quizCount:50, practiceCount:28, available:true, group:'advanced' },
  { id:'ch14', number:'14', title:'피벗·언피벗',          titleEn:'Pivot and Unpivot',         sections:4, estimatedMinutes:30, quizCount:50, practiceCount:26, available:true, group:'advanced' },
  { id:'ch15', number:'15', title:'모델 절',               titleEn:'The MODEL Clause',          sections:5, estimatedMinutes:40, quizCount:50, practiceCount:26, available:true, group:'advanced' },
  { id:'ch16', number:'16', title:'플래시백',              titleEn:'Flashback Technology',      sections:6, estimatedMinutes:40, quizCount:50, practiceCount:26, available:true, group:'advanced' },
  { id:'ch17', number:'17', title:'MERGE 문',              titleEn:'Using MERGE',               sections:4, estimatedMinutes:30, quizCount:50, practiceCount:26, available:true, group:'advanced' },
  { id:'ch18', number:'18', title:'다중 테이블 INSERT',   titleEn:'Multitable Inserts',        sections:5, estimatedMinutes:35, quizCount:50, practiceCount:26, available:true, group:'advanced' },
  { id:'ch19', number:'19', title:'추적·감사',            titleEn:'Tracking Changes',          sections:5, estimatedMinutes:35, quizCount:50, practiceCount:26, available:true, group:'advanced' },
  { id:'ch20', number:'20', title:'타임존',               titleEn:'Date Time Zones',           sections:5, estimatedMinutes:35, quizCount:50, practiceCount:26, available:true, group:'advanced' },
  { id:'ch21', number:'21', title:'간격 데이터 타입',     titleEn:'Interval Data Types',       sections:4, estimatedMinutes:30, quizCount:50, practiceCount:26, available:true, group:'advanced' },
  { id:'ch22', number:'22', title:'고급 서브쿼리',        titleEn:'Advanced Subqueries',       sections:8, estimatedMinutes:50, quizCount:50, practiceCount:18, available:true, group:'advanced' },
  { id:'ch23', number:'23', title:'계층 쿼리',            titleEn:'Hierarchical Queries',      sections:9, estimatedMinutes:55, quizCount:50, practiceCount:15, available:true, group:'advanced' },
  { id:'ch24', number:'24', title:'정규표현식',           titleEn:'Regular Expression Support',sections:8, estimatedMinutes:50, quizCount:50, practiceCount:28, available:true, group:'advanced' },
]

export const getChapter = (id: string) => CHAPTERS.find(c => c.id === id)

/** 실제 강의·퀴즈·실습 콘텐츠가 준비된 챕터 목록 */
export const CONTENT_READY = ['ch01', 'ch02', 'ch22', 'ch23', 'ch24']

export const GROUPS = {
  basic:    { label: 'SQL 기초',   color: '#0071E3' },
  advanced: { label: 'SQL 고급',   color: '#AF52DE' },
  appendix: { label: '부록',       color: '#34C759' },
}
