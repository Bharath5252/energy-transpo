import { useState, useEffect } from 'react';
import { database, ref, set, onValue, get } from '../database/firebase';

export const getCookie = (cname) => {
    let name = cname + '=';
    let ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return '';
};

export const carList = () => {
    const carsRef = ref(database, 'cars_data');
    get(carsRef)
        .then((snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                console.log('Data:', data);
                return data;
            } else {
                console.log('No data available');
            }
        })
        .catch((error) => {
            console.error('Error fetching data:', error);
        });
    return {};
};

export const handleFileChange = (event, callback) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result;
      callback(base64String);
    };
    reader.readAsDataURL(file);
  }
};