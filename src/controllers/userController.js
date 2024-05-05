import e from "express"
import userService from "../services/userService"

let handleLogin = async (req,res) => {
    let email = req.body.email
    let password = req.body.password

    if(!email || !password) {
        return res.status(500).json({
            message: 'Missing inputs parameter',
            errCode: 1
        })
    }

    let userData = await userService.handleUserLogin(email,password);

    return res.status(200).json({
        message: userData.errMessage ,
        errCode: userData.errCode,
        userData: userData.user? userData.user : {}
    })
}

let handleGetUsers = async (req,res) => {
    let id = req.query.id;
    let users = await userService.getUsers(id);

    if(!id) {
        return res.status(200).json({
            errCode: 1,
            errMessage: 'Missing requied parameters',
            users: []
        })
    }

    return res.status(200).json({
        errCode: 0,
        errMessage: 'OK',
        users
    })
}

let handleCreateUser = async (req,res) => {
    let message = await userService.createUser(req.body)
    console.log(message)
    return res.status(200).json(message)
}

let handleEditUser = async (req,res) => {
    let data = req.body
    let message = await userService.updateUser(data)
    return res.status(200).json(message)
}

let handleDeleteUser = async (req,res) => {
    if(!req.body.id) {
        return res.status(200).json({
            errCode: 1,
            errMessage: 'Missing requied parameters'
        })
    }
    let message = await userService.deleteUser(req.body.id);
    return res.status(200).json(message)
}

let getAllCode = async(req,res) => {
    try {
        let data = await userService.getAllCodeService(req.query.type);
        return res.status(200).json(data);
    } catch (e) {
        console.log("Get all code error: ", e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

module.exports = {
    handleLogin: handleLogin,
    handleGetUsers: handleGetUsers,
    handleCreateUser: handleCreateUser,
    handleEditUser: handleEditUser,
    handleDeleteUser: handleDeleteUser,
    getAllCode: getAllCode
}