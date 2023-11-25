import User from "../../models/userModel.js";


const fetchAllUsers = async () => {
  try {
    const users = await User.find({}, { name: 1, email: 1, mobile: 1, is_blocked: 1 });
    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

const deleteUser = async (userId) => {

  try {
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return { success: false, message: "User not found." };
    }

    return { success: true, message: "User deleted successfully." };

  } catch (error) {
      console.error("Error deleting user:", error);
    throw error;

  }

};

const blockUser = async (userId) => {
  try {
    const blockedUser = await User.findByIdAndUpdate({_id:userId},{$set:{is_blocked:true}});
    
    if (!blockedUser) {
      return { success: false, message: "User not found." };
    }

    return { success: true, message: "User blocked successfully." };
  } catch (error) {
    console.error("Error blocking user:", error);
    throw error;
  }

};

const unblockUser = async (userId) => {
  try {
    const unblockedUser = await User.findByIdAndUpdate({_id:userId},{$set:{is_blocked:false}});
    
    if (!unblockedUser) {
      return { success: false, message: "User not found." };
    }

    return { success: true, message: "User blocked successfully." };
  } catch (error) {
    console.error("Error blocking user:", error);
    throw error;
  }

};


export { fetchAllUsers, deleteUser, blockUser, unblockUser };
