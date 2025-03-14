export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePassword = (password) => {
  if (password.length < 6) {
    return 'رمز عبور باید حداقل ۶ کاراکتر باشد'
  }
  if (!/[A-Z]/.test(password)) {
    return 'رمز عبور باید حداقل یک حرف بزرگ داشته باشد'
  }
  if (!/[a-z]/.test(password)) {
    return 'رمز عبور باید حداقل یک حرف کوچک داشته باشد'
  }
  if (!/[0-9]/.test(password)) {
    return 'رمز عبور باید حداقل یک عدد داشته باشد'
  }
  return null
}

export const validateUsername = (username) => {
  if (username.length < 3) {
    return 'نام کاربری باید حداقل ۳ کاراکتر باشد'
  }
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return 'نام کاربری فقط می‌تواند شامل حروف انگلیسی، اعداد و خط زیر باشد'
  }
  return null
}

export const validateWalletAddress = (address) => {
  if (!address) {
    return 'آدرس کیف پول الزامی است'
  }
  if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
    return 'آدرس کیف پول نامعتبر است'
  }
  return null
}

export const validateNFTName = (name) => {
  if (!name) {
    return 'نام NFT الزامی است'
  }
  if (name.length < 3) {
    return 'نام NFT باید حداقل ۳ کاراکتر باشد'
  }
  return null
}

export const validateNFTDescription = (description) => {
  if (!description) {
    return 'توضیحات NFT الزامی است'
  }
  if (description.length < 10) {
    return 'توضیحات NFT باید حداقل ۱۰ کاراکتر باشد'
  }
  return null
}

export const validateNFTPrice = (price) => {
  if (price === undefined || price === null) {
    return 'قیمت NFT الزامی است'
  }
  if (isNaN(price) || price < 0) {
    return 'قیمت NFT باید یک عدد مثبت باشد'
  }
  return null
}

export const validateImageFile = (file) => {
  if (!file) {
    return 'فایل تصویر الزامی است'
  }
  if (!file.type.startsWith('image/')) {
    return 'فایل باید یک تصویر باشد'
  }
  if (file.size > 5 * 1024 * 1024) { // 5MB
    return 'حجم تصویر نمی‌تواند بیشتر از ۵ مگابایت باشد'
  }
  return null
}

export const validateForm = (values, rules) => {
  const errors = {}
  
  Object.keys(rules).forEach(field => {
    const fieldRules = rules[field]
    const value = values[field]
    
    if (fieldRules.required && !value) {
      errors[field] = fieldRules.required
    } else if (fieldRules.validate) {
      const error = fieldRules.validate(value)
      if (error) {
        errors[field] = error
      }
    }
  })
  
  return errors
} 