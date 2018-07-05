const querystring = require('querystring')
const fs = require('fs')

// 把上报请求保存到文件，方便排错
let writeJsonToFile = (directory, fileName, data) => {
    try {
        fs.statSync(directory);
    } catch (e) {
        fs.mkdirSync(directory);
    }
    let filePath = `${directory}/${fileName}.txt`
    fs.writeFileSync(filePath, data.toString())
}

let collects = []
let testData = {}

module.exports = {
    collects: collects,
    testData: testData,
    *beforeSendRequest(requestDetail) {
        if (requestDetail.url.indexOf('https://www.google-analytics.com/collect') === 0) {
            const collect = querystring.parse(requestDetail.requestOptions.path)
            collects.push(collect)
            writeJsonToFile('requests', collect.jid, requestDetail.requestOptions.path)
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