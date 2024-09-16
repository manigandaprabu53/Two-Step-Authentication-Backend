const validateEmail = (email)=>{
    let regex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/
    return regex.test(email)
}

const validatePassword = (pwd)=>{
    let regex = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/
    return regex.test(pwd);
}

const validateUrl = (url)=>{
    let regex = /^(?:(?:https?|ftp):\/\/)?(?:www\.)?[a-z0-9-]+(?:\.[a-z0-9-]+)+[^\s]*$/i
    return regex.test(url);
}

export default{
    validateEmail,
    validatePassword,
    validateUrl
}