import UserModel from '../../models/userModel';

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
        console.log("userId ->>>", userId);
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
        const users = await UserModel.find({
            name: { $regex: query, $options: 'i' }, // i for ignoring the case sensitivity
            _id: { $ne: excludeUserId }
        }).select('-password');
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

