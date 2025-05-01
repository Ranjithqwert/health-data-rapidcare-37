
import React, { useState, useEffect } from "react";
import AuthenticatedLayout from "@/components/layouts/AuthenticatedLayout";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import NewAdmissionForm from "@/components/hospital/NewAdmissionForm";

interface Admission {
  id: string;
  patient_id: string;
  hospital_id: string;
  date_in: string;
  time_in: string;
  date_out?: string;
  time_out?: string;
  discharged: boolean;
  recovered?: boolean;
  feedback?: string;
  patient_name?: string;
}

const Admissions: React.FC = () => {
  const [admissions, setAdmissions] = useState<Admission[]>([]);
  const [loading, setLoading] = useState(true);
  const [newAdmissionDialogOpen, setNewAdmissionDialogOpen] = useState(false);
  const [dischargeDialogOpen, setDischargeDialogOpen] = useState(false);
  const [selectedAdmission, setSelectedAdmission] = useState<Admission | null>(null);
  const [feedback, setFeedback] = useState("");
  const [recovered, setRecovered] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredAdmissions, setFilteredAdmissions] = useState<Admission[]>([]);

  const hospitalId = localStorage.getItem('userId');

  useEffect(() => {
    fetchAdmissions();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = admissions.filter(admission => 
        admission.patient_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        admission.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        admission.patient_id.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredAdmissions(filtered);
    } else {
      setFilteredAdmissions(admissions);
    }
  }, [searchQuery, admissions]);

  const fetchAdmissions = async () => {
    if (!hospitalId) return;
    
    setLoading(true);
    try {
      // Fetch admissions from the database
      const { data: admissionData, error: admissionError } = await supabase
        .from('admissions')
        .select('*')
        .eq('hospital_id', hospitalId)
        .order('date_in', { ascending: false });
        
      if (admissionError) {
        throw admissionError;
      }
      
      // Fetch patient information to get names
      const enhancedAdmissions = await Promise.all(
        (admissionData || []).map(async (admission) => {
          const { data: patientData } = await supabase
            .from('patients')
            .select('name')
            .eq('id', admission.patient_id)
            .maybeSingle();
            
          return {
            ...admission,
            patient_name: patientData?.name || 'Unknown'
          };
        })
      );
      
      setAdmissions(enhancedAdmissions);
      setFilteredAdmissions(enhancedAdmissions);
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

  const handleDischarge = (admission: Admission) => {
    setSelectedAdmission(admission);
    setFeedback(admission.feedback || "");
    setRecovered(admission.recovered || false);
    setDischargeDialogOpen(true);
  };

  const completeDischarge = async () => {
    if (!selectedAdmission) return;
    
    try {
      const currentDate = new Date().toISOString().split('T')[0];
      const currentTime = new Date().toTimeString().split(' ')[0];
      
      const { error } = await supabase
        .from('admissions')
        .update({
          discharged: true,
          recovered: recovered,
          feedback: feedback,
          date_out: currentDate,
          time_out: currentTime
        })
        .eq('id', selectedAdmission.id);
        
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Patient discharged successfully",
      });
      
      setDischargeDialogOpen(false);
      fetchAdmissions();
    } catch (error) {
      console.error("Error discharging patient:", error);
      toast({
        title: "Error",
        description: "Failed to discharge patient",
        variant: "destructive",
      });
    }
  };

  const handleAddNewAdmission = () => {
    setNewAdmissionDialogOpen(true);
  };

  const handleAdmissionCreated = () => {
    setNewAdmissionDialogOpen(false);
    fetchAdmissions();
  };

  return (
    <AuthenticatedLayout requiredUserType="hospital">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Admissions</h1>
          <Button onClick={handleAddNewAdmission}>New Admission</Button>
        </div>
        
        <Card className="mb-6">
          <CardHeader className="pb-1">
            <CardTitle>Patient Admissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Input
                placeholder="Search by patient name or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            {loading ? (
              <p className="text-center py-4">Loading admissions...</p>
            ) : filteredAdmissions.length === 0 ? (
              <p className="text-center py-4">No admissions found.</p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient</TableHead>
                      <TableHead>Patient ID</TableHead>
                      <TableHead>Admitted On</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAdmissions.map((admission) => (
                      <TableRow key={admission.id}>
                        <TableCell>{admission.patient_name}</TableCell>
                        <TableCell>{admission.patient_id}</TableCell>
                        <TableCell>{`${admission.date_in} ${admission.time_in}`}</TableCell>
                        <TableCell>
                          {admission.discharged ? (
                            <Badge variant={admission.recovered ? "success" : "warning"}>
                              {admission.recovered ? "Recovered" : "Discharged"}
                            </Badge>
                          ) : (
                            <Badge>In Treatment</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {!admission.discharged && (
                            <Button variant="outline" onClick={() => handleDischarge(admission)}>
                              Discharge
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Discharge Patient Dialog */}
        <Dialog open={dischargeDialogOpen} onOpenChange={setDischargeDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Discharge Patient</DialogTitle>
            </DialogHeader>
            <div className="py-4 space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="recoveredCheckbox"
                  checked={recovered}
                  onChange={() => setRecovered(!recovered)}
                  className="rounded"
                />
                <label htmlFor="recoveredCheckbox">Patient has recovered</label>
              </div>
              
              <div>
                <label htmlFor="feedback" className="block mb-2 text-sm font-medium">
                  Discharge Notes
                </label>
                <Textarea
                  id="feedback"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Enter discharge notes..."
                  className="min-h-[100px]"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setDischargeDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={completeDischarge}>Discharge Patient</Button>
            </div>
          </DialogContent>
        </Dialog>
        
        {/* New Admission Dialog */}
        <Dialog open={newAdmissionDialogOpen} onOpenChange={setNewAdmissionDialogOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>New Patient Admission</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <NewAdmissionForm onAdmissionCreated={handleAdmissionCreated} />
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AuthenticatedLayout>
  );
};

export default Admissions;
