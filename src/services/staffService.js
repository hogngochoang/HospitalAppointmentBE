import { where } from "sequelize"
import db from "../models/index"
import emailService from './emailService'
require('dotenv').config()
import _ from 'lodash'

let getListWaitingPatientForStaff = () => {
    return new Promise(async (resolve, reject) => {
        try {

                let data = await db.Booking.findAll({
                    where:{
                        statusId: 'S1',
                    },
                    include: [
                        {
                            model: db.Patient, as:'patientData',attributes: ['email', 'gender', 'fullName','address','phoneNumber','birthday'],
                            include: [
                                {model: db.Allcodes, as: 'genderData', attributes: ['valueVI','valueEN']}
                            ],
                        },
                        {
                            model: db.Allcodes, as:'timeTypeDataPatient',attributes: ['valueVI', 'valueEN'],
                        },
                        {
                            model: db.User, as:'doctorDataPatient',attributes: ['firstName', 'lastName'],
                        }
                    ],
                    raw: false,
                    nest: true
                })
                resolve({
                    errCode: 0,
                    data: data
                })
            
        } catch (e) {
            reject(e)
        }
    })
}

let updateBookingStatusConfirmed = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if(!data.doctorId || !data.patientId || !data.timeType){
                resolve({
                    errCode: 1,
                    errMessage: "Missing required params"
                })
            }else{
                let appointment = await db.Booking.findOne({
                    where: {
                        doctorId: data.doctorId,
                        patientId: data.patientId,
                        timeType: data.timeType,
                        statusId: 'S1'
                    },
                    raw: false
                })
                if(appointment){
                    await db.confirmedBooking.create({
                        statusId:'S2',
                        doctorId:appointment.doctorId,
                        patientId: appointment.patientId,
                        date: appointment.date,
                        timeType:appointment.timeType,
                        token: appointment.token
                    })
                    await db.Booking.destroy({
                        where:{
                            doctorId: appointment.doctorId,
                            patientId: appointment.patientId,
                            timeType: appointment.timeType,
                            statusId: 'S1'
                        }
                    })
                    await emailService.sendEmail({
                        receiveEmail: data.email,
                        patientName: data.fullname,
                        time: data.time,
                        bookingDate: data.bookingDate, 
                        doctorName: data.doctorName,
                    })
                    console.log(data) 
                }
                resolve({
                    errCode: 0,
                    data: data
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

let getListConfirmedPatientForStaff = () => {
    return new Promise(async (resolve, reject) => {
        try {

                let data = await db.confirmedBooking.findAll({
                    where:{
                        statusId: 'S2',
                    },
                    include: [
                        {
                            model: db.Patient, as:'patientDataS2',attributes: ['email', 'gender', 'fullName','address','phoneNumber','birthday'],
                            include: [
                                {model: db.Allcodes, as: 'genderData', attributes: ['valueVI','valueEN']}
                            ],
                        },
                        {
                            model: db.Allcodes, as:'timeTypeDataPatientS2',attributes: ['valueVI', 'valueEN'],
                        }
                    ],
                    raw: false,
                    nest: true
                })
                resolve({
                    errCode: 0,
                    data: data
                })
            
        } catch (e) {
            reject(e)
        }
    })
}

let deleteBooking = (id) => {
    return new Promise(async(resolve, reject)=> {
        let booking = await db.Booking.findOne({
            where: {id: id}
        })
        if(!booking) {
            resolve({
                errCode:2,
                errMessage: "Booking isn't exist"
            })
        }
        await db.Booking.destroy({
            where: {id: id}
        });

        resolve({
            errCode: 0,
            errMessage: "User is deleted"
        })

    })
} 

module.exports = {
    getListWaitingPatientForStaff: getListWaitingPatientForStaff,
    updateBookingStatusConfirmed: updateBookingStatusConfirmed,
    getListConfirmedPatientForStaff: getListConfirmedPatientForStaff,
    deleteBooking: deleteBooking
}