# 👶 Baby Cry Detection System

## Overview
The Baby Cry Detection System is an intelligent, real-time monitoring solution integrated into the ForMa child care management application. It automatically detects baby cries using machine learning, notifies caretakers and parents, and tracks response times.

## 🌟 Features

### 1. **Real-Time Cry Detection**
- Continuous audio monitoring using browser microphone
- Machine learning-based cry classification
- Confidence scoring (0-100%)
- Audio feature extraction (frequency, amplitude, spectral analysis)

### 2. **Smart Notifications**
- **Instant Alerts**: Socket.io-based real-time notifications
- **Role-Based Notifications**:
  - **Caretakers & Admins**: Receive all cry alerts immediately
  - **Mothers**: Notified only when cry is assigned to their child
- **Browser Notifications**: Desktop notifications with sound alerts
- **Visual Indicators**: Real-time status badges and alert counters

### 3. **Assignment Workflow**
```
1. System detects cry → 2. Caretaker receives alert → 
3. Caretaker assigns to specific child → 4. Mother notified → 
5. Caretaker marks attended/resolved
```

### 4. **Comprehensive Tracking**
- Cry detection timestamp and confidence
- Assignment tracking (who, when)
- Response time calculation
- Action taken logging
- False alarm marking
- Historical cry analytics

### 5. **Analytics & Reporting**
- Today's cry statistics
- Response time averages
- False alarm rate tracking
- Hourly/daily cry patterns
- Per-child cry history

## 🏗️ Architecture

### Backend Components

#### 1. **Database Model** (`models/CryLog.js`)
```javascript
{
  detectedAt: Date,
  confidence: Number (0-1),
  duration: Number (seconds),
  audioFeatures: { frequency, amplitude, spectralCentroid },
  child: ObjectId (ref: Child),
  assignedBy: ObjectId (ref: User),
  status: 'detected' | 'assigned' | 'attended' | 'resolved' | 'false_alarm',
  responseTime: Number (seconds),
  notificationsSent: Array
}
```

#### 2. **API Routes** (`routes/cry.js`)
- `GET /api/cry/logs` - Get all cry logs with filters
- `GET /api/cry/unassigned` - Get unassigned cries
- `GET /api/cry/active` - Get active cry alerts
- `GET /api/cry/child/:childId/history` - Get child's cry history
- `GET /api/cry/stats/today` - Today's statistics
- `GET /api/cry/analytics` - Analytics with date range
- `POST /api/cry/detect` - Create new cry detection
- `PUT /api/cry/:cryId/assign` - Assign cry to child
- `PUT /api/cry/:cryId/attended` - Mark as attended
- `PUT /api/cry/:cryId/resolved` - Mark as resolved
- `PUT /api/cry/:cryId/false-alarm` - Mark as false alarm

#### 3. **ML Service** (`services/cryDetectionService.js`)
- TensorFlow.js-based cry detection
- Real-time audio processing
- Feature extraction (MEL spectrograms, FFT)
- Configurable detection threshold

#### 4. **WebSocket Server** (`server.js` with Socket.io)
- Real-time bidirectional communication
- User-specific rooms for targeted notifications
- Role-based broadcast channels
- Events: `cry-detected`, `cry-assigned`, `cry-status-updated`

### Frontend Components

#### 1. **CryDetector Component**
- **Purpose**: Audio capture and real-time cry detection
- **Features**:
  - Microphone activation/deactivation
  - Real-time audio level visualization
  - Client-side pre-processing
  - Detection confidence display
  - Privacy-focused (no audio storage)

#### 2. **CryAlert Component**
- **Purpose**: Display and manage cry alerts
- **Features**:
  - Unassigned cry alerts (caretakers/admins)
  - Active cry alerts (all users)
  - Child assignment modal
  - Resolution modal with notes
  - False alarm marking
  - Real-time updates via WebSocket

#### 3. **Dashboard Integration**
- **Admin Dashboard**: Full cry detection + alert management
- **Caretaker Dashboard**: Full cry detection + alert management
- **Mother Dashboard**: Cry alerts for their children only

## 🚀 Installation & Setup

### Prerequisites
- Node.js 16+ and npm
- MongoDB running
- Microphone access enabled in browser

### Step 1: Install Dependencies

**Backend:**
```bash
cd backend
npm install socket.io @tensorflow/tfjs-node
```

**Frontend:**
```bash
cd client
npm install socket.io-client
```

### Step 2: Environment Configuration

Add to `backend/.env`:
```
CLIENT_URL=http://localhost:3000
PORT=5000
```

### Step 3: Start Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd client
npm start
```

### Step 4: Enable Microphone Permissions

When prompted by the browser, allow microphone access for cry detection to work.

## 📖 Usage Guide

### For Caretakers

1. **Enable Cry Detection**
   - Navigate to dashboard
   - Click "🎤 Start Listening" in Cry Detector card
   - Allow microphone permissions
   - System begins monitoring automatically

2. **Respond to Alerts**
   - When cry detected, alert appears in "Unassigned Cry Alerts"
   - Click "✅ Assign to Child"
   - Select the crying baby from dropdown
   - Click "Assign" - Mother will be notified

3. **Resolve Alerts**
   - After attending to the baby, click "Mark Resolved"
   - Enter action taken (e.g., "Fed baby", "Changed diaper")
   - Add optional notes
   - Response time is automatically calculated

4. **Mark False Alarms**
   - If cry detected but no baby actually crying
   - Click "❌ False Alarm"
   - System learns and improves over time

### For Mothers

1. **Receive Notifications**
   - You'll receive alerts when YOUR baby is crying
   - Both in-app and browser notifications
   - Click alert to see details

2. **View Cry History**
   - Check your child's cry patterns
   - See response times
   - Review actions taken by caretakers

### For Admins

- Access all features (detection + management)
- View system-wide cry statistics
- Monitor unassigned cries
- Track caretaker response times
- Generate analytics reports

## 🔧 Configuration

### Detection Threshold
Adjust sensitivity in `backend/services/cryDetectionService.js`:
```javascript
this.detectionThreshold = 0.7; // Default 70%
// Lower = more sensitive (more false positives)
// Higher = less sensitive (might miss some cries)
```

### Audio Parameters
Configure in `CryDetector.js`:
```javascript
audio: {
  echoCancellation: true,
  noiseSuppression: true,
  autoGainControl: true,
  sampleRate: 16000 // 16kHz
}
```

## 📊 Analytics & Insights

### Available Metrics
- Total cries detected (today/date range)
- Assignment rate (assigned vs unassigned)
- Average response time
- False alarm rate
- Hourly cry patterns
- Per-child cry frequency
- Caretaker performance metrics

### Accessing Analytics
```javascript
// Get today's stats
const stats = await cryService.getTodayStats();

// Get analytics for date range
const analytics = await cryService.getCryAnalytics({
  startDate: '2026-01-01',
  endDate: '2026-01-31',
  childId: 'optional'
});
```

## 🔒 Privacy & Security

### Audio Privacy
- ✅ Audio processed locally in browser
- ✅ No audio recordings stored
- ✅ Only detection events logged
- ✅ Microphone can be disabled anytime

### Data Security
- ✅ JWT-based authentication
- ✅ Role-based access control
- ✅ Encrypted data transmission
- ✅ MongoDB security best practices

### Notification Privacy
- ✅ Mothers only see their children's alerts
- ✅ Caretakers see only assigned children
- ✅ Admins have full oversight

## 🐛 Troubleshooting

### Microphone Not Working
1. Check browser permissions (Settings → Privacy → Microphone)
2. Ensure no other app is using microphone
3. Try refreshing the page
4. Check browser console for errors

### Not Receiving Notifications
1. Verify browser notification permissions
2. Check Socket.io connection (console should show "✅ Connected")
3. Ensure user is logged in
4. Check network/firewall settings

### False Detections
1. Reduce background noise
2. Adjust detection threshold
3. Mark false alarms to improve system
4. Consider using noise-canceling microphone

### Connection Issues
1. Verify backend server is running
2. Check CORS configuration
3. Ensure Socket.io ports are open
4. Check `CLIENT_URL` environment variable

## 🎯 Machine Learning Details

### Model Architecture
- Input: Mel-frequency spectral coefficients (128 bands)
- Hidden layers: 64 → 32 neurons with dropout
- Output: Binary classification (cry vs no cry)
- Activation: ReLU (hidden), Sigmoid (output)

### Audio Features Extracted
1. **Spectral Centroid**: Dominant frequency
2. **Energy**: Overall audio power
3. **Zero Crossing Rate**: Signal oscillation rate
4. **MEL Spectrogram**: Frequency distribution over time

### Baby Cry Characteristics
- Fundamental frequency: 200-600 Hz
- High energy bursts
- Repetitive patterns
- Spectral centroid typically 300-500 Hz

## 🔮 Future Enhancements

### Planned Features
- [ ] Cry reason classification (hungry, tired, pain, etc.)
- [ ] ML model training dashboard
- [ ] Historical pattern recognition
- [ ] Predictive crying alerts
- [ ] Integration with baby monitors
- [ ] Mobile app support
- [ ] Multilingual support
- [ ] Voice-based caretaker logging

### Model Improvements
- [ ] Train on larger baby cry datasets
- [ ] Implement transfer learning
- [ ] Add cry type classification
- [ ] Age-specific detection models
- [ ] Continuous learning from feedback

## 📚 API Reference

### Socket.io Events

**Client → Server:**
```javascript
socket.emit('join-user-room', userId);
socket.emit('join-role-room', role);
```

**Server → Client:**
```javascript
// New cry detected
socket.on('cry-detected', (data) => {
  // data: { id, detectedAt, confidence, status }
});

// Cry assigned to child
socket.on('cry-assigned', (data) => {
  // data: { id, child: { id, name }, assignedAt, assignedBy }
});

// Cry status updated
socket.on('cry-status-updated', (data) => {
  // data: { id, status, respondedBy, responseTime }
});
```

## 🤝 Contributing

### Code Organization
```
backend/
├── models/CryLog.js          # Database schema
├── controllers/cryController.js  # API logic
├── routes/cry.js             # API endpoints
├── services/cryDetectionService.js  # ML service
└── server.js                 # Socket.io setup

client/src/
├── components/cry/
│   ├── CryDetector.js        # Audio capture & detection
│   ├── CryDetector.css
│   ├── CryAlert.js           # Alert management UI
│   └── CryAlert.css
└── services/cryService.js    # API client
```

## 📞 Support

For issues or questions:
1. Check troubleshooting section
2. Review console logs (browser & server)
3. Verify all dependencies installed
4. Ensure microphone permissions granted

## 📝 License

This cry detection system is part of the ForMa child care management application.

---

**Built with ❤️ using:**
- TensorFlow.js for ML
- Socket.io for real-time communication
- React for UI
- Node.js/Express for backend
- MongoDB for data storage

**References:**
- [giulbia/baby_cry_detection](https://github.com/giulbia/baby_cry_detection)
- [mandymadongyi/Baby-Cry-Detector-CASA0018](https://github.com/mandymadongyi/Baby-Cry-Detector-CASA0018)
- [echoCodeScript/Infant-Cry-Classification-ML-Model](https://github.com/echoCodeScript/Infant-Cry-Classification-ML-Model)
