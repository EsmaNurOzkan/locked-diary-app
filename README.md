# Locked Diary App

## Overview

Locked Diary App is a secure mobile application built with React Native and Firebase, allowing users to maintain private diary entries that are encrypted for maximum security. This application is ideal for those looking to keep their personal notes safe from unauthorized access.

## Features

- **Secure Storage:** All diary entries are encrypted and stored securely in Firebase Firestore.
- **Authentication:** Users can sign up, log in, and reset their passwords using Firebase Authentication.
- **Diary Entries:** Users can create, view, and edit their daily diary entries.
- **Encryption:** Each entry is encrypted with a user-specific key, ensuring that only the owner can decrypt and read their entries.
- **Expo Integration:** Built using Expo for an enhanced development experience.

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


### Firebase Configuration

- Go to the Firebase Console.
- Create a new project or use an existing one.
- Add your Android/iOS app to the Firebase project and follow the instructions to get your firebaseConfig object.
- Replace the contents of utils/firebaseConfig.js with your Firebase configuration object.


