const assert = require('assert')
let { collects, testData } = require('../rules')

describe('TesterHome', function () {
    it('修改数据', function () {
        testData.index = 1
        testData.title = '很长很长的标题显示测试' + Date.now()

        // Appium 在建立 session 后就会启动 App，这时候 testData 还没被赋值，所以在赋值后重启 App 重新获取话题列表数据
        browser.closeApp()
        browser.launch()
        browser.pause(3000)

        // 话题列表话题的 Xpath 序号从 1 开始，但 HTTP 响应的 JSON 是从 0 开始
        const listIndex = testData.index + 1
        const locator = `//XCUIElementTypeTable/XCUIElementTypeCell[${listIndex}]/XCUIElementTypeStaticText`
        assert.equal($(locator).getText(), testData.title)
    })

    it('验证埋点', function () {
        const expectDt = '社区 · TesterHome'
        const expectT = 'pageview'

        browser.pause(3000)

        const actualCollects = collects.filter(collect => collect.dt === expectDt)
        assert.equal(actualCollects[0].t, expectT)
    })
})


