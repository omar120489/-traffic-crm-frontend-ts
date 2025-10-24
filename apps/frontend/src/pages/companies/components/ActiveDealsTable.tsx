import { Card, CardContent, Typography } from "@mui/material";
import { DataTable, type Column } from "@traffic-crm/ui-kit";
import type { CompanyDeal } from "../../../types/company";

const fmt = (cents: number) =>
  new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(cents / 100);

const columns: Column<CompanyDeal>[] = [
  { key: "name", header: "Deal" },
  { key: "stageName", header: "Stage" },
  { key: "ownerName", header: "Owner" },
  {
    key: "amount",
    header: "Amount",
    render: (row: CompanyDeal) => fmt(row.amount || 0),
  },
  { key: "updatedAt", header: "Updated" },
];

export default function ActiveDealsTable({ rows }: Readonly<{ rows: readonly CompanyDeal[] }>) {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 1 }}>
          Active Deals
        </Typography>
        <DataTable
          columns={columns as Column<CompanyDeal & { id: string }>[]}
          rows={rows as (CompanyDeal & { id: string })[]}
          page={1}
          pageSize={rows.length}
          total={rows.length}
        />
      </CardContent>
    </Card>
  );
}

