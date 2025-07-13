const nodemailer = require("nodemailer");
const fs = require('fs');
const path = require('path');
require('dotenv').config();

class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.USER_NODE_MAILER,
                pass: process.env.PASSWORD_NODE_MAILER,
            },
        });
    }

    // Đọc template từ file
    readTemplate(templateName) {
        try {
            const templatePath = path.join(__dirname, '../templates', `${templateName}.html`);
            return fs.readFileSync(templatePath, 'utf8');
        } catch (error) {
            console.error(`Error reading template ${templateName}:`, error);
            return null;
        }
    }

    // Thay thế placeholder trong template
    replaceTemplateVariables(template, variables) {
        let result = template;
        for (const [key, value] of Object.entries(variables)) {
            const regex = new RegExp(`{{${key}}}`, 'g');
            result = result.replace(regex, value || '');
        }
        return result;
    }

    // Gửi email chào mừng khi đăng ký
    async sendWelcomeEmail(email, customerName) {
        try {
            const template = this.readTemplate('welcome');
            if (!template) {
                throw new Error('Welcome template not found');
            }

            const variables = {
                customerName: customerName || 'Khách hàng',
                currentYear: new Date().getFullYear(),
                supportEmail: process.env.USER_NODE_MAILER,
                websiteUrl: process.env.FRONTEND_URL || 'http://localhost:3000'
            };

            const htmlContent = this.replaceTemplateVariables(template, variables);

            await this.transporter.sendMail({
                from: `"HVStore - Cửa hàng công nghệ" <${process.env.USER_NODE_MAILER}>`,
                to: email,
                subject: "🎉 Chào mừng bạn đến với HVStore!",
                html: htmlContent,
            });

            console.log(`✅ Welcome email sent to: ${email}`);
        } catch (error) {
            console.error('Error sending welcome email:', error);
            throw error;
        }
    }

    // Gửi email xác nhận đơn hàng
    async sendOrderConfirmationEmail(email, orderData) {
        try {
            const template = this.readTemplate('order-confirmation');
            if (!template) {
                throw new Error('Order confirmation template not found');
            }

            const variables = {
                customerName: orderData.customerName || 'Khách hàng',
                orderId: orderData.orderId,
                orderDate: new Date(orderData.orderDate).toLocaleDateString('vi-VN'),
                totalAmount: new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND'
                }).format(orderData.totalAmount),
                orderItems: this.generateOrderItemsHTML(orderData.items),
                trackingUrl: `${process.env.FRONTEND_URL}/orders/${orderData.orderId}`,
                currentYear: new Date().getFullYear(),
                supportEmail: process.env.USER_NODE_MAILER
            };

            const htmlContent = this.replaceTemplateVariables(template, variables);

            await this.transporter.sendMail({
                from: `"HVStore - Xác nhận đơn hàng" <${process.env.USER_NODE_MAILER}>`,
                to: email,
                subject: `📦 Xác nhận đơn hàng #${orderData.orderId}`,
                html: htmlContent,
            });

            console.log(`✅ Order confirmation email sent to: ${email}`);
        } catch (error) {
            console.error('Error sending order confirmation email:', error);
            throw error;
        }
    }

    // Gửi email thông báo thanh toán thành công
    async sendPaymentSuccessEmail(email, paymentData) {
        try {
            const template = this.readTemplate('payment-success');
            if (!template) {
                throw new Error('Payment success template not found');
            }

            const variables = {
                customerName: paymentData.customerName || 'Khách hàng',
                orderId: paymentData.orderId,
                paymentId: paymentData.paymentId,
                paymentDate: new Date(paymentData.paymentDate).toLocaleDateString('vi-VN'),
                paymentMethod: this.getPaymentMethodName(paymentData.paymentMethod),
                amount: new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND'
                }).format(paymentData.amount),
                orderUrl: `${process.env.FRONTEND_URL}/orders/${paymentData.orderId}`,
                currentYear: new Date().getFullYear(),
                supportEmail: process.env.USER_NODE_MAILER
            };

            const htmlContent = this.replaceTemplateVariables(template, variables);

            await this.transporter.sendMail({
                from: `"HVStore - Thanh toán thành công" <${process.env.USER_NODE_MAILER}>`,
                to: email,
                subject: `💳 Thanh toán thành công cho đơn hàng #${paymentData.orderId}`,
                html: htmlContent,
            });

            console.log(`✅ Payment success email sent to: ${email}`);
        } catch (error) {
            console.error('Error sending payment success email:', error);
            throw error;
        }
    }

    // Gửi email thông báo trạng thái đơn hàng
    async sendOrderStatusEmail(email, statusData) {
        try {
            const template = this.readTemplate('order-status');
            if (!template) {
                throw new Error('Order status template not found');
            }

            const variables = {
                customerName: statusData.customerName || 'Khách hàng',
                orderId: statusData.orderId,
                oldStatus: this.getStatusName(statusData.oldStatus),
                newStatus: this.getStatusName(statusData.newStatus),
                statusMessage: this.getStatusMessage(statusData.newStatus),
                updateDate: new Date().toLocaleDateString('vi-VN'),
                orderUrl: `${process.env.FRONTEND_URL}/orders/${statusData.orderId}`,
                currentYear: new Date().getFullYear(),
                supportEmail: process.env.USER_NODE_MAILER
            };

            const htmlContent = this.replaceTemplateVariables(template, variables);

            await this.transporter.sendMail({
                from: `"HVStore - Cập nhật đơn hàng" <${process.env.USER_NODE_MAILER}>`,
                to: email,
                subject: `📋 Cập nhật trạng thái đơn hàng #${statusData.orderId}`,
                html: htmlContent,
            });

            console.log(`✅ Order status email sent to: ${email}`);
        } catch (error) {
            console.error('Error sending order status email:', error);
            throw error;
        }
    }

    // Helper methods
    generateOrderItemsHTML(items) {
        if (!items || items.length === 0) return '<tr><td colspan="4">Không có sản phẩm</td></tr>';

        return items.map(item => `
            <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">
                    ${item.productName || 'Sản phẩm'}
                </td>
                <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">
                    ${item.quantity || 1}
                </td>
                <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">
                    ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.unitPrice || 0)}
                </td>
                <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">
                    ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.totalPrice || 0)}
                </td>
            </tr>
        `).join('');
    }

    getPaymentMethodName(method) {
        const methods = {
            'cash': 'Thanh toán khi nhận hàng (COD)',
            'vnpay': 'VNPay',
            'credit_card': 'Thẻ tín dụng',
            'debit_card': 'Thẻ ghi nợ',
            'bank_transfer': 'Chuyển khoản ngân hàng',
            'e_wallet': 'Ví điện tử',
            'momo': 'MoMo',
            'zalopay': 'ZaloPay'
        };
        return methods[method] || method;
    }

    getStatusName(status) {
        const statuses = {
            'pending': 'Chờ xử lý',
            'confirmed': 'Đã xác nhận',
            'processing': 'Đang xử lý',
            'shipped': 'Đang giao hàng',
            'delivered': 'Đã giao hàng',
            'cancelled': 'Đã hủy'
        };
        return statuses[status] || status;
    }

    getStatusMessage(status) {
        const messages = {
            'pending': 'Đơn hàng của bạn đang chờ được xử lý.',
            'confirmed': 'Đơn hàng của bạn đã được xác nhận và sẽ sớm được chuẩn bị.',
            'processing': 'Đơn hàng của bạn đang được chuẩn bị.',
            'shipped': 'Đơn hàng của bạn đã được giao cho đơn vị vận chuyển.',
            'delivered': 'Đơn hàng của bạn đã được giao thành công. Cảm ơn bạn đã mua hàng!',
            'cancelled': 'Đơn hàng của bạn đã bị hủy. Nếu có thắc mắc, vui lòng liên hệ với chúng tôi.'
        };
        return messages[status] || 'Trạng thái đơn hàng đã được cập nhật.';
    }

    // Backward compatibility - giữ method cũ
    async sendEmailService(email, customerName = null) {
        return this.sendWelcomeEmail(email, customerName);
    }
}

const emailService = new EmailService();

module.exports = {
    sendEmailService: emailService.sendEmailService.bind(emailService),
    sendWelcomeEmail: emailService.sendWelcomeEmail.bind(emailService),
    sendOrderConfirmationEmail: emailService.sendOrderConfirmationEmail.bind(emailService),
    sendPaymentSuccessEmail: emailService.sendPaymentSuccessEmail.bind(emailService),
    sendOrderStatusEmail: emailService.sendOrderStatusEmail.bind(emailService)
};
