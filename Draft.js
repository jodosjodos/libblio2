// import cloudinary from 'cloudinary';
// import { User } from '../models/user';

// // Configuration for Cloudinary
// cloudinary.config({
//   cloud_name: 'your_cloud_name',
//   api_key: 'your_api_key',
//   api_secret: 'your_api_secret'
// });

// export const uploadProfilePicture = async (req, res) => {
//   const { userId } = req.params;
//   const { file } = req;

//   try {
//     // Upload the image to Cloudinary
//     const result = await cloudinary.uploader.upload(file.path);

//     // Update the user's profile picture URL in the database
//     const updatedUser = await User.findByIdAndUpdate(
//       userId,
//       { profilePicture: result.secure_url },
//       { new: true }
//     );

//     return res.status(200).json({ user: updatedUser });
//   } catch (error) {
//     return res.status(500).json({ message: 'An error occurred while uploading the profile picture', error });
//   }
// };

// // Controller function to update a profile picture
// export const updateProfilePicture = async (req, res) => {
//   const { userId } = req.params;
//   const { file } = req;

//   try {
//     // Upload the new image to Cloudinary
//     const result = await cloudinary.uploader.upload(file.path);

//     // Update the user's profile picture URL in the database
//     const updatedUser = await User.findByIdAndUpdate(
//       userId,
//       { profilePicture: result.secure_url },
//       { new: true }
//     );

//     return res.status(200).json({ user: updatedUser });
//   } catch (error) {
//     return res.status(500).json({ message: 'An error occurred while updating the profile picture', error });
//   }
// };

// // Controller function to delete a profile picture
// export const deleteProfilePicture = async (req, res) => {
//   const { userId } = req.params;

//   try {
//     // Update the user's profile picture URL in the database
//     const updatedUser = await User.findByIdAndUpdate(
//       userId,
//       { profilePicture: null },
//       { new: true }
//     );

//     return res.status(200).json({ user: updatedUser });
//   } catch (error) {
//     return res.status(500).json({ message: 'An error occurred while deleting the profile picture', error });
//   }
// };
