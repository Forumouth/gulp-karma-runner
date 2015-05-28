describe "Integration test sample specs", ->
  it "sample should throw an error", ->
    expect(window.test).throw Error, "This is a test"
