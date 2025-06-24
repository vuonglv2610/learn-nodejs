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
    
    const validPaymentMethods = ['cash', 'credit_card', 'debit_card', 'bank_transfer', 'e_wallet', 'momo', 'zalopay', 'vnpay'];
    if (!validPaymentMethods.includes(paymentMethod)) {
      return Response.fail(req, res, 400, 'Phương thức thanh toán không hợp lệ');
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
    
    const validStatuses = ['pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded'];
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
  checkVnPay: (req, res) => {
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
    } = req.query;

    const SUCCESS_CODES = ["00"];

    const FAILED_VNPAY_CODES = [
      "09", // Chưa đăng ký InternetBanking
      "10", // Xác thực sai quá 3 lần
      "11", // Hết hạn chờ thanh toán
      "12", // Thẻ/Tài khoản bị khóa
      "13", // Nhập sai OTP
      "24", // Khách hủy giao dịch
      "51", // Không đủ số dư
      "65", // Vượt hạn mức trong ngày
      "75", // Ngân hàng bảo trì
      "79", // Nhập sai mật khẩu thanh toán quá số lần
      "99"  // Lỗi khác
    ];

    const FAILED_INTERNAL_CODES = [
      "07" // Trừ tiền thành công nhưng nghi ngờ gian lận
    ];
    // Tạo lại query string từ object `req.query`
    const queryString = new URLSearchParams(req.query).toString();

    // Tạo URL trả về kèm theo query
    const redirectUrl = `${process.env.PAYMENT_RETURN_URL}?${queryString}`;

    if (SUCCESS_CODES.includes(vnp_ResponseCode)) {
      return Response.success(req,res,200, 'Thanh toán thành công', {result: `${process.env.PAYMENT_RETURN_URL}?${redirectUrl}` });
    } else if (FAILED_INTERNAL_CODES.includes(vnp_ResponseCode)) {
      return Response.fail(req, res, 400, 'Thanh toán thất bại phía vnpay');
    } else if (FAILED_VNPAY_CODES.includes(vnp_ResponseCode)) {
      return Response.fail(req, res, 400, 'Thanh toán thất bại');
    } else {
      return Response.fail(req, res, 400, 'Thanh toán thất bại');
    }
  },
};
