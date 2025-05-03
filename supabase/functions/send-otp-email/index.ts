
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

interface OTPEmailRequest {
  email: string;
  otp: string;
  userType: 'doctor' | 'hospital' | 'user';
  name: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Parse request body
  try {
    const { email, otp, userType, name }: OTPEmailRequest = await req.json();

    if (!RESEND_API_KEY) {
      console.error("RESEND_API_KEY not configured");
      return new Response(
        JSON.stringify({ 
          error: "RESEND_API_KEY not configured", 
          note: "Please configure the RESEND_API_KEY environment variable in your Supabase project."
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    console.log(`Attempting to send OTP email to ${email} for ${userType} ${name}`);

    // Send email with Resend API
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: "onboarding@resend.dev",
        to: email,
        subject: "Password Reset OTP - Health Portal",
        html: `
          <h1>Health Portal Password Reset</h1>
          <p>You have requested to reset your password for your ${userType} account.</p>
          <p>Your One-Time Password (OTP) is:</p>
          <h2 style="font-size: 24px; padding: 10px; background-color: #f0f0f0; text-align: center; letter-spacing: 5px;">${otp}</h2>
          <p>This OTP is valid for 10 minutes. If you did not request this password reset, please ignore this email.</p>
          <p>Best regards,<br>Health Portal Team</p>
        `
      })
    });

    const result = await response.json();
    console.log("Email sending result:", result);

    return new Response(
      JSON.stringify({ success: true, message: "OTP email sent successfully", result }),
      { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  } catch (error) {
    console.error("Error sending OTP email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});
