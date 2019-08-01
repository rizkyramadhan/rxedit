import React, { useEffect, useState } from 'react';

export default () => {
  const [isLogin, setIsLogin] = useState('loading');
  
  useEffect(() => {
    setIsLogin(checkLogin());
  }, []);

  if (isLogin === 'loading') {
    return <div>Loading</div>;
  }

  if (isLogin === 'logedin') {
    return <div>Halaman Home</div>;
  }

  return <div>Login disini</div>;
};

const checkLogin = () => {
  return 'logedin';
};
