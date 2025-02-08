import { getGroups } from "@/actions/groups";

export default async function GroupsLayout({ children }: { children: React.ReactNode }) {
  const groups = await getGroups();

  return (
    <div>
      {/* Render children (either GroupsPage or GroupDetailsPage) */}
      {children}
    </div>
  );
}
