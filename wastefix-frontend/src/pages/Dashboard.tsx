import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, AlertTriangle, MapPin, Truck } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

export default function Dashboard() {
  const { isAuthenticated, isAdmin, userEmail } = useAuth();
  
  const { data: bins, isLoading: binsLoading } = useQuery({
    queryKey: ["bins"],
    queryFn: async () => {
      const response = await fetch('http://localhost:5000/api/bins/');
      if (!response.ok) throw new Error('Failed to fetch bins');
      return response.json();
    },
    meta: {
      onError: () => toast.error("Failed to load bins data")
    }
  });

  const { data: reports, isLoading: reportsLoading } = useQuery({
    queryKey: ["reports"],
    queryFn: async () => {
      const response = await fetch('http://localhost:5000/api/reports/');
      if (!response.ok) throw new Error('Failed to fetch reports');
      return response.json();
    },
    meta: {
      onError: () => toast.error("Failed to load reports data")
    }
  });

  if (binsLoading || reportsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  // Example coordinates - replace with actual coordinates from your data
  const coordinates = "51.5074,-0.1278"; // London coordinates as example

  return (
    <div className="container mx-auto p-6 space-y-8 animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard Overview</h1>
        {(isAdmin || userEmail?.includes('collector')) && (
          <a 
            href={`https://www.google.com/maps/search/?api=1&query=${coordinates}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors"
          >
            <MapPin className="h-4 w-4" />
            View Location
          </a>
        )}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* First Main Card */}
        <Card className="hover:shadow-lg transition-all duration-300 animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-6 w-6 text-primary" />
              Collection Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-primary-50 rounded-lg">
                <p className="text-2xl font-bold">{bins?.length || 0}</p>
                <p className="text-sm text-gray-600">Total Bins</p>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <p className="text-2xl font-bold">
                  {bins?.filter(b => b.status === "Overflowing").length || 0}
                </p>
                <p className="text-sm text-gray-600">Needs Collection</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Second Main Card */}
        <Card className="hover:shadow-lg transition-all duration-300 animate-fade-in [animation-delay:200ms]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-6 w-6 text-yellow-500" />
              Report Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <p className="text-2xl font-bold">
                  {reports?.filter(r => r.status === "Pending").length || 0}
                </p>
                <p className="text-sm text-gray-600">Pending Reports</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold">
                  {reports?.filter(r => r.status === "Resolved").length || 0}
                </p>
                <p className="text-sm text-gray-600">Resolved Issues</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Reports Section */}
      <Card className="mt-8 animate-fade-in [animation-delay:400ms]">
        <CardHeader>
          <CardTitle>Recent Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reports?.slice(0, 5).map((report: any) => (
              <div 
                key={report.id} 
                className="flex items-center justify-between border-b pb-4 hover:bg-muted/50 rounded-lg p-2 transition-colors"
              >
                <div>
                  <p className="font-medium">Bin #{report.binId}</p>
                  <p className="text-sm text-gray-500">{report.issue}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  report.status === "Pending" ? "bg-yellow-100 text-yellow-800" :
                  report.status === "In Progress" ? "bg-blue-100 text-blue-800" :
                  "bg-green-100 text-green-800"
                }`}>
                  {report.status}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <footer className="mt-12 border-t pt-8 text-center text-gray-600 animate-fade-in [animation-delay:600ms]">
        <div className="flex flex-col items-center space-y-4">
          <p className="text-sm">
            © 2024 WasteFix. All rights reserved.
          </p>
          <div className="flex space-x-4 text-sm">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-primary transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}