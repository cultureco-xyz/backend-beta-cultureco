import UserModel from "../models/UserModel";
import { generateToken } from "../utils/jwtUtils";
import { OAuth2Client } from "google-auth-library";

// Initialize Google OAuth2 client
const client = new OAuth2Client("YOUR_GOOGLE_CLIENT_ID");

// Define types for the function response
interface SignInResponse {
  newUser: boolean;
  user?: any; // Replace `any` with the specific user type if defined
  token: string;
}

// Define signin function to handle Google OAuth login
const signin = async (
  googleJwtToken: string
): Promise<SignInResponse | null> => {
  try {
    // Verify the JWT and extract user details
    const ticket = await client.verifyIdToken({
      idToken: googleJwtToken,
      audience: process.env.GOOGLE_CLIENT_ID, // Ensure this is your actual Google Client ID
    });
    const payload = ticket.getPayload();

    if (!payload) {
      throw new Error("Invalid JWT token");
    }

    const { name, email } = payload;
    console.log(name, email);
    // Check if the user exists in our database
    let user = await UserModel.findOne({ email }).lean();

    if (user) {
      // User exists, generate a JWT token for authentication
      const jwt = generateToken(user);
      return {
        newUser: false,
        user,
        token: jwt,
      };
    } else {
      // New user - generate a signup token with additional information
      const jwt = generateToken(
        {
          email,
          name,
          newUser: true,
        },
        "10h" // Token valid for 10 hours
      );

      return {
        newUser: true,
        token: jwt,
      };
    }
  } catch (error) {
    console.error("Error during Google OAuth login:", error);
    return null;
  }
};

const walletSignin = async (wallet: string): Promise<SignInResponse | null> => {
  try {
    if (!wallet) {
      throw new Error("Invalid wallet");
    }

    let user = await UserModel.findOne({ email: wallet }).lean();

    if (user) {
      // User exists, generate a JWT token for authentication
      const jwt = generateToken(user);
      return {
        newUser: false,
        user,
        token: jwt,
      };
    } else {
      // New user - generate a signup token with additional information
      const jwt = generateToken(
        {
          email: wallet,
          newUser: true,
        },
        "10h" // Token valid for 10 hours
      );

      return {
        newUser: true,
        token: jwt,
      };
    }
  } catch (error) {
    console.error("Error during Google OAuth login:", error);
    return null;
  }
};

export default { signin, walletSignin };
