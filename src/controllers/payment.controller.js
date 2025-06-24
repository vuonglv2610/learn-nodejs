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
  }
};
