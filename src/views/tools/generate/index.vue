<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.tableName" :placeholder="$t('table.gen.tableName')" style="width: 200px;" class="filter-item" />
      <el-input v-model="listQuery.tableComment" :placeholder="$t('table.gen.tableComment')" style="width: 200px;" class="filter-item" />
      <el-date-picker
        v-model="listQuery.beginTime"
        type="datetime"
        :placeholder="$t('table.beginTime')"
        placeholder="开始时间"
        style="width: 200px;"
        class="filter-item"
      />
      <el-date-picker
        v-model="listQuery.endTime"
        type="datetime"
        :placeholder="$t('table.endTime')"
        placeholder="结束时间"
        style="width: 200px;"
        class="filter-item"
      />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        {{ $t('table.search') }}
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        {{ $t('table.gen.impor') }}
      </el-button>
    </div>
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column :label="$t('table.id')" prop="id" sortable="custom" align="center" width="80" :class-name="getSortClass('id')">
        <template slot-scope="scope">
          <span>{{ scope.row.tableId }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.gen.tableName')" align="center" width="350">
        <template slot-scope="scope">
          <span>{{ scope.row.tableName }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.gen.tableComment')" align="center" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.tableComment }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.gen.className')" align="center" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.className }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.gen.createTime')" align="center" width="150">
        <template slot-scope="scope">
          <span>{{ formatTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.gen.updateTime')" align="center" width="150">
        <template slot-scope="scope">
          <span>{{ formatTime(scope.row.updateTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.actions')" align="center" width="350" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button size="small" @click="handlePreviewTable(row.tableId)">
            {{ $t('table.gen.preview') }}
          </el-button>
          <el-button size="small" @click="handleGenTable(row.tableName)">
            {{ $t('table.gen.GenTable') }}
          </el-button>
          <el-button type="primary" size="small" @click="handleUpdate(row.tableId)">
            {{ $t('table.edit') }}
          </el-button>
          <el-button size="small" type="danger" @click="handleDelete(row.tableId)">
            {{ $t('table.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog title="导入表结构" :visible.sync="dialogFormVisible">
      <div class="filter-container">
        <el-input v-model="TableQuery.tableName" :placeholder="$t('table.gen.tableName')" style="width: 200px;" class="filter-item" />
        <el-input v-model="TableQuery.tableComment" :placeholder="$t('table.gen.tableComment')" style="width: 200px;" class="filter-item" />
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
          {{ $t('table.search') }}
        </el-button>
      </div>

      <el-table
        :key="listKey"
        v-loading="tabLoading"
        :data="tab"
        border
        fit
        highlight-current-row
        style="width: 100%;"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="55"
        />
        <el-table-column :label="$t('table.gen.tableName')" align="center" width="150">
          <template slot-scope="scope">
            <span>{{ scope.row.tableName }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('table.gen.tableComment')" align="center" width="150">
          <template slot-scope="scope">
            <span>{{ scope.row.tableComment }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('table.gen.createTime')" align="center" width="150">
          <template slot-scope="scope">
            <span>{{ formatTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('table.gen.updateTime')" align="center" width="150">
          <template slot-scope="scope">
            <span>{{ formatTime(scope.row.updateTime) }}</span>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="tabtotal>0" :total="tabtotal" :page.sync="TableQuery.page" :limit.sync="TableQuery.limit" @pagination="getdbList" />
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          {{ $t('table.cancel') }}
        </el-button>
        <el-button type="primary" @click="createData()">
          {{ $t('table.confirm') }}
        </el-button>
      </div>
    </el-dialog>

    <!-- 代码预览 -->
    <el-dialog title="代码预览" :visible.sync="previewVisible">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane v-for="item in items" :label="item.title" :name="item.title"><pre>{{ unescape(item.content) }}</pre></el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>

<script>
import { getList, delTab, getdbList, importTable, preview,genCode } from '@/api/gen'
import Pagination from '@/components/Pagination'
import { parseTime } from '@/utils'

export default {
  components: { Pagination },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      dialogFormVisible: false,
      listQuery: {
        page: 1,
        limit: 20,
        tableName: '',
        tableComment: '',
        beginTime: '',
        endTime: ''
      },
      listKey: 0,
      tabLoading: true,
      tab: null,
      tabtotal: 0,
      TableQuery: {
        page: 1,
        limit: 20,
        tableName: '',
        tableComment: ''
      },
      selectTable: [],
      previewVisible: false,
      items: null
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getList(this.listQuery).then(response => {
        this.list = response.rows
        this.total = response.total

        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleCreate() {
      this.getdbList()
      this.dialogFormVisible = true
    },
    getdbList() {
      getdbList(this.TableQuery).then(res => {
        console.log(res)
        this.tab = res.rows
        this.tabtotal = res.total
        setTimeout(() => {
          this.tabLoading = false
        }, 1.5 * 1000)
      })
    },
    createData() {
      importTable({ 'tables': this.selectTable }).then(res => {
        if (res.code === 200) {
          this.getList()
          this.dialogFormVisible = false
          this.$notify({
            title: '成功',
            message: '创建成功',
            type: 'success',
            duration: 2000
          })
        }
      })
    },
    handlePreviewTable(id) {
      this.previewVisible = true
      preview({ 'id': id }).then(res => {
        if (res.data) {
          var items = []
          $.each(res.data, (index, value) => {
            var templateName = index.substring(index.lastIndexOf('/') + 1, index.length).replace(/\.vm/g, '')
            items.push({
            	title: templateName,
              content: value
            })
          })
          this.items = items
        }
      })
    },
    handleGenTable(tableName) {
      location.href = "http://127.0.0.1:8070/tool/gen/genCode?tableName=" + tableName;
    },
    handleUpdate(id) {},
    handleDelete(id) {
      delTab({ 'id': id }).then(res => {
        if (res.code === 200) {
          this.$notify({
            title: '成功',
            message: res.msg,
            type: 'success',
            duration: 2000
          })
          this.getList()
        }
      })
    },
    formatTime(date) {
      if (date == null) {
        return ''
      } else {
        return parseTime(date, '{y}-{m}-{d} {h}:{i}')
      }
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}`
        ? 'ascending'
        : sort === `-${key}`
          ? 'descending'
          : ''
    },
    handleSelectionChange(val) {
      for (var i = 0; i < val.length; i++) {
        if (this.checkTable(val[i].tableName)) {
          this.selectTable.push(val[i].tableName)
        }
      }
    },
    checkTable(va) {
      for (var i = 0; i < this.selectTable.length; i++) {
        if (this.selectTable[i] === va) {
          return false
        }
      }
      return true
    },
    unescape(html) {
      return html
      .replace(html ? /&(?!#?\w+;)/g : /&/g, '&amp;')
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, "\"")
      .replace(/&#39;/g, "\'");
    }
  }
}
</script>
	pre {
    display: block;
    padding: 9.5px;
    margin: 0 0 10px;
    font-size: 13px;
    line-height: 1.42857143;
    color: #333;
    word-break: break-all;
    word-wrap: break-word;
    background-color:#f5f5f5;
    border: 1px solid #ccc;
    border-radius: 4px;
}
<style>

</style>
