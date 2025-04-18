import axios from 'axios';

/**
 * تبدیل متن به تصویر با استفاده از API هوش مصنوعی
 * @param {Object} requestData - داده‌های درخواست
 * @param {string} apiKey - کلید API
 * @returns {Promise<Object>} - پاسخ API
 */
export const generateImageFromText = async (requestData, apiKey) => {
  try {
    // ساخت فرمت درخواست دقیقاً مطابق با مستندات API
    const apiRequestData = {
      model: "flux-pro",
      prompt: requestData.prompt,
      num_images: 1,
      seed: Math.floor(Math.random() * 1000000)
    };

    // اضافه کردن تنظیمات اندازه تصویر
    apiRequestData.image_size = {
      width: Number(requestData.width) || 1024,  // افزایش به 1024 برای کیفیت بهتر
      height: Number(requestData.height) || 1024 // افزایش به 1024 برای کیفیت بهتر
    };

    // سایر پارامترهای اختیاری - افزایش مقادیر برای کیفیت بهتر
    apiRequestData.num_inference_steps = 30;   // افزایش از 1 به 30
    apiRequestData.guidance_scale = 7.5;       // افزایش از 1 به 7.5
    apiRequestData.safety_tolerance = "3";     // افزایش از 1 به 3 برای محدودیت کمتر
    apiRequestData.output_format = "jpeg";

    // افزودن پرامپت منفی اگر وجود داشته باشد
    if (requestData.negative_prompt) {
      apiRequestData.negative_prompt = requestData.negative_prompt;
    }

    console.log("Sending text2image request with data:", JSON.stringify(apiRequestData));
    
    const response = await axios.post(
      'https://api.aimlapi.com/v1/images/generations',
      apiRequestData,
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'Accept': '*/*'
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error in text2image API:", error);
    
    // نمایش اطلاعات دقیق‌تر خطا
    if (error.response && error.response.data) {
      console.error("API error response:", error.response.data);
    }
    
    throw error;
  }
};

/**
 * پردازش پاسخ API و استخراج تصویر
 * @param {Object} apiResponse - پاسخ API
 * @returns {string} - تصویر base64 یا URL
 */
export const extractImageFromResponse = (apiResponse) => {
  // بررسی فرمت پاسخ و استخراج تصویر
  if (apiResponse && apiResponse.images && apiResponse.images.length > 0) {
    // فرمت API فعلی - ممکن است URL یا base64 باشد
    if (apiResponse.images[0].url) {
      return apiResponse.images[0].url;
    }
    return apiResponse.images[0];
  } 
  
  // سایر فرمت‌های احتمالی پاسخ
  if (apiResponse && apiResponse.data && apiResponse.data.length > 0) {
    if (apiResponse.data[0].url) {
      return apiResponse.data[0].url;
    }
    if (apiResponse.data[0].b64_json) {
      return apiResponse.data[0].b64_json;
    }
  } 
  
  if (apiResponse && apiResponse.output && apiResponse.output.length > 0) {
    return apiResponse.output[0];
  }
  
  throw new Error('دریافت تصویر با مشکل مواجه شد');
}; 