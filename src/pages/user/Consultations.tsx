
import React, { useEffect, useState } from "react";
import AuthenticatedLayout from "@/components/layouts/AuthenticatedLayout";
import { authService } from "@/services/auth.service";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Consultation } from "@/models/models";
import { toast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const Consultations: React.FC = () => {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null);

  const userId = authService.getUserId();

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
          patientId: userId || "",
          patientName: authService.getUserName() || "Patient",
          doctorId: "doctor1",
          doctorName: "Dr. Sarah Johnson",
          date: "2023-05-15",
          time: "10:00 AM",
          place: "Hospital",
          placeId: "hospital1",
          prescription: "Take paracetamol twice daily for 3 days"
        },
        {
          id: "2",
          patientId: userId || "",
          patientName: authService.getUserName() || "Patient",
          doctorId: "doctor2",
          doctorName: "Dr. Robert Miller",
          date: "2023-05-20",
          time: "2:30 PM",
          place: "Clinic",
          placeId: "clinic1",
          prescription: "Complete bed rest for a week and follow up"
        }
      ];
      
      setConsultations(mockConsultations);
      
      // In a real implementation, we would fetch from Supabase
      /*
      const { data, error } = await supabase
        .from('consultations')
        .select('*')
        .eq('patientId', userId);
        
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

  return (
    <AuthenticatedLayout requiredUserType="user">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">My Consultations</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Consultation History</CardTitle>
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
                    <TableHead>Doctor</TableHead>
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
                      <TableCell>{consultation.doctorName}</TableCell>
                      <TableCell>{consultation.date}</TableCell>
                      <TableCell>{consultation.time}</TableCell>
                      <TableCell>{consultation.place}</TableCell>
                      <TableCell>{consultation.prescription ? "Available" : "Not available"}</TableCell>
                      <TableCell>
                        {consultation.prescription && (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline"
                                onClick={() => setSelectedConsultation(consultation)}
                              >
                                View Details
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Consultation Details</DialogTitle>
                              </DialogHeader>
                              <div className="py-4">
                                <div className="mb-4">
                                  <h3 className="font-medium">Doctor: {consultation.doctorName}</h3>
                                  <p className="text-sm text-muted-foreground">
                                    {consultation.date} at {consultation.time}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    Location: {consultation.place}
                                  </p>
                                </div>
                                
                                <div className="border-t pt-4">
                                  <h4 className="font-medium mb-2">Prescription:</h4>
                                  <p>{consultation.prescription}</p>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
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
    </AuthenticatedLayout>
  );
};

export default Consultations;
