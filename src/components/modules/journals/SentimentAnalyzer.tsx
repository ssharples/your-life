
import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, Meh, Frown, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { aiInsightsEngine } from '@/utils/aiInsights';

interface SentimentAnalyzerProps {
  content: string;
  onSentimentChange?: (sentiment: number) => void;
}

export const SentimentAnalyzer = ({ content, onSentimentChange }: SentimentAnalyzerProps) => {
  const [sentiment, setSentiment] = useState<number | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    if (content.length > 10) {
      analyzeSentiment();
    } else {
      setSentiment(null);
    }
  }, [content]);

  const analyzeSentiment = async () => {
    setIsAnalyzing(true);
    try {
      const result = await aiInsightsEngine.generateSentimentAnalysis(content);
      setSentiment(result);
      onSentimentChange?.(result);
    } catch (error) {
      console.error('Sentiment analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getSentimentLabel = (score: number) => {
    if (score > 0.3) return 'Positive';
    if (score < -0.3) return 'Negative';
    return 'Neutral';
  };

  const getSentimentIcon = (score: number) => {
    if (score > 0.3) return <Heart className="h-3 w-3 text-green-500" />;
    if (score < -0.3) return <Frown className="h-3 w-3 text-red-500" />;
    return <Meh className="h-3 w-3 text-gray-500" />;
  };

  const getSentimentColor = (score: number) => {
    if (score > 0.3) return 'bg-green-500';
    if (score < -0.3) return 'bg-red-500';
    return 'bg-gray-500';
  };

  if (!content || content.length < 10) {
    return null;
  }

  return (
    <Card className="w-full">
      <CardContent className="p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">Sentiment:</span>
            {isAnalyzing ? (
              <Badge variant="outline" className="animate-pulse">Analyzing...</Badge>
            ) : sentiment !== null ? (
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="flex items-center gap-1">
                  {getSentimentIcon(sentiment)}
                  {getSentimentLabel(sentiment)}
                </Badge>
                <div className="flex items-center gap-1">
                  <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-300 ${getSentimentColor(sentiment)}`}
                      style={{ width: `${Math.abs(sentiment) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {sentiment > 0 ? '+' : ''}{(sentiment * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            ) : null}
          </div>
          
          {sentiment !== null && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              {sentiment > 0.1 ? (
                <TrendingUp className="h-3 w-3 text-green-500" />
              ) : sentiment < -0.1 ? (
                <TrendingDown className="h-3 w-3 text-red-500" />
              ) : (
                <Minus className="h-3 w-3 text-gray-500" />
              )}
              AI Analysis
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
