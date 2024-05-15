const { sql, pool } =require("../../config")


exports.getCurrencies = async (req,res ,next) => {

    try {
        const query = 'select * from currencies'
        const result = await pool.request().query(query)

        res.status(200).json({
            currencies: result.recordset
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal Error",
            error: error.message
        })
    }
    }

    exports.singlecurrency = async (req, res, next) => {
        const id = req.params.id
    
        try {
            const query = `select * from currencies where id=${req.params.id}`
    
            const result = await pool
            .request()
            .input('id',sql.Int,id)
            .query(query)
    
        res.status(200).json({
            currencies: result.recordset
        })
        } catch (error) {
            res.status(500).json({
                message: "Internal Error",
                error: error.message
            })
        }
    }

exports.validationOnCreate = async (req, res, next) => {
    
    try{
    const {id, currencyName, currencySymbol} = req.body

    const required = !id ? 'id' : !currencyName ? 'currencyName' :!currencySymbol ?'currencySymbol' : !isSelected ? 'isSelected' : false

    //CHECKING REQUIRED FIELDS
    if (required) throw new Error(`${required} is Required!!`)

    //CHECK FOR DUPLICATES

    const query = `SELECT *FROM currencies WHERE id = ${id}  `
    const result = await pool.request().query(query)

    if (result.recordset.length > 0) throw new Error("Currency already exists")

    next()



} catch (error) {
    res.status(500).json({
        message: "Internal Error",
        error: error.message
    });
}
}


    
    exports.createCurrencies = async (req, res) => {

        try {
            // Extract the roles data from the request body
            const { id, currencyName, currencySymbol, isSelected} = req.body;
    
            if (id == '') {
                throw new Error('id is Required ');
            }
                //Insert the currencies into the database
                const query = `
                INSERT INTO currencies
               (
                id,
                currencyName,
                currencySymbol,
                isSelected
            ) 
            VALUES
            (
                @id,
                @currencyName,
                @currencySymbol,
                @isSelected
            )`;
    
               const result = await pool
               .request()
               .input('id',sql.Int,id)
               .input('currencyName',sql.VarChar,currencyName)
               .input('currencySymbol',sql.VarChar,currencySymbol)
               .input('isSelected',sql.Bit,isSelected)
               .query(query);
    
        res.status(201).json({ message: "currency created"});
     } catch (error) {
        res.status(500).json({
            message: "Internal Error",
            error: error.message
        });
     }
    }

   exports.validationOnUpadate = async (req, res, next) => {

    try{
        const {id, currencyName, currencySymbol, } = req.body

        const required = !id ? 'id' : !currencyName ? 'currencyName' : !currencySymbol ? 'currencySymbol' : false;

        
        //checking the required fields

        if (required) throw new Error(`${required} is required !!`)

        //Checking for duplicates
        // const query = `select * from currencies where id = ${id} `
        // const result = await pool.request().query(query)

        // if (result.recordset.length > 0)throw new Error("No currency found with the provided Id")

        next()

    }catch (error) {
        res.status(500).json({
            message:"Internal Error",
            error:error.message
        });
    }
   } 

    exports.updateCurrency = async (req, res) => {


        try {
            // Extract the roles data from the request body
            const Id = req.params.id
            const { id, currencyName, currencySymbol, isSelected} = req.body;
    
            if (id == '') {
                throw new Error('id is Required ');
            }
                //Insert the currencies into the database
                const query = `UPDATE currencies SET
                id =  @id,
                currencyName =  @currencyName,
                currencySymbol =  @currencySymbol,
                isSelected =  @isSelected
                WHERE id =  @id`;
    
               const result = await pool
               .request()
               .input('id',sql.Int,id)
               .input('currencyName',sql.VarChar,currencyName)
               .input('currencySymbol',sql.VarChar,currencySymbol)
               .input('isSelected',sql.Bit,isSelected)
               .query(query);
    
     //check if the update was successful
              if (result.rowsAffected[0] === 0) {
                 return res.status(404).json({ error: 'Currency not found'});
    }

               
        res.status(201).json({ message: "currency updated"});
     } catch (error) {
        res.status(500).json({
            message: "Internal Error",
            error: error.message
        });
     }
    }


    exports.deleteCurrency = async (req, res ) => {
        try {
            const id = req.params.id;
    
            if(!id)  {
                return res.status(400).json({ error: 'Id is required'});
            }
    
            const query = `DELETE FROM currencies  WHERE id = @id`;
            const result = await pool
               .request()
               .input('id', sql.Int, id)
               .query(query);
    
            // Check if the currency was found and deleted
            if (result.rowsAffected[0] === 0) {
                return res.status(404).json({ error: 'currency not found' });
            }
    
            res.status(200).json({ message: 'currency  deleted successfully' });
        } catch (error) {
            res.status(500).json({
                message: 'Internal Error',
                error: error.message,
            });
        }
    };
        
    
    
    
