

export default async function GroupsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex">
      <main className="flex-1">
        {children}
      </main>
    </div>
  )
}
