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
      <!-- <el-button class="filter-item" style="margin-left: 10px;" type="primary" @click="handleCreate">
        {{ $t('table.recharge.rechargeInfo') }}
      </el-button> -->

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

      <!-- 获佣人姓名 -->
      <el-table-column :label="$t('table.mounthy.name')" align="center" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>

      <!-- 结算名称 -->
      <el-table-column :label="$t('table.mounthy.mounthyName')" align="center" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.mounthyName }}</span>
        </template>
      </el-table-column>

      <!-- 获佣人ID -->
      <el-table-column :label="$t('table.mounthy.brokerageId')" align="center" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.brokerageId }}</span>
        </template>
      </el-table-column>

      <!-- 状态 -->
      <el-table-column :label="$t('table.mounthy.status')" align="center" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.status }}</span>
        </template>
      </el-table-column>

      <!-- 结算开始时间 -->
      <el-table-column :label="$t('table.mounthy.startTime')" align="center" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.startTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>

      <!-- 结算结束时间 -->
      <el-table-column :label="$t('table.mounthy.endTime')" align="center" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.endTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('table.actions')" align="center" width="250" class-name="small-padding fixed-width">
        <template slot-scope="{row}">

          <el-button type="primary" size="small" @click="handleUpdate(row.id)">
            {{ $t('table.details') }}
          </el-button>
          <!-- <el-button size="mini" type="danger" @click="handleDelete(row.id)">
            {{ $t('table.recharge.reject') }}
          </el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
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

        <!-- 获佣人姓名 -->
        <el-table-column :label="$t('table.mounthy.name')" align="center" width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>

        <!-- 结算名称 -->
        <el-table-column :label="$t('table.mounthy.mounthyName')" align="center" width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.mounthyName }}</span>
          </template>
        </el-table-column>

        <!-- 获佣人ID -->
        <el-table-column :label="$t('table.mounthy.brokerageId')" align="center" width="200">
          <template slot-scope="scope">
            <span>{{ scope.row.brokerageId }}</span>
          </template>
        </el-table-column>

        <!-- 级别 -->
        <el-table-column :label="$t('table.mounthy.leave')" align="center" width="200">
          <template slot-scope="scope">
            <span>{{ scope.row.leave }}</span>
          </template>
        </el-table-column>

        <!-- 获佣人类型 -->
        <el-table-column :label="$t('table.mounthy.rokerageType')" align="center" width="200">
          <template slot-scope="scope">
            <span>{{ scope.row.rokerageType }}</span>
          </template>
        </el-table-column>

        <!-- 提供总金额 -->
        <el-table-column :label="$t('table.mounthy.broker_money')" align="center" width="200">
          <template slot-scope="scope">
            <span>{{ scope.row.broker_money }}</span>
          </template>
        </el-table-column>

        <!-- 结算金额 -->
        <el-table-column :label="$t('table.mounthy.clearMoney')" align="center" width="200">
          <template slot-scope="scope">
            <span>{{ scope.row.clearMoney }}</span>
          </template>
        </el-table-column>

        <!-- 进佣开始时间 -->
        <el-table-column :label="$t('table.mounthy.clearTime')" align="center" width="200">
          <template slot-scope="scope">
            <span>{{ scope.row.clearTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
          </template>
        </el-table-column>

        <!-- 状态 -->
        <el-table-column :label="$t('table.mounthy.status')" align="center" width="200">
          <template slot-scope="scope">
            <span>{{ scope.row.status }}</span>
          </template>
        </el-table-column>

        <!-- 结算开始时间 -->
        <el-table-column :label="$t('table.mounthy.startTime')" align="center" width="150">
          <template slot-scope="scope">
            <span>{{ scope.row.startTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
          </template>
        </el-table-column>

        <!-- 结算结束时间 -->
        <el-table-column :label="$t('table.mounthy.endTime')" align="center" width="150">
          <template slot-scope="scope">
            <span>{{ scope.row.endTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

  </div>
</template>

<script>
// import { list, getAllMenuName, add, queryMenuByid, editMenu, delMenu } from '@/api/menu'
import { QueryInfo, list } from '@/api/mounthy'
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
      QueryInfo({ 'id': id }).then(res => {
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
