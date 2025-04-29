
import React, { useEffect, useState } from "react";
import AuthenticatedLayout from "@/components/layouts/AuthenticatedLayout";
import { Card } from "@/components/ui/card";
import { BarChart, LineChart, PieChart } from "@/components/ui/charts";
import { apiService } from "@/services/api.service";

// Chart type for disease tracking by location
interface AnalysisResult {
  name: string;
  percentage: number;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [targetAnalysis, setTargetAnalysis] = useState<AnalysisResult[]>([]);
  const [target, setTarget] = useState<string>("Sugar");
  const [filterLevel, setFilterLevel] = useState<string>("village");

  // Fetch dashboard statistics
  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const dashboardStats = await apiService.getDashboardStats();
        setStats(dashboardStats);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Fetch target analysis data
  useEffect(() => {
    const fetchTargetAnalysis = async () => {
      try {
        const data = await apiService.getTargetAnalysis(target, filterLevel);
        setTargetAnalysis(data);
      } catch (error) {
        console.error("Error fetching target analysis:", error);
      }
    };

    fetchTargetAnalysis();
  }, [target, filterLevel]);

  // Prepare data for charts
  const prepareMonthlyUserCreationData = () => {
    if (!stats || !stats.monthlyUserCreation) return [];
    
    return Object.entries(stats.monthlyUserCreation).map(([month, count]) => ({
      name: month,
      value: count as number
    }));
  };

  const prepareDiseaseData = () => {
    if (!stats || !stats.usersByDisease) return [];
    
    return Object.entries(stats.usersByDisease).map(([disease, count]) => ({
      name: disease,
      value: count as number
    }));
  };

  const prepareAddictionData = () => {
    if (!stats || !stats.usersByAddiction) return [];
    
    return Object.entries(stats.usersByAddiction).map(([addiction, count]) => ({
      name: addiction === 'None' ? 'No Addictions' : addiction,
      value: count as number
    }));
  };

  const prepareTargetAnalysisData = () => {
    return targetAnalysis.map(item => ({
      name: item.name,
      value: Math.round(item.percentage)
    }));
  };

  return (
    <AuthenticatedLayout requiredUserType="admin">
      <div>
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="card-stats">
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">Total Users</span>
              <span className="text-2xl font-bold">
                {loading ? "Loading..." : stats?.userCount || 0}
              </span>
            </div>
          </Card>
          
          <Card className="card-stats">
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">Total Doctors</span>
              <span className="text-2xl font-bold">
                {loading ? "Loading..." : stats?.doctorCount || 0}
              </span>
            </div>
          </Card>
          
          <Card className="card-stats">
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">Total Hospitals</span>
              <span className="text-2xl font-bold">
                {loading ? "Loading..." : stats?.hospitalCount || 0}
              </span>
            </div>
          </Card>
        </div>
        
        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Line Chart: Monthly User Creation */}
          <Card className="p-6">
            <h2 className="text-lg font-medium mb-4">Monthly User Registration</h2>
            <div className="h-80">
              <LineChart 
                data={prepareMonthlyUserCreationData()} 
                index="name"
                categories={["value"]}
                colors={["#1976D2"]}
                valueFormatter={(value) => `${value} users`}
              />
            </div>
          </Card>
          
          {/* Bar Chart: Disease Distribution */}
          <Card className="p-6">
            <h2 className="text-lg font-medium mb-4">Health Conditions Distribution</h2>
            <div className="h-80">
              <BarChart 
                data={prepareDiseaseData()} 
                index="name"
                categories={["value"]}
                colors={["#1976D2"]}
                valueFormatter={(value) => `${value} users`}
              />
            </div>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Pie Chart: Addiction Distribution */}
          <Card className="p-6">
            <h2 className="text-lg font-medium mb-4">Lifestyle Distribution</h2>
            <div className="h-80">
              <PieChart 
                data={prepareAddictionData()} 
                index="name"
                categories={["value"]}
                colors={["#4CAF50", "#FFC107", "#F44336"]}
                valueFormatter={(value) => `${value} users`}
              />
            </div>
          </Card>
          
          {/* Custom Analysis Section */}
          <Card className="p-6">
            <h2 className="text-lg font-medium mb-4">Custom Analysis</h2>
            <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="target" className="block text-sm font-medium text-gray-700 mb-1">
                  Target Condition
                </label>
                <select
                  id="target"
                  className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-rapidcare-primary focus:border-rapidcare-primary"
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                >
                  <option value="Sugar">Sugar</option>
                  <option value="BP">BP</option>
                  <option value="Cardiac">Cardiac</option>
                  <option value="Kidney">Kidney</option>
                  <option value="Liver">Liver</option>
                  <option value="Lungs">Lungs</option>
                  <option value="Smoke">Smoke</option>
                  <option value="Alcohol">Alcohol</option>
                </select>
              </div>
              <div>
                <label htmlFor="filterLevel" className="block text-sm font-medium text-gray-700 mb-1">
                  Filter Level
                </label>
                <select
                  id="filterLevel"
                  className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-rapidcare-primary focus:border-rapidcare-primary"
                  value={filterLevel}
                  onChange={(e) => setFilterLevel(e.target.value)}
                >
                  <option value="village">Village</option>
                  <option value="district">District</option>
                  <option value="state">State</option>
                  <option value="country">Country</option>
                </select>
              </div>
              <div className="flex items-end">
                <button
                  className="w-full bg-rapidcare-primary text-white py-2 px-4 rounded-md hover:bg-rapidcare-secondary transition"
                  onClick={() => {
                    apiService.getTargetAnalysis(target, filterLevel).then(data => {
                      setTargetAnalysis(data);
                    });
                  }}
                >
                  View
                </button>
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="text-md font-medium mb-2">
                {target} patients on {filterLevel} basis
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {filterLevel.charAt(0).toUpperCase() + filterLevel.slice(1)} Name
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Percentage
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {targetAnalysis.length > 0 ? (
                      targetAnalysis.map((item, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {item.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {item.percentage.toFixed(2)}%
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={2} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                          No data available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </AuthenticatedLayout>
  );
};

export default Dashboard;
