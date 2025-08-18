import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { VocabWord } from '@/types/vocab'

interface VocabCardProps {
  word: VocabWord
  showDefinition?: boolean
  onNext?: () => void
  onPrevious?: () => void
  onFlip?: (isFlipped: boolean) => void
}

export function VocabCard({ word, showDefinition = false, onNext, onPrevious, onFlip }: VocabCardProps) {
  const [isFlipped, setIsFlipped] = useState(showDefinition)

  const handleFlip = () => {
    const newFlipped = !isFlipped
    setIsFlipped(newFlipped)
    onFlip?.(newFlipped)
  }

  return (
    <Card className="w-full max-w-md mx-auto min-h-[300px] cursor-pointer" onClick={handleFlip}>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">
          {!isFlipped ? word.word : word.definition}
        </CardTitle>
        {!isFlipped && word.pronunciation && (
          <p className="text-sm text-muted-foreground">{word.pronunciation}</p>
        )}
      </CardHeader>
      
      <CardContent className="text-center space-y-4">
        {isFlipped ? (
          <div className="space-y-3">
            <div>
              <p className="text-lg font-medium">{word.word}</p>
              {word.pronunciation && (
                <p className="text-sm text-muted-foreground">{word.pronunciation}</p>
              )}
            </div>
            
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">품사</p>
              <p className="text-sm">{word.partOfSpeech}</p>
            </div>
            
            {word.examples.length > 0 && (
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">예문</p>
                <div className="space-y-1">
                  {word.examples.slice(0, 2).map((example, index) => (
                    <p key={index} className="text-sm italic">
                      &quot;{example}&quot;
                    </p>
                  ))}
                </div>
              </div>
            )}
            
            {word.synonyms && word.synonyms.length > 0 && (
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">유의어</p>
                <p className="text-sm">{word.synonyms.join(', ')}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="py-8">
            <p className="text-sm text-muted-foreground mb-2">카드를 클릭하여 뜻 보기</p>
            <div className="flex gap-2 justify-center items-center">
              <span className={`px-2 py-1 rounded text-xs ${
                word.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                word.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {word.difficulty === 'beginner' ? '초급' :
                 word.difficulty === 'intermediate' ? '중급' : '고급'}
              </span>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                {word.category}
              </span>
            </div>
          </div>
        )}
        
        <div className="flex gap-2 justify-center pt-4" onClick={(e) => e.stopPropagation()}>
          {onPrevious && (
            <Button variant="outline" onClick={onPrevious}>
              이전
            </Button>
          )}
          {onNext && (
            <Button onClick={onNext}>
              다음
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}