import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // چک کردن اطلاعات کاربر در localStorage
    const checkLocalStorage = () => {
      const savedUser = localStorage.getItem('user');
      const savedAuth = localStorage.getItem('isAuthenticated');
      
      if (savedUser && savedAuth === 'true') {
        setUser(JSON.parse(savedUser));
        setIsAuthenticated(true);
      }
    };

    // چک کردن IP کاربر و مطابقت با دیتابیس
    const checkUserIP = async () => {
      try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        const userIP = data.ip;

        // چک کردن IP در فایربیس
        const userDoc = await getDocs(query(
          collection(db, 'users'),
          where('ip', '==', userIP),
          limit(1)
        ));

        if (!userDoc.empty) {
          const userData = userDoc.docs[0].data();
          setUser(userData);
          setIsAuthenticated(true);
          localStorage.setItem('user', JSON.stringify(userData));
          localStorage.setItem('isAuthenticated', 'true');
        }
      } catch (error) {
        console.error('Error checking IP:', error);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        setIsAuthenticated(true);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('isAuthenticated', 'true');
      } else {
        // اگر کاربر لاگین نیست، چک کردن localStorage و IP
        checkLocalStorage();
        checkUserIP();
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    try {
      await auth.signOut();
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('user');
      localStorage.removeItem('isAuthenticated');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const value = {
    isAuthenticated,
    user,
    loading,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}; 