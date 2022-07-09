// const Pool = require('pg').Pool
const { Sequelize } = require('sequelize');

// module.exports = new Sequelize(
//     'd3jf6ce043pv96',
//     'nifxbowncvyzgs',
//     'be5b39c920fc3508ce1daf8021d49cd4a1543c87edc418779202e05f48c23bc1',
//     {
//         host: 'ec2-52-30-159-47.eu-west-1.compute.amazonaws.com',
//         port: 5432,
//         dialect: 'postgres'
//     }
// );

module.exports = new Sequelize(
    'postgres://nifxbowncvyzgs:be5b39c920fc3508ce1daf8021d49cd4a1543c87edc418779202e05f48c23bc1@ec2-52-30-159-47.eu-west-1.compute.amazonaws.com:5432/d3jf6ce043pv96',
    {
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        }
    }
)

// // вынести в переменные окружения
// const pool = new Pool({
//     host: "ec2-52-30-159-47.eu-west-1.compute.amazonaws.com",
//     password: "be5b39c920fc3508ce1daf8021d49cd4a1543c87edc418779202e05f48c23bc1",
//     user: "nifxbowncvyzgs",
//     port: 5432,
//     database: "d3jf6ce043pv96",
// })

// module.exports = pool;