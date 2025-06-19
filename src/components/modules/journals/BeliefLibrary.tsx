
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface BeliefLibraryProps {
  beliefs: any[];
}

export const BeliefLibrary = ({ beliefs }: BeliefLibraryProps) => {
  const uniqueBeliefs = beliefs?.reduce((acc, belief) => {
    if (belief.entry_type === 'belief' && !acc.some(b => b.content === belief.content)) {
      acc.push(belief);
    }
    return acc;
  }, [] as any[]) || [];

  const selfBeliefs = uniqueBeliefs.filter(b => b.insights === 'self');
  const othersBeliefs = uniqueBeliefs.filter(b => b.insights === 'others');

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Beliefs About Myself</CardTitle>
        </CardHeader>
        <CardContent>
          {selfBeliefs.length > 0 ? (
            <div className="space-y-2">
              {selfBeliefs.slice(0, 5).map((belief) => (
                <div key={belief.id} className="text-sm p-2 bg-gray-50 rounded border-l-4 border-l-red-300">
                  {belief.content}
                </div>
              ))}
              {selfBeliefs.length > 5 && (
                <div className="text-xs text-muted-foreground">
                  +{selfBeliefs.length - 5} more beliefs tracked
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No recurring beliefs about yourself tracked yet.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Beliefs About Others</CardTitle>
        </CardHeader>
        <CardContent>
          {othersBeliefs.length > 0 ? (
            <div className="space-y-2">
              {othersBeliefs.slice(0, 5).map((belief) => (
                <div key={belief.id} className="text-sm p-2 bg-gray-50 rounded border-l-4 border-l-orange-300">
                  {belief.content}
                </div>
              ))}
              {othersBeliefs.length > 5 && (
                <div className="text-xs text-muted-foreground">
                  +{othersBeliefs.length - 5} more beliefs tracked
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No recurring beliefs about others tracked yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
