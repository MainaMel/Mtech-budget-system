const { sql, pool } = require("../../config");


exports.deleteUser = async (req, res) => {
    try {
        const userId = req.params.id; // Assuming the user ID is passed as a parameter

        // Check if userId is provided
        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        // Delete the user from the database
        const query = `DELETE FROM users WHERE userId = @userId`;
        const result = await pool
            .request()
            .input('userId', sql.NVarChar, userId)
            .query(query);

        // Check if the user was found and deleted
        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({
            message: 'Internal Error',
            error: error.message,
        });
    }
};


exports.validationOnUpdate = async (req, res, next) => {
    
    const {username, password, firstname, lastname, roleId, email, phone, image} = req.body
    
    const required = !username
                     ?'username'
                           :!password
                           ?'password'
                                   :!firstname
                                   ?'first Name'
                                           :!lastname
                                           ?'last Name'
                                                   : !Number(roleId)
                                                   ?'roleId'
                                                       :!email
                                                       ?'email'
                                                           :!phone
                                                           ?'phone'
                                                               :!image
                                                               ?'image'
                                                                   :false;
   try {
           if (required) throw new Error(`${required} is Required!!`);
   
           const query = `select * from Users where username = '${username}' and password = ${password}`;
   
           const result = await pool.request().query(query);
   
           if (result.recordset.length > 0) throw new Error(`Username <${username}> is already in use.`);
   
           next();
       } catch (error) {
           res.status(500).json({
               message: "Internal Error",
               error: error.message
           });
       }
   ;
}


            



exports.updateUser = async (req, res) => {
    try {
        const userId = req.params.id; // Assuming the user ID is passed in the request parameters
        const { username, password, firstname, lastname, roleId, email, phone, image } = req.body;

        if (username === '') {
            throw new Error('Username is Required');
        }

        // Update the user in the database
        const query = `UPDATE users SET 
                username = @username,
                password = @password,
                firstname = @firstname,
                lastname = @lastname,
                roleId = @roleId,
                email = @email,
                phone = @phone,
                image = @image,
                dateModified = @dateModified
                WHERE userId = @userId`;

        const result = await pool
            .request()
            .input('userId', sql.NVarChar, userId)
            .input('username', sql.NVarChar, username)
            .input('password', sql.NVarChar, password)
            .input('firstname', sql.NVarChar, firstname)
            .input('lastname', sql.NVarChar, lastname)
            .input('roleId', sql.Int, roleId)
            .input('email', sql.NVarChar, email)
            .input('phone', sql.NVarChar, phone)
            .input('image', sql.NVarChar, image)
            .input('dateModified', sql.DateTime, new Date())
            .query(query);

        // Check if the update was successful
        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ message: 'User updated successfully' });
    } catch (error) {
        res.status(500).json({
            message: 'Internal Error',
            error: error.message,
        });
    }
};

exports.validationOnUsers = async (req, res, next) => {
    const { username, password, firstname, lastname, roleId, email, phone, image } = req.body;

  
    //if required returns false
    //if username does not have a value, required will take the value of username
    // if(username=="") required = 'Username'
    // else required = false

    // if(required) throw new Error(`${required} is required`)

    const required = !username
        ? 'username'
        : !password
            ? 'password'
            : !firstname
                ? 'First Name'
                : !lastname
                    ? 'lastname'
                    : !Number(roleId)
                        ? 'Role'
                        : !email
                            ? 'email'
                            : !phone
                                ? 'phone'
                                : !image
                                    ? 'image'
                                    : false;

    try {
        if (required) throw new Error(`${required} is Required!!`);

        const query = `select * from Users where username = '${username}' and password = ${password}`;

        const result = await pool.request().query(query);

        if (result.recordset.length > 0) throw new Error(`Username <${username}> is already in use.`);

        next();
    } catch (error) {
        res.status(500).json({
            message: "Internal Error",
            error: error.message
        });
    }
};

exports.Users = async (req, res) => {
    try {
        // Extract the user data from the request body
        const { username, password, firstname, lastname, roleId, email, phone, image } = req.body;

        if (username == '') {
            throw new Error('Username is Required')
        }

        const userId = new Date().getTime().toString()  // generate time digits

        // Insert the user into the database
        const query = `INSERT INTO users
                (
                    userId,
                    username,
                    password,
                    firstname,
                    lastname,
                    roleId,
                    email,
                    phone,
                    emailVerified,
                    passwordVerified,
                    image,
                    dateCreated,
                    dateModified
                ) VALUES
                (
                    @userId,
                    @username,
                    @password,
                    @firstname,
                    @lastname,
                    @roleId,
                    @email,
                    @phone,
                    @emailVerified,
                    @passwordVerified,
                    @image,
                    @dateCreated,
                    @dateModified

                )`;
        const result = await pool
            .request()
            .input('userId', sql.NVarChar, userId)
            .input('username', sql.NVarChar, username)
            .input('password', sql.NVarChar, password)
            .input('firstname', sql.NVarChar, firstname)
            .input('lastname', sql.NVarChar, lastname)
            .input('roleId', sql.Int, roleId)
            .input('email', sql.NVarChar, email)
            .input('phone', sql.NVarChar, phone)
            .input('emailVerified', sql.Bit, true)
            .input('passwordVerified', sql.Bit, true)
            .input('dateCreated', sql.DateTime, new Date())
            .input('dateModified', sql.DateTime, new Date())
            .input('image', sql.NVarChar, image)
            .query(query);

        res.status(201).json({ message: "User created" });
    } catch (error) {
        res.status(500).json({
            message: "Internal Error",
            error: error.message
        });
    }
}



// // const { sql, pool } = require("../../config")


exports.getUsers = async (req, res, next) => {
    try {
        const query = 'select *from users'
        const result = await pool.request().query(query)

        res.status(200).json({
            user: result.recordset
        })
    } catch (error) {
        res.status(500).json({
            message: "Internal Error",
            error: error.message
        })
    }
}

exports.singleUser = async (req, res, next) => {
    const id = req.params.id

    try {
        const query = `SELECT * from users WHERE id=${req.params.id}`
        // const query = `SELECT * from users WHERE id=@id`

        const result = await pool
            .request()
            .input('id', sql.Int, id)
            .query(query)

        res.status(200).json({
            user: result.recordset
        })
    } catch (error) {
        res.status(500).json({
            message: "Internal Error",
            error: error.message
        })
    }
}

// exports.Users = async (req, res) => {
    //     try {
    //         // Extract the user data from the request body
    //         const { username, password, firstname, lastname, roleId, email, phone, image } = req.body;

    //         if (username == '') {
    //             throw new Error('Username is Required')
    //         }

    //         const userId = new Date().getTime().toString()  // generate time digits

    //         // Insert the user into the database
    //         const query = `INSERT INTO users 
    //                         (
    //                             userId,
    //                             username, 
    //                             password, 
    //                             firstname, 
    //                             lastname, 
    //                             roleId, 
    //                             email, 
    //                             phone,
    //                             emailVerified, 
    //                             passwordVerified, 
    //                             image,
    //                             dateCreated,
    //                             dateModified
    //                         ) VALUES 
    //                         (
    //                             @userId,
    //                             @username, 
    //                             @password, 
    //                             @firstname, 
    //                             @lastname, 
    //                             @roleId, 
    //                             @email, 
    //                             @phone,
    //                             @emailVerified, 
    //                             @passwordVerified, 
    //                             @image,
    //                             @dateCreated,
    //                             @dateModified

    //                         )`;
    //         const result = await pool
    //             .request()
    //             .input('userId', sql.NVarChar, userId)
    //             .input('username', sql.NVarChar, username)
    //             .input('password', sql.NVarChar, password)
    //             .input('firstname', sql.NVarChar, firstname)
    //             .input('lastname', sql.NVarChar, lastname)
    //             .input('roleId', sql.Int, roleId)
    //             .input('email', sql.NVarChar, email)
    //             .input('phone', sql.NVarChar, phone)
    //             .input('emailVerified', sql.Bit, true)
    //             .input('passwordVerified', sql.Bit, true)
    //             .input('dateCreated', sql.DateTime, new Date())
    //             .input('dateModified', sql.DateTime, new Date())
    //             .input('image', sql.NVarChar, image)
    //             .query(query);

    //         res.status(201).json({ message: "User created" });
    //     } catch (error) {
    //         res.status(500).json({
    //             message: "Internal Error",
    //             error: error.message
    //         });
    //     }
// }

// exports.updateUser = async (req, res) => {
//     try {
//         const userId = req.params.id; // Assuming the user ID is passed in
//         const { username, password, firstname, lastname, roleId, email, phone, image } = req.body;

//         if (username === undefined || username === null || username.trim() === '') {
//             return res.status(400).json({ error: 'Username is required' });
//         }

//         // if (username === '') {
//         //     throw new Error('Username is Required');
//         // }

//         const query = `UPDATE users SET 

//         userId,
//         username, 
//         password, 
//         firstname, 
//         lastname, 
//         roleId, 
//         email, 
//         phone,
//         emailVerified, 
//         passwordVerified, 
//         image,
//         dateCreated,
//         dateModified
//         WHERE userId
//     ) VALUES 
//     (
//         @userId,
//         @username, 
//         @password, 
//         @firstname, 
//         @lastname, 
//         @roleId, 
//         @email, 
//         @phone,
//         @emailVerified, 
//         @passwordVerified, 
//         @image,
//         @dateCreated,
//         @dateModified
//         @userId,
//     )`;

//         const result = await pool
//             .request()
//             .input('userId', sql.NVarChar, userId)
//             .input('username', sql.NVarChar, username)
//             .input('password', sql.NVarChar, password)
//             .input('firstname', sql.NVarChar, firstname)
//             .input('lastname', sql.NVarChar, lastname)
//             .input('roleId', sql.Int, roleId)
//             .input('email', sql.NVarChar, email)
//             .input('phone', sql.NVarChar, phone)
//             .input('emailVerified', sql.Bit, true)
//             .input('passwordVerified', sql.Bit, true)
//             .input('image', sql.NVarChar, image)
//         input('dateCreated', sql.DateTime, new Date())
//             .input('dateModified', sql.DateTime, new Date())
//             .query(query);

//         if (result.rowsAffected[0] === 0) {
//             return res.status(404).json({ error: 'User not found' });
//         }

//         res.status(200).json({ message: 'User updated successfully' });
//     } catch (error) {
//         res.status(500).json({
//             message: 'Internal Error',
//             error: error.message,
//         });
//     }
// };