# Welcome to the YachtMe Wiki!

## **Overview**
This web application is built using Express and Render. It provides a platform for users to perform full CRUD (Create, Read, Update, Delete) operations on yachts and bookings. Users can post a yacht, charter, get a list of yachts by city, sort them, book them, and see their location on Google Maps. Additionally, users can manually set the booking status of a yacht.

## **Features**

### Full CRUD Operations on Yachts
- **Create:** Users can add new yachts to the platform.
- **Read:** Users can view details of individual yachts and get a list of yachts by city.
- **Update:** Users can update the details of existing yachts.
- **Delete:** Users can remove yachts from the platform.

### Full CRUD Operations on Bookings
- **Create:** Users can book yachts for specified dates.
- **Read:** Users can view booking details.
- **Update:** Users can modify existing bookings.
- **Delete:** Users can cancel bookings.

### Post a Yacht
Users can post information about new yachts available for charter.

### Charter a Yacht
Users can charter a yacht for a specified period.

### Get List of Yachts by City
Users can retrieve a list of yachts available in a specific city.

### Sort Yachts
Users can sort yachts based on various criteria (e.g., price, size, availability).

### Book a Yacht
Users can book yachts for specified dates.

### View Location on Google Maps
Users can view the location of yachts on Google Maps for better navigation and planning.

### Manual Booking Status Update
Users can manually set the booking status of a yacht to indicate whether it is booked or available.

## **Installation**

### Clone the Repository
using HTTPS:

```bash
git clone https://github.com/OlehParis/YachtMe.git
```

## Install Dependencies

```bash
cd backend && npm i && cd .. 
```

```bash
cd frontend && npm i && cd ..
```
## Set Up Environment Variables
Create a .env file in the root directory and add the following variables:

```bash
PORT=your_port_number
DATABASE_URL=your_database_url
API_KEY=your_google_maps_api_key
DB_FILE=db/dev.db
JWT_SECRET=your_jwt_secret
SCHEMA=your_db_schema
```
## Run the Application
from the root directory 

```bash
cd backend && npm start && cd ../frontend && npm run dev
```

## Database 
to reset database run script:
```bash
npm run dbReset
```
