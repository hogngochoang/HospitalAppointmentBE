import { create, reject } from "lodash";
import db from "../models/index";
require('dotenv').config();
import emailService from './emailService'
import { v4 as uuidv4 } from 'uuid';

let buildURLEmail = (doctorId, token) => {
    let result = `${process.env.REACT_URL}/verify-booking?token=${token}&doctorId=${doctorId}`

    return result
}

let postBookingAppointment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if(!data.email || !data.doctorId || !data.timeType || !data.date){
                resolve({
                    errCode: 1,
                    errMessage: "Missing required params"
                })
            }else{
                let user = await db.Patient.findOne({
                    where:{
                        gender: data.selectedGender,
                        fullName: data.fullname,
                        birthday: data.birthday,
                        address: data.address
                    }
                })
                if(!user){
                    let newUser = await db.Patient.create({
                        email: data.email,
                        gender: data.selectedGender,
                        phoneNumber: data.phoneNumber,
                        fullName: data.fullname,
                        address: data.address,
                        birthday: data.birthday
                    })
                    if(newUser){
                        let booking = await db.Booking.build({
                            statusId:'S1',
                            doctorId:data.doctorId,
                            patientId: newUser.id,
                            date: data.date,
                            timeType:data.timeType,
                        })
                        let {count, rows} = await db.confirmedBooking.findAndCountAll({
                            where:{
                                statusId: 'S2',
                                date: data.date,
                                timeType:data.timeType,
                            }
                        })
                        if(count === 3){
                            await db.Booking.destroy({
                                where:{
                                    patientId: newUser.id
                                }
                            })   
                            await db.Patient.destroy({
                                where:{
                                    id: newUser.id
                                }
                            })    
                            resolve({
                                errCode: 3,
                                errMessage: 'Reach the limit (5)'
                            })                   
                        }else{
                            await booking.save()
                            resolve({
                                errCode: 0,
                                errMessage: 'Save info patient succeed'
                            })
                        }
                    }
                }

                if(user){
                    await db.Booking.findOrCreate({
                        where: {patientId: user.id},
                        defaults: {
                            statusId:'S1',
                            doctorId:data.doctorId,
                            patientId: user.id,
                            date: data.date,
                            timeType:data.timeType,
                        },
                        raw : true ,
                        nest : true
                    })
                    .then(async (created)=>{  
                        let {count, rows} = await db.confirmedBooking.findAndCountAll({
                            where:{
                                statusId: 'S2',
                                date: data.date,
                                timeType:data.timeType,
                            }
                        })
                        let confirmedBooking = await db.confirmedBooking.findOne({
                            where:{
                                statusId: 'S2',
                                date: data.date,
                                timeType:data.timeType,
                                patientId: user.id,
                                doctorId: data.doctorId
                            }
                        })
                        console.log('check create',created.at(1))     
                        if(!confirmedBooking){
                            if(created.at(1) === true && count <3){
                                resolve({
                                    errCode: 0,
                                    errMessage: 'Save info patient succeed'
                                })
                            }
                        }else{
                            await db.Booking.destroy({
                                where:{
                                    patientId: user.id
                                }
                            })       
                            resolve({
                                errCode: 4,
                                errMessage: 'Booking is confirmed'
                            })      
                        }
                        
                        if(created.at(1) === false && count <3){
                            resolve({
                                errCode: 2,
                                errMessage: 'Reach the limit (1)'
                            })
                        } 
                        if((created.at(1) === true || false) && count === 3){
                            await db.Booking.destroy({
                                where:{
                                    patientId: user.id
                                }
                            })       
                            resolve({
                                errCode: 3,
                                errMessage: 'Reach the limit (5)'
                            })              
                        } 
                        // if(confirmedBooking && created.at(1) === true){
                            
                        // } 
                    });
                    
                }
                let {count, rows} = await db.confirmedBooking.findAndCountAll({
                    where:{
                        statusId: 'S2',
                        date: data.date,
                        timeType:data.timeType,
                    }
                })
                console.log('count:',count)

            }

            
        } catch (e) {
            reject(e)
        }
    })
}

// let postVerifyBookingAppointment = (data) => {
//     return new Promise(async(resolve, reject) => {
//         try {
//             if(!data.token || !data.doctorId){
//                 resolve({
//                     errCode: 1,
//                     errMessage: "Missing required params"
//                 })
//             }else{
//                 let appointment = await db.Booking.findOne({
//                     where: {
//                         doctorId: data.doctorId,
//                         token: data.token,
//                         statusId: 'S1'
//                     },
//                     raw: false
//                 })
//                 if(appointment){
//                     appointment.statusId = 'S2'
//                     await appointment.save();
//                     resolve({
//                         errCode: 0,
//                         errMessage: 'Update status succeed'
//                     })
//                 }else{
//                     resolve({
//                         errCode: 2,
//                         errMessage: 'Appointment has been activated or not exist'
//                     })
//                 }
//             }
//         } catch (e) {
//             reject(e)
//         }
//     })
// }

module.exports = {
    postBookingAppointment: postBookingAppointment, 
    // postVerifyBookingAppointment: postVerifyBookingAppointment
}