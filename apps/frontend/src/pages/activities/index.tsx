import { ActivityTimeline } from "@/components/activities";

export default function ActivitiesIndexPage() {
  return (
    <div className="p-6">
      <h1 className="mb-4 text-xl font-semibold">Activity Timeline</h1>
      <ActivityTimeline entityType="contact" entityId="contact-1" height={600} pageSize={30} />
    </div>
  );
}

