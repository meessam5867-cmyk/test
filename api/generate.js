import { GoogleGenAI } from '@google/genai';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { destination } = req.body;

  if (!destination) {
    return res.status(400).json({ error: '여행지를 입력해주세요.' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: '서버에 GEMINI_API_KEY 설정이 되어있지 않습니다.' });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    const prompt = `사용자가 입력한 관심 여행지/스타일: "${destination}"
    
    위 정보를 바탕으로 시원하고 즐거운 여름휴가 여행지 추천 및 3일 간의 추천 일정을 작성해줘.
    
    응답 형식:
    - **추천 여행지 이름**: (예: 강원도 양양)
    - **한 줄 추천 이유**: (청량하고 시원한 느낌의 명쾌한 이유)
    - **추천 일정 (3일)**:
      - 1일차: 핵심 방문지 및 활동
      - 2일차: 핵심 방문지 및 활동
      - 3일차: 핵심 방문지 및 활동
    - **여름휴가 꿀팁 2가지**:
    
    읽기 쉽게 마크다운 형태로 친절하고 신나게 답변해줘.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return res.status(200).json({ result: response.text });
  } catch (error) {
    console.error('Gemini API Error:', error);
    return res.status(500).json({ error: '여행지 추천을 불러오는 중 오류가 발생했습니다.' });
  }
}
