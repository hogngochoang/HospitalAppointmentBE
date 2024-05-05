require('dotenv').config();
import nodemailer from 'nodemailer';

let sendEmail = async (dataSend) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // Use `true` for port 465, `false` for all other ports
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_APP_PASS,
        }, 
    });
        
        const info = await transporter.sendMail({
            from: '"Bệnh viện Da liễu Hà Nội" <ngochoang017@gmail.com>', // sender address
            to: dataSend.receiveEmail, // list of receivers
            subject: "[THÔNG BÁO] XÁC NHẬN ĐẶT LỊCH HẸN KHÁM TẠI BỆNH VIỆN DA LIỄU HÀ NỘI ", // Subject line
            html: `
                <h3 style="color:#0060ae;text-align:center;font-size:22px">XÁC NHẬN ĐẶT LỊCH HẸN KHÁM THÀNH CÔNG! </h3>
                <p style="font-size:18px"> Bệnh viện Da liễu Hà Nội xin xác nhận những thông tin bạn đã đăng ký như sau: </p>
                <div style="font-size:18px"> 
                    <h4>Họ tên bệnh nhân: <strong>${dataSend.patientName} </strong></h4>
                    <h4>Bác sĩ: <strong>${dataSend.doctorName} </strong></h4>
                    <h4>Ngày hẹn khám: <strong>${dataSend.bookingDate} </strong></h4>
                    <h4>Thời gian: <strong>${dataSend.time} </strong></h4>
                </div>
                <p style="font-size:18px"> Bạn vui lòng đến khám đúng hẹn để được bác sĩ thăm khám, tư vấn. </p>
                <h4 style="font-size:18px"><i> Bệnh viện Da liễu Hà Nội xin trân trọng cảm ơn! </i></h4>
            `, // html body
        });
}

let sendEmailCancel = async (dataSend) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // Use `true` for port 465, `false` for all other ports
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_APP_PASS,
        }, 
    });
        
        const info = await transporter.sendMail({
            from: '"Bệnh viện Da liễu Hà Nội" <ngochoang017@gmail.com>', // sender address
            to: dataSend.receiveEmail, // list of receivers
            subject: "[THÔNG BÁO] HỦY LỊCH ĐẶT KHÁM TẠI BỆNH VIỆN DA LIỄU HÀ NỘI ", // Subject line
            html: `
                <h3> <i> Chào bạn </i></h3>
                <p> Bệnh viện Da liễu Hà Nội xin trân trọng cảm ơn bạn đã đăng ký lịch khám tại bệnh viện vào:</p>
                <div> 
                    <h4><strong> Thời gian: ${dataSend.time} ngày ${dataSend.bookingDate}  </strong></h4>
                    <h4><strong> Bác sĩ: ${dataSend.doctorName} </strong></h4>
                </div>
                <p> Tuy nhiên, vì lý do bệnh nhân đã không có mặt trong khoảng thời gian đã đặt ở trên nên chúng tôi rất tiếc phải thông báo <strong>lịch bạn đã đặt bị hủy</strong>. </p>
                <h4><i> Bệnh viện Da liễu Hà Nội xin trân trọng cảm ơn </i></h4>
            `, // html body
        });
}

module.exports = {
    sendEmail: sendEmail,
    sendEmailCancel: sendEmailCancel
}