const nodemailer = require('nodemailer');

const sendEmail = (recipeient,subject,msg)=>{
    // Create a transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'amakash.warc@gmail.com', // Your email address
      pass: 'csmbxelwhkrbxpnr'         // Your email password or application-specific password
    }
  });
  
  // Define email options with HTML content
  const mailOptions = {
    from: 'amakash.warc@gmail.com',   // Sender address
    to: recipeient,    // List of recipients
    subject: subject,          // Subject line
    html: `<p>${msg}</p>`// HTML content
  };
  
  // Send email asynchronously
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error occurred:', error);
    } else {
      console.log('Email sent successfully!', info.response);
    }
  });
}

module.exports = sendEmail;
