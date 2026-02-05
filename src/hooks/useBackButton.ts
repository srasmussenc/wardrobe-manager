 import { useEffect } from 'react';
 import { useNavigate, useLocation } from 'react-router-dom';
 import { App } from '@capacitor/app';
 import { Capacitor } from '@capacitor/core';
 
 export const useBackButton = () => {
   const navigate = useNavigate();
   const location = useLocation();
 
   useEffect(() => {
     if (!Capacitor.isNativePlatform()) return;
 
     const handleBackButton = App.addListener('backButton', ({ canGoBack }) => {
       // If we're on the home page, exit the app
       if (location.pathname === '/') {
         App.exitApp();
       } else {
         // Otherwise, go back in history
         if (canGoBack) {
           navigate(-1);
         } else {
           navigate('/');
         }
       }
     });
 
     return () => {
       handleBackButton.then((listener) => listener.remove());
     };
   }, [navigate, location.pathname]);
 };