
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FileText, Calendar, Clock } from "lucide-react";

interface UserReportsViewerProps {
  userId: string;
}

const UserReportsViewer: React.FC<UserReportsViewerProps> = ({ userId }) => {
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  const fetchUserData = async () => {
    setLoading(true);
    try {
      console.log("Fetching data for user:", userId);
      
      // Fetch consultations with prescriptions
      const { data: consultationData, error: consultationError } = await supabase
        .from('consultations')
        .select('*')
        .eq('patient_id', userId);

      if (consultationError) {
        console.error("Error fetching consultations:", consultationError);
        throw consultationError;
      }
      
      console.log("Consultations data:", consultationData);
      
      // Fetch admissions
      const { data: admissionsData, error: admissionsError } = await supabase
        .from('admissions')
        .select('*')
        .eq('patient_id', userId);

      if (admissionsError) {
        console.error("Error fetching admissions:", admissionsError);
        throw admissionsError;
      }
      
      console.log("Admissions data:", admissionsData);
      
      // Fetch reports for those admissions
      const admissionIds = admissionsData?.map(admission => admission.id) || [];
      
      if (admissionIds.length > 0) {
        const { data: reportsData, error: reportsError } = await supabase
          .from('admission_reports')
          .select('*')
          .in('admission_id', admissionIds);
        
        if (reportsError) {
          console.error("Error fetching reports:", reportsError);
          throw reportsError;
        }
        
        console.log("Reports data:", reportsData);

        // Merge admission data with reports
        const admissionsWithReports = admissionsData?.map(admission => {
          const report = reportsData?.find(report => report.admission_id === admission.id);
          return {
            ...admission,
            report_link: report?.report_link
          };
        }) || [];
        
        setReports(admissionsWithReports.filter(admission => admission.report_link));
      } else {
        setReports([]);
      }

      setPrescriptions(consultationData?.filter(c => c.prescription || c.report_link) || []);
    } catch (error) {
      console.error("Error fetching user reports:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-center">Loading user reports...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Medical Records</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="prescriptions">
          <TabsList className="mb-4">
            <TabsTrigger value="prescriptions">
              Prescriptions ({prescriptions.length})
            </TabsTrigger>
            <TabsTrigger value="reports">
              Hospital Reports ({reports.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="prescriptions">
            {prescriptions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No prescription records found</div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Doctor</TableHead>
                      <TableHead>Place</TableHead>
                      <TableHead>Prescription</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {prescriptions.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2" />
                            {item.consultation_date}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center mt-1">
                            <Clock className="h-3 w-3 mr-1" />
                            {item.consultation_time}
                          </div>
                        </TableCell>
                        <TableCell>{item.doctor_name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{item.place}</Badge>
                        </TableCell>
                        <TableCell>
                          {item.prescription && (
                            <div className="mb-2">{item.prescription}</div>
                          )}
                          {item.report_link && (
                            <a 
                              href={item.report_link} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex items-center text-blue-600 hover:underline"
                            >
                              <FileText className="h-4 w-4 mr-1" />
                              View Report
                            </a>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="reports">
            {reports.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No hospital reports found</div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Admission Date</TableHead>
                      <TableHead>Hospital</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Report</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reports.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2" />
                            {item.date_in}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center mt-1">
                            <Clock className="h-3 w-3 mr-1" />
                            {item.time_in}
                          </div>
                        </TableCell>
                        <TableCell>{item.hospital_name}</TableCell>
                        <TableCell>
                          <Badge variant={item.discharged ? (item.recovered ? "success" : "warning") : "default"}>
                            {item.discharged ? (item.recovered ? "Recovered" : "Discharged") : "In Treatment"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {item.report_link && (
                            <a 
                              href={item.report_link} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex items-center text-blue-600 hover:underline"
                            >
                              <FileText className="h-4 w-4 mr-1" />
                              View Report
                            </a>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default UserReportsViewer;
