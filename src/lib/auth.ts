// Frontend-only auth utilities (Supabase removed - use WhatsApp for bookings)

// Store user info in localStorage (frontend only)
export function saveUserInfo(email: string, name: string) {
  try {
    localStorage.setItem("user_email", email);
    localStorage.setItem("user_name", name);
  } catch (e) {
    console.error("Could not save user info:", e);
  }
}

// Get stored user info
export function getUserInfo() {
  try {
    const email = localStorage.getItem("user_email");
    const name = localStorage.getItem("user_name");
    return { email, name };
  } catch (e) {
    return { email: null, name: null };
  }
}

// Clear stored user info
export function clearUserInfo() {
  try {
    localStorage.removeItem("user_email");
    localStorage.removeItem("user_name");
  } catch (e) {
    console.error("Could not clear user info:", e);
  }
}
