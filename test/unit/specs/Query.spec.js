import Vue from 'vue'
import sinon from 'sinon'
import {getVM, initVueResource} from "./helper/VueHelper"
import Query from '../../../src/components/Query'


describe('Query', () => {

  //in Query component we need vue-resource
  initVueResource()

  let sandbox
  let server

  beforeEach(() => {
    sandbox = sinon.createSandbox()
    server = sinon.fakeServer.create()
  })
  afterEach(() => {
    server.restore()
    sandbox.restore()
  })

  it('#submitRunSQL should work fine', (done) => {
    const vm = getVM(Query)

    const expectedParams = {
      "sql": vm.result.content,
      "owner": "admin",
      "jobName": vm.jobName
    }

    const expectedBody = [{
      a: 1, b: "jack"
    }]

    server.respondWith('POST', vm.resource.job_url, [200, {"Content-Type": "application/json"},
      JSON.stringify(expectedBody)])
    // server.respondImmediately = true
    //server.autoRespond = true
    vm.submitRunSQL({})
    server.respond()
    setTimeout(function () {
      // This one works, but it's quirky and a possible error is not well represented in the HTML output.
      expect(vm.result.tableData).toEqual(expectedBody)
      done()
    }, 100);
    //expect(vm.$el.querySelector("#show_result").textContent).toEqual('select 1 as a,\'jack\' as b as bbc;')
  })
})
