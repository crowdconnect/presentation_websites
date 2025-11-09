import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { PageHeader } from '@/components/app/page-header';
import { Badge } from '@/components/ui/badge';

const invoices = [
  { id: 'RE-2024-005', date: '01.07.2024', amount: '34,90 €', status: 'Bezahlt' },
  { id: 'RE-2024-004', date: '01.06.2024', amount: '34,90 €', status: 'Bezahlt' },
  { id: 'RE-2024-003', date: '01.05.2024', amount: '19,90 €', status: 'Bezahlt' },
  { id: 'RE-2024-002', date: '01.04.2024', amount: '19,90 €', status: 'Bezahlt' },
  { id: 'RE-2024-001', date: '01.03.2024', amount: '19,90 €', status: 'Bezahlt' },
];

export default function InvoicesPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Ihre Rechnungen"
        description="Hier finden Sie eine Übersicht Ihrer monatlichen Rechnungen."
      />
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Rechnungsnr.</TableHead>
              <TableHead>Datum</TableHead>
              <TableHead>Betrag</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aktion</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell className="font-medium">{invoice.id}</TableCell>
                <TableCell>{invoice.date}</TableCell>
                <TableCell>{invoice.amount}</TableCell>
                <TableCell>
                  <Badge variant={invoice.status === 'Bezahlt' ? 'secondary' : 'destructive'}>
                    {invoice.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon">
                    <Download className="h-4 w-4" />
                    <span className="sr-only">Rechnung herunterladen</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
