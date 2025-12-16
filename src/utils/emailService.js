import emailjs from "@emailjs/browser";

const EMAILJS_CONFIG = {
  PUBLIC_KEY: "wm7Fvtt9uQMEfSkJz",
  SERVICE_ID: "service_ozr513d",
  TEMPLATE_ID: "template_meetingroom",
  ENABLE_REAL_EMAILS: true,
};

let emailjsInitialized = false;
const initEmailJS = () => {
  if (!emailjsInitialized) {
    emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
    emailjsInitialized = true;
    console.log(
      "✅ EmailJS initialized with Service:",
      EMAILJS_CONFIG.SERVICE_ID
    );
  }
};

export const sendBookingEmail = async (bookingData) => {
  console.log("📧 Starting email process for:", bookingData.email);
  console.log("📧 Using Service ID:", EMAILJS_CONFIG.SERVICE_ID);
  console.log("📧 Using Template ID:", EMAILJS_CONFIG.TEMPLATE_ID);

  try {
    const result = await sendRealEmail(bookingData);
    return result;
  } catch (error) {
    console.error("❌ Real email failed, using mock:", error);
    return await sendMockEmail(bookingData, true);
  }
};

const sendRealEmail = async (bookingData) => {
  try {
    initEmailJS();

    console.log("📧 Attempting to send REAL email to:", bookingData.email);

    const templateParams = {
      to_email: bookingData.email,
      to_name: bookingData.email.split("@")[0] || "User",
      room_name: bookingData.room,
      booking_date: formatDateForEmail(bookingData.date),
      start_time: bookingData.start,
      end_time: bookingData.end,
      attendees: bookingData.attendees,
      floor: bookingData.floor,
      office: bookingData.office || "Main Office",
      booking_id: bookingData.id.toString(),
      booking_time: new Date().toLocaleString(),
      reminder_note:
        "You will receive a reminder notification 30 minutes before your meeting starts.",
      contact_email: "nadafrabiya0@gmail.com",
      subject: `Meeting Room Booking Confirmed: ${bookingData.room}`,
    };

    console.log("📧 Template Parameters:", templateParams);

    const response = await emailjs.send(
      EMAILJS_CONFIG.SERVICE_ID,
      EMAILJS_CONFIG.TEMPLATE_ID,
      templateParams
    );

    console.log("✅ EmailJS Response - Status:", response.status);
    console.log("✅ EmailJS Response - Text:", response.text);

    if (response.status === 200) {
      saveEmailLog(bookingData, "EmailJS", true);

      setTimeout(() => {
        alert(
          `✅ REAL EMAIL SENT SUCCESSFULLY!\n\n📧 Booking confirmation sent to:\n${bookingData.email}\n\n✅ Check your inbox and spam folder.\n\nEmailJS Status: ${response.status} - ${response.text}`
        );
      }, 500);

      return {
        success: true,
        method: "EmailJS",
        realEmail: true,
        response: response,
        message: "Real email sent successfully",
      };
    } else {
      throw new Error(`EmailJS returned status: ${response.status}`);
    }
  } catch (error) {
    console.error("❌ EmailJS Detailed Error:", {
      code: error.code,
      text: error.text,
      message: error.message,
      status: error.status,
    });

    let errorMsg = "Failed to send email. ";
    if (error.text) errorMsg += `Error: ${error.text}`;
    else if (error.message) errorMsg += `Error: ${error.message}`;

    alert(
      `❌ EMAIL SENDING FAILED\n\n${errorMsg}\n\nCheck:\n1. EmailJS Dashboard → Service is connected\n2. EmailJS Dashboard → Template is published\n3. Browser Console for details`
    );

    throw error;
  }
};

const sendMockEmail = async (bookingData, isFallback = false) => {
  console.log("📧 Using MOCK email for:", bookingData.email);

  await new Promise((resolve) => setTimeout(resolve, 500));

  saveEmailLog(bookingData, "Mock", false);

  alert(
    `📧 DEMO MODE ACTIVE\n\nEmail would be sent to: ${bookingData.email}\n\nCurrent Config:\n• Service: ${EMAILJS_CONFIG.SERVICE_ID}\n• Template: ${EMAILJS_CONFIG.TEMPLATE_ID}\n• Real Emails Enabled: ${EMAILJS_CONFIG.ENABLE_REAL_EMAILS}\n\nTo fix:\n1. Check EmailJS Dashboard → Email Services\n2. Check EmailJS Dashboard → Email Templates\n3. Verify template '${EMAILJS_CONFIG.TEMPLATE_ID}' exists and is published`
  );

  return {
    success: true,
    method: "Mock",
    simulated: true,
    message: "Demo email mode",
  };
};

const formatDateForEmail = (dateString) => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch (error) {
    return dateString;
  }
};

const saveEmailLog = (bookingData, method, isReal) => {
  try {
    const emailLogs = JSON.parse(localStorage.getItem("emailLogs")) || [];

    emailLogs.unshift({
      id: Date.now(),
      timestamp: new Date().toISOString(),
      to: bookingData.email,
      subject: `Meeting Room Booking: ${bookingData.room}`,
      room: bookingData.room,
      date: bookingData.date,
      time: `${bookingData.start} - ${bookingData.end}`,
      method: method,
      isReal: isReal,
      status: "sent",
    });

    localStorage.setItem("emailLogs", JSON.stringify(emailLogs.slice(0, 20)));
    console.log(`📝 Email log saved: ${method} email to ${bookingData.email}`);
  } catch (error) {
    console.error("Failed to save email log:", error);
  }
};

export const getEmailStats = () => {
  try {
    const logs = JSON.parse(localStorage.getItem("emailLogs")) || [];
    const realEmails = logs.filter((log) => log.isReal);
    const mockEmails = logs.filter((log) => !log.isReal);

    return {
      total: logs.length,
      real: realEmails.length,
      mock: mockEmails.length,
      lastEmail: logs[0] || null,
    };
  } catch (error) {
    return { total: 0, real: 0, mock: 0, lastEmail: null };
  }
};

export const validateEmailJSSetup = () => {
  const issues = [];

  if (
    !EMAILJS_CONFIG.PUBLIC_KEY ||
    EMAILJS_CONFIG.PUBLIC_KEY === "YOUR_PUBLIC_KEY_HERE"
  ) {
    issues.push("Public Key not configured");
  }

  if (
    !EMAILJS_CONFIG.SERVICE_ID ||
    EMAILJS_CONFIG.SERVICE_ID === "YOUR_SERVICE_ID_HERE"
  ) {
    issues.push("Service ID not configured");
  }

  if (
    !EMAILJS_CONFIG.TEMPLATE_ID ||
    EMAILJS_CONFIG.TEMPLATE_ID === "YOUR_TEMPLATE_ID_HERE"
  ) {
    issues.push("Template ID not configured");
  }

  return {
    isValid: issues.length === 0,
    issues: issues,
    config: {
      realEmailsEnabled: EMAILJS_CONFIG.ENABLE_REAL_EMAILS,
      publicKey: EMAILJS_CONFIG.PUBLIC_KEY ? "Configured" : "Missing",
      serviceId: EMAILJS_CONFIG.SERVICE_ID
        ? EMAILJS_CONFIG.SERVICE_ID
        : "Missing",
      templateId: EMAILJS_CONFIG.TEMPLATE_ID
        ? EMAILJS_CONFIG.TEMPLATE_ID
        : "Missing",
      configStatus: `Service: ${EMAILJS_CONFIG.SERVICE_ID}, Template: ${EMAILJS_CONFIG.TEMPLATE_ID}`,
    },
  };
};

export const testEmailJSConnection = async () => {
  console.log("🔧 Testing EmailJS Connection...");
  console.log("Public Key:", EMAILJS_CONFIG.PUBLIC_KEY);
  console.log("Service ID:", EMAILJS_CONFIG.SERVICE_ID);
  console.log("Template ID:", EMAILJS_CONFIG.TEMPLATE_ID);

  try {
    initEmailJS();

    const testParams = {
      to_email: "nadafrabiya0@gmail.com",
      to_name: "Test",
      room_name: "Test Room",
      booking_date: new Date().toLocaleDateString(),
      start_time: "10:00",
      end_time: "11:00",
      attendees: "2",
      floor: "1",
      office: "Test Office",
      booking_id: "TEST-123",
      booking_time: new Date().toLocaleString(),
      reminder_note: "Test reminder",
      contact_email: "nadafrabiya0@gmail.com",
      subject: "Test Email from EmailJS",
    };

    console.log("🔧 Sending test email...");
    const response = await emailjs.send(
      EMAILJS_CONFIG.SERVICE_ID,
      EMAILJS_CONFIG.TEMPLATE_ID,
      testParams
    );

    console.log("✅ Test Email Sent Successfully!");
    console.log("Response:", response.status, response.text);

    return {
      success: true,
      message: "Test email sent successfully",
      response: response,
    };
  } catch (error) {
    console.error("❌ Test Failed:", error);
    return {
      success: false,
      error: error,
      message: error.text || error.message,
    };
  }
};

export default {
  sendBookingEmail,
  getEmailStats,
  validateEmailJSSetup,
  testEmailJSConnection,
};
