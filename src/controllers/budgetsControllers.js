
const { sql, pool } = require("../../config")

exports.getBudgets = async (req, res, next) => {
    try {
        const query = ` SELECT * FROM budgets`
        const result = await pool.request().query(query)

        res.status(200).json({
            budgets: result.recordset
        })
    } catch (error) {
        res.status(500).json({
            message: "Internal Error",
            error: error.messages
        })
    }
}

exports.singleBudget = async(req, res, next) => {
    const id = req.params.id

    try {
        const query = `SELECT * FROM budgets WHERE id=${req.params.id}`
        const result = await pool
        .request()
        .input('id',sql.Int, id)
        .query(query)

        res.status(200).json({
            budgets: result.recordset
        })
    } catch (error) {
        res.status(500).json({
            message: "Internal Error",
            error: error.message
        })
    }
}

exports.validationOnCreate = async (req, res, next) => {
    const { item, description, image, quantity, payables, unitprice, currency, department, createdBy, approvedBy} = req.body

    //checking required fields

    const required = !item
        ? 'item'
        : !description
            ? 'description'
            : !image
                ? 'image'
                    : !Number(quantity)
                        ? 'quantity'
                        : !payables
                            ? 'payables'
                            : !unitprice
                                ? 'unitprice'
                                : !currency
                                    ? 'currency'
                                        : !Number(department)
                                        ? 'department'
                                            : !createdBy
                                                ? 'createdBy'
                                                : !approvedBy
                                                    ? 'approvedBy'
                                                    : false;  

    try {
        if (required) throw new Error(`${required} is Required!!`);

        //checking for duplication

        const query = `select * from budgets where item ='${item}' and description like '${description}' `;

        const result = await pool
        .request()
        .query(query);

        if (result.recordset.length > 0) throw new Error(`Item <${item}> has already been  requested.`);

        
        next();

    } catch (error) {
        res.status(500).json({
            message: "Internal Error",
            error: error.message
        });
    }
}


exports.createBudgets = async (req, res,) => {

    try {
        
        const { item, description, image, quantity, payables, unitprice, currency, department, dateCreated, dateModified, approved, createdBy, approvedBy, status } = req.body;

        if (item == '') {
            throw new Error('item is required')
        }
        
        const Id = new Date().getTime()
        // const Id = parseInt(req.body.Id, 10);
        // const Id = new Date().getTime().toString()  // generate time digits
        const query = `INSERT INTO budgets
        (
        
            item,
            description,
            image, 
            quantity,
            payables,
            unitprice,
            currency,
            department,
            dateCreated,
            dateModified,
            approved,
            createdBy,
            approvedBy,
            status
        ) VALUES
        (
            
            @item,
            @description,
            @image, 
            @quantity,
            @payables,
            @unitprice,
            @currency,
            @department,
            @dateCreated,
            @dateModified,
            @approved,
            @createdBy,
            @approvedBy,
            @status

        )`;

        const result = await pool
        .request()
        // .input('Id',sql.Int,Id)
        .input('item',sql.NVarChar,item)
        .input('description',sql.Text,description)
        .input('image',sql.Text,image)
        .input('quantity',sql.Int,quantity)
        .input('payables',sql.Float,payables)
        .input('unitprice',sql.Float,unitprice)
        .input('currency',sql.NVarChar,currency)
        .input('department',sql.Int,department)
        .input('dateCreated',sql.DateTime,dateCreated)
        .input('dateModified',sql.DateTime,dateModified)
        .input('approved',sql.Bit,approved)
        .input('createdBy',sql.NVarChar,createdBy)
        .input('approvedBy',sql.NVarChar,approvedBy)
        .input('status',sql.Bit,status)
        .query(query);

        
        res.status(201).json({ message: "budget created" });
    } catch (error) {
        res.status(500).json({
            message: "Internal Error",
            error: error.message
        });
    }
}

exports.validationOnUpdate = async (req, res, next) => {
    const { item, description, image, quantity, payables, unitprice, currency, department, createdBy, approvedBy} = req.body

    const required = !item
        ? 'item'
        : !description
            ? 'description'
            : !image
                ? 'image'
                    : !Number(quantity)
                        ? 'quantity'
                        : !payables
                            ? 'payables'
                            : !unitprice
                                ? 'unitprice'
                                : !currency
                                    ? 'currency'
                                        : !Number(department)
                                        ? 'department'
                                            : !createdBy
                                                ? 'createdBy'
                                                : !approvedBy
                                                    ? 'approvedBy'
                                                    : false;  

    try {
        if (required) throw new Error(`${required} is Required!!`);

        const query = `select * from budgets where item ='${item}' and  ;
        
        description = @description`;
        const result = await pool
        .request()
        .query(query);

        if (result.recordset.length > 0) throw new Error(`Item <${item}> has already been  updated.`);

        
        next();
    } catch (error) {
        res.status(500).json({
            message: "Internal Error",
            error: error.message
        });
    }
}
    
exports.updateBudget = async (req, res) => {
    try {
        
        const { item, description, image, quantity, payables, unitprice, currency, department, dateCreated, dateModified, approved, createdBy, approvedBy, status } = req.body;

        if (item == '') {
            throw new Error('item is required')
        }

       
        
        // const Id = new Date().getTime() // generate time digits
        // const Id = new Date().getTime().toString()  // generate time digits
         const Id = parseInt(req.body.Id, 10);
        const query = `UPDATE budgets SET

            
            item = @item,
            description = @description,
            image = @image, 
            quantity = @quantity,
            payables = @payables,
            unitprice = @unitprice,
            currency = @currency,
            department = @department,
            dateCreated = @dateCreated,
            dateModified = @dateModified,
            approved = @approved,
            createdBy = createdBy,
            approvedBy = @approvedBy,
            status = @status
            WHERE Id = @Id`;

        const result = await pool
        .request()
        .input('Id',sql.Int,Id)
        .input('item',sql.NVarChar,item)
        .input('description',sql.Text,description)
        .input('image',sql.Text,image)
        .input('quantity',sql.Int,quantity)
        .input('payables',sql.Float,payables)
        .input('unitprice',sql.Float,unitprice)
        .input('currency',sql.NVarChar,currency)
        .input('department',sql.Int,department)
        .input('dateCreated',sql.DateTime,dateCreated)
        .input('dateModified',sql.DateTime,dateModified)
        .input('approved',sql.Bit,approved)
        .input('createdBy',sql.NVarChar,createdBy)
        .input('approvedBy',sql.NVarChar,approvedBy)
        .input('status',sql.Bit,status)
        .query(query);

        
        res.status(201).json({ message: "budget updated" });
    } catch (error) {
        res.status(500).json({
            message: "Internal Error",
            error: error.message
        });
    }
}




exports.deleteBudget = async (req, res ) => {
    try {
        const id = req.params.id;

        if(!id)  {
            return res.status(400).json({ error: 'Id is required'});
        }

        const query = `DELETE FROM budgets  WHERE id = @id`;
        const result = await pool
           .request()
           .input('id', sql.Int, id)
           .query(query);

        // Check if the budgets was found and deleted
        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ error: 'Budget not found' });
        }

        res.status(200).json({ message: 'Budget  deleted successfully' });
    } catch (error) {
        res.status(500).json({
            message: 'Internal Error',
            error: error.message,
        });
    }
};
    




    
