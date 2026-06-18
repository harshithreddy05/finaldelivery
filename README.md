# Delivery Slot Booking System

A modern responsive full-stack web application for booking delivery slots. Built with React, Tailwind CSS, Node.js, and Express.

## Features

- View all delivery slots with capacity, booking count, and availability
- Book delivery slots with live update and success notification
- Prevent overbooking by disabling full slots
- Suggest the next available slot when a selected slot is full
- Responsive dashboard with summary cards, progress bars, and toast alerts
- Simple in-memory backend with REST API

## Folder Structure

- `backend/` - Express API server and in-memory slot data
- `frontend/` - Vite React app with Tailwind styling

## Setup Instructions

1. Open a terminal in the project root:
   ```bash
   cd C:\Users\hemar\DeliverySlotBookingSystem
   ```
2. Install dependencies for both apps:
   ```bash
   npm install
   cd frontend
   npm install
   cd ..\backend
   npm install
   ```

## Run Instructions

### Run backend only

```bash
cd backend
npm start
```

### Run frontend only

```bash
cd frontend
npm run dev
```

### Run both apps together

```bash
npm run dev
```

The frontend runs on `http://localhost:5173` and the backend runs on `http://localhost:4000`.

## API Documentation

### GET /slots

Returns all delivery slots with current booking status.

Response shape:

```json
[
  {
    "id": 1,
    "timeLabel": "8:00 AM – 9:00 AM",
    "capacity": 10,
    "booked": 4,
    "available": 6,
    "status": "Available"
  }
]
```

### POST /book/:slotId

Books a slot by `slotId`.

Success response:

```json
{
  "message": "Booking confirmed",
  "slot": {
    "id": 1,
    "timeLabel": "8:00 AM – 9:00 AM",
    "capacity": 10,
    "booked": 5,
    "available": 5,
    "status": "Available"
  }
}
```

Error response when slot is full:

```json
{
  "message": "Slot is full",
  "nextAvailableSlot": "11:00 AM – 12:00 PM"
}
```

## Assumptions

- Data is stored in memory and resets on server restart.
- No authentication is required.
- Booking is handled for a single user session and persisted only on the server process.
- The frontend assumes the backend is available at `http://localhost:4000`.

## AI Usage Note

This project was scaffolded and refined with AI assistance. AI helped plan the folder structure, generate the Express API and React UI components, and shape the responsive Tailwind styling. It also assisted in debugging API validation, designing booking flows, and documenting setup steps.

## Sample Screenshots Description

1. **Dashboard Overview**: A gradient header with summary cards for total slots, capacity, bookings, and available slots.
2. **Slot Grid**: Responsive cards showing slot time, capacity, booked count, available count, progress bar, and booking action.
3. **Notification Banner**: Toast messages for successful bookings and full-slot suggestions.
