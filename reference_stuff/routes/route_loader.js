const fs = require('fs')
const path = require('path')

function init(app) {

    const schemadir = path.join(__dirname, "./schema")
    const modellist = {}
    const filelist = fs.readdirSync(schemadir)
    filelist.forEach(file => {
        const filename = path.basename(file, path.extname(file));
        schema_info = require(`./schema/${filename}`);
        const schema = mongoose.Schema(schema_info.schema);
        if (schema_info.method) schema_info.method.forEach(m => schema.method(m.name, m));
        if (schema_info.static) schema_info.static.forEach(s => schema.schema(s.name, s));
        modellist[schema_info.name] = mongoose.model(schema_info.name, schema)
    })

    return modellist;

    app.set("db_model_list", modellist);

    app.use('/', require('./routes/views'));
    app.use('/', require('./routes/main')(passport));
    app.use('/coupang', require('./routes/coupang'));
    app.use('/me', require('./routes/user'));
}

function loadRoutes(mongoose) {

}