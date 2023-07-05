import { Resend } from "resend";
import * as dotenv from "dotenv";

dotenv.config();
const resendApiKey = process.env.RESEND_API_KEY;
const resend = new Resend(resendApiKey);

const userData = [
  {
    email: "andymelvin725@gmail.com",
    password: "password1",
    schoolId: "school1",
  },
  {
    email: "andymelvin725@gmail.com",
    password: "password1",
    schoolId: "school1",
  },
  {
    email: "andymelvin725@gmail.com",
    password: "password1",
    schoolId: "school1",
  },
  {
    email: "andymelvin725@gmail.com",
    password: "password1",
    schoolId: "school1",
  },
  {
    email: "andymelvin725@gmail.com",
    password: "password1",
    schoolId: "school1",
  },
  {
    email: "andymelvin725@gmail.com",
    password: "password1",
    schoolId: "school1",
  },
  {
    email: "andymelvin725@gmail.com",
    password: "password1",
    schoolId: "school1",
  },
  {
    email: "andymelvin725@gmail.com",
    password: "password1",
    schoolId: "school1",
  },
  {
    email: "andymelvin725@gmail.com",
    password: "password1",
    schoolId: "school1",
  },
  {
    email: "andymelvin725@gmail.com",
    password: "password1",
    schoolId: "school1",
  },
  {
    email: "andymelvin725@gmail.com",
    password: "password1",
    schoolId: "school1",
  },
  {
    email: "andymelvin725@gmail.com",
    password: "password1",
    schoolId: "school1",
  },
  {
    email: "andymelvin725@gmail.com",
    password: "password1",
    schoolId: "school1",
  },
  {
    email: "andymelvin725@gmail.com",
    password: "password1",
    schoolId: "school1",
  },
  {
    email: "andymelvin725@gmail.com",
    password: "password1",
    schoolId: "school1",
  },
  {
    email: "andymelvin725@gmail.com",
    password: "password1",
    schoolId: "school1",
  },
  {
    email: "andymelvin725@gmail.com",
    password: "password1",
    schoolId: "school1",
  },
  {
    email: "andymelvin725@gmail.com",
    password: "password1",
    schoolId: "school1",
  },
  {
    email: "andymelvin725@gmail.com",
    password: "password1",
    schoolId: "school1",
  },
  {
    email: "andymelvin725@gmail.com",
    password: "password1",
    schoolId: "school1",
  },
  {
    email: "andymelvin725@gmail.com",
    password: "password1",
    schoolId: "school1",
  },
 
  // More data Here ...
];

export const sendEmailsInBackgroundJob = async () => {
  try {
    const batchSize = 10;
    const delayBetweenBatches = 4000; // 4 seconds
    const totalBatches = Math.ceil(userData.length / batchSize);

    for (let i = 0; i < totalBatches; i++) {
      const batch = userData.slice(i * batchSize, (i + 1) * batchSize);
      const emailPromises = batch.map(async (user) => {
        const { email, password, schoolId } = user;

        const emailContent = `
          Hello,
          
          Your Libblio e-Library account credentials are as follows:
          
          Email: ${email}
          Password: ${password}
          School ID: ${schoolId}
          
          Please use these credentials to log in to Libblio Library Management System.
          
          Best regards,
          The Libblio Team
        `;

        const data = await resend.emails.send({
          from: "support@libblio.com",
          to: email,
          subject: "Your Libblio Account Credentials",
          text: emailContent,
        });

        console.log(`Email sent to ${email}:`, data);
      });

      await Promise.all(emailPromises);

      if (i < totalBatches - 1) {
        // Delay between batches
        await new Promise((resolve) => setTimeout(resolve, delayBetweenBatches));
      }
    }
    
    console.log("Sending emails ....");
    sendEmailsInBackgroundJob();
  } catch (error) {
    console.error("Error sending emails:", error);
  }
};


