
import React, { useEffect, useState } from "react";
import AuthenticatedLayout from "@/components/layouts/AuthenticatedLayout";
import { authService } from "@/services/auth.service";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Calendar as CalendarIcon, Clock, Upload, FileText, AlertTriangle } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Consultation {
  id: string;
  patient_id: string;
  doctor_id: string;
  consultation_date: string;
  consultation_time: string;
  place: string;
  place_id: string;
  prescription?: string;
  report_link?: string;
  patient_name?: string;
}

const Consultations: React.FC = () => {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [openNewConsultationDialog, setOpenNewConsultationDialog] = useState(false);
  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null);
  const [prescription, setPrescription] = useState("");
  const [prescriptionFile, setPrescriptionFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState("");
  
  // New consultation form state
  const [patientId, setPatientId] = useState("");
  const [patientName, setPatientName] = useState("");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState("09:00");
  const [place, setPlace] = useState<"Hospital" | "Clinic">("Hospital");
  const [placeId, setPlaceId] = useState("");

  const doctorId = authService.getUserId();

  useEffect(() => {
    fetchConsultations();
  }, []);

  const fetchConsultations = async () => {
    try {
      setLoading(true);
      
      if (!doctorId) {
        toast({
          title: "Error",
          description: "Doctor ID not found. Please log in again.",
          variant: "destructive",
        });
        return;
      }
      
      // Fetch consultations from Supabase
      const { data, error } = await supabase
        .from('consultations')
        .select('*')
        .eq('doctor_id', doctorId);
        
      if (error) {
        throw error;
      }
      
      // Get patient names
      const enhancedConsultations = await Promise.all(
        (data || []).map(async (consultation) => {
          const { data: patientData } = await supabase
            .from('patients')
            .select('name')
            .eq('id', consultation.patient_id)
            .maybeSingle();
            
          return {
            ...consultation,
            patient_name: patientData?.name || 'Unknown Patient'
          };
        })
      );
      
      setConsultations(enhancedConsultations);
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
    setPrescriptionFile(null);
    setFileError("");
    setOpenDialog(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      // Check file size (150KB max)
      if (file.size > 153600) { // 150 * 1024 bytes
        setFileError("File size exceeds 150KB limit");
        setPrescriptionFile(null);
      } else {
        setFileError("");
        setPrescriptionFile(file);
      }
    }
  };

  const savePrescription = async () => {
    if (!selectedConsultation) return;
    
    try {
      let reportLink = selectedConsultation.report_link;
      
      // If there's a file, upload it to Supabase Storage
      if (prescriptionFile) {
        console.log("Uploading prescription file:", prescriptionFile.name);
        
        // Create bucket if it doesn't exist
        const { data: bucketExists } = await supabase
          .storage
          .getBucket('rapidcarereports');
          
        if (!bucketExists) {
          console.log("Creating rapidcarereports bucket");
          // If bucket doesn't exist, create it
          const { error: bucketError } = await supabase
            .storage
            .createBucket('rapidcarereports', {
              public: true
            });
          
          if (bucketError) {
            console.error("Error creating bucket:", bucketError);
            throw bucketError;
          }
        }
        
        // Prepare a unique file name
        const fileExt = prescriptionFile.name.split('.').pop();
        const fileName = `${Date.now()}-prescription.${fileExt}`;
        const filePath = `prescriptions/${selectedConsultation.id}/${fileName}`;
        
        // Upload the file to the rapidcarereports bucket
        const { error: uploadError } = await supabase.storage
          .from('rapidcarereports')
          .upload(filePath, prescriptionFile, {
            cacheControl: '3600',
            upsert: true
          });
          
        if (uploadError) {
          console.error("Upload error:", uploadError);
          throw uploadError;
        }
        
        // Get the public URL
        const { data: urlData } = supabase.storage
          .from('rapidcarereports')
          .getPublicUrl(filePath);
          
        reportLink = urlData.publicUrl;
        console.log("Public URL:", reportLink);
      }
      
      // Update the consultation record
      const { error } = await supabase
        .from('consultations')
        .update({ 
          prescription: prescription,
          report_link: reportLink
        })
        .eq('id', selectedConsultation.id);
        
      if (error) {
        console.error("Database update error:", error);
        throw error;
      }
      
      toast({
        title: "Success",
        description: "Prescription saved successfully",
      });
      
      setOpenDialog(false);
      fetchConsultations();
    } catch (error) {
      console.error("Error saving prescription:", error);
      toast({
        title: "Error",
        description: "Failed to save prescription. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleNewConsultation = () => {
    setPatientId("");
    setPatientName("");
    setDate(new Date());
    setTime("09:00");
    setPlace("Hospital");
    setPlaceId("");
    setOpenNewConsultationDialog(true);
  };

  const handleLookupPatient = async () => {
    if (!patientId) {
      toast({
        title: "Error",
        description: "Please enter a patient ID",
        variant: "destructive"
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('patients')
        .select('name')
        .eq('id', patientId)
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        toast({
          title: "Error",
          description: "Patient not found",
          variant: "destructive"
        });
        setPatientName("");
        return;
      }

      setPatientName(data.name);
      toast({
        title: "Success",
        description: "Patient found",
      });
    } catch (error) {
      console.error("Error looking up patient:", error);
      toast({
        title: "Error",
        description: "Failed to look up patient",
        variant: "destructive"
      });
    }
  };

  const createConsultation = async () => {
    if (!patientId || !date || !time || !place) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      const formattedDate = format(date, "yyyy-MM-dd");
      const doctorName = authService.getUserName() || "Doctor";
      
      // Get patient name for the record
      const { data: patientData, error: patientError } = await supabase
        .from('patients')
        .select('name')
        .eq('id', patientId)
        .single();
        
      if (patientError) throw patientError;
      if (!patientData) throw new Error("Patient not found");

      // Create the consultation record with all required fields
      const { data, error } = await supabase
        .from('consultations')
        .insert({
          patient_id: patientId,
          patient_name: patientData.name,
          doctor_id: doctorId,
          doctor_name: doctorName,
          consultation_date: formattedDate,
          consultation_time: time,
          place: place,
          place_id: placeId || doctorId // Fallback to doctor ID if no specific place is provided
        })
        .select();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Consultation created successfully",
      });
      
      setOpenNewConsultationDialog(false);
      fetchConsultations();
    } catch (error) {
      console.error("Error creating consultation:", error);
      toast({
        title: "Error",
        description: "Failed to create consultation",
        variant: "destructive"
      });
    }
  };

  return (
    <AuthenticatedLayout requiredUserType="doctor">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Consultations</h1>
          <Button onClick={handleNewConsultation}>New Consultation</Button>
        </div>
        
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
                      <TableCell>{consultation.patient_name}</TableCell>
                      <TableCell>{consultation.consultation_date}</TableCell>
                      <TableCell>{consultation.consultation_time}</TableCell>
                      <TableCell>{consultation.place}</TableCell>
                      <TableCell>
                        {consultation.prescription ? (
                          <div className="flex items-center">
                            <FileText className="h-4 w-4 mr-1" />
                            {consultation.report_link ? "File uploaded" : "Text added"}
                          </div>
                        ) : "Not added"}
                      </TableCell>
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
        
        {/* Prescription Dialog */}
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {selectedConsultation?.prescription ? "Edit Prescription" : "Add Prescription"}
              </DialogTitle>
            </DialogHeader>
            
            <ScrollArea className="max-h-[60vh]">
              <div className="py-4 pr-4">
                <h3 className="font-medium mb-2">Patient: {selectedConsultation?.patient_name}</h3>
                <h4 className="text-sm text-muted-foreground mb-4">
                  Date: {selectedConsultation?.consultation_date} at {selectedConsultation?.consultation_time}
                </h4>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="prescription">Prescription Notes</Label>
                    <Textarea
                      id="prescription"
                      value={prescription}
                      onChange={(e) => setPrescription(e.target.value)}
                      placeholder="Enter prescription details..."
                      className="min-h-[150px]"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="prescription-file">Upload Prescription File (Max 150KB)</Label>
                    <Input 
                      id="prescription-file" 
                      type="file" 
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" 
                    />
                    
                    {fileError && (
                      <Alert variant="destructive" className="mt-2">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>{fileError}</AlertDescription>
                      </Alert>
                    )}
                    
                    {/* Display file name if selected */}
                    {prescriptionFile && !fileError && (
                      <Alert className="mt-2">
                        <AlertDescription>
                          Selected file: {prescriptionFile.name} ({Math.round(prescriptionFile.size / 1024)} KB)
                        </AlertDescription>
                      </Alert>
                    )}

                    {/* Display existing file if available */}
                    {selectedConsultation?.report_link && !prescriptionFile && (
                      <Alert className="mt-2">
                        <AlertDescription>
                          <a href={selectedConsultation.report_link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline flex items-center">
                            <FileText className="h-4 w-4 mr-1" />
                            View uploaded prescription file
                          </a>
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                </div>
              </div>
            </ScrollArea>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpenDialog(false)}>Cancel</Button>
              <Button onClick={savePrescription} disabled={!!fileError}>
                Save Prescription
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* New Consultation Dialog */}
        <Dialog open={openNewConsultationDialog} onOpenChange={setOpenNewConsultationDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New Consultation</DialogTitle>
            </DialogHeader>
            
            <div className="py-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="patientId">Patient ID</Label>
                  <div className="flex gap-2">
                    <Input
                      id="patientId"
                      value={patientId}
                      onChange={(e) => setPatientId(e.target.value)}
                      placeholder="Enter patient ID"
                      className="flex-1"
                    />
                    <Button variant="outline" onClick={handleLookupPatient} type="button">
                      Look up
                    </Button>
                  </div>
                  {patientName && (
                    <p className="text-sm text-muted-foreground mt-1">Patient: {patientName}</p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="date">Consultation Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div>
                  <Label htmlFor="time">Time</Label>
                  <div className="flex items-center border rounded-md">
                    <Input
                      id="time"
                      type="time"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="border-0"
                    />
                    <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
                
                <div>
                  <Label>Place Type</Label>
                  <Select 
                    value={place} 
                    onValueChange={(value) => setPlace(value as "Hospital" | "Clinic")}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select place" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Hospital">Hospital</SelectItem>
                      <SelectItem value="Clinic">Clinic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="placeId">Place ID (Optional)</Label>
                  <Input
                    id="placeId"
                    value={placeId}
                    onChange={(e) => setPlaceId(e.target.value)}
                    placeholder="Enter hospital/clinic ID"
                  />
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpenNewConsultationDialog(false)}>
                Cancel
              </Button>
              <Button onClick={createConsultation}>Create Consultation</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AuthenticatedLayout>
  );
};

export default Consultations;
