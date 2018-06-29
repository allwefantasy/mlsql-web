import Vue from 'vue'
import Query from '@/components/Query'
import sinon from 'sinon'
import {getVM, initVueResource} from "./helper/VueHelper"

var sandbox = sinon.createSandbox()

describe('Query', () => {
  let server

  //in Query component we need vue-resource
  initVueResource()

  beforeEach(() => {
    server = sinon.fakeServer.create()
  })
  afterEach(() => {
    sandbox.restore()
    server.restore()
  })

  it('#submitRunSQL should work fine', () => {
    const vm = getVM(Query)

    const expectedParams = {
      "sql": vm.result.content,
      "owner": "admin",
      "jobName": vm.jobName
    }

    const expectedBody = {
      data: [{
        a: 1, b: "jack"
      }]
    }

    server.respondWith('POST', "/run/script", (xhr) => {
      xhr.respond(200, {'Content-Type': 'application/json'}, JSON.stringify(expectedBody))
    })

    server.autoRespond = true

    vm.submitRunSQL({})

    //expect(vm.$refs.show_detail_table).toEqual('select 1 as a,\'jack\' as b as bbc;')
  })
})
