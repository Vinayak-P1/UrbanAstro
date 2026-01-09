export const isEmail = (email) => /\S+@\S+\.\S+/.test(email || '');
export const isPhone = (p) => /^\+?[0-9]{7,14}$/.test(p || '');

