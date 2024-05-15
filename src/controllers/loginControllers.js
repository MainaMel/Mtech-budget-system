const { sql, pool } = require("../../config");

exports.getlogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const required = !email ? 'email' : !password ? 'Password' : false;
    

    // CHECKING REQUIRED FIELDS
    if (required) { throw new Error(`${required} is Required!!`)
    //  return res.status(400).json({
        // message: `${required} is Required!!`
      // });
      
    }

  
    const query = 'SELECT * FROM users WHERE email = @email And password = @password';
    const result = await pool
      .request()
      .input('email', sql.NVarChar, email)
      .input('password', sql.NVarChar, password)
      .query(query);
      
      // CHECK FOR DUPLICATES
      if (result.recordset.length == 0) throw new Error('Invalid email or password')
      const user = result.recordset[0]

   res.status(200).json({
    statusCode: 200,
    message :"Login is successful",
    user
   })

    
    
    
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      message: error.message,
     
    })
   
    
  }
}