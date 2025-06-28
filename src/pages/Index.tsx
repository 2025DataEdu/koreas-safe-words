
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
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getQualityIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="w-5 h-5 text-green-600" />;
    if (score >= 60) return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
    return <XCircle className="w-5 h-5 text-red-600" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* 헤더 */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Shield className="w-8 h-8 text-red-600" />
            <h1 className="text-4xl font-bold text-gray-900">재난문자 다국어 번역 시스템</h1>
            <Globe className="w-8 h-8 text-red-600" />
          </div>
          <p className="text-lg text-gray-600">
            행정안전부 재난문자를 정확하고 신속하게 다국어로 번역합니다
          </p>
        </div>

        {/* 탭 네비게이션 */}
        <div className="flex justify-center space-x-4">
          {[
            { id: 'translate', label: '번역', icon: Globe },
            { id: 'dictionary', label: '사전 관리', icon: Shield },
            { id: 'history', label: '번역 이력', icon: RefreshCw }
          ].map(tab => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? 'default' : 'outline'}
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-2"
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </Button>
          ))}
        </div>

        {activeTab === 'translate' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 입력 섹션 */}
            <Card className="border-2 border-red-200">
              <CardHeader className="bg-red-50">
                <CardTitle className="flex items-center gap-2 text-red-700">
                  <AlertTriangle className="w-5 h-5" />
                  재난문자 입력
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div>
                  <label className="block text-sm font-medium mb-2">API 키</label>
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="OpenAI API 키를 입력하세요"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">원문 (한국어)</label>
                  <Textarea
                    value={originalText}
                    onChange={(e) => setOriginalText(e.target.value)}
                    placeholder="재난문자 내용을 입력하세요..."
                    className="min-h-32 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">번역 언어</label>
                  <Select value={targetLanguage} onValueChange={setTargetLanguage}>
                    <SelectTrigger>
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
                  className="w-full bg-red-600 hover:bg-red-700"
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

            {/* 결과 섹션 */}
            <Card className="border-2 border-green-200">
              <CardHeader className="bg-green-50">
                <CardTitle className="flex items-center gap-2 text-green-700">
                  <CheckCircle className="w-5 h-5" />
                  번역 결과
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                {targetLanguage && translations[targetLanguage] ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">번역문</label>
                      <div className="p-3 bg-gray-50 rounded-md border">
                        {translations[targetLanguage].translated}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">역번역 검증</label>
                      <div className="p-3 bg-blue-50 rounded-md border">
                        {translations[targetLanguage].reverseTranslated}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getQualityIcon(translations[targetLanguage].qualityScore)}
                        <span className={`font-medium ${getQualityColor(translations[targetLanguage].qualityScore)}`}>
                          품질 점수: {translations[targetLanguage].qualityScore}%
                        </span>
                      </div>
                    </div>

                    {translations[targetLanguage].warnings.length > 0 && (
                      <Alert className="border-yellow-200 bg-yellow-50">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          <div className="space-y-1">
                            {translations[targetLanguage].warnings.map((warning: string, index: number) => (
                              <Badge key={index} variant="outline" className="mr-2">
                                {warning}
                              </Badge>
                            ))}
                          </div>
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    번역 결과가 여기에 표시됩니다
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'dictionary' && <DictionaryManager />}
        {activeTab === 'history' && <TranslationHistory translations={translations} />}
      </div>
    </div>
  );
};

export default Index;
