import jwt from 'jsonwebtoken';
import UserModel from '../../models/userModel';
import bcrypt from 'bcrypt';
export async function createUser(userData: any) {
    try {
        const checkExistingUser = await UserModel.findOne({ email: userData.email });
        if (checkExistingUser) {
            throw new Error('Email already exists');
        }
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const newUser = await UserModel.create({
            name: userData.name,
            email: userData.email,
            password: hashedPassword
        });
        return newUser;
    } catch (error) {
        throw error;
    }

};

export async function loginUser(userData: any) {
    try {
        const isUserExist = await UserModel.findOne({ email: userData.email })
        if (!isUserExist) {
            throw new Error('User does not exist');
        }
        const isPasswordValid = await bcrypt.compare(userData.password, isUserExist.password);
        if (!isPasswordValid) {
            throw new Error('Invalid passwordd');
        }
        const token = jwt.sign({
            userId: isUserExist._id,
        }, process.env.JWT_SECRET as string,
            {
                expiresIn: '1d',
            }
        );
        return {
            isUserExist,
            token
        }

    } catch (error) {
        throw error;
    }

}
