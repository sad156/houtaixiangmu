<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.deptName" :placeholder="$t('table.dept.deptName')" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.status" :placeholder="$t('table.dept.status')" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in deptStatus" :key="item.key" :label="item.display_name" :value="item.key" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        {{ $t('table.search') }}
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        {{ $t('table.add') }}
      </el-button>
    </div>

    <el-table
      v-loading="listLoading"
      row-key="deptId"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      :tree-props="{children: 'children'}"
    >
      <el-table-column :label="$t('table.id')" prop="id" sortable="custom" align="center" width="80" :class-name="getSortClass('id')">
        <template slot-scope="scope">
          <span>{{ scope.row.deptId }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.dept.deptName')" align="center" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.deptName }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.dept.num')" align="center" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.num }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.dept.status')" align="center" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.status }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.dept.createTime')" align="center" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.actions')" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row.deptId)">
            {{ $t('table.edit') }}
          </el-button>
          <el-button size="mini" type="danger" @click="handleDelete(row.deptId)">
            {{ $t('table.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="80px" style="width: 50%;">
        <el-form-item :label="$t('table.dept.parentId')" prop="parentId">
          <wlTreeSelect
            v-model="temp.parentId"
            :data="treeData"
            default-select
            @change="hindleChanged"
          />
        </el-form-item>
        <el-form-item :label="$t('table.dept.deptName')" prop="deptName">
          <el-input v-model="temp.deptName" />
        </el-form-item>
        <el-form-item :label="$t('table.dept.num')" prop="num">
          <el-input v-model="temp.num" />
        </el-form-item>
        <el-form-item :label="$t('table.dept.leader')" prop="leader">
          <el-input v-model="temp.leader" />
        </el-form-item>
        <el-form-item :label="$t('table.dept.phone')" prop="phone">
          <el-input v-model="temp.phone" />
        </el-form-item>
        <el-form-item :label="$t('table.dept.email')" prop="email">
          <el-input v-model="temp.email" />
        </el-form-item>
        <el-form-item :label="$t('table.dept.status')" prop="status">
          <el-switch
            v-model="temp.status"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-value="0"
            inactive-value="1"
          />
        </el-form-item>
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
  </div>
</template>

<script>
import { list, getDeptName, addDept, queryDeptByid, editDept, delDeptByid } from '@/api/dept'
import Pagination from '@/components/Pagination'

const deptStatus = [
  { key: '0', display_name: '正常' },
  { key: '1', display_name: '冻结' }
]
export default {
  components: { Pagination },
  data() {
    return {
      deptStatus,
      total: 0,
      list: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        deptName: '',
        status: ''
      },
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogFormVisible: false,
      dialogStatus: '',
      treeData: [],
      temp: {
        parentId: '',
        deptName: '',
        num: '',
        leader: '',
        phone: '',
        status: '0',
        remark: '',
        email: ''
      },
      rules: {
        parentId: [{ required: true, message: '上级部门未选择', trigger: 'change' }],
        deptName: [{ required: true, message: '部门名称不能为空', trigger: 'change' }],
        leader: [{ required: true, message: '负责人不能为空', trigger: 'change' }]
      }
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
        parentId: '',
        deptName: '',
        num: '',
        leader: '',
        phone: '',
        status: '0',
        email: ''
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
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          addDept(this.temp).then(res => {
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
      queryDeptByid({ 'id': id }).then(res => {
        this.getDeptName()
        this.temp = Object.assign({}, res.data) // copy obj
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          editDept(this.temp).then(res => {
            if (res.code === 200) {
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
    handleDelete(id){
      delDeptByid({ 'id': id }).then(res => {
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
    // 获取部门tree
    getDeptName() {
      getDeptName().then(res => {
        if (res.code === 200) {
          this.treeData = res.data
        }
      })
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
      this.temp.parentId = val[0].id
    }
  }
}
</script>

<style>
</style>
