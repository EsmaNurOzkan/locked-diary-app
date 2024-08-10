<p float="left">
  <img src="./assets/IMG_8642.PNG" alt="Image 1" width="250" />
  <img src="./assets/IMG_8641.PNG" alt="Image 2" width="250" />
  <img src="./assets/IMG_8643.PNG" alt="Image 3" width="250" />
  <img src="./assets/IMG_8644.PNG" alt="Image 4" width="250" />
  <img src="./assets/IMG_8645.PNG" alt="Image 5" width="250" />
</p>




# Locked Diary App

## Overview

Locked Diary App is a secure mobile application built with React Native and Firebase. It allows users to maintain private diary entries that are encrypted with end-to-end encryption for maximum security. Each entry is encrypted with a unique key provided by the user during login, ensuring that only the user who created the entry can decrypt and view it. This application is ideal for those looking to keep their personal notes safe from unauthorized access, offering a high level of privacy and protection.


## Features

- **Secure Storage:** All diary entries are encrypted and stored securely in Firebase Firestore.
- **Authentication:** Users can sign up, log in, and reset their passwords using Firebase Authentication.
- **Diary Entries:** Users can create, view, and edit their daily diary entries.
- **Encryption:** Each diary entry is encrypted with a user-specific key, ensuring that only the owner can decrypt and read their entries.

## Technologies Used

- **React Native:** For building the mobile application.
- **Firebase:** For authentication, database storage (Firestore), and encryption.
- **Expo:** For streamlined development and testing.
- **JavaScript:** The primary language used in the development.

## Installation and Setup

### Prerequisites

- [Node.js](https://nodejs.org/) (version 14 or higher)
- [Expo CLI](https://docs.expo.dev/get-started/installation/) (Install with `npm install -g expo-cli`)
- [Firebase Account](https://firebase.google.com/)
- **Firestore Setup:** Create a Firebase project and set up Firestore to store diary entries.

  


### Clone the Repository

```bash
git clone https://github.com/EsmaNurOzkan/locked-diary-app.git
cd locked-diary-app
npx expo start
```

## Project Dependencies

This project uses multiple npm packages (over 20). After cloning the repository, run the following command to install all necessary dependencies:

```bash
npm install
```

### Firebase Configuration

To configure Firebase for your project, follow these steps:

1. **Go to the Firebase Console:**
   - Visit the [Firebase Console](https://console.firebase.google.com/).

2. **Create a New Project or Use an Existing One:**
   - Start a new project or select an existing one from your Firebase Console.

3. **Add Your Android/iOS App to the Firebase Project:**
   - Follow the instructions in the Firebase Console to add your app (Android/iOS) to the Firebase project and obtain your `firebaseConfig` object.

4. **Replace the Contents of `utils/firebaseConfig.js`:**
   - Open the `utils/firebaseConfig.js` file in your project directory.
   - Replace its contents with your Firebase configuration object. The file should look like this:

    ```javascript
    // utils/firebaseConfig.js

    export const firebaseConfig = {
      apiKey: "YOUR_API_KEY",
      authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
      projectId: "YOUR_PROJECT_ID",
      storageBucket: "YOUR_PROJECT_ID.appspot.com",
      messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
      appId: "YOUR_APP_ID"
    };
    ```

    ## Usage

- **Sign Up / Log In:** Create a new account or log in with existing credentials.
- **Add Diary Entries:** Create new diary entries and secure them with encryption.
- **View/Edit Entries:** Access your diary entries securely and make edits as needed.



## Contact

For any questions or inquiries, please contact:

- **Email:** esmanuozkan@icloud.com




