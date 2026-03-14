# Rep Check - Workout Log Assessment

Rep Check is a simple React Native assessment application designed to demonstrate frontend implementation skills, state management, and form validation. 

## Features

- **Authentication Flow:** Secure login flow with global state management.
- **Workout Logging:** Track your daily exercises with details like name, weight, and reps.
- **Form Validation:** Robust error handling and type coercion utilizing Zod & React Hook Form.
- **Location Services:** Fallback-ready location fetching mechanism to display your current workout region.
- **Exercise Library:** Infinite-scroll library of available exercises and their target muscles.
- **Theming:** Full dark mode/light mode support using styled context and mmkv.
- **Testing:** Short test for mmkv (core/storage)

## Getting Started

To test out the application, you must use the following test account credentials as backend registration is not wired up for this assessment:

**Email:** `py@test.com`
**Password:** `password123`

### Prerequisites
- Node.js
- Expo CLI
- iOS Simulator or Android Emulator

### Installation
1. Clone the repository.
2. Run `npm install` to fetch dependencies.
3. Run `npx expo start` to launch the Metro bundler.
4. Press `i` for iOS or `a` for Android to open the app.

## Technologies Used

- React Native & Expo
- React Hook Form
- Zod (Validation)
- Zustand (State Management)
- TanStack Query (Data Fetching / Infinite Scroll)
- UI: React Native Reanimated & Gesture Handler

## Known Limitations & Areas for Improvement (Unable to deliver due to time constraints)

While the core functionality is built, there are several areas that could be enhanced in a production environment:

1. **Backend Integration:** Currently, workouts are saved locally in a Zustand store. Implementing a real backend (e.g., Supabase, Firebase, or a custom Node.js server) is required for persistent, cross-device data.
2. **Local Storage Persistence:** The Zustand workout store does not currently use a persistence middleware (like MMKV or AsyncStorage), meaning logs clear on app reload. 
3. **Advanced Filtering:** The Exercise Library is an infinite list. Adding a search bar or filter tags (by muscle group or equipment) would significantly improve the UX.
4. **Workout History & Analytics:** A calendar view or chart screen to visualize progress over time (e.g., seeing bench press weight progress over months) would add massive value to the user.
5. **Form Real-Time Validation UX:** React Hook Form currently validates on submission. Adding `mode: 'onChange'` or `mode: 'onTouched'` would provide instant feedback to the user before they hit the save button.
6. **Error Boundaries:** Adding React Error Boundaries around the main navigation stacks would ensure the app catches any unexpected rendering errors gracefully without crashing the entire app.

## Sample demo video : https://drive.google.com/file/d/1aRdH0LSsp2O-QOIH3xlgfbDAg8jvef-P/view?usp=sharing
