
import React, { useEffect, useState } from "react";
import AuthenticatedLayout from "@/components/layouts/AuthenticatedLayout";
import { authService } from "@/services/auth.service";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Admission } from "@/models/models";
import { toast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const Admissions: React.FC = () => {
  const [admissions, setAdmissions] = useState<Admission[]>([]);
  const [loading, setLoading] = useState(true);

  const userId = authService.getUserId();

  useEffect(() => {
    fetchAdmissions();
  }, []);

  const fetchAdmissions = async () => {
    try {
      setLoading(true);

      if (!userId) {
        toast({
          title: "Error",
          description: "User ID not found. Please login again.",
          variant: "destructive",
        });
        return;
      }
      
      // Fetch from Supabase
      const { data, error } = await supabase
        .from('admissions')
        .select('*')
        .eq('patient_id', userId);
        
      if (error) {
        console.error("Error fetching admissions:", error);
        toast({
          title: "Error fetching admissions",
          description: error.message,
          variant: "destructive",
        });
        return;
      }
      
      console.log("Fetched admissions:", data);
      setAdmissions(data || []);
    } catch (error) {
      console.error("Error fetching admissions:", error);
      toast({
        title: "Error",
        description: "Failed to fetch admission records",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthenticatedLayout requiredUserType="user">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">My Admissions</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Admission History</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p>Loading admission records...</p>
            ) : admissions.length === 0 ? (
              <p>No admission records found.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Hospital</TableHead>
                    <TableHead>Admitted On</TableHead>
                    <TableHead>Discharged On</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {admissions.map((admission) => (
                    <TableRow key={admission.id}>
                      <TableCell>{admission.hospital_name}</TableCell>
                      <TableCell>{`${admission.date_in} ${admission.time_in}`}</TableCell>
                      <TableCell>
                        {admission.discharged 
                          ? `${admission.date_out} ${admission.time_out}` 
                          : "Not discharged yet"}
                      </TableCell>
                      <TableCell>
                        {admission.discharged ? (
                          <Badge variant={admission.recovered ? "success" : "warning"}>
                            {admission.recovered ? "Recovered" : "Discharged"}
                          </Badge>
                        ) : (
                          <Badge>Active</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="default">View Details</Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Admission Details</DialogTitle>
                            </DialogHeader>
                            <div className="py-4">
                              <div className="mb-4">
                                <h3 className="font-medium">Hospital: {admission.hospital_name}</h3>
                                <p className="text-sm text-muted-foreground">
                                  Admitted on: {admission.date_in} at {admission.time_in}
                                </p>
                                {admission.discharged && (
                                  <p className="text-sm text-muted-foreground">
                                    Discharged on: {admission.date_out} at {admission.time_out}
                                  </p>
                                )}
                              </div>
                              
                              <div className="border-t pt-4">
                                <h4 className="font-medium mb-2">Status:</h4>
                                <p>
                                  {admission.discharged 
                                    ? (admission.recovered 
                                      ? "Recovered and discharged" 
                                      : "Discharged but still recovering")
                                    : "Currently admitted"}
                                </p>
                                
                                {admission.feedback && (
                                  <div className="mt-4">
                                    <h4 className="font-medium mb-2">Doctor's Feedback:</h4>
                                    <p>{admission.feedback}</p>
                                  </div>
                                )}

                                {admission.report_link && (
                                  <div className="mt-4">
                                    <h4 className="font-medium mb-2">Medical Report:</h4>
                                    <a 
                                      href={admission.report_link}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-blue-600 hover:underline"
                                    >
                                      View Report
                                    </a>
                                  </div>
                                )}
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  );
};

export default Admissions;
