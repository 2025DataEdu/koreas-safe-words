
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Trash2, Edit, Save, X } from 'lucide-react';
import { DISASTER_TERMS, AMBIGUOUS_TERMS, CULTURAL_CONTEXT_TERMS } from '@/utils/dictionaries';

const DictionaryManager = () => {
  const [editingTerm, setEditingTerm] = useState<string | null>(null);
  const [newTerm, setNewTerm] = useState({ korean: '', translations: [''] });
  const [isAddingNew, setIsAddingNew] = useState(false);

  const handleAddTranslation = () => {
    setNewTerm(prev => ({
      ...prev,
      translations: [...prev.translations, '']
    }));
  };

  const handleRemoveTranslation = (index: number) => {
    setNewTerm(prev => ({
      ...prev,
      translations: prev.translations.filter((_, i) => i !== index)
    }));
  };

  const handleSaveNewTerm = () => {
    if (newTerm.korean && newTerm.translations.some(t => t.trim())) {
      // 실제로는 여기서 사전에 추가하는 로직이 들어갑니다
      console.log('새 용어 추가:', newTerm);
      setNewTerm({ korean: '', translations: [''] });
      setIsAddingNew(false);
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="disaster" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="disaster">재난 용어</TabsTrigger>
          <TabsTrigger value="ambiguous">동음이의어</TabsTrigger>
          <TabsTrigger value="cultural">문화적 맥락</TabsTrigger>
        </TabsList>

        <TabsContent value="disaster" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>재난 전문용어 사전</CardTitle>
              <Button
                onClick={() => setIsAddingNew(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                용어 추가
              </Button>
            </CardHeader>
            <CardContent>
              {isAddingNew && (
                <Card className="mb-4 border-2 border-blue-200">
                  <CardContent className="pt-4">
                    <div className="space-y-3">
                      <Input
                        placeholder="한국어 용어"
                        value={newTerm.korean}
                        onChange={(e) => setNewTerm(prev => ({ ...prev, korean: e.target.value }))}
                      />
                      
                      {newTerm.translations.map((translation, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            placeholder={`번역 ${index + 1}`}
                            value={translation}
                            onChange={(e) => {
                              const newTranslations = [...newTerm.translations];
                              newTranslations[index] = e.target.value;
                              setNewTerm(prev => ({ ...prev, translations: newTranslations }));
                            }}
                          />
                          {newTerm.translations.length > 1 && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRemoveTranslation(index)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                      
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleAddTranslation}
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          번역 추가
                        </Button>
                        <Button
                          size="sm"
                          onClick={handleSaveNewTerm}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Save className="w-4 h-4 mr-1" />
                          저장
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setIsAddingNew(false);
                            setNewTerm({ korean: '', translations: [''] });
                          }}
                        >
                          <X className="w-4 h-4 mr-1" />
                          취소
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="grid gap-4">
                {Object.entries(DISASTER_TERMS).map(([korean, translations]) => (
                  <Card key={korean} className="border border-gray-200">
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg text-red-700 mb-2">{korean}</h3>
                          <div className="flex flex-wrap gap-2">
                            {translations.map((translation, index) => (
                              <Badge key={index} variant="secondary">
                                {translation}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingTerm(korean)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ambiguous" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>동음이의어 관리</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {Object.entries(AMBIGUOUS_TERMS).map(([term, data]) => (
                  <Card key={term} className="border border-yellow-200 bg-yellow-50">
                    <CardContent className="pt-4">
                      <h3 className="font-semibold text-lg text-yellow-800 mb-2">{term}</h3>
                      <div className="space-y-2">
                        {data.contexts.map((context, index) => (
                          <div key={context} className="pl-4 border-l-2 border-yellow-300">
                            <p className="font-medium text-yellow-700">{context}</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {data.translations[context]?.map((translation, tIndex) => (
                                <Badge key={tIndex} variant="outline" className="bg-white">
                                  {translation}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cultural" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>문화적 맥락 용어</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {Object.entries(CULTURAL_CONTEXT_TERMS).map(([term, data]) => (
                  <Card key={term} className="border border-purple-200 bg-purple-50">
                    <CardContent className="pt-4">
                      <h3 className="font-semibold text-lg text-purple-800 mb-2">{term}</h3>
                      <p className="text-sm text-purple-600 mb-3">{data.explanation}</p>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {Object.entries(data.translations).map(([lang, translation]) => (
                          <div key={lang} className="flex items-center gap-2">
                            <Badge variant="outline" className="bg-white">
                              {lang.toUpperCase()}
                            </Badge>
                            <span className="text-sm">{translation}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DictionaryManager;
