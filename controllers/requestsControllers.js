const { sql, pool } = require("../../config")


exports.getRequests = async (req, res, next) => {
    try {
        const query = 'SELECT *from Requests'
        const result = await pool.request().query(query)

        res.status(200).json({
            requests: result.recordset
        })
    } catch (error) {
        res.status(500).json({
            message: "Internal Error",
            error: error.message
        })
    }
}

exports.singleRequest = async (req, res, next) => {
    const id = req.params.id

    try {
        const query = `SELECT * from requests WHERE id=${req.params.id}`

        const result = await pool
            .request()
            .input('id', sql.Int, id)
            .query(query)

        res.status(200).json({
            request: result.recordset[0]
        })
    } catch (error) {
        res.status(500).json({
            message: "Internal Error",
            error: error.message
        })
    }
}

exports.validateOnCreate = async (req, res, next) => {
    const { item, description, unitprice, currency, requestedBy, departmentId } = req.body
    const required = !item
        ? 'Item'
        : !description
            ? 'Description'
            : !unitprice
                ? 'Unit Price'
                : !currency
                    ? 'Currency'
                    : !requestedBy
                        ? 'Requested By'
                        : !Number(departmentId)
                            ? 'Department'
                            : false
    try {

        if (required) throw new Error(`${required} is Required!!`)

        const query = `select *from Requests where item = '${item}' and 
            departmentId= ${departmentId} and 
            reviewStatus in ('REQUESTED','PROCESSING','APPROVED')`

        const result = await pool.request().query(query)

        if (result.recordset.length > 0) throw new Error(`Item < ${item} > has already been requested`)

        next()

    } catch (error) {
        res.status(500).json({
            message: "Internal Error",
            error: error.message
        })
    }
}

exports.createRequests = async (req, res) => {
    try {

        const { item, description, unitprice, currency, requestedBy, departmentId } = req.body;



        // const Id = parseInt(req.body.budgetId, 10);

        // const Id = new Date().getTime().toString() // generate time digits

        //insert into  the database
        const query = `INSERT INTO requests
        (
            item,
            description,
            unitprice,
            currency,
            reviewStatus,
            requestedBy,
            dateCreated,
            status,
            departmentId
        ) values
        (
            @item,
            @description,
            @unitprice,
            @currency,
            @reviewStatus,
            @requestedBy,
            @dateCreated,
            @status,
            @departmentId
            
        )`;

        const result = await pool
            .request()
            .input('item', sql.NVarChar, item)
            .input('description', sql.Text, description)
            .input('unitprice', sql.Float, unitprice)
            .input('currency', sql.NVarChar, currency)
            .input('reviewStatus', sql.NVarChar, 'REQUESTED')
            .input('requestedBy', sql.NVarChar, requestedBy)
            .input('dateCreated', sql.DateTime, new Date())
            .input('departmentId', sql.Int, departmentId)
            .input('status', sql.Bit, true)

            .query(query);

        res.status(201).json({ message: "Request  Created" });
    } catch (error) {
        res.status(500).json({
            message: "Internal Error",
            error: error.message
        });
    }
}

exports.validateOnUpdate = async (req, res, next) => {
    const { item, description, unitprice, currency, requestedBy, departmentId } = req.body
    const required = !item
        ? 'Item'
        : !description
            ? 'Description'
            : !unitprice
                ? 'Unit Price'
                : !currency
                    ? 'Currency'
                    : !requestedBy
                        ? 'Requested By'
                        : !Number(departmentId)
                            ? 'Department'
                            : false
    try {

        if (required) throw new Error(`${required} is Required!!`)

        const query = `select *from Requests where id = ${req.params.id} and 
            reviewStatus <> 'REQUESTED' `

        const result = await pool.request().query(query)

        if (result.recordset.length > 0) throw new Error(`Update Denied!! Request being processed`)

        next()

    } catch (error) {
        res.status(500).json({
            message: "Internal Error",
            error: error.message
        })
    }
}



exports.updateRequest = async (req, res) => {

    try {

        const { item, description, unitprice, currency, departmentId } = req.body;
        const Id = req.params.id

        //UPDATING into  the database
        const query = `UPDATE requests SET
        item = @item,
        description =@description,
        unitprice = @unitprice,
        currency = @currency,
        departmentId = @departmentId
        WHERE Id = @Id`;

        const result = await pool
            .request()
            .input('Id', sql.Int, Id)
            .input('item', sql.NVarChar, item)
            .input('description', sql.Text, description)
            .input('unitprice', sql.Float, unitprice)
            .input('currency', sql.NVarChar, currency)
            .input('departmentId', sql.Int, departmentId)
            .query(query);
        // Check if the update was successful
        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ error: 'request not found' });
        }


        res.status(201).json({ message: "request updated" });
    } catch (error) {
        res.status(500).json({
            message: "Internal Error",
            error: error.message
        });
    }
}


exports.validateApprover = async (req, res, next) => {

    try {
        const { reviewStatus, reviewedBy } = req.body

        const required = !reviewStatus ? 'Review Status' : !reviewedBy ? 'Reviewer' : false

        if (required) throw new Error(`${required} is Required`)

        //Verify Status

        const statuses = ['PROCESSING', 'APPROVED', 'REJECTED']
        if (!statuses.includes(reviewStatus)) throw new Error(`Review Status Allowed are ${statuses.join(' - ')}`)

        const requestQuery = `select *from Requests where id = ${req.params.id}`
        const result = await pool.request().query(requestQuery)

        if (result.recordset.length == 0) throw new Error("Request Not Found")


        //verify Reviewer

        const query = `select * from users where 
                        id = (select hod from departments where 
                        id = (select departmentId From Requests where id =  ${req.params.id})) and 
                        userId = '${reviewedBy}' `

        const rst = await pool.request().query(query)

        if (rst.recordset.length == 0) throw new Error('Permission is Denied')


        next()
    } catch (error) {
        res.status(500).json({
            message: 'Internal Error',
            error: error.message,
        });
    }
}

exports.updateReviewStatus = async (req, res, next) => {

    try {
        const { reviewStatus } = req.body
        const query = `UPDATE Requests SET 
                reviewStatus = @reviewStatus 
                where id = @id`
        const rst = await pool.request()
            .input("reviewStatus", sql.NVarChar, reviewStatus)
            .input("id", sql.Int, req.params.id)
            .query(query)
        if (rst.rowsAffected[0] == 0) throw new Error('Request not Found')
        res.status(202).json({
            message: `Review status updated to <${reviewStatus}>`
        })
    } catch (error) {
        res.status(500).json({
            message: 'Internal Error',
            error: error.message,
        });
    }
}







exports.deleteRequest = async (req, res) => {
    try {
        const id = req.params.id;

        if (!id) {
            return res.status(400).json({ error: 'Id is required' });
        }

        const query = `DELETE FROM requests  WHERE id = @id`;
        const result = await pool
            .request()
            .input('id', sql.Int, id)
            .query(query);

        // Check if the request was found and deleted
        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ error: 'Request not found' });
        }

        res.status(200).json({ message: 'Request  deleted successfully' });
    } catch (error) {
        res.status(500).json({
            message: 'Internal Error',
            error: error.message,
        });
    }
};


