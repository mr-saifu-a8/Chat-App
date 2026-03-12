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