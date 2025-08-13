import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs"; // Nodemailer requires Node.js runtime, not Edge

export async function POST(req: Request) {
  try {
    const isDev = process.env.NODE_ENV !== "production";
  const useEthereal = isDev && process.env.USE_ETHEREAL === "true";
    let body: any;
    try {
      body = await req.json();
    } catch (e) {
      return NextResponse.json(
        { error: "Invalid JSON body" },
        { status: 400 }
      );
    }

    const name = typeof body?.name === "string" ? body.name.trim() : "";
    const email = typeof body?.email === "string" ? body.email.trim() : "";
    const message =
      typeof body?.message === "string" ? body.message.trim() : "";

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Missing fields: name, email, and message are required." },
        { status: 400 }
      );
    }

    // Configure nodemailer transporter
    let transporter: nodemailer.Transporter;
    let toAddress = process.env.CONTACT_ADMIN_EMAIL;

    if (useEthereal) {
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      // Default toAddress to the ethereal account so we can preview the message
      toAddress = testAccount.user;
    } else {
      const requiredEnv = [
        "SMTP_HOST",
        "SMTP_PORT",
        "SMTP_USER",
        "SMTP_PASS",
        "CONTACT_ADMIN_EMAIL",
      ] as const;
      const missing = requiredEnv.filter((k) => !process.env[k]);
      if (missing.length) {
        return NextResponse.json(
          {
            error: "Server email configuration is missing",
            ...(isDev && { details: `Missing env: ${missing.join(", ")}` }),
          },
          { status: 500 }
        );
      }

      transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
    }

    // Optionally verify transporter in dev to expose clearer errors
  if (isDev && !useEthereal && process.env.SMTP_SKIP_VERIFY !== "true") {
      try {
        await transporter.verify();
      } catch (e: any) {
        console.error("SMTP verify failed:", e);
        return NextResponse.json(
          {
            error: "Email transport verification failed",
            details: e?.message ?? String(e),
            code: e?.code,
            response: e?.response,
            responseCode: e?.responseCode,
          },
          { status: 500 }
        );
      }
    }

    // Send mail
    const info = await transporter.sendMail({
      from: `Kursor Contact <${process.env.SMTP_USER}>`,
      to: toAddress,
      replyTo: email,
      subject: `New Contact Form Submission from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
      html: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Message:</strong><br/>${message.replace(
        /\n/g,
        "<br/>"
      )}</p>`,
    });

    const previewUrl = useEthereal
      ? nodemailer.getTestMessageUrl(info) || undefined
      : undefined;

    return NextResponse.json({ success: true, ...(previewUrl && { previewUrl }) });
  } catch (error) {
    console.error("/api/contact error:", error);
    return NextResponse.json(
      {
        error: "Failed to send message",
        ...(process.env.NODE_ENV !== "production" && {
          details: (error as any)?.message ?? String(error),
          code: (error as any)?.code,
          response: (error as any)?.response,
          responseCode: (error as any)?.responseCode,
        }),
      },
      { status: 500 }
    );
  }
} 