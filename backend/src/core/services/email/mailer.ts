import { getEnv } from "@/core/env";
import { render } from "@react-email/render";
import nodemailer from "nodemailer";
import type React from "react";
import { createElement, type ComponentType } from "react";
import { z } from "zod";

const transporter = nodemailer.createTransport({
  service: getEnv("MAIL_SERVICE"),
  auth: {
    user: getEnv("APP_EMAIL"),
    pass: getEnv("SMTP_PASSWORD"),
  },
});

const Email = z.email();

interface EmailFrom {
  name: string;
  email: string;
}

export async function sendEmail<T extends ComponentType<any>>({
  from = { name: "LOSL-C's Team", email: getEnv("APP_EMAIL") },
  to,
  subject,
  text,
  component,
  props,
}: {
  from: EmailFrom;
  to: string;
  subject: string;
  component?: T;
  props?: React.ComponentProps<T>;
  text?: string;
}) {
  const mailOptions: nodemailer.SendMailOptions = {
    from: `"${from.name}" <${from.email}>`,
    to: Email.parse(to),
    subject: subject,
    text: text,
  };

  if (component) {
    const html = await render(createElement(component, props));
    mailOptions.html = html;
  }
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}
