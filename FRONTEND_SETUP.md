# Delivery Slot Booking System - React Frontend

## 🎯 Overview
A modern, responsive React frontend for managing delivery slot bookings with a polished UI built with Tailwind CSS and Vite.

## ✅ Completed Features

### 1. **Dashboard Statistics** (SummaryCard Component)
- Total Slots
- Total Capacity
- Total Bookings  
- Available Slots
- Gradient-styled cards with hover animations

### 2. **Slot Display** (SlotCard Component)
Each slot card displays:
- ✓ Delivery Time (e.g., "08:00 AM - 10:00 AM")
- ✓ Capacity (total slots available)
- ✓ Booked (number of bookings)
- ✓ Available Spaces (calculated)
- ✓ Utilization Percentage (0%-100%)
- ✓ Utilization progress bar (blue → red at 100%)
- ✓ Status badge (Available/Full)
- ✓ Book Slot button (disabled when full)

### 3. **Booking Functionality**
- POST to `http://localhost:4000/book/:slotId`
- Real-time updates after booking
- Prevents overbooking automatically
- Seamless UI state updates

### 4. **Toast Notifications**
- ✓ Success notifications (green gradient, checkmark icon)
- ✓ Warning notifications (orange gradient)
- ✓ Error notifications (red gradient, error icon)
- Auto-dismiss after 3.5 seconds
- Fixed bottom-right positioning

### 5. **Responsive Design**
- Mobile-first approach
- 1-column layout on mobile
- 2-column layout on tablets (sm:grid-cols-2)
- 3-column layout on desktop (xl:grid-cols-3)
- Flexible header with "Refresh slots" button
- Responsive statistics grid (1→4 columns)

### 6. **Additional Features**
- API error handling with user-friendly messages
- Refresh slots functionality
- Loading states ("Loading slot data...")
- Empty state message when no slots available
- Next available slot suggestion in warning messages
- Smooth animations and hover effects

## 📁 Project Structure

```
frontend/
├── src/
│   ├── App.jsx                 # Main app component with dashboard logic
│   ├── main.jsx                # React entry point
│   ├── index.css               # Global Tailwind styles
│   └── components/
│       ├── SlotCard.jsx        # Individual slot display card
│       ├── SummaryCard.jsx     # Statistics cards
│       └── Toast.jsx           # Toast notifications
├── package.json                # Dependencies
├── vite.config.js              # Vite configuration
├── tailwind.config.js          # Tailwind CSS config
└── postcss.config.js           # PostCSS configuration
```

## 🚀 Running the Frontend

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies (if not already installed)
npm install

# Start development server
npm run dev
```

The frontend will be available at **http://localhost:5173**

## 🔌 API Integration

### Fetch All Slots
```
GET http://localhost:4000/slots
```

Response Format:
```json
{
  "success": true,
  "slots": [
    {
      "id": 1,
      "time": "08:00 AM - 10:00 AM",
      "capacity": 3,
      "booked": 0,
      "availableSpaces": 3,
      "utilization": 0,
      "status": "Available"
    }
  ]
}
```

### Book a Slot
```
POST http://localhost:4000/book/:slotId
```

Success Response:
```json
{
  "success": true,
  "message": "Booking confirmed",
  "slot": { /* updated slot object */ }
}
```

Error Response (Slot Full):
```json
{
  "success": false,
  "message": "Slot is full",
  "nextAvailableSlot": "04:00 PM - 06:00 PM"
}
```

## 🎨 Design Highlights

- **Color Scheme**: Blue gradients with slate backgrounds
- **Typography**: Inter font family with proper hierarchy
- **Spacing**: Consistent use of Tailwind spacing utilities
- **Shadows**: Soft shadows for depth (`shadow-soft`)
- **Animations**: Hover effects, smooth transitions
- **Status Colors**:
  - Available: Green badges and progress bars
  - Full: Red badges and progress bars
  - Utilization: Blue to red gradient progress bars

## 🔧 Technical Stack

- **React 18+**: UI library
- **Vite**: Fast build tool and dev server
- **Tailwind CSS 3+**: Utility-first CSS framework
- **PostCSS**: CSS processing
- **ES6+**: Modern JavaScript

## 📱 Responsive Breakpoints

- **Mobile**: Base styles (single column)
- **Tablet** (sm): 2-column grid
- **Desktop** (md): Full width layout with side-by-side elements
- **Large Desktop** (xl): 3-column grid for slots

## 🐛 Error Handling

- Network errors: "Unable to load slots"
- Booking failures: Backend error messages
- Slot full: Warning with next available slot suggestion
- Empty state: "No slots are available at this time"

## ✨ Future Enhancements

- Add slot filtering (by status, time, availability)
- Implement search functionality
- Add booking history/calendar view
- User authentication and profile
- Advanced date/time selection
- Multiple delivery area support
- Real-time WebSocket updates

## 🎓 Component API

### App Component
Main container with dashboard logic, slot fetching, and booking handling.

### SlotCard Component
Props:
- `slot`: Slot object from API
- `disabled`: Boolean to disable booking
- `onBook`: Callback function for booking

### SummaryCard Component
Props:
- `label`: Card label (e.g., "Total Slots")
- `value`: Numeric value to display

### Toast Component
Props:
- `message`: Toast message text
- `type`: "success" | "warning" | "error"

## 📞 Support

For issues or questions, check the backend API at `http://localhost:4000`
