<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.account" :placeholder="$t('table.account')" style="width: 200px;" class="filter-item" />
      <el-input v-model="listQuery.phone" :placeholder="$t('table.phone')" style="width: 200px;" class="filter-item" />
      <el-select v-model="listQuery.status" :placeholder="$t('table.status')" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
      </el-select>
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
        {{ $t('table.add') }}
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
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.account')" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.account }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.name')" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.phone')" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.sex')" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.sex }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.createTime')" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.statusName')" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.statusName }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.deptName')" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.deptName }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.roleName')" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.roleName }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('table.actions')" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row.id)">
            {{ $t('table.edit') }}
          </el-button>
          <el-button v-if="row.status == 0" type="primary" size="mini" @click="handlefrost(row.id)">
            {{ $t('table.frost') }}
          </el-button>
          <el-button v-if="row.status == 1" type="primary" size="mini" @click="handleunfreeze(row.id)">
            {{ $t('table.unfreeze') }}
          </el-button>
          <el-button size="mini" type="danger" @click="handleDelete(row.id)">
            {{ $t('table.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <!-- 添加 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="80px" style="width: 100%;">
        <div style="display:flex;width:100%">
          <div style="width:50%">
            <el-form-item :label="$t('table.name')" prop="name">
              <el-input v-model="temp.name" />
            </el-form-item>
            <el-form-item :label="$t('table.account')" prop="account">
              <el-input v-model="temp.account" />
            </el-form-item>
            <el-form-item :label="$t('table.email')" prop="email">
              <el-input v-model="temp.email" />
            </el-form-item>
            <el-form-item :label="$t('table.sex')" prop="sex">
              <el-select v-model="temp.sex" placeholder="请选择">
                <el-option v-for="item in SexOptions" :key="item.key" :label="item.display_name" :value="item.key" />
              </el-select>
            </el-form-item>
          </div>
          <div style="width:50%;margin-left:10px">
            <el-form-item :label="$t('table.phone')" prop="phone">
              <el-input v-model="temp.phone" />
            </el-form-item>
            <el-form-item v-if="dialogStatus == 'create'" :label="$t('table.password')" prop="password">
              <el-input v-model="temp.password" />
            </el-form-item>

            <el-form-item :label="$t('table.deptName')" prop="deptId">
              <wlTreeSelect
                v-model="temp.deptId"
                :data="treeData"
                @change="hindleChanged"
              />
            </el-form-item>
            <el-form-item :label="$t('table.status')" prop="status">
              <el-switch
                v-model="temp.status"
                active-color="#13ce66"
                inactive-color="#ff4949"
                active-value="0"
                inactive-value="1"
              />
            </el-form-item>
          </div>
        </div>
        <el-form-item :label="$t('table.remark')">
          <el-input v-model="temp.remark" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="Please input" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          {{ $t('table.cancel') }}
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          {{ $t('table.confirm') }}
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel" />
        <el-table-column prop="pv" label="Pv" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">{{ $t('table.confirm') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { list, addUser, delUser, frostUser, unfreezeUser, queryUserByid, updateUser } from '@/api/user'
import { getDeptName } from '@/api/dept'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

const calendarTypeOptions = [
  { key: '1', display_name: '冻结' },
  { key: '0', display_name: '正常' }
]
const SexOptions = [
  { key: '1', display_name: '男' },
  { key: '2', display_name: '女' },
  { key: '3', display_name: '保密' }
]

export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        account: '',
        phone: '',
        status: '',
        beginTime: '',
        endTime: ''
      },
      calendarTypeOptions,
      SexOptions,
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        id: '',
        remark: '',
        account: '',
        password: '',
        name: '',
        phone: '',
        email: '',
        type: '',
        deptId: '',
        sex: '',
        status: '0'
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        name: [{ required: true, message: 'name is required', trigger: 'change' },
          { min: 3, max: 5, message: 'The length is between 3 and 5 characters', trigger: 'blur' }],
        password: [{ required: true, message: 'password is required', trigger: 'change' }],
        phone: [{ required: true, message: 'phone is required', trigger: 'change' }],
        deptId: [{ required: true, message: 'deptId is required', trigger: 'change' }],
        sex: [{ required: true, message: 'sex is required', trigger: 'change' }],
        email: [{ required: true, message: 'email is required', trigger: 'change' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur,change' }],
        account: [{ required: true, message: 'account is required', trigger: 'blur' }]
      },
      downloadLoading: false,
      treeData: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      list(this.listQuery).then(response => {
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
    resetTemp() {
      this.temp = {
        id: '',
        remark: '',
        account: '',
        password: '',
        name: '',
        phone: '',
        email: '',
        type: '',
        deptId: '',
        sex: '',
        status: '0'
      }
    },

    handleCreate() {
      this.getDeptName()
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 获取部门tree
    getDeptName() {
      getDeptName().then(res => {
        if (res.code == 200) {
          this.treeData = res.data
        }
      })
    },
    // 创建用户
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          addUser(this.temp).then(res => {
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
        }
      })
    },
    handleUpdate(id) {
      queryUserByid({ 'id': id }).then(res => {
        if (res.code === 200) {
          this.getDeptName()
          this.temp = Object.assign({}, res.data) // copy obj
          this.dialogStatus = 'update'
          this.dialogFormVisible = true
          this.$nextTick(() => {
            this.$refs['dataForm'].clearValidate()
          })
        }
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          updateUser(tempData).then(res => {
            if (res.code == 200) {
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: res.msg,
                type: 'success',
                duration: 2000
              })
              this.getList()
            }
          })
        }
      })
    },
    // 删除用户
    handleDelete(id) {
      delUser({ 'id': id }).then(res => {
        if (res.code == 200) {
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
    handlefrost(id) {
      frostUser({ 'id': id }).then(res => {
        if (res.code == 200) {
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
    handleunfreeze(id) {
      unfreezeUser({ 'id': id }).then(res => {
        if (res.code == 200) {
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
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}`
        ? 'ascending'
        : sort === `-${key}`
          ? 'descending'
          : ''
    },
    hindleChanged(val) {
      this.temp.deptId = val[0].id
    }
  }
}
</script>
