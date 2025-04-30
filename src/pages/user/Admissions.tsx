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
      
      // For demonstration purposes, we'll create mock data
      const mockAdmissions: Admission[] = [
        {
          id: "1",
          userId: userId || "",
          userName: authService.getUserName() || "Patient",
          hospitalId: "hospital1",
          hospitalName: "City General Hospital",
          dateIn: "2023-03-10",
          timeIn: "08:30 AM",
          dateOut: "2023-03-15",
          timeOut: "02:00 PM",
          discharged: true,
          recovered: true,
          feedback: "Patient recovered well after treatment"
        },
        {
          id: "2",
          userId: userId || "",
          userName: authService.getUserName() || "Patient",
          hospitalId: "hospital2",
          hospitalName: "Medical Center",
          dateIn: "2023-04-22",
          timeIn: "11:45 AM",
          discharged: false,
          recovered: false
        }
      ];
      
      setAdmissions(mockAdmissions);
      
      // In a real implementation, we would fetch from Supabase
      /*
      const { data, error } = await supabase
        .from('admissions')
        .select('*')
        .eq('userId', userId);
        
      if (error) {
        toast({
          title: "Error fetching admissions",
          description: error.message,
          variant: "destructive",
        });
        return;
      }
      
      setAdmissions(data || []);
      */
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
                      <TableCell>{admission.hospitalName}</TableCell>
                      <TableCell>{`${admission.dateIn} ${admission.timeIn}`}</TableCell>
                      <TableCell>
                        {admission.discharged 
                          ? `${admission.dateOut} ${admission.timeOut}` 
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
                                <h3 className="font-medium">Hospital: {admission.hospitalName}</h3>
                                <p className="text-sm text-muted-foreground">
                                  Admitted on: {admission.dateIn} at {admission.timeIn}
                                </p>
                                {admission.discharged && (
                                  <p className="text-sm text-muted-foreground">
                                    Discharged on: {admission.dateOut} at {admission.timeOut}
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
