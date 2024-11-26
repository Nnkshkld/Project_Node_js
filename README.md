
# **How to run:**
1. #### Change .env.ex -> .env
2. #### Fill in the **.env** file with the necessary information
3. #### Run code:
```
    npm start
```

# Project Description:
Project imitating a trading platform. This project involves such libraries as : 
- "bcrypt": "^5.1.1",
- "express": "^4.21.1",
- "jsonwebtoken": "^9.0.2",
- "mongoose": "^8.7.3"

**"bcrypt"** is used to encrypt user data and is used in paths: `/signup`, `/login`

**"jsonwebtoken"** is used to authorise the user.

**"mongoose"**  is used for database interactions MongoDB.

# How to use
### Request paths and request bodies

 1. `/users/signup`
Purpose: Registers a new user.
 ```
{
    "firstName": "name", 
    "lastName": "lastname", 
    "age": 21, 
    "email": "exemail@gmail.com", 
    "password": "password"
}
```
 2. `/users/login`
Purpose: Authenticates an existing user and provides an access token.
```
{
    "email": "exemail@gmail.com", 
    "password": "password"
}
```
3. `/items/create-item`
Purpose: Allows an authorized user to create a new item.
```
{
    "owner": req.user._id, //Taken from the authorization header
    "name": "name", 
    "description": "description",
    "price": 21
}
```
4. `/items/edit-item`
Purpose: Enables an authorized user to update an item's details.
```
{
    "owner": req.user._id, //Taken from the authorization header
    "name": "name", 
    "description": "description",
    "status": "AVAILABLE",
    "price": 21
}
```

5. `/items/delete-item`
Purpose: Deletes a specified item belonging to the authorized user.
```
{
    "owner": req.user._id, //Taken from the authorization header
    "itemId": "ObjectId"
}
```
6. `items/find-by-id/:itemId`
Purpose: Retrieves details of a specific item by its ID.
```
request body is null
```

7. `items/get-all-items`
Purpose: Fetches all available items from the database.
```
request body is null
```
8. `/orders/create`
Purpose: Allows an authorized user to place an order by specifying the items, their quantities, and the total price.
```
{
    "userId": req.user._id, //Taken from the authorization header
    "items": [{
        "itemId": "ObjectId",
        "quantity": 3
    }],
    "totalPrice": 222,
    "amount": 222
}
```

9. `/orders/add-item`
Purpose: Enables an authorized user to add an item to an existing order by specifying the item ID and quantity.
```
{
    "userId": req.user._id, //Taken from the authorization header
    "itemId": "ObjectId",
    "quantity": 3
}
```

10. `/orders/edit-order`
Purpose: Allows an authorized user to modify an existing order by updating the quantities or replacing the list of items.
```
{
    "userId": req.user._id, //Taken from the authorization header
    "id": "ObjectId",
    "quantity": 3,
    "items": [
        {
            "itemId": "ObjectId",
            "quantity": 3
        }
    ]
}
```

11. `/orders/cancel-order`
Purpose: Enables an authorized user to cancel an existing order, removing it from active processing.
```
{
    "userId": req.user._id, //Taken from the authorization header
    "id": "ObjectId"
}
```

12. `/orders/find-order/:id`
Purpose: Retrieves the details of a specific order by its unique ID.
```
request body is null
```

13. `/orders/get-all-orders`
Purpose: Fetches a list of all orders in the system, accessible to authorized users with sufficient privileges.

```
request body is null
```

14. `/orders/get-all-user-orders/:userId`
Purpose: Retrieves all orders associated with a specific user, identified by their user ID.
```
request body is null
```

# Features

Summarize the main features of the platform:

* User registration and login with encrypted passwords
* Secure authentication using JWT
* CRUD operations for items
* Order management, including creation, modification, and cancellation
* User-specific and system-wide data retrieval
* Scalable and modular architecture
