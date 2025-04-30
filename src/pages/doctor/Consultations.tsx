
import React, { useEffect, useState } from "react";
import AuthenticatedLayout from "@/components/layouts/AuthenticatedLayout";
import { authService } from "@/services/auth.service";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Consultation } from "@/models/models";
import { toast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

const Consultations: React.FC = () => {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null);
  const [prescription, setPrescription] = useState("");

  const doctorId = authService.getUserId();

  useEffect(() => {
    fetchConsultations();
  }, []);

  const fetchConsultations = async () => {
    try {
      setLoading(true);
      
      // For demonstration purposes, we'll create mock data
      const mockConsultations: Consultation[] = [
        {
          id: "1",
          patientId: "patient1",
          patientName: "John Doe",
          doctorId: doctorId || "",
          doctorName: authService.getUserName() || "Doctor",
          date: "2023-05-15",
          time: "10:00 AM",
          place: "Hospital",
          placeId: "hospital1",
        },
        {
          id: "2",
          patientId: "patient2",
          patientName: "Jane Smith",
          doctorId: doctorId || "",
          doctorName: authService.getUserName() || "Doctor",
          date: "2023-05-16",
          time: "11:30 AM",
          place: "Clinic",
          placeId: "clinic1",
          prescription: "Rest for 3 days and take prescribed medicine"
        }
      ];
      
      setConsultations(mockConsultations);
      
      // In a real implementation, we would fetch from Supabase
      /*
      const { data, error } = await supabase
        .from('consultations')
        .select('*')
        .eq('doctorId', doctorId);
        
      if (error) {
        toast({
          title: "Error fetching consultations",
          description: error.message,
          variant: "destructive",
        });
        return;
      }
      
      setConsultations(data || []);
      */
    } catch (error) {
      console.error("Error fetching consultations:", error);
      toast({
        title: "Error",
        description: "Failed to fetch consultations",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddPrescription = (consultation: Consultation) => {
    setSelectedConsultation(consultation);
    setPrescription(consultation.prescription || "");
    setOpenDialog(true);
  };

  const savePrescription = async () => {
    if (!selectedConsultation) return;
    
    try {
      // In a real implementation, we would update the database
      // For now, we'll just update our local state
      const updatedConsultations = consultations.map(c => 
        c.id === selectedConsultation.id ? { ...c, prescription } : c
      );
      
      setConsultations(updatedConsultations);
      
      /* 
      const { error } = await supabase
        .from('consultations')
        .update({ prescription })
        .eq('id', selectedConsultation.id);
        
      if (error) throw error;
      */
      
      toast({
        title: "Success",
        description: "Prescription saved successfully",
      });
      
      setOpenDialog(false);
    } catch (error) {
      console.error("Error saving prescription:", error);
      toast({
        title: "Error",
        description: "Failed to save prescription",
        variant: "destructive",
      });
    }
  };

  return (
    <AuthenticatedLayout requiredUserType="doctor">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Consultations</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>My Consultations</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p>Loading consultations...</p>
            ) : consultations.length === 0 ? (
              <p>No consultations found.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Place</TableHead>
                    <TableHead>Prescription</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {consultations.map((consultation) => (
                    <TableRow key={consultation.id}>
                      <TableCell>{consultation.patientName}</TableCell>
                      <TableCell>{consultation.date}</TableCell>
                      <TableCell>{consultation.time}</TableCell>
                      <TableCell>{consultation.place}</TableCell>
                      <TableCell>{consultation.prescription ? "Added" : "Not added"}</TableCell>
                      <TableCell>
                        <Button 
                          variant="outline" 
                          onClick={() => handleAddPrescription(consultation)}
                        >
                          {consultation.prescription ? "Edit Prescription" : "Add Prescription"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
        
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {selectedConsultation?.prescription ? "Edit Prescription" : "Add Prescription"}
              </DialogTitle>
            </DialogHeader>
            
            <div className="py-4">
              <h3 className="font-medium mb-2">Patient: {selectedConsultation?.patientName}</h3>
              <h4 className="text-sm text-muted-foreground mb-4">
                Date: {selectedConsultation?.date} at {selectedConsultation?.time}
              </h4>
              
              <Textarea
                value={prescription}
                onChange={(e) => setPrescription(e.target.value)}
                placeholder="Enter prescription details..."
                className="min-h-[150px]"
              />
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpenDialog(false)}>Cancel</Button>
              <Button onClick={savePrescription}>Save Prescription</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AuthenticatedLayout>
  );
};

export default Consultations;
