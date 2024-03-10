const nodemailer = require('nodemailer');
var hbs = require('nodemailer-express-handlebars');
const path = require('path')

const sendEmail = (recipeient,subject,msg)=>{
    // Create a transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'info.krystallife@gmail.com', // Your email address
      pass: 'mxnjmoksxiwjbqqz'         // Your email password or application-specific password
    }
  });

  
  
 

  const handlebarOptions = {
    viewEngine: {
      extName: ".handlebars",
      partialsDir: path.resolve('./views'),
      defaultLayout: false,
    },
    viewPath: path.resolve('./views'),
    extName: ".handlebars",
  }
  
  transporter.use('compile', hbs(handlebarOptions));

   // Define email options with HTML content
   const mailOptions = {
    from: 'info.krystallife@gmail.com',   // Sender address
    to: recipeient,    // List of recipients
    subject: subject,          // Subject line
    template: 'emailTemplate',
    context: {
      title: 'Title Here',
      text: "Lorem ipsum dolor sit amet, consectetur..."
    }
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
