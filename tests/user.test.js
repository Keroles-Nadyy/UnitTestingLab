const it = require('ava').default;
const chai = require('chai');
const sinon = require('sinon')
const { MongoMemoryServer } = require('mongodb-memory-server'); 
const startDB = require('./../helpers/DB.js');
const utils = require('./../helpers/utils.js');
const User = require('./../models/user.js')
const { addUser, getUsers, getSingleUser, deleteUser } = require('./../controllers/user.controller.js');


it.before(async (ExecutionContext)=>{
    ExecutionContext.context.mongod = await MongoMemoryServer.create();
    process.env.MONGOURI = ExecutionContext.context.mongod.getUri('cloudServer');
    await startDB();
})

it.after(async (ExecutionContext) => {
    await ExecutionContext.context.mongod.stop({doCleanUp: true});
})


// ========================================= Add User ==============================================
it('create use successfully', async (ExecutionContext)=> {
    const request = {
        body: {
            firstName: "Keroles",
            lastName: "Nady",
            age: 25,
            job: "SWE"
        }
    }
    const expectedResult = {
        "fullName": "Keroles Nady",
        "age": 25,
        "job": "SWE"
    }
    sinon.stub(utils, 'getFullName').callsFake((fname, lname)=>{
        chai.expect(fname).to.be.equal(request.body.firstName);
        chai.expect(lname).to.be.equal(request.body.lastName);
        return "Keroles Nady";
    })
    const actualResult = await addUser(request);
    const result = {
        ...expectedResult,
        __v: actualResult.__v,
        _id: actualResult._id
    }
    chai.expect(actualResult).to.be.a('object');
    chai.expect(actualResult._doc).to.deep.equal(result);
    ExecutionContext.teardown(async ()=>{
        await User.deleteMany({
            fullName: request.body.fullName
        })
    })
    ExecutionContext.pass();
})

// ========================================= Get All Users ==============================================
it('get all users successfully', async (ExecutionContext)=> {
    const expectedResult = [
        {
            fullName: "Mohammed Hassan",
            age: 24,
            job: "SWE"
        },
        {
            fullName: "Keroles Nady",
            age: 25,
            job: "SWE"
        }
    ]
    const actualResult = await getUsers();
    const result = expectedResult.map((res, index) => {
        return {
            _id: actualResult[index]._id,
            ...res,
            __v: actualResult[index].__v,
        }
    })
    chai.expect(actualResult).to.deep.equal(result);
    ExecutionContext.teardown(async ()=>{
        await User.deleteMany({
            fullName: expectedResult.fullName
        })
    })
    ExecutionContext.pass();
})

// ========================================= Get Single User ==============================================
// Test for successful retrieval of a single user
it('get single user successfully', async (ExecutionContext)=> {
    const userId = "65f6a41a685e605dd59bed80"
    const expectedResult = {
        _id: userId,
        fullName: "Keroles Nady",
        age: 25,
        job: "SWE",
        __v: 0
    }
    const findByIdstub = sinon.stub(User, 'findById').resolves(expectedResult);
    const request = { params: { id: userId } };
    const actualResult = await getSingleUser(request);

    chai.expect(actualResult).to.deep.equal(expectedResult);

    ExecutionContext.teardown(async () => {
        await User.deleteMany({
            id: request.params.id
        })
    });
    findByIdstub.restore();
    ExecutionContext.pass();
});



it('get single user failed, return error if user not found', async (ExecutionContext) => {
    const userId = '65f6b8b7d6fdb0d8fb649e25';

    const findByIdsub = sinon.stub(User, 'findById').resolves(null);
    const request = { params: { id: userId } };
    try {
        const getUser = await getSingleUser(request);
    } catch (error) {
        ExecutionContext.is(error.message, 'User not found');
    }
    ExecutionContext.teardown(async () => {
        await User.deleteMany({
            id: request.params.id
        })
    });
    findByIdsub.restore();
    ExecutionContext.pass();
});



// ========================================= Delete User ==============================================
it('delete user successfully', async (ExecutionContext) => {
    const userId = '65f6b8b7d6fdb0d8fb649e25';
    const expectedResult = {
        _id: userId,
        fullName: "Keroles Nady",
        age: 25,
        job: "SWE",
        __v: 0
    }
    const findByIdAndDeleteStub = sinon.stub(User, 'findByIdAndDelete').resolves(expectedResult);
    const request = { params: { id: userId } };
    const deletedUser = await deleteUser(request);

    chai.expect(deletedUser).to.deep.equal(expectedResult);

    findByIdAndDeleteStub.restore();
    ExecutionContext.pass();
});



it('delete user failed, return error if user not found', async (ExecutionContext) => {
    const userId = '65f6b8b7d6fdb0d8fb649e25';

    const findByIdAndDeleteStub = sinon.stub(User, 'findByIdAndDelete').resolves(null);
    const request = { params: { id: userId } };
    try {
        const deletedUser = await deleteUser(request);
    } catch (error) {
        ExecutionContext.is(error.message, 'User not found');
    }
    findByIdAndDeleteStub.restore();
    ExecutionContext.pass();
});

