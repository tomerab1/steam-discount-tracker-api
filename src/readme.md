### Real-Time Discount Notification System (API)

This API, crafted with NestJS, provides real-time notifications on Steam game discounts. Users can register, select from the entire Steam game lineup, and receive immediate discount alerts via email or SMS.

#### Features:

- **User Registration**: Sign up and manage profiles.
- **Game Selection**: Access all games on the Steam store.
- **Real-time Notifications**: Get instant discount alerts through email or SMS.
- **Integration with Steam API**: Seamless game data retrieval.
- **Advanced Search**: Elasticsearch-backed game search, ensuring accurate results mirroring the Steam store.
- **Scalability**: Designed for high performance and scalability.

#### Technologies Used:

- **Backend**: NestJS
- **Database**: PostgreSQL (user persistence), Elasticsearch (game storage and search)
- **Caching**: Redis (for current discounts)
- **Email Notifications**: Nodemailer
- **SMS Notifications**: Twilio

#### Setup:

1. **Prerequisites**:

   - Node.js and npm
   - Elasticsearch
   - Redis
   - Docker (optional)

2. **Installation**:

```bash
git clone <repository-url>
cd <repository-directory>
npm install
```

3. **Environment Configuration**: Ensure the necessary environment variables or configuration files are set up.

4. **Running**:

```bash
npm run start
```

For further details and nuanced configurations, delve into the codebase and associated documentation.
