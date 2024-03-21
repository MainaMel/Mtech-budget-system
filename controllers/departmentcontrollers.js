const { sql, pool } =require("../../config")

exports.getDepartments = async (req,res, next) => {
    try {
        const query = `select * from departments`
        const result = await pool.request().query(query)

        res.status(200).json({
            departments: result.recordset
        })
    } catch (error) {
        res.status(500).json({
            message: "Internal Error",
            error: error.messages
        })
    }
}

exports.singleDepartment = async (req, res, next) => {
    const id = req.params.id

    try {
        const query = `select * from departments where id=${req.params.id}`

        const result = await pool
        .request()
        .input('id',sql.Int,id)
        .query(query)

    res.status(200).json({
        department: result.recordset
    })
    } catch (error) {
        res.status(500).json({
            message: "Internal Error",
            error: error.message
        })
    }
}
exports.validationOnCreate = async (req, res, next) => {

    const { department, hod, reviewLevels} =req.body
    const Required = !department ? 'department' : !hod ? 'hod' : !reviewLevels ? 'reviewLevels' : false;

    try {
        if (Required) throw new Error(`${Required} is required!!`)

        const query = ` select * from departments where department = '${department}' and
         hod = ${hod}  `

         const result = await pool
         .request()
         .query(query)

         if(result. recordset.length > 0) throw new Error(`department <${department}> already exists`)

         next()

    } catch (error) {
        res.status(500).json({
            message:"Internal Error",
            error: error.message
        })
    }
}

exports.createDepartments = async (req, res) => {


    try {
        // Extract the roles data from the request body
        const {  department, hod, reviewLevels } = req.body;

        // if (id == '') {
        //     throw new Error('id is Required ');
        // }
            //Insert the department into the database
            const query = `INSERT INTO departments
           (
            department,
            hod,
            reviewLevels
        ) 
        VALUES
        (
            @department,
            @hod,
            @reviewLevels
        )`;

           const result = await pool
           .request()
        //    .input('id',sql.Int,id)
           .input('department',sql.NChar,department)
           .input('hod',sql.Int,hod)
           .input('reviewLevels',sql.Int,reviewLevels)
           .query(query);

    res.status(201).json({ message: "department created"});
 } catch (error) {
    res.status(500).json({
        message: "Internal Error",
        error: error.message
    });
 }
}

exports.validationOnUpdate = async (req, res, next) => {
    const { department, hod, reviewLevels} =req.body
    const Required = !department ? 'department' : !hod ? 'hod' : !reviewLevels ? 'reviewLevels' : false;

 try{

    if (Required) throw new Error(`${required} is required!!`)

    const query = ` select * from departments where id = ${req.params.id} `
    const result = await pool.request().query(query)

    if (result.recordset.length >0) throw new Error('Update Denied!!')
    
    next()

 } catch(error) {
    res.status(500).json({
        message: "Internal Error",
        error:error.message
    })
 }
 }




exports.updateDepartment = async (req, res) => {
    try {
        const {  department, hod, reviewLevels} = req.body;
        const id = req.params.id;

        // if (id == '') {
        //     throw new Error('id is required')
        // }

        //insert into database
        const query =`UPDATE departments SET
           department = @department,
           hod = @hod,
           reviewLevels = @reviewLevels
           WHERE id = @id`;
           
           const result = await pool
           .request()
           .input('id',sql.Int,id)
           .input('department',sql.NVarChar,department)
           .input('hod',sql.Int,hod)
           .input('reviewlevels',sql.Int,reviewLevels)
           .query(query)

           //check if the update was successful
    if (result.rowsAffected[0] === 0) {
        return res.status(404).json({ error: 'department not found'});
    }

    res.status(200).json({message: 'department updated successfully'});
} catch (error) {
    res.status(500).json({
        message: 'Internal Error',
        error: error.message,
    });
}
};

exports.deleteDepartment = async (req, res ) => {
    try {
        const id = req.params.id;

        if(!id)  {
            return res.status(400).json({ error: 'Id is required'});
        }

        const query = `DELETE FROM departments  WHERE id =@id`;
        const result = await pool
           .request()
           .input('id', sql.Int, id)
           .query(query);

        // Check if the role was found and deleted
        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ error: 'Department not found' });
        }

        res.status(200).json({ message: 'Department  deleted successfully' });
    } catch (error) {
        res.status(500).json({
            message: 'Internal Error',
            error: error.message,
        });
    }
};
    

