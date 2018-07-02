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

  it('#submitRunSQL should work fine', () => {
    const vm = getVM(Query)

    const expectedParams = {
      "sql": vm.result.content,
      "owner": "admin",
      "jobName": vm.jobName
    }

    const expectedBody = [{
      a: 1, b: "jack"
    }]

    server.respondWith('POST', vm.resource.job_url, (xhr) => {
      xhr.respond(200, {'Content-Type': 'application/json'}, JSON.stringify(expectedBody))
    })

    //server.autoRespond = true
    vm.submitRunSQL({})
    server.respond()
    expect(vm.result.tableData).toEqual(expectedBody)
    //expect(vm.$el.querySelector("#show_result").textContent).toEqual('select 1 as a,\'jack\' as b as bbc;')
  })
})
