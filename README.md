
# fetch-axios-wrapper

A lightweight Axios-like wrapper for the native `fetch` API, tailored for Next.js and other JavaScript projects.

## Installation

To install the package, run:

```bash
npm install fetch-axios-wrapper
```

## Usage

### Import the library:

```javascript
const ApiClient = require('fetch-axios-wrapper');
```

### Create an instance:

```javascript
const apiClient = new ApiClient('https://api.example.com');
```

### Set headers:

You can set default headers for all your requests, like authorization tokens:

```javascript
apiClient.setHeaders({
  Authorization: 'Bearer my-token',
});
```

### Sending a GET request with query parameters:

```javascript
apiClient.get('/users', {
  params: { name: 'Alp', age: 33 }
})
  .then(data => {
    console.log('Fetched data:', data);
  })
  .catch(err => {
    console.error('Error:', err.message);
  });
```

### Canceling a Request:

You can cancel any ongoing request using the `cancelRequest` method:

```javascript
// Send a GET request with a cancelKey
apiClient.get('/users', { cancelKey: 'getUsersRequest' })
  .then(data => {
    console.log('Fetched data:', data);
  })
  .catch(err => {
    console.error('Error:', err.message);
  });

// Cancel the request using the cancelKey
apiClient.cancelRequest('getUsersRequest');
```

### Using Other HTTP Methods:

You can use other HTTP methods like `PATCH`, `HEAD`, and `OPTIONS`:

#### PATCH:

```javascript
apiClient.patch('/users/1', { name: 'Updated Name' })
  .then(data => {
    console.log('User updated:', data);
  })
  .catch(err => {
    console.error('Error:', err.message);
  });
```

#### HEAD:

```javascript
apiClient.head('/users/1')
  .then(headers => {
    console.log('Fetched headers:', headers);
  })
  .catch(err => {
    console.error('Error:', err.message);
  });
```

#### OPTIONS:

```javascript
apiClient.options('/users')
  .then(data => {
    console.log('Allowed methods:', data);
  })
  .catch(err => {
    console.error('Error:', err.message);
  });
```

### Form-Data and File Upload:

You can upload files and other form data using the `FormData` API:

```javascript
const formData = new FormData();
formData.append('name', 'Alp');
formData.append('file', fileInput.files[0]);

apiClient.post('/upload', formData)
  .then(data => {
    console.log('Upload successful:', data);
  })
  .catch(err => {
    console.error('Error:', err.message);
  });
```

### Timeout Handling:

You can specify how long to wait for the request to complete before it’s aborted:

```javascript
apiClient.get('/users', { timeout: 3000 }) // 3 seconds timeout
  .then(data => {
    console.log('Fetched data:', data);
  })
  .catch(err => {
    console.error('Error:', err.message);
  });
```

### Retry Mechanism:

Retries the request a specified number of times if it fails:

```javascript
apiClient.get('/users', { retries: 3 }) // Retry 3 times
  .then(data => {
    console.log('Fetched data:', data);
  })
  .catch(err => {
    console.error('Error:', err.message);
  });
```

### Error Handling:

You can set a global error handler to handle errors in a custom way:

```javascript
apiClient.setErrorHandler((error) => {
  console.error('Global error handler:', error.message);
});

apiClient.get('/users')
  .catch(err => {
    console.error('Caught error:', err.message);
  });
```

## License

MIT License
