import Vue from 'vue'
import sinon from 'sinon'
import {getVM, getVMWithPropsData, initVueResource} from "./helper/VueHelper"
import Query from '@/components/Query'
import Table from '@/components/Table'


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

  it('#Table component should assign correctly', () => {
    const expectedBody = [{
      a: 1, b: "jack"
    }]
    const expectedColumns = ["a", "b"]
    const vm = getVMWithPropsData(Table, {columns: expectedColumns, tableData: expectedBody})
    expect(vm.tableData).toEqual(expectedBody)

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
      expect(vm.content).toEqual("select 1 as a,'jack' as b as bbc;")
      expect(vm.result.tableData).toEqual(expectedBody)
      expect(vm.$el.querySelector(".div-table-row").length > 0)
      done()
    }, 100);
  })

})
