
import { DISASTER_TERMS, AMBIGUOUS_TERMS, CULTURAL_CONTEXT_TERMS } from './dictionaries';

export const getTranslationQuality = (original: string, reverseTranslated: string, translated: string, targetLanguage: string): number => {
  // 1. 기존 역번역 평가 (40%)
  const reverseTranslationScore = calculateReverseTranslationScore(original, reverseTranslated);
  
  // 2. 문화적 맥락 평가 (25%)
  const culturalContextScore = evaluateCulturalContext(original, translated, targetLanguage);
  
  // 3. 동음이의어 처리 평가 (20%)
  const ambiguousTermScore = evaluateAmbiguousTerms(original, translated, reverseTranslated);
  
  // 4. 전문용어 사전 매칭 평가 (15%)
  const terminologyScore = evaluateTerminologyAccuracy(original, translated);
  
  // 가중평균으로 최종 점수 계산
  const finalScore = (
    reverseTranslationScore * 0.4 +
    culturalContextScore * 0.25 +
    ambiguousTermScore * 0.20 +
    terminologyScore * 0.15
  );
  
  return Math.round(finalScore);
};

// 1. 역번역 기반 평가
const calculateReverseTranslationScore = (original: string, reverseTranslated: string): number => {
  // 핵심 정보 보존도 (5W1H) - 50%
  const informationPreservationScore = checkInformationPreservation(original, reverseTranslated);
  
  // 의미적 일관성 - 30%
  const semanticConsistencyScore = calculateSemanticConsistency(original, reverseTranslated);
  
  // 재난문자 특화 평가 - 20%
  const disasterSpecificScore = evaluateDisasterSpecificElements(original, reverseTranslated);
  
  return (
    informationPreservationScore * 0.5 +
    semanticConsistencyScore * 0.3 +
    disasterSpecificScore * 0.2
  );
};

const checkInformationPreservation = (original: string, reverseTranslated: string): number => {
  const keyElements = {
    // 언제 (When)
    timeWords: ['즉시', '신속히', '오늘', '내일', '오전', '오후', '시간', '분', '초'],
    // 어디서 (Where)  
    locationWords: ['지역', '구역', '시', '군', '구', '동', '읍', '면', '아파트', '건물'],
    // 무엇을 (What)
    disasterWords: Object.keys(DISASTER_TERMS),
    // 어떻게 (How)
    actionWords: ['대피', '피난', '이동', '연락', '신고', '조치', '확인', '준비']
  };
  
  let preservedElements = 0;
  let totalElements = 0;
  
  Object.values(keyElements).forEach(wordList => {
    wordList.forEach(word => {
      if (original.includes(word)) {
        totalElements++;
        // 역번역에서 의미적으로 유사한 표현이 있는지 확인
        if (checkSemanticPreservation(word, reverseTranslated)) {
          preservedElements++;
        }
      }
    });
  });
  
  return totalElements > 0 ? (preservedElements / totalElements) * 100 : 100;
};

const checkSemanticPreservation = (keyword: string, text: string): boolean => {
  // 키워드별 의미적으로 유사한 표현들 정의
  const semanticGroups: Record<string, string[]> = {
    '즉시': ['즉시', '바로', '곧바로', '신속', '급히', '서둘러'],
    '대피': ['대피', '피난', '벗어나', '떠나', '이동', '탈출'],
    '신고': ['신고', '신청', '연락', '통보', '알림', '보고'],
    '지진': ['지진', '진동', '흔들림', '땅', '지반'],
    '화재': ['화재', '불', '화염', '연기', '소방']
  };
  
  const relatedWords = semanticGroups[keyword] || [keyword];
  return relatedWords.some(word => text.includes(word));
};

const calculateSemanticConsistency = (original: string, reverseTranslated: string): number => {
  // 레벤슈타인 거리 기반 문자열 유사도
  const similarity = calculateLevenshteinSimilarity(original, reverseTranslated);
  
  // 문장 구조 유사성 (간단한 토큰 기반)
  const structuralSimilarity = calculateStructuralSimilarity(original, reverseTranslated);
  
  return (similarity * 0.6 + structuralSimilarity * 0.4);
};

const calculateLevenshteinSimilarity = (str1: string, str2: string): number => {
  const matrix = [];
  const len1 = str1.length;
  const len2 = str2.length;

  for (let i = 0; i <= len2; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= len1; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= len2; i++) {
    for (let j = 1; j <= len1; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  const distance = matrix[len2][len1];
  const maxLen = Math.max(len1, len2);
  return ((maxLen - distance) / maxLen) * 100;
};

const calculateStructuralSimilarity = (original: string, reverseTranslated: string): number => {
  const originalTokens = original.replace(/[^\w\s가-힣]/g, '').split(/\s+/).filter(Boolean);
  const reverseTokens = reverseTranslated.replace(/[^\w\s가-힣]/g, '').split(/\s+/).filter(Boolean);
  
  const commonTokens = originalTokens.filter(token => reverseTokens.includes(token));
  const maxTokens = Math.max(originalTokens.length, reverseTokens.length);
  
  return maxTokens > 0 ? (commonTokens.length / maxTokens) * 100 : 0;
};

const evaluateDisasterSpecificElements = (original: string, reverseTranslated: string): number => {
  // 긴급성 수준 평가
  const urgencyScore = evaluateUrgencyLevel(original, reverseTranslated);
  
  // 행동지침 명확성 평가
  const actionClarityScore = evaluateActionClarity(original, reverseTranslated);
  
  return (urgencyScore * 0.6 + actionClarityScore * 0.4);
};

const evaluateUrgencyLevel = (original: string, reverseTranslated: string): number => {
  const urgencyLevels = {
    high: ['즉시', '긴급', '위험', '경보'],
    medium: ['신속히', '주의', '조심', '경계'],
    low: ['참고', '안내', '알림', '확인']
  };
  
  let originalUrgency = 'low';
  let reverseUrgency = 'low';
  
  // 원문의 긴급도 판단
  if (urgencyLevels.high.some(word => original.includes(word))) {
    originalUrgency = 'high';
  } else if (urgencyLevels.medium.some(word => original.includes(word))) {
    originalUrgency = 'medium';
  }
  
  // 역번역의 긴급도 판단
  if (urgencyLevels.high.some(word => reverseTranslated.includes(word))) {
    reverseUrgency = 'high';
  } else if (urgencyLevels.medium.some(word => reverseTranslated.includes(word))) {
    reverseUrgency = 'medium';
  }
  
  return originalUrgency === reverseUrgency ? 100 : 60;
};

const evaluateActionClarity = (original: string, reverseTranslated: string): number => {
  const actionPatterns = [
    '대피하', '피난하', '이동하', '벗어나', '떠나',
    '신고하', '연락하', '알리',
    '준비하', '확인하', '점검하'
  ];
  
  let originalActions = 0;
  let preservedActions = 0;
  
  actionPatterns.forEach(pattern => {
    if (original.includes(pattern)) {
      originalActions++;
      if (reverseTranslated.includes(pattern) || 
          checkSemanticPreservation(pattern, reverseTranslated)) {
        preservedActions++;
      }
    }
  });
  
  return originalActions > 0 ? (preservedActions / originalActions) * 100 : 100;
};

// 2. 문화적 맥락 평가
const evaluateCulturalContext = (original: string, translated: string, targetLanguage: string): number => {
  let score = 100;
  let deductions = 0;
  
  Object.entries(CULTURAL_CONTEXT_TERMS).forEach(([term, data]) => {
    if (original.includes(term)) {
      const expectedTranslation = data.translations[targetLanguage];
      if (expectedTranslation && !translated.includes(expectedTranslation)) {
        deductions += 15; // 문화적 맥락 용어 오역 시 15점 차감
      }
    }
  });
  
  return Math.max(score - deductions, 0);
};

// 3. 동음이의어 처리 평가
const evaluateAmbiguousTerms = (original: string, translated: string, reverseTranslated: string): number => {
  let score = 100;
  let deductions = 0;
  
  Object.entries(AMBIGUOUS_TERMS).forEach(([term, data]) => {
    if (original.includes(term)) {
      // 문맥을 통해 올바른 의미 파악했는지 확인
      const contextClues = getContextClues(original, term);
      const correctContext = determineCorrectContext(term, contextClues);
      
      if (correctContext && data.translations[correctContext]) {
        const expectedTranslations = data.translations[correctContext];
        const hasCorrectTranslation = expectedTranslations.some(trans => 
          translated.toLowerCase().includes(trans.toLowerCase())
        );
        
        if (!hasCorrectTranslation) {
          deductions += 20; // 동음이의어 오역 시 20점 차감
        }
      }
    }
  });
  
  return Math.max(score - deductions, 0);
};

const getContextClues = (text: string, term: string): string[] => {
  const contextClues: Record<string, string[]> = {
    '수원': {
      '지명': ['시', '경기도', '화성', '용인', '지역'],
      '물': ['공급', '확보', '오염', '부족', '급수']
    },
    '전주': {
      '지명': ['시', '전라북도', '한옥마을', '지역'],
      '시간': ['지난', '전', '이전', '주간']
    }
  };
  
  const clues = contextClues[term];
  if (!clues) return [];
  
  const foundClues: string[] = [];
  Object.entries(clues).forEach(([context, keywords]) => {
    if (keywords.some(keyword => text.includes(keyword))) {
      foundClues.push(context);
    }
  });
  
  return foundClues;
};

const determineCorrectContext = (term: string, contextClues: string[]): string | null => {
  if (contextClues.length === 1) {
    return contextClues[0];
  }
  
  // 기본 추정 (더 정교한 로직 필요)
  const defaultContexts: Record<string, string> = {
    '수원': '지명',
    '전주': '지명',
    '광주': '전라남도'
  };
  
  return defaultContexts[term] || null;
};

// 4. 전문용어 사전 매칭 평가
const evaluateTerminologyAccuracy = (original: string, translated: string): number => {
  let totalTerms = 0;
  let accurateTerms = 0;
  
  Object.entries(DISASTER_TERMS).forEach(([koreanTerm, englishTerms]) => {
    if (original.includes(koreanTerm)) {
      totalTerms++;
      
      // 번역문에 표준 용어 중 하나가 포함되어 있는지 확인
      const hasStandardTerm = englishTerms.some(englishTerm => 
        translated.toLowerCase().includes(englishTerm.toLowerCase())
      );
      
      if (hasStandardTerm) {
        accurateTerms++;
      }
    }
  });
  
  return totalTerms > 0 ? (accurateTerms / totalTerms) * 100 : 100;
};

// 품질 등급 및 개선 제안
export const getQualityGrade = (score: number): { grade: string; status: string; color: string } => {
  if (score >= 90) return { grade: '우수', status: '즉시 사용 가능', color: 'emerald' };
  if (score >= 80) return { grade: '양호', status: '검토 후 사용', color: 'blue' };
  if (score >= 70) return { grade: '보통', status: '수정 필요', color: 'amber' };
  if (score >= 60) return { grade: '미흡', status: '재검토 필요', color: 'orange' };
  return { grade: '불량', status: '재번역 권장', color: 'red' };
};

export const generateImprovementSuggestions = (
  original: string, 
  translated: string, 
  reverseTranslated: string, 
  qualityScore: number,
  targetLanguage: string
): string[] => {
  const suggestions: string[] = [];
  
  // 문화적 맥락 용어 확인
  Object.entries(CULTURAL_CONTEXT_TERMS).forEach(([term, data]) => {
    if (original.includes(term)) {
      const expectedTranslation = data.translations[targetLanguage];
      if (expectedTranslation && !translated.includes(expectedTranslation)) {
        suggestions.push(`"${term}"을 "${expectedTranslation}"로 번역하고 문화적 맥락 설명 추가 필요`);
      }
    }
  });
  
  // 전문용어 확인
  Object.entries(DISASTER_TERMS).forEach(([koreanTerm, englishTerms]) => {
    if (original.includes(koreanTerm)) {
      const hasStandardTerm = englishTerms.some(englishTerm => 
        translated.toLowerCase().includes(englishTerm.toLowerCase())
      );
      
      if (!hasStandardTerm) {
        suggestions.push(`"${koreanTerm}"은 표준 용어 "${englishTerms[0]}" 사용 권장`);
      }
    }
  });
  
  // 긴급성 전달 확인
  const urgencyWords = ['즉시', '긴급', '신속히'];
  const hasUrgency = urgencyWords.some(word => original.includes(word));
  const hasReverseUrgency = urgencyWords.some(word => reverseTranslated.includes(word));
  
  if (hasUrgency && !hasReverseUrgency) {
    suggestions.push('긴급성 표현이 약화됨 - 더 강한 표현 사용 필요');
  }
  
  if (qualityScore < 70) {
    suggestions.push('전반적인 번역 품질 개선을 위해 재번역 검토 필요');
  }
  
  return suggestions.length > 0 ? suggestions : ['번역 품질이 양호합니다'];
};
