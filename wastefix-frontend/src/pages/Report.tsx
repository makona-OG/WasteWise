import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Report() {
  const [selectedBin, setSelectedBin] = useState("");
  const [issue, setIssue] = useState("");
  const { toast } = useToast();

  const { data: bins, isLoading } = useQuery({
    queryKey: ["bins"],
    queryFn: async () => {
      const response = await fetch('https://wastefix.onrender.com/api/bins/');
      if (!response.ok) throw new Error('Failed to fetch bins');
      return response.json();
    }
  });

  const mutation = useMutation({
    mutationFn: async (newReport: { binId: number; issue: string }) => {
      const response = await fetch('https://wastefix.onrender.com/api/reports/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newReport),
      });
      if (!response.ok) throw new Error('Failed to submit report');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Report Submitted",
        description: "Your report has been successfully submitted.",
      });
      setSelectedBin("");
      setIssue("");
    },
  });

  if (isLoading) {
    return <div className="p-8">Loading...</div>;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBin || !issue) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }
    mutation.mutate({
      binId: parseInt(selectedBin),
      issue: issue,
    });
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Report an Issue</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Bin Location</label>
              <Select value={selectedBin} onValueChange={setSelectedBin}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a bin" />
                </SelectTrigger>
                <SelectContent>
                  {bins?.map((bin: any) => (
                    <SelectItem key={bin.id} value={bin.id.toString()}>
                      {bin.location} - {bin.status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Describe the Issue</label>
              <textarea
                value={issue}
                onChange={(e) => setIssue(e.target.value)}
                className="w-full p-2 border rounded-md min-h-[100px]"
                placeholder="Please describe the issue..."
              />
            </div>

            <button
              type="submit"
              className="w-full bg-primary text-white py-2 rounded-md hover:bg-primary/90 transition-colors"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? "Submitting..." : "Submit Report"}
            </button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
