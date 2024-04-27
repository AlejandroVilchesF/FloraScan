const SystemLog = require('../models').systemLog;

exports.postLog = (type, message, user) => {
    return new Promise( async (resolve, reject) => {
        try{
            const Log = new SystemLog({
                logType: type,
                log: message,
                user: user
            });
            await Log.save();
            resolve();
        }catch(err){
            reject(err);
        }
    });
}

exports.getLogs = async (req, res) => {
    try{
        // Establish params
        let serverParams = req.headers.serverParams? JSON.parse(req.headers.serverParams) : req.headers.serverparams? JSON.parse(req.headers.serverparams) : {}
        let findParams = req.headers.findParams? JSON.parse(req.headers.findParams) : req.headers.findparams? JSON.parse(req.headers.findparams) : {};
        let sortParams = {_id: -1};

        // Establish limit and offset
        let limit = serverParams.perPage;
        let offset = limit * (serverParams.page - 1);

        // Count number of documents
        const SystemLogCount = await SystemLog.countDocuments(findParams);
        // Execute the search process
        const FoundSystemLogs = await SystemLog.find(findParams).sort(sortParams).skip(offset).limit(limit).populate('user');
        console.log(FoundSystemLogs)
        if(FoundSystemLogs && FoundSystemLogs.length > 0){
            let response = {
                data: FoundSystemLogs,
                totalRecords: SystemLogCount
            };
            return res.status(200).send({data: response, code: 2001});
        } else {
            return res.status(200).send({message: 'No se han encontrado logs', code: 3000});
        }
    }catch(err){
        console.error("System Log controller: getLogs")
        console.error(err);
        return res.status(500).send({ message: 'Error', code: 3000 });
    }
}