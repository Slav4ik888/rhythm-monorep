import app from './app';

app.listen(process.env.PORT || 7575, () => console.log(`Listening on port ${process.env.PORT || 7575}!`))

// cd ../rhythm-server && npm run dev
// git add . && git commit -m "updated 1.53.0" && git push -u origin main
// service rhythm-server restart updated version to 1.51.0

// 200 OK
// This response code indicates that the request was successful.

// 201 Created
// This indicates the request was successful and a resource was created. It is used to confirm success of a PUT or POST request.

// 400 Bad Request
// The request was malformed. This happens especially with POST and PUT requests, when the data does not pass validation, or is in the wrong format.

// 401 Unauthorized
// This error indicates that you need to perform authentication before accessing the resource.

// 403 Forbidden — сервер понял запрос, но он отказывается его выполнять из-за ограничений в доступе для клиента к указанному ресурсу.

// 404 Not Found
// This response indicates that the required resource could not be found. This is generally returned to all requests which point to a URL with no corresponding resource.

// 405 Method Not Allowed
// The HTTP method used is not supported for this resource.

// 409 Conflict
// This indicates a conflict. For instance, you are using a PUT request to create the same resource twice.

// 500 Internal Server Error
