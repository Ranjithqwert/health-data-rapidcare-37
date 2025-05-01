
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

interface WelcomeEmailRequest {
  email: string;
  name: string;
  userType: 'doctor' | 'hospital' | 'user';
  password: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Parse request body
  try {
    const { email, name, userType, password }: WelcomeEmailRequest = await req.json();

    if (!RESEND_API_KEY) {
      return new Response(
        JSON.stringify({ error: "RESEND_API_KEY not configured" }),
        { 
          status: 500, 
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

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
        subject: "Welcome to Health Portal - Your Account Details",
        html: `
          <h1>Welcome to Health Portal, ${name}!</h1>
          <p>Your account has been created as a ${userType}.</p>
          <p>Your login credentials:</p>
          <p><strong>Email/ID:</strong> ${email}</p>
          <p><strong>Password:</strong> ${password}</p>
          <p>Please change your password after your first login for security reasons.</p>
          <p>Best regards,<br>Health Portal Team</p>
        `
      })
    });

    const result = await response.json();
    console.log("Email sending result:", result);

    return new Response(
      JSON.stringify({ success: true, message: "Welcome email sent successfully" }),
      { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  } catch (error) {
    console.error("Error sending welcome email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});
