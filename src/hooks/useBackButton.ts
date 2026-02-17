import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';

export const useBackButton = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    let listener: any;

    const setup = async () => {
      listener = await App.addListener('backButton', () => {
        // If we're on the home page, exit the app
        if (location.pathname === '/') {
          App.exitApp();
        } else {
          // Use window.history to go back - more reliable in SPA WebView
          if (window.history.length > 1) {
            window.history.back();
          } else {
            navigate('/', { replace: true });
          }
        }
      });
    };

    setup();

    return () => {
      if (listener) {
        listener.remove();
      }
    };
  }, [navigate, location.pathname]);
};
