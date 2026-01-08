import UserModel from '../../models/userModel';
import mongoose from "mongoose"

export async function getUserProfile(userId: string) {
  try {
    const user = await UserModel.findById(userId).select('-password');
    if (!user) {
      throw new Error('User not found');
    }
    return user;

  } catch (error) {
    throw error;
  }

}

export async function updateUserProfile(userId: string, data: any) {
  try {
    const user = await UserModel.findByIdAndUpdate(userId, {
      $set: data
    },
      {
        new: true,
      }).select('-password');
    if (!user) {
      throw new Error('User not found');
    }
    return user;

  } catch (error) {
    throw error;
  }
}

export async function searchUsers(query: string, excludeUserId: string) {
  try {
    const users = await UserModel.aggregate([
      {
        $match: {
          name: { $regex: query, $options: "i" },
          _id: { $ne: new mongoose.Types.ObjectId(excludeUserId) }
        }

      },
      {
        $lookup: {
          from: "chats",
          let: {
            searchedUserId: "$_id",
            loggedInUserId: new mongoose.Types.ObjectId(excludeUserId)
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $in: ["$$searchedUserId", "$userIds"] },
                    { $in: ["$$loggedInUserId", "$userIds"] }
                  ]
                }
              }
            },
            { $limit: 1 }
          ],
          as: "chat"
        }
      },

      {
        $unwind: {
          path: "$chat",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: "messages",
          localField: "chat.latestMessage",
          foreignField: "_id",
          as: "latestMessage"
        }
      },
      {
        $unwind: {
          path: "$latestMessage",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          _id: 1,
          name: 1,
          profilePic: 1,
          bio: 1,
          latestMessage: {
            content: "$latestMessage.content",
            createdAt: "$latestMessage.createdAt"
          }
        }
      }

    ])
    return users;
  }
  catch (error) {
    throw error;
  }
}

export async function getUserById(userId: string) {

  try {
    const fetchedUser = UserModel.findById(userId).select('-password');

    return fetchedUser
  }
  catch (error) {
    throw new Error;
  }
}

