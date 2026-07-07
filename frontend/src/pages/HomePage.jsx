import SectionHeader from '../components/common/SectionHeader.jsx'
import OverviewPanel from '../components/common/OverviewPanel.jsx'
import MetricCard from '../components/common/DataCard.jsx'
import ActionCard from '../components/common/ActionCard.jsx'

export default function HomePage() {
  return (
    <main className="space-y-8 p-6">
      <SectionHeader title="Dashboard" description="Overview of your learning progress and activity." />
      <OverviewPanel />
      <div className="grid gap-4 lg:grid-cols-3">
        <MetricCard label="Concepts Learned" value="24" footnote="+4 this week" />
        <MetricCard label="Daily Streak" value="7" footnote="Keep it going" />
        <ActionCard title="Continue learning" description="Resume your current learning path." actionLabel="Resume" onAction={() => {}} />
      </div>
    </main>
  )
}
