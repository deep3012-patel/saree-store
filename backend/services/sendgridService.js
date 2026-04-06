const sgMail = require("@sendgrid/mail");

// Set API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Send Welcome Email
exports.sendWelcomeEmail = async (user) => {
  const msg = {
    to: user.email,
    from: "noreply@sareestore.com", // Your verified sender
    subject: "🎉 Welcome to Saree Store!",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #9b2c1d;">Welcome to Saree Store!</h1>
        <p>Dear <strong>${user.name}</strong>,</p>
        <p>Thank you for registering with us! 🎉</p>
        <p>Start shopping now: <a href="https://saree-store-xeej.vercel.app/products">Click here</a></p>
        <hr>
        <p style="color: #666;">Happy Shopping! 🛍️</p>
      </div>
    `,
  };

  try {
    await sgMail.send(msg);
    console.log(`✅ Welcome email sent to ${user.email}`);
  } catch (error) {
    console.error("SendGrid error:", error);
  }
};

// Send Order Confirmation Email
exports.sendOrderConfirmation = async (user, order) => {
  const total = order.items.reduce((sum, item) => {
    const price = item.discount
      ? item.price - (item.price * item.discount) / 100
      : item.price;
    return sum + price * item.quantity;
  }, 0);

  const msg = {
    to: user.email,
    from: "noreply@sareestore.com",
    subject: `📦 Order Confirmed #${order._id.toString().slice(-6)}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #9b2c1d;">Order Confirmed! 🎉</h1>
        <p>Dear <strong>${user.name}</strong>,</p>
        <p>Thank you for your order!</p>
        
        <h3>Order Details:</h3>
        <p><strong>Order ID:</strong> #${order._id.toString().slice(-6)}</p>
        <p><strong>Total:</strong> ₹${total}</p>
        
        <p>Track your order: <a href="https://saree-store-xeej.vercel.app/orders">Click here</a></p>
        <hr>
        <p style="color: #666;">Thank you for shopping with us! 🪔</p>
      </div>
    `,
  };

  try {
    await sgMail.send(msg);
    console.log(`✅ Order confirmation sent to ${user.email}`);
  } catch (error) {
    console.error("SendGrid error:", error);
  }
};
