import { ArrowRight, Recycle, MapPin, Bell } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  const features = [
    {
      icon: <MapPin className="h-6 w-6 text-primary-500" />,
      title: "Smart Bin Tracking",
      description: "Real-time monitoring of waste bin levels across the city",
    },
    {
      icon: <Recycle className="h-6 w-6 text-primary-500" />,
      title: "Efficient Collection",
      description: "Optimized routes for waste collection teams",
    },
    {
      icon: <Bell className="h-6 w-6 text-primary-500" />,
      title: "Instant Notifications",
      description: "Get alerts when bins need attention or collection",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-primary-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 animate-fade-in">
            Smart Waste Management
            <br />
            for a Cleaner Future
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto animate-fade-in">
            Transform your city's waste management with real-time monitoring,
            efficient collection routes, and community engagement.
          </p>
          <Link
            to="/dashboard"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 transition-colors animate-fade-in"
          >
            Get Started
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="mb-8 text-primary-100">
            Join us in creating a cleaner, more sustainable future.
          </p>
          <Link
            to="/report"
            className="inline-flex items-center px-6 py-3 border-2 border-white rounded-md text-white hover:bg-white hover:text-primary-600 transition-colors"
          >
            Report an Issue
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Index;