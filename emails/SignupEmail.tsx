import { Button } from "@react-email/button";
import { Html } from "@react-email/html";
import * as React from "react";

interface SignupEmailProps {
  token: string;
}

const SignupEmail: React.FC<SignupEmailProps> = ({ token }) => {
  const authUrl = `${process.env.NEXT_PUBLIC_PROJECT_URL}/auth?token=${token}`;

  return (
    <Html>
      <div style={{ fontFamily: 'Arial, sans-serif', lineHeight: '1.5' }}>
        <h1>Signup Successful</h1>
        <p>Thank you for signing up! Please click the button below to verify your email and complete the signup process.</p>
        <Button
          style={{ padding: '12px 20px', background: "#0070f3", color: "#fff", textDecoration: 'none' }}
          href={authUrl}
        >
          Verify Email
        </Button>
      </div>
    </Html>
  );
};

export default SignupEmail;
