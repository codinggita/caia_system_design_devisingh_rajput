import SearchBar from '../components/common/SearchBar.jsx'
import SearchResultItem from '../components/common/SearchResultItem.jsx'

const sampleResults = [
  { title: 'System Design Basics', description: 'A quick concept summary.', url: '/concepts/system-design' },
  { title: 'Learning Path', description: 'Browse curated learning paths.', url: '/learning-paths' },
]

export default function SearchPage() {
  return (
    <main className="space-y-6 p-6">
      <SearchBar placeholder="Search concepts, paths, or notes" />
      <div className="space-y-4">
        {sampleResults.map((result) => (
          <SearchResultItem key={result.title} {...result} />
        ))}
      </div>
    </main>
  )
}
