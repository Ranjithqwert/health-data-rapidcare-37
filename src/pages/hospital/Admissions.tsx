
import React, { useEffect, useState } from "react";
import AuthenticatedLayout from "@/components/layouts/AuthenticatedLayout";
import { authService } from "@/services/auth.service";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Admission } from "@/models/models";
import { toast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";

const Admissions: React.FC = () => {
  const [admissions, setAdmissions] = useState<Admission[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDischargeDialog, setOpenDischargeDialog] = useState(false);
  const [selectedAdmission, setSelectedAdmission] = useState<Admission | null>(null);
  const [feedback, setFeedback] = useState("");
  const [recovered, setRecovered] = useState(false);

  const hospitalId = authService.getUserId();

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
          userId: "user1",
          userName: "John Doe",
          hospitalId: hospitalId || "",
          hospitalName: authService.getUserName() || "Hospital",
          dateIn: "2023-05-10",
          timeIn: "08:30 AM",
          discharged: false,
          recovered: false
        },
        {
          id: "2",
          userId: "user2",
          userName: "Jane Smith",
          hospitalId: hospitalId || "",
          hospitalName: authService.getUserName() || "Hospital",
          dateIn: "2023-05-15",
          timeIn: "11:45 AM",
          dateOut: "2023-05-20",
          timeOut: "02:15 PM",
          discharged: true,
          recovered: true,
          feedback: "Patient has recovered well after treatment"
        }
      ];
      
      setAdmissions(mockAdmissions);
      
      // In a real implementation, we would fetch from Supabase
      /*
      const { data, error } = await supabase
        .from('admissions')
        .select('*')
        .eq('hospitalId', hospitalId);
        
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

  const handleDischargeClick = (admission: Admission) => {
    setSelectedAdmission(admission);
    setFeedback("");
    setRecovered(false);
    setOpenDischargeDialog(true);
  };

  const handleDischargePatient = async () => {
    if (!selectedAdmission) return;
    
    try {
      // Get current date and time
      const today = new Date();
      const dateOut = today.toISOString().split('T')[0];
      const timeOut = today.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      
      // In a real implementation, we would update the database
      // For now, we'll just update our local state
      const updatedAdmissions = admissions.map(a => 
        a.id === selectedAdmission.id ? { 
          ...a, 
          discharged: true, 
          dateOut, 
          timeOut, 
          recovered, 
          feedback 
        } : a
      );
      
      setAdmissions(updatedAdmissions);
      
      /* 
      const { error } = await supabase
        .from('admissions')
        .update({ 
          discharged: true, 
          dateOut, 
          timeOut, 
          recovered, 
          feedback 
        })
        .eq('id', selectedAdmission.id);
        
      if (error) throw error;
      */
      
      toast({
        title: "Success",
        description: "Patient discharged successfully",
      });
      
      setOpenDischargeDialog(false);
    } catch (error) {
      console.error("Error discharging patient:", error);
      toast({
        title: "Error",
        description: "Failed to discharge patient",
        variant: "destructive",
      });
    }
  };

  return (
    <AuthenticatedLayout requiredUserType="hospital">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Admissions</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Patient Admissions</CardTitle>
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
                    <TableHead>Patient</TableHead>
                    <TableHead>Admitted On</TableHead>
                    <TableHead>Discharged On</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {admissions.map((admission) => (
                    <TableRow key={admission.id}>
                      <TableCell>{admission.userName}</TableCell>
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
                        {!admission.discharged ? (
                          <Button 
                            variant="outline" 
                            onClick={() => handleDischargeClick(admission)}
                          >
                            Discharge
                          </Button>
                        ) : (
                          <Button 
                            variant="outline" 
                            onClick={() => {
                              setSelectedAdmission(admission);
                              setFeedback(admission.feedback || "");
                              setRecovered(admission.recovered || false);
                              setOpenDischargeDialog(true);
                            }}
                          >
                            View Details
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={openDischargeDialog} onOpenChange={setOpenDischargeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedAdmission?.discharged ? "Admission Details" : "Discharge Patient"}
            </DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <div className="mb-4">
              <h3 className="font-medium">Patient: {selectedAdmission?.userName}</h3>
              <p className="text-sm text-muted-foreground">
                Admitted on: {selectedAdmission?.dateIn} at {selectedAdmission?.timeIn}
              </p>
              {selectedAdmission?.discharged && (
                <p className="text-sm text-muted-foreground">
                  Discharged on: {selectedAdmission?.dateOut} at {selectedAdmission?.timeOut}
                </p>
              )}
            </div>
            
            {!selectedAdmission?.discharged && (
              <>
                <div className="flex items-center space-x-2 mb-4">
                  <input 
                    type="checkbox" 
                    id="recovered" 
                    checked={recovered} 
                    onChange={(e) => setRecovered(e.target.checked)} 
                    className="h-4 w-4"
                  />
                  <label htmlFor="recovered" className="text-sm font-medium">
                    Patient has recovered
                  </label>
                </div>
                
                <Textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Enter discharge notes or feedback..."
                  className="min-h-[150px]"
                />
              </>
            )}
            
            {selectedAdmission?.discharged && selectedAdmission?.feedback && (
              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Discharge Notes:</h4>
                <p>{selectedAdmission.feedback}</p>
              </div>
            )}
          </div>
          
          <DialogFooter>
            {selectedAdmission?.discharged ? (
              <Button onClick={() => setOpenDischargeDialog(false)}>Close</Button>
            ) : (
              <>
                <Button variant="outline" onClick={() => setOpenDischargeDialog(false)}>Cancel</Button>
                <Button onClick={handleDischargePatient}>Discharge Patient</Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AuthenticatedLayout>
  );
};

export default Admissions;
