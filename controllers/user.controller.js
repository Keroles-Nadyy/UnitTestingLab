const {getFullName} = require('./../helpers/utils.js');
const User = require('./../models/user.js')

const addUser = async function (request, reply) {
    try {
        const userbody = request.body;
        userbody.fullName = getFullName(userbody.firstName, userbody.lastName);
        delete userbody.firstName;
        delete userbody.lasttName;
    
        const user = new User(userbody);
        const addUser = await user.save();
        return addUser;
    } catch (error) {
        throw new Error(error.message); 
    }
}

const getUsers = async (request, reply) => {
    try {
        const users = await User.find({}).lean();
        return users;
    } catch (error) {
        throw new Error(error.message);
    }
};

const updateUser = async (request, reply) => {
    try {
        const userId = request.params.id;
        const userBody = request.body;

        // Validate user input using UserValidator class
        // await UserValidator.validate(userBody, isupdate = true);

        userBody.fullName = utils.getFullName(userBody.firstName, userBody.lastName);
        delete userBody.firstName;
        delete userBody.lastName;

        const updatedUser = await User.findByIdAndUpdate(userId, userBody, { new: true });
        if (!updatedUser) {
            throw new Error('User not found');
        }
        return updatedUser;
    } catch (error) {
        throw new Error(error.message);
    }
};

const getSingleUser = async (request, reply) => {
    try {
        const userId = request.params.id;
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    } catch (error) {
        throw new Error(error.message);
    }
};

const deleteUser = async (request, reply) => {
    try {
        const { id } = request.params;
        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) {
            throw new Error('User not found');
        }
        return deletedUser;
    } catch (error) {
        throw new Error(error.message);
    }
};


module.exports = {
    addUser,
    getUsers,
    getSingleUser,
    updateUser,
    deleteUser
}
