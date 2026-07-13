import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function POST(req: NextRequest) {
  try {
    const { studentName, chapterTitle, score, total, wrongAnswers } = await req.json()

    if (!wrongAnswers?.length) {
      return NextResponse.json({ ok: false, reason: 'no wrong answers' })
    }

    const wrongList = wrongAnswers.map((w: {
      level: string; question: string; selectedOption: string; correctOption: string; explanation: string
    }, i: number) =>
      `${i + 1}. [난이도: ${w.level === 'basic' ? '하' : w.level === 'intermediate' ? '중' : '상'}]
   문제: ${w.question}
   학생 선택: ${w.selectedOption}
   정답: ${w.correctOption}
   해설: ${w.explanation}`
    ).join('\n\n')

    const prompt = `당신은 Oracle SQL 교육 강사입니다.
학습자 ${studentName} 학생이 "${chapterTitle}" 챕터 퀴즈에서 ${total}문제 중 ${score}문제를 맞혔습니다 (${Math.round((score/total)*100)}점).

아래는 틀린 문제 목록입니다:

${wrongList}

위 오답 분석을 바탕으로 강사 입장에서 학생에게 전달할 피드백을 작성해 주세요.

작성 기준:
- 학생 이름을 직접 언급하며 친근하고 격려하는 톤으로 작성
- 틀린 문제들의 공통적인 취약 개념을 파악하여 핵심 포인트 짚어주기
- 개선을 위한 구체적인 학습 방향 제시
- 200자 내외의 간결한 한국어로 작성
- 강사가 직접 쓴 것처럼 자연스럽게 (AI가 생성했다는 언급 없이)`

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
    const result = await model.generateContent(prompt)
    const text = result.response.text()

    return NextResponse.json({ ok: true, feedback: text })
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) })
  }
}
