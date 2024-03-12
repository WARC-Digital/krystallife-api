const nodemailer = require('nodemailer');
var hbs = require('nodemailer-express-handlebars');
const path = require('path');
const {OrderStatus} = require('./oderStatus')

const sendEmail = (template,subject,context)=>{
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
      extName: ".html",
      partialsDir: path.resolve('./views'),
      defaultLayout: false,
    },
    viewPath: path.resolve('./views'),
    extName: ".html",
  }

  if(template == 'orderTemplate'){
    for(let i = 0;i<context.order.orderItems.length;i++){
      if(context.order.orderItems[i].orderType == 'PRE-ORDER'){
        context.order.orderItems[i]['preorder'] = true;
      }else{
        context.order.orderItems[i]['preorder'] = false;
      }
      context.order.orderItems[i]['name'] = context.products.find(item=>item._id ==  context.order.orderItems[i].product).name;
      context.order.orderItems[i]['img'] =  'https://api.krystallife.store' + context.products.find(item=>item._id ==  context.order.orderItems[i].product).imgUrl;
    }
    context.order.deliveryStatus = OrderStatus[context.order.deliveryStatus-1];
    context.order['date'] = context.order.checkoutDate.toLocaleDateString();

  }
  
  transporter.use('compile', hbs(handlebarOptions));

   // Define email options with HTML content
   const mailOptions = {
    from: 'info.krystallife@gmail.com',   // Sender address
    to: context.order.email,    // List of recipients
    subject: subject,          // Subject line
    template: template,
    context: context,
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
