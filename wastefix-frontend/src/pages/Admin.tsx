import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Truck, Trash, Users, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import BinRegistrationForm from "@/components/BinRegistrationForm";

export default function Admin() {
  const queryClient = useQueryClient();

  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await fetch('https://wastefix.onrender.com/api/auth/users');
      if (!response.ok) throw new Error('Failed to fetch users');
      return response.json();
    }
  });

  const { data: bins, isLoading: binsLoading } = useQuery({
    queryKey: ["bins"],
    queryFn: async () => {
      const response = await fetch('https://wastefix.onrender.com/api/bins/');
      if (!response.ok) throw new Error('Failed to fetch bins');
      return response.json();
    }
  });

  const { data: reports, isLoading: reportsLoading } = useQuery({
    queryKey: ["reports"],
    queryFn: async () => {
      const response = await fetch('https://wastefix.onrender.com/api/reports/');
      if (!response.ok) throw new Error('Failed to fetch reports');
      return response.json();
    }
  });

  const deleteBinMutation = useMutation({
    mutationFn: async (binId: number) => {
      const response = await fetch(`https://wastefix.onrender.com/api/bins/${binId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete bin');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bins"] });
      toast.success("Bin deleted successfully");
    },
    onError: (error) => {
      toast.error(`Error deleting bin: ${error.message}`);
    }
  });

  if (usersLoading || binsLoading || reportsLoading) {
    return <div className="p-8">Loading...</div>;
  }

  const pendingReports = reports?.filter((report: any) => report.status === 'Pending')?.length || 0;
  const overflowingBins = bins?.filter((bin: any) => bin.status === 'Overflowing')?.length || 0;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Users</p>
              <p className="text-2xl font-bold">{users?.length || 0}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-green-100 rounded-full">
              <Trash className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Bins</p>
              <p className="text-2xl font-bold">{bins?.length || 0}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-yellow-100 rounded-full">
              <AlertCircle className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Pending Reports</p>
              <p className="text-2xl font-bold">{pendingReports}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-red-100 rounded-full">
              <Trash className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Overflowing Bins</p>
              <p className="text-2xl font-bold">{overflowingBins}</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Registered Bins</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bins?.map((bin: any) => (
                  <TableRow key={bin.id}>
                    <TableCell>{bin.location}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-sm ${
                        bin.status === 'Empty' ? 'bg-green-100 text-green-800' :
                        bin.status === 'Half-full' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {bin.status}
                      </span>
                    </TableCell>
                    <TableCell>{new Date(bin.last_updated).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => deleteBinMutation.mutate(bin.id)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Registered Users</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Username</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Joined</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users?.map((user: any) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-sm ${
                        user.is_admin ? 'bg-purple-100 text-purple-800' :
                        user.is_collector ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {user.is_admin ? 'Admin' : user.is_collector ? 'Collector' : 'User'}
                      </span>
                    </TableCell>
                    <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
