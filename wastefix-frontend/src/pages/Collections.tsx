import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { toast } from "sonner";

interface Bin {
  id: number;
  location: string;
  status: string;
  last_updated: string;
  latitude: number;
  longitude: number;
}

export default function Collections() {
  const { data: bins, isLoading } = useQuery({
    queryKey: ["bins"],
    queryFn: async () => {
      const response = await fetch('http://localhost:5000/api/bins/');
      if (!response.ok) throw new Error('Failed to fetch bins data');
      return response.json();
    },
    meta: {
      onError: () => {
        toast.error("Failed to load collections data");
      }
    }
  });

  const openLocation = (latitude: number, longitude: number) => {
    window.open(`https://www.google.com/maps?q=${latitude},${longitude}`, '_blank');
  };

  if (isLoading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Collections Management</h1>
      
      <div className="grid gap-6">
        {bins?.map((bin: Bin) => (
          <Card key={bin.id}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Bin #{bin.id} - {bin.location}</span>
                <button
                  onClick={() => openLocation(bin.latitude, bin.longitude)}
                  className="flex items-center gap-2 text-sm text-primary hover:text-primary/80"
                >
                  <MapPin className="h-4 w-4" />
                  View Location
                </button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Status: {bin.status}</p>
                  <p className="text-sm text-gray-500">
                    Last Updated: {new Date(bin.last_updated).toLocaleString()}
                  </p>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm ${
                  bin.status === "Empty" ? "bg-green-100 text-green-800" :
                  bin.status === "Half-full" ? "bg-yellow-100 text-yellow-800" :
                  "bg-red-100 text-red-800"
                }`}>
                  {bin.status}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}