<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.menuName" :placeholder="$t('table.menu.menuName')" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <!-- <el-select v-model="listQuery.visible" :placeholder="$t('table.menu.visible')" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in visible" :key="item.key" :label="item.display_name" :value="item.key" />
      </el-select> -->
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        {{ $t('table.search') }}
      </el-button>

    </div>

    <el-table
      v-loading="listLoading"
      row-key="id"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      :tree-props="{children: 'children'}"
    >
      <!-- 序号 -->
      <el-table-column :label="$t('table.id')" prop="id" sortable="custom" align="center" width="80" :class-name="getSortClass('id')">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <!-- 客户姓名 -->
      <el-table-column :label="$t('table.feedback.uname')" align="center" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.uname }}</span>
        </template>
      </el-table-column>

      <!-- 手机 -->
      <el-table-column :label="$t('table.feedback.phone')" align="center" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.phone }}</span>
        </template>
      </el-table-column>

      <!-- 反馈内容 -->
      <el-table-column :label="$t('table.feedback.content')" align="center" width="500">
        <template slot-scope="scope">
          <span>{{ scope.row.content }}</span>
        </template>
      </el-table-column>

      <!-- 县/区 -->
      <el-table-column :label="$t('table.feedback.address')" align="center" width="232">
        <template slot-scope="scope">
          <span>{{ scope.row.address }}</span>
        </template>
      </el-table-column>

      <!-- 设备型号 -->
      <el-table-column :label="$t('table.feedback.ename')" align="center" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.ename }}</span>
        </template>
      </el-table-column>

      <!-- 反馈时间 -->
      <el-table-column :label="$t('table.feedback.create_time')" align="center" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.create_time | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('table.actions')" align="center" width="250" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <!-- <el-button type="primary" size="mini" @click="handleUpdate(row.id)">
            {{ $t('table.edit') }}
          </el-button> -->
          <el-button size="mini" type="danger" @click="handleDelete(row.id)">
            {{ $t('table.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="100px" style="width: 100%;">
        <div style="display:flex;width:100%">
          <div style="width:50%">
            <el-form-item :label="$t('table.people.nameCrab')" prop="name">
              <el-input v-model="temp.name" />
            </el-form-item>
            <el-form-item :label="$t('table.people.address ')" prop="address ">
              <el-input v-model="temp.address " />
            </el-form-item>
            <el-form-item :label="$t('table.people.sex ')" prop="sex ">
              <el-input v-model="temp.sex " />
            <!-- <el-form-item :label="$t('table.distributor.bindingwx')" prop="isbindingwx">
              <el-radio-group v-model="temp.isBind">
                <el-radio v-for="item in isbindingwx" :label="item.key">{{ item.display_name }}</el-radio>
              </el-radio-group>-->
            </el-form-item>

          </div>
          <div style="width:50%;margin-left:10px">
            <el-form-item :label="$t('table.people.phone')">
              <el-input v-model="temp.phone" />
            </el-form-item>
            <el-form-item :label="$t('table.people.age')" prop="age">
              <el-input v-model="temp.age" />
            </el-form-item>
            <el-form-item :label="$t('table.people.address')">
              <el-input v-model="temp.address" />
            </el-form-item>
            <!-- <el-form-item :label="$t('table.menu.visible')" prop="visible">
              <el-radio-group v-model="temp.visible">
                <el-radio v-for="item in visible" :label="item.key">{{ item.display_name }}</el-radio>
              </el-radio-group>
            </el-form-item> -->
            <!-- <el-form-item :label="$t('table.distributor.state')" prop="state">
              <el-input v-model="temp.status" />
            </el-form-item> -->

          </div>
        </div>
        <el-form-item v-if="dialogStatus != 'update'" :label="$t('table.remark')">
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
// import { list, getAllMenuName, add, queryMenuByid, editMenu, delMenu } from '@/api/menu'
import { delfeedback, list } from '@/api/feedback'
import Pagination from '@/components/Pagination'
const isbindingwx = [
  { key: '0', display_name: '否' },
  { key: '1', display_name: '是' }
]

const visible = [
  { key: '0', display_name: '启用' },
  { key: '1', display_name: '隐藏' }
]

export default {
  components: { Pagination },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        menuName: '',
        visible: '',
        page: 1,
        limit: 20
      },
      visible,
      isbindingwx,
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogFormVisible: false,
      rules: {
        name: [{ required: true, message: 'dealername is required', trigger: 'change' },
          { min: 3, max: 5, message: 'The length is between 3 and 5 characters', trigger: 'blur' }],
        province: [{ required: true, message: 'code is required', trigger: 'change' }],
        city: [{ required: true, message: 'num is required', trigger: 'change' }],
        isbind: [{ required: true, message: 'isbindingwx is required', trigger: 'change' }],
        county: [{ required: true, message: 'area is required', trigger: 'change' }],
        phone: [{ required: true, message: 'phone is required', trigger: 'change' }],
        waiterPhone: [{ required: true, message: 'service is required', trigger: 'change' }]
      },
      temp: {
        name: '',
        address: '',
        phone: '',
        sex: '',
        stname: ''
      },
      dialogStatus: '',
      treeData: null
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      list(this.listQuery).then(res => {
        if (res.code === 200) {
          console.log(res)
          this.list = res.rows
          this.total = res.total
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 1000)
        }
      })
    },
    // 获取菜单tree
    getAllMenuName() {
      getAllMenuName().then(res => {
        if (res.code === 200) {
          this.treeData = res.data
        }
      })
    },
    resetTemp() {
      this.temp = {
        name: '',
        address: '',
        phone: '',
        sex: '',
        stname: ''
      }
    },

    // 搜索
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    // 注销
    handleCance(id) {
      issue({ 'id': id }).then(res => {
        if (res.code === 200) {
          this.getList()
        }
      })
    },
    // 冻结
    handleReco(id) {
      pause({ 'id': id }).then(res => {
        if (res.code === 200) {
          this.getList()
        }
      })
    },
    // 添加
    handleCreate() {
      // this.getList()
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
      queryName(this.temp).then(res => {
        if (res.code === 200) {
          for (var i = 0; i < res.data.length; i++) {
            var a = res.data[i].name
          }
          console.log(a)
        }
      })
    },
    // 添加确认按钮
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          add(this.temp).then(res => {
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
    // 编辑
    handleUpdate(id) {
      queryById({ 'id': id }).then(res => {
        if (res.code === 200) {
          this.getList()
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
          editStation(tempData).then(res => {
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
    handleDelete(id) {
      delfeedback({ 'id': id }).then(res => {
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
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}`
        ? 'ascending'
        : sort === `-${key}`
          ? 'descending'
          : ''
    },
    hindleChanged(val) {
      this.temp.pcode = val[0].code
    }
  }
}
</script>

<style>
.el-form-item__label {
  width:110px;
}
/* .el-form-item__label */
</style>
