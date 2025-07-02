/**
 * Helper functions cho Customer operations
 */

const Customer = require('../models/customer.model');

class CustomerHelper {
  /**
   * Lấy danh sách customers với thông tin cơ bản
   */
  static async getCustomersList() {
    try {
      const customers = await Customer.findAll({
        attributes: ['id', 'name', 'email', 'phone'],
        where: {
          deletedAt: null
        },
        order: [['createdAt', 'DESC']]
      });
      
      return customers;
    } catch (error) {
      throw new Error(`Error fetching customers: ${error.message}`);
    }
  }

  /**
   * Kiểm tra customer có tồn tại không
   */
  static async customerExists(customerId) {
    try {
      const customer = await Customer.findByPk(customerId);
      return !!customer;
    } catch (error) {
      throw new Error(`Error checking customer existence: ${error.message}`);
    }
  }

  /**
   * Lấy thông tin customer theo ID
   */
  static async getCustomerById(customerId) {
    try {
      const customer = await Customer.findByPk(customerId, {
        attributes: ['id', 'name', 'email', 'phone']
      });
      
      if (!customer) {
        throw new Error(`Customer with ID ${customerId} not found`);
      }
      
      return customer;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Validate customer ID format (UUID)
   */
  static validateCustomerId(customerId) {
    if (!customerId) {
      throw new Error('Customer ID is required');
    }
    
    // Kiểm tra format UUID
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(customerId)) {
      throw new Error('Invalid customer ID format');
    }
    
    return true;
  }

  /**
   * Tạo customer mới (nếu cần)
   */
  static async createCustomer(customerData) {
    try {
      const { name, email, phone, address } = customerData;
      
      if (!name || !email) {
        throw new Error('Name and email are required');
      }
      
      // Kiểm tra email đã tồn tại chưa
      const existingCustomer = await Customer.findOne({
        where: { email: email }
      });
      
      if (existingCustomer) {
        throw new Error(`Customer with email ${email} already exists`);
      }
      
      const customer = await Customer.create({
        name,
        email,
        phone,
        address
      });
      
      return customer;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = CustomerHelper;
