import { sendBookingEmail } from "./emailService";

export const requestNotificationPermission = () => {
  if ("Notification" in window && Notification.permission === "default") {
    Notification.requestPermission().then((permission) => {
      console.log("Notification permission:", permission);
    });
  }
};

export const sendEmailNotification = async (bookingData) => {
  return await sendBookingEmail(bookingData);
};

export const scheduleReminder = (bookingData) => {
  try {
    const bookingDate = new Date(`${bookingData.date}T${bookingData.start}`);
    const reminderTime = new Date(bookingDate.getTime() - 30 * 60 * 1000);

    const now = new Date();
    const timeUntilReminder = reminderTime.getTime() - now.getTime();

    if (timeUntilReminder > 0) {
      console.log(`⏰ Reminder scheduled for ${reminderTime.toLocaleString()}`);

      const timerId = setTimeout(() => {
        triggerReminderNotification(bookingData);
      }, timeUntilReminder);

      saveReminderSchedule(bookingData.id, timerId, reminderTime);

      return timerId;
    } else {
      console.log(
        "⚠️ Booking starts soon or has passed, no reminder scheduled"
      );
      return null;
    }
  } catch (error) {
    console.error("Failed to schedule reminder:", error);
    return null;
  }
};

const triggerReminderNotification = (bookingData) => {
  try {
    const existingNotifications =
      JSON.parse(localStorage.getItem("notifications")) || [];

    const reminderNotification = {
      id: Date.now(),
      title: "Meeting Reminder ⏰",
      message: `Your meeting in ${bookingData.room} starts in 30 minutes. Floor ${bookingData.floor}, ${bookingData.start}`,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      unread: true,
      iconType: "bell",
      bg: "bg-yellow-50",
      tag: "Reminder",
      type: "meeting",
    };

    const updatedNotifications = [
      reminderNotification,
      ...existingNotifications,
    ];
    localStorage.setItem("notifications", JSON.stringify(updatedNotifications));

    updateBookingReminderStatus(bookingData.id);

    updateReminderStatus(bookingData.id);

    window.dispatchEvent(new CustomEvent("notificationAdded"));

    if (Notification.permission === "granted") {
      new Notification("Meeting Reminder ⏰", {
        body: `Your meeting in ${bookingData.room} starts in 30 minutes.`,
        icon: "/favicon.ico",
        tag: `meeting-reminder-${bookingData.id}`,
      });
    }

    return true;
  } catch (error) {
    console.error("Failed to trigger reminder:", error);
    return false;
  }
};

const saveReminderSchedule = (bookingId, timerId, reminderTime) => {
  try {
    const reminders =
      JSON.parse(localStorage.getItem("scheduledReminders")) || [];
    reminders.push({
      bookingId: bookingId,
      reminderTime: reminderTime.toISOString(),
      timerId: timerId._id || Date.now(),
      scheduledAt: new Date().toISOString(),
      triggered: false,
    });
    localStorage.setItem("scheduledReminders", JSON.stringify(reminders));
  } catch (error) {
    console.error("Failed to save reminder schedule:", error);
  }
};

const updateBookingReminderStatus = (bookingId) => {
  try {
    const bookings = JSON.parse(localStorage.getItem("meetingBookings")) || [];
    const updatedBookings = bookings.map((booking) => {
      if (booking.id === bookingId) {
        return {
          ...booking,
          reminderSent: true,
          reminderSentAt: new Date().toISOString(),
        };
      }
      return booking;
    });
    localStorage.setItem("meetingBookings", JSON.stringify(updatedBookings));
  } catch (error) {
    console.error("Failed to update booking reminder status:", error);
  }
};

const updateReminderStatus = (bookingId) => {
  try {
    const reminders =
      JSON.parse(localStorage.getItem("scheduledReminders")) || [];
    const updatedReminders = reminders.map((reminder) => {
      if (reminder.bookingId === bookingId) {
        return {
          ...reminder,
          triggered: true,
          triggeredAt: new Date().toISOString(),
        };
      }
      return reminder;
    });
    localStorage.setItem(
      "scheduledReminders",
      JSON.stringify(updatedReminders)
    );
  } catch (error) {
    console.error("Failed to update reminder status:", error);
  }
};

export const initializeReminders = () => {
  try {
    const bookings = JSON.parse(localStorage.getItem("meetingBookings")) || [];
    const now = new Date();

    const existingReminders =
      JSON.parse(localStorage.getItem("scheduledReminders")) || [];

    bookings.forEach((booking) => {
      if (booking.status === "Active" && !booking.reminderSent) {
        const bookingStart = new Date(`${booking.date}T${booking.start}`);

        if (bookingStart > now) {
          const reminderAlreadyScheduled = existingReminders.some(
            (reminder) =>
              reminder.bookingId === booking.id && !reminder.triggered
          );

          if (!reminderAlreadyScheduled) {
            scheduleReminder(booking);
          }
        }
      }
    });

    console.log("✅ Reminders initialized for all upcoming meetings");
  } catch (error) {
    console.error("Failed to initialize reminders:", error);
  }
};

export const cancelReminder = (bookingId) => {
  try {
    const reminders =
      JSON.parse(localStorage.getItem("scheduledReminders")) || [];
    const reminderToCancel = reminders.find(
      (r) => r.bookingId === bookingId && !r.triggered
    );

    if (reminderToCancel && reminderToCancel.timerId) {
      const updatedReminders = reminders.filter(
        (r) => r.bookingId !== bookingId
      );
      localStorage.setItem(
        "scheduledReminders",
        JSON.stringify(updatedReminders)
      );

      console.log(`❌ Reminder cancelled for booking ${bookingId}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error("Failed to cancel reminder:", error);
    return false;
  }
};

export const getReminderStats = () => {
  try {
    const reminders =
      JSON.parse(localStorage.getItem("scheduledReminders")) || [];
    const triggered = reminders.filter((r) => r.triggered);
    const pending = reminders.filter((r) => !r.triggered);

    return {
      total: reminders.length,
      triggered: triggered.length,
      pending: pending.length,
    };
  } catch (error) {
    return { total: 0, triggered: 0, pending: 0 };
  }
};
