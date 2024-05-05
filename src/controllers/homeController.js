import db from "../models/index"
import CRUDservice from "../services/CRUDservice"

let getHomePage = async (req, res) => {
    try{
        let data = await db.User.findAll();
        return res.render('homePage.ejs',{
            data: JSON.stringify(data)
        })
    }catch(e) {
        console.log(e);
    }
}

let getCreateUser = (req, res) => {
    return res.render('createUser.ejs')
}

let postCRUD = async(req,res) => {
    let message = await CRUDservice.createNewUser(req.body)
    console.log(message)
    return res.send('post crud from server')
}

let getCRUD = async(req,res) => {
    let data = await CRUDservice.getAllUser();
    return res.render('displayUser.ejs', {
        dataTable: data
    })
}

let editCRUD = async (req,res) => {
    let userId = req.query.id;
    if(userId){
        let userData = await CRUDservice.getUserInfobyId(userId)
        return res.render('editUser.ejs',{
            user: userData
        });
    }else{
        return res.send('User not found');

    }

}

let putCRUD = async (req,res) => {
    let data = req.body;
    let allUser = await CRUDservice.updateUserData(data)
    return res.render('displayUser.ejs',{
        dataTable: allUser
    });

}

let deleteCRUD = async (req,res) => {
    let userId = req.query.id;
    if(userId){
        await CRUDservice.deleteUserbyId(userId)
        return res.send('Delete success')
    }else{
        return res.send('User not found');
    }
}

module.exports = {
    getHomePage: getHomePage,
    getCreateUser: getCreateUser,
    postCRUD: postCRUD,
    getCRUD: getCRUD,
    editCRUD: editCRUD,
    putCRUD: putCRUD,
    deleteCRUD: deleteCRUD,
}