const querystring = require('querystring')
const { Collect } = require('./database')

let testData = {}

module.exports = {
    testData: testData,
    *beforeSendRequest(requestDetail) {
        if (requestDetail.url.indexOf('https://www.google-analytics.com/collect') === 0) {
            const collect = querystring.parse(requestDetail.requestOptions.path)
            // 将埋点上报数据存入数据库
            Collect.sync({ force: false }).then(() => {
                return Collect.create(collect).then(() => {
                    return null
                }).catch(error => {
                    console.log('[Database] error' + error)
                })
            })
        }
    },
    *beforeSendResponse(requestDetail, responseDetail) {
        if ((requestDetail.url.indexOf('https://testerhome.com/api/v3/topics.json?limit=40&offset=0&type=last_actived') === 0) && responseDetail.response.statusCode === 200) {
            let newResponse = responseDetail.response
            let jsonBody = JSON.parse(newResponse.body.toString())
            if (Object.keys(testData).length !== 0) {
                jsonBody.topics[testData.index].title = testData.title
            }
            newResponse.body = JSON.stringify(jsonBody)
            return {
                response: newResponse
            }
        }
    }
}