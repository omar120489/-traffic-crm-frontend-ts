import { Card, CardContent, Typography } from "@mui/material";
import { DataTable, type Column } from "@traffic-crm/ui-kit";
import type { CompanyContact } from "../../../types/company";

const columns: Column<CompanyContact>[] = [
  { key: "name", header: "Name" },
  { key: "title", header: "Title" },
  { key: "email", header: "Email" },
  { key: "phone", header: "Phone" },
  { key: "lastActivityAt", header: "Last Activity" },
];

export default function ContactsTable({ rows }: Readonly<{ rows: readonly CompanyContact[] }>) {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 1 }}>
          Contacts
        </Typography>
        <DataTable
          columns={columns as Column<CompanyContact & { id: string }>[]}
          rows={rows as (CompanyContact & { id: string })[]}
          page={1}
          pageSize={rows.length}
          total={rows.length}
        />
      </CardContent>
    </Card>
  );
}

