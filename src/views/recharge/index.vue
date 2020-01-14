<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.uname" :placeholder="$t('table.menu.menuName')" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilters" />
      <!-- <el-select v-model="listQuery.visible" :placeholder="$t('table.menu.visible')" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in visible" :key="item.key" :label="item.display_name" :value="item.key" />
      </el-select> -->
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        {{ $t('table.search') }}
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" @click="handleCreate">
        {{ $t('table.recharge.rechargeInfo') }}
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

      <!-- 用户名称 -->
      <el-table-column :label="$t('table.recharge.uname')" align="center" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.uname }}</span>
        </template>
      </el-table-column>

      <!-- 手机 -->
      <el-table-column :label="$t('table.recharge.phone')" align="center" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.phone }}</span>
        </template>
      </el-table-column>

      <!-- 充值金额 -->
      <el-table-column :label="$t('table.recharge.money')" align="center" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.money }}</span>
        </template>
      </el-table-column>

      <!-- 充值量 -->
      <el-table-column :label="$t('table.recharge.revalue')" align="center" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.revalue }}</span>
        </template>
      </el-table-column>

      <!-- 设备id -->
      <el-table-column :label="$t('table.recharge.unitId')" align="center" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.unitId }}</span>
        </template>
      </el-table-column>

      <!-- 用户id -->
      <el-table-column :label="$t('table.recharge.userId')" align="center" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.userId }}</span>
        </template>
      </el-table-column>

      <!-- 充值时间 -->
      <el-table-column :label="$t('table.recharge.createTime')" align="center" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>

      <!-- 时长-->
      <el-table-column :label="$t('table.recharge.times')" align="center" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.times }}</span>
        </template>
      </el-table-column>

      <!-- 型号 -->
      <el-table-column :label="$t('table.recharge.ename')" align="center" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.ename }}</span>
        </template>
      </el-table-column>

      <!-- 订单类型 -->
      <el-table-column :label="$t('table.recharge.orderType')" align="center" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.orderType }}</span>
        </template>
      </el-table-column>

      <!-- 套餐名称 -->
      <el-table-column :label="$t('table.recharge.pname')" align="center" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.pname }}</span>
        </template>
      </el-table-column>

      <!-- 驳回理由 -->
      <el-table-column :label="$t('table.recharge.rejects')" align="center" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.rejects }}</span>
        </template>
      </el-table-column>

      <!-- 状态 -->
      <el-table-column :label="$t('table.recharge.status')" align="center" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.status }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('table.actions')" align="center" width="250" class-name="small-padding fixed-width">
        <template slot-scope="{row}">

          <el-button v-if="row.status === '驳回'" class="filter-item" style="margin-left: 10px;" type="small" @click="handleCance(row.id)">
            <svg-icon icon-class="cancellation" />
            {{ $t('table.recharge.agree') }}
          </el-button>
          <el-button v-if="row.status === '审批通过'" class="filter-item" style="margin-left: 10px;" type="small" @click="handleReco(row.id)">
            <svg-icon icon-class="recovery" />
            {{ $t('table.recharge.reject') }}
          </el-button>

          <!-- <el-button type="primary" size="mini" @click="handleUpdate(row.id)">
            {{ $t('table.recharge.agree') }}
          </el-button>
          <el-button size="mini" type="danger" @click="handleDelete(row.id)">
            {{ $t('table.recharge.reject') }}
          </el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="100px" style="width: 100%;">

        <el-input v-model="listQuery.unitId" :placeholder="$t('table.recharge.unitId')" style="width: 200px;margin-bottom:20px" class="filter-item" @keyup.enter.native="handleFilters" />
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilters">
          {{ $t('table.search') }}
        </el-button>
        <div v-if="hiden">
          <el-form-item :label="$t('table.recharge.unitId')">
            <el-input v-model="listQuery.unitId" />
          </el-form-item>

          <el-form-item :label="$t('table.recharge.address')">
            <el-input v-model="listQuery.address" />
          </el-form-item>
          <el-form-item :label="$t('table.recharge.uname')">
            <el-input v-model="listQuery.name" />
          </el-form-item>
          <el-form-item :label="$t('table.recharge.phone')">
            <el-input v-model="listQuery.phone" />
          </el-form-item>

          <el-form-item :label="$t('table.recharge.money')">
            <el-input v-model="temp.money" />
          </el-form-item>
          <el-form-item :label="$t('table.recharge.revalue ')">
            <el-input v-model="temp.revalue " />
          </el-form-item>

          <el-form-item :label="$t('table.recharge.userId ')">
            <el-input v-model="temp.userId" />
          </el-form-item>
          <el-form-item v-if="dialogStatus != 'update'" :label="$t('table.remark')">
            <el-input v-model="temp.remark" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="Please input" />
          </el-form-item>
        </div>

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
import { agree, getUseInfo, rechargeInfo, list, reject } from '@/api/recharge'
import Pagination from '@/components/Pagination'
const sex = [
  { key: '0', display_name: '女' },
  { key: '1', display_name: '男' }
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
        unitId: '',
        menuName: '',
        visible: '',
        name: '',
        address: '',
        phone: '',
        userId: '',
        page: 1

      },
      visible,
      sex,
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
        sex: [{ required: true, message: 'sex is required', trigger: 'change' }],
        county: [{ required: true, message: 'area is required', trigger: 'change' }],
        phone: [{ required: true, message: 'phone is required', trigger: 'change' }],
        waiterPhone: [{ required: true, message: 'service is required', trigger: 'change' }]
      },
      temp: {
        money: '',
        revalue: '',
        unitId: '',
        userId: ''
      },
      dialogStatus: '',
      hiden: '',
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
    // getAllMenuName() {
    //   getAllMenuName().then(res => {
    //     if (res.code === 200) {
    //       this.treeData = res.data
    //     }
    //   })
    // },
    resetTemp() {
      this.temp = {
        money: '',
        revalue: '',
        unitId: '',
        userId: ''
      }
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    // 搜索
    handleFilters() {
    //   this.listQuery.page = 1
    //   this.getList()

      getUseInfo({ 'unitId': this.listQuery.unitId }).then(res => {
      // console.log(this.listQuery)
        if (res.code === 200) {
          console.log(res)
          this.listQuery = res.data
          console.log(this.listQuery)
          this.resetTemp()
          this.hiden = 'update'
        }
      })
    },
    // 审批通过
    handleCance(id) {
      agree({ 'id': id }).then(res => {
        if (res.code === 200) {
          this.getList()
        }
      })
    },
    // 驳回
    handleReco(id) {
      reject({ 'id': id }).then(res => {
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
    },
    // 添加确认按钮
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          rechargeInfo(this.temp).then(res => {
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
    // 查看详情
    handleUpdate(id) {
      agree({ 'id': id }).then(res => {
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
      reject({ 'id': id }).then(res => {
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
      console.log(val[0].id)
      this.temp.stationId = val[0].id
      console.log(this.temp.stationId)
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
