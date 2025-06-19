
import { JournalsGuide } from '@/components/guides/JournalsGuide';
import { useHelp } from '@/contexts/HelpContext';
import { useJournalData } from './journals/hooks/useJournalData';
import { BeliefFormDialog } from './journals/BeliefFormDialog';
import { TodayProgress } from './journals/TodayProgress';
import { BeliefLibrary } from './journals/BeliefLibrary';

export const Journals = () => {
  const { showHelp } = useHelp();
  const { beliefs, todayEntries, createBelief } = useJournalData();

  return (
    <div className="space-y-6">
      {showHelp && <JournalsGuide />}
      
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Mindset Journal</h2>
          <p className="text-muted-foreground">Transform negative beliefs into empowering affirmations</p>
        </div>
        <BeliefFormDialog beliefs={beliefs || []} createBelief={createBelief} />
      </div>

      <TodayProgress todayEntries={todayEntries || []} />
      <BeliefLibrary beliefs={beliefs || []} />
    </div>
  );
};
