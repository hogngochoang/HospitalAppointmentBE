import bcrypt from 'bcryptjs'
import db from '../models/index'

const salt = bcrypt.genSaltSync(10);

let createNewUser = async (data) => {
    return new Promise(async (resolve, reject) => {
        try{
            let hashPasswordFromBcrypt = await hashUserPassword(data.password);
            await db.User.create({
                email: data.email,
                password: hashPasswordFromBcrypt,
                firstName: data.firstname,
                lastName: data.lastname,
                phoneNumber: data.phonenumber,
                address: data.address,
                gender: data.gender === '1'?true : false,
                roleId:data.role,
            })
            resolve('success');
        }catch(e){
            reject(e)
        }
    })

}

let hashUserPassword = (password) => {
    return new Promise(async (resolve, reject) => {
        try{
            var hashPassword = await bcrypt.hashSync(password, salt);
            resolve(hashPassword)
        } catch(e) {
            reject(e)
        }
    })
}

let getAllUser = async () => {
    return new Promise((resolve, reject) => {
        try{
            let users = db.User.findAll({raw: true})
            resolve(users)
        }catch(e){
            reject(e)
        }
    })
}

let getUserInfobyId = (userId) => {
    return new Promise( async(resolve, reject) => {
        try{
            let user = await db.User.findOne({
                where : {id: userId},
                raw : true
            })
            if(user){
                resolve(user)
            }else{
                resolve([])
            }
        }catch(e){
            reject(e)
        }
    })
}

let updateUserData = (data) => {
    return new Promise(async(resolve, reject) => {
        try{
            let user = await db.User.findOne({
                where : {id: data.id},
            })
            if(user){
                await user.update({
                    firstName : data.firstname,
                    lastName : data.lastname,
                    address : data.address,
                })
                await user.save();

                let allUser = await db.User.findAll();
                resolve(allUser);
             }else{
                resolve();
            }
        }catch(e){
            console.log(e)
        }
    })
}

let deleteUserbyId = (userId) => {
    return new Promise (async (resolve, reject)=> {
        try{
            let user = await db.User.findOne({
                where : {id: userId},
            })
            if(user){
                await db.User.destroy({
                    where: {id: userId}
                })
            }
            resolve();
        } catch(e){
            reject(e)
        }

    })
}

module.exports={
    createNewUser: createNewUser,
    getAllUser: getAllUser,
    getUserInfobyId: getUserInfobyId,
    updateUserData: updateUserData,
    deleteUserbyId: deleteUserbyId
}