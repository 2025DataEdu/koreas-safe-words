import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, XCircle, RefreshCw, Globe, Shield } from 'lucide-react';
import { translateText, reverseTranslateText } from '@/utils/translationService';
import { getTranslationQuality } from '@/utils/qualityChecker';
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
  const [targetLanguage, setTargetLanguage] = useState('');
  const [translations, setTranslations] = useState<Record<string, any>>({});
  const [isTranslating, setIsTranslating] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [activeTab, setActiveTab] = useState('translate');

  const handleTranslate = async () => {
    if (!originalText.trim() || !targetLanguage || !apiKey) {
      alert('원문, 대상 언어, API 키를 모두 입력해주세요.');
      return;
    }

    setIsTranslating(true);
    
    try {
      // 1단계: 기본 번역
      const translated = await translateText(originalText, targetLanguage, apiKey);
      
      // 2단계: 역번역으로 검증
      const reverseTranslated = await reverseTranslateText(translated, targetLanguage, apiKey);
      
      // 3단계: 품질 평가
      const qualityScore = getTranslationQuality(originalText, reverseTranslated);
      
      setTranslations(prev => ({
        ...prev,
        [targetLanguage]: {
          original: originalText,
          translated,
          reverseTranslated,
          qualityScore,
          timestamp: new Date().toISOString(),
          warnings: checkForWarnings(originalText, translated)
        }
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

  return (
    <div className="min-h-screen bg-slate-50">
      {/* 깔끔한 헤더 */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-center gap-4">
            <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                재난문자 다국어 번역 시스템
              </h1>
              <p className="text-slate-600 mt-1">
                Emergency Message Multi-language Translation System
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* 탭 네비게이션 - 미니멀한 스타일 */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-xl p-2 shadow-sm border border-slate-200">
            {[
              { id: 'translate', label: '번역', icon: Globe },
              { id: 'dictionary', label: '사전 관리', icon: Shield },
              { id: 'history', label: '번역 이력', icon: RefreshCw }
            ].map(tab => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? 'default' : 'ghost'}
                onClick={() => setActiveTab(tab.id)}
                className="flex items-center gap-2 px-6 py-2 text-sm font-medium"
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </Button>
            ))}
          </div>
        </div>

        {activeTab === 'translate' && (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {/* 입력 섹션 - 깔끔한 카드 스타일 */}
            <Card className="shadow-sm border-slate-200">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-slate-900 text-lg font-semibold">
                  <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="w-4 h-4 text-slate-700" />
                  </div>
                  재난문자 입력
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">API 키</label>
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="OpenAI API 키를 입력하세요"
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent text-sm"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">원문 (한국어)</label>
                  <Textarea
                    value={originalText}
                    onChange={(e) => setOriginalText(e.target.value)}
                    placeholder="재난문자 내용을 입력하세요..."
                    className="min-h-32 resize-none border-slate-200 focus:ring-slate-900 focus:border-transparent"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">번역 언어</label>
                  <Select value={targetLanguage} onValueChange={setTargetLanguage}>
                    <SelectTrigger className="border-slate-200 focus:ring-slate-900">
                      <SelectValue placeholder="번역할 언어를 선택하세요" />
                    </SelectTrigger>
                    <SelectContent>
                      {SUPPORTED_LANGUAGES.map(lang => (
                        <SelectItem key={lang.code} value={lang.code}>
                          <span className="flex items-center gap-2">
                            <span>{lang.flag}</span>
                            {lang.name}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={handleTranslate}
                  disabled={isTranslating}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-lg font-medium"
                >
                  {isTranslating ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      번역 중...
                    </>
                  ) : (
                    <>
                      <Globe className="w-4 h-4 mr-2" />
                      번역 실행
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* 결과 섹션 - 깔끔한 카드 스타일 */}
            <Card className="shadow-sm border-slate-200">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-slate-900 text-lg font-semibold">
                  <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-emerald-700" />
                  </div>
                  번역 결과
                </CardTitle>
              </CardHeader>
              <CardContent>
                {targetLanguage && translations[targetLanguage] ? (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">번역문</label>
                      <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-slate-900">
                        {translations[targetLanguage].translated}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">역번역 검증</label>
                      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 text-slate-900">
                        {translations[targetLanguage].reverseTranslated}
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-slate-200">
                      <div className="flex items-center gap-3">
                        {getQualityIcon(translations[targetLanguage].qualityScore)}
                        <span className={`font-medium ${getQualityColor(translations[targetLanguage].qualityScore)}`}>
                          품질 점수: {translations[targetLanguage].qualityScore}%
                        </span>
                      </div>
                    </div>

                    {translations[targetLanguage].warnings.length > 0 && (
                      <Alert className="border-amber-200 bg-amber-50">
                        <AlertTriangle className="h-4 w-4 text-amber-600" />
                        <AlertDescription>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {translations[targetLanguage].warnings.map((warning: string, index: number) => (
                              <Badge key={index} variant="outline" className="border-amber-300 text-amber-700 bg-amber-50">
                                {warning}
                              </Badge>
                            ))}
                          </div>
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Globe className="w-8 h-8 text-slate-400" />
                    </div>
                    <p className="text-slate-500 text-sm">번역 결과가 여기에 표시됩니다</p>
                  </div>
                )}
              </CardContent>
            </Card>
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
