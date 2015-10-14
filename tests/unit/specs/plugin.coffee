expect = require("chai").expect

server = require "../../../src/lib/server"
runner = require "../../../src/lib/runner"
plugin = require "../../../src/lib/plugin"

describe "plugin unit test", ->
  after ->
    delete require.cache[require.resolve "../../../src/lib/runner"]
    delete require.cache[require.resolve "../../../src/lib/server"]
  it "plugin should have server", ->
    expect(plugin.server).eql server
  it "plugin should have runner", ->
    expect(plugin.runner).eql runner
