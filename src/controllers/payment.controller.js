const PaymentRepository = require('../repositories/payment.repository');
const Response = require('../helpers/response');

module.exports = {
  // Lấy danh sách thanh toán
  getList: (req, res) => {
    PaymentRepository.get(req, res, (data) => {
      if (!data) {
        return Response.fail(req, res, 500, 'Lỗi khi lấy danh sách thanh toán');
      }
      return Response.success(req, res, 200, 'Lấy danh sách thanh toán thành công', data);
    });
  },

  // Lấy thông tin thanh toán theo ID
  getOne: (req, res) => {
    PaymentRepository.getOne(req, res, (data) => {
      if (!data) {
        return Response.fail(req, res, 404, 'Không tìm thấy thanh toán');
      }
      return Response.success(req, res, 200, 'Lấy thông tin thanh toán thành công', data);
    });
  },

  // Tạo thanh toán từ giỏ hàng
  createFromCart: (req, res) => {
    // Validate dữ liệu đầu vào
    const { customerId, paymentMethod } = req.body;
    
    if (!customerId) {
      return Response.fail(req, res, 400, 'customerId là bắt buộc');
    }
    
    if (!paymentMethod) {
      return Response.fail(req, res, 400, 'paymentMethod là bắt buộc');
    }
    
    const validPaymentMethods = ['cash', 'vnpay'];
    if (!validPaymentMethods.includes(paymentMethod)) {
      return Response.fail(req, res, 400, 'Phương thức thanh toán không hợp lệ. Chỉ hỗ trợ: cash, vnpay');
    }
    
    PaymentRepository.createFromCart(req, res, (data) => {
      if (!data) {
        return Response.fail(req, res, 500, 'Lỗi khi tạo thanh toán');
      }
      
      if (data.error) {
        return Response.fail(req, res, 400, data.error);
      }
      
      return Response.success(req, res, 201, 'Tạo thanh toán thành công', data);
    });
  },

  // Xử lý thanh toán
  processPayment: (req, res) => {
    const { paymentStatus } = req.body;
    
    if (!paymentStatus) {
      return Response.fail(req, res, 400, 'paymentStatus là bắt buộc');
    }
    
    const validStatuses = ['pending', 'paid', 'failed', 'refunded'];
    if (!validStatuses.includes(paymentStatus)) {
      return Response.fail(req, res, 400, 'Trạng thái thanh toán không hợp lệ');
    }
    
    PaymentRepository.processPayment(req, res, (data) => {
      if (!data) {
        return Response.fail(req, res, 500, 'Lỗi khi xử lý thanh toán');
      }
      
      if (data.error) {
        return Response.fail(req, res, 400, data.error);
      }
      
      return Response.success(req, res, 200, 'Xử lý thanh toán thành công', data);
    });
  },

  // Hoàn tiền
  refund: (req, res) => {
    const { refundAmount } = req.body;
    
    if (!refundAmount || refundAmount <= 0) {
      return Response.fail(req, res, 400, 'Số tiền hoàn phải lớn hơn 0');
    }
    
    PaymentRepository.refund(req, res, (data) => {
      if (!data) {
        return Response.fail(req, res, 500, 'Lỗi khi xử lý hoàn tiền');
      }
      
      if (data.error) {
        return Response.fail(req, res, 400, data.error);
      }
      
      return Response.success(req, res, 200, 'Hoàn tiền thành công', data);
    });
  },

  // Lấy thống kê thanh toán
  getStatistics: (req, res) => {
    PaymentRepository.getStatistics(req, res, (data) => {
      if (!data) {
        return Response.fail(req, res, 500, 'Lỗi khi lấy thống kê thanh toán');
      }
      return Response.success(req, res, 200, 'Lấy thống kê thanh toán thành công', data);
    });
  },

  // lấy thông tin từ vnpay trả về status, amount ...
  checkVnPay: async (req, res) => {
    try {
      const {
        vnp_Amount,// chia 100 để lấy ra số đúng
        vnp_BankCode,
        vnp_BankTranNo,
        vnp_CardType,
        vnp_OrderInfo,
        vnp_PayDate,
        vnp_ResponseCode,
        vnp_TmnCode,
        vnp_TransactionNo,
        vnp_TxnRef // Đây là paymentId hoặc transaction reference
      } = req.query;

      console.log('🔍 VNPay callback received:', req.query);

      // Validate required parameters
      if (!vnp_OrderInfo || !vnp_ResponseCode || !vnp_TxnRef) {
        console.error('❌ Missing required VNPay parameters');
        const frontendBaseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
        const frontendUrl = `${frontendBaseUrl}/orders?status=failed&message=${encodeURIComponent('Thiếu thông tin thanh toán')}&error=missing_params`;
        return res.redirect(frontendUrl);
      }

      const SUCCESS_CODES = ["00"];
      const FAILED_VNPAY_CODES = [
        "09", "10", "11", "12", "13", "24", "51", "65", "75", "79", "99"
      ];
      const FAILED_INTERNAL_CODES = ["07"];

      let paymentStatus = 'failed';
      let message = 'Thanh toán thất bại';

      if (SUCCESS_CODES.includes(vnp_ResponseCode)) {
        paymentStatus = 'paid';  // Thay đổi từ 'completed' thành 'paid'
        message = 'Thanh toán thành công';
      } else if (FAILED_INTERNAL_CODES.includes(vnp_ResponseCode)) {
        paymentStatus = 'failed';
        message = 'Thanh toán thất bại phía VNPay';
      } else if (FAILED_VNPAY_CODES.includes(vnp_ResponseCode)) {
        paymentStatus = 'failed';
        message = 'Thanh toán thất bại';
      }

      // Gọi repository để cập nhật payment status
      PaymentRepository.updatePaymentStatus(req, res, vnp_OrderInfo, paymentStatus, (result) => {
        const frontendBaseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
        const frontendUrl = `${frontendBaseUrl}/orders?status=${paymentStatus}&message=${encodeURIComponent(message)}`;

        if (result && result.customerId) {
          // Thêm customerId vào URL để frontend biết user nào
          return res.redirect(`${frontendUrl}&customerId=${result.customerId}`);
        } else {
          // Nếu không tìm thấy payment hoặc có lỗi, vẫn redirect về frontend
          return res.redirect(`${frontendUrl}&error=payment_not_found`);
        }
      });

    } catch (error) {
      console.error('Error in checkVnPay:', error);
      const frontendBaseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      const frontendUrl = `${frontendBaseUrl}/orders?status=failed&message=${encodeURIComponent('Lỗi xử lý thanh toán')}&error=server_error`;
      return res.redirect(frontendUrl);
    }
  },
};
