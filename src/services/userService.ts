import UserModel, { IUser, UserRole } from "../models/UserModel";

interface CreateUserDTO {
  name: string;
  username: string;
  email: string;
  bio?: string;
  profilePicture?: string;
  role?: UserRole;
}

async function createUser(data: CreateUserDTO): Promise<IUser> {
  try {
    // Check if the user already exists by email or username
    const existingUser = await UserModel.findOne({
      $or: [{ email: data.email }, { username: data.username }],
    });

    if (existingUser) {
      throw new Error("User with this email or username already exists.");
    }

    // Create a new user instance
    const user = new UserModel({
      name: data.name,
      username: data.username,
      email: data.email,
      bio: data.bio,
      profilePicture: data.profilePicture,
      role: data.role || UserRole.USER, // Default to 'user' role if not specified
    });

    // Save the user to the database
    await user.save();

    return user.toObject();
  } catch (error) {
    throw new Error(`Failed to create user: ${error}`);
  }
}

export default { createUser };
