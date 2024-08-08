import { getAuth, sendPasswordResetEmail as firebaseSendPasswordResetEmail, confirmPasswordReset as firebaseConfirmPasswordReset, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';

const auth = getAuth();

export const sendPasswordReset = async (email) => {
  try {
    await firebaseSendPasswordResetEmail(auth, email);
  } catch (error) {
    throw new Error('Error sending password reset email: ' + error.message);
  }
};

export const confirmPasswordReset = async (oobCode, newPassword) => {
  try {
    await firebaseConfirmPasswordReset(auth, oobCode, newPassword);
  } catch (error) {
    throw new Error('Error confirming password reset: ' + error.message);
  }
};

// Yeni kullanıcı oluşturma
export const registerUser = async (email, password) => {
  try {
    await createUserWithEmailAndPassword(auth, email, password);
  } catch (error) {
    throw new Error('Error registering new user: ' + error.message);
  }
};

// Kullanıcı girişi yapma
export const loginUser = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    throw new Error('Error logging in: ' + error.message);
  }
};

// Kullanıcı çıkışı yapma
export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw new Error('Error logging out: ' + error.message);
  }
};
