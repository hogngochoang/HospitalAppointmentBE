import db from "../models/index"
require('dotenv').config()
import _ from 'lodash'
import moment from 'moment';
const { Op } = require('sequelize');

let getListGroupPatientForAdmin = (doctorId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if(!doctorId){
                resolve({
                    errCode: 1,
                    errMessage: "Missing required params"
                })
            }else{
                let dataS3 = await db.History.findAll({
                    where:{
                        statusId: 'S4'|| 'S3',
                        doctorId: doctorId
                    },
                    include: [
                        {
                            model: db.Patient, as:'patientDataS3',attributes: ['email', 'gender', 'fullName','address'],
                            include: [
                                {model: db.Allcodes, as: 'genderData', attributes: ['valueVI','valueEN']}
                            ],
                        },
                        {
                            model: db.Allcodes, as:'timeTypeDataPatientS3',attributes: ['valueVI', 'valueEN'],
                        }
                    ],
                    raw: true,
                    nest: true
                })
                let dataS2 = await db.confirmedBooking.findAll({
                    where:{
                        doctorId: doctorId
                    },
                    include: [
                        {
                            model: db.Patient, as:'patientDataS2',attributes: ['email', 'gender', 'fullName','address'],
                            include: [
                                {model: db.Allcodes, as: 'genderData', attributes: ['valueVI','valueEN']}
                            ],
                        },
                        {
                            model: db.Allcodes, as:'timeTypeDataPatientS2',attributes: ['valueVI', 'valueEN'],
                        }
                    ],
                    raw: true,
                    nest: true
                })
                
                let data= dataS2.concat(dataS3)
                let key = 'patientId'
                let dataUniquePatientId = [...new Map(data.map(item =>
                    [item[key], item])).values()];
                console.log(dataUniquePatientId)
                let groupedData = data.reduce((acc, curr) => {
                    const key = `${curr.doctorId}`;
                    if (!acc[key]) { 
                        acc[key] = {
                                date: curr.date,
                                doctorId: curr.doctorId,
                                patientId: [],
                                patientData: [],
                        };
                    }
                    // Push time to the corresponding array
                    acc[key].patientId.push(curr.patientId);
                    acc[key].patientData.push(curr.patientDataS3 || curr.patientDataS2, curr.statusId);
                    return acc;
                }, {});

                // Convert groupedData object to an array of values
                groupedData = Object.values(groupedData);
                resolve({
                    errCode: 0,
                    data: groupedData
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

let getListPatientForAdmin = (date) => {
    return new Promise(async (resolve, reject) => {
        try {
            if(!date){
                resolve({
                    errCode: 1,
                    errMessage: "Missing required params"
                })
            }else{
                let dataS3 = await db.History.findAll({
                    where:{
                        statusId: ['S4', 'S3'],
                        date: date
                    },
                    include: [
                        {
                            model: db.Patient, as:'patientDataS3',attributes: ['email', 'gender', 'fullName','address'],
                            include: [
                                {model: db.Allcodes, as: 'genderData', attributes: ['valueVI','valueEN']}
                            ],
                        },
                        {
                            model: db.Allcodes, as:'timeTypeDataPatientS3',attributes: ['valueVI', 'valueEN'],
                        }
                    ],
                    raw: true,
                    nest: true
                })
                let dataS2 = await db.confirmedBooking.findAll({
                    where:{
                        date: date
                    },
                    include: [
                        {
                            model: db.Patient, as:'patientDataS2',attributes: ['email', 'gender', 'fullName','address'],
                            include: [
                                {model: db.Allcodes, as: 'genderData', attributes: ['valueVI','valueEN']}
                            ],
                        },
                        {
                            model: db.Allcodes, as:'timeTypeDataPatientS2',attributes: ['valueVI', 'valueEN'],
                        }
                    ],
                    raw: true,
                    nest: true
                })
                
                let data= dataS2.concat(dataS3)
                // let key = 'patientId'
                // let dataUniquePatientId = [...new Map(data.map(item =>
                //     [item[key], item])).values()];
                // console.log(dataUniquePatientId)
                // let groupedData = data.reduce((acc, curr) => {
                //     const key = `${curr.doctorId}`;
                //     if (!acc[key]) { 
                //         acc[key] = {
                //                 date: curr.date,
                //                 doctorId: curr.doctorId,
                //                 patientId: [],
                //                 patientData: [],
                //         };
                //     }
                //     // Push time to the corresponding array
                //     acc[key].patientId.push(curr.patientId);
                //     acc[key].patientData.push(curr.patientDataS3 || curr.patientDataS2, curr.statusId);
                //     return acc;
                // }, {});

                // // Convert groupedData object to an array of values
                // groupedData = Object.values(groupedData);
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

let getTotalPatientForAdmin = (doctorId) => {
    return new Promise(async (resolve, reject) => { 
        try {
            // Tính ngày bắt đầu và ngày kết thúc của tuần từ date
            const startDate = moment().startOf('week').valueOf(); 
            const endDate = moment().endOf('week').valueOf();

            // Truy vấn dữ liệu trong khoảng thời gian đã xác định
            let dataS3 = await db.History.findAll({
                where: {
                    statusId: ['S4', 'S3'],
                    doctorId: doctorId,
                    date: { [Op.between]: [startDate, endDate] } // Thêm điều kiện lấy dữ liệu trong khoảng thời gian
                },
                include: [
                    {
                        model: db.Patient, as:'patientDataS3',attributes: ['email', 'gender', 'fullName','address'],
                        include: [
                            {model: db.Allcodes, as: 'genderData', attributes: ['valueVI','valueEN']}
                        ],
                    },
                    {
                        model: db.Allcodes, as:'timeTypeDataPatientS3',attributes: ['valueVI', 'valueEN'],
                    }
                ],
                raw: true,
                nest: true
            });

            let dataS2 = await db.confirmedBooking.findAll({
                where: {
                    statusId: 'S2',
                    doctorId: doctorId,
                    date: { [Op.between]: [startDate, endDate] } // Thêm điều kiện lấy dữ liệu trong khoảng thời gian
                },
                include: [
                    {
                        model: db.Patient, as:'patientDataS2',attributes: ['email', 'gender', 'fullName','address'],
                        include: [
                            {model: db.Allcodes, as: 'genderData', attributes: ['valueVI','valueEN']}
                        ],
                    },
                    {
                        model: db.Allcodes, as:'timeTypeDataPatientS2',attributes: ['valueVI', 'valueEN'],
                    }
                ],
                raw: true,
                nest: true
            });

            let data = dataS2.concat(dataS3);
            let key = 'patientId'
            let dataUniquePatientId = [...new Map(data.map(item =>
                [item[key], item])).values()];
            let groupedData = data.reduce((acc, curr) => {
                const key = `${curr.doctorId}`;
                if (!acc[key]) { 
                    acc[key] = {
                            date: curr.date,
                            doctorId: curr.doctorId,
                            patientId: [],
                            patientData: [],
                    };
                }
                // Push time to the corresponding array
                acc[key].patientId.push(curr.patientId);
                acc[key].patientData.push(curr.patientDataS3 || curr.patientDataS2, curr.statusId);
                return acc;
            }, {});

            // Convert groupedData object to an array of values
            groupedData = Object.values(groupedData);
            resolve({
                errCode: 0,
                data: groupedData
            });
        } catch (e) {
            reject(e);
        }
    });
};


module.exports = {
    getListPatientForAdmin: getListPatientForAdmin,
    getTotalPatientForAdmin:getTotalPatientForAdmin
}