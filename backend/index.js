const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// In-memory delivery slots
let slots = [
  { id: 1, time: "08:00 AM - 10:00 AM", capacity: 3, booked: 0 },
  { id: 2, time: "10:00 AM - 12:00 PM", capacity: 5, booked: 5 },
  { id: 3, time: "12:00 PM - 02:00 PM", capacity: 4, booked: 2 },
  { id: 4, time: "02:00 PM - 04:00 PM", capacity: 3, booked: 1 },
  { id: 5, time: "04:00 PM - 06:00 PM", capacity: 6, booked: 3 },
  { id: 6, time: "06:00 PM - 08:00 PM", capacity: 2, booked: 0 }
];

let history = [];

// Helper functions
function formatSlot(slot) {
  return {
    ...slot,
    availableSpaces: slot.capacity - slot.booked,
    utilization: Math.round((slot.booked / slot.capacity) * 100),
    status: slot.booked >= slot.capacity ? "Full" : "Available"
  };
}

function addHistoryRecord(slot, action) {
  history.unshift({
    id: `${Date.now()}-${slot.id}-${action}`,
    slotId: slot.id,
    action,
    time: new Date().toISOString(),
    slot: formatSlot(slot)
  });
  if (history.length > 50) {
    history = history.slice(0, 50);
  }
}

// Home Route
app.get("/", (req, res) => {
  res.send("Delivery Slot Booking API Running 🚚");
});

// Get all slots
app.get("/slots", (req, res) => {
  res.json({
    success: true,
    slots: slots.map(formatSlot)
  });
});

// Book a slot
app.post("/book/:slotId", (req, res) => {
  const slotId = parseInt(req.params.slotId);

  const slot = slots.find((s) => s.id === slotId);

  if (!slot) {
    return res.status(404).json({
      success: false,
      message: "Slot not found"
    });
  }

  if (slot.booked >= slot.capacity) {
    const currentIndex = slots.findIndex((s) => s.id === slotId);

    const nextAvailable = slots
      .slice(currentIndex + 1)
      .find((s) => s.booked < s.capacity);

    return res.status(400).json({
      success: false,
      message: "Slot is full",
      nextAvailableSlot: nextAvailable
        ? nextAvailable.time
        : "No slots available"
    });
  }

  slot.booked++;
  addHistoryRecord(slot, "booked");

  res.json({
    success: true,
    message: "Booking confirmed",
    slot: formatSlot(slot)
  });
});

// Cancel a booking
app.post("/cancel/:slotId", (req, res) => {
  const slotId = parseInt(req.params.slotId);

  const slot = slots.find((s) => s.id === slotId);

  if (!slot) {
    return res.status(404).json({
      success: false,
      message: "Slot not found"
    });
  }

  if (slot.booked <= 0) {
    return res.status(400).json({
      success: false,
      message: "No bookings to cancel for this slot"
    });
  }

  slot.booked--;
  addHistoryRecord(slot, "cancelled");

  res.json({
    success: true,
    message: "Booking cancelled",
    slot: formatSlot(slot)
  });
});

// Get booking history
app.get("/history", (req, res) => {
  res.json({
    success: true,
    history
  });
});

// Admin stats
app.get("/admin/stats", (req, res) => {
  const totalSlots = slots.length;
  const totalCapacity = slots.reduce((sum, slot) => sum + slot.capacity, 0);
  const totalBooked = slots.reduce((sum, slot) => sum + slot.booked, 0);
  const totalAvailable = slots.reduce((sum, slot) => sum + slot.capacity - slot.booked, 0);
  const fullSlots = slots.filter((slot) => slot.booked >= slot.capacity).length;

  res.json({
    success: true,
    stats: {
      totalSlots,
      totalCapacity,
      totalBooked,
      totalAvailable,
      fullSlots
    }
  });
});

const PORT = process.env.PORT || 5002;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});