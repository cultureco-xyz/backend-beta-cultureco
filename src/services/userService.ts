import UserModel, { CREATOR_TYPES, IUser, UserRole } from "../models/UserModel";

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

async function changeToCreator({
  name,
  bio,
  creatorType,
  profilePicture,
  _id,
}: {
  name: string;
  bio: string;
  creatorType: string;
  profilePicture: string;
  _id: string;
}) {
  const user = await UserModel.findOneAndUpdate(
    { _id: _id },
    {
      name,
      bio,
      creatorType,
      profilePicture,
      role: UserRole.CREATOR,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  if (user) {
    return user.toObject();
  } else {
    throw console.error("Update to user failed");
  }
}

interface CreateDemoUserDTO {
  name: string;
  username: string;
  bio?: string;
  profilePicture?: string;
  creatorType: CREATOR_TYPES;
  demoCreatorEmail: string;
}

async function createDemoUser(data: CreateDemoUserDTO): Promise<IUser> {
  try {
    // Check if the user already exists by email or username
    let demoEmail = `${data.username}@demo.user`;

    const existingUser = await UserModel.findOne({
      $or: [{ email: demoEmail }, { username: data.username }],
    });

    if (existingUser) {
      throw new Error("User with this email or username already exists.");
    }

    // Create a new user instance
    const user = new UserModel({
      name: data.name,
      username: data.username,
      email: demoEmail,
      bio: data.bio,
      profilePicture: data.profilePicture,
      role: UserRole.CREATOR, // Default to 'user' role if not specified
      isDemo: true,
      demoCreatorEmail: data.demoCreatorEmail,
      creatorType: data.creatorType,
    });

    // Save the user to the database
    await user.save();

    return user.toObject();
  } catch (error) {
    throw new Error(`Failed to create user: ${error}`);
  }
}

export default { createUser, changeToCreator, createDemoUser };
