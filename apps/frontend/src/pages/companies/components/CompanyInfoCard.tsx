import { Card, CardContent, Typography, Link, Stack } from "@mui/material";
import type { Company } from "../../../types/company";

export default function CompanyInfoCard({ company }: Readonly<{ company: Company }>) {
  return (
    <Card>
      <CardContent>
        <Stack spacing={1}>
          <Typography variant="h6">{company.name}</Typography>
          {company.industry && <Typography variant="body2">Industry: {company.industry}</Typography>}
          {company.website && (
            <Typography variant="body2">
              Website:{" "}
              <Link href={company.website} target="_blank" rel="noreferrer">
                {company.website}
              </Link>
            </Typography>
          )}
          {company.phone && <Typography variant="body2">Phone: {company.phone}</Typography>}
          {company.address && <Typography variant="body2">Address: {company.address}</Typography>}
        </Stack>
      </CardContent>
    </Card>
  );
}

