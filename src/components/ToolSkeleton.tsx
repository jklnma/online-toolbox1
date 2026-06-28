export default function ToolSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
      <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
      <div className="grid grid-cols-2 gap-3">
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
      <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
      <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
    </div>
  )
}
