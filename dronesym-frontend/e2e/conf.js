exports.config = {
  seleniumAddress: "http://localhost:4444/wd/hub",
  specs: ["test.ts"],
  framework: "jasmine",
  capabilities: {
  	browserName: "chrome"
  }
};
