#📦 Smart Dar - Backend
Smart Dar is a backend system for a smart real estate platform designed to manage property rentals and sales efficiently. This project was developed using Node.js and Express.js, with MongoDB as the primary database.

#🧰 Technologies Used
Node.js

Express.js

MongoDB + Mongoose

dotenv

Cloudinary API (for image uploads)

RESTful API architecture

#📁 Project Structure
.
├── DB/
│   └── connection.js         # Database connection
├── src/
│   ├── Middlewares/          # Global middleware handlers
│   ├── Modules/              # API route modules
│   └── ...                   # Other related logic
├── .env                      # Environment variables
├── .gitignore
├── index.js                  # App entry point

Install dependencies

npm install

#Configure environment variables

Create a .env file in the root directory and add the following (replace with your own values):

PORT=3000
MONGO_URI=your_mongo_connection
CLOUD_NAME=your_cloudinary_name
API_KEY=your_cloudinary_key
API_SECRET=your_cloudinary_secret
UPLOADS_FOLDER=Uploads_gradution_project
SALT_ROUNDS=12
LOGIN_SECRET=signIn$@11
PREFIX_SECRET=ahmedEhab
Run the server

npm run start:dev

#📌 Available Routes
The following base routes are available:

/users

/categories

/sub-categories

/properties

/cart

#🧪 Testing
Use tools like Postman to test and document your APIs.

#📄 License
This project is for educational purposes only as part of a graduation project.
