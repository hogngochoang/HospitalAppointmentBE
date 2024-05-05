import db from "../models/index"
import bcrypt from 'bcryptjs'


let handleUserLogin = (email, password) => {
    return new Promise (async(resolve, reject) => {
        try{
            let userData = {}
            let isExist = await checkUserEmail(email)
            if(isExist) {
                //user already exist
                //compare password
                let user = await db.User.findOne({
                    attributes:['email','roleId','password','firstName','lastName','id','image'],
                    where: {email: email},
                    raw: true
                })
                if(user) {
                    let check = await bcrypt.compareSync(password, user.password)
                    if(check){
                        userData.errMessage = 'OK';
                        userData.errCode = 0;
                        delete user.password;
                        userData.user = user;

                    } else{
                        userData.errMessage = 'Wrong password';
                        userData.errCode = 3
                    }


                }else{
                    userData.errMessage = 'User not found'
                }

            } else{
                userData.errMessage = 'Email invalid'
                userData.errCode = 2
            }
            
            resolve(userData)

        }catch(e){
            reject(e)
        }
    })
}

let checkUserEmail = (userEmail) => {
    return new Promise (async(resolve, reject) => {
        try{
            let user = await db.User.findOne({
                where : {email: userEmail}
            })
            if(user) {
                resolve(true)
            } else{
                resolve(false)
            }
        }catch(e){
            reject(e)
        }
    })
}

let getUsers = (userId) => {
    return new Promise(async (resolve, reject) => {
        try{
            let users =''
            if(userId === 'ALL'){
                users = await db.User.findAll({
                    attributes: {
                        exclude: ['password']
                    }

                })
            }if (userId && userId !== 'ALL') {
                users = await db.User.findOne({
                    where: {id: userId},
                    attributes: {
                        exclude: ['password']
                    }
                })
            }
            resolve(users)
        }catch(e){
            reject(e)
        }
    })
}

const salt = bcrypt.genSaltSync(10);

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

let createUser = async (data) => {
    return new Promise(async(resolve, reject) => {
        try {
            let check = await checkUserEmail(data.email) 
            if (check === true) {
                resolve({
                    errCode: 1,
                    message:'Email is exist'
                })
            if(!data.email || !data.firstName || !data.lastName || !data.password || !data.gender || !data.roleId){
                resolve({
                    errCode: 2,
                    message:'Missing required parameters'
                })
            }
            } else{
                let hashPasswordFromBcrypt = await hashUserPassword(data.password);
                await db.User.create({
                    email: data.email,
                    password: hashPasswordFromBcrypt,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    phoneNumber: data.phoneNumber,
                    address: data.address,
                    gender: data.gender,
                    roleId:data.roleId,
                    positionId: data.positionId,
                    image: data.avatar
                })
                resolve({
                    errCode: 0,
                    message:'OK'
                });
            }
            
        } catch (error) {
            reject(error)
        }
    })
}

let deleteUser = (id) => {
    return new Promise(async(resolve, reject)=> {
        let user = await db.User.findOne({
            where: {id: id}
        })
        if(!user) {
            resolve({
                errCode:2,
                errMessage: "User isn't exist"
            })
        }
        await db.User.destroy({
            where: {id: id}
        });

        resolve({
            errCode: 0,
            errMessage: "User is deleted"
        })

    })
} 

let updateUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try{
            if(!data.id || !data.roleId || !data.positionId || !data.gender){
                resolve({
                    errCode:2,
                    errMessage:"Missing required parameters"
                })
            }

            let user = await db.User.findOne({
                where : {id: data.id},
                raw: false
            })
            if(user){
                user.firstName = data.firstName;
                user.lastName = data.lastName;
                user.phoneNumber = data.phoneNumber;
                user.address = data.address;
                user.gender = data.gender;
                user.roleId = data.roleId;
                user.positionId = data.positionId;
                if(data.avatar) {
                    user.image = data.avatar;
                }
                
                await user.save();

                resolve({
                    errCode: 0,
                    errMessage: "Update user success"
                });
             }else{
                resolve({
                    errCode: 1,
                    errMessage: "User not found"
                });
            }
        }catch(e){
            console.log(e)
        }
    })
}

let getAllCodeService = (typeInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            if(!typeInput){
                resolve({
                    errCode: 1,
                    errMessage:"Missing required parameters"
                })
            }else{
                let res = {};
                let allcode = await db.Allcodes.findAll({
                    where: {type: typeInput}
                });
                res.errCode = 0;
                res.data = allcode
                resolve(res);
            }

        } catch (e) {
            reject(e)
        }
    })
}

 module.exports = {
    handleUserLogin:handleUserLogin,
    getUsers: getUsers,
    createUser: createUser,
    deleteUser: deleteUser,
    updateUser: updateUser,
    getAllCodeService: getAllCodeService
 }