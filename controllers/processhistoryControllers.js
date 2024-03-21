const { sql, pool } =require("../../config")

// exports.getprocesshistory = async (req,res, next) => {
//     try {
//         const query = `select * from process_History`
//         const result = await pool.request().query(query)

//         res.status(200).json({
//             processhistory: result.recordset
//         })
//     } catch (error) {
//         res.status(500).json({
//             message: "Internal Error",
//             error: error.messages
//         })
//     }
// }

// exports.singleprocesshistory = async (req, res, next) => {
//     const id = req.params.id

//     try {
//         const query = `select * from process_History where id=${req.params.id}`

//         const result = await pool
//         .request()
//         .input('id',sql.Int,id)
//         .query(query)

//     res.status(200).json({
//         processhistory: result.recordset
//     })
//     } catch (error) {
//         res.status(500).json({
//             message: "Internal Error",
//             error: error.message
//         })
//     }
// }

exports.validationOnCreate = async (req, res, next) => {
    try{
        const {budgetId, reviewLevel, approvedBy} = req.body


        // checking for the required fields
        const required = !budgetId ?'budgetId' :!reviewLevel ? 'reviewLevel' : !approvedBy ? 'approvedBy' : false

        if (required) throw new Error(`${required} is required!!`)

        //checking for duplicates
        const query = `select * from process_history where budgetId =${budgetId}`

        const result = await pool
        .request()
        .query(query);

        if (result.recordset.lenght >0 )throw new Error(`Duplicate records found for budgetId ${budgetId}`)

        next()

    } catch (error) {
        res.status(500).json({
            message:"Internal Error",
            error:error.message
        })
    }

 }



exports.createprocesshistory = async (req, res, ) => {

    try {
        const { budgetId, reviewLevel,approvedBy } = req.body;

        // if (id == '') {
        //     throw new Error('id is required')
        // }

        // const budgetId = parseInt(req.body.budgetId, 10);

        // const  budgetId = new Date().getTime().toString() // generate time digits
         
        //insert into  the database
        const query = `INSERT INTO process_History
        (
            budgetId,
            reviewLevel,
            approvedBy,
            dateCreated
        ) values(
            @budgetId,
            @reviewLevel,
            @approvedBy,
            @dateCreated
        )`;

    const result = await pool
     .request()
     .input('budgetId',sql.Int,budgetId)
     .input('reviewLevel',sql.Int,reviewLevel)
     .input('approvedBy',sql.NVarChar,approvedBy)
     .input('dateCreated',sql.DateTime, new Date())

     .query(query);

     res.status(201).json({message: "Process history Created"});
    } catch (error) {
        res.status(500).json({
            message: "Internal Error",
            error: error.message
        });
    }
}

exports.validationOnUdpadate = async (req, res, next) => {
    try{
        const {budgetId, reviewLevel, approvedBy} = req.body

        const required =!budgetId ? 'budgetId' : !reviewLevel ? 'reviewLevel' : !approvedBy ? 'approvedBy' : false

        if (required)throw new Error(`${required} is required!!`)

        const query = `select * from process_history where budgetId =${budgetId}`
        const result = await pool
        .request()
        .query(query)

        if (result.recordset.lenght > 0)throw new Error(`Duplicate records found for budget id`)

        next()

    } catch (error) {
        res.status(500).json({
            message:"Internal Error",
            error:error.message
        })
    }
    }


exports.updateprocesshistory = async (req, res, ) => {

    try {
        const { Id, reviewLevel,approvedBy } = req.body;

        if (Id == '') {
            throw new Error('id is required')
        }

        const budgetId = parseInt(req.body.budgetId, 10);

        // const  budgetId = new Date().getTime().toString() // generate time digits
         
        //insert into  the database
        const query = `UPDATE process_History SET
        
        budgetId = @budgetId,
        reviewLevel = @reviewLevel,
        approvedBy = @approvedBy,
        dateCreated = @dateCreated
    WHERE Id = @Id`;

    const result = await pool
     .request()
     .input('budgetId',sql.Int,budgetId)
     .input('Id',sql.Int,Id)
     .input('reviewLevel',sql.Int,reviewLevel)
     .input('approvedBy',sql.NVarChar,approvedBy)
     .input('dateCreated',sql.DateTime, new Date())

     .query(query);

     res.status(201).json({message: "Process history Updated"});
    } catch (error) {
        res.status(500).json({
            message: "Internal Error",
            error: error.message
        });
    }
}




// exports.deleteprocesshistory = async (req, res ) => {
//     try {
//         const id = req.params.id;

//         if(!id)  {
//             return res.status(400).json({ error: 'Id is required'});
//         }

//         const query = `DELETE FROM process_History  WHERE id =@id`;
//         const result = await pool
//            .request()
//            .input('id', sql.Int, id)
//            .query(query);

//         // Check if the processhistory was found and deleted
//         if (result.rowsAffected[0] === 0) {
//             return res.status(404).json({ error: 'processhistory not found' });
//         }

//         res.status(200).json({ message: 'Processhistory  deleted successfully' });
//     } catch (error) {
//         res.status(500).json({
//             message: 'Internal Error',
//             error: error.message,
//         });
//     }
// };
    



