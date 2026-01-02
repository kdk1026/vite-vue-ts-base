import VueCookies from 'vue-cookies';

const $cookies = (VueCookies as any);

export interface CookieOptions {
    path?: string;
    expires?: string | number | Date;
    maxAge?: number;
    domain?: string;
    secure?: boolean;
    httpOnly?: boolean;
    sameSite?: boolean | 'lax' | 'strict' | 'none';
}

/**
 * @example
 * const { setCookie, getCookie, removeCookie } = useCookies();
 * 
 * @returns 
 */
export const useCookies = () => {
    /**
     * 일반 쿠키 생성
     * @param {string} name 
     * @param {string} value 
     * @param {boolean} isLocal 
     * @param {CookieOptions} options 
     * @returns 
     */
    const setCookie = <T>(name: string, value: T, isLocal: boolean, options: CookieOptions) => {
        const shouldUseSecure = !isLocal;

        const updatedOptions = {
            ...options,
            secure: shouldUseSecure ? true : options.secure
        };

        return $cookies.set(
            name,
            value,
            updatedOptions.expires,
            updatedOptions.path,
            updatedOptions.domain,
            updatedOptions.secure,
            updatedOptions.sameSite
        );
    };

    /**
     * 쿠키 값 가져오기
     * @param {string} name 
     */
    const getCookie = (name: string) => {
        return $cookies.get(name);
    };

    /**
     * 쿠키 삭제
     * @param {string} name 
     * @param {boolean} isLocal 
     * @param {object} options 
     * @returns 
     */
    const removeCookie = (name: string, isLocal: boolean, options: CookieOptions) => {
        const shouldUseSecure = !isLocal;
        const updatedOptions = { 
            ...options, 
            ...(shouldUseSecure && { secure: true }) 
        };

        return $cookies.remove(
            name, 
            updatedOptions.path,
            updatedOptions.domain,
            updatedOptions.secure,
            updatedOptions.sameSite
        );
    };

    /**
     * Array 쿠키 생성
     * @param {string} name 
     * @param {Array} array 
     * @param {boolean} isLocal 
     * @param {object} options 
     */
    const setArrayInCookie = <T>(name: string, array: T[], isLocal: boolean, options: CookieOptions) => {
        if ( array && Array.isArray(array) && array.length > 0 ) {
            //JSON.stringify(array) 자동으로 해줌
            setCookie(name, array, isLocal, options);
        }
    };

    /**
     * Object 쿠키 생성
     * @param {string} name 
     * @param {object} object 
     * @param {boolean} isLocal 
     * @param {object} options 
     */
    const setObjectInCookie = <T extends object>(name: string, object: T, isLocal: boolean, options: CookieOptions) => {
        if ( object && !Array.isArray(object) && Object.keys(object).length > 0 ) {
            //JSON.stringify(object) 자동으로 해줌
            setCookie(name, object, isLocal, options);
        }
    };

    return {
        setCookie,
        getCookie,
        removeCookie,
        setArrayInCookie,
        setObjectInCookie
    }
};