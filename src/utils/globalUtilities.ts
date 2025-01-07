import {jwtDecode} from 'jwt-decode';
import jwt_encode from 'jwt-encode';
import {ToWords} from 'to-words';
import {LOCAL_STORAGE_DATA_KEYS} from '../constants/localStorageDataModel';
import axios from 'axios';
import {MODULES_API_MAP} from '@Src/services/httpService';
import {GLOBAL_API_ROUTES} from '@Src/services/globalApiRoutes';
import moment from 'moment';
import {getConfigData} from '@Src/config/config';
import Api from '../app/admin/api/Api';
import { toast } from 'react-toastify';

export const encodeString = (value: any) => {
  const JWT_ENCODE_SECRET = process.env.REACT_APP_JWT_ENCODE_SECRET!;
  return jwt_encode(value, JWT_ENCODE_SECRET);
};

export const decodeString = (value: string) => {
  return jwtDecode(value);
};

export const encodeKeyAndUrl = (route: string, isResourcesTabOpen = false) => {
  const userDetails: string = getDataFromLocalStorage(
    LOCAL_STORAGE_DATA_KEYS.USER_DETAILS
  );
  if (userDetails) {
    const parsedUserDetails = JSON.parse(userDetails) as {
      auth_id: number;
      email: string;
      uid: number;
      name: string;
    };
    const userDetailsObj = {
      ...parsedUserDetails,
      isResourcesTabOpen,
      url: route,
    };
    return encodeString(userDetailsObj);
  }
};

export const setDataOnLocalStorage = (key: string, value: string) => {
  return sessionStorage.setItem(key, value);
};

export const getDataFromLocalStorage = (key: string) => {
  const value = sessionStorage.getItem(key);
  if (value === null) {
    return '';
  }
  return value;
};

export const removeDataFromLocalStorage = (key: string) => {
  sessionStorage.removeItem(key);
};

export const isMobile = (): boolean => {
  if (window.screen.width <= 992) {
    return true;
  }
  return false;
};

/**
 * @param object - Object of objects
 * @returns - Array of objects
 */

export const getArrayOfObjects = (object: any): Array<any> => {
  if (object) {
    return Object.keys(object).map((key) => {
      return object[key];
    });
  } else {
    return [];
  }
};

export function addCommasToPrice(price: any) {
  return price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
} //US dollar system

export const formatNumberToIndianSystem = (price: any) => {
  if (price === undefined || price === null) {
    return '';
  }

  price = parseFloat(price).toFixed(2);

  let [integerPart, decimalPart] = price.toString().split('.');

  let lastThreeDigits = integerPart.slice(-3);
  let otherDigits = integerPart.slice(0, -3);
  if (otherDigits !== '') {
    lastThreeDigits = ',' + lastThreeDigits;
  }

  let formattedIntegerPart =
    otherDigits.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThreeDigits;

  return `${formattedIntegerPart}.${decimalPart}`;
};
export const formatNumberToIndianSystemArea = (price: any) => {
  if (price === undefined || price === null) {
    return '';
  }

  let [integerPart, decimalPart] = price.toString().split('.');

  let lastThreeDigits = integerPart.slice(-3);
  let otherDigits = integerPart.slice(0, -3);
  if (otherDigits !== '') {
    lastThreeDigits = ',' + lastThreeDigits;
  }

  let formattedIntegerPart =
    otherDigits.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThreeDigits;

  return decimalPart
    ? `${formattedIntegerPart}.${decimalPart}`
    : formattedIntegerPart;
};

export const numberToOrdinals = (number: any) => {
  if (number == null || isNaN(number)) {
    return '';
  }

  const parsedNumber = parseInt(number, 10);
  const ordinals = ['th', 'st', 'nd', 'rd'];
  const mod10 = parsedNumber % 10;
  const mod100 = parsedNumber % 100;

  let suffix = ordinals[0];
  if (mod10 === 1 && mod100 !== 11) {
    suffix = ordinals[1];
  } else if (mod10 === 2 && mod100 !== 12) {
    suffix = ordinals[2];
  } else if (mod10 === 3 && mod100 !== 13) {
    suffix = ordinals[3];
  }

  return `${parsedNumber}${suffix}`;
};

export const onlyOrdinals = (number: any) => {
  if (number == null || isNaN(number)) {
    return '';
  }

  const parsedNumber = parseInt(number, 10);
  const ordinals = ['th', 'st', 'nd', 'rd'];
  const mod10 = parsedNumber % 10;
  const mod100 = parsedNumber % 100;

  let suffix = ordinals[0];
  if (mod10 === 1 && mod100 !== 11) {
    suffix = ordinals[1];
  } else if (mod10 === 2 && mod100 !== 12) {
    suffix = ordinals[2];
  } else if (mod10 === 3 && mod100 !== 13) {
    suffix = ordinals[3];
  }
  return `${suffix}`;
};

export const getSumOfArrayObjectKey = (
  dataArray: any,
  key: any,
  decimalPlaces = 2
) => {
  if (!Array.isArray(dataArray)) {
    throw new Error('Input must be an array');
  }

  const sum = dataArray.reduce((total, item) => {
    key.forEach((key: any) => {
      const value = parseFloat(item[key]);
      total += isNaN(value) ? 0 : value;
    });
    return total;
  }, 0);

  return sum.toFixed(decimalPlaces);
};

export const generateRandomNumber = (digits: any) => {
  if (typeof digits === 'string') {
    digits = parseInt(digits, 10);
  }

  if (isNaN(digits) || digits <= 0) {
    throw new Error('Number of digits must be a positive integer');
  }

  const min = Math.pow(10, digits - 1);
  const max = Math.pow(10, digits) - 1;
  const number = Math.floor(min + Math.random() * (max - min + 1));
  return number.toString();
};

//Will return an empty charcter in UTF format, this was done in order to display those values which are falsy in review application
//becuase we have to add spacing across all the divs in order to maintain the spacing between divs
export const checkForFalsyValues = (value: any = '') => {
  const regex = /^\s*$/;
  if (
    value === '' ||
    value === null ||
    value === undefined ||
    value === 'Invalid date' ||
    regex.test(value)
  ) {
    return '\u00A0';
  } else {
    return value;
  }
};

export const convertNumberToWords = (digitToConvert: any) => {
  if (
    digitToConvert === null ||
    digitToConvert === undefined ||
    digitToConvert === ''
  ) {
    return;
  }
  let formattedNumber = Number(digitToConvert);
  let toWords: any = new ToWords();
  return toWords.convert(formattedNumber, {
    currency: true,
    ignoreZeroCurrency: true,
  });
};

export const handleGstinChange = (e: any) => {
  let inputValue = e.target.value.toUpperCase().replace(/[^0-9A-Z]/g, '');

  // Ensure input conforms to the GSTIN structure step by step
  let formattedValue = '';

  if (inputValue.length > 0) {
    formattedValue += inputValue.slice(0, 2).replace(/[^0-9]/g, ''); // First 2 digits
  }
  if (inputValue.length > 2) {
    formattedValue += inputValue.slice(2, 5).replace(/[^A-Z]/g, ''); // Next 3 alphabets
  }
  if (inputValue.length > 5) {
    formattedValue += inputValue.slice(5, 6).replace(/[^A-Z]/g, ''); // Next 1 from specific characters
  }
  if (inputValue.length > 6) {
    formattedValue += inputValue.slice(6, 7).replace(/[^A-Z]/g, ''); // Next 1 alphabet
  }
  if (inputValue.length > 7) {
    formattedValue += inputValue.slice(7, 11).replace(/[^0-9]/g, ''); // Next 4 digits
  }
  if (inputValue.length > 11) {
    formattedValue += inputValue.slice(11, 12).replace(/[^A-Z]/g, ''); // Next 1 alphabet
  }
  if (inputValue.length > 12) {
    formattedValue += inputValue.slice(12, 13).replace(/[^1-9A-Z]/g, ''); // Next 1 alphanumeric (excluding 0)
  }
  if (inputValue.length > 13) {
    formattedValue += inputValue.slice(13, 14).replace(/[^Z]/g, ''); // Next 1 'Z'
  }
  if (inputValue.length > 14) {
    formattedValue += inputValue.slice(14, 15).replace(/[^0-9A-Z]/g, ''); // Last 1 alphanumeric
  }

  // Ensure the formatted value is not longer than 15 characters
  if (formattedValue.length > 15) {
    formattedValue = formattedValue.slice(0, 15);
  }
  return formattedValue;
};

export const downloadFiles = async (
  urlName: string,
  documentFileName?: any
) => {
  if (urlName !== '') {
    const customHeaders: any = {
      headers: {
        key: getDataFromLocalStorage(LOCAL_STORAGE_DATA_KEYS.AUTH_KEY),
        'client-code': 'myhome',
      },
      responseType: 'blob',
    };
    let reqObj: any = {
      file_url: urlName,
    };
    const res = await axios.post(
      `${MODULES_API_MAP.AUTHENTICATION + GLOBAL_API_ROUTES.DOWNLOAD_DOCUMNETS}`,reqObj,
      {
        headers: customHeaders.headers,
        responseType: 'blob',
      }
    );
    if (res.data) {
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', documentFileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      ////console.log("file not found");
    }
  } else {
    ////console.log("file url provide");
  }
};

export const formatExactDateTime = (dateString: any) => {
  const date = new Date(dateString);
  const day = date.getUTCDate();
  const month = date.toLocaleString('en-GB', {month: 'short'});
  const year = date.getUTCFullYear();
  let hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();
  let amPm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // Handle midnight (0 hours)

  const formattedHours = hours < 10 ? `0${hours}` : hours;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

  return `${day} ${month} ${year} ${formattedHours}:${formattedMinutes} ${amPm}`;
};

export const last_modifiedformatExactDateTime = (dateString: any) => {
  const date = new Date(dateString);

  const options: any = {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  };

  let formattedDate = date.toLocaleString('en-GB', options).replace(',', '');
  formattedDate = formattedDate.replace(/am|pm/i, (match) =>
    match.toUpperCase()
  );

  return formattedDate?.replace(/^0+/, '');
};
export const formatExactDate = (dateString: any) => {
  const date = new Date(dateString);
  const day = date.getUTCDate();
  const month = date.toLocaleString('en-GB', {month: 'short'});
  const year = date.getUTCFullYear();
  let hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();
  let amPm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // Handle midnight (0 hours)

  // const formattedHours = hours < 10 ? `0${hours}` : hours;
  // const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

  return `${day} ${month} ${year} `;
};

export const convertToTBD = (value: any = '') => {
  const tbdValues = new Set(['', ' ', null, undefined, '0.00', '0', '0.0', 0]);
  return tbdValues.has(value) ? 'TBD' : value;
};

export const getDateFormateFromTo = (
  dateString: string,
  givenFormat: string = '',
  reqFormat: string = ''
) => {
  let result = '';
  let reqDateFormat = reqFormat ? reqFormat : 'DD/MM/YYYY';
  let givenDateFormat = givenFormat ? givenFormat : 'YYYY/MM/DD';
  if (dateString === 'currentdate') {
    result = moment(new Date()).format(reqDateFormat);
  } else if (
    dateString != null &&
    dateString !== '' &&
    dateString !== undefined
  ) {
    result = moment(dateString, givenDateFormat).format(reqDateFormat);
  }
  return result;
};

export const formatTimeDifference = (days: any) => {
  if (days >= 365) {
    const years = Math.floor(days / 365);
    const remainingDays = days % 365;
    const months = Math.floor(remainingDays / 30);
    const remainingDaysAfterMonths = remainingDays % 30;
    return `${years} year${years > 1 ? 's' : ''} ${
      months > 0 ? `, ${months} month${months > 1 ? 's' : ''}` : ''
    } ${
      remainingDaysAfterMonths > 0
        ? `and ${remainingDaysAfterMonths} day${
            remainingDaysAfterMonths > 1 ? 's' : ''
          }`
        : ''
    }`;
  } else if (days >= 30) {
    const months = Math.floor(days / 30);
    const remainingDays = days % 30;
    return `${months} month${months > 1 ? 's' : ''} ${
      remainingDays > 0
        ? `, ${remainingDays} day${remainingDays > 1 ? 's' : ''}`
        : ''
    }`;
  } else if (days >= 7) {
    const weeks = Math.floor(days / 7);
    const remainingDays = days % 7;
    return `${weeks} week${weeks > 1 ? 's' : ''} ${
      remainingDays > 0
        ? `, ${remainingDays} day${remainingDays > 1 ? 's' : ''}`
        : ''
    }`;
  } else {
    return `${days} day${days > 1 ? 's' : ''}`;
  }
};

// Used to get the name key's value from the project_config json, like Mr will become Mr. as it is mapped to Mr.
export const getTitleNameWithDots = (title: string) => {
  if (!title || !getConfigData || title === ' ') return '';
  const titleData = getConfigData('title_data');
  const titleNameWithDots = titleData?.find(
    (titleData: any) => titleData?.id === title
  );
  return titleNameWithDots?.name ?? ' ';
};

export const calculateAgeInYears = (dob: any) => {
  if (!dob) {
    return '';
  }
  const birthDate = moment(dob, 'YYYY-MM-DD');
  const now = moment();
  const years = now.diff(birthDate, 'years');
  birthDate.add(years, 'years');

  if (years > 0) {
    return `${years} year${years > 1 ? 's' : ''}`;
  }

  const months = now.diff(birthDate, 'months');
  birthDate.add(months, 'months');

  if (months > 0) {
    return `${months} month${months > 1 ? 's' : ''}`;
  }

  const days = now.diff(birthDate, 'days');
  return `${days} day${days > 1 ? 's' : ''}`;
};

export const capitalizeFirstLetter = (sentence: any) => {
  if (!sentence || typeof sentence !== 'string') {
    return sentence;
  }
  return sentence.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
};

export const getInitialLetter = (name = '') => {
  const trimmedName = name?.trim();
  return trimmedName
    ? trimmedName
        .split(' ')
        .map((word, index, arr) =>
          arr.length === 1
            ? word.slice(0, 2).toUpperCase()
            : word[0].toUpperCase()
        )
        .join('')
    : '';
};

export const isWindowsOrMac = (): 'Windows' | 'Mac' | null => {
  const userAgent = navigator.userAgent;

  if (/Windows/.test(userAgent)) {
    return 'Windows';
  }

  if (/Macintosh/.test(userAgent)) {
    return 'Mac';
  }

  return null; // If neither Windows nor Mac
};

export const spaceAfterComma = (carParkingSlots: any) => {
  if (
    carParkingSlots === '' ||
    carParkingSlots === null ||
    carParkingSlots === undefined
  ) {
    return;
  }
  const outputString = carParkingSlots?.replace(/,/g, ', ');
  return outputString;
};

export const ENUMValues = async (tableName: any) => {
  const {
    data,
    status: responseStatus,
    message,
  }: any = await Api.get('get_enum_values', {enum_table_name: tableName});
  if (responseStatus) {
    return data;
  } else {
    return [];
  }
};

export const compareObjects = (oldObj: any, newObj: any) => {
  const changes: any = {};

  const compare = (oldValue: any, newValue: any, path: string[] = []) => {
    if (oldValue === newValue) return;

    if (
      typeof oldValue !== typeof newValue ||
      Array.isArray(oldValue) !== Array.isArray(newValue)
    ) {
      addChange(path, oldValue, newValue);
      return;
    }

    if (Array.isArray(oldValue) && Array.isArray(newValue)) {
      if (oldValue.length !== newValue.length) {
        addChange(path, oldValue, newValue);
        return;
      }
      for (let i = 0; i < oldValue.length; i++) {
        compare(oldValue[i], newValue[i], [...path, i.toString()]);
      }
      return;
    }

    if (
      typeof oldValue === 'object' &&
      oldValue !== null &&
      newValue !== null
    ) {
      Object.keys({...oldValue, ...newValue}).forEach((key) => {
        compare(oldValue[key], newValue[key], [...path, key]);
      });
      return;
    }

    addChange(path, oldValue, newValue);
  };

  const addChange = (path: string[], oldValue: any, newValue: any) => {
    const key = path[0];
    if (!changes[key]) {
      changes[key] = {};
    }
    if (path.length > 1) {
      changes[key][path.slice(1).join('.')] = {
        from: oldValue,
        to: newValue,
      };
    } else {
      changes[key] = {
        from: oldValue,
        to: newValue,
      };
    }
  };

  compare(oldObj, newObj);

  // Remove keys with no changes
  Object.keys(changes).forEach(key => {
    if (Object.keys(changes[key]).length === 0) {
      delete changes[key];
    }
  });

  return changes;
};

export const copyToClipboard = async (textToCopy: string = '') => {
  try {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(textToCopy);
    } else {
      const textArea = document.createElement("textarea");
      textArea.value = textToCopy;
      textArea.style.position = "absolute";
      textArea.style.left = "-999999px";
      document.body.prepend(textArea);
      textArea.select();
      document.execCommand('copy');
      textArea.remove();
    }
    toast.success('Text Copied');
  } catch (error) {
    toast.error('Unable to copy text to clipboard');
  }
};
