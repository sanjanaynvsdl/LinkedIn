# LinkedIn 

This LinkedIn Clone application is designed to mimic the core functionalities of the popular professional networking platform. It allows users to create profiles, connect with others, and engage in discussions. The application aims to provide a seamless user experience similar to that of LinkedIn.


## Features
- **User Authentication:** Users can create accounts, log in, and log out.                   
- **Profile Creation:** Users can create a profile with basic information, such as name, email, and profile picture. 
- **Commenting on Posts:** Users can leave comments on other users' posts.                             
- **Like and Unlike:** Users can like and unlike posts.                
- **Notification System:** Users can see notifications about comments, likes, and follows.
- **Connection Requests:** Users can send and accept connection requests.

  
## Code Structure
The project is organized into several key directories and files:
- `backend/`: Contains all the source code for the application.
  - `controllers/`: Logic for handling requests and responses.
  - `models/`: Database models representing the application's data structure.
  - `routes/`: API endpoint definitions.
  - `middlewares/`: Custom middleware functions for request handling.
  - `config/`: Configuration files, including database and environment settings.
- `frontend/`: Frontend code for the user interface, built using modern JavaScript frameworks.
- `.env`: Environment variables for configuration settings (not included for security reasons).
  



## Installation and Environment Variables Setup
To set up the application, follow these steps:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/sanjanaynvsdl/LinkedIn.git
   cd LinkedInClone
   ```
   
2. **Install the dependencies:**
   ```bash
   npm install
   ```
   ```bash
   cd frontend
   npm install
   ```
3. **Create a `.env` file:**
   Create a `.env` file in the root directory of the project. It should contain the following environment variables:
   
   ```bash
    MONGO_UR I= <your_mongo_uri>
   
    JWT_SECRET = <your_jwt_secret>
   
    NODE_ENV = production
   
    MAILTRAP_TOKEN = <your_mailtrap_token>
   
    EMAIL_FROM = <your_email_from>
   
    EMAIL_FROM_NAME = <your_email_from_name>
   
    CLIENT_URL = <your_client_url>
   
    CLOUDINARY_CLOUD_NAME = <your_cloudinary_cloud_name>
   
    CLOUDINARY_API_KEY = <your_cloudinary_api_key>
   
    CLOUDINARY_API_SECRET = <your_cloudinary_api_secret>
   ```
4. **Start the application:**
   ```bash
   npm start
   ```

5. **Access the application:**  
   Open your web browser and navigate to the application's URL.  
   For example, if your application is running on `http://localhost:5000`, open `http://localhost:5000` in your browser to view the application.    
