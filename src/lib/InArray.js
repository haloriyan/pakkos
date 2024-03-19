const InArray = (needle, haystack, isObject = false) => {
    if (isObject) {
        let key = Object.keys(needle)[0];
        for (let i = 0; i < haystack.length; i++) {
            if (haystack[i].hasOwnProperty(key) && haystack[i][key] === needle[key]) {
                return true;
            }
        }
        return false;
    } else {
        for (let i = 0; i < haystack.length; i++) {
            if (haystack[i] === needle) return true;
        }
        return false
    }
}

export default InArray;