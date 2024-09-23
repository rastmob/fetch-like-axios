
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
  Authorization: 'Bearer $token',
});
```

### Sending a GET request:

```javascript
apiClient.get('/users')
  .then(data => {
    console.log('Fetched data:', data);
  })
  .catch(err => {
    console.error('Error:', err.message);
  });
```

### Sending a POST request:

```javascript
apiClient.post('/users', { name: 'Alp', age: 33 })
  .then(data => {
    console.log('User created:', data);
  })
  .catch(err => {
    console.error('Error:', err.message);
  });
```

### Sending a PUT request:

```javascript
apiClient.put('/users/1', { name: 'Rast Mobile', age: 33 })
  .then(data => {
    console.log('User updated:', data);
  })
  .catch(err => {
    console.error('Error:', err.message);
  });
```

### Sending a DELETE request:

```javascript
apiClient.delete('/users/1')
  .then(data => {
    console.log('User deleted:', data);
  })
  .catch(err => {
    console.error('Error:', err.message);
  });
```

## License

MIT License
