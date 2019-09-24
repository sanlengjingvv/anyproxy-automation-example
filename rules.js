const fs = require('fs')

// 把上报请求保存到文件，方便排错
const writeJsonToFile = (directory, fileName, data) => {
    try {
        fs.statSync(directory);
    } catch (e) {
        fs.mkdirSync(directory);
    }
    const filePath = `${directory}/${fileName}.txt`
    fs.writeFileSync(filePath, data.toString())
}

const collects = []

const rewriteRules = {'requests' : {}, 'responses' : {} }

module.exports = {
    collects: collects,
    rewriteRules: rewriteRules,
    *beforeSendRequest(requestDetail) {
        const hostAndPath = requestDetail.requestOptions.hostname + requestDetail.requestOptions.path.split('?')[0]

        if (rewriteRules.requests.hasOwnProperty(hostAndPath)) {
            const collect = requestDetail.requestData.toString()
            collects.push(collect)
            writeJsonToFile('requests', collect.jid, requestDetail.requestOptions.path)
        }
    },
    *beforeSendResponse(requestDetail, responseDetail) {
        const hostAndPath = requestDetail.requestOptions.hostname + requestDetail.requestOptions.path.split('?')[0]

        if (rewriteRules.responses.hasOwnProperty(hostAndPath)) {
            const newResponse = responseDetail.response
            const jsonResponse = JSON.parse(newResponse.body.toString())
            const rewrite = rewriteRules.responses[hostAndPath]
            newResponse.body = JSON.stringify(rewrite(jsonResponse))
            writeJsonToFile('responses', 'example', newResponse.body.toString())

            return {
                response: newResponse
            }
        }
    }
}