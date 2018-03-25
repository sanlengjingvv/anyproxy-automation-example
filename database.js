const fs = require('fs')
const Sequelize = require('sequelize')

// 每次启动 AnyProxy 的时候使用新的 SQLite 数据库
const databaseFile = './database.sqlite'
if (fs.existsSync(databaseFile)) {
    console.log('Removing ' + databaseFile)
    fs.unlinkSync(databaseFile)
  }

// sequelize 配置信息
const sequelize = new Sequelize('mainDB', null, null, {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,

    pool: {
        max: 15,
        min: 0,
        acquire: 30000,
        idle: 10000
    },

    storage: databaseFile
})

// 建立数据库连接
sequelize.authenticate().then(() => {
    console.log('Database connection has been established successfully.')
}).catch(err => { 
    console.error('Unable to connect to the database:', err)
})

// 定义 Model，表示 www.google-analytics.com/collect 请求中 query string 和表结构的对应关系
const Collect = sequelize.define('collect', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    t: {
        type: Sequelize.STRING
    },
    dt: {
        type: Sequelize.STRING
    }
})

module.exports = {
    Collect: Collect
}