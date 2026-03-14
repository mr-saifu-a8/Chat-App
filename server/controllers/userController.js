// import { generateToken } from "../lib/utils.js";
// import User from "../models/User.js";
// import bcrypt from "bcryptjs";
// import cloudinary from "../lib/cloudinary.js";

// // Signup new user
// export const signup = async (req, res) => {
//   const { email, fullName, password, bio } = req.body;

//   try {
//     if (!email || !fullName || !password || !bio) {
//       req.json({ success: false, massage: "Missing Details" });
//     }
//     const user = await User.findOne({ email });
//     if (user) {
//       return req.json({ success: false, massage: "Account already exsist" });
//     }

//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     const newUser = User.create({
//       fullName,
//       email,
//       password,
//       bio,
//       password: hashedPassword,
//     });

//     const token = generateToken(newUser._id);

//     res.json({
//       success: true,
//       userData: newUser,
//       massage: "Account created successfully",
//       token,
//     });
//   } catch (error) {
//     console.log(error.massage);
//     req.json({ success: false, massage: error.massage });
//   }
// };

// // login User

// export const login = async () => {
//   try {
//     const { email, password } = req.body;
//     const userData = await User.findOne({ email })

//     const isPassCorrect = await bcrypt.compare(password, userData.password)

//     if (!isPassCorrect) {
//       return res.json({success: false, massage: "Invailid credentials"})
//     }

//     const token = generateToken(userData._id)

//     res.json({success: true, userData: newUser, token, massage: "login Successfull"})
//   } catch (error) {
//     console.log(error.massage);
//     req.json({ success: false, massage: error.massage });
//   }
// }

// // Controller to check if user is autheticated

// export const checkAuth = (req, res) => {
//   res.json({success: true, user: req.user})
// }

// // Cotroller to update user profile details

// export const updateProfile = async (req, res) => {
//   try {
//     const { profilePic, bio, fullName } = req.body

//     const userId = req.user._id
//     let updatedUser;

//     if (!profilePic) {
//      updatedUser =  await User.findByIdAndUpdate(userId, {bio, fullName}, {new: true})
//     } else {
//       const upload = await cloudinary.uploader.upload(profilePic)

//       updatedUser = await User.findByIdAndUpdate(userId, {profilePic: upload.secure_url, bio, fullName}, {new: true})
//     }
//     res.json({success: true, user: updatedUser})
//   } catch (error) {
//     console.log(error.massage);
//     req.json({ success: false, massage: error.massage });
//   }
// }



import { generateToken } from "../lib/utils.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";

// ──────────────────────────────────────────
// SIGNUP
// ──────────────────────────────────────────
export const signup = async (req, res) => {
  try {
    const { email, fullName, password, bio } = req.body;

    if (!email || !fullName || !password || !bio) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email format" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Password must be at least 6 characters",
        });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({
          success: false,
          message: "Account already exists with this email",
        });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
      bio,
    });

    const token = generateToken(newUser._id);

    res.status(201).json({
      success: true,
      token,
      userData: {
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
        bio: newUser.bio,
      },
      message: "Account created successfully",
    });
  } catch (error) {
    console.error("Signup error:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// ──────────────────────────────────────────
// LOGIN
// ──────────────────────────────────────────
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      userData: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        profilePic: user.profilePic,
        bio: user.bio,
      },
      message: "Login successful",
    });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// ──────────────────────────────────────────
// UPDATE PROFILE
// ──────────────────────────────────────────
export const updateProfile = async (req, res) => {
  try {
    const { profilePic, bio, fullName } = req.body;
    const userId = req.user._id;

    if (!profilePic && !bio && !fullName) {
      return res
        .status(400)
        .json({ success: false, message: "Nothing to update" });
    }

    const updateFields = {};
    if (fullName) updateFields.fullName = fullName.trim();
    if (bio) updateFields.bio = bio.trim();

    if (profilePic) {
      if (
        !profilePic.startsWith("data:image") &&
        !profilePic.startsWith("http")
      ) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid image format" });
      }

      if (profilePic.startsWith("data:image")) {
        const upload = await cloudinary.uploader.upload(profilePic, {
          folder: "chat-app/profiles",
          transformation: [{ width: 400, height: 400, crop: "fill" }],
        });
        updateFields.profilePic = upload.secure_url;
      } else {
        updateFields.profilePic = profilePic;
      }
    }

    // const updatedUser = await User.findByIdAndUpdate(userId, updateFields, {
    //   new: true,
    //   runValidators: true,
    // }).select("-password");

    const updatedUser = await User.findByIdAndUpdate(userId, updateFields, {
      returnDocument: "after",
      runValidators: true,
    }).select("-password");

    res.status(200).json({
      success: true,
      userData: updatedUser,
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error("Update profile error:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// ──────────────────────────────────────────
// CHECK AUTH
// ──────────────────────────────────────────
export const checkAuth = (req, res) => {
  try {
    res.status(200).json({ success: true, userData: req.user });
  } catch (error) {
    console.error("Check auth error:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};




