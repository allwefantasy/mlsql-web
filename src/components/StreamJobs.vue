<template>

  <div class="stream-jobs-list">

    <div v-for="userWithJobs in this.usersWithJobs" class="job-boarder">
      <header>用户:{{userWithJobs.owner}}</header>

      <div v-for="job in userWithJobs.jobs" class="job-card-detail">
        <div class="job-item">
          <span>{{job.jobName}}</span>
          <div class="job-item-content">任务类型：{{job.jobType}}</div>
          <div class="job-item-content">任务内容：{{job.jobContent}}</div>
          <div class="job-item-content">任务启动时间：{{job.startTime}}</div>
        </div>
      </div>


    </div>

  </div>


</template>

<script>

  const uuidv4 = require('uuid/v4');
  const base_url = process.env.API_ROOT
  const groupBy = function (list, key) {
    return list.reduce(function (rv, x) {
      (rv[x[key]] = rv[x[key]] || []).push(x)
      return rv
    }, {})
  }
  export default {
    name: 'StreamJobs',
    data() {
      return {
        resource: {
          batch_jobs_url: base_url + "/runningjobs",
          stream_jobs_url: base_url + "/stream/jobs/running"
        },
        usersWithJobs: []
      }
    },
    mounted: function () {
      this.fetchJobList()
    },
    methods: {
      fetchJobList: function () {
        const self = this
        const options = {
          emulateJSON: true
        }

        self.$http.post(self.resource.stream_jobs_url, {}, options).then(ok => {
          // first we should group by ower
          //self.usersWithJobs =
          const formatStartTime = function (items) {
            for (let item of items) {
              item.startTime = new Date(item.startTime).toLocaleDateString("en-US")
            }
          }
          const groupByOwner = groupBy(ok.data, "owner")
          const renderRes = []
          for (let key in groupByOwner) {
            formatStartTime(groupByOwner[key])
            renderRes.push({"owner": key, "jobs": groupByOwner[key]})
          }
          self.$http.post(self.resource.batch_jobs_url, {}, options).then(ok => {

            const groupByOwner = groupBy(Object.values(ok.data), "owner")

            for (let key in groupByOwner) {
              formatStartTime(groupByOwner[key])
              renderRes.push({"owner": key, "jobs": groupByOwner[key]})
            }
            self.usersWithJobs = renderRes
          }, notok => {
            console.log(notok.bodyText)
          })

        }, notok => {
          console.log(notok.bodyText)
        })
      }
    },
    components: {}

  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

  .stream-jobs-list {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: left;
    align-items: flex-start;
  }

  .job-boarder {
    width: 271px;
    max-height: 100%;
    margin: 10px 10px 10px 10px;
    border: coral;
    border-radius: 3px;
    background-color: #e2e4e6;
    display: flex;
    flex-direction: column;
  }

  .job-card-detail {
    background-color: white;
    margin: 5px 5px 5px 5px;
    padding: 5px 5px 5px 5px;
    font-size: 14px;
  }

  .job-item-content {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-size: 10px;
  }


</style>
