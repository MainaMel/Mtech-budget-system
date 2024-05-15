const { sql, pool } = require("../../config")


exports.getRoles = async (req, res, next) => {
    try {
        const query = 'select *from Roles'
        const result = await pool.request().query(query)

        res.status(200).json({
            roles: result.recordset
        })
    } catch (error) {
        res.status(500).json({
            message: "Internal Error",
            error: error.message
        })
    }
}

exports.singleRole = async (req, res, next) => {
    const id = req.params.id

    try {
        const query = `SELECT * from roles WHERE id=${req.params.id}`

        const result = await pool
            .request()
            .input('id', sql.Int, id)
            .query(query)

        res.status(200).json({
            role: result.recordset[0]
        })
    } catch (error) {
        res.status(500).json({
            message: "Internal Error",
            error: error.message
        })
    }
}

exports.validationOnCreate = async (req, res, next) => {

    try {

        const { id, role } = req.body;
        const required = !id ? 'ID' : !role ? 'Role' : false

        //CHECKING REQUIRED FIELDS
        if (required) throw new Error(`${required} is Required!!`)

        //CHECK FOR DUPLICATES

        const query = `SELECT *FROM ROLES WHERE id = ${id}  or  ROLE='${role}' `
        const result = await pool.request().query(query)

        if (result.recordset.length > 0) throw new Error("ID or Role already Exists")

        next()



    } catch (error) {
        res.status(500).json({
            message: "Internal Error",
            error: error.message
        });
    }
}

exports.createRoles = async (req, res) => {
    const { id, role } = req.body
    try {


        //insert into  the database
        const query = `INSERT INTO roles
        (
            id,
            role
        ) values(
            @id,
            @role
        )`;
        const result = await pool
            .request()
            .input('id', sql.Int, id)
            .input('role', sql.NVarChar, role)
            .query(query);

        res.status(201).json({ message: "Role Created" });
    } catch (error) {
        res.status(500).json({
            message: "Internal Error",
            error: error.message
        });
    }
}


exports.validateOnUpdate = async (req, res, next) => {

    try {

        const { role } = req.body;
        const required = !role ? 'Role' : false

        //CHECKING REQUIRED FIELDS
        if (required) throw new Error(`${required} is Required!!`)

        //CHECK FOR DUPLICATES

        const query = `SELECT *FROM ROLES WHERE ROLE='${role}'  and id <> ${req.params.id}`
        const result = await pool.request().query(query)

        if (result.recordset.length > 0) throw new Error("Role already Exists")

        next()



    } catch (error) {
        res.status(500).json({
            message: "Internal Error",
            error: error.message
        });
    }
}


exports.updateRole = async (req, res) => {

    try {
        const Id = req.params.id;
        const { role } = req.body;



        //insert into  the database
        const query = `UPDATE roles SET
            role = @role
            WHERE id = @id`;

        const result = await pool
            .request()
            .input('id', sql.Int, Id)
            .input('role', sql.NVarChar, role)
            .query(query);

        //check if the update was successful
        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ error: 'Role not found' });
        }

        res.status(200).json({ message: 'Role updated successfully' });
    } catch (error) {
        res.status(500).json({
            message: 'Internal Error',
            error: error.message,
        });
    }
};


exports.deleteRole = async (req, res) => {
    try {
        const id = req.params.id;

        if (!id) {
            return res.status(400).json({ error: 'Id is required' });
        }

        const query = `DELETE FROM roles  WHERE id = @id`;
        const result = await pool
            .request()
            .input('id', sql.Int, id)
            .query(query);

        // Check if the role was found and deleted
        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ error: 'Role not found' });
        }

        res.status(200).json({ message: 'Role  deleted successfully' });
    } catch (error) {
        res.status(500).json({
            message: 'Internal Error',
            error: error.message,
        });
    }
};


