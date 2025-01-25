import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, AlertTriangle, MapPin, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Report {
  id: number;
  bin_id: number;
  issue: string;
  status: string;
  created_at: string;
}

export default function Dashboard() {
  const { data: reports, isLoading: reportsLoading } = useQuery({
    queryKey: ["reports"],
    queryFn: async () => {
      const response = await fetch('https://wastefix.onrender.com/api/reports/');
      if (!response.ok) throw new Error('Failed to fetch reports');
      return response.json();
    },
    meta: {
      onError: () => toast.error("Failed to load reports data")
    }
  });

  const { data: bins, isLoading: binsLoading } = useQuery({
    queryKey: ["bins"],
    queryFn: async () => {
      const response = await fetch('https://wastefix.onrender.com/api/bins/');
      if (!response.ok) throw new Error('Failed to fetch bins data');
      return response.json();
    },
    meta: {
      onError: () => toast.error("Failed to load bins data")
    }
  });

  if (binsLoading || reportsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  const pendingReports = reports?.filter((report: Report) => report.status === 'Pending') || [];
  const resolvedReports = reports?.filter((report: Report) => report.status === 'Resolved') || [];

  return (
    <div className="container mx-auto p-6 space-y-8 animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard Overview</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-6 w-6 text-yellow-500" />
              Pending Reports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{pendingReports.length}</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-6 w-6 text-green-500" />
              Resolved Issues
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{resolvedReports.length}</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trash2 className="h-6 w-6 text-blue-500" />
              Total Bins
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{bins?.length || 0}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Recent Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Bin Location</TableHead>
                <TableHead>Issue</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Reported On</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports?.slice(0, 5).map((report: Report) => (
                <TableRow key={report.id}>
                  <TableCell>Bin #{report.bin_id}</TableCell>
                  <TableCell>{report.issue}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      report.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                      report.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {report.status}
                    </span>
                  </TableCell>
                  <TableCell>{new Date(report.created_at).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
