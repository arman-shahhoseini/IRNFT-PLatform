import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { FaCog, FaDownload, FaImage, FaLightbulb, FaMagic, FaRandom, FaInfoCircle, FaTrash, FaHistory } from 'react-icons/fa';
import './CreateNFT.css';
import { promptSuggestions } from '../data/aiPrompts';
import { generateImageFromText, extractImageFromResponse } from '../api/text2image';

// API کلیدهای از پیش تعریف شده
const API_KEYS = [
  'cbf235267aca441eb07d7385dc53fe0c',
  '81fefda2756a496b934f67038b41eb72',
  '7d4408f2508d46e0b86ad031c9bbfbc9',
  'b63c4306f64d48cf9d132946ce8876b1',
  '47bc6468b2d54c3d9da58421a37882b2',
  '0368afd2aa114639aef30121e0539f66',
  'ad7788c74391498484be2e70a6ac7c6c',
  '80e7c498eb8246c49ebf5131ec4539b1',
  'b3c12daa537542988ed113812c1db60b',
  'de884080ae4948d8ab5fae7c04ec7218',
  '9351a6959ac74ea1ba8cf8036699d672',
  'ce5b7859013142b998b74d6da35c0b40'
];

// استفاده از چرخشی از کلیدهای API
const getRandomApiKey = () => {
  // ذخیره شاخص کلید آخر در localStorage
  const lastIndex = parseInt(localStorage.getItem('lastApiKeyIndex') || '0');
  
  // انتخاب شاخص بعدی به صورت چرخشی
  const nextIndex = (lastIndex + 1) % API_KEYS.length;
  
  // ذخیره شاخص جدید
  localStorage.setItem('lastApiKeyIndex', nextIndex.toString());
  
  return API_KEYS[nextIndex];
};

// بررسی محدودیت تعداد درخواست روزانه
const checkDailyLimit = () => {
  const today = new Date().toISOString().split('T')[0]; // تاریخ امروز (YYYY-MM-DD)
  const storedDate = localStorage.getItem('lastImageDate');
  const count = parseInt(localStorage.getItem('dailyImageCount') || '0');
  
  if (storedDate === today) {
    // اگر امروز قبلاً تصویر ساخته شده، شمارنده را بررسی کن
    if (count >= 2) {
      return {
        canGenerate: false,
        count: count,
        message: 'محدودیت ساخت تصویر: شما در هر 24 ساعت فقط مجاز به ساخت 2 تصویر هستید.'
      };
    } else {
      return {
        canGenerate: true,
        count: count,
        message: `شما امروز ${count} تصویر ساخته‌اید و می‌توانید ${2 - count} تصویر دیگر بسازید.`
      };
    }
  } else {
    // امروز هنوز تصویری ساخته نشده
    return {
      canGenerate: true,
      count: 0,
      message: 'شما امروز هنوز تصویری نساخته‌اید و می‌توانید 2 تصویر بسازید.'
    };
  }
};

// افزایش شمارنده تصاویر ساخته شده
const incrementDailyCount = () => {
  const today = new Date().toISOString().split('T')[0];
  const storedDate = localStorage.getItem('lastImageDate');
  let count = parseInt(localStorage.getItem('dailyImageCount') || '0');
  
  if (storedDate === today) {
    // اگر امروز باشد، شمارنده را افزایش بده
    count++;
  } else {
    // روز جدید، شمارنده را ریست کن
    count = 1;
  }
  
  localStorage.setItem('lastImageDate', today);
  localStorage.setItem('dailyImageCount', count.toString());
  
  return count;
};

const CreateNFT = () => {
  const { t } = useTranslation();
  const [prompt, setPrompt] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [imageSize, setImageSize] = useState({ width: 512, height: 512 });
  const [selectedStyle, setSelectedStyle] = useState('realistic');
  const [showNegativePrompt, setShowNegativePrompt] = useState(false);
  const [recentPrompts, setRecentPrompts] = useState([]);
  const promptInputRef = useRef(null);
  const [dailyLimit, setDailyLimit] = useState(checkDailyLimit());
  const [generatedImages, setGeneratedImages] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  const predefinedSizes = [
    { name: '512×512', width: 512, height: 512 },
    { name: '768×768', width: 768, height: 768 },
    { name: '1024×1024', width: 1024, height: 1024 },
    { name: '512×768', width: 512, height: 768 },
    { name: '768×512', width: 768, height: 512 },
  ];

  const styles = [
    { id: 'realistic', name: 'واقع‌گرایانه' },
    { id: 'cartoon', name: 'کارتونی' },
    { id: 'anime', name: 'انیمه' },
    { id: 'abstract', name: 'انتزاعی' },
    { id: 'painting', name: 'نقاشی' },
    { id: 'cyberpunk', name: 'سایبرپانک' },
    { id: 'fantasy', name: 'فانتزی' },
  ];

  // پیشنهادات پرامپت برای الهام گرفتن
  const getRandomSuggestion = () => {
    const randomIndex = Math.floor(Math.random() * promptSuggestions.length);
    setPrompt(promptSuggestions[randomIndex]);
  };

  const generateImage = async () => {
    if (!prompt.trim()) return;
    
    // پاک کردن تصویر قبلی
    setGeneratedImage(null);
    
    // بررسی محدودیت روزانه
    const limit = checkDailyLimit();
    setDailyLimit(limit);
    
    if (!limit.canGenerate) {
      setError(limit.message);
      return;
    }
    
    setIsLoading(true);
    setError(null);

    try {
      const stylePrefix = getStylePrefix(selectedStyle);
      const fullPrompt = `${stylePrefix} ${prompt}`;
      const fullNegativePrompt = negativePrompt ? negativePrompt : "low quality, blurry, distorted";
      
      // ذخیره پرامپت در تاریخچه
      if (!recentPrompts.includes(prompt)) {
        setRecentPrompts(prev => [prompt, ...prev.slice(0, 4)]);
      }
      
      // انتخاب کلید API
      const apiKey = typeof getRandomApiKey === 'function' ? getRandomApiKey() : API_KEYS[0];
      
      // تنظیم پارامترهای صحیح برای API
      const requestData = {
        model: "flux-pro",
        prompt: fullPrompt,
        negative_prompt: fullNegativePrompt,
        samples: 1,
        width: Number(imageSize.width),
        height: Number(imageSize.height),
        num_inference_steps: 30,
        guidance_scale: 7.5,
        seed: Math.floor(Math.random() * 1000000)
      };
      
      console.log("Sending request with data:", JSON.stringify(requestData));
      
      // استفاده از API
      const responseData = await generateImageFromText(requestData, apiKey);
      console.log("API response:", responseData);
      
      // استخراج تصویر از پاسخ
      const image = extractImageFromResponse(responseData);
      setGeneratedImage(image);
      
      // اضافه کردن تصویر به تاریخچه
      const imageItem = {
        id: Date.now(),
        image: image,
        prompt: fullPrompt,
        date: new Date().toLocaleString('fa-IR')
      };
      setGeneratedImages(prev => [imageItem, ...prev]);
      
      // اعمال محدودیت روزانه اگر وجود دارد
      if (typeof incrementDailyCount === 'function') {
        const newCount = incrementDailyCount();
        if (typeof setDailyLimit === 'function') {
          setDailyLimit({
            canGenerate: newCount < 2,
            count: newCount,
            message: newCount >= 2 
              ? 'محدودیت ساخت تصویر: شما در هر 24 ساعت فقط مجاز به ساخت 2 تصویر هستید.'
              : `شما امروز ${newCount} تصویر ساخته‌اید و می‌توانید ${2 - newCount} تصویر دیگر بسازید.`
          });
        }
      }
      
    } catch (err) {
      console.error('Error generating image:', err);
      if (err.response && err.response.data) {
        console.error('API Error details:', err.response.data);
      }
      setError(err.response?.data?.message || err.response?.data?.error || err.message || 'خطا در ایجاد تصویر');
    } finally {
      setIsLoading(false);
    }
  };

  const getStylePrefix = (style) => {
    switch (style) {
      case 'realistic': return 'ultra realistic, highly detailed, photorealistic,';
      case 'cartoon': return 'cartoon style, colorful, stylized,';
      case 'anime': return 'anime style, japanese animation, vibrant colors,';
      case 'abstract': return 'abstract art, non-representational, geometric shapes,';
      case 'painting': return 'digital painting, artistic, brushstrokes,';
      case 'cyberpunk': return 'cyberpunk, neon, futuristic, sci-fi, high tech,';
      case 'fantasy': return 'fantasy art, magical, mythical creatures, enchanted,';
      default: return '';
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      generateImage();
    }
  };

  const handleSizeChange = (width, height) => {
    setImageSize({ width, height });
    setShowSettings(false);
  };

  const downloadImage = (imageUrl, index = null) => {
    if (!imageUrl) return;
    
    try {
      // ایجاد لینک دانلود و فایل
      const fileName = `AI-Generated-Image-${index !== null ? index : Date.now()}.jpg`;
      
      let url;
      if (typeof imageUrl === 'string' && imageUrl.startsWith('http')) {
        // اگر تصویر URL باشد
        url = imageUrl;
      } else {
        // اگر تصویر base64 باشد
        url = `data:image/jpeg;base64,${imageUrl}`;
      }
      
      // ایجاد لینک برای دانلود مستقیم
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      
      // شروع دانلود
      link.click();
      
      // پاکسازی
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 100);
    } catch (error) {
      console.error("Error downloading image:", error);
      alert("دانلود تصویر با مشکل مواجه شد.");
    }
  };

  const removeFromHistory = (id) => {
    setGeneratedImages(prev => prev.filter(item => item.id !== id));
  };

  // تمرکز بر روی فیلد پرامپت هنگام لود صفحه
  useEffect(() => {
    if (promptInputRef.current) {
      promptInputRef.current.focus();
    }
  }, []);

  // بررسی محدودیت روزانه هنگام ورود به صفحه
  useEffect(() => {
    setDailyLimit(checkDailyLimit());
  }, []);

  const useRecentPrompt = (prompt) => {
    setPrompt(prompt);
  };

  return (
    <div className="create-nft-container">
      <div className="create-nft-header">
        <h1>{t('ساخت NFT با هوش مصنوعی')}</h1>
        <p className="description">
          {t('ایده‌های خود را به تصاویر خیره‌کننده تبدیل کنید')}
        </p>
      </div>

      <div className="ai-creator-layout">
        <div className="prompt-panel">
          {typeof dailyLimit !== 'undefined' && (
            <div className="daily-limit-info">
              <FaInfoCircle /> {dailyLimit.message}
            </div>
          )}
          
          <div className="prompt-container modern">
            <div className="prompt-header">
              <h3>{t('توضیحات تصویر')}</h3>
              <div className="prompt-tools">
                <button 
                  className="prompt-tool-button" 
                  onClick={getRandomSuggestion}
                  title={t('پیشنهاد تصادفی')}
                >
                  <FaLightbulb />
                </button>
                <button 
                  className={`prompt-tool-button ${showNegativePrompt ? 'active' : ''}`}
                  onClick={() => setShowNegativePrompt(!showNegativePrompt)}
                  title={t('پرامپت منفی')}
                >
                  <FaMagic />
                </button>
                <button 
                  className="prompt-tool-button settings-button"
                  onClick={() => setShowSettings(!showSettings)}
                  title={t('تنظیمات')}
                >
                  <FaCog />
                </button>
                <button 
                  className={`prompt-tool-button ${showHistory ? 'active' : ''}`}
                  onClick={() => setShowHistory(!showHistory)}
                  title={t('تاریخچه تصاویر')}
                >
                  <FaHistory />
                </button>
              </div>
            </div>
            
            <div className="prompt-input-area">
              <textarea
                ref={promptInputRef}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t('چیزی که می‌خواهید ببینید را توصیف کنید...')}
                className="prompt-textarea"
                rows={4}
              />
              
              {showNegativePrompt && (
                <div className="negative-prompt-container">
                  <label>{t('پرامپت منفی (موارد نامطلوب در تصویر)')}</label>
                  <textarea
                    value={negativePrompt}
                    onChange={(e) => setNegativePrompt(e.target.value)}
                    placeholder={t('مواردی که نمی‌خواهید در تصویر ببینید...')}
                    className="negative-prompt-textarea"
                    rows={2}
                  />
                </div>
              )}
            </div>

            {recentPrompts.length > 0 && (
              <div className="recent-prompts">
                <h4>{t('پرامپت‌های اخیر')}</h4>
                <div className="recent-prompts-list">
                  {recentPrompts.map((p, index) => (
                    <button 
                      key={index} 
                      className="recent-prompt-item"
                      onClick={() => useRecentPrompt(p)}
                    >
                      {p.length > 30 ? p.substring(0, 30) + '...' : p}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            <div className="style-selection">
              {styles.map((style) => (
                <button
                  key={style.id}
                  className={`style-button ${selectedStyle === style.id ? 'active' : ''}`}
                  onClick={() => setSelectedStyle(style.id)}
                >
                  {style.name}
                </button>
              ))}
            </div>
            
            <button 
              className="generate-button" 
              onClick={generateImage}
              disabled={isLoading || !prompt.trim() || (typeof dailyLimit !== 'undefined' && !dailyLimit.canGenerate)}
            >
              <FaImage />
              {isLoading 
                ? t('در حال ساخت...') 
                : (typeof dailyLimit !== 'undefined' && !dailyLimit.canGenerate) 
                  ? t('محدودیت ساخت تصویر') 
                  : t('ساخت تصویر')}
            </button>
            
            {showSettings && (
              <div className="settings-dropdown modern">
                <div className="settings-header">{t('اندازه تصویر')}</div>
                <div className="predefined-sizes">
                  {predefinedSizes.map((size) => (
                    <button
                      key={`${size.width}x${size.height}`}
                      className={`size-button ${imageSize.width === size.width && imageSize.height === size.height ? 'active' : ''}`}
                      onClick={() => handleSizeChange(size.width, size.height)}
                    >
                      {size.name}
                    </button>
                  ))}
                </div>
                <div className="custom-size">
                  <span>{t('سفارشی')}: </span>
                  <input
                    type="number"
                    placeholder="عرض"
                    min="256"
                    max="1024"
                    step="64"
                    value={imageSize.width}
                    onChange={(e) => setImageSize({...imageSize, width: parseInt(e.target.value) || 512})}
                  />
                  <span>×</span>
                  <input
                    type="number"
                    placeholder="ارتفاع"
                    min="256"
                    max="1024"
                    step="64"
                    value={imageSize.height}
                    onChange={(e) => setImageSize({...imageSize, height: parseInt(e.target.value) || 512})}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="result-panel">
          <div className="image-preview-area modern">
            {generatedImage ? (
              <div className="generated-image-container">
                {typeof generatedImage === 'string' && generatedImage.startsWith('http') ? (
                  <img 
                    src={generatedImage} 
                    alt="تصویر تولید شده"
                    className="generated-image" 
                  />
                ) : (
                  <img 
                    src={`data:image/jpeg;base64,${generatedImage}`} 
                    alt="تصویر تولید شده"
                    className="generated-image" 
                  />
                )}
                <button className="download-button" onClick={() => downloadImage(generatedImage)}>
                  <FaDownload /> {t('دانلود')}
                </button>
              </div>
            ) : isLoading ? (
              <div className="loading-container">
                <div className="spinner"></div>
                <p>{t('در حال ساخت تصویر...')}</p>
              </div>
            ) : (
              <div className="placeholder-container">
                <div className="placeholder-image">
                  <FaImage className="placeholder-icon" />
                  <span>{t('تصویر شما اینجا نمایش داده خواهد شد')}</span>
                </div>
              </div>
            )}
          </div>
          
          {error && <div className="error-message">{error}</div>}
        </div>
      </div>

      {/* نمایش تاریخچه تصاویر */}
      {showHistory && (
        <div className="images-history-container">
          <div className="images-history-header">
            <h3>{t('تاریخچه تصاویر ساخته شده')}</h3>
            <p>{generatedImages.length > 0 
              ? t('روی هر تصویر کلیک کنید تا دانلود شود') 
              : t('هنوز تصویری ساخته نشده است')}
            </p>
          </div>
          
          <div className="images-history-grid">
            {generatedImages.length > 0 ? (
              generatedImages.map((item, index) => (
                <div key={item.id} className="history-image-item">
                  <div className="history-image-wrapper" onClick={() => downloadImage(item.image, index)}>
                    {typeof item.image === 'string' && item.image.startsWith('http') ? (
                      <img 
                        src={item.image} 
                        alt={`تصویر ${index + 1}`}
                        className="history-image" 
                      />
                    ) : (
                      <img 
                        src={`data:image/jpeg;base64,${item.image}`} 
                        alt={`تصویر ${index + 1}`}
                        className="history-image" 
                      />
                    )}
                  </div>
                  <div className="history-image-details">
                    <div className="history-image-prompt">{item.prompt.length > 50 ? `${item.prompt.substring(0, 50)}...` : item.prompt}</div>
                    <div className="history-image-date">{item.date}</div>
                    <div className="history-image-actions">
                      <button 
                        className="history-download-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          downloadImage(item.image, index);
                        }}
                        title={t('دانلود')}
                      >
                        <FaDownload />
                      </button>
                      <button 
                        className="history-delete-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFromHistory(item.id);
                        }}
                        title={t('حذف')}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-images-message">
                <FaImage />
                <p>{t('هنوز تصویری ساخته نشده است')}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateNFT; 