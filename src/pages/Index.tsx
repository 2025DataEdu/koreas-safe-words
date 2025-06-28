import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, XCircle, RefreshCw, Globe, Shield } from 'lucide-react';
import { translateText, reverseTranslateText } from '@/utils/translationService';
import { getTranslationQuality, generateImprovementSuggestions } from '@/utils/qualityChecker';
import { DISASTER_TERMS, AMBIGUOUS_TERMS } from '@/utils/dictionaries';
import DictionaryManager from '@/components/DictionaryManager';
import TranslationHistory from '@/components/TranslationHistory';

const SUPPORTED_LANGUAGES = [
  { code: 'en', name: '영어 (English)', flag: '🇺🇸' },
  { code: 'zh', name: '중국어 (中文)', flag: '🇨🇳' },
  { code: 'ja', name: '일본어 (日本語)', flag: '🇯🇵' },
  { code: 'vi', name: '베트남어 (Tiếng Việt)', flag: '🇻🇳' },
  { code: 'th', name: '태국어 (ไทย)', flag: '🇹🇭' },
];

const Index = () => {
  const [originalText, setOriginalText] = useState('');
  const [translations, setTranslations] = useState<Record<string, any>>({});
  const [isTranslating, setIsTranslating] = useState(false);
  const [apiKey, setApiKey] = useState('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');
  const [activeTab, setActiveTab] = useState('translate');

  const handleTranslateAll = async () => {
    if (!originalText.trim() || !apiKey) {
      alert('원문과 API 키를 모두 입력해주세요.');
      return;
    }

    setIsTranslating(true);
    const newTranslations: Record<string, any> = {};
    
    try {
      // 모든 언어에 대해 동시에 번역 시작
      const translationPromises = SUPPORTED_LANGUAGES.map(async (language) => {
        try {
          // 1단계: 기본 번역
          const translated = await translateText(originalText, language.code, apiKey);
          
          // 2단계: 역번역으로 검증
          const reverseTranslated = await reverseTranslateText(translated, language.code, apiKey);
          
          // 3단계: 개선된 품질 평가 (문화적 맥락, 사전 기반 포함)
          const qualityScore = getTranslationQuality(originalText, reverseTranslated, translated, language.code);
          
          // 4단계: 개선 제안 생성
          const improvementSuggestions = generateImprovementSuggestions(
            originalText, 
            translated, 
            reverseTranslated, 
            qualityScore,
            language.code
          );
          
          return {
            langCode: language.code,
            result: {
              original: originalText,
              translated,
              reverseTranslated,
              qualityScore,
              timestamp: new Date().toISOString(),
              warnings: checkForWarnings(originalText, translated),
              improvementSuggestions
            }
          };
        } catch (error) {
          console.error(`Translation error for ${language.code}:`, error);
          return {
            langCode: language.code,
            result: {
              original: originalText,
              translated: '번역 실패',
              reverseTranslated: '번역 실패',
              qualityScore: 0,
              timestamp: new Date().toISOString(),
              warnings: ['번역 중 오류가 발생했습니다.'],
              improvementSuggestions: ['번역 서비스 연결을 확인해주세요.']
            }
          };
        }
      });

      // 모든 번역 결과 대기
      const results = await Promise.all(translationPromises);
      
      // 결과를 상태에 저장
      results.forEach(({ langCode, result }) => {
        newTranslations[langCode] = result;
      });
      
      setTranslations(prev => ({
        ...prev,
        ...newTranslations
      }));
      
    } catch (error) {
      console.error('Translation error:', error);
      alert('번역 중 오류가 발생했습니다.');
    } finally {
      setIsTranslating(false);
    }
  };

  const checkForWarnings = (original: string, translated: string) => {
    const warnings = [];
    
    // 동음이의어 체크
    Object.keys(AMBIGUOUS_TERMS).forEach(term => {
      if (original.includes(term)) {
        warnings.push(`동음이의어 "${term}" 감지됨`);
      }
    });
    
    // 재난 용어 체크
    Object.keys(DISASTER_TERMS).forEach(term => {
      if (original.includes(term)) {
        warnings.push(`재난 전문용어 "${term}" 포함됨`);
      }
    });
    
    return warnings;
  };

  const getQualityColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600';
    if (score >= 60) return 'text-amber-600';
    return 'text-red-500';
  };

  const getQualityIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="w-4 h-4 text-emerald-600" />;
    if (score >= 60) return <AlertTriangle className="w-4 h-4 text-amber-600" />;
    return <XCircle className="w-4 h-4 text-red-500" />;
  };

  const getLanguageName = (code: string) => {
    const lang = SUPPORTED_LANGUAGES.find(l => l.code === code);
    return lang ? lang.name : code;
  };

  return (
    <div className="min-h-screen bg-slate-50 font-noto">
      {/* 깔끔한 헤더 */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-center gap-6">
            <div className="w-20 h-20 flex items-center justify-center">
              <img 
                src="/lovable-uploads/9d5eb76b-881b-45b8-ab74-0f914ae40cd2.png" 
                alt="행정안전부 로고" 
                className="w-20 h-20 object-contain"
              />
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight font-noto">
                재난문자 다국어 번역 시스템
              </h1>
              <p className="text-slate-600 mt-1 font-normal">
                Emergency Message Multi-language Translation System
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* 탭 네비게이션 - 개선된 스타일 */}
        <div className="flex justify-center mb-8">
          <div className="w-full max-w-2xl bg-white rounded-xl p-2 shadow-sm border border-slate-200">
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'translate', label: '번역', icon: Globe },
                { id: 'dictionary', label: '사전 관리', icon: Shield },
                { id: 'history', label: '번역 이력', icon: RefreshCw }
              ].map(tab => (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? 'default' : 'ghost'}
                  onClick={() => setActiveTab(tab.id)}
                  className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium font-noto w-full"
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {activeTab === 'translate' && (
          <div className="space-y-8">
            {/* 입력 섹션 - 깔끔한 카드 스타일 */}
            <Card className="shadow-sm border-slate-200">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-slate-900 text-lg font-semibold font-noto">
                  <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="w-4 h-4 text-slate-700" />
                  </div>
                  재난문자 입력
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 font-noto">원문 (한국어)</label>
                  <Textarea
                    value={originalText}
                    onChange={(e) => setOriginalText(e.target.value)}
                    placeholder="재난문자 내용을 입력하세요..."
                    className="min-h-32 resize-none border-slate-200 focus:ring-slate-900 focus:border-transparent font-noto"
                  />
                </div>

                <Button
                  onClick={handleTranslateAll}
                  disabled={isTranslating}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-lg font-medium font-noto"
                >
                  {isTranslating ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      모든 언어 번역 중...
                    </>
                  ) : (
                    <>
                      <Globe className="w-4 h-4 mr-2" />
                      모든 언어로 번역 실행
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* 결과 섹션 - 개선된 번역 결과 표시 */}
            {Object.keys(translations).length > 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {SUPPORTED_LANGUAGES.map(language => (
                  translations[language.code] && (
                    <Card key={language.code} className="shadow-sm border-slate-200">
                      <CardHeader className="pb-4">
                        <CardTitle className="flex items-center gap-3 text-slate-900 text-lg font-semibold font-noto">
                          <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                            <span className="text-lg">{language.flag}</span>
                          </div>
                          {language.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-6">
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 font-noto">번역문</label>
                            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-slate-900 font-noto">
                              {translations[language.code].translated}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 font-noto">역번역 검증</label>
                            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 text-slate-900 font-noto">
                              {translations[language.code].reverseTranslated}
                            </div>
                          </div>

                          <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-slate-200">
                            <div className="flex items-center gap-3">
                              {getQualityIcon(translations[language.code].qualityScore)}
                              <span className={`font-medium font-noto ${getQualityColor(translations[language.code].qualityScore)}`}>
                                품질 점수: {translations[language.code].qualityScore}%
                              </span>
                            </div>
                          </div>

                          {/* 개선 제안 섹션 추가 */}
                          {translations[language.code].improvementSuggestions && translations[language.code].improvementSuggestions.length > 0 && (
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-slate-700 font-noto">개선 제안</label>
                              <div className="space-y-2">
                                {translations[language.code].improvementSuggestions.map((suggestion: string, index: number) => (
                                  <div key={index} className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                                    <span className="text-sm text-amber-800 font-noto">{suggestion}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {translations[language.code].warnings.length > 0 && (
                            <Alert className="border-amber-200 bg-amber-50">
                              <AlertTriangle className="h-4 w-4 text-amber-600" />
                              <AlertDescription>
                                <div className="flex flex-wrap gap-2 mt-2">
                                  {translations[language.code].warnings.map((warning: string, index: number) => (
                                    <Badge key={index} variant="outline" className="border-amber-300 text-amber-700 bg-amber-50 font-noto">
                                      {warning}
                                    </Badge>
                                  ))}
                                </div>
                              </AlertDescription>
                            </Alert>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )
                ))}
              </div>
            )}

            {/* 번역 결과가 없을 때 표시 */}
            {Object.keys(translations).length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-8 h-8 text-slate-400" />
                </div>
                <p className="text-slate-500 text-sm font-noto">모든 언어의 번역 결과가 여기에 표시됩니다</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'dictionary' && (
          <div className="max-w-4xl mx-auto">
            <DictionaryManager />
          </div>
        )}
        
        {activeTab === 'history' && (
          <div className="max-w-6xl mx-auto">
            <TranslationHistory translations={translations} />
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
