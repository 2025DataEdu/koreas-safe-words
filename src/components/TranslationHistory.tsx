
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertTriangle, XCircle, Clock } from 'lucide-react';

interface TranslationRecord {
  original: string;
  translated: string;
  reverseTranslated: string;
  qualityScore: number;
  timestamp: string;
  warnings: string[];
}

interface TranslationHistoryProps {
  translations: Record<string, TranslationRecord>;
}

const TranslationHistory: React.FC<TranslationHistoryProps> = ({ translations }) => {
  const getQualityIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="w-5 h-5 text-green-600" />;
    if (score >= 60) return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
    return <XCircle className="w-5 h-5 text-red-600" />;
  };

  const getQualityColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getLanguageName = (code: string) => {
    const languages: Record<string, string> = {
      'en': '영어',
      'zh': '중국어',
      'ja': '일본어',
      'vi': '베트남어',
      'th': '태국어'
    };
    return languages[code] || code;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            번역 이력
          </CardTitle>
        </CardHeader>
        <CardContent>
          {Object.keys(translations).length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              번역 이력이 없습니다
            </div>
          ) : (
            <div className="space-y-4">
              {Object.entries(translations).map(([langCode, record]) => (
                <Card key={`${langCode}-${record.timestamp}`} className="border-l-4 border-blue-500">
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="font-medium">
                          {getLanguageName(langCode)}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          {formatDate(record.timestamp)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {getQualityIcon(record.qualityScore)}
                        <span className={`font-medium ${getQualityColor(record.qualityScore)}`}>
                          {record.qualityScore}%
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          원문
                        </label>
                        <div className="p-3 bg-gray-50 rounded-md border text-sm">
                          {record.original}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          번역문
                        </label>
                        <div className="p-3 bg-blue-50 rounded-md border text-sm">
                          {record.translated}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          역번역 검증
                        </label>
                        <div className="p-3 bg-green-50 rounded-md border text-sm">
                          {record.reverseTranslated}
                        </div>
                      </div>

                      {record.warnings.length > 0 && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            주의사항
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {record.warnings.map((warning, index) => (
                              <Badge key={index} variant="outline" className="text-orange-600 border-orange-200">
                                {warning}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TranslationHistory;
