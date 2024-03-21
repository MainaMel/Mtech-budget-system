const { sql, pool } = require("../../config");

exports.getlogin = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const required = !username ? 'Username' : !password ? 'Password' : false;

    // CHECKING REQUIRED FIELDS
    if (required) {
      res.status(400).json({
        message: `${required} is Required!!`
      });
      return;
    }

    // SECURITY: Use parameterized queries to prevent SQL injection
    const query = 'SELECT * FROM USERS WHERE username = @username And password = @password';
    const result = await pool
      .request()
      .input('username', sql.NVarChar, username)
      .input('password', sql.NVarChar, password)
      .query(query);


    // CHECK FOR DUPLICATES
    if (result.recordset.length == 0) throw new Error('Invalid username or password')
    const user = result.recordset[0]

    console.log(user)
    res.status(201).json({ 
      message: " Login is successful", 
      user,
    });


  } catch (error) {
    res.status(500).json({
      message: "Internal Error",
      error: error.message
    });
  }
};
