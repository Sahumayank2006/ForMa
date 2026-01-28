# Activity Modules Documentation

## Overview
Complete implementation guide for all four activity modules in the ForMa WebApp: Food, Diaper, Sleep, and Play tracking systems.

---

## 🍲 Food Module

### Purpose
Track all food and liquid intake for children with detailed logging by caretakers.

### Features
- Manual entry by caretakers
- Multiple food types supported
- Quantity and unit tracking
- Time-stamped records
- Summary analytics

### Food Types
1. **Milk** - Regular/breast milk
2. **Formula** - Formula milk
3. **Solid Food** - Any solid meals
4. **Water** - Plain water
5. **Fruit** - Fresh fruits
6. **Juice** - Fruit juices
7. **Snack** - Light snacks
8. **Other** - Miscellaneous

### Units of Measurement
- **ml** - Milliliters (for liquids)
- **grams** - Grams (for solids)
- **pieces** - Individual items (fruits, snacks)
- **bowl** - Bowl servings
- **cup** - Cup servings

### API Endpoints
```
POST /api/activities/food
Body: {
  childId: ObjectId,
  foodType: String,
  quantity: Number,
  unit: String,
  timeGiven: Date,
  notes: String (optional)
}
Response: { message: "✅ Feeding recorded successfully for {childName}" }

GET /api/activities/food/child/:childId?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
Response: { data: [FoodLog], count: Number }

GET /api/activities/food/summary/:childId
Response: {
  data: {
    totalFeedings: Number,
    timeSinceLastFeed: Number (minutes),
    lastFeedTime: Date,
    feedingsByType: [{ _id: String, count: Number }],
    totalQuantityByUnit: [{ _id: String, total: Number }]
  }
}
```

### Frontend Component
- **File**: `client/src/components/activities/FoodForm.js`
- **Props**: `{ childId, childName, onClose }`
- **State**: `{ foodType, quantity, unit, timeGiven, notes, loading, error }`

### Success Message
```
✅ Feeding recorded successfully for {ChildName}
```

---

## 🧷 Diaper Module

### Purpose
Track diaper changes and send automated alerts when diapers are overdue for changing.

### Features
- Manual diaper change recording
- Three status levels (Clean/Wet/Soiled)
- Alert system for overdue changes
- Time since last change tracking
- System-wide alert monitoring (Admin)

### Diaper Status
1. **Clean** (🟢) - Diaper is clean
2. **Wet** (🟡) - Diaper is wet
3. **Soiled** (🔴) - Diaper needs immediate change

### Alert System

#### Alert Levels
- **Green** (✓ OK): < 2 hours since last change
- **Yellow** (⚠ Check Soon): 2-3 hours since last change
- **Red** (🚨 Urgent): > 3 hours since last change

#### Alert Display Locations
1. **Caretaker Dashboard**: Per-child alert badges
2. **Mother Dashboard**: Per-child alert badges in summary cards
3. **Admin Dashboard**: System-wide overdue alerts section (auto-refresh every 60s)

### API Endpoints
```
POST /api/activities/diaper
Body: {
  childId: ObjectId,
  status: String (Clean/Wet/Soiled),
  timeChecked: Date,
  timeChanged: Date (optional),
  notes: String (optional)
}
Response: { message: "🧷 Diaper status updated for {childName}" }

GET /api/activities/diaper/child/:childId
Response: { data: [DiaperLog], count: Number }

GET /api/activities/diaper/summary/:childId
Response: {
  data: {
    totalChanges: Number,
    timeSinceLastChange: Number (minutes),
    lastChangeTime: Date,
    lastStatus: String,
    alertLevel: String (green/yellow/red),
    changesByStatus: [{ _id: String, count: Number }]
  }
}

GET /api/activities/diaper/check-overdue
Response: {
  success: true,
  count: Number,
  alerts: [{
    childId: ObjectId,
    childName: String,
    motherName: String,
    assignedCaretaker: String,
    lastChangeTime: Date,
    minutesSinceLastChange: Number
  }]
}
```

### Frontend Component
- **File**: `client/src/components/activities/DiaperForm.js`
- **Props**: `{ childId, childName, onClose }`
- **State**: `{ status, timeChecked, timeChanged, notes, loading, error }`
- **Special UI**: Status button selection (visual highlight on active button)

### Success Message
```
🧷 Diaper status updated for {ChildName}
```

---

## 😴 Sleep Module

### Purpose
Track sleep sessions from start to end with duration calculation and quality assessment.

### Features
- Start/End session tracking
- Automatic duration calculation
- Sleep quality rating
- Active session indicator
- Daily sleep summary
- Ready for smartwatch integration

### Sleep Quality Levels
1. **Deep** - Deep, restful sleep
2. **Light** - Light sleep
3. **Restless** - Disturbed sleep
4. **Unknown** - Quality not assessed

### Session States
- **isActive: true** - Sleep session ongoing
- **isActive: false** - Sleep session ended

### Future Integration
- **deviceData** field ready for smartwatch integration
- Automatic sleep detection
- Heart rate monitoring
- Sleep cycle analysis

### API Endpoints
```
POST /api/activities/sleep/start
Body: {
  childId: ObjectId,
  startTime: Date,
  notes: String (optional)
}
Response: { 
  message: "😴 Sleep time started for {childName}",
  data: { _id: ObjectId, isActive: true }
}

PUT /api/activities/sleep/end/:id
Body: {
  quality: String (Deep/Light/Restless/Unknown),
  notes: String (optional)
}
Response: { 
  message: "😴 Sleep session ended for {childName}. Duration: {duration}",
  data: { endTime: Date, duration: Number }
}

GET /api/activities/sleep/child/:childId
Response: { data: [SleepLog], count: Number }

GET /api/activities/sleep/summary/:childId
Response: {
  data: {
    totalSleepToday: Number (minutes),
    averageSleepDuration: Number,
    sleepCount: Number,
    isCurrentlySleeping: Boolean,
    currentSleepDuration: Number (if sleeping),
    activeSleep: { _id, startTime } (if active),
    sleepByQuality: [{ _id: String, count: Number }]
  }
}
```

### Frontend Component
- **File**: `client/src/components/activities/SleepForm.js`
- **Props**: `{ childId, childName, activeSleep, onClose }`
- **State**: `{ startTime, quality, notes, loading, error }`
- **Dual Mode**: 
  - Start mode: Shows startTime input
  - End mode: Shows quality selector (conditional on `isEnding` flag)

### Success Messages
```
😴 Sleep time started for {ChildName}
😴 Sleep session ended for {ChildName}. Duration: {hours}h {minutes}m
```

---

## 🎈 Play Module

### Purpose
Track play sessions with activity type and intensity level monitoring.

### Features
- Start/End session tracking
- Play type categorization
- Activity level tracking
- Automatic duration calculation
- Daily playtime summary
- Ready for camera integration

### Play Types
1. **Indoor** - Indoor activities
2. **Outdoor** - Outdoor play
3. **Toys** - Playing with toys
4. **Games** - Structured games
5. **Creative** - Art, music, creative activities
6. **Physical** - Physical exercise

### Activity Levels
1. **High** - Very active play
2. **Medium** - Moderate activity
3. **Low** - Calm, quiet play

### Session States
- **isActive: true** - Play session ongoing
- **isActive: false** - Play session ended

### Future Integration
- **cameraData** field ready for camera analysis
- Activity level auto-detection
- Safety monitoring
- Social interaction tracking

### API Endpoints
```
POST /api/activities/play/start
Body: {
  childId: ObjectId,
  playType: String,
  activityLevel: String,
  startTime: Date,
  notes: String (optional)
}
Response: { 
  message: "🎈 Play session started for {childName}",
  data: { _id: ObjectId, isActive: true }
}

PUT /api/activities/play/end/:id
Body: {
  notes: String (optional)
}
Response: { 
  message: "🎈 Play session ended for {childName}. Duration: {duration}",
  data: { endTime: Date, duration: Number }
}

GET /api/activities/play/child/:childId
Response: { data: [PlayLog], count: Number }

GET /api/activities/play/summary/:childId
Response: {
  data: {
    totalPlayToday: Number (minutes),
    averagePlayDuration: Number,
    playCount: Number,
    isCurrentlyPlaying: Boolean,
    currentPlayDuration: Number (if playing),
    activePlay: { _id, startTime, playType, activityLevel } (if active),
    playByType: [{ _id: String, count: Number }],
    playByLevel: [{ _id: String, count: Number }]
  }
}
```

### Frontend Component
- **File**: `client/src/components/activities/PlayForm.js`
- **Props**: `{ childId, childName, activePlay, onClose }`
- **State**: `{ playType, activityLevel, startTime, notes, loading, error }`
- **Dual Mode**: 
  - Start mode: Shows playType, activityLevel, startTime inputs
  - End mode: Shows only notes (conditional on `isEnding` flag)

### Success Messages
```
🎈 Play session started for {ChildName}
🎈 Play session ended for {ChildName}. Duration: {hours}h {minutes}m
```

---

## 📋 Activity Timeline

### Purpose
Unified view of all activities across all modules in chronological order.

### Features
- Combines Food, Diaper, Sleep, Play logs
- Auto-refresh every 30 seconds
- Time-ago format ("5m ago", "2h ago", "Yesterday")
- Color-coded icons for each activity type
- Expandable detail view
- Caretaker attribution

### Timeline Data Structure
```javascript
{
  type: String ('food'|'diaper'|'sleep'|'play'),
  timestamp: Date,
  caretaker: String (caretaker name),
  details: {
    // Food
    foodType: String,
    quantity: Number,
    unit: String,
    notes: String
    
    // Diaper
    status: String,
    timeChanged: Date
    
    // Sleep
    isActive: Boolean,
    duration: Number (minutes),
    quality: String
    
    // Play
    isActive: Boolean,
    playType: String,
    activityLevel: String,
    duration: Number (minutes)
  }
}
```

### API Endpoint
```
GET /api/activities/timeline/:childId?date=YYYY-MM-DD
Response: {
  success: true,
  count: Number,
  data: [TimelineItem]
}
```

### Frontend Component
- **File**: `client/src/components/activities/ActivityTimeline.js`
- **Props**: `{ childId }`
- **Auto-refresh**: Every 30 seconds via `setInterval`

### Activity Icons
- 🍲 Food
- 🧷 Diaper
- 😴 Sleep
- 🎈 Play

---

## Cross-Dashboard Integration

### Caretaker Dashboard
- **Activity Buttons**: 4 buttons per child (Feed, Diaper, Sleep, Play)
- **Modal Forms**: Opens activity form in modal overlay
- **Real-time Summary**: Shows time since last activity with alert badges
- **Timeline View**: Full activity timeline for each child
- **Auto-refresh**: Summaries refresh after each activity submission

### Mother Dashboard
- **Summary Cards**: 4 gradient cards per child showing:
  - Last Fed time
  - Diaper status with alert level
  - Sleep status (sleeping now / total today)
  - Play status (playing now / total today)
- **Timeline Toggle**: "View Timeline" / "Hide Timeline" button
- **Read-only**: Cannot perform activities, only monitor
- **Auto-refresh**: Summaries refresh every 30 seconds

### Admin Dashboard
- **System-wide Alerts**: Red alert banner for overdue diapers
- **Alert Details**: Shows child name, caretaker, mother, time since change
- **Timeline Access**: Can view timeline for any child
- **Manual Refresh**: "Refresh" button for on-demand alert check
- **Auto-refresh**: Alerts refresh every 60 seconds

---

## Alert & Notification System

### Diaper Overdue Alerts

#### Trigger Conditions
- No diaper change logged for > 3 hours
- Previous status was "Wet" or "Soiled"

#### Alert Flow
1. System checks `checkOverdueDiapers` every 60 seconds (Admin dashboard)
2. Backend queries all children with last diaper change > 180 minutes ago
3. Returns array of alerts with child, mother, caretaker details
4. Frontend displays in red alert banner (Admin only)
5. Caretaker sees yellow/red badges on their dashboard
6. Mother sees yellow/red badges in summary cards

#### Alert Persistence
- Alerts remain until a new diaper change is logged
- Alert badge updates in real-time when change is recorded
- System-wide alert count decreases automatically

---

## Database Indexes

### Performance Optimization

```javascript
// FoodLog indexes
FoodLog.index({ child: 1, timeGiven: -1 });
FoodLog.index({ createdAt: -1 });

// DiaperLog indexes
DiaperLog.index({ child: 1, timeChanged: -1 });
DiaperLog.index({ timeChanged: -1 });
DiaperLog.index({ alertSent: 1 });

// SleepLog indexes
SleepLog.index({ child: 1, startTime: -1 });
SleepLog.index({ isActive: 1 });

// PlayLog indexes
PlayLog.index({ child: 1, startTime: -1 });
PlayLog.index({ isActive: 1 });
```

---

## Error Handling

### Backend Validation
- Required fields check
- Child existence validation
- Caretaker assignment verification
- Date range validation
- Status/Type enum validation

### Frontend Error Display
- Form-level error messages
- Field-level validation
- Network error handling
- Success/failure alerts

### Common Errors
1. **"Child not found"** - Invalid childId
2. **"Not authorized"** - JWT expired or invalid
3. **"No active sleep/play session found"** - Trying to end non-existent session
4. **"Validation Error"** - Missing required fields

---

## Testing Guide

### Manual Testing Flow

#### 1. Test Food Module
```
1. Login as caretaker
2. Click "Feed" on a child card
3. Select food type: "Milk"
4. Enter quantity: "150"
5. Select unit: "ml"
6. Keep current time
7. Add notes (optional)
8. Submit
9. Verify success message
10. Check summary updated
11. Check timeline shows entry
```

#### 2. Test Diaper Module
```
1. Click "Diaper" on a child card
2. Click "Wet" status button (should highlight yellow)
3. Keep current time for timeChecked
4. Set timeChanged to now
5. Submit
6. Verify success message
7. Check alert badge is green
8. Wait 2 hours (or modify timeChanged in DB)
9. Verify alert badge turns yellow
10. Wait 3+ hours
11. Verify alert badge turns red
12. Login as admin
13. Verify child appears in urgent alerts banner
```

#### 3. Test Sleep Module
```
1. Click "Start Sleep" on a child card
2. Set start time (default is now)
3. Add notes: "Nap time"
4. Submit
5. Verify success message
6. Verify button changes to "End Sleep"
7. Verify "Sleeping now" indicator appears
8. Click "End Sleep"
9. Select quality: "Deep"
10. Submit
11. Verify success message with duration
12. Verify button changes back to "Start Sleep"
13. Check timeline shows both start and end
```

#### 4. Test Play Module
```
1. Click "Start Play" on a child card
2. Select playType: "Outdoor"
3. Select activityLevel: "High"
4. Submit
5. Verify success message
6. Verify button changes to "End Play"
7. Verify "Playing now" indicator appears
8. Click "End Play"
9. Add notes: "Park visit"
10. Submit
11. Verify success message with duration
12. Check summary shows total playtime today
```

#### 5. Test Cross-role Visibility
```
1. Login as caretaker
2. Log a feeding activity
3. Logout
4. Login as mother (same child's mother)
5. Verify feeding appears in summary card
6. Click "View Timeline"
7. Verify feeding appears in timeline
8. Logout
9. Login as admin
10. Navigate to that child
11. Verify feeding appears in timeline
```

---

## Mobile App Conversion Readiness

### Backend Compatibility
✅ RESTful API design  
✅ JWT authentication (compatible with mobile storage)  
✅ Timestamp-based data (supports offline sync)  
✅ Paginated responses (performance optimization)  

### Database Schema
✅ ObjectId references (supports relational queries)  
✅ Indexed fields (fast mobile queries)  
✅ Timestamp fields (sync resolution)  
✅ Activity logs array (efficient querying)  

### Frontend Components
✅ Reusable React components  
✅ Service layer abstraction  
✅ Modular CSS  
✅ Form validation logic  

### Mobile Considerations
- Implement offline mode with local storage
- Add push notifications for alerts
- Optimize images and assets
- Add pull-to-refresh functionality
- Implement background sync

---

## Future Enhancements

### Phase 2 - AI Integration
1. **Camera Integration**
   - Activity level auto-detection
   - Safety monitoring
   - Facial emotion recognition

2. **Smartwatch Integration**
   - Automatic sleep detection
   - Heart rate monitoring
   - Activity tracking

3. **Cry Detection**
   - Microphone-based cry analysis
   - Emotion classification
   - Alert triggers

4. **Predictive Analytics**
   - Feeding schedule predictions
   - Sleep pattern analysis
   - Health anomaly detection

### Phase 3 - Advanced Features
1. **Real-time Notifications**
   - WebSocket implementation
   - Push notifications
   - SMS alerts

2. **Reporting**
   - Daily/weekly/monthly reports
   - PDF export
   - Analytics dashboard

3. **Multi-language Support**
   - Internationalization (i18n)
   - RTL support

4. **Accessibility**
   - Screen reader support
   - Keyboard navigation
   - WCAG compliance

---

## Support & Maintenance

### Monitoring
- Log all API errors
- Track response times
- Monitor database performance
- Alert system uptime

### Backup Strategy
- Daily database backups
- Activity log retention (configurable)
- User data export functionality

### Updates
- Semantic versioning
- Changelog maintenance
- Migration scripts for schema updates

---

**Last Updated**: 2024  
**Module Status**: ✅ All Implemented & Tested  
**Version**: 1.0.0
