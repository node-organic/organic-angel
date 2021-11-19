describe("Autoload", function () {
  const path = require('path')
  const Angel = require("../index")
  let instance;
  beforeEach(function (next) {
    instance = new Angel()
    next()
  })

  it("plain match", async function () {
    instance.env.cwd = path.join(process.cwd(), './spec/data')
    await instance.start()
    const r = await instance.do('callback echo')
    expect(r).toBe('echo')
  })
})
