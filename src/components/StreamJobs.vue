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
          <button v-on:click="killJob(job.jobType,job.groupId)">关闭任务</button>
        </div>
      </div>


    </div>

  </div>


</template>

<script>

  import Backend from "./Backend"

  export default {
    name: 'StreamJobs',
    data() {
      return {
        usersWithJobs: []
      }
    },
    mounted: function () {
      this.fetchJobList()
    },
    methods: {
      killJob: function (jobType, jobId) {
        const self = this
        const backend = new Backend(self.$http)
        backend.killJob(jobType, jobId)
        self.usersWithJobs = backend.fetchJobs()
      },
      fetchJobList: function () {
        const self = this
        const backend = new Backend(self.$http)
        self.usersWithJobs = backend.fetchJobs()
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
    width: 180px;
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
