
export const getTranslationQuality = (original: string, reverseTranslated: string): number => {
  // 간단한 유사도 검사 알고리즘
  const similarity = calculateSimilarity(original, reverseTranslated);
  
  // 긴급도 키워드 보존 검사
  const urgencyScore = checkUrgencyPreservation(original, reverseTranslated);
  
  // 재난 용어 정확도 검사
  const terminologyScore = checkTerminologyAccuracy(original, reverseTranslated);
  
  // 가중평균으로 최종 점수 계산
  const finalScore = (similarity * 0.4) + (urgencyScore * 0.3) + (terminologyScore * 0.3);
  
  return Math.round(finalScore);
};

const calculateSimilarity = (str1: string, str2: string): number => {
  // 레벤슈타인 거리 기반 유사도 계산
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

const checkUrgencyPreservation = (original: string, reverseTranslated: string): number => {
  const urgencyKeywords = [
    '긴급', '즉시', '대피', '주의', '경보', '위험', '피해', '재난',
    '신속히', '안전', '조치', '대응', '경계', '피하', '벗어나'
  ];
  
  let preservedCount = 0;
  let totalUrgencyWords = 0;
  
  urgencyKeywords.forEach(keyword => {
    if (original.includes(keyword)) {
      totalUrgencyWords++;
      // 역번역에서 의미가 보존되었는지 확인 (단순화된 검사)
      const relatedWords = getRelatedWords(keyword);
      if (relatedWords.some(word => reverseTranslated.includes(word))) {
        preservedCount++;
      }
    }
  });
  
  return totalUrgencyWords > 0 ? (preservedCount / totalUrgencyWords) * 100 : 100;
};

const checkTerminologyAccuracy = (original: string, reverseTranslated: string): number => {
  const disasterTerms = [
    '지진', '태풍', '폭우', '산사태', '화재', '홍수', '가뭄', '폭설',
    '풍랑', '여진', '쓰나미', '화산', '황사', '미세먼지'
  ];
  
  let accurateTerms = 0;
  let totalTerms = 0;
  
  disasterTerms.forEach(term => {
    if (original.includes(term)) {
      totalTerms++;
      if (reverseTranslated.includes(term)) {
        accurateTerms++;
      }
    }
  });
  
  return totalTerms > 0 ? (accurateTerms / totalTerms) * 100 : 100;
};

const getRelatedWords = (keyword: string): string[] => {
  const relatedWordsMap: Record<string, string[]> = {
    '긴급': ['긴급', '응급', '급한', '시급'],
    '즉시': ['즉시', '바로', '곧바로', '신속'],
    '대피': ['대피', '피난', '벗어나', '떠나'],
    '주의': ['주의', '조심', '경계', '유의'],
    '경보': ['경보', '경고', '알림', '통보'],
    '위험': ['위험', '위험한', '유해', '해로운']
  };
  
  return relatedWordsMap[keyword] || [keyword];
};
