import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

export default function BinRegistrationForm() {
  const [location, setLocation] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.id) {
      toast.error('You must be logged in to register a bin');
      return;
    }

    try {
      const response = await fetch('https://wastefix.onrender.com/api/collections/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          location,
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
          owner_id: user.id
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to register bin');
      }

      toast.success('Bin registered successfully!');
      setLocation("");
      setLatitude("");
      setLongitude("");
    } catch (error) {
      toast.error('Failed to register bin');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Enter bin location"
          required
        />
      </div>
      <div>
        <Label htmlFor="latitude">Latitude</Label>
        <Input
          id="latitude"
          type="number"
          step="any"
          value={latitude}
          onChange={(e) => setLatitude(e.target.value)}
          placeholder="Enter latitude"
          required
        />
      </div>
      <div>
        <Label htmlFor="longitude">Longitude</Label>
        <Input
          id="longitude"
          type="number"
          step="any"
          value={longitude}
          onChange={(e) => setLongitude(e.target.value)}
          placeholder="Enter longitude"
          required
        />
      </div>
      <Button type="submit">Register Bin</Button>
    </form>
  );
}
