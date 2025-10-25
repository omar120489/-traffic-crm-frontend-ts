// Activity Timeline Demo Page
// Sprint 4: Activity Timeline

import { Box, Typography } from "@mui/material";
import { AppPage } from "@traffic-crm/ui-kit";
import { ActivityTimeline } from "@/components/activities";

export default function ActivitiesPage() {
  return (
    <AppPage
      title="Activity Timeline"
      breadcrumbs={[{ label: "Activities", href: "/activities" }]}
    >
      <Box sx={{ mb: 3 }}>
        <Typography variant="body1" color="text.secondary">
          View and manage all activities across your organization.
        </Typography>
      </Box>

      {/* Activity Timeline with mock data */}
      <ActivityTimeline
        entityType="contact"
        entityId="contact-1"
        height={600}
        pageSize={30}
      />
    </AppPage>
  );
}

