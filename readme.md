# URL Shortener API 🚀

Welcome to the **URL Shortener API**, a powerful and simple tool to shorten URLs, track analytics, and manage your links efficiently. This project provides a suite of features, including user authentication, URL analytics, and caching for enhanced performance.

## 🌟 Features

- **URL Shortening**: Convert long URLs into short and easy-to-share links.
- **Analytics**: Track clicks, unique users, and device information.
- **Topic-Based Management**: Group and analyze URLs by topic.
- **Authentication**: Secure user authentication via Google OAuth.

---

## 🛠️ Prerequisites

1. Node.js and npm installed on your machine.
2. MongoDB and Redis servers running locally or accessible remotely.
3. A `.env` file with the following variables:


---

## 🚀 How to Use the API

### Authentication Endpoints

1. **Google OAuth Authentication**
- **GET** `/api/auth/google`  
  Redirects the user to Google for authentication.
- **GET** `/api/auth/google/callback`  
  Handles the callback from Google and creates a user session.

2. **Protected Route**
- **GET** `/api/auth/protected`  
  Access protected resources after logging in. Requires a valid token.

3. **Logout**
- **POST** `/api/auth/logout`  
  Logs out the authenticated user.

---

### URL Shortening Endpoints

1. **Shorten a URL**
- **POST** `/api/shorten`  
  Shortens a long URL. Requires a valid token.  
  **Body Parameters:**
  ```json
  {
    "longUrl": "https://example.com",
    "customAlias": "my-alias", // optional
    "topic": "my-topic" // optional
  }
  ```
  **Response:**
  ```json
  {
    "shortUrl": "http://your-domain.com/shortUrl",
    "createdAt": "2024-12-26T10:20:30Z"
  }
  ```

2. **Redirect to Long URL**
- **GET** `/api/shorten/:alias`  
  Redirects the user to the original long URL.

---

### Analytics Endpoints

1. **Get URL Analytics**
- **GET** `/api/analytics/:alias`  
  Provides analytics for a specific short URL. Requires a valid token.  
  **Response:**
  ```json
  {
    "totalClicks": 120,
    "uniqueClicks": 80,
    "clicksByDate": [{ "date": "2024-12-20", "count": 20 }],
    "osType": [{ "osName": "Windows", "uniqueClicks": 50, "uniqueUsers": 30 }],
    "deviceType": [{ "deviceName": "Mobile", "uniqueClicks": 70, "uniqueUsers": 40 }]
  }
  ```

2. **Get Topic-Based Analytics**
- **GET** `/api/analytics/topic/:topic`  
  Retrieves analytics for all URLs under a specific topic. Requires a valid token.  
  **Response:**
  ```json
  {
    "totalClicks": 300,
    "uniqueClicks": 200,
    "clicksByDate": [{ "date": "2024-12-20", "count": 50 }],
    "urls": [
      { "shortUrl": "http://short.ly/xyz", "totalClicks": 100, "uniqueClicks": 60 }
    ]
  }
  ```

3. **Get Overall Analytics**
- **GET** `/api/overall`  
  Provides a summary of analytics for all URLs created by the authenticated user.  
  **Response:**
  ```json
  {
    "totalUrls": 10,
    "totalClicks": 1000,
    "uniqueClicks": 600,
    "clicksByDate": [{ "date": "2024-12-20", "count": 150 }],
    "osType": [{ "osName": "Windows", "uniqueClicks": 400, "uniqueUsers": 250 }],
    "deviceType": [{ "deviceName": "Desktop", "uniqueClicks": 500, "uniqueUsers": 300 }]
  }
  ```

---

## 🛡️ Middleware

- **Authentication**: Verifies user tokens to ensure secure access.
- **Rate Limiting**: Prevents abuse of the shortening API with a limiter on the `/shorten` endpoint.

---

## 🚀 Getting Started

1. Clone the repository:
```bash
git clone https://github.com/your-repo/url-shortener.git
cd url-shortener

---

## Deployment Link

https://url-shortener-tc79.onrender.com

## Author

Ankit Kumar

## Email

ankitchauhandhoni@gmail.com