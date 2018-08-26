import Methods from './Methods'

class Backend {

  constructor(_http) {
    const base_url = process.env.API_ROOT
    this.http = _http
    this.resource = {
      batch_jobs_url: base_url + "/runningjobs",
      stream_jobs_url: base_url + "/stream/jobs/running",
      kill_stream_jobs_url: base_url + "/stream/jobs/kill",
      kill_batch_jobs_url: base_url + "/killjob",
      job_url: base_url + "/run/script",
    }
  }

  submitJob(params,
            submitBefore = () => {
            }, submitSuccess = () => {
    }, submitFail = (msg) => {
    }) {

    const columns = [];
    // use keys to get column
    const tableData = []

    const resource = this.resource.job_url
    const options = {
      emulateJSON: true
    }
    const self = this
    submitBefore()
    self.http.post(resource,
      params, options).then(ok => {
      submitSuccess()
      let data = ok.data
      let keys = []
      let basket = {};

      //collect all keys
      data.forEach(function (item) {
        for (let key in item) {
          if (!basket[key]) {
            keys.push(key)
            basket[key] = true
          }
        }
      })

      columns.push(...keys)

      data.forEach(function (item) {
        let new_item = {}
        keys.forEach(function (key) {
          new_item[key] = item[key]
        })
        tableData.push(new_item)
        console.log(tableData)
      })
    }, notok => {
      submitFail(notok.bodyText)
    })
    return {"columns": columns, "tableData": tableData}
  }

  killJob(jobType, jobId) {
    const self = this
    const options = {
      emulateJSON: true
    }
    let finalUrl = self.resource.kill_stream_jobs_url

    if (jobType != "stream") {
      finalUrl = self.resource.kill_batch_jobs_url
    }

    const success = []
    self.http.post(finalUrl, {groupId: jobId}, options).then(ok => {
      success.push(true)
    }, notok => {
      success.push(false)
    })
    return success
  }

  fetchJobs() {
    const self = this
    const renderRes = []
    const options = {
      emulateJSON: true
    }
    self.http.post(self.resource.stream_jobs_url, {}, options).then(ok => {
      const groupByOwner = Methods.groupBy(ok.data, "owner")
      for (let key in groupByOwner) {
        Methods.formatStartTime(groupByOwner[key])
        renderRes.push({"owner": key, "jobs": groupByOwner[key]})
      }
      self.http.post(self.resource.batch_jobs_url, {}, options).then(ok => {

        const groupByOwner = Methods.groupBy(Object.values(ok.data), "owner")

        for (let key in groupByOwner) {
          Methods.formatStartTime(groupByOwner[key])
          renderRes.push({"owner": key, "jobs": groupByOwner[key]})
        }

      }, notok => {

      })

    }, notok => {

    })
    return renderRes
  }
}

export default Backend
