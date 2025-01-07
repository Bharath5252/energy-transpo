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

export const arrayLengthChecker = (arr) => {
  return arr && Array.isArray(arr) && arr?.length>0;
}

export const dateFormat = (data) => {
  const date = new Date(data);
  return date?.toISOString().split('T')[0];
}

export const dateFormat2 = (data) => {
  const date = new Date(data);
  return `${date?.toISOString().split('T')[0]} ${date?.toISOString().split('T')[1]}`;
}