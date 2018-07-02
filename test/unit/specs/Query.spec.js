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

    const expectedBody = [{
      a: 1, b: "jack"
    }]

    server.respondWith('POST', vm.resource.job_url, [200, {"Content-Type": "application/json"},
      JSON.stringify(expectedBody)])
    // server.respondImmediately = true
    //server.autoRespond = true
    // let callback = function(){
    //   expect(vm.result.tableData).toEqual(expectedBody)
    // }
    vm.submitRunSQL({})
    server.respond()
    // or we can use callback,but this will change submitRunSQL parameter declaration
    // Async/Await is also  a better way
    setTimeout(function () {
      expect(vm.result.tableData).toEqual(expectedBody)
      done()
    }, 100);


  })
})
