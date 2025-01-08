// Mock data types
export interface Bin {
  id: number;
  location: string;
  coordinates: [number, number];
  status: 'Empty' | 'Half-full' | 'Overflowing';
  lastUpdated: string;
}

export interface Report {
  id: number;
  binId: number;
  issue: string;
  status: 'Pending' | 'In Progress' | 'Resolved';
  createdAt: string;
}

// Mock data
const bins: Bin[] = [
  {
    id: 1,
    location: "Central Park",
    coordinates: [40.7829, -73.9654],
    status: "Half-full",
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 2,
    location: "Main Street",
    coordinates: [40.7831, -73.9657],
    status: "Empty",
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 3,
    location: "City Hall",
    coordinates: [40.7834, -73.9659],
    status: "Overflowing",
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 4,
    location: "Shopping Mall",
    coordinates: [40.7836, -73.9662],
    status: "Half-full",
    lastUpdated: new Date().toISOString(),
  },
];

const reports: Report[] = [
  {
    id: 1,
    binId: 1,
    issue: "Bin damaged",
    status: "Pending",
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    binId: 3,
    issue: "Overflow",
    status: "In Progress",
    createdAt: new Date().toISOString(),
  },
];

// Mock API functions
export const mockApi = {
  bins: {
    getAll: async () => {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
      return bins;
    },
    getById: async (id: number) => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return bins.find(bin => bin.id === id);
    },
    updateStatus: async (id: number, status: Bin['status']) => {
      await new Promise(resolve => setTimeout(resolve, 500));
      const bin = bins.find(b => b.id === id);
      if (bin) {
        bin.status = status;
        bin.lastUpdated = new Date().toISOString();
      }
      return bin;
    }
  },
  reports: {
    getAll: async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return reports;
    },
    create: async (report: Omit<Report, 'id' | 'createdAt'>) => {
      await new Promise(resolve => setTimeout(resolve, 500));
      const newReport = {
        ...report,
        id: reports.length + 1,
        createdAt: new Date().toISOString(),
      };
      reports.push(newReport);
      return newReport;
    }
  }
};