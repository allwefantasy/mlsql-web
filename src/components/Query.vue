<template>

  <div class="query_box">
    <div class="editor_mode_select">
      <span>编辑器模式</span>:
      <vSelect v-model="result.editor_mode_selected" :options="result.editor_modes"></vSelect>
    </div>
    <div id="editor">
      <editor v-model="content"
              @init="editorInit"
              lang="sql"
              theme="twilight"
              width="100%"
              height="300px"
              :options="editor_options"
      ></editor>
      <div>
        <button v-on:click="submitRunSQL" class="btn btn-run waves-effect">运行</button>
        <button v-on:click="cancelJob" class="btn btn-cancel waves-effect">取消</button>
      </div>
      <vloading v-if="result.loading"></vloading>
    </div>

    <div id="show_result">
      <editor v-if="result.msg != ''" v-model="result.msg"
              lang="text"
              width="100%"
              height="100px"
      ></editor>
      <vtable v-if="result.tableData.length>0" :table-data="result.tableData" :columns="result.columns"></vtable>
    </div>
  </div>


</template>

<script>

  import VTable from './Table'
  import Loading from './Loading'
  import vSelect from 'vue-select'
  import MLSQLKeywords from './MLSQLKeywords'
  import MLSQLEditorHolder from './MLSQLEditorHolder'
  import MLSQLTemplate from './MLSQLTemplate'

  const uuidv4 = require('uuid/v4');

  export default {
    name: 'Query',
    data() {
      return {
        msg: 'MLSQL is cool',
        content: "select 1 as a,'jack' as b as bbc;",
        editor_options: {
          enableBasicAutocompletion: true,
          enableSnippets: true,
          enableLiveAutocompletion: true
        },
        resource: {
          job_url: "/run/script",
          kill_job_url: "/killjob"
        },
        holder: {},
        result: {
          columns: [],
          // result set
          tableData: [],
          msg: "",
          loading: false,
          editor_modes: [
            {
              id: 0, label: "normal"
            },
            {
              id: 1, label: "vim"
            }
          ],
          editor_mode_selected: {
            id: 0, label: "normal"
          }
        }


      }
    },
    methods: {
      editorInit: function () {
        require('brace/ext/language_tools')
        require('brace/mode/sql')
        require('brace/theme/twilight')
        const self = this
        this.holder = new MLSQLEditorHolder(self)
        new MLSQLKeywords(this.holder).register()
        new MLSQLTemplate(this.holder).register()

      },
      submitRunSQL: function (event) {

        const resource = this.resource.job_url
        const options = {
          emulateJSON: true
        }
        const self = this
        self.jobName = uuidv4()
        self.result.loading = true

        let selectContent = self.holder.tool().selection()
        let final_sql = self.content
        if (selectContent != '') {
          final_sql = selectContent
        }
        self.$http.post(resource,
          {
            "sql": final_sql,
            "owner": "admin",
            "jobName": self.jobName
          }, options).then(ok => {
          self.result.loading = false
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

          self.result.columns = keys;
          // use keys to get column
          self.result.tableData = []
          data.forEach(function (item) {
            let new_item = {}
            keys.forEach(function (key) {
              new_item[key] = item[key]
            })
            self.result.tableData.push(new_item)
          })


        }, notok => {
          self.result.loading = false
          self.result.msg = notok.bodyText
        })
      },
      cancelJob: function (event) {
        const resource = this.resource.kill_job_url
        const options = {
          emulateJSON: true
        }
        const self = this
        self.$http.post(resource, {jobName: self.jobName}, options).then(ok => {
          self.result.loading = false
          self.result.msg = "the job is aborded success"
        }, notok => {
          self.result.loading = false
        })
      }
    },

    components: {
      'editor': require('vue2-ace-editor'),
      'vtable': VTable,
      "vloading": Loading,
      'vSelect': vSelect
    }

  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  h1, h2 {
    font-weight: normal;
  }

  .query_box {
    margin: 10px 10px 10px 10px;
    width: 100%;
    height: 100%;
  }

  #editor {
    width: 100%;
  }

  #show_result {
    width: 100%;
    margin-top: 30px;
  }

  .btn {
    -webkit-box-shadow: 0 2px 5px 0 rgba(0, 0, 0, .16), 0 2px 10px 0 rgba(0, 0, 0, .12);
    box-shadow: 0 2px 5px 0 rgba(0, 0, 0, .16), 0 2px 10px 0 rgba(0, 0, 0, .12);
    padding: .42rem 1.07rem;
    font-size: .81rem;
    -webkit-transition: color .15s ease-in-out, background-color .15s ease-in-out, border-color .15s ease-in-out, -webkit-box-shadow .15s ease-in-out;
    transition: color .15s ease-in-out, background-color .15s ease-in-out, border-color .15s ease-in-out, -webkit-box-shadow .15s ease-in-out;
    -o-transition: color .15s ease-in-out, background-color .15s ease-in-out, border-color .15s ease-in-out, box-shadow .15s ease-in-out;
    transition: color .15s ease-in-out, background-color .15s ease-in-out, border-color .15s ease-in-out, box-shadow .15s ease-in-out;
    transition: color .15s ease-in-out, background-color .15s ease-in-out, border-color .15s ease-in-out, box-shadow .15s ease-in-out, -webkit-box-shadow .15s ease-in-out;
    margin: .175rem;
    border: 0;
    -webkit-border-radius: .125rem;
    border-radius: .125rem;
    cursor: pointer;
    text-transform: uppercase;
    white-space: normal;
    word-wrap: break-word;
    color: #fff;
  }

  .btn-run {
    background-color: #00c851 !important;
    color: black !important;
  }

  .btn-cancel {
    background-color: bisque !important;
    color: black !important;
  }

  .waves-effect {
    position: relative;
    cursor: pointer;
    overflow: hidden;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
    z-index: 1;
  }

  .editor_mode_select {
    width: 400px;
    display: none;
  }

</style>
