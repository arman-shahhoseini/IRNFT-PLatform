import axios from 'axios';

/**
 * تابع درخواست بازیابی رمز عبور
 * @param {string} email - ایمیل کاربر
 * @returns {Promise} نتیجه درخواست بازیابی رمز عبور
 */
export const requestPasswordReset = async (email) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password`, 
      { email }
    );
    
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    return {
      success: false,
      error: error?.response?.data?.message || error.message || 'خطا در بازیابی رمز عبور'
    };
  }
};

/**
 * تابع تغییر رمز عبور از طریق توکن بازیابی
 * @param {object} data - اطلاعات برای تغییر رمز عبور
 * @param {string} data.token - توکن بازیابی رمز عبور
 * @param {string} data.password - رمز عبور جدید
 * @returns {Promise} نتیجه تغییر رمز عبور
 */
export const resetPassword = async (data) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/new-password`, 
      data
    );
    
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    return {
      success: false,
      error: error?.response?.data?.message || error.message || 'خطا در تغییر رمز عبور'
    };
  }
};

/**
 * تابع اعتبارسنجی توکن بازیابی رمز عبور
 * @param {string} token - توکن بازیابی رمز عبور
 * @returns {Promise} نتیجه اعتبارسنجی توکن
 */
export const validateResetToken = async (token) => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/validate-reset-token/${token}`
    );
    
    return {
      success: true,
      valid: response.data.valid,
      email: response.data.email
    };
  } catch (error) {
    return {
      success: false,
      valid: false,
      error: error?.response?.data?.message || error.message || 'توکن نامعتبر است'
    };
  }
}; 