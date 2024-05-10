import db from "../models/index"
import emailService from './emailService'
require('dotenv').config()
import _ from 'lodash'

const MAX_NUMBER_SCHEDULE  = process.env.MAX_NUMBER_SCHEDULE

let getDoctorHome = (limit) => {
    return new Promise ( async(resolve, reject) => {
        try {
            let users = await db.User.findAll({
                limit: limit,
                order: [['createdAt', 'DESC']],
                where: {roleId: 'R2'},
                attributes: {
                    exclude: ['password']
                },
                include: [
                    {model: db.Allcodes, as: 'positionData', attributes: ['valueVI','valueEN']},
                    {model: db.Allcodes, as: 'genderData', attributes: ['valueVI','valueEN']}
                ],
                raw: true,
                nest: true 
            })
            resolve({
                errCode: 0,
                data: users
            })
        } catch (e) {
            reject(e)
        }
    })
}

let getAllDoctorDetail = () => {
    return new Promise ( async(resolve, reject) => {
        try {
            let users = await db.User.findAll({
                order: [['createdAt', 'DESC']],
                where: {roleId: 'R2'},
                attributes: {
                    exclude: ['password']
                },
                include: [
                    {model: db.Allcodes, as: 'positionData', attributes: ['valueVI','valueEN']},
                    {model: db.Allcodes, as: 'genderData', attributes: ['valueVI','valueEN']}
                ],
                raw: true, 
                nest: true 
            })
            resolve({
                errCode: 0,
                data: users
            })
        } catch (e) {
            reject(e)
        }
    })
}

let createSchedule = (data) => {
    return new Promise ( async(resolve, reject) => {
        try {
            if(!data.arrSchedule || !data.doctorId || !data.date){
                resolve({
                    errCode: 1,
                    errMessage: "Missing required params"
                })
            }else{
                let schedule = data.arrSchedule;
                
                let existing = await db.Schedule.findAll({
                    where: {doctorId: data.doctorId, date: data.date},
                    attributes: ['timeType', 'date','doctorId'],
                    raw: true
                })
                let toCreate = _.differenceWith(schedule, existing, (a,b) => {
                    return a.timeType === b.timeType && +a.date === +b.date;
                })

                if(toCreate && toCreate.length > 0){
                    await db.Schedule.bulkCreate(toCreate)
                }
                resolve({
                    errCode: 0,
                    errMessage: 'OK'
                })
            }

            
        } catch (e) {
            reject(e)
        }
    })
}

let deleteSchedule = (doctorId, date) => {
    return new Promise(async(resolve, reject)=> {
        let schedule = await db.Schedule.findAll({
            where: {
                doctorId: doctorId,
                date: date
            }
        })
        if(!schedule) {
            resolve({
                errCode:2,
                errMessage: "Booking isn't exist"
            })
        }else{
            await db.Schedule.destroy({
                where: {
                    doctorId: doctorId,
                    date: date
                }        
            });

            resolve({
                errCode: 0,
                errMessage: "Schedules is deleted"
            })
        }
        

    })
} 

let getScheduleDoctorByDate = (doctorId, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            if(!doctorId || !date){
                resolve({
                    errCode: 1,
                    errMessage: "Missing required params"
                })
            } else{
                let dataSchedule= await db.Schedule.findAll({
                    where: {
                        doctorId: doctorId,
                        date: date
                    },
                    include: [
                        {model: db.Allcodes, as: 'timeTypeData', attributes: ['valueVI','valueEN']},
                        {model: db.User, as: 'doctorData', attributes: ['firstName','lastName']},
                    ],
                    raw: true,
                    nest: true
                })
                if(!dataSchedule) dataSchedule=[]

                resolve({
                    errCode: 0,
                    data: dataSchedule
                })
            }
        } catch (e) {
            
        }
    })
}

let getScheduleDoctorById = (doctorId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if(!doctorId){
                resolve({
                    errCode: 1,
                    errMessage: "Missing required params"
                })
            } else{
                let dataSchedule= await db.Schedule.findAll({
                    where: {
                        doctorId: doctorId,
                    },
                    include: [
                        {model: db.Allcodes, as: 'timeTypeData', attributes: ['valueVI','valueEN']},
                        {model: db.User, as: 'doctorData', attributes: ['firstName','lastName']},
                    ],
                    raw: true,
                    nest: true
                })

                let groupedData = dataSchedule.reduce((acc, curr) => {
                    const key = `${curr.date}_${curr.doctorId}`;
                    if (!acc[key]) {
                        acc[key] = {
                                date: curr.date,
                                doctorId: curr.doctorId,
                                time: [], // Initialize as an array
                                dataTime:[]
                        };
                    }
                    // Push time to the corresponding array
                    acc[key].time.push(curr.timeType);
                    acc[key].dataTime.push(curr.timeTypeData);
                    return acc;
                }, {});

                // Convert groupedData object to an array of values
                groupedData = Object.values(groupedData);
                
                if(!dataSchedule) dataSchedule=[]

                resolve({
                    errCode: 0,
                    data: groupedData
                })

            }
        } catch (e) {
            
        }
    })
}

let getAllDoctors = () => {
    return new Promise(async(resolve, reject) => {
        try {
            let doctors = await db.User.findAll({
                where: {roleId : 'R2'},
                attributes:{
                    exclude: ['password','image']
                }
            })
            resolve({
                errCode: 0,
                data: doctors
            })

        } catch (e) {
            reject(e)
        }
    })
}

let getListScheduleForDoctor = (doctorId) => {
    return new Promise(async(resolve, reject) => {
        try {
            let schedules = await db.Schedule.findAll({
                where: {doctorId: doctorId},
            })
            resolve({
                errCode: 0,
                data: schedules
            })

        } catch (e) {
            reject(e)
        }
    })
}

let getListPatientForDoctor = (doctorId, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            if(!doctorId || !date){
                resolve({
                    errCode: 1,
                    errMessage: "Missing required params"
                })
            }else{
                let data = await db.confirmedBooking.findAll({
                    where:{
                        statusId: 'S2',
                        doctorId: doctorId,
                        date: date
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
                        },
                        {
                            model: db.User, as:'doctorDataPatientS2',attributes: ['firstName', 'lastName'],
                        }
                    ],
                    raw: false,
                    nest: true
                })
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

let getListExaminedPatientForDoctor = (doctorId, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            if(!doctorId || !date){
                resolve({
                    errCode: 1,
                    errMessage: "Missing required params"
                })
            }else{
                let data = await db.History.findAll({
                    where:{
                        statusId: 'S3',
                        doctorId: doctorId,
                        date: date
                    },
                    include: [
                        {
                            model: db.Patient, as:'patientDataS3',attributes: ['email', 'gender', 'fullName','address','phoneNumber','birthday'],
                            include: [
                                {model: db.Allcodes, as: 'genderData', attributes: ['valueVI','valueEN']}
                            ],
                        },
                        {
                            model: db.Allcodes, as:'timeTypeDataPatientS3',attributes: ['valueVI', 'valueEN'],
                        }
                    ],
                    raw: false,
                    nest: true
                })
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

let updateBookingStatusDone = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if(!data.doctorId || !data.patientId || !data.timeType){
                resolve({
                    errCode: 1,
                    errMessage: "Missing required params"
                })
            }else{
                let appointment = await db.confirmedBooking.findOne({
                    where: {
                        doctorId: data.doctorId,
                        patientId: data.patientId,
                        timeType: data.timeType,
                        date: data.date,
                        statusId: 'S2'
                    },
                    raw: false
                })
                if(appointment){
                    await db.History.create({
                        statusId:'S3',
                        doctorId:appointment.doctorId,
                        patientId: appointment.patientId,
                        date: appointment.date,
                        timeType:appointment.timeType,
                        description: data.description
                    })
                    await db.confirmedBooking.destroy({
                        where:{
                            doctorId: appointment.doctorId,
                            patientId: appointment.patientId,
                            timeType: appointment.timeType,
                            statusId: 'S2'
                        }
                    })
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

let updateBookingStatusCancel = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if(!data.doctorId || !data.patientId || !data.timeType){
                resolve({
                    errCode: 1,
                    errMessage: "Missing required params"
                })
            }else{
                let appointment = await db.confirmedBooking.findOne({
                    where: {
                        doctorId: data.doctorId,
                        patientId: data.patientId,
                        timeType: data.timeType,
                        date: data.date,
                        statusId: 'S2'
                    },
                    raw: false 
                }) 
                if(appointment){
                    await db.History.create({
                        statusId:'S4',  
                        doctorId:appointment.doctorId,
                        patientId: appointment.patientId,
                        date: appointment.date,
                        timeType:appointment.timeType,
                    })
                    await db.confirmedBooking.destroy({
                        where:{
                            doctorId: appointment.doctorId,
                            patientId: appointment.patientId,
                            timeType: appointment.timeType,
                            statusId: 'S2'
                        }
                    })
                    await emailService.sendEmailError({
                        receiveEmail: data.email,
                        patientName: data.fullname,
                        time: data.time,
                        bookingDate: data.bookingDate, 
                        doctorName: data.doctorName,
                    })
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

module.exports = {
    getDoctorHome: getDoctorHome,
    getAllDoctorDetail: getAllDoctorDetail,
    createSchedule: createSchedule,
    deleteSchedule: deleteSchedule,
    getScheduleDoctorByDate: getScheduleDoctorByDate,
    getScheduleDoctorById: getScheduleDoctorById,
    getAllDoctors: getAllDoctors,
    getListScheduleForDoctor:getListScheduleForDoctor,
    getListPatientForDoctor: getListPatientForDoctor,
    getListExaminedPatientForDoctor: getListExaminedPatientForDoctor,
    updateBookingStatusDone: updateBookingStatusDone,
    updateBookingStatusCancel: updateBookingStatusCancel
}