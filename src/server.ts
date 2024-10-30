import dotenv from 'dotenv';
dotenv.config();

import App from './app';

const PORT = process.env.PORT || 3000;
const appInstance = new App();

appInstance.app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
