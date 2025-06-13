// Hàm tạo telegramId ngẫu nhiên
export const generateTelegramId = () => {
  // Tạo số ngẫu nhiên 9 chữ số
  const randomNum = Math.floor(Math.random() * 900000000) + 100000000;
  return randomNum.toString();
}; 