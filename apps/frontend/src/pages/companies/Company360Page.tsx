import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Alert, CircularProgress, Stack, Box } from "@mui/material";
import { AppPage } from "@traffic-crm/ui-kit";
import { useAuth } from "../../contexts/AuthContext";
import { getCompanySummary } from "../../services/companies.service";
import type { CompanySummary } from "../../types/company";
import CompanyInfoCard from "./components/CompanyInfoCard";
import RevenueSummary from "./components/RevenueSummary";
import ContactsTable from "./components/ContactsTable";
import ActiveDealsTable from "./components/ActiveDealsTable";

export default function Company360Page() {
  const { id } = useParams<{ id: string }>();
  const { orgId: _orgId } = useAuth();
  const [data, setData] = useState<CompanySummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const title = useMemo(() => data?.company?.name ?? "Company 360", [data]);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setErr(null);
    getCompanySummary(id)
      .then(setData)
      .catch((e: unknown) => {
        const message = e instanceof Error ? e.message : "Failed to load company";
        setErr(message);
      })
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <AppPage title={title} breadcrumbs={[{ label: "Companies", href: "/companies" }, { label: title }]}>
      {loading && (
        <Stack alignItems="center" sx={{ py: 6 }}>
          <CircularProgress />
        </Stack>
      )}

      {!loading && err && <Alert severity="error">{err}</Alert>}

      {!loading && data && (
        <Stack spacing={2}>
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <Box sx={{ flex: "1 1 65%", minWidth: 300 }}>
              <CompanyInfoCard company={data.company} />
            </Box>
            <Box sx={{ flex: "1 1 30%", minWidth: 250 }}>
              <RevenueSummary stats={data.stats} />
            </Box>
          </Box>

          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <Box sx={{ flex: "1 1 48%", minWidth: 300 }}>
              <ContactsTable rows={data.contacts} />
            </Box>
            <Box sx={{ flex: "1 1 48%", minWidth: 300 }}>
              <ActiveDealsTable rows={data.recentDeals} />
            </Box>
          </Box>
        </Stack>
      )}
    </AppPage>
  );
}

