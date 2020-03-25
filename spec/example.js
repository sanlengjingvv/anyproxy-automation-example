const assert = require('assert')
const { collects, rewriteRules } = require('../rules')

describe('TesterHome', function () {
    it('修改数据', function () {
        const index = 1
        const title = '很长很长的标题显示测试' + Date.now()
        rewriteRules.requests = {}
        rewriteRules.responses = {}
        rewriteRules.addRule('responses', {
            'testerhome.com/api/v3/topics.json': (response) => {
                response.topics[index].title = title

                return response
            }
        })

        // Appium 在建立 session 后就会启动 App，这时候 testData 还没被赋值，所以在赋值后重启 App 重新获取话题列表数据
        browser.closeApp()
        browser.launch()
        browser.pause(3000)

        // 话题列表话题的 Xpath 序号从 1 开始，但 HTTP 响应的 JSON 是从 0 开始
        const locator = `~${title}`

        assert.equal($(locator).getText(), title)
    })

    it('验证埋点', function () {
        browser.closeApp()
        rewriteRules.requests = {}
        rewriteRules.responses = {}
        rewriteRules.addRule('requests', {'ios.bugly.qq.com/rqd/sync': ''})
        browser.launch()
        browser.pause(3000)

        assert.ok(collects[0].includes('testerhome'))
    })
})


