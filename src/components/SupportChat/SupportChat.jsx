import React, { useState, useEffect, useRef } from 'react';
import { FaHeadset, FaTimes, FaPaperPlane } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import './SupportChat.css';

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

const getRandomApiKey = () => {
  const randomIndex = Math.floor(Math.random() * API_KEYS.length);
  return API_KEYS[randomIndex];
};

const initialSystemMessage = `
شما دستیار هوش مصنوعی IRNFT هستید. IRNFT یک پلتفرم NFT ایرانی است که امکان خرید، فروش و ساخت NFT را فراهم می‌کند.
پلتفرم IRNFT شامل این ویژگی‌هاست:
- مارکت‌پلیس برای خرید و فروش NFT ها
- کیف پول دیجیتال برای ذخیره ارز و NFT ها
- ابزارهای ساخت NFT 
- کالکشن‌های اختصاصی هنری
- سیستم پشتیبانی از کاربران

لطفاً به سؤالات کاربران درباره این پلتفرم به طور دقیق و مفید پاسخ دهید. اگر سؤالی خارج از حوزه IRNFT پرسیده شد، 
به آن‌ها یادآوری کنید که شما فقط می‌توانید درباره IRNFT و خدمات آن پاسخ دهید.
`;

const LOCAL_STORAGE_KEY = 'irnft_chat_';

const SupportChat = () => {
  const { user, isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [userKnowledge, setUserKnowledge] = useState({
    nftKnowledge: null,
    cryptoExperience: null,
    interests: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const onboardingQuestions = [
    {
      question: 'میزان آشنایی شما با NFT چقدر است؟',
      options: [
        { label: 'تازه‌کار هستم', value: 'beginner' },
        { label: 'آشنایی متوسط دارم', value: 'intermediate' },
        { label: 'حرفه‌ای هستم', value: 'expert' }
      ],
      field: 'nftKnowledge'
    },
    {
      question: 'تجربه شما در زمینه ارزهای دیجیتال چگونه است؟',
      options: [
        { label: 'تجربه‌ای ندارم', value: 'none' },
        { label: 'کمی تجربه دارم', value: 'some' },
        { label: 'تجربه زیادی دارم', value: 'extensive' }
      ],
      field: 'cryptoExperience'
    },
    {
      question: 'در کدام جنبه‌های NFT علاقه‌مند هستید؟',
      options: [
        { label: 'هنری', value: 'art' },
        { label: 'سرمایه‌گذاری', value: 'investment' },
        { label: 'کلکسیونی', value: 'collectibles' },
        { label: 'بازی‌ها', value: 'gaming' }
      ],
      field: 'interests',
      multiSelect: true
    }
  ];

  // Load user chat history and onboarding status from localStorage
  useEffect(() => {
    if (isAuthenticated && user?.email) {
      const storageKey = `${LOCAL_STORAGE_KEY}${user.email}`;
      const savedData = localStorage.getItem(storageKey);
      
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        setIsOnboardingComplete(parsedData.isOnboardingComplete || false);
        setUserKnowledge(parsedData.userKnowledge || {
          nftKnowledge: null,
          cryptoExperience: null,
          interests: []
        });
        
        // Load saved messages if they exist
        if (parsedData.messages && parsedData.messages.length > 0) {
          setMessages(parsedData.messages);
        }
      }
    }
  }, [isAuthenticated, user]);

  // Save user chat history and onboarding status to localStorage
  useEffect(() => {
    if (isAuthenticated && user?.email) {
      const storageKey = `${LOCAL_STORAGE_KEY}${user.email}`;
      const dataToSave = {
        isOnboardingComplete,
        userKnowledge,
        messages
      };
      
      localStorage.setItem(storageKey, JSON.stringify(dataToSave));
    }
  }, [isAuthenticated, user, isOnboardingComplete, userKnowledge, messages]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const toggleChat = () => {
    setIsOpen(prevIsOpen => !prevIsOpen);
    
    // Only add welcome message if no previous messages exist and chat is being opened
    if (!isOpen && messages.length === 0 && isOnboardingComplete) {
      setMessages([
        {
          sender: 'bot',
          text: 'به پشتیبانی IRNFT خوش آمدید! چطور می‌توانم به شما کمک کنم؟'
        }
      ]);
    }
  };

  const handleSendMessage = async () => {
    if (inputValue.trim() === '') return;

    const userMessage = {
      sender: 'user',
      text: inputValue
    };

    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const apiKey = getRandomApiKey();
      const systemMessage = `${initialSystemMessage}
      
      دانش کاربر: ${userKnowledge.nftKnowledge ? 
        (userKnowledge.nftKnowledge === 'beginner' ? 'تازه‌کار' : 
         userKnowledge.nftKnowledge === 'intermediate' ? 'متوسط' : 'حرفه‌ای') : 'نامشخص'}
      تجربه کریپتو: ${userKnowledge.cryptoExperience ? 
        (userKnowledge.cryptoExperience === 'none' ? 'بدون تجربه' : 
         userKnowledge.cryptoExperience === 'some' ? 'کم تجربه' : 'با تجربه') : 'نامشخص'}
      علاقه‌مندی‌ها: ${userKnowledge.interests?.length > 0 ? userKnowledge.interests.join(', ') : 'نامشخص'}
      `;

      const response = await fetch('https://api.aimlapi.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gpt-4-turbo',
          messages: [
            {
              role: 'system',
              content: systemMessage
            },
            ...messages.map(msg => ({
              role: msg.sender === 'user' ? 'user' : 'assistant',
              content: msg.text
            })),
            {
              role: 'user',
              content: inputValue
            }
          ],
          temperature: 0.7,
          max_tokens: 500
        })
      });

      const data = await response.json();
      
      if (data.choices && data.choices[0] && data.choices[0].message) {
        const botResponse = {
          sender: 'bot',
          text: data.choices[0].message.content
        };
        setMessages(prevMessages => [...prevMessages, botResponse]);
      } else {
        throw new Error('پاسخی از سرور دریافت نشد');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prevMessages => [
        ...prevMessages,
        {
          sender: 'bot',
          text: 'متأسفانه در ارتباط با سرور مشکلی پیش آمده است. لطفاً بعداً دوباره تلاش کنید.'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (isOnboardingComplete) {
        handleSendMessage();
      }
    }
  };

  const handleOptionSelect = (option, field, multiSelect = false) => {
    setUserKnowledge(prev => {
      if (multiSelect) {
        const updatedInterests = prev[field].includes(option.value)
          ? prev[field].filter(item => item !== option.value)
          : [...prev[field], option.value];
        
        return { ...prev, [field]: updatedInterests };
      }
      return { ...prev, [field]: option.value };
    });
  };

  const handleNextOnboardingStep = () => {
    if (onboardingStep < onboardingQuestions.length - 1) {
      setOnboardingStep(prev => prev + 1);
    } else {
      completeOnboarding();
    }
  };

  const completeOnboarding = () => {
    setIsOnboardingComplete(true);

    // Add a welcome message based on user knowledge
    let welcomeMessage = 'ممنون از پاسخ‌های شما! اکنون می‌توانید سؤالات خود را درباره IRNFT بپرسید.';
    
    if (userKnowledge.nftKnowledge === 'beginner') {
      welcomeMessage += ' من می‌توانم مفاهیم پایه NFT و نحوه استفاده از پلتفرم IRNFT را به شما آموزش دهم.';
    } else if (userKnowledge.nftKnowledge === 'expert') {
      welcomeMessage += ' با توجه به تجربه شما، می‌توانم اطلاعات پیشرفته‌تری درباره ویژگی‌های پلتفرم IRNFT ارائه دهم.';
    }
    
    // Add interest-based recommendations
    if (userKnowledge.interests.includes('art')) {
      welcomeMessage += ' شما می‌توانید از کالکشن‌های هنری منحصر به فرد ما مانند Fates & Faces دیدن کنید.';
    }
    
    if (userKnowledge.interests.includes('investment')) {
      welcomeMessage += ' برای اطلاعات بیشتر درباره سرمایه‌گذاری در NFT‌ها، می‌توانید از بخش مارکت‌پلیس ما بازدید کنید.';
    }

    setMessages(prevMessages => [
      ...prevMessages,
      {
        sender: 'bot',
        text: welcomeMessage
      }
    ]);
  };

  const renderOnboarding = () => {
    const currentQuestion = onboardingQuestions[onboardingStep];
    return (
      <div className="onboarding-container">
        <h3 className="onboarding-question">{currentQuestion.question}</h3>
        <div className="onboarding-options">
          {currentQuestion.options.map((option, index) => (
            <div 
              key={index} 
              className={`onboarding-option ${
                currentQuestion.multiSelect 
                  ? userKnowledge[currentQuestion.field].includes(option.value) ? 'selected' : ''
                  : userKnowledge[currentQuestion.field] === option.value ? 'selected' : ''
              }`}
              onClick={() => handleOptionSelect(option, currentQuestion.field, currentQuestion.multiSelect)}
            >
              {option.label}
            </div>
          ))}
        </div>
        <button 
          className="onboarding-next-btn"
          onClick={handleNextOnboardingStep}
          disabled={
            currentQuestion.multiSelect 
              ? userKnowledge[currentQuestion.field].length === 0
              : userKnowledge[currentQuestion.field] === null
          }
        >
          {onboardingStep < onboardingQuestions.length - 1 ? 'ادامه' : 'شروع گفتگو'}
        </button>
      </div>
    );
  };

  // Don't render the chat component if the user is not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="support-chat-container">
      <button 
        className={`support-chat-toggle ${isOpen ? 'open' : ''}`} 
        onClick={toggleChat}
        aria-label="پشتیبانی"
      >
        {isOpen ? <FaTimes /> : <FaHeadset />}
      </button>
      
      {isOpen && (
        <div className="support-chat-window">
          <div className="support-chat-header">
            <div className="support-chat-title">پشتیبانی IRNFT</div>
            <button className="support-chat-close" onClick={toggleChat}>
              <FaTimes />
            </button>
          </div>
          
          <div className="support-chat-body">
            {!isOnboardingComplete ? (
              renderOnboarding()
            ) : (
              <>
                <div className="support-chat-messages">
                  {messages.map((message, index) => (
                    <div 
                      key={index} 
                      className={`support-chat-message ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}
                    >
                      <div className="message-content">{message.text}</div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="support-chat-message bot-message">
                      <div className="message-loading">
                        <div className="typing-indicator">
                          <span></span>
                          <span></span>
                          <span></span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
                
                <div className="support-chat-input-container">
                  <textarea
                    className="support-chat-input"
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    placeholder="پیام خود را بنویسید..."
                    rows={1}
                  />
                  <button 
                    className="support-chat-send" 
                    onClick={handleSendMessage}
                    disabled={inputValue.trim() === '' || isLoading}
                  >
                    <FaPaperPlane />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SupportChat; 