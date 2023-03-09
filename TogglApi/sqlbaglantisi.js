class SqlBaglan {
    host = "localhost";
    user = "root";
    password = "";
    database = "crm";
    constructor() {
    }

    get Host() {
        return this.host;
    }
    get User() {
        return this.user;
    }
    get Password() {
        return this.password;
    }
    get Database() {
        return this.database;
    }
}
sqlbaglan = new SqlBaglan();

module.exports = sqlbaglan;