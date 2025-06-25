# Image Search Abstraction Layer API

This project is an Image Search Abstraction Layer API built as a solution for the freeCodeCamp "Image Search Abstraction Layer" challenge. It provides endpoints to search for images using an external API (Pixabay) and to view a history of recent search queries.

## Features (User Stories Implemented)

*   **Image Search:** You can get image URLs, descriptions (tags), and page URLs for a set of images relating to a given search string.
    *   Example: `/query/funny%20cats`
*   **Pagination:** You can paginate through the image search responses by adding a `?page=<number>` parameter to the URL.
    *   Example: `/query/funny%20cats?page=2`
*   **Recent Searches:** You can get a list of the most recently submitted search strings (up to 10).
    *   Example: `/recent/`

## Technologies Used

*   **Backend:** Node.js, Express.js
*   **Database:** MongoDB with Mongoose (for storing recent search terms)
*   **External Image API:** [Pixabay API](https://pixabay.com/api/docs/)
*   **HTTP Client:** Axios (for making requests to the Pixabay API)
*   **Environment Variables:** `dotenv` package
*   **CORS:** `cors` package for enabling cross-origin requests

## Prerequisites

Before you begin, ensure you have met the following requirements:
*   You have [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) (or [Yarn](https://yarnpkg.com/)) installed.
*   You have a [MongoDB](https://www.mongodb.com/) instance running (either locally or a cloud-hosted one like MongoDB Atlas).
*   You have a **Pixabay API Key**. You can get a free key from [Pixabay API Documentation](https://pixabay.com/api/docs/).

## Setup and Installation

1.  **Clone the repository (if you have one):**
    ```bash
    git clone <your-repository-url>
    cd image-search-abstraction-layer
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```
    (or `yarn install`)

3.  **Create Environment Variables File:**
    Create a `.env` file in the root of your project and add the following variables, replacing the placeholder values with your actual credentials:
    ```env
    PORT=3000
    MONGODB_URI=your_mongodb_connection_string
    PIXABAY_API_KEY=your_pixabay_api_key
    ```
    *   `PORT`: The port your server will run on (defaults to 3000 if not set).
    *   `MONGODB_URI`: Your MongoDB connection string.
        *   For local MongoDB: `mongodb://localhost:27017/image_search_db` (replace `image_search_db` with your desired database name).
        *   For MongoDB Atlas: Copy the SRV connection string provided by Atlas, ensuring you replace `<username>`, `<password>`, and your database name. **Remember to percent-encode any special characters in your username or password.**
    *   `PIXABAY_API_KEY`: Your API key obtained from Pixabay.

    **Important:** Do **not** commit your `.env` file to version control. Add `.env` to your `.gitignore` file.

## Running the Application Locally

1.  Start the MongoDB server if it's not already running.
2.  Start the Node.js/Express server:
    ```bash
    npm start
    ```
    (This assumes you have a `start` script in your `package.json` like `"start": "node server.js"`. If not, use `node server.js` directly.)

The server should now be running, typically on `http://localhost:3000`.

## API Endpoints

### 1. Image Search

*   **Endpoint:** `GET /query/:searchString`
*   **Description:** Retrieves images related to the `:searchString`.
*   **Query Parameters:**
    *   `page` (optional): An integer specifying the page number for pagination. Defaults to `1`.
*   **Example Usage:**
    *   `GET /query/nature` (gets the first page of results for "nature")
    *   `GET /query/funny%20dogs?page=3` (gets the third page of results for "funny dogs")
*   **Success Response (200 OK):**
    An array of image objects. Each object has the following structure:
    ```json
    [
      {
        "url": "https://pixabay.com/get/sample_image.jpg",
        "description": "tag1, tag2, another tag",
        "pageURL": "https://pixabay.com/photos/photo-page-url-12345/"
      },
      // ... more image objects
    ]
    ```
*   **Error Responses:**
    *   `400 Bad Request`: If `searchString` is missing.
    *   `500 Internal Server Error` / `503 Service Unavailable`: If there's an issue with the Pixabay API or server configuration.

### 2. Recent Searches

*   **Endpoint:** `GET /recent/`
*   **Description:** Retrieves a list of the 10 most recently submitted search terms.
*   **Example Usage:**
    *   `GET /recent/`
*   **Success Response (200 OK):**
    An array of search term objects. Each object has the following structure:
    ```json
    [
      {
        "term": "funny cats",
        "when": "2023-10-27T10:30:00.000Z"
      },
      {
        "term": "landscapes",
        "when": "2023-10-27T10:25:15.000Z"
      }
      // ... up to 10 recent search objects
    ]
    ```
*   **Error Responses:**
    *   `500 Internal Server Error`: If there's an issue retrieving data from the database.

### 3. Root Endpoint

*   **Endpoint:** `GET /`
*   **Description:** Provides a simple HTML page with usage instructions and example links.

## Deployment

This application can be deployed to various cloud platforms that support Node.js (e.g., Heroku, Vercel, Render, Glitch).
When deploying:
*   Ensure your Node.js version is compatible with the platform.
*   Set the **environment variables** (`MONGODB_URI`, `PIXABAY_API_KEY`, `PORT`) in your hosting platform's settings dashboard.
*   If using MongoDB Atlas, ensure your deployed server's IP address (or `0.0.0.0/0` to allow all) is added to the IP Access List in Atlas.

---

This README provides a good starting point. You can customize it further by adding sections like "Project Structure," "Contributing," or "License" if needed.