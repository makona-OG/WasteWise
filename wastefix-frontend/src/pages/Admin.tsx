import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Truck, Trash, Users } from "lucide-react";
import BinRegistrationForm from "@/components/BinRegistrationForm";

export default function Admin() {
  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await fetch('http://localhost:5000/api/auth/users');
      if (!response.ok) throw new Error('Failed to fetch users');
      return response.json();
    }
  });

  const { data: bins, isLoading: binsLoading } = useQuery({
    queryKey: ["bins"],
    queryFn: async () => {
      const response = await fetch('http://localhost:5000/api/bins/');
      if (!response.ok) throw new Error('Failed to fetch bins');
      return response.json();
    }
  });

  const { data: collections, isLoading: collectionsLoading } = useQuery({
    queryKey: ["collections"],
    queryFn: async () => {
      const response = await fetch('http://localhost:5000/api/collections/');
      if (!response.ok) throw new Error('Failed to fetch collections');
      return response.json();
    }
  });

  if (usersLoading || binsLoading || collectionsLoading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
              <Truck className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Collections</p>
              <p className="text-2xl font-bold">{collections?.length || 0}</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Users</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Username</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Roles</TableHead>
                  <TableHead>Bins Owned</TableHead>
                  <TableHead>Collections Made</TableHead>
                  <TableHead>Joined</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users?.map((user: any) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      {[
                        user.is_admin && 'Admin',
                        user.is_collector && 'Collector',
                        user.bins?.length > 0 && 'Bin Owner'
                      ].filter(Boolean).join(', ')}
                    </TableCell>
                    <TableCell>{user.bins?.length || 0}</TableCell>
                    <TableCell>{user.collections?.length || 0}</TableCell>
                    <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Bins</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Location</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Collections</TableHead>
                  <TableHead>Last Updated</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bins?.map((bin: any) => (
                  <TableRow key={bin.id}>
                    <TableCell>{bin.location}</TableCell>
                    <TableCell>{bin.owner?.username}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-sm ${
                        bin.status === 'Empty' ? 'bg-green-100 text-green-800' :
                        bin.status === 'Half-full' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {bin.status}
                      </span>
                    </TableCell>
                    <TableCell>{bin.collections?.length || 0}</TableCell>
                    <TableCell>{new Date(bin.last_updated).toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Collections</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Bin Location</TableHead>
                  <TableHead>Collector</TableHead>
                  <TableHead>Status Change</TableHead>
                  <TableHead>Timestamp</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {collections?.map((collection: any) => (
                  <TableRow key={collection.id}>
                    <TableCell>{collection.bin?.location}</TableCell>
                    <TableCell>{collection.collector?.username}</TableCell>
                    <TableCell>
                      {collection.previous_status} → {collection.new_status}
                    </TableCell>
                    <TableCell>{new Date(collection.timestamp).toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Register New Bin</CardTitle>
          </CardHeader>
          <CardContent>
            <BinRegistrationForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}